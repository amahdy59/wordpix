import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve('.');
const PUBLIC_V2_DIR = path.join(ROOT, 'public/question-images/v2');
const HASHES_PATH = path.join(ROOT, 'output/all_ordered_hashes.json');
const META_PATH = path.join(ROOT, 'output/figma-slides-10015-meta.json');
const REQ_CSV_PATH = path.join(ROOT, 'outputs/next-1000-required-images-2026-10-23/1000-app-image-requirements.csv');
const LIT_CSV_PATH = path.join(ROOT, 'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-literal-scenes-first.csv');
const NEXT_CSV_PATH = path.join(ROOT, 'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-next-3000-image-prompts.csv');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
}

const allOrderedHashes = JSON.parse(fs.readFileSync(HASHES_PATH, 'utf8'));
const meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
const images = meta.meta?.images || meta.images || meta;
const allMetaHashes = Object.keys(images);

const reqRows = parseCSV(fs.readFileSync(REQ_CSV_PATH, 'utf8')).slice(1);
const litRows = parseCSV(fs.readFileSync(LIT_CSV_PATH, 'utf8')).slice(1);
const nextRows = parseCSV(fs.readFileSync(NEXT_CSV_PATH, 'utf8')).slice(1);
const designedRows = nextRows.filter(r => r[4] === 'Designed learning visuals').slice(0, 50);

const capturedSet = new Set(allOrderedHashes);
const remainingLibraryHashes = allMetaHashes.filter(h => !capturedSet.has(h));

console.log({
  orderedSlides: allOrderedHashes.length,
  set1_req: reqRows.length,
  set2_lit: litRows.length,
  set3_designed: designedRows.length,
  set4_library: remainingLibraryHashes.length,
  total: allOrderedHashes.length + remainingLibraryHashes.length
});

// Build items array
const items = [];

for (let i = 0; i < reqRows.length; i++) {
  const row = reqRows[i];
  const sha = allOrderedHashes[i];
  const unit = row[2];
  const lesson = row[4];
  const wordId = row[5];
  const target = row[6];
  const sentence = row[7];
  const assetId = row[8];

  const firstLesson = (lesson || unit || 'lesson-1').split(/[|;,]/)[0].trim();
  const lessonSlug = slugify(firstLesson);
  const wordSlug = slugify(wordId || target || 'item');
  const jobSuffix = crypto.createHash('sha256').update(sentence || target).digest('hex').slice(0, 10);
  const folderName = `sentence-${lessonSlug}-${wordSlug}-${jobSuffix}`;

  items.push({
    index: i + 1,
    slideHash: sha,
    type: 'Set 1: Required App Images (1-1000)',
    title: `${wordId || target}`,
    sentence,
    folderName,
    niceName: `${String(i + 1).padStart(4, '0')}_${lessonSlug}_${wordSlug}.webp`
  });
}

for (let i = 0; i < litRows.length; i++) {
  const row = litRows[i];
  const sha = allOrderedHashes[1000 + i];
  const assetId = row[1];
  const sentence = row[5];
  const targetPhrase = row[6];
  const unit = row[13];
  const lesson = row[14];

  const firstLesson = (lesson || unit || 'lesson-1').split(/[|;,]/)[0].trim();
  const lessonSlug = slugify(firstLesson);
  const targetWords = (targetPhrase || '')
    .split(/[|;,]/)
    .map(s => slugify(s.trim()))
    .filter(Boolean);
  const wordSlug = targetWords[0] || 'item';
  const jobSuffix = crypto.createHash('sha256').update(sentence || targetPhrase).digest('hex').slice(0, 10);
  const folderName = `sentence-${lessonSlug}-${wordSlug}-${jobSuffix}`;

  items.push({
    index: 1000 + i + 1,
    slideHash: sha,
    type: 'Set 2: Literal Sentence Scenes (1001-2263)',
    title: targetPhrase,
    sentence,
    folderName,
    niceName: `${String(1000 + i + 1).padStart(4, '0')}_${assetId}_${slugify(targetPhrase).slice(0, 40)}.webp`
  });
}

for (let i = 0; i < designedRows.length; i++) {
  const row = designedRows[i];
  const sha = allOrderedHashes[2263 + i];
  const assetId = row[1];
  const exactSource = row[5];
  const targetPhrase = row[6];
  const unit = row[13] || 'general';
  const lesson = row[14] || 'general-1';

  const firstLesson = (lesson || unit || 'lesson-1').split(/[|;,]/)[0].trim();
  const lessonSlug = slugify(firstLesson);
  const targetWords = (targetPhrase || '')
    .split(/[|;,]/)
    .map(s => slugify(s.trim()))
    .filter(Boolean);
  const wordSlug = targetWords[0] || 'item';
  const jobSuffix = crypto.createHash('sha256').update(exactSource || targetPhrase).digest('hex').slice(0, 10);
  const folderName = `sentence-${lessonSlug}-${wordSlug}-${jobSuffix}`;

  items.push({
    index: 2263 + i + 1,
    slideHash: sha,
    type: 'Set 3: Designed Learning Visuals (2264-2313)',
    title: targetPhrase,
    sentence: exactSource,
    folderName,
    niceName: `${String(2263 + i + 1).padStart(4, '0')}_${assetId}_${slugify(targetPhrase).slice(0, 40)}.webp`
  });
}

for (let i = 0; i < remainingLibraryHashes.length; i++) {
  const sha = remainingLibraryHashes[i];
  items.push({
    index: 2313 + i + 1,
    slideHash: sha,
    type: 'Set 4: Additional Library Visuals (2314-3411)',
    title: `Library ${sha.slice(0, 8)}`,
    sentence: '',
    folderName: 'library-images',
    fileName: `${sha}.webp`,
    niceName: `${String(2313 + i + 1).padStart(4, '0')}_library_${sha.slice(0, 12)}.webp`
  });
}

console.log(`Total assembled items: ${items.length}`);

// Verify how many source files exist on disk
let foundOnDisk = 0;
let missing = 0;
for (const item of items) {
  const folderPath = path.join(PUBLIC_V2_DIR, item.folderName);
  if (!fs.existsSync(folderPath)) {
    missing++;
    continue;
  }
  if (item.fileName) {
    const filePath = path.join(folderPath, item.fileName);
    if (fs.existsSync(filePath)) foundOnDisk++;
    else missing++;
  } else {
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp'));
    if (files.length > 0) foundOnDisk++;
    else missing++;
  }
}

console.log(`Verification: Found on disk = ${foundOnDisk}, Missing = ${missing}`);
