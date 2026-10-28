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

// Let's inspect the targets we identified:
// Slide 1: calibrate-prototype (Rank 23)
// Slide 2: rough draft (Rank 7095)
// Slide 3: blueprint for success (Rank 7096)
// Slide 4: bricklayer? Or what?
// Slide 5: pipetting robot?
// Slide 6: from concept to creation (Rank 7099)
// Slide 7: wrenches / machinery?
// Slide 8: layer by layer (Rank 7101)
// Slide 9: Mini Dialogue (Rank 8784)
// Slide 10: Mark Jenkins - Supervisor (what rank?)

console.log('--- 3d-printer-lab rows ---');
const lab = rows.filter(r => r[13] === '3d-printer-lab');
for (const r of lab) {
  console.log(`Rank: ${r[0].padStart(5)} | Family: ${r[4].padEnd(35)} | Target: ${r[6].padEnd(30)} | Asset: ${r[1]}`);
}
