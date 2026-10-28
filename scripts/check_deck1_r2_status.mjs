import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');

loadEnv();
const r2 = createClient();

const manifestPath = 'output/figma-slides-10015-images/manifest.csv';
if (!fs.existsSync(manifestPath)) {
  console.log('Manifest not found:', manifestPath);
  process.exit(1);
}

const lines = fs.readFileSync(manifestPath, 'utf8').split('\n').filter(Boolean);
console.log(`Manifest lines: ${lines.length}`);
console.log('Header:', lines[0]);
console.log('Sample row 1:', lines[1]);

// Let's check sample R2 keys from manifest
const sampleIndices = [1, 500, 1000, 1500, 2000, 2500, 3000, lines.length - 1];
for (const idx of sampleIndices) {
  const parts = lines[idx].split(',');
  const r2Key = parts[5] || parts[parts.length - 2];
  const exists = await r2.exists(r2Key);
  console.log(`[Item #${idx}] ${parts[1] || parts[3]} | key: ${r2Key} | exists in R2: ${exists}`);
}
