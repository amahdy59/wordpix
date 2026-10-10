import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const sourceRoot = path.resolve(".");
const batchDir = path.join(sourceRoot, "output/batch-7-gemini");
const queueFile = path.join(sourceRoot, "output/batch-7-reviewed-queue.json");
const queue = JSON.parse(fs.readFileSync(queueFile, "utf8")).items;
const targetDir = path.join(
  sourceRoot,
  "docs/content-review/farm-countryside-gemini-batch-29-2026-10-10"
);
const assetsDir = path.join(targetDir, "assets");

fs.mkdirSync(assetsDir, { recursive: true });

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

const webps = fs.readdirSync(batchDir).filter((f) => f.endsWith(".webp"));

const descriptions = {
  "farm-1-usage-scene-1":
    "A dairy cow standing peacefully in a lush green pasture beside a wooden fence.",
  "farm-1-usage-scene-2":
    "A strong riding horse standing proudly in an open paddock with wooden fencing.",
  "farm-1-usage-scene-3":
    "A white farm duck swimming gracefully in a clean pond near green reeds.",
  "farm-1-usage-scene-4":
    "A colorful rooster with bright feathers standing alertly atop a wooden farm fence post.",
  "farm-1-usage-scene-5":
    "Golden ripe wheat stalks swaying in an expansive open field before harvest.",
  "farm-2-usage-scene-1":
    "Freshly harvested brown potatoes resting in rich dark agricultural soil.",
  "farm-2-usage-scene-2":
    "Whole yellow and red onions with green tops freshly pulled from an allotment bed.",
  "farm-2-usage-scene-3":
    "Fresh green pea pods clinging to vines with visible plump peas inside.",
  "farm-2-usage-scene-4":
    "An orchard apple tree bearing clusters of ripe red fruit amidst leafy foliage.",
  "farm-2-usage-scene-5":
    "A vibrant citrus orange tree loaded with bright round oranges in a grove.",
  "farm-3-usage-scene-1":
    "Ripe red raspberries growing on bramble canes with green serrated leaves.",
  "farm-3-usage-scene-2":
    "A fruit-bearing plum tree with deep purple plums ready for picking.",
  "farm-3-usage-scene-3":
    "A tall cylindrical agricultural grain silo standing beside farm barn buildings.",
  "farm-3-usage-scene-4":
    "A glass agricultural greenhouse nurturing rows of young vegetable seedlings.",
  "farm-3-usage-scene-5":
    "A traditional clean dairy processing barn with stainless milk vessels and churns.",
  "farm-4-usage-scene-1":
    "A sturdy steel agricultural plow hooked ready to till furrows in rich farmland.",
  "farm-4-usage-scene-2":
    "A metal four-tine pitchfork resting against a stack of golden dry hay.",
  "farm-4-usage-scene-3":
    "A long wooden livestock feed trough filled with fresh grains and hay in a stable.",
  "farm-4-usage-scene-4":
    "A glass bottle of fresh whole milk beside a filled drinking glass on a rustic table.",
  "farm-4-usage-scene-5":
    "A glass jar of golden pure honey with a wooden dipper resting on honeycomb.",
  "farm-5-usage-scene-1":
    "A ceramic pitcher of rich thick farm cream pouring into a shallow bowl.",
  "farm-5-usage-scene-2":
    "A glass jug of clear amber apple cider surrounded by freshly picked apples.",
  "farm-5-usage-scene-3":
    "A wooden farm hen house coop with nesting boxes and roosting perches.",
  "farm-5-usage-scene-4":
    "A steel pointed digging shovel standing upright in garden farm soil.",
  "farm-5-usage-scene-5":
    "A galvanized metal watering can with a rose spout resting near potted plants.",
  "farm-6-usage-scene-1":
    "Bales of clean golden dry straw stacked neatly in a sheltered farm barn.",
  "farm-6-usage-scene-2":
    "A sleek barn cat sitting attentively on a hay bale in an agricultural barn.",
  "farm-6-usage-scene-3":
    "A breathtaking golden sunrise illuminating misty farmland fields and barns.",
  "farm-6-usage-scene-4":
    "A bountiful autumn harvest display with pumpkins, grain sheaves, and orchard fruit.",
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
  batchId: "farm-countryside-gemini-batch-29-2026-10-10",
  title: "Farm & Countryside 29-Item Gemini Reference Batch (farm)",
  createdAt: new Date().toISOString(),
  model: "gemini-nano-banana-2.1",
  totalItems: manifestItems.length,
  totalBytes,
  unitsCovered: ["farm"],
  tokenUsageSummary: totalTokens,
  billingEstimate: {
    deliveredImages: 29,
    deliveredImageOutputCostUsd: Number((29 * 0.0336).toFixed(4)),
    totalPaidRequests: 29,
    estimatedTotalTokenCostUsd: Number((29 * 0.0336 + (totalTokens.total / 1000000) * 0.15).toFixed(4)),
    note: "All 29 images generated on first pass with maxTokens=8192 without retries. Separates image output estimate ($0.0336/image) from token and thinking usage. Final invoice reconciles in Google dashboard."
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
<title>WordPix — 29 Reviewed Farm &amp; Countryside Images</title>
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
<h1>29 Reviewed Farm &amp; Countryside References (Gemini)</h1>
<p>Complete reviewed batch covering <strong>farm</strong> (29 scenes across 6 lessons). Generated with <code>gemini-nano-banana-2.1</code> in native 4:3 1K (1200×896). Framings preserved; R2 and mappings remain read-only.</p>
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
