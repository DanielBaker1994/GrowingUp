#!/usr/bin/env python3
"""make_audio.py — mixes the film's soundtrack: the score (assets/audio/score.wav, built by make_score.py from
sampled piano, cello and violin) under synthesized sound design: snow crunch, paws on deck boards, a creaking ramp,
drips, mowers, birds, crickets, loons, collars, a paper tear.
Every event is placed from the composition's own frame numbers. Output: assets/audio/mix.wav (stereo, 44.1k)."""
import numpy as np, sys, os
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
from scipy.io import wavfile

SR = 44100
FPS = 30
DUR = 1700 / 30 + 0.5
N = int(SR * DUR)
rng = np.random.default_rng(20040330)
F2T = lambda f: f / FPS

def sos(kind, fc, order=2):
    return butter(order, fc, btype=kind, fs=SR, output='sos')
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, fc, o=2): return sosfilt(sos('low', fc, o), x)
def hp(x, fc, o=2): return sosfilt(sos('high', fc, o), x)
def noise(n): return rng.standard_normal(n)
def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t / d)
def fade(x, a=0.005, r=0.02):
    n = len(x); na = int(a * SR); nr = int(r * SR)
    if na: x[:na] *= np.linspace(0, 1, na)
    if nr and nr < n: x[-nr:] *= np.linspace(1, 0, nr)
    return x
def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

# --- buses (stereo) ---
MUS = np.zeros((2, N)); SFX = np.zeros((2, N)); BED = np.zeros((2, N))
def put(bus, sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0: return
    a = max(0, -i); b = min(len(sig), N - i)
    l = gain * np.cos((pan + 1) * np.pi / 4); r = gain * np.sin((pan + 1) * np.pi / 4)
    bus[0, i + a:i + b] += sig[a:b] * l; bus[1, i + a:i + b] += sig[a:b] * r
def putf(bus, sig, f, gain=1.0, pan=0.0): put(bus, sig, F2T(f), gain, pan)

# ---------------- SFX ----------------
def crunch(vel=0.5, size=1.0):
    n = int(0.16 * SR); t = np.arange(n) / SR
    body = bp(noise(n), 900, 3800) * np.exp(-t / 0.05)
    grit = hp(noise(n), 3500) * np.exp(-t / 0.02) * 0.5
    thump = np.sin(2 * np.pi * 70 * t) * np.exp(-t / 0.04) * 0.35 * size
    x = (body * (1 + 0.9 * (rng.random(n) > 0.9)) + grit + thump) * vel
    return fade(x, 0.001, 0.02)
def grass(vel=0.2):
    n = int(0.06 * SR); t = np.arange(n) / SR
    return bp(noise(n), 1500, 6000) * np.exp(-t / 0.018) * vel
def ice_crack(dur=1.4, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    sn = hp(noise(n), 2500) * np.exp(-t / 0.02) * 1.0
    boom = np.sin(2 * np.pi * (55 + 40 * np.exp(-t / 0.2)) * t) * np.exp(-t / 0.35) * 1.4
    sweep = np.sin(2 * np.pi * np.cumsum(1500 * np.exp(-t / 0.28) + 180) / SR) * np.exp(-t / 0.5) * 0.35
    ring = np.zeros(n)
    for f0, tt in ((2100, 0.6), (3100, 0.35), (4400, 0.2)):
        ring += np.sin(2 * np.pi * f0 * t * (1 - 0.15 * np.exp(-t / 0.3))) * np.exp(-t / tt) * 0.12
    return fade((sn + boom + sweep + ring) * vel, 0.001, 0.1)
def crack_snap(vel=0.6):
    n = int(0.25 * SR); t = np.arange(n) / SR
    return (hp(noise(n), 3000) * np.exp(-t / 0.012) + bp(noise(n), 800, 2500) * np.exp(-t / 0.05) * 0.4) * vel
def ice_creak(dur=1.2, vel=0.4, f0=400):
    n = int(dur * SR); t = np.arange(n) / SR
    fr = f0 * (1 + 0.7 * np.sin(2 * np.pi * 0.9 * t) * np.exp(-t / dur) + 0.5 * np.exp(-t / 0.4))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = np.sin(ph) * (0.6 + 0.4 * np.sin(2 * np.pi * 38 * t)) + 0.5 * np.sin(ph * 2.02)
    return fade(x * np.sin(np.pi * t / dur) ** 1.5 * vel, 0.02, 0.1)
def wind(dur, vel=0.3, seed=1):
    r = np.random.default_rng(seed); n = int(dur * SR); x = r.standard_normal(n)
    x = lp(x, 500); t = np.arange(n) / SR
    g = 0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t + seed) * np.sin(2 * np.pi * 0.047 * t + 2 * seed)
    return bp(x, 120, 900) * (0.4 + 0.9 * g) * vel
def bird(f0=3600, dur=0.35, vel=0.2):
    n = int(dur * SR); t = np.arange(n) / SR
    fr = f0 * (1 + 0.25 * np.sin(2 * np.pi * 9 * t) + 0.4 * np.sin(np.pi * t / dur))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    return np.sin(ph) * np.sin(np.pi * t / dur) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 22 * t)) * vel
def wood_creak(dur=1.0, vel=0.4):
    n = int(dur * SR); t = np.arange(n) / SR
    fr = 160 + 40 * np.sin(2 * np.pi * 3.1 * t) + 80 * t / dur
    ph = 2 * np.pi * np.cumsum(fr) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
    x = bp(saw + 0.4 * noise(n), 250, 1500) * (0.5 + 0.5 * np.sin(2 * np.pi * 11 * t)) 
    return fade(x * np.sin(np.pi * t / dur) ** 1.2 * vel, 0.03, 0.1)
def scrape(dur=1.0, vel=0.3):
    n = int(dur * SR); t = np.arange(n) / SR
    x = bp(noise(n), 200, 2200) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 3.6 * t)))
    return fade(x * vel, 0.06, 0.2)
def plink(f0=2200, vel=0.25):
    n = int(0.3 * SR); t = np.arange(n) / SR
    fr = f0 * (1 + 0.5 * np.exp(-t / 0.03)); ph = 2 * np.pi * np.cumsum(fr) / SR
    return np.sin(ph) * np.exp(-t / 0.07) * vel
def clunk(vel=0.6, f0=110):
    n = int(0.45 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f0 * (1 + 0.5 * np.exp(-t / 0.03)) * t) * np.exp(-t / 0.13) + bp(noise(n), 400, 2500) * np.exp(-t / 0.03) * 0.6
    return fade(x * vel, 0.001, 0.05)
def clink(vel=0.3, f0=3300):
    n = int(0.6 * SR); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t / d) for r, a, d in ((1, 1, 0.16), (2.4, 0.5, 0.09), (3.9, 0.3, 0.05)))
    return x * vel
def jingle(vel=0.2):
    n = int(0.5 * SR); out = np.zeros(n)
    for k in range(4):
        c = clink(vel * (0.5 + 0.5 * rng.random()), 2800 + 900 * rng.random())[:n]
        s = int(k * 0.03 * SR * (0.5 + rng.random())); out[s:] += c[:n - s]
    return out
def brush(vel=0.2):
    n = int(0.14 * SR)
    return fade(bp(noise(n), 900, 6000) * env_ad(n, 0.02, 0.05) * vel, 0.004, 0.03)
def tear(dur=0.8, vel=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    x = hp(noise(n), 1200) * (0.35 + 0.65 * (rng.random(n) > 0.5)) * (np.sin(np.pi * t / dur) ** 0.6)
    x = bp(x, 1500 + 3000 * 0, 9000)
    return fade(x * vel, 0.01, 0.1)
def swell(dur, vel=0.5, up=True):
    n = int(dur * SR); t = np.arange(n) / SR
    x = hp(noise(n), 900) * (t / dur) ** 2.2 if up else hp(noise(n), 900) * (1 - t / dur) ** 2
    return lp(x, 9000) * vel
def sub_hit(vel=0.7):
    n = int(1.6 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 42 * (1 + 0.6 * np.exp(-t / 0.1)) * t) * np.exp(-t / 0.5) * vel
def engine(dur, f0=62, vel=0.3, wob=0.5, seed=1):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    fr = f0 * (1 + 0.012 * np.sin(2 * np.pi * 5.3 * t) + 0.02 * np.sin(2 * np.pi * 0.7 * t))
    ph = np.cumsum(fr) / SR
    saw = 2 * (ph % 1) - 1; pul = (np.sin(2 * np.pi * ph * 2) > 0.2).astype(float) * 2 - 1
    x = lp(saw * 0.7 + pul * 0.4 + 0.25 * r.standard_normal(n), 900) * (0.75 + 0.25 * np.sin(2 * np.pi * (f0 / 2) * t))
    return x * vel
def crickets(dur, vel=0.06, seed=3):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for f0, rate in ((4300, 13), (4900, 17), (5600, 11)):
        chirp = (np.sin(2 * np.pi * rate * t + r.random() * 6) > 0.5) * (np.sin(2 * np.pi * 0.7 * t + r.random() * 6) > -0.3)
        x += np.sin(2 * np.pi * f0 * t) * chirp
    return x * vel
def cicada(dur, vel=0.05):
    n = int(dur * SR); t = np.arange(n) / SR
    x = bp(noise(n), 4200, 7200) * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * t)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.2 * t)) 
    return x * vel
def water_lap(dur, vel=0.12, seed=5):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    x = bp(r.standard_normal(n), 300, 2400)
    g = np.abs(np.sin(2 * np.pi * 0.37 * t + seed)) ** 3
    return x * g * vel
def breath(dur=1.4, vel=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(noise(n), 500, 3000) * np.sin(np.pi * t / dur) ** 2 * vel
def leaf_rustle(dur, vel=0.05, seed=9):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    return hp(r.standard_normal(n), 2500) * (r.random(n) > 0.7) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.4 * t)) * vel

# ================= SCORE =================
_, sc = wavfile.read(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'audio', 'score.wav'))
sc = sc.T.astype(np.float64)
MUS[:, :min(N, sc.shape[1])] = sc[:, :N]
def reverb(bus, wet=0.26, rt=2.8):
    n = int(rt * SR); t = np.arange(n) / SR; out = np.zeros_like(bus)
    for c in range(2):
        r = np.random.default_rng(90 + c)
        ir = lp(r.standard_normal(n), 6000) * np.exp(-t / (rt / 6.9)); ir /= np.sqrt(np.sum(ir ** 2))
        out[c] = fftconvolve(bus[c], ir)[:bus.shape[1]]
    return bus * (1 - wet * 0.5) + out * wet

# ================= SOUND DESIGN =================
# ---- S1 ---- (0..300): the crossing, one unbroken walk (T = 0.86 f)
put(BED, wind(10.5, 0.5, 1), 0, 0.85, -0.2)
put(BED, wind(10.5, 0.45, 2), 0, 0.65, 0.3)
for k0, pan, vol in ((0.0, -0.1, 0.4), (0.9, -0.55, 0.28), (2.1, -0.4, 0.2), (0.4, 0.15, 0.22)):
    # a foot lands when |sin(2π T/30 + k0)| == 1
    for kk in range(-2, 40):
        Tt = (np.pi / 2 + kk * np.pi - k0) * 30 / (2 * np.pi)
        f_ = Tt / 0.86
        if 0 <= f_ < 296: putf(SFX, crunch(vol * (0.85 + 0.3 * rng.random()), 1.0), f_ - 0.5, 1.0, pan)
for f_ in range(6, 296, 5): putf(SFX, grass(0.15), f_, 1.0, 0.35 + 0.1 * rng.random())  # the dog's pitter on crust
putf(SFX, swell(2.3, 0.18), 178, 1.0)  # the cottage windows come on
putf(SFX, swell(0.5, 0.3), 290, 1.0)
# ---- S2 ---- (300..500): the two dogs chasing round the deck
put(BED, water_lap(7, 0.08, 4), F2T(300), 1.0, 0.3); put(BED, leaf_rustle(7, 0.06, 2), F2T(300), 1.0, -0.3)
for f_, fq, p in ((318, 3600, -0.5), (344, 4200, 0.6), (380, 3300, -0.7), (418, 4000, 0.4), (455, 3500, -0.3), (482, 4400, 0.7)): putf(SFX, bird(fq, 0.32, 0.14), f_, 1.0, p)
def paw(vel=0.2, bright=1.0):
    n = int(0.06 * SR); t = np.arange(n) / SR
    thud = np.sin(2 * np.pi * (170 + 60 * rng.random()) * t) * np.exp(-t / 0.018)
    tick = bp(noise(n), 1800 * bright, 5200 * bright) * np.exp(-t / 0.006)
    return fade((thud * 0.7 + tick * 0.5) * vel, 0.001, 0.01)
D2R = np.pi / 180; CS, SN = np.cos(-20 * D2R), np.sin(-20 * D2R)
def deck_dog(lag, wob, gpk, gain, bright, tag):
    for f10 in range(0, 2000):
        f = f10 / 10
        gp0, gp1 = f * gpk + lag, (f + 0.1) * gpk + lag
        for off in (0.0, 0.35, 2.3, 2.65):  # the gallop's four footfalls per stride
            a0, a1 = (gp0 + off) % (2 * np.pi), (gp1 + off) % (2 * np.pi)
            if not (a0 < np.pi / 2 <= a1): continue
            th = np.pi * 1.02 + ((f - lag * 14) / 200) * 2.5 * np.pi + 0.12 * np.sin(f * 0.05 + lag)
            u = -0.4 + 1.4 * np.sin(th) + wob * np.sin(f * 0.09 + lag * 3); v = 2.8 - 1.0 * np.cos(th)
            X, Z = u * CS - v * SN, u * SN + v * CS + 1.0
            putf(SFX, paw(gain * np.clip(2.6 / Z, 0.5, 1.2) * (0.8 + 0.4 * rng.random()), bright), 300 + f, 1.0, float(np.clip(X / Z, -0.8, 0.8)))
    if tag:
        for f_ in np.arange(304, 496, 9.5): putf(SFX, jingle(0.07), f_ + rng.random() * 2, 1.0, 0.1)
deck_dog(0.0, 0.12, 0.72, 0.16, 1.1, False)
deck_dog(1.9, -0.16, 0.66, 0.14, 0.9, True)
# ---- S3 ---- (500..700): standing the ramp up for winter
putf(SFX, tear(0.75, 0.45), 499, 1.0, 0.0)
put(BED, water_lap(7, 0.14, 8), F2T(500), 1.0, 0.0); put(BED, leaf_rustle(7, 0.07, 3), F2T(500), 1.0, 0.4)
putf(SFX, clunk(0.3, 120), 528, 1.0, -0.3)            # hands on the lake end
putf(SFX, breath(1.0, 0.14), 530, 1.0, -0.2)          # the heave
putf(SFX, wood_creak(1.9, 0.42), 536, 1.0, -0.2)      # the hinge takes the weight
putf(SFX, wood_creak(1.4, 0.3), 596, 1.0, -0.35)      # the boy takes over
putf(SFX, wood_creak(1.2, 0.26), 632, 1.0, -0.35)
putf(SFX, clunk(0.55, 85), 676, 1.0, -0.3); putf(SFX, wood_creak(0.7, 0.22), 677, 1.0, -0.3)  # it stands
for f_ in range(540, 688, 4):                          # drips off the underside into the lake
    if rng.random() < 0.75: putf(SFX, plink(1700 + 1600 * rng.random(), 0.1 + 0.1 * rng.random() * (1 - abs(f_ - 610) / 90)), f_ + rng.integers(0, 3), 1.0, -0.5 + 0.4 * rng.random())
putf(SFX, scrape(0.6, 0.12), 680, 1.0, -0.5)          # the rope pulled through
for f_ in np.arange(552, 640, 11): putf(SFX, jingle(0.05), f_, 1.0, -0.6)  # the schnauzer trots along the cap
putf(SFX, swell(0.6, 0.3), 692, 1.0)
# ---- S4 ---- (700..900)
put(BED, cicada(8.2, 0.07), F2T(700), 1.0, 0.0); put(BED, wind(7, 0.18, 5), F2T(700), 1.0, 0.2)
# riding mower: enters from the left and travels right; push mower: right to left
put(BED, engine(6.9, 58, 0.34, 1, 1), F2T(700), 1.0, -0.15)
put(BED, engine(6.9, 96, 0.18, 1, 2), F2T(700), 1.0, 0.2)
for f_, fq, p in ((712, 3700, -0.6), (770, 4300, 0.5), (830, 3400, 0.0), (876, 4000, 0.6)): putf(SFX, bird(fq, 0.3, 0.14), f_, 1.0, p)
for f_ in range(704, 896, 6): putf(SFX, grass(0.17), f_, 1.0, -0.5 + 1.0 * rng.random())
putf(SFX, swell(0.5, 0.2, False), 700, 1.0)
# ---- S5 ---- (900..1000): hush, then the plank
put(BED, wind(3.4, 0.18, 6), F2T(900), 1.0, 0.0); put(BED, leaf_rustle(3.4, 0.05, 4), F2T(900), 1.0, 0.3)
putf(SFX, clunk(0.75, 95), 922, 1.0, -0.5)
for k, (f_, v) in enumerate(((922, 0.30), (925, 0.24), (928, 0.2), (933, 0.16), (938, 0.12), (944, 0.09), (951, 0.06))): putf(SFX, clink(v, 2600 + 400 * (k % 3)), f_, 1.0, -0.5 + 0.1 * k)
putf(SFX, swell(0.5, 0.25), 990, 1.0)
# ---- S7 ---- (1000..1200): zoomies in the great room, then the sofa
put(BED, wind(7, 0.05, 12), F2T(1000), 1.0, 0.1)
for f_, fq, p in ((1014, 3700, 0.6), (1062, 4200, 0.7), (1118, 3500, 0.5)): putf(SFX, bird(fq, 0.3, 0.07), f_, 1.0, p)
r2 = np.random.default_rng(4)
for f_ in np.arange(1002, 1124, 3.2): putf(SFX, clink(0.05 + 0.04 * r2.random(), 4200 + 1400 * r2.random()), f_ + r2.random(), 1.0, -0.6 + 1.2 * r2.random())  # nails on pine
for f_ in np.arange(1004, 1124, 7.5): putf(SFX, jingle(0.1), f_ + r2.integers(0, 3), 1.0, -0.5 + 1.0 * r2.random())
for f_ in (1136, 1150): putf(SFX, clunk(0.3, 70), f_, 1.0, 0.3); putf(SFX, brush(0.2), f_, 1.0, 0.3); putf(SFX, jingle(0.12), f_ + 1, 1.0, 0.3)
putf(SFX, breath(1.8, 0.18), 1172, 1.0, 0.2)
putf(SFX, swell(0.6, 0.3), 1190, 1.0)
# ---- S8 ---- (1200..1700): the deck at dusk, then the dogs at the window
def loon(dur=2.4, vel=0.1):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 760 + 360 * np.sin(np.pi * np.clip(t / (dur * 0.55), 0, 1)) ** 0.7 - 120 * np.clip((t - dur * 0.6) / (dur * 0.4), 0, 1) + 9 * np.sin(2 * np.pi * 5.5 * t) * np.clip(t / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    return x * np.clip(t / 0.25, 0, 1) * np.clip((dur - t) / 0.6, 0, 1) * vel
put(BED, water_lap(17, 0.1, 11), F2T(1200), 1.0, 0.0); put(BED, crickets(17, 0.055, 7), F2T(1200), 1.0, 0.1); put(BED, wind(17, 0.07, 14), F2T(1200), 1.0, -0.2)
putf(SFX, loon(2.6, 0.08), 1236, 1.0, -0.45); putf(SFX, loon(2.2, 0.05), 1302, 1.0, 0.5)
putf(SFX, swell(1.4, 0.16), 1366, 1.0)
for k, f_ in enumerate((1422, 1440, 1460)):  # paws on the sill, one dog after another
    for j in range(3): putf(SFX, clink(0.07, 3600 + 500 * j), f_ + 3 + j * 1.5, 1.0, (-0.4, 0.0, 0.4)[k])
    putf(SFX, jingle(0.07), f_ + 5, 1.0, (-0.4, 0.0, 0.4)[k])
putf(SFX, loon(2.8, 0.04), 1530, 1.0, 0.3)
putf(SFX, breath(1.4, 0.12), 1566, 1.0, 0.4)
# ---------- mix ----------
SFXr = reverb(SFX, 0.14, 1.6)
mix = MUS * 0.8 + SFXr * 1.0 + BED * 1.0
# fades
tf = np.arange(N) / SR * FPS
g = np.interp(tf, [0, 10, 1664, 1699, 1716], [0, 1, 1, 0.0, 0.0])
mix *= g
# soft-limit
pk = np.max(np.abs(mix)); mix = np.tanh(mix / (pk * 0.9)) * 0.9 if pk > 0 else mix
mix = hp(mix.T, 28).T
os.makedirs('assets/audio', exist_ok=True)
wavfile.write('assets/audio/mix.wav', SR, (np.clip(mix.T, -1, 1) * 32767).astype(np.int16))
print('wrote assets/audio/mix.wav', mix.shape, 'peak', np.max(np.abs(mix)))
