/* scenes78.js — S7 (2023): Ludwig & Wolfgang tear around the great room (knotty pine, tall white windows, stone chimney,
   the tan leather sofa, sun-grid on the pine floor). S8 (2025): Dad, a son and his wife on the lake deck at dusk; pull back
   through the window to the two schnauzer brothers and Ruby standing at the sill, looking down at them. */

/* ============ S7 : f 1200..1400 ============ */
let S7; const initS7 = () => {
  S7 = (() => {
    const svg = $('sv7'), defs = svgEl('defs'); svg.appendChild(defs);
    const cam = svgEl('g'); svg.appendChild(cam);
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const r = rng(7001);
    const room = svgEl('g'); cam.appendChild(room);
    const PINE = ['#c98a4a', '#d49a58', '#bf7f42', '#cf9150', '#c4843f'];
    // back wall: vertical knotty-pine boards
    let w = `<rect x="-200" y="-200" width="2400" height="940" fill="#c98b4c"/>`;
    for (let x = -200; x < 2200; x += 46) { w += `<rect x="${x}" y="-200" width="44" height="940" fill="${PINE[Math.floor(r() * 5)]}"/><rect x="${x + 44}" y="-200" width="2" height="940" fill="#8a5a2c" opacity=".6"/>`; for (let k = 0; k < 2; k++) if (r() > 0.45) w += `<ellipse cx="${R2(x + 10 + r() * 24)}" cy="${R2(r() * 700)}" rx="${R2(3 + r() * 4)}" ry="${R2(4 + r() * 5)}" fill="#6a3f1e" opacity=".75"/>`; }
    // cathedral ceiling sloping in from the left
    w += `<path d="M-200 -200 L1100 -200 L1100 40 L-200 250Z" fill="#b87a40"/>`;
    for (let i = 0; i < 16; i++) w += `<line x1="${-200 + i * 90}" y1="${R2(250 - i * 90 * 0.162)}" x2="${-200 + i * 90 + 60}" y2="-200" stroke="#8a5a2c" stroke-width="2" opacity=".5"/>`;
    w += `<path d="M-200 250 L1100 40 L1100 58 L-200 270Z" fill="#9a6232"/>`;
    // ceiling light
    w += `<rect x="420" y="112" width="4" height="30" fill="#6a6a70"/><path d="M402 140 L442 140 L436 156 L408 156Z" fill="#b8b8bc"/>`;
    // left windows (green trees beyond)
    const grid = (x, y, ww, hh, cols, rows, glass) => { let s = `<rect x="${x - 10}" y="${y - 10}" width="${ww + 20}" height="${hh + 20}" fill="#f2efe8"/><rect x="${x}" y="${y}" width="${ww}" height="${hh}" fill="${glass}"/>`; for (let i = 0; i < 6; i++) s += `<path fill="${['#3f6a34', '#5a8a42', '#2e4f2a'][i % 3]}" d="${blob(x + r() * ww, y + r() * hh, 60 + r() * 40, 50 + r() * 40, 7100 + i + x, 16, 0.3)}" clip-path="url(#clipw${x})"/>`; s = `<clipPath id="clipw${x}"><rect x="${x}" y="${y}" width="${ww}" height="${hh}"/></clipPath>` + s; for (let i = 1; i < cols; i++) s += `<rect x="${R2(x + (ww * i) / cols - 2)}" y="${y}" width="4" height="${hh}" fill="#f2efe8"/>`; for (let j = 1; j < rows; j++) s += `<rect x="${x}" y="${R2(y + (hh * j) / rows - 2)}" width="${ww}" height="4" fill="#f2efe8"/>`; return s; };
    w += grid(40, 330, 210, 290, 3, 4, '#a9c8a0') + grid(360, 360, 330, 250, 4, 3, '#b3cfa6');
    // stone chimney
    let ch = `<rect x="820" y="-200" width="220" height="940" fill="#8d8378"/>`;
    for (let y = -200; y < 740;) { const hh = 26 + r() * 24; for (let x = 820; x < 1040;) { const ww = 34 + r() * 50; ch += `<path fill="${['#a39584', '#8a7c6c', '#b3a48f', '#978a7b', '#7c7064'][Math.floor(r() * 5)]}" d="${blob(Math.min(x + ww / 2, 1020), y + hh / 2, ww / 2 - 2, hh / 2 - 2, Math.floor(r() * 1e6), 10, 0.12)}"/>`; x += ww; } y += hh; }
    w += ch + `<rect x="812" y="-200" width="8" height="940" fill="#000" opacity=".12"/>`;
    // tall white-framed windows on the right with the clerestory triangles, dim interior reflections
    const tall = (x, y, ww, hh) => `<rect x="${x - 14}" y="${y - 14}" width="${ww + 28}" height="${hh + 28}" fill="#f4f2ec"/><rect x="${x}" y="${y}" width="${ww}" height="${hh}" fill="${grad(defs, [[0, '#e8ecea'], [0.4, '#c3d4c0'], [1, '#6f8f68']])}"/><clipPath id="clt${x}"><rect x="${x}" y="${y}" width="${ww}" height="${hh}"/></clipPath><g clip-path="url(#clt${x})">${[0, 1, 2, 3, 4].map((i) => `<path fill="${['#4f7a42', '#3f6a36', '#6a9a50'][i % 3]}" d="${blob(x + ((i * 57) % ww), y + hh * (0.45 + (i % 3) * 0.18), 70, 60, 7300 + x + i, 16, 0.3)}"/>`).join('')}</g><rect x="${x}" y="${y}" width="${ww}" height="${hh}" fill="#fff" opacity=".12"/>`;
    w += tall(1110, 240, 230, 400) + tall(1400, 170, 250, 470) + tall(1710, 120, 260, 520);
    w += `<path d="M1096 226 L1354 140 L1354 190 L1096 226Z" fill="#f4f2ec"/><path d="M1110 216 L1340 150 L1340 176 L1110 214Z" fill="#3a3834"/><path d="M1386 156 L1664 60 L1664 128 L1386 156Z" fill="#f4f2ec"/><path d="M1400 146 L1650 70 L1650 118 L1400 144Z" fill="#3a3834"/>`;
    w += `<rect x="-200" y="700" width="2400" height="16" fill="#9a6232"/>`;
    ins(room, w);
    // dining table + chair by the left windows
    ins(room, `<rect x="330" y="600" width="330" height="18" fill="#a8743e"/><rect x="350" y="618" width="290" height="80" fill="#e8e4dc" opacity=".55"/><rect x="360" y="618" width="10" height="84" fill="#8a5a2c"/><rect x="620" y="618" width="10" height="84" fill="#8a5a2c"/>` +
      `<path d="M250 520 L280 520 L300 640 L290 700 L280 700 L286 640Z" fill="#b07a40"/><rect x="262" y="630" width="70" height="12" fill="#b07a40"/><rect x="262" y="636" width="70" height="16" fill="#b8402a"/>`);
    // pine floor in one-point perspective
    const VX = 960, VY = 520;
    let fl = `<rect x="-200" y="716" width="2400" height="600" fill="#d7a468"/>`;
    for (let i = -30; i <= 30; i++) { const xb = VX + i * 150; fl += `<line x1="${R2(lerp(VX, xb, (716 - VY) / (1300 - VY)))}" y1="716" x2="${xb}" y2="1300" stroke="#a8743e" stroke-width="2" opacity=".55"/>`; }
    for (let i = 0; i < 26; i++) { const t = r(), y = lerp(730, 1080, t * t), x = r() * 2000 - 40; fl += `<ellipse cx="${R2(x)}" cy="${R2(y)}" rx="${R2(4 + t * 9)}" ry="${R2(2 + t * 4)}" fill="#6a3f1e" opacity=".6"/>`; }
    ins(room, fl);
    // sun grid from the tall windows lying across the floor
    const sun = svgEl('g', { opacity: 0.55 }); room.appendChild(sun);
    let sg = '';
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const x0 = 120 + i * 250 + j * 60, y0 = 760 + j * 105; sg += `<path fill="#fff1c4" opacity=".55" d="M${x0} ${y0} L${x0 + 200} ${y0} L${x0 + 250} ${y0 + 90} L${x0 + 40} ${y0 + 90}Z"/>`; }
    sun.innerHTML = sg;
    // the tan leather sofa
    const sofa = svgEl('g'); room.appendChild(sofa);
    const T = '#c49469', Td = '#9e7148', Tl = '#dcb189';
    sofa.innerHTML =
      `<ellipse cx="1440" cy="970" rx="520" ry="30" fill="#3a2008" opacity=".35"/>` +
      `<path fill="${Td}" d="M1040 690 Q1040 650 1090 648 L1880 640 Q1920 642 1920 690 L1920 850 L1040 850Z"/>` +
      `<path fill="${T}" d="M1060 700 Q1062 668 1100 668 L1480 664 Q1500 700 1490 790 L1066 800Z"/><path fill="${T}" d="M1500 664 L1860 658 Q1890 700 1880 790 L1498 790Z"/>` +
      `<path fill="${Tl}" d="M1110 676 L1460 672 L1462 690 L1110 694Z" opacity=".6"/>` +
      `<path fill="${T}" d="M1080 800 L1900 790 L1910 880 L1070 890Z"/><path fill="${Tl}" d="M1090 804 L1890 796 L1892 812 L1090 820Z" opacity=".55"/><line x1="1490" x2="1494" y1="800" y2="884" stroke="${Td}" stroke-width="3"/>` +
      `<path fill="${Td}" d="M1070 880 L1910 872 L1916 956 L1064 962Z"/><line x1="1490" x2="1492" y1="884" y2="958" stroke="#9a7452" stroke-width="3"/>` +
      `<path fill="${T}" d="M985 760 Q975 690 1040 690 Q1100 690 1098 760 L1100 962 L992 964Z"/><path fill="${Tl}" d="M1000 712 Q1040 700 1086 716 L1086 730 Q1040 716 1000 728Z" opacity=".6"/>` +
      `<rect x="1010" y="962" width="26" height="12" fill="#8a4a24"/><rect x="1860" y="956" width="26" height="12" fill="#8a4a24"/>` +
      // red pillow on the arm side, cream embroidered pillow on the right
      `<path fill="#9a2a2e" d="M1120 780 Q1110 740 1150 730 L1240 724 Q1270 740 1262 786 Q1200 800 1120 780Z"/><path fill="none" stroke="#e6c7a0" stroke-width="3" d="M1150 746 L1230 740 L1236 772 L1154 776Z"/>` +
      `<path fill="#e9e2d6" d="M1560 730 Q1600 690 1700 700 L1820 720 Q1850 760 1812 800 L1600 800 Q1560 780 1560 730Z"/>` + Array.from({ length: 12 }, (_, i) => `<circle cx="${1600 + (i % 6) * 38}" cy="${740 + Math.floor(i / 6) * 34}" r="9" fill="none" stroke="#cfc4b2" stroke-width="2"/>`).join('');
    // muntin shadows across the sofa
    const sh = svgEl('g', { opacity: 0.2 }); room.appendChild(sh);
    sh.innerHTML = [0, 1, 2, 3].map((i) => `<path fill="#3a2410" d="M${1080 + i * 220} 640 L${1110 + i * 220} 640 L${980 + i * 220} 980 L${950 + i * 220} 980Z"/>`).join('') + `<path fill="#3a2410" d="M1040 760 L1920 740 L1920 752 L1040 772Z"/>`;
    // the room corner under the eaves sits in shade, which keeps the year and notes readable
    ins(svg, `<rect x="0" y="0" width="1920" height="1080" fill="${radial(defs, [[0, '#1e0e04', 0.62], [0.55, '#1e0e04', 0.3], [1, '#1e0e04', 0]])}" transform="translate(330 230) scale(1.0 0.62) translate(-960 -540)" pointer-events="none"/>`);
    const act = svgEl('g'); cam.appendChild(act);
    const lud = makeDog(act, { kind: 'schnauzer', body: '#1c1c23', dark: '#111116', beard: '#8e929c', furn: '#6c707a', earFold: 1, collar: '#0e0e12' });
    const wolf = makeDog(act, { kind: 'schnauzer', body: '#1c1c23', dark: '#111116', beard: '#9a9ea8', furn: '#737782', earFold: 1, collar: '#2f7be0' });
    const labs = ['Ludwig', 'Wolfgang'].map((n) => { const d = document.createElement('div'); d.className = 'lab'; d.textContent = n; $('names').appendChild(d); return d; });
    const camAt = (f) => { const k = E.inOutSine(seg(f, 0, 200)); return { fx: lerp(900, 1020, k), fy: lerp(600, 640, k), s: lerp(1.0, 1.1, k), rot: Math.sin(f * 0.02) * 0.2 }; };
    // zoomies: a loop on the floor in front of the sofa, then both jump up onto the cushions
    const om = (2 * Math.PI) / 84;
    const loop = (th) => ({ x: 600 + 420 * Math.sin(th), y: 990 + 46 * Math.cos(th) });
    const hop = (f, t0, from, to) => { const k = seg(f, t0, t0 + 14); return { x: lerp(from.x, to.x, E.inOutSine(k)), y: lerp(from.y, to.y, E.inOutSine(k)) - Math.sin(k * Math.PI) * 90, k }; };
    const LUD_J = 150, WOLF_J = 136;
    function dogAt(f, ph, tJ, seat) {
      const th = om * Math.min(f, tJ - 14) + ph;
      const p0 = loop(th);
      if (f < tJ - 14) return { ...p0, flip: Math.cos(th) >= 0 ? 1 : -1, run: 1, air: 0 };
      // dash to the arm, then hop onto the seat
      const kk = seg(f, tJ - 14, tJ), start = loop(om * (tJ - 14) + ph), pre = { x: 1040, y: 1000 };
      if (f < tJ) return { x: lerp(start.x, pre.x, E.inSine(kk)), y: lerp(start.y, pre.y, kk), flip: 1, run: 1, air: 0 };
      const h = hop(f, tJ, pre, seat);
      return { x: h.x, y: h.y, flip: 1, run: h.k < 1 ? 0.3 : 0, air: h.k < 1 ? 1 : 0, landed: h.k >= 1 };
    }
    function update(f) {
      const c = camAt(f);
      cam.setAttribute('transform', `translate(960 560) rotate(${c.rot}) scale(${c.s}) translate(${-c.fx} ${-c.fy})`);
      sun.setAttribute('opacity', R2(0.5 + 0.06 * Math.sin(f * 0.03)));
      const W = dogAt(f, 0, WOLF_J, { x: 1460, y: 814 }), Lp = dogAt(f, -0.95, LUD_J, { x: 1290, y: 818 });
      const settleW = E.inOutSine(seg(f, WOLF_J + 18, WOLF_J + 40)), settleL = E.inOutSine(seg(f, LUD_J + 16, LUD_J + 40));
      const bow = (0.5 + 0.5 * Math.sin(f * 0.21)) * (f % 70 > 40 ? 1 : 0.2);
      wolf.set({ x: W.x, y: W.y, s: 1.35, flip: W.landed ? -1 : W.flip, gp: f * 0.8, amp: W.run ? 0.9 : 0, gallop: 1, bow: W.air ? 0 : bow * 0.5 * (1 - settleW), spin: W.air ? -14 * Math.sin(seg(f, WOLF_J, WOLF_J + 14) * Math.PI) : 0, sit: settleW, wag: f * 1.1, wagA: 24, head: -4 * settleW });
      lud.set({ x: Lp.x, y: Lp.y, s: 1.4, flip: Lp.landed ? -1 : Lp.flip, gp: f * 0.76 + 1, amp: Lp.run ? 0.9 : 0, gallop: 1, bow: Lp.air ? 0 : (1 - bow) * 0.5 * (1 - settleL), spin: Lp.air ? -14 * Math.sin(seg(f, LUD_J, LUD_J + 14) * Math.PI) : 0, lie: settleL, wag: f * 1.0, wagA: 22 * (1 - settleL * 0.7), head: 6 * settleL });
      ordr(act, lud, wolf, Lp.y, W.y);
      [[labs[0], Lp, 38, -120], [labs[1], W, 64, 30]].forEach(([el, p, at, dxl], i) => {
        const [sx, sy] = w2s(c, p.x, p.y - 150);
        const a = E.inOutSine(seg(f, at, at + 20)) * (1 - E.inOutSine(seg(f, 176, 196)));
        el.style.opacity = R2(a); el.style.left = R2(sx + dxl) + 'px'; el.style.top = R2(sy - 78 - (1 - a) * 8) + 'px'; el.style.transform = `rotate(${i ? 3 : -3}deg)`;
        el.style.clipPath = `inset(-10px ${R2((1 - E.inOutSine(seg(f, at, at + 26))) * 100)}% -10px 0)`;
      });
    }
    const fx = (ctx, f) => { motes(ctx, f, 60, 12, '#fff3cf', 2.2, 0.8); ctx.globalCompositeOperation = 'lighter'; rays(ctx, 1700, 120, f, 0.06, 'rgba(255,230,170,A)'); ctx.globalCompositeOperation = 'source-over'; };
    return { a: 1200, b: 1400, update, fx, camAt };
  })();
};

/* ============ S8 : f 1400..1790 ============ */
let S8; const initS8 = () => {
  S8 = (() => {
    const svg = $('sv8'), defs = svgEl('defs'); svg.appendChild(defs);
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const r = rng(8001);
    // two planes that pull back at different rates: the view outside, and the room with the window + dogs
    const outG = svgEl('g'); svg.appendChild(outG);
    const inG = svgEl('g'); svg.appendChild(inG);
    // ----- outside, laid out for the final wide frame (window opening 150..1770 x 40..640) -----
    // dusk lake: pastel cloud reflections in soft bands
    ins(outG, `<rect x="-400" y="-300" width="2800" height="1300" fill="${grad(defs, [[0, '#b9b6c8'], [0.35, '#d8c8c8'], [0.6, '#c7bfc7'], [1, '#8f98ab']])}"/>`);
    let lk = '';
    for (let i = 0; i < 40; i++) { const y = -100 + r() * 1000, x = r() * 2400 - 300; lk += `<path fill="${['#efd9c6', '#f4e2c8', '#a9aec2', '#c9c3d2', '#f0cdb4'][Math.floor(r() * 5)]}" opacity="${R2(0.35 + r() * 0.4)}" d="${blob(x, y, 180 + r() * 320, 10 + r() * 26, 8100 + i, 22, 0.2)}"/>`; }
    const ripples = svgEl('g'); outG.appendChild(ripples);
    ins(outG, lk);
    let rp = ''; for (let i = 0; i < 80; i++) { const y = r() * 900, x = r() * 2200 - 150; rp += `<rect class="rp" x="${R2(x)}" y="${R2(y)}" width="${R2(40 + r() * 160)}" height="2" rx="1" fill="#fff6ea" opacity=".3" data-p="${R2(r() * 6)}"/>`; }
    ins(ripples, rp);
    const rps = [...ripples.querySelectorAll('.rp')];
    // far shore, a thin dark band at the very top of the view
    ins(outG, `<path d="${ridgePath(ridgeFn(811, 30, 10), 811, -400, 2400, 14, 1.4, -300).replace(/L2400 -300Z$/, 'L2400 -300Z')}" fill="#4a5058"/>`);
    ins(outG, `<rect x="-400" y="-300" width="2800" height="${300 + 22}" fill="#4a5058"/><path fill="#4a5058" d="${forest(ridgeFn(812, 24, 8), -400, 2400, 26, 20, 46, 813, 0)}"/>`);
    // a moored boat lift at the upper right
    ins(outG, `<path fill="#2e3136" d="M1480 60 L1760 58 L1760 76 L1480 78Z"/><rect x="1500" y="76" width="6" height="40" fill="#2e3136"/><rect x="1730" y="76" width="6" height="40" fill="#2e3136"/>`);
    // green floating raft at left
    ins(outG, `<path fill="#4aa39a" d="M-60 360 L200 330 L250 400 L-40 440Z"/><path fill="#2f7a72" d="M-40 440 L250 400 L250 412 L-40 452Z"/>`);
    // the deck from above: glass panels in a wood frame, a corner post, weathered boards
    const DK = svgEl('g', { transform: 'translate(725 640) scale(0.74) translate(-760 -600)' }); outG.appendChild(DK);
    let dk = `<path fill="#9a8a72" d="M420 520 L1040 500 L1200 700 L380 760Z"/>`;
    for (let i = 0; i < 16; i++) { const t = i / 16; dk += `<line x1="${R2(lerp(420, 380, t))}" y1="${R2(lerp(520, 760, t))}" x2="${R2(lerp(1040, 1200, t))}" y2="${R2(lerp(500, 700, t))}" stroke="#7a6c58" stroke-width="2"/>`; }
    ins(DK, dk);
    // railing (behind the people, toward the lake)
    const rail = svgEl('g'); DK.appendChild(rail);
    rail.innerHTML = `<path fill="#c9ccd0" opacity=".35" d="M320 430 L1060 400 L1060 490 L320 530Z"/><path fill="#c9ccd0" opacity=".35" d="M1060 400 L1230 470 L1230 560 L1060 490Z"/>` +
      `<path fill="#a47a52" d="M300 420 L1062 390 L1062 402 L300 434Z"/><path fill="#a47a52" d="M1062 390 L1240 462 L1240 474 L1062 402Z"/>` +
      [320, 520, 720, 900, 1060, 1230].map((x) => `<rect x="${x - 5}" y="${x === 1230 ? 462 : R2(lerp(428, 396, (x - 300) / 760))}" width="10" height="${x === 1230 ? 110 : 108}" fill="#94704c"/>`).join('') +
      `<rect x="300" y="428" width="10" height="112" fill="#94704c"/>`;
    const ppl = svgEl('g'); DK.appendChild(ppl);
    const dad = makePersonBack(ppl, { top: '#4c6fa4', shorts: '#1b1c20', skin: '#dfae8c', hair: '#8f8a86', bald: 1, shoe: '#e6e3dd' });
    const son = makePersonBack(ppl, { top: '#243049', shorts: '#15161a', skin: '#e2b18e', hair: '#6a4a30', shoe: '#2a2b30' });
    const dil = makePersonBack(ppl, { top: '#f1efe9', shorts: '#e7e6b8', skin: '#e6bf9c', hair: '#1c1714', pony: true, shoe: '#f0eee8' });
    // chairs: red Adirondack and a folding chair, in front of the people
    ins(DK, `<g transform="translate(560 690)"><path fill="#b8302c" d="M-60 -10 L40 -18 L50 20 L-50 30Z"/><path fill="#c8403a" d="M-40 -80 L20 -86 L30 -20 L-36 -14Z"/><path fill="#8a2420" d="M-66 -34 L-40 -36 L-40 30 L-60 32Z"/><path fill="#8a2420" d="M34 -40 L58 -42 L56 22 L40 22Z"/><path fill="#9a2a26" d="M-70 -40 L-36 -42 L-36 -34 L-70 -32Z"/></g>` +
      `<g transform="translate(830 700) scale(0.85)"><path fill="none" stroke="#2a2a2e" stroke-width="5" d="M-40 60 L0 -70 M40 60 L10 -20 M-40 -10 L50 -20"/><path fill="#7a7c84" d="M-6 -86 L46 -80 L40 -10 L-20 -16Z"/><path fill="#60626a" d="M-40 -14 L50 -22 L56 -6 L-36 2Z"/></g>`);
    // inukshuk on the rock at right, goldenrod and sumac in the foreground
    ins(outG, `<path fill="#6e6f70" d="M1260 760 Q1380 700 1560 740 L1640 900 L1180 900Z"/>` +
      `<g transform="translate(1420 740)"><path fill="#4a4c50" d="${blob(0, -40, 46, 42, 8201, 12, 0.14)}"/><path fill="#56585c" d="M-70 -104 L66 -110 L60 -84 L-64 -80Z"/><path fill="#4f5156" d="M-50 -150 L48 -154 L44 -110 L-46 -106Z"/><path fill="#5d5f63" d="M-80 -180 L74 -186 L70 -156 L-76 -150Z"/><path fill="#4a4c50" d="M-40 -216 L40 -222 L38 -186 L-38 -182Z"/><path fill="#5a5c60" d="M-26 -246 L24 -250 L22 -222 L-24 -218Z"/></g>`);
    let gr = '';
    for (let i = 0; i < 26; i++) { const x = 180 + r() * 1500, y = 700 + r() * 140; gr += `<path fill="${['#4e6a38', '#5d7a40', '#3f5a30'][i % 3]}" d="${blob(x, y, 60 + r() * 50, 30 + r() * 20, 8300 + i, 18, 0.4)}"/>`; if (i % 2) gr += `<path fill="#d9c23a" d="${blob(x + 10, y - 26, 16, 7, 8400 + i, 12, 0.4)}"/><path fill="#e8d04a" d="${blob(x - 12, y - 18, 12, 6, 8450 + i, 12, 0.4)}"/>`; }
    ins(outG, gr);
    // ----- inside: pine wall around the window, sill, wainscot, floor -----
    const PINE = ['#b27a44', '#bd8650', '#a86f3c', '#b88048'];
    let wall = `<path fill-rule="evenodd" fill="#b07844" d="M-400 -300 L2400 -300 L2400 1400 L-400 1400Z M150 40 L1770 40 L1770 640 L150 640Z"/>`;
    for (let x = -400; x < 2400; x += 52) wall += `<rect x="${x}" y="-300" width="50" height="1700" fill="${PINE[Math.floor(r() * 4)]}" clip-path="url(#s8wall)"/><rect x="${x + 50}" y="-300" width="2" height="1700" fill="#7a4e26" opacity=".5" clip-path="url(#s8wall)"/>`;
    defs.insertAdjacentHTML('beforeend', `<clipPath id="s8wall"><path clip-rule="evenodd" d="M-400 -300 L2400 -300 L2400 1400 L-400 1400Z M150 40 L1770 40 L1770 640 L150 640Z"/></clipPath>`);
    ins(inG, wall);
    // window: white sashes + muntins (two units, three panes over two like the photo), sill and apron
    let win = `<rect x="150" y="40" width="1620" height="16" fill="#efece4"/><rect x="150" y="40" width="16" height="600" fill="#efece4"/><rect x="1754" y="40" width="16" height="600" fill="#efece4"/><rect x="944" y="40" width="32" height="600" fill="#efece4"/>`;
    [[166, 944], [976, 1754]].forEach(([a, b]) => { const m = (a + b) / 2; win += `<rect x="${a}" y="330" width="${b - a}" height="22" fill="#efece4"/><rect x="${R2(m - 4)}" y="40" width="8" height="600" fill="#efece4"/><rect x="${a}" y="${R2(190)}" width="${b - a}" height="7" fill="#efece4"/>` + `<rect x="${a}" y="350" width="${b - a}" height="4" fill="#cfcbc2"/>`; });
    win += `<rect x="130" y="630" width="1660" height="26" fill="#c99158"/><rect x="130" y="630" width="1660" height="6" fill="#dcaa70"/><rect x="146" y="656" width="1628" height="22" fill="#9a6232"/>`;
    ins(inG, win);
    ins(inG, `<g clip-path="url(#s8glass)" opacity=".09">${[0, 1, 2, 3].map((i) => `<path fill="#fff" d="M${300 + i * 420} 40 L${380 + i * 420} 40 L${200 + i * 420} 640 L${120 + i * 420} 640Z"/><path fill="#fff" d="M${400 + i * 420} 40 L${412 + i * 420} 40 L${232 + i * 420} 640 L${220 + i * 420} 640Z"/>`).join('')}</g>`);
    defs.insertAdjacentHTML('beforeend', `<clipPath id="s8glass"><rect x="150" y="40" width="1620" height="600"/></clipPath>`);
    // wainscot boards + floor
    let wn = `<rect x="-400" y="678" width="2800" height="300" fill="#b98250"/>`;
    for (let x = -400; x < 2400; x += 92) wn += `<rect x="${x + 90}" y="678" width="3" height="300" fill="#7a4e26" opacity=".55"/>` + (r() > 0.5 ? `<ellipse cx="${R2(x + 30 + r() * 40)}" cy="${R2(700 + r() * 240)}" rx="4" ry="5" fill="#6a3f1e" opacity=".7"/>` : '');
    wn += `<rect x="-400" y="960" width="2800" height="18" fill="#8a5a2c"/><rect x="-400" y="978" width="2800" height="500" fill="#c8945a"/>`;
    for (let i = 0; i < 10; i++) wn += `<line x1="-400" x2="2400" y1="${990 + i * 24}" y2="${990 + i * 24}" stroke="#a87440" stroke-width="2" opacity=".5"/>`;
    // dusk light from the window lying on the floor
    wn += `<path fill="#ffe0b8" opacity=".25" d="M260 978 L1700 978 L1900 1200 L60 1200Z"/>`;
    ins(inG, wn);
    const dogsG = svgEl('g'); inG.appendChild(dogsG);
    const fgIn = svgEl('g'); inG.appendChild(fgIn);
    fgIn.innerHTML = `<path fill="#1e1a1c" d="M-400 1030 L240 1010 L300 1200 L-400 1200Z"/>` + Array.from({ length: 10 }, (_, i) => `<path fill="#e9e4dc" d="M${-20 + i * 26} ${1036 + (i % 3) * 14} l6 -3 l6 3 l-6 3Z"/>`).join('') +
      `<path fill="#6a3a22" d="M560 1100 Q560 1046 610 1042 L1060 1036 Q1110 1040 1112 1100Z"/><path fill="#8a5232" d="M600 1046 L1070 1040 L1070 1052 L600 1058Z" opacity=".7"/><path fill="#8a2a36" d="M620 1044 L660 1016 L690 1044Z"/>`;
    const ludB = makeDogBack(dogsG, { kind: 'schnauzer', body: '#1d1d24', furn: '#8e929c', collar: '#15151a' });
    const wolfB = makeDogBack(dogsG, { kind: 'schnauzer', body: '#1d1d24', furn: '#9a9ea8', collar: '#2f7be0' });
    const ruby = makeDogBack(dogsG, { kind: 'doodle', body: '#b8754a' });
    // warm interior falloff so the window reads bright
    ins(inG, `<rect x="-400" y="-300" width="2800" height="1700" fill="${radial(defs, [[0, '#000', 0], [0.6, '#000', 0.05], [1, '#1a0c04', 0.5]])}" pointer-events="none"/>`);
    // ----- camera: close on the three at the rail -> pull back through the glass to the dogs at the sill -----
    const FOC = [740, 545];
    const pull = (f) => E.inOutCubic(seg(f, 118, 262));
    const camOut = (f) => { const k = pull(f); return { s: lerp(3.05, 1.0, k) * (1 + 0.02 * (1 - k) * E.inOutSine(seg(f, 0, 118))), fx: lerp(FOC[0], 960, k), fy: lerp(FOC[1], 540, k) }; };
    const camIn = (f) => { const k = pull(f); return { s: lerp(4.6, 1.0, k), fx: lerp(FOC[0] + 30, 960, k), fy: lerp(FOC[1] - 40, 540, k) }; };
    const camAt = camOut;
    function update(f) {
      const co = camOut(f), ci = camIn(f), k = pull(f);
      outG.setAttribute('transform', `translate(960 540) scale(${R2(co.s * 1000) / 1000}) translate(${R2(-co.fx)} ${R2(-co.fy)})`);
      inG.setAttribute('transform', `translate(960 540) scale(${R2(ci.s * 1000) / 1000}) translate(${R2(-ci.fx)} ${R2(-ci.fy)})`);
      inG.style.display = k < 0.005 ? 'none' : ''; const fi = E.inOutSine(seg(k, 0.0, 0.22)); inG.style.opacity = R2(fi); inG.style.filter = fi < 1 ? `blur(${R2((1 - fi) * 14)}px)` : 'none';
      rps.forEach((e) => e.setAttribute('opacity', R2(0.12 + 0.2 * Math.sin(f * 0.07 + +e.dataset.p * 1.7))));
      // the three at the rail: dad leans on it, the son lifts his hands to his head, his wife turns to them
      const breathe = Math.sin(f * 0.07);
      dad.set({ x: 600, y: 590, s: 1.0, alA: -8, arA: -8, lean: -1 + breathe * 0.4, nod: Math.sin(f * 0.05) * 1.2 });
      const hh = E.inOutSine(seg(f, 30, 60)) * (1 - E.inOutSine(seg(f, 220, 250)));
      son.set({ x: 760, y: 580, s: 1.02, alA: lerp(-6, 196, hh), arA: lerp(-6, 196, hh), lean: 0.6 * breathe });
      const tn = E.inOutSine(seg(f, 70, 100));
      dil.set({ x: 940, y: 574, s: 0.95, alA: 18, arA: 26, turn: -5 * tn, lean: -2 * tn });
      // dogs rise up to the sill one after another (Ludwig, Wolfgang, then Ruby), heads tipped down at the deck
      const up = (t0) => spring(f - t0, 0.3, 0.55) * (f > t0 ? 1 : 0);
      const u1 = up(170), u2 = up(186), u3 = up(204);
      ludB.set({ x: 520, y: 972, s: 1.36, up: clamp(u1, 0, 1.03), tilt: -3 + Math.sin(f * 0.05) * 2, bob: 6, wag: f * 0.5, wagA: 12, turn: 4 });
      wolfB.set({ x: 900, y: 978, s: 1.38, up: clamp(u2, 0, 1.03), tilt: 4 + Math.sin(f * 0.06 + 1) * 2, bob: 5, wag: f * 0.55 + 1, wagA: 14, turn: -2 });
      ruby.set({ x: 1300, y: 982, s: 1.34, up: clamp(u3, 0, 1.03), tilt: -6 + 7 * E.inOutSine(seg(f, 280, 310)), bob: 4, wag: f * 0.45, wagA: 16, turn: -6 + 10 * E.inOutSine(seg(f, 280, 310)) });
    }
    const fx = (ctx, f) => {
      const k = pull(f);
      motes(ctx, f, Math.round(30 * k), 23, '#ffe8c8', 2, 0.5);
    };
    return { a: 1400, b: 1790, update, fx, camAt };
  })();
};
