// Master playback & frame capture entry point for Episode 2 YouTube Cut (171.86s / 02:51)
import { W, H, vignette, filmGrainOverlay } from './palette.js';
import { buildDirectorEp2Yt } from './shots_ep2_yt.js';

const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const playBtn = document.getElementById('play');

const dir = buildDirectorEp2Yt();
const totalDur = 171.86; // voice_master_yt_under3m.wav duration

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

  ctx.save();
  ctx.translate(W / 2 + sx, H / 2 + sy);
  ctx.scale(scale, scale);
  ctx.translate(-(cam.x ?? W / 2), -(cam.y ?? H / 2));
  s.draw(ctx, lt, d, t);
  ctx.restore();

  vignette(ctx, s.id === 'S13' ? 0.45 : 0.60);
  filmGrainOverlay(ctx, 0.022);

  if (lt < 0.14 && s.id !== 'S01') {
    const a = (1 - lt / 0.14) * 0.45;
    ctx.fillStyle = `rgba(4, 6, 10, ${a})`;
    ctx.fillRect(0, 0, W, H);
  }

  const fl = dir.flashAt?.(t);
  if (fl) {
    ctx.fillStyle = fl;
    ctx.fillRect(0, 0, W, H);
  }
}

window.OP = {
  ready: true,
  duration: () => totalDur,
  shots: () => dir.shots.map((s, i) => ({
    id: s.id,
    at: s.at,
    end: dir.shots[i + 1]?.at ?? totalDur,
    note: s.note,
  })),
  draw: (t) => drawFrame(t),
  frame: (t, q = 0.92) => {
    drawFrame(t);
    return cv.toDataURL('image/jpeg', q);
  },
  cues: () => dir.cues,
};

drawFrame(0);

// Interactive Audio Playback
let audio = null;
let isPlaying = false;

if (playBtn) {
  playBtn.hidden = false;
  audio = new Audio('voice_master_yt_under3m.wav');

  function tick() {
    if (!isPlaying) return;
    const t = audio.currentTime;
    drawFrame(t);
    if (t < totalDur) {
      requestAnimationFrame(tick);
    } else {
      isPlaying = false;
      playBtn.textContent = '▶ PLAY REEL (YOUTUBE)';
    }
  }

  playBtn.onclick = () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playBtn.textContent = '▶ PLAY REEL (YOUTUBE)';
    } else {
      audio.play();
      isPlaying = true;
      playBtn.textContent = '⏸ PAUSE';
      requestAnimationFrame(tick);
    }
  };
}
