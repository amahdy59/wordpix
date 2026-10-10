import { describe, expect, it } from "vitest";
import { LEARNING_PATH_UNIT_IDS } from "../data/courseCatalog";
import { loadUnitVocabulary } from "../data/vocabulary";
import { loadUnitUsageForEditorial } from "../data/usageRegistry";
import { applySceneLearningContext } from "../data/sceneLearningContext.mjs";
import readingRepairs from "../../../scripts/reading_editorial_repairs.json";

describe("editorial content regression", () => {
  it("supplies actual Arabic glosses throughout the curriculum", async () => {
    for (const unit of LEARNING_PATH_UNIT_IDS) {
      const words = await loadUnitVocabulary(unit);
      for (const word of words) {
        expect(word.arabicTranslation ?? "", `${unit}/${word.id}`).not.toMatch(
          /مصطلح مرتبط|يُسمّى|يُسمى/u
        );
        expect(word.description.trim(), `${unit}/${word.id}`).not.toBe("");
      }
    }
  });

  it("uses the lesson-specific sense for ambiguous labels", async () => {
    const cases = [
      ["shapes-geometry", "pentagon", /five straight sides/u],
      ["family", "father", /parent/u],
      ["coffee-shop", "grinder", /coffee beans/u],
      ["embassy", "interpreter", /spoken language/u],
      ["embassy", "safe", /lockable box/u],
      ["desert", "butte", /hill/u],
    ] as const;
    for (const [unit, id, meaning] of cases) {
      const word = (await loadUnitVocabulary(unit)).find((item) => item.id === id);
      expect(word?.description, `${unit}/${id}`).toMatch(meaning);
    }
  });

  it("keeps each revised reading's question and metadata aligned", async () => {
    const units = [...new Set(Object.keys(readingRepairs).map((id) => id.replace(/-\d+$/u, "")))];
    for (const unit of units) {
      const lessons = (await loadUnitUsageForEditorial(unit))!;
      for (const lesson of lessons) {
        if (!(lesson.lessonId in readingRepairs)) continue;
        // Later editorial work may refine the passage genre and add more
        // comprehension checks. Verify the current passage and useful answers.
        expect(lesson.reading.text.trim(), lesson.lessonId).not.toBe("");
        const checks = lesson.exercises.filter((ex) => ex.contextTag?.startsWith("reading"));
        expect(checks.length, lesson.lessonId).toBeGreaterThanOrEqual(1);
        for (const check of checks) {
          expect(check.prompt, lesson.lessonId).not.toMatch(/Why is the vocabulary useful/u);
          expect(check.answer.trim(), lesson.lessonId).not.toBe("");
          expect(check.answer, lesson.lessonId).not.toMatch(
            /^(?:Open response|The main case described)$/u
          );
        }
        expect(lesson.exercises.map((ex) => ex.prompt).join("\n")).not.toMatch(
          /Which target word is linked to the main task|Which word appears later in the situation|Why is the vocabulary useful/u
        );
      }
    }
  });

  it("includes the needed scenario and current answer in legacy scene exercises", async () => {
    for (const unit of LEARNING_PATH_UNIT_IDS) {
      for (const lesson of (await loadUnitUsageForEditorial(unit)) ?? []) {
        for (const exercise of lesson.exercises) {
          expect(exercise.prompt).not.toBe(
            "Context choice: Which target word best fits the scene?"
          );
          if (!exercise.contextTag?.startsWith("scene-")) continue;
          const rawScene = lesson.usage.scenes.find(
            (item) => `scene-${item.chunkNumber}` === exercise.contextTag
          );
          expect(rawScene, lesson.lessonId).toBeDefined();
          const scene = applySceneLearningContext(rawScene!);
          expect(exercise.answer, lesson.lessonId).toBe(rawScene!.check.expectedAnswer);
          const matchesRaw =
            exercise.prompt.includes(rawScene!.scenario) &&
            exercise.prompt.includes(rawScene!.check.question);
          const matchesContext =
            exercise.prompt.includes(scene.scenario) &&
            exercise.prompt.includes(scene.check.question);
          expect(matchesRaw || matchesContext, lesson.lessonId).toBe(true);
        }
      }
    }
  });
});
