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
const META_PATH = path.join(ROOT, 'output/figma-designed-visuals-meta.json');
const DEST_OUTPUT_DIR = path.join(ROOT, 'output/figma-designed-visuals-images');
const PUBLIC_DESIGNED_DIR = path.join(ROOT, 'public/question-images/v2/designed-visuals');
const PUBLIC_ALL_DIR = path.join(ROOT, 'public/question-images/v2/_ALL_1526_DESIGNED_VISUALS');

fs.mkdirSync(DEST_OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DESIGNED_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_ALL_DIR, { recursive: true });

const CONCURRENCY = 10;

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
  console.log("=== WordPix Figma Designed Visuals (1,526 Images) Sync ===");
  const r2 = createClient();
  console.log("Cloudflare R2 client initialized.");

  const meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
  const images = meta.meta?.images || meta.images || meta;
  const hashes = Object.keys(images);
  console.log(`Total images to process: ${hashes.length}`);

  let cursor = 0;
  let downloadedCount = 0;
  let uploadedCount = 0;
  let alreadyR2Count = 0;
  let errorCount = 0;

  const manifestItems = [];

  async function worker(workerId) {
    while (true) {
      let idx;
      synchronized: {
        if (cursor >= hashes.length) return;
        idx = cursor++;
      }

      const sha = hashes[idx];
      const url = images[sha];

      try {
        const rawRes = await retry(async () => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
          return Buffer.from(await res.arrayBuffer());
        });
        downloadedCount++;

        // Optimize with Sharp
        const webpBuffer = await sharp(rawRes)
          .resize({ width: 1536, height: 1152, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 5 })
          .toBuffer();

        const sha256 = crypto.createHash('sha256').update(webpBuffer).digest('hex');
        const filename = `${sha}.webp`;
        const r2Key = `question-images/v2/designed-visuals/${filename}`;

        // Save local copies
        const p1 = path.join(PUBLIC_DESIGNED_DIR, filename);
        const p2 = path.join(DEST_OUTPUT_DIR, filename);
        const p3 = path.join(PUBLIC_ALL_DIR, filename);

        if (!fs.existsSync(p1)) fs.writeFileSync(p1, webpBuffer);
        if (!fs.existsSync(p2)) fs.writeFileSync(p2, webpBuffer);
        if (!fs.existsSync(p3)) fs.writeFileSync(p3, webpBuffer);

        // Upload to R2
        const exists = await retry(() => r2.exists(r2Key));
        if (exists) {
          alreadyR2Count++;
        } else {
          await retry(() => r2.put(r2Key, webpBuffer, { contentType: 'image/webp' }));
          uploadedCount++;
        }

        manifestItems.push({
          index: idx + 1,
          sha,
          sha256,
          filename,
          size: webpBuffer.length,
          r2Key,
          localPath: `public/${r2Key}`
        });

        if ((idx + 1) % 50 === 0 || idx === hashes.length - 1) {
          console.log(`[Progress] ${idx + 1}/${hashes.length} processed (Uploaded: ${uploadedCount}, Already in R2: ${alreadyR2Count})`);
        }
      } catch (err) {
        errorCount++;
        console.error(`[Worker ${workerId}] Error on ${sha}:`, err.message);
      }
    }
  }

  console.log(`Starting ${CONCURRENCY} concurrent workers...`);
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));

  console.log("\n=== Download & Upload Summary ===");
  console.log(`Total: ${hashes.length}`);
  console.log(`Downloaded: ${downloadedCount}`);
  console.log(`Uploaded to R2: ${uploadedCount}`);
  console.log(`Already in R2: ${alreadyR2Count}`);
  console.log(`Errors: ${errorCount}`);

  // Sort manifest items
  manifestItems.sort((a, b) => a.index - b.index);

  // Write manifest CSV
  const csvRows = [
    ['Index', 'Figma SHA', 'WebP SHA256', 'Filename', 'File Size (bytes)', 'R2 Key', 'Local Path']
  ];
  for (const item of manifestItems) {
    csvRows.push([item.index, item.sha, item.sha256, item.filename, item.size, item.r2Key, item.localPath]);
  }
  const csvContent = csvRows.map(r => r.join(',')).join('\n');
  fs.writeFileSync(path.join(DEST_OUTPUT_DIR, 'manifest.csv'), csvContent);
  fs.writeFileSync(path.join(PUBLIC_ALL_DIR, 'manifest.csv'), csvContent);

  // Write interactive Gallery HTML
  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WordPix | Designed Visuals (1,526 Images)</title>
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
    .meta { font-size: 11px; color: #64748b; font-family: monospace; word-break: break-all; margin-top: auto; padding-top: 8px; }
  </style>
</head>
<body>
  <h1>WordPix | Designed Visuals (1,526 Images)</h1>
  <p>Showing all 1,526 downloaded, WebP-optimized images uploaded to Cloudflare R2 (bucket: wordpix-media).</p>
  <div class="search-box">
    <input type="text" id="filter" placeholder="Search by image hash or filename..." oninput="onSearch()">
  </div>
  <div class="grid" id="grid"></div>
  <script>
    const items = ${JSON.stringify(manifestItems.map(it => ({
      idx: it.index,
      sha: it.sha,
      file: it.filename,
      size: (it.size / 1024).toFixed(1) + ' KB'
    })))};
    const grid = document.getElementById('grid');
    function render(list) {
      grid.innerHTML = list.slice(0, 300).map(item => \`
        <div class="card">
          <img loading="lazy" src="\${item.file}" alt="\${item.sha}">
          <div class="card-body">
            <span class="badge">#\${item.idx}</span>
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
        it.sha.toLowerCase().includes(q) ||
        it.file.toLowerCase().includes(q)
      );
      render(filtered);
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(DEST_OUTPUT_DIR, 'gallery.html'), galleryHtml);
  fs.writeFileSync(path.join(PUBLIC_ALL_DIR, 'gallery.html'), galleryHtml);
  console.log("HTML galleries written successfully!");
}

main().catch(console.error);
