import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

async function auditImages() {
  console.log("=== Comprehensive Image Coverage Audit ===");
  const exactMedia = JSON.parse(
    fs.readFileSync("src/app/generated/reviewedExactSentenceMedia.json", "utf8")
  );
  console.log(`Current exact sentence media entries: ${Object.keys(exactMedia).length}`);

  // 1. Audit Sentence Questions from inventory CSV
  const inventoryStream = fs.createReadStream("docs/question-sentence-image-inventory.csv");
  const rl = readline.createInterface({ input: inventoryStream, crlfDelay: Infinity });

  let totalInv = 0;
  const missingSentenceQuestions = [];
  const exactSentencesCovered = new Set(
    Object.values(exactMedia).map((e) => e.sentence.trim().toLowerCase())
  );

  let rowIdx = 0;
  for await (const line of rl) {
    rowIdx++;
    if (rowIdx === 1) continue;
    const match = line.match(
      /^"([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]*)"/
    );
    if (match) {
      totalInv++;
      const [, questionId, unitId, lessonId, wordId, word, stage, sentence, generationPrompt] = match;
      const norm = sentence.trim().toLowerCase();
      if (!exactSentencesCovered.has(norm)) {
        missingSentenceQuestions.push({
          questionId,
          unitId,
          lessonId,
          wordId,
          word,
          stage,
          sentence,
          generationPrompt,
        });
      }
    }
  }

  console.log(`Total question-sentence inventory rows: ${totalInv}`);
  console.log(
    `Missing sentence illustrations: ${missingSentenceQuestions.length} (${totalInv - missingSentenceQuestions.length} covered)`
  );

  // Group missing sentences by unit
  const missingByUnit = {};
  for (const item of missingSentenceQuestions) {
    if (!missingByUnit[item.unitId]) missingByUnit[item.unitId] = [];
    missingByUnit[item.unitId].push(item);
  }

  // 2. Audit Usage Scenes
  const usageDir = "src/app/data/usage";
  const usageFiles = fs.readdirSync(usageDir).filter((f) => f.endsWith(".usage.json"));
  let totalScenes = 0;
  let scenesWithImage = 0;
  let scenesMissingImage = 0;
  const missingScenesList = [];

  for (const f of usageFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(usageDir, f), "utf8"));
    const unitId = f.replace(".usage.json", "");
    for (const lesson of data) {
      for (const scene of lesson.usage.scenes) {
        totalScenes++;
        if (scene.imagePath && !scene.imagePath.includes("placeholder")) {
          scenesWithImage++;
        } else {
          scenesMissingImage++;
          missingScenesList.push({
            unitId,
            lessonId: lesson.lessonId,
            scenario: scene.scenario,
            question: scene.check?.question,
            expectedAnswer: scene.check?.expectedAnswer,
          });
        }
      }
    }
  }
  console.log(`Usage scenes: ${totalScenes} total, ${scenesWithImage} covered, ${scenesMissingImage} missing`);

  // 3. Audit Vocabulary Words in courseCatalog / lessons
  // Check if any word in courseCatalog has placeholder
  const { COURSE_UNITS } = require("../src/app/data/courseCatalog.ts");
  let totalWords = 0;
  let wordsMissingImage = 0;
  const missingWordsList = [];

  for (const [unitId, unit] of Object.entries(COURSE_UNITS)) {
    for (const group of unit.groups) {
      for (const wordId of group.wordIds) {
        totalWords++;
        // Check if word image exists in public/word-images or is placeholder
        const relJpg = path.join("public/word-images", unitId, `${wordId}.jpg`);
        const relWebp = path.join("public/word-images", unitId, `${wordId}.webp`);
        const relAvif = path.join("public/word-images", unitId, `${wordId}.avif`);
        const exists = fs.existsSync(relJpg) || fs.existsSync(relWebp) || fs.existsSync(relAvif);
        if (!exists) {
          wordsMissingImage++;
          missingWordsList.push({ unitId, wordId });
        }
      }
    }
  }
  console.log(`Vocabulary words: ${totalWords} total, ${totalWords - wordsMissingImage} have local images, ${wordsMissingImage} missing`);

  // Output report file
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      sentenceQuestions: {
        total: totalInv,
        covered: totalInv - missingSentenceQuestions.length,
        missing: missingSentenceQuestions.length,
      },
      usageScenes: {
        total: totalScenes,
        covered: scenesWithImage,
        missing: scenesMissingImage,
      },
      vocabularyWords: {
        total: totalWords,
        covered: totalWords - wordsMissingImage,
        missing: wordsMissingImage,
      },
    },
    missingByUnit: Object.fromEntries(
      Object.entries(missingByUnit).map(([unit, items]) => [unit, items.length])
    ),
    sampleMissingSentenceQuestions: missingSentenceQuestions.slice(0, 30),
    sampleMissingScenes: missingScenesList.slice(0, 20),
    missingWordsList,
  };

  fs.mkdirSync("output/audit", { recursive: true });
  fs.writeFileSync("output/audit/missing_images_report.json", JSON.stringify(report, null, 2));
  console.log("Saved full audit report to output/audit/missing_images_report.json");
}

auditImages().catch(console.error);
