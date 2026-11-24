"""Roblox Story 3D soundtrack synthesizer: voice narration + punchy SFX cues + dynamic underscore bed."""
import json, sys
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile

P = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
SR = 48000
rng = np.random.default_rng(77)
cj = json.loads((P / 'data/cues.json').read_text())
script = json.loads((P / 'script.json').read_text())
DUR = float(cj['duration'])
N = int(DUR * SR) + SR // 10


def lp(x, f, o=2):
    b, a = signal.butter(o, min(f, SR / 2 - 100) / (SR / 2), 'low')
    return signal.lfilter(b, a, x)


def bp(x, f0, f1, o=2):
    b, a = signal.butter(o, [max(20, f0) / (SR / 2), min(SR / 2 - 100, f1) / (SR / 2)], 'band')
    return signal.lfilter(b, a, x)


def db(x): return 10 ** (x / 20)
def tt(d): return np.arange(int(d * SR)) / SR


def env(n, a=0.005, r=5.0):
    e = np.ones(n)
    na = max(1, min(n, int(a * SR)))
    e[:na] = np.linspace(0, 1, na)
    rest = n - na
    if rest > 0:
        e[na:] = np.exp(-np.linspace(0, r, rest))
    return e


def sweep(f0, f1, d, exp=True):
    t = tt(d)
    f = f0 * (f1 / f0) ** (t / max(d, 1e-4)) if exp else f0 + (f1 - f0) * t / max(d, 1e-4)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def noise(d): return rng.standard_normal(int(d * SR))


# ---------- Roblox SFX suite ----------
def whoosh(d=0.28, **_):
    n = noise(d)
    y = bp(n, 320, 2600) * np.sin(np.pi * np.linspace(0, 1, len(n))) ** 1.4
    return lp(y, 3200) * db(-14)


def pop(d=0.09, **_):
    y = sweep(340, 1080, d) * env(int(d * SR), 0.002, 7.0)
    return y * db(-12)


def glitch(d=0.45, **_):
    n = int(d * SR)
    t = tt(d)
    sq = np.sign(np.sin(2 * np.pi * (220 + 180 * np.sin(t * 48)) * t))
    return lp(sq * env(n, 0.005, 4.5), 2400) * db(-15)


def portal(d=0.95, **_):
    n = int(d * SR)
    t = tt(d)
    sub = sweep(65, 190, d) * 0.7
    shimmer = bp(noise(d), 500, 2400) * 0.35
    pulse = 0.5 + 0.5 * np.sin(2 * np.pi * 8 * t)
    return (sub + shimmer * pulse) * env(n, 0.08, 2.2) * db(-10)


def slam(d=0.55, **_):
    n = int(d * SR)
    sub = sweep(140, 38, d) * env(n, 0.002, 5.5)
    hit = lp(noise(d), 900) * env(n, 0.001, 14.0)
    return (sub * 0.85 + hit * 0.5) * db(-7)


def boing(d=0.42, **_):
    t = tt(d)
    f = 320 + 190 * np.sin(2 * np.pi * 14 * t) * np.exp(-t * 4)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.003, 5.5) * db(-10)


def ding(d=0.55, **_):
    t = tt(d)
    y = (np.sin(2 * np.pi * 1046.5 * t) * 0.65 + np.sin(2 * np.pi * 1568 * t) * 0.35) * env(len(t), 0.002, 6.0)
    return y * db(-12)


def cheer(d=0.85, **_):
    n = bp(noise(d), 450, 2600)
    t = tt(d)
    lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 6 * t)
    return lp(n * lfo * env(len(t), 0.12, 2.8), 3200) * db(-15)


SFX = dict(whoosh=whoosh, pop=pop, glitch=glitch, portal=portal, slam=slam, boing=boing, ding=ding, cheer=cheer)


def roblox_arcade_bed(n, t_boss=6.2, t_win=20.0):
    """Bouncy marimba-synth daytime groove -> dark tense boss bass -> cheerful victory resolve."""
    t = np.arange(n) / SR
    bar_t = t % 2.0
    chords = [(261.6, 329.6, 392.0), (220.0, 261.6, 329.6), (174.6, 220.0, 261.6), (196.0, 246.9, 293.7)]
    y = np.zeros(n)
    step = int(0.25 * SR)
    for idx, i0 in enumerate(range(0, n, step)):
        i1 = min(n, i0 + step)
        cur_t = i0 / SR
        ch = chords[(idx // 4) % len(chords)]
        note = ch[idx % 3] * (0.5 if t_boss <= cur_t < t_win else 1.0)
        seg_t = np.arange(i1 - i0) / SR
        e = env(i1 - i0, 0.008, 7.0)
        tone = np.sin(2 * np.pi * note * seg_t) * 0.7 + np.sin(2 * np.pi * note * 2 * seg_t) * 0.2
        y[i0:i1] += lp(tone * e, 1800) * 0.25
        # Soft kick pulse on beats
        if idx % 2 == 0:
            y[i0:i1] += sweep(95, 42, len(seg_t) / SR) * env(i1 - i0, 0.002, 11.0) * 0.45
    return lp(y, 2600) * db(-19)


# Build stereo master
mix_l = np.zeros(N, dtype=np.float64)
mix_r = np.zeros(N, dtype=np.float64)

voice_mask = np.ones(N)
vpath = P / 'data/narration.wav'
if vpath.exists():
    sr_v, vx = wavfile.read(vpath)
    if vx.ndim > 1:
        vx = vx.mean(axis=1)
    vx = vx.astype(np.float64) / 32768.0
    if sr_v != SR:
        vx = signal.resample_poly(vx, SR, sr_v)
    L = min(N, len(vx))
    mix_l[:L] += vx[:L]
    mix_r[:L] += vx[:L]
    hop = 480
    rms = np.sqrt(np.convolve(vx[:L] ** 2, np.ones(hop) / hop, mode='same'))
    duck = np.clip(1.0 - np.clip(rms / 0.05, 0, 1) * 0.55, 0.45, 1.0)
    voice_mask[:L] = lp(duck, 12)

bed = roblox_arcade_bed(N) if json.loads((P / 'script.json').read_text()).get('music', 'none') != 'none' else np.zeros(N)
mix_l += bed * voice_mask
mix_r += bed * voice_mask

for q in cj.get('cues', []):
    fn = SFX.get(q['type'])
    if not fn:
        continue
    i0 = int(q['t'] * SR)
    if i0 < 0 or i0 >= N:
        continue
    s = fn(**({'d': q.get('dur', q.get('d'))} if ('dur' in q or 'd' in q) else {})) * float(q.get('gain', 1.0))
    L = min(len(s), N - i0)
    pan = float(q.get('pan', 0.0))
    mix_l[i0:i0 + L] += s[:L] * (1.0 - max(0, pan) * 0.35)
    mix_r[i0:i0 + L] += s[:L] * (1.0 + min(0, pan) * 0.35)

fade_n = min(N, int(0.35 * SR))
mix_l[-fade_n:] *= np.linspace(1, 0, fade_n)
mix_r[-fade_n:] *= np.linspace(1, 0, fade_n)

stereo = np.stack([mix_l, mix_r], axis=1)
pk = np.abs(stereo).max()
if pk > 0.94:
    stereo = stereo / pk * 0.92
wavfile.write(P / 'data/mix.wav', SR, (np.clip(stereo, -1, 1) * 32767).astype(np.int16))
print(f"data/mix.wav ({DUR:.2f}s, {len(cj.get('cues', []))} SFX cues)")
