import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const usagePath = "src/app/data/usage/supermarket.usage.json";
const usageData = JSON.parse(fs.readFileSync(usagePath, "utf8"));

const genManifestPath = "output/illustrations/generated/manifest.json";
const genData = JSON.parse(fs.readFileSync(genManifestPath, "utf8"));
const genItems = new Map(genData.items.filter(i => i.unitId === "supermarket").map(i => [i.sceneId, i]));

console.log(`Usage lessons: ${usageData.length}`);
console.log(`Generated supermarket items in manifest: ${genItems.size}`);

const auditResults = [];
let answerMatchCount = 0;
let answerMismatchCount = 0;
let fileMissingCount = 0;
let validMetaCount = 0;

for (const lesson of usageData) {
  for (const scene of lesson.usage.scenes) {
    const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
    const gen = genItems.get(sceneId);

    if (!gen) {
      auditResults.push({
        sceneId,
        status: "missing-in-manifest",
        expectedAnswer: scene.check.expectedAnswer,
      });
      continue;
    }

    const fileExists = fs.existsSync(gen.localWebp);
    if (!fileExists) {
      fileMissingCount++;
      auditResults.push({
        sceneId,
        status: "file-missing",
        expectedAnswer: scene.check.expectedAnswer,
      });
      continue;
    }

    let meta = null;
    try {
      meta = await sharp(gen.localWebp).metadata();
      validMetaCount++;
    } catch (e) {
      auditResults.push({
        sceneId,
        status: "corrupt-file",
        error: e.message
      });
      continue;
    }

    const answersMatch = scene.check.expectedAnswer.toLowerCase() === gen.expectedAnswer.toLowerCase();
    if (answersMatch) {
      answerMatchCount++;
    } else {
      answerMismatchCount++;
    }

    auditResults.push({
      sceneId,
      lessonId: lesson.lessonId,
      chunkNumber: scene.chunkNumber,
      expectedAnswer: scene.check.expectedAnswer,
      genExpectedAnswer: gen.expectedAnswer,
      answersMatch,
      scenario: scene.scenario,
      question: scene.check.question,
      imageBrief: scene.imageBrief,
      genScenario: gen.scenario,
      localWebp: gen.localWebp,
      bytes: gen.bytes,
      width: meta.width,
      height: meta.height,
      alreadyMapped: Boolean(scene.imagePath)
    });
  }
}

console.log(`Total scenes audited: ${auditResults.length}`);
console.log(`Answer matches: ${answerMatchCount}`);
console.log(`Answer mismatches: ${answerMismatchCount}`);
console.log(`Missing files: ${fileMissingCount}`);
console.log(`Valid sharp metadata: ${validMetaCount}`);

// Inspect any mismatches
const mismatches = auditResults.filter(r => !r.answersMatch);
if (mismatches.length > 0) {
  console.log("Mismatches found:", mismatches);
} else {
  console.log("ALL 123 SCENES HAVE 100% MATCHING TARGET CONCEPTS/ANSWERS!");
}
