// Render static 1080x1920 PNG keyframes & high-res 3x3 overview grid in headless Chrome.
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
const FFMPEG = [
  process.env.FFMPEG,
  'z:/Mini Projects/Nirvana/Automation reel workflow/bin/ffmpeg.exe',
  'C:/Users/dirgh/AppData/Local/Microsoft/WindowsApps/ffmpeg.exe',
  'ffmpeg',
].find((p) => p && (p === 'ffmpeg' || fs.existsSync(p))) || 'ffmpeg';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.otf': 'font/otf', '.ttf': 'font/ttf', '.png': 'image/png' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const srv = await new Promise((res) => {
  const s = http.createServer((req, r) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u === '/' ? 'keyframes.html' : u.slice(1));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(f).pipe(r);
  });
  s.listen(0, '127.0.0.1', () => res(s));
});

const port = srv.address().port;
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'kf-chrome-'));
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
    try { dbg = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim(); } catch { await sleep(100); }
  }
  if (!dbg) throw new Error('Chrome failed to start');

  const r = await fetch(`http://127.0.0.1:${dbg}/json/new?${encodeURIComponent(`http://127.0.0.1:${port}/keyframes.html?capture=1`)}`, { method: 'PUT' });
  const target = await r.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

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
      errs.push('EXCEPTION: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      errs.push('CONSOLE ERR: ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
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
    isReady = await ev('window.KF && window.KF.ready === true').catch(() => false);
    if (isReady) break;
    await sleep(100);
  }
  if (!isReady) throw new Error('window.KF never became ready! Errors:\n' + errs.join('\n'));

  const meta = await ev('window.KF.meta()');
  const outDir = path.join(ROOT, 'review', 'keyframes');
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < meta.length; i++) {
    const dataUrl = await ev(`window.KF.frame(${i})`);
    const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
    if (buf.length < 80_000) {
      throw new Error(`Blank/corrupt render on ${meta[i].id} (${buf.length} bytes). Logs:\n${errs.join('\n')}`);
    }
    const outPath = path.join(outDir, `${meta[i].id}.png`);
    fs.writeFileSync(outPath, buf);
    console.log(`Rendered ${meta[i].id}.png (${(buf.length / 1024).toFixed(0)} KB) — ${meta[i].title}`);
  }

  // Build crisp 4x3 overview poster (12 keyframes) via FFmpeg
  const gridPath = path.join(outDir, 'grid_all.jpg');
  const ff = spawnSync(FFMPEG, [
    '-v', 'error', '-y', '-framerate', '1',
    '-i', path.join(outDir, 'KF-%02d.png'),
    '-vf', 'scale=360:640,tile=4x3:padding=8:color=#0c0e14',
    '-frames:v', '1', '-q:v', '2', gridPath,
  ]);
  if (ff.status !== 0) throw new Error('FFmpeg tile error: ' + ff.stderr);
  console.log(`Saved overview grid: ${gridPath}`);
  try { ws.close(); } catch {}
} finally {
  chrome.kill('SIGKILL');
  srv.close();
  setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 300);
}
