// Master playback & frame capture entry point (`window.OP`) for 'The Free Lift - Episode 3: The 1978 Cycle' 2D Animation Reel.
import { W, H, vignette, filmGrainOverlay } from './palette.js';
import { buildDirectorEp3 } from './shots_ep3.js';

const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const playBtn = document.getElementById('play');

const dir = buildDirectorEp3();
const totalDur = dir.totalDur; // 78.00s Master Cut

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

export function drawFrame(t) {
  t = Math.max(0, Math.min(t, totalDur));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#06080d';
  ctx.fillRect(0, 0, W, H);

  const { s, lt, d } = activeShot(t);
  const cam = s.cam ? s.cam(lt, d, t) : { x: W / 2, y: H / 2, zoom: 0 };
  const [sx, sy] = dir.shakeAt(t);
  const scale = 1 + (cam.zoom || 0);

  // Camera transform (push-in + impact shake)
  ctx.save();
  ctx.translate(W / 2 + sx, H / 2 + sy);
  ctx.scale(scale, scale);
  ctx.translate(-(cam.x ?? W / 2), -(cam.y ?? H / 2));
  s.draw(ctx, lt, d, t);
  ctx.restore();

  // Subtle vignette & texture overlay
  vignette(ctx, s.id === 'S12' || s.id === 'S13' || s.id === 'S14' ? 0.35 : 0.55);
  filmGrainOverlay(ctx, 0.022);

  // Transition cut pulse
  if (lt < 0.16 && s.id !== 'S01') {
    const a = (1 - lt / 0.16) * 0.45;
    ctx.fillStyle = `rgba(4, 6, 10, ${a})`;
    ctx.fillRect(0, 0, W, H);
  }

  // Flashes for impact / sirens / explosions
  const fl = dir.flashAt?.(t);
  if (fl) {
    ctx.fillStyle = fl;
    ctx.fillRect(0, 0, W, H);
  }
}

// Window OP contract for automated video rendering & headless Chrome
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
  director: dir,
};

// Auto draw first frame
drawFrame(0);

// Interactive Playback Controls
let isPlaying = false;
let startTime = 0;
let playbackPos = 0;
let animReq = null;

export function playAnimation() {
  if (isPlaying) return;
  isPlaying = true;
  startTime = performance.now() - playbackPos * 1000;
  if (playBtn) playBtn.textContent = '⏸ PAUSE';

  function loop(now) {
    if (!isPlaying) return;
    playbackPos = (now - startTime) / 1000;
    if (playbackPos >= totalDur) {
      playbackPos = totalDur;
      drawFrame(playbackPos);
      pauseAnimation();
      return;
    }
    drawFrame(playbackPos);
    window.dispatchEvent(new CustomEvent('timeupdate', { detail: { t: playbackPos } }));
    animReq = requestAnimationFrame(loop);
  }
  animReq = requestAnimationFrame(loop);
}

export function pauseAnimation() {
  isPlaying = false;
  if (animReq) cancelAnimationFrame(animReq);
  if (playBtn) playBtn.textContent = '▶ PLAY REEL';
}

export function seekAnimation(t) {
  playbackPos = Math.max(0, Math.min(t, totalDur));
  startTime = performance.now() - playbackPos * 1000;
  drawFrame(playbackPos);
  window.dispatchEvent(new CustomEvent('timeupdate', { detail: { t: playbackPos } }));
}

if (playBtn) {
  playBtn.onclick = () => {
    if (isPlaying) {
      pauseAnimation();
    } else {
      if (playbackPos >= totalDur) playbackPos = 0;
      playAnimation();
    }
  };
}
