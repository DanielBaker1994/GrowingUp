/* scene2deck.js — S2: one unbroken shot of the two dogs tearing around the cottage deck, from the family's photo:
   the carved bear on its stump, weathered boards with railing shadows, the picnic table under a furled red umbrella,
   two sling chairs, the grey siding at the edge, pines behind. f 300..500 (local 0..200) */
let S2; const initS2 = () => {
  S2 = (() => {
    const svg = $('sv2'), defs = svgEl('defs'); svg.appendChild(defs);
    const cam = svgEl('g'); svg.appendChild(cam);
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const r = rng(2201);
    // ---- camera: yawed so the boards run up to the right, eye 1.2 m over the deck ----
    const CS = Math.cos(-20 * D2R), SN = Math.sin(-20 * D2R), Z0 = 1.0, FOC = 900, HZ = 400, CAMH = 1.2;
    const P = (u, y, v) => { const X = u * CS - v * SN, Z = u * SN + v * CS + Z0; return [960 + (FOC * X) / Z, HZ + (FOC * (CAMH - y)) / Z, Z]; };
    const pt = (q) => `${R2(q[0])} ${R2(q[1])}`;
    const poly = (pts, fill, extra = '') => `<path fill="${fill}" ${extra} d="M${pts.map(pt).join(' L')}Z"/>`;
    const CAMU = 0.342, CAMV = -0.94;
    // ---- forest beyond the deck ----
    const bg = svgEl('g'); cam.appendChild(bg);
    let fo = `<rect x="-200" y="-200" width="2400" height="900" fill="#2c4a26"/>`;
    for (let i = 0; i < 8; i++) fo += `<path fill="#d9ead0" opacity=".55" d="${blob(200 + r() * 1700, -60 + r() * 200, 60 + r() * 80, 40 + r() * 50, 2210 + i, 14, 0.4)}"/>`;
    [[980, 16], [1500, 22], [1760, 14], [420, 12], [1260, 10]].forEach(([x, w]) => (fo += `<path fill="#2a2018" d="M${x - w} 520 L${x - w * 0.6} -200 L${x + w * 0.6} -200 L${x + w} 520Z"/>`));
    const GREENS = ['#244020', '#2f5228', '#3d6a30', '#4f7e36', '#6a9a44', '#8ab852'];
    for (let layerK = 0; layerK < 4; layerK++) for (let i = 0; i < 34; i++) {
      const x = -150 + r() * 2250, y = -80 + r() * (380 + layerK * 60), k = Math.min(5, layerK + Math.floor(r() * 3));
      fo += `<path fill="${GREENS[k]}" d="${blob(x, y, 70 + r() * 90, 28 + r() * 30, 2300 + layerK * 50 + i, 20, 0.45)}"/>`;
    }
    for (let i = 0; i < 26; i++) fo += `<path fill="#a8cf62" opacity=".55" d="${blob(300 + r() * 1300, 60 + r() * 300, 30 + r() * 40, 10 + r() * 12, 2400 + i, 16, 0.5)}"/>`;
    ins(bg, fo);
    // ---- deck boards ----
    const deck = svgEl('g'); cam.appendChild(deck);
    const BW = 0.14, U0 = -3.4, U1 = 5.2, V1 = 9.6;
    let dk = poly([P(U0, 0, 0.2), P(U1, 0, 1.9), P(U1, 0, V1), P(U0, 0, V1)], '#3e3024') + poly([P(U0, 0, -0.6), P(0.5, 0, -0.6), P(U1, 0, 1.9), P(U0, 0, 0.2)], '#3e3024');
    const BOARD = ['#8a7058', '#94795f', '#7e6550', '#9a8068', '#86705c'];
    for (let u = U0, k = 0; u < U1; u += BW, k++) {
      const vmin = Math.max(-0.6, (0.342 * u - 0.45) / 0.94 + 0.05 * 0);
      const a = P(u, 0, vmin), b = P(u + BW - 0.012, 0, vmin), c = P(u + BW - 0.012, 0, V1), d = P(u, 0, V1);
      dk += poly([a, b, c, d], BOARD[k % 5]);
      if (r() > 0.6) { const vv = 1 + r() * 7, e1 = P(u + 0.02, 0, vv), e2 = P(u + 0.1, 0, vv + 0.2); dk += `<line x1="${R2(e1[0])}" y1="${R2(e1[1])}" x2="${R2(e2[0])}" y2="${R2(e2[1])}" stroke="#5f4a38" stroke-width="1.5" opacity=".5"/>`; }
    }
    // board ends / seams
    for (const vs of [3.2, 6.4]) for (let u = U0; u < U1; u += BW * 2) { const a = P(u, 0, vs + (u * 7) % 0.3), b = P(u + BW, 0, vs + (u * 7) % 0.3); dk += `<line x1="${R2(a[0])}" y1="${R2(a[1])}" x2="${R2(b[0])}" y2="${R2(b[1])}" stroke="#4e3c2c" stroke-width="1.6" opacity=".6"/>`; }
    // low sun: long railing shadows raking across the boards
    for (let i = -8; i < 16; i++) { const c0 = i * 0.62; const q = [P(-3.4, 0, c0 + 0.9 * -3.4 * 0.35), P(5.2, 0, c0 + 0.9 * 5.2 * 0.35), P(5.2, 0, c0 + 0.9 * 5.2 * 0.35 + 0.16), P(-3.4, 0, c0 + 0.9 * -3.4 * 0.35 + 0.16)]; if (q.some((p) => p[2] < 0.5)) continue; dk += poly(q, '#2a1c12', 'opacity=".2"'); }
    ins(deck, dk);
    const dapple = svgEl('g', { opacity: 0.22 }); deck.appendChild(dapple);
    // ---- railing along the back edge ----
    const back = svgEl('g'); cam.appendChild(back);
    let rl = '';
    const railBoard = (u0, u1, y0, y1, v, col) => poly([P(u0, y0, v), P(u1, y0, v), P(u1, y1, v), P(u0, y1, v)], col);
    const sideBoard = (v0, v1, y0, y1, u, col) => poly([P(u, y0, v0), P(u, y0, v1), P(u, y1, v1), P(u, y1, v0)], col);
    rl += sideBoard(1.95, V1, 0.3, 0.44, U0, '#aaa296') + sideBoard(1.95, V1, 0, 0.14, U0, '#6e6258');
    for (let v = 2.2; v < V1; v += 1.5) rl += poly([P(U0, 0, v), P(U0, 0, v + 0.1), P(U0, 0.92, v + 0.1), P(U0, 0.92, v)], '#9a9286');
    rl += poly([P(U0 - 0.1, 0.9, 1.95), P(U0 - 0.1, 0.9, V1), P(U0 + 0.1, 0.9, V1), P(U0 + 0.1, 0.9, 1.95)], '#c9c2b6');
    rl += railBoard(-6, 6, 0.0, 0.14, V1, '#6e6258');
    rl += railBoard(-6, 6, 0.3, 0.44, V1, '#aaa296');
    for (let u = -5.5; u < 6; u += 1.6) rl += poly([P(u, 0, V1), P(u + 0.1, 0, V1), P(u + 0.1, 0.92, V1), P(u, 0.92, V1)], '#9a9286');
    rl += poly([P(-6, 0.9, V1 - 0.08), P(6, 0.9, V1 - 0.08), P(6, 0.9, V1 + 0.1), P(-6, 0.9, V1 + 0.1)], '#c9c2b6') + railBoard(-6, 6, 0.86, 0.9, V1 - 0.08, '#8e877c');
    ins(back, rl);
    // ---- picnic table + furled red umbrella ----
    const box = (u0, u1, y0, y1, v0, v1, top, side, front) => {
      let s = '';
      if (CAMU < u0) s += poly([P(u0, y0, v0), P(u0, y0, v1), P(u0, y1, v1), P(u0, y1, v0)], side);
      if (CAMU > u1) s += poly([P(u1, y0, v0), P(u1, y0, v1), P(u1, y1, v1), P(u1, y1, v0)], side);
      s += poly([P(u0, y0, v0), P(u1, y0, v0), P(u1, y1, v0), P(u0, y1, v0)], front);
      if (CAMH > y1) s += poly([P(u0, y1, v0), P(u1, y1, v0), P(u1, y1, v1), P(u0, y1, v1)], top);
      return s;
    };
    const ST = ['#c06a2e', '#94501f', '#a85c26'];
    const TU0 = -0.5, TU1 = 1.4, TV0 = 7.5, TV1 = 8.25;
    let tb = '';
    // legs (A-frames at each end), far bench, top, near bench
    [TU0 + 0.25, TU1 - 0.33].forEach((u) => { tb += box(u, u + 0.08, 0, 0.74, TV0 - 0.3, TV0 - 0.2, ST[0], ST[1], ST[2]) + box(u, u + 0.08, 0, 0.74, TV1 + 0.2, TV1 + 0.3, ST[0], ST[1], ST[2]); });
    tb += box(TU0, TU1, 0.42, 0.46, TV1 + 0.28, TV1 + 0.56, ST[0], ST[1], ST[2]);
    tb += box(TU0 - 0.05, TU1 + 0.05, 0.72, 0.77, TV0, TV1, '#c8743a', ST[1], '#9c5522');
    tb += box(TU0, TU1, 0.42, 0.46, TV0 - 0.56, TV0 - 0.28, ST[0], ST[1], ST[2]);
    [TU0 + 0.2, TU1 - 0.3].forEach((u) => (tb += box(u, u + 0.06, 0, 0.42, TV0 - 0.5, TV0 - 0.42, ST[0], ST[1], ST[2])));
    // umbrella: pole, furled canopy in folds, finial
    const UC = [(TU0 + TU1) / 2, (TV0 + TV1) / 2];
    const p0 = P(UC[0], 0.77, UC[1]), p1 = P(UC[0], 2.62, UC[1]), Zu = p0[2], pxm = FOC / Zu;
    tb += `<line x1="${R2(p0[0])}" y1="${R2(p0[1])}" x2="${R2(p1[0])}" y2="${R2(p1[1])}" stroke="#2a2a2e" stroke-width="${R2(0.035 * pxm)}"/>`;
    const hemY = P(UC[0], 1.5, UC[1])[1], topY = P(UC[0], 2.55, UC[1])[1], cx = p0[0], hw = 0.34 * pxm, tw = 0.05 * pxm;
    const folds = 6; let can = '';
    for (let i = 0; i < folds; i++) {
      const a = i / folds, b = (i + 1) / folds;
      const xb0 = cx - hw + 2 * hw * a, xb1 = cx - hw + 2 * hw * b, xt0 = cx - tw + 2 * tw * a, xt1 = cx - tw + 2 * tw * b;
      const sag = Math.sin(a * Math.PI) * 10;
      can += `<path fill="${i % 2 ? '#c41f26' : '#e0343a'}" d="M${R2(xt0)} ${R2(topY)} L${R2(xt1)} ${R2(topY)} L${R2(xb1)} ${R2(hemY + (i % 2 ? 14 : 0))} Q${R2((xb0 + xb1) / 2)} ${R2(hemY + 24 + sag)} ${R2(xb0)} ${R2(hemY + (i % 2 ? 0 : 14))}Z"/>`;
    }
    can += `<path fill="#9a161c" opacity=".55" d="M${R2(cx + tw * 0.2)} ${R2(topY)} L${R2(cx + tw)} ${R2(topY)} L${R2(cx + hw)} ${R2(hemY + 8)} L${R2(cx + hw * 0.4)} ${R2(hemY + 20)}Z"/>`;
    can += `<path fill="#e0343a" d="M${R2(cx - tw * 1.6)} ${R2(topY + 4)} L${R2(cx)} ${R2(topY - 0.18 * pxm)} L${R2(cx + tw * 1.6)} ${R2(topY + 4)}Z"/><circle cx="${R2(cx)}" cy="${R2(topY - 0.2 * pxm)}" r="${R2(0.03 * pxm)}" fill="#2a2a2e"/>`;
    tb += can;
    ins(back, tb);
    // ---- two sling chairs on the right ----
    const chair = (u, v, turn) => {
      const w = 0.56, d = 0.55, cu = Math.cos(turn), su = Math.sin(turn);
      const L = (du, y, dv) => P(u + du * cu - dv * su, y, v + du * su + dv * cu);
      let s = '';
      // back legs + frame
      const fr = (a, b) => `<line x1="${R2(a[0])}" y1="${R2(a[1])}" x2="${R2(b[0])}" y2="${R2(b[1])}" stroke="#141416" stroke-width="${R2(Math.max(2, 0.03 * FOC / a[2]))}" stroke-linecap="round"/>`;
      s += fr(L(-w / 2, 0, d), L(-w / 2, 0.42, d * 0.1)) + fr(L(w / 2, 0, d), L(w / 2, 0.42, d * 0.1));
      s += poly([L(-w / 2, 0.44, d * 0.95), L(w / 2, 0.44, d * 0.95), L(w / 2, 1.1, d * 1.15), L(-w / 2, 1.1, d * 1.15)], '#a9a59c');
      s += poly([L(-w / 2 + 0.03, 0.47, d * 0.95), L(w / 2 - 0.03, 0.47, d * 0.95), L(w / 2 - 0.03, 1.07, d * 1.14), L(-w / 2 + 0.03, 1.07, d * 1.14)], '#c9c6bd', 'opacity=".82"');
      // sling mesh: fine horizontal weave + the sag shadow at the seat
      for (let y = 0.52; y < 1.06; y += 0.045) { const a = L(-w / 2 + 0.03, y, d * (0.95 + (y - 0.47) * 0.32)), b = L(w / 2 - 0.03, y, d * (0.95 + (y - 0.47) * 0.32)); s += `<line x1="${R2(a[0])}" y1="${R2(a[1])}" x2="${R2(b[0])}" y2="${R2(b[1])}" stroke="#8f8b82" stroke-width="1" opacity=".45"/>`; }
      s += poly([L(-w / 2 + 0.03, 0.47, d * 0.95), L(w / 2 - 0.03, 0.47, d * 0.95), L(w / 2 - 0.03, 0.6, d * 0.99), L(-w / 2 + 0.03, 0.6, d * 0.99)], '#6f6b63', 'opacity=".35"');
      s += poly([L(-w / 2, 0.42, 0), L(w / 2, 0.42, 0), L(w / 2, 0.44, d * 0.95), L(-w / 2, 0.44, d * 0.95)], '#c8c1b4');
      s += fr(L(-w / 2, 0, 0), L(-w / 2, 0.62, d * 0.3)) + fr(L(w / 2, 0, 0), L(w / 2, 0.62, d * 0.3)) + fr(L(-w / 2, 0.62, d * 0.3), L(-w / 2, 0.62, d * 0.95)) + fr(L(w / 2, 0.62, d * 0.3), L(w / 2, 0.62, d * 0.95));
      s += poly([L(-w / 2 - 0.04, 0.63, d * 0.25), L(-w / 2 + 0.03, 0.63, d * 0.25), L(-w / 2 + 0.03, 0.63, d * 0.95), L(-w / 2 - 0.04, 0.63, d * 0.95)], '#1e1e22') + poly([L(w / 2 - 0.03, 0.63, d * 0.25), L(w / 2 + 0.04, 0.63, d * 0.25), L(w / 2 + 0.04, 0.63, d * 0.95), L(w / 2 - 0.03, 0.63, d * 0.95)], '#1e1e22');
      s += fr(L(-w / 2, 1.1, d * 1.15), L(w / 2, 1.1, d * 1.15)) + fr(L(-w / 2, 0.44, d * 0.95), L(-w / 2, 1.1, d * 1.15)) + fr(L(w / 2, 0.44, d * 0.95), L(w / 2, 1.1, d * 1.15));
      return s;
    };
    ins(back, chair(4.1, 7.9, -0.5) + chair(3.3, 6.4, -0.35));
    // ---- the cottage's grey siding and eave at the left edge ----
    const wall = svgEl('g'); cam.appendChild(wall);
    let wl = poly([P(-3.4, 0, -0.35), P(-3.4, 0, 1.9), P(-3.4, 2.6, 1.9), P(-3.4, 2.6, -0.35)], '#474a50');
    for (let y = 0.1; y < 2.6; y += 0.13) { const a = P(-3.4, y, -0.35), b = P(-3.4, y, 1.9); wl += `<line x1="${R2(a[0])}" y1="${R2(a[1])}" x2="${R2(b[0])}" y2="${R2(b[1])}" stroke="#2f3136" stroke-width="1.6" opacity=".7"/>`; }
    wl += poly([P(-3.4, 0, 1.84), P(-3.4, 0, 1.95), P(-3.4, 2.62, 1.95), P(-3.4, 2.62, 1.84)], '#ecebe6');
    wl += poly([P(-3.4, 2.6, -0.4), P(-3.4, 2.6, 2.1), P(-2.7, 2.72, 2.1), P(-2.7, 2.72, -0.4)], '#2c2d31');
    wl += poly([P(-2.72, 2.62, -0.4), P(-2.72, 2.62, 2.1), P(-2.68, 2.75, 2.1), P(-2.68, 2.75, -0.4)], '#e9e7e2');
    ins(wall, wl);
    // ---- the dogs ----
    const act = svgEl('g'); cam.appendChild(act);
    const whiteD = makeDog(act, { kind: 'schnauzer', body: '#b0b4bb', dark: '#90949c', beard: '#f4f5f7', old: 1, legLen: 0.9 });  // the same old schnauzer as in the mowing scene
    const greyD = makeDog(act, { kind: 'schnauzer', body: '#6e727c', dark: '#575b64', beard: '#c8cbd1', legLen: 1.2 });  // and the same gangly puppy
    // ---- the carved bear on its stump, big in the left foreground ----
    const bear = svgEl('g'); cam.appendChild(bear);
    const BK = '#17161a', BH = '#2a292e';
    let br = '';
    br += `<ellipse cx="170" cy="1052" rx="200" ry="36" fill="#000" opacity=".3"/>`;
    br += `<path fill="#c79a5e" d="M20 890 Q170 850 320 890 L330 1060 Q170 1100 10 1060Z"/><ellipse cx="170" cy="890" rx="150" ry="36" fill="#dcb47a"/><ellipse cx="170" cy="890" rx="110" ry="24" fill="none" stroke="#b8894e" stroke-width="3"/><ellipse cx="170" cy="890" rx="60" ry="13" fill="none" stroke="#b8894e" stroke-width="3"/>`;
    for (let i = 0; i < 9; i++) br += `<line x1="${40 + i * 32}" y1="${912 + Math.abs(4 - i) * 2}" x2="${36 + i * 33}" y2="${1040 + Math.abs(4 - i) * 3}" stroke="#a87c44" stroke-width="2" opacity=".6"/>`;
    // hind legs + body + chest + arms + head
    br += `<path fill="${BK}" d="M58 880 Q50 800 80 740 L130 740 L126 880Z"/><path fill="${BK}" d="M190 880 L196 740 L250 740 Q286 800 282 880Z"/>`;
    br += `<path fill="${BK}" d="M50 820 Q20 560 90 360 Q170 300 250 360 Q320 560 290 820 Q170 870 50 820Z"/>`;
    br += `<path fill="${BH}" d="M100 420 Q170 390 240 420 Q260 560 230 700 Q170 730 110 700 Q80 560 100 420Z" opacity=".75"/>`;
    br += `<path fill="${BK}" d="M86 420 Q60 520 110 600 Q140 610 150 590 Q120 520 130 440Z"/><path fill="${BK}" d="M254 420 Q280 520 230 600 Q200 610 190 590 Q220 520 210 440Z"/>`;
    br += `<path fill="${BK}" d="M96 250 Q100 160 170 150 Q240 160 244 250 Q250 330 170 350 Q90 330 96 250Z"/><circle cx="108" cy="170" r="24" fill="${BK}"/><circle cx="232" cy="170" r="24" fill="${BK}"/><circle cx="108" cy="172" r="11" fill="${BH}"/><circle cx="232" cy="172" r="11" fill="${BH}"/>`;
    br += `<path fill="#c08a3c" d="M140 250 Q170 236 200 250 L206 300 Q170 318 134 300Z"/><path fill="#1a120c" d="M156 246 Q170 240 184 246 L180 262 Q170 266 160 262Z"/><circle cx="140" cy="226" r="5" fill="#d9b070"/><circle cx="200" cy="226" r="5" fill="#d9b070"/>`;
    // carved gouges catch the sun
    for (let i = 0; i < 70; i++) { const x = 70 + r() * 200, y = 360 + r() * 470; br += `<path fill="none" stroke="#5a5a64" stroke-width="2" opacity="${R2(0.25 + r() * 0.35)}" d="M${R2(x)} ${R2(y)} q${R2(4 + r() * 6)} ${R2(8 + r() * 10)} ${R2(2 + r() * 4)} ${R2(18 + r() * 14)}"/>`; }
    for (let i = 0; i < 18; i++) { const x = 110 + r() * 120, y = 180 + r() * 150; br += `<path fill="none" stroke="#5a5a64" stroke-width="1.6" opacity=".4" d="M${R2(x)} ${R2(y)} q3 6 1 12"/>`; }
    br += `<path fill="#fff4dc" opacity=".16" d="M250 360 Q320 560 290 820 L270 815 Q298 560 236 372Z"/>`;
    br += `<path fill="${BK}" d="M60 870 Q40 890 58 900 L130 900 L132 872Z"/><path fill="${BK}" d="M196 872 L200 900 L276 900 Q296 890 278 868Z"/>`;
    for (let k = 0; k < 4; k++) br += `<path fill="#d8d2c8" d="M${68 + k * 15} 898 l4 8 l4 -8Z"/><path fill="#d8d2c8" d="M${206 + k * 15} 898 l4 8 l4 -8Z"/>`;
    ins(bear, br);
    // ---- motion ----
    const LOOP = { cu: -0.4, cv: 2.8, ru: 1.4, rv: 1.0 };
    const th = (f, lag) => Math.PI * 1.02 + ((f - lag * 14) / 200) * 2.5 * Math.PI + 0.12 * Math.sin(f * 0.05 + lag);
    const posAt = (f, lag, wob) => { const t = th(f, lag); return { u: LOOP.cu + LOOP.ru * Math.sin(t) + wob * Math.sin(f * 0.09 + lag * 3), v: LOOP.cv - LOOP.rv * Math.cos(t) }; };
    const RIG_PX_PER_M = 175;
    const camAt = (f) => { const k = E.inOutSine(seg(f, 0, 200)); return { fx: lerp(1000, 1060, k), fy: lerp(560, 575, k), s: lerp(1.0, 1.05, k), rot: Math.sin(f * 0.04) * 0.25 }; };
    function placeDog(dog, f, lag, wob, sc, gpk) {
      const a = posAt(f, lag, wob), b = posAt(f + 1, lag, wob), pa = P(a.u, 0, a.v), pb = P(b.u, 0, b.v);
      const dist = Math.hypot(b.u - a.u, b.v - a.v), s = (FOC / pa[2] / RIG_PX_PER_M) * sc;
      const flip = pb[0] >= pa[0] ? 1 : -1;
      dog.set({ x: pa[0], y: pa[1], s, flip, gp: f * gpk + lag, amp: clamp(0.4 + dist * 8, 0.5, 1), gallop: 1, wag: f * 0.9 + lag, wagA: 22, head: Math.sin(f * 0.08 + lag) * 4 });
      return pa[2];
    }
    function update(f) {
      const c = camAt(f);
      cam.setAttribute('transform', `translate(960 560) rotate(${R2(c.rot * 100) / 100}) scale(${R2(c.s * 1000) / 1000}) translate(${-c.fx} ${-c.fy})`);
      bear.setAttribute('transform', `translate(${R2(-(c.fx - 1000) * 0.35)} 0)`);
      // leaf dapple drifting over the boards
      let dp = ''; const q = rng(77);
      for (let i = 0; i < 14; i++) { const u = -2 + q() * 6, v = 1.5 + q() * 7, ph = q() * 6; const pp = P(u + Math.sin(f * 0.02 + ph) * 0.1, 0, v); dp += `<ellipse cx="${R2(pp[0])}" cy="${R2(pp[1])}" rx="${R2(0.5 * FOC / pp[2])}" ry="${R2(0.14 * FOC / pp[2])}" fill="#1e140c"/>`; }
      dapple.innerHTML = dp;
      const zA = placeDog(whiteD, f, 0, 0.12, 1.0, 0.72), zB = placeDog(greyD, f, 1.9, -0.16, 1.15, 0.66);
      if (zA > zB) { act.appendChild(whiteD.g); act.appendChild(greyD.g); } else { act.appendChild(greyD.g); act.appendChild(whiteD.g); }
    }
    const fx = (ctx, f) => { motes(ctx, f, 40, 202, '#fff4c8', 2.2, 0.9); ctx.globalCompositeOperation = 'lighter'; rays(ctx, 260, -60, f, 0.06, 'rgba(255,236,170,A)'); ctx.globalCompositeOperation = 'source-over'; };
    return { a: 300, b: 500, update, fx, camAt };
  })();
};
