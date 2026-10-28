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

const orderedHashes = JSON.parse(fs.readFileSync('output/deck3_ordered_hashes.json', 'utf8'));
const meta = JSON.parse(fs.readFileSync('output/figma-deck3-meta.json', 'utf8'));
const images = meta.meta?.images || meta.images || meta;
const allMetaHashes = Object.keys(images);

console.log({
  totalMetaHashes: allMetaHashes.length,
  orderedHashesCount: orderedHashes.length,
  csvTotalRows: allRows.length
});

// Let's inspect rows around 2890 (1680 + 1210)
const refRows = allRows.filter(r => r[4] === 'Reference phrase illustrations');
const readRows = allRows.filter(r => r[4] === 'Reading and dialogue illustrations');
const suppRows = allRows.filter(r => r[4] === 'Supporting context illustrations');

console.log({
  refRowsCount: refRows.length,
  readRowsCount: readRows.length,
  suppRowsCount: suppRows.length,
  refPlusRead: refRows.length + readRows.length,
  differenceToOrdered: orderedHashes.length - (refRows.length + readRows.length)
});
