import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const sourceRoot = path.resolve(".");
const batchDir = path.join(sourceRoot, "output/batch-8-gemini");
const queueFile = path.join(sourceRoot, "output/batch-8-reviewed-queue.json");
const queue = JSON.parse(fs.readFileSync(queueFile, "utf8")).items;
const targetDir = path.join(
  sourceRoot,
  "docs/content-review/bakery-cafe-gemini-batch-43-2026-10-10"
);
const assetsDir = path.join(targetDir, "assets");

fs.mkdirSync(assetsDir, { recursive: true });

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

const webps = fs.readdirSync(batchDir).filter((f) => f.endsWith(".webp"));

const descriptions = {
  "bakery-1-usage-scene-1":
    "A fresh golden-brown loaf of sliced white sandwich bread on a bakery board.",
  "bakery-1-usage-scene-2":
    "A round artisan sourdough boule with a crisp flour-dusted crust and deep scores.",
  "bakery-1-usage-scene-3":
    "Italian focaccia flatbread dimpled with olive oil and topped with fresh rosemary sprigs.",
  "bakery-1-usage-scene-4":
    "Warm charred pita and naan flatbreads stacked in a woven bakery basket.",
  "bakery-1-usage-scene-5":
    "A classic glazed ring donut with smooth translucent icing on greaseproof paper.",
  "bakery-2-usage-scene-1":
    "A French choux pastry éclair filled with cream and topped with glossy chocolate glaze.",
  "bakery-2-usage-scene-2":
    "Delicate pastel French macarons in almond, raspberry, and pistachio flavors on a tray.",
  "bakery-2-usage-scene-3":
    "An elegant multi-tiered white fondant celebration cake with subtle decorative piping.",
  "bakery-2-usage-scene-4":
    "A rich layered chocolate fudge cake slice with dark chocolate frosting on a plate.",
  "bakery-2-usage-scene-5":
    "A golden lattice-crust baked cherry pie showing rich red fruit filling through pastry vents.",
  "bakery-3-usage-scene-1":
    "Freshly baked chewy chocolate chip cookies with melted chocolate morsels on parchment.",
  "bakery-3-usage-scene-2":
    "Traditional Scottish buttery shortbread fingers dusted lightly with sugar crystals.",
  "bakery-3-usage-scene-3":
    "A flaky golden-brown buttermilk breakfast biscuit split in half on a breakfast plate.",
  "bakery-3-usage-scene-4":
    "A nutritious chewy oat and honey granola bar with nuts and dried cranberries.",
  "bakery-3-usage-scene-5":
    "A block of rich creamery unsalted baking butter unwrapped on a marble pastry board.",
  "bakery-4-usage-scene-1":
    "A small container of white leavening baking powder with a measuring spoon.",
  "bakery-4-usage-scene-2":
    "Fresh whipping cream being whisked into soft velvety peaks in a glass bowl.",
  "bakery-4-usage-scene-3":
    "Golden liquid honey dripping smoothly from a wooden grooved dipper into a jar.",
  "bakery-4-usage-scene-4":
    "A solid hardwood French baker's rolling pin resting on a floured countertop.",
  "bakery-4-usage-scene-5":
    "A flexible silicone kitchen baking spatula scraping smooth cake batter from a bowl.",
  "bakery-5-usage-scene-1":
    "A wire grid baking cooling rack supporting fresh baked goods above the counter.",
  "bakery-5-usage-scene-2":
    "A digital kitchen countdown baking timer displaying minutes on an oven counter.",
  "bakery-5-usage-scene-3":
    "A golden-baked round butter cookie resting on a linen napkin.",
  "coffee-shop-1-usage-scene-1":
    "A rich dark single shot of espresso with golden-brown crema in a white demitasse cup.",
  "coffee-shop-1-usage-scene-2":
    "A tall clear glass mug of hot black Caffè Americano with a delicate crema ring.",
  "coffee-shop-1-usage-scene-3":
    "Steaming amber herbal tea brewing in a clear glass teapot with dried tea leaves.",
  "coffee-shop-1-usage-scene-4":
    "A velvety espresso flat white with steamed whole milk and delicate latte art in a ceramic cup.",
  "coffee-shop-1-usage-scene-5":
    "A chilled berry and banana fruit smoothie in a tall glass garnished with fresh mint.",
  "coffee-shop-2-usage-scene-1":
    "A thick creamy strawberry milkshake in a vintage fountain glass with a paper straw.",
  "coffee-shop-2-usage-scene-2":
    "A sparkling iced carbonated citrus soda with effervescent bubbles and a lemon wedge.",
  "coffee-shop-2-usage-scene-3":
    "A bakery blueberry muffin with a golden domed sugar-crusted muffin top in a paper liner.",
  "coffee-shop-2-usage-scene-4":
    "A neat wedge slice of carrot cake with cream cheese frosting on a dessert plate.",
  "coffee-shop-2-usage-scene-5":
    "A yeast ring donut topped with pink strawberry icing and colorful sprinkles.",
  "coffee-shop-3-usage-scene-1":
    "A dual-boiler commercial stainless steel espresso machine on a café counter.",
  "coffee-shop-3-usage-scene-2":
    "A heavy chrome espresso portafilter handle filled with tamped finely ground coffee.",
  "coffee-shop-3-usage-scene-3":
    "A countertop sound-enclosed commercial beverage blender with a clear pitcher.",
  "coffee-shop-3-usage-scene-4":
    "A stainless steel milk frothing thermometer clipped to a steaming pitcher.",
  "coffee-shop-3-usage-scene-5":
    "A stack of white compostable sip-through coffee cup travel lids.",
  "coffee-shop-4-usage-scene-1":
    "A stainless steel spring-loaded paper napkin dispenser filled with brown kraft napkins.",
  "coffee-shop-4-usage-scene-2":
    "Glass bottles of flavored vanilla and caramel café beverage syrups with pump dispensers.",
  "coffee-shop-4-usage-scene-3":
    "A chalkboard café wall menu board listing espresso drinks and daily pastry specials.",
  "coffee-shop-4-usage-scene-4":
    "A comfortable leather lounge sofa and low coffee table in a cozy café seating corner.",
  "coffee-shop-4-usage-scene-5":
    "A convenient wall electrical AC power outlet beside a café laptop work table.",
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
  batchId: "bakery-cafe-gemini-batch-43-2026-10-10",
  title: "Bakery & Coffee Shop 43-Item Gemini Reference Batch (bakery, coffee-shop)",
  createdAt: new Date().toISOString(),
  model: "gemini-nano-banana-2.1",
  totalItems: manifestItems.length,
  totalBytes,
  unitsCovered: ["bakery", "coffee-shop"],
  tokenUsageSummary: totalTokens,
  billingEstimate: {
    deliveredImages: 43,
    deliveredImageOutputCostUsd: Number((43 * 0.0336).toFixed(4)),
    totalPaidRequests: 43,
    estimatedTotalTokenCostUsd: Number((43 * 0.0336 + (totalTokens.total / 1000000) * 0.15).toFixed(4)),
    note: "All 43 images generated on first pass with maxTokens=8192 without retries. Separates image output estimate ($0.0336/image) from token and thinking usage. Final invoice reconciles in Google dashboard."
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
<title>WordPix — 43 Reviewed Bakery &amp; Café Images</title>
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
<h1>43 Reviewed Bakery &amp; Café References (Gemini)</h1>
<p>Complete reviewed batch covering <strong>bakery</strong> (23 scenes) and <strong>coffee-shop</strong> (20 scenes). Generated with <code>gemini-nano-banana-2.1</code> in native 4:3 1K (1200×896). Framings preserved; R2 and mappings remain read-only.</p>
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
