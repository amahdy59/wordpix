import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadGenerationSource,
  loadGenerationReviews,
  assertLessonReviewReady,
  contentIssues,
} from "./lib/usage_generation_preflight.mjs";

export function auditGenerationReadiness(sourceRoot, reviewFile) {
  const dir = path.join(sourceRoot, "src/app/data/usage");
  const records = [];
  const reviews = loadGenerationReviews(sourceRoot, reviewFile);
  for (const file of fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".usage.json"))
    .sort()) {
    const lessons = JSON.parse(
      fs.readFileSync(path.join(dir, file), "utf8").replace(/^\uFEFF/u, "")
    );
    for (const lesson of lessons) {
      const item = {
        unitId: lesson.unitId,
        lessonId: lesson.lessonId,
        sceneId: `${lesson.lessonId}-usage-scene-${lesson.usage.scenes[0].chunkNumber}`,
      };
      const source = loadGenerationSource(item, sourceRoot);
      const issues = contentIssues(source.lesson, source.phrases);
      const contentReview = reviews.find(
        (r) => r.unitId === item.unitId && r.lessonId === item.lessonId
      );
      let status = issues.length ? "content-repair-required" : "whole-lesson-review-required";
      let reviewIssue;
      if (contentReview) {
        try {
          assertLessonReviewReady({ ...item, contentReview }, sourceRoot);
          status = "generation-approved";
        } catch (error) {
          reviewIssue = error.message;
        }
      }
      records.push({
        unitId: lesson.unitId,
        lessonId: lesson.lessonId,
        lessonSha256: source.digest,
        scenes: lesson.usage.scenes.length,
        heldScenes: lesson.usage.scenes.filter((scene) => scene.imageGenerationHold).length,
        status,
        issues,
        reviewIssue,
      });
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    sourceRoot: path.resolve(sourceRoot),
    lessons: records.length,
    scenes: records.reduce((n, r) => n + r.scenes, 0),
    heldScenes: records.reduce((n, r) => n + r.heldScenes, 0),
    lessonsWithContentIssues: records.filter((r) => r.issues.length).length,
    generationApproved: records.filter((r) => r.status === "generation-approved").length,
    records,
  };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = Object.fromEntries(
    process.argv
      .slice(2)
      .filter((a) => a.startsWith("--") && a.includes("="))
      .map((a) => {
        const i = a.indexOf("=");
        return [a.slice(2, i), a.slice(i + 1)];
      })
  );
  const report = auditGenerationReadiness(path.resolve(args.source ?? "."), args.reviews);
  const output = path.resolve(args.output ?? "output/image-generation-readiness.json");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ ...report, records: undefined, output }));
}
