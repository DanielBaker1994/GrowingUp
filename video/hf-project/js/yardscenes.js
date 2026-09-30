/* yardscenes.js — S2 (2004 chase), S6 (2014 the old dog), (S7 and S8 live in scenes78.js) */
const ordr = (act, a, b, ya, yb) => { const A = a.g, B = b.g; const first = ya <= yb ? A : B, second = ya <= yb ? B : A; if (act.lastChild !== second) { act.appendChild(first); act.appendChild(second); } };
const motes = (ctx, f, n, seed, col, sz, speed) => {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x0 = r() * 2200 - 140, y0 = r() * 1080, ph = r() * 6.28, sp = (0.3 + r()) * speed, z = 0.4 + r() * 0.9;
    const x = ((x0 + f * sp * 0.6 * z + Math.sin(f * 0.02 + ph) * 30) % 2200 + 2200) % 2200 - 140, y = ((y0 - f * sp * 0.25 * z) % 1080 + 1080) % 1080;
    const a = (0.25 + 0.5 * (0.5 + 0.5 * Math.sin(f * 0.05 + ph))) * z;
    ctx.fillStyle = col; ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, sz * z, 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = 1;
};
const rays = (ctx, sx, sy, f, a, col) => {
  for (let i = 0; i < 6; i++) {
    const ang = 1.75 + i * 0.16 + Math.sin(f * 0.008 + i) * 0.03, w = 0.05 + (i % 3) * 0.02;
    const g = ctx.createRadialGradient(sx, sy, 20, sx, sy, 1500);
    g.addColorStop(0, col.replace('A', a * 0.9)); g.addColorStop(1, col.replace('A', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(ang - w) * 1800, sy + Math.sin(ang - w) * 1800); ctx.lineTo(sx + Math.cos(ang + w) * 1800, sy + Math.sin(ang + w) * 1800); ctx.closePath(); ctx.fill();
  }
};

/* ============ S2 : f 300..500 ============ */
let S2; const initS2 = () => {
  S2 = (() => {
    const Y = buildYard('sv2', LOOK2);
    const A = makeDog(Y.act, { kind: 'shihpoo', body: '#17161c', dark: '#26242d', old: 0.75 });
    const B = makeDog(Y.act, { kind: 'schnauzer', body: '#8b8f98', dark: '#6a6e78', beard: '#e2e4ea' });
    const om = (2 * Math.PI) / 128;
    const loop = (th) => ({ x: 940 + 560 * Math.sin(th), y: 892 + 92 * Math.sin(2 * th + 0.5) });
    const TA = (f) => kf(f, [[0, 0], [104, 104], [140, 118], [200, 120]], E.inOutSine);
    const TB = (f) => kf(f, [[0, 0], [110, 110], [156, 150], [200, 166]], E.inOutSine);
    const camAt = (f) => ({ fx: lerp(860, 1050, E.inOutSine(f / 200)), fy: 590, s: lerp(1.0, 1.08, E.inOutSine(f / 200)) });
    function pose(f) {
      const thA = 0.35 + om * TA(f), thB = 0.35 - 0.8 + om * TB(f);
      const pa = loop(thA); let pb = loop(thB);
      const k = E.smooth(seg(f, 136, 172));
      const ang = f * 0.13, orb = { x: pa.x + Math.cos(ang) * 150 * (0.7 + 0.3 * Math.sin(f * 0.05)), y: pa.y + 32 + Math.sin(ang) * 26 };
      pb = { x: lerp(pb.x, orb.x, k), y: lerp(pb.y, orb.y, k) };
      const sA = depthS(pa.y) * 1.75, sB = depthS(pb.y) * 1.75;
      const ca = Math.cos(thA), cb = Math.cos(thB);
      const runA = (1 - E.smooth(seg(f, 112, 150))), runB = 1 - k * 0.7;
      const gpa = f * 0.66, gpb = f * 0.7;
      A.set({ x: pa.x, y: pa.y, s: sA, flip: ca >= 0 ? 1 : -1, gp: gpa, amp: (0.28 + 0.72 * Math.abs(ca)) * runA * 0.85, gallop: 1, sit: E.smooth(seg(f, 150, 168)), wag: f * 0.5, wagA: 12, head: -4 + E.smooth(seg(f, 150, 170)) * -14 });
      const bowk = k * (0.5 + 0.5 * Math.sin(f * 0.16));
      B.set({ x: pb.x, y: pb.y, s: sB, flip: k > 0.5 ? (pb.x < pa.x ? 1 : -1) : cb >= 0 ? 1 : -1, gp: gpb, amp: (0.3 + 0.7 * Math.abs(cb)) * runB, gallop: 1, bow: bowk, wag: f * 0.9, wagA: 20 });
      ordr(Y.act, A, B, pa.y, pb.y);
    }
    function update(f, fa) {
      const c = camAt(f); Y.setCam(c, f); pose(f);
      Y.wg.forEach((e) => e.setAttribute('opacity', 0));
    }
    const fx = (ctx, f) => { motes(ctx, f, 46, 5, '#fff2c0', 2.3, 1.2); ctx.globalCompositeOperation = 'lighter'; rays(ctx, 420, 430, f, 0.05, 'rgba(255,230,160,A)'); ctx.globalCompositeOperation = 'source-over'; };
    return { a: 300, b: 500, update, fx, camAt };
  })();
};

/* ============ S6 : f 1000..1200 ============ */
let S6; const initS6 = () => {
  S6 = (() => {
    const Y = buildYard('sv6', LOOK6);
    const old = makeDog(Y.act, { kind: 'schnauzer', body: '#aeb2b9', dark: '#8f939b', beard: '#f4f5f7', old: 1, legLen: 0.92 });
    const yng = makeDog(Y.act, { kind: 'schnauzer', body: '#6f737d', dark: '#565a63', beard: '#cfd2d8', legLen: 1.12 });
    const camAt = (f) => ({ fx: lerp(1020, 900, E.inOutSine(f / 200)), fy: lerp(590, 640, E.inOutSine(f / 200)), s: lerp(1.0, 1.24, E.inOutCubic(f / 200)) });
    function update(f) {
      const c = camAt(f); Y.setCam(c, f);
      // old dog: lying -> slow walk -> sits -> lies again
      const rise = E.inOutSine(seg(f, 34, 62)), walk = E.inOutSine(seg(f, 62, 118)), sitk = E.inOutSine(seg(f, 118, 132)), lie2 = E.inOutSine(seg(f, 150, 176));
      const ox = lerp(640, 810, walk), oy = 905 + 12 * walk;
      const breathe = Math.sin(f * 0.13) * 0.5 + 0.5;
      const oLie = (1 - rise) + lie2 * sitk;
      const walking = walk > 0 && walk < 1 ? 1 : 0;
      old.set({ x: ox, y: oy, s: depthS(oy) * 1.7, flip: 1, gp: f * 0.34, amp: 0.34 * walking, lie: clamp(oLie, 0, 1), sit: sitk * (1 - lie2) * rise, head: -3 + breathe * 2 + (1 - rise) * 6, wag: f * 0.3 * (1 + sitk), wagA: 8 * (0.3 + sitk), gallop: 0 });
      // young: zoomies, then play bows, then flops beside
      const th = 0.6 + f * 0.085, zoom = 1 - E.smooth(seg(f, 72, 100));
      const cxp = lerp(1150, 880, E.smooth(seg(f, 60, 110)));
      const yx = cxp + 420 * Math.sin(th) * zoom + (1 - zoom) * 160, yy = 880 + 100 * Math.sin(2 * th + 0.4) * zoom + (1 - zoom) * 30;
      const flop = E.inOutSine(seg(f, 152, 178)), bowing = (1 - zoom) * (1 - flop) * (0.55 + 0.45 * Math.sin(f * 0.25));
      const fxp = lerp(yx, 920, flop), fyp = lerp(yy, 930, flop);
      yng.set({ x: fxp, y: fyp, s: depthS(fyp) * 2.25, flip: zoom > 0.15 ? (Math.cos(th) >= 0 ? 1 : -1) : -1, gp: f * 0.6, amp: zoom * (0.4 + 0.6 * Math.abs(Math.cos(th))) * (1 - flop), gallop: 1, bow: bowing, lie: flop, wag: f * 0.8, wagA: 22 * (1 - flop * 0.6) });
      ordr(Y.act, old, yng, oy, fyp);
      Y.wg.forEach((e, i) => e.setAttribute('opacity', R2(0.5 + 0.2 * Math.sin(f * 0.08 + i))));
      Y.win.forEach((e, i) => e.setAttribute('fill', '#ffcf80'));
    }
    const fx = (ctx, f) => {
      motes(ctx, f, 30, 9, '#ffe2b0', 2, 0.9);
      // fireflies
      const r = rng(77);
      for (let i = 0; i < 16; i++) { const x = r() * 1900, y = 640 + r() * 380, ph = r() * 6.28, on = Math.max(0, Math.sin(f * 0.06 + ph)); const px = x + Math.sin(f * 0.02 + ph) * 40, py = y + Math.cos(f * 0.017 + ph) * 26; const g = fx_glow(ctx, px, py, 16 * on); }
    };
    const fx_glow = (ctx, x, y, r) => { if (r < 0.5) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,240,150,.9)'); g.addColorStop(1, 'rgba(255,220,100,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); };
    return { a: 1000, b: 1200, update, fx, camAt };
  })();
};

