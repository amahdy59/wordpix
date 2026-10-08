import { readFile, writeFile } from "node:fs/promises";
import { unitUsageDataSchema } from "../src/app/data/usageTypes.ts";

const path = "src/app/data/usage/ages-life-stages.usage.json";
const lessons = JSON.parse(await readFile(path, "utf8"));
const repairs = JSON.parse(await readFile("scripts/life_stages_usage_repairs.json", "utf8"));
const ledgerPath = "docs/lesson-content-audit/editorial-corrections.json";
const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
function update(lesson, field, object, property, after) {
  if (JSON.stringify(object[property]) === JSON.stringify(after)) return;
  const key = `${lesson.unitId}/${lesson.lessonId}/${field}`;
  ledger[key] = { unit: lesson.unitId, id: lesson.lessonId, field, before: ledger[key]?.before ?? object[property], after };
  object[property] = after;
}
for (const lesson of lessons) {
  const repair = repairs[lesson.lessonId];
  if (!repair || repair.scenes.length !== lesson.usage.scenes.length) throw new Error(`Missing scene review: ${lesson.lessonId}`);
  for (const [index, scene] of lesson.usage.scenes.entries()) {
    const [scenario, question, answer] = repair.scenes[index];
    if (!scene.check.options.includes(answer)) throw new Error(`Invalid answer: ${lesson.lessonId}/${index}`);
    update(lesson, `usage.scenes.${index}.scenario`, scene, "scenario", scenario);
    update(lesson, `usage.scenes.${index}.check.question`, scene.check, "question", question);
    update(lesson, `usage.scenes.${index}.check.expectedAnswer`, scene.check, "expectedAnswer", answer);
  }
  update(lesson, "reading.text", lesson.reading, "text", repair.reading);
  update(lesson, "usage.textType", lesson.usage, "textType", "short-narrative");
  update(lesson, "usage.readingTarget", lesson.usage, "readingTarget", "45-75 words");
  update(lesson, "targetWordsArabic", lesson, "targetWordsArabic", lesson.targetWordsArabic.map((word, index) => lesson.targetWordsEnglish[index] === "Youth" ? "مرحلة الشباب" : word));
  const retained = lesson.exercises.filter((exercise) => !/^scene-\d+$/u.test(exercise.contextTag ?? "") && exercise.contextTag !== "reading" && !/^(?:Specific information|Simple reason|Reading detail):/u.test(exercise.prompt));
  const scenes = lesson.usage.scenes.map((scene, index) => ({ prompt: `${scene.scenario}\n${scene.check.question}`, answer: scene.check.expectedAnswer, questionType: "meaning", responseMode: "short-answer", contextTag: `scene-${index + 1}` }));
  const [prompt, answer] = repair.readingQuestion;
  update(lesson, "exercises", lesson, "exercises", [...scenes, ...retained, { prompt, answer, questionType: "meaning", responseMode: "short-answer", contextTag: "reading" }]);
}
unitUsageDataSchema.parse(lessons);
await writeFile(path, `${JSON.stringify(lessons, null, 2)}\n`);
await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
console.log("Applied individually reviewed scenarios and readings to all four Ages & Life Stages lessons. Media fields remain unchanged.");
