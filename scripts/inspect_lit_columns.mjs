import fs from 'node:fs';

function parseCSVLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    const next = line[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      fields.push(cur); cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

const raw = fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-literal-scenes-first.csv', 'utf8');
const lines = raw.split('\n').filter(Boolean);
console.log('Header:', parseCSVLine(lines[0]));
console.log('Row 1:', parseCSVLine(lines[1]));
console.log('Row 23 (calibrate-prototype):', parseCSVLine(lines[23]));
