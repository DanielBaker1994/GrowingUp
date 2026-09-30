/* scene3.js — S3 (October): standing the ramp up for winter, seen head-on from the floating dock, as in the
   family's photo: white pines over a granite face, the black hose down the slope, the carved bear on its stump,
   the stone wall and concrete cap, the mat-topped ramp from the slab ledge onto the weathered grey float.
   Dad lifts the lake end from the float; the older boy steadies the shore end and walks it up the rest of the way.
   f 500..700 (local 0..200) */
let S3; const initS3 = () => {
  S3 = (() => {
    const svg = $('sv3'), defs = svgEl('defs'); svg.appendChild(defs);
    const cam = svgEl('g'); svg.appendChild(cam);
    const L = {}; const layer = (n, h = '') => { const g = svgEl('g', {}, h); cam.appendChild(g); L[n] = g; return g; };
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const r = rng(5061);
    // ---- camera: standing on the float, eye 2 m over the water, looking square at the wall (lens shifted down) ----
    const F = 1000, HZ = 280, CAMH = 2.0, CX = 0.2;
    const P = (X, Y, Z) => [960 + (F * (X - CX)) / Z, HZ + (F * (CAMH - Y)) / Z, Z];
    const pt = (q) => `${R2(q[0])} ${R2(q[1])}`;
    const poly = (pts, fill, extra = '') => `<path fill="${fill}" ${extra} d="M${pts.map(pt).join(' L')}Z"/>`;
    const line = (a, b, col, w, extra = '') => `<line x1="${R2(a[0])}" y1="${R2(a[1])}" x2="${R2(b[0])}" y2="${R2(b[1])}" stroke="${col}" stroke-width="${w}" ${extra}/>`;
    const WZ = 7.0, WTOP = 1.0, CAPY = 1.12, CAPZ1 = 7.55; // wall face, wall top, cap top, cap back
    const SLY = 0.5, SLZ0 = 6.1; // slab ledge at the wall foot
    const FLY = 0.35, FLZ1 = 3.85; // float top, float far edge
    const yCap = P(0, CAPY, WZ)[1], yBase = P(0, 0, WZ)[1];
    layer('sky', `<rect x="-600" y="-300" width="3200" height="900" fill="${grad(defs, [[0, '#9cc3e4'], [1, '#e2ecee']])}"/>`);
    // ---- granite face under pine-needle duff, rising from the cap to the pines ----
    const rock = layer('rock');
    let top = `M-600 ${R2(yBase + 10)} L-600 150`;
    for (let x = -600; x <= 2600; x += 40) top += ` L${x} ${R2(150 + Math.sin(x * 0.004) * 30 + Math.sin(x * 0.013) * 12)}`;
    ins(rock, `<path d="${top} L2600 ${R2(yBase + 10)}Z" fill="${grad(defs, [[0, '#6a4232'], [0.55, '#7a4a36'], [1, '#6c4030']])}"/>`);
    const GR = ['#8e8a86', '#a8a29b', '#9b928d', '#b3a79f', '#86817d', '#a09a96', '#7f7b78'];
    let slabs = '';
    for (let i = 0; i < 70; i++) {
      const t = r(), cx = r() * 3000 - 500, cy = 200 + Math.pow(t, 0.8) * (yCap - 230), sc = 0.6 + t * 0.5, w = (60 + r() * 200) * sc, h = (36 + r() * 100) * sc, k = r() * 0.3 - 0.15;
      const pts = [[cx - w / 2, cy + h / 2], [cx - w / 2 + r() * 20, cy - h / 2 + r() * 20], [cx + w * (r() * 0.3), cy - h / 2 - r() * 14], [cx + w / 2, cy - h / 2 + r() * 30], [cx + w / 2 - r() * 20, cy + h / 2]];
      slabs += `<path fill="${GR[Math.floor(r() * GR.length)]}" d="M${pts.map((p) => `${R2(p[0])} ${R2(p[1] + (p[0] - cx) * k)}`).join(' L')}Z"/>`;
      slabs += `<path fill="#4a4442" opacity=".35" d="M${R2(cx - w / 2)} ${R2(cy + h / 2 - (w / 2) * k)} L${R2(cx + w / 2 - 20)} ${R2(cy + h / 2 + (w / 2) * k)} L${R2(cx + w / 2 - 22)} ${R2(cy + h / 2 + (w / 2) * k + 7)} L${R2(cx - w / 2)} ${R2(cy + h / 2 - (w / 2) * k + 7)}Z"/>`;
      for (let j = 0; j < 4; j++) slabs += `<circle cx="${R2(cx + (r() - 0.5) * w * 0.8)}" cy="${R2(cy + (r() - 0.5) * h * 0.7)}" r="${R2(3 + r() * 8)}" fill="${r() > 0.5 ? '#c9cfb4' : '#dfe3d3'}" opacity=".28"/>`;
    }
    ins(rock, slabs);
    // fallen leaves on the duff (it is October)
    let lv = '';
    for (let i = 0; i < 90; i++) { const x = r() * 2800 - 400, y = 190 + r() * (yCap - 200); lv += `<ellipse cx="${R2(x)}" cy="${R2(y)}" rx="${R2(3 + r() * 4)}" ry="${R2(1.5 + r() * 2)}" fill="${['#d9762b', '#b8402a', '#e7b53a', '#c8582a'][Math.floor(r() * 4)]}" opacity=".75" transform="rotate(${Math.floor(r() * 180)} ${R2(x)} ${R2(y)})"/>`; }
    ins(rock, lv);
    // juniper spilling over the rock by the water, right of the wall
    for (let i = 0; i < 10; i++) { const x = 1130 + r() * 1200, y = yCap - 40 + r() * 70; for (let k = 0; k < 3; k++) ins(rock, `<path fill="${['#58703a', '#7c8a44', '#9a9a52'][k]}" d="${blob(x + k * 18, y - k * 10, 100 - k * 24, 34 - k * 6, 5300 + i * 7 + k, 22, 0.42)}"/>`); }
    // black corrugated hose from the top of the slope, behind the bear, over the rock into the lake
    const hx = P(1.65, 0, WZ)[0];
    const hose = `M-80 170 C160 240 420 330 640 390 S${R2(hx - 40)} ${R2(yCap - 30)} ${R2(hx)} ${R2(yCap + 6)} L${R2(hx + 12)} ${R2(yBase + 4)}`;
    ins(rock, `<path fill="none" stroke="#121212" stroke-width="13" stroke-linecap="round" d="${hose}"/><path fill="none" stroke="#2e2e2e" stroke-width="13" stroke-dasharray="2.5 5" d="${hose}"/>`);
    // white pines: dark trunks, a dense layered crown across the top of frame; the cottage deck peeks in at top left
    const pines = layer('pines');
    let pp = `<g><path fill="#e9e6de" d="M-200 90 L260 70 L270 150 L-200 170Z"/><path fill="#c9c4b8" d="M-200 150 L270 132 L270 150 L-200 170Z"/>`;
    for (let x = -180; x < 270; x += 26) pp += `<rect x="${x}" y="${R2(40 + (x + 200) * -0.04)}" width="6" height="56" fill="#f1efe8"/>`;
    pp += `<rect x="-200" y="${R2(34)}" width="470" height="9" fill="#f6f4ee" transform="rotate(-2.4 35 38)"/></g>`;
    [[-380, 12, 1], [60, 15, 2], [520, 11, 3], [980, 16, 4], [1420, 12, 5], [1860, 14, 6], [2300, 12, 7]].forEach(([x, w, s]) => {
      const q = rng(5100 + s), lean = (q() - 0.5) * 60;
      pp += `<path fill="#3a2e27" d="M${x - w} 260 L${R2(x + lean - w * 0.5)} -60 L${R2(x + lean + w * 0.5)} -60 L${x + w} 260Z"/>`;
      for (let b = 0; b < 3; b++) { const y = 90 + b * 50, side = b % 2 ? 1 : -1; pp += `<path fill="#3a2e27" d="M${R2(x + lean * (1 - y / 260))} ${y} L${R2(x + side * (90 + q() * 60))} ${R2(y - 50)} L${R2(x + side * (90 + q() * 60))} ${R2(y - 42)}Z"/>`; }
    });
    const crown = (cx, cy, rx, seed) => { const q = rng(seed); let d = ''; for (let i = 0; i < 9; i++) { const x = cx + (q() - 0.5) * rx * 2, y = cy + (q() - 0.5) * 80; d += `<path fill="${['#2c4f2e', '#3b6534', '#4f7e3c', '#6c9a4a'][Math.min(3, Math.floor(q() * 4))]}" d="${blob(x, y, 70 + q() * 70, 22 + q() * 16, Math.floor(q() * 1e6), 20, 0.34)}"/>`; } return d; };
    for (let i = 0; i < 9; i++) pp += crown(-500 + i * 360, 10 + (i % 2) * 40, 220, 5150 + i);
    for (let i = 0; i < 8; i++) pp += crown(-320 + i * 380, 110 + (i % 3) * 18, 150, 5170 + i);
    // a low pine bough sweeping over the rock at left, as in the photo
    pp += `<path fill="none" stroke="#3a2e27" stroke-width="9" d="M300 60 Q420 170 640 250"/>` + crown(520, 230, 150, 5199);
    ins(pines, pp);
    // ---- water (drawn first: everything below sits on it) ----
    const wat = layer('wat');
    ins(wat, `<rect x="-600" y="${R2(yBase - 20)}" width="3200" height="700" fill="${grad(defs, [[0, '#2c241c'], [0.4, '#342a20'], [1, '#1b1611']])}"/>`);
    const refl = svgEl('g', { opacity: 0.22 }); wat.appendChild(refl);
    let rf = '';
    for (let i = 0; i < 60; i++) { const Z = 4.4 + r() * 2.5, X = -6 + r() * 12, p = P(X, 0, Z), w = (0.3 + r() * 1.2) * F / Z; rf += `<rect class="rp" x="${R2(p[0] - w / 2)}" y="${R2(p[1])}" width="${R2(w)}" height="${R2(1.2 + 6 / Z)}" rx="1" fill="#e6eef2" opacity=".2" data-p="${R2(r() * 6)}"/>`; }
    ins(wat, rf);
    const rps = [...wat.querySelectorAll('.rp')];
    // ---- stone wall, concrete cap; natural granite shore to the right ----
    const wall = layer('wall');
    const WX1 = 1.75; // wall ends here; granite beyond
    const wl0 = P(-14, WTOP, WZ), wr0 = P(WX1, 0, WZ);
    let st = `<rect x="${R2(wl0[0])}" y="${R2(wl0[1])}" width="${R2(wr0[0] - wl0[0])}" height="${R2(wr0[1] - wl0[1])}" fill="#4a4642"/>`;
    for (let y = wl0[1] + 2; y < wr0[1] - 3;) { const h = 8 + r() * 8; for (let x = wl0[0]; x < wr0[0];) { const w = 22 + r() * 50; const x1 = Math.min(x + w, wr0[0]); st += `<path fill="${['#8b857f', '#77726d', '#9a948c', '#6d6864', '#a39c92'][Math.floor(r() * 5)]}" d="M${R2(x + 1.5)} ${R2(y + 1.5)} L${R2(x1 - 1.5)} ${R2(y + 1 + r() * 2)} L${R2(x1 - 2)} ${R2(y + h - 1)} L${R2(x + 2)} ${R2(y + h - r() * 2)}Z"/>`; x += w; } y += h; }
    st += `<rect x="${R2(wl0[0])}" y="${R2(wr0[1] - 16)}" width="${R2(wr0[0] - wl0[0])}" height="16" fill="#1c1812" opacity=".55"/>`; // wet band at the waterline
    const c0 = P(-14, CAPY, WZ), c1 = P(WX1 + 0.05, WTOP, WZ), cb0 = P(-14, CAPY, CAPZ1), cb1 = P(WX1 + 0.05, CAPY, CAPZ1);
    st += poly([cb0, cb1, [c1[0], c0[1]], c0], '#cfc9bf') + `<rect x="${R2(c0[0])}" y="${R2(c0[1])}" width="${R2(c1[0] - c0[0])}" height="${R2(c1[1] - c0[1])}" fill="#b2aca2"/>`;
    // granite shore right of the wall: a dark wet shelf at the waterline, lichen on top
    const g0 = P(WX1, CAPY + 0.1, WZ), g1 = P(9, 0.25, WZ - 0.6), g2 = P(9, 0, WZ - 0.6), g3 = P(WX1, 0, WZ);
    st += `<path fill="#5f5953" d="M${pt(g0)} Q${R2(g0[0] + 120)} ${R2(g0[1] + 40)} ${R2(g0[0] + 280)} ${R2(g1[1] - 20)} L${pt(g1)} L${pt(g2)} L${pt(g3)}Z"/>`;
    st += `<path fill="#1e1a15" opacity=".8" d="M${R2(g3[0])} ${R2(g3[1] - 14)} Q${R2(g3[0] + 300)} ${R2(g3[1] - 22)} ${R2(g2[0])} ${R2(g2[1] - 24)} L${pt(g2)} L${pt(g3)}Z"/>`;
    for (let i = 0; i < 14; i++) st += `<circle cx="${R2(g0[0] + 40 + r() * 700)}" cy="${R2(g0[1] + 30 + r() * 50)}" r="${R2(4 + r() * 9)}" fill="#c9cfb4" opacity=".3"/>`;
    ins(wall, st);
    // the carved bear on its stump, on the cap right of the ramp
    const bp = P(1.38, CAPY, 7.3), bs = (F / 7.3 / 100) * 0.74;
    ins(wall, `<g transform="translate(${R2(bp[0])} ${R2(bp[1])}) scale(${R2(bs * 1000) / 1000})"><ellipse cx="0" cy="2" rx="34" ry="6" fill="#000" opacity=".25"/><rect x="-24" y="-48" width="48" height="48" rx="5" fill="#b07a44"/><ellipse cx="0" cy="-48" rx="24" ry="5" fill="#caa06a"/>` + [0, 1, 2].map((i) => `<line x1="${-14 + i * 12}" x2="${-12 + i * 12}" y1="-40" y2="-6" stroke="#8a5a30" stroke-width="2"/>`).join('') +
      `<path fill="#151414" d="${blob(0, -82, 20, 34, 5401, 16, 0.12)}"/><path fill="#151414" d="${blob(0, -124, 17, 15, 5402, 14, 0.1)}"/><circle cx="-12" cy="-137" r="6" fill="#151414"/><circle cx="12" cy="-137" r="6" fill="#151414"/><path fill="#c08a3c" d="M-7 -122 Q0 -126 7 -122 L6 -112 Q0 -109 -6 -112Z"/><circle cx="0" cy="-121" r="2.4" fill="#1a120c"/><circle cx="-6" cy="-129" r="1.6" fill="#d9b070"/><circle cx="6" cy="-129" r="1.6" fill="#d9b070"/>` +
      `<path fill="#fff4dc" opacity=".14" d="M12 -110 Q24 -80 16 -52 L10 -54 Q16 -80 8 -108Z"/></g>`);
    // ---- the slab ledge at the wall foot (the ramp's shore end sits on it; the yellow rope is tied off here) ----
    const slab = layer('slab');
    const SX0 = -3.6, SX1 = 1.5;
    let sl = poly([P(SX0, SLY, SLZ0), P(SX1, SLY, SLZ0), P(SX1, SLY, WZ), P(SX0, SLY, WZ)], '#a49d92');
    sl += poly([P(SX0, SLY, SLZ0), P(SX1, SLY, SLZ0), P(SX1, 0, SLZ0), P(SX0, 0, SLZ0)], '#6e6760') + poly([P(SX0, 0.14, SLZ0), P(SX1, 0.14, SLZ0), P(SX1, 0, SLZ0), P(SX0, 0, SLZ0)], '#1e1a15', 'opacity=".7"');
    sl += poly([P(SX0, SLY, SLZ0), P(SX1, SLY, SLZ0), P(SX1, SLY - 0.03, SLZ0), P(SX0, SLY - 0.03, SLZ0)], '#c3bcb1');
    for (let i = 0; i < 10; i++) { const X = SX0 + r() * (SX1 - SX0), Z = SLZ0 + 0.1 + r() * 0.8, p = P(X, SLY, Z); sl += `<ellipse cx="${R2(p[0])}" cy="${R2(p[1])}" rx="${R2(10 + r() * 16)}" ry="${R2(2 + r() * 2)}" fill="#8a837a" opacity=".5"/>`; }
    const rope = P(-3.1, SLY, 6.5);
    sl += `<ellipse cx="${R2(rope[0])}" cy="${R2(rope[1])}" rx="26" ry="5" fill="none" stroke="#e8d23a" stroke-width="3.5"/><ellipse cx="${R2(rope[0] + 2)}" cy="${R2(rope[1] - 2)}" rx="16" ry="3.5" fill="none" stroke="#e8d23a" stroke-width="3"/>`;
    ins(slab, sl);
    const ropeLine = svgEl('path', { fill: 'none', stroke: '#e8d23a', 'stroke-width': 3, 'stroke-linecap': 'round' }); slab.appendChild(ropeLine);
    // ---- mom, the youngest and the dogs up on the cap, watching ----
    const capAct = layer('capAct');
    const ZC = 7.3, ppm = F / ZC, yC = P(0, CAPY, ZC)[1];
    const X2S = (X) => 960 + (F * (X - CX)) / ZC;
    const mom = makePerson(capAct, { coat: '#c8402e', pants: '#2b3345', hat: '#f0c56a', hair: '#6a4630', scarf: '#f4ead6', mitt: '#f0c56a', tool: `<g transform="translate(0 -81)"><rect x="-2" y="-230" width="4" height="330" fill="#8a6a48"/><path d="M-2 -230 q22 -6 26 14 l-6 2 q-4 -8 -20 -6Z" fill="#9aa2aa"/></g>` });
    const son2 = makePerson(capAct, { coat: '#3f78c4', pants: '#2a3550', hat: '#d64a3a', pom: true, hair: '#7a5030', kid: 0.75, mitt: '#d64a3a', tool: `<g transform="translate(0 -81)"><rect x="-2.5" y="-6" width="5" height="44" fill="#8a6a48"/><path d="M-12 36 L12 36 L10 50 L-10 50Z" fill="#7c8590"/></g>` });
    const shih = makeDog(capAct, { kind: 'shihpoo', body: '#17161c', dark: '#26242d', old: 0.9 });
    const schn = makeDog(capAct, { kind: 'schnauzer', body: '#8b8f98', dark: '#6a6e78', beard: '#e2e4ea', old: 0.15 });
    const PS = 1.66 * ppm / 192, DS = 0.36 * ppm / 80; // person / dog rig scale on the cap
    // ---- the ramp: a plank deck on three stringers, black rubber mat on the shore end ----
    const rampL = layer('ramp');
    const rampRefl = svgEl('g', { opacity: 0.18 }); refl.appendChild(rampRefl);
    const RL = 3.2, RW = 1.2, RT = 0.18, RXC = -1.2, HZH = 6.95, HYH = SLY; // hinge line = underside of the shore end
    const CAMP = [CX, CAMH, 0];
    const rampPt = (th, a, w, n, mirror) => { const s = Math.sin(th * D2R), c = Math.cos(th * D2R); const Y = HYH + a * s + n * c; return P(RXC + w, mirror ? -Y : Y, HZH - a * c + n * s); };
    const rampW = (th, a, w, n) => { const s = Math.sin(th * D2R), c = Math.cos(th * D2R); return [RXC + w, HYH + a * s + n * c, HZH - a * c + n * s]; };
    const dot3 = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    const sub3 = (u, v) => [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
    function rampSVG(th, mirror) {
      const s = Math.sin(th * D2R), c = Math.cos(th * D2R);
      const Q = (a, w, n) => rampPt(th, a, w, n, mirror);
      const N = [0, c, s], D = [0, s, -c];
      const W2 = RW / 2; let h = '';
      const vis = (p, n) => dot3(sub3(CAMP, p), n) > 0;
      const topVis = vis(rampW(th, 0, 0, RT), N), botVis = !topVis;
      // right rim (camera is to the right of the ramp)
      h += poly([Q(0, W2, 0), Q(RL, W2, 0), Q(RL, W2, RT), Q(0, W2, RT)], '#a0988b', 'stroke="#3a352e" stroke-width="1.5" stroke-linejoin="round"');
      h += poly([Q(0, W2, 0), Q(RL, W2, 0), Q(RL, W2, 0.035), Q(0, W2, 0.035)], '#5d564c');
      h += line(Q(0, W2, RT), Q(RL, W2, RT), '#d8d2c6', 2);
      if (vis(rampW(th, RL, 0, RT / 2), D)) h += poly([Q(RL, -W2, 0), Q(RL, W2, 0), Q(RL, W2, RT), Q(RL, -W2, RT)], '#8a8275');
      if (topVis) {
        h += poly([Q(0, -W2, RT), Q(RL, -W2, RT), Q(RL, W2, RT), Q(0, W2, RT)], '#b2ac9f', 'stroke="#3a352e" stroke-width="1.5" stroke-linejoin="round"');
        for (let a = 0.14, k = 0; a < RL; a += 0.14, k++) { if (k % 3 === 1) h += poly([Q(a - 0.13, -W2, RT), Q(a, -W2, RT), Q(a, W2, RT), Q(a - 0.13, W2, RT)], k % 2 ? '#a69f92' : '#bbb5a8'); h += line(Q(a, -W2, RT), Q(a, W2, RT), '#7a7368', 1.3); }
        h += poly([Q(0, -W2 + 0.03, RT + 0.005), Q(0.95, -W2 + 0.03, RT + 0.005), Q(0.95, W2 - 0.03, RT + 0.005), Q(0, W2 - 0.03, RT + 0.005)], '#2a2b2e');
        for (let a = 0.08; a < 0.95; a += 0.07) h += line(Q(a, -W2 + 0.05, RT + 0.006), Q(a, W2 - 0.05, RT + 0.006), '#3a3b3f', 1, 'opacity=".7"');
      }
      if (botVis) {
        h += poly([Q(0, -W2, 0), Q(RL, -W2, 0), Q(RL, W2, 0), Q(0, W2, 0)], '#5f5a50', 'stroke="#2e2a24" stroke-width="1.5" stroke-linejoin="round"');
        // green-grey algae where the lake end sat near the water
        h += poly([Q(RL * 0.62, -W2, -0.001), Q(RL, -W2, -0.001), Q(RL, W2, -0.001), Q(RL * 0.62, W2, -0.001)], '#55614a', 'opacity=".55"');
        for (let a = 0.1; a < RL; a += 0.14) h += line(Q(a, -W2, -0.002), Q(a, W2, -0.002), '#4a453d', 1.1, 'opacity=".6"');
        for (const w of [-W2 + 0.05, 0, W2 - 0.05]) h += poly([Q(0, w - 0.045, -0.004), Q(RL, w - 0.045, -0.004), Q(RL, w + 0.045, -0.004), Q(0, w + 0.045, -0.004)], '#3f3a33');
        for (const a of [0.25, RL / 2, RL - 0.25]) h += poly([Q(a - 0.05, -W2, -0.006), Q(a + 0.05, -W2, -0.006), Q(a + 0.05, W2, -0.006), Q(a - 0.05, W2, -0.006)], '#47423a');
        for (const w of [-W2 + 0.12, W2 - 0.12]) h += poly([Q(0, w - 0.06, -0.008), Q(0.14, w - 0.06, -0.008), Q(0.14, w + 0.06, -0.008), Q(0, w + 0.06, -0.008)], '#1d1d20');
      }
      return h;
    }
    const rampG = svgEl('g'); rampL.appendChild(rampG);
    // ---- the floating dock sections in the foreground ----
    const flt = layer('float');
    const FXA0 = -4.8, FXA1 = 0.47, FXB0 = 0.53, FXB1 = 5.2, FZ0 = 1.0;
    let fl = '';
    const BOARDS = ['#a9a397', '#9d978b', '#b3ada1', '#a39d91', '#aea89c'];
    const section = (x0, x1, seed) => {
      const q = rng(seed); let d = poly([P(x0, FLY, FZ0), P(x1, FLY, FZ0), P(x1, FLY, FLZ1), P(x0, FLY, FLZ1)], '#6d675d');
      for (let z = FZ0, k = 0; z < FLZ1 - 0.01; z += 0.145, k++) {
        const z1 = Math.min(FLZ1, z + 0.135);
        d += poly([P(x0 + 0.02, FLY, z), P(x1 - 0.02, FLY, z), P(x1 - 0.02, FLY, z1), P(x0 + 0.02, FLY, z1)], BOARDS[Math.floor(q() * 5)]);
        if (q() > 0.45) { const xe = x0 + 0.3 + q() * (x1 - x0 - 0.6); d += line(P(xe, FLY, z), P(xe, FLY, z1), '#6d675d', 1.4); }
        for (let j = 0; j < 3; j++) { const xg = x0 + q() * (x1 - x0); d += line(P(xg, FLY, z + 0.03), P(xg + 0.3 + q() * 0.6, FLY, z + 0.04 + q() * 0.05), '#8a8479', 1, 'opacity=".6"'); }
        const n0 = P(x0 + 0.08, FLY, z + 0.07), n1 = P(x1 - 0.08, FLY, z + 0.07), nr = R2(Math.max(0.8, 5 / z));
        d += `<circle cx="${R2(n0[0])}" cy="${R2(n0[1])}" r="${nr}" fill="#4a4540"/><circle cx="${R2(n1[0])}" cy="${R2(n1[1])}" r="${nr}" fill="#4a4540"/>`;
      }
      return d;
    };
    fl += section(FXA0, FXA1, 71) + section(FXB0, FXB1, 72);
    // the right rim of section A shows in the gap; a pale lip along the far edge
    fl += poly([P(FXA1, FLY, FZ0), P(FXA1, FLY, FLZ1), P(FXA1, 0.06, FLZ1), P(FXA1, 0.06, FZ0)], '#4e483f');
    fl += poly([P(FXA0, FLY, FLZ1), P(FXB1, FLY, FLZ1), P(FXB1, FLY - 0.03, FLZ1), P(FXA0, FLY - 0.03, FLZ1)], '#c9c3b7');
    // cleat, and the block the ramp's lake end rests on
    const cl = P(2.0, FLY, 3.3); fl += `<path fill="#2b2a28" d="M${R2(cl[0] - 26)} ${R2(cl[1])} q26 -12 52 0 l-6 5 q-20 -6 -40 0Z"/>`;
    for (const [y0, y1, col, top] of [[0, 0.12, '#6c655a', '#8d8579'], [0.12, 0.25, '#77705f', '#958d80']]) fl += poly([P(RXC - 0.56, FLY + y0, 3.64), P(RXC + 0.56, FLY + y0, 3.64), P(RXC + 0.56, FLY + y1, 3.64), P(RXC - 0.56, FLY + y1, 3.64)], col) + poly([P(RXC - 0.56, FLY + y1, 3.64), P(RXC + 0.56, FLY + y1, 3.64), P(RXC + 0.56, FLY + y1, 3.8), P(RXC - 0.56, FLY + y1, 3.8)], top) + poly([P(RXC + 0.56, FLY + y0, 3.64), P(RXC + 0.56, FLY + y0, 3.8), P(RXC + 0.56, FLY + y1, 3.8), P(RXC + 0.56, FLY + y1, 3.64)], '#5a544a');
    // pine shade lying across the boards, a few fallen leaves, and the float darkening toward the lens
    const qd = rng(733);
    // long pine shadows raking across the float from the left
    for (let i = 0; i < 5; i++) { const X0 = -5 + i * 2.1 + qd() * 0.6, w = 0.25 + qd() * 0.35; fl += poly([P(X0, FLY, 1.0), P(X0 + w, FLY, 1.0), P(X0 + w + 2.2, FLY, FLZ1), P(X0 + 2.2, FLY, FLZ1)], '#2a2620', 'opacity=".13"'); }
    for (let i = 0; i < 26; i++) { const X = -4 + qd() * 8, Z = 2.0 + qd() * 1.8, p = P(X, FLY, Z), k = F / Z / 180; fl += `<ellipse cx="${R2(p[0])}" cy="${R2(p[1])}" rx="${R2(9 * k)}" ry="${R2(3.5 * k)}" fill="${['#d9762b', '#b8402a', '#e7b53a', '#c8582a', '#8a5a2a'][Math.floor(qd() * 5)]}" transform="rotate(${Math.floor(qd() * 60 - 30)} ${R2(p[0])} ${R2(p[1])})"/>`; }
    fl += `<rect x="-400" y="${R2(P(0, FLY, 2.6)[1])}" width="2800" height="600" fill="${grad(defs, [[0, 'rgba(20,16,12,0)'], [1, 'rgba(20,16,12,0.35)']])}"/>`;
    ins(flt, fl);
    const wetG = svgEl('g'); flt.appendChild(wetG);
    // ---- the two lifters, in profile either side of the ramp, facing it ----
    const act = layer('act');
    const son1 = makePerson(act, { coat: '#e0a83a', pants: '#2a3550', hair: '#5a3d28', kid: 0.3, mitt: '#5a4a3a' });
    const dad = makePerson(act, { coat: '#2f5d4a', pants: '#3a3f4d', hat: '#c8853a', hair: '#4a3323', mitt: '#7a5a3a' });
    const dep = { sky: 0.05, rock: 0.8, pines: 0.65, wat: 1, wall: 1, slab: 1, capAct: 1, ramp: 1, float: 1, act: 1 };
    // slow push-in that tilts up with the ramp as it stands
    const camAt = (f) => { const k = E.inOutSine(seg(f, 0, 200)), up = E.inOutSine(seg(f, 96, 186)); return { fx: lerp(935, 905, k), fy: lerp(500, 478, up), s: lerp(1.0, 1.06, k), rot: Math.sin(f * 0.03) * 0.1 }; };
    // the ramp's angle: dad lifts the lake end to arm's length, the boy walks it the rest of the way up
    const TH = (f) => kf(f, [[0, 1.8], [28, 1.8], [40, 4.5], [60, 21], [92, 26], [124, 32], [178, 77.5], [188, 75.8], [200, 76]], E.inOutSine);
    const RIGP = 190 / 1.8; // profile rig units per metre
    // aim both arms of a posed profile lifter at two screen points; returns the angles and how far each hand is off
    function aimArms(man, pose, tA, tB) {
      const A = man.reach(pose, tA[0], tA[1]), B = man.reach(pose, tB[0], tB[1]);
      return { anA: A.a, afA: B.a, anK: clamp(A.d / 61, 0.5, 1.1), afK: clamp(B.d / 61, 0.5, 1.1), dA: A.d, dB: B.d };
    }
    function update(f) {
      const c = camAt(f);
      cam.setAttribute('transform', `translate(960 560) rotate(${c.rot}) scale(${c.s}) translate(${-c.fx} ${-c.fy})`);
      for (const n in dep) L[n].setAttribute('transform', `translate(${R2((1 - dep[n]) * (c.fx - 960))} ${R2((1 - dep[n]) * (c.fy - 560) * 0.2)})`);
      rps.forEach((e) => e.setAttribute('opacity', R2(0.1 + 0.14 * Math.sin(f * 0.09 + +e.dataset.p * 1.7))));
      const th = TH(f);
      rampG.innerHTML = rampSVG(th, false);
      rampRefl.innerHTML = rampSVG(th, true);
      // wet footprint where the lake end sat, fading as it dries
      const wk = seg(f, 40, 70) * (1 - seg(f, 120, 200) * 0.6);
      wetG.innerHTML = wk > 0 ? poly([P(RXC - 0.54, FLY + 0.251, 3.65), P(RXC + 0.54, FLY + 0.251, 3.65), P(RXC + 0.54, FLY + 0.251, 3.8), P(RXC - 0.54, FLY + 0.251, 3.8)], '#4a443b', `opacity="${R2(wk * 0.8)}"`) : '';
      // ---- dad: on the float at the lake end's right corner, bent to it, then pressing it up overhead ----
      const endLo = rampW(th, RL, 0, 0);
      const DX = RXC + RW / 2 + 0.42, DZ = Math.min(3.78, endLo[2] - 0.05), dp = P(DX, FLY, DZ), ds = (F / DZ) / RIGP;
      const hold = 1 - E.inOutSine(seg(f, 126, 148)), rel = 1 - hold;
      const dLean = kf(f, [[0, 44], [26, 44], [56, 24], [80, 0], [100, -8], [124, -10], [150, 0]], E.inOutSine), dDip = kf(f, [[0, 34], [26, 34], [66, 6], [86, 0]], E.inOutSine);
      const tremble = Math.sin(f * 0.9) * 0.6 * hold * seg(f, 30, 60);
      const dPose = { x: dp[0], y: dp[1], s: ds, flip: -1, armFollow: 1, lean: dLean + tremble, dip: dDip };
      const dArm = aimArms(dad, dPose, rampPt(th, RL - 0.06, RW / 2, RT * 0.2), rampPt(th, RL - 0.42, RW / 2, RT * 0.2));
      dad.set(Object.assign(dPose, { anA: lerp(dArm.anA, 12, rel), afA: lerp(dArm.afA, 8, rel), anK: lerp(dArm.anK, 1, rel), afK: lerp(dArm.afK, 1, rel), tilt: lerp(-6, 8, seg(f, 60, 120)) - 8 * rel }));
      // ---- the older boy: on the slab left of the shore end, steadying it, then walking it up hand over hand ----
      const SX = RXC - RW / 2 - 0.55, SZ = 6.3, sp = P(SX, SLY, SZ), ssc = ((F / SZ) / RIGP) * 0.96;
      const hS = kf(f, [[0, 0.3], [60, 0.42], [92, 0.6], [124, 0.95], [150, 1.35], [178, 1.55]], E.inOutSine);
      const aS = clamp(hS / Math.max(Math.sin(th * D2R), 0.36), 0.6, 2.4);
      const sLean = kf(f, [[0, 34], [60, 30], [92, 24], [118, 12], [136, 4], [160, 6], [178, 4]], E.inOutSine), sDip = kf(f, [[0, 34], [92, 22], [120, 6], [136, 0]], E.inOutSine);
      const sPose = { x: sp[0], y: sp[1], s: ssc, flip: 1, armFollow: 1, lean: sLean, dip: sDip };
      const sArm = aimArms(son1, sPose, rampPt(th, aS - 0.18, -RW / 2, RT * 0.8), rampPt(th, aS + 0.2, -RW / 2, RT * 0.8));
      son1.set(Object.assign(sPose, { anA: sArm.anA, afA: sArm.afA, anK: sArm.anK, afK: sArm.afK, tilt: lerp(4, -10, seg(f, 110, 170)) }));
      // the rope the boy ties off once it stands
      const tie = seg(f, 180, 196);
      if (tie > 0) { const tp = rampPt(th, RL * 0.55, -RW / 2, 0), a = P(-3.1, SLY, 6.5); ropeLine.setAttribute('d', `M${pt(a)} L${R2(lerp(a[0], tp[0], tie))} ${R2(lerp(a[1], tp[1], tie))}`); ropeLine.style.display = ''; } else ropeLine.style.display = 'none';
      // ---- up on the cap ----
      const nod = Math.sin(f * 0.11), look = E.inOutSine(seg(f, 60, 110));
      mom.set({ x: X2S(0.25), y: yC, s: PS, flip: -1, lean: -1 + nod * 0.6, afA: 6, anA: 4, tilt: nod * 2 - 6 * look });
      son2.set({ x: X2S(0.85), y: yC, s: PS * 0.84, flip: -1, lean: 1 + Math.sin(f * 0.13 + 1) * 0.6, afA: 4, anA: lerp(20 + Math.sin(f * 0.2) * 4, 150 + Math.sin(f * 0.5) * 12, E.inOutSine(seg(f, 174, 186))), tilt: -2 - 8 * look });
      shih.set({ x: X2S(-0.22), y: yC, s: DS * 1.1, flip: -1, sit: 1, wag: f * 0.3, wagA: 8, head: 4 * nod });
      const sxW = kf(f, [[0, -5.6], [50, -5.6], [140, -3.3]], E.inOutSine), moving = f > 50 && f < 140;
      schn.set({ x: X2S(sxW), y: yC, s: DS, flip: 1, gp: (f - 50) * 0.34, amp: moving ? 0.6 * Math.sin(seg(f, 50, 140) * Math.PI) + 0.25 : 0, sit: E.inOutSine(seg(f, 146, 162)), wag: f * 0.6, wagA: 14, head: 6 + 6 * Math.sin(f * 0.05) });
    }
    // water drips off the ramp's underside once it is up, and rings where they land
    const drips = (ctx, f) => {
      const c = camAt(f), q = rng(9);
      const ws = (p) => w2s(c, p[0], p[1]);
      for (let i = 0; i < 70; i++) {
        const st = 34 + q() * 150, a = f - st, u = q(), v = q(); if (a < 0) continue;
        const th0 = TH(st); if (th0 < 6) continue;
        const w0 = rampW(th0, v * RL, (u - 0.5) * RW, -0.01);
        const t = a / FPS, Y = w0[1] - 4.9 * t * t;
        if (Y < 0) {
          const ag = a - Math.sqrt(w0[1] / 4.9) * FPS;
          if (w0[2] > 5.25 && w0[2] < SLZ0 && ag < 40) { const [sx, sy] = ws(P(w0[0], 0, w0[2])), rx = ((0.04 + ag * 0.012) * F) / w0[2] * c.s; ctx.strokeStyle = `rgba(230,238,242,${R2(0.4 * (1 - ag / 40))})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(sx, sy, rx, rx * (CAMH / w0[2]), 0, 0, 6.283); ctx.stroke(); }
          continue;
        }
        const [sx, sy] = ws(P(w0[0], Y, w0[2]));
        ctx.fillStyle = 'rgba(214,228,234,0.85)'; ctx.beginPath(); ctx.ellipse(sx, sy, 1.8 * c.s, 4.5 * c.s, 0, 0, 6.283); ctx.fill();
      }
    };
    const fx = (ctx, f) => { leafFall(ctx, f, 22, 61, ['#d9762b', '#b8402a', '#e7b53a', '#c8582a'], 9); motes(ctx, f, 18, 3, '#fff0d0', 2, 0.8); drips(ctx, f); };
    return { a: 500, b: 700, update, fx, camAt };
  })();
};
