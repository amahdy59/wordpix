import { readFile, writeFile } from "node:fs/promises";
import { unitUsageDataSchema } from "../src/app/data/usageTypes.ts";

const repairs = JSON.parse(await readFile("scripts/reading_editorial_repairs.json", "utf8"));
const questions = JSON.parse(await readFile("scripts/reading_question_repairs.json", "utf8"));
const ledgerPath = "docs/lesson-content-audit/editorial-corrections.json";
const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
const pending = [];
for (const [id, text] of Object.entries(repairs)) {
  const unit = id.replace(/-\d+$/, "");
  const path = `src/app/data/usage/${unit}.usage.json`;
  let entry = pending.find((item) => item.path === path);
  if (!entry) {
    entry = { path, lessons: JSON.parse(await readFile(path, "utf8")) };
    pending.push(entry);
  }
  const lesson = entry.lessons.find((item) => item.lessonId === id);
  if (!lesson || typeof text !== "string" || !text.trim())
    throw new Error(`Invalid reading repair: ${id}`);
  function update(field, object, property, value) {
    if (JSON.stringify(object[property]) === JSON.stringify(value)) return;
    const key = `${unit}/${id}/${field}`;
    ledger[key] = {
      unit,
      id,
      field,
      before: ledger[key]?.before ?? object[property],
      after: value,
    };
    object[property] = value;
  }
  update("reading.text", lesson.reading, "text", text);
  update("reading.title", lesson.reading, "title", `${lesson.lessonName}: A short reading`);
  update("usage.textType", lesson.usage, "textType", "short-narrative");
  update("usage.readingTarget", lesson.usage, "readingTarget", "45-75 words");
  const pair = questions[id];
  if (!pair?.[0]?.trim() || !pair?.[1]?.trim())
    throw new Error(`Missing reviewed comprehension question: ${id}`);
  // Replace stale generic reading-detail checks, keeping intentional production
  // and spaced retrieval. Scene-specific checks are maintained separately.
  const exercises = lesson.exercises.filter(
    (ex) =>
      ex.contextTag !== "reading" &&
      !/^(?:Reading detail|Specific information|Simple reason):/u.test(ex.prompt)
  );
  exercises.push({
    prompt: pair[0],
    answer: pair[1],
    questionType: "meaning",
    responseMode: "short-answer",
    contextTag: "reading",
  });
  update("exercises", lesson, "exercises", exercises);
}
for (const entry of pending) unitUsageDataSchema.parse(entry.lessons);
for (const entry of pending)
  await writeFile(entry.path, JSON.stringify(entry.lessons, null, 2) + "\n");
await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
console.log(`Applied ${Object.keys(repairs).length} individually authored reading passages.`);
