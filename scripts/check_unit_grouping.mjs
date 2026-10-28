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
const rows = parseCSV(raw).slice(1);

const labRows = rows.filter(r => (r[13] || '').includes('3d-printer-lab'));
console.log(`Found ${labRows.length} rows for 3d-printer-lab in all-additional-prompts:`);
for (const r of labRows) {
  console.log(`Rank: ${r[0]} | Family: ${r[4]} | Target: ${r[6]} | File: ${r[3]} | Desc: ${(r[8] || '').slice(0, 100)}...`);
}
