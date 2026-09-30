/* scene9.js — S9: out through the window and all the way back to the lake. We start outside the glass, close on the three
   dogs peeking over the sill (Ruby, Wolfgang, Ludwig from the lake side), and pull back over the upper deck (the cat
   cut-out on its rail, the carved bear at the stairs), over the three at the lake-deck rail, out across the water, until
   the cottage sits head-on in its pines, as in the family's photo from the lake, with Dad in the kayak in front of us,
   looking back at the place. Dusk, lit windows. f 1900..2400 (local 0..500)

   World: metres. X right (seen from the lake), Y up from the water, Z out from the cottage's front wall toward the lake.
   The camera looks back at the cottage (toward -Z). Flat pieces stand at a depth Z and are drawn in centimetres. */
function makeDogFront(parent, o) {
  const c = Object.assign({ kind: 'schnauzer', body: '#1d1d24', furn: '#9a9ea8', collar: null }, o);
  const g = svgEl('g');
  const fl = (cx, cy, rx, ry, seed, col, n = 20, w = 0.16) => `<path fill="${col}" d="${blob(cx, cy, rx, ry, seed, n, w)}"/>`;
  let h = '';
  if (c.kind === 'schnauzer') {
    const B = c.body, F = c.furn, rim = shade(B, 0.16), FD = shade(F, -0.25);
    h = fl(0, -262, 30, 34, 50, B, 18, 0.1) + (c.collar ? `<path fill="${c.collar}" d="M-26 -272 Q0 -262 26 -272 L26 -264 Q0 -254 -26 -264Z"/><circle cx="0" cy="-256" r="3.4" fill="#c9b46a"/>` : '') +
      `<g class="pw">${fl(-25, -236, 12, 8, 51, F)}${fl(25, -236, 12, 8, 52, F)}<path fill="${FD}" d="M-31 -236 L-31 -231 M-25 -238 L-25 -231 M-19 -236 L-19 -231" stroke="${FD}" stroke-width="1.4"/><path fill="none" stroke="${FD}" stroke-width="1.4" d="M19 -236 L19 -231 M25 -238 L25 -231 M31 -236 L31 -231"/></g>` +
      `<g class="hd"><g class="el"><path fill="${shade(B, 0.2)}" d="M-30 -272 L-12 -282 L-8 -266 L-20 -248 L-33 -252Z"/></g><g class="er"><path fill="${shade(B, 0.2)}" d="M30 -272 L12 -282 L8 -266 L20 -248 L33 -252Z"/></g>` +
      fl(0, -250, 29, 30, 53, rim, 18, 0.08) + fl(0, -249, 27, 28, 54, B, 18, 0.08) +
      // brows, muzzle and beard in the grey furnishings
      `<path fill="${F}" d="M-25 -258 L-4 -264 L-2 -256 L-10 -252 L-24 -251Z"/><path fill="${F}" d="M25 -258 L4 -264 L2 -256 L10 -252 L24 -251Z"/>` +
      `<path fill="${F}" d="M-17 -246 Q0 -252 17 -246 L20 -222 Q12 -206 0 -202 Q-12 -206 -20 -222Z"/><path fill="${FD}" d="M-2 -234 L2 -234 L3 -210 L-3 -210Z" opacity=".5"/>` +
      `<g class="ey"><circle cx="-12" cy="-248" r="4.2" fill="#0d0c10"/><circle cx="12" cy="-248" r="4.2" fill="#0d0c10"/><circle cx="-10.6" cy="-249.6" r="1.3" fill="#f4f2ee"/><circle cx="13.4" cy="-249.6" r="1.3" fill="#f4f2ee"/></g>` +
      `<ellipse cx="0" cy="-238" rx="7.5" ry="5.2" fill="#121014"/><ellipse cx="-2" cy="-239.6" rx="2.2" ry="1.2" fill="#5a5a60"/></g>`;
  } else {
    const B = c.body, D = shade(B, -0.18), L = shade(B, 0.16);
    const curls = (cx, cy, rx, ry, seed, n) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()); s += `<circle cx="${R2(cx + Math.cos(a) * rx * d)}" cy="${R2(cy + Math.sin(a) * ry * d)}" r="${R2(3 + r() * 3.5)}" fill="${r() > 0.5 ? L : D}" opacity=".55"/>`; } return s; };
    h = fl(0, -262, 32, 34, 60, B) + curls(0, -262, 26, 28, 59, 16) + `<path fill="#1a1a1e" d="M-28 -270 Q0 -258 28 -270 L28 -262 Q0 -250 -28 -262Z"/>` +
      `<g class="pw">${fl(-27, -236, 13, 9, 61, B)}${fl(27, -236, 13, 9, 62, B)}${curls(-27, -236, 10, 6, 63, 5)}${curls(27, -236, 10, 6, 64, 5)}</g>` +
      `<g class="hd"><g class="el">${fl(-32, -238, 14, 30, 65, D)}${curls(-32, -238, 11, 26, 66, 10)}</g><g class="er">${fl(32, -238, 14, 30, 67, D)}${curls(32, -238, 11, 26, 68, 10)}</g>` +
      fl(0, -252, 32, 31, 69, B) + curls(0, -258, 28, 22, 70, 36) + fl(0, -232, 17, 14, 71, L) + curls(0, -230, 13, 10, 72, 10) +
      `<g class="ey"><circle cx="-12" cy="-250" r="4.3" fill="#140d0a"/><circle cx="12" cy="-250" r="4.3" fill="#140d0a"/><circle cx="-10.6" cy="-251.6" r="1.3" fill="#f6efe6"/><circle cx="13.4" cy="-251.6" r="1.3" fill="#f6efe6"/></g>` +
      `<ellipse cx="0" cy="-236" rx="7" ry="5" fill="#1a110d"/><ellipse cx="-2" cy="-237.4" rx="2" ry="1.1" fill="#6a4a3a"/></g>`;
  }
  g.innerHTML = h;
  parent.appendChild(g);
  const q = (s) => g.querySelector(s);
  const D = { g, hd: q('.hd'), el: q('.el'), er: q('.er'), ey: q('.ey'), pw: q('.pw') };
  /* x,y (feet, local units), s; tilt deg; turn px; bob px; perk 0..1 lifts the ears; look px moves the eyes */
  D.set = (p) => {
    g.setAttribute('transform', `translate(${R2(p.x)} ${R2(p.y)}) scale(${R2((p.s || 1) * 10000) / 10000})`);
    D.hd.setAttribute('transform', `translate(${R2(p.turn || 0)} ${R2((p.bob || 0) - 40)}) rotate(${R2(p.tilt || 0)} 0 -232)`);
    const pk = (p.perk || 0) * 8;
    D.el.setAttribute('transform', `rotate(${R2(pk)} -14 -272)`); D.er.setAttribute('transform', `rotate(${R2(-pk)} 14 -272)`);
    D.ey.setAttribute('transform', `translate(${R2(p.lookX || 0)} ${R2(p.lookY || 0)})`);
  };
  return D;
}

let S9; const initS9 = () => {
  S9 = (() => {
    const svg = $('sv9'), defs = svgEl('defs'); svg.appendChild(defs);
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const r = rng(9001);
    const F = 1080;
    let C = { x: 0, y: 6.5, z: 1.45 }, HZ = 540, SX = 0;
    const NEAR = 0.12;
    const cl = (x, y) => `${R2(x)} ${R2(y)}`;
    const P = (X, Y, d) => [960 + SX + (F * (X - C.x)) / d, HZ - (F * (Y - C.y)) / d];
    // horizontal/oblique pieces: clip against the near plane, then project
    const face = (pts, fill, extra = '') => {
      const q = pts.map((p) => [p[0], p[1], C.z - p[2]]), out = [];
      for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length], ia = a[2] >= NEAR, ib = b[2] >= NEAR; if (ia) out.push(a); if (ia !== ib) { const t = (NEAR - a[2]) / (b[2] - a[2]); out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), NEAR]); } }
      if (out.length < 3) return '';
      return `<path fill="${fill}" ${extra} d="M${out.map((p) => { const s = P(p[0], p[1], p[2]); return cl(s[0], s[1]); }).join(' L')}Z"/>`;
    };
    // flat cut-outs standing at depth Z, authored in cm with y down
    const BB = [];
    const bb = (Z, html = '', parent = svg) => { const g = svgEl('g'); parent.appendChild(g); if (html) g.innerHTML = html; const o = { g, Z }; BB.push(o); return o; };
    const place = (o) => { const d = C.z - o.Z; if (d < 0.25) { o.g.style.display = 'none'; return; } o.g.style.display = ''; const s = F / d; o.g.setAttribute('transform', `translate(${R2(960 + SX - s * C.x)} ${R2(HZ + s * C.y)}) scale(${Math.round((s / 100) * 1e5) / 1e5})`); };
    const plane = () => { const g = svgEl('g'); svg.appendChild(g); return g; };
    const cm = (v) => R2(v * 100), cmy = (v) => R2(-v * 100);
    const rect = (x0, y0, x1, y1, fill, extra = '') => `<path fill="${fill}" ${extra} d="M${cm(x0)} ${cmy(y0)} L${cm(x1)} ${cmy(y0)} L${cm(x1)} ${cmy(y1)} L${cm(x0)} ${cmy(y1)}Z"/>`;

    // ============ geometry ============
    const FLOOR = 5.6, SILL = 6.57, WTOP = 8.25, EAVE = 8.95, RIDGE = 10.9, RX = -0.1, WL = -6.6, WR = 6.4;
    const DWX0 = -2.4, DWX1 = 2.2; // the dogs' window
    const UDZ = 3.0, URT = 6.55; // upper deck front edge, rail top
    const LDY = 2.2, LDZ0 = 7.9, LDZ1 = 15.8, LDX0 = -5.5, LDX1 = 4.8; // lake deck
    const SHZ = 16.6; // waterline in front of the lake deck
    const KZ = 33.0, KX = -1.3; // Dad's seat in the kayak

    // ============ sky and water (screen space) ============
    const skyG = svgEl('g'); svg.appendChild(skyG);
    ins(skyG, `<rect x="-100" y="-100" width="2120" height="1300" fill="${grad(defs, [[0, '#a9a9c0'], [0.45, '#c9bfca'], [0.75, '#e2cdc8'], [1, '#efd6c4']])}"/>`);
    let clouds = '';
    for (let i = 0; i < 14; i++) { const x = r() * 2200 - 140, y = 60 + r() * 420; clouds += `<path fill="${['#efd9c6', '#f4e2c8', '#c9c3d2', '#f0cdb4', '#d9c9d6'][i % 5]}" opacity="${R2(0.35 + r() * 0.35)}" d="${blob(x, y, 160 + r() * 260, 8 + r() * 16, 9100 + i, 22, 0.2)}"/>`; }
    ins(skyG, clouds);
    const cloudG = skyG.lastChild;
    const WATER = grad(defs, [[0, '#2f3a3c'], [0.18, '#555a66'], [0.5, '#9a97aa'], [1, '#8a90a6']], 0, 1, 's9water');
    const BULB = radial(defs, [[0, '#ffe2a8', 0.95], [0.5, '#ffc27a', 0.4], [1, '#ffb070', 0]], 's9bulb');

    // ============ the hill behind: two bands of pine and spruce fading into the dusk ============
    const hill = (seed, top, amp, col, spires, w0 = -9000, w1 = 9000) => { const fn = ridgeFn(seed, top, amp); let d = `<path fill="${col}" d="${ridgePath(fn, seed, w0, w1, 60, 8, 400)}"/>`; d += `<path fill="${col}" d="${forest(fn, w0, w1, spires, 500, 1300, seed + 1, 30)}"/>`; return d; };
    bb(-70, hill(9011, -2400, 300, '#8e8fa6', 120, -14000, 14000));
    bb(-34, hill(9012, -2000, 220, '#6c7286', 90, -9000, 9000));
    // the dense stand of pine and hemlock right behind the cottage: rounded crowns, so the sky shows only above
    const canopyBand = (seed, top, amp, col, colHi, w0, w1) => { const fn = ridgeFn(seed, top, amp), q = rng(seed + 3); let d = `<path fill="${col}" d="${ridgePath(fn, seed, w0, w1, 80, 10, 600)}"/>`; for (let x = w0; x < w1; x += 90 + q() * 90) { const y = fn(x) + 40; d += `<path fill="${q() > 0.7 ? colHi : col}" d="${blob(x, y, 110 + q() * 120, 70 + q() * 70, Math.floor(q() * 1e6), 18, 0.35)}"/>`; } return d; };
    bb(-14, canopyBand(9013, -1700, 260, '#2c3936', '#33433d', -4200, 4200) + canopyBand(9014, -1250, 200, '#30403a', '#384a41', -4200, 4200));
    // tall white pines behind and around the cottage
    const whitePine = (x, base, h, seed, col, colD) => {
      const q = rng(seed); let d = `<path fill="${colD}" d="M${x - 30} ${base} L${x - 8} ${base - h} L${x + 8} ${base - h} L${x + 30} ${base}Z"/>`;
      const tiers = 6 + Math.floor(q() * 3);
      for (let i = 0; i < tiers; i++) {
        const t = i / tiers, y = base - h * (0.42 + 0.58 * t), side = i % 2 ? 1 : -1, len = (160 + q() * 260) * (1 - t * 0.55);
        d += `<path fill="${colD}" d="M${x} ${R2(y)} L${R2(x + side * len)} ${R2(y - 30 - q() * 40)} L${R2(x + side * len)} ${R2(y - 18 - q() * 30)} L${x} ${R2(y + 14)}Z"/>`;
        for (let k = 0; k < 4; k++) d += `<path fill="${col}" d="${blob(x + side * len * (0.3 + k * 0.24), y - 36 - q() * 24, 95 + q() * 90, 40 + q() * 24, Math.floor(q() * 1e6), 18, 0.42)}"/>`;
        if (q() > 0.4) d += `<path fill="${col}" d="${blob(x - side * len * 0.3, y - 20 - q() * 20, 70 + q() * 50, 32 + q() * 16, Math.floor(q() * 1e6), 16, 0.42)}"/>`;
      }
      d += `<path fill="${col}" d="${blob(x, base - h - 10, 60, 50, seed + 7, 16, 0.4)}"/>`;
      return d;
    };
    const spruce2 = (x, base, h, w, seed, col) => `<path fill="${col}" d="${spruce(x, base, h, w, seed)}"/>`;
    let bp = '';
    [[-1900, 3300, 9021], [-1100, 3600, 9022], [-300, 3900, 9023], [500, 3500, 9024], [1300, 3800, 9025], [2100, 3400, 9026], [2800, 3100, 9027]].forEach(([x, h, sd]) => { bp += whitePine(x, 500, h, sd, '#34423f', '#2a3533'); });
    bp += spruce2(-2600, 500, 2400, 700, 9028, '#2f3c3a') + spruce2(3400, 500, 2600, 760, 9029, '#2f3c3a');
    bb(-9, bp);
    // ============ inside the dogs' window: the pine room lit warm, the three at the sill ============
    // the great room behind the glass: knotty pine, a ceiling beam, lamp light
    let rm = `<rect x="-1400" y="-1500" width="2800" height="1000" fill="#b07844"/>`;
    for (let i = 0; i < 52; i++) rm += `<rect x="${-1400 + i * 54}" y="-1500" width="52" height="1000" fill="${['#b27a44', '#bd8650', '#a86f3c', '#b88048'][i % 4]}"/>`;
    for (let i = 0; i < 60; i++) { const q = rng(8800 + i); rm += `<ellipse cx="${R2(-1400 + q() * 2800)}" cy="${R2(-1480 + q() * 900)}" rx="${R2(3 + q() * 4)}" ry="${R2(2 + q() * 3)}" fill="#7a4c26" opacity=".6"/>`; }
    rm += `<rect x="-1400" y="-1180" width="2800" height="34" fill="#8a5a2c"/><rect x="-1400" y="-600" width="2800" height="100" fill="#7a4c26"/>`;
    rm += `<ellipse cx="-300" cy="-860" rx="900" ry="360" fill="${radial(defs, [[0, '#ffdca6', 0.75], [1, '#ffb070', 0]])}"/>`;
    const winClip = svgEl('clipPath', { id: 's9win' }); defs.appendChild(winClip); const winClipP = svgEl('path'); winClip.appendChild(winClipP);
    const roomG = svgEl('g', { 'clip-path': 'url(#s9win)' }); svg.appendChild(roomG);
    const room = bb(-3.0, rm, roomG);
    const dogsG = bb(-0.35, '', roomG);
    const ruby = makeDogFront(dogsG.g, { kind: 'doodle', body: '#b8754a' });
    const wolf = makeDogFront(dogsG.g, { kind: 'schnauzer', body: '#1d1d24', furn: '#9a9ea8', collar: '#2f7be0' });
    const lud = makeDogFront(dogsG.g, { kind: 'schnauzer', body: '#1d1d24', furn: '#8e929c', collar: '#15151a' });
    // ============ the cottage, from the lake ============
    const SID = '#3a4658', SIDD = '#303b4b', TRIM = '#dcd8d4', ROOF = '#2a2e33';
    let ct = '';
    // right wing (screened porch) set back a little, lower shed roof
    ct += rect(WR - 0.2, FLOOR - 0.4, 9.7, 8.5, SIDD) + rect(6.7, 6.2, 9.4, 8.0, '#2a2f38') + Array.from({ length: 5 }, (_, i) => rect(6.7 + i * 0.54, 6.2, 6.76 + i * 0.54, 8.0, TRIM)).join('') + rect(6.7, 6.95, 9.4, 7.02, TRIM);
    ct += `<path fill="${ROOF}" d="M${cm(WR - 0.3)} ${cmy(8.75)} L${cm(10.1)} ${cmy(8.2)} L${cm(10.1)} ${cmy(8.0)} L${cm(WR - 0.3)} ${cmy(8.5)}Z"/>`;
    // main wall with holes for every window
    const holes = [[-6.05, 6.7, -4.95, 8.05], [DWX0, SILL, DWX1, WTOP], [2.9, 6.7, 4.95, 8.1]];
    let wallD = `M${cm(WL)} ${cmy(FLOOR - 0.35)} L${cm(WR)} ${cmy(FLOOR - 0.35)} L${cm(WR)} ${cmy(EAVE)} L${cm(RX)} ${cmy(RIDGE)} L${cm(WL)} ${cmy(EAVE)}Z`;
    holes.forEach(([a, b, c, d]) => { wallD += ` M${cm(a)} ${cmy(b)} L${cm(c)} ${cmy(b)} L${cm(c)} ${cmy(d)} L${cm(a)} ${cmy(d)}Z`; });
    // gable triangles above the big window
    const rl = (x) => lerp(EAVE, RIDGE, 1 - Math.abs(x - RX) / (x < RX ? RX - WL : WR - RX));
    const triL = [[DWX0 + 0.15, 8.55], [RX - 0.12, 8.55], [RX - 0.12, rl(RX - 0.12) - 0.28]], triR = [[RX + 0.12, 8.55], [DWX1 - 0.15, 8.55], [RX + 0.12, rl(RX + 0.12) - 0.28]];
    [triL, triR].forEach((t) => { wallD += ` M${t.map((p) => `${cm(p[0])} ${cmy(p[1])}`).join(' L')}Z`; });
    const glassLit = grad(defs, [[0, '#ffe3b0'], [1, '#f2b774']]);
    // lit glass behind the holes (not the dogs' window, which shows the room)
    ct += rect(-6.05, 6.7, -4.95, 8.05, glassLit) + rect(2.9, 6.7, 4.95, 8.1, glassLit);
    [triL, triR].forEach((t) => { ct += `<path fill="${glassLit}" d="M${t.map((p) => `${cm(p[0])} ${cmy(p[1])}`).join(' L')}Z" opacity=".85"/>`; });
    ct += `<path fill="${SID}" fill-rule="evenodd" d="${wallD}"/>`;
    for (let y = FLOOR - 0.2; y < RIDGE; y += 0.2) ct += `<line x1="${cm(WL)}" x2="${cm(WR)}" y1="${cmy(y)}" y2="${cmy(y)}" stroke="#000" stroke-opacity=".12" stroke-width="2.2"/>`;
    // window frames and muntins
    const frame = (x0, y0, x1, y1, cols, rows, w = 0.07) => { let s = `<path fill="${TRIM}" fill-rule="evenodd" d="M${cm(x0 - 0.1)} ${cmy(y0 - 0.12)} L${cm(x1 + 0.1)} ${cmy(y0 - 0.12)} L${cm(x1 + 0.1)} ${cmy(y1 + 0.1)} L${cm(x0 - 0.1)} ${cmy(y1 + 0.1)}Z M${cm(x0)} ${cmy(y0)} L${cm(x1)} ${cmy(y0)} L${cm(x1)} ${cmy(y1)} L${cm(x0)} ${cmy(y1)}Z"/>`; for (let i = 1; i < cols; i++) { const x = lerp(x0, x1, i / cols); s += rect(x - w / 2, y0, x + w / 2, y1, TRIM); } rows.forEach((f) => { const y = lerp(y1, y0, f); s += rect(x0, y - w / 2, x1, y + w / 2, TRIM); }); return s; };
    ct += frame(-6.05, 6.7, -4.95, 8.05, 2, [0.5]) + frame(2.9, 6.7, 4.95, 8.1, 2, [0.5]);
    // the dogs' window: glass tint and dusk reflections first, then the grid (two units, three rows, as seen inside)
    const glassG = svgEl('g'); ct += `<g class="glass">` + rect(DWX0, SILL, DWX1, WTOP, '#e9dcd6', 'opacity=".1"') +
      [0, 1, 2, 3].map((i) => `<path fill="#fff" opacity=".1" d="M${cm(DWX0 + 0.3 + i * 1.2)} ${cmy(WTOP)} L${cm(DWX0 + 0.55 + i * 1.2)} ${cmy(WTOP)} L${cm(DWX0 + 0.05 + i * 1.2)} ${cmy(SILL)} L${cm(DWX0 - 0.2 + i * 1.2)} ${cmy(SILL)}Z"/>`).join('') + `</g>`;
    ct += frame(DWX0, SILL, DWX1, WTOP, 4, [0.25, 0.48], 0.06) + rect(RX - 0.05, SILL, RX + 0.05, WTOP, TRIM);
    ct += rect(DWX0 - 0.16, SILL - 0.16, DWX1 + 0.16, SILL - 0.04, '#cfcac4');
    [triL, triR].forEach((t) => { ct += `<path fill="none" stroke="${TRIM}" stroke-width="9" d="M${t.map((p) => `${cm(p[0])} ${cmy(p[1])}`).join(' L')}Z"/>`; });
    // roof: low gable facing the lake, white fascia
    ct += `<path fill="${ROOF}" d="M${cm(WL - 0.55)} ${cmy(EAVE - 0.2)} L${cm(RX)} ${cmy(RIDGE + 0.28)} L${cm(WR + 0.55)} ${cmy(EAVE - 0.2)} L${cm(WR + 0.55)} ${cmy(EAVE - 0.02)} L${cm(RX)} ${cmy(RIDGE + 0.5)} L${cm(WL - 0.55)} ${cmy(EAVE - 0.02)}Z"/>`;
    ct += `<path fill="none" stroke="${TRIM}" stroke-width="16" stroke-linejoin="round" d="M${cm(WL - 0.5)} ${cmy(EAVE - 0.08)} L${cm(RX)} ${cmy(RIDGE + 0.2)} L${cm(WR + 0.5)} ${cmy(EAVE - 0.08)}"/>`;
    ct += rect(WL - 0.08, FLOOR - 0.35, WL + 0.06, EAVE, TRIM) + rect(WR - 0.06, FLOOR - 0.35, WR + 0.08, EAVE, TRIM);
    // foundation lattice under the floor line
    ct += rect(WL, FLOOR - 1.4, WR + 3.3, FLOOR - 0.35, '#26282c');
    for (let x = WL; x < WR + 3.3; x += 0.3) ct += `<line x1="${cm(x)}" x2="${cm(x + 0.9)}" y1="${cmy(FLOOR - 1.4)}" y2="${cmy(FLOOR - 0.35)}" stroke="#44474c" stroke-width="3"/>`;
    const cottage = bb(0, ct);
    const glassEl = cottage.g.querySelector('.glass');
    // warm glows at the lit windows (on top, soft)
    const glowR = radial(defs, [[0, '#ffd08a', 0.55], [1, '#ffb070', 0]]);
    bb(0.02, [[-5.5, 7.4, 110], [3.9, 7.4, 150], [RX, 9.1, 180], [0, 7.6, 260], [8.0, 7.1, 150]].map(([x, y, rr]) => `<ellipse cx="${cm(x)}" cy="${cmy(y)}" rx="${rr * 1.6}" ry="${rr}" fill="${glowR}"/>`).join(''));

    const slopeG = plane();
    // ============ the upper deck ============
    const udFloor = plane();
    let chairs = '';
    [[-1.8, '#3b78b8'], [-0.7, '#4f9a5a'], [0.6, '#2f9a9a'], [1.7, '#3b78b8']].forEach(([x, col]) => { chairs += `<g transform="translate(${cm(x)} ${cmy(FLOOR)}) scale(0.86)"><path fill="${shade(col, -0.25)}" d="M-34 -2 L34 -2 L30 -40 L-30 -40Z"/><path fill="${col}" d="M-28 -40 L28 -40 L24 -98 Q0 -108 -24 -98Z"/>${[-14, 0, 14].map((k) => `<rect x="${k - 1}" y="-96" width="2" height="54" fill="${shade(col, -0.2)}"/>`).join('')}<path fill="${shade(col, 0.15)}" d="M-44 -46 L-26 -46 L-26 -40 L-44 -40Z M26 -46 L44 -46 L44 -40 L26 -40Z"/></g>`; });
    bb(2.45, chairs);
    // rail with string lights, the cat cut-out on the top rail (mirrored: we see it from the lake side), the bear by the stairs
    const RL = '#7a6654', RD = '#5a4a3c', RH = '#9a8672';
    let rlh = rect(WL - 0.2, URT - 0.06, WR + 0.2, URT + 0.02, RL) + rect(WL - 0.2, FLOOR + 0.06, WR + 0.2, FLOOR + 0.12, RD) + rect(WL - 0.25, FLOOR - 0.28, WR + 0.25, FLOOR, '#4a3f35');
    for (let x = WL - 0.15; x < WR + 0.2; x += 0.13) rlh += rect(x, FLOOR + 0.1, x + 0.04, URT - 0.05, RL);
    for (let x = WL - 0.2; x <= WR + 0.25; x += 1.8) rlh += rect(x - 0.05, FLOOR - 0.28, x + 0.05, URT + 0.06, RD);
    // posts down to the rock
    for (let x = WL; x <= WR; x += 2.6) rlh += rect(x - 0.07, FLOOR - 2.35, x + 0.07, FLOOR - 0.28, '#3e342b');
    let wire = `M${cm(WL)} ${cmy(URT - 0.1)}`; const bulbs = [];
    for (let x = WL; x < WR; x += 0.8) { wire += ` Q${cm(x + 0.4)} ${cmy(URT - 0.28)} ${cm(x + 0.8)} ${cmy(URT - 0.1)}`; bulbs.push(x + 0.4); }
    rlh += `<path fill="none" stroke="#1d1a18" stroke-width="2" d="${wire}"/>` + bulbs.map((x) => `<ellipse cx="${cm(x)}" cy="${cmy(URT - 0.22)}" rx="10" ry="10" fill="${BULB}"/><circle cx="${cm(x)}" cy="${cmy(URT - 0.21)}" r="2.2" fill="#fff0cc"/>`).join('');
    rlh += `<g transform="translate(${cm(-3.0)} ${cmy(URT + 0.02)}) scale(-0.42 0.42)"><path fill="#121014" d="M-40 0 L-38 -40 Q-40 -62 -34 -72 Q-44 -76 -50 -84 Q-58 -86 -60 -92 Q-58 -99 -52 -103 L-48 -118 L-38 -106 Q-32 -108 -28 -108 L-22 -120 L-20 -100 Q-18 -90 -16 -84 Q-4 -76 10 -60 Q30 -40 38 -20 Q44 -8 44 0Z"/><path fill="none" stroke="#121014" stroke-width="7" stroke-linecap="round" d="M38 -4 Q58 -8 62 -26 Q66 -44 56 -54 Q50 -60 56 -64"/></g>`;
    bb(UDZ, rlh);
    bb(UDZ - 0.1, `<g transform="translate(${cm(WL + 0.25)} ${cmy(FLOOR)}) scale(0.34)"><path fill="#7d5a3a" d="M-86 0 L-86 -110 L86 -110 L86 0Z"/><ellipse cx="0" cy="-110" rx="86" ry="18" fill="#a17a52"/><path fill="#171516" d="M-54 -112 L-46 -180 Q-64 -230 -58 -280 Q-54 -320 -30 -346 Q-40 -360 -38 -372 Q-52 -382 -50 -392 L-40 -410 Q-30 -426 -8 -428 L2 -444 L14 -432 Q28 -426 34 -410 Q44 -396 40 -372 Q60 -340 62 -290 Q66 -240 50 -180 L58 -112Z"/></g>`);
    // the big pine at the east end of the upper deck (the one over the cat's rail)
    bb(3.6, whitePine(cm(7.8), cmy(3.5), 2300, 9031, '#2f3d39', '#2a2623'));
    // ============ rock and junipers between the two decks, the inukshuk ============
    let rk = `<path fill="#5c5a58" d="M${cm(-16)} ${cmy(0)} L${cm(-16)} ${cmy(3.4)} Q${cm(-9)} ${cmy(4.4)} ${cm(-6.4)} ${cmy(4.9)} L${cm(7)} ${cmy(4.9)} Q${cm(11)} ${cmy(4.2)} ${cm(18)} ${cmy(2.6)} L${cm(18)} ${cmy(0)}Z"/>`;
    for (let i = 0; i < 40; i++) { const x = -15 + r() * 32, y = 0.4 + r() * 4.2; rk += `<path fill="${['#6e6c6a', '#7c7976', '#57534f', '#86827c'][Math.floor(r() * 4)]}" d="${blob(cm(x), cmy(y), 40 + r() * 90, 18 + r() * 30, 9040 + i, 12, 0.2)}"/>`; }
    for (let i = 0; i < 26; i++) { const x = -15 + r() * 32, y = 0.8 + r() * 3.8; rk += `<path fill="${['#3f5a3a', '#4e6a40', '#35503a', '#5d7a44'][i % 4]}" d="${blob(cm(x), cmy(y), 60 + r() * 80, 26 + r() * 20, 9070 + i, 18, 0.45)}"/>`; }
    for (let i = 0; i < 10; i++) { const x = -14 + r() * 30, y = 1 + r() * 3.4; rk += `<path fill="#d9c23a" opacity=".85" d="${blob(cm(x), cmy(y), 22, 8, 9100 + i, 12, 0.4)}"/>`; }
    rk += `<g transform="translate(${cm(-7.2)} ${cmy(2.7)}) scale(0.5)"><path fill="#4a4c50" d="${blob(0, -40, 46, 42, 8201, 12, 0.14)}"/><path fill="#56585c" d="M-70 -104 L66 -110 L60 -84 L-64 -80Z"/><path fill="#4f5156" d="M-50 -150 L48 -154 L44 -110 L-46 -106Z"/><path fill="#5d5f63" d="M-80 -180 L74 -186 L70 -156 L-76 -150Z"/><path fill="#4a4c50" d="M-40 -216 L40 -222 L38 -186 L-38 -182Z"/><path fill="#5a5c60" d="M-26 -246 L24 -250 L22 -222 L-24 -218Z"/></g>`;
    bb(5.0, rk);
    const stairsG = plane();
    // ============ the lake deck ============
    const ldFloor = plane();
    const ppl = bb(15.1);
    const dil = makePersonBack(ppl.g, { top: '#f1efe9', shorts: '#e7e6b8', skin: '#e6bf9c', hair: '#1c1714', pony: true, shoe: '#f0eee8', front: true });
    const son = makePersonBack(ppl.g, { top: '#243049', shorts: '#15161a', skin: '#e2b18e', hair: '#6a4a30', shoe: '#2a2b30', front: true });
    const dad = makePersonBack(ppl.g, { top: '#4c6fa4', shorts: '#1b1c20', skin: '#dfae8c', hair: '#8f8a86', bald: 1, shoe: '#e6e3dd', front: true });
    bb(14.2, `<g transform="translate(${cm(1.9)} ${cmy(LDY)}) scale(0.83)"><path fill="#9a2a26" d="M-50 -10 L60 -18 L50 20 L-60 30Z"/><path fill="#b8302c" d="M-30 -86 L40 -80 L36 -14 L-20 -20Z"/><path fill="#8a2420" d="M-58 -42 L-34 -40 L-40 22 L-56 22Z"/><path fill="#8a2420" d="M40 -36 L66 -34 L60 32 L40 30Z"/></g>` +
      `<g transform="translate(${cm(-0.8)} ${cmy(LDY)}) scale(0.7) translate(0 -60)"><path fill="none" stroke="#2a2a2e" stroke-width="5" d="M-40 60 L0 -70 M40 60 L10 -20 M-40 -10 L50 -20"/><path fill="#7a7c84" d="M-6 -86 L46 -80 L40 -10 L-20 -16Z"/><path fill="#60626a" d="M-40 -14 L50 -22 L56 -6 L-36 2Z"/></g>`);
    const ldSides = plane();
    let fr = rect(LDX0 - 0.1, 0.05, LDX1 + 0.1, LDY, '#a88d68');
    for (let x = LDX0; x < LDX1; x += 0.3) fr += rect(x, 0.05, x + 0.05, LDY, '#8f7657');
    fr += rect(LDX0 - 0.12, LDY - 0.12, LDX1 + 0.12, LDY + 0.02, '#8a6e4e') + rect(LDX0 - 0.1, 0.05, LDX1 + 0.1, 0.35, '#3a3632', 'opacity=".55"');
    fr += rect(LDX0, LDY, LDX1, LDY + 0.98, '#c9ccd0', 'opacity=".3"') + rect(LDX0 - 0.06, LDY + 0.96, LDX1 + 0.06, LDY + 1.04, '#a47a52');
    for (let x = LDX0; x <= LDX1 + 0.01; x += (LDX1 - LDX0) / 6) fr += rect(x - 0.045, LDY, x + 0.045, LDY + 1.04, '#94704c');
    // the stone crib at the waterline under it
    for (let i = 0; i < 26; i++) { const x = LDX0 - 0.6 + (i / 25) * (LDX1 - LDX0 + 1.2); fr += `<path fill="${['#6e6c6a', '#7c7976', '#5d5955'][i % 3]}" d="${blob(cm(x), cmy(0.12), 26 + r() * 20, 14 + r() * 8, 9150 + i, 10, 0.2)}"/>`; }
    bb(LDZ1, fr);
    // the water goes over everything behind the shoreline, so nothing standing back there shows below it
    const waterG = plane();
    // ============ shore, stone wall and cap, the float with the green canoe ============
    let sh = '';
    for (let i = 0; i < 70; i++) { const x = -34 + r() * 68; if (x > LDX0 - 0.8 && x < LDX1 + 0.8) continue; const y = r() * 0.9; sh += `<path fill="${['#5f5b57', '#6e6a66', '#7c7874', '#4e4a47'][Math.floor(r() * 4)]}" d="${blob(cm(x), cmy(y), 60 + r() * 120, 20 + r() * 40, 9200 + i, 12, 0.22)}"/>`; }
    for (let i = 0; i < 24; i++) { const x = -32 + r() * 64; if (x > LDX0 - 1 && x < LDX1 + 1) continue; sh += `<path fill="${['#3f5a3a', '#4e6a40', '#35503a'][i % 3]}" d="${blob(cm(x), cmy(1.0 + r() * 0.8), 80 + r() * 90, 36 + r() * 24, 9260 + i, 18, 0.45)}"/>`; }
    sh += rect(5.2, 0, 11.5, 1.0, '#6d6864') + rect(5.1, 1.0, 11.6, 1.14, '#b2aca2');
    for (let i = 0; i < 16; i++) sh += rect(5.3 + (i % 8) * 0.78, 0.1 + Math.floor(i / 8) * 0.44, 5.95 + (i % 8) * 0.78, 0.45 + Math.floor(i / 8) * 0.44, ['#8b857f', '#77726d', '#9a948c'][i % 3]);
    bb(SHZ + 0.3, sh);
    const floatG = plane();
    const canoe = bb(19.5, `<path fill="#2f6a4a" d="M${cm(7.0)} ${cmy(0.62)} Q${cm(8.4)} ${cmy(0.44)} ${cm(9.9)} ${cmy(0.62)} L${cm(9.7)} ${cmy(0.78)} Q${cm(8.4)} ${cmy(0.66)} ${cm(7.2)} ${cmy(0.78)}Z"/><path fill="#3f8a5e" d="M${cm(7.2)} ${cmy(0.78)} Q${cm(8.4)} ${cmy(0.66)} ${cm(9.7)} ${cmy(0.78)} L${cm(9.6)} ${cmy(0.82)} Q${cm(8.4)} ${cmy(0.72)} ${cm(7.3)} ${cmy(0.82)}Z"/>`);
    // ============ trees framing the shore, left and right ============
    let lt = '';
    for (let i = 0; i < 5; i++) lt += whitePine(cm(-13.5 - i * 2.2), cmy(0.6), 1600 + i * 280, 9300 + i, '#2d3b37', '#262320');
    lt += `<path fill="#34463c" d="${blob(cm(-10.5), cmy(2.4), 360, 260, 9310, 22, 0.35)}"/><path fill="#3e5244" d="${blob(cm(-10.1), cmy(2.9), 280, 200, 9311, 22, 0.35)}"/>`;
    bb(11.5, lt);
    let rt = '';
    for (let i = 0; i < 5; i++) rt += whitePine(cm(12.5 + i * 2.4), cmy(0.8), 2000 + i * 300, 9320 + i, '#2d3b37', '#262320');
    rt += spruce2(cm(11.2), cmy(0.8), 1500, 520, 9330, '#2c3a36');
    bb(12.5, rt);
    // ============ Dad in the kayak ============
    const kayakFar = plane();
    const kd = bb(KZ);
    const paddle = svgEl('g'); kd.g.appendChild(paddle);
    paddle.innerHTML = `<rect x="-110" y="-2.2" width="220" height="4.4" rx="2.2" fill="#2c2c30"/><path fill="#d8d3c8" d="M-138 -10 Q-114 -12 -106 -4 L-106 4 Q-114 12 -138 10Z"/><path fill="#d8d3c8" d="M138 -10 Q114 -12 106 -4 L106 4 Q114 12 138 10Z"/>`;
    const kdad = makePersonBack(kd.g, { top: '#4c6fa4', shorts: '#1b1c20', skin: '#dfae8c', hair: '#8f8a86', bald: 1, shoe: '#e6e3dd' });
    const pfd = svgEl('g'); kd.g.appendChild(pfd);
    pfd.innerHTML = `<path fill="#3d5a44" d="M-25 -170 Q0 -178 25 -170 L26 -112 Q0 -106 -26 -112Z"/><path fill="#2f4836" d="M-26 -126 Q0 -120 26 -126 L26 -112 Q0 -106 -26 -112Z"/><rect x="-18" y="-160" width="36" height="3" fill="#c9c3b3" opacity=".7"/><rect x="-18" y="-140" width="36" height="3" fill="#c9c3b3" opacity=".7"/>`;
    const kayakNear = plane();
    const ripG = plane();

    // ============ camera path ============
    // Z pulls back on a log scale (so the move feels even from nose-to-glass to the far water); height rides Z
    const Z0 = 1.25, Z1 = 36;
    const zAt = (f) => { const t = E.inOutSine(seg(f, 0, 336)); return Z0 * Math.pow(Z1 / Z0, t); };
    // smooth (Catmull-Rom) through the keys so the height never stalls between them
    const YK = [[Z0, 6.55], [3.4, 7.3], [9, 6.3], [15.1, 4.35], [21, 3.25], [28, 2.15], [33.4, 1.6], [Z1, 1.05]];
    const yAtZ = (z) => { const n = YK.length; if (z <= YK[0][0]) return YK[0][1]; if (z >= YK[n - 1][0]) return YK[n - 1][1]; let i = 0; while (z > YK[i + 1][0]) i++; const p0 = YK[Math.max(0, i - 1)], p1 = YK[i], p2 = YK[i + 1], p3 = YK[Math.min(n - 1, i + 2)], t = (z - p1[0]) / (p2[0] - p1[0]), h = p2[0] - p1[0]; const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0])) * h, m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0])) * h, t2 = t * t, t3 = t2 * t; return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2; };
    const TGT = (f, z) => { const k = E.inOutSine(seg(Math.log(z / Z0) / Math.log(Z1 / Z0), 0.0, 1.0)); return { x: lerp(0.14, 0.62, k), y: lerp(6.76, 6.9, k) }; };
    function camAt(f) {
      const z = zAt(f) + (f > 336 ? -0.25 * E.inOutSine(seg(f, 336, 500)) : 0), y = yAtZ(Math.min(z, Z1)) + 0.02 * Math.sin(f * 0.04), x = lerp(0.1, 0.2, seg(z, Z0, Z1));
      return { x, y, z, t: TGT(f, Math.max(Z0, Math.min(z, Z1))) };
    }

    function update(f) {
      const c = camAt(f); C = { x: c.x, y: c.y, z: c.z };
      const dT = C.z - 0; HZ = 540 + (F * (c.t.y - C.y)) / dT; SX = -(F * (c.t.x - C.x)) / dT;
      BB.forEach(place);
      cloudG.setAttribute('transform', `translate(${R2(f * 0.15)} 0)`);
      // water: from the waterline to the lens, pastel sky above, the pines' shadow near the shore
      if (C.z > SHZ + 0.3) {
        const yS = P(0, 0, C.z - SHZ)[1];
        let w = `<rect x="-100" y="${R2(yS)}" width="2120" height="${R2(Math.max(0, 1300 - yS))}" fill="${WATER}"/>`;
        for (let i = 0; i < 90; i++) { const q = rng(9400 + i), Z = SHZ + 0.5 + Math.pow(q(), 1.4) * (C.z - SHZ - 0.8), X = (q() - 0.5) * 2 * (6 + (C.z - Z) * 0.9), d = C.z - Z; if (d < 0.4) continue; const p = P(X, 0, d), wd = (0.8 + q() * 3.2) * F / d, hh = Math.max(1.2, (0.03 + q() * 0.05) * F / d); const col = Z < SHZ + 4 ? '#1f2628' : ['#efd9c6', '#f4e2c8', '#c9c3d2', '#f0cdb4', '#b9b6c8'][Math.floor(q() * 5)]; w += `<rect x="${R2(p[0] - wd / 2)}" y="${R2(p[1])}" width="${R2(wd)}" height="${R2(hh)}" rx="${R2(hh / 2)}" fill="${col}" opacity="${R2((0.25 + 0.3 * q()) * (0.7 + 0.3 * Math.sin(f * 0.06 + i)))}"/>`; }
        // the lit windows laid on the water in broken warm strokes
        [[-5.5, 0.9], [RX, 1.4], [3.9, 1.1], [8.0, 0.9], [-1.0, 0.5], [1.2, 0.5]].forEach(([X, wdt], j) => { for (let k = 0; k < 9; k++) { const q = rng(9500 + j * 20 + k), Z = SHZ + 0.6 + k * 0.9 + q() * 0.5, d = C.z - Z; if (d < 0.5) continue; const p = P(X + (q() - 0.5) * 0.4 + Math.sin(f * 0.05 + k) * 0.06, 0, d), wd = wdt * (0.5 + q()) * F / d; w += `<rect x="${R2(p[0] - wd / 2)}" y="${R2(p[1])}" width="${R2(wd)}" height="${R2(Math.max(1.4, 0.06 * F / d))}" fill="#ffc98a" opacity="${R2(0.28 + 0.2 * Math.sin(f * 0.09 + k * 1.7 + j))}"/>`; } });
        waterG.innerHTML = w;
      } else waterG.innerHTML = '';
      { const a0 = P(DWX0 - 0.05, WTOP + 0.05, C.z), a1 = P(DWX1 + 0.05, SILL - 0.05, C.z); winClipP.setAttribute('d', C.z > NEAR ? `M${cl(a0[0], a0[1])} L${cl(a1[0], a0[1])} L${cl(a1[0], a1[1])} L${cl(a0[0], a1[1])}Z` : ''); }
      slopeG.innerHTML = face([[-22, 4.25, -0.2], [24, 4.25, -0.2], [24, 2.0, 8.0], [-22, 2.0, 8.0]], '#4f4c49') + face([[-22, 2.0, 8.0], [24, 2.0, 8.0], [24, 0, 16.7], [-22, 0, 16.7]], '#46433f');
      // upper deck floor
      udFloor.innerHTML = face([[WL - 0.2, FLOOR, 0], [WR + 0.2, FLOOR, 0], [WR + 0.2, FLOOR, UDZ], [WL - 0.2, FLOOR, UDZ]], '#6f6254') + (() => { let s = ''; for (let i = 1; i < 12; i++) { const z = (i / 12) * UDZ; s += face([[WL - 0.2, FLOOR + 0.001, z], [WR + 0.2, FLOOR + 0.001, z], [WR + 0.2, FLOOR + 0.001, z + 0.02], [WL - 0.2, FLOOR + 0.001, z + 0.02]], '#5a4f44'); } return s; })();
      // the stairs down to the lake deck, at its west end
      { let s = ''; const n = 18, x0 = -6.4, x1 = -5.3; for (let i = 0; i < n; i++) { const y = FLOOR - (i + 1) * (FLOOR - LDY) / n, z0 = UDZ + i * 0.27, z1 = z0 + 0.27; s += face([[x0, y + (FLOOR - LDY) / n, z0], [x1, y + (FLOOR - LDY) / n, z0], [x1, y, z0], [x0, y, z0]], '#4e4238') + face([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], i % 2 ? '#7a6a58' : '#716251'); } s += face([[x1 + 0.02, FLOOR + 0.95, UDZ], [x1 + 0.08, FLOOR + 0.95, UDZ], [x1 + 0.08, LDY + 0.95, UDZ + n * 0.27], [x1 + 0.02, LDY + 0.95, UDZ + n * 0.27]], RL) + face([[x1, FLOOR, UDZ], [x1 + 0.05, FLOOR, UDZ], [x1 + 0.05, LDY - 0.3, UDZ + n * 0.27], [x1, LDY - 0.3, UDZ + n * 0.27]], '#54473b'); stairsG.innerHTML = s; }
      // lake deck floor and its side rails
      { let s = face([[LDX0, LDY, LDZ0], [LDX1, LDY, LDZ0], [LDX1, LDY, LDZ1], [LDX0, LDY, LDZ1]], '#9a8a72'); for (let i = 1; i < 26; i++) { const z = LDZ0 + (i / 26) * (LDZ1 - LDZ0); s += face([[LDX0, LDY + 0.001, z], [LDX1, LDY + 0.001, z], [LDX1, LDY + 0.001, z + 0.025], [LDX0, LDY + 0.001, z + 0.025]], '#7a6c58'); } ldFloor.innerHTML = s;
        let sd = ''; [LDX0, LDX1].forEach((X) => { sd += face([[X, LDY, LDZ0 + 1], [X, LDY, LDZ1], [X, LDY + 0.98, LDZ1], [X, LDY + 0.98, LDZ0 + 1]], '#c9ccd0', 'opacity=".28"') + face([[X - 0.05, LDY + 0.96, LDZ0 + 1], [X + 0.05, LDY + 0.96, LDZ0 + 1], [X + 0.05, LDY + 1.04, LDZ1], [X - 0.05, LDY + 1.04, LDZ1]], '#a47a52') + face([[X, 0.05, LDZ0 + 0.5], [X, 0.05, LDZ1], [X, LDY, LDZ1], [X, LDY, LDZ0 + 0.5]], '#977c5a'); }); ldSides.innerHTML = sd; }
      // the float the canoe sits on
      floatG.innerHTML = face([[6.6, 0.42, SHZ + 0.4], [10.4, 0.42, SHZ + 0.4], [10.4, 0.42, 21.6], [6.6, 0.42, 21.6]], '#8f8a84') + face([[6.6, 0.42, 21.6], [10.4, 0.42, 21.6], [10.4, 0.12, 21.6], [6.6, 0.12, 21.6]], '#5c5853');
      // the kayak: bow ahead of him (drawn behind), the cockpit rim and stern in front
      const hull = (s0, s1) => { const L = [], Rr = []; for (let i = 0; i <= 12; i++) { const s = lerp(s0, s1, i / 12), Z = lerp(KZ - 1.9, KZ + 1.8, s), w = 0.31 * Math.pow(Math.sin(Math.PI * s), 0.55); L.push([KX - w, 0.28, Z]); Rr.push([KX + w, 0.28, Z]); } return L.concat(Rr.reverse()); };
      const bobY = 0.015 * Math.sin(f * 0.07);
      kayakFar.innerHTML = face(hull(0, 0.52).map((p) => [p[0], 0.04 + bobY, p[2]]), '#6e2a20') + face(hull(0, 0.52).map((p) => [p[0], p[1] + bobY, p[2]]), '#9e3a2c') + face([[KX - 0.02, 0.29 + bobY, KZ - 1.85], [KX + 0.02, 0.29 + bobY, KZ - 1.85], [KX + 0.02, 0.29 + bobY, KZ - 0.4], [KX - 0.02, 0.29 + bobY, KZ - 0.4]], '#c0604a');
      kayakNear.innerHTML = face(hull(0.48, 1).map((p) => [p[0], 0.04 + bobY, p[2]]), '#6a281e') + face(hull(0.48, 1).map((p) => [p[0], p[1] + bobY, p[2]]), '#8e3326') + face([[KX - 0.3, 0.3 + bobY, KZ + 0.3], [KX + 0.3, 0.3 + bobY, KZ + 0.3], [KX + 0.28, 0.3 + bobY, KZ + 0.55], [KX - 0.28, 0.3 + bobY, KZ + 0.55]], '#1d1b1c');
      // Dad: shoulders into the paddle, one slow stroke on the right near the end, head turning a touch toward the house
      const stroke = E.inOutSine(seg(f, 372, 420)) * (1 - E.inOutSine(seg(f, 420, 470)));
      const breathe = Math.sin(f * 0.06);
      const KY = cmy(-0.72 + bobY), KS = 0.84, pa = (-3 + stroke * 24) * D2R, pc = [0, -140];
      const hand = (sd) => [pc[0] + sd * 46 * Math.cos(pa), pc[1] + sd * 46 * Math.sin(pa)];
      const hl = hand(-1), hr = hand(1), rl = kdad.reach(-1, hl[0], hl[1]), rr = kdad.reach(1, hr[0], hr[1]);
      kdad.set({ x: cm(KX), y: KY, s: KS, alA: rl.a, alK: rl.k, arA: rr.a, arK: rr.k, lean: 0, turn: -2 + 3 * E.inOutSine(seg(f, 300, 380)), nod: breathe * 0.6 });
      kdad.lg.style.display = 'none';
      pfd.setAttribute('transform', `translate(${cm(KX)} ${R2(KY)}) scale(${KS})`);
      paddle.setAttribute('transform', `translate(${cm(KX)} ${R2(KY)}) scale(${KS}) translate(${pc[0]} ${pc[1]}) rotate(${R2(pa / D2R)})`);
      // rings where the blade dipped, and the soft wake of the bob
      { let s = ''; if (f > 392) { const a = f - 392; for (let k = 0; k < 3; k++) { const age = a - k * 9; if (age <= 0 || age > 90) continue; const X = KX + 1.2, Z = KZ - 0.2, d = C.z - Z, p = P(X, 0, d), rr = 0.05 + age * 0.012; s += `<ellipse cx="${R2(p[0])}" cy="${R2(p[1])}" rx="${R2(rr * F / d)}" ry="${R2(rr * 0.22 * F / d)}" fill="none" stroke="#f4e2c8" stroke-width="2" opacity="${R2(0.5 * (1 - age / 90))}"/>`; } } ripG.innerHTML = s; }
      // the three at the lake-deck rail, facing us; the dogs at the sill looking down at them
      const br2 = Math.sin(f * 0.07);
      dil.set({ x: cm(-1.3), y: cmy(LDY), s: 0.83 * 0.95, alA: 14, arA: 20, turn: 2 * E.inOutSine(seg(f, 60, 120)), lean: 0.5 * br2 });
      son.set({ x: cm(-0.1), y: cmy(LDY), s: 0.83 * 1.02, alA: 6, arA: 6, lean: 0.6 * br2 });
      dad.set({ x: cm(1.25), y: cmy(LDY), s: 0.83, alA: 10, arA: 10, lean: -1 + br2 * 0.4, nod: Math.sin(f * 0.05) * 1.2 });
      const dogY = cmy(SILL) + 230 * 0.386;
      ruby.set({ x: cm(-0.97), y: dogY, s: 0.381, tilt: 8 * Math.sin(Math.min(1, f / 40) * Math.PI / 2) - 4 + 3 * Math.sin(f * 0.05), bob: Math.sin(f * 0.08) * 1.2, lookY: 1.4, lookX: 0.6, perk: 0.2 });
      wolf.set({ x: cm(0.17), y: dogY + 2, s: 0.392, tilt: -3 + 2 * Math.sin(f * 0.06 + 1), bob: Math.sin(f * 0.09 + 1) * 1.2, lookY: 1.6, perk: 0.5 + 0.5 * Math.sin(f * 0.03) });
      lud.set({ x: cm(1.25), y: dogY, s: 0.386, tilt: 4 + 2 * Math.sin(f * 0.05), bob: Math.sin(f * 0.07 + 2) * 1.2, lookY: 1.6, lookX: -0.6, perk: 0.3 });
      glassEl.setAttribute('opacity', R2(0.7 + 0.3 * seg(C.z, Z0, 6)));
    }
    function fx(ctx, f) {
      // fireflies along the shore once we are out on the water
      const k = seg(f, 250, 330);
      if (k <= 0) return;
      for (let i = 0; i < 26; i++) { const q = rng(9600 + i), X = -16 + q() * 32, Y = 0.6 + q() * 2.6, Z = 13 + q() * 5, d = C.z - Z; if (d < 1) continue; const p = P(X + Math.sin(f * 0.02 + i) * 0.3, Y + Math.sin(f * 0.03 + i * 2) * 0.15, d), on = Math.max(0, Math.sin(f * 0.07 + i * 2.3)); if (on < 0.2) continue; ctx.globalAlpha = k * on * 0.85; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 9); g.addColorStop(0, 'rgba(255,240,160,1)'); g.addColorStop(1, 'rgba(255,220,120,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    return { a: 1900, b: 2400, update, fx, camAt };
  })();
};
