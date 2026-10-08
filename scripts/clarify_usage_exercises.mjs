import { readFile, readdir, writeFile } from "node:fs/promises";
import { unitUsageDataSchema } from "../src/app/data/usageTypes.ts";

const ledgerPath = "docs/lesson-content-audit/editorial-corrections.json";
const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
const pending = [];
let count = 0;
for (const filename of await readdir("src/app/data/usage")) {
  if (!filename.endsWith(".usage.json")) continue;
  const path = `src/app/data/usage/${filename}`;
  const lessons = JSON.parse(await readFile(path, "utf8"));
  let changed = false;
  for (const lesson of lessons) {
    let sceneIndex = 0;
    const before = structuredClone(lesson.exercises);
    for (const exercise of lesson.exercises) {
      if (exercise.prompt === "Context choice: Which target word best fits the scene?") {
        const scene = lesson.usage.scenes[sceneIndex++];
        if (!scene) throw new Error(`Missing scene: ${lesson.lessonId}`);
        exercise.prompt = `${scene.scenario}\n${scene.check.question}`;
        exercise.answer = scene.check.expectedAnswer;
        exercise.contextTag = `scene-${scene.chunkNumber}`;
        exercise.responseMode = "short-answer";
        exercise.questionType = "meaning";
        count++;
      }
    }
    if (JSON.stringify(before) === JSON.stringify(lesson.exercises)) continue;
    const key = `${lesson.unitId}/${lesson.lessonId}/exercises`;
    ledger[key] = {
      unit: lesson.unitId,
      id: lesson.lessonId,
      field: "exercises",
      before: ledger[key]?.before ?? before,
      after: lesson.exercises,
    };
    changed = true;
  }
  if (changed) {
    unitUsageDataSchema.parse(lessons);
    pending.push({ path, lessons });
  }
}
for (const { path, lessons } of pending)
  await writeFile(path, JSON.stringify(lessons, null, 2) + "\n");
await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
console.log(
  `Clarified ${count} scene exercises in ${pending.length} unit files; media mappings untouched.`
);
