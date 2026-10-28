import fs from 'node:fs';

const meta = JSON.parse(fs.readFileSync('output/figma-deck3-meta.json', 'utf8'));
const ordered = JSON.parse(fs.readFileSync('output/deck3_ordered_hashes.json', 'utf8'));
const images = meta.meta?.images || meta.images || meta;

console.log(`Ordered slides count: ${ordered.length}`);

// We downloaded:
// deck3_slide_2921.png
// deck3_slide_2922.png
// deck3_slide_2923.png
// deck3_slide_2924.png
// deck3_slide_2925.png
// deck3_slide_2926.png
// deck3_slide_3001.png
// deck3_slide_3401.png
// deck3_slide_3468.png

// Let's check their file sizes and inspect them
const files = [
  'output/deck3_slide_2921.png',
  'output/deck3_slide_2922.png',
  'output/deck3_slide_2923.png',
  'output/deck3_slide_2924.png',
  'output/deck3_slide_2925.png',
  'output/deck3_slide_2926.png',
  'output/deck3_slide_3001.png',
  'output/deck3_slide_3401.png',
  'output/deck3_slide_3468.png'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const stat = fs.statSync(f);
    console.log(`${f}: ${stat.size} bytes`);
  }
}
