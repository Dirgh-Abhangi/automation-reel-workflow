// Master playback & frame capture entry point (`window.OP`) for 'The Free Lift' 2D Reel.
import { W, H, vignette, filmGrainOverlay } from './palette.js';
import { loadTiming } from './timing.js';
import { buildCaptions, captionList, drawCaptionAt } from './captions.js';
import { buildDirector } from './shots.js';

const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const playBtn = document.getElementById('play');
const qs = new URLSearchParams(location.search);
const isCapture = qs.has('capture');
const scriptName = qs.get('script') || 'script.json';
const dataDir = qs.get('data') || 'data';

let dir, script, totalDur = 0;

function activeShot(t) {
  for (let i = dir.shots.length - 1; i >= 0; i--) {
    if (t >= dir.shots[i].at) {
      const next = dir.shots[i + 1];
      const end = next ? next.at : totalDur;
      return { s: dir.shots[i], lt: t - dir.shots[i].at, d: end - dir.shots[i].at };
    }
  }
  const s = dir.shots[0];
  return { s, lt: t, d: (dir.shots[1]?.at ?? totalDur) };
}

function drawFrame(t) {
  t = Math.max(0, Math.min(t, totalDur));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#06080d';
  ctx.fillRect(0, 0, W, H);

  const { s, lt, d } = activeShot(t);
  const cam = s.cam ? s.cam(lt, d, t) : { x: W / 2, y: H / 2, zoom: 0 };
  const [sx, sy] = dir.shakeAt(t);
  const scale = 1 + (cam.zoom || 0);

  // World stage transform (camera push-in + impact tremor)
  ctx.save();
  ctx.translate(W / 2 + sx, H / 2 + sy);
  ctx.scale(scale, scale);
  ctx.translate(-(cam.x ?? W / 2), -(cam.y ?? H / 2));
  s.draw(ctx, lt, d, t);
  ctx.restore();

  // Subtle vignette & subtle comic print texture overlay
  vignette(ctx, s.id === 'S12' ? 0.42 : 0.56);
  filmGrainOverlay(ctx, 0.024);

  // Brief dark cut transition pulse (0.14s) + crimson horror impact flash!
  if (lt < 0.14 && s.id !== 'S01') {
    const a = (1 - lt / 0.14) * 0.45;
    ctx.fillStyle = `rgba(4, 6, 10, ${a})`;
    ctx.fillRect(0, 0, W, H);
  }
  const fl = dir.flashAt?.(t);
  if (fl) {
    ctx.save();
    ctx.globalAlpha = fl.alpha;
    ctx.fillStyle = fl.col;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // Screen-locked UI HUD + Captions (never bounce off-screen on camera push-ins!)
  if (s.hud) s.hud(ctx, lt, d, t);
  if (s.id !== 'S12') {
    drawCaptionAt(ctx, t, s.id === 'S06' ? 1620 : 1605, 82);
  }

  // Ending cliffhanger hard blackness snap in final 0.25s
  if (t > totalDur - 0.28) {
    const k = Math.min(1, (t - (totalDur - 0.28)) / 0.28);
    ctx.fillStyle = `rgba(0,0,0,${k})`;
    ctx.fillRect(0, 0, W, H);
  }
}

async function boot() {
  try {
    await document.fonts.ready;
    script = await (await fetch(scriptName, { cache: 'no-store' })).json();
    const timing = await loadTiming(dataDir);
    totalDur = timing.dur;
    buildCaptions(script);
    dir = buildDirector();

    drawFrame(0);
    window.OP = {
      ready: true,
      bootError: null,
      duration: () => totalDur,
      shots: () => dir.shots.map((s, i) => ({
        id: s.id,
        at: s.at,
        end: dir.shots[i + 1]?.at ?? totalDur,
        note: s.note,
      })),
      captions: () => captionList().map((c) => ({
        s: c.s,
        e: c.e,
        text: c.words.map((w) => (w.hi ? '*' : '') + w.txt).join(' '),
      })),
      cues: () => dir.cues,
      draw(t) { drawFrame(t); },
      frame(t, q = 0.92) {
        drawFrame(t);
        return cv.toDataURL('image/jpeg', q);
      },
    };

    if (!isCapture && playBtn) {
      playBtn.hidden = false;
      const audio = new Audio(`${dataDir}/mix.wav`);
      playBtn.onclick = () => {
        playBtn.hidden = true;
        audio.currentTime = 0;
        audio.play().catch(() => {});
        const tick = () => {
          drawFrame(audio.currentTime);
          if (!audio.ended && !audio.paused) requestAnimationFrame(tick);
          else playBtn.hidden = false;
        };
        requestAnimationFrame(tick);
      };
    }
  } catch (err) {
    console.error(err);
    window.OP = { ready: false, bootError: err.message };
  }
}

boot();

