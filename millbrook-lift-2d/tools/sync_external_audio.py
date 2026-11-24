"""External Audio Synchronization Engine for 'millbrook-lift-2d'.
Reads an already-produced external final MP3/WAV track (`audioPath` + verified line windows in `script_final.json`),
transcodes to 24kHz mono / 48kHz stereo, aligns word timings acoustically across energy valleys,
and extracts 30fps lip-sync mouth amplitude (`mouth.json`).

Usage:
  python tools/sync_external_audio.py --script script_final.json --outdir data_final
"""
import argparse
import json
import re
import subprocess
from pathlib import Path
import numpy as np
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parent.parent
FFMPEG = 'z:/Mini Projects/Nirvana/Automation reel workflow/bin/ffmpeg.exe'
if not Path(FFMPEG).exists():
    FFMPEG = 'ffmpeg'
FPS = 30
SR = 24000


def align_segment_words(audio_slice: np.ndarray, text: str, line_idx: int, seg_start: float):
    toks = [w for w in re.split(r'\s+', text.strip()) if w]
    if not toks:
        return []
    seg_dur = len(audio_slice) / float(SR)
    clean = lambda w: re.sub(r'[^a-zA-Z0-9]+', '', w)
    wts = []
    for idx, w in enumerate(toks):
        base = max(1.8, len(clean(w)) * 1.05 + 1.4)
        if w.endswith(','):
            base += 2.2
        elif w.endswith('...') or (re.search(r'[.?!…"]$', w) and idx < len(toks) - 1):
            base += 3.8
        wts.append(base)
    tot = sum(wts)

    hop = int(0.02 * SR)
    n_hops = max(1, len(audio_slice) // hop)
    env = np.sqrt(np.mean(audio_slice[: n_hops * hop].reshape(n_hops, hop) ** 2, axis=1))
    env /= np.max(env) + 1e-9

    cur = seg_start
    out = []
    for w, wt in zip(toks, wts):
        dur = seg_dur * (wt / tot)
        target_t = (cur - seg_start) + dur
        h_idx = int(target_t / 0.02)
        if 3 <= h_idx < len(env) - 3 and len(toks) > 2:
            win = env[h_idx - 2 : h_idx + 3]
            best_off = int(np.argmin(win)) - 2
            snap_t = (h_idx + best_off) * 0.02
            if snap_t > (cur - seg_start) + 0.08 and snap_t < seg_dur - 0.05:
                dur = snap_t - (cur - seg_start)
        speak_end = cur + dur * 0.90
        out.append({'w': w, 'line': line_idx, 's': round(cur, 3), 'e': round(max(cur + 0.06, speak_end), 3)})
        cur += dur
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--script', default='script_final.json')
    ap.add_argument('--outdir', default='data_final')
    args = ap.parse_args()

    script_p = ROOT / args.script
    out_dir = ROOT / args.outdir
    out_dir.mkdir(parents=True, exist_ok=True)

    script = json.loads(script_p.read_text(encoding='utf-8'))
    audio_src = (ROOT / script['audioPath']).resolve()
    if not audio_src.exists():
        raise SystemExit(f'Missing external audio: {audio_src}')

    wav_mono = out_dir / 'narration.wav'
    subprocess.run(
        [FFMPEG, '-y', '-i', str(audio_src), '-ac', '1', '-ar', str(SR), '-c:a', 'pcm_s16le', str(wav_mono)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    sr, x_int = wavfile.read(wav_mono)
    assert sr == SR
    x = x_int.astype(np.float64) / 32768.0
    total_dur = len(x) / float(SR)

    lines_meta = []
    words_meta = []
    for i, ln in enumerate(script['lines']):
        st = float(ln['start'])
        en = min(total_dur, float(ln['end']))
        s0, s1 = int(st * SR), min(len(x), int(en * SR))
        seg = x[s0:s1]
        lines_meta.append({
            'i': i,
            'act': ln.get('act', 1),
            'character': ln.get('character', 'Narrator'),
            'text': ln['text'],
            'start': round(st, 3),
            'end': round(en, 3),
            'caps': ln.get('caps', ln['text']),
        })
        words_meta.extend(align_segment_words(seg, ln['text'], i, st))

    # Extract 30fps lip-sync RMS mouth amplitude envelope
    n_frames = int(np.ceil(total_dur * FPS))
    hop = int(SR / FPS)
    mouth_env = []
    for fi in range(n_frames):
        s0 = fi * hop
        seg = x[s0 : s0 + hop]
        rms = float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0
        mouth_env.append(round(min(1.0, rms * 5.2), 3))

    (out_dir / 'lines.json').write_text(
        json.dumps({'duration': round(total_dur, 3), 'lines': lines_meta}, indent=1, ensure_ascii=False),
        encoding='utf-8',
    )
    (out_dir / 'words.json').write_text(json.dumps(words_meta, indent=1, ensure_ascii=False), encoding='utf-8')
    (out_dir / 'mouth.json').write_text(json.dumps({'fps': FPS, 'env': mouth_env}), encoding='utf-8')
    print(f'Synced external audio -> {out_dir} ({total_dur:.2f}s, {len(lines_meta)} lines, {len(words_meta)} words, {n_frames} mouth frames)')


if __name__ == '__main__':
    main()

