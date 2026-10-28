import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');

loadEnv();
const r2 = createClient();

function parseCSV(content) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    const next = content[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      row.push(cur); cur = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(cur); cur = '';
      if (row.length > 1 || (row.length === 1 && row[0] !== '')) rows.push(row);
      row = [];
    } else {
      cur += c;
    }
  }
  if (cur.length > 0 || row.length > 0) { row.push(cur); rows.push(row); }
  return rows;
}

const raw = fs.readFileSync('output/figma-deck3-images/manifest.csv', 'utf8');
const rows = parseCSV(raw);
console.log(`Total parsed manifest rows: ${rows.length} (header + ${rows.length - 1} data rows)`);

const testIndices = [1, 500, 1500, 2500, 3000, 3469];
for (const idx of testIndices) {
  const r = rows[idx];
  const r2Path = r[13];
  const localPath = r[14];
  const exists = await r2.exists(r2Path);
  const localExists = fs.existsSync(localPath);
  console.log(`[Item #${idx}] ${r[4]} | Unit: ${r[6]} | Local: ${localExists} | R2: ${exists} (${r2Path})`);
}
