// Render 1080x1920 cover_page_ep2.png + JPG + Instagram 1:1 grid crop check via Chrome CPU Skia.
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
  'ffmpeg',
].find((p) => p && (p === 'ffmpeg' || fs.existsSync(p))) || 'ffmpeg';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.otf': 'font/otf', '.ttf': 'font/ttf' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const srv = await new Promise((res) => {
  const s = http.createServer((req, r) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u === '/' ? 'cover_ep2.html' : u.slice(1));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(f).pipe(r);
  });
  s.listen(0, '127.0.0.1', () => res(s));
});

const port = srv.address().port;
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'cover-chrome-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--remote-debugging-port=0',
  `--user-data-dir=${prof}`, '--no-first-run', '--no-default-browser-check',
  '--hide-scrollbars', '--window-size=1080,1920', 'about:blank',
], { stdio: 'ignore' });

try {
  let dbg;
  for (let i = 0; i < 150 && !dbg; i++) {
    try { dbg = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim(); } catch { await sleep(100); }
  }
  const r = await fetch(`http://127.0.0.1:${dbg}/json/new?${encodeURIComponent(`http://127.0.0.1:${port}/cover_ep2.html`)}`, { method: 'PUT' });
  const target = await r.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pend = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value;

  await send('Runtime.enable');
  for (let i = 0; i < 80; i++) {
    if (await ev('window.COVER_READY === true').catch(() => false)) break;
    await sleep(100);
  }
  const dataUrl = await ev(`document.getElementById('cv').toDataURL('image/png')`);
  const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
  const outPng = path.join(ROOT, 'renders', 'cover_page_ep2.png');
  const outJpg = path.join(ROOT, 'renders', 'cover_page_ep2.jpg');
  const outSq = path.join(ROOT, 'review', 'cover_grid_1x1_ep2_preview.jpg');
  fs.mkdirSync(path.dirname(outPng), { recursive: true });
  fs.mkdirSync(path.dirname(outSq), { recursive: true });
  fs.writeFileSync(outPng, buf);

  spawnSync(FFMPEG, ['-v', 'error', '-y', '-i', outPng, '-q:v', '2', outJpg], { stdio: 'inherit' });
  spawnSync(FFMPEG, ['-v', 'error', '-y', '-i', outPng, '-vf', 'crop=1080:1080:0:420', '-q:v', '2', outSq], { stdio: 'inherit' });
  console.log(`Rendered cover (${(buf.length / 1024).toFixed(0)} KB): ${outPng} & ${outJpg}`);
  console.log(`Rendered 1:1 Instagram grid preview: ${outSq}`);
  try { ws.close(); } catch {}
} finally {
  chrome.kill('SIGKILL');
  srv.close();
  setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 300);
}
