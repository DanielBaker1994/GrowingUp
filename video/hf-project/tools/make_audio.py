#!/usr/bin/env python3
"""make_audio.py — synthesizes the score and the sound design for the film (no samples, no network).
Music: felt piano, nylon-ish plucks, pad, soft kick/shaker, D major at 72 BPM (25 frames/beat, 100 frames/bar at 30 fps).
Sound design: crunch, ice crack/creak, wood, water, mowers, birds, crickets, collars, paper tear.
Every event is placed from the composition's own frame numbers. Output: assets/audio/mix.wav (stereo, 44.1k)."""
import numpy as np, sys, os
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
from scipy.io import wavfile

SR = 44100
FPS = 30
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(20040330)
F2T = lambda f: f / FPS
BEAT = 25 / FPS  # 72 bpm

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

# ---------------- instruments ----------------
def piano(m, dur, vel=0.7):
    f = midi(m); n = int((dur + 2.2) * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    for k in range(1, 9):
        fk = k * f * np.sqrt(1 + 0.0004 * k * k)
        if fk > 9000: break
        amp = vel / (k ** 1.25) * (1.0 if k < 4 else 0.7)
        tau = (2.6 if m < 60 else 1.6) / (1 + 0.55 * k)
        for det in (-0.35, 0.35):
            out += amp * 0.5 * np.sin(2 * np.pi * fk * (1 + det * 1e-3) * t + 0.3 * k) * np.exp(-t / tau)
    # hammer / felt
    h = lp(noise(int(0.03 * SR)), 1800) * np.exp(-np.arange(int(0.03 * SR)) / SR / 0.006) * vel * 0.25
    out[:len(h)] += h
    out *= np.minimum(t / 0.004, 1)
    # release
    rel = int(0.35 * SR); e = np.ones(n); s = int(dur * SR)
    if s + rel < n: e[s:s + rel] = np.linspace(1, 0, rel); e[s + rel:] = 0
    return lp(out * e, 5200 if m > 60 else 3200)
def pluck(m, dur=1.4, vel=0.6):
    f = midi(m); n = int((dur + 0.3) * SR); L = int(SR / f)
    buf = rng.uniform(-1, 1, L) * vel; buf = lp(buf, 3000, 1)
    out = np.zeros(n); idx = 0
    for i in range(n):
        j = idx % L; nxt = (idx + 1) % L
        out[i] = buf[j]; buf[j] = 0.4975 * (buf[j] + buf[nxt]); idx += 1
    return fade(out * 0.9, 0.001, 0.2)
def pad(m, dur, vel=0.4):
    n = int(dur * SR + 2 * SR); t = np.arange(n) / SR; f = midi(m); out = np.zeros(n)
    for det in (-6, -2, 2, 6):
        ff = f * 2 ** (det / 1200)
        for k in (1, 2, 3, 4, 5):
            out += (1 / k ** 1.6) * np.sin(2 * np.pi * ff * k * t + det + k) * (1 + 0.15 * np.sin(2 * np.pi * (0.13 + det * 0.01) * t))
    e = np.minimum(t / 1.4, 1); s = int(dur * SR); rel = int(1.8 * SR)
    e[s:s + rel] *= np.linspace(1, 0, rel) if s + rel <= n else 1
    if s + rel <= n: e[s + rel:] = 0
    return lp(out * e * vel * 0.25, 1600 + 900 * 0.5)
def kick(vel=0.5):
    n = int(0.5 * SR); t = np.arange(n) / SR
    fr = 48 + 70 * np.exp(-t / 0.035); ph = 2 * np.pi * np.cumsum(fr) / SR
    return np.sin(ph) * np.exp(-t / 0.16) * vel
def shaker(vel=0.3, ln=0.09):
    n = int(ln * SR); t = np.arange(n) / SR
    return hp(bp(noise(n), 4500, 9500), 3500) * np.exp(-t / 0.028) * vel * np.minimum(t / 0.004, 1)
def brush(vel=0.2):
    n = int(0.22 * SR); t = np.arange(n) / SR
    return bp(noise(n), 2500, 7500) * (np.minimum(t / 0.06, 1) * np.exp(-t / 0.07)) * vel

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
BARF = lambda b: b * 100  # bar start frame
CH = {  # bar index (0-based) -> (root midi for bass, chord tones for arps)
    0: (38, [50, 57, 62, 66]), 1: (33, [45, 52, 57, 61]), 2: (35, [47, 54, 59, 62]), 3: (31, [43, 50, 55, 59]),
    4: (38, [50, 57, 62, 66]), 5: (33, [45, 52, 57, 61]), 6: (35, [47, 54, 59, 62]), 7: (31, [43, 50, 55, 59]),
    8: (38, [50, 57, 62, 66]), 9: (36, [48, 55, 60, 64]), 10: (31, [43, 50, 55, 59]), 11: (38, [45, 50, 54, 62]),
    12: (38, [50, 57, 62, 66]), 13: (33, [45, 52, 57, 61]), 14: (35, [47, 54, 59, 62]), 15: (31, [43, 50, 55, 59]), 16: (38, [50, 57, 62, 66]),
}
def bar_t(b, beat=0): return (b * 100 + (50 if b >= 14 else 0)) / FPS + beat * BEAT  # 2-beat breath before bar 14 (the 2025 deck)
# pads (long)
for b, m, ln in ((0, 38, 2.4), (1, 45, 2), (2, 47, 1), (3, 43, 2)):
    pass
put(MUS, pad(38, 12, 0.9), bar_t(1) - 0.5, 0.55, -0.1); put(MUS, pad(45, 12, 0.8), bar_t(1) - 0.5, 0.45, 0.15)
for b0 in (3, 7, 10, 11):
    for b in range(b0, b0 + 1):
        r, ch = CH[b]; put(MUS, pad(ch[0] - 12 + 12, 3.6, 0.8), bar_t(b) - 0.2, 0.42, 0.0); put(MUS, pad(ch[2], 3.6, 0.6), bar_t(b) - 0.2, 0.3, -0.3)
for b in (4, 5, 6, 7, 8, 12, 13, 14, 15, 16):
    r, ch = CH[b]; put(MUS, pad(ch[0], 3.6, 0.8), bar_t(b) - 0.2, 0.36, -0.15); put(MUS, pad(ch[2] + 12, 3.6, 0.5), bar_t(b) - 0.2, 0.22, 0.25)
# bass + LH
for b in list(range(3, 9)) + list(range(10, 17)):
    r, ch = CH[b]; put(MUS, piano(r, 1.6, 0.75), bar_t(b), 0.55, -0.2)
    if b in (4, 5, 6, 7, 8, 12, 13, 14, 15): put(MUS, piano(r + 12 if b % 2 else r, 1.0, 0.5), bar_t(b, 2), 0.35, -0.2)
# opening piano: sparse notes b0..b2
for f, m, v, g in ((6, 50, 0.6, 0.6), (56, 57, 0.5, 0.5), (110, 62, 0.5, 0.5), (168, 66, 0.55, 0.5), (214, 57, 0.5, 0.45), (238, 61, 0.55, 0.5), (262, 64, 0.6, 0.55), (282, 69, 0.6, 0.55)):
    put(MUS, piano(m, 2.6, v), F2T(f), g, 0.1)
# b3-b8, b12-b16: 8th arpeggios (RH)
def arp(b, vel=0.42, gain=0.42, oct_=0, dens=8):
    r, ch = CH[b]; pat = [0, 1, 2, 3, 2, 1, 2, 3] if dens == 8 else [0, 2, 3, 2]
    step = BEAT * 4 / dens
    for i in range(dens):
        m = ch[pat[i]] + 12 + oct_
        put(MUS, piano(m, 0.5, vel * (0.85 + 0.15 * (i % 2 == 0))), bar_t(b) + i * step, gain, -0.25 + 0.05 * (i % 4))
for b in (3, 4, 5, 6, 7, 8): arp(b, 0.34, 0.36)
for b in (10, 11): arp(b, 0.3, 0.32, -12, 4)
for b in (12, 13, 14, 15): arp(b, 0.36, 0.4, 0, 8)
# melody (plucks + soft piano doubling)
MEL = {
    3: [(0, 71, 1), (1, 74, 1), (2, 79, 1.5), (3.5, 78, 0.5)],
    4: [(0, 81, 1.5), (1.5, 78, 0.5), (2, 76, 1), (3, 78, 1)],
    5: [(0, 76, 1), (1, 81, 1), (2, 83, 1.5), (3.5, 81, 0.5)],
    6: [(0, 78, 2), (2, 76, 1), (3, 74, 1)],
    7: [(0, 74, 1), (1, 79, 1), (2, 78, 1), (3, 76, 1)],
    8: [(0, 78, 3), (3, 74, 1)],
    10: [(0, 67, 2), (2, 66, 1), (3, 62, 1)],
    11: [(0, 74, 2), (2, 71, 1), (3, 69, 1)],
    12: [(0, 74, 2), (2, 78, 1), (3, 76, 1)],
    13: [(0, 81, 1.5), (1.5, 78, 0.5), (2, 76, 1), (3, 78, 1)],
    14: [(0, 83, 1), (1, 81, 1), (2, 78, 1.5), (3.5, 76, 0.5)],
    15: [(0, 79, 1), (1, 78, 1), (2, 76, 1), (3, 74, 1)],
    16: [(0, 78, 4)],
}
for b, notes in MEL.items():
    for bt, m, d in notes:
        if b in (3, 4, 5, 6, 7, 8, 12, 13, 14, 15):
            put(MUS, pluck(m - 12 if m > 80 else m - 0, d * BEAT + 0.6, 0.55), bar_t(b, bt), 0.45, 0.25)
        put(MUS, piano(m, d * BEAT, 0.5 if b in (10, 11) else 0.42), bar_t(b, bt), 0.4 if b >= 10 else 0.3, 0.2)
# S5: one lonely note, then a held low chord
put(MUS, piano(57, 3.0, 0.6), bar_t(9, 0.5), 0.6, 0.0); put(MUS, piano(69, 3.0, 0.4), bar_t(9, 1.0), 0.4, 0.0)
# final chord
for m, v in ((38, 0.7), (50, 0.6), (57, 0.5), (62, 0.5), (66, 0.5), (74, 0.5), (78, 0.4)):
    put(MUS, piano(m, 4.2, v), bar_t(16) + 0.02 * (m % 5), 0.5, (m % 7 - 3) / 8)
put(MUS, pad(50, 6, 1.0), bar_t(16) - 0.2, 0.5); put(MUS, pad(57, 6, 0.8), bar_t(16) - 0.2, 0.4); put(MUS, pad(66, 6, 0.6), bar_t(16) - 0.2, 0.3)
# percussion: b4..b8 shaker 8ths + soft kick; b12..b15 fuller
for b in (4, 5, 6, 7, 8, 12, 13, 14, 15):
    for i in range(8):
        put(MUS, shaker(0.26 if i % 2 == 0 else 0.15), bar_t(b) + i * BEAT / 2, 0.5, 0.35 if i % 2 else -0.35)
    if b != 14: put(MUS, kick(0.5), bar_t(b), 0.5); put(MUS, kick(0.42), bar_t(b, 2.0), 0.45)
    if b >= 12: put(MUS, brush(0.25), bar_t(b, 1), 0.5); put(MUS, brush(0.25), bar_t(b, 3), 0.5)
# reverb on the music bus
def reverb(bus, wet=0.26, rt=2.8):
    n = int(rt * SR); t = np.arange(n) / SR
    out = np.zeros_like(bus)
    for ch in range(2):
        r = np.random.default_rng(100 + ch)
        ir = hp(lp(r.standard_normal(n), 6500), 220) * np.exp(-t / (rt / 6.9)) ; ir[:int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
        out[ch] = fftconvolve(bus[ch], ir)[:N] * (1.0 / np.sqrt(n / SR)) * 0.09
    return bus * (1 - wet * 0.4) + out * wet * 4
# bar-level gain automation on the music bus
def automate(bus, pts):
    t = np.arange(N) / FPS / SR * SR / SR  # placeholder overwritten below
    tf = np.arange(N) / SR * FPS
    g = np.interp(tf, [p[0] for p in pts], [p[1] for p in pts])
    return bus * g
# the 2-beat breath into 2025: a held pad and two soft notes
put(MUS, pad(50, 3.2, 0.7), F2T(1398), 0.4, -0.1); put(MUS, piano(62, 2.4, 0.42), F2T(1404), 0.42, 0.1); put(MUS, piano(69, 2.0, 0.36), F2T(1428), 0.36, 0.2)
MUS = automate(MUS, [(0, 0.5), (300, 0.7), (500, 0.85), (890, 1.0), (899, 0.55), (960, 0.5), (1000, 0.7), (1200, 0.95), (1390, 0.95), (1420, 0.75), (1540, 0.85), (1560, 1.0), (1650, 1.0), (1760, 0.85), (1790, 0.7)])

# ================= SOUND DESIGN =================
# ---- S1 ----
put(BED, wind(11, 0.55, 1), 0, 0.9, -0.2)
put(BED, wind(11, 0.5, 2), 0, 0.7, 0.3)
def T1(f):  # time warp used by scene 1 (frames -> walk clock)
    ks = [(0, 0), (118, 118), (138, 126), (158, 127), (188, 146), (300, 258)]
    xs = [k[0] for k in ks]; ys = [k[1] for k in ks]
    fs = np.arange(0, 300.01, 0.05)
    out = np.zeros_like(fs)
    for i, f_ in enumerate(fs):
        for j in range(1, len(ks)):
            if f_ <= xs[j]:
                a, b = xs[j - 1], xs[j]; u = (f_ - a) / (b - a); e = -(np.cos(np.pi * u) - 1) / 2
                out[i] = ys[j - 1] + (ys[j] - ys[j - 1]) * e; break
    return fs, out
fs_, ts_ = T1(0)
for k0, pan, vol in ((0.0, -0.1, 0.42), (0.9, -0.55, 0.3), (2.1, -0.4, 0.2), (0.4, 0.15, 0.24)):
    # contact when |sin(2π T/30 + k0)| == 1  -> phase = π/2 + kπ
    for kk in range(-2, 40):
        ph = np.pi / 2 + kk * np.pi - k0
        Tt = ph * 30 / (2 * np.pi)
        if Tt < 0 or Tt > 258: continue
        idx = np.argmin(np.abs(ts_ - Tt)); f_ = fs_[idx]
        if 112 < f_ < 176 and (np.interp(f_, [116, 128, 160, 176], [1, 0.1, 0.1, 1]) < 0.3): continue
        putf(SFX, crunch(vol * (0.85 + 0.3 * rng.random()), 1.0), f_ - 0.5, 1.0, pan)
# dog pitter
for f_ in range(6, 112, 5): putf(SFX, grass(0.18), f_, 1.0, 0.35 + 0.1 * rng.random())
for f_ in range(178, 296, 5): putf(SFX, grass(0.16), f_, 1.0, 0.4 * rng.random())
# ice: the boom + fine cracks + creak + ring
putf(SFX, ice_crack(1.8, 1.0), 118, 1.0, 0.1)
for f_, p in ((121, -0.5), (123, 0.4), (126, 0.7), (128, -0.2), (122, 0.0)): putf(SFX, crack_snap(0.55), f_, 1.0, p)
putf(SFX, ice_creak(1.4, 0.35, 380), 133, 1.0, -0.2); putf(SFX, ice_creak(1.1, 0.3, 520), 152, 1.0, 0.3)
putf(SFX, sub_hit(0.65), 118, 1.0)
# cottage: warm swell
putf(SFX, swell(2.3, 0.22), 178, 1.0)
putf(SFX, swell(0.5, 0.5), 288, 1.0); putf(SFX, sub_hit(0.6), 299, 1.0)
# ---- S2 ---- (300..500)
put(BED, water_lap(7, 0.10, 4), F2T(300), 1.0, 0.2); put(BED, leaf_rustle(7, 0.05, 2), F2T(300), 1.0, -0.3)
for f_, fq, p in ((322, 3600, -0.5), (338, 4200, 0.6), (372, 3300, -0.7), (412, 4000, 0.4), (452, 3500, -0.3), (478, 4400, 0.7)): putf(SFX, bird(fq, 0.32, 0.16), f_, 1.0, p)
for f_ in range(302, 470, 5): putf(SFX, grass(0.2 + 0.08 * rng.random()), f_, 1.0, -0.3 + 0.6 * rng.random())
for f_ in (452, 470): putf(SFX, breath(1.0, 0.16), f_, 1.0, 0.0)
# ---- S3 ---- (500..700)
putf(SFX, tear(0.75, 0.55), 499, 1.0, 0.0); putf(SFX, swell(0.6, 0.25), 490, 1.0)
put(BED, water_lap(7, 0.14, 8), F2T(500), 1.0, 0.0); put(BED, leaf_rustle(7, 0.07, 3), F2T(500), 1.0, 0.4)
putf(SFX, wood_creak(1.7, 0.42), 522, 1.0, -0.2); putf(SFX, clunk(0.5, 90), 526, 1.0, -0.2); putf(SFX, wood_creak(1.0, 0.3), 560, 1.0, 0.1)
putf(SFX, scrape(3.2, 0.34), 578, 1.0, -0.1)
for f_ in (585, 597, 611, 623, 636, 648, 662): putf(SFX, clunk(0.28, 130 + 20 * rng.random()), f_, 1.0, -0.2 + 0.3 * rng.random())
for f_ in range(528, 660, 7): putf(SFX, plink(1800 + 1500 * rng.random(), 0.16 + 0.1 * rng.random()), f_ + rng.integers(0, 4), 1.0, -0.2 + 0.7 * rng.random())
putf(SFX, clink(0.2, 3000), 606, 1.0, 0.5); putf(SFX, clink(0.16, 2700), 646, 1.0, 0.6)
putf(SFX, clunk(0.6, 80), 676, 1.0, -0.1); putf(SFX, wood_creak(0.8, 0.28), 672, 1.0, 0.0)
putf(SFX, swell(0.6, 0.45), 692, 1.0)
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
# ---- S6 ---- (1000..1200)
put(BED, crickets(6.9, 0.075, 3), F2T(1000), 1.0, 0.0); put(BED, wind(6.9, 0.14, 8), F2T(1000), 1.0, -0.2); put(BED, water_lap(6.9, 0.08, 6), F2T(1000), 1.0, 0.3)
putf(SFX, jingle(0.14), 1094, 1.0, -0.3); putf(SFX, jingle(0.12), 1118, 1.0, 0.2)
putf(SFX, breath(1.6, 0.16), 1088, 1.0, -0.3); putf(SFX, breath(1.7, 0.14), 1160, 1.0, -0.3)
for f_ in range(1052, 1145, 5): putf(SFX, grass(0.16), f_, 1.0, -0.4 + 0.8 * rng.random())
putf(SFX, swell(0.7, 0.4), 1190, 1.0)
# ---- S7 ---- (1200..1400): zoomies in the great room, then the sofa
put(BED, wind(7, 0.05, 12), F2T(1200), 1.0, 0.1)
for f_, fq, p in ((1214, 3700, 0.6), (1262, 4200, 0.7), (1318, 3500, 0.5)): putf(SFX, bird(fq, 0.3, 0.07), f_, 1.0, p)
r2 = np.random.default_rng(4)
for f_ in np.arange(1202, 1336, 3.2): putf(SFX, clink(0.05 + 0.04 * r2.random(), 4200 + 1400 * r2.random()), f_ + r2.random(), 1.0, -0.6 + 1.2 * r2.random())  # nails on pine
for f_ in np.arange(1204, 1336, 7.5): putf(SFX, jingle(0.11), f_ + r2.integers(0, 3), 1.0, -0.5 + 1.0 * r2.random())
for f_ in (1336, 1350): putf(SFX, clunk(0.32, 70), f_ + 13, 1.0, 0.3); putf(SFX, brush(0.2), f_ + 13, 1.0, 0.3); putf(SFX, jingle(0.13), f_ + 14, 1.0, 0.3)
putf(SFX, breath(1.8, 0.2), 1374, 1.0, 0.2)
putf(SFX, swell(0.6, 0.35), 1386, 1.0)
# ---- S8 ---- (1400..1790): the deck at dusk, then the dogs at the window
def loon(dur=2.4, vel=0.1):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 760 + 360 * np.sin(np.pi * np.clip(t / (dur * 0.55), 0, 1)) ** 0.7 - 120 * np.clip((t - dur * 0.6) / (dur * 0.4), 0, 1) + 9 * np.sin(2 * np.pi * 5.5 * t) * np.clip(t / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    return x * np.clip(t / 0.25, 0, 1) * np.clip((dur - t) / 0.6, 0, 1) * vel
put(BED, water_lap(13, 0.11, 11), F2T(1400), 1.0, 0.0); put(BED, crickets(13, 0.06, 7), F2T(1400), 1.0, 0.1); put(BED, wind(13, 0.08, 14), F2T(1400), 1.0, -0.2)
putf(SFX, loon(2.6, 0.085), 1436, 1.0, -0.45); putf(SFX, loon(2.2, 0.05), 1502, 1.0, 0.5)
putf(SFX, swell(1.2, 0.2), 1522, 1.0)
for k, f_ in enumerate((1570, 1586, 1604)):
    for j in range(3): putf(SFX, clink(0.08, 3600 + 500 * j), f_ + 3 + j * 1.5, 1.0, (-0.4, 0.0, 0.4)[k])
    putf(SFX, jingle(0.08), f_ + 5, 1.0, (-0.4, 0.0, 0.4)[k])
putf(SFX, breath(1.4, 0.14), 1682, 1.0, 0.4)
# ---------- mix ----------
MUS = reverb(MUS, 0.30, 2.8)
SFXr = reverb(SFX, 0.14, 1.6)
mix = MUS * 0.85 + SFXr * 1.0 + BED * 1.0
# fades
tf = np.arange(N) / SR * FPS
g = np.interp(tf, [0, 12, 1752, 1789, 1800], [0, 1, 1, 0.0, 0.0])
mix *= g
# soft-limit
pk = np.max(np.abs(mix)); mix = np.tanh(mix / (pk * 0.9)) * 0.9 if pk > 0 else mix
mix = hp(mix.T, 28).T
os.makedirs('assets/audio', exist_ok=True)
wavfile.write('assets/audio/mix.wav', SR, (np.clip(mix.T, -1, 1) * 32767).astype(np.int16))
print('wrote assets/audio/mix.wav', mix.shape, 'peak', np.max(np.abs(mix)))
