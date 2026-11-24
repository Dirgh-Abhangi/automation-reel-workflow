// =============================================================
// The Free Lift — Episode 4 Series Finale: "The Paradox Shattered"
// Master 20 Keyframes & Specialized Vector Sets
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

import {
  drawTopHUD,
  drawStamp,
  drawArrowCallout,
  drawCaption,
  drawTerminalBox,
  drawSplitChrome,
} from './hud.js';

import { drawMaya, drawHand, drawLimbTube, drawFireAxe } from './chars.js';
import { drawElevatorCab, drawMorgueCorridor } from './sets.js';
import { drawAutopsyWardSet, drawCryoChamberWithEntity, drawDissectionTable } from './keyframes_ep2.js';
import { drawHospitalLobbySet, drawDrMaya } from './keyframes_ep3.js';

// =============================================================
// NEW SET PIECE 0: 1978 Substation Machinery Room / Engine Core
// Multi-plane industrial depth: concrete walls, I-beams, conduits, diamond grating, rotating beacon
// =============================================================
export function drawSubstationSet(ctx, options = {}) {
  const { alarmed = true, arcLight = 0 } = options;
  // 1. Concrete Substation Wall
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, H * 0.7, [
    [0, '#0c111a'], [0.4, '#131b26'], [1, '#1e293b']
  ]);
  ctx.fillRect(0, 0, W, H * 0.7);

  // 2. Heavy Steel I-Beams / Pillars on sides with rivets
  [0, W - 140].forEach((bx, idx) => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx, 0, 140, H * 0.7);
    ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
    ctx.strokeRect(bx, 0, 140, H * 0.7);
    // Flange rivets
    ctx.fillStyle = '#475569';
    for (let ry = 40; ry < H * 0.7; ry += 65) {
      ctx.beginPath(); ctx.arc(bx + (idx === 0 ? 115 : 25), ry, 5, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.stroke();
    }
  });

  // 3. Overhead Cable Trays & High-Voltage Conduits
  for (let cy = 80; cy <= 180; cy += 32) {
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, cy, W, 14);
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.strokeRect(0, cy, W, 14);
  }
  // Vertical conduit drops
  [220, 260, 310, W - 310, W - 260, W - 220].forEach((cx) => {
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx - 8, 180, 16, H * 0.52);
    ctx.strokeRect(cx - 8, 180, 16, H * 0.52);
  });

  // 4. Wall Stenciled 1978 Industrial Warning Signage
  ctx.save();
  ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.font = '900 34px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ SUBSTATION B-13 • 480V ⚡', W * 0.5, 290);
  ctx.font = '700 15px Inter, sans-serif';
  ctx.fillStyle = 'rgba(203, 213, 225, 0.35)';
  ctx.fillText('AUTHORIZED MILLBROOK ENGINEERING PERSONNEL ONLY', W * 0.5, 325);
  ctx.restore();

  // 5. Heavy Diamond-Plate Steel Grating Floor
  const floorY = H * 0.65;
  ctx.fillStyle = linGrad(ctx, 0, floorY, 0, H, [
    [0, '#111827'], [0.4, '#0f172a'], [1, '#020617']
  ]);
  ctx.fillRect(0, floorY, W, H - floorY);

  // Floor perspective lines
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)'; ctx.lineWidth = 2;
  for (let x = -200; x < W * 2; x += 140) {
    ctx.beginPath(); ctx.moveTo(x, floorY); ctx.lineTo((x - W * 0.5) * 3 + W * 0.5, H); ctx.stroke();
  }
  for (let y = floorY; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // 6. Yellow Industrial Rotating Emergency Beacon
  const bx = W * 0.5; const by = 80;
  ctx.fillStyle = '#b45309';
  ctx.fillRect(bx - 26, by - 16, 52, 28);
  ctx.strokeRect(bx - 26, by - 16, 52, 28);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(bx, by - 16, 22, Math.PI, 0); ctx.fill();
  ctx.stroke();

  // Volumetric amber light cone sweeping across the room
  ctx.fillStyle = radGrad(ctx, bx, by, 30, W * 0.85, [
    [0, 'rgba(251, 191, 36, 0.32)'],
    [0.5, 'rgba(217, 119, 6, 0.10)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.beginPath(); ctx.arc(bx, by, W * 0.85, 0, TAU); ctx.fill();

  // Arc lighting flash if exploding
  if (arcLight > 0) {
    ctx.fillStyle = `rgba(0, 229, 255, ${Math.min(0.65, arcLight * 0.5)})`;
    ctx.fillRect(0, 0, W, H);
  }
}

// =============================================================
// NEW SET PIECE 1: 1978 High-Voltage Master Breaker Box
// =============================================================
export function drawBreakerBox(ctx, x, y, scale = 1.0, options = {}) {
  const { smashed = false, sparked = false, arcSeed = 0 } = options;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Cast iron box outer casing
  ctx.fillStyle = '#263238';
  rrPath(ctx, -140, -220, 280, 440, 16);
  fillStroke(ctx, '#1e293b', 5, INK);

  // Heavy steel conduits top and bottom
  [-60, 60].forEach((cx) => {
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx - 16, -260, 32, 45);
    ctx.strokeRect(cx - 16, -260, 32, 45);
    ctx.fillRect(cx - 16, 215, 32, 45);
    ctx.strokeRect(cx - 16, 215, 32, 45);
  });

  // Inner recessed electrical panel
  ctx.fillStyle = smashed ? '#0f172a' : '#334155';
  rrPath(ctx, -115, -190, 230, 380, 10);
  fillStroke(ctx, ctx.fillStyle, 3.5, INK);

  // Yellow/black hazard caution border
  ctx.save();
  ctx.rect(-110, -185, 220, 25);
  ctx.clip();
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-110, -185, 220, 25);
  ctx.fillStyle = '#0f172a';
  for (let hx = -130; hx < 130; hx += 24) {
    ctx.beginPath();
    ctx.moveTo(hx, -185); ctx.lineTo(hx + 14, -185);
    ctx.lineTo(hx - 6, -160); ctx.lineTo(hx - 20, -160);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  // High Voltage Brass Stencil Plate: "DANGER 480V • SUB-STATION 1978"
  rrPath(ctx, -95, -145, 190, 46, 6);
  fillStroke(ctx, linGrad(ctx, -95, -145, 95, -99, [
    [0, '#fbbf24'], [0.5, '#d97706'], [1, '#b45309']
  ]), 2.5, INK);
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 13px Inter, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('⚡ DANGER 480V ⚡', 0, -132);
  ctx.font = '800 10px Inter, sans-serif';
  ctx.fillText('ELEVATOR SUB-STATION 1978', 0, -114);

  // Three Heavy Phase Knife Switches
  [-60, 0, 60].forEach((sx) => {
    // Ceramic insulated base
    ctx.fillStyle = '#64748b';
    ctx.fillRect(sx - 18, -80, 36, 170);
    ctx.strokeRect(sx - 18, -80, 36, 170);

    // Copper switch busbars
    ctx.fillStyle = smashed ? '#450a0a' : '#b45309';
    ctx.fillRect(sx - 8, -65, 16, 140);
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.strokeRect(sx - 8, -65, 16, 140);

    // Heavy knife throw blade
    ctx.save();
    ctx.translate(sx, 40);
    if (smashed) {
      ctx.rotate(0.45); // Smashed/thrown open
    }
    ctx.fillStyle = '#f59e0b';
    rrPath(ctx, -6, -120, 12, 130, 4);
    fillStroke(ctx, '#d97706', 2.5, INK);
    // Insulated rubber handle
    ctx.fillStyle = '#dc2626';
    rrPath(ctx, -10, -135, 20, 30, 4);
    fillStroke(ctx, '#991b1b', 2, INK);
    ctx.restore();
  });

  // If Smashed: Jagged fire axe gash + shattered glass fragments
  if (smashed) {
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-70, -30); ctx.lineTo(15, 60); ctx.lineTo(85, 10);
    ctx.stroke();

    // Jagged metal tear
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-50, -20); ctx.lineTo(0, 50); ctx.lineTo(30, 30);
    ctx.closePath(); ctx.fill();

    // High Voltage Plasma Arc Detonations
    if (sparked) {
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 4.5;
      for (let arc = 0; arc < 12; arc++) {
        const a = (arc / 12) * TAU + arcSeed;
        const len = 70 + (arc % 4) * 45;
        ctx.beginPath();
        ctx.moveTo(10, 40);
        let cx = 10; let cy = 40;
        for (let step = 0; step < 4; step++) {
          cx += Math.cos(a) * (len / 4) + (Math.sin(arcSeed * 10 + step) * 20);
          cy += Math.sin(a) * (len / 4) + (Math.cos(arcSeed * 10 + step) * 20);
          ctx.lineTo(cx, cy);
        }
        ctx.stroke();
      }

      // Outer golden corona
      ctx.strokeStyle = '#ffea00'; ctx.lineWidth = 14;
      ctx.stroke();

      // Specular Starburst
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(10, 40, 24, 0, TAU); ctx.fill();
    }
  }

  ctx.restore();
}

// =============================================================
// NEW SET PIECE 2: Cryogenic Emergency Hydraulic Purge Lever
// =============================================================
export function drawCryoPurgeStation(ctx, x, y, scale = 1.0, options = {}) {
  const { leverDown = false, venting = false } = options;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Heavy industrial wall mounting plate
  ctx.fillStyle = '#334155';
  rrPath(ctx, -110, -180, 220, 360, 14);
  fillStroke(ctx, '#1e293b', 5, INK);

  // Warning Header
  rrPath(ctx, -90, -165, 180, 42, 6);
  fillStroke(ctx, '#dc2626', 3, INK);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 13px Inter, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('EMERGENCY CRYO PURGE', 0, -150);
  ctx.font = '700 9px Inter, sans-serif';
  ctx.fillText('STASIS CORE #1308 DUMP', 0, -135);

  // Dual Pressure Gauges
  [-45, 45].forEach((gx, idx) => {
    ctx.beginPath();
    ctx.arc(gx, -70, 32, 0, TAU);
    fillStroke(ctx, '#f1f5f9', 3.5, INK);
    // Gauge rim
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();
    // Needle
    ctx.save();
    ctx.translate(gx, -70);
    const needleAng = leverDown ? -0.8 : (idx === 0 ? 0.75 : 0.9);
    ctx.rotate(needleAng);
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -26); ctx.stroke();
    ctx.restore();
  });

  // Massive Red Hydraulic Release Lever
  const leverAngle = leverDown ? 0.75 : -0.75; // Down vs Up
  ctx.save();
  ctx.translate(0, 45);
  ctx.rotate(leverAngle);

  // Steel lever arm
  ctx.fillStyle = '#64748b';
  rrPath(ctx, -14, -130, 28, 140, 6);
  fillStroke(ctx, '#475569', 3.5, INK);

  // Bright Red Grip
  ctx.fillStyle = '#dc2626';
  rrPath(ctx, -20, -155, 40, 50, 8);
  fillStroke(ctx, '#991b1b', 3, INK);

  // Grip ribbing
  ctx.strokeStyle = INK; ctx.lineWidth = 2;
  [-145, -135, -125].forEach((ry) => {
    ctx.beginPath(); ctx.moveTo(-16, ry); ctx.lineTo(16, ry); ctx.stroke();
  });
  ctx.restore();

  // If venting: pressurized white nitrogen steam clouds
  if (venting) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let c = 0; c < 8; c++) {
      const vx = -80 + c * 25;
      const vy = 150 + Math.sin(c) * 30;
      const vr = 35 + (c % 3) * 20;
      ctx.beginPath(); ctx.arc(vx, vy, vr, 0, TAU); ctx.fill();
    }
  }

  ctx.restore();
}

// =============================================================
// NEW SET PIECE 2.5: Autopsy Floor Dropped Scalpel Staging
// Cinematic low-angle: Autopsy ward back wall, glossy teal ceramic tiles,
// framing character legs (Dr. Maya surgical clogs + Maya sneakers),
// detailed #3 surgical handle with ruler markings and #10 razor blade impact.
// =============================================================
export function drawScalpelDropSet(ctx, options = {}) {
  const {
    scalpelY = 1120,
    scalpelRot = -0.38,
    sparks = true,
    impactProgress = 1.0,
  } = options;

  // 1. Upper Autopsy Ward Wall (y=0 to 620)
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, 620, [
    [0, '#0f0507'], [0.4, '#1c080b'], [1, '#2c0c10']
  ]);
  ctx.fillRect(0, 0, W, 620);

  // Red emergency strobe flare across upper wall
  ctx.fillStyle = radGrad(ctx, W * 0.5, 240, 20, 550, [
    [0, 'rgba(239, 68, 68, 0.45)'],
    [0.6, 'rgba(185, 28, 28, 0.18)'],
    [1, 'rgba(0,0,0,0)']
  ]);
  ctx.fillRect(0, 0, W, 620);

  // Stainless steel conduit pipes on wall
  [140, 220].forEach((py) => {
    ctx.fillStyle = linGrad(ctx, 0, py, 0, py + 18, [
      [0, '#94a3b8'], [0.5, '#f8fafc'], [1, '#475569']
    ]);
    ctx.fillRect(0, py, W, 18);
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.strokeRect(0, py, W, 18);
  });

  // Background Dissection Table tubular legs and caster wheels (midground y=420-620)
  [W * 0.35, W * 0.65].forEach((tx) => {
    ctx.fillStyle = linGrad(ctx, tx - 12, 0, tx + 12, 0, [
      [0, '#64748b'], [0.5, '#cbd5e1'], [1, '#334155']
    ]);
    ctx.fillRect(tx - 12, 440, 24, 180);
    ctx.strokeRect(tx - 12, 440, 24, 180);
    // Caster wheel
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(tx, 620, 16, 0, TAU); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
  });

  // 2. Autopsy Floor (y=620 to H) - Glossy ceramic tiles with wet specular sheen
  const floorY = 620;
  ctx.fillStyle = linGrad(ctx, 0, floorY, 0, H, [
    [0, '#0a1618'], [0.35, '#0e2428'], [1, '#050c0e']
  ]);
  ctx.fillRect(0, floorY, W, H - floorY);

  // Perspective floor tile grid
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.22)'; ctx.lineWidth = 2.5;
  for (let x = -300; x < W * 2; x += 150) {
    ctx.beginPath(); ctx.moveTo(x, floorY); ctx.lineTo((x - W * 0.5) * 3.2 + W * 0.5, H); ctx.stroke();
  }
  for (let y = floorY; y < H; y += 75) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Wet pool / Formalin sheen on floor
  ctx.fillStyle = 'rgba(20, 184, 166, 0.12)';
  ctx.beginPath(); ctx.ellipse(W * 0.5, 1100, 320, 95, 0, 0, TAU); ctx.fill();

  // Blood spatter drops on tiles
  ctx.fillStyle = 'rgba(185, 28, 28, 0.75)';
  [
    [W * 0.42, 1020, 9], [W * 0.38, 1060, 5], [W * 0.56, 1140, 8],
    [W * 0.62, 1090, 6], [W * 0.48, 1180, 7]
  ].forEach(([bx, by, br]) => {
    ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill();
  });

  // 3. Framing Character Legs
  // Left: Dr. Maya's legs & surgical clogs
  ctx.save();
  ctx.translate(W * 0.18, 560);
  // Scrubs legs
  drawLimbTube(ctx, -25, 0, -35, 340, 34, 28, '#1e3a5f', 4.5);
  drawLimbTube(ctx, 35, 0, 45, 340, 34, 28, '#1e3a5f', 4.5);
  // White hospital surgical clogs
  [-35, 45].forEach((cx, idx) => {
    ctx.save();
    ctx.translate(cx, 350);
    ctx.beginPath();
    ctx.ellipse(0, 0, 44, 22, idx === 0 ? -0.15 : 0.15, Math.PI, 0);
    ctx.lineTo(44, 12); ctx.lineTo(-44, 12); ctx.closePath();
    fillStroke(ctx, '#f8fafc', 4, INK);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(-40, 6, 80, 8); // Sole
    // Blood drop on left clog
    if (idx === 0) {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(10, -4, 6, 0, TAU); ctx.fill();
    }
    ctx.restore();
  });
  // Open dropped hand above
  drawHand(ctx, 110, 80, PAL.mayaSkin, PAL.mayaSkinShade, 0.8, 1.25);
  ctx.restore();

  // Right: Maya's legs & sneakers
  ctx.save();
  ctx.translate(W * 0.82, 560);
  // Denim jeans
  drawLimbTube(ctx, -35, 0, -40, 340, 32, 26, PAL.mayaPants, 4.5);
  drawLimbTube(ctx, 30, 0, 35, 340, 32, 26, PAL.mayaPants, 4.5);
  // Sneakers
  [-40, 35].forEach((cx, idx) => {
    ctx.save();
    ctx.translate(cx, 350);
    ctx.beginPath();
    ctx.ellipse(0, 0, 42, 20, idx === 0 ? -0.15 : 0.15, Math.PI, 0);
    ctx.lineTo(42, 12); ctx.lineTo(-42, 12); ctx.closePath();
    fillStroke(ctx, '#282E3A', 4, INK);
    ctx.fillStyle = '#E6EAEF'; ctx.fillRect(-38, 6, 76, 8); // Sole
    ctx.restore();
  });
  ctx.restore();

  // 4. Hero Surgical Scalpel
  const sx = W * 0.5;
  const sy = scalpelY;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(scalpelRot);

  // Scalpel drop shadow on wet tile floor
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath(); ctx.ellipse(8, 18, 130, 18, 0, 0, TAU); ctx.fill();

  // Stainless steel No. 3 Handle with metallic sheen
  ctx.fillStyle = linGrad(ctx, -120, -14, 120, 14, [
    [0, '#94a3b8'], [0.35, '#f8fafc'], [0.7, '#cbd5e1'], [1, '#64748b']
  ]);
  rrPath(ctx, -115, -12, 230, 24, 6);
  fillStroke(ctx, ctx.fillStyle, 3.5, INK);

  // Cross-hatched non-slip grip texture on handle
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)'; ctx.lineWidth = 1.5;
  for (let gx = -70; gx <= 20; gx += 8) {
    ctx.beginPath(); ctx.moveTo(gx, -11); ctx.lineTo(gx + 6, 11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx + 6, -11); ctx.lineTo(gx, 11); ctx.stroke();
  }

  // Millimeter ruler markings on upper spine
  ctx.strokeStyle = INK; ctx.lineWidth = 1.2;
  for (let mx = 30; mx <= 100; mx += 6) {
    ctx.beginPath(); ctx.moveTo(mx, -11); ctx.lineTo(mx, -6); ctx.stroke();
  }

  // Blade locking collar lug
  ctx.fillStyle = '#475569';
  rrPath(ctx, 110, -8, 16, 16, 3);
  fillStroke(ctx, '#334155', 2, INK);

  // High-Carbon Steel No. 10 Scalpel Blade
  ctx.beginPath();
  ctx.moveTo(118, -10);
  ctx.lineTo(195, -3);
  ctx.bezierCurveTo(210, 4, 190, 18, 118, 11);
  ctx.closePath();
  fillStroke(ctx, linGrad(ctx, 118, -10, 210, 18, [
    [0, '#f8fafc'], [0.5, '#e2e8f0'], [1, '#94a3b8']
  ]), 3.5, INK);

  // Razor polished cutting bevel
  ctx.beginPath();
  ctx.moveTo(130, 5);
  ctx.bezierCurveTo(180, 15, 202, 6, 195, -3);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();

  // Fresh blood smear on blade
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(150, 2);
  ctx.bezierCurveTo(175, 12, 195, 6, 192, -1);
  ctx.lineTo(165, 3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // 5. Impact Sparks & Acoustic Shockwave Rings
  if (sparks) {
    // Expanding golden shockwave rings across tiles
    for (let r = 40; r < 280; r += 55) {
      ctx.strokeStyle = `rgba(255, 234, 0, ${Math.max(0, 1 - r / 300) * impactProgress})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.ellipse(sx + 35, sy + 5, r, r * 0.42, 0, 0, TAU); ctx.stroke();
    }

    // High-heat friction sparks flying from blade contact
    ctx.strokeStyle = '#ffea00'; ctx.lineWidth = 3;
    for (let sp = 0; sp < 16; sp++) {
      const a = (sp / 16) * TAU;
      const len = 35 + ((sp * 23) % 45) * impactProgress;
      ctx.beginPath();
      ctx.moveTo(sx + 35, sy + 5);
      ctx.lineTo(sx + 35 + Math.cos(a) * len, sy + 5 + Math.sin(a) * (len * 0.5));
      ctx.stroke();
    }

    // Specular starburst at contact point
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(sx + 35, sy + 5, 16, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(sx - 15, sy + 5); ctx.lineTo(sx + 85, sy + 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx + 35, sy - 25); ctx.lineTo(sx + 35, sy + 35); ctx.stroke();
  }
}

// =============================================================
// NEW SET PIECE 3: Modern 2026 Millbrook Hospital Lobby (Broad Daylight)
// =============================================================
export function drawModernLobbySet(ctx, options = {}) {
  // Clear sunny sky outside
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, H * 0.5, [
    [0, '#38bdf8'], [0.4, '#7dd3fc'], [1, '#e0f2fe']
  ]);
  ctx.fillRect(0, 0, W, H * 0.5);

  // Sunlight radiant beam
  const sunGrad = radGrad(ctx, W * 0.8, 180, 20, 600, [
    [0, 'rgba(255, 245, 157, 0.65)'],
    [0.5, 'rgba(255, 238, 88, 0.25)'],
    [1, 'rgba(255, 255, 255, 0)']
  ]);
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, W, H);

  // Distant city street & greenery outside through glass wall
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(0, H * 0.38, W, 70); // Trees
  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, H * 0.44, W, 40); // Road

  // Full-height modern architectural glass window mullions
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)'; ctx.lineWidth = 6;
  for (let x = 0; x <= W; x += 270) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H * 0.48); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(0, H * 0.48); ctx.lineTo(W, H * 0.48); ctx.stroke();

  // Modern Pristine Hospital Floor (White marble with soft specular sheen)
  ctx.fillStyle = linGrad(ctx, 0, H * 0.48, 0, H, [
    [0, '#f8fafc'], [0.5, '#f1f5f9'], [1, '#e2e8f0']
  ]);
  ctx.fillRect(0, H * 0.48, W, H * 0.52);

  // Marble tile perspective grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'; ctx.lineWidth = 2;
  for (let x = -300; x < W * 2; x += 180) {
    ctx.beginPath(); ctx.moveTo(x, H * 0.48); ctx.lineTo((x - W * 0.5) * 3.5 + W * 0.5, H); ctx.stroke();
  }
  for (let y = H * 0.48; y < H; y += 120) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Curved Modern Reception Desk in midground
  const rdx = W * 0.5; const rdy = H * 0.58;
  ctx.fillStyle = '#ffffff';
  rrPath(ctx, rdx - 320, rdy, 640, 110, 24);
  fillStroke(ctx, '#ffffff', 4, '#cbd5e1');

  // LED Glow strip beneath desk
  ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(rdx - 300, rdy + 105); ctx.lineTo(rdx + 300, rdy + 105); ctx.stroke();

  // Modern Millbrook Logo on desk
  ctx.fillStyle = '#0284c7';
  ctx.font = '900 24px Inter, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('MILLBROOK MEDICAL CENTER', rdx, rdy + 45);
  ctx.font = '700 13px Inter, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('MAIN HOSPITAL LOBBY • GROUND FLOOR 2026', rdx, rdy + 75);

  // Indoor Potted Ficus Plants on sides
  [120, W - 120].forEach((px) => {
    // Pot
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(px - 35, rdy + 140); ctx.lineTo(px + 35, rdy + 140);
    ctx.lineTo(px + 25, rdy + 230); ctx.lineTo(px - 25, rdy + 230);
    ctx.closePath();
    fillStroke(ctx, '#334155', 3, INK);
    // Green leaves
    ctx.fillStyle = '#15803d';
    for (let l = 0; l < 7; l++) {
      const a = (l / 7) * Math.PI;
      ctx.beginPath();
      ctx.ellipse(px + Math.cos(a) * 45, rdy + 110 - Math.sin(a) * 45, 24, 14, a, 0, TAU);
      ctx.fill();
    }
  });
}

// =============================================================
// NEW SET PIECE 4: Modern Elevator Panel (Button 13 Sealed/Vanished!)
// =============================================================
export function drawModernElevatorPanel(ctx, x, y, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Brushed aluminum panel plate
  ctx.fillStyle = linGrad(ctx, -140, -280, 140, 280, [
    [0, '#e2e8f0'], [0.5, '#cbd5e1'], [1, '#94a3b8']
  ]);
  rrPath(ctx, -140, -280, 280, 560, 20);
  fillStroke(ctx, ctx.fillStyle, 4.5, INK);

  // Digital Floor Display at top: "G" in crisp cyan LED
  rrPath(ctx, -100, -250, 200, 70, 10);
  fillStroke(ctx, '#0f172a', 3, '#38bdf8');
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 48px Inter, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('G', 0, -215);

  // 12 Modern Round Backlit Buttons in 3 columns x 4 rows
  const cols = [-70, 0, 70];
  const rows = [-140, -65, 10, 85];
  let floorNum = 12;

  for (let r = 0; r < 4; r++) {
    for (let c = 2; c >= 0; c--) {
      const bx = cols[c]; const by = rows[r];
      // Button housing
      ctx.beginPath(); ctx.arc(bx, by, 26, 0, TAU);
      fillStroke(ctx, floorNum === 1 ? '#0284c7' : '#f8fafc', 3, INK);
      // Floor number
      ctx.fillStyle = floorNum === 1 ? '#ffffff' : '#0f172a';
      ctx.font = '900 18px Inter, sans-serif';
      ctx.fillText(String(floorNum), bx, by);
      floorNum--;
    }
  }

  // Bottom Notice: Smooth Sealed Plate where "13" would have been
  rrPath(ctx, -110, 150, 220, 60, 8);
  fillStroke(ctx, '#94a3b8', 2.5, INK);
  ctx.fillStyle = '#1e293b';
  ctx.font = '900 12px Inter, sans-serif';
  ctx.fillText('MAX FLOORS: 12', 0, 172);
  ctx.font = '700 9px Inter, sans-serif';
  ctx.fillText('NO SUB-LEVEL ACCESS', 0, 192);

  ctx.restore();
}

// =============================================================
// NEW SET PIECE 5: The 1978 Tarnished Brass Badge Souvenir
// =============================================================
export function draw1978BrassBadge(ctx, x, y, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  rrPath(ctx, -165, -85, 330, 180, 16);
  ctx.fill();

  // Brass body with vintage brushed patina
  ctx.fillStyle = linGrad(ctx, -160, -80, 160, 80, [
    [0, '#d97706'], [0.3, '#f59e0b'], [0.6, '#fbbf24'], [1, '#b45309']
  ]);
  rrPath(ctx, -160, -80, 320, 160, 14);
  fillStroke(ctx, ctx.fillStyle, 5, INK);

  // Beveled inner border
  ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2.5;
  rrPath(ctx, -145, -68, 290, 136, 8);
  ctx.stroke();

  // Corner rivets
  [[-140, -63], [140, -63], [-140, 63], [140, 63]].forEach(([rx, ry]) => {
    ctx.fillStyle = '#451a03';
    ctx.beginPath(); ctx.arc(rx, ry, 4, 0, TAU); ctx.fill();
  });

  // Engraved Header: "MILLBROOK HOSPITAL • 1978"
  ctx.fillStyle = '#451a03';
  ctx.font = '900 16px Inter, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('MILLBROOK PSYCHIATRIC & SURGICAL', 0, -42);

  // Designation: "CHIEF SURGEON"
  ctx.fillStyle = '#78350f';
  ctx.font = '800 13px Inter, sans-serif';
  ctx.fillText('CHIEF SURGEON — PATHOLOGY WARD', 0, -18);

  // Name: "DR. MAYA CHEN"
  ctx.fillStyle = '#1e1b4b';
  ctx.font = '900 28px Inter, sans-serif';
  ctx.fillText('DR. MAYA CHEN', 0, 14);

  // Serial & Date: "OCTOBER 31, 1978 • CASE #1308"
  ctx.fillStyle = '#78350f';
  ctx.font = '800 12px Inter, sans-serif';
  ctx.fillText('OCTOBER 31, 1978 • ID: #1308', 0, 48);

  ctx.restore();
}

// =============================================================
// EPISODE 4 KEYFRAMES (20 Keyframes Array)
// =============================================================
export const KEYFRAMES_EP4 = [
  // 1. KF-01: Voting Result & Stand-off
  {
    id: 'KF-01',
    title: '0:00-0:04 | Audience Result: [B] BURN Selected',
    hinglish: 'Audience ne chuna Option B: BURN THE LOOP! Lift ke samne khadi thi wahi purani Maya... aur Dr. Maya Chen!',
    render(ctx) {
      drawHospitalLobbySet(ctx, { time: 'night', redAlert: true });
      // Flooded floor with emerald coolant spill reflecting siren lights
      ctx.fillStyle = 'rgba(0, 230, 118, 0.16)';
      ctx.fillRect(0, H * 0.72, W, H * 0.28);
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.35)'; ctx.lineWidth = 2;
      for (let y = H * 0.74; y < H; y += 45) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Dr. Maya on left with scalpel raised
      ctx.save();
      ctx.translate(W * 0.28, 980);
      drawDrMaya(ctx, 0, 0, 1.25, { mood: 'shock', holdScalpel: true, bloodStains: true, look: [0.6, 0] });
      ctx.restore();

      // Maya on right backing away in terror
      ctx.save();
      ctx.translate(W * 0.74, 980);
      drawMaya(ctx, 0, 0, 1.25, { mood: 'scream', pose: 'reach', look: [-0.7, -0.1], sweat: true });
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'VOTING CLOSED', 'OPTION [B] WON (84%)', { color: '#ff3d00' });
      drawStamp(ctx, 420, 140, 'DECISION', 'BURN THE LOOP', { color: '#ffea00' });
      vignette(ctx, 0.4); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 2. KF-02: Scalpel Gleam Push-in
  {
    id: 'KF-02',
    title: '0:04-0:08 | Tension Push-In: The Trembling Blade',
    hinglish: 'Dr. Maya ke haath mein scalpel kaanp raha tha... shikaari aur shikaar ka aamna saamna!',
    render(ctx) {
      drawMorgueCorridor(ctx);
      // Pulsing emergency red radial strobe
      ctx.fillStyle = radGrad(ctx, W * 0.5, 400, 40, 700, [
        [0, 'rgba(239, 68, 68, 0.45)'], [1, 'rgba(0,0,0,0)']
      ]);
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(W * 0.5, 960);
      drawDrMaya(ctx, 0, 0, 1.55, { mood: 'shock', holdScalpel: true, bloodStains: true, look: [0, 0.2] });
      ctx.restore();

      // Gleam glint on scalpel blade
      ctx.save();
      ctx.translate(W * 0.5 + 85, 910);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-35, 0); ctx.lineTo(35, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -35); ctx.lineTo(0, 35); ctx.stroke();
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'CONFRONTATION', 'SCALPEL RAISED', { color: '#ff1744' });
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 3. KF-03: PA Intercom Order
  {
    id: 'KF-03',
    title: '0:08-0:13 | Dr. Ward PA Order: Harvest the Specimen',
    hinglish: 'Shift complete kijiye Dr. Chen! Nayee body ka marrow harvest kijiye... warna timeline collapse ho jayegi!',
    render(ctx) {
      drawMorgueCorridor(ctx);
      // Red alarm flash background
      ctx.fillStyle = radGrad(ctx, W * 0.5, 600, 20, 650, [
        [0, 'rgba(239, 68, 68, 0.55)'], [1, 'rgba(0,0,0,0)']
      ]);
      ctx.fillRect(0, 0, W, H);

      // Vintage PA Wall Speaker Housing
      ctx.save();
      ctx.translate(W * 0.5, 620);
      ctx.fillStyle = '#334155';
      rrPath(ctx, -90, -90, 180, 180, 22);
      fillStroke(ctx, '#1e293b', 5, INK);
      ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU);
      fillStroke(ctx, '#0f172a', 4, '#ef4444');

      // Acoustic vibration shockwaves
      for (let w = 80; w < 300; w += 45) {
        ctx.strokeStyle = `rgba(239, 68, 68, ${1 - w / 320})`;
        ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.arc(0, 0, w, -0.65, 0.65); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, w, Math.PI - 0.65, Math.PI + 0.65); ctx.stroke();
      }
      ctx.restore();

      // Intercom Security Card overlay (Dr. Ward)
      ctx.save();
      ctx.translate(W * 0.5, 1120);
      ctx.scale(1.15, 1.15);
      rrPath(ctx, -140, -110, 280, 220, 16);
      fillStroke(ctx, '#1e293b', 4.5, '#ef4444');
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-140, -110, 280, 36);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 14px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('PA SYSTEM ACTIVE • EMERGENCY ORDER', 0, -92);
      ctx.font = '800 20px Inter, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('DR. ELIAS WARD', 0, -35);
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('DIRECTOR OF RESEARCH • 1978', 0, -10);
      ctx.font = '900 16px Inter, sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('"HARVEST THE SPECIMEN NOW!"', 0, 45);
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'INTERCOM ORDER', 'DR. ELIAS WARD', { color: '#ef4444' });
      drawCaption(ctx, [{ t: '"SHIFT COMPLETE KIJIYE DR. MAYA...' }, { t: 'HARVEST THE SPECIMEN!"', c: PAL.crimson }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 4. KF-04: The Horrifying Realization
  {
    id: 'KF-04',
    title: '0:13-0:18 | Realization: We Are Both Prisoners',
    hinglish: 'Main shikaari nahi hoon... aur tu shikaar nahi hai. Hum dono... ek hi qaid mein hain!',
    render(ctx) {
      drawAutopsyWardSet(ctx, { redAlert: true });
      drawDissectionTable(ctx, W * 0.5, 1260, 0.85);

      // Dr. Maya realizing her trap
      ctx.save();
      ctx.translate(W * 0.32, 960);
      drawDrMaya(ctx, 0, 0, 1.25, { mood: 'shock', holdScalpel: true, bloodStains: true, look: [0.5, 0.2] });
      ctx.restore();

      // Maya staring across table
      ctx.save();
      ctx.translate(W * 0.72, 960);
      drawMaya(ctx, 0, 0, 1.25, { mood: 'worried', pose: 'stand_phone', look: [-0.6, 0.1] });
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'OUROBOROS', 'THE CYCLE REVEALED', { color: '#ffea00' });
      drawCaption(ctx, [{ t: '"MAIN SHIKAARI NAHI HOON...' }, { t: 'HUM DONO EK HI QAID MEIN HAIN!"', c: PAL.cyan }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 5. KF-05: CLANG: Scalpel Hits The Floor
  {
    id: 'KF-05',
    title: '0:18-0:22 | CLANG: The Scalpel Hits the Floor',
    hinglish: 'CLANG! Haath se chhoot kar surgical scalpel zameen par gir gaya!',
    render(ctx) {
      drawScalpelDropSet(ctx, {
        scalpelY: 1120,
        scalpelRot: -0.36,
        sparks: true,
        impactProgress: 1.0,
      });

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'THE CHOICE', 'SCALPEL DROPPED', { color: '#00e5ff' });
      drawCaption(ctx, [{ t: 'CLANG! HAATH SE CHHOOT KAR' }, { t: 'SURGICAL SCALPEL GIR GAYA!', c: PAL.gold }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 6. KF-06: The Battle Plan & Axe Handoff
  {
    id: 'KF-06',
    title: '0:22-0:26 | The Battle Plan: Smash the Engine Breaker',
    hinglish: 'Substation ka master breaker todna hoga... aur stasis core dump karna hoga!',
    render(ctx) {
      drawMorgueCorridor(ctx);

      // Emergency Fire Axe Wall Case in background (glass smashed!)
      ctx.save();
      ctx.translate(W * 0.5, 540);
      ctx.fillStyle = '#7f1d1d';
      rrPath(ctx, -140, -140, 280, 280, 14);
      fillStroke(ctx, '#991b1b', 5, INK);

      // Case header text
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 13px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('EMERGENCY FIRE AXE • 1978', 0, -115);

      // Smashed glass cracks
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-120, -100); ctx.lineTo(-20, 20); ctx.lineTo(120, -60);
      ctx.moveTo(-20, 20); ctx.lineTo(40, 110);
      ctx.moveTo(-20, 20); ctx.lineTo(-110, 80);
      ctx.stroke();
      ctx.restore();

      // Dr. Maya handing the axe
      ctx.save();
      ctx.translate(W * 0.28, 980);
      drawDrMaya(ctx, 0, 0, 1.25, { mood: 'serious', holdScalpel: false, bloodStains: true, look: [0.6, 0] });
      ctx.restore();

      // Maya accepting weapon
      ctx.save();
      ctx.translate(W * 0.72, 980);
      drawMaya(ctx, 0, 0, 1.25, { mood: 'fierce', pose: 'hold_axe', holdAxe: true, look: [-0.6, 0] });
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'THE WEAPON', '1978 FIRE AXE', { color: '#ff3d00' });
      drawCaption(ctx, [{ t: '"SUBSTATION KA BREAKER TODNA HOGA...' }, { t: 'AUR STASIS CORE PURGE KARNA HOGA!"', c: PAL.crimson }], 1620);
      vignette(ctx, 0.4); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 7. KF-07: Warrior Maya: Loop Ka Antim Sanskar
  {
    id: 'KF-07',
    title: '0:26-0:30 | Maya Defiant: Loop Ka Antim Sanskar',
    hinglish: 'Aaj is bhootia loop ka antim sanskar hoga! Maya ne axe dono haathon mein kheenchi!',
    render(ctx) {
      drawSubstationSet(ctx, { alarmed: true });

      // Maya in center in fierce ready combat stance holding axe
      ctx.save();
      ctx.translate(W * 0.5, 960);
      drawMaya(ctx, 0, 0, 1.45, {
        mood: 'fierce',
        pose: 'hold_axe',
        holdAxe: true,
        axeRot: 0.35,
        sweat: true,
        look: [0, -0.2]
      });
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'WARRIOR MAYA', 'READY TO DESTROY LOOP', { color: '#ff3d00' });
      drawCaption(ctx, [{ t: '"AAJ IS BHOOTIA LOOP KA' }, { t: 'ANTIM SANSKAR HOGA!"', c: PAL.gold }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 8. KF-08: Split Sprint to Stations
  {
    id: 'KF-08',
    title: '0:30-0:34 | Dual Sprint: Autopsy Core vs Engine Room',
    hinglish: 'Dono Maya alag dishaon mein daudi... ek engine room aur doosri morgue core!',
    render(ctx) {
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, W, H);

      // Left side: Autopsy corridor
      ctx.save();
      ctx.rect(0, 160, W / 2, H - 320); ctx.clip();
      drawAutopsyWardSet(ctx, { redAlert: true });
      drawDrMaya(ctx, W * 0.25, 1020, 1.15, { mood: 'serious', pose: 'sprint', runPhase: 1.5, bloodStains: true });
      ctx.restore();

      // Right side: Substation machinery corridor
      ctx.save();
      ctx.rect(W / 2, 160, W / 2, H - 320); ctx.clip();
      drawSubstationSet(ctx, { alarmed: true });
      drawMaya(ctx, W * 0.75, 1020, 1.15, { mood: 'fierce', pose: 'sprint', holdAxe: true, runPhase: 1.5 });
      ctx.restore();

      // Center laser divider beam
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(W / 2, 160); ctx.lineTo(W / 2, H - 160); ctx.stroke();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'DUAL STRIKE', 'SIMULTANEOUS ASSAULT', { color: '#ffea00' });
      vignette(ctx, 0.4); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 9. KF-09: Master Breaker Box Macro
  {
    id: 'KF-09',
    title: '0:34-0:38 | Master Breaker Substation 480V',
    hinglish: 'Elevator substation ka master breaker... poore hospital ki lifeline!',
    render(ctx) {
      drawSubstationSet(ctx, { alarmed: true });
      drawBreakerBox(ctx, W * 0.5, 960, 1.5, { smashed: false });

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'TARGET', 'MAIN BREAKER 480V', { color: '#ffea00' });
      drawArrowCallout(ctx, W * 0.5 + 130, 840, W * 0.5 + 40, 920, '480V SUBSTATION PANEL', { dir: 'left', color: '#ffea00' });
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 10. KF-10: The Axe Smash & High-Voltage Detonation
  {
    id: 'KF-10',
    title: '0:38-0:43 | DHADAM: Breaker Smashed with Fire Axe',
    hinglish: 'DHADAM! Maya ne poori taqat se fire axe breaker box par de maari! Bijli ke shole blast hone lage!',
    render(ctx) {
      // Substation in full high-voltage electrical detonation
      drawSubstationSet(ctx, { alarmed: true, arcLight: 1.0 });

      // Exploding Breaker Box
      drawBreakerBox(ctx, W * 0.55, 940, 1.55, { smashed: true, sparked: true, arcSeed: 2.5 });

      // Maya in full warrior braced swing strike using CANONICAL Maya puppet from chars.js!
      drawMayaAxeSwing(ctx, W * 0.32, 980, 1.35, 1.0);

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'BREAKER SMASHED', 'CIRCUIT SEVERED', { color: '#00e5ff' });
      drawCaption(ctx, [{ t: 'DHADAM! MAYA NE FIRE AXE' }, { t: 'BREAKER PAR DE MAARI!', c: PAL.gold }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 11. KF-11: Cryo Core Hydraulic Purge Lever
  {
    id: 'KF-11',
    title: '0:43-0:48 | Cryogenic Core Emergency Hydraulic Dump',
    hinglish: 'Autopsy room mein Dr. Maya ne emergency cryogenic lever kheench diya!',
    render(ctx) {
      drawAutopsyWardSet(ctx, { redAlert: true });
      drawCryoPurgeStation(ctx, W * 0.65, 960, 1.45, { leverDown: true, venting: true });

      // Dr. Maya throwing weight onto lever
      ctx.save();
      ctx.translate(W * 0.32, 1010);
      drawDrMaya(ctx, 0, 0, 1.3, { mood: 'serious', holdScalpel: false, bloodStains: true, look: [0.6, 0] });
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'CORE PURGE', 'HYDRAULIC DUMP ACTIVE', { color: '#00e5ff' });
      drawCaption(ctx, [{ t: 'DR. MAYA NE CRYO CORE' }, { t: 'EMERGENCY LEVER KHEENCH DIYA!', c: PAL.cyan }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 12. KF-12: Pod 1308 Detonation & Steam Vent
  {
    id: 'KF-12',
    title: '0:48-0:52 | Pod 1308 Pressure Vent & Dissolution',
    hinglish: 'Chamber 1308 se pressurized nitrogen nikla... aur frozen laash dhool ban kar ud gayi!',
    render(ctx) {
      drawAutopsyWardSet(ctx, { redAlert: true });
      drawCryoChamberWithEntity(ctx, W * 0.5, 850, 1.4, { glassBroken: true });

      // Multi-layer volumetric nitrogen steam plumes
      for (let c = 0; c < 16; c++) {
        const cx = W * 0.5 - 240 + (c * 32);
        const cy = 820 + Math.sin(c * 1.5) * 80;
        ctx.fillStyle = radGrad(ctx, cx, cy, 10, 95, [
          [0, 'rgba(255, 255, 255, 0.85)'],
          [0.6, 'rgba(207, 250, 254, 0.45)'],
          [1, 'rgba(255, 255, 255, 0)']
        ]);
        ctx.beginPath(); ctx.arc(cx, cy, 95, 0, TAU); ctx.fill();
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'STASIS COLLAPSE', 'CORPSE EVAPORATED', { color: '#00e5ff' });
      vignette(ctx, 0.4); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 13. KF-13: Dr. Ward Intercom Meltdown
  {
    id: 'KF-13',
    title: '0:52-0:56 | Dr. Elias Ward Static Fadeout',
    hinglish: 'Nahi... ruko! Tum poore Millbrook ko erase kar rahi ho— *glitch static fade*',
    render(ctx) {
      drawMorgueCorridor(ctx);

      // Severe Glitch scanlines & CRT distortion
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      for (let y = 0; y < H; y += 8) { ctx.fillRect(0, y, W, 4); }

      // Distorted melting intercom speaker with fire sparks
      ctx.save();
      ctx.translate(W * 0.5, 780);
      ctx.fillStyle = '#334155'; rrPath(ctx, -110, -110, 220, 220, 24);
      fillStroke(ctx, '#0f172a', 5, '#ef4444');

      // Sparks shooting from overheated speaker
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3.5;
      for (let sp = 0; sp < 18; sp++) {
        const a = (sp / 18) * TAU;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 140, Math.sin(a) * 140); ctx.stroke();
      }
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'TIMELINE COLLAPSE', 'DR. WARD TERMINATED', { color: '#ef4444' });
      drawCaption(ctx, [{ t: '"NAHI... RUKO! TUM MILLBROOK KO' }, { t: 'ERASE KAR RAHI HO—"', c: PAL.crimson }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 14. KF-14: 1978 Hospital Disintegration
  {
    id: 'KF-14',
    title: '0:56-1:01 | The 1978 World Peeling Away Like Film',
    hinglish: '1978 ka poora hospital purani reel ki tarah jal kar pighalne laga... sab dhool ban kar ud gaye!',
    render(ctx) {
      // Cosmic void backdrop visible through torn walls
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
        [0, '#090514'], [0.5, '#1e1035'], [1, '#05020a']
      ]);
      ctx.fillRect(0, 0, W, H);

      // Swirling cosmic nebula clouds
      for (let n = 0; n < 8; n++) {
        const nx = 180 + n * 110;
        const ny = 400 + Math.sin(n) * 350;
        ctx.fillStyle = radGrad(ctx, nx, ny, 20, 240, [
          [0, 'rgba(168, 85, 247, 0.35)'],
          [0.6, 'rgba(0, 229, 255, 0.18)'],
          [1, 'rgba(0,0,0,0)']
        ]);
        ctx.beginPath(); ctx.arc(nx, ny, 240, 0, TAU); ctx.fill();
      }

      // Peeling 1978 hospital walls with burning cellulose film edges
      ctx.save();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 8;
      for (let strip = 0; strip < 6; strip++) {
        const sx = strip * 180 + 30;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.beginPath();
        ctx.moveTo(sx, 180);
        ctx.bezierCurveTo(sx + 80, 600, sx - 60, 1000, sx + 40, H - 180);
        ctx.lineTo(sx + 140, H - 180);
        ctx.bezierCurveTo(sx + 40, 1000, sx + 180, 600, sx + 140, 180);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'REALITY PEELING', 'CELLULOID DISSOLUTION', { color: '#ffea00' });
      drawCaption(ctx, [{ t: '1978 KA POORA HOSPITAL' }, { t: 'PURANI REEL KI TARAH JAL GAYA!', c: PAL.gold }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  },

  // 15. KF-15: The Center of the Rift: Face to Face
  {
    id: 'KF-15',
    title: '1:01-1:06 | The Center of the Rift: Face to Face',
    hinglish: 'Tute hue time ke beech... dono Mayas ek doosre ke aamne saamne khadi thin!',
    render(ctx) {
      // Celestial Rift Singularity
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
        [0, '#060814'], [0.5, '#15132b'], [1, '#060814']
      ]);
      ctx.fillRect(0, 0, W, H);

      // Central radiant cosmic rift core
      ctx.fillStyle = radGrad(ctx, W * 0.5, 960, 40, 620, [
        [0, 'rgba(0, 229, 255, 0.45)'],
        [0.45, 'rgba(217, 70, 239, 0.25)'],
        [1, 'rgba(0,0,0,0)']
      ]);
      ctx.beginPath(); ctx.arc(W * 0.5, 960, 620, 0, TAU); ctx.fill();

      // Dr. Maya on left
      ctx.save();
      ctx.translate(W * 0.28, 980);
      drawDrMaya(ctx, 0, 0, 1.3, { mood: 'serious', holdScalpel: false, bloodStains: false, look: [0.6, 0] });
      ctx.restore();

      // Maya on right
      ctx.save();
      ctx.translate(W * 0.72, 980);
      drawMaya(ctx, 0, 0, 1.3, { mood: 'curious', pose: 'stand_phone', look: [-0.6, 0] });
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'THE RIFT', 'TWO TIMELINES MEET', { color: '#00e5ff' });
      drawCaption(ctx, [{ t: 'TUTE HUE TIME KE BEECH...' }, { t: 'DONO MAYAS AAMNE SAAMNE!', c: PAL.cyan }], 1620);
      vignette(ctx, 0.4); filmGrainOverlay(ctx, 0.025);
    }
  },

  // 16. KF-16: Hands Clasp: "Hum Aazaad Hain!"
  {
    id: 'KF-16',
    title: '1:06-1:10 | Hands Clasp: "Hum Aazaad Hain!"',
    hinglish: '"Hum aazaad hain!" Dono ne haath pakda... aur time loop hamesha ke liye toot gaya!',
    render(ctx) {
      // Cosmic Rift Singularity
      ctx.fillStyle = radGrad(ctx, W * 0.5, 960, 40, 680, [
        [0, 'rgba(255, 234, 0, 0.55)'],
        [0.4, 'rgba(0, 229, 255, 0.30)'],
        [1, 'rgba(8, 12, 22, 0.95)']
      ]);
      ctx.fillRect(0, 0, W, H);

      // Both full-body characters reaching into center
      ctx.save();
      ctx.translate(W * 0.32, 980);
      drawDrMaya(ctx, 0, 0, 1.3, { mood: 'serious', holdScalpel: false, look: [0.7, 0] });
      ctx.restore();

      ctx.save();
      ctx.translate(W * 0.68, 980);
      drawMaya(ctx, 0, 0, 1.3, { mood: 'curious', pose: 'reach', look: [-0.7, 0] });
      ctx.restore();

      // Joined hands at center with golden supernova flare
      ctx.save();
      ctx.translate(W * 0.5, 960);
      drawHand(ctx, -14, 0, PAL.doppelSkin, PAL.doppelSkinShade, 0.4, 1.4);
      drawHand(ctx, 14, 0, PAL.mayaSkin, PAL.mayaSkinShade, -0.4, 1.4);

      // Golden resonance shockwave ring
      for (let r = 30; r < 280; r += 60) {
        ctx.strokeStyle = `rgba(255, 215, 0, ${1 - r / 300})`;
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
      }

      // Specular flare
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fill();
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'UNIFICATION', 'LOOP SHATTERED', { color: '#ffea00' });
      drawCaption(ctx, [{ t: '"HUM AAZAAD HAIN!"' }, { t: 'TIME LOOP HAMESHA KE LIYE TOOT GAYA!', c: PAL.gold }], 1620);
      vignette(ctx, 0.35); filmGrainOverlay(ctx, 0.02);
    }
  },

  // 17. KF-17: FLASH: Supernova Temporal Whiteout
  {
    id: 'KF-17',
    title: '1:10-1:15 | FLASH: Supernova Temporal Whiteout',
    hinglish: 'FLASH! Ek blinding safed roshni ne sab kuch mita diya!',
    render(ctx) {
      // Radiant golden whiteout explosion
      ctx.fillStyle = radGrad(ctx, W * 0.5, 960, 40, W * 0.9, [
        [0, '#ffffff'],
        [0.4, '#fffbeb'],
        [0.75, '#fef08a'],
        [1, '#38bdf8']
      ]);
      ctx.fillRect(0, 0, W, H);

      // Radial shockwave rays
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 4;
      for (let r = 0; r < 24; r++) {
        const a = (r / 24) * TAU;
        ctx.beginPath();
        ctx.moveTo(W * 0.5, 960);
        ctx.lineTo(W * 0.5 + Math.cos(a) * W, 960 + Math.sin(a) * H);
        ctx.stroke();
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'SUPERNOVA', 'THE PURGE COMPLETE', { color: '#0284c7' });
      vignette(ctx, 0.15); filmGrainOverlay(ctx, 0.015);
    }
  },

  // 18. KF-18: Modern Elevator Doors Open: Ground Floor
  {
    id: 'KF-18',
    title: '1:15-1:20 | Modern Elevator Doors Open: Ground Floor',
    hinglish: 'DING! Lift ke darwaze khule... aur saamne tha 2026 ka modern hospital lobby!',
    render(ctx) {
      // Modern Elevator Cab
      drawElevatorCab(ctx, { doorsOpen: 0.85, modern: true });

      // Radiant morning daylight streaming into cab
      ctx.fillStyle = linGrad(ctx, W * 0.5, 0, W * 0.5, H, [
        [0, 'rgba(254, 240, 138, 0.45)'],
        [0.6, 'rgba(255, 255, 255, 0.25)'],
        [1, 'rgba(0,0,0,0)']
      ]);
      ctx.fillRect(0, 0, W, H);

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'GROUND FLOOR', 'YEAR: 2026', { color: '#00e5ff' });
      drawCaption(ctx, [{ t: 'DING! LIFT KE DARWAZE KHULE...' }, { t: 'GROUND FLOOR 2026!', c: PAL.cyan }], 1620);
      vignette(ctx, 0.35); filmGrainOverlay(ctx, 0.02);
    }
  },

  // 19. KF-19: Broad Daylight: Back in the Real World
  {
    id: 'KF-19',
    title: '1:20-1:27 | Broad Daylight: Back in the Real World',
    hinglish: 'Subah ki dhoop... doctors, nurses aur patients! Maya wapas apni duniya mein thi!',
    render(ctx) {
      drawModernLobbySet(ctx, { time: 'morning' });

      // Maya stepping forward into lobby, peaceful & free
      ctx.save();
      ctx.translate(W * 0.5, 1020);
      drawMaya(ctx, 0, 0, 1.3, { mood: 'curious', pose: 'idle', look: [0, -0.2] });
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'THE REAL WORLD', 'SURVIVED & FREE', { color: '#16a34a' });
      drawCaption(ctx, [{ t: 'SUBAH KI DHOOP... NORMAL DUNIYA!' }, { t: 'MAYA WAS FINALLY FREE!', c: PAL.gold }], 1620);
      vignette(ctx, 0.3); filmGrainOverlay(ctx, 0.02);
    }
  },

  // 20. KF-20: The 1978 Souvenir & Series Completion
  {
    id: 'KF-20',
    title: '1:27-1:35 | The 1978 Souvenir & Series Completion',
    hinglish: 'Lekin uski jeb mein ek cheez reh gayi thi... 1978 ka brass badge! Mystery Solved. Series Complete!',
    render(ctx) {
      drawModernLobbySet(ctx, { time: 'morning' });

      // Foreground Hero Prop Display: Tarnished 1978 Brass Badge in sunlight
      ctx.save();
      ctx.translate(W * 0.5, 960);
      ctx.shadowColor = 'rgba(255, 215, 0, 0.65)';
      ctx.shadowBlur = 35;
      draw1978BrassBadge(ctx, 0, 0, 1.8);
      ctx.restore();

      // Final Series Completion Banner Card
      rrPath(ctx, 80, 1600, W - 160, 95, 18);
      fillStroke(ctx, 'rgba(15, 23, 42, 0.94)', 3.5, PAL.gold);
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillStyle = PAL.gold;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('THE FREE LIFT • 4-PART SERIES COMPLETE!', W * 0.5, 1635);
      ctx.font = '700 16px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('THANKS FOR WATCHING • LIKE & SUBSCRIBE', W * 0.5, 1665);

      drawTopHUD(ctx, { title: 'THE FREE LIFT • SERIES FINALE' });
      drawStamp(ctx, 70, 140, 'MYSTERY SOLVED', 'LOOP BROKEN', { color: '#00e5ff' });
      drawStamp(ctx, 420, 140, 'THE SOUVENIR', '1978 BRASS BADGE', { color: '#ffea00' });
      vignette(ctx, 0.35); filmGrainOverlay(ctx, 0.02);
    }
  },
];


export { drawFireAxe };

// =============================================================
// CHARACTER POSE: Maya Full-Force Fire Axe Swing Strike
// Canonical Maya Puppet from chars.js with authentic hair, face, and braced stance
// =============================================================
export function drawMayaAxeSwing(ctx, x, y, scale = 1.0, swingPhase = 1.0) {
  const axeRot = 0.42 + Math.sin(swingPhase * Math.PI) * 0.22;
  drawMaya(ctx, x, y, scale, {
    mood: 'fierce',
    pose: 'axe_swing',
    leanDeg: -8,
    holdAxe: true,
    axeRot: axeRot,
    sweat: true,
    look: [0.6, -0.1],
  });
}
