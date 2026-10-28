import fs from 'node:fs';
import readline from 'node:readline';

const stream = fs.createReadStream('outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv');
const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

function parseLine(line) {
  const fields = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i+1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

let header = null;
const families = {};
let count = 0;
for await (const line of rl) {
  if (!header) { header = parseLine(line); continue; }
  const f = parseLine(line);
  count++;
  const fam = f[4];
  families[fam] = (families[fam] || 0) + 1;
}

console.log('Total rows:', count);
console.log('Header:', header);
console.log('Families:', families);
