/* main.js — scene switching, transitions, grade, master draw(f). No on-screen type: the pictures carry it. */
const TOTAL = 2600;
function boot() {
initS1(); initS2(); initS3(); initS4(); initS5(); initS6(); initS7(); initS7b(); initS8(); initS9();
// ice crossing · the deck · the dock · mowing · sold · the place from above · the great room · the cat on the rail · 2025 at the window · back out to the lake
const SCN = [S1, S2, S3, S4, S5, S6, S7, S7b, S8, S9];
const IDS = ['sc1', 'sc2', 'sc3', 'sc4', 'sc5', 'sc6', 'sc7', 'sc7b', 'sc8', 'sc9'];
const CUTS = [0, 300, 500, 700, 900, 1000, 1200, 1400, 1700, 2100, TOTAL];
const iS8 = SCN.indexOf(S8), iS7b = SCN.indexOf(S7b), iS6 = SCN.indexOf(S6), iS7 = SCN.indexOf(S7);

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
  // up and away over the place: the great room's window comes in under the last frames, the lake at the top of the picture
  if (idx === iS6 && f >= CUTS[iS7] - 18) {
    const k = E.inOutSine(seg(f, CUTS[iS7] - 18, CUTS[iS7]));
    $('sc7').style.display = 'block'; $('sc7').style.zIndex = 4; SCN[iS7].update(f - CUTS[iS7], f);
    $('sc6').style.zIndex = 5; $('sc6').style.opacity = R2(1 - k);
  }
  // down the stairs: the lake deck dissolves in under the last steps, landing on the first frame of the dusk scene
  const DS = [CUTS[iS8] - 20, CUTS[iS8]];  // the three are pinned to S8's places by then and the camera is still gliding, so this only blends the two drawings of the deck
  if (idx === iS7b && f >= DS[0]) {
    const k = E.inOutSine(seg(f, DS[0], DS[1]));
    $('sc8').style.display = 'block'; $('sc8').style.zIndex = 4; SCN[iS8].update(f - CUTS[iS8], f);
    $('sc7b').style.zIndex = 5; $('sc7b').style.opacity = R2(1 - k);
  }
  // flash / leak / dips
  let fl = 0, lk = 0;
  fl += kf(f, [[290, 0], [299, 0.95], [303, 0.95], [322, 0]], E.inOutSine);
  fl += kf(f, [[692, 0], [699, 0.75], [703, 0.75], [716, 0]], E.inOutSine);
  // through the glass: out of the room, turned around to face the dogs from the deck
  // the stairs hand over to the dusk deck under a soft warm wash, so the two drawings of the deck never show as a jump
  fl += kf(f, [[1680, 0], [1693, 0.8], [1700, 0.8], [1716, 0]], E.inOutSine);
  fl += kf(f, [[2090, 0], [2099, 0.85], [2102, 0.85], [2122, 0]], E.inOutSine);
  lk += kf(f, [[496, 0], [512, 0.55], [540, 0]], E.inOutSine) + kf(f, [[690, 0], [699, 1], [704, 1], [728, 0]], E.inOutSine) + kf(f, [[1392, 0], [1401, 0.85], [1408, 0.6], [1436, 0]], E.inOutSine);
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
  const fo = kf(f, [[TOTAL - 32, 0], [TOTAL - 1, 1]], E.inSine);
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
