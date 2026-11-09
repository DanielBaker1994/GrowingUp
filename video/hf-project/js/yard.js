/* yard.js — the Kahshe Lake backyard, built three times in three lights: S2 (2004), S6 (2014), S7 (2023) */
function buildYard(svgId, L) {
  const svg = $(svgId), defs = svgEl('defs'); svg.appendChild(defs);
  const cam = svgEl('g'); svg.appendChild(cam);
  const lay = {};
  const layer = (n, html = '') => { const g = svgEl('g', {}, html); cam.appendChild(g); lay[n] = g; return g; };
  const ins = (g, h) => g.insertAdjacentHTML('beforeend', h);
  // sky
  const sky = layer('sky', `<rect x="-800" y="-500" width="3600" height="1100" fill="${grad(defs, L.sky)}"/>`);
  ins(sky, `<ellipse cx="${L.sunX}" cy="${L.sunY}" rx="1000" ry="620" fill="${radial(defs, [[0, L.sunGlow, 0.9], [0.3, L.sunGlow, 0.35], [1, L.sunGlow, 0]])}"/>`);
  ins(sky, `<circle cx="${L.sunX}" cy="${L.sunY}" r="${L.sunR}" fill="${L.sunCore}" opacity=".95"/>`);
  const cloud = (cx, cy, w, col, op, seed) => { const r = rng(seed); let d = ''; for (let i = 0; i < 5; i++) d += blob(cx + (r() - 0.5) * w, cy + (r() - 0.5) * 18, w * (0.18 + r() * 0.16), 16 + r() * 22, seed * 7 + i, 18, 0.12); return `<path d="${d}" fill="${col}" opacity="${op}"/>`; };
  ins(sky, L.clouds.map((c, i) => cloud(c[0], c[1], c[2], L.cloudCol, c[3], 30 + i)).join(''));
  // far hills
  const far = layer('far'), fFn = ridgeFn(L.seed + 1, 470, 34);
  ins(far, `<path d="${ridgePath(fFn, L.seed + 1)}" fill="${grad(defs, [[0, L.far], [1, mix(L.far, L.skyHaze, 0.55)]])}"/>`);
  ins(far, `<path d="${forest(fFn, -300, 2300, 20, 34, 70, L.seed + 2)}" fill="${L.farForest}"/>`);
  // lake
  const lake = layer('lake');
  ins(lake, `<rect x="-900" y="474" width="3800" height="210" fill="${grad(defs, L.lake)}"/>`);
  const rl = rng(L.seed + 5); let gl = '';
  for (let i = 0; i < 46; i++) { const t = Math.pow(rl(), 1.4), y = 482 + t * 190, x = L.sunX + (rl() - 0.5) * (260 + t * 700); gl += `<rect class="gl" x="${R2(x)}" y="${R2(y)}" width="${R2(12 + rl() * 50 + t * 40)}" height="${R2(1.6 + t * 2)}" rx="1" fill="${L.glint}" opacity="${R2(0.25 + rl() * 0.4)}" data-p="${R2(rl() * 6.28)}"/>`; }
  ins(lake, gl);
  ins(lake, `<path d="${blob(1500, 480, 130, 10, L.seed + 9, 16, 0.2)}" fill="${mix(L.far, '#000000', 0.15)}"/>`);
  // mid shore + pines
  const mid = layer('mid'), mFn = ridgeFn(L.seed + 11, 662, 22);
  ins(mid, `<path d="${forest(mFn, -300, 2300, 30, 60, 120, L.seed + 12, 6)}" fill="${L.midForest}"/>`);
  ins(mid, `<path d="${ridgePath(mFn, L.seed + 11, -300, 2300, 12, 1.4)}" fill="${L.mid}"/>`);
  // lawn
  const lawn = layer('lawn');
  ins(lawn, `<rect x="-900" y="668" width="3800" height="700" fill="${grad(defs, L.lawn)}"/>`);
  const rw = rng(L.seed + 21); let pt = '';
  for (let i = 0; i < 40; i++) { const t = Math.pow(rw(), 1.3), y = 690 + t * 380; pt += `<path d="${blob(rw() * 3400 - 700, y, 90 + t * 260, 5 + t * 18, L.seed + 300 + i, 14, 0.2)}" fill="${rw() > 0.5 ? L.lawnLite : L.lawnDark}" opacity="${R2(0.16 + rw() * 0.16)}"/>`; }
  ins(lawn, pt);
  // shadows raking across the lawn
  ins(lawn, `<path d="M-300 800 L1900 770 L1990 830 L-300 860Z" fill="${L.shadow}" opacity="0"/>`);
  // cottage (right of centre)
  const cot = layer('cot');
  const wnd = (x, y, w, h, id) => `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" fill="#efe6d2"/><rect id="${id}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${L.win}"/><rect x="${x + w / 2 - 1}" y="${y}" width="2" height="${h}" fill="#efe6d2"/><rect x="${x}" y="${y + h / 2 - 1}" width="${w}" height="2" fill="#efe6d2"/>`;
  let logs = ''; for (let y = 640; y < 770; y += 14) logs += `<line x1="1110" x2="1740" y1="${y}" y2="${y}" stroke="${mix(L.house, '#000000', 0.28)}" stroke-width="2.4" opacity=".7"/>`;
  cot.innerHTML =
    `<ellipse cx="1420" cy="784" rx="380" ry="16" fill="#000" opacity=".22"/>` +
    `<path d="M1660 520 L1660 650 L1700 650 L1700 500Z" fill="#8c8479"/>` + // chimney
    `<rect x="1100" y="626" width="650" height="150" fill="${L.house}"/>${logs}` +
    `<path d="M1040 636 L1424 470 L1808 636Z" fill="${L.roof}"/><path d="M1040 636 L1424 470 L1424 484 L1062 636Z" fill="${mix(L.roof, '#ffffff', 0.18)}"/>` +
    `<path d="M1424 530 L1424 626" stroke="${mix(L.house, '#000', 0.4)}" stroke-width="3"/>` +
    wnd(1150, 660, 74, 70, 'yw1') + wnd(1264, 660, 74, 70, 'yw2') + wnd(1490, 660, 90, 70, 'yw3') + wnd(1620, 660, 74, 70, 'yw4') +
    `<rect x="1380" y="672" width="56" height="104" fill="${mix(L.house, '#000', 0.5)}"/><rect x="1380" y="672" width="56" height="104" fill="none" stroke="#efe6d2" stroke-width="4"/>` +
    `<rect x="1080" y="770" width="700" height="14" fill="#7a6a58"/><rect x="1060" y="784" width="740" height="10" fill="#5a4a3c"/>` +
    ``;
  // lit windows glow
  const wg = radial(defs, [[0, L.winGlow, 0.9], [1, L.winGlow, 0]]);
  ins(cot, [1187, 1301, 1535, 1657].map((x, i) => `<ellipse class="wg" cx="${x}" cy="695" rx="90" ry="70" fill="${wg}" opacity="0"/>`).join(''));
  // dock + canoe on the water (small) for place
  const acc = layer('acc');
  acc.innerHTML =
    ``+
    // adirondack chairs
    [[1000, 880, 1], [1090, 892, 1]].map(([x, y, f], k) => `<g transform="translate(${x} ${y}) scale(${1.15})"><path d="M-22 -40 L-34 -110 L6 -104 L14 -40Z" fill="${k ? '#3a6f9f' : '#c2452f'}"/><path d="M-30 -40 L40 -40 L46 -32 L-34 -32Z" fill="${k ? '#2f5d88' : '#a23a28'}"/><rect x="-24" y="-32" width="8" height="34" fill="#5a4636"/><rect x="26" y="-32" width="8" height="34" fill="#5a4636"/><ellipse cx="6" cy="1" rx="46" ry="6" fill="#000" opacity=".2"/></g>`).join('');
  // dogs layer
  const act = layer('act');
  // birch stand + foreground leaves
  const fgb = layer('fgb');
  const rb = rng(L.seed + 31); let b = '';
  [[46, 1], [150, 0.8]].forEach(([x, k], i) => {
    const lean = (rb() - 0.5) * 30;
    b += `<g transform="translate(${x} 1080) rotate(${R2(lean / 30)})"><path d="M-16 0 L-11 -1300 L11 -1300 L16 0Z" fill="#e9e3d6"/>` +
      Array.from({ length: 18 }, () => { const y = -rb() * 1200 - 40; return `<path d="M${R2(-16 * k)} ${R2(y)} l${R2(10 + rb() * 22)} 0 l0 ${R2(3 + rb() * 5)} l${R2(-(10 + rb() * 22))} 0Z" fill="#2a2622" opacity=".8"/>`; }).join('') + `</g>`;
  });
  ins(fgb, b);
  const fgl = layer('fgl');
  let lv = ''; const rf = rng(L.seed + 41);
  const tuft = (x, h, seed) => { const r = rng(seed); let d = `M${x - 40} 1130`; for (let i = 0; i < 7; i++) d += ` L${R2(x - 40 + i * 12 + r() * 6)} ${R2(1130 - h * (0.4 + r() * 0.6))} L${R2(x - 34 + i * 12)} 1130`; return d + 'Z'; };
  for (let i = 0; i < 16; i++) lv += `<path d="${tuft(-100 + i * 150 + rf() * 60, 70 + rf() * 90, i + 40)}" fill="${L.fgGrass}"/>`;
  ins(fgl, lv);
  // canopy leaves top-left / top-right framing
  const cn = layer('canopy');
  let cl = '';
  for (let i = 0; i < 22; i++) cl += `<path d="${blob(-140 + rf() * 460, -60 + rf() * 100, 50 + rf() * 70, 30 + rf() * 44, 500 + i, 16, 0.22)}" fill="${L.canopy}" opacity="${R2(0.72 + rf() * 0.28)}"/>`;
  for (let i = 0; i < 14; i++) cl += `<path d="${blob(1560 + rf() * 620, -60 + rf() * 120, 60 + rf() * 90, 36 + rf() * 50, 700 + i, 16, 0.22)}" fill="${L.canopy}" opacity="${R2(0.72 + rf() * 0.28)}"/>`;
  ins(cn, cl);
  // warm overlay to unify the light
  const ov = svgEl('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: L.overlay, 'pointer-events': 'none' }); svg.appendChild(ov);
  const dep = { sky: 0.02, far: 0.1, lake: 0.2, mid: 0.4, lawn: 0.8, cot: 0.85, acc: 0.95, act: 1, fgb: 1.25, fgl: 1.5, canopy: 1.35 };
  const glints = [...lake.querySelectorAll('.gl')];
  const setCam = (c, f) => {
    cam.setAttribute('transform', `translate(960 560) rotate(${c.rot || 0}) scale(${c.s}) translate(${-c.fx} ${-c.fy})`);
    for (const n in dep) if (n !== 'act') lay[n].setAttribute('transform', `translate(${R2((1 - dep[n]) * (c.fx - 960))} ${R2((1 - dep[n]) * (c.fy - 560) * 0.15)})`);
    glints.forEach((g, i) => g.setAttribute('opacity', R2(0.25 + 0.35 * (0.5 + 0.5 * Math.sin(f * 0.11 + +g.dataset.p)))));
  };
  return { svg, act, setCam, lay, wg: [...cot.querySelectorAll('.wg')], win: ['yw1', 'yw2', 'yw3', 'yw4'].map($), L };
}
const YARD_KEEP = { seed: 100 };
const LOOK2 = { seed: 100, sky: [[0, '#5b9bd0'], [0.5, '#a8d0e4'], [0.85, '#ffe0aa'], [1, '#ffd08a']], skyHaze: '#f4dcae', sunX: 520, sunY: 470, sunR: 46, sunCore: '#fff6d0', sunGlow: '#ffd98c', clouds: [[300, 170, 380, 0.7], [1180, 110, 460, 0.55], [1600, 230, 300, 0.6]], cloudCol: '#fff6e4',
  far: '#6f93a6', farForest: '#5a7f8a', lake: [[0, '#f0dcae'], [0.22, '#9cc4d0'], [1, '#4d84a6']], glint: '#fff0c8', mid: '#3f6b4b', midForest: '#2e5a42',
  lawn: [[0, '#b3cd60'], [0.35, '#83b04e'], [1, '#4b8639']], lawnLite: '#c4dc74', lawnDark: '#3f7a34', shadow: '#1d3a2a', house: '#a6683a', roof: '#6b2a22', win: '#6d879a', winGlow: '#ffd27a',
  fgGrass: '#2f5a2c', canopy: '#2f6a34', overlay: 'rgba(255,190,110,0.10)' };
const LOOK6 = { seed: 100, sky: [[0, '#465289'], [0.4, '#b48ca6'], [0.8, '#f4b48c'], [1, '#ffd6a0']], skyHaze: '#ffcfa4', sunX: 1180, sunY: 500, sunR: 40, sunCore: '#ffe9c2', sunGlow: '#ffb48a', clouds: [[500, 200, 500, 0.5], [1300, 150, 420, 0.4]], cloudCol: '#f7b9a2',
  far: '#7a6f95', farForest: '#645b84', lake: [[0, '#f4c8a8'], [0.3, '#9f93b6'], [1, '#4a5a86']], glint: '#ffe2bc', mid: '#465a5a', midForest: '#33484f',
  lawn: [[0, '#aaa864'], [0.4, '#7f9448'], [1, '#4b6a38']], lawnLite: '#c2bd76', lawnDark: '#3b5a32', shadow: '#2a2438', house: '#94603c', roof: '#59292e', win: '#7c7796', winGlow: '#ffc36e',
  fgGrass: '#26402c', canopy: '#3a5a3a', overlay: 'rgba(255,140,110,0.12)' };
const LOOK7 = { seed: 100, sky: [[0, '#79b5e6'], [0.55, '#cfe7ee'], [0.9, '#fff0cf'], [1, '#ffe4b0']], skyHaze: '#fff0cf', sunX: 1180, sunY: 455, sunR: 52, sunCore: '#fffbe6', sunGlow: '#ffe6a6', clouds: [[380, 170, 420, 0.8], [1500, 120, 480, 0.75], [900, 250, 320, 0.6]], cloudCol: '#ffffff',
  far: '#7ba4ae', farForest: '#5c8a8c', lake: [[0, '#f8eed2'], [0.2, '#a8d2de'], [1, '#5c98b6']], glint: '#ffffff', mid: '#3d7550', midForest: '#2a5f45',
  lawn: [[0, '#b9d668'], [0.35, '#88c052'], [1, '#56983f']], lawnLite: '#cfe680', lawnDark: '#45903a', shadow: '#1d3a2a', house: '#a86a3a', roof: '#7a3126', win: '#6f8fa2', winGlow: '#ffe2a0',
  fgGrass: '#2d5f2f', canopy: '#3f8a3c', overlay: 'rgba(255,225,150,0.08)' };

/* ----- shared dog path helpers ----- */
const depthS = (y) => lerp(0.78, 1.36, clamp((y - 720) / 300));
