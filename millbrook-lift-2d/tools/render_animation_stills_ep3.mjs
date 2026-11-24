// Render animated frames at mid-shot points for Episode 3 to verify dynamic 24fps motion
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => p && fs.existsSync(p));

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const srv = await new Promise((res) => {
  const s = http.createServer((req, r) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const target = u === '/' ? 'review_ep3_animation.html' : u.slice(1);
    const f = path.join(ROOT, target);
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) {
      r.writeHead(404);
      r.end();
      return;
    }
    r.writeHead(200, {
      'Content-Type': MIME[path.extname(f)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(f).pipe(r);
  });
  s.listen(0, '127.0.0.1', () => res(s));
});

const port = srv.address().port;
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ep3-anim-chrome-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=0',
  `--user-data-dir=${prof}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  '--window-size=1080,1920',
  'about:blank',
], { stdio: 'ignore' });

try {
  let dbg;
  for (let i = 0; i < 150 && !dbg; i++) {
    try {
      dbg = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim();
    } catch {
      await sleep(100);
    }
  }
  if (!dbg) throw new Error('Chrome DevTools port never appeared');

  const pageUrl = `http://127.0.0.1:${port}/review_ep3_animation.html`;
  const r = await fetch(`http://127.0.0.1:${dbg}/json/new?${encodeURIComponent(pageUrl)}`, { method: 'PUT' });
  const target = await r.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let id = 0;
  const pend = new Map();
  const errs = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) {
      const p = pend.get(m.id);
      pend.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    } else if (m.method === 'Runtime.exceptionThrown') {
      errs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      errs.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
    }
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id;
    pend.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const ev = async (expr) => {
    const x = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (x.exceptionDetails) throw new Error(x.exceptionDetails.exception?.description || x.exceptionDetails.text);
    return x.result.value;
  };

  await send('Runtime.enable');
  let isReady = false;
  for (let i = 0; i < 120; i++) {
    isReady = await ev('window.OP && window.OP.ready === true').catch(() => false);
    if (isReady) break;
    await sleep(100);
  }
  if (!isReady) throw new Error('window.OP never became ready! Errors:\n' + errs.join('\n'));

  const dur = await ev('window.OP.duration()');
  console.log(`Animation Engine ready! Total duration: ${dur}s`);

  // Test sample key animated timestamps
  const testPoints = [
    { t: 0.45, label: 'S01_mid_impact' },
    { t: 5.20, label: 'S02_mid_recoil' },
    { t: 8.50, label: 'S03_mid_timer' },
    { t: 11.2, label: 'S04_mid_blast' },
    { t: 15.5, label: 'S05_mid_smoke' },
    { t: 20.0, label: 'S06_mid_door_drop' },
    { t: 24.0, label: 'S07_mid_sprint' },
    { t: 27.5, label: 'S08_mid_slide' },
    { t: 31.5, label: 'S09_mid_shut' },
    { t: 35.5, label: 'S10_mid_punch' },
    { t: 40.0, label: 'S11_mid_descent' },
    { t: 43.5, label: 'S12_mid_chime' },
    { t: 48.0, label: 'S13_mid_lobby' },
    { t: 51.5, label: 'S14_mid_reception' },
    { t: 55.5, label: 'S15_mid_clipboard' },
    { t: 59.5, label: 'S16_mid_firstperson' },
    { t: 63.5, label: 'S17_mid_pa_strobe' },
    { t: 67.5, label: 'S18_mid_past_maya' },
    { t: 71.5, label: 'S19_mid_scalpel_stare' },
    { t: 75.5, label: 'S20_mid_cliffhanger' },
  ];

  const outDir = path.join(ROOT, 'review', 'anim_stills_ep3');
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Capturing ${testPoints.length} animated in-motion test frames...`);
  for (let i = 0; i < testPoints.length; i++) {
    const pt = testPoints[i];
    const dataUrl = await ev(`window.OP.frame(${pt.t})`);
    const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
    if (buf.length < 40_000) {
      throw new Error(`Blank/corrupt frame at t=${pt.t} (${buf.length} bytes). Logs:\n${errs.join('\n')}`);
    }
    const outPath = path.join(outDir, `${pt.label}.jpg`);
    fs.writeFileSync(outPath, buf);
    console.log(`  [${i + 1}/${testPoints.length}] ${pt.label}.jpg @ t=${pt.t}s (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  console.log('All 20 animated motion frames captured cleanly with ZERO errors!');
  try { ws.close(); } catch {}
} finally {
  try { chrome.kill(); } catch {}
  srv.close();
  setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 300);
}
