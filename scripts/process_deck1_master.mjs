#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');

loadEnv();

const ROOT = path.resolve('.');
const SOURCE_DIR = path.join(ROOT, 'output/figma-slides-10015-images');
const PUBLIC_ALL_DECK1_DIR = path.join(ROOT, 'public/question-images/v2/_ALL_3411_DECK1_IMAGES');
const EXACT_MEDIA_PATH = path.join(ROOT, 'src/app/generated/reviewedExactSentenceMedia.json');
const MANIFEST_PATH = path.join(SOURCE_DIR, 'manifest.csv');

fs.mkdirSync(PUBLIC_ALL_DECK1_DIR, { recursive: true });

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

async function retry(fn, maxAttempts = 5) {
  let lastErr;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt === maxAttempts - 1) break;
      await new Promise(r => setTimeout(r, 400 * Math.pow(2, attempt)));
    }
  }
  throw lastErr;
}

async function main() {
  console.log("=== WordPix Deck 1 (3,411 Images) Master Processing & Dual Linking ===");
  const r2 = createClient();
  console.log("Cloudflare R2 client initialized successfully.");

  const rawManifest = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const rows = parseCSV(rawManifest).slice(1);
  console.log(`Loaded ${rows.length} rows from Deck 1 manifest.`);

  const media = JSON.parse(fs.readFileSync(EXACT_MEDIA_PATH, 'utf8'));
  console.log(`Current reviewedExactSentenceMedia count: ${Object.keys(media).length}`);

  let copiedToPublicCount = 0;
  let r2VerifiedCount = 0;
  let r2UploadedCount = 0;
  let dualLinkedIdiomsCount = 0;
  let newRegisteredCount = 0;

  // Step 1: Copy images to public/_ALL_3411_DECK1_IMAGES
  console.log("Ensuring local browsable copies in public/question-images/v2/_ALL_3411_DECK1_IMAGES...");
  for (const r of rows) {
    const filename = r[4];
    const src = path.join(SOURCE_DIR, filename);
    const dest = path.join(PUBLIC_ALL_DECK1_DIR, filename);
    if (!fs.existsSync(dest) && fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      copiedToPublicCount++;
    }
  }
  console.log(`Copied ${copiedToPublicCount} new files to public directory (total files present: ${fs.readdirSync(PUBLIC_ALL_DECK1_DIR).length})`);

  // Step 2: Process linking and dual idiom linking
  console.log("Processing content links, duplicate resolution, and dual idiom linking...");
  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];
    const indexNum = parseInt(r[0], 10);
    const category = r[1];
    const targetTitle = (r[2] || '').trim();
    const sentence = (r[3] || '').trim();
    const filename = r[4];
    const r2Path = r[5];
    const localAppPath = r[6];

    // Extract target words
    const targetWords = targetTitle
      .split(/[|;,]/)
      .map(w => slugify(w.trim()))
      .filter(Boolean);
    const primaryWord = targetWords[0] || 'item';

    // Extract lesson or unit if present in filename
    const parts = filename.split('_');
    const lessonSlug = parts.length > 2 ? slugify(parts[1]) : 'general';
    const jobSuffix = crypto.createHash('sha256').update(sentence || targetTitle || String(indexNum)).digest('hex').slice(0, 10);

    const isLiteralIdiom = category === 'Set 2: Literal Sentence Scenes';

    for (const w of (targetWords.length > 0 ? targetWords : [primaryWord])) {
      const standardKey = `sentence-${lessonSlug}-${w}-${jobSuffix}`;
      const literalKey = `sentence-${lessonSlug}-${w}-${jobSuffix}-literal`;

      // Check if this word/phrase already has an entry in media
      const existingKey = Object.keys(media).find(k => {
        const item = media[k];
        return item.wordId === w && (item.sentence === sentence || k.includes(w));
      });

      if (isLiteralIdiom) {
        // Dual linking for idioms: link BOTH figurative and literal!
        if (existingKey) {
          const existing = media[existingKey];
          // Attach literal image to existing figurative entry's fallbacks
          if (!existing.imageFallbacks) existing.imageFallbacks = [];
          if (!existing.imageFallbacks.some(fb => fb.imagePath === r2Path)) {
            existing.imageFallbacks.push({
              imagePath: r2Path,
              imageAlt: `Literal scene for "${targetTitle}": ${sentence}`,
              kind: 'literal'
            });
          }
          existing.literalImagePath = r2Path;
          existing.literalImageAlt = `Literal scene for "${targetTitle}": ${sentence}`;
          dualLinkedIdiomsCount++;
        }

        // Also register dedicated literal entry
        media[literalKey] = {
          wordId: `${w}-literal`,
          sentence: sentence || `Literal scene: ${targetTitle}`,
          imagePath: r2Path,
          imageAlt: `Literal scene for ${targetTitle}: ${sentence}`,
          literalFor: w
        };
        newRegisteredCount++;
      } else {
        // Regular Set 1 or Set 3/4: Keep better one or register new
        if (existingKey) {
          const existing = media[existingKey];
          // If existing is smaller / older or candidate is better, link candidate as primary
          if (!existing.imagePath || existing.imagePath.includes('placeholder')) {
            existing.imagePath = r2Path;
            existing.imageAlt = sentence || targetTitle;
          } else {
            // Preserve alternate in fallbacks
            if (!existing.imageFallbacks) existing.imageFallbacks = [];
            if (!existing.imageFallbacks.some(fb => fb.imagePath === r2Path)) {
              existing.imageFallbacks.push({
                imagePath: r2Path,
                imageAlt: sentence || targetTitle
              });
            }
          }
        } else {
          // Register fresh entry
          media[standardKey] = {
            wordId: w,
            sentence: sentence || targetTitle,
            imagePath: r2Path,
            imageAlt: sentence || targetTitle
          };
          newRegisteredCount++;
        }
      }
    }
  }

  // Step 3: Write updated reviewedExactSentenceMedia.json
  const totalEntries = Object.keys(media).length;
  console.log(`Writing ${totalEntries} entries to ${EXACT_MEDIA_PATH}...`);
  fs.writeFileSync(EXACT_MEDIA_PATH, JSON.stringify(media, null, 2));

  // Step 4: Write manifest.csv to PUBLIC_ALL_DECK1_DIR
  fs.copyFileSync(MANIFEST_PATH, path.join(PUBLIC_ALL_DECK1_DIR, 'manifest.csv'));

  // Step 5: Write interactive Gallery HTML to PUBLIC_ALL_DECK1_DIR and SOURCE_DIR
  const galleryItems = rows.map(r => ({
    idx: r[0],
    category: r[1],
    target: r[2],
    sentence: (r[3] || '').slice(0, 100),
    file: r[4]
  }));

  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WordPix | Deck 1 (${rows.length} Images)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    header { margin-bottom: 24px; }
    h1 { font-size: 26px; margin: 0 0 8px 0; color: #38bdf8; }
    p { color: #94a3b8; font-size: 14px; margin: 0 0 16px 0; }
    .stats { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .stat-card { background: #1e293b; border: 1px solid #334155; padding: 12px 18px; border-radius: 8px; }
    .stat-val { font-size: 20px; font-weight: 700; color: #38bdf8; }
    .stat-label { font-size: 12px; color: #64748b; }
    .search-box { position: sticky; top: 0; background: #0f172a; padding: 12px 0; z-index: 100; display: flex; gap: 12px; }
    input { flex: 1; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #fff; font-size: 16px; outline: none; }
    input:focus { border-color: #38bdf8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.15s ease; }
    .card:hover { transform: translateY(-3px); border-color: #38bdf8; }
    .card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; background: #0b0f19; }
    .card-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .badges { display: flex; gap: 6px; flex-wrap: wrap; }
    .badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
    .badge-idx { background: #0369a1; color: #e0f2fe; }
    .badge-cat { background: #4338ca; color: #e0e7ff; }
    .target { font-size: 16px; font-weight: 600; color: #f1f5f9; }
    .sentence { font-size: 12px; color: #94a3b8; line-height: 1.4; }
    .meta { font-size: 11px; color: #64748b; font-family: monospace; word-break: break-all; margin-top: auto; padding-top: 8px; }
  </style>
</head>
<body>
  <header>
    <h1>WordPix | Deck 1 (${rows.length} Images)</h1>
    <p>Showing all downloaded, WebP-optimized images from Figma Deck 1 (10,015+ Images).</p>
    <div class="stats">
      <div class="stat-card"><div class="stat-val">${rows.length}</div><div class="stat-label">Total Images</div></div>
      <div class="stat-card"><div class="stat-val">WebP</div><div class="stat-label">Optimized Format</div></div>
      <div class="stat-card"><div class="stat-val">wordpix-media</div><div class="stat-label">Cloudflare R2 Bucket</div></div>
    </div>
  </header>
  <div class="search-box">
    <input type="text" id="filter" placeholder="Search by target title, sentence, category, or index..." oninput="onSearch()">
  </div>
  <div class="grid" id="grid"></div>
  <script>
    const items = ${JSON.stringify(galleryItems)};
    const grid = document.getElementById('grid');
    function render(list) {
      grid.innerHTML = list.slice(0, 300).map(item => \`
        <div class="card">
          <img loading="lazy" src="\${item.file}" alt="\${item.target}">
          <div class="card-body">
            <div class="badges">
              <span class="badge badge-idx">#\${item.idx}</span>
              <span class="badge badge-cat">\${item.category}</span>
            </div>
            <div class="target">\${item.target}</div>
            <div class="sentence">\${item.sentence}</div>
            <div class="meta">\${item.file}</div>
          </div>
        </div>
      \`).join('');
    }
    render(items);
    function onSearch() {
      const q = document.getElementById('filter').value.toLowerCase().trim();
      if (!q) { render(items); return; }
      const filtered = items.filter(it => 
        String(it.idx).includes(q) ||
        it.target.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        it.sentence.toLowerCase().includes(q) ||
        it.file.toLowerCase().includes(q)
      );
      render(filtered);
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC_ALL_DECK1_DIR, 'gallery.html'), galleryHtml);
  fs.writeFileSync(path.join(SOURCE_DIR, 'gallery.html'), galleryHtml);
  console.log("Wrote gallery.html to public and output directories.");

  console.log("\n=== Summary ===");
  console.log(`Deck 1 images processed: ${rows.length}`);
  console.log(`Copied to public folder: ${copiedToPublicCount}`);
  console.log(`Dual-linked idioms: ${dualLinkedIdiomsCount}`);
  console.log(`New entries registered: ${newRegisteredCount}`);
  console.log(`Total exact sentence entries: ${totalEntries}`);
}

main().catch(console.error);
