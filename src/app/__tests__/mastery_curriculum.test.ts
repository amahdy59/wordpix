import { describe, expect, it } from "vitest";
import {
  LEVEL_ONE,
  LEVEL_TWO,
  MASTERY_LEVELS,
  MASTERY_SKILLS,
  MASTERY_WORDS,
  getMasteryLevel,
  getMasteryWord,
} from "../learning/mastery/masteryCurriculum";
import {
  calculateReviewQueue,
  checkPrerequisitesSatisfied,
  createInitialProgress,
  updateMasteryProgress,
} from "../learning/mastery/masteryEngine";
import {
  masteryLevelSchema,
  masterySkillSchema,
  masteryWordSchema,
  type MasteryItemProgress,
} from "../learning/mastery/masteryTypes";

describe("Pronunciation & Spelling Mastery Curriculum", () => {
  it("validates all foundational skills against schema", () => {
    expect(MASTERY_SKILLS.length).toBe(8);
    for (const skill of MASTERY_SKILLS) {
      expect(masterySkillSchema.safeParse(skill).success).toBe(true);
    }
  });

  it("validates demonstration words including phonemes and grapheme boxes", () => {
    expect(MASTERY_WORDS.length).toBeGreaterThanOrEqual(17);
    for (const word of MASTERY_WORDS) {
      expect(masteryWordSchema.safeParse(word).success).toBe(true);
      expect(word.phonemes.length).toBeGreaterThan(0);
      expect(word.graphemes.length).toBe(word.soundBoxes.length);
    }

    const cat = getMasteryWord("cat");
    expect(cat).toBeDefined();
    expect(cat?.pattern).toBe("CVC");
    expect(cat?.phonemes).toEqual(["k", "æ", "t"]);
    expect(cat?.contrastPairs).toContain("cap");
    expect(cat?.contrastPairs).toContain("cut");

    const pen = getMasteryWord("pen");
    expect(pen).toBeDefined();
    expect(pen?.contrastPairs).toContain("pin");
    expect(pen?.contrastPairs).toContain("pan");
  });

  it("validates Levels 1 and 2 and ensures prerequisite DAG has no cycles", () => {
    expect(MASTERY_LEVELS.length).toBe(2);
    expect(masteryLevelSchema.safeParse(LEVEL_ONE).success).toBe(true);
    expect(masteryLevelSchema.safeParse(LEVEL_TWO).success).toBe(true);

    const allLessonIds = new Set<string>();
    for (const level of MASTERY_LEVELS) {
      for (const unit of level.units) {
        for (const lesson of unit.lessons) {
          expect(allLessonIds.has(lesson.id)).toBe(false);
          allLessonIds.add(lesson.id);
        }
      }
    }

    // Verify all prerequisites resolve to existing lessons and do not self-reference
    for (const level of MASTERY_LEVELS) {
      for (const unit of level.units) {
        for (const lesson of unit.lessons) {
          for (const prereqId of lesson.prerequisites) {
            expect(allLessonIds.has(prereqId)).toBe(true);
            expect(prereqId).not.toBe(lesson.id);
          }
        }
      }
    }
  });

  it("retrieves levels and demonstration words correctly", () => {
    expect(getMasteryLevel("level-1")?.id).toBe("level-1");
    expect(getMasteryLevel("level-2")?.id).toBe("level-2");
    expect(getMasteryLevel("unknown-level")).toBeUndefined();
    expect(getMasteryWord("sit")?.vowelType).toBe("short");
  });
});

describe("Mastery Engine", () => {
  it("tracks progression from unseen to practicing to mastered", () => {
    const initial = createInitialProgress("cat");
    expect(initial.status).toBe("unseen");

    const baseTime = 1_000_000_000;
    // 1st correct
    const step1 = updateMasteryProgress(initial, true, baseTime);
    expect(step1.status).toBe("practicing");
    expect(step1.consecutiveCorrect).toBe(1);

    // 2nd correct
    const step2 = updateMasteryProgress(step1, true, baseTime);
    expect(step2.status).toBe("practicing");
    expect(step2.consecutiveCorrect).toBe(2);

    // 3rd correct -> mastered with 1-day interval
    const step3 = updateMasteryProgress(step2, true, baseTime);
    expect(step3.status).toBe("mastered");
    expect(step3.consecutiveCorrect).toBe(3);
    expect(step3.nextReviewMs).toBe(baseTime + 24 * 60 * 60 * 1000);

    // 6th correct -> longer interval (7 days)
    let advanced = step3;
    for (let i = 0; i < 3; i++) {
      advanced = updateMasteryProgress(advanced, true, baseTime);
    }
    expect(advanced.consecutiveCorrect).toBe(6);
    expect(advanced.nextReviewMs).toBe(baseTime + 7 * 24 * 60 * 60 * 1000);
  });

  it("identifies struggling items after consecutive errors", () => {
    const initial = createInitialProgress("pen");
    const baseTime = 1_000_000_000;

    const error1 = updateMasteryProgress(initial, false, baseTime);
    expect(error1.status).toBe("practicing");
    expect(error1.totalErrors).toBe(1);

    const error2 = updateMasteryProgress(error1, false, baseTime);
    expect(error2.status).toBe("struggling");
    expect(error2.totalErrors).toBe(2);
    expect(error2.consecutiveCorrect).toBe(0);
    expect(error2.nextReviewMs).toBe(baseTime); // due immediately
  });

  it("prioritizes struggling items first in the review queue", () => {
    const baseTime = 1_000_000_000;

    const items: MasteryItemProgress[] = [
      {
        id: "word-overdue",
        status: "mastered",
        consecutiveCorrect: 3,
        totalAttempts: 3,
        totalErrors: 0,
        nextReviewMs: baseTime - 1000,
      },
      {
        id: "word-struggling",
        status: "struggling",
        consecutiveCorrect: 0,
        totalAttempts: 4,
        totalErrors: 3,
        nextReviewMs: baseTime,
      },
      {
        id: "word-future",
        status: "mastered",
        consecutiveCorrect: 3,
        totalAttempts: 3,
        totalErrors: 0,
        nextReviewMs: baseTime + 100_000,
      },
    ];

    const queue = calculateReviewQueue(items, baseTime);
    expect(queue).toEqual(["word-struggling", "word-overdue"]);
  });

  it("checks prerequisite satisfaction accurately", () => {
    const lesson = LEVEL_ONE.units[0].lessons[1]; // connect-satp, prereq: ["hear-satp"]
    expect(lesson.prerequisites).toEqual(["hear-satp"]);

    expect(checkPrerequisitesSatisfied(lesson, new Set())).toBe(false);
    expect(checkPrerequisitesSatisfied(lesson, new Set(["other-lesson"]))).toBe(false);
    expect(checkPrerequisitesSatisfied(lesson, new Set(["hear-satp"]))).toBe(true);
  });
});
