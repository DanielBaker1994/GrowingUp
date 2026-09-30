/* scene7b.js — S7b: the upper deck just after the rain, from the family's photo: the big white pine on the left, its
   boughs over everything, the rail with the black cat cut-out sitting on it, the carved bear by the stairs, the eave in
   the corner, wet boards, mist on the far shore. We hold, find the cat, then follow the rail to the corner and go down
   the stairs to the lake deck, where the next scene (the three at the rail) picks up. f 1200..1500 (local 0..300) */
let S7b; const initS7b = () => {
  S7b = (() => {
    const svg = $('sv7b'), defs = svgEl('defs'); svg.appendChild(defs);
    const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
    const r = rng(7501);
    const view = svgEl('g'); svg.appendChild(view);
    // depth layers: each scales by s^k about the focus, so the push reads as a dolly, not a zoom
    const L = {}, K = {};
    const layer = (n, k) => { const g = svgEl('g'); view.appendChild(g); L[n] = g; K[n] = k; return g; };
    const cl = (x, y) => `${R2(x)} ${R2(y)}`;

    // ---- sky: overcast lifting toward dusk ----
    ins(layer('sky', 0.15), `<rect x="-1400" y="-900" width="4800" height="1900" fill="${grad(defs, [[0, '#b3b1bd'], [0.5, '#cbc7cd'], [0.72, '#dcd2cf'], [1, '#d6cfd0']])}"/>`);
    // ---- far shore: three misty bands of spruce and pine, a few cottages and docks at the water ----
    const far = layer('far', 0.3);
    const canopy = (seed, y, amp, col, spires) => { const q = rng(seed); let d = `<path d="${ridgePath(ridgeFn(seed, y, amp), seed, -1400, 3400, 16, 1.4, 520)}" fill="${col}"/>`; const fn = ridgeFn(seed, y, amp); for (let x = -1400; x < 3400; x += 26 + q() * 40) d += `<path fill="${col}" d="${blob(x, fn(x) + 4, 30 + q() * 40, 12 + q() * 14, Math.floor(q() * 1e6), 14, 0.3)}"/>`; if (spires) d += `<path fill="${col}" d="${forest(fn, -1400, 3400, spires, 30, 80, seed + 1, 8)}"/>`; return d; };
    ins(far, canopy(7511, 418, 18, '#a2a8a9', 0) + canopy(7514, 452, 12, '#8b9393', 0) + `<rect x="-1400" y="470" width="4800" height="40" fill="#7a8483"/>` + canopy(7517, 490, 6, '#737e7d', 0));
    let cot = '';
    [[1480, 488, 26], [1560, 494, 18], [1700, 486, 30], [1820, 492, 22], [1250, 497, 14], [960, 498, 12]].forEach(([x, y, w]) => { cot += `<rect x="${x}" y="${y - w * 0.55}" width="${w}" height="${R2(w * 0.55)}" fill="#8e8e8a"/><path fill="#6c6f70" d="M${x - 3} ${R2(y - w * 0.55)} L${x + w / 2} ${R2(y - w * 0.9)} L${x + w + 3} ${R2(y - w * 0.55)}Z"/>`; });
    [[1500, 60], [1640, 44], [1760, 70], [1860, 40], [1150, 30]].forEach(([x, w]) => { cot += `<rect x="${x}" y="505" width="${w}" height="3" fill="#dcdad4"/>`; });
    cot += `<rect x="1880" y="499" width="26" height="7" fill="#c86a3a" opacity=".8"/>`;
    ins(far, cot + `<rect x="-1400" y="300" width="4800" height="212" fill="${grad(defs, [[0, '#d6cfd0', 0], [0.7, '#d9d3d2', 0.35], [1, '#dcd6d4', 0.55]])}"/>`);
    // ---- the lake: silver-lilac with long light streaks ----
    const lake = layer('lake', 0.5);
    ins(lake, `<rect x="-1400" y="506" width="4800" height="900" fill="${grad(defs, [[0, '#c4c3cb'], [0.35, '#b1b3bb'], [1, '#9ea3ad']])}"/>`);
    let st = '';
    for (let i = 0; i < 70; i++) { const t = r(), y = 512 + t * t * 520, x = r() * 3000 - 600, w = 60 + r() * 360 * (0.4 + t); st += `<rect class="rp" x="${R2(x)}" y="${R2(y)}" width="${R2(w)}" height="${R2(1.5 + t * 3)}" rx="1.5" fill="${r() > 0.35 ? '#dcdbe0' : '#8f949e'}" opacity=".45" data-p="${R2(r() * 6)}"/>`; }
    ins(lake, st);
    const rps = [...lake.querySelectorAll('.rp')];
    // ---- conifers climbing from the slope below the deck ----
    const mid = layer('mid', 0.8);
    const conifer = (x, top, bot, w, seed, cols) => {
      const q = rng(seed); let d = '';
      for (let y = top; y < bot; y += 10) {
        const t = (y - top) / (bot - top), hw = w * (0.18 + 0.82 * Math.pow(t, 0.7)) * (0.7 + q() * 0.6);
        d += `<path fill="${cols[Math.floor(q() * cols.length)]}" d="${blob(x + (q() - 0.5) * w * 0.25, y, hw, 12 + q() * 10, Math.floor(q() * 1e6), 14, 0.5)}"/>`;
      }
      return `<path fill="${cols[0]}" d="M${x - 2} ${top + 10} L${x + 2} ${top + 10} L${x + 5} ${bot} L${x - 5} ${bot}Z"/>` + d;
    };
    ins(mid, conifer(1240, 350, 980, 110, 7521, ['#3b463e', '#45513f', '#34403a']));
    ins(mid, conifer(1320, 470, 980, 70, 7522, ['#404c41', '#4a5746']));
    ins(mid, conifer(880, 470, 980, 150, 7523, ['#3e4a3f', '#4b5846', '#35403a']));
    ins(mid, conifer(420, 640, 1000, 170, 7524, ['#4a5645', '#56634d']));
    ins(mid, conifer(1560, 610, 1000, 160, 7525, ['#46523f', '#53604a', '#3c473b']));
    ins(mid, conifer(1720, 700, 1000, 140, 7526, ['#4c5a45', '#5a674f']));
    // ---- the white pine: trunk at the left edge, long boughs of drooping needle tufts ----
    const pine = layer('pine', 1.05);
    let pn = `<path fill="#3a3632" d="M-60 -200 L150 -200 Q160 400 168 700 Q176 900 196 1000 L-60 1000Z"/>`;
    for (let i = 0; i < 60; i++) { const y = -180 + r() * 1150, x = -40 + r() * 190, h = 20 + r() * 60; pn += `<path fill="${r() > 0.5 ? '#2a2724' : '#4a4540'}" d="M${R2(x)} ${R2(y)} q${R2(4 + r() * 6)} ${R2(h / 2)} 0 ${R2(h)} q${R2(-3 - r() * 4)} ${R2(-h / 2)} 0 ${R2(-h)}Z" opacity=".8"/>`; }
    pn += `<path fill="#4b4640" d="M138 -200 Q150 400 158 700 Q166 900 186 1000 L196 1000 Q176 900 168 700 Q160 400 150 -200Z" opacity=".7"/>`;
    const bough = (pts, w0) => { let d = `M${cl(pts[0][0], pts[0][1] - w0 / 2)}`; for (let i = 1; i < pts.length; i++) d += ` L${cl(pts[i][0], pts[i][1] - w0 * (1 - i / pts.length) / 2)}`; for (let i = pts.length - 1; i >= 0; i--) d += ` L${cl(pts[i][0], pts[i][1] + w0 * (1 - i / pts.length) / 2 + 1)}`; return `<path fill="#34302c" d="${d}Z"/>`; };
    const tufts = (x0, y0, x1, y1, n, seed, droop) => {
      const q = rng(seed); let d = '';
      for (let i = 0; i < n; i++) {
        const t = q(), x = lerp(x0, x1, t) + (q() - 0.5) * 60, y = lerp(y0, y1, t) + q() * droop, rx = 40 + q() * 60, ry = 14 + q() * 20;
        const col = ['#2d3830', '#34403a', '#3c4a3e', '#27302a'][Math.floor(q() * 4)];
        d += `<path fill="${col}" opacity="${R2(0.8 + q() * 0.2)}" d="${blob(x, y, rx, ry, Math.floor(q() * 1e6), 26, 0.28)}" transform="rotate(${R2((q() - 0.5) * 16)} ${R2(x)} ${R2(y)})"/>`;
        // soft hanging needles: fine strokes fanning down from the pad
        let nd = '';
        for (let k = 0; k < 9; k++) { const nx = x + (q() - 0.5) * rx * 1.7, ny = y + ry * (0.1 + q() * 0.4), nl = 14 + q() * 26; nd += `M${R2(nx)} ${R2(ny)} q${R2((q() - 0.5) * 6)} ${R2(nl * 0.6)} ${R2((q() - 0.5) * 10)} ${R2(nl)} `; }
        d += `<path fill="none" stroke="${col}" stroke-width="2.2" stroke-linecap="round" d="${nd}"/>`;
      }
      return d;
    };
    pn += bough([[150, 30], [520, 60], [900, 110], [1300, 170], [1720, 250]], 26) + tufts(300, 60, 1750, 250, 60, 7531, 70);
    pn += bough([[155, 300], [420, 250], [760, 220], [1100, 250]], 20) + tufts(330, 240, 1100, 260, 32, 7532, 60);
    pn += bough([[160, 470], [380, 420], [640, 380], [880, 390]], 18) + tufts(380, 400, 900, 400, 22, 7533, 50);
    pn += bough([[150, -40], [700, -30], [1400, 20], [2000, 90]], 30) + tufts(200, -60, 2000, 60, 60, 7534, 60);
    pn += bough([[165, 640], [330, 610], [480, 600]], 12) + tufts(300, 600, 500, 610, 8, 7535, 30);
    ins(pine, pn);
    // ---- the eave in the top-right corner ----
    const eave = layer('eave', 1.2);
    let ev = `<path fill="#5d626b" d="M1622 -300 L2400 -300 L2400 44 L1700 80Z"/>`;
    for (let i = 0; i < 14; i++) ev += `<line x1="${1640 + i * 50}" y1="${R2(-300)}" x2="${R2(1700 + i * 48)}" y2="${R2(80 - i * 2.6)}" stroke="#4c5058" stroke-width="3"/>`;
    for (let i = 0; i < 40; i++) ev += `<circle cx="${R2(1680 + r() * 700)}" cy="${R2(-60 + r() * 120)}" r="1.6" fill="#3d4148"/>`;
    ev += `<path fill="#f1f1ee" d="M1610 -300 L1624 -300 L1706 70 L2400 34 L2400 50 L1698 88Z"/><path fill="#d4d4d0" d="M1698 88 L2400 50 L2400 58 L1700 96Z"/>`;
    ins(eave, ev);
    // ---- the front rail, sign, lights and balusters; the side (stair) rail beyond the corner post ----
    const rail = layer('rail', 1.0);
    const topY = (x) => lerp(683, 634, x / 1382), botY = (x) => lerp(912, 880, x / 1382);
    const RL = '#6a5646', RD = '#4a3c31', RH = '#8d7a69';
    let rl = '';
    // the sign hangs under the top rail on two little chains (we see its plain back)
    rl += `<path fill="#5a3e2a" d="M486 ${R2(topY(486) + 18)} L710 ${R2(topY(710) + 18)} L706 ${R2(topY(706) + 120)} Q600 ${R2(topY(600) + 176)} 596 ${R2(topY(596) + 180)} Q560 ${R2(topY(560) + 160)} 490 ${R2(topY(490) + 128)}Z"/>` +
      `<path fill="#6b4c34" d="M492 ${R2(topY(492) + 24)} L704 ${R2(topY(704) + 24)} L702 ${R2(topY(702) + 40)} L494 ${R2(topY(494) + 40)}Z" opacity=".6"/>`;
    // bottom rail (a 2x6 on edge)
    rl += `<path fill="${RD}" d="M-300 ${R2(botY(-300))} L1382 ${R2(botY(1382))} L1382 ${R2(botY(1382) + 26)} L-300 ${R2(botY(-300) + 28)}Z"/><path fill="${RL}" d="M-300 ${R2(botY(-300) - 6)} L1382 ${R2(botY(1382) - 6)} L1382 ${R2(botY(1382))} L-300 ${R2(botY(-300))}Z"/>`;
    // balusters
    for (let x = -290; x < 1370; x += 57) { if (Math.abs(x - 735) < 30) continue; const t0 = topY(x) + 14, b0 = botY(x) - 6; rl += `<rect x="${x}" y="${R2(t0)}" width="13" height="${R2(b0 - t0)}" fill="${RL}"/><rect x="${x}" y="${R2(t0)}" width="3.5" height="${R2(b0 - t0)}" fill="${RH}" opacity=".55"/><rect x="${x + 10}" y="${R2(t0)}" width="3" height="${R2(b0 - t0)}" fill="${RD}" opacity=".7"/>`; }
    // posts: mid post and the corner post, both with caps
    const post = (x, w, top, bot) => `<rect x="${x}" y="${top}" width="${w}" height="${bot - top}" fill="${RL}"/><rect x="${x}" y="${top}" width="${R2(w * 0.28)}" height="${bot - top}" fill="${RH}" opacity=".6"/><rect x="${R2(x + w * 0.78)}" y="${top}" width="${R2(w * 0.22)}" height="${bot - top}" fill="${RD}"/><path fill="${RD}" d="M${x - 3} ${top} L${x + w + 3} ${top} L${x + w} ${top - 8} L${x + w / 2} ${top - 14} L${x} ${top - 8}Z"/>`;
    rl += post(724, 32, 614, 990) + post(1348, 36, 595, 960);
    // top rail: a broad wet cap with a sheen line
    rl += `<path fill="${RL}" d="M-300 ${R2(topY(-300))} L1384 ${R2(topY(1384))} L1384 ${R2(topY(1384) + 16)} L-300 ${R2(topY(-300) + 17)}Z"/><path fill="${RH}" d="M-300 ${R2(topY(-300) - 1)} L1384 ${R2(topY(1384) - 1)} L1384 ${R2(topY(1384) + 3)} L-300 ${R2(topY(-300) + 3)}Z"/><path fill="#c9c6cc" opacity=".35" d="M-300 ${R2(topY(-300))} L1384 ${R2(topY(1384))} L1384 ${R2(topY(1384) + 1.5)} L-300 ${R2(topY(-300) + 1.5)}Z"/>`;
    // side rail going down the stairs: balusters grow toward us, the handrail slopes down to the right
    const sideTop = (x) => lerp(612, 900, (x - 1384) / (1760 - 1384)), sideBot = (x) => lerp(880, 1260, (x - 1384) / (1760 - 1384));
    for (let i = 0; i < 12; i++) { const t = i / 11, x = lerp(1398, 1742, Math.pow(t, 1.25)), w = lerp(10, 18, t); rl += `<rect x="${R2(x)}" y="${R2(sideTop(x) + 10)}" width="${R2(w)}" height="${R2(sideBot(x) - sideTop(x))}" fill="${RL}"/><rect x="${R2(x)}" y="${R2(sideTop(x) + 10)}" width="${R2(w * 0.3)}" height="${R2(sideBot(x) - sideTop(x))}" fill="${RH}" opacity=".5"/>`; }
    rl += `<path fill="${RL}" d="M1380 606 L1780 918 L1780 944 L1380 626Z"/><path fill="${RH}" d="M1380 604 L1780 916 L1780 921 L1380 609Z"/>`;
    // string lights along the front rail and down the stair rail, glowing a little in the gloom
    const bulbs = [];
    let wire = `M-300 ${R2(topY(-300) + 24)}`;
    for (let x = -300; x <= 1370; x += 114) { const x1 = x + 114, y0 = topY(x) + 24, y1 = topY(x1) + 24; wire += ` Q${R2(x + 57)} ${R2((y0 + y1) / 2 + 26)} ${R2(x1)} ${R2(y1)}`; bulbs.push([x + 57, (y0 + y1) / 2 + 13]); }
    for (let i = 1; i < 5; i++) { const x = lerp(1384, 1760, i / 5); bulbs.push([x, sideTop(x) + 36]); }
    rl += `<path fill="none" stroke="#1d1a18" stroke-width="2" d="${wire}"/><path fill="none" stroke="#1d1a18" stroke-width="2" d="M1384 640 Q1500 760 1560 776 Q1650 850 1760 930"/>`;
    const glow = radial(defs, [[0, '#ffd89a', 0.75], [0.4, '#ffc27a', 0.22], [1, '#ffb070', 0]]);
    bulbs.forEach(([x, y]) => { rl += `<circle cx="${R2(x)}" cy="${R2(y + 10)}" r="30" fill="${glow}"/><rect x="${R2(x - 3)}" y="${R2(y - 6)}" width="6" height="8" fill="#1d1a18"/><ellipse cx="${R2(x)}" cy="${R2(y + 8)}" rx="6" ry="9" fill="#ffe6b8"/>`; });
    ins(rail, rl);
    // ---- the cat: a flat black steel cut-out sitting on the rail, facing the lake to the left ----
    const catG = svgEl('g'); rail.appendChild(catG);
    const CX = 628, CY = topY(628);
    catG.innerHTML = `<g transform="translate(${CX} ${R2(CY)})">` +
      `<path fill="#121014" d="M-40 0 L-38 -40 Q-40 -62 -34 -72 Q-44 -76 -50 -84 Q-58 -86 -60 -92 Q-58 -99 -52 -103 L-48 -118 L-38 -106 Q-32 -108 -28 -108 L-22 -120 L-20 -100 Q-18 -90 -16 -84 Q-4 -76 10 -60 Q30 -40 38 -20 Q44 -8 44 0Z"/>` +
      `<path fill="none" stroke="#121014" stroke-width="7" stroke-linecap="round" d="M38 -4 Q58 -8 62 -26 Q66 -44 56 -54 Q50 -60 56 -64"/>` +
      `<path fill="#121014" d="M-44 0 L48 0 L48 3 L-44 3Z"/>` +
      `<path fill="none" stroke="#f0eef2" stroke-opacity=".22" stroke-width="1.4" d="M-52 -102 L-48 -117 L-39 -106 M-28 -108 L-22 -119"/></g>`;
    // ---- the deck: wet boards laid on the diagonal, the rail and sky mirrored in the puddles ----
    const deck = layer('deck', 1.12);
    const deckPoly = `M-400 ${R2(botY(-400) + 26)} L1384 ${R2(botY(1384) + 24)} L1384 900 L1900 1330 L-400 1330Z`;
    defs.insertAdjacentHTML('beforeend', `<clipPath id="s7bdeck"><path d="${deckPoly}"/></clipPath>`);
    let dk = `<path fill="${grad(defs, [[0, '#51463c'], [1, '#5d5146']])}" d="${deckPoly}"/><g clip-path="url(#s7bdeck)">`;
    const VP = [3400, 560];
    for (let i = -30; i < 40; i++) { const x0 = -1400 + i * 88, y0 = 1330, t = (y0 - 880) / (y0 - VP[1]), x1 = lerp(x0, VP[0], t); dk += `<line x1="${x0}" y1="${y0}" x2="${R2(x1)}" y2="880" stroke="#3b3129" stroke-width="3"/>`; }
    for (let i = 0; i < 24; i++) { const x = r() * 1800 - 100, y = 960 + r() * 120; dk += `<ellipse cx="${R2(x)}" cy="${R2(y)}" rx="${R2(60 + r() * 160)}" ry="${R2(5 + r() * 9)}" fill="#a6a4ac" opacity="${R2(0.1 + r() * 0.16)}"/>`; }
    // reflections of posts and balusters in the wet boards
    for (let x = -290; x < 1370; x += 57) dk += `<rect x="${x}" y="${R2(botY(x) + 30)}" width="12" height="${R2(90 + r() * 90)}" fill="#2e2620" opacity=".35"/>`;
    dk += `<rect x="724" y="${R2(botY(724) + 30)}" width="30" height="230" fill="#241e19" opacity=".45"/><rect x="1348" y="904" width="34" height="200" fill="#241e19" opacity=".45"/>`;
    for (let i = 0; i < 10; i++) { const x = 200 + i * 150 + r() * 40; dk += `<rect x="${R2(x)}" y="${R2(940 + r() * 40)}" width="${R2(8 + r() * 12)}" height="${R2(80 + r() * 120)}" fill="#c9c7cf" opacity=".12"/>`; }
    dk += `</g>`;
    ins(deck, dk);
    const rings = svgEl('g'); deck.appendChild(rings);
    // ---- the carved bear on its stump at the top of the stairs ----
    const bear = layer('bear', 1.3);
    let br = `<g transform="translate(1846 1000)">`;
    br += `<path fill="#7d5a3a" d="M-86 0 Q-90 60 -84 200 L90 200 Q92 60 86 0Z"/><ellipse cx="0" cy="0" rx="86" ry="18" fill="#a17a52"/><ellipse cx="0" cy="0" rx="62" ry="12" fill="none" stroke="#8a6440" stroke-width="3"/><ellipse cx="0" cy="0" rx="36" ry="7" fill="none" stroke="#8a6440" stroke-width="2.5"/>`;
    for (let i = 0; i < 7; i++) br += `<line x1="${-78 + i * 26}" y1="16" x2="${-80 + i * 27}" y2="200" stroke="#5e4028" stroke-width="3" opacity=".7"/>`;
    br += `<path fill="#171516" d="M-54 -2 L-46 -70 Q-64 -120 -58 -170 Q-54 -210 -30 -236 Q-40 -250 -38 -262 Q-52 -272 -50 -282 L-40 -300 Q-30 -316 -8 -318 L2 -334 L14 -322 Q28 -316 34 -300 Q44 -286 40 -262 Q60 -230 62 -180 Q66 -130 50 -70 L58 -2 L20 -2 L14 -40 L-14 -40 L-18 -2Z"/>`;
    br += `<path fill="#171516" d="M-44 -212 Q-78 -200 -80 -168 Q-78 -150 -60 -150 Q-52 -170 -34 -184Z"/><path fill="#171516" d="M-54 -300 Q-72 -304 -84 -296 Q-86 -286 -72 -282 Q-60 -284 -50 -286Z"/><circle cx="-84" cy="-293" r="5" fill="#0c0b0c"/>`;
    for (let i = 0; i < 46; i++) { const t = r(), y = -300 + t * 290, x = -40 + r() * 86 - (t < 0.2 ? 20 : 0); br += `<path fill="none" stroke="#343032" stroke-width="2" d="M${R2(x)} ${R2(y)} q${R2(4 + r() * 6)} ${R2(4 + r() * 5)} ${R2(2 + r() * 4)} ${R2(10 + r() * 8)}"/>`; }
    br += `<path fill="#c9c7cf" opacity=".16" d="M-50 -170 Q-56 -110 -40 -64 L-34 -66 Q-48 -112 -44 -168Z"/><circle cx="-38" cy="-298" r="2.4" fill="#3c3a3c"/></g>`;
    ins(bear, br);

    // ---- after the cat: a walk in 3D through the same place as the lake view (scene9), mirrored because we face the
    // lake here. Down the side-deck stairs, past the inukshuk and the Muskoka chairs on the granite shelf in front of
    // the big windows, out over the rock and down to the lake deck, behind the three at the rail.
    // World: metres; X right (facing the lake), Y up from the water, Z out from the cottage's front wall to the lake.
    const stairs = svgEl('g'); svg.appendChild(stairs);
    const stBack = svgEl('g'), stPpl = svgEl('g'), stFront = svgEl('g'); stairs.appendChild(stBack); stairs.appendChild(stPpl); stairs.appendChild(stFront);
    const FS = 980, NEAR = 0.06;
    const FLOOR = 5.6, URT = 6.55, UDZ = 3.0, SHELF = 4.4, SHZ1 = 5.0, LDY = 2.2, LDZ0 = 7.9, LDZ1 = 15.9, LDX0 = -4.8, LDX1 = 5.5;
    const SDX0 = -9.9, SDX1 = -6.6, SDZ = 4.2; // the cat's deck, off the wing
    const SSX0 = -6.6, SSX1 = -5.0, SSN = 6, SSZ0 = 3.2, SSZ1 = 4.2, SRISE = (FLOOR - SHELF) / SSN, SRUN = (SSX1 - SSX0) / SSN;
    const stairY = (x) => FLOOR - clamp((x - SSX0) / (SSX1 - SSX0)) * (FLOOR - SHELF);
    let cam3 = { x: 0, y: 7, z: 3, yaw: 0, pitch: 0.4 };
    const tr3 = (X, Y, Z) => { const dx = X - cam3.x, dy = Y - cam3.y, dz = Z - cam3.z, cy = Math.cos(cam3.yaw), sy = Math.sin(cam3.yaw), c = Math.cos(cam3.pitch), s = Math.sin(cam3.pitch); const x1 = dx * cy - dz * sy, z1 = dx * sy + dz * cy; return [x1, dy * c + z1 * s, -dy * s + z1 * c]; };
    const proj = (q) => [960 + (FS * q[0]) / q[2], 540 - (FS * q[1]) / q[2]];
    const clipPoly = (pts) => { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[2] >= NEAR, ib = b[2] >= NEAR; if (ia) out.push(a); if (ia !== ib) { const t = (NEAR - a[2]) / (b[2] - a[2]); out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), NEAR]); } } return out; };
    const face = (P3, fill, extra = '') => { const c = clipPoly(P3.map((p) => tr3(p[0], p[1], p[2]))); if (c.length < 3) return ''; return `<path fill="${fill}" ${extra} d="M${c.map((q) => { const s = proj(q); return cl(s[0], s[1]); }).join(' L')}Z"/>`; };
    // a flat cut-out standing at (X,Y,Z), drawn in centimetres with y down, turned to the lens
    const card = (X, Y, Z, shape, k = 1) => { const q = tr3(X, Y, Z); if (q[2] < 0.3) return ''; const sc = (FS / q[2] / 100) * k, sp = proj(q); if (sp[0] < -1400 || sp[0] > 3300) return ''; return `<g transform="translate(${cl(sp[0], sp[1])}) scale(${R2(sc * 1000) / 1000})">${shape}</g>`; };
    const depth = (X, Y, Z) => tr3(X, Y, Z)[2];
    // vertical box helper for posts and rails (axis-aligned), as one item
    const box = (x0, y0, z0, x1, y1, z1, col, colS) => face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], col) + face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], colS) + face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], colS) + face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], col);
    const glow3 = radial(defs, [[0, '#ffd89a', 0.75], [0.4, '#ffc27a', 0.22], [1, '#ffb070', 0]]);
    const bulb = (X, Y, Z) => { const q = tr3(X, Y, Z); if (q[2] < 0.3) return ''; const p = proj(q), k = FS / q[2]; return `<circle cx="${R2(p[0])}" cy="${R2(p[1])}" r="${R2(0.22 * k)}" fill="${glow3}"/><ellipse cx="${R2(p[0])}" cy="${R2(p[1])}" rx="${R2(0.035 * k)}" ry="${R2(0.05 * k)}" fill="#ffe6b8"/>`; };
    // ----- the things in the scene: each is a function drawing it, and a point to sort it by -----
    const ITEMS = [];
    const item = (X, Y, Z, draw) => ITEMS.push({ X, Y, Z, draw });
    // a rail run along X at depth Z (top rail, bottom rail, balusters, posts, a string of lights), in ~1 m pieces
    const railX = (x0, x1, z, lights) => {
      const n = Math.max(1, Math.round(x1 - x0));
      for (let i = 0; i < n; i++) {
        const a = lerp(x0, x1, i / n), b = lerp(x0, x1, (i + 1) / n);
        item((a + b) / 2, FLOOR + 0.5, z, () => {
          let h = face([[a, URT - 0.07, z], [b, URT - 0.07, z], [b, URT + 0.02, z], [a, URT + 0.02, z]], RL) + face([[a, URT + 0.02, z - 0.07], [b, URT + 0.02, z - 0.07], [b, URT + 0.02, z + 0.02], [a, URT + 0.02, z + 0.02]], RH);
          h += face([[a, FLOOR + 0.06, z], [b, FLOOR + 0.06, z], [b, FLOOR + 0.13, z], [a, FLOOR + 0.13, z]], RD) + face([[a, FLOOR - 0.28, z], [b, FLOOR - 0.28, z], [b, FLOOR, z], [a, FLOOR, z]], '#5a4c3f');
          for (let x = a + 0.07; x < b; x += 0.14) h += face([[x, FLOOR + 0.12, z], [x + 0.04, FLOOR + 0.12, z], [x + 0.04, URT - 0.07, z], [x, URT - 0.07, z]], RL);
          if (i % 2 === 0) h += box(a - 0.05, SHELF - 0.2, z - 0.05, a + 0.05, URT + 0.06, z + 0.05, RL, RD);
          if (lights) { let w = `M`; for (let k = 0; k <= 6; k++) { const x = lerp(a, b, k / 6), sag = Math.sin((k / 6) * Math.PI) * 0.16, p = proj(tr3(x, URT - 0.1 - sag, z + 0.03)); if (tr3(x, URT - 0.1 - sag, z + 0.03)[2] < NEAR) { w = ''; break; } w += (k ? ' L' : '') + cl(p[0], p[1]); } if (w) h += `<path fill="none" stroke="#1d1a18" stroke-width="1.6" d="${w}"/>`; h += bulb((a + b) / 2, URT - 0.3, z + 0.03); }
          return h;
        });
      }
    };
    railX(-6.6, 6.8, UDZ, true); // the front deck
    railX(SDX0, SDX1, SDZ, true); // the cat's deck, its lake rail
    // the side-deck stairs, one item per step (tread and riser), with the lake-side handrail and its lights
    for (let i = 0; i < SSN; i++) {
      const xa = SSX0 + i * SRUN, xb = xa + SRUN, y = FLOOR - (i + 1) * SRISE;
      item((xa + xb) / 2, y, (SSZ0 + SSZ1) / 2, () => face([[xa, y + SRISE, SSZ0], [xa, y + SRISE, SSZ1], [xa, y, SSZ1], [xa, y, SSZ0]], '#473c32') + face([[xa, y, SSZ0], [xb, y, SSZ0], [xb, y, SSZ1], [xa, y, SSZ1]], i % 2 ? '#7a6a58' : '#716251') + face([[xa, y + 0.004, SSZ0], [xa + 0.03, y + 0.004, SSZ0], [xa + 0.03, y + 0.004, SSZ1], [xa, y + 0.004, SSZ1]], '#9b8f84', 'opacity=".5"'));
    }
    for (let i = 0; i < 3; i++) {
      const a = lerp(SSX0, SSX1, i / 3), b = lerp(SSX0, SSX1, (i + 1) / 3), z = SSZ1 + 0.05, ta = stairY(a) + 0.95, tb = stairY(b) + 0.95;
      item((a + b) / 2, (ta + tb) / 2, z, () => {
        let h = face([[a, ta - 0.02, z], [b, tb - 0.02, z], [b, tb + 0.06, z], [a, ta + 0.06, z]], RL) + face([[a, stairY(a) - 0.04, z], [b, stairY(b) - 0.04, z], [b, stairY(b) - 0.22, z], [a, stairY(a) - 0.22, z]], '#54473b');
        for (let x = a + 0.1; x < b; x += 0.16) h += face([[x, stairY(x), z], [x + 0.04, stairY(x), z], [x + 0.04, stairY(x) + 0.93, z], [x, stairY(x) + 0.93, z]], RL);
        h += box(b - 0.05, stairY(b) - 0.2, z - 0.05, b + 0.05, tb + 0.08, z + 0.05, RL, RD) + bulb((a + b) / 2, (ta + tb) / 2 - 0.28, z + 0.02);
        return h;
      });
    }
    // the cat, still on its rail as we leave; the bear on its stump by the wall at the top of the stairs
    const CATSVG = `<g transform="scale(0.42)"><path fill="#121014" d="M-40 0 L-38 -40 Q-40 -62 -34 -72 Q-44 -76 -50 -84 Q-58 -86 -60 -92 Q-58 -99 -52 -103 L-48 -118 L-38 -106 Q-32 -108 -28 -108 L-22 -120 L-20 -100 Q-18 -90 -16 -84 Q-4 -76 10 -60 Q30 -40 38 -20 Q44 -8 44 0Z"/><path fill="none" stroke="#121014" stroke-width="7" stroke-linecap="round" d="M38 -4 Q58 -8 62 -26 Q66 -44 56 -54 Q50 -60 56 -64"/></g>`;
    item(-8.3, URT, SDZ, () => card(-8.3, URT + 0.02, SDZ, CATSVG));
    const BEARSVG = `<g transform="scale(0.34)"><path fill="#7d5a3a" d="M-86 0 L-86 -110 L86 -110 L86 0Z"/><ellipse cx="0" cy="-110" rx="86" ry="18" fill="#a17a52"/><path fill="#171516" d="M-54 -112 L-46 -180 Q-64 -230 -58 -280 Q-54 -320 -30 -346 Q-40 -360 -38 -372 Q-52 -382 -50 -392 L-40 -410 Q-30 -426 -8 -428 L2 -444 L14 -432 Q28 -426 34 -410 Q44 -396 40 -372 Q60 -340 62 -290 Q66 -240 50 -180 L58 -112Z"/></g>`;
    item(-7.05, FLOOR, 1.2, () => card(-7.05, FLOOR, 1.2, BEARSVG));
    // on the shelf: the inukshuk at the foot of the stairs, then red, brown, blue and green chairs toward the far end
    const INUK = inukshukSVG(); item(-3.9, SHELF + 0.8, 4.75, () => card(-3.9, SHELF, 4.75, INUK));
    [[-3.0, '#b8302c'], [-2.1, '#6b4a36'], [-1.2, '#3b78b8'], [-0.3, '#4f9a5a']].forEach(([x, col]) => { const sv = `<g transform="scale(0.9)">${muskokaSVG(col)}</g>`; item(x, SHELF + 0.4, 3.9, () => card(x, SHELF, 3.9, sv)); });
    // the two sitting in the brown and blue chairs: from behind, only heads and shoulders above the chair backs
    [[-2.1, { top: '#e9e4d6', hair: '#7a5a3c', long: true, skin: '#e6bf9c', lean: 4 }], [-1.2, { top: '#7a8f4e', hair: '#d9b45a', lean: -4 }]].forEach(([x, o]) => { const sv = `<g transform="scale(0.9)">${sitterSVG(Object.assign({ view: 'back' }, o))}</g>`; item(x, SHELF + 0.45, 3.95, () => card(x, SHELF, 3.95, sv)); });
    // the stone steps down the rock at the far end, with their wooden handrail on posts
    { const n = 18, x0 = 5.3, x1 = 6.4; for (let i = 0; i < n; i++) { const y = FLOOR - (i + 1) * (FLOOR - LDY) / n, z0 = UDZ + i * 0.27, z1 = z0 + 0.27; item((x0 + x1) / 2, y, (z0 + z1) / 2, () => face([[x0, y + (FLOOR - LDY) / n, z0], [x1, y + (FLOOR - LDY) / n, z0], [x1, y, z0], [x0, y, z0]], '#4a4845') + face([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], ['#7b7873', '#6e6b67', '#85817b'][i % 3])); }
      for (let k = 0; k < 4; k++) { const za = UDZ + (k / 4) * n * 0.27, zb = UDZ + ((k + 1) / 4) * n * 0.27, ya = FLOOR - (k / 4) * (FLOOR - LDY), yb = FLOOR - ((k + 1) / 4) * (FLOOR - LDY); item(5.24, (ya + yb) / 2 + 0.5, (za + zb) / 2, () => box(5.2, yb - 0.1, zb - 0.04, 5.28, yb + 0.95, zb + 0.04, '#8a6e4e', '#6e573d') + face([[5.24, ya + 0.95, za], [5.24, yb + 0.95, zb], [5.24, yb + 1.02, zb], [5.24, ya + 1.02, za]], '#a0825c') + face([[5.24, ya + 0.5, za], [5.24, yb + 0.5, zb], [5.24, yb + 0.55, zb], [5.24, ya + 0.55, za]], '#8a6e4e')); } }
    // junipers, sumac and goldenrod on the rock; cedars and pines down by the water
    const cedar = (seed, h, w, cols) => { const q = rng(seed); let d = ''; for (let y = -h; y < 0; y += 14) { const t = (y + h) / h, hw = w * (0.2 + 0.8 * Math.pow(t, 0.6)) * (0.75 + q() * 0.5); d += `<path fill="${cols[Math.floor(q() * cols.length)]}" d="${blob((q() - 0.5) * w * 0.2, y, hw, 16 + q() * 10, Math.floor(q() * 1e6), 16, 0.38)}"/>`; } return d; };
    const sumac = (seed) => { const q = rng(seed); let d = ''; for (let k = 0; k < 6; k++) { const a = -1.3 + k * 0.5 + (q() - 0.5) * 0.3, L = 70 + q() * 50, x2 = Math.sin(a) * L, y2 = -Math.cos(a) * L; d += `<path fill="none" stroke="#6a4a36" stroke-width="3" d="M0 0 Q${R2(x2 * 0.3)} ${R2(y2 * 0.7)} ${R2(x2)} ${R2(y2)}"/>`; for (let j = 1; j < 9; j++) { const t = j / 9, px = x2 * t, py = y2 * t - Math.sin(t * 3) * 6; [-1, 1].forEach((sd) => { d += `<ellipse cx="${R2(px + sd * 9 * Math.cos(a))}" cy="${R2(py + sd * 9 * Math.sin(a))}" rx="9" ry="3.6" transform="rotate(${R2(a / D2R + sd * 60)} ${R2(px + sd * 9 * Math.cos(a))} ${R2(py + sd * 9 * Math.sin(a))})" fill="${q() > 0.86 ? '#a8402c' : ['#4f7a36', '#5d8a40', '#46702f'][Math.floor(q() * 3)]}"/>`; }); } } return d; };
    const JUN = `<path fill="#3e5a36" d="${blob(0, -26, 90, 34, 7541, 18, 0.4)}"/><path fill="#4d6a40" d="${blob(10, -40, 60, 22, 7542, 16, 0.4)}"/>`;
    const GOLD = `<path fill="#4e6a38" d="${blob(0, -30, 60, 30, 7543, 16, 0.45)}"/><path fill="#d9c23a" d="${blob(6, -62, 26, 10, 7544, 12, 0.4)}"/><path fill="#e2cc48" d="${blob(-20, -54, 18, 8, 7545, 12, 0.4)}"/>`;
    const rockY = (z) => (z <= SHZ1 ? SHELF : lerp(SHELF, LDY, clamp((z - SHZ1) / (LDZ0 - SHZ1))));
    { const q = rng(7550); for (let i = 0; i < 18; i++) { const X = -12 + q() * 26, Z = SHZ1 + 0.2 + q() * 2.6; if (X > 4.8 && X < 6.8) continue; const kind = i % 3, sv = kind === 0 ? JUN : kind === 1 ? `<g transform="scale(${R2(0.8 + q() * 0.5)})">${sumac(7600 + i)}</g>` : GOLD; item(X, rockY(Z), Z, () => card(X, rockY(Z), Z, sv)); } }
    [[-6.2, 0.8, 12.8, 7531, 640], [6.9, 0.8, 13.4, 7532, 600], [-8.3, 2.6, 7.6, 7533, 700], [9.0, 2.4, 8.4, 7534, 720], [-11.5, 4.0, 3.4, 7535, 900], [-10.7, 3.6, 5.6, 7536, 760], [8.4, 0.4, 16.8, 7537, 520], [-7.4, 0.4, 17.2, 7538, 560]].forEach(([X, Y, Z, sd, h]) => { const sv = cedar(sd, h, 110, ['#3b463e', '#45513f', '#34403a', '#4d5a47']); item(X, Y + h / 250, Z, () => card(X, Y, Z, sv)); });
    // the lake deck's glass rail (front and sides) in pieces
    for (let x = LDX0; x < LDX1 - 0.01; x += 1.0) { const a = x, b = Math.min(LDX1, x + 1.0); item((a + b) / 2, LDY + 0.5, LDZ1, () => face([[a, LDY, LDZ1], [b, LDY, LDZ1], [b, LDY + 0.98, LDZ1], [a, LDY + 0.98, LDZ1]], '#c9ccd0', 'opacity=".35"') + face([[a, LDY + 0.96, LDZ1], [b, LDY + 0.96, LDZ1], [b, LDY + 1.03, LDZ1], [a, LDY + 1.03, LDZ1]], '#a47a52') + box(a - 0.035, LDY, LDZ1 - 0.035, a + 0.035, LDY + 1.03, LDZ1 + 0.035, '#94704c', '#7a5c3e')); }
    [LDX0, LDX1].forEach((X) => { for (let z = LDZ0 + 1; z < LDZ1 - 0.01; z += 1.2) { const a = z, b = Math.min(LDZ1, z + 1.2); item(X, LDY + 0.5, (a + b) / 2, () => face([[X, LDY, a], [X, LDY, b], [X, LDY + 0.98, b], [X, LDY + 0.98, a]], '#c9ccd0', 'opacity=".3"') + face([[X, LDY + 0.96, a], [X, LDY + 0.96, b], [X, LDY + 1.03, b], [X, LDY + 1.03, a]], '#a47a52')); } });
    // lichen and moss on the granite (flat patches), reflections on the lake
    const PATCH = []; { const q = rng(7560); for (let i = 0; i < 46; i++) { const Z = 3.1 + q() * 4.6, X = -12 + q() * 24; if (Z > SHZ1 + 0.1 && Z < LDZ0 && X > LDX0 - 0.3 && X < LDX1 + 0.3 && Z > LDZ0 - 0.2) continue; if (Z < UDZ + 0.1 && X > -6.6) continue; PATCH.push({ X, Z, w: 0.12 + q() * (i % 4 === 3 ? 0.7 : 0.3), col: ['#8f927f', '#a6a894', '#5f6f3c', '#556a34', '#b3b5a0'][i % 5] }); } }
    const REFL = []; { const q = rng(7590); for (let i = 0; i < 40; i++) REFL.push({ X: (q() - 0.5) * 60, Z: 18 + q() * 60, w: 1.5 + q() * 5, h: 0.12 + q() * 0.3, col: ['#efd9c6', '#f4e2c8', '#a9aec2', '#c9c3d2', '#f0cdb4'][Math.floor(q() * 5)], o: 0.35 + q() * 0.35 }); }
    const sdad = makePersonBack(stPpl, { top: '#4c6fa4', shorts: '#1b1c20', skin: '#dfae8c', hair: '#6b6258', bald: 0, shoe: '#e6e3dd' });
    const sson = makePersonBack(stPpl, { top: '#243049', shorts: '#15161a', skin: '#e2b18e', hair: '#6a4a30', shoe: '#2a2b30' });
    const sdil = makePersonBack(stPpl, { top: '#f1efe9', shorts: '#e7e6b8', skin: '#e6bf9c', hair: '#1c1714', pony: true, shoe: '#f0eee8' });
    // the two chairs in front of them (same cut-outs as the dusk scene's deck)
    const chRed = svgEl('g'), chFold = svgEl('g'); stPpl.appendChild(chRed); stPpl.appendChild(chFold);
    chRed.innerHTML = `<path fill="#b8302c" d="M-60 -10 L40 -18 L50 20 L-50 30Z"/><path fill="#c8403a" d="M-40 -80 L20 -86 L30 -20 L-36 -14Z"/><path fill="#8a2420" d="M-66 -34 L-40 -36 L-40 30 L-60 32Z"/><path fill="#8a2420" d="M34 -40 L58 -42 L56 22 L40 22Z"/><path fill="#9a2a26" d="M-70 -40 L-36 -42 L-36 -34 L-70 -32Z"/>`;
    chFold.innerHTML = `<path fill="none" stroke="#2a2a2e" stroke-width="5" d="M-40 60 L0 -70 M40 60 L10 -20 M-40 -10 L50 -20"/><path fill="#7a7c84" d="M-6 -86 L46 -80 L40 -10 L-20 -16Z"/><path fill="#60626a" d="M-40 -14 L50 -22 L56 -6 L-36 2Z"/>`;
    // where the dusk scene's first frame has them (screen x, y, scale) — the walk settles exactly onto these
    // S8 eases its first 46 frames in from a slightly wider view (see S8's lead-in), so the targets it is matched to follow that
    const leadK = (f) => 1 - 0.07 * (1 - E.outSine(seg(f - 300, -20, 30)));
    const tAt = (T, f) => { const k = leadK(f); return [960 + (T[0] - 960) * k, 540 + (T[1] - 540) * k, T[2] * k]; };
    const S8AT = [[553, 807, 2.257], [914, 785, 2.301], [1320.5, 771, 2.144], [463, 1033, 2.257], [1072, 1055, 1.918]];
    const PPL = [[sdad, -1.55, 15.35, 1.0], [sson, -0.17, 15.1, 1.02], [sdil, 1.37, 14.85, 0.95]];
    const SKY3 = grad(defs, [[0, '#b9b6c8'], [0.7, '#d8c8c8'], [1, '#e6d0c6']]), LAKE3 = grad(defs, [[0, '#d8c8c8'], [0.3, '#c7bfc7'], [1, '#8f98ab']]);
    const ridge = ridgeFn(7570, 0, 1);
    const glassLit = '#f2c98a', SID = '#3a4658';
    function stairSVG(f) {
      let bk = '';
      // sky, the far shore all round (drawn by bearing, so it turns with us), the lake
      const hz = 540 - FS * Math.tan(cam3.pitch);
      bk += `<rect x="-200" y="-400" width="2400" height="${R2(hz + 400)}" fill="${SKY3}"/><rect x="-200" y="${R2(hz)}" width="2400" height="1600" fill="${LAKE3}"/>`;
      let sh = `M-200 ${R2(hz + 4)}`;
      for (let px = -200; px <= 2120; px += 16) { const th = cam3.yaw + Math.atan((px - 960) / FS), hgt = 14 + 12 * (0.5 + 0.5 * Math.sin(th * 7.3)) + 10 * Math.abs(Math.sin(th * 23.1 + 1)) + (Math.floor(th * 40) % 3 === 0 ? 10 : 0); sh += ` L${px} ${R2(hz - hgt)}`; }
      bk += `<path fill="#8b9393" opacity=".85" d="${sh} L2120 ${R2(hz + 4)}Z"/><rect x="-200" y="${R2(hz - 3)}" width="2400" height="7" fill="#737e7d"/>`;
      REFL.forEach((e, i) => { bk += face([[e.X - e.w, 0, e.Z - e.h], [e.X + e.w, 0, e.Z - e.h], [e.X + e.w, 0, e.Z + e.h], [e.X - e.w, 0, e.Z + e.h]], e.col, `opacity="${R2(e.o * (0.8 + 0.2 * Math.sin(f * 0.05 + i)))}"`); });
      // the cottage front: siding, the lit windows, the eave; the lattice under the floor
      bk += face([[-6.4, FLOOR, 0], [6.6, FLOOR, 0], [6.6, 8.95, 0], [-6.4, 8.95, 0]], SID) + face([[-6.4, SHELF - 0.2, 0], [6.6, SHELF - 0.2, 0], [6.6, FLOOR, 0], [-6.4, FLOOR, 0]], '#26282c');
      [[4.95, 6.05, 6.7, 8.05], [-2.2, 2.4, 6.57, 8.25], [-4.95, -2.9, 6.7, 8.1]].forEach(([a, b, y0, y1]) => { bk += face([[a - 0.1, y0 - 0.12, 0.01], [b + 0.1, y0 - 0.12, 0.01], [b + 0.1, y1 + 0.1, 0.01], [a - 0.1, y1 + 0.1, 0.01]], '#dcd8d4') + face([[a, y0, 0.02], [b, y0, 0.02], [b, y1, 0.02], [a, y1, 0.02]], glassLit); });
      bk += face([[-6.9, 8.85, 0], [7.1, 8.85, 0], [7.1, 8.85, 0.7], [-6.9, 8.85, 0.7]], '#dcd8d4');
      // the wing behind the cat's deck (its screened porch)
      bk += face([[-9.6, FLOOR, -0.3], [-6.4, FLOOR, -0.3], [-6.4, 8.5, -0.3], [-9.6, 8.5, -0.3]], '#303b4b') + face([[-9.4, 6.2, -0.28], [-6.7, 6.2, -0.28], [-6.7, 8.0, -0.28], [-9.4, 8.0, -0.28]], '#2a2f38');
      // rock beside and below the lake deck, down to the water
      bk += face([[-16, LDY, LDZ0], [LDX0, LDY, LDZ0], [LDX0, 0, 14.8], [-16, 0, 13.6]], '#55524e') + face([[LDX1, LDY, LDZ0], [16, LDY, LDZ0], [16, 0, 13.2], [LDX1, 0, 14.6]], '#57544f');
      // the lake deck floor
      bk += face([[LDX0, LDY, LDZ0], [LDX1, LDY, LDZ0], [LDX1, LDY, LDZ1], [LDX0, LDY, LDZ1]], '#9a8a72');
      for (let i = 1; i < 32; i++) { const z = LDZ0 + i * 0.25; bk += face([[LDX0, LDY + 0.001, z], [LDX1, LDY + 0.001, z], [LDX1, LDY + 0.001, z + 0.022], [LDX0, LDY + 0.001, z + 0.022]], '#7a6c58'); }
      // the granite: the slope from the shelf down to the deck, then the shelf, with lichen and moss
      bk += face([[-16, SHELF, SHZ1], [16, SHELF, SHZ1], [16, LDY, LDZ0], [-16, LDY, LDZ0]], '#5f5c58');
      bk += face([[-16, SHELF, UDZ], [16, SHELF, UDZ], [16, SHELF, SHZ1], [-16, SHELF, SHZ1]], '#686561');
      PATCH.forEach((e) => { const y = rockY(e.Z) + 0.003; bk += face([[e.X - e.w, y, e.Z - e.w * 0.5], [e.X + e.w, y, e.Z - e.w * 0.4], [e.X + e.w * 0.8, rockY(e.Z + e.w * 0.5) + 0.003, e.Z + e.w * 0.5], [e.X - e.w * 0.7, rockY(e.Z + e.w * 0.4) + 0.003, e.Z + e.w * 0.4]], e.col, 'opacity=".85"'); });
      // the decks: the front deck (and its underside edge), the cat's deck
      bk += face([[-6.6, FLOOR, 0], [6.8, FLOOR, 0], [6.8, FLOOR, UDZ], [-6.6, FLOOR, UDZ]], '#5d5146');
      bk += face([[SDX0, FLOOR, -0.3], [SDX1, FLOOR, -0.3], [SDX1, FLOOR, SDZ], [SDX0, FLOOR, SDZ]], '#5d5146');
      for (let i = 1; i < 12; i++) { const x = SDX0 + i * 0.3; bk += face([[x, FLOOR + 0.001, -0.3], [x + 0.02, FLOOR + 0.001, -0.3], [x + 0.02, FLOOR + 0.001, SDZ], [x, FLOOR + 0.001, SDZ]], '#4e443a'); }
      // everything that stands up, far to near; what is behind the three goes under them, the rest over them
      const dP = depth(0, LDY + 0.9, 15.1);
      const its = ITEMS.map((e) => ({ e, d: depth(e.X, e.Y, e.Z) })).filter((o) => o.d > NEAR - 1.5).sort((a, b) => b.d - a.d);
      let fr = '';
      its.forEach((o) => { const h = o.e.draw(); if (o.d > dP) bk += h; else fr += h; });
      stBack.innerHTML = bk; stFront.innerHTML = fr;
      // the three at the rail, where the next scene finds them
      const breathe = Math.sin(f * 0.07);
      const m = E.inOutSine(seg(f, 256, 280));
      PPL.forEach(([rig, X, Z, hs], i) => {
        const pose = [{ alA: -8, arA: -8, lean: -1 + breathe * 0.4 }, { alA: -6, arA: -6, lean: 0.6 * breathe }, { alA: 18, arA: 26 }][i];
        const q = tr3(X, LDY, Z); if (q[2] < 0.3) { rig.set(Object.assign({ x: -999, y: -999, s: 0.01 }, pose)); return; }
        const sp = proj(q), sc = (FS / q[2] / 120) * hs, T = tAt(S8AT[i], f);
        rig.set(Object.assign({ x: lerp(sp[0], T[0], m), y: lerp(sp[1], T[1], m), s: lerp(sc, T[2], m) }, pose));
      });
      [[chRed, -1.9, 13.8, 3], [chFold, 0.45, 13.7, 4]].forEach(([g, X, Z, i]) => {
        const q = tr3(X, LDY, Z); if (q[2] < 0.3) { g.style.display = 'none'; return; } g.style.display = '';
        const sp = proj(q), sc = FS / q[2] / 120 * (i === 4 ? 0.85 : 1), T = tAt(S8AT[i], f);
        g.setAttribute('transform', `translate(${cl(lerp(sp[0], T[0], m), lerp(sp[1], T[1], m))}) scale(${R2(lerp(sc, T[2], m) * 1000) / 1000})`);
      });
    }
    // the walk: keys in local frames (position, heading and tilt), a smooth Hermite path through them
    const KEYS = [
      [162, -7.9, 7.15, 3.3, 0.72, 0.4],    // on the cat's deck by the corner, turning right to the stairs
      [182, -7.35, 7.15, 3.66, 1.2, 0.66],  // at the head of the stairs, looking down the flight
      [204, -6.1, 6.62, 3.72, 1.1, 0.56],   // on the way down: the inukshuk and the row of chairs ahead on the shelf
      [224, -5.1, 5.95, 3.98, 0.8, 0.36],   // at the foot, turning back toward the lake
      [240, -5.25, 5.95, 5.8, 0.38, 0.36],  // at the edge of the shelf, the inukshuk and the chairs going by on the right
      [258, -2.6, 5.05, 8.6, 0.12, 0.42],   // gliding down over the rock, the three below
      [273, -0.42, 4.54, 11.4, 0.014, 0.38],
      [300, 0, 4.45, 11.9, 0, 0.37],        // behind the three, still gliding in as the dusk scene takes over (no stop)
    ];
    const camPath = (f) => {
      const n = KEYS.length; if (f <= KEYS[0][0]) f = KEYS[0][0]; if (f >= KEYS[n - 1][0]) f = KEYS[n - 1][0];
      let i = 0; while (i < n - 2 && f > KEYS[i + 1][0]) i++;
      const k0 = KEYS[Math.max(0, i - 1)], k1 = KEYS[i], k2 = KEYS[i + 1], k3 = KEYS[Math.min(n - 1, i + 2)], h = k2[0] - k1[0], t = (f - k1[0]) / h;
      const tan = (a, b, c, j, end) => (end ? b[j] - a[j] : ((c[j] - a[j]) / (c[0] - a[0])) * h);
      const out = [];
      for (let j = 1; j <= 5; j++) {
        const m1 = tan(k0, k1, k2, j, i === 0), m2 = tan(k1, k2, k3, j, i + 1 === n - 1);
        const t2 = t * t, t3 = t2 * t;
        out.push((2 * t3 - 3 * t2 + 1) * k1[j] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * k2[j] + (t3 - t2) * m2);
      }
      return { x: out[0], y: out[1], z: out[2], yaw: out[3], pitch: out[4] };
    };

    // ---- camera ----
    const FOC0 = [960, 540], CAT = [CX, CY - 52], CORNER = [1380, 640], DOWN = [1640, 880];
    function camAt(f) {
      const kin = E.inOutCubic(seg(f, 30, 90)), dive = E.inCubic(seg(f, 156, 186));
      let fx = lerp(FOC0[0], CAT[0], kin), fy = lerp(FOC0[1], CAT[1], kin), s = lerp(1.0, 3.1, kin) * (1 + 0.015 * E.inOutSine(seg(f, 90, 120)));
      if (f > 120) {
        // along the rail to the corner post (easing out a little to show it), then tip down the stair rail and dive in
        const a = E.inOutSine(seg(f, 120, 152)), b = E.inOutSine(seg(f, 144, 176));
        fx = lerp(lerp(CAT[0], CORNER[0], a), DOWN[0], b); fy = lerp(lerp(CAT[1], CORNER[1], a), DOWN[1], b);
        s = lerp(lerp(3.1 * 1.015, 2.4, a), 3.0, b) * (1 + dive * 2.4);
      }
      return { fx, fy, s };
    }
    const DEP = ['sky', 'far', 'lake', 'mid', 'pine', 'eave', 'rail', 'deck', 'bear'];
    // rain easing off, drips from the eave and the boughs, rings in the puddles
    const DRIPS = [[1712, 90, 12], [1790, 84, 44], [1860, 80, 71], [620, 330, 26], [980, 300, 58], [1240, 260, 96], [700, 380, 132], [1880, 76, 118], [1740, 88, 160]];
    function update(f) {
      const c = camAt(f);
      DEP.forEach((n) => { const s = Math.pow(c.s, K[n]); L[n].setAttribute('transform', `translate(960 540) scale(${R2(s * 1000) / 1000}) translate(${R2(-c.fx)} ${R2(-c.fy)})`); });
      rps.forEach((e) => e.setAttribute('opacity', R2(0.25 + 0.2 * Math.sin(f * 0.06 + +e.dataset.p * 1.7))));
      // puddle rings where drops land on the boards
      let rg = '';
      for (let i = 0; i < 18; i++) { const q = rng(7700 + i), per = 26 + q() * 30, t0 = q() * per, age = ((f + t0) % per) / per, x = q() * 1700, y = 940 + q() * 130; const fade = 1 - seg(f, 90, 200) * 0.7; rg += `<ellipse cx="${R2(x)}" cy="${R2(y)}" rx="${R2(4 + age * 26)}" ry="${R2(1.2 + age * 6)}" fill="none" stroke="#c9c7cf" stroke-width="1.4" opacity="${R2((1 - age) * 0.5 * fade)}"/>`; }
      rings.innerHTML = rg;
      // the stairs take over from the photo view
      const k = E.inOutSine(seg(f, 162, 188));
      view.style.display = k >= 1 ? 'none' : '';
      view.style.filter = f > 160 ? `blur(${R2(k * 10)}px)` : 'none';
      stairs.style.display = k <= 0 ? 'none' : '';
      if (k > 0) {
        // down the side stairs, past the inukshuk and the chairs, down over the rock to behind the three at the rail
        const p = camPath(f), step = (1 - seg(f, 226, 246)) * seg(f, 176, 186);
        cam3 = { x: p.x, y: p.y + 0.012 * Math.sin(f * 0.42) * step, z: p.z, yaw: p.yaw, pitch: p.pitch };
        stairSVG(f);
        stairs.style.opacity = R2(k);
        stairs.style.filter = k < 1 ? `blur(${R2((1 - k) * 12)}px)` : 'none';
      }
    }
    function fx(ctx, f) {
      // fine rain, thinning out; streaks are near the lens so they ignore the camera
      const dens = (1 - seg(f, 0, 162)) * 0.85 + 0.15 * (1 - seg(f, 162, 188));
      const n = Math.round(160 * dens);
      ctx.strokeStyle = '#e8e6ee'; ctx.lineWidth = 1.2;
      for (let i = 0; i < n; i++) { const q = rng(7800 + i), sp = 38 + q() * 30, x = ((q() * 2200 + f * 7) % 2200) - 140, y = ((q() * 1200 + f * sp) % 1200) - 60, l = 18 + q() * 22; ctx.globalAlpha = 0.18 + q() * 0.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - l * 0.18, y - l); ctx.stroke(); }
      ctx.globalAlpha = 1;
      // drops falling from the eave and the boughs (world space, so they follow the camera)
      if (f < 178) {
        const c = camAt(f);
        DRIPS.forEach(([x, y, t0]) => {
          const per = 64, a = ((f - t0) % per + per) % per; if (a > 24) return;
          const k = 1, wy = y + 0.5 * 2.2 * a * a, dep = x > 1600 ? K.eave : K.pine, s = Math.pow(c.s, dep);
          const sx = 960 + (x - c.fx) * s, sy = 540 + (wy - c.fy) * s;
          ctx.fillStyle = '#eef0f4'; ctx.globalAlpha = 0.7 * k; ctx.beginPath(); ctx.ellipse(sx, sy, 1.6 * s, 3.4 * s, 0, 0, 6.283); ctx.fill();
        });
        // a drop gathers under the cat's chin and falls
        const a = f - 96;
        if (a > 0 && a < 30) {
          const s = c.s, gy = a < 12 ? 0 : 0.5 * 1.1 * (a - 12) * (a - 12), sz = a < 12 ? 1 + a / 12 : 2;
          const sx = 960 + (CX - 50 - c.fx) * s, sy = 540 + (CY - 74 + gy - c.fy) * s;
          ctx.fillStyle = '#e9edf3'; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.ellipse(sx, sy, 1.3 * sz * s * 0.6, 1.8 * sz * s * 0.6, 0, 0, 6.283); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }
    return { a: 1400, b: 1700, update, fx, camAt, KEYS };
  })();
};
