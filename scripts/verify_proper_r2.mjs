import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');

loadEnv();
const r2 = createClient();

function parseCSVLine(line) {
  const fields = [];
  let cur = '';
  let inside = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    const n = line[i + 1];
    if (c === '"') {
      if (inside && n === '"') { cur += '"'; i++; }
      else { inside = !inside; }
    } else if (c === ',' && !inside) {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

const lines = fs.readFileSync('output/figma-deck3-images/manifest.csv', 'utf8').split('\n');
const header = parseCSVLine(lines[0]);
console.log('Header:', header);

const testIndices = [1, 500, 1500, 2500, 3469];
for (const idx of testIndices) {
  const fields = parseCSVLine(lines[idx]);
  const r2Path = fields[13];
  const localPath = fields[14];
  const exists = await r2.exists(r2Path);
  console.log(`[Item #${idx}] ${fields[4]} | Local: ${fs.existsSync(localPath)} | R2: ${exists} (${r2Path})`);
}
