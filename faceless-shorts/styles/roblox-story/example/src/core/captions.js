// Roblox-story captions: bottom-center 1-word (or paired short-word) punchy Inter Black text
// with thick black stroke, drop shadow, spring pop-in, and optional *green / !red / ~cyan keyword tint.
import { ctx, clamp, lerp, seg, eob } from './lib.js';
import { T, lineWords } from './timing.js';

export const CAP = { y: 1475, size: 96, maxW: 940 };
let caps = [];
const SHORT = /^(a|an|the|to|of|in|on|at|by|and|but|or|so|is|it|he|she|we|i|his|her|my|no|up|for|was)$/i;

function parseStyledTokens(rawChunk) {
  return rawChunk.trim().split(/\s+/).filter(Boolean).map((tok) => {
    let color = '#FFFFFF';
    let txt = tok;
    if (tok.startsWith('*')) { color = '#58FF72'; txt = tok.slice(1); }
    else if (tok.startsWith('!')) { color = '#FF4252'; txt = tok.slice(1); }
    else if (tok.startsWith('~')) { color = '#5BE9FF'; txt = tok.slice(1); }
    return { txt, color };
  });
}

function autoChunks(ws) {
  const out = [];
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i], n = ws[i + 1], bare = w.replace(/[^A-Za-z']/g, '');
    if (n && SHORT.test(bare) && !/[,.!?;:—–-]$/.test(w) && (w + n).length <= 10) {
      out.push([i, i + 1]);
      i++;
    } else {
      out.push([i, i]);
    }
  }
  return out;
}

export function buildCaptions(script) {
  caps = [];
  const capY = script.capY || CAP.y;
  CAP.size = script.capSize || 76;
  script.lines.forEach((ln, i) => {
    const ws = lineWords(i);
    if (!ws.length) return;
    const textWords = ln.text.split(/\s+/).filter(Boolean);
    const spoken = ws.length === textWords.length ? textWords : ws.map((w) => w.w);
    if (ln.caps) {
      const nm = (w) => String(w).toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}']+/gu, '');
      let from = 0;
      ln.caps.split('|').map((c) => c.trim()).filter(Boolean).forEach((c, j) => {
        const toks = parseStyledTokens(c);
        const first = nm(toks[0]?.txt || '');
        let idx = j === 0 ? 0 : ws.findIndex((w, k) => k > from && nm(w.w) === first);
        if (idx < 0) idx = Math.min(ws.length - 1, from + 1);
        from = idx;
        caps.push({ line: i, s: ws[idx].s - 0.03, y: ln.capY || capY, tokens: toks });
      });
    } else {
      autoChunks(spoken).forEach(([a, b]) => {
        caps.push({
          line: i,
          s: ws[a].s - 0.03,
          y: ln.capY || capY,
          tokens: spoken.slice(a, b + 1).map((txt) => ({ txt, color: '#FFFFFF' })),
        });
      });
    }
  });
  caps.forEach((c, k) => {
    const next = caps[k + 1], lineEnd = T.lines[c.line].end;
    c.e = next ? (next.s - lineEnd > 0.55 && next.line !== c.line ? lineEnd + 0.25 : next.s) : T.dur;
  });
  return caps;
}

export const captionList = () => caps.map((c) => ({
  s: c.s, e: c.e,
  words: c.tokens.map((t) => ({ txt: t.txt, hi: t.color !== '#FFFFFF' })),
}));

export function captionText(textOrTokens, x = 540, y = CAP.y, sc = 1, size = CAP.size) {
  const tokens = Array.isArray(textOrTokens) ? textOrTokens : parseStyledTokens(String(textOrTokens));
  if (!tokens.length) return;
  ctx.save();
  ctx.font = `900 ${size}px Inter`;
  ctx.letterSpacing = '0px';
  const spaceW = ctx.measureText(' ').width * 0.9;
  const widths = tokens.map((t) => ctx.measureText(t.txt).width);
  const totalW = widths.reduce((a, b) => a + b, 0) + spaceW * Math.max(0, tokens.length - 1);
  const fit = Math.min(1, CAP.maxW / Math.max(1, totalW));

  ctx.translate(x, y);
  ctx.scale(sc * fit, sc * fit);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  let cx = -totalW / 2;
  tokens.forEach((t, idx) => {
    // Hard dark offset drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillText(t.txt, cx + 4, 10);
    // Thick Roblox-style outline
    ctx.lineWidth = Math.round(size * 0.2);
    ctx.strokeStyle = '#09090E';
    ctx.strokeText(t.txt, cx, 0);
    // Fill
    ctx.fillStyle = t.color;
    ctx.fillText(t.txt, cx, 0);
    cx += widths[idx] + spaceW;
  });
  ctx.restore();
}

export function drawCaption(t) {
  const c = caps.find((item) => t >= item.s && t < item.e);
  if (!c) return;
  const lt = t - c.s;
  const sc = lt < 0.09 ? lerp(0.82, 1.0, eob(seg(lt, 0, 0.09))) : 1.0;
  captionText(c.tokens, 540, c.y, sc);
}

