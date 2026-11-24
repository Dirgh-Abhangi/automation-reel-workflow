// =============================================================
// The Free Lift — Episode 3: "The 1978 Cycle" (20 Master Keyframes)
// PRECISION CINEMATIC REWRITE — Zero Shortcuts / Full Multi-Plane Depth
// High-Octane Escape → Guillotine Corridor → The Free Lift Descends
// → 1978 Hospital Lobby → Time Loop Revelation → Interactive Finale
// =============================================================

import {
  W,
  H,
  PAL,
  INK,
  TAU,
  rrPath,
  radGrad,
  linGrad,
  fillStroke,
  vignette,
  filmGrainOverlay,
  rnd,
} from './palette.js';

const R2D = Math.PI / 180;

import {
  drawTopHUD,
  drawStamp,
  drawArrowCallout,
  drawCaption,
  drawTerminalBox,
  drawSplitChrome,
} from './hud.js';
import { drawMaya, drawHand, drawLimbTube } from './chars.js';
import { drawElevatorCab, drawMorgueCorridor, drawSplitWorldBackdrop } from './sets.js';
import { drawAutopsyWardSet, drawCryoChamberWithEntity, drawDissectionTable } from './keyframes_ep2.js';


// =============================================================
// HELPER: 1978 Hospital Lobby (Precision build with rich period detail)
// =============================================================
export function drawHospitalLobbySet(ctx, { redAlert = false, sunlight = true } = {}) {
  // 1. Base Wall (Rich dual-tone paneling: Dark Navy upper, Walnut lower)
  const wallTopCol = redAlert ? '#1a0505' : '#1e293b';
  const wallBotCol = redAlert ? '#2d0808' : '#334155';
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, H * 0.65, [
    [0, wallTopCol],
    [1, wallBotCol],
  ]);
  ctx.fillRect(0, 0, W, H * 0.65);

  // 2. Wainscoting / Wood paneling lower wall (Rich Mahogany)
  const woodCol = redAlert ? '#200b08' : '#3e2723';
  ctx.fillStyle = woodCol;
  ctx.fillRect(0, H * 0.42, W, H * 0.23);

  // Brass chair rail trim molding
  ctx.fillStyle = redAlert ? '#8a2be2' : PAL.gold;
  ctx.fillRect(0, H * 0.42 - 8, W, 8);
  ctx.strokeStyle = INK; ctx.lineWidth = 2;
  ctx.strokeRect(0, H * 0.42 - 8, W, 8);

  // Wood vertical divider slats with subtle shadows
  for (let x = 60; x < W; x += 110) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x, H * 0.42, 6, H * 0.23);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(x + 6, H * 0.42, 2, H * 0.23);
  }

  // Baseboard trim
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, H * 0.65 - 14, W, 14);

  // 3. Checkered Terrazzo Floor (1970s diamond tile grid with reflections)
  const floorTop = H * 0.65;
  const floorGrad = linGrad(ctx, 0, floorTop, 0, H, [
    [0, redAlert ? '#2b0909' : '#cfd8dc'],
    [0.4, redAlert ? '#190404' : '#eceff1'],
    [1, redAlert ? '#0a0101' : '#b0bec5'],
  ]);
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorTop, W, H - floorTop);

  // Perspective floor grid lines
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, floorTop, W, H - floorTop);
  ctx.clip();
  ctx.strokeStyle = redAlert ? 'rgba(255,50,50,0.18)' : 'rgba(100,120,140,0.25)';
  ctx.lineWidth = 2;

  const vpX = W * 0.5;
  const vpY = floorTop - 120;
  for (let x = -W; x <= W * 2; x += 90) {
    ctx.beginPath();
    ctx.moveTo(vpX, vpY);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  for (let y = floorTop + 25; y < H; y += (y - floorTop) * 0.42 + 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Grand Arched Windows (Background Left & Right)
  [-1, 1].forEach((dir) => {
    const winX = dir === -1 ? W * 0.18 : W * 0.82;
    const winY = 220;
    const winW = 140;
    const winH = 260;

    // Window arch outer frame
    ctx.fillStyle = redAlert ? 'rgba(80,0,0,0.6)' : 'rgba(255,248,225,0.85)';
    ctx.beginPath();
    ctx.moveTo(winX - winW / 2, winY + winH);
    ctx.lineTo(winX - winW / 2, winY + 60);
    ctx.quadraticCurveTo(winX, winY - 30, winX + winW / 2, winY + 60);
    ctx.lineTo(winX + winW / 2, winY + winH);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#263238'; ctx.lineWidth = 6; ctx.stroke();

    // Window mullions (vertical & horizontal cross bars)
    ctx.strokeStyle = '#37474f'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(winX, winY + 15); ctx.lineTo(winX, winY + winH);
    ctx.moveTo(winX - winW / 2, winY + 120); ctx.lineTo(winX + winW / 2, winY + 120);
    ctx.moveTo(winX - winW / 2, winY + 190); ctx.lineTo(winX + winW / 2, winY + 190);
    ctx.stroke();

    // Morning sunlight beam or red beacon beam
    if (sunlight && !redAlert) {
      const beamGrad = linGrad(ctx, winX, winY, winX + (dir === -1 ? 260 : -260), H * 0.85, [
        [0, 'rgba(255, 236, 179, 0.45)'],
        [0.5, 'rgba(255, 224, 130, 0.22)'],
        [1, 'rgba(255, 248, 225, 0.0)'],
      ]);
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(winX - winW / 2 + 20, winY + 40);
      ctx.lineTo(winX + winW / 2 - 20, winY + 40);
      ctx.lineTo(winX + (dir === -1 ? 380 : -100), H * 0.85);
      ctx.lineTo(winX + (dir === -1 ? 160 : -320), H * 0.85);
      ctx.closePath();
      ctx.fill();
    } else if (redAlert) {
      const redBeam = radGrad(ctx, winX, winY + 100, 20, 320, [
        [0, 'rgba(255, 23, 68, 0.5)'],
        [0.6, 'rgba(213, 0, 0, 0.2)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = redBeam;
      ctx.beginPath();
      ctx.arc(winX, winY + 100, 320, 0, TAU);
      ctx.fill();
    }
  });

  // 5. Vintage Wall Sconces (Brass 1970s up-lights)
  [W * 0.18, W * 0.88].forEach((sx) => {
    const sy = 480;
    // Sconce light glow
    const sconceGlow = radGrad(ctx, sx, sy - 15, 10, 140, [
      [0, redAlert ? 'rgba(255,60,60,0.6)' : 'rgba(255,224,130,0.45)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
    ctx.fillStyle = sconceGlow;
    ctx.beginPath(); ctx.arc(sx, sy - 15, 140, 0, TAU); ctx.fill();

    // Brass bracket & shade
    ctx.fillStyle = PAL.brass;
    rrPath(ctx, sx - 16, sy - 10, 32, 28, 4); fillStroke(ctx, PAL.brass, 3, INK);
    ctx.beginPath();
    ctx.moveTo(sx - 22, sy - 10);
    ctx.lineTo(sx + 22, sy - 10);
    ctx.lineTo(sx + 14, sy - 35);
    ctx.lineTo(sx - 14, sy - 35);
    ctx.closePath();
    fillStroke(ctx, '#fffde7', 2.5, INK);
  });

  // 6. Wall Institutional Clock (1970s Schoolhouse Octagon Dial)
  const clockX = W * 0.52;
  const clockY = 250;
  // Outer wood frame
  ctx.fillStyle = '#4e342e';
  ctx.beginPath(); ctx.arc(clockX, clockY, 56, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
  // Bezel brass rim
  ctx.fillStyle = PAL.brass;
  ctx.beginPath(); ctx.arc(clockX, clockY, 48, 0, TAU); ctx.fill();
  // Off-white face
  ctx.fillStyle = '#fffde7';
  ctx.beginPath(); ctx.arc(clockX, clockY, 44, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2; ctx.stroke();

  // Hour tick marks
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU - Math.PI / 2;
    const r1 = 34; const r2 = 41;
    ctx.beginPath();
    ctx.moveTo(clockX + Math.cos(a) * r1, clockY + Math.sin(a) * r1);
    ctx.lineTo(clockX + Math.cos(a) * r2, clockY + Math.sin(a) * r2);
    ctx.stroke();
  }
  // Clock hands: 8:42 AM (1978 morning)
  ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX - 22, clockY + 6); // hour hand to 8
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX - 16, clockY - 28); // minute hand to 42
  ctx.stroke();
  // Center pin
  ctx.fillStyle = PAL.brass;
  ctx.beginPath(); ctx.arc(clockX, clockY, 4, 0, TAU); ctx.fill();

  // 7. Floating dust motes in sunlight (if sunlight active)
  if (sunlight && !redAlert) {
    ctx.fillStyle = 'rgba(255, 255, 230, 0.7)';
    for (let m = 0; m < 25; m++) {
      const mx = 200 + rnd(m * 17) * 680;
      const my = 260 + rnd(m * 31) * 600;
      const mr = 1.5 + rnd(m * 11) * 2.5;
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
    }
  }

  // 8. Red Alert Emergency Siren Strobe (if redAlert active)
  if (redAlert) {
    // Red emergency dome light on ceiling
    const rx = W * 0.5;
    const ry = 40;
    ctx.fillStyle = '#d50000';
    ctx.beginPath(); ctx.arc(rx, ry + 15, 24, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();

    // Intense radial strobe flash
    const strobe = radGrad(ctx, rx, ry + 15, 20, W * 0.9, [
      [0, 'rgba(255, 23, 68, 0.6)'],
      [0.4, 'rgba(213, 0, 0, 0.25)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
    ctx.fillStyle = strobe;
    ctx.beginPath(); ctx.arc(rx, ry + 15, W * 0.9, 0, TAU); ctx.fill();
  }
}

// =============================================================
// HELPER: 1978 Curved Reception Counter & Desk Props
// =============================================================
export function drawReceptionDesk(ctx, x, y, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Counter shadow on floor
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(0, 80, 290, 30, 0, 0, TAU); ctx.fill();

  // Counter body — curved warm wood front
  rrPath(ctx, -260, -70, 520, 150, 24);
  fillStroke(ctx, linGrad(ctx, -260, -70, -260, 80, [
    [0, '#5d4037'],
    [0.5, '#4e342e'],
    [1, '#3e2723'],
  ]), 5, INK);

  // Horizontal wood seam lines on counter face
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5;
  [-30, 10, 45].forEach((sy) => {
    ctx.beginPath(); ctx.moveTo(-250, sy); ctx.lineTo(250, sy); ctx.stroke();
  });

  // Marble top ledge with beveled edge
  rrPath(ctx, -280, -105, 560, 42, 12);
  fillStroke(ctx, linGrad(ctx, -280, -105, -280, -63, [
    [0, '#eceff1'],
    [0.4, '#cfd8dc'],
    [1, '#b0bec5'],
  ]), 4.5, INK);

  // Beveled edge highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-270, -100); ctx.lineTo(270, -100); ctx.stroke();

  // --- Props on desk surface ---

  // 1. Vintage olive typewriter (left)
  ctx.save();
  ctx.translate(-130, -135);
  rrPath(ctx, -55, -30, 110, 55, 8);
  fillStroke(ctx, '#558b2f', 4, INK);
  // Paper feed roll
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-35, -60, 70, 35);
  ctx.strokeStyle = '#bdbdbd'; ctx.lineWidth = 1.5;
  ctx.strokeRect(-35, -60, 70, 35);
  // Typewriter keys (2 rows)
  ctx.fillStyle = '#111';
  for (let r = 0; r < 2; r++) {
    for (let k = -40; k <= 40; k += 16) {
      ctx.beginPath(); ctx.arc(k + r * 6, -18 + r * 14, 5, 0, TAU); ctx.fill();
    }
  }
  // Carriage return lever
  ctx.strokeStyle = '#b0bec5'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-52, -45); ctx.lineTo(-65, -55); ctx.stroke();
  ctx.restore();

  // 2. Vintage Brass Banker's Desk Lamp with Green Shade (mid-left)
  ctx.save();
  ctx.translate(-210, -145);
  // Brass neck
  ctx.strokeStyle = PAL.brass; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, 40); ctx.quadraticCurveTo(15, -10, -10, -25); ctx.stroke();
  // Emerald green glass shade
  rrPath(ctx, -38, -42, 56, 22, 6);
  fillStroke(ctx, '#004d40', 3, INK);
  // Warm lamp bulb glow cone
  const lampGlow = radGrad(ctx, -10, -25, 10, 160, [
    [0, 'rgba(255,245,157,0.7)'],
    [0.6, 'rgba(255,238,88,0.25)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = lampGlow;
  ctx.beginPath();
  ctx.moveTo(-35, -20); ctx.lineTo(35, -20);
  ctx.lineTo(85, 90); ctx.lineTo(-85, 90);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. Vintage Rotary Telephone (right)
  ctx.save();
  ctx.translate(150, -130);
  // Phone body — heavy black bakelite
  rrPath(ctx, -40, -22, 80, 44, 10);
  fillStroke(ctx, '#212121', 4, INK);
  // Rotary dial wheel
  ctx.fillStyle = '#e0e0e0';
  ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = '#212121';
  ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill();
  // Number finger holes
  for (let n = 0; n < 10; n++) {
    const a = (n / 10) * TAU * 0.85 + 0.4;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(Math.cos(a) * 12, Math.sin(a) * 12, 2.5, 0, TAU); ctx.fill();
  }
  // Coiled phone cord
  ctx.strokeStyle = '#424242'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(35, 10);
  ctx.bezierCurveTo(55, 30, 70, 0, 60, 40);
  ctx.stroke();
  ctx.restore();

  // 4. Desk Brass Service Bell & Desk Calendar
  ctx.save();
  ctx.translate(45, -120);
  // Bell dome
  ctx.fillStyle = PAL.brass;
  ctx.beginPath(); ctx.arc(0, -5, 12, Math.PI, 0); ctx.fill();
  fillStroke(ctx, PAL.brass, 2, INK);
  // Bell plunger
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-2, -14, 4, 7);
  // Bell base
  ctx.fillStyle = '#424242';
  rrPath(ctx, -14, -5, 28, 6, 2); fillStroke(ctx, '#424242', 2, INK);
  ctx.restore();

  // 5. Brass Plaque on Desk Face: "RECEPTION"
  rrPath(ctx, -85, -50, 170, 34, 4);
  fillStroke(ctx, linGrad(ctx, -85, -50, 85, -16, [
    [0, '#ffd54f'],
    [0.5, '#ffb300'],
    [1, '#ff8f00'],
  ]), 3, INK);
  ctx.fillStyle = '#111';
  ctx.font = '900 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('• RECEPTION •', 0, -33);

  ctx.restore();
}

// =============================================================
// HELPER: 1978 Receptionist (Marilyn Gibson - High-Caliber Vector Puppet)
// =============================================================
export function drawSecretary(ctx, x, y, scale = 1.0, options = {}) {
  const { talk = 0.5, blink = 0 } = options;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const skin = '#f7d0b5';
  const skinShade = '#e0a98b';
  const hairDark = '#2d1810';
  const hairMid = '#4a2c1a';
  const hairHi = '#7d4e30';
  const blouseCol = '#a7f3d0'; // Vintage 1970s mint pastel
  const vestCol = '#1e3a8a';   // Deep navy knitted vest

  // 1. Torso Base & Navy Knit Vest
  ctx.fillStyle = vestCol;
  ctx.beginPath();
  ctx.moveTo(-52, -45);
  ctx.quadraticCurveTo(-65, 30, -58, 85);
  ctx.lineTo(58, 85);
  ctx.quadraticCurveTo(65, 30, 52, -45);
  ctx.closePath();
  fillStroke(ctx, vestCol, 4.5, INK);

  // Vest ribbing & Pearl buttons
  ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 2;
  for (let vy = -20; vy < 80; vy += 14) {
    ctx.beginPath(); ctx.moveTo(-45, vy); ctx.lineTo(45, vy); ctx.stroke();
  }
  ctx.fillStyle = '#f8fafc';
  for (let by = -15; by < 75; by += 22) {
    ctx.beginPath(); ctx.arc(0, by, 3.5, 0, TAU); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.stroke();
  }

  // 2. Mint Blouse & Peter Pan Collar
  ctx.fillStyle = blouseCol;
  ctx.beginPath();
  ctx.moveTo(-35, -45);
  ctx.lineTo(35, -45);
  ctx.lineTo(24, -10);
  ctx.lineTo(0, 15);
  ctx.lineTo(-24, -10);
  ctx.closePath();
  fillStroke(ctx, blouseCol, 3.5, INK);

  // Blouse Peter Pan curved collar flaps
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-26, -42, 22, 14, -0.2, 0, TAU);
  ctx.ellipse(26, -42, 22, 14, 0.2, 0, TAU);
  fillStroke(ctx, '#ffffff', 3, INK);

  // Gold Brooch Pin at collar center
  ctx.fillStyle = PAL.gold;
  ctx.beginPath(); ctx.arc(0, -32, 6, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();

  // 3. Name Tag Badge: "M. GIBSON • RECEPTION"
  rrPath(ctx, 22, 5, 42, 18, 3);
  fillStroke(ctx, PAL.gold, 2, INK);
  ctx.fillStyle = '#111';
  ctx.font = '900 6px Inter, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('M. GIBSON', 43, 14);

  // 4. Arms & Forearms (resting gently on desk)
  ctx.fillStyle = blouseCol;
  // Left arm
  rrPath(ctx, -75, -35, 26, 85, 12); fillStroke(ctx, blouseCol, 4, INK);
  // Right arm
  rrPath(ctx, 49, -35, 26, 85, 12); fillStroke(ctx, blouseCol, 4, INK);

  // Hands (holding vintage pencil or typing)
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(-62, 58, 14, 11, -0.3, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(62, 58, 14, 11, 0.3, 0, TAU); ctx.fill();
  ctx.stroke();

  // 5. Back Hair: Feathered 1970s Farrah Waves (Volume & curls)
  ctx.fillStyle = hairDark;
  ctx.beginPath();
  ctx.arc(0, -115, 62, Math.PI * 0.9, Math.PI * 0.1);
  ctx.quadraticCurveTo(85, -60, 75, 15);
  ctx.quadraticCurveTo(60, 45, 48, 10);
  ctx.quadraticCurveTo(55, -25, 42, -50);
  ctx.lineTo(-42, -50);
  ctx.quadraticCurveTo(-55, -25, -48, 10);
  ctx.quadraticCurveTo(-60, 45, -75, 15);
  ctx.quadraticCurveTo(-85, -60, 0, -115);
  ctx.closePath();
  fillStroke(ctx, hairDark, 5, INK);

  // 6. Neck & Head
  ctx.fillStyle = skinShade;
  ctx.fillRect(-14, -75, 28, 34);
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.strokeRect(-14, -75, 28, 34);

  // Head oval
  const hx = 0; const hy = -105; const rx = 44; const ry = 52;
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(hx, hy, rx, ry, 0, 0, TAU);
  fillStroke(ctx, skin, 4.5, INK);

  // Rosy blush on cheeks
  ctx.fillStyle = 'rgba(244, 63, 94, 0.32)';
  ctx.beginPath(); ctx.ellipse(hx - 26, hy + 8, 11, 7, -0.1, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + 26, hy + 8, 11, 7, 0.1, 0, TAU); ctx.fill();

  // 7. Facial Features: Cat-Eye Glasses, Eyes, Nose, Lipstick Smile
  const eyeY = hy - 4;
  const eyeSp = 20;

  // Eyes (behind glasses)
  [-1, 1].forEach((s) => {
    const ex = hx + s * eyeSp;
    if (blink > 0.5) {
      // Blinking closed line
      ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ex, eyeY, 8, 0.2, Math.PI - 0.2); ctx.stroke();
    } else {
      // Open eye with warm amber iris
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(ex, eyeY, 9, 7, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
      // Amber iris
      ctx.fillStyle = '#b45309';
      ctx.beginPath(); ctx.arc(ex + 1, eyeY, 4.5, 0, TAU); ctx.fill();
      // Pupil
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(ex + 1, eyeY, 2.5, 0, TAU); ctx.fill();
      // Specular highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(ex - 1, eyeY - 2, 1.8, 0, TAU); ctx.fill();
      // Eyelashes
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ex - 7 * s, eyeY - 6); ctx.lineTo(ex + 10 * s, eyeY - 6); ctx.stroke();
    }
  });

  // Nose
  ctx.strokeStyle = skinShade; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(hx, eyeY + 2); ctx.lineTo(hx + 3, eyeY + 16); ctx.lineTo(hx - 1, eyeY + 18);
  ctx.stroke();

  // Red Lipstick Smile (Pleasant 1970s receptionist demeanor)
  ctx.fillStyle = '#be123c'; // Crimson red
  ctx.beginPath();
  ctx.moveTo(hx - 15, hy + 28);
  ctx.quadraticCurveTo(hx, hy + 26 - talk * 4, hx + 15, hy + 28);
  ctx.quadraticCurveTo(hx, hy + 40 + talk * 8, hx - 15, hy + 28);
  ctx.closePath();
  fillStroke(ctx, '#be123c', 2.5, INK);
  // White teeth flash
  if (talk > 0.3) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(hx - 10, hy + 29);
    ctx.lineTo(hx + 10, hy + 29);
    ctx.quadraticCurveTo(hx, hy + 33, hx - 10, hy + 29);
    ctx.fill();
  }

  // 8. 1970s Cat-Eye Tortoiseshell Glasses Frame
  const frameDark = '#78350f';
  const frameGold = '#d97706';
  [-1, 1].forEach((s) => {
    const gx = hx + s * eyeSp;
    ctx.save();
    ctx.translate(gx, eyeY);
    // Outer tortoiseshell frame with upswept cat-ear corner
    ctx.beginPath();
    ctx.moveTo(-16 * s, -8);
    ctx.quadraticCurveTo(0, -14, 14 * s, -12);
    ctx.lineTo(20 * s, -18); // Cat wing
    ctx.quadraticCurveTo(18 * s, 4, 10 * s, 12);
    ctx.quadraticCurveTo(0, 14, -12 * s, 10);
    ctx.closePath();
    ctx.strokeStyle = frameDark; ctx.lineWidth = 4.5; ctx.stroke();
    ctx.strokeStyle = frameGold; ctx.lineWidth = 1.5; ctx.stroke();

    // Glass reflection diagonal glare
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)'; ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-12 * s, -11); ctx.lineTo(12 * s, 11);
    ctx.stroke();
    ctx.restore();
  });
  // Nose bridge
  ctx.strokeStyle = frameDark; ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(hx, eyeY - 7, 8, Math.PI, 0);
  ctx.stroke();

  // 9. Front Hair Bangs & Feathered Sweep
  ctx.fillStyle = hairMid;
  ctx.beginPath();
  ctx.moveTo(hx - rx - 8, hy - 12);
  ctx.bezierCurveTo(hx - rx + 15, hy - ry - 38, hx + rx - 15, hy - ry - 38, hx + rx + 8, hy - 12);
  ctx.quadraticCurveTo(hx + 42, hy - 42, hx, hy - 50);
  ctx.quadraticCurveTo(hx - 42, hy - 42, hx - rx - 8, hy - 12);
  ctx.closePath();
  fillStroke(ctx, hairMid, 4.5, INK);

  // Hair shine highlight arcs
  ctx.strokeStyle = hairHi; ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(hx, hy - 64, 46, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  ctx.restore();
}

// =============================================================
// HELPER: Dr. Maya Chen (1978 Chief Surgeon Costume)
// =============================================================
export function drawDrMaya(ctx, x, y, scale = 1.0, options = {}) {
  const { mood = 'shock', holdScalpel = true, bloodStains = true, look = [0, 0], pose = 'stand', runPhase = 0 } = options;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // 1. Drop shadow on floor
  ctx.fillStyle = 'rgba(0,0,0,0.36)';
  ctx.beginPath();
  ctx.ellipse(0, 405, 118, 22, 0, 0, TAU);
  ctx.fill();

  // 2. Legs & Shoes (Dark surgical scrub pants + clogs)
  const drawScrubLeg = (hipX, hipY, kneeX, kneeY, footX, footY, shoeDir = 1) => {
    drawLimbTube(ctx, hipX, hipY, kneeX, kneeY, 26, 22, '#0f2937', 4.5);
    drawLimbTube(ctx, kneeX, kneeY, footX, footY, 22, 19, '#0f2937', 4.5);
    // Medical clog shoe
    ctx.save();
    ctx.translate(footX + shoeDir * 10, footY + 14);
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 17, 0, Math.PI, 0);
    ctx.lineTo(32, 10);
    ctx.lineTo(-32, 10);
    ctx.closePath();
    fillStroke(ctx, '#1e293b', 4, INK);
    ctx.fillStyle = '#475569';
    ctx.fillRect(-28, 4, 56, 6);
    ctx.restore();
  };

  if (pose === 'sprint') {
    const sw = Math.sin(runPhase) * 58;
    const fyA = 345 - Math.max(0, Math.cos(runPhase)) * 32;
    const fyB = 345 - Math.max(0, -Math.cos(runPhase)) * 32;
    drawScrubLeg(-36, 130, -45 - sw * 0.75, 232, -32 - sw, fyA, sw >= 0 ? -1 : 1);
    drawScrubLeg(38, 130, 45 + sw * 0.75, 224, 32 + sw, fyB, sw >= 0 ? 1 : -1);
  } else {
    drawScrubLeg(-38, 135, -42, 255, -46, 375, -1);
    drawScrubLeg(38, 135, 42, 255, 46, 375, 1);
  }

  // 3. Torso: Dark Teal Surgical Scrub Top underneath
  const torsoTop = -65;
  const torsoBot = 148;
  ctx.beginPath();
  ctx.moveTo(-74, torsoTop + 14);
  ctx.bezierCurveTo(-90, torsoTop + 50, -85, torsoBot - 35, -75, torsoBot);
  ctx.lineTo(75, torsoBot);
  ctx.bezierCurveTo(85, torsoBot - 35, 90, torsoTop + 50, 74, torsoTop + 14);
  ctx.quadraticCurveTo(0, torsoTop - 16, -74, torsoTop + 14);
  ctx.closePath();
  fillStroke(ctx, '#004d40', 4.5, INK);

  // Scrub V-neck
  ctx.beginPath();
  ctx.moveTo(-28, torsoTop);
  ctx.lineTo(0, torsoTop + 45);
  ctx.lineTo(28, torsoTop);
  ctx.closePath();
  fillStroke(ctx, '#00332c', 3, INK);

  // 4. White Lab Coat Main Body (Tailored medical fit down to y=215)
  ctx.beginPath();
  ctx.moveTo(-78, torsoTop + 12);
  ctx.bezierCurveTo(-96, torsoTop + 50, -98, 140, -92, 215);
  ctx.lineTo(-12, 218); // Left front hem
  ctx.lineTo(-16, torsoTop + 48); // Open front left edge
  ctx.lineTo(0, torsoTop + 24);
  ctx.lineTo(16, torsoTop + 48); // Open front right edge
  ctx.lineTo(12, 218); // Right front hem
  ctx.lineTo(92, 215);
  ctx.bezierCurveTo(98, 140, 96, torsoTop + 50, 78, torsoTop + 12);
  ctx.quadraticCurveTo(0, torsoTop - 18, -78, torsoTop + 12);
  ctx.closePath();
  fillStroke(ctx, linGrad(ctx, -90, torsoTop, 90, 215, [
    [0, '#ffffff'],
    [0.7, '#f1f5f9'],
    [1, '#e2e8f0']
  ]), 4.5, INK);

  // Coat Lapels (Left & Right)
  [-1, 1].forEach((s) => {
    ctx.beginPath();
    ctx.moveTo(s * 28, torsoTop + 2);
    ctx.lineTo(s * 64, torsoTop + 32);
    ctx.lineTo(s * 36, torsoTop + 85);
    ctx.lineTo(s * 14, torsoTop + 46);
    ctx.closePath();
    fillStroke(ctx, '#ffffff', 3.5, INK);
  });

  // Coat Buttons
  ctx.fillStyle = '#cbd5e1';
  [torsoTop + 105, torsoTop + 138, torsoTop + 172, torsoTop + 205].forEach((by) => {
    ctx.beginPath(); ctx.arc(14, by, 4, 0, TAU); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.stroke();
  });

  // Pockets
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.5;
  ctx.strokeRect(-68, torsoTop + 85, 34, 30); // Left chest pocket
  ctx.strokeRect(36, torsoTop + 155, 38, 36); // Right lower pocket
  ctx.strokeRect(-74, torsoTop + 155, 38, 36); // Left lower pocket

  // Blue pen in breast pocket
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(-60, torsoTop + 76, 5, 18);
  ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
  ctx.strokeRect(-60, torsoTop + 76, 5, 18);

  // Brass Name Badge: "CHIEF SURGEON: DR. MAYA CHEN"
  rrPath(ctx, -66, torsoTop + 96, 68, 20, 3);
  fillStroke(ctx, PAL.gold, 2, INK);
  ctx.fillStyle = '#0a0d14';
  ctx.font = '900 6.5px Inter, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('CHIEF SURGEON', -32, torsoTop + 103);
  ctx.fillText('DR. MAYA CHEN', -32, torsoTop + 111);

  // Stethoscope draped around neck
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(-24, torsoTop + 6);
  ctx.quadraticCurveTo(-38, torsoTop + 60, -30, torsoTop + 125);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(24, torsoTop + 6);
  ctx.quadraticCurveTo(38, torsoTop + 60, 26, torsoTop + 125);
  ctx.stroke();
  // Diaphragm (metal sensor)
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath(); ctx.arc(-30, torsoTop + 130, 9, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();

  // 5. ARMS & SLEEVES (Full white coat sleeves covering arms!)
  // Left arm resting naturally at side
  const renderLabCoatArm = (sx, sy, ex, ey, hx, hy, isHoldingScalpel) => {
    // Upper arm (white coat)
    drawLimbTube(ctx, sx, sy, ex, ey, 24, 20, '#ffffff', 4.5);
    // Forearm (white coat)
    drawLimbTube(ctx, ex, ey, hx, hy, 20, 17, '#f1f5f9', 4.5);
    // Coat cuff fold
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.5;
    ctx.strokeRect(hx - 12, hy - 8, 24, 7);

    // Hand: White Surgical Latex Glove
    const angle = Math.atan2(hy - ey, hx - ex) - Math.PI / 2;
    drawHand(ctx, hx, hy, '#f8fafc', '#e2e8f0', angle, 0.95);

    // If holding scalpel
    if (isHoldingScalpel) {
      ctx.save();
      ctx.translate(hx + 8, hy - 18);
      ctx.rotate(-0.25);
      // Stainless handle
      ctx.fillStyle = '#cfd8dc';
      rrPath(ctx, -5, -45, 10, 52, 2);
      fillStroke(ctx, '#b0bec5', 2.5, INK);
      // Grip ribs
      ctx.strokeStyle = '#78909c'; ctx.lineWidth = 1.5;
      for (let gy = -40; gy < -5; gy += 6) {
        ctx.beginPath(); ctx.moveTo(-4, gy); ctx.lineTo(4, gy); ctx.stroke();
      }
      // Surgical Blade #10
      ctx.fillStyle = '#eceff1';
      ctx.beginPath();
      ctx.moveTo(-4, -45);
      ctx.lineTo(0, -82);
      ctx.quadraticCurveTo(9, -64, 4, -45);
      ctx.closePath();
      fillStroke(ctx, '#ffffff', 2, INK);

      // Razor glint
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, -80); ctx.quadraticCurveTo(7, -64, 3, -47); ctx.stroke();

      // Specular Star Flare
      ctx.fillStyle = '#ffffff';
      const fx = 0; const fy = -82;
      ctx.beginPath();
      ctx.moveTo(fx, fy - 16); ctx.lineTo(fx + 4, fy); ctx.lineTo(fx, fy + 16); ctx.lineTo(fx - 4, fy);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  };

  // Left Arm (Idle side)
  renderLabCoatArm(-74, torsoTop + 25, -96, torsoTop + 115, -88, torsoTop + 195, false);

  // Right Arm (Raised holding scalpel aloft)
  if (holdScalpel) {
    renderLabCoatArm(74, torsoTop + 25, 115, torsoTop + 90, 96, torsoTop + 35, true);
  } else {
    renderLabCoatArm(74, torsoTop + 25, 96, torsoTop + 115, 88, torsoTop + 195, false);
  }

  // 6. Arterial Blood Splatters
  if (bloodStains) {
    ctx.fillStyle = '#880e4f'; // Dark arterial blood
    // Splatters on chest
    ctx.beginPath(); ctx.arc(22, torsoTop + 95, 7, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(35, torsoTop + 110, 5, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(14, torsoTop + 128, 6, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(28, torsoTop + 138, 4, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(-42, torsoTop + 155, 8, 0, TAU); ctx.fill();
    // Blood drips running down coat hem
    ctx.beginPath();
    ctx.moveTo(22, torsoTop + 102); ctx.lineTo(20, torsoTop + 180); ctx.lineTo(24, torsoTop + 180); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(35, torsoTop + 115); ctx.lineTo(33, torsoTop + 198); ctx.lineTo(37, torsoTop + 198); ctx.closePath(); ctx.fill();
    // Blood drip on scalpel forearm
    if (holdScalpel) {
      ctx.beginPath(); ctx.ellipse(98, torsoTop + 75, 5, 16, 0.4, 0, TAU); ctx.fill();
    }
  }

  // 7. HEAD & FACE (Authentic Maya Head Rig)
  const hx = 0;
  const hy = -196;
  const rx = 114;
  const ry = 118;

  // Back hair layer behind head/ears
  ctx.beginPath();
  ctx.ellipse(hx, hy - 14, rx + 26, ry + 20, 0, Math.PI * 0.85, Math.PI * 2.15);
  ctx.quadraticCurveTo(hx + rx + 34, hy + 88, hx + rx - 6, hy + 106);
  ctx.lineTo(hx - rx + 6, hy + 106);
  ctx.quadraticCurveTo(hx - rx - 34, hy + 88, hx - rx - 26, hy - 14);
  ctx.closePath();
  fillStroke(ctx, PAL.mayaHair, 5, INK);

  // Neck
  rrPath(ctx, -22, torsoTop - 32, 44, 46, 12);
  fillStroke(ctx, PAL.mayaSkinShade, 4, INK);

  // Face oval
  ctx.beginPath();
  ctx.ellipse(hx, hy, rx, ry, 0, 0, TAU);
  fillStroke(ctx, PAL.mayaSkin, 5, INK);

  // Ears
  [-1, 1].forEach((s) => {
    ctx.beginPath();
    ctx.ellipse(hx + s * (rx - 2), hy + 8, 20, 26, 0, 0, TAU);
    fillStroke(ctx, PAL.mayaSkin, 4, INK);
    ctx.beginPath();
    ctx.ellipse(hx + s * (rx - 2), hy + 8, 10, 14, 0, 0, TAU);
    ctx.fillStyle = PAL.mayaSkinShade;
    ctx.fill();
  });

  // Eyes (Tower-11 signature large anime horror eyes)
  const eyeY = hy + 6;
  [-1, 1].forEach((s) => {
    const ex = hx + s * 46;
    // Eye white
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 26, 32, 0, 0, TAU);
    fillStroke(ctx, '#ffffff', 4, INK);

    // Iris & Pupil (wide dilated shock pupils)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(ex + look[0] * 8, eyeY + look[1] * 8, 16, 20, 0, 0, TAU);
    ctx.fill();

    // Catchlight glints
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex + look[0] * 8 - 5, eyeY + look[1] * 8 - 6, 6, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + look[0] * 8 + 4, eyeY + look[1] * 8 + 4, 3, 0, TAU);
    ctx.fill();

    // Upper eyelid crease
    ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(ex, eyeY - 26, 22, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    // Eyebrows (arched high in existential terror)
    ctx.strokeStyle = INK; ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(ex - s * 22, eyeY - 48);
    ctx.quadraticCurveTo(ex, eyeY - 60, ex + s * 22, eyeY - 44);
    ctx.stroke();
  });

  // Nose
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hx, hy + 18);
  ctx.lineTo(hx - 4, hy + 32);
  ctx.lineTo(hx + 4, hy + 32);
  ctx.stroke();

  // Mouth: Parted in speechless horror
  ctx.fillStyle = '#450a0a';
  ctx.beginPath();
  ctx.ellipse(hx, hy + 58, 14, 18, 0, 0, TAU);
  fillStroke(ctx, '#450a0a', 3.5, INK);
  // Teeth
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(hx - 8, hy + 44, 16, 6);

  // Front Hair Fringe & Bangs
  ctx.fillStyle = PAL.mayaHair;
  ctx.beginPath();
  ctx.moveTo(hx - rx - 6, hy - 40);
  ctx.quadraticCurveTo(hx - rx * 0.7, hy - 110, hx, hy - 120);
  ctx.quadraticCurveTo(hx + rx * 0.7, hy - 110, hx + rx + 6, hy - 40);
  // Jagged stylish anime bangs
  ctx.lineTo(hx + 82, hy - 18);
  ctx.lineTo(hx + 64, hy - 44);
  ctx.lineTo(hx + 42, hy - 12);
  ctx.lineTo(hx + 20, hy - 50);
  ctx.lineTo(hx - 5, hy - 10);
  ctx.lineTo(hx - 32, hy - 48);
  ctx.lineTo(hx - 58, hy - 14);
  ctx.lineTo(hx - 78, hy - 38);
  ctx.closePath();
  fillStroke(ctx, PAL.mayaHair, 5, INK);

  // Sweat drops
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(hx + 68, hy - 15, 6, 12, 0.3, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.restore();
}

// =============================================================
// HELPER: 1970s Hospital Staff Member (Nurse, Doctor, Orderly)
// =============================================================
export function drawHospitalStaffMember(ctx, x, y, scale = 1.0, type = 'nurse', options = {}) {
  const { look = [0, 0], walk = 0, facing = 1 } = options;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * facing, scale);

  const skin = '#f5d0b5';
  const skinShade = '#dba88b';

  if (type === 'nurse') {
    // 1970s Nurse: White pleated uniform dress, winged cap with red cross, white stockings
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(0, 160, 40, 12, 0, 0, TAU); ctx.fill();

    // Legs / White stockings
    ctx.fillStyle = '#f0f4f8';
    ctx.fillRect(-18, 70, 14, 85);
    ctx.fillRect(4, 70, 14, 85);
    ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.strokeRect(-18, 70, 14, 85);
    ctx.strokeRect(4, 70, 14, 85);

    // White nurse shoes
    ctx.fillStyle = '#ffffff';
    rrPath(ctx, -22, 145, 20, 16, 5); fillStroke(ctx, '#ffffff', 3, INK);
    rrPath(ctx, 2, 145, 20, 16, 5); fillStroke(ctx, '#ffffff', 3, INK);

    // Nurse A-line dress
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-25, -20);
    ctx.lineTo(25, -20);
    ctx.lineTo(42, 75);
    ctx.lineTo(-42, 75);
    ctx.closePath();
    fillStroke(ctx, '#f8fafc', 3.5, INK);

    // Blue belt
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-28, 15, 56, 10);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.strokeRect(-28, 15, 56, 10);

    // Front vertical dress seams & buttons
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 75); ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    for (let by = -10; by < 70; by += 16) {
      ctx.beginPath(); ctx.arc(0, by, 3, 0, TAU); ctx.fill();
    }

    // Arms & Hands holding clipboard
    ctx.fillStyle = '#ffffff';
    rrPath(ctx, -38, -15, 16, 45, 6); fillStroke(ctx, '#ffffff', 3, INK);
    rrPath(ctx, 22, -15, 16, 45, 6); fillStroke(ctx, '#ffffff', 3, INK);
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.arc(-28, 35, 9, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(28, 35, 9, 0, TAU); ctx.fill();

    // Clipboard held in front
    ctx.save();
    ctx.translate(0, 30);
    ctx.fillStyle = '#8d6e63';
    rrPath(ctx, -20, -22, 40, 50, 4); fillStroke(ctx, '#8d6e63', 2.5, INK);
    ctx.fillStyle = '#fffde7';
    ctx.fillRect(-16, -16, 32, 40);
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(-10, -24, 20, 7);
    ctx.restore();

    // Head / Neck
    ctx.fillStyle = skinShade;
    ctx.fillRect(-10, -32, 20, 16);
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.ellipse(0, -48, 22, 26, 0, 0, TAU);
    fillStroke(ctx, skin, 3.5, INK);

    // Hair (1970s brunette bun / curls)
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.arc(0, -56, 26, Math.PI, 0);
    ctx.quadraticCurveTo(28, -40, 24, -30);
    ctx.quadraticCurveTo(0, -42, -24, -30);
    ctx.quadraticCurveTo(-28, -40, 0, -56);
    ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();

    // Nurse Winged Cap with Red Cross
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-22, -62);
    ctx.lineTo(22, -62);
    ctx.lineTo(16, -80);
    ctx.lineTo(-16, -80);
    ctx.closePath();
    fillStroke(ctx, '#ffffff', 3, INK);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-3, -76, 6, 12);
    ctx.fillRect(-6, -73, 12, 6);

    // Eyes & Smile
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(-8 + look[0] * 3, -48, 2.8, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(8 + look[0] * 3, -48, 2.8, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#c2410c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -38, 5, 0.2, Math.PI - 0.2); ctx.stroke();

  } else {
    // 1970s Doctor: White lab coat, collared shirt with tie, slacks, stethoscope
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(0, 160, 42, 12, 0, 0, TAU); ctx.fill();

    // Brown Slacks
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-20, 70, 17, 85);
    ctx.fillRect(3, 70, 17, 85);
    ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.strokeRect(-20, 70, 17, 85);
    ctx.strokeRect(3, 70, 17, 85);

    // Leather dress shoes
    ctx.fillStyle = '#1c1917';
    rrPath(ctx, -24, 146, 22, 16, 5); fillStroke(ctx, '#1c1917', 3, INK);
    rrPath(ctx, 2, 146, 22, 16, 5); fillStroke(ctx, '#1c1917', 3, INK);

    // Blue collared shirt & maroon tie
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(-18, -20, 36, 45);
    ctx.fillStyle = '#881337';
    ctx.beginPath();
    ctx.moveTo(-5, -15); ctx.lineTo(5, -15);
    ctx.lineTo(7, 30); ctx.lineTo(0, 38); ctx.lineTo(-7, 30);
    ctx.closePath(); ctx.fill();

    // White open lab coat
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-32, -22); ctx.lineTo(-12, -22);
    ctx.lineTo(-15, 80); ctx.lineTo(-44, 80); ctx.closePath();
    fillStroke(ctx, '#ffffff', 3.5, INK);
    ctx.beginPath();
    ctx.moveTo(32, -22); ctx.lineTo(12, -22);
    ctx.lineTo(15, 80); ctx.lineTo(44, 80); ctx.closePath();
    fillStroke(ctx, '#ffffff', 3.5, INK);

    // Stethoscope around neck
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-16, -24); ctx.bezierCurveTo(-22, 10, -10, 30, -5, 35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, -24); ctx.bezierCurveTo(22, 10, 10, 30, -5, 35); ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(-5, 38, 7, 0, TAU); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();

    // Arms
    ctx.fillStyle = '#ffffff';
    rrPath(ctx, -42, -18, 16, 60, 6); fillStroke(ctx, '#ffffff', 3, INK);
    rrPath(ctx, 26, -18, 16, 60, 6); fillStroke(ctx, '#ffffff', 3, INK);
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.arc(-30, 48, 8, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(30, 48, 8, 0, TAU); ctx.fill();

    // Head / Neck
    ctx.fillStyle = skinShade;
    ctx.fillRect(-11, -34, 22, 16);
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.ellipse(0, -52, 24, 28, 0, 0, TAU);
    fillStroke(ctx, skin, 3.5, INK);

    // 1970s Doctor Hair & Sideburns
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, -60, 27, Math.PI, 0);
    ctx.quadraticCurveTo(30, -42, 26, -35);
    ctx.quadraticCurveTo(20, -46, 12, -58);
    ctx.quadraticCurveTo(0, -62, -12, -58);
    ctx.quadraticCurveTo(-20, -46, -26, -35);
    ctx.quadraticCurveTo(-30, -42, 0, -60);
    ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();

    // Eyes & Serious expression
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(-9 + look[0] * 3, -52, 3, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(9 + look[0] * 3, -52, 3, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-15, -60); ctx.lineTo(-4, -58); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, -58); ctx.lineTo(15, -60); ctx.stroke();
    ctx.strokeStyle = '#881337'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-6, -40); ctx.lineTo(6, -40); ctx.stroke();
  }

  ctx.restore();
}

// =============================================================
// HELPER: Heavy Industrial Guillotine Blast Door
// =============================================================
export function drawGuillotineDoor(ctx, x, topY, bottomY, progress = 0.5) {
  ctx.save();
  ctx.translate(x, 0);
  const doorW = W * 0.72;
  const doorH = (bottomY - topY) * progress;

  // Heavy steel door body
  ctx.fillStyle = linGrad(ctx, -doorW / 2, topY, doorW / 2, topY + doorH, [
    [0, '#263238'],
    [0.5, '#37474f'],
    [1, '#1c2833'],
  ]);
  ctx.fillRect(-doorW / 2, topY, doorW, doorH);
  ctx.strokeStyle = INK; ctx.lineWidth = 6;
  ctx.strokeRect(-doorW / 2, topY, doorW, doorH);

  // Horizontal reinforcement I-beams
  ctx.strokeStyle = 'rgba(100,120,140,0.35)'; ctx.lineWidth = 3;
  for (let ry = topY + 60; ry < topY + doorH - 30; ry += 80) {
    ctx.beginPath(); ctx.moveTo(-doorW / 2 + 15, ry); ctx.lineTo(doorW / 2 - 15, ry); ctx.stroke();
  }

  // Hazard warning chevron stripe on bottom edge
  const stripeY = topY + doorH - 30;
  for (let s = -doorW / 2; s < doorW / 2; s += 40) {
    ctx.fillStyle = (Math.floor(s / 40) % 2 === 0) ? PAL.gold : '#111';
    ctx.fillRect(s, stripeY, 20, 30);
  }
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.strokeRect(-doorW / 2, stripeY, doorW, 30);

  ctx.restore();
}


export const KEYFRAMES_EP3 = [

  // =============================================================
  // KF-01: Option [B] Chosen — Surgical Tray Mallet Strike
  // The moment Maya grabs the steel autopsy tray and smashes the
  // frozen corpse's wrist to free herself from the bone-crushing grip
  // =============================================================
  {
    id: 'KF-01',
    title: '0:00-0:04 | Surgical Tray / Mallet Strike',
    hinglish: 'Maya ne socha nahi... steel ki autopsy tray utha kar murda kalai par de maari!',
    render(ctx) {
      // 1. Background: Autopsy ward in emergency red alert mode
      drawAutopsyWardSet(ctx, { redAlert: true });

      // Cryo chamber with shattered glass spilling boiling formalin in background right
      drawCryoChamberWithEntity(ctx, W * 0.72, 780, 1.15, { glassBroken: true });

      // Dissection table in mid-ground
      drawDissectionTable(ctx, W * 0.52, 1280, 0.7);

      // Flooded floor with emerald coolant reflecting red siren lights
      ctx.fillStyle = 'rgba(0, 230, 118, 0.18)';
      ctx.fillRect(0, H * 0.72, W, H * 0.28);
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.35)'; ctx.lineWidth = 2;
      for (let y = H * 0.74; y < H; y += 45) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // 2. Midground: Maya in full adrenaline scream, swinging down
      drawMaya(ctx, W * 0.25, 1100, 1.18, {
        mood: 'scream',
        pose: 'reach',
        look: [0.75, -0.1],
        sweat: true,
      });

      // 3. Foreground / Subject: Decaying Cyan Corpse Arm clamped onto Maya's wrist
      ctx.save();
      ctx.translate(W * 0.48, 1020);
      
      // Decaying frozen arm coming from right
      ctx.fillStyle = '#264653'; // Cyan-decay tone
      ctx.beginPath();
      ctx.moveTo(220, 80);
      ctx.quadraticCurveTo(120, 40, 20, -10);
      ctx.lineTo(20, -35);
      ctx.quadraticCurveTo(130, 15, 240, 40);
      ctx.closePath();
      fillStroke(ctx, '#264653', 4, INK);

      // Blackened frostbite patches on arm
      ctx.fillStyle = '#111827';
      [ [140, 35, 16], [90, 15, 12], [40, -15, 9] ].forEach(([cx, cy, cr]) => {
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, TAU); ctx.fill();
      });

      // Dead skeletal hand locked around Maya's blue sleeve
      ctx.fillStyle = '#2a9d8f';
      [-15, -5, 5, 15].forEach((fy, idx) => {
        // Clamping necrotic fingers
        ctx.save();
        ctx.translate(-5, fy);
        rrPath(ctx, -22, -6, 32, 11, 4);
        fillStroke(ctx, '#264653', 2.5, INK);
        // Blackened sharp nails
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-22, -5, 6, 9);
        ctx.restore();
      });

      // Frost crystals on Maya's sleeve where gripped
      ctx.strokeStyle = '#a7f3d0'; ctx.lineWidth = 2;
      for (let c = 0; c < 8; c++) {
        const a = (c / 8) * TAU;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8);
        ctx.lineTo(Math.cos(a) * 22, Math.sin(a) * 22);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Action Impact: Stainless Steel Autopsy Tray smashing down onto joint
      ctx.save();
      ctx.translate(W * 0.46, 930);
      ctx.rotate(-0.35);

      // Tray body — heavy stainless steel with beveled lip
      rrPath(ctx, -95, -32, 190, 64, 12);
      fillStroke(ctx, linGrad(ctx, -95, -32, 95, 32, [
        [0, '#78909c'],
        [0.4, '#ffffff'],
        [0.7, '#cfd8dc'],
        [1, '#90a4ae'],
      ]), 5.5, INK);

      // Tray interior bevel
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2.5;
      ctx.strokeRect(-82, -22, 164, 44);
      ctx.restore();

      // 5. Massive Comic Action Burst: "CRACK!" & Shattered Ice Crystals
      const impX = W * 0.48; const impY = 990;
      
      // Radial shockwave rings
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(impX, impY, 75, 0, TAU); ctx.stroke();
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(impX, impY, 110, 0, TAU); ctx.stroke();

      // Golden impact sparks
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4.5;
      for (let s = 0; s < 14; s++) {
        const a = (s / 14) * TAU;
        const inner = 50 + rnd(s * 7) * 20;
        const outer = 120 + rnd(s * 13) * 60;
        ctx.beginPath();
        ctx.moveTo(impX + Math.cos(a) * inner, impY + Math.sin(a) * inner);
        ctx.lineTo(impX + Math.cos(a) * outer, impY + Math.sin(a) * outer);
        ctx.stroke();
      }

      // Flying shattered ice shards (cyan & white 3D prisms)
      for (let i = 0; i < 16; i++) {
        const sx = impX + (rnd(i * 19) - 0.5) * 260;
        const sy = impY + (rnd(i * 23) - 0.5) * 220;
        const sr = 8 + rnd(i * 11) * 16;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(rnd(i * 17) * TAU);
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, -sr); ctx.lineTo(sr * 0.7, sr * 0.6); ctx.lineTo(-sr * 0.7, sr * 0.6);
        ctx.closePath();
        fillStroke(ctx, i % 2 === 0 ? '#38bdf8' : '#ffffff', 2, INK);
        ctx.restore();
      }

      // "CRACK!" Sound Action Burst Banner
      ctx.save();
      ctx.translate(impX + 60, impY - 80);
      ctx.rotate(0.12);
      ctx.fillStyle = PAL.gold;
      ctx.font = '900 48px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = INK; ctx.lineWidth = 8;
      ctx.strokeText('CRACK!', 0, 0);
      ctx.fillText('CRACK!', 0, 0);
      ctx.restore();

      // 6. HUD, Overlays & Narrative Callout
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'REACTION', '[B] MALLET STRIKE', { color: '#ff1744' });
      drawStamp(ctx, 360, 140, 'TARGET', 'CORPSE WRIST JOINT', { color: '#38bdf8' });
      drawArrowCallout(ctx, impX - 110, impY - 140, impX - 30, impY - 20, 'STEEL AUTOPSY TRAY', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, 'Maya ne socha nahi... steel ki autopsy tray utha kar murda kalai par de maari!');
      vignette(ctx, 'rgba(180,0,0,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-02: Frozen Bone Shatters Like Glass
  // The necrotic wrist shatters into crystal shards, releasing Maya's arm
  // =============================================================
  {
    id: 'KF-02',
    title: '0:04-0:07 | Frozen Bone Shatters Like Glass',
    hinglish: 'Barf jaisi jam chuki kalai kanch ki tarah bikhar gayi... Maya azaad!',
    render(ctx) {
      // 1. Background: Red Alert Morgue Corridor & Ruptured Chambers
      drawAutopsyWardSet(ctx, { redAlert: true, floodLevel: 1 });

      // Dissection table askew
      drawDissectionTable(ctx, W * 0.6, 1220, 0.65);

      // 2. Midground: Maya violently wrenching her arm backward
      drawMaya(ctx, W * 0.22, 1080, 1.15, {
        mood: 'shock',
        pose: 'crouch',
        look: [0.8, -0.2],
        sweat: true,
      });

      // Bruised wrist with frostbite burn mark
      ctx.save();
      ctx.translate(W * 0.32, 1140);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.3)';
      ctx.beginPath(); ctx.ellipse(0, 0, 16, 22, 0.4, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();

      // 3. Foreground: Corpse Stump & Severed Fingers Shattering in Mid-Air
      const fx = W * 0.58; const fy = 980;

      // Corpse arm stump snapping back
      ctx.save();
      ctx.translate(fx + 100, fy + 40);
      ctx.fillStyle = '#264653';
      ctx.beginPath();
      ctx.moveTo(120, 30); ctx.lineTo(0, 0); ctx.lineTo(-10, -35); ctx.lineTo(110, -20);
      ctx.closePath();
      fillStroke(ctx, '#264653', 4, INK);
      // Jagged bone snap edge
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-10, -35); ctx.lineTo(-24, -20); ctx.lineTo(-12, -10); ctx.lineTo(-28, 0); ctx.lineTo(0, 0);
      ctx.closePath();
      fillStroke(ctx, '#f8fafc', 3, INK);
      ctx.restore();

      // Falling severed dead fingers (tumbling in 3D perspective)
      [
        [-60, -80, 0.6, 1.2],
        [20, -110, -0.4, 1.0],
        [-10, 40, 1.1, 0.9],
        [80, -30, -0.8, 1.1],
        [-90, 10, 0.3, 0.85],
      ].forEach(([dx, dy, dr, ds]) => {
        ctx.save();
        ctx.translate(fx + dx, fy + dy);
        ctx.rotate(dr);
        ctx.scale(ds, ds);
        // Finger segment
        rrPath(ctx, -12, -24, 24, 48, 6);
        fillStroke(ctx, '#2a9d8f', 3, INK);
        // Blackened claw nail
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-8, -24, 16, 12);
        // Frost crack lines
        ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(-6, -10); ctx.lineTo(6, 10); ctx.stroke();
        ctx.restore();
      });

      // Explosion of cyan frost needles & bone fragments
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * TAU;
        const dist = 60 + rnd(i * 13) * 160;
        const px = fx + Math.cos(a) * dist;
        const py = fy + Math.sin(a) * dist;
        const sz = 6 + rnd(i * 7) * 14;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rnd(i * 29) * TAU);
        ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : (i % 3 === 1 ? '#ffffff' : '#0284c7');
        ctx.beginPath();
        ctx.moveTo(0, -sz); ctx.lineTo(sz * 0.4, sz * 0.8); ctx.lineTo(-sz * 0.4, sz * 0.8);
        ctx.closePath();
        fillStroke(ctx, ctx.fillStyle, 1.8, INK);
        ctx.restore();
      }

      // "SHATTER!" Comic Action Burst
      ctx.save();
      ctx.translate(fx, fy - 140);
      ctx.rotate(-0.08);
      ctx.fillStyle = '#00e5ff';
      ctx.font = '900 52px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = INK; ctx.lineWidth = 8;
      ctx.strokeText('SHATTER!', 0, 0);
      ctx.fillText('SHATTER!', 0, 0);
      ctx.restore();

      // 4. Overturned Autopsy Tray spinning on floor
      ctx.save();
      ctx.translate(W * 0.42, 1340);
      ctx.rotate(0.4);
      rrPath(ctx, -80, -24, 160, 48, 8);
      fillStroke(ctx, '#90a4ae', 3.5, INK);
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'STATUS', 'GRIP SEVERED', { color: '#00e5ff' });
      drawStamp(ctx, 360, 140, 'DAMAGE', 'CRYO FRACTURE', { color: '#ffea00' });
      drawArrowCallout(ctx, fx - 120, fy - 80, fx - 20, fy - 10, 'CRYSTALLIZED BONE SHARDS', { dir: 'right', color: '#00e5ff' });
      drawCaption(ctx, 'Barf jaisi jam chuki kalai kanch ki tarah bikhar gayi... Maya azaad!');
      vignette(ctx, 'rgba(180,0,0,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-03: Chest Dial Strikes 00:00
  // Downward POV into corpse's open Y-incision — the 1970s brass dial detonates
  // =============================================================
  {
    id: 'KF-03',
    title: '0:07-0:10 | Chest Dial Strikes 00:00',
    hinglish: 'Chhati ke andar ka brass dial zero ho chuka tha... detonation shuru!',
    render(ctx) {
      // 1. Dark vignette background
      ctx.fillStyle = '#080c14'; ctx.fillRect(0, 0, W, H);

      // Flashing emergency red alarm sweep
      const redSweep = radGrad(ctx, W * 0.5, H * 0.4, 50, W * 0.8, [
        [0, 'rgba(255, 23, 68, 0.45)'],
        [0.6, 'rgba(180, 0, 0, 0.15)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = redSweep; ctx.fillRect(0, 0, W, H);

      // 2. Visceral POV: Exposed Corpse Chest Cavity & Open Ribcage
      const cx = W * 0.5; const cy = H * 0.48;

      // Cadaver skin flaps (peeled back Y-incision)
      ctx.fillStyle = '#264653';
      ctx.beginPath();
      ctx.moveTo(cx - 320, cy - 320);
      ctx.bezierCurveTo(cx - 150, cy - 250, cx - 180, cy + 280, cx - 340, cy + 340);
      ctx.lineTo(cx + 340, cy + 340);
      ctx.bezierCurveTo(cx + 180, cy + 280, cx + 150, cy - 250, cx + 320, cy - 320);
      ctx.closePath();
      fillStroke(ctx, '#1e3a3a', 6, INK);

      // Broken surgical sutures snapping under tension
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
      for (let s = -220; s < 240; s += 55) {
        // Left broken thread
        ctx.beginPath(); ctx.moveTo(cx - 210, cy + s); ctx.lineTo(cx - 165, cy + s + 12); ctx.stroke();
        // Right broken thread
        ctx.beginPath(); ctx.moveTo(cx + 210, cy + s); ctx.lineTo(cx + 165, cy + s - 10); ctx.stroke();
        // Knot dot
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(cx - 210, cy + s, 3.5, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 210, cy + s, 3.5, 0, TAU); ctx.fill();
      }

      // Exposed metal rib spreaders / retractors
      ctx.fillStyle = '#78909c';
      rrPath(ctx, cx - 215, cy - 120, 24, 240, 4); fillStroke(ctx, '#78909c', 3, INK);
      rrPath(ctx, cx + 191, cy - 120, 24, 240, 4); fillStroke(ctx, '#78909c', 3, INK);

      // 3. The Core Prop: Heavy 1970s Vintage Brass Chronometer Dial
      // Deep inner cavity recess
      ctx.fillStyle = '#0a0a0a';
      ctx.beginPath(); ctx.arc(cx, cy, 175, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#1b1b1b'; ctx.lineWidth = 8; ctx.stroke();

      // Outer heavy brass flange with 8 hex mounting bolts
      ctx.fillStyle = PAL.brass;
      ctx.beginPath(); ctx.arc(cx, cy, 160, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
      for (let b = 0; b < 8; b++) {
        const a = (b / 8) * TAU;
        const bx = cx + Math.cos(a) * 142;
        const by = cy + Math.sin(a) * 142;
        ctx.fillStyle = '#3e2723';
        ctx.beginPath(); ctx.arc(bx, by, 7, 0, TAU); ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
      }

      // Inner beveled dial bezel
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.arc(cx, cy, 125, 0, TAU); ctx.fill();
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4; ctx.stroke();

      // Tumbler Display Window: 00:00:00 (Red LED / Vacuum Fluorescent Glow)
      rrPath(ctx, cx - 105, cy - 42, 210, 84, 8);
      fillStroke(ctx, '#000000', 3.5, '#dc2626');

      // Tumbler rolling number slots
      ctx.fillStyle = '#ff1744';
      ctx.font = '900 44px monospace, "Courier New"';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('00:00:00', cx, cy);

      // Red digital bloom / lens glow
      const dialGlow = radGrad(ctx, cx, cy, 20, 160, [
        [0, 'rgba(255, 23, 68, 0.6)'],
        [0.5, 'rgba(255, 23, 68, 0.25)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = dialGlow;
      ctx.beginPath(); ctx.arc(cx, cy, 160, 0, TAU); ctx.fill();

      // High-pressure steam hissing from side valves
      [-1, 1].forEach((s) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; ctx.lineWidth = 3;
        for (let j = 0; j < 6; j++) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 135, cy - 30 + j * 12);
          ctx.quadraticCurveTo(cx + s * 220, cy - 50 + j * 18, cx + s * 280, cy - 70 + j * 24);
          ctx.stroke();
        }
      });

      // Reflection of Maya's terrified wide eyes in the brass bezel
      ctx.save();
      ctx.translate(cx, cy + 90);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath(); ctx.ellipse(-25, 0, 18, 10, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(25, 0, 18, 10, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.arc(-25, 0, 6, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(25, 0, 6, 0, TAU); ctx.fill();
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'INTERNAL TIMER', '00:00:00 EXPIRED', { color: '#ff1744' });
      drawStamp(ctx, 380, 140, 'CRITICAL', 'DETONATION ACTIVE', { color: '#ffea00' });
      drawArrowCallout(ctx, cx + 130, cy + 120, cx + 50, cy + 30, 'PULSING COUNTDOWN DIAL', { dir: 'left', color: '#ff1744' });
      drawCaption(ctx, 'Chhati ke andar ka brass dial zero ho chuka tha... detonation shuru!');
      vignette(ctx, 'rgba(255,0,0,0.35)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-04: The Volcanic Cryo Blast
  // Ruptured cryo tank explodes, throwing Maya back in supersonic shockwave
  // =============================================================
  {
    id: 'KF-04',
    title: '0:10-0:14 | The Volcanic Cryo Blast',
    hinglish: 'Pura morgue ek volcanic blast ke sath phat pada... chemical tufan!',
    render(ctx) {
      // 1. White-hot center explosion base
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, W, H);

      // Massive volcanic eruption of boiling emerald formalin & nitrogen steam
      const blastX = W * 0.65; const blastY = 820;
      const blastGrad = radGrad(ctx, blastX, blastY, 50, W * 0.9, [
        [0, '#ffffff'],
        [0.2, '#00e676'],
        [0.5, '#00b0ff'],
        [0.8, 'rgba(0, 77, 64, 0.4)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = blastGrad;
      ctx.beginPath(); ctx.arc(blastX, blastY, W * 0.9, 0, TAU); ctx.fill();

      // 2. Ruptured Cryo Chamber frame being torn apart
      ctx.save();
      ctx.translate(blastX, blastY);
      ctx.strokeStyle = '#cfd8dc'; ctx.lineWidth = 14;
      ctx.strokeRect(-120, -320, 240, 640);
      // High-voltage sparks showering from torn cables
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4;
      for (let s = 0; s < 20; s++) {
        const a = (s / 20) * TAU;
        const len = 120 + rnd(s * 17) * 220;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 60, Math.sin(a) * 60);
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Midground: Maya thrown backward through mid-air by supersonic shockwave
      ctx.save();
      ctx.translate(W * 0.24, 1180);
      ctx.rotate(-0.25); // Mid-air recoil angle
      drawMaya(ctx, 0, 0, 1.15, {
        mood: 'scream',
        pose: 'reach',
        look: [0.8, -0.4],
        sweat: true,
      });
      ctx.restore();

      // 4. Foreground: Huge Jagged Shards of Reinforced Cryogenic Glass
      const glassShards = [
        [W * 0.15, 620, 95, 0.4],
        [W * 0.42, 540, 140, -0.6],
        [W * 0.82, 580, 120, 0.8],
        [W * 0.35, 960, 110, -0.2],
        [W * 0.78, 1240, 150, 0.5],
        [W * 0.52, 1380, 130, -0.9],
        [W * 0.12, 1420, 100, 0.3],
      ];
      glassShards.forEach(([gx, gy, gs, gr]) => {
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(gr);
        // Glass facet
        ctx.fillStyle = 'rgba(224, 242, 254, 0.65)';
        ctx.beginPath();
        ctx.moveTo(0, -gs); ctx.lineTo(gs * 0.6, gs * 0.4); ctx.lineTo(-gs * 0.5, gs * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5; ctx.stroke();
        // Refraction edge highlight
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, -gs); ctx.lineTo(-gs * 0.5, gs * 0.8); ctx.stroke();
        ctx.restore();
      });

      // 5. Tidal wave of green coolant washing across floor
      ctx.fillStyle = 'rgba(0, 230, 118, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, H * 0.76);
      ctx.bezierCurveTo(W * 0.3, H * 0.72, W * 0.6, H * 0.80, W, H * 0.74);
      ctx.lineTo(W, H); ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      // "BOOOOM!" Comic Sound Effect
      ctx.save();
      ctx.translate(W * 0.55, 480);
      ctx.rotate(-0.06);
      ctx.fillStyle = '#ffea00';
      ctx.font = '900 68px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = INK; ctx.lineWidth = 10;
      ctx.strokeText('BOOOOM!', 0, 0);
      ctx.fillText('BOOOOM!', 0, 0);
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'ALERT', 'CRYO CHAMBER RUPTURE', { color: '#ff1744' });
      drawStamp(ctx, 400, 140, 'BLAST WAVE', 'SUPERSONIC', { color: '#ffea00' });
      drawArrowCallout(ctx, W * 0.38, 920, W * 0.28, 1080, 'MAYA THROWN BY SHOCKWAVE', { dir: 'left', color: '#ffea00' });
      drawCaption(ctx, 'Pura morgue ek volcanic blast ke sath phat pada... chemical tufan!');
      vignette(ctx, 'rgba(200,0,0,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-05: Blast Wave & Choking Smoke
  // Flooded morgue, toxic green smoke, Maya desperately coughing on floor
  // =============================================================
  {
    id: 'KF-05',
    title: '0:14-0:18 | Blast Wave & Choking Smoke',
    hinglish: 'Khasi... chemical dhuwan... saans lena namumkin ho raha tha!',
    render(ctx) {
      // 1. Background: Flooded Autopsy Ward with heavy red emergency strobe
      drawAutopsyWardSet(ctx, { redAlert: true, floodLevel: 1.5 });

      // Destroyed dissection table knocked askew
      ctx.save();
      ctx.translate(W * 0.7, 1220);
      ctx.rotate(0.35);
      drawDissectionTable(ctx, 0, 0, 0.6);
      ctx.restore();

      // Overturned surgical instruments floating in green chemical water
      ctx.fillStyle = '#cfd8dc';
      [ [180, 1380, 30, 0.4], [520, 1420, 45, -0.5], [750, 1360, 35, 1.1] ].forEach(([ix, iy, ilen, ir]) => {
        ctx.save(); ctx.translate(ix, iy); ctx.rotate(ir);
        ctx.fillRect(-ilen / 2, -3, ilen, 6);
        ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.strokeRect(-ilen / 2, -3, ilen, 6);
        ctx.restore();
      });

      // 2. Rolling multi-layered toxic green and black smoke clouds
      const smokePositions = [
        [140, 680, 190, 'rgba(0, 230, 118, 0.45)'],
        [380, 740, 160, 'rgba(0, 200, 83, 0.4)'],
        [620, 660, 210, 'rgba(0, 230, 118, 0.5)'],
        [840, 720, 180, 'rgba(20, 30, 40, 0.6)'],
        [260, 860, 150, 'rgba(20, 30, 40, 0.55)'],
        [680, 840, 170, 'rgba(0, 230, 118, 0.45)'],
        [460, 780, 200, 'rgba(10, 20, 30, 0.65)'],
      ];
      smokePositions.forEach(([sx, sy, sr, col]) => {
        const smGrad = radGrad(ctx, sx, sy, 20, sr, [
          [0, col],
          [0.6, col.replace('0.', '0.15')],
          [1, 'rgba(0,0,0,0)'],
        ]);
        ctx.fillStyle = smGrad;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
      });

      // Blown fluorescent tube swinging by bare wires, showering sparks
      ctx.save();
      ctx.translate(W * 0.45, 180);
      ctx.rotate(0.2);
      ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-60, -100); ctx.lineTo(-40, 0); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      rrPath(ctx, -80, 0, 160, 12, 3); fillStroke(ctx, '#ffffff', 2, INK);
      // Spark shower
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 2.5;
      for (let sp = 0; sp < 8; sp++) {
        ctx.beginPath();
        ctx.moveTo(30, 10);
        ctx.lineTo(30 + (rnd(sp * 5) - 0.5) * 60, 40 + rnd(sp * 9) * 80);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Midground: Maya knocked down, coughing violently, clutching her throat
      drawMaya(ctx, W * 0.38, 1220, 1.1, {
        mood: 'scared',
        pose: 'crouch',
        look: [0.6, 0.2],
        sweat: true,
      });

      // Coughing shock rings around her mouth
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; ctx.lineWidth = 2;
      for (let cr = 1; cr <= 3; cr++) {
        ctx.beginPath(); ctx.arc(W * 0.44, 1170, cr * 18, -0.4, 0.4); ctx.stroke();
      }

      // "COUGH! COUGH!" Sound Action Callout
      ctx.save();
      ctx.translate(W * 0.56, 1130);
      ctx.rotate(-0.08);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = INK; ctx.lineWidth = 6;
      ctx.strokeText('*COUGH!*', 0, 0);
      ctx.fillText('*COUGH!*', 0, 0);
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'TOXIN LEVEL', 'FORMALIN CRITICAL', { color: '#00e676' });
      drawStamp(ctx, 400, 140, 'OXYGEN', 'DEPLETING FAST', { color: '#ff1744' });
      drawArrowCallout(ctx, W * 0.22, 1160, W * 0.35, 1200, 'CHOKING CHEMICAL SMOKE', { dir: 'right', color: '#00e676' });
      drawCaption(ctx, 'Khasi... chemical dhuwan... saans lena namumkin ho raha tha!');
      vignette(ctx, 'rgba(0,100,50,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-06: Guillotine Airlock Shutdown
  // Massive hydraulic blast door descending like a guillotine blade
  // =============================================================
  {
    id: 'KF-06',
    title: '0:18-0:22 | Guillotine Airlock Shutdown',
    hinglish: 'Airlock ke bhari guillotine darwaze zameen par gir rahe the!',
    render(ctx) {
      // 1. Background: Deep industrial corridor with emergency sirens
      drawMorgueCorridor(ctx, { redAlert: true });

      // Wall warning beacon light sweep
      const sweep = radGrad(ctx, W * 0.5, 300, 20, W * 0.75, [
        [0, 'rgba(255, 23, 68, 0.5)'],
        [0.6, 'rgba(180, 0, 0, 0.15)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = sweep; ctx.fillRect(0, 0, W, H);

      // 2. Giant Hydraulic Blast Door Descending (75% closed)
      const doorTop = 150;
      const doorBottom = H * 0.78;
      const doorH = (doorBottom - doorTop) * 0.75;

      // Heavy hydraulic cylinder pistons on ceiling
      [-1, 1].forEach((s) => {
        const px = W * 0.5 + s * 280;
        // Outer cylinder casing
        ctx.fillStyle = '#263238';
        ctx.fillRect(px - 28, 60, 56, 160);
        ctx.strokeStyle = INK; ctx.lineWidth = 4;
        ctx.strokeRect(px - 28, 60, 56, 160);
        // Polished chrome hydraulic rod extending down
        ctx.fillStyle = '#eceff1';
        ctx.fillRect(px - 14, 180, 28, 120);
        ctx.strokeStyle = INK; ctx.lineWidth = 3;
        ctx.strokeRect(px - 14, 180, 28, 120);
        // High pressure steam jet
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2.5;
        for (let j = 0; j < 5; j++) {
          ctx.beginPath();
          ctx.moveTo(px + s * 24, 210 + j * 8);
          ctx.lineTo(px + s * 80, 200 + j * 14);
          ctx.stroke();
        }
      });

      // Blast door body
      ctx.save();
      ctx.translate(W * 0.5, 0);
      const dw = W * 0.78;
      ctx.fillStyle = linGrad(ctx, -dw / 2, doorTop, dw / 2, doorTop + doorH, [
        [0, '#1c2833'],
        [0.5, '#37474f'],
        [1, '#212f3d'],
      ]);
      ctx.fillRect(-dw / 2, doorTop, dw, doorH);
      ctx.strokeStyle = INK; ctx.lineWidth = 7;
      ctx.strokeRect(-dw / 2, doorTop, dw, doorH);

      // Horizontal steel I-beam ribs
      ctx.strokeStyle = 'rgba(120, 144, 156, 0.4)'; ctx.lineWidth = 4;
      for (let ry = doorTop + 70; ry < doorTop + doorH - 50; ry += 85) {
        ctx.beginPath(); ctx.moveTo(-dw / 2 + 20, ry); ctx.lineTo(dw / 2 - 20, ry); ctx.stroke();
      }

      // Yellow & Black Hazard Stripes on blade edge
      const edgeY = doorTop + doorH - 40;
      for (let s = -dw / 2; s < dw / 2; s += 45) {
        ctx.fillStyle = (Math.floor(s / 45) % 2 === 0) ? PAL.gold : '#111';
        ctx.fillRect(s, edgeY, 45, 40);
      }
      ctx.strokeStyle = INK; ctx.lineWidth = 4;
      ctx.strokeRect(-dw / 2, edgeY, dw, 40);

      // Grinding friction sparks where door slides against side wall tracks
      [-dw / 2, dw / 2].forEach((sx) => {
        ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3.5;
        for (let sp = 0; sp < 12; sp++) {
          ctx.beginPath();
          ctx.moveTo(sx, edgeY + 20);
          ctx.lineTo(sx + (sx < 0 ? 1 : -1) * (20 + rnd(sp * 7) * 60), edgeY + 20 + (rnd(sp * 11) - 0.5) * 80);
          ctx.stroke();
        }
      });
      ctx.restore();

      // 3. Flashing warning display above door: "CONTAINMENT FAILURE"
      rrPath(ctx, W * 0.28, doorTop - 60, W * 0.44, 44, 6);
      fillStroke(ctx, '#000000', 3, '#ff1744');
      ctx.fillStyle = '#ff1744';
      ctx.font = '900 18px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚠ SECTOR LOCKDOWN ⚠', W * 0.5, doorTop - 38);

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'EMERGENCY PROTOCOL', 'SECTOR 4 LOCKDOWN', { color: '#ff1744' });
      drawStamp(ctx, 420, 140, 'DOOR CLEARANCE', 'CLOSING: 1.5 M/S', { color: '#ffea00' });
      drawArrowCallout(ctx, W * 0.5 + 220, doorTop + doorH - 20, W * 0.5 + 320, doorTop + doorH + 50, 'HYDRAULIC GUILLOTINE', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, 'Airlock ke bhari guillotine darwaze zameen par gir rahe the!');
      vignette(ctx, 'rgba(150,0,0,0.35)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-07: The Desperate Corridor Sprint
  // Dynamic Dutch-angle sprint through flooded corridor toward the lift beacon
  // =============================================================
  {
    id: 'KF-07',
    title: '0:22-0:26 | The Desperate Corridor Sprint',
    hinglish: 'Maya ne aage dekha... aakhri darwaza band ho raha tha, peeche mout thi!',
    render(ctx) {
      // 1. Background: Corridor with deep 1-point perspective & Dutch angle
      drawMorgueCorridor(ctx, { redAlert: true });

      // Warm Golden Elevator Cab at end of corridor (the survival beacon!)
      ctx.save();
      ctx.translate(W * 0.5, 480);
      const beaconGlow = radGrad(ctx, 0, 0, 10, 240, [
        [0, 'rgba(255, 236, 179, 0.8)'],
        [0.4, 'rgba(255, 193, 7, 0.35)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = beaconGlow;
      ctx.beginPath(); ctx.arc(0, 0, 240, 0, TAU); ctx.fill();

      // Open elevator door frame in distance
      ctx.fillStyle = PAL.gold;
      ctx.fillRect(-45, -75, 90, 150);
      ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.strokeRect(-45, -75, 90, 150);
      // Floor indicator above cab glowing "1"
      ctx.fillStyle = '#ff1744';
      ctx.beginPath(); ctx.arc(0, -90, 12, 0, TAU); ctx.fill();
      ctx.restore();

      // 2. Flooded corridor floor with heavy water reflections
      const flY = H * 0.68;
      ctx.fillStyle = 'rgba(0, 200, 83, 0.2)';
      ctx.fillRect(0, flY, W, H - flY);

      // 3. Midground: Maya in extreme sprint forward-lean (high speed)
      ctx.save();
      ctx.translate(W * 0.44, 1160);
      drawMaya(ctx, 0, 0, 1.22, {
        mood: 'scream',
        pose: 'run',
        look: [0.3, -0.4],
        sweat: true,
      });
      ctx.restore();

      // Trailing speed blur lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; ctx.lineWidth = 3;
      for (let s = 0; s < 8; s++) {
        const sy = 1020 + s * 40;
        ctx.beginPath(); ctx.moveTo(W * 0.1, sy); ctx.lineTo(W * 0.35, sy); ctx.stroke();
      }

      // 4. Foreground: Violent water spray kicked up by sneakers
      ctx.save();
      ctx.translate(W * 0.48, 1380);
      // High-speed water sheets spraying outward
      ctx.fillStyle = 'rgba(224, 242, 254, 0.7)';
      for (let w = 0; w < 32; w++) {
        const a = (w / 32) * Math.PI + Math.PI;
        const spd = 40 + rnd(w * 13) * 110;
        const wx = Math.cos(a) * spd * 1.6;
        const wy = Math.sin(a) * spd * 0.7;
        const wr = 3 + rnd(w * 7) * 7;
        ctx.beginPath(); ctx.arc(wx, wy, wr, 0, TAU); ctx.fill();
      }
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'SPRINT SPEED', '18.4 KM/H', { color: '#ffea00' });
      drawStamp(ctx, 400, 140, 'TARGET', 'THE FREE LIFT', { color: '#00e5ff' });
      drawArrowCallout(ctx, W * 0.5 + 80, 480, W * 0.5 + 160, 420, 'ELEVATOR BEACON', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, 'Maya ne aage dekha... aakhri darwaza band ho raha tha, peeche mout thi!');
      vignette(ctx, 'rgba(180,0,0,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-08: The Sliding Feet-First Dive
  // Heart-stopping 2-inch clearance under descending steel guillotine blade
  // =============================================================
  {
    id: 'KF-08',
    title: '0:26-0:30 | The Sliding Feet-First Dive',
    hinglish: 'Aakhri darwaza band hone mein sirf do inch bache the... Maya ne dive maari!',
    render(ctx) {
      // 1. Dark industrial base
      ctx.fillStyle = '#0a0d14'; ctx.fillRect(0, 0, W, H);

      // Red emergency background strobe
      const bgStrobe = radGrad(ctx, W * 0.5, 400, 20, W * 0.8, [
        [0, 'rgba(255, 23, 68, 0.45)'],
        [0.6, 'rgba(160, 0, 0, 0.15)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = bgStrobe; ctx.fillRect(0, 0, W, H);

      // 2. The Descending Blast Door — only 140px gap remaining above floor!
      const doorTop = 100;
      const floorY = H * 0.74;
      const bladeY = floorY - 140; // razor-thin clearance!

      // Door upper body
      ctx.fillStyle = linGrad(ctx, 60, doorTop, W - 60, bladeY, [
        [0, '#1c2833'],
        [0.5, '#37474f'],
        [1, '#212f3d'],
      ]);
      ctx.fillRect(60, doorTop, W - 120, bladeY - doorTop);
      ctx.strokeStyle = INK; ctx.lineWidth = 8;
      ctx.strokeRect(60, doorTop, W - 120, bladeY - doorTop);

      // Steel reinforcement ribs
      ctx.strokeStyle = 'rgba(120,144,156,0.35)'; ctx.lineWidth = 4;
      for (let ry = doorTop + 60; ry < bladeY - 40; ry += 75) {
        ctx.beginPath(); ctx.moveTo(80, ry); ctx.lineTo(W - 80, ry); ctx.stroke();
      }

      // Yellow & black hazard stripes on bottom edge
      for (let s = 60; s < W - 60; s += 40) {
        ctx.fillStyle = (Math.floor(s / 40) % 2 === 0) ? PAL.gold : '#111';
        ctx.fillRect(s, bladeY - 35, 40, 35);
      }
      ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
      ctx.strokeRect(60, bladeY - 35, W - 120, 35);

      // 3. Wet concrete floor reflecting amber elevator light ahead
      ctx.fillStyle = linGrad(ctx, 0, floorY, 0, H, [
        [0, '#37474f'],
        [0.4, '#263238'],
        [1, '#1c2833'],
      ]);
      ctx.fillRect(0, floorY, W, H - floorY);

      // Warm golden elevator threshold light waiting just past the door
      const thresholdGlow = linGrad(ctx, 0, floorY, W, floorY, [
        [0, 'rgba(255, 236, 179, 0.6)'],
        [0.5, 'rgba(255, 193, 7, 0.4)'],
        [1, 'rgba(255, 236, 179, 0.6)'],
      ]);
      ctx.fillStyle = thresholdGlow;
      ctx.fillRect(0, floorY - 10, W, 25);

      // 4. Midground / Foreground: Maya sliding flat on her back, feet-first!
      ctx.save();
      ctx.translate(W * 0.52, floorY - 35);
      ctx.rotate(-0.06); // Sliding horizontal angle

      // Sliding legs & sneakers entering elevator threshold
      ctx.fillStyle = '#1e3a8a'; // Jeans
      rrPath(ctx, 40, -15, 180, 36, 8); fillStroke(ctx, '#1e3a8a', 4, INK);
      // Sneakers (white with red accents)
      rrPath(ctx, 190, -20, 55, 34, 10); fillStroke(ctx, '#ffffff', 3.5, INK);
      ctx.fillStyle = '#dc2626'; ctx.fillRect(205, -12, 16, 18);

      // Torso & Blue Denim Jacket skimming floor
      rrPath(ctx, -140, -25, 190, 48, 12); fillStroke(ctx, '#2563eb', 4.5, INK);

      // Head & dark hair whipping back along wet floor
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(-175, -5, 28, 0, TAU); ctx.fill();
      // Hair trailing behind on wet concrete
      ctx.beginPath();
      ctx.moveTo(-185, -20); ctx.lineTo(-260, 5); ctx.lineTo(-210, 15); ctx.closePath();
      ctx.fill();

      // Face looking up in terror at descending steel blade
      ctx.fillStyle = '#f5d0b5';
      ctx.beginPath(); ctx.ellipse(-165, -10, 18, 16, -0.2, 0, TAU); ctx.fill();
      // Wide terrified eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-162, -14, 6, 0, TAU); ctx.fill();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-161, -15, 3, 0, TAU); ctx.fill();
      // Open panting mouth
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(-156, -6, 5, 0, Math.PI); ctx.stroke();
      ctx.restore();

      // 5. Grinding Orange Sparks skimming her chest and sneakers
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3.5;
      for (let sp = 0; sp < 22; sp++) {
        const sx = W * 0.45 + (rnd(sp * 17) - 0.5) * 320;
        const sy = bladeY + 10 + rnd(sp * 13) * 35;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 30 + rnd(sp * 7) * 50, sy + (rnd(sp * 11) - 0.5) * 30);
        ctx.stroke();
      }

      // "SLIIIDE!" Comic Sound Effect
      ctx.save();
      ctx.translate(W * 0.48, bladeY - 80);
      ctx.fillStyle = PAL.gold;
      ctx.font = '900 52px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = INK; ctx.lineWidth = 8;
      ctx.strokeText('SLIIIDE!', 0, 0);
      ctx.fillText('SLIIIDE!', 0, 0);
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'CLEARANCE', '2 INCHES REMAINING', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'MANEUVER', 'FEET-FIRST DIVE', { color: '#00e5ff' });
      drawArrowCallout(ctx, W * 0.5 - 40, bladeY + 40, W * 0.5 - 120, bladeY - 40, 'STEEL BLADE SKIMMING CHEST', { dir: 'left', color: '#ffea00' });
      drawCaption(ctx, 'Aakhri darwaza band hone mein sirf do inch bache the... Maya ne dive maari!');
      vignette(ctx, 'rgba(255,100,0,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-09: Doors Slam Shut Inside Cab
  // Maya collapsed panting on elevator floor as heavy bronze doors CLANG shut
  // =============================================================
  {
    id: 'KF-09',
    title: '0:30-0:34 | Doors Slam Shut Inside Cab',
    hinglish: 'CLANG! Darwaze band hue... dhuwan bahar hi ruk gaya. Maya bach gayi?',
    render(ctx) {
      // 1. Elevator Interior Backdrop (Art Deco Mahogany & Brass)
      drawElevatorCab(ctx, { lightFlicker: 0.1 });

      // Warm 1920s incandescent chandelier glow inside cab
      const cabGlow = radGrad(ctx, W * 0.5, 300, 20, W * 0.8, [
        [0, 'rgba(255, 236, 179, 0.6)'],
        [0.5, 'rgba(255, 193, 7, 0.22)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = cabGlow; ctx.fillRect(0, 0, W, H);

      // 2. Heavy Vintage Bronze Doors Shutting with Massive CLANG
      const doorW = W * 0.44;
      // Left bronze door
      ctx.fillStyle = linGrad(ctx, 40, 200, 40 + doorW, H * 0.75, [
        [0, '#5d4037'], [0.5, '#4e342e'], [1, '#3e2723']
      ]);
      ctx.fillRect(40, 200, doorW, H * 0.58);
      ctx.strokeStyle = PAL.brass; ctx.lineWidth = 5;
      ctx.strokeRect(40, 200, doorW, H * 0.58);

      // Right bronze door
      ctx.fillRect(W - 40 - doorW, 200, doorW, H * 0.58);
      ctx.strokeRect(W - 40 - doorW, 200, doorW, H * 0.58);

      // Center seam & Heavy steel locking deadbolts
      const seamX = W * 0.5;
      ctx.fillStyle = '#263238';
      [420, 680, 940].forEach((dy) => {
        rrPath(ctx, seamX - 35, dy - 18, 70, 36, 6);
        fillStroke(ctx, '#37474f', 3, INK);
        ctx.fillStyle = PAL.gold;
        ctx.beginPath(); ctx.arc(seamX, dy, 6, 0, TAU); ctx.fill();
      });

      // Wired safety glass observation window on door: green smoke trapped outside!
      const winW = 160; const winH = 240; const winY = 280;
      ctx.fillStyle = 'rgba(0, 230, 118, 0.55)'; // Toxic green outside
      ctx.fillRect(seamX - winW / 2, winY, winW, winH);
      ctx.strokeStyle = '#263238'; ctx.lineWidth = 6;
      ctx.strokeRect(seamX - winW / 2, winY, winW, winH);
      // Wire mesh inside glass
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1.5;
      for (let wx = seamX - winW / 2 + 15; wx < seamX + winW / 2; wx += 20) {
        ctx.beginPath(); ctx.moveTo(wx, winY); ctx.lineTo(wx, winY + winH); ctx.stroke();
      }
      for (let wy = winY + 15; wy < winY + winH; wy += 20) {
        ctx.beginPath(); ctx.moveTo(seamX - winW / 2, wy); ctx.lineTo(seamX + winW / 2, wy); ctx.stroke();
      }

      // 3. Maya collapsed against floor wainscoting, panting heavily
      drawMaya(ctx, W * 0.35, 1260, 1.15, {
        mood: 'scared',
        pose: 'crouch',
        look: [0.5, -0.3],
        sweat: true,
      });

      // Heavy breathing / relief sweat drops
      ctx.fillStyle = '#38bdf8';
      [ [W * 0.42, 1200, 4], [W * 0.44, 1215, 3.5], [W * 0.40, 1225, 4.5] ].forEach(([sx, sy, sr]) => {
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
      });

      // "CLANG!" Sound Action Text
      ctx.save();
      ctx.translate(seamX, 220);
      ctx.fillStyle = PAL.brass;
      ctx.font = '900 64px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = INK; ctx.lineWidth = 9;
      ctx.strokeText('CLANG!', 0, 0);
      ctx.fillText('CLANG!', 0, 0);
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'CABIN STATUS', 'SEALED & PRESSURIZED', { color: '#00e676' });
      drawStamp(ctx, 420, 140, 'ATMOSPHERE', 'TOXIN CONTAINED OUTSIDE', { color: '#ffea00' });
      drawArrowCallout(ctx, seamX - 80, winY + winH / 2, seamX - 160, winY + winH / 2 + 60, 'TOXIC SMOKE TRAPPED', { dir: 'left', color: '#00e676' });
      drawCaption(ctx, 'CLANG! Darwaze band hue... dhuwan bahar hi ruk gaya. Maya bach gayi?');
      vignette(ctx, 'rgba(0,0,0,0.4)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-10: Punching Button "1"
  // Macro Art Deco brass elevator button panel — bruised fist punches Button "1"
  // =============================================================
  {
    id: 'KF-10',
    title: '0:34-0:38 | Punching Button "1"',
    hinglish: 'Kaanpte haathon se Maya ne Button 1 par thappad maar diya!',
    render(ctx) {
      // 1. Dark elevator cab interior base
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);

      // 2. High-Detail Art Deco Brushed-Brass Panel Frame
      const px = W * 0.5; const py = H * 0.46;
      const pw = 520; const ph = 880;

      // Heavy cast brass faceplate
      rrPath(ctx, px - pw / 2, py - ph / 2, pw, ph, 28);
      fillStroke(ctx, linGrad(ctx, px - pw / 2, py - ph / 2, px + pw / 2, py + ph / 2, [
        [0, '#ffd54f'],
        [0.3, '#ffb300'],
        [0.7, '#ff8f00'],
        [1, '#b45309'],
      ]), 7, INK);

      // Engraved filigree border trim
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 3;
      rrPath(ctx, px - pw / 2 + 20, py - ph / 2 + 20, pw - 40, ph - 40, 18);
      ctx.stroke();

      // Corner hex bolts on brass plate
      [
        [-pw / 2 + 35, -ph / 2 + 35], [pw / 2 - 35, -ph / 2 + 35],
        [-pw / 2 + 35, ph / 2 - 35], [pw / 2 - 35, ph / 2 - 35]
      ].forEach(([bx, by]) => {
        ctx.fillStyle = '#451a03';
        ctx.beginPath(); ctx.arc(px + bx, py + by, 10, 0, TAU); ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
      });

      // 3. Button "13" (Top) — Demonic Crimson Glow with Hairline Fracture Crack
      const b13Y = py - 180;
      // Crimson radial bloom
      const b13Glow = radGrad(ctx, px, b13Y, 20, 160, [
        [0, 'rgba(255, 23, 68, 0.75)'],
        [0.6, 'rgba(213, 0, 0, 0.3)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = b13Glow;
      ctx.beginPath(); ctx.arc(px, b13Y, 160, 0, TAU); ctx.fill();

      // Button 13 brass bezel & glass dome
      ctx.fillStyle = PAL.brass;
      ctx.beginPath(); ctx.arc(px, b13Y, 80, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(px, b13Y, 68, 0, TAU); ctx.fill();

      // Number "13"
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 62px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('13', px, b13Y);

      // Hairline fracture crack across Button 13 glass
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px - 50, b13Y - 30);
      ctx.lineTo(px - 10, b13Y - 5);
      ctx.lineTo(px + 20, b13Y - 25);
      ctx.lineTo(px + 55, b13Y + 35);
      ctx.stroke();

      // 4. Button "1" (Bottom) — Target being slammed, Radiant Amber Starburst
      const b1Y = py + 160;

      // Golden starburst impact flare
      const b1Glow = radGrad(ctx, px, b1Y, 30, 220, [
        [0, 'rgba(255, 255, 255, 0.95)'],
        [0.3, 'rgba(255, 238, 88, 0.8)'],
        [0.7, 'rgba(255, 179, 0, 0.3)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = b1Glow;
      ctx.beginPath(); ctx.arc(px, b1Y, 220, 0, TAU); ctx.fill();

      // Button 1 brass bezel & illuminated dome
      ctx.fillStyle = PAL.brass;
      ctx.beginPath(); ctx.arc(px, b1Y, 85, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = '#ffb300';
      ctx.beginPath(); ctx.arc(px, b1Y, 72, 0, TAU); ctx.fill();

      // Number "1"
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 74px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('1', px, b1Y);

      // 5. Foreground: Maya's Bruised Hand Slamming onto Button "1"
      ctx.save();
      ctx.translate(px + 80, b1Y + 40);
      ctx.rotate(-0.2);

      // Blue denim jacket cuff
      ctx.fillStyle = '#2563eb';
      rrPath(ctx, 40, -40, 90, 80, 10);
      fillStroke(ctx, '#2563eb', 4, INK);

      // Hand palm & fingers pressing button
      drawHand(ctx, 0, 0, 1.45, {
        fingerBend: 0.7,
        pointing: true,
      });

      // Bruised knuckles & floor scrape dirt
      ctx.fillStyle = 'rgba(180, 0, 0, 0.35)';
      ctx.beginPath(); ctx.arc(-20, -10, 16, 0, TAU); ctx.fill();
      ctx.fillStyle = '#424242';
      ctx.beginPath(); ctx.ellipse(-15, 12, 10, 4, 0.2, 0, TAU); ctx.fill();
      ctx.restore();

      // "CLICK!" Sound Burst
      ctx.save();
      ctx.translate(px - 140, b1Y - 60);
      ctx.rotate(-0.15);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = INK; ctx.lineWidth = 8;
      ctx.strokeText('CLICK!', 0, 0);
      ctx.fillText('CLICK!', 0, 0);
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'SELECTION', 'FLOOR 1 (LOBBY)', { color: '#ffea00' });
      drawStamp(ctx, 400, 140, 'ANOMALY', 'FLOOR 13 OVERRIDE', { color: '#ff1744' });
      drawArrowCallout(ctx, px + 210, b1Y, px + 100, b1Y, 'PUNCHING BUTTON 1', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, 'Kaanpte haathon se Maya ne Button 1 par thappad maar diya!');
      vignette(ctx, 'rgba(0,0,0,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-11: High-Speed Elevator Descent
  // Violent negative G-forces — hair floating, spinning reverse floor dial
  // =============================================================
  {
    id: 'KF-11',
    title: '0:38-0:42 | High-Speed Elevator Descent',
    hinglish: 'Lift aam tareeqe se nahi giri... aasmaan se paatal ki taraf girne lagi!',
    render(ctx) {
      // 1. Elevator interior with vertical speed streaks
      drawElevatorCab(ctx, { lightFlicker: 0.35 });

      // Vertical speed blur streaks rushing upward along walls
      ctx.strokeStyle = 'rgba(255, 236, 179, 0.45)'; ctx.lineWidth = 4;
      for (let s = 0; s < 18; s++) {
        const sx = 80 + rnd(s * 17) * (W - 160);
        const sy = 100 + rnd(s * 23) * (H - 300);
        const slen = 80 + rnd(s * 11) * 160;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + slen); ctx.stroke();
      }

      // 2. Semicircular Brass Floor Indicator Dial (Top Center)
      const dialX = W * 0.5; const dialY = 240;
      ctx.fillStyle = PAL.brass;
      ctx.beginPath(); ctx.arc(dialX, dialY, 95, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = '#fffde7';
      ctx.beginPath(); ctx.arc(dialX, dialY, 82, Math.PI, 0); ctx.fill();

      // Floor numbers around arc (1 to 13)
      for (let fn = 1; fn <= 13; fn++) {
        const a = Math.PI + ((fn - 1) / 12) * Math.PI;
        const fx = dialX + Math.cos(a) * 65;
        const fy = dialY + Math.sin(a) * 65;
        ctx.fillStyle = fn === 13 ? '#dc2626' : (fn === 1 ? '#d97706' : '#5d4037');
        ctx.font = '900 12px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(fn.toString(), fx, fy);
      }

      // Spinning indicator needle (blurring backwards from 13 down past 6)
      ctx.save();
      ctx.translate(dialX, dialY);
      ctx.rotate(-0.85); // spinning counter-clockwise
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-4, 0); ctx.lineTo(0, -78); ctx.lineTo(4, 0); ctx.closePath();
      ctx.fill();
      // Motion blur needle ghost
      ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
      ctx.beginPath();
      ctx.moveTo(-12, 0); ctx.lineTo(-15, -74); ctx.lineTo(15, -74); ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Maya clutching the brass handrail — negative G-force floating hair & jacket
      ctx.save();
      ctx.translate(W * 0.44, 1140);

      // Negative G-force hair floating straight up!
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, -90, 48, 0, TAU);
      // Floating spikes upward
      ctx.moveTo(-45, -90); ctx.lineTo(-30, -180); ctx.lineTo(-10, -110);
      ctx.lineTo(15, -195); ctx.lineTo(25, -100); ctx.lineTo(45, -170); ctx.lineTo(45, -90);
      ctx.closePath();
      fillStroke(ctx, '#1e293b', 4, INK);

      // Body & Face looking up at dial in vertigo panic
      drawMaya(ctx, 0, 0, 1.18, {
        mood: 'scream',
        pose: 'reach',
        look: [0, -0.8],
        sweat: true,
      });
      ctx.restore();

      // Handrail grip
      ctx.fillStyle = PAL.brass;
      rrPath(ctx, W * 0.15, 1180, W * 0.7, 24, 6); fillStroke(ctx, PAL.brass, 3.5, INK);

      // Swaying light bulb on brass chain
      ctx.save();
      ctx.translate(W * 0.5, 90);
      ctx.rotate(0.35); // swaying violently
      ctx.strokeStyle = PAL.brass; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 70); ctx.stroke();
      ctx.fillStyle = '#fff59d';
      ctx.beginPath(); ctx.arc(0, 85, 18, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'DESCENT VELOCITY', '-16.8 M/S', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'G-FORCE', '-0.6 G (ZERO WEIGHT)', { color: '#00e5ff' });
      drawArrowCallout(ctx, dialX - 110, dialY, dialX - 200, dialY + 60, 'DIAL REVERSING RAPIDLY', { dir: 'left', color: '#ffea00' });
      drawCaption(ctx, 'Lift aam tareeqe se nahi giri... aasmaan se paatal ki taraf girne lagi!');
      vignette(ctx, 'rgba(0,0,0,0.45)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-12: Golden Chime & Morning Daylight
  // Doors glide open — blinding morning sunlight floods in from 1978 rotunda
  // =============================================================
  {
    id: 'KF-12',
    title: '0:42-0:46 | Golden Chime & Morning Daylight',
    hinglish: 'DING! Darwaze khule... aur saamne subah ki sunhari dhoop thi!',
    render(ctx) {
      // 1. Grand Sunlit Hospital Rotunda Background
      drawHospitalLobbySet(ctx, { redAlert: false, sunlight: true });

      // 2. Open Elevator Threshold (Center)
      const cabX = W * 0.5; const cabY = 700;
      const doorGap = 420;

      // Parted brass elevator doors (left & right)
      ctx.fillStyle = PAL.brass;
      ctx.fillRect(cabX - doorGap / 2 - 120, 320, 120, 680);
      ctx.strokeStyle = INK; ctx.lineWidth = 6;
      ctx.strokeRect(cabX - doorGap / 2 - 120, 320, 120, 680);

      ctx.fillRect(cabX + doorGap / 2, 320, 120, 680);
      ctx.strokeRect(cabX + doorGap / 2, 320, 120, 680);

      // Ornate carved header transom
      rrPath(ctx, cabX - doorGap / 2 - 140, 270, doorGap + 280, 60, 8);
      fillStroke(ctx, PAL.woodDark, 4, INK);

      // Art Deco Chime Bell above door with ringing sound waves
      ctx.fillStyle = PAL.gold;
      ctx.beginPath(); ctx.arc(cabX, 290, 22, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();

      // "DING~~~!" Sound Callout Rings
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3;
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath(); ctx.arc(cabX, 290, 30 + r * 22, 0, TAU); ctx.stroke();
      }

      ctx.save();
      ctx.translate(cabX, 210);
      ctx.fillStyle = PAL.gold;
      ctx.font = '900 48px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = INK; ctx.lineWidth = 8;
      ctx.strokeText('DING~~~!', 0, 0);
      ctx.fillText('DING~~~!', 0, 0);
      ctx.restore();

      // 3. Blinding Golden Sunbeam streaming across threshold
      const sunburst = radGrad(ctx, cabX, 580, 50, 500, [
        [0, 'rgba(255, 255, 255, 0.95)'],
        [0.3, 'rgba(255, 236, 179, 0.75)'],
        [0.7, 'rgba(255, 213, 79, 0.3)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = sunburst;
      ctx.beginPath(); ctx.arc(cabX, 580, 500, 0, TAU); ctx.fill();

      // 4. Maya standing at the elevator threshold, shielding her squinting eyes
      ctx.save();
      ctx.translate(cabX, 1120);
      drawMaya(ctx, 0, 0, 1.2, {
        mood: 'shock',
        pose: 'reach',
        look: [0.2, -0.4],
        sweat: false,
      });

      // Raised arm shielding eyes from morning light
      ctx.fillStyle = '#2563eb'; // blue jacket arm
      rrPath(ctx, -15, -120, 32, 70, 8); fillStroke(ctx, '#2563eb', 3.5, INK);
      ctx.fillStyle = '#f5d0b5';
      ctx.beginPath(); ctx.arc(2, -125, 12, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();

      // Terrazzo floor tile reflections
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath(); ctx.ellipse(cabX, 1380, 220, 45, 0, 0, TAU); ctx.fill();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'ARRIVAL', 'GROUND LEVEL ROTUNDA', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'ATMOSPHERE', 'WARM MORNING SUNLIGHT', { color: '#00e5ff' });
      drawArrowCallout(ctx, cabX + 180, 540, cabX + 80, 620, 'SUNLIT ROTUNDA BEYOND', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, 'DING! Darwaze khule... aur saamne subah ki sunhari dhoop thi!');
      vignette(ctx, 'rgba(255,200,50,0.15)');
      filmGrainOverlay(ctx, 0.04);
    },
  },

  // =============================================================
  // KF-13: The Bustling 1978 Hospital Lobby
  // 1970s nurses, doctors, orderlies, potted palms — Maya stands in shock
  // =============================================================
  {
    id: 'KF-13',
    title: '0:46-0:50 | The Bustling 1978 Hospital Lobby',
    hinglish: 'Charon taraf doctors aur nurses ghoom rahe the... ye 2026 nahi, 1978 tha!',
    render(ctx) {
      // 1. Grand Hospital Lobby Architecture
      drawHospitalLobbySet(ctx, { redAlert: false, sunlight: true });

      // Checkered marble floor with high polish reflection
      const flY = H * 0.65;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(0, flY, W, H - flY);

      // Potted Boston Ferns on Brass Pedestals (Left & Right background)
      [W * 0.1, W * 0.9].forEach((px) => {
        // Brass urn
        ctx.fillStyle = PAL.brass;
        rrPath(ctx, px - 28, flY - 60, 56, 65, 8); fillStroke(ctx, PAL.brass, 3, INK);
        // Lush green fern fronds
        ctx.fillStyle = '#2e7d32';
        for (let f = 0; f < 10; f++) {
          const fa = (f / 10) * Math.PI + Math.PI;
          ctx.beginPath();
          ctx.moveTo(px, flY - 55);
          ctx.quadraticCurveTo(px + Math.cos(fa) * 55, flY - 95, px + Math.cos(fa) * 75, flY - 65);
          ctx.stroke();
        }
      });

      // Directional Wall Signage: "PATHOLOGY WING ->"
      rrPath(ctx, W * 0.68, 380, 180, 48, 4);
      fillStroke(ctx, '#0f172a', 2.5, PAL.gold);
      ctx.fillStyle = PAL.gold;
      ctx.font = '900 12px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('PATHOLOGY WING →', W * 0.68 + 90, 404);

      // 2. Staff Member 1: 1970s Nurse with Winged Cap & Clipboard (Midground Left)
      drawHospitalStaffMember(ctx, W * 0.26, 920, 1.05, 'nurse', {
        look: [0.5, 0],
        facing: 1,
      });

      // 3. Staff Member 2: 1970s Doctor in White Coat & Tie with Stethoscope (Midground Right)
      drawHospitalStaffMember(ctx, W * 0.74, 910, 1.1, 'doctor', {
        look: [-0.6, 0.1],
        facing: -1,
      });

      // 4. Background Orderly rolling chrome gurney with patient
      ctx.save();
      ctx.translate(W * 0.52, 740);
      // Chrome gurney frame
      ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 3;
      ctx.strokeRect(-70, -15, 140, 25);
      // Wheels
      ctx.fillStyle = '#37474f';
      ctx.beginPath(); ctx.arc(-55, 18, 8, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(55, 18, 8, 0, TAU); ctx.fill();
      // Patient covered in pastel wool blanket
      ctx.fillStyle = '#a7f3d0';
      rrPath(ctx, -65, -30, 130, 20, 6); fillStroke(ctx, '#a7f3d0', 2, INK);
      ctx.restore();

      // 5. Maya in Modern Blue Jacket & Jeans in Center (Temporal Anomaly)
      drawMaya(ctx, W * 0.5, 1140, 1.25, {
        mood: 'shock',
        pose: 'reach',
        look: [-0.5, -0.2],
        sweat: true,
      });

      // Temporal visual shimmer around Maya
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'; ctx.lineWidth = 2.5;
      for (let s = 0; s < 6; s++) {
        const sy = 960 + s * 45;
        ctx.beginPath(); ctx.moveTo(W * 0.38, sy); ctx.lineTo(W * 0.62, sy); ctx.stroke();
      }

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'LOCATION', 'MILLBROOK ROTUNDA', { color: '#00e5ff' });
      drawStamp(ctx, 400, 140, 'YEAR CONFIRMED', 'OCTOBER 24, 1978', { color: '#ffea00' });
      drawArrowCallout(ctx, W * 0.26 + 30, 850, W * 0.26 + 120, 810, '1970s WINGED NURSE', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, 'Charon taraf doctors aur nurses ghoom rahe the... ye 2026 nahi, 1978 tha!');
      vignette(ctx, 'rgba(0,0,0,0.25)');
      filmGrainOverlay(ctx, 0.04);
    },
  },

  // =============================================================
  // KF-14: The Reception Desk & Typewriter
  // Master Over-The-Shoulder shot: Farrah Fawcett waves, cat-eye glasses, key cubby
  // =============================================================
  {
    id: 'KF-14',
    title: '0:50-0:54 | The Reception Desk & Typewriter',
    hinglish: 'Good morning, Dr. Maya! Naya specimen aapka wait kar raha hai!',
    render(ctx) {
      // 1. Full 1978 Hospital Lobby Architectural Backdrop
      drawHospitalLobbySet(ctx, { redAlert: false, sunlight: true });

      // 2. Staff On-Duty Board (Background Left)
      const boardX = W * 0.18; const boardY = 280;
      rrPath(ctx, boardX - 85, boardY - 60, 170, 160, 6);
      fillStroke(ctx, '#3e2723', 3.5, INK);
      ctx.fillStyle = PAL.gold;
      ctx.font = '900 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('STAFF ON DUTY • 1978', boardX, boardY - 42);
      ctx.fillStyle = '#fffde7';
      ctx.font = '600 8px Inter, sans-serif';
      ctx.fillText('Chief Pathologist: Dr. M. Chen', boardX, boardY - 18);
      ctx.fillText('Director: Dr. Elias Ward', boardX, boardY - 2);
      ctx.fillText('Senior Nurse: M. Gibson', boardX, boardY + 14);
      ctx.fillText('Head Surgeon: Dr. H. Vance', boardX, boardY + 30);

      // 3. 16-Slot Wooden Key Cubby Cabinet with Hanging Brass Keys (Background Right)
      const cubbyX = W * 0.82; const cubbyY = 280;
      rrPath(ctx, cubbyX - 85, cubbyY - 60, 170, 160, 6);
      fillStroke(ctx, '#4e342e', 3.5, INK);
      ctx.strokeStyle = '#2d1810'; ctx.lineWidth = 1.5;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const kx = cubbyX - 70 + c * 38;
          const ky = cubbyY - 45 + r * 35;
          ctx.strokeRect(kx, ky, 32, 28);
          // Key tag hanging
          if ((r + c) % 3 === 0) {
            ctx.fillStyle = PAL.gold;
            ctx.beginPath(); ctx.arc(kx + 16, ky + 10, 4, 0, TAU); ctx.fill();
            ctx.fillRect(kx + 14, ky + 12, 4, 10);
          }
        }
      }

      // 4. Midground: The Curved Reception Desk & Props
      drawReceptionDesk(ctx, W * 0.54, 1040, 1.25);

      // 5. Midground Subject: Marilyn Gibson (High-Precision 1978 Receptionist Puppet)
      drawSecretary(ctx, W * 0.54, 910, 1.22, {
        talk: 0.8,
        blink: 0,
      });

      // 6. Foreground: Over-The-Shoulder (OTS) Framing with Maya in Lower-Left
      ctx.save();
      ctx.translate(W * 0.16, 1260);
      // Dark silhouette / blue denim jacket back
      ctx.fillStyle = '#1d4ed8'; // Blue denim back
      ctx.beginPath();
      ctx.moveTo(-120, 280);
      ctx.quadraticCurveTo(-140, 60, -60, -20);
      ctx.quadraticCurveTo(0, -50, 80, -20);
      ctx.quadraticCurveTo(140, 60, 160, 280);
      ctx.closePath();
      fillStroke(ctx, '#1e40af', 5, INK);

      // Collar ridge
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.moveTo(-45, -20); ctx.quadraticCurveTo(0, -35, 45, -20);
      ctx.lineTo(35, 5); ctx.lineTo(-35, 5); ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Back of head & dark hair
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(0, -85, 62, 72, 0, 0, TAU);
      fillStroke(ctx, '#0f172a', 5, INK);
      ctx.restore();

      // 7. Speech Bubble: "Good Morning, Dr. Maya!"
      ctx.save();
      ctx.translate(W * 0.68, 720);
      rrPath(ctx, -140, -45, 280, 85, 12);
      fillStroke(ctx, '#ffffff', 3.5, INK);
      // Speech pointer pointing toward secretary's mouth
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-40, 40); ctx.lineTo(-75, 75); ctx.lineTo(-20, 40); ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(-40, 40); ctx.lineTo(-75, 75); ctx.lineTo(-20, 40); ctx.stroke();
      // Dialogue text
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 15px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('“Good morning,', 0, -18);
      ctx.fillStyle = '#dc2626';
      ctx.font = '900 17px Inter, sans-serif';
      ctx.fillText('DOCTOR MAYA!”', 0, 10);
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'SECRETARY', 'RECEPTION DESK', { color: '#ffea00' });
      drawStamp(ctx, 360, 140, 'REVELATION', 'RECOGNIZED AS DOCTOR', { color: '#ff1744' });
      drawArrowCallout(ctx, W * 0.38, 930, W * 0.44, 905, 'VINTAGE OLIVETTI TYPEWRITER', { dir: 'left', color: '#00e5ff' });
      drawCaption(ctx, 'Good morning, Dr. Maya! Naya specimen aapka wait kar raha hai!');
      vignette(ctx, 'rgba(0,0,0,0.22)');
      filmGrainOverlay(ctx, 0.04);
    },
  },

  // =============================================================
  // KF-15: Autopsy Intake Clipboard Macro
  // Heavy Masonite clipboard, 1978 intake log, paperclipped B&W photo of Maya Chen
  // =============================================================
  {
    id: 'KF-15',
    title: '0:54-0:58 | Autopsy Intake Clipboard Macro',
    hinglish: 'File par photo Maya ki hi thi... aur designation: Chief Pathologist, 1978!',
    render(ctx) {
      // 1. Polished walnut desk background
      ctx.fillStyle = '#3e2723'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 2;
      for (let y = 80; y < H; y += 70) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // 2. Heavy Masonite Clipboard (Centered POV)
      const cbX = W * 0.5; const cbY = H * 0.52;
      const cbW = 540; const cbH = 920;

      // Dark hardboard backing
      rrPath(ctx, cbX - cbW / 2, cbY - cbH / 2, cbW, cbH, 20);
      fillStroke(ctx, '#5d4037', 6, INK);

      // Aged yellowed Manila paper form
      ctx.fillStyle = '#fffde7';
      ctx.fillRect(cbX - cbW / 2 + 25, cbY - cbH / 2 + 65, cbW - 50, cbH - 95);
      ctx.strokeStyle = '#d7ccc8'; ctx.lineWidth = 2;
      ctx.strokeRect(cbX - cbW / 2 + 25, cbY - cbH / 2 + 65, cbW - 50, cbH - 95);

      // Silver spring clip at top
      ctx.fillStyle = linGrad(ctx, cbX - 90, cbY - cbH / 2, cbX + 90, cbY - cbH / 2 + 50, [
        [0, '#eceff1'], [0.5, '#b0bec5'], [1, '#78909c']
      ]);
      rrPath(ctx, cbX - 95, cbY - cbH / 2 - 15, 190, 55, 8);
      fillStroke(ctx, '#b0bec5', 3.5, INK);

      // Coffee cup ring water stain
      ctx.strokeStyle = 'rgba(121, 85, 72, 0.28)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(cbX + 130, cbY + 180, 52, 0, TAU); ctx.stroke();

      // Form Header: "MILLBROOK MEMORIAL HOSPITAL"
      ctx.fillStyle = '#1c1917';
      ctx.font = '900 18px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MILLBROOK MEMORIAL HOSPITAL', cbX, cbY - 330);
      ctx.font = '700 14px "Courier New", monospace';
      ctx.fillText('DEPARTMENT OF PATHOLOGY & AUTOPSY LOG', cbX, cbY - 305);
      ctx.font = '600 12px "Courier New", monospace';
      ctx.fillText('DATE: OCTOBER 24, 1978 • TIME: 08:30 AM', cbX, cbY - 285);

      // Horizontal ruled lines on form
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1.2;
      for (let ly = cbY - 260; ly < cbY + 360; ly += 36) {
        ctx.beginPath(); ctx.moveTo(cbX - cbW / 2 + 40, ly); ctx.lineTo(cbX + cbW / 2 - 40, ly); ctx.stroke();
      }

      // 3. The Shocking Clue: Paperclipped 1978 Black & White ID Photo of Maya!
      const phX = cbX - 130; const phY = cbY - 120;
      // Photo paper backing
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(phX - 75, phY - 95, 150, 190);
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
      ctx.strokeRect(phX - 75, phY - 95, 150, 190);

      // B&W Portrait of Dr. Maya Chen in Surgeon Scrub Cap
      ctx.save();
      ctx.beginPath(); ctx.rect(phX - 65, phY - 85, 130, 170); ctx.clip();
      // Gray background in photo
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(phX - 65, phY - 85, 130, 170);
      // Dr. Maya head (grayscale)
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.ellipse(phX, phY - 5, 34, 42, 0, 0, TAU); ctx.fill();
      // White surgeon cap
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(phX, phY - 25, 38, Math.PI, 0); ctx.fill();
      // Black eyes & serious gaze
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(phX - 12, phY - 5, 4, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(phX + 12, phY - 5, 4, 0, TAU); ctx.fill();
      // White surgical coat shoulders
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(phX - 50, phY + 32, 100, 60);
      ctx.restore();

      // Silver metal paperclip pinning photo to form
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(phX - 30, phY - 110);
      ctx.lineTo(phX - 30, phY - 70);
      ctx.arc(phX - 22, phY - 70, 8, Math.PI, 0, true);
      ctx.lineTo(phX - 14, phY - 115);
      ctx.stroke();

      // 4. Form Text Details: "CHIEF PATHOLOGIST: DR. MAYA CHEN"
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 15px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SUBJECT: SPECIMEN #1308-B', phX + 90, phY - 60);
      ctx.fillText('SURGEON: DR. MAYA CHEN', phX + 90, phY - 25);
      ctx.fillText('STATUS: PROTOCOL INITIATED', phX + 90, phY + 10);
      ctx.fillText('NOTE: HARVEST UPON ARRIVAL', phX + 90, phY + 45);

      // Red Rubber Stamp: "APPROVED — DR. ELIAS WARD"
      ctx.save();
      ctx.translate(cbX + 70, cbY + 180);
      ctx.rotate(-0.14);
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3.5;
      ctx.strokeRect(-120, -30, 240, 60);
      ctx.fillStyle = '#dc2626';
      ctx.font = '900 14px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('APPROVED FOR TRANSFER', 0, -10);
      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillText('DIR. ELIAS WARD • OCT 1978', 0, 12);
      ctx.restore();

      // 5. Receptionist's Manicured Hand Holding Edge of Board
      ctx.save();
      ctx.translate(cbX + cbW / 2 - 10, cbY + 100);
      // Forearm & mint blouse sleeve
      ctx.fillStyle = '#a7f3d0';
      rrPath(ctx, 10, -45, 60, 90, 8); fillStroke(ctx, '#a7f3d0', 3, INK);
      // Fingers with red polished nails
      ctx.fillStyle = '#f7d0b5';
      [-25, -5, 15, 35].forEach((fy) => {
        rrPath(ctx, -25, fy, 45, 16, 6);
        fillStroke(ctx, '#f7d0b5', 2.5, INK);
        // Red nail polish
        ctx.fillStyle = '#be123c';
        ctx.beginPath(); ctx.ellipse(-20, fy + 8, 4, 6, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#f7d0b5';
      });
      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'CONFIDENTIAL FILE', 'AUTOPSY LOG 1978', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'PARADOX CONFIRMED', 'DR. MAYA CHEN (1978)', { color: '#ff1744' });
      drawArrowCallout(ctx, phX + 60, phY + 100, phX + 160, phY + 140, 'B&W 1978 SURGEON PHOTO', { dir: 'right', color: '#ff1744' });
      drawCaption(ctx, 'File par photo Maya ki hi thi... aur designation: Chief Pathologist, 1978!');
      vignette(ctx, 'rgba(0,0,0,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-16: The Blood-Stained Surgical Coat
  // First-person POV looking down: blood-spattered surgeon coat, latex gloves, scalpel
  // =============================================================
  {
    id: 'KF-16',
    title: '0:58-1:02 | The Blood-Stained Surgical Coat',
    hinglish: 'Maya ne apne haathon ko dekha... blue jacket gayab thi, aur haath mein khoon se sana scalpel tha!',
    render(ctx) {
      // 1. Checkered terrazzo floor seen from downward perspective
      ctx.fillStyle = '#b0bec5'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(100,120,140,0.3)'; ctx.lineWidth = 2.5;
      for (let x = -200; x < W * 2; x += 110) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 300, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 120) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // 2. First-Person Perspective: Starched White Surgeon Coat Lapels
      const cx = W * 0.5; const cy = H * 0.45;
      ctx.save();
      ctx.fillStyle = '#f8fafc'; // Crisp surgeon coat
      ctx.beginPath();
      ctx.moveTo(cx - 380, 0);
      ctx.lineTo(cx - 120, cy + 80);
      ctx.lineTo(cx, cy + 220);
      ctx.lineTo(cx + 120, cy + 80);
      ctx.lineTo(cx + 380, 0);
      ctx.lineTo(W, H); ctx.lineTo(0, H);
      ctx.closePath();
      fillStroke(ctx, '#f8fafc', 6, INK);

      // Coat collar lapels
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(cx - 380, 0); ctx.lineTo(cx - 90, cy + 50); ctx.lineTo(cx - 240, cy + 180);
      ctx.closePath(); fillStroke(ctx, '#e2e8f0', 4, INK);
      ctx.beginPath();
      ctx.moveTo(cx + 380, 0); ctx.lineTo(cx + 90, cy + 50); ctx.lineTo(cx + 240, cy + 180);
      ctx.closePath(); fillStroke(ctx, '#e2e8f0', 4, INK);

      // 3. Fresh Arterial Blood Splatters across coat chest
      ctx.fillStyle = '#991b1b'; // Deep arterial crimson
      [
        [cx - 60, cy - 40, 18], [cx - 40, cy + 20, 14], [cx - 85, cy + 60, 22],
        [cx + 35, cy + 10, 16], [cx + 70, cy + 80, 24], [cx + 15, cy + 110, 12]
      ].forEach(([bx, by, br]) => {
        ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill();
      });
      // Dripping blood streams running downward
      ctx.beginPath();
      ctx.moveTo(cx - 85, cy + 70); ctx.lineTo(cx - 90, cy + 280); ctx.lineTo(cx - 80, cy + 280);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 70, cy + 90); ctx.lineTo(cx + 65, cy + 320); ctx.lineTo(cx + 75, cy + 320);
      ctx.closePath(); ctx.fill();

      // 4. Brass Engraved Badge pinned to left chest: "CHIEF PATHOLOGIST DR. MAYA CHEN"
      const bdX = cx - 210; const bdY = cy - 20;
      rrPath(ctx, bdX - 110, bdY - 32, 220, 64, 6);
      fillStroke(ctx, linGrad(ctx, bdX - 110, bdY - 32, bdX + 110, bdY + 32, [
        [0, '#ffd54f'], [0.5, '#ffb300'], [1, '#ff8f00']
      ]), 3.5, INK);
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 13px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('CHIEF PATHOLOGIST', bdX, bdY - 10);
      ctx.font = '900 15px Inter, sans-serif';
      ctx.fillText('DR. MAYA CHEN', bdX, bdY + 12);

      // 5. Trembling Hands in White Surgical Latex Gloves
      // Left gloved hand (clutching chest in shock)
      ctx.save();
      ctx.translate(cx - 150, cy + 260);
      ctx.rotate(0.35);
      ctx.fillStyle = '#ffffff';
      rrPath(ctx, -45, -70, 90, 140, 18);
      fillStroke(ctx, '#f1f5f9', 4, INK);
      ctx.restore();

      // Right gloved hand holding Surgical Scalpel (Forefront)
      ctx.save();
      ctx.translate(cx + 170, cy + 220);
      ctx.rotate(-0.25);
      // Gloved forearm
      ctx.fillStyle = '#ffffff';
      rrPath(ctx, -50, 40, 100, 180, 20); fillStroke(ctx, '#f1f5f9', 4.5, INK);
      // Gloved fingers gripping scalpel handle
      drawHand(ctx, 0, 0, 1.35, { fingerBend: 0.8, pointing: false });

      // Stainless Steel Scalpel
      ctx.save();
      ctx.translate(10, -60);
      ctx.rotate(-0.4);
      // Handle
      ctx.fillStyle = '#cfd8dc';
      rrPath(ctx, -8, -60, 16, 120, 4); fillStroke(ctx, '#90a4ae', 3, INK);
      // Blade (#10 curved surgical belly)
      ctx.fillStyle = '#eceff1';
      ctx.beginPath();
      ctx.moveTo(-6, -60); ctx.lineTo(0, -135); ctx.quadraticCurveTo(16, -100, 6, -60);
      ctx.closePath();
      fillStroke(ctx, '#ffffff', 2.5, INK);

      // Specular Starburst Flare on razor-sharp blade tip
      ctx.fillStyle = '#ffffff';
      const fx = 0; const fy = -135;
      ctx.beginPath();
      ctx.moveTo(fx, fy - 26); ctx.lineTo(fx + 5, fy); ctx.lineTo(fx, fy + 26); ctx.lineTo(fx - 5, fy); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fx - 26, fy); ctx.lineTo(fx, fy + 5); ctx.lineTo(fx + 26, fy); ctx.lineTo(fx, fy - 5); ctx.fill();
      ctx.restore();
      ctx.restore();

      ctx.restore();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'BODY DISCOVERY', 'SURGEON COAT SWAP', { color: '#ff1744' });
      drawStamp(ctx, 420, 140, 'WEAPON IN HAND', 'SURGICAL SCALPEL', { color: '#ffea00' });
      drawArrowCallout(ctx, bdX + 90, bdY + 30, bdX + 180, bdY + 70, 'BRASS PATHOLOGIST BADGE', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, 'Maya ne apne haathon ko dekha... blue jacket gayab thi, aur haath mein khoon se sana scalpel tha!');
      vignette(ctx, 'rgba(160,0,0,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-17: Emergency Red Lights & Dr. Ward PA
  // Crimson strobe lights plunge rotunda into nightmare; PA speaker broadcasts Ward's voice
  // =============================================================
  {
    id: 'KF-17',
    title: '1:02-1:06 | Emergency Red Lights & Dr. Ward PA',
    hinglish: 'BZZT! PA speaker par awaaz goonji: "Dr. Maya, harvest cycle pura karo... Suite 1308 mein aao!"',
    render(ctx) {
      // 1. Red Alert Rotunda Set
      drawHospitalLobbySet(ctx, { redAlert: true, sunlight: false });

      // Rotating crimson siren beam sweeping through lobby
      const sirenSweep = radGrad(ctx, W * 0.5, 320, 50, W * 0.95, [
        [0, 'rgba(255, 23, 68, 0.8)'],
        [0.4, 'rgba(213, 0, 0, 0.35)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = sirenSweep; ctx.fillRect(0, 0, W, H);

      // 2. Wall-Mounted Vintage Perforated Metal PA Speaker (Top Right)
      const spkX = W * 0.78; const spkY = 320;
      // Chrome horn enclosure
      rrPath(ctx, spkX - 90, spkY - 60, 180, 120, 14);
      fillStroke(ctx, '#37474f', 5, INK);
      // Perforated speaker grille mesh
      ctx.fillStyle = '#111827';
      rrPath(ctx, spkX - 75, spkY - 45, 150, 90, 8); ctx.fill();
      ctx.fillStyle = '#94a3b8';
      for (let gy = spkY - 35; gy < spkY + 40; gy += 14) {
        for (let gx = spkX - 65; gx < spkX + 65; gx += 16) {
          ctx.beginPath(); ctx.arc(gx, gy, 2.5, 0, TAU); ctx.fill();
        }
      }

      // Audio broadcast vibrating soundwaves ("BZZZZT!")
      ctx.strokeStyle = '#ff1744'; ctx.lineWidth = 3.5;
      for (let w = 1; w <= 4; w++) {
        ctx.beginPath();
        ctx.arc(spkX - 85, spkY, w * 35, Math.PI * 0.7, Math.PI * 1.3);
        ctx.stroke();
      }

      // 3. Vintage Reel-to-Reel Magnetic Tape Recorder in Observation Booth (Midground Left)
      const deckX = W * 0.22; const deckY = 540;
      rrPath(ctx, deckX - 95, deckY - 75, 190, 150, 8);
      fillStroke(ctx, '#455a64', 4, INK);
      // Dual spinning tape reels
      [-48, 48].forEach((rx) => {
        ctx.fillStyle = '#eceff1';
        ctx.beginPath(); ctx.arc(deckX + rx, deckY - 15, 36, 0, TAU); ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
        // Reel spokes
        ctx.strokeStyle = '#78909c'; ctx.lineWidth = 2;
        for (let sp = 0; sp < 3; sp++) {
          const a = (sp / 3) * TAU;
          ctx.beginPath();
          ctx.moveTo(deckX + rx, deckY - 15);
          ctx.lineTo(deckX + rx + Math.cos(a) * 32, deckY - 15 + Math.sin(a) * 32);
          ctx.stroke();
        }
      });
      // Analog VU Meters (glowing yellow)
      rrPath(ctx, deckX - 65, deckY + 35, 130, 26, 3);
      fillStroke(ctx, '#fffde7', 2, INK);
      ctx.fillStyle = '#dc2626'; ctx.fillRect(deckX + 10, deckY + 38, 40, 20); // peaking in red

      // 4. Giant Broadcast Speech Balloon: Dr. Elias Ward's Voice Over PA
      ctx.save();
      ctx.translate(W * 0.5, 780);
      rrPath(ctx, -380, -75, 760, 150, 16);
      fillStroke(ctx, '#0f172a', 4, '#ff1744');
      // Speech balloon arrow pointing to speaker
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(180, -75); ctx.lineTo(240, -140); ctx.lineTo(210, -75); ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ff1744'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(180, -75); ctx.lineTo(240, -140); ctx.lineTo(210, -75); ctx.stroke();

      // Dialogue Text
      ctx.fillStyle = '#ff1744';
      ctx.font = '900 16px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('📡 PA BROADCAST • DR. ELIAS WARD', 0, -38);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 20px Inter, sans-serif';
      ctx.fillText('“DOCTOR MAYA... HARVEST CYCLE COMPLETE KARO.”', 0, -2);
      ctx.fillStyle = '#ffea00';
      ctx.font = '700 18px Inter, sans-serif';
      ctx.fillText('“SUITE 1308 MEIN NAYA SUBJECT TAIYAR HAI!”', 0, 32);
      ctx.restore();

      // 5. Maya in Dr. Maya Costume (Midground Center) — clutching temple in headache panic
      drawDrMaya(ctx, W * 0.5, 1160, 1.2, {
        mood: 'scream',
        holdScalpel: true,
        bloodStains: true,
      });

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'EMERGENCY OVERRIDE', 'PA SYSTEM ACTIVATED', { color: '#ff1744' });
      drawStamp(ctx, 420, 140, 'VOICE IDENTIFIED', 'DR. ELIAS WARD', { color: '#ffea00' });
      drawArrowCallout(ctx, spkX - 90, spkY + 40, spkX - 170, spkY + 90, 'INSTITUTIONAL PA HORN', { dir: 'left', color: '#ff1744' });
      drawCaption(ctx, 'BZZT! PA speaker par awaaz goonji: "Dr. Maya, harvest cycle pura karo... Suite 1308 mein aao!"');
      vignette(ctx, 'rgba(200,0,0,0.35)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-18: The Free Lift Opens: Past Maya Arrives
  // Dr. Maya turns around as Free Lift doors part — Past Maya in blue jacket emerges!
  // =============================================================
  {
    id: 'KF-18',
    title: '1:06-1:10 | The Free Lift Opens: Past Maya Arrives',
    hinglish: 'Lift ke darwaze phir khule... aur andar se wahi blue jacket wali Maya nikal rahi thi!',
    render(ctx) {
      // 1. Hospital Lobby in Deep Red Emergency Alert
      drawHospitalLobbySet(ctx, { redAlert: true, sunlight: false });

      // 2. The Free Lift Doors Parting (Background Right) — Warm Amber Light Portal
      const liftX = W * 0.72; const liftY = 720;
      const liftW = 320; const liftH = 540;

      // Radiant warm golden glow spilling out of elevator into crimson lobby
      const liftGlow = radGrad(ctx, liftX, liftY, 30, 420, [
        [0, 'rgba(255, 236, 179, 0.95)'],
        [0.4, 'rgba(255, 193, 7, 0.6)'],
        [0.8, 'rgba(255, 152, 0, 0.2)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = liftGlow;
      ctx.beginPath(); ctx.arc(liftX, liftY, 420, 0, TAU); ctx.fill();

      // Elevator Cab Interior (wood wainscoting & brass indicator)
      ctx.fillStyle = PAL.woodMid;
      ctx.fillRect(liftX - liftW / 2 + 30, liftY - liftH / 2, liftW - 60, liftH);

      // Parted Bronze Elevator Doors (Left & Right)
      ctx.fillStyle = PAL.brass;
      ctx.fillRect(liftX - liftW / 2 - 40, liftY - liftH / 2 - 20, 70, liftH + 40);
      ctx.strokeRect(liftX - liftW / 2 - 40, liftY - liftH / 2 - 20, 70, liftH + 40);
      ctx.fillRect(liftX + liftW / 2 - 30, liftY - liftH / 2 - 20, 70, liftH + 40);
      ctx.strokeRect(liftX + liftW / 2 - 30, liftY - liftH / 2 - 20, 70, liftH + 40);

      // 3. Past Maya (Episode 1/2 Maya) Stepping Out of Elevator Cab
      ctx.save();
      ctx.translate(liftX, liftY + 280);
      drawMaya(ctx, 0, 0, 1.05, {
        mood: 'shock',
        pose: 'reach',
        look: [-0.6, 0.1],
        sweat: true,
      });
      ctx.restore();

      // 4. Foreground Left: Dr. Maya Chen (Player POV) turned in frozen shock
      ctx.save();
      ctx.translate(W * 0.24, 1140);
      drawDrMaya(ctx, 0, 0, 1.25, {
        mood: 'shock',
        holdScalpel: true,
        bloodStains: true,
      });
      ctx.restore();

      // 5. Visual Storytelling Contrast: Tension Line connecting Past vs Future Maya
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.55)'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W * 0.32, 1060);
      ctx.lineTo(liftX - 40, liftY + 240);
      ctx.stroke();

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'TEMPORAL LOOP', 'TIME PARADOX ACTIVE', { color: '#ff1744' });
      drawStamp(ctx, 420, 140, 'ORIGIN', 'PAST MAYA ARRIVES', { color: '#00e5ff' });
      drawArrowCallout(ctx, liftX - 40, liftY + 180, liftX - 120, liftY + 120, 'PAST MAYA (BLUE JACKET)', { dir: 'left', color: '#00e5ff' });
      drawArrowCallout(ctx, W * 0.32, 1180, W * 0.42, 1240, 'DR. MAYA (CHIEF SURGEON)', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, 'Lift ke darwaze phir khule... aur andar se wahi blue jacket wali Maya nikal rahi thi!');
      vignette(ctx, 'rgba(180,0,0,0.3)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-19: Scalpel Stare: Maya vs Maya
  // Extreme split-focus anime standoff — scalpel glint reflects Past Maya in panic
  // =============================================================
  {
    id: 'KF-19',
    title: '1:10-1:14 | Scalpel Stare: Maya vs Maya',
    hinglish: 'Dono Maya ne ek doosre ko dekha... Dr. Maya ke haath kaanp rahe the, aur Past Maya cheekh padi!',
    render(ctx) {
      // 1. Dramatic Cinema Split Background
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, W, H);

      // Left half: Blood-red emergency pulse (Dr. Maya's present)
      const redGlow = radGrad(ctx, W * 0.25, H * 0.5, 40, W * 0.6, [
        [0, 'rgba(220, 38, 38, 0.55)'],
        [0.6, 'rgba(153, 27, 27, 0.25)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = redGlow; ctx.fillRect(0, 0, W / 2, H);

      // Right half: Warm amber elevator cab glow (Past Maya's past)
      const amberGlow = radGrad(ctx, W * 0.75, H * 0.5, 40, W * 0.6, [
        [0, 'rgba(255, 193, 7, 0.5)'],
        [0.6, 'rgba(217, 119, 6, 0.2)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = amberGlow; ctx.fillRect(W / 2, 0, W / 2, H);

      // 2. Right Side: Past Maya Backed Up Against Elevator Cab Mirror
      ctx.save();
      ctx.translate(W * 0.74, 980);

      // Elevator cab beveled mirror on wall
      ctx.fillStyle = linGrad(ctx, -140, -280, 140, 280, [
        [0, '#e2e8f0'], [0.5, '#cbd5e1'], [1, '#94a3b8']
      ]);
      rrPath(ctx, -140, -280, 280, 560, 16);
      fillStroke(ctx, '#cbd5e1', 5, PAL.gold);

      // Mirror reflection ghost of Past Maya
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath(); ctx.ellipse(0, -60, 50, 65, 0, 0, TAU); ctx.fill();

      // Past Maya puppet in absolute survival terror
      drawMaya(ctx, 0, 60, 1.25, {
        mood: 'scream',
        pose: 'reach',
        look: [-0.8, -0.1],
        sweat: true,
      });

      // Raised defensive hands in panic
      ctx.fillStyle = '#f5d0b5';
      ctx.beginPath(); ctx.arc(-55, -40, 14, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(-40, -10, 14, 0, TAU); ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 3. Left Side: Dr. Maya Chen with Surgical Scalpel Raised
      ctx.save();
      ctx.translate(W * 0.28, 980);
      drawDrMaya(ctx, 0, 60, 1.3, {
        mood: 'shock',
        holdScalpel: true,
        bloodStains: true,
      });

      // Macro Scalpel Held in Forefront
      ctx.save();
      ctx.translate(130, -50);
      ctx.rotate(-0.35);

      // Stainless Scalpel Blade (#10 belly)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-10, -30);
      ctx.lineTo(0, -160);
      ctx.quadraticCurveTo(28, -120, 10, -30);
      ctx.closePath();
      fillStroke(ctx, '#ffffff', 4, INK);

      // Reflection of Past Maya's terrified eye in the polished steel blade
      ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
      ctx.beginPath(); ctx.ellipse(4, -110, 8, 14, 0.2, 0, TAU); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(4, -110, 4, 0, TAU); ctx.fill();

      // Blinding 4-point star lens flare on blade tip
      ctx.fillStyle = '#ffffff';
      const fx = 0; const fy = -160;
      ctx.beginPath();
      ctx.moveTo(fx, fy - 40); ctx.lineTo(fx + 6, fy); ctx.lineTo(fx, fy + 40); ctx.lineTo(fx - 6, fy); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fx - 40, fy); ctx.lineTo(fx, fy + 6); ctx.lineTo(fx + 40, fy); ctx.lineTo(fx, fy - 6); ctx.fill();
      ctx.restore();

      ctx.restore();

      // 4. Psychological Anime Tension Sparks crossing between their eyes
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3;
      for (let t = 0; t < 8; t++) {
        const ty = 720 + t * 45;
        ctx.beginPath();
        ctx.moveTo(W * 0.38, ty);
        ctx.lineTo(W * 0.48, ty + (rnd(t * 7) - 0.5) * 40);
        ctx.lineTo(W * 0.62, ty);
        ctx.stroke();
      }

      // "THE CYCLE IS YOU!" Psychological Shock Header
      rrPath(ctx, W * 0.2, 380, W * 0.6, 68, 12);
      fillStroke(ctx, '#000000', 3.5, '#ff1744');
      ctx.fillStyle = '#ff1744';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚠ TEMPORAL PARADOX: THE CYCLE IS YOU ⚠', W * 0.5, 414);

      // HUD & Narrative
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'FACE-TO-FACE', 'MAYA VS DR. CHEN', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'CRITICAL DISCOVERY', 'SELF AS HARVESTER', { color: '#ff1744' });
      drawCaption(ctx, 'Dono Maya ne ek doosre ko dekha... Dr. Maya ke haath kaanp rahe the, aur Past Maya cheekh padi!');
      vignette(ctx, 'rgba(0,0,0,0.4)');
      filmGrainOverlay(ctx, 0.05);
    },
  },

  // =============================================================
  // KF-20: Interactive Cliffhanger: [A] vs [B]
  // Viral split poster: [A] Harvest vs [B] Burn the Loop! Electrical arc divider
  // =============================================================
  {
    id: 'KF-20',
    title: '1:14-1:18 | Interactive Cliffhanger: [A] vs [B]',
    hinglish: 'Kya Maya nayi ladki ka autopsy karegi... ya hospital ko aag laga kar time loop todegi? COMMENT A YA B!',
    render(ctx) {
      // 1. Deep Cinematic Split Background
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, W, H);

      // Left Pillar [A] Background — Cold Clinical Teal/Cyan
      const leftGrad = linGrad(ctx, 0, 200, W / 2, H - 450, [
        [0, 'rgba(0, 77, 64, 0.45)'],
        [0.5, 'rgba(0, 150, 136, 0.25)'],
        [1, 'rgba(0, 38, 38, 0.7)'],
      ]);
      ctx.fillStyle = leftGrad; ctx.fillRect(0, 200, W / 2, H - 450);

      // Right Pillar [B] Background — Blazing Fiery Orange/Amber Inferno
      const rightGrad = linGrad(ctx, W / 2, 200, W, H - 450, [
        [0, 'rgba(183, 28, 28, 0.55)'],
        [0.5, 'rgba(230, 81, 0, 0.35)'],
        [1, 'rgba(62, 10, 10, 0.7)'],
      ]);
      ctx.fillStyle = rightGrad; ctx.fillRect(W / 2, 200, W / 2, H - 450);

      // Choice Headers at Top
      const drawChoiceHeader = (cx, title, sub, bg) => {
        const bw = 380; const bh = 110;
        rrPath(ctx, cx - bw / 2, 210, bw, bh, 20);
        fillStroke(ctx, bg, 4.5, INK);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '900 44px Inter, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(title, cx, 250);
        ctx.font = '700 20px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText(sub, cx, 290);
      };

      drawChoiceHeader(W * 0.25, 'HARVEST [A]', 'perform autopsy to live', '#004d40');
      drawChoiceHeader(W * 0.75, 'BURN [B]', 'smash breaker to break loop', '#b71c1c');

      // Center Zigzag Plasma Lightning Divider
      const divX = W * 0.5;
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(divX, 200);
      for (let y = 220; y < 1140; y += 35) {
        const jitter = Math.sin(y * 0.1) * 18;
        ctx.lineTo(divX + jitter, y);
      }
      ctx.lineTo(divX, 1140);
      ctx.stroke();

      // Outer plasma glow
      ctx.strokeStyle = 'rgba(255, 234, 0, 0.4)'; ctx.lineWidth = 14;
      ctx.stroke();

      // ==========================================
      // Left Option [A]: Dr. Maya Chen (The Harvest)
      // ==========================================
      // Dissection table in background behind Dr. Maya
      ctx.save();
      ctx.translate(W * 0.25, 960);
      drawDissectionTable(ctx, 0, 0, 0.65);

      // Glowing Cyan Cryo Canister on table
      ctx.fillStyle = '#00e5ff';
      rrPath(ctx, 80, -90, 44, 90, 8);
      fillStroke(ctx, '#00e5ff', 3, INK);
      ctx.restore();

      // Dr. Maya Chen (Chief Surgeon) standing proudly in front
      ctx.save();
      ctx.translate(W * 0.25, 870);
      drawDrMaya(ctx, 0, 0, 1.08, {
        mood: 'shock',
        holdScalpel: true,
        bloodStains: true,
      });
      ctx.restore();

      // ==========================================
      // Right Option [B]: Maya Smashing Breaker (The Burn)
      // ==========================================
      // Master Electrical Breaker Box on far right wall
      const fboxX = W * 0.90; const fboxY = 680;
      rrPath(ctx, fboxX - 40, fboxY - 60, 80, 120, 8);
      fillStroke(ctx, '#37474f', 4, INK);

      // Smashed glass panel & high-voltage sparks
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3.5;
      for (let sp = 0; sp < 18; sp++) {
        const a = (sp / 18) * TAU;
        const len = 30 + (sp % 4) * 20;
        ctx.beginPath();
        ctx.moveTo(fboxX, fboxY);
        ctx.lineTo(fboxX + Math.cos(a) * len, fboxY + Math.sin(a) * len);
        ctx.stroke();
      }

      // Maya swinging fire axe at breaker — FACE IS COMPLETELY CLEAR!
      ctx.save();
      ctx.translate(W * 0.72, 870);
      drawMaya(ctx, 0, 0, 1.08, {
        mood: 'scream',
        pose: 'reach',
        look: [0.6, -0.2],
        sweat: true,
      });

      // Heavy Fire Axe held on HER RIGHT SIDE (pointing at breaker, away from face)
      ctx.save();
      ctx.translate(85, -50);
      ctx.rotate(0.55); // angled toward breaker on right
      // Handle
      ctx.fillStyle = '#d97706';
      rrPath(ctx, -8, -120, 16, 170, 4); fillStroke(ctx, '#b45309', 3, INK);
      // Red heavy axe head
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-35, -135, 55, 36);
      ctx.fillStyle = '#eceff1';
      ctx.beginPath();
      ctx.moveTo(-35, -135); ctx.lineTo(-58, -145); ctx.lineTo(-58, -90); ctx.lineTo(-35, -97);
      ctx.closePath();
      fillStroke(ctx, '#ffffff', 2, INK);
      ctx.restore();
      ctx.restore();

      // ==========================================
      // Option Cards: [A] and [B]
      // ==========================================
      // Option [A] Card
      rrPath(ctx, W * 0.05, 1140, W * 0.42, 115, 14);
      fillStroke(ctx, '#042f2e', 3.5, '#00e5ff');
      ctx.fillStyle = '#00e5ff';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('[A] HARVEST', W * 0.26, 1175);
      ctx.fillStyle = '#e0f2fe';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('Perform autopsy • Survive cycle', W * 0.26, 1208);
      ctx.fillText('Become the 1978 monster', W * 0.26, 1228);

      // Option [B] Card
      rrPath(ctx, W * 0.53, 1140, W * 0.42, 115, 14);
      fillStroke(ctx, '#450a0a', 3.5, '#ff3d00');
      ctx.fillStyle = '#ff3d00';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('[B] BURN THE LOOP', W * 0.74, 1175);
      ctx.fillStyle = '#fef2f2';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('Smash breaker • Burn hospital', W * 0.74, 1208);
      ctx.fillText('End the nightmare forever', W * 0.74, 1228);

      // ==========================================
      // Master Clean Bottom Third (Zero Collision!)
      // ==========================================
      // Line 1: Question
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 58px Inter, sans-serif';
      ctx.lineWidth = 14;
      ctx.strokeStyle = INK;
      ctx.strokeText('HARVEST YA BURN?', W / 2, 1370);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('HARVEST YA BURN?', W / 2, 1370);

      // Line 2: Call to action
      ctx.font = '900 78px Inter, sans-serif';
      ctx.lineWidth = 18;
      ctx.strokeStyle = INK;
      ctx.strokeText('COMMENT A YA B!', W / 2, 1470);
      ctx.fillStyle = PAL.gold;
      ctx.fillText('COMMENT A YA B!', W / 2, 1470);

      // Line 3: Subtitle
      ctx.font = '900 30px Inter, sans-serif';
      ctx.lineWidth = 10;
      ctx.strokeStyle = INK;
      ctx.strokeText('MOST VOTED WRITES EPISODE 4 FINALE', W / 2, 1560);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText('MOST VOTED WRITES EPISODE 4 FINALE', W / 2, 1560);

      // Line 4: Follow Pill
      rrPath(ctx, W / 2 - 250, 1630, 500, 56, 28);
      fillStroke(ctx, 'rgba(15, 23, 42, 0.92)', 3, PAL.gold);
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillStyle = PAL.gold;
      ctx.fillText('+ SUBSCRIBE FOR PART 4', W / 2, 1658);

      // HUD stamps at very top
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'CLIFFHANGER', 'DECISION REQUIRED', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'EPISODE 4', 'AUDIENCE VOTING', { color: '#ff1744' });

      vignette(ctx, 0.45);
      filmGrainOverlay(ctx, 0.04);
    },
  },
];
