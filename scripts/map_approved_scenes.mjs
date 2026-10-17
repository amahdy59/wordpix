import fs from "node:fs";
import path from "node:path";

const usageDir = "src/app/data/usage";
const reviewDir = "docs/content-review";
const publicSceneDir = "public/scene-images";

const batches = [
  "bakery-cafe-gemini-batch-43-2026-10-10",
  "farm-countryside-gemini-batch-29-2026-10-10",
  "food-bathroom-gemini-batch-21-2026-10-10",
  "home-suite-gemini-batch-34-2026-10-10",
  "nature-weather-gemini-batch-40-2026-10-10",
  "spatial-toys-gemini-batch-26-2026-10-10",
  "time-calendar-gemini-batch-34-2026-10-10"
];

// Load existing local asset overrides
let existingOverrides = [];
const overridesPath = "src/app/generated/localAssetOverrides.json";
if (fs.existsSync(overridesPath)) {
  existingOverrides = JSON.parse(fs.readFileSync(overridesPath, "utf8"));
} else {
  existingOverrides = [
    "word-images/human-body-head-and-face/crown.avif",
    "scene-images/bedroom-stool-mirror-bookshelf.webp",
    "scene-images/bedroom-chest-of-drawers.webp",
    "scene-images/bedroom-fitted-bed-sheet.webp",
    "scene-images/bedroom-window-curtains.webp",
    "scene-images/bedroom-electrical-wall-outlet.webp",
    "scene-images/bedroom-potted-indoor-plant.webp",
    "scene-images/bedroom-metal-wastebasket.webp",
    "scene-images/bedroom-reading-glasses-album.webp",
    "scene-images/bedroom-bedside-tablet-stand.webp",
    "scene-images/bedroom-remote-control.webp"
  ];
}

const overrideSet = new Set(existingOverrides);

// Collect items to map from the 7 approved batches
const itemsToMap = new Map(); // sceneId -> { batch, item }
for (const b of batches) {
  const mPath = path.join(reviewDir, b, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(mPath, "utf8"));
  for (const item of manifest.items || []) {
    if (item.approvalStatus === "approved-standing-visual-qa") {
      itemsToMap.set(item.sceneId, { batch: b, item });
    }
  }
}

console.log(`Loaded ${itemsToMap.size} approved items from batches.`);

// Group curriculum files by usage file
const usageFiles = fs.readdirSync(usageDir).filter(f => f.endsWith(".usage.json"));
let mappedCount = 0;
let copiedCount = 0;

for (const f of usageFiles) {
  const filePath = path.join(usageDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let modified = false;

  data.forEach((lesson) => {
    (lesson.usage?.scenes || []).forEach((scene) => {
      const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
      if (!scene.imagePath && itemsToMap.has(sceneId)) {
        const { batch, item } = itemsToMap.get(sceneId);
        const sourcePath = path.join(reviewDir, batch, item.selectedAsset);
        const destFileName = `${sceneId}.webp`;
        const destPath = path.join(publicSceneDir, destFileName);

        if (fs.existsSync(sourcePath)) {
          // Copy to public/scene-images
          fs.copyFileSync(sourcePath, destPath);
          copiedCount++;

          // Update scene object
          scene.imagePath = `scene-images/${destFileName}`;
          scene.imageAlt = item.altText;

          // Track in overrides
          overrideSet.add(`scene-images/${destFileName}`);

          modified = true;
          mappedCount++;
        }
      }
    });
  });

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    console.log(`Updated ${f}`);
  }
}

// Save updated localAssetOverrides.json
const updatedOverrides = Array.from(overrideSet).sort();
fs.writeFileSync(overridesPath, JSON.stringify(updatedOverrides, null, 2) + "\n");
console.log(`Saved ${updatedOverrides.length} overrides to ${overridesPath}`);
console.log(`Mapped ${mappedCount} scenes, copied ${copiedCount} files.`);
