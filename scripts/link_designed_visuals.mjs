#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');

loadEnv();

const ROOT = path.resolve('.');
const PUBLIC_V2_DIR = path.join(ROOT, 'public/question-images/v2');
const EXACT_MEDIA_PATH = path.join(ROOT, 'src/app/generated/reviewedExactSentenceMedia.json');
const ORDERED_HASHES_PATH = path.join(ROOT, 'output/designed_visuals_ordered_hashes.json');
const CSV_PATH = path.join(ROOT, 'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv');
const SOURCE_WEBP_DIR = path.join(PUBLIC_V2_DIR, 'designed-visuals');

const DEST_OUTPUT_DIR = path.join(ROOT, 'output/figma-designed-visuals-images');
const DEST_PUBLIC_ALL_DIR = path.join(PUBLIC_V2_DIR, '_ALL_1526_DESIGNED_VISUALS');

const CONCURRENCY = 10;

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCSVLine(line) {
  const fields = [];
  let cur = '';
  let inside = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    const n = line[i + 1];
    if (c === '"') {
      if (inside && n === '"') { cur += '"'; i++; }
      else { inside = !inside; }
    } else if (c === ',' && !inside) {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
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
  console.log("=== WordPix Designed Visuals Linking & Upload Orchestrator ===");

  const r2 = createClient();
  console.log("Cloudflare R2 client ready.");

  const orderedHashes = JSON.parse(fs.readFileSync(ORDERED_HASHES_PATH, 'utf8'));
  console.log(`Loaded ${orderedHashes.length} ordered slide hashes.`);

  // Load CSV rows
  const stream = fs.createReadStream(CSV_PATH);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let header = null;
  const designedRows = [];

  for await (const line of rl) {
    if (!header) {
      header = parseCSVLine(line);
      continue;
    }
    const fields = parseCSVLine(line);
    if (fields[4] === 'Designed learning visuals') {
      designedRows.push(fields);
    }
  }
  console.log(`Loaded ${designedRows.length} designed learning visual rows.`);

  if (orderedHashes.length !== designedRows.length) {
    throw new Error(`Count mismatch: hashes=${orderedHashes.length}, rows=${designedRows.length}`);
  }

  // Load existing exact media manifest
  const existingMedia = JSON.parse(fs.readFileSync(EXACT_MEDIA_PATH, 'utf8'));
  console.log(`Existing media entries count: ${Object.keys(existingMedia).length}`);
  const newMedia = { ...existingMedia };

  // Prepare tasks
  const tasks = [];
  for (let i = 0; i < orderedHashes.length; i++) {
    const sha = orderedHashes[i];
    const row = designedRows[i];

    const rank = row[0];
    const assetId = row[1];
    const filename = row[3];
    const exactSource = (row[5] || '').trim();
    const targetPhrase = row[6] || '';
    const meaning = row[7] || '';
    const imgDesc = row[8] || '';
    const unit = row[13] || 'general';
    const lesson = row[14] || 'general-1';
    const contentId = row[15] || '';

    const firstLesson = (lesson || unit || 'lesson-1').split(/[|;,]/)[0].trim();
    const lessonSlug = slugify(firstLesson);

    const targetWords = targetPhrase
      .split(/[|;,]/)
      .map(s => slugify(s.trim()))
      .filter(Boolean);
    const primaryWord = targetWords[0] || 'item';

    const jobSuffix = crypto.createHash('sha256').update(exactSource || targetPhrase).digest('hex').slice(0, 10);
    const folderName = `sentence-${lessonSlug}-${primaryWord}-${jobSuffix}`;
    const niceName = `${String(i + 1).padStart(4, '0')}_${assetId}_${slugify(targetPhrase).slice(0, 35)}.webp`;

    tasks.push({
      index: i + 1,
      sha,
      rank,
      assetId,
      filename,
      exactSource,
      targetPhrase,
      meaning,
      imgDesc,
      unit,
      lesson,
      lessonSlug,
      contentId,
      targetWords,
      primaryWord,
      jobSuffix,
      folderName,
      niceName
    });
  }

  console.log(`Prepared ${tasks.length} tasks.`);

  let cursor = 0;
  let copiedCount = 0;
  let uploadedCount = 0;
  let alreadyR2Count = 0;
  let errorCount = 0;

  const manifestRows = [
    ['Index', 'Asset ID', 'Rank', 'Target Phrase', 'Exact Sentence', 'Unit', 'Lesson', 'Content ID', 'Filename', 'R2 Path', 'Local Path']
  ];

  async function worker(workerId) {
    while (true) {
      let taskIdx;
      synchronized: {
        if (cursor >= tasks.length) return;
        taskIdx = cursor++;
      }

      const task = tasks[taskIdx];
      try {
        const srcWebpPath = path.join(SOURCE_WEBP_DIR, `${task.sha}.webp`);
        if (!fs.existsSync(srcWebpPath)) {
          throw new Error(`Source WebP not found: ${srcWebpPath}`);
        }
        const webpBuffer = fs.readFileSync(srcWebpPath);
        const sha256 = crypto.createHash('sha256').update(webpBuffer).digest('hex');

        // Target paths
        const folderDir = path.join(PUBLIC_V2_DIR, task.folderName);
        if (!fs.existsSync(folderDir)) fs.mkdirSync(folderDir, { recursive: true });
        const localV2Path = path.join(folderDir, `${sha256}.webp`);
        if (!fs.existsSync(localV2Path)) fs.writeFileSync(localV2Path, webpBuffer);

        const outPath = path.join(DEST_OUTPUT_DIR, task.niceName);
        if (!fs.existsSync(outPath)) fs.writeFileSync(outPath, webpBuffer);

        const pubAllPath = path.join(DEST_PUBLIC_ALL_DIR, task.niceName);
        if (!fs.existsSync(pubAllPath)) fs.writeFileSync(pubAllPath, webpBuffer);

        copiedCount++;

        // Upload to R2 under folderName
        const r2Key = `question-images/v2/${task.folderName}/${sha256}.webp`;
        const exists = await retry(() => r2.exists(r2Key));
        if (exists) {
          alreadyR2Count++;
        } else {
          await retry(() => r2.put(r2Key, webpBuffer, { contentType: 'image/webp' }));
          uploadedCount++;
        }

        // Register in newMedia manifest
        if (task.exactSource) {
          const sentencesToRegister = new Set([task.exactSource]);

          if (/\bshe\b/i.test(task.exactSource)) {
            const heSentence = task.exactSource
              .replace(/^She\b/, 'He')
              .replace(/\bshe\b/g, 'he')
              .replace(/\bher\b/g, 'his');
            sentencesToRegister.add(heSentence);
          }

          const wordsToRegister = task.targetWords.length > 0 ? task.targetWords : [task.primaryWord];
          for (const s of sentencesToRegister) {
            for (const w of wordsToRegister) {
              const entryKey = `sentence-${task.lessonSlug}-${w}-${task.jobSuffix}`;
              newMedia[entryKey] = {
                wordId: w,
                sentence: s,
                imagePath: r2Key,
                imageAlt: task.imgDesc || task.exactSource
              };
            }
          }
        }

        manifestRows.push([
          task.index,
          task.assetId,
          task.rank,
          `"${(task.targetPhrase || '').replace(/"/g, '""')}"`,
          `"${(task.exactSource || '').replace(/"/g, '""')}"`,
          task.unit,
          task.lesson,
          task.contentId,
          task.niceName,
          r2Key,
          `public/${r2Key}`
        ]);

        if ((taskIdx + 1) % 100 === 0 || taskIdx === tasks.length - 1) {
          console.log(`[Worker ${workerId}] ${taskIdx + 1}/${tasks.length} processed (R2 uploaded: ${uploadedCount}, Already in R2: ${alreadyR2Count})`);
        }
      } catch (err) {
        errorCount++;
        console.error(`[Worker ${workerId}] Error on item ${task.index}:`, err.message);
      }
    }
  }

  console.log(`Starting ${CONCURRENCY} concurrent workers...`);
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));

  console.log("\n=== Linking & Upload Complete ===");
  console.log(`Total tasks: ${tasks.length}`);
  console.log(`Copied locally: ${copiedCount}`);
  console.log(`Uploaded to R2: ${uploadedCount}`);
  console.log(`Already in R2: ${alreadyR2Count}`);
  console.log(`Errors: ${errorCount}`);

  // Write updated reviewedExactSentenceMedia.json
  const totalEntries = Object.keys(newMedia).length;
  console.log(`Writing ${totalEntries} entries to ${EXACT_MEDIA_PATH}...`);
  fs.writeFileSync(EXACT_MEDIA_PATH, JSON.stringify(newMedia, null, 2));

  // Write Manifest CSVs
  const csvContent = manifestRows.map(r => r.join(',')).join('\n');
  fs.writeFileSync(path.join(DEST_OUTPUT_DIR, 'manifest.csv'), csvContent);
  fs.writeFileSync(path.join(DEST_PUBLIC_ALL_DIR, 'manifest.csv'), csvContent);

  // Write visual Gallery HTML
  const galleryItems = tasks.map(t => ({
    idx: t.index,
    assetId: t.assetId,
    target: t.targetPhrase,
    sentence: t.exactSource,
    unit: t.unit,
    lesson: t.lesson,
    file: t.niceName
  }));

  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WordPix | Designed Visuals (1,526 Items)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    h1 { font-size: 24px; margin-bottom: 8px; color: #38bdf8; }
    p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
    .search-box { position: sticky; top: 0; background: #0f172a; padding: 12px 0; z-index: 100; display: flex; gap: 12px; }
    input { flex: 1; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #fff; font-size: 16px; outline: none; }
    input:focus { border-color: #38bdf8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.15s ease; }
    .card:hover { transform: translateY(-2px); border-color: #38bdf8; }
    .card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; background: #0b0f19; }
    .card-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .badge { align-self: flex-start; font-size: 11px; padding: 2px 8px; border-radius: 4px; background: #0369a1; color: #e0f2fe; font-weight: 600; }
    .title { font-size: 15px; font-weight: 600; color: #f1f5f9; }
    .sentence { font-size: 13px; color: #94a3b8; line-height: 1.4; }
    .meta { font-size: 11px; color: #64748b; font-family: monospace; word-break: break-all; margin-top: auto; padding-top: 8px; }
  </style>
</head>
<body>
  <h1>WordPix | Designed Visuals (1,526 Items)</h1>
  <p>Showing all 1,526 designed visuals linked to sentences and questions in WordPix.</p>
  <div class="search-box">
    <input type="text" id="filter" placeholder="Search by target phrase, sentence, unit, lesson, or index..." oninput="onSearch()">
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
            <span class="badge">#\${item.idx} \${item.assetId} · \${item.lesson}</span>
            <div class="title">\${item.target}</div>
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
        it.assetId.toLowerCase().includes(q) ||
        it.target.toLowerCase().includes(q) ||
        it.sentence.toLowerCase().includes(q) ||
        it.lesson.toLowerCase().includes(q)
      );
      render(filtered);
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(DEST_OUTPUT_DIR, 'gallery.html'), galleryHtml);
  fs.writeFileSync(path.join(DEST_PUBLIC_ALL_DIR, 'gallery.html'), galleryHtml);
  console.log("HTML galleries written successfully!");
}

main().catch(console.error);
