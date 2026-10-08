import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { createServer } from 'vite';
const root = 'output/illustrations/figma-reuse';
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, watch: null } });
let content;
try { content = (await server.ssrLoadModule('/src/app/exercises/content/authoredLessonContent.ts')).AUTHORED_LESSON_CONTENT; }
finally { await server.close(); }
const cache = `${root}/reading-review-candidates.json`;
// Preserve the original review evidence after rejected media is removed from selection.
const readings = fs.existsSync(cache) ? JSON.parse(fs.readFileSync(cache, 'utf8')) : Object.values(content).flatMap(l => l.clusters.filter(c => c.microReading.media).map(c => ({ lessonId: l.lessonId, clusterId: c.id, ...c.microReading, check: c.retrieval })));
const tiles = [];
for (const [index, reading] of readings.entries()) {
  const file = path.resolve('public', reading.media.imagePath.replace(/^\.\//, ''));
  const picture = await sharp(file).resize(380, 250, { fit: 'contain', background: 'white' }).png().toBuffer();
  const label = `${index} ${reading.clusterId}`.replace(/[<>&]/g, '');
  const caption = Buffer.from(`<svg width="380" height="32"><rect width="380" height="32" fill="white"/><text x="5" y="21" font-family="Arial" font-size="12">${label}</text></svg>`);
  tiles.push(await sharp({ create: { width: 380, height: 282, channels: 4, background: 'white' } }).composite([{ input: picture, top: 0, left: 0 }, { input: caption, top: 250, left: 0 }]).png().toBuffer());
}
await sharp({ create: { width: 1520, height: Math.ceil(tiles.length / 4) * 282, channels: 4, background: 'white' } }).composite(tiles.map((input, i) => ({ input, left: i % 4 * 380, top: Math.floor(i / 4) * 282 }))).png().toFile(`${root}/review/readings.png`);
fs.writeFileSync(`${root}/reading-review-candidates.json`, JSON.stringify(readings, null, 2));
console.log(JSON.stringify({ readings: readings.length }));
