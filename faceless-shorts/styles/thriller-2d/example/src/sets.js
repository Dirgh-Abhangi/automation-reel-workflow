// Multi-plane 2D atmospheric environments & volumetric lighting inspired by Tower 11.
import { W, H, PAL, INK, TAU, rrPath, radGrad, linGrad, fillStroke, rnd, dustMotes } from './palette.js';

function drawPineRow(ctx, yBase, count, minH, maxH, col, seed = 1) {
  ctx.save();
  ctx.fillStyle = col;
  const step = W / count;
  for (let i = -1; i <= count + 1; i++) {
    const cx = i * step + (rnd(seed + i * 2.1) - 0.5) * step * 0.5;
    const h = minH + rnd(seed + i * 7.3) * (maxH - minH);
    const w = h * 0.42;
    ctx.beginPath();
    ctx.moveTo(cx, yBase - h);
    ctx.lineTo(cx + w * 0.5, yBase);
    ctx.lineTo(cx - w * 0.5, yBase);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function drawHospitalFacade(ctx, t = 0) {
  // 1. Starry midnight indigo sky gradient with subtle horizon lift behind spire silhouette
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
    [0, '#071020'],
    [0.52, '#11213B'],
    [1, '#1A3052'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Crisp subtle twinkling stars (upper sky)
  for (let i = 0; i < 65; i++) {
    const sx = rnd(i * 19.1) * W;
    const sy = 120 + rnd(i * 41.7) * 760;
    const sr = 1 + rnd(i * 7.9) * 2.2;
    const tw = 0.65 + 0.35 * Math.sin(t * 2.2 + i * 1.7);
    ctx.fillStyle = `rgba(240, 244, 255, ${(0.25 + rnd(i * 3.3) * 0.6) * tw})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, TAU);
    ctx.fill();
  }

  // Moon + atmospheric halo behind upper-right tower
  const mx = 845, my = 415;
  ctx.fillStyle = radGrad(ctx, mx, my, 40, 280, [
    [0, 'rgba(239, 232, 212, 0.38)'],
    [0.5, 'rgba(200, 220, 255, 0.14)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.beginPath();
  ctx.arc(mx, my, 280, 0, TAU);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(mx, my, 62, 0, TAU);
  fillStroke(ctx, PAL.moon, 3, 'rgba(255,255,255,0.45)');

  // Distant rolling hills + background mist ribbons (STRICTLY BEHIND building!)
  ctx.fillStyle = '#0D1726';
  ctx.beginPath();
  ctx.moveTo(0, 1340);
  ctx.quadraticCurveTo(260, 1260, 560, 1320);
  ctx.quadraticCurveTo(840, 1375, W, 1285);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.fill();
  drawPineRow(ctx, 1480, 24, 150, 230, '#09101B', 11);

  ctx.fillStyle = 'rgba(155, 190, 230, 0.08)';
  [[540 - 280, 540, 310, 36], [540 + 270, 610, 330, 40]].forEach(([mx2, my2, rx2, ry2]) => {
    ctx.beginPath();
    ctx.ellipse(mx2, my2, rx2, ry2, 0, 0, TAU);
    ctx.fill();
  });

  // 2. Main Millbrook Hospital silhouette planted solidly on stone plinth (clean contrast off sky)
  const hx = W / 2;
  const topY = 470;
  const groundY = 1525;

  // Side brick wings (distinct cool slate masonry against sky + moonlight rim)
  rrPath(ctx, hx - 415, topY + 210, 830, groundY - (topY + 210), 10);
  fillStroke(ctx, '#1A2638', 5, INK);
  // Subtle moonlight top/side edge highlight separating wings from night sky
  ctx.strokeStyle = 'rgba(170, 205, 250, 0.24)';
  ctx.lineWidth = 3;
  ctx.strokeRect(hx - 412, topY + 214, 824, groundY - (topY + 210) - 6);
  // Horizontal brick floor ledger lines
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let y = topY + 280; y < groundY; y += 70) {
    ctx.fillRect(hx - 412, y, 824, 3);
  }
  // Wing top cornice trim molding
  rrPath(ctx, hx - 432, topY + 194, 864, 34, 8);
  fillStroke(ctx, '#2C3D56', 4.5, INK);

  // Center elevator tower spire (slightly lighter slate + crisp moonlight bevel)
  const beaconPulse = 0.5 + 0.5 * Math.sin(t * 4.5);
  ctx.strokeStyle = '#4A6282';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(hx, topY - 140);
  ctx.lineTo(hx, topY - 235);
  ctx.stroke();
  ctx.fillStyle = radGrad(ctx, hx, topY - 235, 2, 34 + beaconPulse * 20, [[0, `rgba(228,50,43,${0.45 + 0.52 * beaconPulse})`], [1, 'rgba(0,0,0,0)']]);
  ctx.beginPath();
  ctx.arc(hx, topY - 235, 56, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(hx, topY - 235, 7, 0, TAU);
  fillStroke(ctx, beaconPulse > 0.35 ? PAL.crimson : '#6B1D1B', 2.5, INK);

  rrPath(ctx, hx - 165, topY - 40, 330, groundY - (topY - 40), 12);
  fillStroke(ctx, '#243349', 5.5, INK);
  ctx.strokeStyle = 'rgba(185, 215, 255, 0.28)';
  ctx.lineWidth = 3;
  ctx.strokeRect(hx - 161, topY - 36, 322, groundY - (topY - 40) - 6);

  // Steep peaked Gothic roof crown + moonlight rim highlight so roof never blends into sky
  ctx.beginPath();
  ctx.moveTo(hx - 188, topY - 35);
  ctx.lineTo(hx, topY - 142);
  ctx.lineTo(hx + 188, topY - 35);
  ctx.closePath();
  fillStroke(ctx, '#192536', 5.5, INK);
  ctx.strokeStyle = 'rgba(180, 212, 255, 0.32)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hx - 178, topY - 39);
  ctx.lineTo(hx, topY - 137);
  ctx.lineTo(hx + 178, topY - 39);
  ctx.stroke();

  rrPath(ctx, hx - 178, topY - 36, 356, 26, 8);
  fillStroke(ctx, '#2E405B', 4, INK);

  // Central glass elevator shaft glowing warm gold for Floors 1..12, pitch dark at top!
  rrPath(ctx, hx - 76, topY + 60, 152, 920, 10);
  fillStroke(ctx, '#090D14', 4.5, INK);

  // Draw glowing floor slots inside shaft & side wing windows (floors 1..13 cleanly above entrance!)
  for (let fl = 1; fl <= 13; fl++) {
    const fy = 1365 - fl * 68;
    const is13 = fl === 13;

    // Wing windows left & right (dark on 13, sporadically warm amber on lower floors)
    [-335, -245, 195, 285].forEach((wxOff, wi) => {
      const lit = !is13 && ((fl + wi * 3) % 5 === 0 || fl === 7);
      rrPath(ctx, hx + wxOff, fy, 46, 46, 6);
      fillStroke(ctx, lit ? '#E8A54B' : '#0B1018', 3.5, INK);
      if (lit) {
        ctx.fillStyle = radGrad(ctx, hx + wxOff + 23, fy + 23, 8, 65, [
          [0, 'rgba(244,175,78,0.28)'],
          [1, 'rgba(0,0,0,0)'],
        ]);
        ctx.fillRect(hx + wxOff - 40, fy - 40, 126, 126);
      }
    });

    // Central elevator bay window segment
    rrPath(ctx, hx - 60, fy, 120, 48, 6);
    if (is13) {
      fillStroke(ctx, '#26090B', 3.5, PAL.crimson);
      // Crimson X barricade across Floor 13 bay
      ctx.strokeStyle = PAL.crimson;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(hx - 54, fy + 6);
      ctx.lineTo(hx + 54, fy + 42);
      ctx.moveTo(hx + 54, fy + 6);
      ctx.lineTo(hx - 54, fy + 42);
      ctx.stroke();
    } else {
      const hasCab = fl === 6;
      fillStroke(ctx, hasCab ? '#FFD27A' : '#332515', 3, INK);
      if (hasCab) {
        ctx.fillStyle = radGrad(ctx, hx, fy + 24, 12, 120, [
          [0, 'rgba(244,175,78,0.5)'],
          [1, 'rgba(0,0,0,0)'],
        ]);
        ctx.fillRect(hx - 120, fy - 90, 240, 228);
      }
    }

    // Small numbered badge markers (1, 5, 12 in gold; 13 in glowing crimson!)
    if (fl === 1 || fl === 5 || fl === 12 || is13) {
      const bx = hx + 115;
      const by = fy + 24;
      if (is13) {
        ctx.fillStyle = radGrad(ctx, bx, by, 10, 80, [[0, 'rgba(228,50,43,0.45)'], [1, 'rgba(0,0,0,0)']]);
        ctx.beginPath();
        ctx.arc(bx, by, 80, 0, TAU);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(bx, by, is13 ? 30 : 22, 0, TAU);
      fillStroke(ctx, is13 ? PAL.crimson : PAL.gold, 4, INK);
      ctx.fillStyle = is13 ? '#FFFFFF' : INK;
      ctx.font = `900 ${is13 ? 28 : 22}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(fl), bx, by + 2);
    }
  }

  // 3. Solid Grounded Foundation Plinth, Hospital Entrance Portico, Courtyard & Street!
  // Stone plinth along full hospital base
  rrPath(ctx, hx - 425, groundY - 22, 850, 44, 6);
  fillStroke(ctx, '#28364A', 4.5, INK);

  // Paved courtyard & dark asphalt street ground (plants the building firmly on earth)
  ctx.fillStyle = linGrad(ctx, 0, groundY, 0, H, [
    [0, '#121B28'],
    [0.35, '#0D141F'],
    [1, '#070A10'],
  ]);
  ctx.fillRect(0, groundY, W, H - groundY);
  // Crisp sidewalk curb line across grounds
  ctx.strokeStyle = '#2A394E';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 62);
  ctx.lineTo(W, groundY + 62);
  ctx.stroke();

  // Front walkway path leading down from entrance steps
  ctx.fillStyle = '#1B2534';
  ctx.beginPath();
  ctx.moveTo(hx - 110, groundY + 22);
  ctx.lineTo(hx + 110, groundY + 22);
  ctx.lineTo(hx + 220, H);
  ctx.lineTo(hx - 220, H);
  ctx.closePath();
  fillStroke(ctx, '#182332', 4, INK);

  // Illuminated Ground-Floor Glass Double-Door Entrance Canopy
  rrPath(ctx, hx - 122, groundY - 122, 244, 122, 10);
  fillStroke(ctx, '#1E2A3A', 4.5, INK);
  rrPath(ctx, hx - 86, groundY - 94, 172, 94, 6);
  fillStroke(ctx, '#E5A852', 4, INK); // warm lit lobby glass
  // Center mullion
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(hx, groundY - 94);
  ctx.lineTo(hx, groundY);
  ctx.stroke();
  // Warm amber spill pool onto front stone steps
  ctx.fillStyle = radGrad(ctx, hx, groundY + 20, 12, 180, [
    [0, 'rgba(244, 175, 78, 0.34)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.beginPath();
  ctx.ellipse(hx, groundY + 25, 180, 56, 0, 0, TAU);
  ctx.fill();
  // Entrance canopy lintel + sign
  rrPath(ctx, hx - 146, groundY - 142, 292, 32, 6);
  fillStroke(ctx, '#2B3A4E', 4, INK);
  ctx.fillStyle = '#FFE2A4';
  ctx.font = '900 16px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MILLBROOK • WING B', hx, groundY - 125);

  // Side streetlamp posts casting amber ground glow (anchoring foreground left/right!)
  [110, W - 110].forEach((lx) => {
    ctx.strokeStyle = '#33455E';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(lx, groundY + 55);
    ctx.lineTo(lx, groundY - 105);
    ctx.stroke();
    ctx.fillStyle = radGrad(ctx, lx, groundY - 110, 4, 95, [
      [0, 'rgba(255, 200, 105, 0.65)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
    ctx.beginPath();
    ctx.arc(lx, groundY - 110, 95, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx, groundY - 110, 10, 0, TAU);
    fillStroke(ctx, '#FFE6A8', 3, INK);
  });

  // Framing pine trees strictly along far left & far right edges so entrance remains clear
  drawPineRow(ctx, 1650, 3, 210, 290, '#070C14', 44);
}

export function drawMorgueCorridor(ctx, { pitchBlack = false, lightLevel = 1 } = {}) {
  // Basement clinical hall in 1-point perspective
  ctx.fillStyle = PAL.corridorTop;
  ctx.fillRect(0, 0, W, H);

  const vx = W * 0.56;
  const vy = 840;
  const bx0 = vx - 190, bx1 = vx + 190;
  const by0 = vy - 260, by1 = vy + 240;

  // Ceiling
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(bx1, by0); ctx.lineTo(bx0, by0);
  ctx.closePath();
  fillStroke(ctx, '#0F1820', 4, INK);

  // Left & Right perspective walls + lower dado wainscoting
  const drawWall = (xOut, xIn) => {
    ctx.beginPath();
    ctx.moveTo(xOut, 0); ctx.lineTo(xIn, by0); ctx.lineTo(xIn, by1); ctx.lineTo(xOut, H);
    ctx.closePath();
    fillStroke(ctx, PAL.corridorWall, 4, INK);

    // Lower teal tile half
    const midOut = 920;
    const midIn = (by0 + by1) * 0.5 + 30;
    ctx.beginPath();
    ctx.moveTo(xOut, midOut); ctx.lineTo(xIn, midIn); ctx.lineTo(xIn, by1); ctx.lineTo(xOut, H);
    ctx.closePath();
    fillStroke(ctx, PAL.corridorDado, 4, INK);

    // Steel dado guard rail
    ctx.strokeStyle = '#3D5566';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(xOut, midOut);
    ctx.lineTo(xIn, midIn);
    ctx.stroke();
  };
  drawWall(0, bx0);
  drawWall(W, bx1);

  // Checkered Perspective Tile Floor
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(bx0, by1); ctx.lineTo(bx1, by1); ctx.lineTo(W + 300, H); ctx.lineTo(-300, H);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = PAL.corridorFloorA;
  ctx.fillRect(0, by1, W, H - by1);

  const rows = 9;
  const cols = 8;
  for (let r = 0; r < rows; r++) {
    const t0 = Math.pow(r / rows, 1.55);
    const t1 = Math.pow((r + 1) / rows, 1.55);
    const y0 = by1 + t0 * (H - by1);
    const y1 = by1 + t1 * (H - by1);
    const w0 = (bx1 - bx0) * (1 + t0 * 3.8);
    const w1 = (bx1 - bx0) * (1 + t1 * 3.8);
    const cx0 = vx - (vx - W * 0.5) * t0;
    const cx1 = vx - (vx - W * 0.5) * t1;
    for (let c = 0; c < cols; c++) {
      const f0 = c / cols - 0.5;
      const f1 = (c + 1) / cols - 0.5;
      if ((r + c) % 2 === 0) {
        ctx.fillStyle = PAL.corridorFloorB;
        ctx.beginPath();
        ctx.moveTo(cx0 + f0 * w0, y0);
        ctx.lineTo(cx0 + f1 * w0, y0);
        ctx.lineTo(cx1 + f1 * w1, y1);
        ctx.lineTo(cx1 + f0 * w1, y1);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
  ctx.restore();

  // Back wall + Heavy Steel MORGUE Double Doors (Right door pushed wide ajar!)
  ctx.fillStyle = '#152028';
  ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4.5;
  ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);

  // Illuminated overhead MORGUE placard
  rrPath(ctx, vx - 108, by0 + 18, 216, 48, 8);
  fillStroke(ctx, '#4B1416', 3.5, INK);
  ctx.font = '900 28px Inter, sans-serif';
  ctx.fillStyle = '#FF9C98';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MORGUE', vx, by0 + 44);

  // Doorframe
  const dx0 = vx - 122, dx1 = vx + 122, dy0 = by0 + 82, dy1 = by1;
  rrPath(ctx, dx0, dy0, dx1 - dx0, dy1 - dy0, 4);
  fillStroke(ctx, '#030608', 4.5, INK); // dark cavity inside open doorway

  // Eerie cold frost mist spilling out of open morgue!
  const mist = radGrad(ctx, vx + 30, dy1 - 60, 15, 310, [
    [0, 'rgba(123, 227, 208, 0.36)'],
    [0.5, 'rgba(123, 227, 208, 0.12)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.fillStyle = mist;
  ctx.beginPath();
  ctx.arc(vx + 30, dy1 - 60, 310, 0, TAU);
  ctx.fill();

  // Left door leaf (closed) + subtle glass porthole
  rrPath(ctx, dx0, dy0, 118, dy1 - dy0, 2);
  fillStroke(ctx, '#32434F', 4, INK);
  rrPath(ctx, dx0 + 36, dy0 + 54, 46, 94, 8);
  fillStroke(ctx, '#111D24', 3.5, INK);

  // Right door leaf swung open inside/ajar showing wide gap!
  ctx.beginPath();
  ctx.moveTo(dx1, dy0);
  ctx.lineTo(dx1 - 46, dy0 + 24);
  ctx.lineTo(dx1 - 46, dy1 - 14);
  ctx.lineTo(dx1, dy1);
  ctx.closePath();
  fillStroke(ctx, '#283844', 4, INK);

  // Overhead flickering fluorescent light fixture + volumetric cone
  const lit = !pitchBlack && lightLevel > 0.08;
  rrPath(ctx, vx - 140, 270, 280, 26, 8);
  fillStroke(ctx, lit ? '#E3FAFF' : '#283038', 4, INK);
  if (lit) {
    ctx.fillStyle = linGrad(ctx, vx, 295, vx, 1280, [
      [0, `rgba(205, 245, 255, ${0.24 * lightLevel})`],
      [1, 'rgba(0,0,0,0)'],
    ]);
    ctx.beginPath();
    ctx.moveTo(vx - 130, 296);
    ctx.lineTo(vx + 130, 296);
    ctx.lineTo(vx + 460, 1340);
    ctx.lineTo(vx - 460, 1340);
    ctx.closePath();
    ctx.fill();
    dustMotes(ctx, vx - 280, 340, 560, 760, 7, 26, `rgba(205,245,255,${0.3 * lightLevel})`);
  }
}

export function drawElevatorCab(ctx, opts = {}) {
  const {
    floorText = '12',
    needlePos = null, // 0..3 float smoothly sweeps needle between '1','5','12','13'
    redAlert = false,
    doorsSplit = 0, // 0 = closed, 1 = wide open
    mirrorMode = false,
    voidOut = false,
    motionLines = false,
  } = opts;

  // 1. Warm mahogany wood planks backdrop (matching Tower 11 cabin look)
  ctx.fillStyle = PAL.woodDark;
  ctx.fillRect(0, 0, W, H);

  const plankW = 90;
  for (let px = 0; px < W; px += plankW) {
    const g = linGrad(ctx, px, 0, px + plankW, 0, [
      [0, PAL.woodMid],
      [0.85, PAL.woodLight],
      [1, PAL.woodDark],
    ]);
    ctx.fillStyle = g;
    ctx.fillRect(px, 0, plankW - 4, 1520);
    ctx.fillStyle = PAL.woodSeam;
    ctx.fillRect(px + plankW - 4, 0, 4, 1520);
  }

  // Dark patterned vintage carpet/tile floor below y=1480
  ctx.fillStyle = '#1E1410';
  ctx.fillRect(0, 1460, W, H - 1460);
  ctx.fillStyle = '#332219';
  ctx.fillRect(0, 1460, W, 24);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4.5;
  ctx.strokeRect(-10, 1460, W + 20, H - 1450);

  // Brass wall trim strip & handrail at y=1020
  rrPath(ctx, 40, 995, W - 80, 30, 14);
  fillStroke(ctx, linGrad(ctx, 0, 995, 0, 1025, [[0, PAL.brassHi], [0.6, PAL.brass], [1, PAL.brassDark]]), 4.5, INK);

  // Overhead brass cage sconce light at top center (y=290)
  ctx.beginPath();
  ctx.arc(W / 2, 315, 42, 0, Math.PI);
  fillStroke(ctx, redAlert ? '#FF6A5E' : '#FFE39E', 4, INK);
  rrPath(ctx, W / 2 - 58, 286, 116, 26, 8);
  fillStroke(ctx, PAL.brassDark, 4, INK);

  // Soft overhead light cone wash
  const coneCol = redAlert ? 'rgba(228, 50, 43, 0.25)' : 'rgba(244, 175, 78, 0.22)';
  ctx.fillStyle = linGrad(ctx, W / 2, 315, W / 2, 1560, [[0, coneCol], [1, 'rgba(0,0,0,0)']]);
  ctx.beginPath();
  ctx.moveTo(W / 2 - 70, 315);
  ctx.lineTo(W / 2 + 70, 315);
  ctx.lineTo(W + 140, 1620);
  ctx.lineTo(-140, 1620);
  ctx.closePath();
  ctx.fill();
  dustMotes(ctx, 180, 360, 720, 980, 19, 28);

  // 2. Central Doorway OR Tall Brass Mirror OR Floor 13 Void
  const dx = 190, dy = 385, dw = 700, dh = 1075;

  if (mirrorMode) {
    // Giant beveled brass mirror centered behind Maya (shows EMPTY cabin behind her!)
    rrPath(ctx, dx - 28, dy - 28, dw + 56, dh - 90, 22);
    fillStroke(ctx, PAL.brassDark, 5, INK);
    rrPath(ctx, dx, dy, dw, dh - 146, 14);
    fillStroke(ctx, linGrad(ctx, dx, dy, dx + dw, dy + dh, [
      [0, '#2B3A47'],
      [0.45, '#3E5261'],
      [1, '#1E2A33'],
    ]), 4.5, INK);

    // Reflection INSIDE mirror: 1-pt perspective opposite cab doors, handrail & ceiling bulb (NO MAYA!)
    ctx.save();
    rrPath(ctx, dx, dy, dw, dh - 146, 14);
    ctx.clip();
    for (let px = dx; px < dx + dw; px += 85) {
      ctx.fillStyle = 'rgba(42, 25, 16, 0.42)';
      ctx.fillRect(px, dy, 81, dh);
      ctx.fillStyle = 'rgba(15, 10, 8, 0.5)';
      ctx.fillRect(px + 81, dy, 4, dh);
    }
    // Reflected opposite closed brass-trimmed steel doors (deep in mirror!)
    rrPath(ctx, dx + 135, dy + 130, dw - 270, dh - 310, 6);
    fillStroke(ctx, 'rgba(30, 34, 42, 0.72)', 3.5, 'rgba(12,14,18,0.8)');
    ctx.strokeStyle = 'rgba(10, 12, 16, 0.75)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(W / 2, dy + 130);
    ctx.lineTo(W / 2, dy + dh - 180);
    ctx.stroke();
    // Reflected dim warm sconce bulb near mirror ceiling
    ctx.fillStyle = radGrad(ctx, W / 2, dy + 55, 4, 110, [
      [0, 'rgba(255, 224, 158, 0.34)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
    ctx.beginPath();
    ctx.arc(W / 2, dy + 55, 110, 0, TAU);
    ctx.fill();
    // Reflected brass handrail bar running behind empty cab
    ctx.fillStyle = 'rgba(195, 142, 62, 0.38)';
    ctx.fillRect(dx, 995, dw, 22);
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 14;
    // Diagonal glass reflection gleam bars
    ctx.beginPath();
    ctx.moveTo(dx + 70, dy + 190); ctx.lineTo(dx + 250, dy + 25);
    ctx.moveTo(dx + 140, dy + 240); ctx.lineTo(dx + 340, dy + 40);
    ctx.moveTo(dx + 430, dy + 820); ctx.lineTo(dx + 660, dy + 590);
    ctx.stroke();
    ctx.restore();
    return;
  }

  // Semicircular Vintage Brass Floor Indicator Dial above door frame
  const dialCx = W / 2;
  const dialCy = dy - 16;
  ctx.beginPath();
  ctx.arc(dialCx, dialCy, 118, Math.PI, 0);
  ctx.closePath();
  fillStroke(ctx, '#1B1816', 5, PAL.brass);
  ctx.font = '900 26px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#B8AF9E';
  ['1', '5', '12', '13'].forEach((lbl, idx) => {
    const a = Math.PI + ((idx + 0.5) / 4) * Math.PI;
    const tx = dialCx + Math.cos(a) * 86;
    const ty = dialCy + Math.sin(a) * 84;
    ctx.fillStyle = lbl === floorText ? PAL.crimson : '#B8AF9E';
    ctx.fillText(lbl, tx, ty + 6);
  });
  // Pointer needle (supports smooth continuous float interpolation `needlePos`!)
  const floorIdx = needlePos ?? ({ '1': 0.5, '5': 1.5, '12': 2.5, '13': 3.5 }[floorText] ?? 2.5);
  const na = Math.PI + (floorIdx / 4) * Math.PI;
  ctx.strokeStyle = PAL.crimson;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(dialCx, dialCy - 12);
  ctx.lineTo(dialCx + Math.cos(na) * 76, dialCy + Math.sin(na) * 76);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(dialCx, dialCy - 12, 12, 0, TAU);
  fillStroke(ctx, PAL.brass, 3.5, INK);

  // Heavy outer steel/brass elevator door jamb
  rrPath(ctx, dx - 24, dy - 16, dw + 48, dh + 16, 12);
  fillStroke(ctx, '#2C2A2C', 5, INK);

  // Interior background behind sliding doors (Floor 13 Void + Spotlight + Red Mailbox!)
  ctx.save();
  rrPath(ctx, dx, dy, dw, dh, 8);
  ctx.clip();
  ctx.fillStyle = linGrad(ctx, W / 2, dy, W / 2, dy + dh, [
    [0, '#04060B'],
    [0.6, '#090F1A'],
    [1, '#101826'],
  ]);
  ctx.fillRect(dx, dy, dw, dh);

  if (voidOut) {
    // Faint distant ghost-corridor structural silhouettes deep inside Floor 13 darkness
    ctx.fillStyle = 'rgba(26, 38, 56, 0.28)';
    ctx.fillRect(dx + 45, dy + 60, 42, dh - 80);
    ctx.fillRect(dx + dw - 87, dy + 60, 42, dh - 80);
    // Distant IV stand silhouette on deep right shadow
    ctx.strokeStyle = 'rgba(72, 92, 118, 0.28)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(dx + dw - 125, dy + 420);
    ctx.lineTo(dx + dw - 125, dy + 920);
    ctx.moveTo(dx + dw - 155, dy + 420);
    ctx.lineTo(dx + dw - 95, dy + 420);
    ctx.stroke();

    // Harsh white-cold spotlight beam on the Floor 13 Hospital Mailbox!
    ctx.fillStyle = linGrad(ctx, W / 2, dy, W / 2, dy + dh, [
      [0, 'rgba(205, 224, 248, 0.28)'],
      [0.7, 'rgba(180, 206, 240, 0.12)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
    ctx.beginPath();
    ctx.moveTo(W / 2 - 48, dy);
    ctx.lineTo(W / 2 + 48, dy);
    ctx.lineTo(W / 2 + 280, dy + dh);
    ctx.lineTo(W / 2 - 280, dy + dh);
    ctx.closePath();
    ctx.fill();

    // Spotlight floor puddle
    ctx.fillStyle = 'rgba(180, 210, 240, 0.14)';
    ctx.beginPath();
    ctx.ellipse(W / 2, dy + dh - 40, 245, 44, 0, 0, TAU);
    ctx.fill();

    // Pedestal post with worn paint scratches
    rrPath(ctx, W / 2 - 24, dy + 650, 48, 390, 6);
    fillStroke(ctx, '#2E3640', 4.5, INK);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 8, dy + 720); ctx.lineTo(W / 2 + 12, dy + 765);
    ctx.moveTo(W / 2 + 6, dy + 845); ctx.lineTo(W / 2 - 10, dy + 890);
    ctx.stroke();
    rrPath(ctx, W / 2 - 64, dy + 1010, 128, 32, 8);
    fillStroke(ctx, '#222830', 4.5, INK);

    // Classic arched cast-iron Hospital Mailbox angled 3/4
    const mbX = W / 2 - 125;
    const mbY = dy + 470;
    // Mailbox arch body
    rrPath(ctx, mbX, mbY, 250, 190, [95, 95, 16, 16]);
    fillStroke(ctx, linGrad(ctx, mbX, mbY, mbX, mbY + 190, [[0, '#465260'], [1, '#262D36']]), 5, INK);
    // Brass plate
    rrPath(ctx, mbX + 46, mbY + 34, 158, 42, 8);
    fillStroke(ctx, PAL.brassDark, 3.5, INK);
    ctx.font = '900 18px Inter, sans-serif';
    ctx.fillStyle = '#FFE4A0';
    ctx.textAlign = 'center';
    ctx.fillText('ARCHIVE #13', W / 2, mbY + 59);

    // Dropped front hatch mouth revealing cream patient file folder + crimson seal!
    ctx.beginPath();
    ctx.moveTo(mbX + 26, mbY + 150);
    ctx.lineTo(mbX + 224, mbY + 150);
    ctx.lineTo(mbX + 250, mbY + 245);
    ctx.lineTo(mbX, mbY + 245);
    ctx.closePath();
    fillStroke(ctx, '#1A2028', 4.5, INK);

    // Cream patient file folder sticking out toward camera
    ctx.save();
    ctx.translate(W / 2, mbY + 185);
    ctx.rotate(-0.08);
    rrPath(ctx, -98, -32, 196, 118, 8);
    fillStroke(ctx, PAL.creamPaper, 4.5, INK);
    ctx.fillStyle = INK;
    ctx.font = '900 19px FreeMono, monospace';
    ctx.fillText('CHEN, MAYA', 0, -2);
    // Bold crimson stamp box inside file
    rrPath(ctx, -74, 18, 148, 38, 6);
    fillStroke(ctx, 'rgba(228,50,43,0.16)', 3.5, PAL.crimson);
    ctx.fillStyle = PAL.crimson;
    ctx.font = '900 20px Inter, sans-serif';
    ctx.fillText('DECEASED', 0, 42);
    ctx.restore();
  }

  // Sliding metal elevator doors (animated by doorsSplit 0..1)
  const leafW = (dw / 2) * (1 - doorsSplit);
  if (leafW > 6) {
    // Left door
    rrPath(ctx, dx, dy, leafW, dh, 2);
    fillStroke(ctx, linGrad(ctx, dx, dy, dx + leafW, dy, [[0, '#3C393B'], [1, '#585355']]), 4.5, INK);
    // Vertical glass vision slit in door
    if (leafW > 100) {
      rrPath(ctx, dx + leafW - 92, dy + 120, 48, 280, 12);
      fillStroke(ctx, '#131C26', 4, PAL.brassDark);
    }
    // Right door
    const rX = dx + dw - leafW;
    rrPath(ctx, rX, dy, leafW, dh, 2);
    fillStroke(ctx, linGrad(ctx, rX, dy, rX + leafW, dy, [[0, '#585355'], [1, '#3C393B']]), 4.5, INK);
    if (leafW > 100) {
      rrPath(ctx, rX + 44, dy + 120, 48, 280, 12);
      fillStroke(ctx, '#131C26', 4, PAL.brassDark);
    }
  }
  ctx.restore();

  // Right Wall Vintage Brass Intercom Speaker Box (always crisp detail, focal in KF-06!)
  const ix = 928, iy = 690;
  rrPath(ctx, ix - 46, iy - 64, 92, 128, 12);
  fillStroke(ctx, PAL.brassDark, 4, INK);
  for (let sy = -36; sy <= 24; sy += 12) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ix - 28, iy + sy);
    ctx.lineTo(ix + 28, iy + sy);
    ctx.stroke();
  }
  // Pulsing Red Intercom LED + signal halo when alert
  if (redAlert) {
    ctx.fillStyle = radGrad(ctx, ix + 24, iy - 46, 2, 56, [
      [0, 'rgba(228,50,43,0.85)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
    ctx.beginPath();
    ctx.arc(ix + 24, iy - 46, 56, 0, TAU);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(ix + 24, iy - 46, 8, 0, TAU);
  fillStroke(ctx, redAlert ? '#FF4D45' : '#401414', 2.5, INK);

  // Kinetic downward vibration speed streaks (KF-07 moving elevator)
  if (motionLines) {
    ctx.strokeStyle = 'rgba(255, 226, 155, 0.34)';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    [[118, 430, 118, 610], [962, 510, 962, 700], [148, 860, 148, 1060], [928, 920, 928, 1120]].forEach(([x0, y0, x1, y1]) => {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    });
  }
}

/**
 * Retro Intercom Speaker + Strobe Wall macro focal shot (`KF-06`)
 */
export function drawIntercomMacroSet(ctx, pulseT = 0) {
  // Deep crimson-washed dark wood elevator bulkhead
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
    [0, '#290E10'],
    [0.5, '#3E1415'],
    [1, '#1A0A0B'],
  ]);
  ctx.fillRect(0, 0, W, H);
  for (let px = 0; px < W; px += 120) {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(px + 114, 0, 6, H);
  }

  // Expanding concentric eerie sound-wave arcs radiating from speaker
  const sx = W / 2, sy = 860;
  [0, 1, 2].forEach((idx) => {
    const phase = (pulseT * 1.1 + idx * 0.33) % 1;
    const r = 240 + phase * 320;
    ctx.strokeStyle = `rgba(228, 50, 43, ${(1 - phase) * 0.52})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, TAU);
    ctx.stroke();
  });

  // Heavy bolted brass PA speaker unit center frame
  rrPath(ctx, sx - 210, sy - 250, 420, 500, 34);
  fillStroke(ctx, linGrad(ctx, sx - 210, sy - 250, sx + 210, sy + 250, [[0, PAL.brass], [1, PAL.brassDark]]), 6, INK);
  rrPath(ctx, sx - 178, sy - 218, 356, 436, 22);
  fillStroke(ctx, '#261D17', 4.5, INK);

  // Horizontal louvered speaker slats
  for (let ly = sy - 110; ly <= sy + 145; ly += 28) {
    rrPath(ctx, sx - 135, ly, 270, 14, 7);
    fillStroke(ctx, '#0E0A08', 2.5, INK);
  }

  // Giant glowing crimson active LED dome + halo
  ctx.fillStyle = radGrad(ctx, sx + 118, sy - 168, 8, 130, [
    [0, 'rgba(255,75,65,0.9)'],
    [0.45, 'rgba(228,50,43,0.35)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.beginPath();
  ctx.arc(sx + 118, sy - 168, 130, 0, TAU);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sx + 118, sy - 168, 22, 0, TAU);
  fillStroke(ctx, '#FF5C54', 4, INK);

  // Riveted brass label plate
  rrPath(ctx, sx - 125, sy - 190, 195, 44, 8);
  fillStroke(ctx, '#1B1612', 3.5, PAL.brass);
  ctx.fillStyle = PAL.gold;
  ctx.font = '900 22px FreeMono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('WARD • PA-13', sx - 27, sy - 161);
}

/**
 * Split-screen environments for KF-09 (`[A] EXIT DOORS` left vs `[B] KEYCARD` right)
 */
export function drawSplitWorldBackdrop(ctx) {
  // LEFT WORLD: Cool dark emerald-steel exit corridor (x: 0..540)
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W / 2, H);
  ctx.clip();
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
    [0, '#0C1B26'],
    [0.65, '#152C38'],
    [1, '#091218'],
  ]);
  ctx.fillRect(0, 0, W / 2, H);

  // Double metal exit doors with green glowing EXIT sign
  rrPath(ctx, 70, 560, 400, 740, 12);
  fillStroke(ctx, '#1A2D38', 5, INK);
  rrPath(ctx, 180, 480, 180, 58, 10);
  fillStroke(ctx, '#174A2B', 4, INK);
  ctx.font = '900 32px Inter, sans-serif';
  ctx.fillStyle = PAL.green;
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', 270, 519);

  // Glass door panes showing cold cyan mist outside
  [105, 290].forEach((gx) => {
    rrPath(ctx, gx, 620, 145, 340, 10);
    fillStroke(ctx, '#0B161E', 4, INK);
    // Horizontal push bar
    rrPath(ctx, gx - 10, 995, 165, 26, 6);
    fillStroke(ctx, '#8A9AA8', 3.5, INK);
  });
  ctx.restore();

  // RIGHT WORLD: Dark crimson pedestal chamber (x: 540..1080)
  ctx.save();
  ctx.beginPath();
  ctx.rect(W / 2, 0, W / 2, H);
  ctx.clip();
  ctx.fillStyle = linGrad(ctx, W / 2, 0, W / 2, H, [
    [0, '#1D090C'],
    [0.55, '#330F13'],
    [1, '#120709'],
  ]);
  ctx.fillRect(W / 2, 0, W / 2, H);

  // Overhead crimson spotlight on Floor 13 Keycard pedestal
  ctx.fillStyle = linGrad(ctx, 810, 420, 810, 1400, [
    [0, 'rgba(228,50,43,0.34)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.beginPath();
  ctx.moveTo(760, 420); ctx.lineTo(860, 420);
  ctx.lineTo(1040, 1450); ctx.lineTo(580, 1450);
  ctx.closePath();
  ctx.fill();

  // Iron pedestal & Floor
  ctx.fillStyle = '#180B0D';
  ctx.fillRect(W / 2, 1340, W / 2, H - 1340);
  rrPath(ctx, 840, 1010, 84, 345, 8);
  fillStroke(ctx, '#2D2124', 4.5, INK);
  rrPath(ctx, 800, 990, 164, 34, 8);
  fillStroke(ctx, '#423136', 4.5, INK);
  ctx.restore();
}

/**
 * Wing B Locked Steel Gate + Chain & 99-Nights Social Archive inset (`KF-02` Night 100 hook)
 */
export function drawEntranceGateSet(ctx, slashFrac = 1) {
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
    [0, '#0B111A'],
    [0.6, '#14202D'],
    [1, '#090E14'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Industrial hospital brick & concrete wall framing Wing B gate
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let y = 320; y < 1480; y += 72) {
    ctx.fillRect(0, y, W, 3);
  }

  // Heavy double iron grate doors (`WING B — CONDEMNED`)
  const gx = 190, gy = 430, gw = 700, gh = 1040;
  rrPath(ctx, gx - 24, gy - 24, gw + 48, gh + 24, 14);
  fillStroke(ctx, '#222D38', 5, INK);
  rrPath(ctx, gx, gy, gw, gh, 8);
  fillStroke(ctx, '#05080D', 4.5, INK);

  // Vertical iron prison-style bars across dark lobby behind gate
  for (let bx = gx + 55; bx < gx + gw; bx += 68) {
    rrPath(ctx, bx - 7, gy, 14, gh, 4);
    fillStroke(ctx, '#384654', 3.5, INK);
  }
  // Center horizontal lock bar & wrapped rusty chain + brass padlock
  rrPath(ctx, gx, 930, gw, 42, 8);
  fillStroke(ctx, '#2B3642', 4, INK);

  // Diagonal warning ribbon placed clearly above Maya's head height
  ctx.save();
  ctx.translate(W / 2, 650);
  ctx.rotate(-0.07);
  rrPath(ctx, -370, -28, 740, 56, 8);
  fillStroke(ctx, PAL.crimson, 4, INK);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 28px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CONDEMNED • SEALED 1978', 0, 2);
  ctx.restore();

  // Heavy cut chain links + padlock on right leaf
  const px = 710, py = 955;
  ctx.strokeStyle = '#7C858E';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(480, 915);
  ctx.quadraticCurveTo(605, 995, px, py);
  ctx.stroke();

  rrPath(ctx, px - 34, py, 68, 78, 14);
  fillStroke(ctx, PAL.brass, 4.5, INK);
  ctx.strokeStyle = '#C4CDD6';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(px, py + 4, 22, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(px, py + 32, 8, 0, TAU);
  ctx.fill();

  // Floor steps
  ctx.fillStyle = '#121922';
  ctx.fillRect(0, 1450, W, H - 1450);

  // Top-right floating Social Video Card: "99 NIGHTS: NOTHING" with red slash (tucked safely under HUD)
  const cx = 595, cy = 355;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = 18;
  rrPath(ctx, cx, cy, 385, 225, 20);
  fillStroke(ctx, '#171E28', 4.5, '#3E4C5E');
  ctx.shadowColor = 'transparent';
  ctx.font = '900 24px FreeMono, monospace';
  ctx.fillStyle = '#8FA0B2';
  ctx.textAlign = 'left';
  ctx.fillText('ARCHIVE: 99 NIGHTS', cx + 24, cy + 44);
  ctx.font = '900 44px Inter, sans-serif';
  ctx.fillStyle = '#E5EAEF';
  ctx.fillText('ZERO GHOSTS', cx + 24, cy + 110);
  ctx.font = '700 24px Inter, sans-serif';
  ctx.fillStyle = PAL.gold;
  ctx.fillText('DARE: GO TO FLOOR 13', cx + 24, cy + 172);
  // Crisp Tower-11 style red strikethrough slash animating across ZERO GHOSTS!
  if (slashFrac > 0.02) {
    const sx0 = cx + 18, sy0 = cy + 124;
    const sx1 = cx + 355, sy1 = cy + 72;
    ctx.strokeStyle = PAL.crimson;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sx0, sy0);
    ctx.lineTo(sx0 + (sx1 - sx0) * Math.min(1, slashFrac), sy0 + (sy1 - sy0) * Math.min(1, slashFrac));
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Dramatic Tight Close-Up: Maya's trembling hand pulling the cold steel Morgue Door Bar (`KF-05`).
 * `pull` (0..1) smoothly widens the dark icy door crack & pushes freezing mist outward!
 */
export function drawMorgueDoorPullSet(ctx, pull = 1) {
  ctx.fillStyle = '#070C12';
  ctx.fillRect(0, 0, W, H);

  // Pull (0 -> 1): starts as tight 3-inch crack (~70px), pulls LEFT open to ~245px gap as freezing mist pours out!
  const shiftX = -pull * 175;
  const rightDoorX = 642;

  // Dark gap cavity behind ajar door
  ctx.fillStyle = '#030508';
  ctx.fillRect(360, 260, 480, 1460);

  // Eerie faint hospital gurney table edge & freezing mint mist billowing out proportionally to pull!
  ctx.fillStyle = '#18242B';
  ctx.fillRect(465, 960, 220, 28);
  ctx.fillStyle = radGrad(ctx, 590, 960, 20, 220 + pull * 240, [
    [0, `rgba(123, 227, 208, ${0.22 + 0.28 * pull})`],
    [0.5, `rgba(123, 227, 208, ${0.06 + 0.12 * pull})`],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.beginPath();
  ctx.arc(590, 960, 460, 0, TAU);
  ctx.fill();
  dustMotes(ctx, 380, 520, 420, 760, 33, 30, `rgba(145,245,225,${0.16 + 0.30 * pull})`);

  // Left door panel + frosted window + brass crash bar pulled LEFT as Maya pulls handle!
  ctx.save();
  ctx.translate(shiftX, 0);
  rrPath(ctx, -30, 240, 600, 1490, 6);
  fillStroke(ctx, linGrad(ctx, 0, 0, 570, 0, [[0, '#222F38'], [0.88, '#364A57'], [1, '#263540']]), 6, INK);
  rrPath(ctx, 210, 405, 250, 390, 18);
  fillStroke(ctx, '#0E1820', 5, INK);
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(255, 565); ctx.lineTo(410, 435);
  ctx.stroke();

  rrPath(ctx, 130, 932, 390, 58, 12);
  fillStroke(ctx, linGrad(ctx, 0, 932, 0, 990, [[0, '#E2C374'], [0.6, '#B88938'], [1, '#75531B']]), 5, INK);
  rrPath(ctx, 100, 916, 48, 90, 8);
  fillStroke(ctx, '#384652', 4.5, INK);

  // Foreground arm gripping bar cleanly moves left with the door bar!
  ctx.beginPath();
  ctx.moveTo(-180, 1020);
  ctx.lineTo(145, 968);
  ctx.lineTo(145, 1085);
  ctx.lineTo(-180, 1170);
  ctx.closePath();
  fillStroke(ctx, PAL.mayaJacket, 5.5, INK);
  rrPath(ctx, 140, 954, 120, 102, 42);
  fillStroke(ctx, PAL.mayaSkin, 5, INK);
  [185, 220, 255, 290].forEach((fx) => {
    rrPath(ctx, fx, 922, 34, 78, 16);
    fillStroke(ctx, linGrad(ctx, fx, 922, fx, 1000, [[0, PAL.mayaSkin], [1, PAL.mayaSkinShade]]), 4.5, INK);
  });
  rrPath(ctx, 215, 995, 72, 40, 18);
  fillStroke(ctx, PAL.mayaSkinShade, 4.5, INK);
  ctx.restore();

  // Right steel door edge (`MORGUE` label safely centered on visible door face)
  rrPath(ctx, rightDoorX, 240, 460, 1490, 6);
  fillStroke(ctx, '#283844', 6, INK);
  ctx.font = '900 38px Inter, sans-serif';
  ctx.fillStyle = '#FF7E78';
  ctx.textAlign = 'center';
  ctx.fillText('MORGUE', rightDoorX + 185, 565);
}

