import fs from "node:fs";
import path from "node:path";

const reviewedSceneMedia = JSON.parse(fs.readFileSync("src/app/generated/reviewedGeneratedSceneMedia.json", "utf8"));
const reviewedUsage = JSON.parse(fs.readFileSync("src/app/generated/reviewedUsageIllustrations.json", "utf8"));

const usageDir = "src/app/data/usage";
const files = fs.readdirSync(usageDir).filter(f => f.endsWith(".usage.json"));

const normalize = (s) => (s || "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const missingScenes = [];

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(usageDir, file), "utf8"));
  const unitId = file.replace(".usage.json", "");
  
  let unitWords = [];
  const unitFile = path.join("src/app/data/units", unitId + ".json");
  if (fs.existsSync(unitFile)) {
    const u = JSON.parse(fs.readFileSync(unitFile, "utf8"));
    unitWords = u.words || [];
  }

  for (const [lessonId, lessonData] of Object.entries(content)) {
    const scenes = lessonData.scenes || [];
    for (const scene of scenes) {
      for (const chunk of (scene.chunks || [])) {
        const hasBespoke = reviewedSceneMedia[chunk.id] || reviewedUsage[chunk.id] || chunk.imagePath;
        if (!hasBespoke) {
          const targetNorm = normalize(chunk.check?.expectedAnswer);
          const match = unitWords.find(w => {
            const lNorm = normalize(w.label);
            const idNorm = normalize(w.id);
            return lNorm === targetNorm || idNorm === targetNorm || (w.label && w.label.toLowerCase() === (chunk.check?.expectedAnswer || "").toLowerCase());
          });
          if (!match || !match.img) {
            missingScenes.push({
              file,
              unitId,
              lessonId,
              chunkId: chunk.id,
              scenario: chunk.scenario,
              question: chunk.check?.question,
              expectedAnswer: chunk.check?.expectedAnswer,
              imageBrief: chunk.imageBrief
            });
          }
        }
      }
    }
  }
}

console.log(`Missing scenes count: ${missingScenes.length}`);
console.log(JSON.stringify(missingScenes, null, 2));
fs.writeFileSync("docs/missing-scenes-queue.json", JSON.stringify(missingScenes, null, 2));
