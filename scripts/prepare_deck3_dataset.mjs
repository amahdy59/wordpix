import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ROOT = path.resolve('.');
const ORDERED_HASHES_PATH = path.join(ROOT, 'output/deck3_ordered_hashes.json');
const META_PATH = path.join(ROOT, 'output/figma-deck3-meta.json');
const CSV_PATH = path.join(ROOT, 'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv');

const orderedHashes = JSON.parse(fs.readFileSync(ORDERED_HASHES_PATH, 'utf8'));
const meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
const images = meta.meta?.images || meta.images || meta;
const allMetaHashes = Object.keys(images);

const rawCsv = fs.readFileSync(CSV_PATH, 'utf8');
const allRows = parseCSV(rawCsv).slice(1);

const refRows = allRows.filter(r => r[4] === 'Reference phrase illustrations');
const readRows = allRows.filter(r => r[4] === 'Reading and dialogue illustrations');
const suppRows = allRows.filter(r => r[4] === 'Supporting context illustrations');

console.log(`Ordered slides: ${orderedHashes.length}`);
console.log(`Meta URLs: ${allMetaHashes.length}`);
console.log(`Ref rows: ${refRows.length}, Read rows: ${readRows.length}, Supp rows: ${suppRows.length}`);

// Find uncaptured meta hash
const orderedSet = new Set(orderedHashes);
const extraMetaHashes = allMetaHashes.filter(h => !orderedSet.has(h));
console.log(`Extra meta hashes: ${extraMetaHashes.length} (${extraMetaHashes.join(', ')})`);

const tasks = [];

// Section 1: Reference phrase illustrations (1..1680)
for (let i = 0; i < refRows.length && i < orderedHashes.length; i++) {
  const sha = orderedHashes[i];
  const row = refRows[i];
  tasks.push({
    index: i + 1,
    sha,
    url: images[sha],
    family: 'Reference phrase illustrations',
    rank: row[0],
    assetId: row[1],
    filename: row[3],
    exactSource: (row[5] || '').trim(),
    targetPhrase: (row[6] || '').trim(),
    meaning: (row[7] || '').trim(),
    description: (row[8] || '').trim(),
    unit: row[13] || 'general',
    lesson: row[14] || '',
    contentId: row[15] || ''
  });
}

// Section 2: Reading and dialogue illustrations (1681..2890)
const offset2 = refRows.length;
for (let i = 0; i < readRows.length && (offset2 + i) < orderedHashes.length; i++) {
  const sha = orderedHashes[offset2 + i];
  const row = readRows[i];
  tasks.push({
    index: offset2 + i + 1,
    sha,
    url: images[sha],
    family: 'Reading and dialogue illustrations',
    rank: row[0],
    assetId: row[1],
    filename: row[3],
    exactSource: (row[5] || '').trim(),
    targetPhrase: (row[6] || '').trim(),
    meaning: (row[7] || '').trim(),
    description: (row[8] || '').trim(),
    unit: row[13] || 'general',
    lesson: row[14] || '',
    contentId: row[15] || ''
  });
}

// Section 3: Supporting context illustrations (2891..3468)
const offset3 = refRows.length + readRows.length;
for (let i = 0; (offset3 + i) < orderedHashes.length; i++) {
  const sha = orderedHashes[offset3 + i];
  const row = suppRows[i];
  tasks.push({
    index: offset3 + i + 1,
    sha,
    url: images[sha],
    family: 'Supporting context illustrations',
    rank: row ? row[0] : `extra-${i + 1}`,
    assetId: row ? row[1] : `EXTRA-${i + 1}`,
    filename: row ? row[3] : `extra-context-${i + 1}.png`,
    exactSource: row ? (row[5] || '').trim() : '',
    targetPhrase: row ? (row[6] || '').trim() : '',
    meaning: row ? (row[7] || '').trim() : '',
    description: row ? (row[8] || '').trim() : '',
    unit: row ? (row[13] || 'general') : 'general',
    lesson: row ? (row[14] || '') : '',
    contentId: row ? (row[15] || '') : ''
  });
}

// Extra meta hash (1 image)
for (let i = 0; i < extraMetaHashes.length; i++) {
  const sha = extraMetaHashes[i];
  tasks.push({
    index: tasks.length + 1,
    sha,
    url: images[sha],
    family: 'Library template and cover',
    rank: `lib-${i + 1}`,
    assetId: `LIB-${sha.slice(0, 8)}`,
    filename: `library-cover-${sha.slice(0, 8)}.png`,
    exactSource: 'Figma slide deck cover and template asset',
    targetPhrase: 'Deck Cover',
    meaning: 'Presentation cover template',
    description: 'Figma slide deck cover asset',
    unit: 'general',
    lesson: '',
    contentId: ''
  });
}

console.log(`Total tasks generated: ${tasks.length}`);
console.log('Sample task 1:', tasks[0]);
console.log('Sample task 1681:', tasks[1680]);
console.log('Sample task 2891:', tasks[2890]);
console.log('Sample task 3469:', tasks[3468]);

fs.writeFileSync('output/deck3_tasks.json', JSON.stringify(tasks, null, 2));
console.log('Wrote output/deck3_tasks.json successfully.');
