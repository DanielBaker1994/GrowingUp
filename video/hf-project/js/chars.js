/* chars.js — paper-cut people and dogs. Origin = feet on ground, facing +x. Everything posed by set(). */
const D2R = Math.PI / 180;
const shade = (c, k) => mix(c, k > 0 ? '#ffffff' : '#000000', Math.abs(k));

function makePerson(parent, o) {
  const c = Object.assign(
    { coat: '#c8402e', pants: '#2b3345', skin: '#e6b590', hair: '#5a3d28', hat: null, pom: false, scarf: null, boot: '#241d1a', mitt: '#3b2f2a', kid: 0, bald: false, hood: false },
    o
  );
  const hr = 16 * (1 + c.kid * 0.2), hy = -172 + c.kid * 4;
  const g = svgEl('g');
  const legs = (col, cls) =>
    `<g class="${cls}"><path fill="${col}" d="M-8 -92 L8 -92 L7 -22 L-7 -22Z"/><path fill="${c.boot}" d="M-8 -24 L7 -24 L9 -6 Q17 -6 19 0 L-8 0Z"/></g>`;
  const arm = (col, cls, mit, tool = '') =>
    `<g class="${cls}"><path fill="${col}" d="M-6.5 -146 L6.5 -146 L6 -86 L-6 -86Z"/><circle fill="${mit}" cx="0" cy="-81" r="7.5"/>${tool}</g>`;
  const hairBack = c.bald ? '' : `<circle fill="${c.hair}" cx="-1" cy="${hy - 1}" r="${hr + 1.5}"/>`;
  const hat = c.hat
    ? `<path fill="${c.hat}" d="M${-hr - 3} ${hy - 7} Q1 ${hy - hr - 34} ${hr + 4} ${hy - 7} Z"/>` +
      `<rect fill="${shade(c.hat, -0.22)}" x="${-hr - 4}" y="${hy - 12}" width="${hr * 2 + 8}" height="9" rx="3.5"/>` +
      (c.pom ? `<circle fill="${shade(c.hat, 0.35)}" cx="1" cy="${hy - hr - 25}" r="6.5"/>` : '')
    : (c.bald ? '' : `<path fill="${c.hair}" d="M${-hr - 1} ${hy - 4} Q1 ${hy - hr - 12} ${hr + 3} ${hy - 6} Q${hr - 2} ${hy - 12} ${hr - 8} ${hy - 9} Q${-2} ${hy - 12} ${-hr + 6} ${hy - 3}Z"/>`);
  g.innerHTML =
    `<ellipse class="sh" cx="2" cy="1" rx="36" ry="7" fill="#000" opacity=".2"/>` +
    legs(shade(c.pants, -0.28), 'lf') +
    arm(shade(c.coat, -0.3), 'af', shade(c.mitt, -0.2)) +
    `<g class="bd">` +
    `<path fill="${c.coat}" d="M-23 -150 Q0 -161 23 -150 L29 -80 Q0 -73 -29 -80Z"/>` +
    `<path fill="${shade(c.coat, -0.22)}" d="M-29 -80 Q0 -73 29 -80 L29.5 -70 Q0 -63 -29.5 -70Z"/>` +
    (c.scarf ? `<rect fill="${c.scarf}" x="-13" y="-163" width="28" height="11" rx="5"/>` : '') +
    `</g><g class="hd">${hairBack}<circle fill="${c.skin}" cx="4" cy="${hy + 1}" r="${hr - 1}"/>` +
    `<path fill="${c.skin}" d="M${hr + 1} ${hy} L${hr + 7} ${hy + 5} L${hr + 1} ${hy + 8}Z"/>` +
    `<circle fill="#3a2a22" cx="${hr - 3}" cy="${hy}" r="1.7"/>` +
    hat + `</g>` +
    legs(c.pants, 'ln') +
    arm(c.coat, 'an', c.mitt, c.tool || '');
  parent.appendChild(g);
  const q = (s) => g.querySelector(s);
  const P = { g, lf: q('.lf'), ln: q('.ln'), af: q('.af'), an: q('.an'), bd: q('.bd'), hd: q('.hd'), sh: q('.sh') };
  /* pose: x,y feet; s scale; flip ±1; walk phase(rad); amp 0..1; lean deg; afA/anA arm angle override (deg fwd); hd tilt deg; dip px; shOp */
  P.set = (p) => {
    const w = p.walk || 0, A = p.amp == null ? 0 : p.amp;
    const sw = Math.sin(w);
    const bob = -Math.abs(Math.cos(w)) * 3.4 * A - (p.dip || 0);
    const legF = 30 * A * sw, legN = -30 * A * sw;
    const armF = p.afA != null ? p.afA : -24 * A * sw, armN = p.anA != null ? p.anA : 24 * A * sw;
    g.setAttribute('transform', `translate(${R2(p.x)} ${R2(p.y)}) scale(${(p.s || 1) * (p.flip || 1)} ${p.s || 1})`);
    P.lf.setAttribute('transform', `rotate(${-legF} 0 -90)`);
    P.ln.setAttribute('transform', `rotate(${-legN} 0 -90)`);
    P.af.setAttribute('transform', `translate(0 ${bob}) rotate(${-armF} 0 -142)`);
    P.an.setAttribute('transform', `translate(0 ${bob}) rotate(${-armN} 0 -142)`);
    const lean = p.lean || 0;
    P.bd.setAttribute('transform', `translate(0 ${bob}) rotate(${lean} 0 -90)`);
    P.hd.setAttribute('transform', `translate(0 ${bob}) rotate(${lean + (p.tilt || 0)} 0 -90)`);
    P.g.style.display = p.hide ? 'none' : '';
  };
  return P;
}

/* ---------------- dogs ---------------- */
function makeDog(parent, o) {
  const c = Object.assign(
    { kind: 'schnauzer', body: '#8b8f96', dark: '#6b6f77', beard: '#d8dbdf', old: 0, collar: null, legLen: 1, fur: 0 },
    o
  );
  const g = svgEl('g');
  let inner = '';
  if (c.kind === 'schnauzer') {
    const L = c.legLen, ly = -40 * L;
    const leg = (cls, x, col) =>
      `<g class="${cls}"><path fill="${col}" d="M${x - 5} ${ly} L${x + 5} ${ly} L${x + 3.8} -7 L${x + 7} 0 L${x - 6.5} 0 L${x - 3.8} -7Z"/></g>`;
    const bodyCol = c.body, faceCol = mix(c.body, c.beard, 0.3 + c.old * 0.55);
    inner =
      `<ellipse class="sh" cx="2" cy="1" rx="50" ry="6" fill="#000" opacity=".2"/>` +
      leg('l2', -22, c.dark) + leg('l3', 28, c.dark) +
      `<g class="tl"><path fill="${c.dark}" d="M-37 -56 L-42 ${-76 + c.old * 12} L-33 ${-75 + c.old * 12} L-28 -56Z"/></g>` +
      `<g class="bd"><path fill="${bodyCol}" d="M-40 -44 Q-40 -62 -14 -62 L22 -62 Q42 -60 42 -44 Q42 -30 24 -30 L-22 -30 Q-40 -30 -40 -44Z"/>` +
      `<path fill="${shade(bodyCol, 0.13)}" d="M-30 -50 Q-6 -58 18 -55 Q-6 -51 -30 -40Z" opacity=".5"/>` +
      `<path fill="${bodyCol}" d="M16 -62 L36 -78 L44 -46 L20 -34Z"/></g>` +
      leg('l1', -27, c.body) + leg('l4, ', 33, c.body).replace('l4, ', 'l4') +
      `<g class="hd"><path fill="${bodyCol}" d="M27 -62 L31 -77 L52 -79 L58 -67 L79 -63 L80 -49 L58 -45 L50 -35 L31 -40Z"/>` +
      `<path fill="${faceCol}" d="M56 -66 L79 -63 L80 -49 L56 -46Z"/>` +
      `<path fill="${c.beard}" d="M55 -52 L80 -53 L75 -33 L65 -24 L54 -30Z"/>` +
      `<path fill="${c.beard}" d="M42 -73 L60 -76 L62 -67 L44 -65Z"/>` +
      `<circle cx="80" cy="-58" r="4.2" fill="#15130f"/><circle cx="53" cy="-62" r="2.4" fill="#15130f"/>` +
      `<path fill="${c.dark}" d="M30 -77 L40 -93 L47 -76Z"/>` +
      (c.collar ? `<path fill="${c.collar}" d="M27 -60 L38 -58 L40 -48 L30 -44Z"/>` + (c.collar2 ? `<path fill="${c.collar2}" d="M28.6 -55 L39.2 -53.4 L39.6 -50.8 L29.4 -49Z"/>` : '') + `<circle cx="34" cy="-42" r="3.2" fill="#dfe6f0"/>` : '') +
      `</g>`;
  } else {
    const fl = (cx, cy, rx, ry, seed, col) => `<path fill="${col}" d="${blob(cx, cy, rx, ry, seed, 20, 0.16)}"/>`;
    const blk = c.body, rim = shade(c.body, 0.22);
    const leg = (cls, x, col) => `<g class="${cls}">${fl(x, -13, 8.5, 15, x + 7, col)}</g>`;
    inner =
      `<ellipse class="sh" cx="2" cy="1" rx="46" ry="6" fill="#000" opacity=".2"/>` +
      leg('l2', -22, c.dark) + leg('l3', 24, c.dark) +
      `<g class="tl">${fl(-40, -56, 12, 15, 3, blk)}${fl(-41.5, -58, 10, 13, 5, rim)}${fl(-40, -56, 9, 12, 4, blk)}</g>` +
      `<g class="bd">${fl(-1, -38, 40, 24, 11, rim)}${fl(0, -37, 38.5, 22.5, 12, blk)}</g>` +
      leg('l1', -26, c.body) + leg('l4', 28, c.body) +
      `<g class="hd">${fl(46, -60, 23, 21, 21, rim)}${fl(46.5, -59, 21.5, 20, 22, blk)}` +
      fl(60, -52, 12, 9, 23, mix(c.body, '#8f8e98', 0.15 + c.old * 0.75)) +
      (c.old ? fl(56, -70, 8, 4, 29, '#8f8e98') : '') +
      `<circle cx="68" cy="-55" r="3.4" fill="#0a090c"/><circle cx="54" cy="-64" r="2.4" fill="#e9e6ee"/><circle cx="54.6" cy="-64" r="1.4" fill="#0a090c"/>` +
      `<g class="er">${fl(36, -50, 9, 19, 31, shade(c.body, 0.1))}${fl(36, -50, 8, 17.5, 32, c.dark)}</g>` +
      `</g>`;
  }
  g.innerHTML = inner;
  parent.appendChild(g);
  const q = (s) => g.querySelector(s);
  const D = { g, l1: q('.l1'), l2: q('.l2'), l3: q('.l3'), l4: q('.l4'), bd: q('.bd'), hd: q('.hd'), tl: q('.tl'), sh: q('.sh') };
  const LY = c.kind === 'schnauzer' ? -40 * c.legLen : -28;
  /* pose: x,y,s,flip; gait phase gp (rad), amp 0..1 (stride), gallop 0/1, bob px; head tilt deg; wag phase/amp; sit 0..1; lie 0..1; hide */
  D.set = (p) => {
    const gp = p.gp || 0, A = p.amp || 0, gl = p.gallop || 0;
    const stride = 34 * A;
    let a1, a2, a3, a4; // rear far, rear near, front far, front near
    if (gl) { a1 = Math.sin(gp) * stride; a2 = Math.sin(gp + 0.35) * stride; a3 = Math.sin(gp + 2.3) * stride; a4 = Math.sin(gp + 2.65) * stride; }
    else { a1 = Math.sin(gp) * stride; a2 = -a1; a3 = a2; a4 = a1; }
    const sit = p.sit || 0, lie = p.lie || 0;
    const bob = gl ? -Math.abs(Math.sin(gp * 0.5 + 0.4)) * 11 * A : -Math.abs(Math.sin(gp)) * 3 * A;
    const bow = p.bow || 0;
    const pitch = (gl ? Math.sin(gp + 1.1) * 5 * A : 0) + bow * 15;
    const drop = lie * 16 + sit * 9;
    D.g.setAttribute('transform', `translate(${R2(p.x)} ${R2(p.y)}) scale(${(p.s || 1) * (p.flip || 1)} ${p.s || 1}) rotate(${p.spin || 0} 0 -30)`);
    const fold = (a, rear) => {
      let t = `rotate(${-a} ${{ l1: -27, l2: -22, l3: 28, l4: 33 }[rear]} ${LY})`;
      return t;
    };
    const legT = (k, a, rear) => {
      const sq = 1 - lie * 0.7 - (rear && sit ? sit * 0.5 : 0);
      const px = { l1: -27, l2: -22, l3: 28, l4: 33 }[k];
      return `translate(0 ${R2(-bob * 0.0 + (1 - sq) * -LY * 0)}) rotate(${R2(-a)} ${px} ${LY}) translate(${px} ${LY}) scale(1 ${R2(sq)}) translate(${-px} ${-LY})`;
    };
    D.l1.setAttribute('transform', legT('l1', a1, true));
    D.l2.setAttribute('transform', legT('l2', a2, true));
    D.l3.setAttribute('transform', legT('l3', a3, false));
    D.l4.setAttribute('transform', legT('l4', a4, false));
    D.bd.setAttribute('transform', `translate(0 ${R2(bob + drop)}) rotate(${R2(pitch - sit * 22)} 24 -30)`);
    D.hd.setAttribute('transform', `translate(0 ${R2(bob + drop - sit * 8)}) rotate(${R2((p.head || 0) + pitch * 0.6 - lie * 8)} 34 -52)`);
    D.tl.setAttribute('transform', `translate(0 ${R2(bob + drop)}) rotate(${R2(Math.sin(p.wag || 0) * (p.wagA == null ? 14 : p.wagA) - sit * 10)} -34 -50)`);
    D.g.style.display = p.hide ? 'none' : '';
  };
  return D;
}
