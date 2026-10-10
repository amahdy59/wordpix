import fs from "node:fs";
import path from "node:path";
import {
  assertGenerationReady,
  loadGenerationSource,
  contentIssues,
  generationReviewChecks,
  loadGenerationReviews,
  referenceGenerationPrompt,
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
const reviews = loadGenerationReviews(sourceRoot, args.reviews);
const items = [],
  blocked = [],
  held = [],
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
    for (const originalScene of lesson.usage.scenes) {
      const sceneId = `${lesson.lessonId}-usage-scene-${originalScene.chunkNumber}`;
      const existing = media[sceneId];
      if (
        originalScene.imagePath ||
        (existing?.reviewedScenario === originalScene.scenario &&
          existing.reviewedAnswer === originalScene.check.expectedAnswer &&
          (!existing.reviewedQuestion ||
            existing.reviewedQuestion === originalScene.check.question))
      ) {
        covered.push({ sceneId, reason: "existing published reference; do not regenerate" });
        continue;
      }
      const scene = loadGenerationSource(
        { unitId, lessonId: lesson.lessonId, sceneId },
        sourceRoot
      ).scene;
      if (scene.imageGenerationHold) {
        held.push({
          sceneId,
          lessonId: lesson.lessonId,
          unitId,
          reason: scene.imageGenerationHold,
        });
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
        contentReview,
      };
      try {
        job.prompt = referenceGenerationPrompt(scene);
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
  `${JSON.stringify({ generatedAt: new Date().toISOString(), sourceRoot, units, items, blocked, held, covered, reviewTemplates }, null, 2)}\n`
);
console.log(
  JSON.stringify({
    output,
    lessons: reviewTemplates.length,
    ready: items.length,
    blocked: blocked.length,
    held: held.length,
    covered: covered.length,
    requests: 0,
  })
);
