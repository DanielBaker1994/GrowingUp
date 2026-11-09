/* lib.js — pure helpers: math, easing, seeded noise, paper-cut shape builders */
const FPS = 30;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (f, a, b) => clamp((f - a) / (b - a));
const mix = (c1, c2, t) => {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1), b = p(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, '0')).join('');
};
const E = {
  lin: (t) => t,
  inSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  outSine: (t) => Math.sin((t * Math.PI) / 2),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inCubic: (t) => t * t * t,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  smooth: (t) => t * t * (3 - 2 * t),
  smoother: (t) => t * t * t * (t * (t * 6 - 15) + 10),
};
// closed-form damped spring, 0 -> 1 (t in frames)
const spring = (t, w = 0.35, z = 0.35) => {
  if (t <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
};
// keyframes: kf(f, [[f0,v0],[f1,v1],...], ease) — ease applies to each span
const kf = (f, keys, ease = E.inOutSine) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const [a, va] = keys[i - 1], [b, vb] = keys[i];
      return lerp(va, vb, ease((f - a) / (b - a)));
    }
  }
  return keys[keys.length - 1][1];
};
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// smooth 1-D value noise, returns fn(x) in [-1,1]
function noise1(seed) {
  const r = rng(seed), v = Array.from({ length: 256 }, () => r() * 2 - 1);
  return (x) => {
    const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f);
    return lerp(v[((i % 256) + 256) % 256], v[(((i + 1) % 256) + 256) % 256], s);
  };
}
const $ = (id) => document.getElementById(id);
const R2 = (n) => Math.round(n * 10) / 10;

/* ---------- paper-cut shapes ---------- */
// hand-cut ridge line
function ridgeFn(seed, y, amp) {
  const r = rng(seed), ph = [r() * 6.28, r() * 6.28, r() * 6.28];
  return (x) => y - (Math.sin(x * 0.0021 + ph[0]) * 0.55 + Math.sin(x * 0.0057 + ph[1]) * 0.3 + Math.sin(x * 0.013 + ph[2]) * 0.15) * amp;
}
function ridgePath(fn, seed, x0 = -300, x1 = 2220, step = 14, jit = 1.6, bottom = 1300) {
  const r = rng(seed + 99);
  let d = `M${x0} ${bottom}`;
  for (let x = x0; x <= x1; x += step) d += ` L${x} ${R2(fn(x) + (r() - 0.5) * jit * 2)}`;
  return d + ` L${x1} ${bottom}Z`;
}
// stacked-tier spruce silhouette, cut with scissors
function spruce(x, by, h, w, seed) {
  const r = rng(seed), T = 5 + Math.floor(r() * 3);
  const L = [], Rt = [];
  for (let i = 0; i < T; i++) {
    const t0 = (i + 0.4) / T, ty = by - h * 0.1 - h * 0.9 * (i / T);
    const hw = (w / 2) * Math.pow(1 - i / T, 0.85) * (0.86 + r() * 0.28);
    L.push([x - hw, ty + h * 0.02]);
    L.push([x - hw * 0.5, ty - (h / T) * 0.55 - r() * 4]);
    Rt.push([x + hw * (0.9 + r() * 0.2), ty + h * 0.02]);
    Rt.push([x + hw * 0.5, ty - (h / T) * 0.55 - r() * 4]);
  }
  let d = `M${R2(x - w * 0.03)} ${by}`;
  L.forEach((p) => (d += ` L${R2(p[0])} ${R2(p[1])}`));
  d += ` L${R2(x)} ${R2(by - h)}`;
  for (let i = Rt.length - 1; i >= 0; i--) d += ` L${R2(Rt[i][0])} ${R2(Rt[i][1])}`;
  return d + ` L${R2(x + w * 0.03)} ${by}Z`;
}
// rounded blob (foliage) with cut-paper wobble
function blob(cx, cy, rx, ry, seed, n = 18, wob = 0.14) {
  const r = rng(seed);
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, k = 1 + (r() - 0.5) * wob * 2;
    d += (i ? ' L' : 'M') + R2(cx + Math.cos(a) * rx * k) + ' ' + R2(cy + Math.sin(a) * ry * k);
  }
  return d + 'Z';
}
// row of spruces along a ridge
function forest(fn, x0, x1, gap, hMin, hMax, seed, sink = 0) {
  const r = rng(seed);
  let d = '';
  for (let x = x0; x < x1; x += gap * (0.6 + r() * 0.8)) {
    const h = hMin + r() * (hMax - hMin);
    d += spruce(x, R2(fn(x) + sink + 6), h, h * (0.34 + r() * 0.1), Math.floor(r() * 1e6));
  }
  return d;
}
const svgEl = (tag, attrs = {}, html = '') => {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (html) e.innerHTML = html;
  return e;
};
let _gid = 0;
// vertical gradient def, returns url(#id)
function grad(defs, stops, x2 = 0, y2 = 1, id) {
  id = id || 'g' + _gid++;
  defs.insertAdjacentHTML(
    'beforeend',
    `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
      .map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`)
      .join('')}</linearGradient>`
  );
  return `url(#${id})`;
}
function radial(defs, stops, id) {
  id = id || 'r' + _gid++;
  defs.insertAdjacentHTML(
    'beforeend',
    `<radialGradient id="${id}">${stops.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}" stop-opacity="${s[2] == null ? 1 : s[2]}"/>`).join('')}</radialGradient>`
  );
  return `url(#${id})`;
}

const w2s = (c, x, y) => [960 + (x - c.fx) * c.s, 560 + (y - c.fy) * c.s];
