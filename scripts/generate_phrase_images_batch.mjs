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

const candidatesPath = "docs/phrase-batch-01-candidates.json";
if (!fs.existsSync(candidatesPath)) throw new Error("Run prepare_phrase_batch_01.mjs first.");
const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8"));

const outputDir = path.resolve("public/phrase-images");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const reviewDir = path.resolve("docs/content-review/phrases-gemini-batch-25-2026-10-11");
if (!fs.existsSync(reviewDir)) fs.mkdirSync(reviewDir, { recursive: true });

// Specific prompt templates tailored for clear action depiction
const promptMap = {
  "check the gate number": "A clean airport terminal concourse with digital flight departure display boards mounted above modern boarding gates. No readable text or letters. Human-free architectural view with large windows showing airport tarmac in daylight.",
  "check in": "An airport check-in counter with a clean luggage conveyor belt and service desk monitor. An adult male traveler in neat attire standing at the counter. No women. No readable text or letters.",
  "collect your luggage": "An airport baggage reclaim carousel area with several neatly placed travel suitcases moving along the silver conveyor belt. Modern terminal architecture, bright daylight. No readable text.",
  "set off": "An adult male traveler with a packed wheeled suitcase and backpack walking through an exit doorway toward a sunny road embarking on a travel journey. Back view, modest attire. No women. No text.",
  "check the departure time": "An airport terminal waiting lounge with large windows looking out at planes parked at the gate, with a sleek modern clock on the wall showing afternoon time. Human-free view. No text or numbers.",
  "board the plane": "An airport passenger boarding bridge leading into an airplane entrance doorway. An adult male passenger walking forward into the plane. Modest attire. No women. No text or logos.",
  "wake up": "A peaceful morning bedroom scene with warm sunlight streaming through sheer curtains onto a neatly made bed and a bedside nightstand with an alarm clock and water glass. Human-free. No text.",
  "cite a source": "A wooden study desk with open reference textbooks, a neat notebook, and a classic fountain pen, illustrating scholarly academic research. Warm library lighting. No text or letters.",
  "catch up on": "A neat home office desk with an organized stack of folders, notebooks, a laptop, and a fresh ceramic cup of tea, with soft morning window light. Human-free. No text or letters.",
  "take notes": "A close-up of a person's hands holding a pen writing neatly in a spiral-bound notebook on a wooden desk beside an open book. Adult male hands or human-free. No readable letters. No women.",
  "look up": "A quiet university library aisle with tall wooden bookshelves and a reading table with large open reference encyclopedias. Human-free architectural shot. No text.",
  "review a draft": "A wooden work desk with printed draft documents, a red editing pen, and magnifying glass under a brass desk lamp. Professional editorial atmosphere. Human-free. No text.",
  "hand in": "An adult male student placing a completed paper folder into a wooden submission inbox tray on an instructor's office desk. No women. No readable text or logos.",
  "complete a task": "A tidy workspace with a checklist clipboard showing neat checkmarks, a pen, and an organized desktop indicating finished work. Human-free. No text.",
  "sort out": "A workshop or office organization desk with divided storage compartments neatly arranging office tools, cables, and supplies into clean order. Human-free. No text.",
  "check the details": "A magnifying glass resting over a technical blueprint or architectural drawing on a wooden architect's table. Human-free. No text or words.",
  "find out": "A research desk with an open globe, field notebooks, magnifying glass, and compass beside a desk lamp. Atmospheric discovery setting. Human-free. No text.",
  "follow the instructions": "A model assembly or craft kit neatly laid out on a table with illustrated diagram steps and wooden components ready for assembly. Human-free. No text.",
  "follow up": "A modern desk with a landline office phone, a neat daily planner pad, and a pen on a desk beside an open laptop. Human-free. No text.",
  "update the software": "A sleek modern desktop computer workstation on a clean desk with a glowing progress circle on the screen indicating a system update. Human-free. No readable letters or text.",
  "back up": "A modern external hard drive with a glowing blue LED indicator connected via a braided cable to a sleek aluminum laptop on an office desk. Human-free. No text.",
  "check system status": "A modern server room rack with neat green indicator lights and clean cabling in a cool blue-lit enterprise data center. Human-free. No text.",
  "shut down": "An office computer workstation on a desk at twilight with the monitor screen going dark and ambient desk lamp glowing softly. Human-free. No text.",
  "review the log": "An organized tech workstation desk with dual monitors displaying dark network graphs and diagrams beside an engineer's notebook. Human-free. No readable text.",
  "log in": "A modern office desktop monitor displaying a clean geometric lock screen with a password entry field and key icon on a tidy wooden desk. Human-free. No text."
};

const results = [];
const concurrency = 2;

async function generateOne(candidate) {
  const slug = slugify(candidate.phrase);
  const webpPath = path.join(outputDir, `${slug}.webp`);
  const relativeAppPath = `./phrase-images/${slug}.webp`;

  // 1. Check if image already exists
  if (fs.existsSync(webpPath)) {
    console.log(`[REUSE] Image already exists for "${candidate.phrase}": ${slug}.webp`);
    const bytes = fs.readFileSync(webpPath);
    return {
      phrase: candidate.phrase,
      slug,
      status: "reused",
      path: relativeAppPath,
      bytes: bytes.length,
      sha256: sha256(bytes),
      candidate
    };
  }

  // 2. Build prompt
  const baseDescription = promptMap[candidate.phrase] || `Clear educational visual representing the concept "${candidate.phrase}": ${candidate.meaning}.`;
  const prompt = `Realistic adult-learning educational reference illustration. Concept: "${candidate.phrase}". Scene: ${baseDescription} Style: clean, modern, natural lighting, high quality. No women added. Human-free preferred; if a person is required, use one modest adult man. Strictly no readable text, words, letters, numbers, signs, watermarks or logos. 4:3 landscape aspect ratio. Return one image.`;

  console.log(`[GENERATE] "${candidate.phrase}" (${slug})...`);

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
    throw new Error(`Gemini API error HTTP ${response.status} for "${candidate.phrase}"`);
  }

  const data = await response.json();
  const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.mimeType?.startsWith("image/"));
  if (!part || !part.inlineData?.data) {
    throw new Error(`No image returned for "${candidate.phrase}" (finishReason: ${data.candidates?.[0]?.finishReason})`);
  }

  const rawBuffer = Buffer.from(part.inlineData.data, "base64");
  const webpBuffer = await sharp(rawBuffer)
    .resize(1024, 768, { fit: "cover" })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();

  fs.writeFileSync(webpPath, webpBuffer);
  console.log(`[SUCCESS] Saved ${slug}.webp (${webpBuffer.length} bytes)`);

  return {
    phrase: candidate.phrase,
    slug,
    status: "generated",
    path: relativeAppPath,
    bytes: webpBuffer.length,
    sha256: sha256(webpBuffer),
    prompt,
    candidate
  };
}

// Run queue with bounded concurrency
async function runQueue() {
  console.log(`Starting generation of ${candidates.length} phrase images (concurrency: ${concurrency})...`);
  const queue = [...candidates];
  const workers = Array.from({ length: concurrency }, async (_, workerIndex) => {
    while (queue.length > 0) {
      const item = queue.shift();
      try {
        const res = await generateOne(item);
        results.push(res);
      } catch (err) {
        console.error(`[FAILED] "${item.phrase}":`, err.message);
        results.push({ phrase: item.phrase, status: "failed", error: err.message, candidate: item });
      }
      // Brief pause between requests to avoid burst rate limits
      await new Promise(r => setTimeout(r, 2000));
    }
  });

  await Promise.all(workers);

  // 3. Update phrases.json files with imagePath and imageAlt
  console.log("\nMapping approved image paths into usagePhrases/*.phrases.json files...");
  const phrasesDir = "src/app/data/usagePhrases";
  let updatedCount = 0;

  for (const res of results) {
    if (res.status !== "generated" && res.status !== "reused") continue;
    const { phrase, path: imagePath, candidate } = res;
    const altText = `Educational illustration depicting ${phrase}: ${candidate.meaning}`;

    for (const itemRef of candidate.items) {
      const filePath = path.join(phrasesDir, itemRef.file);
      if (!fs.existsSync(filePath)) continue;
      const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const match = fileData.find(p => p.id === itemRef.id);
      if (match) {
        match.imagePath = imagePath;
        match.imageAlt = altText;
        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2) + "\n");
        updatedCount++;
      }
    }
  }

  console.log(`Updated ${updatedCount} phrase card records across curriculum JSON files.`);

  // 4. Save manifest and gallery
  const manifest = {
    batchId: "phrases-gemini-batch-25-2026-10-11",
    model: "gemini-nano-banana-2.1",
    totalItems: results.length,
    successful: results.filter(r => r.status === "generated" || r.status === "reused").length,
    results
  };

  fs.writeFileSync(path.join(reviewDir, "manifest.json"), JSON.stringify(manifest, null, 2));

  // Build HTML gallery
  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Batch 1 Phrase Images Review (25 Concepts)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #38bdf8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; padding: 1rem; }
    .img-wrap { width: 100%; aspect-ratio: 4/3; background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 0.75rem; }
    img { width: 100%; height: 100%; object-fit: cover; }
    .phrase { font-size: 1.1rem; font-weight: bold; color: #fff; margin-bottom: 0.25rem; }
    .kind { display: inline-block; font-size: 0.75rem; background: #0284c7; color: #fff; padding: 2px 8px; border-radius: 999px; margin-bottom: 0.5rem; font-weight: 600; }
    .meaning { font-size: 0.85rem; color: #94a3b8; line-height: 1.4; margin-bottom: 0.5rem; }
    .example { font-size: 0.8rem; font-style: italic; color: #cbd5e1; border-left: 2px solid #0284c7; padding-left: 0.5rem; }
  </style>
</head>
<body>
  <h1>WordPix — Phrase Image Batch 01 (25 Concepts, 40 Cards)</h1>
  <p style="color: #94a3b8;">Model: gemini-nano-banana-2.1 | Aspect ratio: 4:3 WebP | Adult-focused, zero readable text, no-women rule respected.</p>
  <div class="grid">
    ${results.map(r => `
      <div class="card">
        <div class="img-wrap">
          <img src="../../../public/phrase-images/${r.slug}.webp" alt="${r.phrase}" onerror="this.src=''; this.alt='Image generation pending';" />
        </div>
        <span class="kind">${r.candidate?.kind || 'phrase'}</span>
        <div class="phrase">${r.phrase}</div>
        <div class="meaning"><strong>Meaning:</strong> ${r.candidate?.meaning || ''}</div>
        <div class="example">"${r.candidate?.example || ''}"</div>
      </div>
    `).join("")}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(reviewDir, "gallery.html"), galleryHtml);
  console.log(`Gallery written to ${path.join(reviewDir, "gallery.html")}`);
  console.log("Batch 01 generation and mapping complete!");
}

runQueue().catch(console.error);
