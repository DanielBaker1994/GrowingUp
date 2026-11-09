/* props.js — the country house (gambrel roof, from the listing photo), reusable at any scale.
   Local origin: bottom centre of the front wall. Front wall spans x -340..340, eave at y -236. */
function gambrelHouse(opt = {}) {
  const o = Object.assign({ siding: '#a39a89', sidingSide: '#8f8777', roof: '#383b44', roofHi: '#4a4e58', trim: '#f6f3ec', glass: '#586b7a', glassLit: null, deck: '#a8814f', detail: 1 }, opt);
  const W = 340, EAVE = -236, BRK = -420, RIDGE = -484;
  let s = '';
  // gable end (right side, receding)
  s += `<path fill="${o.sidingSide}" d="M${W} 14 L${W + 180} 4 L${W + 180} ${EAVE} L${W + 158} ${BRK} L${W + 90} ${RIDGE + 2} L${W + 22} ${BRK} L${W} ${EAVE - 4}Z"/>`;
  if (o.detail) for (let x = W + 8; x < W + 180; x += 10) s += `<line x1="${x}" x2="${x}" y1="${R2(lerp(-300, -470, 1 - Math.abs((x - W - 90) / 90)))}" y2="${R2(12 - (x - W) * 0.05)}" stroke="#000" stroke-opacity=".08" stroke-width="1.4"/>`;
  s += `<path fill="#8a8781" d="M${W} -18 L${W + 180} -26 L${W + 180} 4 L${W} 14Z"/>`;
  s += `<path fill="none" stroke="${o.trim}" stroke-width="7" stroke-linejoin="round" d="M${W} ${EAVE - 4} L${W + 22} ${BRK} L${W + 90} ${RIDGE + 2} L${W + 158} ${BRK} L${W + 180} ${EAVE}"/>`;
  s += `<rect x="${W + 58}" y="-390" width="48" height="62" fill="${o.trim}"/><rect x="${W + 63}" y="-385" width="38" height="52" fill="${o.glassLit || o.glass}"/><rect x="${W + 81}" y="-385" width="2" height="52" fill="${o.trim}"/>`;
  s += `<rect x="${W + 70}" y="-190" width="44" height="58" fill="${o.trim}"/><rect x="${W + 75}" y="-185" width="34" height="48" fill="${o.glassLit || o.glass}"/>`;
  s += `<rect x="${W + 176}" y="${EAVE}" width="5" height="236" fill="${o.trim}"/>`;
  // front wall
  s += `<rect x="${-W}" y="${EAVE}" width="${2 * W}" height="${-EAVE}" fill="${o.siding}"/>`;
  if (o.detail) for (let x = -W + 9; x < W; x += 9) s += `<line x1="${x}" x2="${x}" y1="${EAVE}" y2="0" stroke="#000" stroke-opacity=".09" stroke-width="1.3"/>`;
  s += `<rect x="${-W}" y="-6" width="${2 * W}" height="20" fill="#8a8781"/>`;
  // openings (left → right): french door, porthole, door + lamp, shuttered window
  const pane = (x, y, w, h, cols, rows) => { let r = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.trim}"/><rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="${o.glassLit || o.glass}"/>`; for (let i = 1; i < cols; i++) r += `<rect x="${R2(x + 5 + ((w - 10) * i) / cols - 1)}" y="${y + 5}" width="2.4" height="${h - 10}" fill="${o.trim}"/>`; for (let j = 1; j < rows; j++) r += `<rect x="${x + 5}" y="${R2(y + 5 + ((h - 10) * j) / rows - 1)}" width="${w - 10}" height="2.4" fill="${o.trim}"/>`; return r; };
  s += pane(-300, -200, 64, 196, 2, 5);
  s += `<circle cx="-196" cy="-150" r="21" fill="${o.trim}"/><circle cx="-196" cy="-150" r="15" fill="${o.glassLit || o.glass}"/><line x1="-211" x2="-181" y1="-150" y2="-150" stroke="${o.trim}" stroke-width="2.4"/><line x1="-196" x2="-196" y1="-165" y2="-135" stroke="${o.trim}" stroke-width="2.4"/>`;
  s += `<rect x="-150" y="-204" width="60" height="200" fill="${o.trim}"/><rect x="-143" y="-197" width="46" height="193" fill="#e9e3d6"/>` + pane(-138, -190, 36, 80, 2, 3);
  s += `<rect x="-78" y="-226" width="7" height="12" fill="#20211f"/>`;
  s += `<rect x="58" y="-196" width="20" height="98" fill="${o.trim}"/><rect x="172" y="-196" width="20" height="98" fill="${o.trim}"/>` + pane(80, -196, 90, 98, 3, 2);
  if (o.detail) for (let y = -190; y < -100; y += 9) s += `<line x1="61" x2="75" y1="${y}" y2="${y}" stroke="#000" stroke-opacity=".1"/><line x1="175" x2="189" y1="${y}" y2="${y}" stroke="#000" stroke-opacity=".1"/>`;
  s += `<rect x="${W - 12}" y="${EAVE}" width="7" height="${-EAVE}" fill="${o.trim}"/>`;
  // roof: long side (steep lower slope + shallow upper), left end tucked into the trees
  s += `<path fill="${o.roof}" d="M${-W - 24} ${EAVE + 6} L${W + 6} ${EAVE + 6} L${W + 24} ${BRK} L${W + 90} ${RIDGE} L${-W + 70} ${RIDGE} L${-W} ${BRK}Z"/>`;
  s += `<path fill="${o.roofHi}" d="M${-W} ${BRK} L${W + 24} ${BRK} L${W + 90} ${RIDGE} L${-W + 70} ${RIDGE}Z"/>`;
  if (o.detail) { for (let y = EAVE - 8; y > BRK; y -= 14) s += `<line x1="${-W - 20}" x2="${W + 10}" y1="${y}" y2="${y}" stroke="#000" stroke-opacity=".18" stroke-width="1.2"/>`; for (let y = BRK - 12; y > RIDGE; y -= 12) s += `<line x1="${-W + 10}" x2="${W + 40}" y1="${y}" y2="${y}" stroke="#000" stroke-opacity=".14" stroke-width="1.1"/>`; }
  s += `<rect x="${-W - 26}" y="${EAVE}" width="${2 * W + 34}" height="8" fill="${o.trim}"/>`;
  s += `<rect x="30" y="${RIDGE - 22}" width="26" height="24" fill="#7a4a3c"/><rect x="27" y="${RIDGE - 26}" width="32" height="5" fill="#5a3a30"/>`;
  // dormers
  const dormer = (cx, w, top, bot, apex, vent) => {
    let d = `<path fill="${o.siding}" d="M${cx - w / 2} ${bot} L${cx - w / 2} ${top} L${cx} ${apex} L${cx + w / 2} ${top} L${cx + w / 2} ${bot}Z"/>`;
    if (o.detail) for (let x = cx - w / 2 + 8; x < cx + w / 2; x += 8) d += `<line x1="${x}" x2="${x}" y1="${R2(lerp(top, apex, 1 - Math.abs(x - cx) / (w / 2)))}" y2="${bot}" stroke="#000" stroke-opacity=".08" stroke-width="1.2"/>`;
    d += `<path fill="${o.roof}" d="M${cx - w / 2 - 16} ${top + 6} L${cx} ${apex - 14} L${cx + w / 2 + 16} ${top + 6} L${cx + w / 2 + 16} ${top + 14} L${cx} ${apex - 4} L${cx - w / 2 - 16} ${top + 14}Z"/>`;
    d += `<path fill="none" stroke="${o.trim}" stroke-width="6" d="M${cx - w / 2 - 14} ${top + 10} L${cx} ${apex - 8} L${cx + w / 2 + 14} ${top + 10}"/>`;
    if (vent) d += `<circle cx="${cx}" cy="${R2(lerp(top, apex, 0.45))}" r="${R2(w * 0.1)}" fill="${o.trim}"/><circle cx="${cx}" cy="${R2(lerp(top, apex, 0.45))}" r="${R2(w * 0.07)}" fill="${shade(o.siding, -0.2)}"/>`;
    return d;
  };
  s += dormer(-150, 110, -400, -300, -452, 1) + pane(-178, -388, 56, 80, 2, 2);
  s += dormer(150, 140, -432, -290, -500, 1) + pane(112, -414, 76, 110, 2, 3);
  // raised deck across the left of the front, with railing and steps
  s += `<rect x="-372" y="-62" width="400" height="12" fill="${shade(o.deck, -0.2)}"/><rect x="-372" y="-50" width="400" height="56" fill="${shade(o.deck, -0.4)}"/>`;
  if (o.detail) for (let x = -366; x < 26; x += 14) s += `<rect x="${x}" y="-50" width="7" height="56" fill="${shade(o.deck, -0.25)}"/>`;
  s += `<rect x="-372" y="-130" width="400" height="8" fill="${o.deck}"/>`;
  for (let x = -372; x <= 24; x += 48) s += `<rect x="${x}" y="-130" width="9" height="72" fill="${o.deck}"/>`;
  if (o.detail) for (let x = -360; x < 24; x += 12) s += `<rect x="${x}" y="-122" width="3" height="62" fill="${shade(o.deck, -0.1)}"/>`;
  s += `<path fill="${shade(o.deck, -0.15)}" d="M28 -62 L90 6 L60 6 L2 -62Z"/>`;
  // plants: ornamental grass clump, hostas along the foundation, a shrub
  const r = rng(77); let gr = '';
  for (let i = 0; i < 26; i++) { const x0 = -150 + (r() - 0.5) * 70, h = 150 + r() * 120, lean = (r() - 0.5) * 70; gr += `<path fill="${r() > 0.5 ? '#7c9a4a' : '#9ab35e'}" d="M${R2(x0 - 4)} 10 Q${R2(x0 + lean * 0.4)} ${R2(-h * 0.6)} ${R2(x0 + lean)} ${R2(-h)} Q${R2(x0 + lean * 0.3 + 3)} ${R2(-h * 0.55)} ${R2(x0 + 4)} 10Z"/>`; }
  s += gr;
  for (let i = 0; i < 8; i++) s += `<path fill="${i % 2 ? '#4f7f3c' : '#6a9a48'}" d="${blob(40 + i * 36, -10, 30, 20, 90 + i, 14, 0.22)}"/>`;
  s += `<path fill="#5f8a44" d="${blob(-40, -110, 60, 70, 97, 18, 0.2)}"/><path fill="#7aa052" d="${blob(-30, -130, 40, 46, 98, 16, 0.2)}" opacity=".8"/>`;
  s += `<path fill="none" stroke="#e8e6e0" stroke-width="5" d="M${W - 6} ${EAVE + 10} L${W - 6} 0 Q${W - 6} 14 ${W + 30} 16 L${W + 110} 18"/>`;
  return s;
}

/* a tall Muskoka white pine for the yard scenes: a long bare trunk, sparse flat tiers of needles high up */
function yardPine(x, base, h, seed, col = '#34573f', colD = '#2a4434', trunk = '#5c5046') {
  const q = rng(seed), k = h / 2600, tw = Math.max(3, 30 * k * 1.6);
  let d = `<path fill="${trunk}" d="M${R2(x - tw)} ${base} L${R2(x - tw * 0.3)} ${R2(base - h)} L${R2(x + tw * 0.3)} ${R2(base - h)} L${R2(x + tw)} ${base}Z"/>`;
  d += `<path fill="#000" opacity=".16" d="M${R2(x + tw * 0.2)} ${base} L${R2(x + tw * 0.05)} ${R2(base - h)} L${R2(x + tw * 0.3)} ${R2(base - h)} L${R2(x + tw)} ${base}Z"/>`;
  const tiers = 6 + Math.floor(q() * 3);
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers, y = base - h * (0.46 + 0.54 * t), side = i % 2 ? 1 : -1, len = (160 + q() * 260) * (1 - t * 0.55) * k;
    d += `<path fill="${colD}" d="M${x} ${R2(y)} L${R2(x + side * len)} ${R2(y - (30 + q() * 40) * k)} L${R2(x + side * len)} ${R2(y - (18 + q() * 30) * k)} L${x} ${R2(y + 14 * k)}Z"/>`;
    for (let j = 0; j < 4; j++) d += `<path fill="${j % 2 ? col : colD}" d="${blob(x + side * len * (0.3 + j * 0.24), y - (36 + q() * 24) * k, (95 + q() * 90) * k, (40 + q() * 24) * k, Math.floor(q() * 1e6), 16, 0.42)}"/>`;
    if (q() > 0.4) d += `<path fill="${col}" d="${blob(x - side * len * 0.3, y - (20 + q() * 20) * k, (70 + q() * 50) * k, (32 + q() * 16) * k, Math.floor(q() * 1e6), 14, 0.42)}"/>`;
  }
  d += `<path fill="${col}" d="${blob(x, base - h - 10 * k, 60 * k, 50 * k, seed + 7, 14, 0.4)}"/>`;
  return d;
}

/* a gravel two-track between two edge curves (cubic beziers, far end first): gravel, the grassy middle strip, speckle */
function gravelDrive(defs, L, R, o = {}) {
  const c = Object.assign({ far: '#9d927d', near: '#d3c6ac', mid: '#8d8f4e', needles: '#b0763e', speck: 60, seed: 77 }, o);
  const bz = (P, t) => { const u = 1 - t; return [0, 1].map((i) => u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i]); };
  const N = 28, at = (t, u) => { const a = bz(L, t), b = bz(R, t); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; };
  const strip = (u0, u1) => { let d = ''; for (let i = 0; i <= N; i++) { const p = at(i / N, u0); d += (i ? ' L' : 'M') + R2(p[0]) + ' ' + R2(p[1]); } for (let i = N; i >= 0; i--) { const p = at(i / N, u1); d += ' L' + R2(p[0]) + ' ' + R2(p[1]); } return d + 'Z'; };
  let s = `<path d="${strip(0, 1)}" fill="${grad(defs, [[0, c.far], [1, c.near]])}"/>`;
  s += `<path d="${strip(0.43, 0.57)}" fill="${c.mid}" opacity=".85"/>`;
  s += `<path d="${strip(0.46, 0.54)}" fill="${c.needles}" opacity=".45"/>`;
  s += `<path d="${strip(0, 0.05)}" fill="${c.needles}" opacity=".35"/><path d="${strip(0.95, 1)}" fill="${c.needles}" opacity=".35"/>`;
  const q = rng(c.seed);
  for (let i = 0; i < c.speck; i++) { const t = Math.sqrt(q()), u = q(); if (u > 0.4 && u < 0.6) continue; const p = at(t, u), r = 0.6 + t * 2.2; s += `<ellipse cx="${R2(p[0])}" cy="${R2(p[1])}" rx="${R2(r * 1.6)}" ry="${R2(r)}" fill="${q() > 0.5 ? '#efe6d2' : '#8c8270'}" opacity=".7"/>`; }
  return s;
}

/* the inukshuk on the granite in front of the cottage (from the family's photos): two stone legs, a hip slab, a
   stack, the long arm slab, the shoulders and the head. Drawn in centimetres, feet at y = 0, about 1.6 m tall. */
function inukshukSVG(seed = 8201) {
  const q = rng(seed), G = ['#8a8680', '#77736d', '#9a958d', '#6c6862', '#827d76'];
  const slab = (x0, x1, y0, y1, k) => { const j = () => (q() - 0.5) * 5; return `<path fill="${G[k % G.length]}" d="M${R2(x0 + j())} ${R2(y0 + j() * 0.4)} L${R2(x1 + j())} ${R2(y0 + j() * 0.4)} L${R2(x1 - 2 + j())} ${R2(y1 + j() * 0.4)} L${R2(x0 + 2 + j())} ${R2(y1 + j() * 0.4)}Z"/><path fill="#000" opacity=".16" d="M${R2(x0)} ${R2(y0)} L${R2(x1)} ${R2(y0)} L${R2(x1)} ${R2(y0 - 3)} L${R2(x0)} ${R2(y0 - 3)}Z"/>`; };
  let s = `<ellipse cx="0" cy="0" rx="62" ry="7" fill="#000" opacity=".22"/>`;
  s += `<path fill="${G[3]}" d="M-38 0 L-12 0 L-10 -58 Q-22 -66 -34 -60Z"/><path fill="${G[1]}" d="M10 0 L38 0 L34 -56 Q22 -64 12 -58Z"/>`;
  s += slab(-46, 48, -56, -74, 2) + slab(-36, 34, -74, -88, 0) + slab(-40, 42, -88, -104, 4) + slab(-30, 30, -104, -116, 1);
  s += slab(-74, 76, -116, -132, 2) + slab(-34, 36, -132, -146, 0) + slab(-26, 24, -146, -158, 3) + slab(-18, 20, -158, -176, 4);
  for (let i = 0; i < 16; i++) s += `<ellipse cx="${R2((q() - 0.5) * 90)}" cy="${R2(-10 - q() * 160)}" rx="${R2(2 + q() * 4)}" ry="${R2(1.2 + q() * 2)}" fill="${q() > 0.5 ? '#b9bca8' : '#6f7d4a'}" opacity=".8"/>`;
  return s;
}
/* a Muskoka chair seen from the front, in centimetres, feet at y = 0 */
function muskokaSVG(col) {
  return `<path fill="${shade(col, -0.25)}" d="M-34 -2 L34 -2 L30 -40 L-30 -40Z"/><path fill="${col}" d="M-28 -40 L28 -40 L24 -98 Q0 -108 -24 -98Z"/>${[-14, 0, 14].map((k) => `<rect x="${k - 1}" y="-96" width="2" height="54" fill="${shade(col, -0.2)}"/>`).join('')}<path fill="${shade(col, 0.15)}" d="M-44 -46 L-26 -46 L-26 -40 L-44 -40Z M26 -46 L44 -46 L44 -40 L26 -40Z"/><path fill="${shade(col, -0.35)}" d="M-40 -40 L-36 0 L-31 0 L-34 -40Z M40 -40 L36 0 L31 0 L34 -40Z"/>`;
}
/* a person sitting in a Muskoka chair, in the chair's own units (feet at y = 0, seat at y = -40). view 'front' faces us
   (S9, from the lake); view 'back' shows only the head and shoulders above the chair back (S7b, walking down from the
   cottage). lean tips the head toward the neighbour (deg). */
function sitterSVG(o) {
  const c = Object.assign({ view: 'front', top: '#4f7a6a', pants: '#3a3f4d', skin: '#e2b08e', hair: '#5a3d28', long: false, pony: false, hat: null, lean: 0, shoe: '#e6e3dd' }, o);
  const eyes = `<circle cx="-4.2" cy="-114" r="1.5" fill="#2a1d17"/><circle cx="4.2" cy="-114" r="1.5" fill="#2a1d17"/><path fill="none" stroke="#9a5a44" stroke-width="1.4" stroke-linecap="round" d="M-3.4 -107.5 Q0 -105.5 3.4 -107.5"/><ellipse cx="-7" cy="-109" rx="2.6" ry="1.7" fill="#e08a7a" opacity=".35"/><ellipse cx="7" cy="-109" rx="2.6" ry="1.7" fill="#e08a7a" opacity=".35"/>`;
  const hatS = c.hat ? `<path fill="${c.hat}" d="M-13 -119 Q0 -138 13 -119Z"/><rect x="-14" y="-123" width="28" height="6" rx="3" fill="${shade(c.hat, -0.2)}"/>` : '';
  if (c.view === 'back') {
    const hairB = c.long ? `<path fill="${c.hair}" d="M-13 -116 Q-16 -96 -11 -90 L11 -90 Q16 -96 13 -116Z"/>` : '';
    return `<g transform="rotate(${c.lean} 0 -96)"><rect x="-22" y="-100" width="44" height="14" rx="6" fill="${c.top}"/><rect x="-5" y="-106" width="10" height="9" fill="${shade(c.skin, -0.08)}"/>` +
      `<circle cx="-11.5" cy="-113" r="3.6" fill="${c.skin}"/><circle cx="11.5" cy="-113" r="3.6" fill="${c.skin}"/>${hairB}<circle cx="0" cy="-114" r="12" fill="${c.hair}"/>` +
      (c.pony ? `<path fill="${c.hair}" d="M-3 -116 Q9 -110 6 -92 Q1 -86 -2 -94 Q2 -104 -3 -110Z"/>` : '') + hatS + `</g>`;
  }
  const leg = (s) => `<path fill="${c.pants}" d="M${s * 16 - 6} -47 L${s * 16 + 6} -47 L${s * 15 + 5} -8 L${s * 15 - 5} -8Z"/><path fill="${shade(c.pants, -0.22)}" d="M${s * 15 - 5} -16 L${s * 15 + 5} -16 L${s * 15 + 5} -8 L${s * 15 - 5} -8Z"/><ellipse cx="${s * 15}" cy="-4.5" rx="9" ry="4.6" fill="${c.shoe}"/>`;
  const arm = (s) => `<path fill="none" stroke="${shade(c.top, -0.1)}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" d="M${s * 22} -90 L${s * 27} -66 L${s * 22} -52"/><circle cx="${s * 22}" cy="-49" r="4.6" fill="${c.skin}"/>`;
  const hairF = c.long ? `<path fill="${c.hair}" d="M-11 -120 Q-19 -118 -18 -100 Q-18 -90 -13 -86 L-8 -89 Q-11 -100 -10.5 -110Z M11 -120 Q19 -118 18 -100 Q18 -90 13 -86 L8 -89 Q11 -100 10.5 -110Z"/>` : '';
  return leg(-1) + leg(1) + `<ellipse cx="-16" cy="-45" rx="9" ry="5.5" fill="${shade(c.pants, 0.12)}"/><ellipse cx="16" cy="-45" rx="9" ry="5.5" fill="${shade(c.pants, 0.12)}"/>` +
    `<path fill="${c.pants}" d="M-22 -44 L22 -44 L21 -38 L-21 -38Z"/>` +
    `<path fill="${c.top}" d="M-21 -42 L21 -42 L23 -92 Q0 -99 -23 -92Z"/><path fill="${shade(c.top, -0.15)}" d="M-21 -46 L21 -46 L21 -42 L-21 -42Z"/>` + arm(-1) + arm(1) +
    `<g transform="rotate(${c.lean} 0 -96)"><rect x="-5" y="-106" width="10" height="12" fill="${shade(c.skin, -0.08)}"/>${hairF}<circle cx="-11.5" cy="-113" r="3.6" fill="${c.skin}"/><circle cx="11.5" cy="-113" r="3.6" fill="${c.skin}"/>` +
    `<circle cx="0" cy="-114" r="12" fill="${c.long || c.hat ? c.skin : c.skin}"/>` +
    `<path fill="${c.hair}" d="M-12.5 -116 Q-8 -128 2 -127 Q11 -127 12.5 -116 Q6 -121 -2 -120 Q-9 -120 -12.5 -116Z"/>` + eyes + hatS + `</g>`;
}
