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

const raw = fs.readFileSync('output/figma-slides-10015-images/manifest.csv', 'utf8');
const rows = parseCSV(raw).slice(1);

let localExistsCount = 0;
let localMissingCount = 0;

for (const r of rows) {
  const localPath = r[6];
  if (localPath && fs.existsSync(localPath)) {
    localExistsCount++;
  } else {
    localMissingCount++;
  }
}

console.log({
  totalRows: rows.length,
  localExistsCount,
  localMissingCount
});
