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

const famRanges = {};
for (let i = 0; i < allRows.length; i++) {
  const r = allRows[i];
  const fam = r[4];
  if (!famRanges[fam]) {
    famRanges[fam] = { startRank: r[0], endRank: r[0], count: 0, firstUnit: r[13], lastUnit: r[13] };
  }
  famRanges[fam].endRank = r[0];
  famRanges[fam].lastUnit = r[13];
  famRanges[fam].count++;
}

console.log(JSON.stringify(famRanges, null, 2));
