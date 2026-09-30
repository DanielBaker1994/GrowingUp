/* yardscenes.js — shared helpers: draw order, dust motes, light rays */
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

