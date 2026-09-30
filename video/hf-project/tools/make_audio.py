#!/usr/bin/env python3
"""make_audio.py — mixes the film's soundtrack: the score (assets/audio/score.wav, built by make_score.py from
sampled piano, cello and violin) under sound design built from recorded sounds in assets/sfx/ (snow and wood
footsteps, a real door creak for the ramp hinge, lake lapping, rain, crickets, wind, bees; sources and licenses
in assets/sfx/CREDITS.md). Synthesized: the two lawn mowers and the distant loons, since no usable open recording
of either was reachable here.
Every event is placed from the composition's own frame numbers. Output: assets/audio/mix.wav (stereo, 44.1k).
Needs numpy, scipy and ffmpeg on PATH."""
import numpy as np, os, subprocess
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100
FPS = 30
TOTAL = 2400
DUR = TOTAL / FPS + 0.5
N = int(SR * DUR)
rng = np.random.default_rng(20040330)
F2T = lambda f: f / FPS
HERE = os.path.dirname(os.path.abspath(__file__))
SFXDIR = os.path.join(HERE, '..', 'assets', 'sfx')

def sos(kind, fc, order=2): return butter(order, fc, btype=kind, fs=SR, output='sos')
def lp(x, fc, o=2): return sosfilt(sos('low', fc, o), x)
def hp(x, fc, o=2): return sosfilt(sos('high', fc, o), x)
def fade(x, a=0.005, r=0.02):
    x = x.copy(); n = len(x); na = min(n, int(a * SR)); nr = min(n, int(r * SR))
    if na: x[:na] *= np.linspace(0, 1, na)
    if nr: x[-nr:] *= np.linspace(1, 0, nr)
    return x

# ---------------- recorded sounds ----------------
_cache = {}
def load(name):
    """mono float, peak-normalised; name is a file in assets/sfx"""
    if name in _cache: return _cache[name]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(SFXDIR, name), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    x = x - np.mean(x)
    x /= max(1e-9, np.max(np.abs(x)))
    _cache[name] = x
    return x
def rms_norm(x, target=0.1):
    r = np.sqrt(np.mean(x ** 2)); return x * (target / max(r, 1e-9))
def pitch(x, r):
    """play back r times faster (r > 1 = higher and shorter)"""
    if abs(r - 1) < 1e-4: return x
    idx = np.arange(0, len(x) - 1, r); return np.interp(idx, np.arange(len(x)), x)
def cut(x, t0, t1, a=0.004, r=0.03): return fade(x[int(t0 * SR):int(t1 * SR)], a, r)
def loop(x, dur, seed=0, xf=0.4):
    """a bed of length dur from x: random offsets, crossfaded joins"""
    r = np.random.default_rng(seed); n = int(dur * SR); out = np.zeros(n + len(x)); nx = int(xf * SR)
    i = 0
    while i < n:
        s = int(r.random() * max(1, len(x) // 2)) if len(x) > 4 * nx else 0
        seg_ = x[s:].copy()
        if len(seg_) < 2 * nx: seg_ = x.copy()
        seg_[:nx] *= np.linspace(0, 1, nx); seg_[-nx:] *= np.linspace(1, 0, nx)
        out[i:i + len(seg_)] += seg_
        i += len(seg_) - nx
    return out[:n]

# --- buses (stereo) ---
MUS = np.zeros((2, N)); SFX = np.zeros((2, N)); BED = np.zeros((2, N))
def put(bus, sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0: return
    a = max(0, -i); b = min(len(sig), N - i)
    l = gain * np.cos((pan + 1) * np.pi / 4); r = gain * np.sin((pan + 1) * np.pi / 4)
    bus[0, i + a:i + b] += sig[a:b] * l; bus[1, i + a:i + b] += sig[a:b] * r
def putf(bus, sig, f, gain=1.0, pan=0.0): put(bus, sig, F2T(f), gain, pan)
def bed(sig, f0, f1, gain, pan=0.0, fin=1.0, fout=1.0):
    """place a bed from frame f0 to f1 with fades (seconds)"""
    n = int(F2T(f1 - f0) * SR); x = fade(sig[:n], fin, fout); putf(BED, x, f0, gain, pan)

SNOW = [load(f'minetest_snow_footstep.{i}.ogg') for i in range(1, 6)]
WOOD = [load(f'minetest_wood_footstep.{i}.ogg') for i in (1, 2)]
GRASS = [load(f'minetest_grass_footstep.{i}.ogg') for i in (1, 2, 3)]
KNOCK = [load(f'minetest_place_node_hard.{i}.ogg') for i in (1, 2)]
METAL = [load(f'minetest_dug_metal.{i}.ogg') for i in (1, 2)]
SLOSH = [load(f'minetest_water_footstep.{i}.ogg') for i in (1, 2, 3)]
GATE = load('minetest_fencegate_close.ogg')
WIND = load('lugaru_Wind.ogg'); LAND = load('lugaru_Land.ogg'); THUD = load('lugaru_Thud.ogg')
CREAK = load('scratch_DoorCreak.wav'); RIPPLES = load('scratch_Ripples.wav'); CRICKETS = load('scratch_Crickets.wav')
BEES = [load(f'megaglest_bee{i}.wav') for i in (1, 2, 3, 4)]
SHIP = load('wesnoth_ship.ogg'); GOLD = load('wesnoth_gold.ogg')
LAKE = [load('lincity_ParklandLake1.wav'), load('lincity_ParklandLake2.wav')]
TEAR = load('crossfire_Tear.wav'); RAIN = load('tuxpaint_rain.ogg')

def snow_step(vel):
    x = SNOW[rng.integers(0, 5)]; x = pitch(x, 0.86 + 0.22 * rng.random())
    return fade(x[:int(0.3 * SR)], 0.001, 0.06) * vel
def snow_pat(vel):  # a small dog's paw on snow crust: the front of a crunch, pitched up
    x = SNOW[rng.integers(0, 5)]; s = int(rng.random() * 0.08 * SR)
    return fade(pitch(x[s:], 1.5 + 0.4 * rng.random())[:int(0.05 * SR)], 0.001, 0.02) * vel
def paw_wood(vel, bright=1.0):  # paws on deck boards
    x = WOOD[rng.integers(0, 2)]; x = pitch(x, (1.35 + 0.3 * rng.random()) * bright)
    return fade(x[:int(0.07 * SR)], 0.001, 0.025) * vel
def nail_tick(vel):  # claws on a pine floor: just the click at the front of a wood step
    x = pitch(WOOD[rng.integers(0, 2)], 2.2 + 0.6 * rng.random())[:int(0.018 * SR)]
    return fade(hp(x, 1800), 0.0005, 0.008) * vel
def tags(vel):  # a collar's tags: a short slice of a coin jingle, high-passed
    s = 0.02 + rng.random() * 1.2; x = cut(GOLD, s, s + 0.16, 0.002, 0.08)
    return hp(pitch(x, 1.1 + 0.25 * rng.random()), 2500) * vel
DRIPS_AT = [0.055, 0.165, 0.255, 0.48, 0.715, 0.8, 1.045, 1.385, 1.49]  # the small ticks in the recording
def drip(vel):  # one water tick out of the ripples recording
    s = DRIPS_AT[rng.integers(0, len(DRIPS_AT))]
    return fade(pitch(RIPPLES[int(s * SR):int((s + 0.1) * SR)], 0.9 + 0.3 * rng.random()), 0.002, 0.04) * vel
def creak(t0, dur, rate=0.7, vel=1.0):  # the ramp hinge: a slice of the door creak, slowed and darkened
    return lp(cut(pitch(CREAK, rate), t0, t0 + dur, 0.08, 0.25), 3200) * vel
def knock(vel, rate=1.0): return fade(pitch(KNOCK[rng.integers(0, 2)], rate), 0.0005, 0.03) * vel
def lakebed(dur, seed, which=0): return rms_norm(lp(loop(LAKE[which], dur, seed, 0.5), 2600), 0.1)
def windbed(dur, seed): return rms_norm(loop(WIND, dur, seed, 1.0), 0.1)
def cricketbed(dur, seed): return rms_norm(loop(CRICKETS, dur, seed, 0.5), 0.1)
def engine(dur, f0=62, vel=0.3, seed=1):  # the one synthesized sound left: the mowers
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    fr = f0 * (1 + 0.012 * np.sin(2 * np.pi * 5.3 * t) + 0.02 * np.sin(2 * np.pi * 0.7 * t))
    ph = np.cumsum(fr) / SR
    saw = 2 * (ph % 1) - 1; pul = (np.sin(2 * np.pi * ph * 2) > 0.2).astype(float) * 2 - 1
    x = lp(saw * 0.7 + pul * 0.4 + 0.25 * r.standard_normal(n), 900) * (0.75 + 0.25 * np.sin(2 * np.pi * (f0 / 2) * t))
    return x * vel

def loon(seed, f1=740.0, f2=1110.0, dur=3.6):
    """a common loon's wail far across the water: a low note sliding up, a break up to the long high note, a droop at
    the end; nearly pure (a little 2nd and 3rd harmonic, some breath), then air absorption and the lake's echo"""
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    T1 = 1.1 + 0.3 * r.random(); TB = 0.12
    f = np.where(t < T1, f1 * (0.84 + 0.16 * np.clip(t / 0.28, 0, 1) ** 0.6 + 0.02 * t / T1),
                 f1 * 1.02 + (f2 - f1 * 1.02) * np.clip((t - T1) / TB, 0, 1) ** 0.5)
    f = f * np.where(t > T1 + TB, 1 - 0.035 * (t - T1 - TB) / (dur - T1 - TB) - 0.12 * np.clip((t - dur + 0.35) / 0.35, 0, 1) ** 2, 1)
    vib = 1 + np.where(t > T1, 0.006, 0.0025) * np.sin(2 * np.pi * (5.2 + 0.4 * r.random()) * t + r.random() * 6)
    drift = 1 + 0.004 * lp(r.standard_normal(n), 3) / max(1e-9, np.std(lp(r.standard_normal(n), 3)))
    ph = 2 * np.pi * np.cumsum(f * vib * drift) / SR
    x = np.sin(ph) + 0.22 * np.sin(2 * ph + 0.4) + 0.07 * np.sin(3 * ph + 1.1) + 0.02 * np.sin(4 * ph)
    x += 0.05 * hp(lp(r.standard_normal(n), 2400), 500)
    env = np.clip(t / 0.22, 0, 1) ** 1.5 * np.clip((dur - t) / 0.55, 0, 1) ** 1.2 * (1 - 0.35 * np.exp(-((t - T1 - 0.04) / 0.05) ** 2))
    x = lp(x * env, 2800) * 0.9
    # the lake: a long soft tail, and the far shore handing it back
    m = int(4.0 * SR); tt = np.arange(m) / SR
    ir = lp(r.standard_normal(m), 3000) * np.exp(-tt / 0.55); ir[:int(0.03 * SR)] *= np.linspace(0, 1, int(0.03 * SR)); ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(x, ir)
    out = np.zeros(len(wet) + int(0.6 * SR)); out[:len(x)] += 0.55 * x; out[:len(wet)] += 0.8 * wet
    d = int((0.42 + 0.1 * r.random()) * SR); out[d:d + len(x)] += 0.22 * lp(x, 1600)
    return rms_norm(out, 0.1)
def put_moving(bus, sig, t0, gain, pan_at):
    """place sig with a pan that follows pan_at(seconds since t0)"""
    i = int(t0 * SR); n = min(len(sig), N - i)
    if n <= 0: return
    pn = np.clip(pan_at(np.arange(n) / SR), -1, 1)
    bus[0, i:i + n] += sig[:n] * gain * np.cos((pn + 1) * np.pi / 4); bus[1, i:i + n] += sig[:n] * gain * np.sin((pn + 1) * np.pi / 4)
def bees(dur, seed):
    """the swarm: the four buzz recordings layered at a few pitches, each voice fluttering in level"""
    r = np.random.default_rng(seed); n = int(dur * SR); out = np.zeros(n)
    for k in range(5):
        v = loop(np.concatenate([BEES[(j + k) % 4] for j in range(4)]), dur + 0.5, seed + k, 0.3)
        v = pitch(v, 0.94 + 0.16 * r.random())[:n]
        if len(v) < n: v = np.pad(v, (0, n - len(v)))
        tt = np.arange(n) / SR; fl = 0.6 + 0.4 * np.sin(2 * np.pi * (0.7 + r.random()) * tt + r.random() * 6)
        out += v * fl
    return rms_norm(hp(out, 220), 0.1)

# ================= SCORE =================
_, sc = wavfile.read(os.path.join(HERE, '..', 'assets', 'audio', 'score.wav'))
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
# ---- S1 ---- (0..300): the crossing on the snow-covered ice, one unbroken walk (T = 0.86 f)
bed(windbed(11, 1), 0, 300, 0.3, -0.2, 0.6, 0.5); bed(windbed(11, 2), 0, 300, 0.22, 0.3, 0.6, 0.5)
for k0, pan, vol in ((0.0, -0.1, 0.22), (0.9, -0.55, 0.16), (2.1, -0.4, 0.12), (0.4, 0.15, 0.13)):
    # a foot lands when |sin(2π T/30 + k0)| == 1
    for kk in range(-2, 40):
        Tt = (np.pi / 2 + kk * np.pi - k0) * 30 / (2 * np.pi)
        f_ = Tt / 0.86
        if 0 <= f_ < 296: putf(SFX, snow_step(vol * (0.85 + 0.3 * rng.random())), f_ - 0.5, 1.0, pan)
for f_ in range(6, 296, 5): putf(SFX, snow_pat(0.06 + 0.03 * rng.random()), f_ + rng.random(), 1.0, 0.35 + 0.1 * rng.random())
# ---- S2 ---- (300..500): the two dogs chasing round the deck
bed(lakebed(7, 4), 300, 500, 0.42, 0.3, 0.3, 0.3); bed(windbed(7, 31), 300, 500, 0.12, -0.3, 0.4, 0.4)
putf(BED, loon(41), 352, 0.1, -0.55)                      # a loon far off down the lake
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
            putf(SFX, paw_wood(gain * np.clip(2.6 / Z, 0.5, 1.2) * (0.8 + 0.4 * rng.random()), bright), 300 + f, 1.0, float(np.clip(X / Z, -0.8, 0.8)))
    if tag:
        for f_ in np.arange(304, 496, 9.5): putf(SFX, tags(0.06), f_ + rng.random() * 2, 1.0, 0.1)
deck_dog(0.0, 0.12, 0.72, 0.2, 1.1, False)
deck_dog(1.9, -0.16, 0.66, 0.18, 0.9, True)
# ---- S3 ---- (500..700): standing the ramp up for winter
putf(SFX, hp(TEAR, 600), 499, 0.4, 0.0)
bed(lakebed(7, 8, 1), 500, 700, 0.45, 0.0, 0.3, 0.3); bed(rms_norm(loop(SHIP, 7, 3), 0.1), 500, 700, 0.28, 0.3, 0.4, 0.4)
putf(SFX, knock(0.32, 0.8), 528, 1.0, -0.3)             # hands on the lake end
putf(SFX, creak(0.3, 1.9, 0.62, 0.3), 536, 1.0, -0.2)   # the hinge takes the weight
putf(SFX, creak(2.4, 1.4, 0.7, 0.24), 596, 1.0, -0.35)  # the boy takes over
putf(SFX, creak(4.0, 1.2, 0.66, 0.2), 632, 1.0, -0.35)
putf(SFX, lp(pitch(GATE, 0.78), 5000) * 0.34, 674, 1.0, -0.3); putf(SFX, knock(0.3, 0.7), 677, 1.0, -0.3)  # it stands
for f_ in range(544, 688, 5):                           # drips off the underside into the lake
    if rng.random() < 0.6: putf(SFX, drip(0.1 + 0.08 * rng.random() * (1 - abs(f_ - 610) / 100)), f_ + rng.integers(0, 3), 1.0, -0.5 + 0.4 * rng.random())
for f_ in np.arange(552, 640, 11): putf(SFX, tags(0.045), f_, 1.0, -0.6)  # the schnauzer trots along the cap
# ---- S4 ---- (700..900): mowing
bed(windbed(7, 5), 700, 900, 0.16, 0.2, 0.3, 0.3)
# the swarm after her, far off at the back of the lawn: panned to where she runs (lawn depth, the camera's drift)
def _run_pan(ts):
    f = ts * FPS; e = 0.5 - 0.5 * np.cos(np.pi * np.clip(f / 200, 0, 1)); fx = 900 + 110 * e; sc = 1.04 + 0.1 * e
    x = 700 + 5.9 * f + 26 * np.sin(f * 0.045); return 0.85 * ((960 + sc * (x + 0.05 * (fx - 960) - fx)) - 960) / 960
put_moving(BED, fade(bees(6.8, 51), 0.4, 0.4), F2T(700), 0.22, _run_pan)
put(BED, engine(6.9, 58, 0.28, 1), F2T(700), 1.0, -0.15)   # riding mower: enters left, travels right
put(BED, engine(6.9, 96, 0.15, 2), F2T(700), 1.0, 0.2)     # push mower
for f_ in range(704, 896, 7): putf(SFX, fade(pitch(GRASS[rng.integers(0, 3)], 1.0 + 0.2 * rng.random())[:int(0.2 * SR)], 0.002, 0.05) * 0.1, f_, 1.0, -0.5 + 1.0 * rng.random())
# ---- S5 ---- (900..1000): hush, then the plank
bed(windbed(3.4, 6), 900, 1000, 0.2, 0.0, 0.3, 0.3)
putf(SFX, lp(pitch(THUD, 0.85), 4000) * 0.24, 921, 1.0, -0.5); putf(SFX, knock(0.24, 0.75), 922, 1.0, -0.5)
for k, (f_, v) in enumerate(((922, 0.16), (926, 0.11), (931, 0.075), (938, 0.05), (946, 0.03))):
    putf(SFX, fade(pitch(METAL[k % 2], 1.1 + 0.08 * k), 0.001, 0.1) * v, f_, 1.0, -0.5 + 0.1 * k)
# ---- S7 ---- (1000..1200): zoomies in the great room, then the sofa
putf(BED, lp(loon(42, 700, 1050), 1500), 1128, 0.05, 0.6)  # a loon outside, through the glass, as they settle
r2 = np.random.default_rng(4)
for f_ in np.arange(1002, 1124, 2.6): putf(SFX, nail_tick(0.07 + 0.05 * r2.random()), f_ + r2.random(), 1.0, -0.6 + 1.2 * r2.random())
for f_ in np.arange(1004, 1124, 7.5): putf(SFX, tags(0.08), f_ + r2.integers(0, 3), 1.0, -0.5 + 1.0 * r2.random())
for f_ in (1136, 1150): putf(SFX, lp(LAND, 1800) * 0.3, f_, 1.0, 0.3); putf(SFX, tags(0.09), f_ + 1, 1.0, 0.3)
# ---- S7b ---- (1200..1500): the rain passing on the deck, the cat on the rail, down the stairs
rn = rms_norm(hp(loop(RAIN, 10.5, 7, 0.3), 700), 0.1); rn *= np.interp(np.arange(len(rn)) / SR, [0, 2.5, 6.5, 10.5], [1, 0.8, 0.25, 0.12])
bed(rn, 1200, 1500, 0.42, 0.0, 0.2, 1.0)
bed(windbed(10.5, 9), 1200, 1500, 0.16, -0.3, 0.3, 0.8)
bed(lakebed(9, 13), 1230, 1500, 0.2, 0.4, 2.0, 0.8)
putf(BED, loon(43), 1248, 0.13, 0.35)                     # the loon, as the cat looks out over the lake
for k, f_ in enumerate((1383, 1390, 1397, 1404, 1411, 1418)):  # down the wet stairs
    putf(SFX, lp(fade(pitch(WOOD[k % 2], 0.78 + 0.06 * rng.random())[:int(0.16 * SR)], 0.002, 0.06), 2400) * 0.12, f_, 1.0, 0.1)
bed(lakebed(4, 12), 1380, 1500, 0.4, 0.0, 1.5, 0.3)
for f_ in np.arange(1204, 1500, 6.5):                     # drips off the eave and the pine boughs
    if rng.random() < 0.55: putf(SFX, drip(0.18 + 0.12 * rng.random()), f_ + rng.random() * 3, 1.0, -0.6 + 1.2 * rng.random())
putf(SFX, cut(RIPPLES, 0.94, 1.12, 0.002, 0.06) * 0.22, 1324, 1.0, 0.0)  # the drop off the cat's chin lands
# ---- S8 ---- (1500..1900): the deck at dusk, then the dogs at the window
putf(BED, loon(44, 760, 1140), 1534, 0.11, -0.35); putf(BED, loon(45, 700, 1020, 3.2), 1648, 0.06, 0.55)  # and another answers
bed(lakebed(14, 11), 1470, 1900, 0.5, 0.0, 1.0, 0.2); bed(cricketbed(14, 7), 1470, 1900, 0.22, 0.1, 1.0, 0.2); bed(windbed(14, 14), 1500, 1900, 0.08, -0.2, 0.5, 0.2)
for k, f_ in enumerate((1722, 1740, 1760)):  # paws on the sill, one dog after another
    for j in range(2): putf(SFX, paw_wood(0.12, 1.2), f_ + 3 + j * 2, 1.0, (-0.4, 0.0, 0.4)[k])
    putf(SFX, tags(0.07), f_ + 5, 1.0, (-0.4, 0.0, 0.4)[k])
# ---- S9 ---- (1900..2400): out through the glass, back over the decks to the lake and Dad in the kayak
bed(lakebed(17, 21), 1900, 2400, 0.55, 0.0, 0.1, 0.5); bed(lakebed(17, 22, 1), 2080, 2400, 0.35, -0.3, 2.0, 0.5)
cr = cricketbed(17, 23); cr *= np.interp(np.arange(len(cr)) / SR, [0, 6, 11, 17], [1, 1, 0.55, 0.4])
bed(cr, 1900, 2400, 0.24, 0.2, 0.1, 0.5); bed(windbed(17, 24), 1900, 2400, 0.08, -0.2, 0.3, 0.5)
putf(SFX, tags(0.05), 1916, 1.0, 0.1)                     # Wolfgang's ears go up
putf(BED, loon(46, 780, 1170), 2168, 0.1, 0.45); putf(BED, loon(47, 720, 1060, 3.3), 2262, 0.055, -0.5)  # loons out on the water
for f_ in (2150, 2230, 2262, 2330): putf(SFX, lp(pitch(LAKE[1][int(0.4 * SR):int(1.1 * SR)], 1.15), 3000) * 0.07, f_, 1.0, -0.4)  # the hull
putf(SFX, lp(fade(SLOSH[0][int(0.3 * SR):int(1.6 * SR)], 0.05, 0.4), 5000) * 0.24, 2290, 1.0, 0.25)  # the blade goes in
for f_ in (2324, 2331, 2336, 2344, 2356): putf(SFX, drip(0.16), f_, 1.0, 0.3)  # and drips as it lifts
# ---------- mix ----------
SFXr = reverb(SFX, 0.14, 1.6)
mix = MUS * 0.8 + SFXr * 1.0 + BED * 1.0
tf = np.arange(N) / SR * FPS
mix *= np.interp(tf, [0, 10, TOTAL - 36, TOTAL - 1, TOTAL + 16], [0, 1, 1, 0.0, 0.0])
# fixed gain staging: the score sits at about -20 dBFS RMS, and only stray peaks meet the soft ceiling
G = 10 ** (-20 / 20) / max(1e-9, np.sqrt(np.mean((MUS * 0.8) ** 2)))
mix = np.tanh(mix * G / 0.95) * 0.95
if os.environ.get('MIX_REPORT'):
    for a_, b_ in zip([0, 300, 500, 700, 900, 1000, 1200, 1500, 1900], [300, 500, 700, 900, 1000, 1200, 1500, 1900, 2400]):
        i, j = int(F2T(a_) * SR), int(F2T(b_) * SR)
        lv = lambda x: 20 * np.log10(np.sqrt(np.mean(x[:, i:j] ** 2)) * G + 1e-9)
        print(f'{a_:5d}-{b_:5d}  music {lv(MUS * 0.8):6.1f}  beds {lv(BED):6.1f}  sfx {lv(SFXr):6.1f}  sfx peak {20 * np.log10(np.max(np.abs(SFXr[:, i:j])) * G + 1e-9):6.1f}')
mix = hp(mix.T, 28).T
os.makedirs(os.path.join(HERE, '..', 'assets', 'audio'), exist_ok=True)
wavfile.write(os.path.join(HERE, '..', 'assets', 'audio', 'mix.wav'), SR, (np.clip(mix.T, -1, 1) * 32767).astype(np.int16))
print('wrote assets/audio/mix.wav', mix.shape, 'peak', np.max(np.abs(mix)), 'sounds used:', len(_cache))
