import { readFile, writeFile } from "node:fs/promises";
import { LEARNING_PATH_UNIT_IDS } from "../src/app/data/courseCatalog";
import { loadUnitVocabulary } from "../src/app/data/vocabulary";
import { unitUsageDataSchema, type UnitUsageData } from "../src/app/data/usageTypes";

export async function syncGlosses() {
  const ledgerPath = "docs/lesson-content-audit/editorial-corrections.json";
  const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
  const normalize = (s: string) =>
    s
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  const pending: Array<{ path: string; lessons: unknown }> = [];
  let count = 0;
  for (const unit of LEARNING_PATH_UNIT_IDS) {
    const path = `src/app/data/usage/${unit}.usage.json`;
    const lessons = JSON.parse(await readFile(path, "utf8")) as UnitUsageData;
    unitUsageDataSchema.parse(lessons);
    const words = await loadUnitVocabulary(unit);
    let changed = false;
    for (const lesson of lessons) {
      const glosses = lesson.targetWordsEnglish.map((label, index) => {
        const word = words.find((item) => normalize(item.label) === normalize(label));
        if (!word) throw new Error(`Unresolved target: ${unit}/${label}`);
        // The original, directly authored units use locale dictionaries instead
        // of bilingual overlays. Retain their existing contextual Arabic gloss.
        const gloss = word.arabicTranslation?.trim() || lesson.targetWordsArabic[index];
        if (!gloss?.trim()) throw new Error(`Missing Arabic meaning: ${unit}/${label}`);
        return gloss;
      });
      if (JSON.stringify(glosses) === JSON.stringify(lesson.targetWordsArabic)) continue;
      const key = `${unit}/${lesson.lessonId}/targetWordsArabic`;
      ledger[key] = {
        unit,
        id: lesson.lessonId,
        field: "targetWordsArabic",
        before: ledger[key]?.before ?? lesson.targetWordsArabic,
        after: glosses,
      };
      lesson.targetWordsArabic = glosses;
      count++;
      changed = true;
    }
    if (changed) pending.push({ path, lessons });
  }
  for (const { path, lessons } of pending)
    await writeFile(path, JSON.stringify(lessons, null, 2) + "\n");
  await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
  console.log(`Aligned Arabic target glosses in ${count} lessons.`);
}
