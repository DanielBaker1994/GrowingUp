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
