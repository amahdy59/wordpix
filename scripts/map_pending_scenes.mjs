import fs from "node:fs";
import path from "node:path";

const publicSceneDir = "public/scene-images";
const overridesPath = "src/app/generated/localAssetOverrides.json";

// 1. Load existing overrides
const existingOverrides = fs.existsSync(overridesPath)
  ? JSON.parse(fs.readFileSync(overridesPath, "utf8"))
  : [];
const overrideSet = new Set(existingOverrides);

let totalCopied = 0;
let totalMapped = 0;

// ==========================================
// 1. FARM & COUNTRYSIDE (29 scenes)
// ==========================================
console.log("=== MAPPING FARM & COUNTRYSIDE (29 SCENES) ===");
const farmManifest = JSON.parse(
  fs.readFileSync("docs/content-review/farm-countryside-gemini-batch-29-2026-10-10/manifest.json", "utf8")
);
const farmItemsMap = new Map(farmManifest.items.map(i => [i.sceneId, i]));
const farmUsagePath = "src/app/data/usage/farm.usage.json";
const farmUsage = JSON.parse(fs.readFileSync(farmUsagePath, "utf8"));
let farmMappedCount = 0;

farmUsage.forEach(lesson => {
  (lesson.usage?.scenes || []).forEach(scene => {
    const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
    const item = farmItemsMap.get(sceneId);
    if (item && item.approvalStatus === "approved-standing-visual-qa") {
      const sourcePath = path.join("docs/content-review/farm-countryside-gemini-batch-29-2026-10-10", item.selectedAsset);
      const destFileName = `${sceneId}.webp`;
      const destPath = path.join(publicSceneDir, destFileName);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        totalCopied++;
      }

      scene.imagePath = `scene-images/${destFileName}`;
      scene.imageAlt = item.altText;
      overrideSet.add(`scene-images/${destFileName}`);
      farmMappedCount++;
      totalMapped++;
    }
  });
});

fs.writeFileSync(farmUsagePath, JSON.stringify(farmUsage, null, 2) + "\n");
console.log(`Updated farm.usage.json with ${farmMappedCount} mapped scenes.`);

// ==========================================
// 2. MARKET (29 scenes)
// ==========================================
console.log("\n=== MAPPING MARKET (29 SCENES) ===");
const genManifest = JSON.parse(fs.readFileSync("output/illustrations/generated/manifest.json", "utf8"));
const marketItems = genManifest.items.filter(i => i.unitId === "market");
const marketItemsMap = new Map(marketItems.map(i => [i.sceneId, i]));
const marketUsagePath = "src/app/data/usage/market.usage.json";
const marketUsage = JSON.parse(fs.readFileSync(marketUsagePath, "utf8"));
let marketMappedCount = 0;

marketUsage.forEach(lesson => {
  (lesson.usage?.scenes || []).forEach(scene => {
    const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
    const item = marketItemsMap.get(sceneId);
    if (item && fs.existsSync(item.localWebp)) {
      const destFileName = `${sceneId}.webp`;
      const destPath = path.join(publicSceneDir, destFileName);

      fs.copyFileSync(item.localWebp, destPath);
      totalCopied++;

      scene.imagePath = `scene-images/${destFileName}`;
      scene.imageAlt = `A market setting illustrating ${scene.check.expectedAnswer}: ${scene.scenario}`;
      overrideSet.add(`scene-images/${destFileName}`);
      marketMappedCount++;
      totalMapped++;
    }
  });
});

fs.writeFileSync(marketUsagePath, JSON.stringify(marketUsage, null, 2) + "\n");
console.log(`Updated market.usage.json with ${marketMappedCount} mapped scenes.`);

// ==========================================
// 3. BASIC EMOTIONS (13 scenes, 1 preserved)
// ==========================================
console.log("\n=== MAPPING BASIC EMOTIONS (13 SCENES) ===");
const emotionItems = genManifest.items.filter(i => i.unitId === "basic-emotions");
const emotionItemsMap = new Map(emotionItems.map(i => [i.sceneId, i]));
const emotionUsagePath = "src/app/data/usage/basic-emotions.usage.json";
const emotionUsage = JSON.parse(fs.readFileSync(emotionUsagePath, "utf8"));
let emotionMappedCount = 0;

emotionUsage.forEach(lesson => {
  (lesson.usage?.scenes || []).forEach(scene => {
    const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
    if (sceneId === "basic-emotions-1-usage-scene-1") {
      console.log(`Preserving ${sceneId} for R2 reviewedMedia resolution.`);
      return;
    }
    const item = emotionItemsMap.get(sceneId);
    if (item && fs.existsSync(item.localWebp)) {
      const destFileName = `${sceneId}.webp`;
      const destPath = path.join(publicSceneDir, destFileName);

      fs.copyFileSync(item.localWebp, destPath);
      totalCopied++;

      scene.imagePath = `scene-images/${destFileName}`;
      scene.imageAlt = `An adult learning scene illustrating ${scene.check.expectedAnswer}: ${scene.scenario}`;
      overrideSet.add(`scene-images/${destFileName}`);
      emotionMappedCount++;
      totalMapped++;
    }
  });
});

fs.writeFileSync(emotionUsagePath, JSON.stringify(emotionUsage, null, 2) + "\n");
console.log(`Updated basic-emotions.usage.json with ${emotionMappedCount} mapped scenes.`);

// ==========================================
// 4. HUMAN BODY: HEAD & FACE (5 scenes)
// ==========================================
console.log("\n=== MAPPING HUMAN BODY: HEAD & FACE (5 SCENES) ===");
const headFaceAltTexts = {
  "human-body-head-and-face-1-usage-scene-1": "A clinical examination of the scalp covering a patient's head in a bright clinic setting.",
  "human-body-head-and-face-1-usage-scene-2": "A barber neatly trimming hair around the temple and forehead area.",
  "human-body-head-and-face-1-usage-scene-3": "A passport portrait photograph clearly displaying the jaw and chin.",
  "human-body-head-and-face-1-usage-scene-4": "A healthcare consultation examining the throat and eye area.",
  "human-body-head-and-face-1-usage-scene-5": "An optometrist testing a patient's eye and pupil during an examination."
};

const headFaceFileMap = {
  "human-body-head-and-face-1-usage-scene-1": "head-scalp-examination-medical.webp",
  "human-body-head-and-face-1-usage-scene-2": "head-haircut-temple-forehead.webp",
  "human-body-head-and-face-1-usage-scene-3": "head-passport-photo-jaw-chin.webp",
  "human-body-head-and-face-1-usage-scene-4": "head-pharmacy-consultation-throat-eye.webp",
  "human-body-head-and-face-1-usage-scene-5": "head-optometrist-eye-pupil-test.webp"
};

const headFaceUsagePath = "src/app/data/usage/human-body-head-and-face.usage.json";
const headFaceUsage = JSON.parse(fs.readFileSync(headFaceUsagePath, "utf8"));
let headFaceMappedCount = 0;

headFaceUsage.forEach(lesson => {
  if (lesson.lessonId === "human-body-head-and-face-1") {
    (lesson.usage?.scenes || []).forEach(scene => {
      const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
      const fileName = headFaceFileMap[sceneId];
      if (fileName && fs.existsSync(path.join(publicSceneDir, fileName))) {
        scene.imagePath = `scene-images/${fileName}`;
        scene.imageAlt = headFaceAltTexts[sceneId];
        overrideSet.add(`scene-images/${fileName}`);
        headFaceMappedCount++;
        totalMapped++;
      }
    });
  }
});

fs.writeFileSync(headFaceUsagePath, JSON.stringify(headFaceUsage, null, 2) + "\n");
console.log(`Updated human-body-head-and-face.usage.json with ${headFaceMappedCount} mapped scenes.`);

// ==========================================
// 5. UPDATE LOCAL ASSET OVERRIDES
// ==========================================
const updatedOverrides = Array.from(overrideSet).sort();
fs.writeFileSync(overridesPath, JSON.stringify(updatedOverrides, null, 2) + "\n");
console.log(`\nUpdated localAssetOverrides.json: ${updatedOverrides.length} entries.`);
console.log(`TOTAL SCENES MAPPED: ${totalMapped}`);
console.log(`TOTAL FILES COPIED TO public/scene-images: ${totalCopied}`);
