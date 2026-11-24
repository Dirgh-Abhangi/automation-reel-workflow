// Master clock, cue alignment helpers & real audio lip-sync amplitude lookup (`data/mouth.json`).
export const T = { dur: 0, lines: [], words: [], mouth: [] };
const norm = (w) => String(w).toLowerCase().replace(/[^a-z0-9']+/g, '');

export async function loadTiming(dataDir = 'data') {
  const fetchJson = async (f) => {
    const r = await fetch(f, { cache: 'no-store' });
    if (!r.ok) throw new Error(`Missing timing file ${f}`);
    return r.json();
  };
  const [lines, words, mouth] = await Promise.all([
    fetchJson(`${dataDir}/lines.json`),
    fetchJson(`${dataDir}/words.json`),
    fetchJson(`${dataDir}/mouth.json`).catch(() => ({ env: [] })),
  ]);
  T.lines = lines.lines;
  T.words = words;
  T.dur = lines.duration;
  T.mouth = mouth.env || [];
  return T;
}

export const L = (i) => {
  const l = T.lines[i];
  if (!l) throw new Error(`Missing line ${i}`);
  return l.start;
};

export const Le = (i) => {
  const l = T.lines[i];
  if (!l) throw new Error(`Missing line ${i}`);
  return l.end;
};

export function Wd(word, line, which = 's') {
  const n = norm(word);
  const hit = T.words.find((w) => (line == null || w.line === line) && norm(w.w).startsWith(n));
  if (!hit) throw new Error(`Word "${word}" not found in line ${line}`);
  return hit[which];
}

export function WdAny(words, line, which = 's') {
  for (const w of words) {
    const n = norm(w);
    const hit = T.words.find((x) => (line == null || x.line === line) && norm(x.w).startsWith(n));
    if (hit) return hit[which];
  }
  return L(line);
}

export const lineWords = (i) => T.words.filter((w) => w.line === i);

export function activeLine(t) {
  return T.lines.find((l) => t >= l.start && t <= l.end) || null;
}

export function mouthAt(t, character = 'Maya') {
  const ln = activeLine(t);
  if (!ln || ln.character !== character) return 0;
  const idx = Math.min(T.mouth.length - 1, Math.max(0, Math.floor(t * 30)));
  return T.mouth[idx] || 0;
}

