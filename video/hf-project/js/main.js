/* main.js — scene switching, transitions, grade, master draw(f). No on-screen type: the pictures carry it. */
const TOTAL = 1700;
function boot() {
initS1(); initS2(); initS3(); initS4(); initS5(); initS7(); initS8();
// ice crossing · the deck · the dock · mowing · sold · the great room · 2025 at the window
const SCN = [S1, S2, S3, S4, S5, S7, S8];
const IDS = ['sc1', 'sc2', 'sc3', 'sc4', 'sc5', 'sc7', 'sc8'];
const CUTS = [0, 300, 500, 700, 900, 1000, 1200, TOTAL];

/* ---------- canvases / overlays ---------- */
const fx = $('fx').getContext('2d');
const leak = $('leak'), flash = $('flash'), grainEl = $('grain');
const tear = document.createElement('div');
tear.id = 'tear'; tear.style.cssText = 'position:absolute;inset:0;background:#f1e6cf;display:none;pointer-events:none';
$('root').insertBefore(tear, $('fx'));
function tearPoly(x, seed) {
  const nz = noise1(seed); const pts = [];
  for (let y = -20; y <= 1100; y += 20) pts.push([x + nz(y * 0.02) * 46 + nz(y * 0.11 + 9) * 12, y]);
  return `polygon(0 -20px, ${pts.map((q) => `${R2(q[0])}px ${q[1]}px`).join(', ')}, 0 1100px)`;
}

function draw(t) {
  const f = t * FPS + 1e-6;
  let idx = 0;
  for (let i = 0; i < SCN.length; i++) if (f >= CUTS[i]) idx = i;
  for (let i = 0; i < SCN.length; i++) {
    const el = $(IDS[i]);
    el.style.display = i === idx ? 'block' : 'none';
    el.style.clipPath = 'none'; el.style.opacity = 1; el.style.zIndex = '';
  }
  const cur = SCN[idx];
  cur.update(f - CUTS[idx], f);
  // torn-paper wipe at 500: the dock tears in over the deck
  const TW = [500, 522];
  tear.style.display = 'none';
  if (idx === 2 && f < TW[1]) {
    const k = E.inOutCubic(seg(f, TW[0], TW[1])), x = lerp(-80, 2020, k);
    $('sc3').style.clipPath = tearPoly(x - 14, 5);
    $('sc2').style.display = 'block'; SCN[1].update(SCN[1].b - SCN[1].a + (f - CUTS[2]), f);
    tear.style.display = 'block'; tear.style.clipPath = tearPoly(x, 5);
  }
  $('sc2').style.zIndex = 1; tear.style.zIndex = 2; $('sc3').style.zIndex = 3; $('fx').style.zIndex = 9;
  // flash / leak / dips
  let fl = 0, lk = 0;
  fl += kf(f, [[290, 0], [299, 0.95], [303, 0.95], [322, 0]], E.inOutSine);
  fl += kf(f, [[692, 0], [699, 0.75], [703, 0.75], [716, 0]], E.inOutSine);
  lk += kf(f, [[496, 0], [512, 0.55], [540, 0]], E.inOutSine) + kf(f, [[690, 0], [699, 1], [704, 1], [728, 0]], E.inOutSine) + kf(f, [[1192, 0], [1201, 0.85], [1208, 0.6], [1236, 0]], E.inOutSine);
  const dark = kf(f, [[992, 0], [999, 1], [1003, 1], [1014, 0]], E.inOutSine);
  flash.style.opacity = R2(Math.min(1, fl));
  leak.style.opacity = R2(Math.min(1, lk));
  darkEl.style.opacity = R2(dark);
  // canvas fx
  fx.clearRect(0, 0, 1920, 1080);
  if (cur.fx) cur.fx(fx, f - CUTS[idx], f);
  // film grain jitter
  const gr = rng(Math.floor(f / 2) * 7 + 3);
  grainEl.style.backgroundPosition = `${Math.floor(gr() * 512)}px ${Math.floor(gr() * 512)}px`;
  const fo = kf(f, [[1668, 0], [1699, 1]], E.inSine);
  finalEl.style.opacity = R2(Math.max(fo, 1 - E.outCubic(seg(f, 0, 14))));
}
const root = $('root');
const darkEl = document.createElement('div'); darkEl.style.cssText = 'position:absolute;inset:0;background:#0b0b12;opacity:0;pointer-events:none;z-index:40'; root.appendChild(darkEl);
const finalEl = document.createElement('div'); finalEl.style.cssText = 'position:absolute;inset:0;background:#0b0b12;opacity:0;pointer-events:none;z-index:41'; root.appendChild(finalEl);
['leak', 'vig', 'paper', 'grain', 'flash'].forEach((id, i) => { $(id).style.zIndex = 10 + i; });

window.draw = draw; window.SCN = SCN;
window.__ready = true;
draw(0);
document.fonts.ready.then(() => draw(P.t));
}
const P = { t: 0 };
const tl = gsap.timeline({ paused: true });
tl.to(P, { t: TOTAL / FPS, duration: TOTAL / FPS, ease: 'none', onUpdate: () => window.draw && window.draw(P.t) }, 0);
window.addEventListener('hf-seek', (e) => window.draw && window.draw(e.detail.time));
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
