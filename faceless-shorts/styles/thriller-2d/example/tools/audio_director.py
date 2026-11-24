"""Emotional Multi-Voice Kokoro-82M Audio Director (English Noir + Hinglish Cuts).
Supports:
  python tools/audio_director.py --script script_noir.json --outdir data_noir
  python tools/audio_director.py --script script_hinglish.json --outdir data_hinglish

Vocal craft upgrades (anti-"AI slop"):
- Custom voice-embedding blends:
    narr_noir     = 0.52*bm_fable + 0.36*am_fenrir + 0.12*bm_george
    hinglish_story= 0.72*hm_omega + 0.18*bm_fable  + 0.10*am_fenrir
- Sub-clause splitting on '...' pauses so sentences insert genuine 0.22-0.46s human gaps
- Subtle shaped micro-breath intakes before key reveals ("breath": true)
- Dynamic mood shaping (calm / tense / hush close-mic whisper / urgent)
- Dark metallic reverb throw across climax tails ("reverbTail": true)
- Fire cast preserved: Maya (af_nicole), DrWard (bm_george PA-1978), Entity (af_nicole shimmer)
"""
import argparse
import json
import os
import re
from pathlib import Path
import numpy as np
import scipy.signal
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parent.parent
HOME = Path(os.environ.get('FACELESS_HOME', Path.home() / '.faceless-shorts'))
KDIR = HOME / 'kokoro'
SR = 24000
FPS = 30
rng = np.random.default_rng(42)


def ensure_blends(npz_path: Path):
    d = dict(np.load(npz_path))
    changed = False
    needed = {
        'narr_noir': (0.36 * d['bm_fable'] + 0.46 * d['am_fenrir'] + 0.18 * d['am_onyx']).astype(np.float32),
        'hinglish_story': (0.76 * d['hm_omega'] + 0.16 * d['bm_fable'] + 0.08 * d['am_fenrir']).astype(np.float32),
    }
    for k, v in needed.items():
        if k not in d or d[k].shape != v.shape or not np.allclose(d[k], v, atol=1e-5):
            d[k] = v
            changed = True
    if changed:
        np.savez(npz_path, **d)


def shelf_boost(x, f, gain_db, kind='low'):
    nyq = 0.5 * SR
    b, a = scipy.signal.butter(2, min(f, nyq - 100) / nyq, btype=kind)
    band = scipy.signal.lfilter(b, a, x)
    amt = (10 ** (gain_db / 20.0)) - 1.0
    return x + band * amt


def master_mood_voice(x, mood='calm'):
    """Apply proximity warmth, harshness scoop, and emotional mood shaping."""
    nyq = 0.5 * SR
    b_hp, a_hp = scipy.signal.butter(2, 82.0 / nyq, btype='high')
    y = scipy.signal.lfilter(b_hp, a_hp, x)

    # Proximity bass warmth + de-harsh 3.4-5kHz TTS peak
    bass_db = 4.2 if mood == 'hush' else 3.2
    y = shelf_boost(y, 175.0, bass_db, kind='low')
    b_bp, a_bp = scipy.signal.butter(2, [3200.0 / nyq, 5200.0 / nyq], btype='band')
    y = y - scipy.signal.lfilter(b_bp, a_bp, y) * (0.36 if mood == 'hush' else 0.26)

    if mood == 'hush':
        # Intimate lean-in close-mic softness
        b_lp, a_lp = scipy.signal.butter(2, 5400.0 / nyq, btype='low')
        y = scipy.signal.lfilter(b_lp, a_lp, y)
    elif mood == 'urgent':
        y = shelf_boost(y, 2100.0, +1.8, kind='high')

    drive = 1.38 if mood == 'urgent' else 1.24
    y = np.tanh(y * drive) / np.tanh(drive)
    return y


def apply_reverb_tail(x, tail_sec=0.45):
    """Add dark moody corridor decay over final half-second of reveal lines."""
    n_tail = int(tail_sec * SR)
    pad = np.zeros(len(x) + int(0.45 * SR), dtype=np.float64)
    pad[: len(x)] = x
    src = np.zeros_like(pad)
    s0 = max(0, len(x) - n_tail)
    src[s0 : len(x)] = x[s0 : len(x)]
    # Soft darkened corridor echoes
    nyq = 0.5 * SR
    b, a = scipy.signal.butter(2, 2200.0 / nyq, btype='low')
    wet = scipy.signal.lfilter(b, a, src)
    for d_s, g in [(0.085, 0.24), (0.175, 0.16), (0.290, 0.10)]:
        ds = int(d_s * SR)
        if ds < len(pad):
            pad[ds:] += wet[:-ds] * g
    return pad


def breath_intake(dur=0.16):
    """Organic ultra-subtle close-mic inhale sound before tense narrative beats."""
    n = int(dur * SR)
    raw = rng.standard_normal(n)
    nyq = 0.5 * SR
    b, a = scipy.signal.butter(2, [340.0 / nyq, 1750.0 / nyq], btype='band')
    f = scipy.signal.lfilter(b, a, raw)
    env = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.8
    f = f / (np.max(np.abs(f)) + 1e-9) * env * 0.014
    return f.astype(np.float64)


def apply_intercom_1978(x):
    nyq = 0.5 * SR
    b, a = scipy.signal.butter(4, [360.0 / nyq, 2900.0 / nyq], btype='band')
    y = scipy.signal.lfilter(b, a, x)
    y = np.tanh(y * 2.1) * 0.65
    hiss = scipy.signal.lfilter(*scipy.signal.butter(2, 3400.0 / nyq, btype='low'), rng.normal(0, 0.012, len(y)))
    body = np.clip(y + hiss, -1.0, 1.0)
    tt = np.arange(int(0.08 * SR)) / SR
    pre = (np.sin(2 * np.pi * 1120 * tt) * np.exp(-tt * 38) * 0.25) + rng.normal(0, 0.03, len(tt)) * np.exp(-tt * 25)
    post = rng.normal(0, 0.025, int(0.06 * SR)) * np.exp(-np.linspace(0, 5, int(0.06 * SR)))
    return np.concatenate([pre, body, post])


def apply_whisper_entity(x):
    nyq = 0.5 * SR
    b, a = scipy.signal.butter(2, [220.0 / nyq, 3800.0 / nyq], btype='band')
    y = scipy.signal.lfilter(b, a, x)
    d1, d2 = int(0.055 * SR), int(0.115 * SR)
    out = np.copy(y)
    if len(y) > d1:
        out[d1:] += y[:-d1] * 0.45
    if len(y) > d2:
        out[d2:] += y[:-d2] * 0.22
    air = scipy.signal.lfilter(*scipy.signal.butter(2, [450 / nyq, 2400 / nyq], btype='band'), rng.normal(0, 0.008, len(out)))
    return np.clip(out + air, -1.0, 1.0)


def trim_silence(x, thr=0.006):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a = max(0, idx[0] - int(0.014 * SR))
    b = min(len(x), idx[-1] + int(0.032 * SR))
    return x[a:b]


def synth_clause(k, clause_txt, voice, speed, lang):
    if lang == 'hi':
        # Strip explicit espeak-ng language switches `(en)` / `(hi)` so Kokoro never spells them out!
        ph = re.sub(r'\([a-z]{2,3}\)', '', k.tokenizer.phonemize(clause_txt, 'hi')).strip()
        raw, _ = k.create(ph, voice=voice, speed=speed, lang='hi', is_phonemes=True)
    else:
        raw, _ = k.create(clause_txt, voice=voice, speed=speed, lang=lang)
    trimmed = trim_silence(np.asarray(raw, dtype=np.float64))
    nf = min(int(0.012 * SR), len(trimmed) // 4)
    if nf > 0:
        trimmed[:nf] *= np.linspace(0.0, 1.0, nf)
        trimmed[-nf:] *= np.linspace(1.0, 0.0, nf)
    return trimmed


def align_words_acoustically(audio, text, line_idx, line_start):
    toks = [w for w in re.split(r'\s+', text.strip()) if w]
    if not toks:
        return []
    clip_dur = len(audio) / float(SR)
    clean = lambda w: re.sub(r'[^a-zA-Z0-9]+', '', w)
    wts = []
    for idx, w in enumerate(toks):
        base = max(1.8, len(clean(w)) * 1.05 + 1.4)
        if w.endswith(','):
            base += 2.4
        elif w.endswith('...') or (re.search(r'[.?!…"]$', w) and idx < len(toks) - 1):
            base += 4.5
        wts.append(base)
    tot = sum(wts)

    hop = int(0.02 * SR)
    n_hops = max(1, len(audio) // hop)
    env = np.sqrt(np.mean(audio[: n_hops * hop].reshape(n_hops, hop) ** 2, axis=1))
    env /= np.max(env) + 1e-9

    cur = line_start
    out = []
    for w, wt in zip(toks, wts):
        dur = clip_dur * (wt / tot)
        target_t = (cur - line_start) + dur
        h_idx = int(target_t / 0.02)
        if 3 <= h_idx < len(env) - 3 and len(toks) > 2:
            win = env[h_idx - 2 : h_idx + 3]
            best_off = int(np.argmin(win)) - 2
            snap_t = (h_idx + best_off) * 0.02
            if snap_t > (cur - line_start) + 0.08 and snap_t < clip_dur - 0.05:
                dur = snap_t - (cur - line_start)
        speak_end = cur + dur * 0.90
        out.append({'w': w, 'line': line_idx, 's': round(cur, 3), 'e': round(max(cur + 0.06, speak_end), 3)})
        cur += dur
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--script', default='script_noir.json')
    ap.add_argument('--outdir', default='data_noir')
    args = ap.parse_args()

    script_p = ROOT / args.script
    data_dir = ROOT / args.outdir
    data_dir.mkdir(parents=True, exist_ok=True)

    onnx_p = next((p for p in [KDIR / 'kokoro-v1.0.onnx', KDIR / 'kokoro-v1.0.int8.onnx'] if p.exists() and p.stat().st_size > 10_000_000), None)
    npz_p = KDIR / 'voices-cast.npz'
    if not onnx_p or not npz_p.exists():
        raise SystemExit(f'Kokoro models missing in {KDIR}.')
    ensure_blends(npz_p)

    from kokoro_onnx import Kokoro
    k = Kokoro(str(onnx_p), str(npz_p))
    script = json.loads(script_p.read_text(encoding='utf-8'))

    lead_s = float(script.get('lead', 0.45))
    outro_s = float(script.get('outro', 1.3))
    default_gap = float(script.get('default_gap', 0.38))

    chunks = [np.zeros(int(lead_s * SR), dtype=np.float32)]
    t = lead_s
    lines_meta = []
    words_meta = []

    print(f"Synthesizing {args.script} -> {args.outdir}/ ...")
    for i, ln in enumerate(script['lines']):
        char = ln.get('character', 'Narrator')
        lang = ln.get('lang', 'en-us')
        mood = ln.get('mood', 'calm')
        spd = float(ln.get('speed', 0.90))
        gap = float(ln.get('gap', default_gap))
        display_text = ln['text'].strip()
        tts_text = ln.get('tts_text', display_text).strip()

        if char == 'Narrator':
            voice = 'hinglish_story' if lang == 'hi' else 'narr_noir'
            clip_lang = 'hi' if lang == 'hi' else 'en-us'
            gain = 0.90 if mood == 'hush' else 1.02
        elif char == 'Maya':
            voice, clip_lang, gain = 'af_nicole', 'en-us', 1.05
        elif char == 'DrWard':
            voice, clip_lang, gain = 'bm_george', 'en-gb', 1.08
        else:
            voice, clip_lang, gain = 'af_nicole', 'en-us', 0.92

        # Split explicit ellipsis `...` into natural rhythmic sub-clauses with breathing gaps!
        sub_clauses = [c.strip() for c in re.split(r'\s*\.\.\.\s*', tts_text) if c.strip()]
        sub_parts = []
        if ln.get('breath') and char == 'Narrator':
            sub_parts.append(breath_intake(0.16))
            sub_parts.append(np.zeros(int(0.07 * SR), dtype=np.float64))

        pause_between = (0.36 if mood == 'hush' else 0.25 if mood == 'tense' else 0.20) if lang == 'hi' else (0.42 if mood == 'hush' else 0.28 if mood == 'tense' else 0.22)
        for si, sc in enumerate(sub_clauses):
            part = synth_clause(k, sc, voice, spd, clip_lang)
            if char == 'Narrator':
                part = master_mood_voice(part, mood)
            elif char == 'Maya':
                part = master_mood_voice(part, 'urgent')
            sub_parts.append(part)
            if si < len(sub_clauses) - 1:
                sub_parts.append(np.zeros(int(pause_between * SR), dtype=np.float64))

        audio = np.concatenate(sub_parts)
        if char == 'DrWard':
            audio = apply_intercom_1978(audio)
        elif char == 'Entity':
            audio = apply_whisper_entity(master_mood_voice(audio, 'hush'))
        elif ln.get('reverbTail'):
            audio = apply_reverb_tail(audio)

        # Normalize cleanly while preserving "hush" intimate contrast vs normal speech
        speech_energy = audio[np.abs(audio) > 0.01]
        rms = np.sqrt(np.mean(speech_energy ** 2) + 1e-12) if len(speech_energy) else 0.1
        audio = np.clip(audio * ((0.16 * gain) / rms), -0.95, 0.95).astype(np.float32)

        dur = len(audio) / float(SR)
        st, en = t, t + dur
        lines_meta.append({
            'i': i,
            'act': ln.get('act', 1),
            'character': char,
            'text': display_text,
            'start': round(st, 3),
            'end': round(en, 3),
            'caps': ln.get('caps', display_text),
        })
        words_meta.extend(align_words_acoustically(audio, display_text, i, st))
        print(f"  L{i:02d} [{char:8s}/{mood:8s}] {st:6.2f} -> {en:6.2f}s (gap {gap:.2f}s): {display_text}")

        chunks.append(audio)
        chunks.append(np.zeros(int(gap * SR), dtype=np.float32))
        t = en + gap

    chunks.append(np.zeros(int(outro_s * SR), dtype=np.float32))
    total_dur = t + outro_s
    master = np.concatenate(chunks)
    master = master / (np.max(np.abs(master)) + 1e-9) * 0.92

    wav_path = data_dir / 'narration.wav'
    wavfile.write(wav_path, SR, (master * 32767).astype(np.int16))

    n_frames = int(np.ceil(total_dur * FPS))
    sp_frame = int(SR / FPS)
    mouth_frames = []
    for f in range(n_frames):
        s0, s1 = f * sp_frame, min(len(master), (f + 1) * sp_frame)
        if s1 <= s0:
            mouth_frames.append(0.0)
        else:
            seg_rms = float(np.sqrt(np.mean(master[s0:s1] ** 2)))
            mouth_frames.append(round(min(1.0, max(0.0, (seg_rms - 0.012) / 0.18)), 3))

    (data_dir / 'lines.json').write_text(json.dumps({'duration': round(total_dur, 3), 'lines': lines_meta}, indent=1))
    (data_dir / 'words.json').write_text(json.dumps(words_meta, indent=1))
    (data_dir / 'mouth.json').write_text(json.dumps({'fps': FPS, 'env': mouth_frames}))
    (data_dir / 'words.txt').write_text('\n'.join(f"{w['s']:7.2f} {w['e']:7.2f}  L{w['line']:<2d} {w['w']}" for w in words_meta))
    print(f"Complete: {wav_path} ({total_dur:.2f}s, {len(words_meta)} words)")


if __name__ == '__main__':
    main()
