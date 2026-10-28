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

const litCsv = fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-literal-scenes-first.csv', 'utf8');
const litRows = parseCSV(litCsv).slice(1);

const allCsv = fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv', 'utf8');
const allRows = parseCSV(allCsv).slice(1);
const refRows = allRows.filter(r => r[4] === 'Reference phrase illustrations');

// Print first 10 litRows targets and refRows targets
console.log('--- First 10 litRows targets ---');
for (let i = 0; i < 10; i++) {
  console.log(`[${i+1}] Lit target: "${litRows[i][6]}" | Unit: "${litRows[i][13]}"`);
}

console.log('--- First 10 refRows targets ---');
for (let i = 0; i < 10; i++) {
  console.log(`[${i+1}] Ref target: "${refRows[i][6]}" | Unit: "${refRows[i][13]}"`);
}
