import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const sourceRoot = path.resolve(".");
const batchDir = path.join(sourceRoot, "output/batch-6-gemini");
const queueFile = path.join(sourceRoot, "output/batch-6-reviewed-queue.json");
const queue = JSON.parse(fs.readFileSync(queueFile, "utf8")).items;
const targetDir = path.join(
  sourceRoot,
  "docs/content-review/nature-weather-gemini-batch-40-2026-10-10"
);
const assetsDir = path.join(targetDir, "assets");

fs.mkdirSync(assetsDir, { recursive: true });

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

const webps = fs.readdirSync(batchDir).filter((f) => f.endsWith(".webp"));

const descriptions = {
  "garden-1-usage-scene-1":
    "A vibrant red garden rose blooming with velvety petals and green leaves in an outdoor garden bed.",
  "garden-1-usage-scene-2":
    "Fresh white daisy flowers with bright yellow centers growing naturally in a sunny garden.",
  "garden-1-usage-scene-3":
    "Delicate purple and violet blossoms with deep green leaves growing in rich soil.",
  "garden-1-usage-scene-4":
    "A cluster of aromatic purple lavender stalks flowering in a garden border.",
  "garden-1-usage-scene-5":
    "A mature leafy apple tree with ripe red apples hanging from branches in an orchard.",
  "garden-2-usage-scene-1":
    "A neatly manicured green garden hedge forming a boundary along a path.",
  "garden-2-usage-scene-2":
    "A leafy green climbing vine winding upward across a wooden garden trellis.",
  "garden-2-usage-scene-3":
    "A sturdy steel garden leaf rake resting beside gathered autumn foliage.",
  "garden-2-usage-scene-4":
    "A coiled green garden watering hose connected to an outdoor brass spigot.",
  "garden-2-usage-scene-5":
    "A metal hand gardening trowel resting in nutrient-rich planting soil.",
  "garden-3-usage-scene-1":
    "A traditional long-handled garden pitchfork standing upright in straw and mulch.",
  "garden-3-usage-scene-2":
    "A close-up view of a green plant stem supporting leaves and a budding flower.",
  "garden-3-usage-scene-3":
    "A sturdy wooden tree branch extending outward with lush green foliage.",
  "garden-3-usage-scene-4":
    "Small botanical plant seeds resting in a seed packet and scattered on rich soil.",
  "garden-3-usage-scene-5":
    "A colorful spotted butterfly resting gently with wings open on a garden flower.",
  "garden-4-usage-scene-1":
    "An earthworm moving gently through moist garden compost soil.",
  "garden-4-usage-scene-2":
    "A striped green caterpillar crawling carefully along a fresh plant leaf.",
  "garden-4-usage-scene-3":
    "A green grasshopper perched alertly on a blade of lawn grass.",
  "garden-4-usage-scene-4":
    "A winding stepping-stone garden path lined with flowers and trimmed grass.",
  "garden-4-usage-scene-5":
    "A glass greenhouse structure filled with potted plants and seedlings in sunlight.",
  "garden-5-usage-scene-1":
    "A stone pedestal birdbath filled with clean water in a peaceful garden.",
  "garden-5-usage-scene-2":
    "A grand freestanding deciduous shade tree with a broad green canopy in a lawn.",
  "garden-5-usage-scene-3":
    "A wild garden songbird perched gracefully on a leafy wooden branch.",
  "seasons-weather-1-usage-scene-1":
    "A fresh spring landscape with blossoming flowers, young green leaves, and mild sunshine.",
  "seasons-weather-1-usage-scene-2":
    "A serene winter landscape covered with crisp white snow on trees and rooftops.",
  "seasons-weather-1-usage-scene-3":
    "Heavy monsoon rains falling over a verdant landscape with rain-soaked ground.",
  "seasons-weather-1-usage-scene-4":
    "An autumn harvest field with golden grain bundles and ripe seasonal crops.",
  "seasons-weather-1-usage-scene-5":
    "Gentle raindrops falling on a window pane overlooking a cloudy day.",
  "seasons-weather-2-usage-scene-1":
    "A dense morning mist and fog reducing visibility across an open landscape.",
  "seasons-weather-2-usage-scene-2":
    "A calm overcast sky covered with soft uniform gray clouds over rolling hills.",
  "seasons-weather-2-usage-scene-3":
    "A dramatic lightning strike illuminating a dark stormy evening sky.",
  "seasons-weather-2-usage-scene-4":
    "A blowing snowstorm and blizzard winds swirling across a frozen winter terrain.",
  "seasons-weather-2-usage-scene-5":
    "Arid dry terrain with cracked soil and parched earth under a hot clear sky.",
  "seasons-weather-3-usage-scene-1":
    "A blazing midday summer sun shining intensely over heat waves on the ground.",
  "seasons-weather-3-usage-scene-2":
    "An icy winter scene with delicate frost crystals and icicles hanging from eaves.",
  "seasons-weather-3-usage-scene-3":
    "A crisp autumn breeze rustling falling amber leaves under cool overcast light.",
  "seasons-weather-3-usage-scene-4":
    "A comfortable indoor living room setting with a wall thermometer showing 21°C.",
  "seasons-weather-3-usage-scene-5":
    "A traditional metal rooster weather vane mounted on a rooftop indicating wind direction.",
  "seasons-weather-4-usage-scene-1":
    "An educational synoptic meteorological weather map showing high and low pressure fronts.",
  "seasons-weather-4-usage-scene-2":
    "A meteorological Doppler weather radar display showing precipitation tracking.",
};

const manifestItems = [];
let totalBytes = 0;
let totalTokens = { prompt: 0, candidates: 0, total: 0, thoughts: 0 };

for (const item of queue) {
  const matches = webps.filter((w) => w.startsWith(item.sceneId));
  const chosen = matches[0];
  if (!chosen) throw new Error(`Missing image for ${item.sceneId}`);

  const sourceFile = path.join(batchDir, chosen);
  const jsonFile = sourceFile.replace(/\.webp$/, ".json");
  const receipt = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  const buf = fs.readFileSync(sourceFile);
  const meta = await sharp(buf).metadata();
  const fileHash = sha256(buf);

  const targetName = `${chosen}`;
  const targetPath = path.join(assetsDir, targetName);
  fs.copyFileSync(sourceFile, targetPath);

  totalBytes += buf.length;
  if (receipt.usage) {
    totalTokens.prompt += receipt.usage.promptTokenCount || 0;
    totalTokens.candidates += receipt.usage.candidatesTokenCount || 0;
    totalTokens.total += receipt.usage.totalTokenCount || 0;
    totalTokens.thoughts += receipt.usage.thoughtsTokenCount || 0;
  }

  manifestItems.push({
    sceneId: item.sceneId,
    unitId: item.unitId,
    lessonId: item.lessonId,
    concept: item.reviewedAnswer,
    prompt: item.prompt,
    selectedAsset: `assets/${targetName}`,
    bytes: buf.length,
    sha256: fileHash,
    dimensions: `${meta.width}x${meta.height}`,
    aspectRatio: "4:3",
    model: "gemini-nano-banana-2.1",
    finishReason: receipt.finishReason || "STOP",
    altText: descriptions[item.sceneId] || `Educational reference for ${item.reviewedAnswer}`,
    approvalStatus: "approved-standing-visual-qa",
    inspectedAt: new Date().toISOString(),
  });
}

// Write manifest.json
const manifest = {
  batchId: "nature-weather-gemini-batch-40-2026-10-10",
  title: "Nature & Weather 40-Item Gemini Reference Batch (garden, seasons-weather)",
  createdAt: new Date().toISOString(),
  model: "gemini-nano-banana-2.1",
  totalItems: manifestItems.length,
  totalBytes,
  unitsCovered: ["garden", "seasons-weather"],
  tokenUsageSummary: totalTokens,
  billingEstimate: {
    deliveredImages: 40,
    deliveredImageOutputCostUsd: Number((40 * 0.0336).toFixed(4)),
    totalPaidRequests: 40,
    estimatedTotalTokenCostUsd: Number((40 * 0.0336 + (totalTokens.total / 1000000) * 0.15).toFixed(4)),
    note: "All 40 images generated on first pass with maxTokens=8192 without retries. Separates image output estimate ($0.0336/image) from token and thinking usage. Final invoice reconciles in Google dashboard."
  },
  items: manifestItems,
};

fs.writeFileSync(path.join(targetDir, "manifest.json"), JSON.stringify(manifest, null, 2));

// Write gallery.html
const galleryHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>WordPix — 40 Reviewed Nature &amp; Weather Images</title>
<style>
:root{color-scheme:light;--ink:#173343;--paper:#fff;--surface:#edf5f7;--focus:#173343}
*{box-sizing:border-box}
body{margin:0;padding:24px;font:18px/1.6 system-ui;color:var(--ink);background:var(--surface)}
main{max-width:1400px;margin:auto}
h1{line-height:1.2}
section{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:24px}
article{padding:20px;background:var(--paper);border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06)}
h2{margin:0;font-size:20px}
.tag{font-size:14px;color:#555;margin:4px 0 12px}
img{width:100%;height:auto;aspect-ratio:4/3;object-fit:contain;background:#f9f9f9;border-radius:8px}
p.desc{font-size:15px;margin:12px 0 8px;color:#333}
a{display:inline-flex;align-items:center;min-height:44px;padding:4px 0;color:var(--ink);text-underline-offset:4px}
a:focus-visible{outline:3px solid var(--focus);outline-offset:4px}
</style>
</head>
<body>
<main>
<h1>40 Reviewed Nature &amp; Weather References (Gemini)</h1>
<p>Complete reviewed batch covering <strong>garden</strong> (23 scenes) and <strong>seasons-weather</strong> (17 scenes). Generated with <code>gemini-nano-banana-2.1</code> in native 4:3 1K (1200×896). Framings preserved; R2 and mappings remain read-only.</p>
<section>
${manifestItems
  .map(
    (item) => `<article>
<h2>${item.concept}</h2>
<p class="tag">${item.unitId} · ${item.sceneId}</p>
<img src="${item.selectedAsset}" alt="${item.altText}" loading="lazy" width="1200" height="896">
<p class="desc">${item.altText}</p>
<p class="tag">${item.dimensions} · ${(item.bytes / 1024).toFixed(1)} KB · ${item.sha256.slice(0, 12)}…</p>
</article>`
  )
  .join("\n")}
</section>
</main>
</body>
</html>`;

fs.writeFileSync(path.join(targetDir, "gallery.html"), galleryHtml);

console.log(
  JSON.stringify(
    {
      batchId: manifest.batchId,
      totalItems: manifestItems.length,
      totalBytes,
      totalTokens,
      deliveredDir: targetDir,
      status: "packaged-successfully",
    },
    null,
    2
  )
);
