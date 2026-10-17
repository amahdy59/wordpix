import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const usagePath = "src/app/data/usage/supermarket.usage.json";
const usageData = JSON.parse(fs.readFileSync(usagePath, "utf8"));

const genManifestPath = "output/illustrations/generated/manifest.json";
const genData = JSON.parse(fs.readFileSync(genManifestPath, "utf8"));
const genItems = new Map(genData.items.filter(i => i.unitId === "supermarket").map(i => [i.sceneId, i]));

const reviewedGeneratedPath = "src/app/generated/reviewedGeneratedSceneMedia.json";
const reviewedGenerated = JSON.parse(fs.readFileSync(reviewedGeneratedPath, "utf8"));

const galleryItems = [];

for (const lesson of usageData) {
  for (const scene of lesson.usage.scenes) {
    const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
    const gen = genItems.get(sceneId);
    const existingReviewed = reviewedGenerated[sceneId];

    let meta = null;
    let localWebpExists = false;
    if (gen && fs.existsSync(gen.localWebp)) {
      localWebpExists = true;
      try {
        meta = await sharp(gen.localWebp).metadata();
      } catch (err) {
        console.error(`Error reading metadata for ${gen.localWebp}:`, err.message);
      }
    }

    galleryItems.push({
      sceneId,
      lessonId: lesson.lessonId,
      lessonName: lesson.lessonName,
      chunkNumber: scene.chunkNumber,
      targetWords: scene.targetWords,
      expectedAnswer: scene.check.expectedAnswer,
      question: scene.check.question,
      options: scene.check.options,
      scenario: scene.scenario,
      imageBrief: scene.imageBrief,
      imageAlt: scene.imageAlt,
      existingReviewed: existingReviewed ? {
        imagePath: existingReviewed.imagePath,
        imageAlt: existingReviewed.imageAlt
      } : null,
      gen: gen ? {
        localWebp: gen.localWebp,
        bytes: gen.bytes,
        width: meta?.width,
        height: meta?.height,
        format: meta?.format
      } : null,
      localWebpExists
    });
  }
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>WordPix — Supermarket 123 Candidate Scenes Audit Gallery</title>
<style>
:root{color-scheme:light;--ink:#173343;--paper:#fff;--surface:#edf5f7;--accent:#0e7490;--border:#cbd5e1;--focus:#173343}
*{box-sizing:border-box}
body{margin:0;padding:24px;font:16px/1.5 system-ui,sans-serif;color:var(--ink);background:var(--surface)}
main{max-width:1600px;margin:auto}
h1{line-height:1.2;margin-bottom:8px}
.summary-bar{background:var(--paper);padding:16px 24px;border-radius:12px;margin-bottom:24px;border:1px solid var(--border)}
section{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,480px),1fr));gap:24px}
article{padding:20px;background:var(--paper);border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06);border:1px solid var(--border);display:flex;flex-direction:column}
.badge{display:inline-block;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:600}
.badge-new{background:#dcfce7;color:#166534}
.badge-existing{background:#fef3c7;color:#92400e}
h2{margin:8px 0 4px;font-size:18px}
.tag{font-size:13px;color:#64748b;margin:0 0 12px}
.img-container{position:relative;width:100%;background:#f1f5f9;border-radius:8px;overflow:hidden;margin-bottom:12px;aspect-ratio:1/1}
img{width:100%;height:100%;object-fit:cover;display:block}
.meta-grid{font-size:13px;display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#f8fafc;padding:12px;border-radius:8px;margin-top:auto}
.detail-label{font-weight:600;color:#475569}
.scenario-box{font-size:14px;color:#334155;margin:8px 0;background:#f8fafc;padding:10px;border-left:3px solid var(--accent);border-radius:0 6px 6px 0}
.question-box{font-size:13px;color:#0f172a;margin:4px 0 8px;font-weight:500}
</style>
</head>
<body>
<main>
<h1>WordPix Supermarket Scene Audit Gallery</h1>
<div class="summary-bar">
  <strong>Total Supermarket Scenes:</strong> ${galleryItems.length} |
  <strong>Existing Mapped References (Preserved):</strong> ${galleryItems.filter(i => i.existingReviewed).length} |
  <strong>Candidate Generated WebP Files:</strong> ${galleryItems.filter(i => i.localWebpExists).length}
</div>
<section>
${galleryItems.map(item => {
  const isExisting = Boolean(item.existingReviewed);
  const badgeClass = isExisting ? "badge-existing" : "badge-new";
  const badgeText = isExisting ? "PRESERVED R2 MAPPING" : "CANDIDATE BATCH";
  const relativeImgSrc = item.gen?.localWebp ? `../../${item.gen.localWebp}` : "";

  return `
  <article id="${item.sceneId}">
    <div>
      <span class="badge ${badgeClass}">${badgeText}</span>
      <h2>${item.expectedAnswer}</h2>
      <p class="tag">${item.lessonName} (${item.lessonId}) · Scene ${item.chunkNumber} · ID: ${item.sceneId}</p>
    </div>
    
    <div class="img-container">
      ${item.localWebpExists 
        ? `<img src="${relativeImgSrc}" alt="Candidate for ${item.expectedAnswer}: ${item.scenario}" loading="lazy" width="1024" height="1024">`
        : `<div style="padding:40px;text-align:center;color:#ef4444;">No image file found</div>`
      }
    </div>

    <div class="scenario-box">
      <strong>Scenario:</strong> ${item.scenario}
    </div>

    <div class="question-box">
      <strong>Question:</strong> ${item.question}<br>
      <strong>Answer:</strong> <span style="color:#0284c7;font-weight:700">${item.expectedAnswer}</span> | 
      <strong>Options:</strong> ${item.options.join(", ")}
    </div>

    <div class="meta-grid">
      <div><span class="detail-label">File:</span> ${item.sceneId}.webp</div>
      <div><span class="detail-label">Size:</span> ${item.gen ? Math.round(item.gen.bytes / 1024) + ' KB' : 'N/A'}</div>
      <div><span class="detail-label">Dimensions:</span> ${item.gen?.width}×${item.gen?.height}</div>
      <div><span class="detail-label">Format:</span> ${item.gen?.format?.toUpperCase()}</div>
      ${isExisting ? `<div style="grid-column: span 2; color:#b45309;"><strong>Existing R2 Path:</strong> ${item.existingReviewed.imagePath}</div>` : ''}
    </div>
  </article>
  `;
}).join("\n")}
</section>
</main>
</body>
</html>
`;

fs.mkdirSync("docs/content-review", { recursive: true });
fs.writeFileSync("docs/content-review/supermarket-review-gallery.html", html, "utf8");
console.log("Wrote docs/content-review/supermarket-review-gallery.html successfully!");
