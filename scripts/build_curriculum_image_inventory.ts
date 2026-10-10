import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { CURRICULUM_SEQUENCE } from "../src/app/data/curriculumSequence";

const sourceRoot = path.resolve(".");
const primaryRoot = "C:/Users/AhmedMahdy/OneDrive - Advansys IS/Documents/Antigravity/WordPix";

export const sha256 = (bytes: Buffer | string) =>
  crypto.createHash("sha256").update(bytes).digest("hex");

console.log("=== WORDPIX PHASE 1: CURRICULUM INVENTORY & BACKLOG RECONCILIATION ===");
console.log(`Source root: ${sourceRoot}`);
console.log(`Curriculum sequence units: ${CURRICULUM_SEQUENCE.length}`);

// 1. Load Selections & Manifests
const vocabSelectionsFile = path.join(
  sourceRoot,
  "src/app/generated/reviewedVocabularyImageSelections.json"
);
const vocabSelections: Record<string, string> = fs.existsSync(vocabSelectionsFile)
  ? JSON.parse(fs.readFileSync(vocabSelectionsFile, "utf8"))
  : {};
console.log(
  `Loaded reviewedVocabularyImageSelections: ${Object.keys(vocabSelections).length} entries`
);

const sceneManifestNames = [
  "reviewedUsageIllustrations",
  "reviewedFigmaQuestionMedia",
  "reviewedFigmaObjectScenes",
  "reviewedGeneratedSceneMedia",
];
const sceneManifests: Record<string, { url?: string; image?: string; [key: string]: any }> = {};
for (const name of sceneManifestNames) {
  const file = path.join(sourceRoot, "src/app/generated", `${name}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const map = data.scenes ?? data;
    for (const [k, v] of Object.entries(map)) {
      sceneManifests[k] = v as any;
    }
  }
}
console.log(`Loaded scene manifests combined: ${Object.keys(sceneManifests).length} entries`);

// 2. Index Local Approved / Historical Candidate Batches
const localApprovedCandidates = new Map<string, { path: string; sha256: string; source: string }>();

// 2a. Numbers & Counting Batch 40 (tracked in docs/content-review/numbers-gemini-batch-40-2026-10-10)
const numbersManifestFile = path.join(
  sourceRoot,
  "docs/content-review/numbers-gemini-batch-40-2026-10-10/manifest.json"
);
if (fs.existsSync(numbersManifestFile)) {
  const numbersData = JSON.parse(fs.readFileSync(numbersManifestFile, "utf8"));
  for (const item of numbersData.items || []) {
    const key = `numbers-counting/${item.word.toLowerCase()}`;
    localApprovedCandidates.set(key, {
      path: item.selectedPath || item.originalPath,
      sha256: item.selectedSha256 || item.originalSha256,
      source: "numbers-gemini-batch-40-2026-10-10",
    });
  }
}
console.log(`Indexed local candidates from numbers batch: ${localApprovedCandidates.size}`);

// 2b. Theme review (kitchen / bedroom candidates in output/theme-review-kitchen-bedroom)
const themeReviewFile = path.join(sourceRoot, "output/theme-review-kitchen-bedroom/reviews.json");
if (fs.existsSync(themeReviewFile)) {
  const themeData = JSON.parse(fs.readFileSync(themeReviewFile, "utf8"));
  let themeCount = 0;
  for (const item of themeData.items || []) {
    if (item.status === "approved" || item.automatedTriage?.status === "approved") {
      const key = `${item.unitId}/${item.reviewedAnswer.toLowerCase()}`;
      localApprovedCandidates.set(key, {
        path: item.sourceFile,
        sha256: item.sha256,
        source: "output/theme-review-kitchen-bedroom",
      });
      themeCount++;
    }
  }
  console.log(`Indexed approved candidates from theme review: ${themeCount}`);
}

// 3. Compare 6 Dirty Drafts in Primary Checkout
const dirtyDraftNames = [
  "classroom",
  "fruits",
  "market",
  "office-supplies",
  "supermarket",
  "vegetables",
];
const draftsComparison: Record<string, any> = {};

for (const name of dirtyDraftNames) {
  const reviewedUsagePath = path.join(sourceRoot, "src/app/data/usage", `${name}.usage.json`);
  const primaryUsagePath = path.join(primaryRoot, "src/app/data/usage", `${name}.usage.json`);

  if (fs.existsSync(reviewedUsagePath) && fs.existsSync(primaryUsagePath)) {
    const reviewedLessons = JSON.parse(fs.readFileSync(reviewedUsagePath, "utf8"));
    const primaryLessons = JSON.parse(fs.readFileSync(primaryUsagePath, "utf8"));

    const revLessonIds = new Set(reviewedLessons.map((l: any) => l.lessonId));
    const priLessonIds = new Set(primaryLessons.map((l: any) => l.lessonId));

    const revScenes = reviewedLessons.flatMap((l: any) =>
      l.usage.scenes.map((s: any) => ({
        lessonId: l.lessonId,
        sceneId: `${l.lessonId}-usage-scene-${s.chunkNumber}`,
        expectedAnswer: s.check?.expectedAnswer,
        scenario: s.scenario,
      }))
    );
    const priScenes = primaryLessons.flatMap((l: any) =>
      l.usage.scenes.map((s: any) => ({
        lessonId: l.lessonId,
        sceneId: `${l.lessonId}-usage-scene-${s.chunkNumber}`,
        expectedAnswer: s.check?.expectedAnswer,
        scenario: s.scenario,
      }))
    );

    const changedScenes: any[] = [];
    for (const ps of priScenes) {
      const rs = revScenes.find((s: any) => s.sceneId === ps.sceneId);
      if (!rs) {
        changedScenes.push({ sceneId: ps.sceneId, type: "added_in_primary" });
      } else if (rs.expectedAnswer !== ps.expectedAnswer || rs.scenario !== ps.scenario) {
        changedScenes.push({
          sceneId: ps.sceneId,
          type: "modified",
          reviewedAnswer: rs.expectedAnswer,
          primaryAnswer: ps.expectedAnswer,
          scenarioDiff: rs.scenario !== ps.scenario,
        });
      }
    }

    draftsComparison[name] = {
      reviewedLessonsCount: reviewedLessons.length,
      primaryLessonsCount: primaryLessons.length,
      reviewedScenesCount: revScenes.length,
      primaryScenesCount: priScenes.length,
      changedScenesCount: changedScenes.length,
      changedScenesSummary: changedScenes.slice(0, 10),
    };
  }
}

fs.mkdirSync(path.join(sourceRoot, "output"), { recursive: true });
fs.writeFileSync(
  path.join(sourceRoot, "output/primary-drafts-comparison-2026-10-10.json"),
  JSON.stringify(draftsComparison, null, 2)
);
console.log(`Saved primary drafts comparison to output/primary-drafts-comparison-2026-10-10.json`);

// 4. Enumerate All 200 Units (Vocabulary + Usage Scenes)
interface InventoryRecord {
  unitId: string;
  wordId: string;
  sceneId: string | null;
  lessonId: string | null;
  concept: string;
  sense: string;
  purpose: "word-reference" | "usage-scene";
  cefr: string;
  originalPath: string | null;
  originalSha256: string | null;
  resolvedRuntimePath: string | null;
  classification:
    | "reuse-clear"
    | "local-approved-unpublished"
    | "needs-replacement"
    | "missing"
    | "needs-content-repair"
    | "held-policy"
    | "provider-reconciliation-required";
  reason: string;
  candidatePaths: string[];
  sourceCommit: string;
  reviewStatus: "approved" | "pending" | "reconciled";
}

const inventory: InventoryRecord[] = [];
const headCommit = "b05659f0";

for (const unitId of CURRICULUM_SEQUENCE) {
  // A. Vocabulary Items
  const unitVocabFile = path.join(sourceRoot, "src/app/data/units", `${unitId}.ts`);
  let vocabItems: any[] = [];
  if (fs.existsSync(unitVocabFile)) {
    try {
      // Dynamic import
      const mod = await import(`../src/app/data/units/${unitId}.ts`);
      vocabItems = mod.VOCABULARY || [];
    } catch (e: any) {
      console.warn(`Could not import vocab for ${unitId}: ${e.message}`);
    }
  }

  for (const item of vocabItems) {
    const rawPath = (item.img || "").replace(/^\.?\//, "");
    const selectedOverride = vocabSelections[rawPath] ?? rawPath;
    const isOverride = selectedOverride !== rawPath;

    let originalSha: string | null = null;
    const localFile = path.join(sourceRoot, "public", rawPath);
    const fileExists = fs.existsSync(localFile);
    if (fileExists) {
      try {
        originalSha = sha256(fs.readFileSync(localFile));
      } catch {}
    }

    // Check candidate
    const candidateKey = `${unitId}/${item.id.toLowerCase()}`;
    const localCandidate = localApprovedCandidates.get(candidateKey);

    let classification: InventoryRecord["classification"] = "reuse-clear";
    let reason = "Published reference verified";
    let reviewStatus: InventoryRecord["reviewStatus"] = "approved";

    if (localCandidate) {
      classification = "local-approved-unpublished";
      reason = `Locally approved candidate from ${localCandidate.source}`;
      reviewStatus = "reconciled";
    } else if (isOverride) {
      classification = "local-approved-unpublished";
      reason = `Selected override mapped in reviewedVocabularyImageSelections.json: ${selectedOverride}`;
      reviewStatus = "reconciled";
    } else if (!fileExists) {
      classification = "missing";
      reason = `Local public reference not found on disk: ${rawPath}`;
      reviewStatus = "pending";
    }

    inventory.push({
      unitId,
      wordId: item.id,
      sceneId: null,
      lessonId: null,
      concept: item.label,
      sense: item.topic || unitId,
      purpose: "word-reference",
      cefr: item.cefr || "A1",
      originalPath: rawPath,
      originalSha256: originalSha,
      resolvedRuntimePath: selectedOverride,
      classification,
      reason,
      candidatePaths: localCandidate ? [localCandidate.path] : [],
      sourceCommit: headCommit,
      reviewStatus,
    });
  }

  // B. Usage Scenes
  const usageFile = path.join(sourceRoot, "src/app/data/usage", `${unitId}.usage.json`);
  if (fs.existsSync(usageFile)) {
    const lessons = JSON.parse(fs.readFileSync(usageFile, "utf8"));
    for (const lesson of lessons) {
      for (const scene of lesson.usage?.scenes || []) {
        const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
        const answer = scene.check?.expectedAnswer || "";
        const mappedMedia = sceneManifests[sceneId];

        const candidateKey = `${unitId}/${answer.toLowerCase()}`;
        const localCandidate = localApprovedCandidates.get(candidateKey);

        let classification: InventoryRecord["classification"] = "reuse-clear";
        let reason = "Published scene reference mapped";
        let reviewStatus: InventoryRecord["reviewStatus"] = "approved";

        if (localCandidate) {
          classification = "local-approved-unpublished";
          reason = `Approved candidate available: ${localCandidate.source}`;
          reviewStatus = "reconciled";
        } else if (mappedMedia) {
          classification = "reuse-clear";
          reason = `Mapped in scene manifest (${mappedMedia.url || mappedMedia.image || "media-entry"})`;
          reviewStatus = "approved";
        } else {
          // No scene artwork mapped yet
          classification = "missing";
          reason = "No scene artwork registered in scene manifests";
          reviewStatus = "pending";
        }

        inventory.push({
          unitId,
          wordId: answer.toLowerCase().replace(/\s+/g, "-"),
          sceneId,
          lessonId: lesson.lessonId,
          concept: answer,
          sense: scene.imageBrief || scene.scenario,
          purpose: "usage-scene",
          cefr: lesson.cefrStage || "A1",
          originalPath: mappedMedia ? mappedMedia.url || mappedMedia.image || null : null,
          originalSha256: null,
          resolvedRuntimePath: mappedMedia ? mappedMedia.url || mappedMedia.image || null : null,
          classification,
          reason,
          candidatePaths: localCandidate ? [localCandidate.path] : [],
          sourceCommit: headCommit,
          reviewStatus,
        });
      }
    }
  }
}

// 5. Aggregate Backlog Statistics
const stats = {
  totalRecords: inventory.length,
  wordReferences: inventory.filter((i) => i.purpose === "word-reference").length,
  usageScenes: inventory.filter((i) => i.purpose === "usage-scene").length,
  byClassification: {} as Record<string, number>,
  byUnit: {} as Record<
    string,
    { total: number; wordRefs: number; scenes: number; missing: number }
  >,
};

for (const item of inventory) {
  stats.byClassification[item.classification] =
    (stats.byClassification[item.classification] || 0) + 1;

  if (!stats.byUnit[item.unitId]) {
    stats.byUnit[item.unitId] = { total: 0, wordRefs: 0, scenes: 0, missing: 0 };
  }
  stats.byUnit[item.unitId].total++;
  if (item.purpose === "word-reference") stats.byUnit[item.unitId].wordRefs++;
  if (item.purpose === "usage-scene") stats.byUnit[item.unitId].scenes++;
  if (item.classification === "missing") stats.byUnit[item.unitId].missing++;
}

console.log("\n=== BACKLOG SUMMARY ===");
console.log(`Total Inventory Items: ${stats.totalRecords}`);
console.log(`Word References: ${stats.wordReferences}`);
console.log(`Usage Scenes: ${stats.usageScenes}`);
console.log("By Classification:", JSON.stringify(stats.byClassification, null, 2));

// Save inventory
fs.writeFileSync(
  path.join(sourceRoot, "output/curriculum-image-backlog.json"),
  JSON.stringify(inventory, null, 2)
);
fs.writeFileSync(
  path.join(sourceRoot, "output/curriculum-image-backlog-summary.json"),
  JSON.stringify(stats, null, 2)
);
console.log("Saved output/curriculum-image-backlog.json and summary");

// 6. Compute Protected Media & Audio Baseline Hash
console.log("\n=== COMPUTING PROTECTED MEDIA & AUDIO BASELINE ===");
const protectedFiles: { path: string; sha256: string; bytes: number }[] = [];

function scanDir(dir: string, relBase = "") {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.join(relBase, entry.name).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      scanDir(full, rel);
    } else if (/\.(webp|avif|png|jpg|mp3|svg|json)$/i.test(entry.name)) {
      const buf = fs.readFileSync(full);
      protectedFiles.push({
        path: rel,
        sha256: sha256(buf),
        bytes: buf.length,
      });
    }
  }
}

// Public images
scanDir(path.join(sourceRoot, "public/word-images"), "public/word-images");
scanDir(path.join(sourceRoot, "public/images"), "public/images");
scanDir(path.join(sourceRoot, "public/learning-scenes"), "public/learning-scenes");
scanDir(path.join(sourceRoot, "public/question-images"), "public/question-images");

// Key manifests & audio manifests
const manifestsToProtect = [
  "src/app/learning/business/businessReadingAudioManifest.json",
  "src/app/learning/conversation/conversationReadingAudioManifest.json",
  "src/app/learning/foundations/pronunciationAudioManifest.json",
  "src/app/learning/hadith/hadithAudioManifest.json",
  "src/app/learning/shared/curriculumAudioManifest.json",
  "src/app/learning/business/businessImageManifest.json",
  "src/app/learning/foundations/figmaPronunciationImageManifest.json",
  "src/app/learning/hadith/figmaHadithImageManifest.json",
  "src/app/generated/reviewedVocabularyImageSelections.json",
  "src/app/generated/reviewedUsageIllustrations.json",
  "src/app/generated/reviewedFigmaQuestionMedia.json",
  "src/app/generated/reviewedFigmaObjectScenes.json",
  "src/app/generated/reviewedGeneratedSceneMedia.json",
];

for (const m of manifestsToProtect) {
  const full = path.join(sourceRoot, m);
  if (fs.existsSync(full)) {
    const buf = fs.readFileSync(full);
    protectedFiles.push({
      path: m,
      sha256: sha256(buf),
      bytes: buf.length,
    });
  }
}

const baselineRecord = {
  computedAt: new Date().toISOString(),
  headCommit,
  totalFiles: protectedFiles.length,
  files: protectedFiles,
};

fs.writeFileSync(
  path.join(sourceRoot, "output/protected-media-baseline-2026-10-10.json"),
  JSON.stringify(baselineRecord, null, 2)
);
console.log(`Protected media & audio baseline created: ${protectedFiles.length} files hashed.`);
