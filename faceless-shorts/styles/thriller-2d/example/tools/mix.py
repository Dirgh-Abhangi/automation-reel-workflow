"""Cinema Thriller Audio Mixer for 'The Free Lift' (48kHz Stereo).
Synthesizes atmospheric horror score, dynamic silence dropouts (before major reveals),
Instant Doom 808 sub-drops, steel door creaks/slams, intercom static & typewriter cues.

Usage: python tools/mix.py [project_dir=.]
Reads:
  data/cues.json      (from capture.mjs cues)
  data/narration.wav  (from audio_director.py)
  script.json
Outputs:
  data/mix.wav        (48 kHz 16-bit broadcast-normalized stereo master)
"""
import argparse
import json
import subprocess
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile

_ap = argparse.ArgumentParser()
_ap.add_argument('project', nargs='?', default='.')
_ap.add_argument('--dir', default='data')
_ap.add_argument('--script', default='script.json')
_args = _ap.parse_args()

P = Path(_args.project)
DDIR = P / _args.dir
SR = 48000
import shutil
FFMPEG = shutil.which('ffmpeg') or 'z:/Mini Projects/Nirvana/Automation reel workflow/bin/ffmpeg.exe'
if not Path(FFMPEG).exists():
    FFMPEG = 'ffmpeg'

rng = np.random.default_rng(77)
cj = json.loads((DDIR / 'cues.json').read_text(encoding='utf-8'))
script = json.loads((P / _args.script).read_text(encoding='utf-8'))
DUR = float(cj['duration'])
N = int(DUR * SR) + SR // 5


def lp(x, f, o=2):
    b, a = signal.butter(o, min(f, SR / 2 - 120) / (SR / 2), 'low')
    return signal.lfilter(b, a, x)


def hp(x, f, o=2):
    b, a = signal.butter(o, max(20, f) / (SR / 2), 'high')
    return signal.lfilter(b, a, x)


def bp(x, f0, f1, o=2):
    b, a = signal.butter(o, [max(20, f0) / (SR / 2), min(f1, SR / 2 - 120) / (SR / 2)], 'band')
    return signal.lfilter(b, a, x)


def db(x):
    return 10 ** (x / 20.0)


def tt(d):
    return np.arange(max(1, int(d * SR))) / SR


def env(n, a=0.005, r=5.0):
    e = np.ones(n)
    na = min(n, max(1, int(a * SR)))
    e[:na] = np.linspace(0, 1, na)
    rest = n - na
    if rest > 0:
        e[na:] = np.exp(-np.linspace(0, r, rest))
    return e


def sweep(f0, f1, d, shape='exp'):
    t = tt(d)
    f = f0 * (f1 / f0) ** (t / d) if shape == 'exp' else f0 + (f1 - f0) * (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def noise(d):
    return rng.standard_normal(max(1, int(d * SR)))


def mono_to_stereo(x, pan=0.0):
    L = x * (1.0 - max(0.0, pan) * 0.65)
    R = x * (1.0 + min(0.0, pan) * 0.65)
    return np.stack([L, R], axis=1)


# ---------- Thriller SFX Library ----------
def fx_whoosh(d=0.42, **_):
    n = noise(d)
    lo, hi = lp(n, 420), bp(n, 350, 2600)
    k = np.sin(np.pi * np.linspace(0, 1, len(n))) ** 1.4
    x = (lo * (1 - k) + hi * k) * k
    return x / (np.abs(x).max() + 1e-9) * 0.55


def fx_chime(**_):
    d = 1.6
    t = tt(d)
    # Haunting dissonant glass bell (D5 + Eb5 shimmer)
    x = (
        np.sin(2 * np.pi * 587.33 * t) * 0.6
        + np.sin(2 * np.pi * 1174.66 * t) * 0.25
        + np.sin(2 * np.pi * 622.25 * t) * 0.18
    ) * env(len(t), 0.004, 6.5)
    return lp(x, 4200) * 0.65


def fx_ping(**_):
    d = 0.35
    t = tt(d)
    x = (np.sin(2 * np.pi * 880 * t) + 0.35 * np.sin(2 * np.pi * 1318.5 * t)) * env(len(t), 0.002, 8.0)
    return x * 0.65


def fx_chain(**_):
    d = 0.55
    x = np.zeros(int(d * SR))
    for off in [0.0, 0.11, 0.21, 0.34]:
        i = int(off * SR)
        m = bp(noise(0.14), 1400, 4800) * env(int(0.14 * SR), 0.002, 7)
        ring = np.sin(2 * np.pi * rng.uniform(1800, 2900) * tt(0.14)) * env(int(0.14 * SR), 0.002, 9)
        part = m * 0.5 + ring * 0.35
        x[i : i + len(part)] += part[: len(x) - i]
    return x / (np.abs(x).max() + 1e-9) * 0.7


def fx_page(**_):
    d = 0.38
    n = bp(noise(d), 900, 3800)
    k = np.sin(np.pi * np.linspace(0, 1, len(n))) ** 1.3
    return n * k * 0.65


def fx_write(**_):
    d = 0.16
    n = bp(noise(d), 1600, 4600)
    return n * env(len(n), 0.008, 6.0) * 0.45


def fx_footstep(**_):
    d = 0.28
    t = tt(d)
    thump = np.sin(2 * np.pi * (85 * np.exp(-t * 18) + 42) * t) * env(len(t), 0.002, 9)
    tap = bp(noise(d), 500, 2200) * env(len(t), 0.002, 16) * 0.45
    return lp(thump + tap, 2800) * 0.85


def fx_creak(d=1.6, **_):
    t = tt(d)
    # Slow iron hinge pitch bend with grit resonance
    base_f = 148 + 75 * np.sin(np.pi * t / d) + 22 * np.sin(2 * np.pi * 6.5 * t)
    scrape = np.sin(2 * np.pi * np.cumsum(base_f) / SR + 1.8 * np.sin(2 * np.pi * 42 * t))
    grit = bp(noise(d), 750, 2800) * (0.4 + 0.6 * np.sin(np.pi * t / d))
    x = (scrape * 0.55 + grit * 0.25) * np.sin(np.pi * np.linspace(0, 1, len(t))) ** 0.75
    return lp(x, 3400) * 0.75


def fx_batt_warn(**_):
    d = 0.42
    t1 = tt(0.09)
    chirp = np.sin(2 * np.pi * 1760 * t1) * env(len(t1), 0.002, 7)
    gap = np.zeros(int(0.06 * SR))
    chirp2 = np.sin(2 * np.pi * 1480 * t1) * env(len(t1), 0.002, 7)
    x = np.concatenate([chirp, gap, chirp2])
    return lp(x, 4200) * 0.65


def fx_power_cut(**_):
    d = 0.55
    whirr = sweep(1250, 90, d) * env(int(d * SR), 0.003, 5.5) * 0.55
    thump = np.sin(2 * np.pi * 55 * tt(d)) * env(int(d * SR), 0.003, 8.0) * 0.8
    return lp(whirr + thump, 3500)


def fx_doom(d=2.2, **_):
    """Cinema 808 Sub-Bass Instant Doom Drop (110Hz -> 34Hz) + visceral chest punch."""
    t = tt(d)
    f = 34.0 + 82.0 * np.exp(-t * 7.5)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.003, 3.2)
    punch = np.tanh(sub * 2.2) * 0.88
    click = lp(noise(d), 1800) * env(len(t), 0.001, 22.0) * 0.45
    tail = lp(noise(d), 260) * env(len(t), 0.02, 3.8) * 0.35
    return np.clip(punch + click + tail, -1.0, 1.0)


def fx_slam(**_):
    d = 1.15
    t = tt(d)
    clang = (
        np.sin(2 * np.pi * (58 + 70 * np.exp(-t * 22)) * t) * 0.9
        + np.sin(2 * np.pi * 194 * t) * 0.35 * env(len(t), 0.001, 10)
    ) * env(len(t), 0.002, 5.2)
    burst = bp(noise(d), 180, 2600) * env(len(t), 0.001, 9.5) * 0.75
    return np.tanh((clang + burst) * 1.45) * 0.9


def fx_dial_tick(**_):
    d = 0.07
    t = tt(d)
    return (np.sin(2 * np.pi * 920 * t) + 0.4 * np.sin(2 * np.pi * 2100 * t)) * env(len(t), 0.001, 14) * 0.5


def fx_sting(d=1.8, **_):
    """Piercing dissonant thriller string cluster + low rumble impact."""
    t = tt(d)
    cluster = (
        np.sin(2 * np.pi * 698.46 * t + 0.6 * np.sin(2 * np.pi * 6.5 * t))
        + np.sin(2 * np.pi * 739.99 * t) * 0.9
        + np.sin(2 * np.pi * 1046.5 * t) * 0.45
    )
    e = np.minimum(1, t / 0.04) * env(len(t), 0.04, 4.0)
    boom = fx_doom(d=1.2)
    out = lp(cluster * e, 4800) * 0.48
    out[: len(boom)] += boom * 0.75
    return np.clip(out, -1.0, 1.0)


def fx_squelch(**_):
    d = 0.14
    t = tt(d)
    n = bp(noise(d), 900, 3400) * env(len(t), 0.002, 10) * 0.65
    b = np.sin(2 * np.pi * 1240 * t) * env(len(t), 0.002, 16) * 0.4
    return n + b


def fx_type_tick(d=1.4, **_):
    x = np.zeros(int(d * SR))
    step = 0.065
    for k in np.arange(0, d - 0.06, step):
        i = int(k * SR)
        click = bp(noise(0.025), 1400, 4200) * env(int(0.025 * SR), 0.001, 14) * 0.45
        x[i : i + len(click)] += click[: len(x) - i]
    return x


def fx_door_grind(d=1.5, **_):
    t = tt(d)
    n = lp(noise(d), 380) * (0.4 + 0.6 * np.sin(np.pi * t / d))
    hum = np.sin(2 * np.pi * (62 + 12 * np.sin(2 * np.pi * 3 * t)) * t) * 0.45
    return (n * 0.6 + hum) * np.sin(np.pi * t / d) ** 0.7


def fx_stamp(**_):
    d = 0.28
    t = tt(d)
    return np.tanh((np.sin(2 * np.pi * 92 * np.exp(-t * 16) * t) + lp(noise(d), 900) * 0.5) * env(len(t), 0.001, 11) * 1.6) * 0.85


def fx_thud(**_):
    d = 0.42
    t = tt(d)
    return lp(np.sin(2 * np.pi * (68 + 42 * np.exp(-t * 24)) * t) * env(len(t), 0.002, 7.5) + lp(noise(d), 260) * env(len(t), 0.001, 14) * 0.45, 2200) * 0.92


def fx_alarm(d=2.4, **_):
    x = np.zeros(int(d * SR))
    pulse = np.sin(2 * np.pi * 165 * tt(0.24)) * env(int(0.24 * SR), 0.02, 5.5)
    for st in np.arange(0, d - 0.25, 0.52):
        i = int(st * SR)
        x[i : i + len(pulse)] += pulse[: len(x) - i]
    return lp(x, 850) * 0.55


def fx_riser(d=1.2, **_):
    """Creeping horror tension riser swelling right up to impact slam."""
    t = tt(d)
    k = (t / d) ** 2.1
    f = 95.0 + 490.0 * k
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.55 + np.sin(2 * np.pi * np.cumsum(f * 1.498) / SR) * 0.3
    air = bp(noise(d), 400, 3800) * 0.45
    return np.clip((tone + air) * k * np.minimum(1, (d - t) / 0.03), -1.0, 1.0) * 0.85


def fx_heartbeat(d=1.6, **_):
    one = lambda ld, freq: np.sin(2 * np.pi * freq * tt(ld)) * env(int(ld * SR), 0.004, 8)
    beat = np.concatenate([one(0.16, 56), np.zeros(int(0.11 * SR)), one(0.21, 49) * 0.78])
    x = np.zeros(int(d * SR))
    period = 0.82
    for st in np.arange(0, d - 0.35, period):
        i = int(st * SR)
        x[i : i + len(beat)] += beat[: len(x) - i]
    return lp(x, 280)


FX = {
    'whoosh': fx_whoosh,
    'chime': fx_chime,
    'ping': fx_ping,
    'chain': fx_chain,
    'page': fx_page,
    'write': fx_write,
    'footstep': fx_footstep,
    'creak': fx_creak,
    'batt_warn': fx_batt_warn,
    'power_cut': fx_power_cut,
    'doom': fx_doom,
    'slam': fx_slam,
    'dial_tick': fx_dial_tick,
    'sting': fx_sting,
    'squelch': fx_squelch,
    'type_tick': fx_type_tick,
    'door_grind': fx_door_grind,
    'stamp': fx_stamp,
    'thud': fx_thud,
    'alarm': fx_alarm,
    'riser': fx_riser,
    'heartbeat': fx_heartbeat,
}

LEVEL = {
    'whoosh': -16,
    'chime': -13,
    'ping': -14,
    'chain': -13,
    'page': -15,
    'write': -18,
    'footstep': -13,
    'creak': -10,
    'batt_warn': -11,
    'power_cut': -10,
    'doom': -4,
    'slam': -6,
    'dial_tick': -17,
    'sting': -7,
    'squelch': -12,
    'type_tick': -18,
    'door_grind': -11,
    'stamp': -9,
    'thud': -7,
    'alarm': -16,
    'riser': -10,
    'heartbeat': -7,
}


# ---------- Dynamic Horror Score Generator ----------
def build_horror_score():
    t = np.arange(N) / SR
    # Deep D-minor dread drone + rising harmonic tension in Act 4..7
    prog = np.clip(t / max(1.0, DUR), 0.0, 1.0)
    base_drone = (
        np.sin(2 * np.pi * 36.71 * t) * 0.55
        + np.sin(2 * np.pi * 55.00 * t + 0.4 * np.sin(0.25 * t)) * 0.35
        + np.sin(2 * np.pi * 73.42 * t) * 0.25
        + np.sin(2 * np.pi * 116.54 * t) * (0.06 + 0.14 * prog)  # Bb2 tension minor 6th
    )
    # Slow breathing tension swell
    lfo = 0.62 + 0.38 * np.sin(2 * np.pi * t / 9.5) ** 2
    drone = base_drone * lfo

    # Cold eerie hallway wind wash stereo
    wind_l = bp(rng.standard_normal(N), 180, 950) * 0.18
    wind_r = bp(rng.standard_normal(N), 210, 1050) * 0.18

    # Lonely sparse horror piano notes (D4, F4, Eb4, A3) every ~3.4s
    score_l = drone + wind_l
    score_r = drone + wind_r
    notes = [293.66, 349.23, 311.13, 220.00, 293.66, 277.18]
    beat_iv = 3.2
    for idx, ts in enumerate(np.arange(1.2, DUR - 6.0, beat_iv)):
        f = notes[idx % len(notes)]
        nd = 2.4
        nt = tt(nd)
        piano = (
            np.sin(2 * np.pi * f * nt) * 0.65
            + np.sin(2 * np.pi * f * 2 * nt) * 0.22
            + np.sin(2 * np.pi * (f * 0.5) * nt) * 0.25
        ) * env(len(nt), 0.012, 4.8) * 0.28
        i = int(ts * SR)
        m = min(len(piano), N - i)
        if m > 0:
            pan = -0.25 if idx % 2 == 0 else 0.25
            score_l[i : i + m] += piano[:m] * (1 - max(0, pan))
            score_r[i : i + m] += piano[:m] * (1 + min(0, pan))

    stereo = np.stack([lp(score_l, 2600), lp(score_r, 2600)], axis=1)

    # Fade in & out cleanly
    fi = min(N, int(0.9 * SR))
    fo = min(N, int(1.4 * SR))
    stereo[:fi] *= np.linspace(0, 1, fi)[:, None]
    stereo[-fo:] *= np.linspace(1, 0, fo)[:, None]
    peak = np.abs(stereo).max() + 1e-9
    return stereo / peak


def load_audio(path):
    out = subprocess.run(
        [FFMPEG, '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
        capture_output=True,
        check=True,
    ).stdout
    return np.frombuffer(out, dtype=np.float32).reshape(-1, 2).astype(np.float64)


def main():
    mix = np.zeros((N, 2), dtype=np.float64)

    # 1. Voice track (or external produced audio+foley track)
    ext_mode = bool(script.get('externalAudio', False))
    vf = DDIR / 'narration.wav'
    if ext_mode and script.get('audioPath'):
        cand = (P / script['audioPath']).resolve()
        if cand.exists():
            vf = cand
    voice = None
    if vf.exists():
        v = load_audio(vf)[:N]
        voice = np.zeros((N, 2), dtype=np.float64)
        voice[: len(v)] = v
        rms = np.sqrt(np.mean(voice ** 2) + 1e-12)
        voice *= db(-16.5 if ext_mode else -17.5) / rms
        mix += voice

    # 2. Music bed + dynamic ducking under speech + true Silence Drops (`silence_drop` cues!)
    music = build_horror_score() * db(-26.5 if ext_mode else (-24.5 if voice is not None else -19.0))
    if voice is not None:
        lev = np.abs(voice.mean(1))
        lev = signal.lfilter([1 - 0.9994], [1, -0.9994], lev)
        lev /= lev.max() + 1e-9
        music *= (1.0 - 0.56 * np.clip(lev * 3.2, 0, 1))[:, None]

    # Apply dramatic silent drops before door open & mirror shock
    for c in cj['cues']:
        if c['type'] == 'silence_drop':
            s0 = max(0, int(c['t'] * SR))
            d_s = float(c.get('dur', 1.6))
            s1 = min(N, int((c['t'] + d_s) * SR))
            fade_n = min((s1 - s0) // 4, int(0.12 * SR))
            if fade_n > 10 and s1 > s0:
                env_drop = np.full(s1 - s0, 0.03)
                env_drop[:fade_n] = np.linspace(1.0, 0.03, fade_n)
                env_drop[-fade_n:] = np.linspace(0.03, 1.0, fade_n)
                music[s0:s1] *= env_drop[:, None]

    mix += music

    # 3. Foley, Impacts & Doom Drops (when externalAudio already has baked foley, weave ONLY subtle cinema sub-weight!)
    EXT_SUB_ONLY = {'riser', 'doom', 'sting', 'power_cut', 'heartbeat', 'whoosh'}
    fx_count = 0
    for c in cj['cues']:
        ctype = c['type']
        if ctype == 'silence_drop':
            continue
        if ext_mode and ctype not in EXT_SUB_ONLY:
            continue
        fn = FX.get(ctype)
        if not fn:
            print('Skipped unknown cue:', ctype)
            continue
        kwargs = {'d': float(c['dur'])} if c.get('dur') else {}
        sig = fn(**kwargs)
        gain_mul = (0.38 if ext_mode else 1.0) * float(c.get('gain', 1.0))
        sig = sig / (np.abs(sig).max() + 1e-9) * db(LEVEL.get(ctype, -14)) * gain_mul
        stereo_fx = mono_to_stereo(sig, float(c.get('pan', 0.0)))
        i = int(c['t'] * SR)
        m = min(len(stereo_fx), N - i)
        if m > 0 and i >= 0:
            mix[i : i + m] += stereo_fx[:m]
            fx_count += 1

    # 4. Warm master limiter -> peak -1.0 dBFS
    mix = np.tanh(mix * 1.18) / 1.18
    mix *= db(-1.0) / (np.abs(mix).max() + 1e-9)
    wavfile.write(DDIR / 'mix.wav', SR, (mix * 32767).astype(np.int16))
    print(f"Mastered {DDIR / 'mix.wav'} ({DUR:.2f}s stereo, {fx_count} active SFX cues + silence drops)")


if __name__ == '__main__':
    main()
