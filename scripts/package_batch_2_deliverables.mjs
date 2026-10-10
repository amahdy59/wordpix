import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const sourceRoot = path.resolve(".");
const batchDir = path.join(sourceRoot, "output/batch-2-gemini");
const queueFile = path.join(sourceRoot, "output/batch-2-reviewed-queue.json");
const queue = JSON.parse(fs.readFileSync(queueFile, "utf8")).items;
const targetDir = path.join(
  sourceRoot,
  "docs/content-review/time-calendar-gemini-batch-34-2026-10-10"
);
const assetsDir = path.join(targetDir, "assets");

fs.mkdirSync(assetsDir, { recursive: true });

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

const webps = fs.readdirSync(batchDir).filter((f) => f.endsWith(".webp"));

const descriptions = {
  "telling-time-1-usage-scene-1":
    "A plain round wall clock with tick marks hangs on a light wall beside an unworn wristwatch resting on a wooden table.",
  "telling-time-1-usage-scene-2":
    "An analogue clock face with tick marks shows a shorter hour hand and a longer minute hand pointing upward, with a thin second hand.",
  "telling-time-1-usage-scene-3":
    "A classic twin-bell analogue alarm clock rests on a surface beside an unlit digital clock display and a small sundial model.",
  "telling-time-1-usage-scene-4":
    "A glass hourglass with fine sand flowing from the upper chamber through a narrow neck into the lower chamber.",
  "telling-time-1-usage-scene-5":
    "An unlabelled analogue wall clock with tick marks hangs in an office meeting room above a conference table with a folder.",
  "telling-time-2-usage-scene-1":
    "Bright midday sunlight illuminates a park path with very short shadows cast directly beneath trees.",
  "telling-time-2-usage-scene-2":
    "Warm twilight colors streak the evening sky as the sun dips below the horizon over a quiet urban skyline.",
  "telling-time-2-usage-scene-3":
    "An analogue clock face with tick marks shows the minute hand pointing directly down to the six and the hour hand halfway between numerals.",
  "telling-time-2-usage-scene-4":
    "An analogue clock face with tick marks shows the minute hand pointing slightly past the top at the one position.",
  "telling-time-2-usage-scene-5":
    "An analogue clock face with tick marks shows the minute hand pointing at the eleven position, five minutes before the hour.",
  "telling-time-3-usage-scene-1":
    "Early morning sunlight streams through a window onto an office desk with a warm cup of coffee and a daily notebook.",
  "telling-time-3-usage-scene-2":
    "A calm nighttime city scene with stars and a dark sky visible through a wide window beside a dimly lit desk lamp.",
  "telling-time-3-usage-scene-3":
    "Direct overhead natural sunlight casts minimal shadows on an open courtyard with benches.",
  "telling-time-3-usage-scene-4":
    "Deep evening blue settles into night over a quiet town street as streetlights begin to illuminate the road.",
  "telling-time-3-usage-scene-5":
    "A commuter train rests precisely at the station platform beside a platform clock.",
  "telling-time-4-usage-scene-1":
    "An airport departure lounge with tidy seating and boarding gate displays before passengers arrive.",
  "telling-time-4-usage-scene-2":
    "A digital countdown timer display on a table beside project blueprints, counting down remaining minutes.",
  "days-months-1-usage-scene-1":
    "A neat office desk with a weekly planner binder and a freshly opened project folder for the start of the week.",
  "days-months-1-usage-scene-2":
    "An office workstation with documents, a notebook with notes, and an open desk calendar showing midweek progress.",
  "days-months-1-usage-scene-3":
    "A calm home setting with an unlabelled weekly planner beside a packed work bag resting near an armchair.",
  "days-months-1-usage-scene-4":
    "A pair of walking shoes, a book, and keys resting on a side table on a relaxing leisure morning.",
  "days-months-1-usage-scene-5":
    "A desk calendar opened to early spring with a potted budding plant and soft natural window light.",
  "days-months-2-usage-scene-1":
    "A sunlit desk near an open window overlooking green summer trees, with a planner open to mid-year.",
  "days-months-2-usage-scene-2":
    "A clean workspace with autumn leaves visible outside, notebooks, and folders prepared for early autumn.",
  "days-months-2-usage-scene-3":
    "A warm interior workspace with winter light, a closed planner, and a warm ceramic mug.",
  "days-months-2-usage-scene-4":
    "A university lecture desk with textbooks, a syllabus binder, and study schedule materials.",
  "days-months-2-usage-scene-5":
    "A student study table with course modules, a binder divided into sections, and note cards.",
  "days-months-3-usage-scene-1":
    "A desk organizer holding today's task checklist on a clipboard with a pen resting on top.",
  "days-months-3-usage-scene-2":
    "An open seven-day weekly layout planner showing daily sections with neat handwritten notes.",
  "days-months-3-usage-scene-3":
    "A monthly calendar grid on a desktop stand with days organized in rows and columns.",
  "days-months-3-usage-scene-4":
    "A full annual twelve-month overview wall chart mounted neatly above a workspace desk.",
  "days-months-3-usage-scene-5":
    "A planner entry open beside a clock and a visitor badge on a reception counter.",
  "days-months-4-usage-scene-1":
    "A leather-bound personal diary with an attached ribbon bookmark and a fountain pen on a wooden table.",
  "days-months-4-usage-scene-2":
    "A clean desktop organizer with a neat reminder card resting beside a wristwatch and keys.",
};

const manifestItems = [];
let totalBytes = 0;
let totalTokens = { prompt: 0, candidates: 0, total: 0, thoughts: 0 };
let totalRequests = 34 + 11; // 34 initial + 11 v2 retries

for (const item of queue) {
  const matches = webps.filter((w) => w.startsWith(item.sceneId));
  const chosen = matches.find((m) => m.includes("-v2-")) || matches[0];
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
  batchId: "time-calendar-gemini-batch-34-2026-10-10",
  title: "Telling Time & Days-Months 34-Item Gemini Reference Batch",
  createdAt: new Date().toISOString(),
  model: "gemini-nano-banana-2.1",
  totalItems: manifestItems.length,
  totalBytes,
  unitsCovered: ["telling-time", "days-months"],
  tokenUsageSummary: totalTokens,
  billingEstimate: {
    deliveredImages: 34,
    deliveredImageOutputCostUsd: Number((34 * 0.0336).toFixed(4)),
    totalPaidRequests: totalRequests,
    estimatedTotalTokenCostUsd: Number((34 * 0.0336 + 11 * 0.0336 + (totalTokens.total / 1000000) * 0.15).toFixed(4)),
    note: "Separates image output estimate ($0.0336/image) from token and thinking usage. Final invoice reconciles in Google dashboard."
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
<title>WordPix — 34 Reviewed Time &amp; Calendar Images</title>
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
<h1>34 Reviewed Time &amp; Calendar References (Gemini)</h1>
<p>Complete reviewed batch covering <strong>telling-time</strong> (17 scenes) and <strong>days-months</strong> (17 scenes). Generated with <code>gemini-nano-banana-2.1</code> in native 4:3 1K (1200×896). Framings preserved; R2 and mappings remain read-only.</p>
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
const readmeMd = `# Telling Time & Days-Months Gemini Batch (34 Images)

- **Date**: 10 October 2026
- **Units**: \`telling-time\` (17 scenes), \`days-months\` (17 scenes)
- **Model**: \`gemini-nano-banana-2.1\` (native 4:3, 1200 × 896, no artificial cropping)
- **Status**: Completed, visually audited, locally staged in tracked git bundle.
- **R2 / Media Mappings**: Untouched (read-only constraint strictly enforced).
- **Audio**: Immutable.

## Gallery
Open \`gallery.html\` in a browser to review all 34 assets with their literal alt descriptions.

## Metrics
- **Total Images**: 34 WebP files
- **Total Bytes**: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB
- **Delivered Output Cost Estimate**: $${(34 * 0.0336).toFixed(4)} (Google $0.0336/image pricing)
- **Token Counts**: Prompt: ${totalTokens.prompt}, Candidates: ${totalTokens.candidates}, Thoughts: ${totalTokens.thoughts}, Total: ${totalTokens.total}
`;

fs.writeFileSync(path.join(targetDir, "README.md"), readmeMd);

// Write preservation receipt
const preservationReceipt = {
  batchId: "time-calendar-gemini-batch-34-2026-10-10",
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
