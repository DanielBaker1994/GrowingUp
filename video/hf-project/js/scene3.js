/* scene3.js — S3 (2006, October): taking the ramp out. Modelled on the family's shore: white pines over a granite
   face, the black hose down the slope, the carved bear on its stump, a stone wall with a concrete cap and a slab
   ledge, the mat-topped ramp onto weathered grey floating sections, tea-dark water. f 500..700 (local 0..200) */
let S3; const initS3 = () => {
  S3 = (() => {
    const svg = $('sv3'), defs = svgEl('defs'); svg.appendChild(defs);
    const cam = svgEl('g'); svg.appendChild(cam);
    const L = {}; const layer = (n, h = '') => { const g = svgEl('g', {}, h); cam.appendChild(g); L[n] = g; return g; };
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const r = rng(5061);
    const CAP = 690, LEDGE = 800, WAT = 832;
    layer('sky', `<rect x="-600" y="-300" width="3200" height="800" fill="${grad(defs, [[0, '#9cc3e4'], [1, '#e2ecee']])}"/>`);
    // granite face under pine-needle duff
    const rock = layer('rock');
    let top = `M-600 1100 L-600 240`;
    for (let x = -600; x <= 2600; x += 40) top += ` L${x} ${R2(210 + Math.sin(x * 0.004) * 24 + Math.sin(x * 0.013) * 10)}`;
    ins(rock, `<path d="${top} L2600 1100Z" fill="${grad(defs, [[0, '#6a4232'], [0.5, '#7a4a36'], [1, '#6c4030']])}"/>`);
    const GR = ['#8e8a86', '#a8a29b', '#9b928d', '#b3a79f', '#86817d', '#a09a96', '#7f7b78'];
    let slabs = '';
    for (let i = 0; i < 64; i++) {
      const cx = r() * 3000 - 500, cy = 270 + Math.pow(r(), 0.7) * 400, w = 60 + r() * 220, h = 40 + r() * 120, k = r() * 0.3 - 0.15;
      const pts = [[cx - w / 2, cy + h / 2], [cx - w / 2 + r() * 20, cy - h / 2 + r() * 20], [cx + w * (r() * 0.3), cy - h / 2 - r() * 14], [cx + w / 2, cy - h / 2 + r() * 30], [cx + w / 2 - r() * 20, cy + h / 2]];
      slabs += `<path fill="${GR[Math.floor(r() * GR.length)]}" d="M${pts.map((p) => `${R2(p[0])} ${R2(p[1] + (p[0] - cx) * k)}`).join(' L')}Z"/>`;
      slabs += `<path fill="#4a4442" opacity=".35" d="M${R2(cx - w / 2)} ${R2(cy + h / 2 - (w / 2) * k)} L${R2(cx + w / 2 - 20)} ${R2(cy + h / 2 + (w / 2) * k)} L${R2(cx + w / 2 - 22)} ${R2(cy + h / 2 + (w / 2) * k + 7)} L${R2(cx - w / 2)} ${R2(cy + h / 2 - (w / 2) * k + 7)}Z"/>`;
      for (let j = 0; j < 5; j++) slabs += `<circle cx="${R2(cx + (r() - 0.5) * w * 0.8)}" cy="${R2(cy + (r() - 0.5) * h * 0.7)}" r="${R2(3 + r() * 9)}" fill="${r() > 0.5 ? '#c9cfb4' : '#dfe3d3'}" opacity=".28"/>`;
    }
    ins(rock, slabs);
    // juniper and bracken spilling over the rock
    for (let i = 0; i < 12; i++) { const x = 700 + r() * 1800, y = 560 + r() * 110; for (let k = 0; k < 3; k++) ins(rock, `<path fill="${['#58703a', '#7c8a44', '#9a9a52'][k]}" d="${blob(x + k * 18, y - k * 10, 90 - k * 22, 30 - k * 5, 5300 + i * 7 + k, 22, 0.42)}"/>`); }
    // black corrugated hose down the slope into the water
    const hose = `M-60 240 C60 380 200 520 300 600 S420 700 470 ${LEDGE + 30}`;
    ins(rock, `<path fill="none" stroke="#121212" stroke-width="15" stroke-linecap="round" d="${hose}"/><path fill="none" stroke="#2e2e2e" stroke-width="15" stroke-dasharray="2.5 5" d="${hose}"/>`);
    // white pines: dark trunks, a dense layered crown across the top of frame
    const pines = layer('pines');
    let pp = '';
    [[-380, 12, 1], [60, 14, 2], [520, 11, 3], [980, 15, 4], [1420, 12, 5], [1860, 14, 6], [2300, 12, 7]].forEach(([x, w, s]) => {
      const q = rng(5100 + s), lean = (q() - 0.5) * 60;
      pp += `<path fill="#3a2e27" d="M${x - w} 300 L${R2(x + lean - w * 0.5)} -60 L${R2(x + lean + w * 0.5)} -60 L${x + w} 300Z"/>`;
      for (let b = 0; b < 3; b++) { const y = 120 + b * 60, side = b % 2 ? 1 : -1; pp += `<path fill="#3a2e27" d="M${R2(x + lean * (1 - y / 300))} ${y} L${R2(x + side * (90 + q() * 60))} ${R2(y - 50)} L${R2(x + side * (90 + q() * 60))} ${R2(y - 42)}Z"/>`; }
    });
    const crown = (cx, cy, rx, seed) => { const q = rng(seed); let d = ''; for (let i = 0; i < 9; i++) { const x = cx + (q() - 0.5) * rx * 2, y = cy + (q() - 0.5) * 90; d += `<path fill="${['#2c4f2e', '#3b6534', '#4f7e3c', '#6c9a4a'][Math.min(3, Math.floor(q() * 4))]}" d="${blob(x, y, 70 + q() * 70, 22 + q() * 16, Math.floor(q() * 1e6), 20, 0.34)}"/>`; } return d; };
    for (let i = 0; i < 9; i++) pp += crown(-500 + i * 360, 40 + (i % 2) * 50, 220, 5150 + i);
    for (let i = 0; i < 8; i++) pp += crown(-320 + i * 380, 150 + (i % 3) * 20, 150, 5170 + i);
    ins(pines, pp);
    // stone wall, concrete cap, slab ledge
    const wall = layer('wall');
    let st = `<rect x="-600" y="${CAP + 6}" width="3200" height="${LEDGE - CAP}" fill="#55514d"/>`;
    for (let y = CAP + 8; y < LEDGE - 4;) { const h = 13 + r() * 11; for (let x = -600; x < 2600;) { const w = 40 + r() * 90; st += `<path fill="${['#8b857f', '#77726d', '#9a948c', '#6d6864', '#a39c92'][Math.floor(r() * 5)]}" d="M${R2(x + 2)} ${R2(y + 2)} L${R2(x + w - 2)} ${R2(y + 1 + r() * 3)} L${R2(x + w - 3)} ${R2(y + h - 1)} L${R2(x + 3)} ${R2(y + h - r() * 3)}Z"/>`; x += w; } y += h; }
    ins(wall, st + `<rect x="-600" y="${CAP - 14}" width="3200" height="22" fill="#b7b1a7"/><rect x="-600" y="${CAP - 14}" width="3200" height="5" fill="#d4cec4"/>`);
    ins(wall, `<path fill="#a49d92" d="M-600 ${LEDGE} L1130 ${LEDGE} L1150 ${LEDGE + 30} L-600 ${LEDGE + 30}Z"/><rect x="-600" y="${LEDGE}" width="1730" height="5" fill="#c3bcb1"/><path fill="#2a241e" opacity=".7" d="M-600 ${LEDGE + 30} L1150 ${LEDGE + 30} L1150 ${LEDGE + 40} L-600 ${LEDGE + 40}Z"/>`);
    // the carved bear on its stump, standing on the cap
    ins(wall, `<g transform="translate(380 ${CAP - 12})"><rect x="-22" y="-86" width="44" height="86" rx="6" fill="#b07a44"/><rect x="-22" y="-86" width="44" height="10" rx="5" fill="#caa06a"/>` + [0, 1, 2].map((i) => `<line x1="${-14 + i * 12}" x2="${-12 + i * 12}" y1="-72" y2="-6" stroke="#8a5a30" stroke-width="2"/>`).join('') +
      `<path fill="#151414" d="${blob(0, -126, 22, 40, 5401, 16, 0.12)}"/><path fill="#151414" d="${blob(0, -174, 20, 18, 5402, 14, 0.1)}"/><circle cx="-13" cy="-190" r="7" fill="#151414"/><circle cx="13" cy="-190" r="7" fill="#151414"/><path fill="#3a2a22" d="M-6 -170 L6 -170 L4 -162 L-4 -162Z"/><circle cx="-7" cy="-178" r="2" fill="#c9a07a"/><circle cx="7" cy="-178" r="2" fill="#c9a07a"/></g>`);
    // yellow rope coil and a chain on the ledge
    ins(wall, `<ellipse cx="-80" cy="${LEDGE + 2}" rx="30" ry="7" fill="none" stroke="#e8d23a" stroke-width="4"/><ellipse cx="-78" cy="${LEDGE}" rx="20" ry="5" fill="none" stroke="#e8d23a" stroke-width="3"/><path fill="none" stroke="#5a5550" stroke-width="3" stroke-dasharray="6 3" d="M-40 ${LEDGE + 2} Q20 ${LEDGE + 14} 60 ${LEDGE + 4}"/>`);
    // water
    const wat = layer('wat');
    ins(wat, `<rect x="-600" y="${WAT}" width="3200" height="500" fill="${grad(defs, [[0, '#3b3126'], [0.35, '#2c241c'], [1, '#1b1611']])}"/>`);
    let rf = '';
    for (let i = 0; i < 70; i++) rf += `<rect class="rf" x="${R2(r() * 3000 - 500)}" y="${R2(WAT + 4 + r() * 30)}" width="${R2(20 + r() * 70)}" height="${R2(20 + r() * 120)}" fill="${GR[Math.floor(r() * GR.length)]}" opacity=".08" data-p="${R2(r() * 6)}"/>`;
    for (let i = 0; i < 56; i++) { const t = Math.pow(r(), 1.2); rf += `<rect class="rp" x="${R2(r() * 3000 - 500)}" y="${R2(WAT + 14 + t * 240)}" width="${R2(30 + t * 150)}" height="${R2(1.5 + t * 2)}" rx="1" fill="#e6eef2" opacity=".2" data-p="${R2(r() * 6)}"/>`; }
    ins(wat, rf);
    const rfs = [...wat.querySelectorAll('.rf')], rps = [...wat.querySelectorAll('.rp')];
    // floating dock sections (stay in for now)
    const dockB = layer('dockB');
    const section = (x0, x1, y, bob = 0) => { let d = `<path fill="#aaa49a" d="M${x0} ${y - 24} L${x1} ${y - 24} L${x1} ${y} L${x0} ${y}Z"/>`; for (let x = x0 + 10; x < x1; x += 22) d += `<line x1="${x}" x2="${x + 1}" y1="${y - 24}" y2="${y}" stroke="#7a746b" stroke-width="2"/>`; return d + `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="22" fill="#6d665c"/><rect x="${x0 + 8}" y="${y + 22}" width="${x1 - x0 - 16}" height="16" fill="#e2ded2" opacity=".75"/><rect x="${x0 - 10}" y="${y + 36}" width="${x1 - x0 + 20}" height="8" fill="#140f0b" opacity=".4"/>`; };
    const floatA = svgEl('g', {}, section(1430, 2100, 828)), floatB = svgEl('g', {}, section(2112, 2700, 828));
    dockB.appendChild(floatA); dockB.appendChild(floatB);
    // people
    const act = layer('act');
    const mom = makePerson(act, { coat: '#c8402e', pants: '#2b3345', hat: '#f0c56a', hair: '#6a4630', scarf: '#f4ead6', mitt: '#f0c56a', tool: `<g transform="translate(0 -81)"><rect x="-2" y="-230" width="4" height="330" fill="#8a6a48"/><path d="M-2 -230 q22 -6 26 14 l-6 2 q-4 -8 -20 -6Z" fill="#9aa2aa"/></g>` });
    const son2 = makePerson(act, { coat: '#3f78c4', pants: '#2a3550', hat: '#d64a3a', pom: true, hair: '#7a5030', kid: 0.75, mitt: '#d64a3a', tool: `<g transform="translate(0 -81)"><rect x="-2.5" y="-6" width="5" height="44" fill="#8a6a48"/><path d="M-12 36 L12 36 L10 50 L-10 50Z" fill="#7c8590"/></g>` });
    const shih = makeDog(act, { kind: 'shihpoo', body: '#17161c', dark: '#26242d', old: 0.9 });
    const son1 = makePerson(act, { coat: '#e0a83a', pants: '#2a3550', hair: '#5a3d28', kid: 0.4, mitt: '#5a4a3a' });
    const dad = makePerson(act, { coat: '#2f5d4a', pants: '#3a3f4d', hat: '#c8853a', hair: '#4a3323', mitt: '#7a5a3a' });
    const schn = makeDog(act, { kind: 'schnauzer', body: '#8b8f98', dark: '#6a6e78', beard: '#e2e4ea', old: 0.15 });
    // the ramp: weathered planks, black rubber mat on the shore end
    const ramp = layer('ramp');
    const RL = 430;
    let rh = `<path fill="#a8a298" d="M${-RL / 2} -20 L${RL / 2} -20 L${RL / 2} 0 L${-RL / 2} 0Z"/>`;
    for (let x = -RL / 2 + 12; x < RL / 2; x += 20) rh += `<line x1="${x}" x2="${x}" y1="-20" y2="0" stroke="#766f66" stroke-width="2"/>`;
    rh += `<rect x="${-RL / 2}" y="-24" width="${RL * 0.42}" height="7" fill="#232427"/><rect x="${-RL / 2}" y="0" width="${RL}" height="18" fill="#675f55"/><rect x="${-RL / 2 + 6}" y="3" width="${RL - 12}" height="3" fill="#7d756a"/>`;
    rh += `<rect x="${-RL / 2 - 4}" y="-6" width="10" height="22" fill="#3a3530"/><rect x="${RL / 2 - 6}" y="-6" width="10" height="22" fill="#3a3530"/>`;
    const rampG = svgEl('g', {}, rh); ramp.appendChild(rampG);
    const ropes = svgEl('g'); ramp.appendChild(ropes);
    // foreground sedge
    const fg = layer('fg'); let fgh = '';
    for (let i = 0; i < 18; i++) { const x = i * 170 - 500 + r() * 60, h = 50 + r() * 90; let d = `M${x - 26} 1160`; for (let k = 0; k < 6; k++) d += ` L${R2(x - 26 + k * 10 + r() * 5)} ${R2(1160 - h * (0.4 + r() * 0.6))} L${R2(x - 21 + k * 10)} 1160`; fgh += `<path d="${d}Z" fill="#4c3a22"/>`; }
    ins(fg, fgh);
    const dep = { sky: 0.05, rock: 0.85, pines: 0.7, wall: 1, wat: 1, dockB: 1, act: 1, ramp: 1, fg: 1.35 };
    const camAt = (f) => { const k = E.inOutSine(seg(f, 0, 200)); return { fx: lerp(1130, 920, k), fy: lerp(555, 575, k), s: lerp(0.98, 1.06, k), rot: Math.sin(f * 0.03) * 0.1 }; };
    // ramp path: rest (left end on the ledge, right end on the float) -> lifted -> carried left -> set down on the ledge
    const lift = (f) => kf(f, [[0, 0], [30, 0], [52, 1], [150, 1], [176, 0]], E.inOutCubic);
    const carry = (f) => kf(f, [[0, 0], [54, 0], [150, 1]], E.inOutSine); // 0 at start, 1 at the drop spot
    const CX0 = 1225, CX1 = 990;
    const rampAt = (f) => { const c = carry(f), l = lift(f), x = lerp(CX0, CX1, c); const restY = lerp(LEDGE + 3, LEDGE, c), restA = lerp(1.6, 0, c); return { x, y: restY - l * 92, a: restA * (1 - l) + Math.sin(f * 0.2) * 1.2 * l * (c > 0 && c < 1 ? 1 : 0.2) }; };
    function update(f) {
      const c = camAt(f);
      cam.setAttribute('transform', `translate(960 560) rotate(${c.rot}) scale(${c.s}) translate(${-c.fx} ${-c.fy})`);
      for (const n in dep) L[n].setAttribute('transform', `translate(${R2((1 - dep[n]) * (c.fx - 960))} ${R2((1 - dep[n]) * (c.fy - 560) * 0.2)})`);
      rfs.forEach((e) => e.setAttribute('opacity', R2(0.07 + 0.06 * Math.sin(f * 0.06 + +e.dataset.p))));
      rps.forEach((e) => e.setAttribute('opacity', R2(0.1 + 0.14 * Math.sin(f * 0.09 + +e.dataset.p * 1.7))));
      floatA.setAttribute('transform', `translate(0 ${R2(Math.sin(f * 0.07) * 1.6)})`); floatB.setAttribute('transform', `translate(0 ${R2(Math.sin(f * 0.07 + 1) * 1.6)})`);
      const R = rampAt(f), l = lift(f), cr = carry(f);
      rampG.setAttribute('transform', `translate(${R2(R.x)} ${R2(R.y)}) rotate(${R2(R.a)})`);
      const ca = Math.cos(R.a * D2R), sa = Math.sin(R.a * D2R);
      const endL = [R.x - (RL / 2 - 4) * ca, R.y - (RL / 2 - 4) * sa - 14], endR = [R.x + (RL / 2 - 4) * ca, R.y + (RL / 2 - 4) * sa - 14];
      // son holds the shore end (walks in front, facing left); dad holds the lake end (behind)
      const walking = cr > 0.001 && cr < 0.999, dist = (CX0 - R.x);
      const grip = E.inOutSine(seg(f, 14, 30));
      const sY = LEDGE, dY = lerp(804, LEDGE, E.inOutSine(seg(f, 60, 84)));
      const sX = endL[0] + 24, dX = endR[0] - 22;
      const strain = l * (walking ? 1 : 0.6);
      // arm angle so the hand lands on the rope's top; hands hang ~50px over the ramp end when lifted
      const handArm = (px, py, s, flip, tx, ty) => { const sx = px, sy = py - 142 * s; const dx = (tx - sx) * flip, dy = ty - sy; return clamp(Math.atan2(dx, dy) / D2R, -60, 140); };
      const hS = [endL[0], endL[1] - lerp(8, 44, l)], hD = [endR[0], endR[1] - lerp(8, 50, l)];
      const aS = handArm(sX, sY, 1.12, -1, hS[0], hS[1]), aD = handArm(dX, dY, 1.3, -1, hD[0], hD[1]);
      son1.set({ x: sX, y: sY, s: 1.12, flip: -1, walk: dist * 0.05, amp: walking ? 0.55 : 0, lean: 4 + 5 * strain - 2 * (1 - l) * grip, afA: aS * grip, anA: aS * grip, tilt: -4 * strain, dip: (1 - l) * grip * 6 });
      dad.set({ x: dX, y: dY, s: 1.3, flip: -1, walk: dist * 0.05 + 2, amp: walking ? 0.5 : 0, lean: -3 - 4 * strain, afA: aD * grip, anA: aD * grip, tilt: 3 * strain, dip: (1 - l) * grip * 6 });
      const hand = (px, py, s, a) => [px - Math.sin(a * D2R) * 61 * s - 4 * s, py - 142 * s + Math.cos(a * D2R) * 61 * s];
      const HS = hand(sX, sY, 1.12, aS * grip), HD = hand(dX, dY, 1.3, aD * grip);
      ropes.innerHTML = grip > 0.3 ? `<path fill="none" stroke="#e8d23a" stroke-width="3.2" stroke-linecap="round" d="M${R2(HS[0])} ${R2(HS[1])} L${R2(endL[0])} ${R2(endL[1] + 10)}"/><path fill="none" stroke="#e8d23a" stroke-width="3.2" stroke-linecap="round" d="M${R2(HD[0])} ${R2(HD[1])} L${R2(endR[0])} ${R2(endR[1] + 10)}"/>` : '';
      // mom and the youngest wait up on the cap with the pike pole and the wrench
      const nod = Math.sin(f * 0.11), look = E.inOutSine(seg(f, 60, 110));
      mom.set({ x: 560, y: CAP - 10, s: 1.3, flip: 1, lean: -1 + nod * 0.6, afA: 6, anA: 4, tilt: nod * 2 + 4 * look });
      son2.set({ x: 670, y: CAP - 10, s: 1.08, flip: 1, lean: 1 + Math.sin(f * 0.13 + 1) * 0.6, afA: 4, anA: 20 + Math.sin(f * 0.2) * 4, tilt: -2 + 5 * look });
      shih.set({ x: 470, y: CAP - 10, s: 1.3, flip: 1, sit: 1, wag: f * 0.3, wagA: 8, head: 4 * nod });
      // the schnauzer supervises from the float, then trots along the ledge after them
      const sw = seg(f, 70, 170), sxp = kf(f, [[0, 1560], [70, 1560], [170, 1230]], E.inOutSine);
      schn.set({ x: sxp, y: sxp > 1420 ? 804 : LEDGE, s: 1.2, flip: -1, gp: f * 0.36, amp: sw > 0 && sw < 1 ? 0.55 : 0, wag: f * 0.6, wagA: 14, head: 6 + 6 * Math.sin(f * 0.05) });
      return { R, endL, endR };
    }
    const drips = (ctx, f) => {
      const c = camAt(f), q = rng(9);
      for (let i = 0; i < 46; i++) {
        const st = 34 + q() * 110, a = f - st, u = q(); if (a < 0 || a > 30) continue;
        const R = { x: lerp(CX0, CX1, carry(st)), y: LEDGE - lift(st) * 92 };
        const x = R.x + (u - 0.5) * RL, y0 = R.y + 18;
        const yy = y0 + a * a * 0.45; if (yy > (x > 1140 ? WAT : LEDGE)) continue;
        const [sx, sy] = w2s(c, x, yy);
        ctx.fillStyle = `rgba(210,226,232,${R2(0.8 * (1 - a / 30))})`; ctx.beginPath(); ctx.ellipse(sx, sy, 2, 5, 0, 0, 6.283); ctx.fill();
      }
      for (let k = 0; k < 3; k++) { const a = f - 40 - k * 20; if (a < 0 || a > 70) continue; const [sx, sy] = w2s(c, 1360, WAT + 10); ctx.strokeStyle = `rgba(230,238,242,${R2(0.35 * (1 - a / 70))})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy, (60 + a * 5) * c.s, (8 + a * 0.8) * c.s, 0, 0, 6.283); ctx.stroke(); }
    };
    const fx = (ctx, f) => { leafFall(ctx, f, 24, 61, ['#d9762b', '#b8402a', '#e7b53a', '#c8582a'], 9); motes(ctx, f, 20, 3, '#fff0d0', 2, 0.8); drips(ctx, f); };
    return { a: 500, b: 700, update, fx, camAt };
  })();
};
