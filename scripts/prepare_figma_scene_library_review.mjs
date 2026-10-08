import fs from 'node:fs';
import sharp from 'sharp';
const root = 'output/illustrations/figma-reuse';
const decisions = JSON.parse(fs.readFileSync(`${root}/full-matching-decisions.json`, 'utf8')).decisions;
const urls = JSON.parse(fs.readFileSync(`${root}/source-urls.json`, 'utf8'));
const candidates = decisions.filter(i => i.sceneId && i.imageRefs.length === 1);
const unique = [...new Map(candidates.map(i => [i.imageRefs[0], i])).values()];
const dir = `${root}/library-review`;
fs.mkdirSync(dir, { recursive: true });
let cursor = 0, complete = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (cursor < unique.length) {
    const item = unique[cursor++];
    const file = `${root}/originals/${item.imageRefs[0]}.source`;
    if (!fs.existsSync(file)) {
      const response = await fetch(urls[item.imageRefs[0]], { signal: AbortSignal.timeout(120000) });
      if (!response.ok) throw new Error(`Source read failed: ${response.status} (${item.nodeId})`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!bytes.length) throw new Error(`Empty source: ${item.nodeId}`);
      fs.writeFileSync(file, bytes);
    }
    const metadata = await sharp(file).metadata();
    Object.assign(item, { sourceFile: file, sourceWidth: metadata.width, sourceHeight: metadata.height });
    if (++complete % 100 === 0) console.log(`Original sources verified ${complete}/${unique.length}`);
  }
}));
fs.writeFileSync(`${dir}/candidates.json`, JSON.stringify(unique, null, 2) + '\n');
for (let start = 0; start < unique.length; start += 12) {
  const sheet = `${dir}/sheet-${Math.floor(start / 12)}.png`;
  if (fs.existsSync(sheet)) continue;
  const tiles = [];
  for (const [offset, item] of unique.slice(start, start + 12).entries()) {
    const pic = await sharp(item.sourceFile).resize(380, 250, { fit: 'contain', background: 'white' }).png().toBuffer();
    const label = `${start + offset} ${item.sceneId.replace('-usage-scene-', ':')}`.replace(/[<>&]/g, '');
    const svg = Buffer.from(`<svg width="380" height="32"><rect width="380" height="32" fill="white"/><text x="5" y="21" font-family="Arial" font-size="12">${label}</text></svg>`);
    tiles.push(await sharp({ create: { width: 380, height: 282, channels: 4, background: 'white' } }).composite([{ input: pic, top: 0, left: 0 }, { input: svg, top: 250, left: 0 }]).png().toBuffer());
  }
  await sharp({ create: { width: 1520, height: Math.ceil(tiles.length / 4) * 282, channels: 4, background: 'white' } }).composite(tiles.map((input, i) => ({ input, left: i % 4 * 380, top: Math.floor(i / 4) * 282 }))).png().toFile(sheet);
}
console.log(JSON.stringify({ sources: unique.length, sheets: Math.ceil(unique.length / 12), output: dir }));
