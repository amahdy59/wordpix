import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const rawDeck1Manifest = fs.readFileSync('output/figma-slides-10015-images/manifest.csv', 'utf8');
const deck1Rows = parseCSV(rawDeck1Manifest).slice(1);

const media = JSON.parse(fs.readFileSync('src/app/generated/reviewedExactSentenceMedia.json', 'utf8'));

console.log(`Deck 1 manifest rows: ${deck1Rows.length}`);
console.log(`Current reviewedExactSentenceMedia count: ${Object.keys(media).length}`);

// Inspect Set 2 rows (Literal scenes, indices 1000..2262)
const set2Rows = deck1Rows.filter(r => r[1] === 'Set 2: Literal Sentence Scenes');
console.log(`Set 2 Literal Sentence Scenes count: ${set2Rows.length}`);

// Sample Set 2 row
console.log('Sample Set 2 row:', set2Rows[0]);
