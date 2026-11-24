"""Local Kokoro-82M TTS + Acoustic Word Aligner for Roblox Story 3D.
Supports kokoro-v1.0.onnx or kokoro-v1.0.int8.onnx in ~/.faceless-shorts/kokoro/.
Outputs: data/narration.wav, data/lines.json, data/words.json, data/mouth.json, data/words.txt
Usage:
  python tools/tts_align.py .
"""
import argparse, json, os, re
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from kokoro_onnx import Kokoro

HOME = Path(os.environ.get('FACELESS_HOME', Path.home() / '.faceless-shorts'))
KDIR = HOME / 'kokoro'
SR = 24000
FPS = 30


def trim(x, thr=0.008):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a = max(0, idx[0] - int(0.01 * SR))
    b = min(len(x), idx[-1] + int(0.025 * SR))
    return x[a:b]


def silences(x, thr=0.012, min_len=0.055):
    hop = int(0.01 * SR)
    n = len(x) // hop
    if n < 2:
        return []
    rms = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, axis=1))
    quiet = rms < thr * (np.abs(x).max() + 1e-9)
    out, st = [], None
    for f, q in enumerate(quiet):
        if q and st is None:
            st = f
        if (not q or f == n - 1) and st is not None:
            if (f - st) * 0.01 >= min_len:
                out.append((st * 0.01, f * 0.01))
            st = None
    return out


def align_words_acoustically(audio, text, line_idx, line_start):
    """Map tokens inside the line's spoken audio while respecting punctuation & acoustic silences."""
    toks = [w for w in text.split() if w.strip()]
    if not toks:
        return []
    dur = len(audio) / float(SR)
    # Locate active speech bounds
    hop = int(0.01 * SR)
    rms = np.sqrt(np.mean(audio[:(len(audio) // hop) * hop].reshape(-1, hop) ** 2, axis=1)) if len(audio) >= hop else np.array([1.0])
    peak = max(float(rms.max()), 1e-6)
    active = np.where(rms > 0.04 * peak)[0]
    t0 = (int(active[0]) * 0.01) if len(active) else 0.0
    t1 = min(dur, ((int(active[-1]) + 1) * 0.01) if len(active) else dur)
    if t1 <= t0 + 0.05:
        t0, t1 = 0.0, dur

    def weight(tok, is_last):
        bare = re.sub(r"[^A-Za-z0-9']+", '', tok)
        base = max(1.6, len(bare) * 0.85 + 1.8)
        if re.search(r'[.?!]$', tok) and not is_last:
            base += 3.2
        elif re.search(r'[,;:—–-]$', tok) and not is_last:
            base += 1.6
        return base

    wts = [weight(tok, i == len(toks) - 1) for i, tok in enumerate(toks)]
    tot = sum(wts)
    cur = t0
    out = []
    for tok, wt in zip(toks, wts):
        span = (t1 - t0) * (wt / tot)
        out.append({
            'w': tok,
            'line': line_idx,
            's': round(line_start + cur, 3),
            'e': round(line_start + cur + span * 0.92, 3),
        })
        cur += span
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project', default='.')
    args = ap.parse_args()
    P = Path(args.project).resolve()
    S = json.loads((P / 'script.json').read_text(encoding='utf-8'))

    model_path = KDIR / 'kokoro-v1.0.onnx'
    if not model_path.exists():
        model_path = KDIR / 'kokoro-v1.0.int8.onnx'
    if not model_path.exists():
        raise SystemExit(f'Missing Kokoro model in {KDIR}')
    voices_path = KDIR / 'voices-cast.npz'
    if not voices_path.exists():
        voices_path = KDIR / 'voices-v1.0.bin'
    k = Kokoro(str(model_path), str(voices_path))

    voice = S.get('voice', 'am_fenrir')
    speed = float(S.get('speed', 1.08))
    lang = 'en-gb' if voice.startswith('b') else 'en-us'
    say = lambda txt: trim(np.asarray(k.create(txt, voice=voice, speed=speed, lang=lang)[0], dtype=np.float64))

    # Group into full sentences for smooth inflection, then cut cleanly inside pauses
    groups, cur = [], []
    for i, ln in enumerate(S['lines']):
        cur.append(i)
        if re.search(r'[.?!]["\')]*$', ln['text'].strip()) or ln.get('break') or i == len(S['lines']) - 1:
            groups.append(cur)
            cur = []

    lead_s = float(S.get('lead', 0.25))
    out = [np.zeros(int(lead_s * SR))]
    t = len(out[0]) / SR
    lines_meta = [None] * len(S['lines'])
    words_meta = []

    for g in groups:
        x = say(' '.join(S['lines'][i]['text'] for i in g))
        cuts = [0.0]
        if len(g) > 1:
            lens = np.array([len(say(S['lines'][i]['text'])) for i in g], dtype=float)
            pauses = silences(x)
            for c in np.cumsum(lens)[:-1] / lens.sum() * len(x) / SR:
                near = [p for p in pauses if abs((p[0] + p[1]) / 2 - c) < 0.4]
                if near:
                    p = min(near, key=lambda p: abs((p[0] + p[1]) / 2 - c))
                    cuts.append((p[0], p[1]))
                else:
                    cuts.append((c, c))
        n = len(x) / SR
        for j, i in enumerate(g):
            a = 0.0 if j == 0 else cuts[j][1]
            b = n if j == len(g) - 1 else cuts[j + 1][0]
            st, en = t + a, t + b
            lines_meta[i] = {'i': i, 'text': S['lines'][i]['text'], 'start': round(st, 3), 'end': round(en, 3)}
            seg_audio = x[int(a * SR):max(int(a * SR) + 1, int(b * SR))]
            words_meta.extend(align_words_acoustically(seg_audio, S['lines'][i]['text'], i, st))
            print(f"  L{i:02d} {st:5.2f}-{en:5.2f}s | {S['lines'][i]['text']}")
        gap = np.zeros(int(float(S['lines'][g[-1]].get('gap', S.get('gap', 0.18))) * SR))
        out += [x, gap]
        t += (len(x) + len(gap)) / SR

    out.append(np.zeros(int(float(S.get('outro', 0.9)) * SR)))
    y = np.concatenate(out)
    y = y / (np.abs(y).max() + 1e-9) * 0.92

    data_dir = P / 'data'
    data_dir.mkdir(exist_ok=True)
    wavfile.write(data_dir / 'narration.wav', SR, (y * 32767).astype(np.int16))
    dur = len(y) / SR

    n_frames = int(np.ceil(dur * FPS))
    sp_frame = int(SR / FPS)
    mouth_frames = []
    for f in range(n_frames):
        s0, s1 = f * sp_frame, min(len(y), (f + 1) * sp_frame)
        rms = float(np.sqrt(np.mean(y[s0:s1] ** 2))) if s1 > s0 else 0.0
        mouth_frames.append(round(min(1.0, max(0.0, (rms - 0.015) / 0.17)), 3))

    (data_dir / 'lines.json').write_text(json.dumps({'duration': round(dur, 3), 'voice': voice, 'speed': speed, 'lines': lines_meta}, indent=1))
    (data_dir / 'words.json').write_text(json.dumps(words_meta, indent=1))
    (data_dir / 'mouth.json').write_text(json.dumps({'fps': FPS, 'env': mouth_frames}))
    (data_dir / 'words.txt').write_text('\n'.join(f"{w['s']:7.2f} {w['e']:7.2f}  L{w['line']:<2d} {w['w']}" for w in words_meta))
    print(f"OK: {data_dir / 'narration.wav'} ({dur:.2f}s, {len(words_meta)} words)")


if __name__ == '__main__':
    main()
