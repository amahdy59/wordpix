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

console.log(`Literal rows: ${litRows.length}`);
console.log(`Reference (figurative) rows: ${refRows.length}`);

// Compare target phrases
const litTargets = new Map();
for (const r of litRows) {
  const target = (r[6] || '').toLowerCase().trim();
  litTargets.set(target, r);
}

const overlaps = [];
for (const r of refRows) {
  const target = (r[6] || '').toLowerCase().trim();
  if (litTargets.has(target)) {
    overlaps.push({
      target,
      literalRow: litTargets.get(target),
      refRow: r
    });
  }
}

console.log(`Overlapping targets between literal and figurative: ${overlaps.length}`);
if (overlaps.length > 0) {
  console.log('Sample overlap 1:');
  console.log('  Target:', overlaps[0].target);
  console.log('  Literal prompt:', overlaps[0].literalRow[8]?.slice(0, 150));
  console.log('  Figurative prompt:', overlaps[0].refRow[8]?.slice(0, 150));
}
