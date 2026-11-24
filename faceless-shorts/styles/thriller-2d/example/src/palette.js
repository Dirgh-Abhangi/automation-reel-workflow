// Core canvas dimensions, unified Tower-11-inspired ink palette, and drawing helpers.
export const W = 1080;
export const H = 1920;
export const INK = '#14100E';
export const TAU = Math.PI * 2;

export const PAL = {
  ink: INK,
  // Night exterior & corridor blues
  skyTop: '#060911',
  skyMid: '#0F1829',
  skyBot: '#1B293F',
  moon: '#EFE8D4',
  hospitalDark: '#121822',
  hospitalMid: '#1C2533',
  hospitalTrim: '#293548',
  pineDark: '#0A0F17',
  pineMid: '#111A26',

  // Morgue corridor cool clinical tones
  corridorTop: '#131D24',
  corridorWall: '#1B2B34',
  corridorDado: '#142028',
  corridorFloorA: '#172229',
  corridorFloorB: '#213039',
  morgueMist: '#7BE3D0',

  // Cabin / Elevator warm vintage wood + brass (nod to Tower 11 cabin tones)
  woodDark: '#2A1910',
  woodMid: '#462C1E',
  woodLight: '#5D3C29',
  woodSeam: '#1C1009',
  brass: '#DDA648',
  brassHi: '#F6CC78',
  brassDark: '#8E6220',
  amberLight: '#F4AF4E',

  // Characters: Maya Chen (warm alive) vs Doppelganger (hollow desaturated)
  mayaSkin: '#E8B18B',
  mayaSkinShade: '#CA8E67',
  mayaHair: '#241715',
  mayaHairHi: '#422C27',
  mayaJacket: '#3B5E8C',
  mayaJacketShade: '#264166',
  mayaHoodie: '#9E3338',
  mayaHoodieShade: '#762226',
  mayaPants: '#232B38',

  doppelSkin: '#9EA8B2',
  doppelSkinShade: '#737D87',
  doppelJacket: '#314357',
  doppelHoodie: '#5E2428',

  spectralSkin: '#A9C3CF',
  spectralGlow: '#6DE2F2',

  // UI / Stickers / Accents
  white: '#F7F8FA',
  creamPaper: '#EAE3D2',
  creamLine: '#C6CEDB',
  gold: '#F2C94C',
  crimson: '#E4322B',
  crimsonDark: '#871614',
  cyan: '#56CCF2',
  green: '#57D982',
  pillBg: 'rgba(13, 16, 23, 0.92)',
  tileBg: 'rgba(18, 22, 30, 0.88)',
};

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const rnd = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function rrPath(ctx, x, y, w, h, r = 12) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function radGrad(ctx, x, y, r0, r1, stops) {
  const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
  for (const [offset, color] of stops) g.addColorStop(offset, color);
  return g;
}

export function linGrad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [offset, color] of stops) g.addColorStop(offset, color);
  return g;
}

export function fillStroke(ctx, fill, lw = 4.5, stroke = INK) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (lw > 0 && stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

export function vignette(ctx, strength = 0.62) {
  const g = radGrad(ctx, W * 0.5, H * 0.45, W * 0.22, H * 0.68, [
    [0, 'rgba(0,0,0,0)'],
    [0.65, 'rgba(4,6,12,0.18)'],
    [1, `rgba(4,6,12,${strength})`],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function dustMotes(ctx, x, y, w, h, seed = 1, count = 24, color = 'rgba(255, 224, 165, 0.35)') {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const px = x + rnd(seed * 97 + i * 3.1) * w;
    const py = y + rnd(seed * 53 + i * 7.7) * h;
    const r = 1.6 + rnd(seed * 19 + i * 5.3) * 3.4;
    ctx.globalAlpha = 0.25 + rnd(i * 11.3) * 0.65;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

export function filmGrainOverlay(ctx, alpha = 0.03) {
  // Subtle comic paper / print dot texture vignette at top rim without blurring vectors
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#FFFFFF';
  for (let y = 0; y < H; y += 36) {
    for (let x = (y % 72 === 0 ? 0 : 18); x < W; x += 36) {
      if (rnd(x * 13 + y * 29) > 0.65) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }
  ctx.restore();
}

