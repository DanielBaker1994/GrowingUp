"""make_score.py — the film's score: an arrangement of Erik Satie's Gymnopédie No. 1 (1888, public domain)
played on sampled felt piano, with a cello under the bass and a violin joining for the second phrase.
Samples: tonejs-instruments (piano, cello, violin MP3s, npm tonejs-instrument-*-mp3, MIT).
Tempo: one 3/4 bar = 100 frames at 30 fps (54 BPM), so every scene cut lands on a bar line.
Writes assets/audio/score.wav (44.1 kHz stereo float WAV).
"""
import os, subprocess, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR, FPS = 44100, 30
BAR_F = 100
BEAT = BAR_F / 3 / FPS  # seconds per beat
DUR = 2400 / FPS + 2.0
N = int(SR * DUR)
HERE = os.path.dirname(os.path.abspath(__file__))
SAMP = os.path.join(HERE, '..', 'assets', 'samples')
NAMES = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B']

def nm(m): return f"{NAMES[m % 12]}{m // 12 - 1}"
def mid(n):
    for i, k in enumerate(NAMES):
        if n.startswith(k) and n[len(k):].lstrip('-').isdigit(): return 12 * (int(n[len(k):]) + 1) + i
    return None

_cache = {}
def load(path):
    if path in _cache: return _cache[path]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).T.copy()
    _cache[path] = x
    return x

def bank(inst):
    d = os.path.join(SAMP, inst); out = {}
    for f in os.listdir(d):
        if f.endswith('.mp3'):
            m = mid(f[:-4])
            if m is not None: out[m] = os.path.join(d, f)
    return out
BANK = {k: bank(k) for k in ('piano', 'cello', 'violin')}

def lp(x, fc): return sosfilt(butter(2, fc, btype='low', fs=SR, output='sos'), x)

def note(inst, m, dur, vel=0.6, attack=0.004, release=0.9, bright=1.0):
    b = BANK[inst]; near = min(b, key=lambda k: abs(k - m)); x = load(b[near])
    r = 2 ** ((m - near) / 12)
    if abs(r - 1) > 1e-6:
        idx = np.arange(0, x.shape[1] - 1, r); x = np.stack([np.interp(idx, np.arange(x.shape[1]), ch) for ch in x])
    n = min(x.shape[1], int((dur + release) * SR)); x = x[:, :n].copy()
    t = np.arange(n) / SR
    env = np.clip(t / max(attack, 1e-4), 0, 1) * np.where(t < dur, 1.0, np.clip(1 - (t - dur) / release, 0, 1))
    x *= env * vel
    fc = min(16000, (1800 + 9000 * vel) * bright)
    return np.stack([lp(ch, fc) for ch in x])

MUS = np.zeros((2, N))
def put(sig, t0, gain=1.0, pan=0.0):
    i0 = int(t0 * SR)
    if i0 >= N: return
    n = min(sig.shape[1], N - i0)
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    MUS[0, i0:i0 + n] += sig[0, :n] * gain * l * 1.41
    MUS[1, i0:i0 + n] += sig[1, :n] * gain * r * 1.41
def bt(b, beat=0.0): return (b * BAR_F) / FPS + beat * BEAT

G2, D2 = 43, 38
GCH, DCH = [59, 62, 66], [57, 61, 66]  # Gmaj7 / Dmaj7 voicings (B3 D4 F#4 / A3 C#4 F#4)
H = lambda b, beat, rng_=np.random.default_rng(7): beat * BEAT * 0 + rng_.uniform(-0.012, 0.012)  # humanise

# ---- left hand: bass on 1, chord on 2. G/D alternate bars 0..13; bar 14 holds D a second bar (a breath as the
# camera drops down the stairs) so the second phrase lands on G at bar 15 with the dogs; bars 15..22 alternate again;
# final chord on bar 23 (frame 2300) rings into the fade ----
LAST = 23
def is_g(b): return (b % 2 == 0) if b <= 13 else (False if b == 14 else (b - 15) % 2 == 0)
for b in range(LAST):
    bass, ch = (G2, GCH) if is_g(b) else (D2, DCH)
    v = 0.34 if b < 4 else (0.3 if b == 14 else 0.4)
    put(note('piano', bass, 3.2, v, release=1.6, bright=0.8), bt(b) + H(b, 0), 0.95, -0.25)
    for k, m in enumerate(ch):
        put(note('piano', m, 2.1, v * 0.62, release=1.4, bright=0.75), bt(b, 1) + 0.008 * k + H(b, 1), 0.85, -0.1 + 0.08 * k)
# final: D major 7 spread, bass octave
for k, (m, v) in enumerate(((26, 0.3), (38, 0.36), (57, 0.26), (61, 0.22), (66, 0.24), (74, 0.3))):
    put(note('piano', m, 5.5, v, release=2.5, bright=0.8), bt(LAST) + 0.03 * k, 0.9, -0.2 + 0.08 * k)

# ---- right hand melody: phrase (bars 4..7), the long F#4 (8..11), a few quiet notes for the cat on the rail (12..14),
# the phrase again with the dogs (15..18), a closing line for the pull-back to the lake (19..22), D5 in bar 23 ----
PHRASE = [(4, 1, 78, 1), (4, 2, 81, 1), (5, 0, 79, 1), (5, 1, 78, 1), (5, 2, 73, 1), (6, 0, 71, 1), (6, 1, 73, 1), (6, 2, 74, 1), (7, 0, 69, 3)]
CAT = [(12, 1, 71, 1), (12, 2, 74, 1), (13, 0, 73, 3), (14, 1, 76, 2)]
CLOSE = [(19, 1, 78, 1), (19, 2, 81, 1), (20, 0, 79, 1), (20, 1, 78, 1), (20, 2, 76, 1), (21, 0, 74, 3), (22, 0, 73, 3)]
MEL = PHRASE + [(8, 0, 66, 12)] + CAT + [(b + 11, bb, m, d) for (b, bb, m, d) in PHRASE] + CLOSE
for (b, bb, m, d) in MEL:
    v = 0.36 if 12 <= b <= 14 else 0.46
    put(note('piano', m, d * BEAT, v, release=1.8, bright=0.85), bt(b, bb) + H(b, bb), 0.8, 0.12)
put(note('piano', 74, 4.0, 0.42, release=2.5, bright=0.8), bt(LAST, 1), 0.8, 0.12)

# ---- cello: a bowed bass under bars 4..23, swelling in ----
for b in range(4, LAST + 1):
    m = G2 if (b < LAST and is_g(b)) else D2
    put(note('cello', m, BAR_F / FPS + (2.0 if b == LAST else 0.25), 0.5, attack=0.45, release=1.2, bright=0.6), bt(b) - 0.05, 0.42 * (0.7 if b < 8 or b == 14 else 1.0), -0.3)

# ---- violin: the long F#4 under bars 8..11, then doubling the second phrase an octave down, softly ----
put(note('violin', 66, 4 * BAR_F / FPS - 0.4, 0.42, attack=1.4, release=1.6, bright=0.55), bt(8) + 0.2, 0.34, 0.35)
for (b, bb, m, d) in PHRASE:
    put(note('violin', m - 12, d * BEAT + 0.15, 0.4, attack=0.22, release=0.9, bright=0.55), bt(b + 11, bb), 0.3, 0.35)
# out on the water: two long held notes under the closing line
put(note('violin', 69, 2 * BAR_F / FPS - 0.3, 0.38, attack=1.2, release=1.4, bright=0.5), bt(19) + 0.2, 0.26, 0.35)
put(note('violin', 66, 2 * BAR_F / FPS - 0.3, 0.38, attack=1.2, release=1.4, bright=0.5), bt(21) + 0.2, 0.26, 0.35)
put(note('violin', 62, 4.0, 0.4, attack=0.5, release=2.0, bright=0.5), bt(LAST, 1), 0.28, 0.35)

# ---- room: a short, soft plate so it breathes without washing ----
def reverb(x, rt=2.4, wet=0.22):
    n = int(rt * SR); t = np.arange(n) / SR; out = np.zeros_like(x)
    for c in range(2):
        r = np.random.default_rng(40 + c)
        ir = lp(r.standard_normal(n), 5200) * np.exp(-t / (rt / 6.9)); ir[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
        ir /= np.sqrt(np.sum(ir ** 2))
        from scipy.signal import fftconvolve
        out[c] = fftconvolve(x[c], ir)[:x.shape[1]]
    return x * (1 - wet * 0.5) + out * wet
MUS = reverb(MUS)
MUS /= np.max(np.abs(MUS)) * 1.12
os.makedirs(os.path.join(HERE, '..', 'assets', 'audio'), exist_ok=True)
wavfile.write(os.path.join(HERE, '..', 'assets', 'audio', 'score.wav'), SR, MUS.T.astype(np.float32))
used = sorted({os.path.basename(p) for p in _cache})
print('wrote assets/audio/score.wav', MUS.shape, 'samples used:', len(used))
with open(os.path.join(SAMP, 'USED.txt'), 'w') as fh: fh.write('\n'.join(sorted(os.path.relpath(p, SAMP) for p in _cache)) + '\n')
