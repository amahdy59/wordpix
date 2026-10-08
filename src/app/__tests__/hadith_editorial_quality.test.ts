import { describe, expect, it } from "vitest";
import { FIGMA_HADITH_LESSONS } from "../learning/hadith/figmaHadithCatalog";
import { getParsedHadithStages } from "../learning/hadith/hadithLessonContent";
import { getHadithExerciseSet } from "../learning/hadith/hadithExerciseCatalog";
import learnerGlosses from "../learning/hadith/hadithLearnerGlosses.json";

describe("Hadith editorial review", () => {
  it("keeps actual translations separate from teaching and interface notes", () => {
    for (const lesson of FIGMA_HADITH_LESSONS) {
      expect(lesson.source.translation, lesson.id).not.toMatch(
        /This authentic chain|This Hadith focuses|This Hadith forms|said:\s*$|\.\.\./
      );
    }
    expect(FIGMA_HADITH_LESSONS[1].source.translation).toMatch(/inform me about Islam/i);
    expect(FIGMA_HADITH_LESSONS[1].source.translation).toMatch(/Ihsan/);
    expect(FIGMA_HADITH_LESSONS[23].source.translation).toMatch(/needle/);
    expect(FIGMA_HADITH_LESSONS[25].source.translation).toMatch(/road/);
    expect(FIGMA_HADITH_LESSONS[36].source.translation).toMatch(/one bad deed/);
  });
  it("uses meaningful recall rather than metadata recognition or entire-source answers", () => {
    for (const lesson of FIGMA_HADITH_LESSONS) {
      const parsed = getParsedHadithStages(lesson);
      expect(parsed.overview.coreWordsCount).toBe(5);
      expect(parsed.overview.estimatedMinutes).toBeGreaterThanOrEqual(15);
      expect(parsed.overview.outcomes.map((item) => item.description).join(" ")).not.toMatch(
        /Start Lesson|EST\. TIME|sunnah\.com/
      );
      expect(
        Object.keys((learnerGlosses as Record<string, Record<string, string>>)[lesson.id])
      ).toHaveLength(5);
      expect(parsed.warmup.choices.join(" "), lesson.id).not.toMatch(
        /Current Progress|Progress Tracker|^Back |Your Lesson Progress|unlock/i
      );
      expect(parsed.warmup.question, lesson.id).not.toMatch(/select all|sort these|Reaction B/i);
      for (const review of parsed.review) {
        expect(review.answer, lesson.id).not.toBe(lesson.source.translation);
        expect(review.answer.split(/\s+/).length, lesson.id).toBeLessThan(70);
      }
      for (const exercise of getHadithExerciseSet(lesson.id)!.exercises) {
        expect(exercise.prompt).not.toMatch(
          /which (?:opening|ending|excerpt|learning note|source citation)|which main lesson did you just study/i
        );
      }
      expect(parsed.speak.modelDialogue.join(" "), lesson.id).not.toMatch(
        /click to|Speaking.*Complete|voice.*locally/i
      );
      expect(parsed.speak.checklist.join(" "), lesson.id).not.toMatch(
        /Stage Complete|Proceed to Review/i
      );
    }
  });
  it("orders the pillars consistently with this displayed narration", () => {
    const sequence = getHadithExerciseSet("hadith-03")!.exercises.find(
      (item) => item.id === "pillar-order"
    );
    expect(sequence?.type).toBe("sequence");
    if (sequence?.type === "sequence")
      expect(sequence.answerOrder).toEqual(["shahada", "prayer", "zakat", "hajj", "fasting"]);
  });
});
