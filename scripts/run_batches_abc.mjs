import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { loadEnv } from "./lib/env.cjs";
import { BATCH_A } from "./batches/batch_a_data.mjs";
import { BATCH_B } from "./batches/batch_b_data.mjs";
import { BATCH_C } from "./batches/batch_c_data.mjs";

loadEnv();

const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error("GEMINI_API_KEY not found in environment or .env.local");

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

const targetBatchArg = process.argv.find((a) => a.startsWith("--batch="));
const selectedBatchName = targetBatchArg ? targetBatchArg.split("=")[1].toUpperCase() : "ALL";

const reviewDir = path.resolve("docs/content-review/batches-abc-2026-10-11");
if (!fs.existsSync(reviewDir)) fs.mkdirSync(reviewDir, { recursive: true });

async function generateItemWithRetry(item, maxRetries = 2) {
  const targetPath = path.resolve(item.targetFile);
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  if (fs.existsSync(targetPath)) {
    const bytes = fs.readFileSync(targetPath);
    console.log(`[REUSED] ${item.id} -> ${item.targetFile} (${bytes.length} bytes)`);
    return {
      id: item.id,
      status: "reused",
      targetFile: item.targetFile,
      bytes: bytes.length,
      sha256: sha256(bytes),
      prompt: item.prompt
    };
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

      // If target file was also requested in another format or location (e.g. conductor.avif)
      if (item.targetFile.endsWith(".webp") && item.alsoAvif) {
        const avifPath = targetPath.replace(/\.webp$/, ".avif");
        const avifBuffer = await sharp(rawBuffer)
          .resize(width, height, { fit: "cover" })
          .avif({ quality: 80, effort: 4 })
          .toBuffer();
        fs.writeFileSync(avifPath, avifBuffer);
        console.log(`[SUCCESS] Also saved AVIF companion -> ${avifPath}`);
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

async function runBatch(name, items, concurrency = 3) {
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

async function main() {
  const allResults = {
    generatedAt: new Date().toISOString(),
    batchA: [],
    batchB: [],
    batchC: []
  };

  if (selectedBatchName === "ALL" || selectedBatchName === "A") {
    allResults.batchA = await runBatch("A", BATCH_A, 3);
  }

  if (selectedBatchName === "ALL" || selectedBatchName === "B") {
    allResults.batchB = await runBatch("B", BATCH_B, 3);
  }

  if (selectedBatchName === "ALL" || selectedBatchName === "C") {
    allResults.batchC = await runBatch("C", BATCH_C, 3);
  }

  const manifestPath = path.join(reviewDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(allResults, null, 2));
  console.log(`\nSaved review manifest to ${manifestPath}`);

  // Build review gallery HTML
  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Batches A, B & C Quality Review</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }
    h1, h2 { color: #38bdf8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 1rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; overflow: hidden; padding: 1rem; display: flex; flex-direction: column; }
    .card img { width: 100%; height: 220px; object-fit: cover; border-radius: 6px; background: #020617; }
    .title { font-weight: bold; margin: 0.75rem 0 0.25rem; color: #e2e8f0; font-size: 1rem; }
    .meta { font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem; }
    .badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
    .badge-ok { background: #065f46; color: #34d399; }
    .badge-fail { background: #881337; color: #fda4af; }
    .prompt { font-size: 0.75rem; color: #cbd5e1; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid #334155; max-height: 80px; overflow-y: auto; }
  </style>
</head>
<body>
  <h1>WordPix Image Quality Review — Batches A, B & C</h1>
  <p>Generated: ${allResults.generatedAt}</p>
  
  <h2>Batch A: Quick Wins & Clarity Fixes (${allResults.batchA.length} items)</h2>
  <div class="grid">
    ${allResults.batchA
      .map(
        (r) => `
      <div class="card">
        <img src="../../../${r.targetFile}" alt="${r.id}" loading="lazy">
        <div class="title">${r.id}</div>
        <div class="meta"><span class="badge ${r.status === "failed" ? "badge-fail" : "badge-ok"}">${r.status.toUpperCase()}</span> ${r.bytes ? `(${Math.round(r.bytes / 1024)} KB)` : ""}</div>
        <div class="prompt">${r.prompt || r.error || ""}</div>
      </div>
    `
      )
      .join("")}
  </div>

  <h2>Batch B: Section & Course Heroes (${allResults.batchB.length} items)</h2>
  <div class="grid">
    ${allResults.batchB
      .map(
        (r) => `
      <div class="card">
        <img src="../../../${r.targetFile}" alt="${r.id}" loading="lazy">
        <div class="title">${r.id}</div>
        <div class="meta"><span class="badge ${r.status === "failed" ? "badge-fail" : "badge-ok"}">${r.status.toUpperCase()}</span> ${r.bytes ? `(${Math.round(r.bytes / 1024)} KB)` : ""}</div>
        <div class="prompt">${r.prompt || r.error || ""}</div>
      </div>
    `
      )
      .join("")}
  </div>

  <h2>Batch C: Core Lesson Ambiguities (${allResults.batchC.length} items)</h2>
  <div class="grid">
    ${allResults.batchC
      .map(
        (r) => `
      <div class="card">
        <img src="../../../${r.targetFile}" alt="${r.id}" loading="lazy">
        <div class="title">${r.id}</div>
        <div class="meta"><span class="badge ${r.status === "failed" ? "badge-fail" : "badge-ok"}">${r.status.toUpperCase()}</span> ${r.bytes ? `(${Math.round(r.bytes / 1024)} KB)` : ""}</div>
        <div class="prompt">${r.prompt || r.error || ""}</div>
      </div>
    `
      )
      .join("")}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(reviewDir, "gallery.html"), galleryHtml);
  console.log(`Saved gallery HTML to ${path.join(reviewDir, "gallery.html")}`);
}

main().catch((err) => {
  console.error("Fatal generation runner error:", err);
  process.exit(1);
});
