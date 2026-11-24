// Diegetic UI, HUD pills, status tiles, stamps, callout arrows, terminal box, captions & split screen.
import { W, H, PAL, INK, rrPath, fillStroke } from './palette.js';

export function drawTopHUD(ctx, { pill = 'THE FREE LIFT • EP 1', tiles = [] } = {}) {
  ctx.save();
  // Main pill
  ctx.font = '900 32px Inter, sans-serif';
  const pw = Math.max(380, ctx.measureText(pill).width + 78);
  const px = (W - pw) / 2;
  const py = 54;
  const ph = 64;

  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 5;
  rrPath(ctx, px, py, pw, ph, ph / 2);
  fillStroke(ctx, PAL.pillBg, 3.5, '#D4A548');
  ctx.shadowColor = 'transparent';

  ctx.fillStyle = PAL.gold;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pill, W / 2, py + ph / 2 + 2);

  // Stat tiles row
  if (tiles.length > 0) {
    const gap = 20;
    const count = tiles.length;
    const tw = count === 2 ? 320 : 286;
    const totalW = count * tw + (count - 1) * gap;
    let sx = (W - totalW) / 2;
    const ty = py + ph + 20;
    const th = 104;

    for (const tile of tiles) {
      const isAlert = !!tile.alert;
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      rrPath(ctx, sx, ty, tw, th, 18);
      fillStroke(
        ctx,
        isAlert ? 'rgba(92, 16, 18, 0.92)' : PAL.tileBg,
        3,
        isAlert ? PAL.crimson : 'rgba(255,255,255,0.22)'
      );
      ctx.shadowColor = 'transparent';

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '900 22px Inter, sans-serif';
      ctx.fillStyle = isAlert ? '#FF9D98' : '#9AA4B5';
      ctx.fillText(tile.label.toUpperCase(), sx + 22, ty + 18);

      ctx.font = '900 38px Inter, sans-serif';
      ctx.fillStyle = tile.color || (isAlert ? '#FFFFFF' : PAL.white);
      ctx.fillText(String(tile.value), sx + 22, ty + 48);

      sx += tw + gap;
    }
  }
  ctx.restore();
}

export function drawTerminalBox(ctx, { channel = 'PA INTERCOM • CH-13', lines = [], alert = false, y = 300, charLimit = Infinity, dotBlink = true } = {}) {
  ctx.save();
  const bw = 920;
  const bh = 82 + lines.length * 52;
  const bx = (W - bw) / 2;
  const borderCol = alert ? PAL.crimson : '#3D6178';

  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;
  rrPath(ctx, bx, y, bw, bh, 22);
  fillStroke(ctx, 'rgba(11, 14, 21, 0.93)', 4, borderCol);
  ctx.shadowColor = 'transparent';

  // Blinking indicator dot + header
  if (dotBlink) {
    ctx.beginPath();
    ctx.arc(bx + 36, y + 34, 9, 0, Math.PI * 2);
    ctx.fillStyle = alert ? PAL.crimson : PAL.cyan;
    ctx.fill();
  }

  ctx.font = '700 24px FreeMono, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = alert ? '#FFA09B' : '#9EB6C7';
  ctx.fillText(channel, bx + 60, y + 36);

  // Console separator line
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx + 24, y + 60);
  ctx.lineTo(bx + bw - 24, y + 60);
  ctx.stroke();

  // Typewriter reveal across lines using charLimit!
  ctx.font = '700 31px FreeMono, monospace';
  let rem = charLimit;
  lines.forEach((ln, idx) => {
    if (rem <= 0) return;
    const vis = ln.text.slice(0, rem);
    rem -= ln.text.length;
    const isTypingHere = rem <= 0 || idx === lines.length - 1;
    const ly = y + 98 + idx * 52;
    ctx.fillStyle = ln.color || (alert ? '#FFD8D6' : PAL.white);
    ctx.fillText(vis + (isTypingHere ? ' █' : ''), bx + 32, ly);
  });
  ctx.restore();
}

export function drawStamp(ctx, { text, x, y, rot = -0.08, bg = PAL.crimson, fg = '#FFFFFF', size = 34, padX = 28, padY = 14, scale = 1 } = {}) {
  if (scale <= 0.02) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale);
  ctx.font = `900 ${size}px Inter, sans-serif`;
  const tw = ctx.measureText(text).width;
  const w = tw + padX * 2;
  const h = size + padY * 2;

  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 5;
  rrPath(ctx, -w / 2, -h / 2, w, h, 14);
  fillStroke(ctx, bg, 4.5, INK);
  ctx.shadowColor = 'transparent';

  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 2);
  ctx.restore();
}

export function drawArrowCallout(ctx, { text, x, y, tx, ty, cx, cy, col = PAL.gold, bg = 'rgba(30,24,14,0.92)' } = {}) {
  ctx.save();
  // Label box
  ctx.font = '900 28px Inter, sans-serif';
  const tw = ctx.measureText(text).width;
  const bw = tw + 44;
  const bh = 58;

  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  rrPath(ctx, x - bw / 2, y - bh / 2, bw, bh, 14);
  fillStroke(ctx, bg, 3.5, col);
  ctx.shadowColor = 'transparent';

  ctx.fillStyle = col;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 2);

  // Curved quadratic leader arrow
  const startX = x + (tx > x ? bw * 0.25 : tx < x ? -bw * 0.25 : 0);
  const startY = y + (ty > y ? bh / 2 + 4 : -bh / 2 - 4);
  const ctrlX = cx ?? (startX + tx) / 2 + (ty > y ? 40 : -40);
  const ctrlY = cy ?? (startY + ty) / 2;

  ctx.strokeStyle = col;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(ctrlX, ctrlY, tx, ty);
  ctx.stroke();

  // Arrowhead
  const ang = Math.atan2(ty - ctrlY, tx - ctrlX);
  const hl = 18;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx - hl * Math.cos(ang - 0.45), ty - hl * Math.sin(ang - 0.45));
  ctx.lineTo(tx - hl * Math.cos(ang + 0.45), ty - hl * Math.sin(ang + 0.45));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawCaption(ctx, segments, y = 1525, size = 82) {
  // segments: [{ t: 'WORD', c?: PAL.gold | PAL.crimson | PAL.cyan | PAL.white }]
  // Automatically wraps across max 2 balanced lines if wide
  ctx.save();
  ctx.font = `900 ${size}px Inter, sans-serif`;
  const sp = size * 0.28;
  const maxW = 910;
  const measured = segments.map((s) => ({ ...s, w: ctx.measureText(s.t).width }));
  const lineWidth = (arr) => arr.reduce((a, b) => a + b.w, 0) + sp * Math.max(0, arr.length - 1);

  let lines = [measured];
  if (lineWidth(measured) > maxW && measured.length > 1) {
    let bestSplit = 1;
    let bestDiff = Infinity;
    for (let i = 1; i < measured.length; i++) {
      const d = Math.abs(lineWidth(measured.slice(0, i)) - lineWidth(measured.slice(i)));
      if (d < bestDiff) {
        bestDiff = d;
        bestSplit = i;
      }
    }
    lines = [measured.slice(0, bestSplit), measured.slice(bestSplit)];
  }

  const longest = Math.max(...lines.map(lineWidth));
  const sc = Math.min(1, maxW / longest);

  ctx.translate(W / 2, y);
  ctx.scale(sc, sc);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  const lh = size * 1.12;
  const y0 = -((lines.length - 1) * lh) / 2;

  lines.forEach((ln, li) => {
    let cx = -lineWidth(ln) / 2;
    const cy = y0 + li * lh;
    for (const seg of ln) {
      // Deep drop + heavy outline just like Tower 11
      ctx.lineWidth = 22;
      ctx.strokeStyle = 'rgba(0,0,0,0.85)';
      ctx.strokeText(seg.t, cx, cy + 7);
      ctx.lineWidth = 18;
      ctx.strokeStyle = INK;
      ctx.strokeText(seg.t, cx, cy);
      ctx.fillStyle = seg.c || PAL.white;
      ctx.fillText(seg.t, cx, cy);
      cx += seg.w + sp;
    }
  });
  ctx.restore();
}

export function drawSplitChrome(ctx, { leftTitle, leftSub, rightTitle, rightSub, footerBig = 'COMMENT A OR B', footerSub = 'EPISODE 2 YOU DECIDE' } = {}) {
  ctx.save();
  // Center divider line
  ctx.fillStyle = INK;
  ctx.fillRect(W / 2 - 5, 0, 10, H);
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(W / 2 - 1, 0, 2, H);

  const drawChoiceHeader = (cx, title, sub, bg) => {
    const bw = 380;
    const bh = 136;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    rrPath(ctx, cx - bw / 2, 230, bw, bh, 26);
    fillStroke(ctx, bg, 5, INK);
    ctx.shadowColor = 'transparent';

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 54px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(title, cx, 282);

    ctx.font = '900 28px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fillText(sub, cx, 332);
  };

  drawChoiceHeader(W * 0.25, leftTitle, leftSub, '#2272D6');
  drawChoiceHeader(W * 0.75, rightTitle, rightSub, PAL.crimson);

  // Footer CTA matching Tower 11 + Follow Hook
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.font = '900 72px Inter, sans-serif';
  ctx.lineWidth = 18;
  ctx.strokeStyle = INK;
  ctx.strokeText(footerBig, W / 2, 1585);
  ctx.fillStyle = PAL.gold;
  ctx.fillText(footerBig, W / 2, 1585);

  ctx.font = '900 34px Inter, sans-serif';
  ctx.lineWidth = 12;
  ctx.strokeStyle = INK;
  ctx.strokeText(footerSub, W / 2, 1658);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(footerSub, W / 2, 1658);

  // Explicit Follow Pill CTA ("if second part is not uploaded they should wait and follow")
  rrPath(ctx, W / 2 - 225, 1712, 450, 54, 27);
  fillStroke(ctx, 'rgba(16, 20, 28, 0.94)', 3.5, PAL.gold);
  ctx.font = '900 26px Inter, sans-serif';
  ctx.fillStyle = PAL.gold;
  ctx.fillText('+ FOLLOW FOR PART 2', W / 2, 1741);
  ctx.restore();
}

/**
 * Handcrafted Lined Notepad Card inspired directly by Tower 11 Part 1/2 RULES sheet.
 */
export function drawNotepadCard(ctx, { x = 140, y = 330, w = 800, h = 980, rot = -0.02, title = 'NIGHT RULES', rules = [], visibleCount = 99 } = {}) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rot);
  ctx.translate(-w / 2, -h / 2);

  // Heavy desk shadow + clipboard backing
  ctx.shadowColor = 'rgba(0,0,0,0.68)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 14;
  rrPath(ctx, -28, -42, w + 56, h + 74, 24);
  fillStroke(ctx, '#4B3222', 5, INK);
  ctx.shadowColor = 'transparent';

  // Cream lined notebook page
  rrPath(ctx, 0, 0, w, h, 10);
  fillStroke(ctx, '#ECE5D3', 4.5, INK);

  ctx.save();
  ctx.clip();
  // Ruled horizontal lines
  ctx.strokeStyle = 'rgba(92, 134, 184, 0.36)';
  ctx.lineWidth = 3;
  for (let ly = 165; ly < h - 30; ly += 68) {
    ctx.beginPath();
    ctx.moveTo(0, ly);
    ctx.lineTo(w, ly);
    ctx.stroke();
  }
  // Vertical pink-red margin line
  ctx.strokeStyle = 'rgba(216, 74, 74, 0.45)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(86, 0);
  ctx.lineTo(86, h);
  ctx.stroke();

  // Steel clipboard clasp at top center
  rrPath(ctx, w / 2 - 125, -18, 250, 74, 14);
  fillStroke(ctx, '#8A94A0', 4.5, INK);
  rrPath(ctx, w / 2 - 58, 12, 116, 22, 10);
  fillStroke(ctx, '#282E36', 3.5, INK);

  // Header
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 46px Inter, sans-serif';
  ctx.fillStyle = INK;
  ctx.fillText(title, w / 2 + 12, 114);
  ctx.strokeStyle = PAL.crimson;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 175, 142);
  ctx.lineTo(w / 2 + 195, 142);
  ctx.stroke();

  // Handwritten rule entries (sequential reveal supported!)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  let curY = 224;
  rules.slice(0, visibleCount).forEach((rule) => {
    ctx.font = '900 32px Inter, sans-serif';
    ctx.fillStyle = rule.danger ? '#B81B18' : '#1E222A';
    ctx.fillText(rule.head, 112, curY);
    curY += 62;
    ctx.font = '700 31px FreeMono, monospace';
    ctx.fillStyle = rule.danger ? PAL.crimson : '#26303D';
    rule.lines.forEach((ln) => {
      ctx.fillText(ln, 112, curY);
      curY += 64;
    });
    if (rule.underline) {
      ctx.strokeStyle = PAL.crimson;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(112, curY - 50);
      ctx.lineTo(w - 54, curY - 52);
      ctx.stroke();
    }
    curY += 34;
  });

  // Aging corner tea/water stain
  ctx.fillStyle = 'rgba(166, 126, 78, 0.14)';
  ctx.beginPath();
  ctx.arc(w - 60, h - 40, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

