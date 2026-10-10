import fs from "node:fs";
import path from "node:path";
import {
  assertGenerationReady,
  loadGenerationSource,
  contentIssues,
  generationReviewChecks,
} from "./lib/usage_generation_preflight.mjs";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--") && a.includes("="))
    .map((a) => {
      const i = a.indexOf("=");
      return [a.slice(2, i), a.slice(i + 1)];
    })
);
const sourceRoot = path.resolve(args.source ?? ".");
const units = (args.units ?? "").split(",").filter(Boolean);
if (!units.length || units.some((unit) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(unit))) {
  throw new Error("Provide a bounded --units=unit-one,unit-two list.");
}
const reviews = args.reviews ? JSON.parse(fs.readFileSync(args.reviews, "utf8")).items : [];
if (!Array.isArray(reviews)) throw new Error("Review file must contain an items array.");
const items = [],
  blocked = [],
  reviewTemplates = [];
const media = Object.assign(
  {},
  ...[
    "reviewedUsageIllustrations",
    "reviewedFigmaQuestionMedia",
    "reviewedFigmaObjectScenes",
    "reviewedGeneratedSceneMedia",
  ].map((name) => {
    const file = path.join(sourceRoot, "src/app/generated", `${name}.json`);
    if (!fs.existsSync(file)) return {};
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return data.scenes ?? data;
  })
);
const covered = [];
for (const unitId of [...new Set(units)]) {
  const lessons = JSON.parse(
    fs.readFileSync(path.join(sourceRoot, "src/app/data/usage", `${unitId}.usage.json`), "utf8")
  );
  for (const lesson of lessons) {
    const first = {
      unitId,
      lessonId: lesson.lessonId,
      sceneId: `${lesson.lessonId}-usage-scene-${lesson.usage.scenes[0].chunkNumber}`,
    };
    const source = loadGenerationSource(first, sourceRoot);
    const contentReview = reviews.find(
      (review) => review.lessonId === lesson.lessonId && review.unitId === unitId
    );
    reviewTemplates.push({
      unitId,
      lessonId: lesson.lessonId,
      status: "pending",
      lessonSha256: source.digest,
      reviewedBy: "",
      reviewedAt: "",
      checks: Object.fromEntries(generationReviewChecks.map((check) => [check, "pending"])),
      sources: [],
      issues: contentIssues(lesson, source.phrases),
    });
    for (const scene of lesson.usage.scenes) {
      const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
      const existing = media[sceneId];
      if (
        scene.imagePath ||
        (existing?.reviewedScenario === scene.scenario &&
          existing.reviewedAnswer === scene.check.expectedAnswer &&
          (!existing.reviewedQuestion || existing.reviewedQuestion === scene.check.question))
      ) {
        covered.push({ sceneId, reason: "existing published reference; do not regenerate" });
        continue;
      }
      const job = {
        unitId,
        lessonId: lesson.lessonId,
        sceneId,
        reviewedScenario: scene.scenario,
        reviewedQuestion: scene.check.question,
        reviewedAnswer: scene.check.expectedAnswer,
        imagePurpose: "word-reference",
        prompt: `Create one realistic adult-learning vocabulary reference. Concept: ${scene.check.expectedAnswer}. ${scene.imageBrief} Prefer a human-free composition. Essential non-gender-specific roles use one modest adult man; any indispensable woman wears hijab covering hair and neck, loose opaque full-length clothing and long sleeves. No incidental people, readable text, labels, logos, watermarks or answer highlighting. 4:3 landscape; preserve meaningful details at mobile size. Return one image.`,
        contentReview,
      };
      try {
        assertGenerationReady(job, sourceRoot);
        items.push(job);
      } catch (error) {
        blocked.push({
          sceneId: job.sceneId,
          lessonId: job.lessonId,
          unitId,
          reason: error.message,
        });
      }
    }
  }
}
const output = path.resolve(args.output ?? "output/reviewed-generation-queue.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(
  output,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), sourceRoot, units, items, blocked, covered, reviewTemplates }, null, 2)}\n`
);
console.log(
  JSON.stringify({
    output,
    lessons: reviewTemplates.length,
    ready: items.length,
    blocked: blocked.length,
    covered: covered.length,
    requests: 0,
  })
);
