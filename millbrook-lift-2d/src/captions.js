// Tower-11 Style Word-Synced Captions + Dynamic Active Word Highlighting.
import { W, PAL, INK, clamp } from './palette.js';
import { T, lineWords, activeLine } from './timing.js';

let caps = [];

const eob = (t) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));

function highlightColorFor(lineIdx) {
  const ln = T.lines[lineIdx];
  if (!ln) return PAL.gold;
  if (ln.character === 'DrWard' || ln.character === 'Entity') return PAL.crimson;
  if (ln.act === 4 || ln.act === 5) {
    if (ln.id === 10 || ln.id === 12 || ln.id === 18) return PAL.cyan;
    return PAL.crimson;
  }
  if (ln.act === 6) return PAL.crimson;
  return PAL.gold;
}

export function buildCaptions(script) {
  caps = [];
  script.lines.forEach((ln, i) => {
    const chunks = (ln.caps || ln.text).split('|').map((s) => s.trim()).filter(Boolean);
    const ws = lineWords(i);
    if (!ws.length) return;
    const counts = chunks.map((c) => c.split(/\s+/).length);
    const N = counts.reduce((a, b) => a + b, 0);
    const nm = (w) => String(w).toLowerCase().replace(/[^a-z0-9']+/g, '');

    let acc = 0, from = 0;
    chunks.forEach((c, j) => {
      const first = nm(c.split(/\s+/)[0]);
      let idx = j === 0 ? 0 : ws.findIndex((w, k) => k > from && first && (nm(w.w) === first || (first.length > 2 && nm(w.w).startsWith(first))));
      if (idx < 0) idx = Math.max(from + (j ? 1 : 0), Math.min(ws.length - 1, Math.round((acc * ws.length) / N)));
      acc += counts[j];
      from = idx;
      const hiCol = highlightColorFor(i);
      caps.push({
        line: i,
        s: ws[idx].s - 0.05,
        hiCol,
        words: c.split(/\s+/).map((w) => ({ txt: w.replace(/\*/g, ''), hi: w.startsWith('*') })),
      });
    });
  });

  caps.forEach((c, k) => {
    const next = caps[k + 1];
    const lineEnd = T.lines[c.line].end;
    c.e = next ? (next.s - lineEnd > 0.65 && next.line !== c.line ? lineEnd + 0.30 : next.s) : T.dur;
  });
  return caps;
}

export const captionList = () => caps;

export function drawCaptionAt(ctx, t, y = 1605, size = 82) {
  const c = caps.find((x) => t >= x.s && t < x.e);
  if (!c) return;
  const lt = t - c.s;
  ctx.save();
  ctx.font = `900 ${size}px Inter, sans-serif`;
  const sp = size * 0.27;
  const maxW = 910;
  c.words.forEach((w) => {
    w.w = ctx.measureText(w.txt).width;
  });
  const lineWidth = (arr) => arr.reduce((a, b) => a + b.w, 0) + sp * Math.max(0, arr.length - 1);

  let lines = [c.words];
  if (lineWidth(c.words) > maxW && c.words.length > 1) {
    let best = 1, bestDiff = Infinity;
    for (let i = 1; i < c.words.length; i++) {
      const d = Math.abs(lineWidth(c.words.slice(0, i)) - lineWidth(c.words.slice(i)));
      if (d < bestDiff) { bestDiff = d; best = i; }
    }
    lines = [c.words.slice(0, best), c.words.slice(best)];
  }

  const longest = Math.max(...lines.map(lineWidth));
  const sc = (lt < 0.16 ? (0.78 + 0.22 * eob(seg(lt, 0, 0.16))) : 1.0) * Math.min(1, maxW / longest);

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
    for (const segW of ln) {
      ctx.lineWidth = 22;
      ctx.strokeStyle = 'rgba(0,0,0,0.88)';
      ctx.strokeText(segW.txt, cx, cy + 7);
      ctx.lineWidth = 18;
      ctx.strokeStyle = INK;
      ctx.strokeText(segW.txt, cx, cy);
      ctx.fillStyle = segW.hi ? c.hiCol : PAL.white;
      ctx.fillText(segW.txt, cx, cy);
      cx += segW.w + sp;
    }
  });
  ctx.restore();
}

