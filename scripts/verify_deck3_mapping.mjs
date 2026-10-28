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

const raw = fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv', 'utf8');
const allRows = parseCSV(raw).slice(1);

// Find where Rank 7094 is
const idx7094 = allRows.findIndex(r => r[0] === '7094');
console.log(`Rank 7094 found at index ${idx7094} in CSV.`);

// Look at rows starting from idx7094
console.log('--- Rows from idx7094 to idx7094 + 20 ---');
for (let i = idx7094; i < idx7094 + 20; i++) {
  const r = allRows[i];
  console.log(`[${i - idx7094 + 1}] Rank: ${r[0]} | Family: ${r[4]} | Target: ${r[6]} | Unit: ${r[13]}`);
}

const remainingRows = allRows.slice(idx7094);
console.log(`Total remaining rows from Rank 7094: ${remainingRows.length}`);

// Breakdown of families from Rank 7094 to end:
const fams = {};
for (const r of remainingRows) {
  fams[r[4]] = (fams[r[4]] || 0) + 1;
}
console.log('Families from Rank 7094 to end:', fams);
