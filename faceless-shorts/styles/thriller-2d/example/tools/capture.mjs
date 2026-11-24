// Deterministic 30fps CPU Skia capture script for 'millbrook-lift-2d' video, sheets & cues.
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FPS = +(process.env.FPS || 30);
const CHROME = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => p && fs.existsSync(p));
const FFMPEG = [
  process.env.FFMPEG,
  'z:/Mini Projects/Nirvana/Automation reel workflow/bin/ffmpeg.exe',
  'C:/Users/dirgh/AppData/Local/Microsoft/WindowsApps/ffmpeg.exe',
  'ffmpeg',
].find((p) => p && (p === 'ffmpeg' || fs.existsSync(p))) || 'ffmpeg';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rawArgs = process.argv.slice(2);
let DATA_DIR = 'data';
let SCRIPT_FILE = 'script.json';
const cleanArgs = [];
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--data' && rawArgs[i + 1]) { DATA_DIR = rawArgs[++i]; }
  else if (rawArgs[i] === '--script' && rawArgs[i + 1]) { SCRIPT_FILE = rawArgs[++i]; }
  else cleanArgs.push(rawArgs[i]);
}
const flags = new Set(cleanArgs.filter((a) => a.startsWith('--')));
const [mode, ...rest] = cleanArgs.filter((a) => !a.startsWith('--'));

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.otf': 'font/otf', '.ttf': 'font/ttf',
  '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.png': 'image/png', '.jpg': 'image/jpeg',
};

function serve(port = 0) {
  return new Promise((res) => {
    const srv = http.createServer((req, r) => {
      const u = decodeURIComponent(req.url.split('?')[0]);
      const target = u === '/' ? 'reel.html' : u.slice(1);
      const f = path.join(ROOT, target);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        r.writeHead(404);
        r.end();
        return;
      }
      r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(f).pipe(r);
    });
    srv.listen(port, '127.0.0.1', () => res(srv));
  });
}

async function openPage(port) {
  if (!CHROME) throw new Error('Google Chrome missing');
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'm2d-chrome-'));
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

  let dbg;
  for (let i = 0; i < 200 && !dbg; i++) {
    try { dbg = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim(); } catch { await sleep(100); }
  }
  if (!dbg) throw new Error('Chrome DevTools failed to start');

  const pageUrl = `http://127.0.0.1:${port}/index.html?capture=1&data=${encodeURIComponent(DATA_DIR)}&script=${encodeURIComponent(SCRIPT_FILE)}${process.env.QS || ''}`;
  const r = await fetch(`http://127.0.0.1:${dbg}/json/new?${encodeURIComponent(pageUrl)}`, { method: 'PUT' });
  const target = await r.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pend = new Map();
  const logs = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) {
      const p = pend.get(m.id);
      pend.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    } else if (m.method === 'Runtime.exceptionThrown') {
      logs.push('EXCEPTION ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      logs.push('ERROR ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
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
  for (let i = 0; i < 200; i++) {
    const st = await ev('window.OP ? (OP.bootError ? "ERR:" + OP.bootError : OP.ready) : false').catch(() => false);
    if (st === true) break;
    if (typeof st === 'string') throw new Error('Boot failed: ' + st + '\n' + logs.join('\n'));
    if (i === 199) throw new Error('Boot timeout\n' + logs.join('\n'));
    await sleep(100);
  }
  const close = () => {
    try { ws.close(); } catch {}
    chrome.kill('SIGKILL');
    setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 300);
  };
  return { ev, logs, close };
}

const jpg = (d) => Buffer.from(d.slice(d.indexOf(',') + 1), 'base64');
const FRAME = (t, q, label) => `(() => {
  const d = OP.frame(${t}, ${q});
  ${label ? `const cv = document.getElementById('cv'), c = cv.getContext('2d');
  c.setTransform(1,0,0,1,0,0); c.fillStyle='#000'; c.fillRect(0,0,220,76);
  c.fillStyle='#fff'; c.font='700 52px Inter,sans-serif'; c.textAlign='left'; c.textBaseline='alphabetic';
  c.fillText('${(+t).toFixed(2)}', 14, 56); return cv.toDataURL('image/jpeg', ${q});` : 'return d;'}
})()`;

const srv = await serve(mode === 'preview' ? 8766 : 0);
const port = srv.address().port;

if (mode === 'preview') {
  console.log(`Preview ready at http://127.0.0.1:${port}/index.html  (Keyframes: /keyframes.html • Cover: /cover.html)`);
} else {
  const P = await openPage(port);
  try {
    const dur = await P.ev('OP.duration()');
    if (mode === 'check') {
      console.log(`Duration: ${dur.toFixed(2)} s`);
      for (const s of await P.ev('OP.shots()')) {
        console.log(`  ${s.id.padEnd(4)} ${s.at.toFixed(2).padStart(6)} -> ${s.end.toFixed(2).padStart(6)} (${(s.end - s.at).toFixed(2)}s)  ${s.note}`);
      }
      let bad = 0;
      for (let t = 0; t < dur; t += 0.25) {
        try { await P.ev(`OP.draw(${t})`); } catch (e) { bad++; console.log(`ERR at ${t}: ${e.message}`); }
      }
      if (P.logs.length) console.log(P.logs.join('\n'));
      console.log(bad || P.logs.length ? 'CHECK FAILED' : 'CHECK OK');
    } else if (mode === 'cues') {
      const cues = await P.ev('OP.cues()');
      fs.mkdirSync(path.join(ROOT, DATA_DIR), { recursive: true });
      fs.writeFileSync(path.join(ROOT, DATA_DIR, 'cues.json'), JSON.stringify({ duration: dur, cues }, null, 1));
      console.log(`Saved ${DATA_DIR}/cues.json (${cues.length} cues, ${dur.toFixed(2)} s)`);
    } else if (mode === 'sheet') {
      const out = path.resolve(ROOT, rest[0] || 'review/sheet_all.jpg');
      const step = +(rest[1] || 1.5);
      const cols = +(rest[2] || 8);
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'm2d-sheet-'));
      let n = 0;
      for (let t = step / 2; t < dur; t += step) {
        const b = jpg(await P.ev(FRAME(t, 0.85, true)));
        if (b.length < 5000) throw new Error(`Empty frame at t=${t}`);
        fs.writeFileSync(path.join(tmp, `f${String(n++).padStart(4, '0')}.jpg`), b);
      }
      const rows = Math.ceil(n / cols);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const r = spawnSync(FFMPEG, [
        '-v', 'error', '-y', '-framerate', '1', '-i', path.join(tmp, 'f%04d.jpg'),
        '-vf', `scale=270:480,tile=${cols}x${rows}:padding=6:color=#0c0e14`, '-frames:v', '1', '-q:v', '2', out,
      ]);
      fs.rmSync(tmp, { recursive: true, force: true });
      if (r.status) throw new Error('FFmpeg sheet error: ' + r.stderr);
      console.log(`Saved contact sheet ${out} (${n} frames @ ${step}s step)`);
    } else if (mode === 'video') {
      const out = path.resolve(ROOT, rest[0] || 'renders/the_free_lift_ep1_2d.mp4');
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const mix = path.join(ROOT, DATA_DIR, 'mix.wav');
      const hasMix = fs.existsSync(mix);
      const a0 = rest[1] ? +rest[1] : 0;
      const a1 = rest[2] ? Math.min(+rest[2], dur) : dur;
      const n = Math.round((a1 - a0) * FPS);

      const ff = spawn(FFMPEG, [
        '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
        ...(hasMix ? ['-ss', String(a0), '-t', String(a1 - a0), '-i', mix] : ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo']),
        '-map', '0:v', '-map', '1:a',
        '-c:v', 'libx264', '-preset', flags.has('--draft') ? 'ultrafast' : 'medium', '-crf', flags.has('--draft') ? '24' : '17',
        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out,
      ], { stdio: ['pipe', 'inherit', 'inherit'] });

      const t0 = Date.now();
      for (let i = 0; i < n; i++) {
        const b = jpg(await P.ev(FRAME(a0 + i / FPS, flags.has('--draft') ? 0.85 : 0.94, false)));
        if (b.length < 5000) throw new Error(`Empty video frame at ${i}`);
        if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once('drain', r));
        if (i % 150 === 0 || i === n - 1) process.stdout.write(`\rRendering ${i + 1}/${n} frames...`);
      }
      ff.stdin.end();
      await new Promise((r) => ff.on('close', r));
      console.log(`\nDone: ${out} (${n} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    }
  } finally {
    P.close();
    srv.close();
  }
}

