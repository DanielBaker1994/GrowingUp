/* scene6.js — S6, f 1000..1200. The place from above, after the sale: the camera starts close over the roof, the lawn and the
   fire pit, and rises up and away over the drive, the road and the pines until the lake shows at the top, where we go next.
   Drawn from the family's three drone photos (the long drive in from the road, the clearing in the pines, the roof with the
   small cabin at its left). One world, one camera: the clearing is a detailed inset drawn at 0.3 scale, so the zoom is continuous. */
let S6; const initS6 = () => {
  S6 = (() => {
    const svg = $('sv6'), defs = svgEl('defs'); svg.appendChild(defs);
    const world = svgEl('g'); svg.appendChild(world);
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const r = rng(6001);
    const CX = 859, CY = 624, CK = 0.3; // where the clearing inset sits in the world, and its scale

    // ---------- sky, far shore, the lake ----------
    const sky = svgEl('g'); world.appendChild(sky);
    ins(sky, `<rect x="-900" y="-900" width="3800" height="1000" fill="${grad(defs, [[0, '#a9c4dc'], [0.7, '#d6e2e4'], [1, '#e9eadb']])}"/>`);
    ins(sky, `<path d="${ridgePath(ridgeFn(6002, 20, 10), 6002, -900, 2800, 18, 1.4, 70)}" fill="#6f8f8c"/>`);
    ins(sky, `<path fill="#a9cbd8" d="${blob(930, 46, 330, 17, 6003, 30, 0.12)}"/><path fill="#c9e0e6" opacity=".6" d="${blob(900, 44, 200, 6, 6004, 20, 0.2)}"/>`);
    // ---------- the forest, row on row, small at the horizon and larger toward us ----------
    const land = svgEl('g'); world.appendChild(land);
    ins(land, `<rect x="-900" y="40" width="3800" height="1400" fill="#355f37"/>`);
    // the meadow and the wet channel winding out to the horizon, with a pond
    const CL = [[-260, 1080, 440], [60, 950, 400], [300, 810, 300], [500, 700, 210], [700, 570, 150], [900, 440, 105], [1150, 340, 76], [1400, 250, 52], [1680, 185, 34], [1960, 130, 24]];
    const edge = (sgn) => CL.map((p, i) => { const q = CL[Math.min(CL.length - 1, i + 1)], o = CL[Math.max(0, i - 1)]; const dx = q[0] - o[0], dy = q[1] - o[1], L = Math.hypot(dx, dy) || 1; return [p[0] + (-dy / L) * p[2] * 0.5 * sgn, p[1] + (dx / L) * p[2] * 0.5 * sgn * 0.62]; });
    const A = edge(1), B = edge(-1).reverse(), poly = A.concat(B);
    const meadowD = 'M' + poly.map((p) => `${R2(p[0])} ${R2(p[1])}`).join(' L') + 'Z';
    ins(land, `<path fill="#9fbd63" d="${meadowD}"/>`);
    const inner = CL.map((p, i) => [p[0], p[1], p[2] * 0.62]); const edge2 = (sgn) => inner.map((p, i) => { const q = inner[Math.min(inner.length - 1, i + 1)], o = inner[Math.max(0, i - 1)]; const dx = q[0] - o[0], dy = q[1] - o[1], L = Math.hypot(dx, dy) || 1; return [p[0] + (-dy / L) * p[2] * 0.5 * sgn, p[1] + (dx / L) * p[2] * 0.5 * sgn * 0.62]; });
    ins(land, `<path fill="#b4cc77" d="M${edge2(1).concat(edge2(-1).reverse()).map((p) => `${R2(p[0])} ${R2(p[1])}`).join(' L')}Z"/>`);
    for (let i = 0; i < 70; i++) { const k = r() * (CL.length - 2), p = CL[Math.floor(k)], q = CL[Math.floor(k) + 1], t = k % 1; const x = lerp(p[0], q[0], t) + (r() - 0.5) * p[2] * 0.6, y = lerp(p[1], q[1], t) + (r() - 0.5) * p[2] * 0.3, sz = 6 + r() * 14 * (p[2] / 300 + 0.3); ins(land, `<path fill="${['#7da050', '#c7d98a', '#86a95a', '#d6dd98'][i % 4]}" opacity=".7" d="${blob(x, y, sz * 1.6, sz * 0.7, 6100 + i, 10, 0.3)}"/>`); }
    ins(land, `<path fill="#8fb4bc" d="${blob(430, 770, 62, 20, 6050, 18, 0.14)}"/><path fill="#b7d3d8" opacity=".7" d="${blob(420, 766, 34, 8, 6051, 14, 0.2)}"/>`);
    // the road along the bottom, with its verge
    const road = svgEl('g', { transform: 'translate(0 -40)' }); ins(road, `<path fill="#6d8f4c" d="M-900 1040 Q300 1000 1000 1008 Q1700 1012 2800 950 L2800 1060 Q1700 1100 1000 1086 Q300 1084 -900 1130Z"/><path fill="#85868a" d="M-900 1056 Q300 1016 1000 1024 Q1700 1028 2800 968 L2800 1016 Q1700 1078 1000 1066 Q300 1062 -900 1100Z"/><path fill="none" stroke="#e6cf78" stroke-width="3" stroke-dasharray="46 30" d="M-900 1078 Q300 1040 1000 1046 Q1700 1052 2800 992"/>`);
    // tree canopy rows, skipping the meadow, the clearing and the road
    const inPoly = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
    const GREENS = ['#2c5533', '#2f5a36', '#34613b', '#3a6a3f', '#44764a', '#2a4f31'], LIGHT = ['#4f8150', '#5a8c55', '#6a9a5c'];
    let can = '', hil = '';
    for (let y = 58, n = 0; y < 960; n++) {
      const sz = lerp(22, 62, Math.pow((y - 58) / 950, 1.25));
      for (let x = -700 + r() * sz; x < 2700; x += sz * (1.05 + r() * 0.4)) {
        const xx = x + (r() - 0.5) * sz * 0.5, yy = y + (r() - 0.5) * sz * 0.3;
        if (inPoly(xx, yy) || (xx > CX - 30 && xx < CX + 350 && yy > CY - 30 && yy < 1000) || yy > 940) continue;
        const thin = xx > 1450 && yy > 380 && yy < 760; // the paler, thinner stand at the right
        const col = thin ? (r() > 0.4 ? '#5d8d52' : '#6b9a5a') : GREENS[Math.floor(r() * GREENS.length)];
        can += `<path fill="${col}" d="${blob(xx, yy, sz * (0.55 + r() * 0.2), sz * (0.5 + r() * 0.15), 6200 + n * 97 + Math.floor(x), 8, 0.22)}"/>`;
        if (r() > 0.45) hil += `<path fill="${LIGHT[Math.floor(r() * 3)]}" opacity=".55" d="${blob(xx - sz * 0.16, yy - sz * 0.2, sz * 0.26, sz * 0.2, 6300 + n * 31 + Math.floor(x), 7, 0.25)}"/>`;
      }
      y += sz * 0.52;
    }
    const canG = svgEl('g'); land.appendChild(road); land.appendChild(canG); ins(canG, can + hil);
    // a few tall pines standing out of the canopy, catching the light
    let tall = ''; for (let i = 0; i < 26; i++) { const x = -300 + r() * 2500, y = 140 + r() * 760; if (inPoly(x, y) || (x > CX - 40 && x < CX + 360 && y > CY - 40 && y < 1000)) continue; const s = lerp(0.7, 1.5, (y - 140) / 760); tall += `<path fill="#2a4e31" d="${blob(x, y, 26 * s, 22 * s, 6400 + i, 9, 0.25)}"/><path fill="#58885a" opacity=".6" d="${blob(x - 5 * s, y - 6 * s, 12 * s, 9 * s, 6450 + i, 8, 0.25)}"/>`; }
    ins(canG, tall);
    // the drive's last stretch from the clearing to the road
    ins(land, `<path fill="#c2b393" d="M${CX + 140} ${CY + 330} Q${CX + 150} ${CY + 355} ${CX + 148} ${CY + 386} L${CX + 162} ${CY + 386} Q${CX + 168} ${CY + 352} ${CX + 160} ${CY + 330}Z"/>`);

    // ---------- the clearing, drawn big and placed small ----------
    const C = svgEl('g', { transform: `translate(${CX} ${CY}) scale(${CK})` }); world.appendChild(C);
    const R = rng(6500);
    const lawnBlobs = [blob(540, 420, 470, 400, 6501, 34, 0.1), blob(250, 820, 280, 250, 6502, 26, 0.12), blob(870, 560, 220, 290, 6503, 22, 0.12), blob(560, 1010, 160, 150, 6504, 18, 0.12), blob(240, 330, 230, 200, 6505, 20, 0.12)];
    defs.insertAdjacentHTML('beforeend', `<clipPath id="s6lawn">${lawnBlobs.map((d) => `<path d="${d}"/>`).join('')}</clipPath>`);
    ins(C, lawnBlobs.map((d) => `<path fill="#7fae4e" d="${d}"/>`).join(''));
    let st = ''; for (let i = 0; i < 24; i++) st += `<rect x="-20" y="${i * 50 - 20}" width="1200" height="26" fill="${i % 2 ? '#8dba58' : '#74a446'}" opacity=".55"/>`;
    ins(C, `<g clip-path="url(#s6lawn)">${st}<path fill="#6f9c42" opacity=".55" d="${blob(610, 820, 170, 90, 6506, 18, 0.2)}"/><path fill="#94bd5f" opacity=".5" d="${blob(780, 280, 130, 90, 6507, 18, 0.2)}"/></g>`);
    // the gravel drive, in from the road to the house's right side
    const drv = 'M455 1140 C460 1040 470 990 530 925 C600 850 690 800 710 690';
    ins(C, `<path fill="none" stroke="#b8aa8a" stroke-width="64" stroke-linecap="round" d="${drv}"/><path fill="none" stroke="#cdbf9e" stroke-width="44" stroke-linecap="round" d="${drv}"/><path fill="none" stroke="#a9a07f" stroke-width="10" stroke-dasharray="3 12" d="${drv}" transform="translate(-14 0)"/><path fill="none" stroke="#a9a07f" stroke-width="10" stroke-dasharray="3 12" d="${drv}" transform="translate(14 0)"/><path fill="#a59c7e" opacity=".7" d="${blob(700, 690, 60, 40, 6508, 14, 0.2)}"/>`);
    // the fire pit with its red chairs, the concrete slab, the stone-ringed garden and the stump
    ins(C, `<path fill="#b79a68" d="${blob(150, 850, 130, 95, 6509, 22, 0.16)}"/>` +
      `<circle cx="150" cy="850" r="26" fill="#9a968e"/><circle cx="150" cy="850" r="17" fill="#3b342c"/>` + [0, 72, 144, 216, 288].map((a) => { const x = 150 + Math.cos((a + 20) * D2R) * 62, y = 850 + Math.sin((a + 20) * D2R) * 50; return `<g transform="translate(${R2(x)} ${R2(y)}) rotate(${a + 110})"><rect x="-10" y="-9" width="20" height="18" rx="3" fill="#c0352c"/><rect x="-10" y="-11" width="20" height="5" rx="2" fill="#9a2a24"/></g>`; }).join('') +
      `<g transform="translate(330 900) rotate(-8)"><rect x="6" y="8" width="84" height="124" fill="#000" opacity=".2"/><rect x="0" y="0" width="84" height="124" fill="#c9c6bd"/><rect x="0" y="0" width="84" height="6" fill="#dcd9d0"/></g><path fill="#4d8a3a" d="M398 905 l22 -8 l6 50 l-20 6Z"/>` +
      `<circle cx="300" cy="690" r="40" fill="#8c8a84"/><circle cx="300" cy="690" r="31" fill="#4d8a3a"/><path fill="#3f7a30" d="${blob(300, 690, 26, 24, 6510, 12, 0.3)}"/><circle cx="300" cy="688" r="9" fill="#7b5d3d"/><circle cx="300" cy="688" r="5" fill="#9a7a52"/>` +
      `<g transform="translate(655 965)"><rect x="6" y="8" width="62" height="42" fill="#000" opacity=".25"/><rect x="0" y="0" width="62" height="42" fill="#2b2826"/><rect x="0" y="0" width="62" height="8" fill="#443e39"/></g>`);
    // the little cabin up at the left: rusty roof, a deck with two red chairs, steps
    const CAB = svgEl('g', { transform: 'translate(-50 -20)' }); C.appendChild(CAB);
    ins(CAB, `<rect x="104" y="124" width="150" height="116" fill="#000" opacity=".22" transform="translate(14 12)"/>` +
      `<rect x="100" y="250" width="160" height="62" fill="#d0ab72"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${108 + i * 20}" y="250" width="2" height="62" fill="#a8844f" opacity=".6"/>`).join('') +
      `<path fill="none" stroke="#8a6a48" stroke-width="4" d="M96 252 L96 316 L264 316 L264 252"/>` +
      `<rect x="250" y="288" width="48" height="36" fill="#d0ab72"/><rect x="250" y="288" width="48" height="6" fill="#a8844f" opacity=".6"/>` +
      `<g transform="translate(130 282)"><rect x="-9" y="-8" width="18" height="16" rx="3" fill="#c0352c"/><rect x="-9" y="-10" width="18" height="5" rx="2" fill="#9a2a24"/></g><g transform="translate(166 284)"><rect x="-9" y="-8" width="18" height="16" rx="3" fill="#c0352c"/><rect x="-9" y="-10" width="18" height="5" rx="2" fill="#9a2a24"/></g>` +
      `<rect x="100" y="240" width="156" height="14" fill="#9c7a4c"/><rect x="132" y="216" width="78" height="26" fill="#b98955"/><rect x="152" y="220" width="22" height="30" fill="#f2ede2"/><path fill="#c0352c" d="M176 226 l8 0 l0 12 l-8 0Z"/>` +
      `<path fill="#7a5a44" d="M96 132 L256 132 L252 242 L100 242Z"/><path fill="#8c6a52" d="M96 132 L176 132 L176 242 L100 242Z"/><rect x="172" y="132" width="8" height="110" fill="#5f4433"/><rect x="130" y="108" width="16" height="30" fill="#2e2a28"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<rect x="98" y="${146 + i * 15}" width="156" height="1.5" fill="#000" opacity=".16"/>`).join(''));
    // the house from above: shadow, wall at the front, the gambrel roof, dormers, skylights
    // the long axis runs east-west: the whole house group is turned a quarter turn, its shadow drawn after the turn
    ins(C, `<path fill="#1d3318" opacity=".3" d="M250 228 L650 228 L694 270 L694 500 L250 500Z"/>`);
    const HG = svgEl('g', { transform: 'rotate(90 470 352)' }); C.appendChild(HG);
    ins(HG, `<rect x="338" y="520" width="264" height="58" fill="#bdb196"/><rect x="338" y="570" width="264" height="8" fill="#e6e0cf"/>` + [372, 459, 546].map((x) => `<rect x="${x}" y="536" width="26" height="28" fill="#e9efef"/><rect x="${x + 2}" y="538" width="22" height="24" fill="#8ea5b5"/><rect x="${x + 12}" y="538" width="2" height="24" fill="#e9efef"/>`).join(''));
    ins(HG, `<rect x="250" y="418" width="96" height="130" fill="#d1ad78"/>` + [0, 1, 2, 3, 4].map((i) => `<rect x="${262 + i * 18}" y="418" width="2" height="130" fill="#a8844f" opacity=".6"/>`).join('') + `<path fill="none" stroke="#8a6a48" stroke-width="4" d="M346 418 L250 418 L250 548 L346 548"/><circle cx="288" cy="480" r="12" fill="#ece8de"/><circle cx="288" cy="480" r="12" fill="none" stroke="#8a6a48" stroke-width="2"/>` +
      `<g transform="translate(270 506)"><rect x="-8" y="-7" width="16" height="14" rx="3" fill="#c0352c"/></g>`);
    ins(HG, `<rect x="598" y="330" width="56" height="170" fill="#cfab76"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="598" y="${338 + i * 20}" width="56" height="2" fill="#a8844f" opacity=".6"/>`).join('') + `<path fill="none" stroke="#8a6a48" stroke-width="4" d="M600 330 L654 330 L654 500"/>`);
    // the boardwalk from the turned deck down to the drive
    ins(C, `<path fill="#c9a673" d="M498 482 L520 482 L742 664 L706 704 L498 538Z"/>` + Array.from({ length: 18 }, (_, i) => { const t = i / 18; return `<line x1="${R2(lerp(498, 706, t))}" y1="${R2(lerp(538, 704, t))}" x2="${R2(lerp(520, 742, t))}" y2="${R2(lerp(482, 664, t))}" stroke="#9c7a4c" stroke-width="2" opacity=".6"/>`; }).join('') + `<path fill="none" stroke="#8a6a48" stroke-width="4" d="M498 538 L706 704"/>`);
    // the roof
    ins(HG, `<path fill="#4d535e" d="M352 180 L470 172 L470 526 L338 526Z"/><path fill="#5b626e" d="M470 172 L590 180 L602 526 L470 526Z"/>` +
      `<path fill="none" stroke="#3c414b" stroke-width="3" d="M397 178 L390 526 M545 178 L552 526"/><path fill="none" stroke="#7a818d" stroke-width="3" d="M470 172 L470 526"/>` +
      Array.from({ length: 24 }, (_, i) => `<line x1="340" x2="602" y1="${186 + i * 14.4}" y2="${186 + i * 14.4}" stroke="#000" stroke-width="1" opacity=".14"/>`).join('') +
      [236, 338, 440].map((y) => `<path fill="#636a76" d="M546 ${y} L612 ${y + 10} L612 ${y + 52} L546 ${y + 62}Z"/><path fill="#4f5560" d="M546 ${y + 31} L612 ${y + 31}" stroke="#3c414b" stroke-width="3"/>`).join('') +
      [270, 400].map((y) => `<path fill="#5b626e" d="M394 ${y} L330 ${y + 10} L330 ${y + 52} L394 ${y + 62}Z"/><path d="M330 ${y + 31} L394 ${y + 31}" stroke="#3c414b" stroke-width="3"/>`).join('') +
      `<rect x="498" y="290" width="22" height="34" fill="#a9cce0"/><rect x="498" y="390" width="22" height="34" fill="#a9cce0"/><rect x="430" y="196" width="18" height="18" fill="#2e2a28"/>`);
    // the trees round the clearing and a couple of big ones on the lawn; shadows fall to the lower right
    let tr = '', trs = '';
    const ring = []; for (let i = 0; i < 46; i++) { const a = (i / 46) * Math.PI * 2 + (R() - 0.5) * 0.12, k = 1 + (R() - 0.5) * 0.12; const x = 560 + Math.cos(a) * 640 * k, y = 560 + Math.sin(a) * 640 * k; if (x > 380 && x < 640 && y > 920) continue; ring.push([x, y, 70 + R() * 50]); }
    [[205, 560, 82], [120, 640, 60], [1010, 880, 90], [1040, 300, 80], [60, 420, 70], [330, 40, 80], [860, 30, 80]].forEach((q) => ring.push(q));
    ring.forEach(([x, y, s], i) => { trs += `<path fill="#1a3a20" opacity=".3" d="${blob(x + s * 0.3, y + s * 0.34, s * 0.95, s * 0.85, 6600 + i, 10, 0.2)}"/>`; });
    ring.forEach(([x, y, s], i) => { const dec = i % 5 === 0; tr += `<path fill="${dec ? '#5d9246' : ['#2f5a36', '#34613b', '#2a4f31'][i % 3]}" d="${blob(x, y, s, s * 0.9, 6700 + i, 12, 0.2)}"/><path fill="${dec ? '#79ad58' : '#4f8150'}" opacity=".6" d="${blob(x - s * 0.22, y - s * 0.26, s * 0.5, s * 0.4, 6800 + i, 9, 0.25)}"/>`; });
    ins(C, trs + tr);
    // life on the lawn: Dad on the red mower and the old schnauzer, tiny from up here
    const mow = svgEl('g'); C.appendChild(mow);
    mow.innerHTML = `<g class="m"><rect x="-4" y="-2" width="30" height="20" fill="#000" opacity=".25"/><rect x="0" y="0" width="26" height="16" rx="3" fill="#c93a2a"/><circle cx="8" cy="8" r="7" fill="#4b6ea8"/><circle cx="8" cy="3" r="5" fill="#7a4f2a"/></g><g class="d"><ellipse cx="0" cy="0" rx="9" ry="5" fill="#8d9096"/><circle cx="8" cy="-1" r="4" fill="#8d9096"/></g>`;
    const mm = mow.querySelector('.m'), dd = mow.querySelector('.d');
    // light: soft cloud shadows drifting over the canopy
    const cs = svgEl('g'); world.appendChild(cs);
    ins(cs, [[500, 300, 520, 170], [1500, 620, 600, 190], [1000, 880, 460, 150]].map(([x, y, rx, ry], i) => `<ellipse class="cs" data-i="${i}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#0f2a16" opacity=".12"/>`).join(''));
    const css = [...cs.querySelectorAll('.cs')];
    const warm = svgEl('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'rgba(255,214,150,0.10)' }); svg.appendChild(warm);

    // ---------- camera: up and away from the roof to the wide view with the lake at the top ----------
    const S0 = 3.3, HOUSE = [CX + 470 * CK, CY + 420 * CK];
    const camAt = (f) => { const u = E.inOutCubic(seg(f, 4, 196)), v = E.inOutSine(seg(f, 120, 200)); return { fx: lerp(HOUSE[0], 960, u), fy: lerp(HOUSE[1], 540, u) - 30 * v, s: S0 * Math.pow(1 / S0, u) * (1 + 0.02 * v) }; };
    function update(f) {
      const c = camAt(f);
      world.setAttribute('transform', `translate(960 540) scale(${R2(c.s * 1000) / 1000}) translate(${R2(-c.fx)} ${R2(-c.fy)})`);
      mm.setAttribute('transform', `translate(${R2(560 + 250 * Math.sin(f * 0.012 + 0.6) + 20)} ${R2(610 + 70 * Math.sin(f * 0.02))}) rotate(${R2(8 * Math.cos(f * 0.012 + 0.6))})`);
      dd.setAttribute('transform', `translate(${R2(720 + 60 * Math.sin(f * 0.03))} ${R2(740 + 40 * Math.cos(f * 0.024))}) rotate(${R2(Math.cos(f * 0.03) * 40)})`);
      css.forEach((e, i) => e.setAttribute('transform', `translate(${R2(f * (0.5 + i * 0.2) - 80)} 0)`));
    }
    const fx = (ctx, f) => { motes(ctx, f, 14, 61, '#fff6d8', 2, 0.5); };
    return { a: 1000, b: 1200, update, fx, camAt };
  })();
};
