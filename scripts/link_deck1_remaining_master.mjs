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
const ORDERED_PATH = path.join(ROOT, 'output/deck1_full_ordered_hashes.json');
const CSV_PATH = path.join(ROOT, 'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv');
const EXACT_MEDIA_PATH = path.join(ROOT, 'src/app/generated/reviewedExactSentenceMedia.json');

const orderedHashes = JSON.parse(fs.readFileSync(ORDERED_PATH, 'utf8'));
const allRows = parseCSV(fs.readFileSync(CSV_PATH, 'utf8')).slice(1);
const media = JSON.parse(fs.readFileSync(EXACT_MEDIA_PATH, 'utf8'));

console.log(`Starting media entries count: ${Object.keys(media).length}`);

let newlyAddedEntries = 0;
let enrichedExisting = 0;

// Slides 2313 to 9637 (indices in orderedHashes)
for (let slideIdx = 2313; slideIdx < orderedHashes.length; slideIdx++) {
  const sha = orderedHashes[slideIdx];
  const rowIdx = slideIdx - 1000;
  if (rowIdx >= allRows.length) break;

  const row = allRows[rowIdx];
  const exactSource = (row[5] || '').trim();
  const targetPhrase = (row[6] || '').trim();
  const unit = row[13] || 'general';
  const lesson = (row[14] || unit || 'general-1').split(/[|;,]/)[0].trim();
  const lessonSlug = slugify(lesson);

  const targetWords = targetPhrase
    .split(/[|;,]/)
    .map(w => slugify(w.trim()))
    .filter(Boolean);

  if (targetWords.length === 0 || !exactSource) continue;

  const jobSuffix = crypto.createHash('sha256').update(exactSource || targetPhrase).digest('hex').slice(0, 10);
  const r2Key = `question-images/v2/library-images/${sha}.webp`;
  const altText = row[8] ? (row[8].slice(0, 150) + '...') : (exactSource || targetPhrase);

  const sentencesToRegister = new Set([exactSource]);
  if (/\bshe\b/i.test(exactSource)) {
    const heSentence = exactSource
      .replace(/^She\b/, 'He')
      .replace(/\bshe\b/g, 'he')
      .replace(/\bher\b/g, 'his');
    sentencesToRegister.add(heSentence);
  }

  for (const s of sentencesToRegister) {
    for (const w of targetWords) {
      const entryKey = `sentence-${lessonSlug}-${w}-${jobSuffix}`;

      if (media[entryKey]) {
        // Enrich existing entry
        const existing = media[entryKey];
        if (!existing.imagePath) {
          existing.imagePath = r2Key;
          existing.imageAlt = altText;
        } else {
          if (!existing.imageFallbacks) existing.imageFallbacks = [];
          if (!existing.imageFallbacks.some(fb => fb.imagePath === r2Key)) {
            existing.imageFallbacks.push({
              imagePath: r2Key,
              imageAlt: altText
            });
          }
        }
        enrichedExisting++;
      } else {
        // Register new entry
        media[entryKey] = {
          wordId: w,
          sentence: s,
          imagePath: r2Key,
          imageAlt: altText
        };
        newlyAddedEntries++;
      }
    }
  }
}

console.log(`Newly registered entries: ${newlyAddedEntries}`);
console.log(`Enriched existing entries: ${enrichedExisting}`);
console.log(`Total media entries now: ${Object.keys(media).length}`);

// Write updated JSON
fs.writeFileSync(EXACT_MEDIA_PATH, JSON.stringify(media, null, 2));
console.log(`Successfully updated ${EXACT_MEDIA_PATH}.`);

const report = {
  totalSlidesInDeck: orderedHashes.length,
  slidesLinkedThisRun: orderedHashes.length - 2313,
  newlyAddedEntries,
  enrichedExisting,
  finalMediaCount: Object.keys(media).length,
  timestamp: new Date().toISOString()
};
fs.writeFileSync('output/deck1_remaining_linkage_report.json', JSON.stringify(report, null, 2));
console.log(`Saved report to output/deck1_remaining_linkage_report.json.`);
