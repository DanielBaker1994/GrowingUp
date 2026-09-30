/* Scene 1 — 2004, March. Family and two dogs cross the frozen lake at dusk toward the far cottage light. f 0..300 */
let S1; const initS1 = () => { S1 = (() => {
  const svg = $('sv1'), defs = svgEl('defs'); svg.appendChild(defs);
  const cam = svgEl('g'); svg.appendChild(cam);
  const L = {}; // layers by name
  const layer = (n, html = '') => { const g = svgEl('g', { id: 'l1-' + n }, html); cam.appendChild(g); L[n] = g; return g; };

  // sky
  const skyG = grad(defs, [[0, '#141a3f'], [0.28, '#2f3470'], [0.52, '#7b5f97'], [0.72, '#dc8f8b'], [0.9, '#f6c39a'], [1, '#fbe0b8']]);
  const sky = layer('sky', `<rect x="-800" y="-400" width="3600" height="1030" fill="${skyG}"/>`);
  const r0 = rng(11); let stars = '';
  for (let i = 0; i < 46; i++) stars += `<circle cx="${R2(r0() * 3000 - 400)}" cy="${R2(r0() * 340)}" r="${R2(0.8 + r0() * 1.6)}" fill="#fff5e0" opacity="${R2(0.25 + r0() * 0.6)}"/>`;
  sky.insertAdjacentHTML('beforeend', stars);
  const glow = radial(defs, [[0, '#ffd2a0', 0.85], [0.4, '#ff9d7a', 0.35], [1, '#ff7a6a', 0]]);
  sky.insertAdjacentHTML('beforeend', `<ellipse cx="1500" cy="600" rx="900" ry="330" fill="${glow}"/>`);
  // cloud strata (paper strips)
  const cloud = (y, w, col, op, seed) => {
    const r = rng(seed); let d = `M${-300} ${y}`; for (let x = -300; x <= 2400; x += 60) d += ` L${x} ${R2(y - 6 - r() * 10 - Math.sin(x * 0.004 + seed) * 8)}`;
    for (let x = 2400; x >= -300; x -= 60) d += ` L${x} ${R2(y + w * (0.5 + r() * 0.6))}`; return `<path d="${d}Z" fill="${col}" opacity="${op}"/>`;
  };
  sky.insertAdjacentHTML('beforeend', cloud(430, 20, '#a3789f', 0.5, 3) + cloud(505, 14, '#e79590', 0.55, 8) + cloud(350, 26, '#5b5290', 0.4, 5));

  // far shore
  const far = layer('far'); const fFn = ridgeFn(21, 575, 26);
  far.insertAdjacentHTML('beforeend', `<path d="${ridgePath(fFn, 21)}" fill="${grad(defs, [[0, '#5a5288'], [1, '#3d3a6e']])}"/>`);
  far.insertAdjacentHTML('beforeend', `<path d="${forest(fFn, -300, 2300, 22, 40, 78, 31)}" fill="#403d70"/>`);
  const mid = layer('mid'); const mFn = ridgeFn(41, 596, 14);
  mid.insertAdjacentHTML('beforeend', `<path d="${forest(mFn, -300, 2300, 20, 46, 96, 51, 8)}" fill="#2b2b55"/>`);
  mid.insertAdjacentHTML('beforeend', `<path d="${ridgePath(mFn, 41, -300, 2300, 12, 1.4)}" fill="#26264f"/>`);
  // the far cottage: warm window is the destination
  const cot = layer('cot');
  cot.innerHTML =
    `<g transform="translate(1330 604)">` +
    `<rect x="-58" y="-40" width="116" height="42" fill="#1d1c3f"/><path d="M-70 -38 L0 -78 L70 -38Z" fill="#17163a"/><rect x="26" y="-80" width="10" height="24" fill="#17163a"/>` +
    `<rect id="cw1" x="-40" y="-28" width="20" height="18" fill="#ffd27a"/><rect id="cw2" x="4" y="-28" width="20" height="18" fill="#ffb95a"/>` +
    `<path d="M-70 4 L70 4 L64 12 L-64 12Z" fill="#ffd27a" opacity="0.0" id="cwl"/></g>`;
  const cwGlow = radial(defs, [[0, '#ffc766', 0.9], [0.35, '#ff9d4d', 0.35], [1, '#ff7a3d', 0]]);
  cot.insertAdjacentHTML('beforeend', `<ellipse id="cwg" cx="1330" cy="590" rx="230" ry="130" fill="${cwGlow}" opacity="0"/>`);

  // ice plane
  const ice = layer('ice');
  const iceG = grad(defs, [[0, '#f0c9bd'], [0.08, '#cdbcd6'], [0.3, '#8f9fce'], [0.7, '#4d5b93'], [1, '#2f3968']]);
  ice.insertAdjacentHTML('beforeend', `<rect x="-900" y="596" width="3900" height="700" fill="${iceG}"/>`);
  const ri = rng(77); let streaks = '', lumps = '';
  for (let i = 0; i < 90; i++) {
    const t = Math.pow(ri(), 1.8), y = 604 + t * 520, x = ri() * 3600 - 800, w = 40 + t * 380 * ri() + 30;
    streaks += `<path d="M${R2(x)} ${R2(y)} q${R2(w / 2)} ${R2(-2 - t * 3)} ${R2(w)} 0" stroke="#ffffff" stroke-opacity="${R2(0.08 + t * 0.22)}" stroke-width="${R2(1 + t * 2.6)}" fill="none" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 26; i++) {
    const t = Math.pow(ri(), 1.5), y = 640 + t * 440, x = ri() * 3400 - 700, w = 60 + t * 300;
    lumps += `<path d="${blob(x, y, w, 5 + t * 16, 900 + i, 14, 0.2)}" fill="#e9eefb" opacity="${R2(0.18 + t * 0.22)}"/>`;
  }
  ice.insertAdjacentHTML('beforeend', streaks + lumps);
  ice.insertAdjacentHTML('beforeend', `<ellipse cx="1420" cy="700" rx="380" ry="120" fill="${radial(defs, [[0, '#ffc79a', 0.42], [1, '#ffc79a', 0]])}"/>`);
  // cracks
  const cracks = layer('cracks');
  const crackPts = (x0, y0, x1, y1, seed, n) => {
    const r = rng(seed); let d = `M${x0} ${y0}`;
    for (let i = 1; i <= n; i++) { const t = i / n; d += ` L${R2(lerp(x0, x1, t) + (r() - 0.5) * 26 * (1 - t * 0.4))} ${R2(lerp(y0, y1, t) + (r() - 0.5) * 8)}`; }
    return d;
  };
  const CR = [
    [1180, 960, 1500, 760, 1, 22, 118], [1170, 965, 700, 800, 2, 20, 121], [1200, 955, 1900, 900, 3, 18, 123], [1010, 900, 900, 700, 4, 12, 128], [1320, 880, 1800, 730, 5, 14, 126], [1200, 960, 1240, 1080, 6, 8, 122],
  ];
  CR.forEach((c, i) => cracks.insertAdjacentHTML('beforeend', `<path class="ck" data-i="${i}" pathLength="1" d="${crackPts(...c.slice(0, 6))}" fill="none" stroke="#14204f" stroke-opacity=".45" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 1" stroke-dashoffset="1"/><path class="ck" data-i="${i}" pathLength="1" d="${crackPts(...c.slice(0, 6))}" fill="none" stroke="#eaf6ff" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 1" stroke-dashoffset="1"/>`));
  const ckEls = [...cracks.querySelectorAll('.ck')];

  // actors
  const act = layer('act');
  const trail = svgEl('g', {}, `<rect id="s1tr" x="-1200" y="858" width="0" height="3" fill="#22306a" opacity=".35"/><rect id="s1tr2" x="-1200" y="872" width="0" height="3" fill="#22306a" opacity=".3"/>`); act.appendChild(trail);
  const toboggan = svgEl('g'); act.appendChild(toboggan);
  toboggan.innerHTML =
    `<ellipse cx="-58" cy="4" rx="96" ry="8" fill="#000" opacity=".22"/>` +
    `<path d="M-150 -20 L80 -20 Q100 -20 100 -8 Q98 0 80 0 L-150 0Z" fill="#b83a2c"/><path d="M-150 -20 L80 -20 Q100 -20 100 -8 L-150 -10Z" fill="#d24d3a"/>` +
    `<rect x="-130" y="-52" width="76" height="32" rx="8" fill="#3c5a3a"/><rect x="-46" y="-44" width="56" height="24" rx="8" fill="#c48b3a"/><rect x="-92" y="-60" width="34" height="14" rx="5" fill="#243a55"/>`;
  const rope = svgEl('path', { fill: 'none', stroke: '#e8d9b8', 'stroke-width': 2.4, 'stroke-linecap': 'round' }); act.appendChild(rope);
  const dad = makePerson(act, { coat: '#2f5d4a', pants: '#3a3f4d', hat: '#b83a2c', hair: '#4a3323', scarf: '#e8d9b8', mitt: '#7a5a3a' });
  const mom = makePerson(act, { coat: '#d0472f', pants: '#2b3345', hat: '#f0c56a', pom: true, hair: '#6a4630', scarf: '#f4ead6', mitt: '#f0c56a' });
  const son1 = makePerson(act, { coat: '#e8b83a', pants: '#2a3550', hat: '#2a4a8a', pom: true, hair: '#5a3d28', kid: 0.6, mitt: '#2a4a8a' });
  const son2 = makePerson(act, { coat: '#3f78c4', pants: '#2a3550', hat: '#d64a3a', pom: true, hair: '#7a5030', kid: 0.9, mitt: '#d64a3a' });
  const schn = makeDog(act, { kind: 'schnauzer', body: '#8b8f98', dark: '#6a6e78', beard: '#e2e4ea' });
  const shih = makeDog(act, { kind: 'shihpoo', body: '#17161c', dark: '#26242d', old: 0.4 });

  // foreground framing (paper, dark)
  const fg = layer('fg');
  const fgFn = ridgeFn(61, 1040, 30);
  fg.insertAdjacentHTML('beforeend', `<path d="${forest((x) => 1120, -700, 500, 130, 380, 640, 71)}" fill="#111330"/>`);
  fg.insertAdjacentHTML('beforeend', `<path d="${forest((x) => 1120, 2050, 2700, 150, 300, 520, 72)}" fill="#111330"/>`);
  fg.insertAdjacentHTML('beforeend', `<path d="${ridgePath(fgFn, 61, -900, 2900, 20, 2)}" fill="#dfe6f6" opacity=".0"/>`);

  const dep = { sky: 0.02, far: 0.12, mid: 0.28, cot: 0.28, ice: 0.8, cracks: 1, act: 1, fg: 1.5 };
  const T = (f) => kf(f, [[0, 0], [118, 118], [138, 126], [158, 127], [188, 146], [300, 258]], E.inOutSine);
  const lead = (f) => 470 + 3.9 * T(f);
  function camAt(f) {
    const fx = 1000 + 2.5 * T(f), s = lerp(1.0, 1.16, E.inOutSine(f / 300));
    return { fx, fy: 690, s };
  }
  function update(f) {
    const c = camAt(f);
    cam.setAttribute('transform', `translate(960 560) scale(${c.s}) translate(${-c.fx} ${-c.fy})`);
    for (const n in dep) { if (n === 'act' || n === 'cracks') continue; L[n].setAttribute('transform', `translate(${R2((1 - dep[n]) * (c.fx - 1000))} 0)`); }
    const t = T(f), lx = lead(f);
    const pause = E.smoother(seg(f, 116, 128)) * (1 - E.smoother(seg(f, 160, 176)));
    const wal = (k) => (t * 2 * Math.PI) / 30 + k;
    const amp = 0.6 * (1 - pause);
    const yb = 850;
    // dad + toboggan
    const dx = lx + 120, dw = wal(0);
    dad.set({ x: dx, y: yb + 6, s: 1.16, flip: 1, walk: dw, amp: amp, lean: 5 * (1 - pause) + 2, afA: -38, anA: 10 * Math.sin(dw), tilt: pause * 6 + Math.sin(f * 0.031) * 1.5 });
    if (pause > 0.5) dad.set({ x: dx, y: yb + 6, s: 1.16, flip: 1, walk: dw, amp: amp, lean: 3, afA: -38, anA: 68 * pause, tilt: 4 });
    $('s1tr').setAttribute('width', R2(dx - 92 + 1200)); $('s1tr2').setAttribute('width', R2(dx - 92 + 1200));
    toboggan.setAttribute('transform', `translate(${R2(dx - 92)} ${yb + 8}) scale(1.16)`);
    rope.setAttribute('d', `M${R2(dx + 14)} ${yb - 100} Q${R2(dx - 40)} ${yb - 60} ${R2(dx - 92 + 96 * 1.16)} ${yb - 22}`);
    // mom + youngest, holding hands
    const mx = lx - 190, mw = wal(0.9);
    mom.set({ x: mx, y: yb + 4, s: 1.06, flip: 1, walk: mw, amp: amp, lean: 2, afA: -10 - 28 * pause, anA: 32 * Math.sin(mw) });
    son2.set({ x: mx + 62, y: yb + 6, s: 0.66, flip: 1, walk: wal(2.1), amp: amp * 1.1, lean: 3, afA: 20 * Math.sin(wal(2.1)), anA: 44, tilt: -5 * pause });
    // older son ahead
    const sx = lx + 232 + Math.sin(f * 0.02) * 10;
    son1.set({ x: sx, y: yb + 14, s: 0.8, flip: 1, walk: wal(0.4), amp: amp * 1.05, lean: 4, tilt: -3 * pause, afA: -16, anA: pause * 70 });
    // dogs
    const dgb = (k) => f * 0.62 + k;
    const sX = lx + 470 + Math.sin(f * 0.031) * 60 - 90 * pause;
    schn.set({ x: sX, y: yb + 20, s: 1.0, flip: pause > 0.5 ? -1 : 1, gp: dgb(0), amp: 0.9 * (1 - pause), sit: pause, head: -6 * pause, wag: f * 0.5, wagA: 16 });
    const hX = lx + 360 + Math.sin(f * 0.023 + 1.3) * 90 + 60 * pause;
    shih.set({ x: hX, y: yb + 30, s: 1.0, flip: 1, gp: dgb(1.7), amp: 0.85 * (1 - pause * 0.9), head: 0, wag: f * 0.4, wagA: 10 });
    // cracks propagate
    ckEls.forEach((e) => { const i = +e.dataset.i, st = CR[i][6]; e.setAttribute('stroke-dashoffset', R2(1 - E.outExpo(seg(f, st, st + 12)))); });
    // window glow: lights come on
    const lit = E.inOutSine(seg(f, 175, 235)), fl = 0.9 + 0.1 * Math.sin(f * 0.7);
    $('cwg').setAttribute('opacity', R2(0.35 + lit * 0.65 * fl));
    $('cw1').setAttribute('fill', mix('#5a4a6a', '#ffd27a', 0.3 + 0.7 * lit));
    $('cw2').setAttribute('fill', mix('#5a4a6a', '#ffb95a', 0.3 + 0.7 * lit));
  }
  const heads = (f) => { const lx = lead(f); return [[lx + 120 + 12, 856 - 172 * 1.16], [lx - 190, 854 - 172 * 1.06], [lx + 232, 864 - 172 * 0.8], [lx - 128, 856 - 172 * 0.66]]; };
  const fx = (ctx, f) => {
    const c = camAt(f);
    // ice glitter
    const rg = rng(5);
    for (let i = 0; i < 60; i++) { const x = rg() * 1920, y = 640 + Math.pow(rg(), 1.3) * 420, ph = rg() * 6.28, a = Math.max(0, Math.sin(f * 0.08 + ph)) ** 6; if (a < 0.05) continue; ctx.fillStyle = `rgba(255,240,225,${R2(a * 0.9)})`; ctx.fillRect(x, y, 2.4, 2.4); ctx.fillRect(x - 3, y + 0.6, 8.4, 1.2); }
    // breath
    for (let p = 0; p < 4; p++) for (let k = 0; k < 3; k++) {
      const per = 46, st = Math.floor((f - p * 11) / per) * per + p * 11 - k * per, a = f - st; if (a < 0 || a > 40 || st < 0) continue;
      const h = heads(st)[p], [sx, sy] = w2s(c, h[0] + 22 + a * 0.5, h[1] + 18 - a * 0.35); ctx.fillStyle = `rgba(255,236,228,${R2(0.32 * (1 - a / 40))})`; ctx.beginPath(); ctx.arc(sx, sy, (4 + a * 0.4) * c.s, 0, 6.283); ctx.fill();
    }
    // chimney smoke
    const lit = E.inOutSine(seg(f, 175, 235));
    for (let i = 0; i < 16; i++) { const a = (f * 0.9 + i * 6) % 96, x = 1361 + a * 0.5 + Math.sin(a * 0.09 + i) * 5 + (1 - 0.28) * (c.fx - 1000), y = 528 - a * 0.42; const [sx, sy] = w2s(c, x, y); ctx.fillStyle = `rgba(230,214,220,${R2(0.3 * (1 - a / 96) * (0.4 + 0.6 * lit))})`; ctx.beginPath(); ctx.arc(sx, sy, (5 + a * 0.2) * c.s, 0, 6.283); ctx.fill(); }
    // fine drifting snow
    for (let i = 0; i < 40; i++) { const r = rng(300 + i), x0 = r() * 2000, sp = 0.4 + r() * 0.7; const x = ((x0 + f * sp * 0.4 + Math.sin(f * 0.02 + i) * 20) % 2000), y = ((r() * 1100 + f * sp * 0.9) % 1100); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(x, y, 1.4 + r() * 1.4, 0, 6.283); ctx.fill(); }
  };
  return { a: 0, b: 300, update, camAt, lead, T, fx, heads };
})(); };
