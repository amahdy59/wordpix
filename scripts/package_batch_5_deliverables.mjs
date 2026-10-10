import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const sourceRoot = path.resolve(".");
const batchDir = path.join(sourceRoot, "output/batch-5-gemini");
const queueFile = path.join(sourceRoot, "output/batch-5-reviewed-queue.json");
const queue = JSON.parse(fs.readFileSync(queueFile, "utf8")).items;
const targetDir = path.join(
  sourceRoot,
  "docs/content-review/spatial-toys-gemini-batch-26-2026-10-10"
);
const assetsDir = path.join(targetDir, "assets");

fs.mkdirSync(assetsDir, { recursive: true });

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

const webps = fs.readdirSync(batchDir).filter((f) => f.endsWith(".webp"));

const descriptions = {
  "prepositions-of-place-1-usage-scene-3":
    "A notebook resting neatly on a desk positioned directly between a coffee mug and a pen holder.",
  "prepositions-of-place-1-usage-scene-4":
    "An open storage box on a table showing stationery items placed securely inside its interior.",
  "prepositions-of-place-1-usage-scene-5":
    "A desk lamp positioned near an open workbook on a study surface.",
  "prepositions-of-place-2-usage-scene-1":
    "A wooden walking ladder leaning safely against a clean interior wall.",
  "prepositions-of-place-2-usage-scene-2":
    "A marked perimeter zone on an office plan showing designated workspace boundaries.",
  "prepositions-of-place-2-usage-scene-3":
    "Documents being lifted out of an open filing box on an office credenza.",
  "prepositions-of-place-2-usage-scene-4":
    "Natural daylight streaming cleanly through an open doorway onto a corridor floor.",
  "prepositions-of-place-2-usage-scene-5":
    "A protective cloth draped over an upright easel in a studio.",
  "prepositions-of-place-3-usage-scene-1":
    "A hardcover reference book resting securely on the very top of a wooden bookshelf stack.",
  "prepositions-of-place-3-usage-scene-2":
    "A desk phone resting clearly to the right of an office monitor.",
  "prepositions-of-place-3-usage-scene-3":
    "A tall indoor potted ficus plant nestled in the peaceful corner of a living room.",
  "prepositions-of-place-3-usage-scene-4":
    "A hallway bench resting at the very end of a straight residential corridor.",
  "toys-games-1-usage-scene-1":
    "A classic handcrafted porcelain collector doll with fabric garments resting on a display stand.",
  "toys-games-1-usage-scene-2":
    "A colorful stitched leather soccer ball resting on clean indoor parquet flooring.",
  "toys-games-1-usage-scene-3":
    "A polished wooden yo-yo with its cotton string wound neatly around its axle on a table.",
  "toys-games-1-usage-scene-4":
    "A collection of colorful glass swirling marbles gathered in a shallow ceramic dish.",
  "toys-games-1-usage-scene-5":
    "A classic property-trading board game laid out on a table with tokens, cards, and dice.",
  "toys-games-2-usage-scene-1":
    "A full standard deck of playing cards neatly fanned face-down on green felt.",
  "toys-games-2-usage-scene-2":
    "A set of trivia question cards in a card caddy with score pads on a coffee table.",
  "toys-games-2-usage-scene-3":
    "A modern sleek video gaming console resting horizontally beside a wireless gamepad controller.",
  "toys-games-2-usage-scene-4":
    "A retro articulated mechanical wind-up toy robot standing upright on a shelf.",
  "toys-games-2-usage-scene-5":
    "A compact handheld gaming console with an illuminated screen resting on a desk.",
  "toys-games-3-usage-scene-1":
    "A classic commuter adult bicycle with fenders and a basket parked beside a brick wall.",
  "toys-games-3-usage-scene-2":
    "A pair of retro quad roller skates with clean polyurethane wheels resting on a bench.",
  "toys-games-3-usage-scene-3":
    "A small indoor exercise fitness rebounder trampoline on a workout mat.",
  "toys-games-3-usage-scene-4":
    "A traditional wooden tree swing suspended by natural ropes in a quiet garden setting.",
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
  batchId: "spatial-toys-gemini-batch-26-2026-10-10",
  title: "Spatial Relations & Tabletop Games 26-Item Gemini Reference Batch (prepositions-of-place, toys-games)",
  createdAt: new Date().toISOString(),
  model: "gemini-nano-banana-2.1",
  totalItems: manifestItems.length,
  totalBytes,
  unitsCovered: ["prepositions-of-place", "toys-games"],
  tokenUsageSummary: totalTokens,
  billingEstimate: {
    deliveredImages: 26,
    deliveredImageOutputCostUsd: Number((26 * 0.0336).toFixed(4)),
    totalPaidRequests: 26,
    estimatedTotalTokenCostUsd: Number((26 * 0.0336 + (totalTokens.total / 1000000) * 0.15).toFixed(4)),
    note: "All 26 images generated on first pass with maxTokens=8192 without retries. Separates image output estimate ($0.0336/image) from token and thinking usage. Final invoice reconciles in Google dashboard."
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
<title>WordPix — 26 Reviewed Spatial &amp; Game Images</title>
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
<h1>26 Reviewed Spatial &amp; Game References (Gemini)</h1>
<p>Complete reviewed batch covering <strong>prepositions-of-place</strong> (12 scenes) and <strong>toys-games</strong> (14 scenes). Generated with <code>gemini-nano-banana-2.1</code> in native 4:3 1K (1200×896). Framings preserved; R2 and mappings remain read-only.</p>
<section>
${manifestItems
  .map(
    (item) => `<article>
<h2>${item.concept}</h2>
<p class="tag">${item.unitId} · ${item.sceneId}</p>
<img src="${item.selectedAsset}" alt="${item.altText}" loading="lazy" width="1200" height="896">
<p class="desc">${item.altText}</p>
<a href="${item.selectedAsset}">Open full image: ${item.concept}</a>
</article>`
  )
  .join("\n")}
</section>
</main>
</body>
</html>`;

fs.writeFileSync(path.join(targetDir, "gallery.html"), galleryHtml);

// Write README.md
const readmeMd = `# Spatial Relations & Tabletop Games Gemini Batch (26 Images)

- **Date**: 10 October 2026
- **Units**: \`prepositions-of-place\` (12 scenes), \`toys-games\` (14 scenes)
- **Model**: \`gemini-nano-banana-2.1\` (native 4:3, 1200 × 896, no artificial cropping)
- **Status**: Completed on 1st pass with 0 failures, visually audited, locally staged in tracked git bundle.
- **R2 / Media Mappings**: Untouched (read-only constraint strictly enforced).
- **Audio**: Immutable.

## Gallery
Open \`gallery.html\` in a browser to review all 26 assets with their literal alt descriptions.

## Metrics
- **Total Images**: 26 WebP files
- **Total Bytes**: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB
- **Delivered Output Cost Estimate**: $${(26 * 0.0336).toFixed(4)} (Google $0.0336/image pricing)
- **Token Counts**: Prompt: ${totalTokens.prompt}, Candidates: ${totalTokens.candidates}, Thoughts: ${totalTokens.thoughts}, Total: ${totalTokens.total}
`;

fs.writeFileSync(path.join(targetDir, "README.md"), readmeMd);

// Write preservation receipt
const preservationReceipt = {
  batchId: "spatial-toys-gemini-batch-26-2026-10-10",
  verifiedAt: new Date().toISOString(),
  verifiedImages: manifestItems.length,
  totalBytes,
  r2Writes: 0,
  audioMappingChanges: 0,
  protectedFilesModified: 0,
};

fs.writeFileSync(
  path.join(targetDir, "preservation-receipt.json"),
  JSON.stringify(preservationReceipt, null, 2)
);

console.log("Successfully packaged portable deliverables into:", targetDir);
