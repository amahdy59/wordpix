/**
 * import_csv_to_bilingual.js
 *
 * Merges WordPix_FULL_BILINGUAL_CATALOGUE_10333_ALL_APPROVED.csv into the
 * bilingual JSON files under src/app/data/bilingual/.
 *
 * Merge rules (per word entry):
 *   - arabicTranslation : fill only if currently absent; never overwrite existing
 *   - exampleUsage      : fill only if currently absent; never overwrite existing
 *   - definition        : fill only if currently absent; never overwrite existing
 *
 * Existing hand-curated values are preserved in all cases.
 *
 * Run from the repo root:
 *   node scripts/import_csv_to_bilingual.js
 */

const fs   = require('fs');
const path = require('path');

const CSV_PATH  = 'C:\\Users\\AhmedMahdy\\Downloads\\WordPix_FULL_BILINGUAL_CATALOGUE_10333_ALL_APPROVED.csv';
const BI_DIR    = path.join(__dirname, '..', 'src', 'app', 'data', 'bilingual');

// ── CSV parser (handles quoted commas and doubled-quote escapes) ─────────────
function parseCSVRow(line) {
  const cols = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // Handle doubled-quote escape ""  →  "
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQ = !inQ; }
    } else if (ch === ',' && !inQ) {
      cols.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  cols.push(cur);
  return cols;
}

// ── Load CSV ─────────────────────────────────────────────────────────────────
const raw   = fs.readFileSync(CSV_PATH, 'utf8');
const lines = raw.split('\r\n').filter(l => l.trim());

const headerRaw = lines[0].split(',').map(h => h.replace(/^\uFEFF/, '').trim());
const idx = {
  unit   : headerRaw.indexOf('unit'),
  wordId : headerRaw.indexOf('word_id'),
  ar     : headerRaw.indexOf('approved_arabic_translation'),
  ex     : headerRaw.indexOf('example_usage'),
  def    : headerRaw.indexOf('approved_english_definition'),
  conf   : headerRaw.indexOf('translation_confidence'),
};

// Validate columns
const missing = Object.entries(idx).filter(([, v]) => v === -1).map(([k]) => k);
if (missing.length) { console.error('Missing columns:', missing); process.exit(1); }

console.log('CSV loaded — ' + (lines.length - 1) + ' rows across columns:', headerRaw.join(', '));
console.log('');

// ── Build lookup: unit → { wordId → { ar, ex, def, conf } } ─────────────────
const catalogue = {};
lines.slice(1).forEach((line, i) => {
  if (!line.trim()) return;
  const r    = parseCSVRow(line);
  const unit = r[idx.unit].replace(/^\uFEFF/, '').trim();
  const id   = r[idx.wordId].trim();
  const ar   = r[idx.ar].trim();
  const ex   = r[idx.ex].trim();
  const def  = r[idx.def].trim();
  const conf = r[idx.conf].trim().toLowerCase();
  if (!catalogue[unit]) catalogue[unit] = {};
  catalogue[unit][id] = { ar, ex, def, conf };
});

// ── Process each bilingual JSON ───────────────────────────────────────────────
const files = fs.readdirSync(BI_DIR).filter(f => f.endsWith('.json'));

let totalWords = 0;
let filledAr = 0, filledEx = 0, filledDef = 0;
let keptAr   = 0, keptEx   = 0;        // already had content — not overwritten
let noMatch  = [];                      // word IDs not found in CSV

files.forEach(file => {
  const unit  = file.replace('.json', '');
  const fPath = path.join(BI_DIR, file);
  const data  = JSON.parse(fs.readFileSync(fPath, 'utf8'));
  const csvUnit = catalogue[unit] || {};
  let dirty = false;

  Object.entries(data).forEach(([wordId, entry]) => {
    if (typeof entry !== 'object' || Array.isArray(entry)) return;
    totalWords++;

    const csv = csvUnit[wordId];
    if (!csv) { noMatch.push(unit + ':' + wordId); return; }

    // Arabic translation
    if (!entry.arabicTranslation || !entry.arabicTranslation.trim()) {
      if (csv.ar) { entry.arabicTranslation = csv.ar; filledAr++; dirty = true; }
    } else {
      keptAr++;
    }

    // Example usage
    if (!entry.exampleUsage || !entry.exampleUsage.trim()) {
      if (csv.ex) { entry.exampleUsage = csv.ex; filledEx++; dirty = true; }
    } else {
      keptEx++;
    }

    // English definition (add only if absent)
    if (!entry.definition || !entry.definition.trim()) {
      if (csv.def) { entry.definition = csv.def; filledDef++; dirty = true; }
    }
  });

  if (dirty) {
    fs.writeFileSync(fPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
});

// ── Report ────────────────────────────────────────────────────────────────────
console.log('=== IMPORT COMPLETE ===');
console.log('Files processed     :', files.length);
console.log('Word entries scanned:', totalWords);
console.log('');
console.log('FILLED (was empty → now has value):');
console.log('  Arabic translations :', filledAr);
console.log('  Example sentences   :', filledEx);
console.log('  English definitions :', filledDef);
console.log('');
console.log('PRESERVED (already had value — not overwritten):');
console.log('  Arabic translations :', keptAr);
console.log('  Example sentences   :', keptEx);
console.log('');
if (noMatch.length) {
  console.warn('Word IDs in JSON but NOT in CSV (' + noMatch.length + '):');
  noMatch.slice(0, 20).forEach(w => console.warn('  ' + w));
  if (noMatch.length > 20) console.warn('  ... and ' + (noMatch.length - 20) + ' more');
} else {
  console.log('All word IDs matched in CSV — no orphans.');
}
