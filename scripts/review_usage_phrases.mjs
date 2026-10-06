import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const usageDir = join("src", "app", "data", "usage");
const phraseDir = join("src", "app", "data", "usagePhrases");
const usageFiles = (await readdir(usageDir)).filter((file) => file.endsWith(".usage.json"));
const phraseFiles = (await readdir(phraseDir)).filter((file) => file.endsWith(".phrases.json"));
const lessons = (await Promise.all(usageFiles.map(async (file) => JSON.parse(await readFile(join(usageDir, file), "utf8"))))).flat();
const lessonMap = new Map(lessons.map((lesson) => [lesson.lessonId, lesson]));
const phrases = (await Promise.all(phraseFiles.map(async (file) => JSON.parse(await readFile(join(phraseDir, file), "utf8"))))).flat();
const duplicateIds = phrases.length - new Set(phrases.map((phrase) => phrase.id)).size;
const invalidLinks = phrases.filter((phrase) => {
  const lesson = lessonMap.get(phrase.lessonId);
  const sceneIds = new Set((lesson?.usage.scenes ?? []).map((scene) => `${phrase.lessonId}-usage-scene-${scene.chunkNumber}`));
  return !lesson || lesson.unitId !== phrase.unitId || !sceneIds.has(phrase.sceneId);
});
const missingReviewFields = phrases.filter((phrase) =>
  !phrase.learnerPurpose || !phrase.check?.question || !phrase.practice?.retrieval ||
  !phrase.practice?.personalUse || !phrase.practice?.laterReview ||
  phrase.sourceReview?.status !== "verified-online" || phrase.editorial?.status !== "approved"
);
const weakArabic = phrases.filter((phrase) => phrase.arabicMeaning.trim().length < 2);
const weakExamples = phrases.filter((phrase) => phrase.example.trim().length < 12);
const report = {
  reviewedAt: "2026-10-06",
  phraseRecords: phrases.length,
  duplicateIds,
  invalidLinks: invalidLinks.map(({ id, lessonId, sceneId }) => ({ id, lessonId, sceneId })),
  missingReviewFields: missingReviewFields.map(({ id, phrase }) => ({ id, phrase })),
  weakArabic: weakArabic.map(({ id, phrase }) => ({ id, phrase })),
  weakExamples: weakExamples.map(({ id, phrase }) => ({ id, phrase })),
  result: duplicateIds === 0 && invalidLinks.length === 0 && missingReviewFields.length === 0 && weakArabic.length === 0 && weakExamples.length === 0 ? "pass" : "follow-up-required",
};
await writeFile("docs/USAGE_PHRASE_REVIEW_2026-10-06.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, invalidLinks: invalidLinks.length, missingReviewFields: missingReviewFields.length, weakArabic: weakArabic.length, weakExamples: weakExamples.length }));
