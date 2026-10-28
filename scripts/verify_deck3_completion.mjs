import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');

loadEnv();

const r2 = createClient();

const c1 = fs.readdirSync('output/figma-deck3-images').length;
const c2 = fs.readdirSync('public/question-images/v2/_ALL_3469_DECK3_IMAGES').length;
const c3 = fs.readdirSync('public/question-images/v2/context-scenes').length;

console.log(`Local files count in output/figma-deck3-images: ${c1}`);
console.log(`Local files count in public/question-images/v2/_ALL_3469_DECK3_IMAGES: ${c2}`);
console.log(`Local files count in public/question-images/v2/context-scenes: ${c3}`);

const manifest = fs.readFileSync('output/figma-deck3-images/manifest.csv', 'utf8');
const lines = manifest.split('\n').filter(Boolean);
console.log(`Manifest rows: ${lines.length - 1}`);

// Sample R2 check
const sampleKeys = [
  lines[1].split(',')[13],
  lines[500].split(',')[13],
  lines[1500].split(',')[13],
  lines[2500].split(',')[13],
  lines[lines.length - 1].split(',')[13]
];

console.log('Testing R2 presence for 5 sample keys:');
for (const k of sampleKeys) {
  const exists = await r2.exists(k);
  console.log(`  ${k} => exists: ${exists}`);
}
