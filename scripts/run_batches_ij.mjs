import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { loadEnv } from "./lib/env.cjs";
import { BATCH_I } from "./batches/batch_i_data.mjs";
import { BATCH_J } from "./batches/batch_j_data.mjs";

loadEnv();

const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error("GEMINI_API_KEY not found in environment or .env.local");

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

const targetBatchArg = process.argv.find((a) => a.startsWith("--batch="));
const selectedBatchName = targetBatchArg ? targetBatchArg.split("=")[1].toUpperCase() : "ALL";

const reviewDir = path.resolve("docs/content-review/batches-ij-2026-10-11");
if (!fs.existsSync(reviewDir)) fs.mkdirSync(reviewDir, { recursive: true });

async function generateItemWithRetry(item, maxRetries = 3) {
  const targetPath = path.resolve(item.targetFile);
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const avifPath = targetPath.replace(/\.webp$/, ".avif");

  // Check if real asset already exists (> 2KB)
  if (fs.existsSync(targetPath)) {
    const bytes = fs.readFileSync(targetPath);
    if (bytes.length > 2000) {
      console.log(`[REUSED] ${item.id} -> ${item.targetFile} (${bytes.length} bytes)`);

      // Ensure AVIF companion also exists
      if (item.alsoAvif && (!fs.existsSync(avifPath) || fs.statSync(avifPath).size < 2000)) {
        await sharp(bytes)
          .resize(1024, 768, { fit: "cover" })
          .avif({ quality: 80, effort: 4 })
          .toFile(avifPath);
        console.log(`[AVIF COMPANION CREATED] -> ${avifPath}`);
      }

      return {
        id: item.id,
        status: "reused",
        targetFile: item.targetFile,
        bytes: bytes.length,
        sha256: sha256(bytes),
        prompt: item.prompt
      };
    }
  }

  const width = item.targetWidth || 1024;
  const height = item.targetHeight || 768;
  const aspectRatio = item.aspectRatio || "4:3";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[GENERATING] ${item.id} (attempt ${attempt}/${maxRetries})...`);
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-nano-banana-2.1:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: item.prompt }] }],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"],
              maxOutputTokens: 8192,
              imageConfig: { aspectRatio, imageSize: "1K" }
            }
          }),
          signal: AbortSignal.timeout(120000)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const part = data.candidates?.[0]?.content?.parts?.find((p) =>
        p.inlineData?.mimeType?.startsWith("image/")
      );

      if (!part || !part.inlineData?.data) {
        throw new Error(
          `No image data returned (finishReason: ${data.candidates?.[0]?.finishReason || "unknown"})`
        );
      }

      const rawBuffer = Buffer.from(part.inlineData.data, "base64");
      const webpBuffer = await sharp(rawBuffer)
        .resize(width, height, { fit: "cover" })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

      fs.writeFileSync(targetPath, webpBuffer);
      console.log(`[SAVED WEBP] ${item.id} -> ${item.targetFile} (${webpBuffer.length} bytes)`);

      if (item.alsoAvif) {
        const avifBuffer = await sharp(rawBuffer)
          .resize(width, height, { fit: "cover" })
          .avif({ quality: 80, effort: 4 })
          .toBuffer();
        fs.writeFileSync(avifPath, avifBuffer);
        console.log(`[SAVED AVIF] ${item.id} -> ${avifPath} (${avifBuffer.length} bytes)`);
      }

      return {
        id: item.id,
        status: "generated",
        targetFile: item.targetFile,
        bytes: webpBuffer.length,
        sha256: sha256(webpBuffer),
        prompt: item.prompt
      };
    } catch (err) {
      console.warn(`[ATTEMPT ${attempt} FAILED] "${item.id}": ${err.message}`);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 4000 * attempt));
      } else {
        return {
          id: item.id,
          status: "failed",
          targetFile: item.targetFile,
          error: err.message,
          prompt: item.prompt
        };
      }
    }
  }
}

async function runBatch(batchName, batchItems, concurrency = 2) {
  console.log(`\n========================================`);
  console.log(`Starting Batch ${batchName}: ${batchItems.length} items (concurrency: ${concurrency})`);
  console.log(`========================================\n`);

  const results = [];
  const queue = [...batchItems];

  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      const res = await generateItemWithRetry(item);
      results.push(res);
      // Brief stagger between calls to avoid hitting burst rate limits
      await new Promise((r) => setTimeout(r, 1500));
    }
  });

  await Promise.all(workers);

  const successful = results.filter((r) => r.status === "generated" || r.status === "reused").length;
  const failed = results.filter((r) => r.status === "failed").length;
  console.log(`\nBatch ${batchName} Complete! OK: ${successful}, Failed: ${failed}`);
  return results;
}

async function main() {
  const allResults = {};

  if (selectedBatchName === "I" || selectedBatchName === "ALL") {
    allResults.batchI = await runBatch("I", BATCH_I, 2);
  }
  if (selectedBatchName === "J" || selectedBatchName === "ALL") {
    allResults.batchJ = await runBatch("J", BATCH_J, 2);
  }

  // Compile full manifest
  const manifest = {
    runDate: new Date().toISOString(),
    selectedBatch: selectedBatchName,
    summary: {
      batchI: allResults.batchI ? { total: allResults.batchI.length, failed: allResults.batchI.filter(r => r.status === 'failed').length } : null,
      batchJ: allResults.batchJ ? { total: allResults.batchJ.length, failed: allResults.batchJ.filter(r => r.status === 'failed').length } : null,
    },
    ...allResults
  };

  const manifestPath = path.join(reviewDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to ${manifestPath}`);

  // Generate review gallery HTML
  const allItems = [
    ...(allResults.batchI || []),
    ...(allResults.batchJ || [])
  ];

  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WordPix Batches I & J Review Gallery (${allItems.length} Scenes)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #38bdf8; }
    p.sub { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; padding: 1rem; display: flex; flex-direction: column; }
    .img-wrap { width: 100%; aspect-ratio: 4/3; background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 0.75rem; border: 1px solid #334155; }
    img { width: 100%; height: 100%; object-fit: cover; }
    .title { font-size: 1rem; font-weight: bold; color: #f1f5f9; margin-bottom: 0.25rem; }
    .target { font-size: 0.75rem; color: #0ea5e9; font-family: monospace; margin-bottom: 0.5rem; word-break: break-all; }
    .prompt { font-size: 0.75rem; color: #94a3b8; line-height: 1.4; flex-grow: 1; }
    .badge { display: inline-block; font-size: 0.7rem; padding: 2px 8px; border-radius: 999px; margin-bottom: 0.5rem; font-weight: 600; width: fit-content; }
    .badge-ok { background: #059669; color: #fff; }
    .badge-fail { background: #dc2626; color: #fff; }
  </style>
</head>
<body>
  <h1>WordPix Batches I & J Review Gallery</h1>
  <p class="sub">51 Flagged Exercise Scenes (Household, Kitchen, Produce, Anatomy, Math & Reading) — Generated in dual WebP and AVIF formats.</p>
  <div class="grid">
    ${allItems.map(it => {
      const relPath = "../../../" + it.targetFile;
      const ok = it.status === 'generated' || it.status === 'reused';
      return `
      <div class="card">
        <div class="img-wrap">
          <img src="${relPath}" alt="${it.id}" onerror="this.src=''; this.alt='Image not found';" />
        </div>
        <span class="badge ${ok ? 'badge-ok' : 'badge-fail'}">${it.status.toUpperCase()}</span>
        <div class="title">${it.id}</div>
        <div class="target">${it.targetFile}</div>
        <div class="prompt">${it.prompt || ''}</div>
      </div>
      `;
    }).join("")}
  </div>
</body>
</html>`;

  const galleryPath = path.join(reviewDir, "gallery.html");
  fs.writeFileSync(galleryPath, galleryHtml);
  console.log(`Gallery written to ${galleryPath}`);
}

main().catch(console.error);
