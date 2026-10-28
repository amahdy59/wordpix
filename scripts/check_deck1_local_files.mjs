import fs from 'node:fs';
import path from 'node:path';

const dir = 'output/figma-slides-10015-images';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));
console.log(`Found ${files.length} .webp files in ${dir}`);

// Check first 5 file stats
for (let i = 0; i < 5; i++) {
  const f = files[i];
  const s = fs.statSync(path.join(dir, f));
  console.log(`  ${f}: ${s.size} bytes`);
}
