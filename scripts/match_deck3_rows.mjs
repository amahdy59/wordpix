import fs from 'node:fs';

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
      else { inQuotes = !inQuotes; }
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

const raw = fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv', 'utf8');
const rows = parseCSV(raw);
const header = rows[0];

// Let's search for "calibrate-prototype" or "bricklayer" or "Aura H-1" or "Elements of Style" or "GENOMIX"
const queries = ['calibrate-prototype', 'prototype', 'bricklayer', 'Elements of Style', 'Hemingway', 'Mark Jenkins', 'GENOMIX'];

for (const q of queries) {
  const matches = rows.filter(r => r.some(cell => (cell || '').toLowerCase().includes(q.toLowerCase())));
  console.log(`Query "${q}": found ${matches.length} matches`);
  for (const m of matches.slice(0, 3)) {
    console.log(`  Rank: ${m[0]} | Family: ${m[4]} | Target: ${m[6]} | Unit: ${m[13]} | File: ${m[3]}`);
  }
}
