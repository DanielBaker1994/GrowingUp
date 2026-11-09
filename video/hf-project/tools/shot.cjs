// usage: node tools/shot.js outDir f1 f2 f3 ...   (frames at 30fps) — quick stills without a full render
const path = require('path');
const { chromium } = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'));
(async () => {
  const [out, ...frames] = process.argv.slice(2);
  require('fs').mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  pg.on('console', (m) => console.log('console:', m.text()));
  pg.on('pageerror', (e) => console.log('PAGEERROR:', e.message, (e.stack || '').split('\n').slice(0, 4).join(' | ')));
  await pg.goto('file://' + path.resolve(__dirname, '../index.html'));
  await pg.waitForTimeout(600);
  for (const f of frames) {
    await pg.evaluate((f) => { draw(f / 30); }, +f);
    await pg.waitForTimeout(80);
    await pg.screenshot({ path: `${out}/f${String(f).padStart(4, '0')}.png` });
  }
  await b.close();
})();
