// Timing & lip-sync envelope loader driven by TTS output (lines.json, words.json, optional mouth.json).
export const T = { dur: 0, lines: [], words: [], mouth: { fps: 30, env: [] } };
const norm = (w) => String(w).toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}']+/gu, '');

export async function loadTiming() {
  const get = async (f, required = true) => {
    const r = await fetch(f, { cache: 'no-store' });
    if (!r.ok) {
      if (!required) return null;
      throw new Error(`missing ${f}: run tools/tts_align.py .`);
    }
    return r.json();
  };
  const lines = await get('data/lines.json');
  const words = await get('data/words.json');
  const mouth = await get('data/mouth.json', false);
  T.lines = lines.lines;
  T.words = words;
  T.dur = lines.duration;
  if (mouth?.env) T.mouth = mouth;
  return T;
}

export const L = (i) => { const l = T.lines[i]; if (!l) throw new Error(`no line ${i}`); return l.start; };
export const Le = (i) => { const l = T.lines[i]; if (!l) throw new Error(`no line ${i}`); return l.end; };
export function Wd(word, line, which = 's', occurrence = 0) {
  const n = norm(word);
  const hit = T.words.filter((w) => (line == null || w.line === line) && norm(w.w) === n)[occurrence];
  if (!hit) throw new Error(`word "${word}" not found${line != null ? ` in line ${line}` : ''}`);
  return hit[which];
}
export const lineWords = (i) => T.words.filter((w) => w.line === i);
export function mouthAt(t) {
  const env = T.mouth.env;
  if (!env || !env.length) return 0;
  const idx = Math.max(0, Math.min(env.length - 1, Math.round(t * (T.mouth.fps || 30))));
  return env[idx] || 0;
}

