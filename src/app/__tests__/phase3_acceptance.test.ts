import { describe, expect, it } from "vitest";
import { calculateSM2State, createInitialWordState, getMasteryCategory } from "../../features/gamification/sm2";
import { getSemanticDistractors, CONFUSION_PAIRS } from "../exercises/exerciseContent";
import { BEDROOM_VOCABULARY } from "../data/lessons";

describe("Phase 3 Acceptance Criteria Verification", () => {
  it("AC 1: SM-2 engine calculates nextReviewAt and intervals based on recall quality", () => {
    const initial = createInitialWordState("pillow");
    expect(initial.mastery).toBe("new");
    expect(initial.intervalDays).toBe(0);

    // Successful recall (quality = 4)
    const step1 = calculateSM2State(initial, 4);
    expect(step1.correctRecalls).toBe(1);
    expect(step1.intervalDays).toBe(1);

    const step2 = calculateSM2State(step1, 5);
    expect(step2.correctRecalls).toBe(2);
    expect(step2.intervalDays).toBe(6);

    // Lapse (quality = 1)
    const lapse = calculateSM2State(step2, 1);
    expect(lapse.incorrectRecalls).toBe(1);
    expect(lapse.intervalDays).toBe(1);
    expect(lapse.currentStreak).toBe(0);
  });

  it("AC 2: getMasteryCategory classifies memory into new, learning, familiar, strong", () => {
    expect(getMasteryCategory(0, 0, 0)).toBe("new");
    expect(getMasteryCategory(2, 1, 1)).toBe("learning");
    expect(getMasteryCategory(5, 1, 4)).toBe("familiar");
    expect(getMasteryCategory(10, 1, 15)).toBe("strong");
  });

  it("AC 3: getSemanticDistractors prioritizes confusion pairs over random picks", () => {
    const pillow = BEDROOM_VOCABULARY.find((v) => v.id === "pillow")!;
    const distractors = getSemanticDistractors(pillow, 3);

    const distractorIds = distractors.map((d) => d.id);
    const expectedConfusion = CONFUSION_PAIRS.pillow;

    expect(distractors).toHaveLength(3);
    expect(distractorIds.some((id) => expectedConfusion.includes(id))).toBe(true);
  });
});
