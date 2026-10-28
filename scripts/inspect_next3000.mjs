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

const raw = fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-next-3000-image-prompts.csv', 'utf8');
const rows = parseCSV(raw);
console.log('Total rows in next-3000:', rows.length);
console.log('Header:', rows[0]);
console.log('Row 1:', rows[1]);
console.log('Row 2:', rows[2]);
console.log('Row 3:', rows[3]);
console.log('Row 4:', rows[4]);
console.log('Row 5:', rows[5]);
