import fs from "node:fs/promises";
const reviewed = new Set(JSON.parse(await fs.readFile("scripts/reviewed_vocabulary_units.json", "utf8")));
const files = (await fs.readdir("src/app/data/usage")).filter((name) => name.endsWith(".usage.json"));
const units = files.map((name) => name.replace(/\.usage\.json$/, ""));
for (const unit of reviewed) if (!units.includes(unit)) throw new Error(`Unknown reviewed unit: ${unit}`);
const rows = [];
for (const unit of units) {
  const lessons = JSON.parse(await fs.readFile(`src/app/data/usage/${unit}.usage.json`, "utf8"));
  rows.push({
    unit,
    lessons: lessons.map((item) => item.lessonId),
    definitionAndArabicReview: reviewed.has(unit) ? "read-individually; corrections recorded or queued" : "pending-complete-manual-read",
    scenarioAndQuestionReview: "pending-complete-manual-read",
    imageReview: "pending; R2 references read-only",
  });
}
await fs.writeFile("docs/lesson-content-audit/manual-review-progress.json", JSON.stringify({
  method: "Tracks manual English-definition and Arabic-gloss reads independently from structural checks. A vocabulary read does not approve all lesson examples, questions, or images. Candidate repair batches must be applied and verified before closing the unit.",
  units: rows.length,
  vocabularyUnitsRead: reviewed.size,
  completeLessonApprovals: 0,
  records: rows,
}, null, 2) + "\n");
console.log(`Recorded ${reviewed.size}/${rows.length} complete vocabulary-definition/gloss reads; complete lesson approval remains pending.`);
