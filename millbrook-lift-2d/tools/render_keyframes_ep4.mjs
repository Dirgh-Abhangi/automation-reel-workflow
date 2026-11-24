// Render 20 static 1080x1920 PNG keyframes & 5x4 master overview grid for Episode 4 Finale
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
    const f = path.join(ROOT, u === '/' ? 'review_ep4.html' : u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(f).pipe(r);
  });
  s.listen(0, '127.0.0.1', () => res(s));
});

const port = srv.address().port;
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'kf4-chrome-'));
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
  if (!dbg) throw new Error('DevToolsActivePort not found');

  const pageUrl = `http://127.0.0.1:${port}/review_ep4.html?capture=1`;
  const r = await fetch(`http://127.0.0.1:${dbg}/json/new?${encodeURIComponent(pageUrl)}`, { method: 'PUT' });
  const target = await r.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pend = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) {
      const p = pend.get(m.id);
      pend.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    }
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id;
    pend.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const ev = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res.result.value;
  };

  await send('Runtime.enable');

  for (let i = 0; i < 80; i++) {
    const ok = await ev('window.KF && window.KF.ready').catch(() => false);
    if (ok) break;
    await sleep(100);
  }

  const count = await ev('window.KF.count()');
  const meta = await ev('window.KF.meta()');
  console.log(`Episode 4 Finale: Found ${count} keyframes to render:`);

  const outDir = path.join(ROOT, 'review', 'keyframes_ep4');
  const brainDir = 'C:/Users/dirgh/.gemini/antigravity/brain/3890a11d-0e40-4f6d-abeb-87448015ecbc';
  fs.mkdirSync(outDir, { recursive: true });

  const tmpGrid = fs.mkdtempSync(path.join(os.tmpdir(), 'ep4-grid-'));

  for (let i = 0; i < count; i++) {
    const dataUrl = await ev(`window.KF.frame(${i})`);
    const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
    const filename = `${meta[i].id}.png`;
    const fullPath = path.join(outDir, filename);
    fs.writeFileSync(fullPath, buf);

    // Save temporary 360x640 thumbnail for the ffmpeg tile
    const thumbName = `thumb_${String(i).padStart(3, '0')}.jpg`;
    const thumbPath = path.join(tmpGrid, thumbName);
    spawnSync(FFMPEG, ['-v', 'error', '-y', '-i', fullPath, '-vf', 'scale=360:640', '-q:v', '2', thumbPath]);

    console.log(`  [${i + 1}/${count}] ${meta[i].id}: ${meta[i].title} -> ${(buf.length / 1024).toFixed(0)} KB`);
  }

  // Generate 5x4 Master Keyframe Contact Sheet
  const masterSheet = path.join(ROOT, 'review', 'sheet_ep4_keyframes.jpg');
  spawnSync(FFMPEG, [
    '-v', 'error', '-y',
    '-framerate', '1',
    '-i', path.join(tmpGrid, 'thumb_%03d.jpg'),
    '-vf', 'tile=5x4:padding=8:color=#0c0e14',
    '-frames:v', '1',
    '-q:v', '2',
    masterSheet
  ], { stdio: 'inherit' });

  // Copy sheet to Brain if exists
  try {
    if (fs.existsSync(brainDir)) {
      fs.copyFileSync(masterSheet, path.join(brainDir, 'sheet_ep4_keyframes.jpg'));
    }
  } catch {}

  console.log(`\nMaster Episode 4 Finale Keyframe Sheet generated at: ${masterSheet}`);

  try { ws.close(); } catch {}
} finally {
  chrome.kill('SIGKILL');
  srv.close();
  setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 300);
}
