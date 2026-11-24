// Complete Frame Capture & Video Compiler for Episode 4: "The Paradox Shattered" 24fps Animation
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FPS = +(process.env.FPS || 24);
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
const args = process.argv.slice(2);
const mode = args[0] || 'check'; // 'check', 'sheet', 'video'

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.otf': 'font/otf', '.ttf': 'font/ttf',
  '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.png': 'image/png', '.jpg': 'image/jpeg',
};

function serve(port = 0) {
  return new Promise((res) => {
    const srv = http.createServer((req, r) => {
      const u = decodeURIComponent(req.url.split('?')[0]);
      const target = u === '/' ? 'review_ep4_animation.html' : u.slice(1);
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
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ep4-video-chrome-'));
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

  const pageUrl = `http://127.0.0.1:${port}/review_ep4_animation.html?capture=1`;
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
    const st = await ev('window.OP ? window.OP.ready : false').catch(() => false);
    if (st === true) break;
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
const FRAME = (t, q = 0.9) => `window.OP.frame(${t}, ${q})`;

const srv = await serve(0);
const port = srv.address().port;
const P = await openPage(port);

try {
  const dur = await P.ev('OP.duration()');
  console.log(`Episode 4 Director Ready: Duration ${dur.toFixed(2)}s`);

  if (mode === 'check') {
    const shots = await P.ev('OP.shots()');
    console.log(`Verified ${shots.length} shots across timeline:`);
    shots.forEach((s) => console.log(`  ${s.id} [${s.at.toFixed(2)}s -> ${s.end.toFixed(2)}s] — ${s.note}`));
  } else if (mode === 'sheet') {
    const out = path.resolve(ROOT, 'review/sheet_ep4_animation.jpg');
    const cols = 5;
    const shots = await P.ev('OP.shots()');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ep4-sheet-'));
    console.log(`Generating animation contact sheet for ${shots.length} animated shots...`);

    for (let i = 0; i < shots.length; i++) {
      const midT = shots[i].at + (shots[i].end - shots[i].at) * 0.5;
      const b = jpg(await P.ev(FRAME(midT, 0.92)));
      fs.writeFileSync(path.join(tmp, `f${String(i).padStart(3, '0')}.jpg`), b);
    }
    const rows = Math.ceil(shots.length / cols);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const r = spawnSync(FFMPEG, [
      '-v', 'error', '-y', '-framerate', '1', '-i', path.join(tmp, 'f%03d.jpg'),
      '-vf', `scale=360:640,tile=${cols}x${rows}:padding=8:color=#0c0e14`,
      '-frames:v', '1', '-q:v', '2', out,
    ]);
    fs.rmSync(tmp, { recursive: true, force: true });
    if (r.status) throw new Error('FFmpeg tile error: ' + r.stderr);
    console.log(`Saved master animation sheet: ${out}`);
  } else if (mode === 'video') {
    const out = path.resolve(ROOT, 'renders/millbrook_lift_ep4_finale.mp4');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const fps = FPS;
    const n = Math.round(dur * fps);
    console.log(`Rendering Full Finale Cut (${dur.toFixed(1)}s, ${n} frames @ ${fps}fps)...`);

    // Check for optional audio file
    const possibleAudio = [
      path.join(ROOT, 'voice_ep4_master.wav'),
      path.join(ROOT, 'voice_ep4.mp3'),
      path.join(ROOT, '..', 'millbrook-lift-ep1', 'voice_ep4.mp3'),
    ].find((p) => fs.existsSync(p));

    const ffmpegArgs = [
      '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    ];

    if (possibleAudio) {
      console.log(`Attaching audio track from: ${possibleAudio}`);
      ffmpegArgs.push('-i', possibleAudio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest');
    } else {
      console.log(`No audio track found yet — generating silent stereo audio bed (AAC 192k) matching video duration...`);
      ffmpegArgs.push('-f', 'lavfi', '-i', `anullsrc=channel_layout=stereo:sample_rate=44100`, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-t', String(dur));
    }

    ffmpegArgs.push(
      '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '19',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', out
    );

    const ff = spawn(FFMPEG, ffmpegArgs, { stdio: ['pipe', 'inherit', 'inherit'] });

    const t0 = Date.now();
    for (let i = 0; i < n; i++) {
      const t = i / fps;
      const b = jpg(await P.ev(FRAME(t, 0.90)));
      if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once('drain', r));
      if (i % 120 === 0 || i === n - 1) {
        const pct = ((i / n) * 100).toFixed(0);
        const elapsed = (Date.now() - t0) / 1000;
        const fpsRate = (i / elapsed).toFixed(1);
        process.stdout.write(`\rRendering Frame ${i + 1}/${n} (${pct}%) @ ${fpsRate} fps...`);
      }
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
    console.log(`\nExported complete master video: ${out} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
} finally {
  P.close();
  srv.close();
}
