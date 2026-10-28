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
const rows = parseCSV(raw);

console.log('Total manifest rows:', rows.length);
console.log('Header:', rows[0]);
console.log('Sample row 1 (Set 1):', rows[1]);
console.log('Sample row 1001 (Set 2):', rows[1001]);
console.log('Sample row 2264 (Set 3):', rows[2264]);
console.log('Sample row 2314 (Set 4):', rows[2314]);
