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

const r8773 = allRows.find(r => r[0] === '8773');
const r8784 = allRows.find(r => r[0] === '8784');
const r8785 = allRows.find(r => r[0] === '8785');

console.log('Rank 8773:', r8773[0], r8773[4], r8773[6], r8773[13], r8773[8].slice(0, 120));
console.log('Rank 8784:', r8784[0], r8784[4], r8784[6], r8784[13], r8784[8].slice(0, 120));
console.log('Rank 8785:', r8785[0], r8785[4], r8785[6], r8785[13], r8785[8].slice(0, 120));
