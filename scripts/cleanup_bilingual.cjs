/**
 * cleanup_bilingual.cjs
 *
 * Post-import cleanup:
 * 1. Replace generic "The term X was used in Y lesson." example sentences
 *    with the real approved example from the CSV.
 * 2. Remove definitions that are shorter than 30 chars (WordNet verb-sense
 *    fallbacks like "To fish for shrimp." that are wrong for learning).
 */
const f = require('fs'), p = require('path');

const CSV_PATH = 'C:\\Users\\AhmedMahdy\\Downloads\\WordPix_FULL_BILINGUAL_CATALOGUE_10333_ALL_APPROVED.csv';
const BI_DIR = p.join(__dirname, '..', 'src', 'app', 'data', 'bilingual');
const GENERIC_EX = /^The term .+ was used in the .+ lesson\.$/i;
const MIN_DEF_LEN = 30;

// ── Parse CSV ────────────────────────────────────────────────────────────────
function parseRow(line) {
  const c = []; let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (inQ && line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ; }
    else if (ch === ',' && !inQ) { c.push(cur); cur = ''; }
    else cur += ch;
  }
  c.push(cur); return c;
}
const raw = f.readFileSync(CSV_PATH, 'utf8');
const lines = raw.split('\r\n').filter(l => l.trim());
const hdr = lines[0].split(',').map(h => h.replace(/^\uFEFF/,'').trim());
const idx = { unit: hdr.indexOf('unit'), id: hdr.indexOf('word_id'),
               ex: hdr.indexOf('example_usage'), def: hdr.indexOf('approved_english_definition') };

// Build lookup: "unit:word_id" → { ex, def }
const lookup = {};
lines.slice(1).forEach(line => {
  const r = parseRow(line);
  const unit = r[idx.unit].replace(/^\uFEFF/,'').trim();
  const id   = r[idx.id].trim();
  lookup[unit + ':' + id] = { ex: r[idx.ex].trim(), def: r[idx.def].trim() };
});

// ── Process files ────────────────────────────────────────────────────────────
const files = f.readdirSync(BI_DIR).filter(fn => fn.endsWith('.json'));
let replacedEx = 0, removedDef = 0;

files.forEach(file => {
  const unit = file.replace('.json', '');
  const fPath = p.join(BI_DIR, file);
  const data = JSON.parse(f.readFileSync(fPath, 'utf8'));
  let dirty = false;

  Object.entries(data).forEach(([wordId, entry]) => {
    if (typeof entry !== 'object' || Array.isArray(entry)) return;
    const csv = lookup[unit + ':' + wordId];

    // 1. Replace generic example with CSV real example
    if (entry.exampleUsage && GENERIC_EX.test(entry.exampleUsage.trim())) {
      if (csv && csv.ex && !GENERIC_EX.test(csv.ex)) {
        entry.exampleUsage = csv.ex;
        replacedEx++;
        dirty = true;
      }
    }

    // 2. Remove short / wrong-sense definitions (< MIN_DEF_LEN chars)
    if (entry.definition && entry.definition.trim().length < MIN_DEF_LEN) {
      delete entry.definition;
      removedDef++;
      dirty = true;
    }
  });

  if (dirty) {
    f.writeFileSync(fPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
});

console.log('=== CLEANUP COMPLETE ===');
console.log('Generic examples replaced with real CSV sentences:', replacedEx);
console.log('Short/wrong-sense definitions removed:', removedDef);

// Verify no generics remain
let remaining = 0;
files.forEach(file => {
  const obj = JSON.parse(f.readFileSync(p.join(BI_DIR, file), 'utf8'));
  Object.values(obj).forEach(e => {
    if (typeof e !== 'object' || Array.isArray(e)) return;
    if (e.exampleUsage && GENERIC_EX.test(e.exampleUsage.trim())) remaining++;
  });
});
console.log('Generic examples still remaining:', remaining);
