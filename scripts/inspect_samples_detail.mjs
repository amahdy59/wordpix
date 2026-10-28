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
const idx7094 = allRows.findIndex(r => r[0] === '7094');

for (let i = idx7094; i < idx7094 + 15; i++) {
  const r = allRows[i];
  console.log(`=== Slide ${i - idx7094 + 1} (Rank ${r[0]}) ===`);
  console.log(`Target: ${r[6]}`);
  console.log(`Meaning: ${r[7]}`);
  console.log(`Unit: ${r[13]} | Lesson: ${r[14]}`);
  console.log(`Prompt: ${r[8]}`);
  console.log(`Questions: ${r[11]} | Answers: ${r[12]}`);
  console.log(`Integration: ${r[10]}`);
}
