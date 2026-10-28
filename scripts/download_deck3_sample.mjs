import fs from 'node:fs';

const ordered = JSON.parse(fs.readFileSync('output/deck3_ordered_hashes.json', 'utf8'));
const meta = JSON.parse(fs.readFileSync('output/figma-deck3-meta.json', 'utf8'));
const images = meta.meta?.images || meta.images || meta;

console.log(`Ordered count: ${ordered.length}, Meta count: ${Object.keys(images).length}`);

async function downloadSample(idx) {
  const sha = ordered[idx];
  const url = images[sha];
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(`output/deck3_slide_${idx + 1}.png`, buf);
  console.log(`Saved output/deck3_slide_${idx + 1}.png (${buf.length} bytes)`);
}

(async () => {
  for (let i = 0; i < 5; i++) {
    await downloadSample(i);
  }
})();
