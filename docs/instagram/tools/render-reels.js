// Gera o Reels quadro a quadro: para todas as animações CSS num tempo exato e tira um print.
// Uso: node render-reels.js [pasta-dos-frames] [t1,t2,... para só testar alguns tempos]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const dir = path.resolve(__dirname, '..');
  const out = process.argv[2] || path.join(dir, 'frames');
  const only = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto(`file://${dir}/reels-exame-de-bolsa-2027.html`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const FPS = 30, DUR = await p.evaluate(() => window.TIMELINE.END);
  const times = only || Array.from({ length: Math.round(FPS * DUR) }, (_, i) => i / FPS);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate((ms) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; }), times[i] * 1000);
    const name = only ? `t${times[i]}.png` : `${String(i).padStart(4, '0')}.png`;
    await p.screenshot({ path: path.join(out, name), type: 'png' });
  }
  await b.close();
})();
