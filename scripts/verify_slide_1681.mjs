import fs from 'node:fs';

const meta = JSON.parse(fs.readFileSync('output/figma-deck3-meta.json', 'utf8'));
const ordered = JSON.parse(fs.readFileSync('output/deck3_ordered_hashes.json', 'utf8'));
const images = meta.meta?.images || meta.images || meta;

async function downloadSample(idx) {
  const sha = ordered[idx];
  const url = images[sha];
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(`output/deck3_slide_${idx + 1}.png`, buf);
  console.log(`Saved output/deck3_slide_${idx + 1}.png (${buf.length} bytes, sha: ${sha})`);
}

(async () => {
  // Let's check slides around 1680
  await downloadSample(1679); // 1680
  await downloadSample(1680); // 1681
  await downloadSample(1681); // 1682
})();
