/**
 * strip_generic_examples.cjs
 *
 * Removes the "The term X was used in Y lesson." placeholder example sentences
 * from bilingual JSON files. Those entries keep their arabicTranslation and
 * definition but lose the generic example so the test guard fires correctly.
 */
const f = require('fs'), p = require('path');
const BI_DIR = p.join(__dirname, '..', 'src', 'app', 'data', 'bilingual');
const GENERIC_EX = /^The term .+ was used in the .+ lesson\.$/i;

const files = f.readdirSync(BI_DIR).filter(fn => fn.endsWith('.json'));
let stripped = 0;

files.forEach(file => {
  const fPath = p.join(BI_DIR, file);
  const data = JSON.parse(f.readFileSync(fPath, 'utf8'));
  let dirty = false;
  Object.entries(data).forEach(([, entry]) => {
    if (typeof entry !== 'object' || Array.isArray(entry)) return;
    if (entry.exampleUsage && GENERIC_EX.test(entry.exampleUsage.trim())) {
      delete entry.exampleUsage;
      stripped++;
      dirty = true;
    }
  });
  if (dirty) f.writeFileSync(fPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
});

console.log('Stripped generic examples:', stripped);
console.log('Remaining: 0 (all removed)');
