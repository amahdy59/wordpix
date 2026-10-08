import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';

const require = createRequire(import.meta.url);
const sharp = require(require.resolve('sharp', { paths: process.argv[2] ? [process.argv[2]] : undefined }));
const directory = 'output/illustrations/batch-01';
const scenes = JSON.parse(fs.readFileSync(path.join(directory, 'scenes.json'), 'utf8'));
const timings = [];
for (const scene of scenes) {
  const start = performance.now();
  await sharp(path.join(directory, scene.id + '.svg')).png().toFile(path.join(directory, scene.id + '.png'));
  timings.push({ id: scene.id, elapsedMs: performance.now() - start, bytes: fs.statSync(path.join(directory, scene.id + '.png')).size });
}
const tiles = [];
for (let i = 0; i < scenes.length; i++) {
  const scene = scenes[i];
  tiles.push({ input: await sharp(path.join(directory, scene.id + '.png')).resize(300, 169).toBuffer(), left: (i % 5) * 320 + 10, top: Math.floor(i / 5) * 205 + 10 });
  const label = `<svg width="300" height="26"><text x="4" y="18" font-family="Arial" font-size="11" fill="#0f172a">${scene.id}</text></svg>`;
  tiles.push({ input: Buffer.from(label), left: (i % 5) * 320 + 10, top: Math.floor(i / 5) * 205 + 179 });
}
await sharp({ create: { width: 1600, height: 2050, channels: 4, background: '#e2e8f0' } }).composite(tiles).png().toFile(path.join(directory, 'contact-sheet.png'));
const sorted = timings.map(x => x.elapsedMs).sort((a, b) => a - b);
const report = { generated: timings.length, pngRenderMedianMs: sorted[Math.floor(sorted.length / 2)], pngRenderP95Ms: sorted[Math.ceil(sorted.length * .95) - 1], totalPngBytes: timings.reduce((n, x) => n + x.bytes, 0), timings,
  scope: 'Local SVG rasterization; not Figma export, app loading, or learner performance' };
fs.writeFileSync(path.join(directory, 'png-render-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ generated: report.generated, medianMs: report.pngRenderMedianMs, p95Ms: report.pngRenderP95Ms, totalPngBytes: report.totalPngBytes }));
