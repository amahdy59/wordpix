#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');

loadEnv();

const ROOT = path.resolve('.');
const TASKS_PATH = path.join(ROOT, 'output/deck3_tasks.json');
const EXACT_MEDIA_PATH = path.join(ROOT, 'src/app/generated/reviewedExactSentenceMedia.json');

const DEST_OUTPUT_DIR = path.join(ROOT, 'output/figma-deck3-images');
const PUBLIC_ALL_DIR = path.join(ROOT, 'public/question-images/v2/_ALL_3469_DECK3_IMAGES');
const PUBLIC_CONTEXT_DIR = path.join(ROOT, 'public/question-images/v2/context-scenes');
const PUBLIC_V2_DIR = path.join(ROOT, 'public/question-images/v2');

fs.mkdirSync(DEST_OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_ALL_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_CONTEXT_DIR, { recursive: true });

const CONCURRENCY = 12;

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
  console.log("=== WordPix Deck 3 (3,469 Images) Master Sync & Upload ===");
  const r2 = createClient();
  console.log("Cloudflare R2 client initialized successfully.");

  const tasks = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf8'));
  console.log(`Loaded ${tasks.length} tasks from ${TASKS_PATH}.`);

  const existingMedia = JSON.parse(fs.readFileSync(EXACT_MEDIA_PATH, 'utf8'));
  console.log(`Current reviewedExactSentenceMedia entries: ${Object.keys(existingMedia).length}`);
  const newMedia = { ...existingMedia };

  let cursor = 0;
  let downloadedCount = 0;
  let uploadedCount = 0;
  let alreadyR2Count = 0;
  let errorCount = 0;

  const manifestItems = [];

  async function worker(workerId) {
    while (true) {
      let taskIdx;
      synchronized: {
        if (cursor >= tasks.length) return;
        taskIdx = cursor++;
      }

      const task = tasks[taskIdx];

      try {
        // Download raw image
        const rawRes = await retry(async () => {
          const res = await fetch(task.url);
          if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${task.url}`);
          return Buffer.from(await res.arrayBuffer());
        });
        downloadedCount++;

        // Optimize with Sharp
        const webpBuffer = await sharp(rawRes)
          .resize({ width: 1536, height: 1152, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 5 })
          .toBuffer();

        const sha256 = crypto.createHash('sha256').update(webpBuffer).digest('hex');

        // Construct slugified folder & nice filename
        const firstLesson = (task.lesson || task.unit || 'general').split(/[|;,]/)[0].trim();
        const lessonSlug = slugify(firstLesson);
        const targetWords = (task.targetPhrase || '')
          .split(/[|;,]/)
          .map(s => slugify(s.trim()))
          .filter(Boolean);
        const primaryWord = targetWords[0] || 'scene';
        const jobSuffix = crypto.createHash('sha256').update(task.exactSource || task.targetPhrase || String(task.index)).digest('hex').slice(0, 10);
        const folderName = `sentence-${lessonSlug}-${primaryWord}-${jobSuffix}`;

        const niceName = `${String(task.index).padStart(4, '0')}_${task.assetId}_${slugify(task.targetPhrase).slice(0, 35) || 'visual'}.webp`;
        const shaFilename = `${task.sha}.webp`;
        const contextFilename = `${sha256}.webp`;

        // Save local copies
        // 1. Output directory
        const outNicePath = path.join(DEST_OUTPUT_DIR, niceName);
        const outShaPath = path.join(DEST_OUTPUT_DIR, shaFilename);
        if (!fs.existsSync(outNicePath)) fs.writeFileSync(outNicePath, webpBuffer);
        if (!fs.existsSync(outShaPath)) fs.writeFileSync(outShaPath, webpBuffer);

        // 2. Public _ALL_3469_DECK3_IMAGES directory
        const pubNicePath = path.join(PUBLIC_ALL_DIR, niceName);
        const pubShaPath = path.join(PUBLIC_ALL_DIR, shaFilename);
        if (!fs.existsSync(pubNicePath)) fs.writeFileSync(pubNicePath, webpBuffer);
        if (!fs.existsSync(pubShaPath)) fs.writeFileSync(pubShaPath, webpBuffer);

        // 3. Public context-scenes directory
        const pubContextPath = path.join(PUBLIC_CONTEXT_DIR, contextFilename);
        if (!fs.existsSync(pubContextPath)) fs.writeFileSync(pubContextPath, webpBuffer);

        // 4. Linked sentence folder
        const linkedFolderDir = path.join(PUBLIC_V2_DIR, folderName);
        if (!fs.existsSync(linkedFolderDir)) fs.mkdirSync(linkedFolderDir, { recursive: true });
        const linkedFilePath = path.join(linkedFolderDir, contextFilename);
        if (!fs.existsSync(linkedFilePath)) fs.writeFileSync(linkedFilePath, webpBuffer);

        // R2 Uploads
        const r2KeyContext = `question-images/v2/context-scenes/${contextFilename}`;
        const r2KeySlide = `question-images/v2/deck3-slides/${shaFilename}`;
        const r2KeySentence = `question-images/v2/${folderName}/${contextFilename}`;

        // Upload context scene
        const existsContext = await retry(() => r2.exists(r2KeyContext));
        if (existsContext) {
          alreadyR2Count++;
        } else {
          await retry(() => r2.put(r2KeyContext, webpBuffer, { contentType: 'image/webp' }));
          uploadedCount++;
        }

        // Upload sentence path
        const existsSentence = await retry(() => r2.exists(r2KeySentence));
        if (!existsSentence) {
          await retry(() => r2.put(r2KeySentence, webpBuffer, { contentType: 'image/webp' }));
        }

        // Register in newMedia manifest
        if (task.exactSource || task.targetPhrase) {
          const sentencesToRegister = new Set([task.exactSource || task.targetPhrase]);
          if (task.exactSource && /\bshe\b/i.test(task.exactSource)) {
            const heSentence = task.exactSource
              .replace(/^She\b/, 'He')
              .replace(/\bshe\b/g, 'he')
              .replace(/\bher\b/g, 'his');
            sentencesToRegister.add(heSentence);
          }

          const wordsToRegister = targetWords.length > 0 ? targetWords : [primaryWord];
          for (const s of sentencesToRegister) {
            for (const w of wordsToRegister) {
              const entryKey = `sentence-${lessonSlug}-${w}-${jobSuffix}`;
              newMedia[entryKey] = {
                wordId: w,
                sentence: s,
                imagePath: r2KeySentence,
                imageAlt: task.description || task.exactSource || task.targetPhrase
              };
            }
          }
        }

        manifestItems.push({
          index: task.index,
          family: task.family,
          assetId: task.assetId,
          rank: task.rank,
          targetPhrase: task.targetPhrase,
          exactSentence: task.exactSource,
          unit: task.unit,
          lesson: task.lesson,
          contentId: task.contentId,
          niceName,
          sha: task.sha,
          sha256,
          size: webpBuffer.length,
          r2Key: r2KeySentence,
          localPath: `public/${r2KeySentence}`
        });

        if ((taskIdx + 1) % 100 === 0 || taskIdx === tasks.length - 1) {
          console.log(`[Progress] ${taskIdx + 1}/${tasks.length} processed (R2 uploaded: ${uploadedCount}, Already in R2: ${alreadyR2Count}, Errors: ${errorCount})`);
        }
      } catch (err) {
        errorCount++;
        console.error(`[Worker ${workerId}] Error on item ${task.index} (${task.sha}):`, err.message);
      }
    }
  }

  console.log(`Launching ${CONCURRENCY} concurrent download & upload workers...`);
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));

  console.log("\n=== Master Processing Complete ===");
  console.log(`Total tasks: ${tasks.length}`);
  console.log(`Downloaded & optimized: ${downloadedCount}`);
  console.log(`Uploaded to R2: ${uploadedCount}`);
  console.log(`Already in R2: ${alreadyR2Count}`);
  console.log(`Errors: ${errorCount}`);

  // Sort manifest items by index
  manifestItems.sort((a, b) => a.index - b.index);

  // Write updated reviewedExactSentenceMedia.json
  const totalEntries = Object.keys(newMedia).length;
  console.log(`Writing ${totalEntries} entries to ${EXACT_MEDIA_PATH}...`);
  fs.writeFileSync(EXACT_MEDIA_PATH, JSON.stringify(newMedia, null, 2));

  // Write Manifest CSVs
  const csvRows = [
    ['Index', 'Family', 'Asset ID', 'Rank', 'Target Phrase', 'Exact Sentence', 'Unit', 'Lesson', 'Content ID', 'Filename', 'Figma SHA', 'WebP SHA256', 'Size (bytes)', 'R2 Path', 'Local Path']
  ];
  for (const it of manifestItems) {
    csvRows.push([
      it.index,
      it.family,
      it.assetId,
      it.rank,
      `"${(it.targetPhrase || '').replace(/"/g, '""')}"`,
      `"${(it.exactSentence || '').replace(/"/g, '""')}"`,
      it.unit,
      it.lesson,
      it.contentId,
      it.niceName,
      it.sha,
      it.sha256,
      it.size,
      it.r2Key,
      it.localPath
    ]);
  }
  const csvContent = csvRows.map(r => r.join(',')).join('\n');
  fs.writeFileSync(path.join(DEST_OUTPUT_DIR, 'manifest.csv'), csvContent);
  fs.writeFileSync(path.join(PUBLIC_ALL_DIR, 'manifest.csv'), csvContent);
  console.log("Wrote manifest.csv to output and public directories.");

  // Write interactive visual Gallery HTML
  const galleryItems = manifestItems.map(t => ({
    idx: t.index,
    family: t.family,
    assetId: t.assetId,
    target: t.targetPhrase,
    unit: t.unit,
    sentence: (t.exactSentence || '').slice(0, 100),
    file: t.niceName,
    size: (t.size / 1024).toFixed(1) + ' KB'
  }));

  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WordPix | 10,015+ Images Deck 3 (${manifestItems.length} Visuals)</title>
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
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.15s ease; }
    .card:hover { transform: translateY(-3px); border-color: #38bdf8; }
    .card img { width: 100%; aspect-ratio: 1584/672; object-fit: cover; background: #0b0f19; }
    .card-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .badges { display: flex; gap: 6px; flex-wrap: wrap; }
    .badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
    .badge-idx { background: #0369a1; color: #e0f2fe; }
    .badge-family { background: #4338ca; color: #e0e7ff; }
    .badge-unit { background: #047857; color: #d1fae5; }
    .target { font-size: 16px; font-weight: 600; color: #f1f5f9; }
    .sentence { font-size: 12px; color: #94a3b8; line-height: 1.4; }
    .meta { font-size: 11px; color: #64748b; font-family: monospace; word-break: break-all; margin-top: auto; padding-top: 8px; }
  </style>
</head>
<body>
  <header>
    <h1>WordPix | Deck 3 (${manifestItems.length} Images)</h1>
    <p>Showing all downloaded, WebP-optimized images uploaded to Cloudflare R2 (bucket: wordpix-media) and linked in WordPix.</p>
    <div class="stats">
      <div class="stat-card"><div class="stat-val">${manifestItems.length}</div><div class="stat-label">Total Images</div></div>
      <div class="stat-card"><div class="stat-val">WebP (q=80)</div><div class="stat-label">Format & Quality</div></div>
      <div class="stat-card"><div class="stat-val">1584 × 672</div><div class="stat-label">Native Cinematic Cover</div></div>
      <div class="stat-card"><div class="stat-val">wordpix-media</div><div class="stat-label">Cloudflare R2 Bucket</div></div>
    </div>
  </header>
  <div class="search-box">
    <input type="text" id="filter" placeholder="Search by target phrase, unit, index, family, or filename..." oninput="onSearch()">
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
              <span class="badge badge-family">\${item.family}</span>
              <span class="badge badge-unit">\${item.unit}</span>
            </div>
            <div class="target">\${item.target}</div>
            <div class="sentence">\${item.sentence}</div>
            <div class="meta">\${item.file} (\${item.size})</div>
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
        it.unit.toLowerCase().includes(q) ||
        it.family.toLowerCase().includes(q) ||
        it.file.toLowerCase().includes(q)
      );
      render(filtered);
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(DEST_OUTPUT_DIR, 'gallery.html'), galleryHtml);
  fs.writeFileSync(path.join(PUBLIC_ALL_DIR, 'gallery.html'), galleryHtml);
  console.log("Wrote interactive visual gallery.html to output and public directories.");
}

main().catch(console.error);
