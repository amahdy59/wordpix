import { describe, expect, it } from "vitest";
import {
  HADITH_EXERCISE_SETS,
  getHadithExerciseSet,
} from "../learning/hadith/hadithExerciseCatalog";
import { FIGMA_HADITH_LESSONS } from "../learning/hadith/figmaHadithCatalog";
import {
  checkpointHadithLesson,
  completeHadithLesson,
  normalizeHadithProgress,
} from "../learning/hadith/hadithProgress";

describe("Hadith pilot exercises", () => {
  it("preserves bespoke retrieval activities for lessons 1 through 5", () => {
    expect(HADITH_EXERCISE_SETS.map((set) => set.lessonId)).toEqual([
      "hadith-01",
      "hadith-02",
      "hadith-03",
      "hadith-04",
      "hadith-05",
    ]);
    for (const set of HADITH_EXERCISE_SETS) {
      expect(set.exercises).toHaveLength(3);
      for (const exercise of set.exercises) {
        if (exercise.type === "single-choice") {
          expect(exercise.options.some((option) => option.id === exercise.answerId)).toBe(true);
        } else {
          expect(new Set(exercise.answerOrder)).toEqual(
            new Set(exercise.items.map((item) => item.id))
          );
        }
      }
    }
  });

  it("provides three validated, source-grounded activities for every catalog lesson", () => {
    for (const lesson of FIGMA_HADITH_LESSONS) {
      const set = getHadithExerciseSet(lesson.id);
      expect(set?.lessonId).toBe(lesson.id);
      expect(set?.exercises).toHaveLength(3);

      for (const exercise of set?.exercises ?? []) {
        if (exercise.type === "single-choice") {
          expect(exercise.options.some((option) => option.id === exercise.answerId)).toBe(true);
          expect(new Set(exercise.options.map((option) => option.label)).size).toBe(
            exercise.options.length
          );
        } else {
          expect(new Set(exercise.answerOrder)).toEqual(
            new Set(exercise.items.map((item) => item.id))
          );
        }
      }
    }
  });
});

describe("Hadith offline progress", () => {
  it("checkpoints without mutating prior state and retains the best score", () => {
    const initial = checkpointHadithLesson({}, "hadith-02", 4, "practice", 67);
    const updated = checkpointHadithLesson(initial, "hadith-02", 5, "speak", 33);

    expect(initial["hadith-02"].completedStages).toEqual(["practice"]);
    expect(updated["hadith-02"]).toMatchObject({
      status: "in-progress",
      currentStage: 5,
      completedStages: ["practice", "speak"],
      bestScorePercent: 67,
    });
  });

  it("schedules mastered and retry lessons differently", () => {
    const now = new Date("2026-09-23T00:00:00.000Z");
    const mastered = completeHadithLesson({}, "hadith-03", 100, "ready", now);
    const retry = completeHadithLesson({}, "hadith-04", 33, "again", now);

    expect(mastered["hadith-03"]).toMatchObject({ status: "mastered", sessions: 1 });
    expect(mastered["hadith-03"].nextReviewAt).toBe("2026-09-30T00:00:00.000Z");
    expect(retry["hadith-04"]).toMatchObject({ status: "needs-practice", sessions: 1 });
    expect(retry["hadith-04"].nextReviewAt).toBe("2026-09-24T00:00:00.000Z");
  });

  it("drops malformed persisted entries at the runtime boundary", () => {
    expect(normalizeHadithProgress({ bad: { status: "mastered" } })).toEqual({});
  });
});
