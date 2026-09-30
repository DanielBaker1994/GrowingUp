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
    ins(field, `<rect x="-800" y="498" width="3600" height="150" fill="#4a7a3e"/>`);
    let rows = ''; for (let i = -20; i < 40; i++) rows += `<line x1="${960 + (i - 10) * 30}" y1="498" x2="${960 + (i - 10) * 220}" y2="650" stroke="#a89640" stroke-width="2" opacity=".45"/>`;
    void rows;
    // the house at the back of the lawn (from the listing photo), with the wood line closing in behind
    const farm = layer('farm');
    let wl = ''; const rw = rng(314);
    for (let i = 0; i < 40; i++) wl += `<path d="${blob(-500 + i * 80 + rw() * 30, 470 + rw() * 110, 80 + rw() * 60, 90 + rw() * 60, 3140 + i, 18, 0.2)}" fill="${['#3c6a36', '#4c7c3e', '#2f5a30', '#5c8c46'][Math.floor(rw() * 4)]}"/>`;
    wl += `<rect x="-900" y="560" width="3800" height="100" fill="${grad(defs, [[0, '#2c4a2c', 0], [1, '#2c4a2c', 0.85]])}"/>`;
    // the gravel two-track off to the left of the house: out of the tall white pines, over the crest of the lawn
    // and away to the left behind the maple (listing photo 38)
    const DL = [[556, 596], [520, 640], [330, 690], [-340, 724]], DR = [[588, 596], [650, 652], [520, 740], [-120, 800]];
    let dw = yardPine(470, 600, 300, 3301, '#31503a', '#284231') + yardPine(690, 594, 280, 3302, '#31503a', '#284231') + yardPine(600, 603, 340, 3303, '#34573f', '#2a4434') + yardPine(860, 610, 320, 3308, '#34573f', '#2a4434');
    const driveSvg = gravelDrive(defs, DL, DR, { speck: 70, seed: 314 });
    dw += driveSvg + yardPine(520, 626, 400, 3304) + yardPine(700, 640, 430, 3305) + yardPine(930, 646, 390, 3307);
    farm.innerHTML = wl + dw + `<g transform="translate(1420 668) scale(0.62)">${gambrelHouse({ detail: 1 })}</g>` +
      `<g transform="translate(1100 664)"><path d="${blob(0, -60, 60, 70, 313, 18, 0.15)}" fill="#6a9a3c"/><path d="${blob(20, -30, 50, 40, 316, 18, 0.2)}" fill="#8aa84a"/></g>`;
    layer('fence');
    // lawn with stripes (rows revealed by mowers)
    const lawn = layer('lawn');
    ins(lawn, `<rect x="-900" y="650" width="3800" height="700" fill="${grad(defs, [[0, '#6a9a40'], [1, '#4e8636']])}"/>`);
    const ROWS = [712, 764, 816, 868, 920, 972]; // row center y
    let stripes = '';
    ROWS.forEach((y, k) => { stripes += `<clipPath id="cp4-${k}"><rect id="cpr4-${k}" x="-900" y="${y - 26}" width="0" height="52"/></clipPath><g clip-path="url(#cp4-${k})"><rect x="-900" y="${y - 26}" width="3800" height="52" fill="${k % 2 ? '#8dc05c' : '#7bb14c'}"/><rect x="-900" y="${y - 26}" width="3800" height="4" fill="#ffffff" opacity=".12"/><rect x="-900" y="${y + 22}" width="3800" height="4" fill="#1d4a22" opacity=".14"/></g>`; });
    ins(lawn, stripes);
    // the drive where it comes over the lawn (same depth as the house, so it stays put against the pines)
    const drive2 = layer('drive2');
    ins(drive2, `<clipPath id="s4dr"><rect x="-900" y="650" width="3800" height="400"/></clipPath><g clip-path="url(#s4dr)">${driveSvg}</g>`);
    // the old stump at the drive's edge, a post and hostas across from it, the nearest pines on the lawn
    ins(drive2, `<path fill="#b5ad9e" d="M404 688 L407 646 Q423 638 439 646 L442 688Z"/><ellipse cx="423" cy="646" rx="16" ry="5" fill="#d8d0bf"/><path fill="#000" opacity=".15" d="M430 688 L431 647 Q436 644 439 646 L442 688Z"/>`);
    ins(drive2, `<rect x="616" y="664" width="8" height="40" fill="#8a7a66"/><rect x="616" y="664" width="3" height="40" fill="#a39480"/>`);
    let hs = ''; for (let i = 0; i < 6; i++) hs += `<path fill="${i % 2 ? '#5c8c40' : '#72a04c'}" d="${blob(636 + i * 16, 702 - (i % 2) * 6, 20, 11, 3310 + i, 12, 0.3)}"/>`;
    ins(drive2, hs + yardPine(250, 712, 560, 3320) + yardPine(760, 700, 520, 3321, '#31503a', '#284231'));
    // far off at the back of the lawn: the rake dropped, and her running from the bees
    const run = layer('run');
    ins(run, `<g transform="translate(720 708) rotate(4)"><rect x="-44" y="-2" width="88" height="3" fill="#8a6a48"/><path d="M-40 -6 L-50 -6 L-52 6 L-40 6Z" fill="#8a8f96"/></g>`);
    const runner = makePerson(run, { coat: '#6a7f3a', pants: '#2a3550', hat: null, hair: '#6a4a30', long: 1, mitt: '#e6b590' });
    const beeG = svgEl('g'); run.appendChild(beeG);
    const NB = 16, bees = [];
    for (let i = 0; i < NB; i++) { const b = svgEl('g', {}, `<ellipse cx="-1" cy="-3.2" rx="3" ry="2.2" fill="#eef4f8" opacity=".75" class="wg"/><ellipse cx="0" cy="0" rx="3.6" ry="2.5" fill="#e8b83a"/><rect x="-0.6" y="-2.5" width="1.6" height="5" fill="#241d1a"/><circle cx="-3.2" cy="0" r="1.4" fill="#241d1a"/>`); beeG.appendChild(b); bees.push({ g: b, w: b.querySelector('.wg'), q: rng(3400 + i) }); }
    bees.forEach((b) => { b.lag = 3 + b.q() * 11; b.r = 8 + b.q() * 22; b.w0 = 0.18 + b.q() * 0.22; b.ph = b.q() * 6.28; b.dy = (b.q() - 0.5) * 16; });
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
    // foreground grass tuft + hedge
    const fg = layer('fg'); let g = ''; const rg = rng(331);
    for (let i = 0; i < 22; i++) { const x = i * 120 - 100 + rg() * 40, h = 70 + rg() * 90; let d = `M${x - 28} 1140`; for (let k = 0; k < 6; k++) d += ` L${R2(x - 28 + k * 11 + rg() * 5)} ${R2(1140 - h * (0.4 + rg() * 0.6))} L${R2(x - 22 + k * 11)} 1140`; g += `<path d="${d}Z" fill="#2c5a2c"/>`; }
    ins(fg, g);
    const ov = svgEl('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'rgba(255,225,140,0.07)' }); svg.appendChild(ov);
    const dep = { sky: 0.02, far: 0.1, field: 0.15, farm: 0.15, fence: 0.5, lawn: 0.95, drive2: 0.15, run: 0.95, maple: 1, fg: 1.4 };
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
      // far back: she runs right to left across the lawn, arms going over her head, the swarm on her heels
      const runX = (t) => 700 + 5.9 * t + 26 * Math.sin(t * 0.045), runY = (t) => 703 + 7 * Math.sin(t * 0.06);
      const rx = runX(f), ry = runY(f), RS = 0.56;
      runner.set({ x: rx, y: ry, s: RS, flip: 1, walk: f * 0.62, amp: 0.95, lean: 13, afA: 150 + 38 * Math.sin(f * 0.72), anA: 128 + 44 * Math.sin(f * 0.72 + 2.4), tilt: -8 + 10 * Math.sin(f * 0.11) });
      bees.forEach((b, i) => {
        const t = f - b.lag, a = b.ph + f * b.w0 * (i % 2 ? 1 : -1);
        const bx = runX(t) - 16 + Math.cos(a) * b.r, by = runY(t) - 150 * RS + b.dy + Math.sin(a * 1.3) * b.r * 0.55;
        b.g.setAttribute('transform', `translate(${R2(bx)} ${R2(by)}) scale(${Math.cos(a) > 0 ? 1 : -1} 1)`);
        b.w.setAttribute('ry', R2(1.2 + 1.4 * Math.abs(Math.sin(f * 2.3 + i))));
      });
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
    // the gravel drive comes in past the sign, left of the house, under the white pines (listing photos 38 and 40)
    const pines = layer('pines');
    ins(pines, yardPine(-40, 770, 1040, 4301, '#2f5238', '#26432e', '#4e4238') + yardPine(190, 758, 900, 4302, '#34573f', '#2a4434', '#554840') + yardPine(470, 766, 980, 4303, '#2f5238', '#26432e', '#4e4238'));
    ins(lawn, gravelDrive(defs, [[500, 778], [330, 800], [80, 900], [-200, 1130]], [[650, 782], [480, 820], [300, 950], [250, 1130]], { speck: 90, seed: 431 }));
    ins(lawn, `<path fill="#b5ad9e" d="M-40 1000 L-37 952 Q-20 944 -3 952 L0 1000Z"/><ellipse cx="-20" cy="952" rx="17" ry="5.5" fill="#d8d0bf"/>`);
    // the house
    const house = layer('house');
    house.innerHTML = `<ellipse cx="1150" cy="792" rx="640" ry="20" fill="#000" opacity=".22"/><g transform="translate(1060 790) scale(1.12)">${gambrelHouse({ detail: 1, glassLit: null })}</g>`;
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
    const dep = { sky: 0.02, trees: 0.2, pines: 0.85, lawn: 0.9, house: 0.95, sign: 1, fg: 1.4 };
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
