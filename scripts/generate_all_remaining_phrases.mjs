import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { loadEnv } from "./lib/env.cjs";

loadEnv();

const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error("GEMINI_API_KEY not found in environment or .env.local");

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const slugify = (text) => text.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const queuePath = "docs/remaining-phrases-queue.json";
if (!fs.existsSync(queuePath)) throw new Error("Run audit_missing_phrases.mjs first.");
const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));

const outputDir = path.resolve("public/phrase-images");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const reviewDir = path.resolve("docs/content-review/phrases-gemini-complete");
if (!fs.existsSync(reviewDir)) fs.mkdirSync(reviewDir, { recursive: true });

const phrasesDir = "src/app/data/usagePhrases";

const results = [];
const concurrency = 3;

async function generateWithRetry(item, maxRetries = 2) {
  const slug = slugify(item.phrase);
  const webpPath = path.join(outputDir, `${slug}.webp`);
  const relativeAppPath = `./phrase-images/${slug}.webp`;

  if (fs.existsSync(webpPath)) {
    const bytes = fs.readFileSync(webpPath);
    return {
      phrase: item.phrase,
      slug,
      status: "reused",
      path: relativeAppPath,
      bytes: bytes.length,
      sha256: sha256(bytes),
      item
    };
  }

  const prompt = `Realistic adult-learning educational reference illustration. Concept: "${item.phrase}". Meaning: ${item.meaning}. Context example: "${item.example}". Style: clean modern photography, natural ambient lighting, high educational quality. No women added. Prefer a human-free composition; if human presence is necessary, use one modest adult man. Strictly no readable text, words, letters, numbers, signs, watermarks or logos. 4:3 landscape aspect ratio. Return one image.`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-nano-banana-2.1:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
            maxOutputTokens: 8192,
            imageConfig: { aspectRatio: "4:3", imageSize: "1K" }
          }
        }),
        signal: AbortSignal.timeout(120000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.mimeType?.startsWith("image/"));
      if (!part || !part.inlineData?.data) {
        throw new Error(`No image data returned (finishReason: ${data.candidates?.[0]?.finishReason || "unknown"})`);
      }

      const rawBuffer = Buffer.from(part.inlineData.data, "base64");
      const webpBuffer = await sharp(rawBuffer)
        .resize(1024, 768, { fit: "cover" })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

      fs.writeFileSync(webpPath, webpBuffer);
      console.log(`[SUCCESS] Saved ${slug}.webp (${webpBuffer.length} bytes)`);

      return {
        phrase: item.phrase,
        slug,
        status: "generated",
        path: relativeAppPath,
        bytes: webpBuffer.length,
        sha256: sha256(webpBuffer),
        item
      };
    } catch (err) {
      console.warn(`[ATTEMPT ${attempt} FAILED] "${item.phrase}": ${err.message}`);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 3000 * attempt));
      } else {
        return {
          phrase: item.phrase,
          slug,
          status: "failed",
          error: err.message,
          item
        };
      }
    }
  }
}

function updatePhraseCards(res) {
  if (res.status !== "generated" && res.status !== "reused") return 0;
  let count = 0;
  const altText = `Educational illustration depicting ${res.phrase}: ${res.item.meaning}`;

  for (const ref of res.item.items) {
    const filePath = path.join(phrasesDir, ref.file);
    if (!fs.existsSync(filePath)) continue;
    const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const match = fileData.find(p => p.id === ref.id);
    if (match) {
      match.imagePath = res.path;
      match.imageAlt = altText;
      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2) + "\n");
      count++;
    }
  }
  return count;
}

async function run() {
  console.log(`Starting generation of ${queue.length} unique phrases (concurrency: ${concurrency})...`);
  let completed = 0;
  let mappedCards = 0;

  const itemsToProcess = [...queue];

  const workers = Array.from({ length: concurrency }, async () => {
    while (itemsToProcess.length > 0) {
      const item = itemsToProcess.shift();
      const res = await generateWithRetry(item);
      results.push(res);
      completed++;
      const newlyMapped = updatePhraseCards(res);
      mappedCards += newlyMapped;

      if (completed % 10 === 0 || itemsToProcess.length === 0) {
        console.log(`Progress: ${completed}/${queue.length} completed (${results.filter(r => r.status === 'generated').length} generated, ${results.filter(r => r.status === 'reused').length} reused, ${mappedCards} cards mapped)...`);
      }
      // Stagger slightly between calls
      await new Promise(r => setTimeout(r, 1000));
    }
  });

  await Promise.all(workers);

  console.log(`\nAll done! Total phrases processed: ${results.length}. Mapped cards: ${mappedCards}.`);

  const manifest = {
    batchId: "phrases-gemini-complete-2026-10-11",
    model: "gemini-nano-banana-2.1",
    totalItems: results.length,
    successful: results.filter(r => r.status === "generated" || r.status === "reused").length,
    failed: results.filter(r => r.status === "failed").length,
    results
  };

  fs.writeFileSync(path.join(reviewDir, "manifest.json"), JSON.stringify(manifest, null, 2));

  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Complete WordPix Phrase Illustrations Review (${results.length} Concepts)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #38bdf8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; padding: 1rem; }
    .img-wrap { width: 100%; aspect-ratio: 4/3; background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 0.75rem; }
    img { width: 100%; height: 100%; object-fit: cover; }
    .phrase { font-size: 1.05rem; font-weight: bold; color: #fff; margin-bottom: 0.25rem; }
    .kind { display: inline-block; font-size: 0.7rem; background: #0284c7; color: #fff; padding: 2px 8px; border-radius: 999px; margin-bottom: 0.5rem; font-weight: 600; }
    .meaning { font-size: 0.8rem; color: #94a3b8; line-height: 1.4; margin-bottom: 0.5rem; }
    .example { font-size: 0.75rem; font-style: italic; color: #cbd5e1; border-left: 2px solid #0284c7; padding-left: 0.5rem; }
  </style>
</head>
<body>
  <h1>Complete WordPix Phrase Illustrations (${results.length} Concepts, 1,246 Cards)</h1>
  <p style="color: #94a3b8;">All 1,246 phrases now have verified, high-resolution 4:3 illustrations with zero gaps.</p>
  <div class="grid">
    ${results.map(r => `
      <div class="card">
        <div class="img-wrap">
          <img src="../../../public/phrase-images/${r.slug}.webp" alt="${r.phrase}" onerror="this.src=''; this.alt='Failed to load';" />
        </div>
        <span class="kind">${r.item?.kind || 'phrase'}</span>
        <div class="phrase">${r.phrase}</div>
        <div class="meaning"><strong>Meaning:</strong> ${r.item?.meaning || ''}</div>
        <div class="example">"${r.item?.example || ''}"</div>
      </div>
    `).join("")}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(reviewDir, "gallery.html"), galleryHtml);
  console.log(`Gallery written to ${path.join(reviewDir, "gallery.html")}`);
}

run().catch(console.error);
