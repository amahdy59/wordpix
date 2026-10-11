import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { loadEnv } from "./lib/env.cjs";
import { BATCH_E } from "./batches/batch_e_data.mjs";
import { BATCH_F } from "./batches/batch_f_data.mjs";
import { BATCH_G } from "./batches/batch_g_data.mjs";
import { BATCH_H } from "./batches/batch_h_data.mjs";

loadEnv();

const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error("GEMINI_API_KEY not found in environment or .env.local");

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

const targetBatchArg = process.argv.find((a) => a.startsWith("--batch="));
const selectedBatchName = targetBatchArg ? targetBatchArg.split("=")[1].toUpperCase() : "ALL";

const reviewDir = path.resolve("docs/content-review/batches-efgh-2026-10-11");
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
      console.log(`[SUCCESS] Saved ${item.id} -> ${item.targetFile} (${webpBuffer.length} bytes)`);

      // Save AVIF companion
      if (item.alsoAvif) {
        const avifBuffer = await sharp(rawBuffer)
          .resize(width, height, { fit: "cover" })
          .avif({ quality: 80, effort: 4 })
          .toBuffer();
        fs.writeFileSync(avifPath, avifBuffer);
        console.log(`[SUCCESS] Also saved AVIF companion -> ${avifPath} (${avifBuffer.length} bytes)`);
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
      console.warn(`[ATTEMPT ${attempt} FAILED] ${item.id}: ${err.message}`);
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

async function runBatch(name, items, concurrency = 4) {
  console.log(`\n========================================`);
  console.log(`  STARTING BATCH ${name} (${items.length} items)`);
  console.log(`========================================\n`);

  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map((item) => generateItemWithRetry(item)));
    results.push(...chunkResults);
    console.log(`Completed ${results.length}/${items.length} items in Batch ${name}...`);
  }

  const success = results.filter((r) => r.status === "generated" || r.status === "reused");
  const failed = results.filter((r) => r.status === "failed");
  console.log(`\nBatch ${name} Summary: ${success.length} OK, ${failed.length} Failed.`);
  return results;
}

function buildGallery(manifest) {
  const allItems = [
    ...manifest.batchE.map((it) => ({ ...it, batch: "Batch E (Pedagogical Scenes)" })),
    ...manifest.batchF.map((it) => ({ ...it, batch: "Batch F (Curriculum Heroes 1)" })),
    ...manifest.batchG.map((it) => ({ ...it, batch: "Batch G (Curriculum Heroes 2)" })),
    ...manifest.batchH.map((it) => ({ ...it, batch: "Batch H (Curriculum Heroes 3)" }))
  ];

  const cardsHtml = allItems
    .map((item) => {
      const relPath = path.relative(reviewDir, path.resolve(item.targetFile)).replace(/\\/g, "/");
      const isFailed = item.status === "failed";
      return `
      <div class="card ${isFailed ? "failed" : ""}">
        <div class="batch-badge">${item.batch}</div>
        ${
          !isFailed
            ? `<img src="${relPath}" alt="${item.id}" loading="lazy" />`
            : `<div class="error-box">Failed: ${item.error}</div>`
        }
        <div class="card-info">
          <h3>${item.id}</h3>
          <p class="file-path">${item.targetFile}</p>
          <p class="prompt-text">${item.prompt}</p>
          <div class="meta">Status: <strong>${item.status}</strong> ${
        item.bytes ? `• ${(item.bytes / 1024).toFixed(1)} KB` : ""
      }</div>
        </div>
      </div>
    `;
    })
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WordPix Batches E, F, G, H Visual Inspection Gallery</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }
    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .subtitle { color: #94a3b8; margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; }
    .card { background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; display: flex; flex-direction: column; position: relative; }
    .card.failed { border-color: #ef4444; }
    .batch-badge { position: absolute; top: 12px; left: 12px; background: rgba(15, 23, 42, 0.85); color: #38bdf8; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; backdrop-filter: blur(4px); }
    img { width: 100%; aspect-ratio: 4/3; object-fit: cover; background: #020617; }
    .error-box { width: 100%; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; background: #450a0a; color: #f87171; padding: 1rem; text-align: center; }
    .card-info { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }
    h3 { margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #38bdf8; }
    .file-path { font-family: monospace; font-size: 0.8rem; color: #64748b; margin: 0 0 0.75rem 0; word-break: break-all; }
    .prompt-text { font-size: 0.85rem; color: #cbd5e1; line-height: 1.4; margin: 0 0 1rem 0; flex: 1; }
    .meta { font-size: 0.8rem; color: #94a3b8; border-top: 1px solid #334155; padding-top: 0.75rem; }
  </style>
</head>
<body>
  <h1>WordPix Batches E, F, G, H Visual Inspection Gallery</h1>
  <div class="subtitle">Generated on ${manifest.generatedAt} • Total Assets: ${allItems.length}</div>
  <div class="grid">
    ${cardsHtml}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(reviewDir, "gallery.html"), html);
  console.log(`Saved visual gallery to ${path.join(reviewDir, "gallery.html")}`);
}

async function main() {
  const allResults = {
    generatedAt: new Date().toISOString(),
    batchE: [],
    batchF: [],
    batchG: [],
    batchH: []
  };

  if (selectedBatchName === "E" || selectedBatchName === "ALL") {
    allResults.batchE = await runBatch("E", BATCH_E);
  }
  if (selectedBatchName === "F" || selectedBatchName === "ALL") {
    allResults.batchF = await runBatch("F", BATCH_F);
  }
  if (selectedBatchName === "G" || selectedBatchName === "ALL") {
    allResults.batchG = await runBatch("G", BATCH_G);
  }
  if (selectedBatchName === "H" || selectedBatchName === "ALL") {
    allResults.batchH = await runBatch("H", BATCH_H);
  }

  const manifestPath = path.join(reviewDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(allResults, null, 2));
  console.log(`\nSaved manifest to ${manifestPath}`);

  buildGallery(allResults);
  console.log("\nPipeline completed successfully!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
