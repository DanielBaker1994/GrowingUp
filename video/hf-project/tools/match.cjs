// usage: node tools/match.cjs  — prints mean abs difference between S7b's landing frame and S8's first frames, for tuning the hand-off
const path = require('path');
const { chromium } = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  pg.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await pg.goto('file://' + path.resolve(__dirname, '../index.html'));
  await pg.waitForTimeout(600);
  const shot = async (id, fn) => { await pg.evaluate(([id, fn]) => { document.querySelectorAll('.scene').forEach((e) => (e.style.display = 'none')); [...document.getElementById('root').children].forEach((e) => { if (e.style.zIndex === '40' || e.style.zIndex === '41') e.style.display = 'none'; }); const el = document.getElementById(id); el.style.display = 'block'; el.style.opacity = 1; new Function(fn)(); }, [id, fn]); return pg.screenshot({ type: 'png' }); };
  const fs = require('fs'); const out = process.argv[2] || '/tmp/match'; fs.mkdirSync(out, { recursive: true });
  for (const [name, id, fn] of [['a7b_284', 'sc7b', 'S7b.update(284,1684)'], ['b7b_300', 'sc7b', 'S7b.update(300,1700)'], ['c8_m16', 'sc8', 'S8.update(-16,1684)'], ['d8_0', 'sc8', 'S8.update(0,1700)'], ['e8_20', 'sc8', 'S8.update(20,1720)']]) fs.writeFileSync(`${out}/${name}.png`, await shot(id, fn));
  await b.close();
})();
