/* main.js — scene switching, transitions, year odometer, pencil ruler, grade, master draw(f) */
const TOTAL = 1700;
function boot() {
if (typeof initS1 !== 'undefined') initS1(); if (typeof initS2 !== 'undefined') initS2(); if (typeof initS3 !== 'undefined') initS3(); if (typeof initS4 !== 'undefined') initS4(); if (typeof initS5 !== 'undefined') initS5(); if (typeof initS6 !== 'undefined') initS6(); if (typeof initS7 !== 'undefined') initS7(); 
const SCN = [typeof S1 !== 'undefined' && S1, typeof S2 !== 'undefined' && S2, typeof S3 !== 'undefined' && S3, typeof S4 !== 'undefined' && S4, typeof S5 !== 'undefined' && S5, typeof S6 !== 'undefined' && S6, typeof S7 !== 'undefined' && S7];
const CUTS = [0, 300, 500, 700, 900, 1000, 1200, TOTAL];

/* ---------- odometer year ---------- */
const UNITS = [[0, 4], [504, 4], [538, 6], [704, 6], [742, 10], [904, 10], [926, 11], [1004, 11], [1034, 14], [1204, 14], [1250, 23]];
const TENS = [[0, 0], [704, 0], [746, 1], [1204, 1], [1252, 2]];
const yearEl = $('year');
yearEl.innerHTML = '';
const mkDigit = (n, count) => { const d = document.createElement('div'); d.className = 'dg'; d.setAttribute('data-layout-allow-overflow',''); const col = document.createElement('div'); let h = ''; for (let i = 0; i < count; i++) h += `<span>${i % 10}</span>`; col.innerHTML = h; d.appendChild(col); yearEl.appendChild(d); return { d, col }; };
const dg2 = mkDigit(2, 3), dg0 = mkDigit(0, 3), dgT = mkDigit(0, 4), dgU = mkDigit(4, 30);
dg2.col.style.transform = 'translateY(' + -2 * 236 + 'px)';
dg0.col.style.transform = 'translateY(0px)';
const rollPos = (f, keys, ease) => kf(f, keys, ease);

/* ---------- where / note per scene ---------- */
const WHERE = ['Kahshe Lake · March', 'Kahshe Lake · August', 'Kahshe Lake · October', 'The country place · July', 'The country place · September', 'Kahshe Lake · August', 'Kahshe Lake · June'];
const NOTE = ['the boys are 12 & 10', 'six months on', '14 & 12, and every hand needed', 'one is off to university now', 'sold.', '22 & 20', '31 & 29'];
const NOTE_AT = [34, 330, 532, 736, 930, 1034, 1240]; // frame a note starts writing
const NOTE_LEN = [88, 60, 100, 100, 34, 60, 110];
const NOTE_ROT = [-2.4, 1.4, -1.6, -2.2, -1, 1.2, -2];
const whereEl = $('where'), noteEl = $('note');
const noteSpans = NOTE.map((t, i) => { const s = document.createElement('span'); s.textContent = t; s.style.cssText = 'position:absolute;left:0;top:0;white-space:nowrap'; noteEl.appendChild(s); return s; });
const whereSpans = WHERE.map((t) => { const s = document.createElement('span'); s.textContent = t; s.style.cssText = 'position:absolute;left:0;top:0;white-space:nowrap'; whereEl.appendChild(s); return s; });

/* ---------- pencil ruler ---------- */
const ruler = $('ruler'), RX0 = 112, RX1 = 1808, RY = 1030;
const yx = (y) => RX0 + ((y - 2004) / 19) * (RX1 - RX0);
let rh = `<line id="rl" x1="${RX0}" y1="${RY}" x2="${RX0}" y2="${RY}" stroke="#f4e8d2" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;
for (let y = 2004; y <= 2023; y++) { const big = y % 5 === 4 || y === 2023; rh += `<line x1="${R2(yx(y))}" x2="${R2(yx(y))}" y1="${RY - (big ? 9 : 5)}" y2="${RY + (big ? 9 : 5)}" stroke="#f4e8d2" stroke-width="1.5" opacity="${big ? 0.55 : 0.3}"/>`; }
rh += `<text x="${RX0}" y="${RY + 34}" fill="#f4e8d2" opacity=".6" font-family="DM Mono" font-size="16" letter-spacing="3">2004</text><text x="${RX1}" y="${RY + 34}" text-anchor="end" fill="#f4e8d2" opacity=".6" font-family="DM Mono" font-size="16" letter-spacing="3">2023</text>`;
rh += `<circle id="rd" cx="${RX0}" cy="${RY}" r="6.5" fill="#f4e8d2"/><circle id="rd2" cx="${RX0}" cy="${RY}" r="14" fill="none" stroke="#f4e8d2" stroke-width="1.2" opacity=".6"/>`;
ruler.innerHTML = rh;
const YEARKEY = [[0, 2004], [504, 2004], [538, 2006], [704, 2006], [742, 2010], [904, 2010], [926, 2011], [1004, 2011], [1034, 2014], [1204, 2014], [1250, 2023]];

/* ---------- ending type ---------- */
const endEl = $('end'), end2 = $('end2');
const ENDTXT = 'Growing up, together.';
endEl.innerHTML = [...ENDTXT].map((c) => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
const chEls = [...endEl.querySelectorAll('.ch')];
end2.textContent = 'Kahshe Lake, Ontario  ·  2004 — 2023';

/* ---------- canvases / overlays ---------- */
const fx = $('fx').getContext('2d');
const leak = $('leak'), flash = $('flash'), grainEl = $('grain');
const tear = document.createElement('div');
tear.id = 'tear'; tear.style.cssText = 'position:absolute;inset:0;background:#f1e6cf;display:none;pointer-events:none';
$('root').insertBefore(tear, $('fx'));
function tearPoly(x, seed, w = 1920) {
  const nz = noise1(seed); let p = `0 -20px`; const pts = [];
  for (let y = -20; y <= 1100; y += 20) pts.push([x + nz(y * 0.02) * 46 + nz(y * 0.11 + 9) * 12, y]);
  return { poly: `polygon(0 -20px, ${pts.map((q) => `${R2(q[0])}px ${q[1]}px`).join(', ')}, 0 1100px)`, pts };
}

function draw(t) {
  const f = t * FPS + 1e-6;
  // which scene(s)
  let idx = 0;
  for (let i = 0; i < 7; i++) if (f >= CUTS[i]) idx = i;
  for (let i = 0; i < 7; i++) {
    const s = SCN[i], el = $('sc' + (i + 1));
    let on = i === idx;
    if (i === 1 && f >= 500 - 0 && f < 500) on = true;
    el.style.display = on && s ? 'block' : 'none';
    el.style.clipPath = 'none'; el.style.opacity = 1;
  }
  // torn-paper wipe 500: S2 -> S3 (S3 tears across over S2)
  const TW = [500, 522];
  tear.style.display = 'none';
  if (f >= TW[0] - 22 && f < TW[1] && SCN[1] && SCN[2]) { /* handled below */ }
  const cur = SCN[idx];
  if (cur) cur.update(f - CUTS[idx], f);
  // scene-specific transition treatments
  if (idx === 2 && f < TW[1]) {
    const k = E.inOutCubic(seg(f, TW[0], TW[1]));
    const x = lerp(-80, 2020, k);
    const tp = tearPoly(x, 5), tp2 = tearPoly(x - 14, 5);
    $('sc3').style.clipPath = tp2.poly;
    if (SCN[1]) { $('sc2').style.display = 'block'; SCN[1].update(SCN[1].b - SCN[1].a + (f - CUTS[2]), f); }
    tear.style.display = 'block'; tear.style.clipPath = tp.poly;
    tear.style.opacity = 1;
    // order: sc2 (under), tear, sc3 (over) — sc3 is later in DOM, tear placed after fx; keep tear above sc2 but below sc3 by z-index
  }
  $('sc2').style.zIndex = 1; tear.style.zIndex = 2; $('sc3').style.zIndex = 3; $('fx').style.zIndex = 9;
  // dissolve S6 -> S7 at 1200 (cross fade 16f), S5->S6 dip
  if (idx === 6 && f < 1216 && SCN[5]) { $('sc6').style.display = 'block'; $('sc6').style.zIndex = 1; $('sc7').style.zIndex = 2; SCN[5].update(SCN[5].b - SCN[5].a + (f - 1200), f); $('sc7').style.opacity = R2(E.inOutSine(seg(f, 1200, 1216))); }
  else if (idx !== 6) { $('sc6').style.zIndex = ''; }
  $('names').style.display = idx === 6 ? 'block' : 'none';
  // flash / dip / leak overlays
  let fl = 0, lk = 0, dip = 0;
  fl += kf(f, [[290, 0], [299, 0.95], [303, 0.95], [322, 0]], E.inOutSine);
  lk += kf(f, [[690, 0], [699, 1], [704, 1], [728, 0]], E.inOutSine) + kf(f, [[1196, 0], [1206, 0.9], [1214, 0.5], [1240, 0]], E.inOutSine) + kf(f, [[496, 0], [512, 0.55], [540, 0]], E.inOutSine);
  fl += kf(f, [[692, 0], [699, 0.75], [703, 0.75], [716, 0]], E.inOutSine);
  const dark = kf(f, [[992, 0], [999, 1], [1003, 1], [1014, 0]], E.inOutSine);
  flash.style.opacity = R2(Math.min(1, fl));
  leak.style.opacity = R2(Math.min(1, lk));
  // dip to black
  root.style.setProperty('--dark', dark);
  darkEl.style.opacity = R2(dark);

  // ---------- UI ----------
  const uAll = kf(f, [[0, 0], [14, 0], [1, 0]], E.lin);
  dgU.col.style.transform = `translateY(${-rollPos(f, UNITS, E.outQuart) * 236}px)`;
  dgT.col.style.transform = `translateY(${-rollPos(f, TENS, E.inOutCubic) * 236}px)`;
  // reveal of year block (fades in on S1, soft) and out on end card
  const yv = E.outCubic(seg(f, 8, 40)) * (1 - E.inOutSine(seg(f, 1420, 1450)));
  yearEl.style.opacity = R2(yv);
  yearEl.style.transform = `translateY(${R2((1 - E.outQuart(seg(f, 8, 44))) * 26)}px)`;
  // where + note
  whereEl.style.opacity = R2(yv * 0.9);
  whereSpans.forEach((s, i) => { const inn = E.inOutSine(seg(f, CUTS[i] + 8, CUTS[i] + 26)), out = i < 6 ? 1 - E.inOutSine(seg(f, CUTS[i + 1] - 3, CUTS[i + 1] + 6)) : 1 - E.inOutSine(seg(f, 1420, 1450)); s.style.opacity = R2(Math.min(inn, out)); s.style.transform = `translateX(${R2((1 - inn) * -12)}px)`; });
  noteSpans.forEach((s, i) => {
    const a = NOTE_AT[i], k = E.inOutSine(seg(f, a, a + NOTE_LEN[i] * 0.42));
    const out = i < 6 ? 1 - E.inOutSine(seg(f, CUTS[i + 1] - 4, CUTS[i + 1] + 4)) : 1 - E.inOutSine(seg(f, 1420, 1450));
    s.style.opacity = R2(out * (k > 0 ? 1 : 0));
    s.style.clipPath = `inset(-10px ${R2((1 - k) * 100)}% -10px 0)`;
    s.style.transform = `rotate(${NOTE_ROT[i]}deg)`;
  });
  // ruler
  const yc = kf(f, YEARKEY, E.inOutCubic), rx = yx(yc);
  $('rl').setAttribute('x2', R2(rx)); $('rd').setAttribute('cx', R2(rx)); $('rd2').setAttribute('cx', R2(rx));
  const pulse = 1 + 0.25 * Math.max(0, 1 - Math.abs(f - [0, 300, 500, 700, 900, 1000, 1200].reduce((b, c) => (f >= c ? c : b), 0) - 20) / 14);
  $('rd2').setAttribute('r', R2(13 * pulse));
  ruler.style.opacity = R2(E.outCubic(seg(f, 24, 60)) * (1 - E.inOutSine(seg(f, 1420, 1450))));
  // end card
  chEls.forEach((c, i) => { const a = 1430 + i * 2.6, k = E.outCubic(seg(f, a, a + 26)); c.style.opacity = R2(k); c.style.filter = `blur(${R2((1 - k) * 7)}px)`; c.style.transform = `translateY(${R2((1 - E.outQuart(seg(f, a, a + 32))) * 14)}px)`; });
  end2.style.opacity = R2(E.inOutSine(seg(f, 1500, 1540)));
  end2.style.letterSpacing = R2(lerp(0.5, 0.34, E.outQuart(seg(f, 1500, 1560))) * 1) + 'em';
  const fo = kf(f, [[1640, 0], [1699, 1]], E.inSine); // final fade to black handled by darkEl2
  // canvas fx
  fx.clearRect(0, 0, 1920, 1080);
  if (cur && cur.fx) cur.fx(fx, f - CUTS[idx], f);
  // film grain jitter
  const gi = Math.floor(f / 2), gr = rng(gi * 7 + 3);
  grainEl.style.backgroundPosition = `${Math.floor(gr() * 512)}px ${Math.floor(gr() * 512)}px`;
  finalEl.style.opacity = R2(Math.max(fo, 1 - E.outCubic(seg(f, 0, 14))));
}
const root = $('root');
const darkEl = document.createElement('div'); darkEl.style.cssText = 'position:absolute;inset:0;background:#0b0b12;opacity:0;pointer-events:none;z-index:40'; root.appendChild(darkEl);
const finalEl = document.createElement('div'); finalEl.style.cssText = 'position:absolute;inset:0;background:#0b0b12;opacity:0;pointer-events:none;z-index:41'; root.appendChild(finalEl);
['leak', 'vig', 'paper', 'grain', 'ui', 'flash'].forEach((id, i) => { $(id).style.zIndex = 10 + i; });


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
