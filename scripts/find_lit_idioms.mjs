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

const idiomRows = litRows.filter(r => {
  const txt = ((r[6] || '') + ' ' + (r[5] || '') + ' ' + (r[8] || '')).toLowerCase();
  return txt.includes('idiom') || txt.includes('phrase') || txt.includes('literal');
});

console.log(`Idiom/literal matching rows in litRows: ${idiomRows.length}`);
for (let i = 0; i < Math.min(10, idiomRows.length); i++) {
  console.log(`[${i+1}] Target: "${idiomRows[i][6]}" | Unit: "${idiomRows[i][13]}" | Sentence: "${idiomRows[i][5]}"`);
}
