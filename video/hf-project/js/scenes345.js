/* scenes345.js — S3 dock (2006), S4 mowing (2010), S5 sold (2011) */
const AUT = ['#d9762b', '#b8402a', '#e7b53a', '#c8582a', '#4f6f4a', '#e09a34', '#9c3a28'];
const leafFall = (ctx, f, n, seed, cols, sz) => {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x0 = r() * 2100 - 100, ph = r() * 6.28, sp = 1.4 + r() * 1.6, sw = 30 + r() * 60, rot = r() * 6.28, c = cols[Math.floor(r() * cols.length)];
    const y = ((r() * 1300 + f * sp) % 1300) - 120, x = x0 + Math.sin(f * 0.03 + ph) * sw + f * 0.8;
    ctx.save(); ctx.translate(((x % 2100) + 2100) % 2100 - 100, y); ctx.rotate(rot + f * 0.05 * (r() > 0.5 ? 1 : -1)); ctx.scale(1, 0.55 + 0.45 * Math.sin(f * 0.07 + ph));
    ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, 0, sz * (0.8 + r() * 0.6), sz * 0.5, 0, 0, 6.283); ctx.fill(); ctx.restore();
  }
};

/* ============ S3 : f 500..700 ============ */
let S3; const initS3 = () => {
  S3 = (() => {
    const svg = $('sv3'), defs = svgEl('defs'); svg.appendChild(defs);
    const cam = svgEl('g'); svg.appendChild(cam);
    const L = {}; const layer = (n, h = '') => { const g = svgEl('g', {}, h); cam.appendChild(g); L[n] = g; return g; };
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const sky = layer('sky', `<rect x="-800" y="-500" width="3600" height="1100" fill="${grad(defs, [[0, '#8fb0cc'], [0.55, '#e4dccb'], [1, '#f8d9a6']])}"/>`);
    ins(sky, `<ellipse cx="420" cy="470" rx="1000" ry="540" fill="${radial(defs, [[0, '#fff0c8', 0.95], [0.35, '#ffd9a0', 0.4], [1, '#ffd9a0', 0]])}"/><circle cx="420" cy="470" r="48" fill="#fff8e0"/>`);
    ins(sky, `<path d="${blob(1300, 190, 240, 22, 4, 18, 0.15)}" fill="#fff" opacity=".5"/><path d="${blob(700, 120, 300, 20, 6, 18, 0.15)}" fill="#fff" opacity=".4"/>`);
    // autumn far hills, two rows
    const hills = (n, y, amp, seed, mistK, sz) => {
      const g = layer(n), fn = ridgeFn(seed, y, amp), r = rng(seed + 3);
      ins(g, `<path d="${ridgePath(fn, seed)}" fill="${mix('#5f7a72', '#e9dcc4', mistK)}"/>`);
      let b = '';
      for (let x = -200; x < 2200; x += sz * 0.55) { const c = AUT[Math.floor(r() * AUT.length)]; b += `<path d="${blob(x, fn(x) - 6 + (r() - 0.5) * 10, sz * (0.7 + r() * 0.6), sz * (0.55 + r() * 0.4), Math.floor(r() * 1e5), 16, 0.16)}" fill="${mix(c, '#e9dcc4', mistK)}"/>`; }
      ins(g, b); return g;
    };
    hills('h1', 452, 30, 201, 0.5, 46); hills('h2', 478, 22, 211, 0.28, 62);
    const lake = layer('lake');
    ins(lake, `<rect x="-900" y="486" width="3800" height="380" fill="${grad(defs, [[0, '#f0dcb2'], [0.15, '#a9c0cc'], [1, '#4c7590']])}"/>`);
    // reflections of the foliage
    const rr = rng(222); let refl = '';
    for (let i = 0; i < 70; i++) { const x = rr() * 2400 - 200, w = 14 + rr() * 60, c = AUT[Math.floor(rr() * AUT.length)]; refl += `<rect class="rf" x="${R2(x)}" y="${R2(492 + rr() * 30)}" width="${R2(w)}" height="${R2(10 + rr() * 60)}" rx="3" fill="${c}" opacity="${R2(0.10 + rr() * 0.14)}" data-p="${R2(rr() * 6)}"/>`; }
    ins(lake, refl);
    let rip = ''; for (let i = 0; i < 40; i++) { const t = Math.pow(rr(), 1.2), y = 500 + t * 340; rip += `<rect class="rp" x="${R2(rr() * 2400 - 200)}" y="${R2(y)}" width="${R2(30 + t * 120)}" height="${R2(1.4 + t * 1.6)}" rx="1" fill="#ffffff" opacity="${R2(0.1 + rr() * 0.22)}" data-p="${R2(rr() * 6)}"/>`; }
    ins(lake, rip);
    const rfs = [...lake.querySelectorAll('.rf')], rps = [...lake.querySelectorAll('.rp')];
    // distant shore pines left
    const mid = layer('mid'); const mFn = ridgeFn(231, 560, 16);
    ins(mid, `<path d="${forest(mFn, -300, 760, 30, 70, 160, 232, 4)}" fill="#3a5a48"/><path d="${ridgePath(mFn, 231, -300, 760, 12, 1.4, 640)}" fill="#33503f"/>`);
    // granite shield rock (near)
    const rock = layer('rock');
    const rockTop = (x) => 812 + Math.sin(x * 0.006) * 8 + (x > 1500 ? Math.pow((x - 1500) / 200, 1.7) * 60 : 0);
    let rd = `M-300 1200`; for (let x = -300; x <= 1800; x += 14) rd += ` L${x} ${R2(rockTop(x))}`; rd += ` L1800 1200Z`;
    ins(rock, `<path d="${rd}" fill="${grad(defs, [[0, '#c9a99c'], [0.5, '#a88c85'], [1, '#6f5b5c']])}"/>`);
    const rk = rng(241); let cr = '';
    for (let i = 0; i < 14; i++) { const x = rk() * 1500 - 200, y = 840 + rk() * 220; cr += `<path d="M${R2(x)} ${R2(y)} l${R2(60 + rk() * 120)} ${R2((rk() - 0.5) * 30)} l${R2(30 + rk() * 60)} ${R2((rk() - 0.3) * 30)}" stroke="#5a4646" stroke-width="${R2(1.5 + rk() * 2)}" fill="none" opacity=".45" stroke-linecap="round"/>`; }
    for (let i = 0; i < 40; i++) { cr += `<circle cx="${R2(rk() * 1700 - 200)}" cy="${R2(830 + rk() * 300)}" r="${R2(2 + rk() * 6)}" fill="${rk() > 0.5 ? '#cfd88a' : '#e4a94a'}" opacity=".5"/>`; }
    ins(rock, cr);
    // moss + fall grass on the rock edge
    ins(rock, `<path d="${blob(160, 830, 200, 12, 5, 16, 0.2)}" fill="#6d7f3f" opacity=".5"/>`);
    // water in front of the rock (right)
    const wat = layer('wat');
    ins(wat, `<path d="M1180 ${R2(rockTop(1180) - 4)} Q1320 ${R2(rockTop(1320) - 6)} 1560 ${R2(rockTop(1560))} L2300 830 L2300 1200 L1560 1200Z" fill="#000" opacity="0"/>`);
    ins(wat, `<rect x="1780" y="812" width="700" height="400" fill="${grad(defs, [[0, '#5d8299', 0.92], [1, '#2d4f68', 0.98]])}"/>`);
    // dock (on top of water, cribs submerged by wat-front layer)
    const dockG = layer('dock');
    const dockLocal = svgEl('g'); dockG.appendChild(dockLocal);
    let planks = ''; for (let x = 14; x < 700; x += 33) planks += `<line x1="${x}" x2="${x}" y1="0" y2="26" stroke="#5a4028" stroke-width="2.4" opacity=".7"/>`;
    dockLocal.innerHTML =
      `<rect x="80" y="26" width="16" height="130" fill="#5a4331"/><rect x="590" y="26" width="16" height="130" fill="#5a4331"/><rect x="88" y="70" width="510" height="10" fill="#4a3728"/><rect x="88" y="124" width="510" height="8" fill="#4a3728"/>` +
      `<rect x="0" y="0" width="700" height="26" fill="#a5784c"/>${planks}<rect x="0" y="26" width="700" height="14" fill="#7a5638"/><rect x="0" y="0" width="700" height="4" fill="#c9985f"/>` +
      // lifting bars
      `<rect x="-150" y="8" width="160" height="12" rx="3" fill="#b38a55"/><rect x="-150" y="8" width="160" height="4" fill="#d1a86f"/>`;
    // front water (foreground) to submerge cribs, drawn after dock
    const wfront = layer('wfront');
    ins(wfront, `<rect x="1560" y="806" width="900" height="420" fill="${grad(defs, [[0, '#6d93aa', 0.6], [0.02, '#5f88a0', 0.86], [1, '#2d4f68', 0.98]])}"/>`);
    ins(wfront, `<path d="M1120 ${R2(rockTop(1120) - 0)} L1300 ${R2(rockTop(1300))} L1560 ${R2(rockTop(1560))} L1560 1200 L1120 1200Z" fill="#000" opacity="0"/>`);
    // actors
    const act = layer('act');
    const dad = makePerson(act, { coat: '#2f5d4a', pants: '#3a3f4d', hat: '#c8853a', hair: '#4a3323', scarf: null, mitt: '#7a5a3a' });
    const son1 = makePerson(act, { coat: '#e0a83a', pants: '#2a3550', hat: null, hair: '#5a3d28', kid: 0.4, mitt: '#5a4a3a' });
    const mom = makePerson(act, { coat: '#c8402e', pants: '#2b3345', hat: '#f0c56a', pom: false, hair: '#6a4630', scarf: '#f4ead6', mitt: '#f0c56a', tool: `<g transform="translate(0 -81)"><rect x="-2" y="-230" width="4" height="330" fill="#8a6a48"/><path d="M-2 -230 q22 -6 26 14 l-6 2 q-4 -8 -20 -6Z" fill="#9aa2aa"/></g>` });
    const son2 = makePerson(act, { coat: '#3f78c4', pants: '#2a3550', hat: '#d64a3a', pom: true, hair: '#7a5030', kid: 0.75, mitt: '#d64a3a', tool: `<g transform="translate(0 -81)"><rect x="-2.5" y="-46" width="5" height="52" fill="#8a6a48"/><rect x="-14" y="-56" width="28" height="12" rx="2" fill="#7c8590"/></g>` });
    const shih = makeDog(act, { kind: 'shihpoo', body: '#17161c', dark: '#26242d', old: 0.9 });
    const schn = makeDog(act, { kind: 'schnauzer', body: '#8b8f98', dark: '#6a6e78', beard: '#e2e4ea', old: 0.15 });
    // foreground
    const fg = layer('fg'); const rf = rng(251); let fgh = '';
    for (let i = 0; i < 20; i++) { const x = i * 130 - 100 + rf() * 40, h = 60 + rf() * 110; let d = `M${x - 26} 1140`; for (let k = 0; k < 6; k++) d += ` L${R2(x - 26 + k * 10 + rf() * 5)} ${R2(1140 - h * (0.4 + rf() * 0.6))} L${R2(x - 21 + k * 10)} 1140`; fgh += `<path d="${d}Z" fill="#4c3a22"/>`; }
    ins(fg, fgh);
    // big maple at left, frame
    const maple = layer('maple');
    let mp = `<path d="M-30 1200 L-4 380 L38 380 L70 1200Z" fill="#3a2c22"/>`;
    const rm = rng(261); for (let i = 0; i < 26; i++) { const c = AUT[Math.floor(rm() * 4)]; mp += `<path d="${blob(-40 + rm() * 460, -30 + rm() * 320, 80 + rm() * 80, 60 + rm() * 60, 300 + i, 18, 0.2)}" fill="${c}" opacity="${R2(0.88 + rm() * 0.12)}"/>`; }
    ins(maple, mp);
    const ov = svgEl('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'rgba(255,190,120,0.09)' }); svg.appendChild(ov);
    const dep = { sky: 0.02, h1: 0.1, h2: 0.2, lake: 0.3, mid: 0.4, rock: 0.9, wat: 0.9, dock: 1, wfront: 1, fg: 1.4, maple: 1.35 };
    const camAt = (f) => ({ fx: lerp(1000, 940, E.inOutSine(f / 200)), fy: 610, s: lerp(1.0, 1.12, E.inOutSine(f / 200)), rot: Math.sin(f * 0.03) * 0.15 });
    const DEC = 705; // deck top (world y)
    const liftK = (f) => E.inOutCubic(seg(f, 24, 74));
    const dockX = (f) => lerp(900, 640, E.inOutSine(seg(f, 78, 176)));
    const angle = (f) => 6.2 * liftK(f) * (1 - E.inOutSine(seg(f, 168, 188))) + 1.6 * spring(f - 186, 0.4, 0.3) * 0 ;
    function update(f) {
      const c = camAt(f);
      cam.setAttribute('transform', `translate(960 560) rotate(${c.rot}) scale(${c.s}) translate(${-c.fx} ${-c.fy})`);
      for (const n in dep) L[n].setAttribute('transform', `translate(${R2((1 - dep[n]) * (c.fx - 960))} ${R2((1 - dep[n]) * (c.fy - 560) * 0.1)})`);
      rfs.forEach((e) => e.setAttribute('opacity', R2(0.12 + 0.1 * Math.sin(f * 0.06 + +e.dataset.p))));
      rps.forEach((e) => e.setAttribute('opacity', R2(0.14 + 0.16 * Math.sin(f * 0.09 + +e.dataset.p * 1.7))));
      const X0 = dockX(f), th = angle(f), lift = liftK(f);
      const shake = Math.sin(f * 0.9) * 1.2 * seg(f, 24, 40) * (1 - seg(f, 170, 186));
      const bob = Math.sin(f * 0.12) * 1.5;
      dockLocal.setAttribute('transform', `translate(${R2(X0)} ${R2(DEC + bob * 0.5 + shake)}) rotate(${R2(th)} 700 0)`);
      // men grip the lifting bars: bar end tip at local (-150,14) => world after rotation about (700,0)
      const rad = th * D2R, bx = (lx, ly) => [700 + (lx - 700) * Math.cos(rad) - ly * Math.sin(rad), (lx - 700) * Math.sin(rad) * -1 * -1 * -1 + ly * Math.cos(rad)];
      // hand target on the bar: local x of -30 (dad) and -110 (son)
      const H = (lx) => { const dx = lx - 700; return [X0 + 700 + dx * Math.cos(rad), DEC + bob * 0.5 + shake + dx * Math.sin(rad) + 14 * Math.cos(rad)]; };
      const walkK = E.inOutSine(seg(f, 78, 176)) > 0 && f < 176 ? 1 : 0;
      const wph = f * 0.28, grip = E.inOutSine(seg(f, 4, 26));
      const reach = (fx0, fy0, sc) => {
        // shoulder at (fx0, fy0-142*sc); find the bar point at arm's length
        const shx = fx0 + 2 * sc, shy = fy0 - 142 * sc, len = 61 * sc + 4; let best = null, bd = 1e9;
        for (let lx = -146; lx <= 0; lx += 4) { const h = H(lx), d = Math.hypot(h[0] - shx, h[1] - shy); const e = Math.abs(d - len); if (e < bd) { bd = e; best = h; } }
        const vx = best[0] - shx, vy = best[1] - shy; return Math.atan2(vx, vy) / D2R;
      };
      const dy = 826, ds = 1.32, dxp = X0 - 118 + Math.sin(f * 0.28) * 2 * walkK;
      const sy = 862, ss = 1.14, sxp = X0 - 210 + Math.sin(f * 0.28 + 1) * 2 * walkK;
      const aD = lerp(8, reach(dxp, dy, ds), grip), aS = lerp(8, reach(sxp, sy, ss), grip);
      dad.set({ x: dxp, y: dy, s: ds, flip: 1, walk: wph, amp: 0.3 * walkK, lean: lerp(4, -7, E.inOutSine(seg(f, 60, 90))) * grip, afA: aD, anA: aD - 3, tilt: 3 * lift });
      son1.set({ x: sxp, y: sy, s: ss, flip: 1, walk: wph + 1.2, amp: 0.32 * walkK, lean: lerp(4, -6, E.inOutSine(seg(f, 60, 90))) * grip, afA: aS, anA: aS - 3, tilt: 2 * lift });
      // mom + younger son at the side, ready with tools
      const nod = Math.sin(f * 0.11);
      mom.set({ x: 1280, y: 985, s: 1.5, flip: -1, walk: 0, amp: 0, lean: -1 + nod * 0.6, afA: 6, anA: 4, tilt: nod * 2 });
      son2.set({ x: 1400, y: 1010, s: 1.28, flip: -1, walk: 0, amp: 0, lean: 1 + Math.sin(f * 0.13 + 1) * 0.6, afA: 4, anA: 50 + Math.sin(f * 0.2) * 4, tilt: -2 });
      // dogs
      shih.set({ x: 1150, y: 992, s: 1.6, flip: -1, sit: 1, wag: f * 0.3, wagA: 8, head: 4 * nod });
      schn.set({ x: 1590, y: 905, s: 1.5, flip: -1, gp: f * 0.2, amp: 0.15 * (1 - Math.abs(Math.sin(f * 0.03))), wag: f * 0.6, wagA: 14, head: 10 + 6 * Math.sin(f * 0.05) });
      ordr(act, shih, schn, 990, 905);
    }
    const drips = (ctx, f, c) => {
      const r = rng(9);
      for (let i = 0; i < 26; i++) { const st = 26 + r() * 130 + i * 3, a = f - st; if (a < 0 || a > 40) continue; const X0 = dockX(st), rad = angle(st) * D2R; const wx = X0 + 60 + r() * 500, wy = DEC + 50; const [sx, sy] = w2s(c, wx, wy + a * a * 0.45); ctx.fillStyle = 'rgba(190,220,236,' + R2(0.8 * (1 - a / 40)) + ')'; ctx.beginPath(); ctx.ellipse(sx, sy, 2.4, 5, 0, 0, 6.283); ctx.fill(); }
    };
    const fx = (ctx, f) => { leafFall(ctx, f, 26, 61, ['#d9762b', '#b8402a', '#e7b53a', '#c8582a'], 9); motes(ctx, f, 24, 3, '#fff0d0', 2, 0.8); drips(ctx, f, camAt(f)); };
    return { a: 500, b: 700, update, fx, camAt, dockX, angle };
  })();
};

/* ============ S4 : f 700..900 ============ */
let S4; const initS4 = () => {
  S4 = (() => {
    const svg = $('sv4'), defs = svgEl('defs'); svg.appendChild(defs);
    const cam = svgEl('g'); svg.appendChild(cam);
    const L = {}; const layer = (n, h = '') => { const g = svgEl('g', {}, h); cam.appendChild(g); L[n] = g; return g; };
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const sky = layer('sky', `<rect x="-800" y="-600" width="3600" height="1200" fill="${grad(defs, [[0, '#3b8bd0'], [0.55, '#8ec6e8'], [1, '#eaf3ea']])}"/>`);
    const rc = rng(301); let cl = '';
    const cumulus = (cx, cy, w, k) => { let d = ''; for (let i = 0; i < 9; i++) { d += blob(cx + (i - 4) * w * 0.14 + (rc() - 0.5) * 20, cy - Math.sin(i / 8 * Math.PI) * w * 0.16 * (0.6 + rc() * 0.6), w * (0.12 + rc() * 0.06), w * (0.1 + rc() * 0.06), Math.floor(rc() * 1e5), 16, 0.1); } return `<path d="${d}" fill="#ffffff" opacity="${k}"/><path d="${blob(cx, cy + w * 0.09, w * 0.6, w * 0.06, Math.floor(rc() * 1e5), 18, 0.1)}" fill="#cfe0ee" opacity="${k * 0.7}"/>`; };
    const cloudG = svgEl('g', {}, cumulus(300, 250, 520, 0.95) + cumulus(1240, 170, 620, 0.9) + cumulus(1750, 330, 420, 0.85));
    sky.appendChild(cloudG);
    const far = layer('far'), fFn = ridgeFn(311, 486, 18);
    ins(far, `<path d="${ridgePath(fFn, 311)}" fill="#6e9a7c"/>`);
    let dec = ''; const rd = rng(312); for (let x = -200; x < 2200; x += 34) dec += `<path d="${blob(x, fFn(x) - 6, 34 + rd() * 22, 26 + rd() * 16, Math.floor(rd() * 1e5), 14, 0.15)}" fill="${rd() > 0.5 ? '#4f8060' : '#5e9068'}"/>`;
    ins(far, dec);
    // fields
    const field = layer('field');
    ins(field, `<rect x="-800" y="498" width="3600" height="150" fill="${grad(defs, [[0, '#e0cf7a'], [1, '#b9a850']])}"/>`);
    let rows = ''; for (let i = -20; i < 40; i++) rows += `<line x1="${960 + (i - 10) * 30}" y1="498" x2="${960 + (i - 10) * 220}" y2="650" stroke="#a89640" stroke-width="2" opacity=".45"/>`;
    ins(field, rows);
    // farmhouse + red barn (distant, small)
    const farm = layer('farm');
    farm.innerHTML =
      `<g transform="translate(1440 560)"><rect x="-60" y="-52" width="120" height="52" fill="#f2ede0"/><path d="M-72 -52 L0 -100 L72 -52Z" fill="#4a4c58"/><rect x="-10" y="-30" width="20" height="30" fill="#b8402a"/><rect x="-46" y="-40" width="16" height="16" fill="#7d93a3"/><rect x="30" y="-40" width="16" height="16" fill="#7d93a3"/></g>` +
      `<g transform="translate(1640 566)"><rect x="-56" y="-60" width="112" height="60" fill="#b23a2c"/><path d="M-66 -60 L-40 -92 L40 -92 L66 -60Z" fill="#8a2a22"/><rect x="-16" y="-38" width="32" height="38" fill="#f2e8d8"/></g>` +
      `<g transform="translate(1240 560)"><path d="${blob(0, -46, 60, 46, 313, 18, 0.15)}" fill="#3f7a4a"/><rect x="-5" y="-14" width="10" height="14" fill="#4a3728"/></g>`;
    // fence
    const fence = layer('fence'); let fp = `<line x1="-300" y1="640" x2="2300" y2="640" stroke="#6a5a48" stroke-width="2"/><line x1="-300" y1="626" x2="2300" y2="626" stroke="#6a5a48" stroke-width="2"/>`;
    for (let x = -260; x < 2300; x += 110) fp += `<rect x="${x}" y="606" width="8" height="52" fill="#7a6650"/>`;
    ins(fence, fp);
    // lawn with stripes (rows revealed by mowers)
    const lawn = layer('lawn');
    ins(lawn, `<rect x="-900" y="650" width="3800" height="700" fill="${grad(defs, [[0, '#6a9a40'], [1, '#4e8636']])}"/>`);
    const ROWS = [712, 764, 816, 868, 920, 972]; // row center y
    let stripes = '';
    ROWS.forEach((y, k) => { stripes += `<clipPath id="cp4-${k}"><rect id="cpr4-${k}" x="-900" y="${y - 26}" width="0" height="52"/></clipPath><g clip-path="url(#cp4-${k})"><rect x="-900" y="${y - 26}" width="3800" height="52" fill="${k % 2 ? '#8dc05c' : '#7bb14c'}"/><rect x="-900" y="${y - 26}" width="3800" height="4" fill="#ffffff" opacity=".12"/><rect x="-900" y="${y + 22}" width="3800" height="4" fill="#1d4a22" opacity=".14"/></g>`; });
    ins(lawn, stripes);
    // dead-centre shade of the maple + maple
    const maple = layer('maple');
    let mp = `<ellipse cx="380" cy="880" rx="330" ry="60" fill="#1b3a26" opacity=".32"/><path d="M290 900 L318 430 L372 430 L400 900Z" fill="#4a3628"/><path d="M340 560 L520 470 L528 490 L352 590Z" fill="#4a3628"/>`;
    const rm = rng(321); for (let i = 0; i < 22; i++) mp += `<path d="${blob(340 + (rm() - 0.5) * 520, 330 + (rm() - 0.5) * 220, 90 + rm() * 70, 70 + rm() * 50, 330 + i, 18, 0.2)}" fill="${['#3f7a3a', '#4c8a3e', '#356d34', '#5a9a44'][Math.floor(rm() * 4)]}"/>`;
    ins(maple, mp);
    const act = layer('act');
    const oldd = makeDog(act, { kind: 'schnauzer', body: '#b0b4bb', dark: '#90949c', beard: '#f4f5f7', old: 1, legLen: 0.9 });
    const pup = makeDog(act, { kind: 'schnauzer', body: '#6e727c', dark: '#575b64', beard: '#c8cbd1', legLen: 1.2 });
    // riding mower (dad) — drawn as its own group
    const mowD = svgEl('g'); act.appendChild(mowD);
    const dad = makePerson(act, { coat: '#4b6ea8', pants: '#3a3f4d', hat: '#7a4f2a', hair: '#8e8e94', mitt: '#3b2f2a' });
    mowD.innerHTML = '';
    const mowDf = svgEl('g'); act.appendChild(mowDf);
    mowD.innerHTML = `<ellipse cx="0" cy="4" rx="120" ry="10" fill="#000" opacity=".25"/><rect x="-46" y="-50" width="62" height="26" rx="6" fill="#2a2a2e"/><path d="M-40 -24 L-40 -78 L-12 -80 L-6 -50Z" fill="#2a2a2e"/>`;
    mowDf.innerHTML = `<path d="M-6 -30 L112 -30 Q124 -30 122 -18 L118 -6 L-6 -6Z" fill="#c8362a"/><path d="M40 -30 L100 -30 L106 -46 L48 -46Z" fill="#d94a3a"/><rect x="60" y="-88" width="6" height="58" fill="#3a3a40"/><ellipse cx="63" cy="-90" rx="20" ry="4" fill="#3a3a40"/>` +
      `<circle cx="-30" cy="-22" r="34" fill="#232326"/><circle cx="-30" cy="-22" r="16" fill="#4a4a50"/><circle cx="104" cy="-10" r="20" fill="#232326"/><circle cx="104" cy="-10" r="9" fill="#4a4a50"/><rect x="24" y="-8" width="70" height="7" fill="#8a2018"/>`;
    const mom = makePerson(act, { coat: '#d0553f', pants: '#2b3345', hat: '#f2ead6', hair: '#8e8a90', scarf: null, mitt: '#3b2f2a' });
    const mowM = svgEl('g'); act.appendChild(mowM);
    mowM.innerHTML = `<ellipse cx="46" cy="3" rx="62" ry="7" fill="#000" opacity=".22"/><path d="M0 -34 L88 -34 Q96 -34 94 -24 L90 -14 L0 -14Z" fill="#2f8a52"/><path d="M0 -14 L92 -14 L92 -8 L0 -8Z" fill="#1f5a36"/><circle cx="12" cy="-12" r="14" fill="#232326"/><circle cx="82" cy="-12" r="14" fill="#232326"/><path d="M4 -30 L-36 -86" stroke="#3a3a40" stroke-width="5" stroke-linecap="round"/><rect x="-46" y="-92" width="26" height="6" rx="3" transform="rotate(-8 -33 -89)" fill="#3a3a40"/>`;
    const son = makePerson(act, { coat: '#6a7f3a', pants: '#2a3550', hat: null, hair: '#5a3d28', kid: 0.15, mitt: '#3b2f2a', tool: `<g transform="translate(0 -81)"><rect x="-2" y="-10" width="4" height="150" fill="#8a6a48"/><path d="M-22 130 L22 130 L26 150 L-26 150Z" fill="#8a8f96"/></g>` });
    // foreground grass tuft + hedge
    const fg = layer('fg'); let g = ''; const rg = rng(331);
    for (let i = 0; i < 22; i++) { const x = i * 120 - 100 + rg() * 40, h = 70 + rg() * 90; let d = `M${x - 28} 1140`; for (let k = 0; k < 6; k++) d += ` L${R2(x - 28 + k * 11 + rg() * 5)} ${R2(1140 - h * (0.4 + rg() * 0.6))} L${R2(x - 22 + k * 11)} 1140`; g += `<path d="${d}Z" fill="#2c5a2c"/>`; }
    ins(fg, g);
    const ov = svgEl('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'rgba(255,225,140,0.07)' }); svg.appendChild(ov);
    const dep = { sky: 0.02, far: 0.1, field: 0.15, farm: 0.15, fence: 0.5, lawn: 0.95, maple: 1, fg: 1.4 };
    const camAt = (f) => ({ fx: lerp(900, 1010, E.inOutSine(f / 200)), fy: 640, s: lerp(1.04, 1.14, E.inOutSine(f / 200)) });
    const cpr = ROWS.map((y, k) => $('cpr4-' + k));
    const dadX = (f) => 300 + 4.6 * f, momX = (f) => 1620 - 3.9 * f;
    function update(f) {
      const c = camAt(f);
      cam.setAttribute('transform', `translate(960 560) scale(${c.s}) translate(${-c.fx} ${-c.fy})`);
      for (const n in dep) L[n].setAttribute('transform', `translate(${R2((1 - dep[n]) * (c.fx - 960))} 0)`);
      cloudG.setAttribute('transform', `translate(${R2(f * 0.25)} 0)`);
      // reveal rows: dad row 4 (920), mom row 2 (816); earlier passes already cut rows 3, 1, 5 partially
      const done = (k, w) => cpr[k].setAttribute('width', R2(w));
      done(0, 3000); done(1, 3000);  // far rows already mown
      cpr[2].setAttribute('x', R2(momX(f) - 40)); cpr[2].setAttribute('width', 3400); // mom's pass reveals right-to-left
      done(3, 3000);
      done(4, dadX(f) + 900 - 60); done(5, 0);
      // dad on riding mower
      const dx = dadX(f), dyy = 946, sc = 1.55, wob = Math.sin(f * 0.9) * 1.1;
      mowD.setAttribute('transform', `translate(${R2(dx)} ${R2(dyy + wob)}) scale(${sc})`);
      mowDf.setAttribute('transform', `translate(${R2(dx)} ${R2(dyy + wob)}) scale(${sc})`);
      // seated: legs forward, torso upright
      dad.set({ x: dx - 6 * sc, y: dyy - 30 * sc + wob, s: sc * 1.02, flip: 1, walk: 0, amp: 0, lean: 3, afA: 62, anA: 58, tilt: Math.sin(f * 0.05) * 2 });
      dad.lf.setAttribute('transform', 'rotate(-86 0 -90)'); dad.ln.setAttribute('transform', 'rotate(-80 0 -90)');
      // order: mowD(seat), dad, mowDf(front)
      if (act.lastChild !== mowDf) { act.appendChild(mowD); act.appendChild(dad.g); act.appendChild(mowDf); }
      // mom pushes
      const mx = momX(f), myy = 826, ms = 1.3, mw = f * 0.32;
      mowM.setAttribute('transform', `translate(${R2(mx - 20)} ${myy}) scale(${-ms} ${ms})`);
      mom.set({ x: mx + 28 * ms, y: myy, s: ms, flip: -1, walk: mw, amp: 0.34, lean: 6, afA: 58, anA: 54 });
      // son rakes clippings behind
      const rk = Math.sin(f * 0.2);
      son.set({ x: 1500 + Math.sin(f * 0.015) * 60, y: 892, s: 1.32, flip: -1, walk: f * 0.12, amp: 0.12, lean: 8 + rk * 4, afA: 34 + rk * 14, anA: 30 + rk * 16, tilt: 4 });
      // dogs
      const br = Math.sin(f * 0.14) * 0.5 + 0.5, lift = E.inOutSine(seg(f, 60, 80)) * (1 - E.inOutSine(seg(f, 140, 158)));
      oldd.set({ x: 440, y: 878, s: 1.45, flip: 1, lie: 1, head: -2 + lift * -6 + br * 2, wag: f * 0.2, wagA: 5 * lift, gallop: 0 });
      const pth = f * 0.07, px = 1000 + 420 * Math.sin(pth), py = 860 + 55 * Math.sin(pth * 2 + 1);
      pup.set({ x: px, y: py, s: depthS(py + 40) * 1.45, flip: Math.cos(pth) >= 0 ? 1 : -1, gp: f * 0.62, amp: 0.5 + 0.5 * Math.abs(Math.cos(pth)), gallop: 1, wag: f * 0.9, wagA: 24, bow: 0.4 * Math.max(0, Math.sin(f * 0.11)) });
      ordr(act, oldd, pup, 878, py);
      // keep foreground people/mowers above dogs
    }
    const fx = (ctx, f, fa) => {
      const c = camAt(f), r = rng(88);
      // grass clippings spraying from the two mowers
      [[dadX(f) + 30, 926, 1.5], [momX(f) - 130, 812, -1.3]].forEach(([wx, wy, k], j) => {
        for (let i = 0; i < 14; i++) { const st = f - i * 1.6, a = i * 1.6; const [sx, sy] = w2s(c, wx - a * 3 - 8, wy - 8 - Math.sin(a * 0.2) * 20 * k + a * 0.4); ctx.fillStyle = i % 2 ? '#8dbf50' : '#b4d66a'; ctx.globalAlpha = 0.85 * (1 - i / 14); ctx.fillRect(sx, sy, 4, 2.4); }
      });
      ctx.globalAlpha = 1; motes(ctx, f, 34, 21, '#fff6cc', 2.2, 1.4);
    };
    return { a: 700, b: 900, update, fx, camAt };
  })();
};

/* ============ S5 : f 900..1000 ============ */
let S5; const initS5 = () => {
  S5 = (() => {
    const svg = $('sv5'), defs = svgEl('defs'); svg.appendChild(defs);
    const cam = svgEl('g'); svg.appendChild(cam);
    const L = {}; const layer = (n, h = '') => { const g = svgEl('g', {}, h); cam.appendChild(g); L[n] = g; return g; };
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const sky = layer('sky', `<rect x="-800" y="-600" width="3600" height="1400" fill="${grad(defs, [[0, '#7f9cc0'], [0.5, '#d8d0c2'], [1, '#f6d8a8']])}"/>`);
    ins(sky, `<ellipse cx="1500" cy="470" rx="900" ry="420" fill="${radial(defs, [[0, '#ffe2a8', 0.8], [1, '#ffe2a8', 0]])}"/>`);
    const trees = layer('trees'); let t = ''; const rt = rng(401);
    const FALL = ['#d9a23a', '#c8752a', '#7f8f3c', '#a35a2a', '#e0b84a'];
    for (let i = 0; i < 26; i++) t += `<path d="${blob(-100 + i * 90 + rt() * 40, 300 + rt() * 120, 90 + rt() * 70, 90 + rt() * 70, 410 + i, 18, 0.2)}" fill="${FALL[Math.floor(rt() * 5)]}"/>`;
    t += `<rect x="-900" y="380" width="3800" height="380" fill="${grad(defs, [[0, '#33453a', 0.0], [0.4, '#33453a', 0.7], [1, '#2c4a34', 1]])}"/>`;
    ins(trees, t);
    const lawn = layer('lawn');
    ins(lawn, `<rect x="-900" y="740" width="3800" height="700" fill="${grad(defs, [[0, '#7fae4e'], [1, '#4c8636']])}"/>`);
    let st = ''; for (let k = 0; k < 8; k++) st += `<rect x="-900" y="${756 + k * 46}" width="3800" height="46" fill="${k % 2 ? '#8dc05c' : '#77ac4a'}" opacity="${R2(0.5 + k * 0.05)}"/>`;
    ins(lawn, st);
    // gravel path
    ins(lawn, `<path d="M880 790 Q900 900 760 1080 L1180 1080 Q1010 900 1000 790Z" fill="#c9bfae"/>`);
    // the house
    const house = layer('house');
    let cl = ''; for (let y = 440; y < 780; y += 18) cl += `<line x1="500" x2="1420" y1="${y}" y2="${y}" stroke="#d9cfba" stroke-width="2"/>`;
    const win = (x, y, w, h) => `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" fill="#fbf6ea"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#5e7488"/><rect x="${x + w / 2 - 2}" y="${y}" width="4" height="${h}" fill="#fbf6ea"/><rect x="${x}" y="${y + h * 0.38}" width="${w}" height="4" fill="#fbf6ea"/><rect x="${x - 34}" y="${y - 4}" width="28" height="${h + 8}" fill="#3f6a4a"/><rect x="${x + w + 6}" y="${y - 4}" width="28" height="${h + 8}" fill="#3f6a4a"/>`;
    house.innerHTML =
      `<ellipse cx="960" cy="790" rx="560" ry="18" fill="#000" opacity=".25"/>` +
      `<rect x="500" y="420" width="920" height="370" fill="#efe7d4"/>${cl}` +
      `<path d="M440 430 L960 190 L1480 430Z" fill="#4c4f5e"/><path d="M440 430 L960 190 L960 206 L466 430Z" fill="#666a7c"/><rect x="1240" y="230" width="60" height="150" fill="#9a5a48"/>` +
      win(620, 500, 90, 130) + win(830, 500, 90, 130) + win(1010, 500, 90, 130) + win(1210, 500, 90, 130) +
      win(650, 668, 90, 100) + win(1180, 668, 90, 100) +
      // door + porch
      `<path d="M820 520 L960 470 L1100 520Z" fill="#4c4f5e" opacity="0"/>` +
      `<rect x="890" y="640" width="140" height="150" fill="#b8402f"/><rect x="890" y="640" width="140" height="150" fill="none" stroke="#fbf6ea" stroke-width="7"/><circle cx="1008" cy="720" r="6" fill="#e9c860"/><path d="M890 640 Q960 596 1030 640Z" fill="#fbf6ea"/>` +
      `<path d="M800 632 L960 570 L1120 632Z" fill="#4c4f5e"/><rect x="812" y="632" width="10" height="158" fill="#fbf6ea"/><rect x="1098" y="632" width="10" height="158" fill="#fbf6ea"/>` +
      `<rect x="780" y="790" width="360" height="12" fill="#a99f8c"/><rect x="820" y="802" width="280" height="10" fill="#968c79"/>`;
    // sign
    const sign = layer('sign');
    sign.innerHTML =
      `<ellipse cx="330" cy="1006" rx="90" ry="10" fill="#000" opacity=".3"/>` +
      `<rect x="318" y="600" width="24" height="410" fill="#8a6a48"/><rect x="318" y="600" width="8" height="410" fill="#a58259"/>` +
      `<rect x="318" y="600" width="270" height="18" fill="#8a6a48"/>` +
      `<g id="s5board"><rect x="360" y="616" width="240" height="180" fill="#fdfaf2" stroke="#2f5a3a" stroke-width="9"/><text x="480" y="672" text-anchor="middle" font-family="Fraunces" font-weight="400" font-size="34" fill="#2f5a3a" letter-spacing="3">FOR</text><text x="480" y="742" text-anchor="middle" font-family="Fraunces" font-weight="400" font-size="66" fill="#b8402f" letter-spacing="2">SALE</text><rect x="400" y="760" width="160" height="4" fill="#2f5a3a"/><line x1="368" x2="368" y1="600" y2="616" stroke="#555" stroke-width="3"/><line x1="592" x2="592" y1="600" y2="616" stroke="#555" stroke-width="3"/></g>` +
      `<g id="s5sold"><line x1="392" x2="392" y1="796" y2="826" stroke="#666" stroke-width="3"/><line x1="568" x2="568" y1="796" y2="826" stroke="#666" stroke-width="3"/><rect x="360" y="822" width="240" height="84" rx="4" fill="#b8402f" stroke="#fdfaf2" stroke-width="5"/><text x="480" y="880" text-anchor="middle" font-family="Fraunces" font-weight="400" font-size="58" fill="#fdfaf2" letter-spacing="10">SOLD</text></g>`;
    const board = $('s5board'), sold = $('s5sold');
    const fg = layer('fg'); let g = ''; const rg = rng(421);
    for (let i = 0; i < 22; i++) { const x = i * 120 - 100 + rg() * 40, h = 50 + rg() * 70; let d = `M${x - 28} 1140`; for (let k = 0; k < 6; k++) d += ` L${R2(x - 28 + k * 11 + rg() * 5)} ${R2(1140 - h * (0.4 + rg() * 0.6))} L${R2(x - 22 + k * 11)} 1140`; g += `<path d="${d}Z" fill="#2c5a2c"/>`; }
    ins(fg, g);
    const ov = svgEl('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'rgba(255,190,120,0.10)' }); svg.appendChild(ov);
    const dep = { sky: 0.02, trees: 0.2, lawn: 0.9, house: 0.95, sign: 1, fg: 1.4 };
    const camAt = (f) => ({ fx: lerp(1000, 780, E.inOutSine(f / 100)), fy: 660, s: lerp(1.0, 1.22, E.inOutSine(f / 100)) });
    function update(f) {
      const c = camAt(f);
      cam.setAttribute('transform', `translate(960 560) scale(${c.s}) translate(${-c.fx} ${-c.fy})`);
      for (const n in dep) L[n].setAttribute('transform', `translate(${R2((1 - dep[n]) * (c.fx - 960))} 0)`);
      // the SOLD plank drops on its chains and swings, damped
      const drop = spring(f - 22, 0.42, 0.22), sw = Math.sin((f - 22) * 0.34) * Math.exp(-(f - 22) * 0.05) * 15 * (f > 22 ? 1 : 0);
      sold.setAttribute('transform', `translate(0 ${R2(-160 * (1 - drop) * (f < 22 ? 1 : 1))}) rotate(${R2(sw)} 480 796)`);
      sold.style.opacity = f < 22 ? 0 : 1;
      board.setAttribute('transform', `rotate(${R2(Math.sin(f * 0.11) * 0.5 + (f > 22 ? Math.sin((f - 22) * 0.34) * Math.exp(-(f - 22) * 0.06) * 1.4 : 0))} 480 616)`);
    }
    const fx = (ctx, f) => { leafFall(ctx, f, 10, 71, ['#d9a23a', '#c8752a', '#e0b84a'], 8); motes(ctx, f, 18, 31, '#fff2c8', 2, 0.6); };
    return { a: 900, b: 1000, update, fx, camAt };
  })();
};
