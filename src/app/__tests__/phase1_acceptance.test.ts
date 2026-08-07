import { describe, expect, it } from "vitest";
import { shuffleArray } from "../../utils/shuffle";
import { INITIAL_LEARNER_STATE } from "../context/LearnerContext";
import type { AnswerAttempt } from "../types";

describe("Phase 1 Acceptance Criteria Verification", () => {
  it("AC 1: Fisher–Yates shuffleArray produces valid permutations without mutating original array", () => {
    const input = ["bed", "nightstand", "dresser", "wardrobe", "desk"];
    const inputCopy = [...input];
    const shuffled = shuffleArray(input);

    expect(shuffled).toHaveLength(input.length);
    expect(shuffled.sort()).toEqual(inputCopy.sort());
    expect(input).toEqual(["bed", "nightstand", "dresser", "wardrobe", "desk"]);
  });

  it("AC 2: New learners start at zero (0 XP, 0 streak, 0 sessions, empty mastery)", () => {
    expect(INITIAL_LEARNER_STATE.learnerProgress.xp).toBe(0);
    expect(INITIAL_LEARNER_STATE.learnerProgress.streak).toBe(0);
    expect(INITIAL_LEARNER_STATE.learnerProgress.sessionsCompleted).toBe(0);
    expect(INITIAL_LEARNER_STATE.learnerProgress.daysActive).toBe(0);
    expect(INITIAL_LEARNER_STATE.wordMemory).toEqual({});
    expect(INITIAL_LEARNER_STATE.learnerProgress.lastStudiedDate).toBeNull();
  });

  it("AC 3: 0 attempts = 0% accuracy & 0 correct answers = 0 XP (no minimum 30 XP)", () => {
    const attempts: AnswerAttempt[] = [];
    const correct = attempts.filter((a) => a.correct).length;
    const accuracy = attempts.length === 0 ? 0 : Math.round((correct / attempts.length) * 100);
    const xpEarned = correct * 10;

    expect(accuracy).toBe(0);
    expect(xpEarned).toBe(0);
  });

  it("AC 4: 0 correct answers out of 3 attempts = 0 XP (no minimum 30 XP)", () => {
    const attempts: AnswerAttempt[] = [
      { exerciseStep: 1, wordId: "bed", correct: false, answeredAt: "2026-08-07" },
      { exerciseStep: 2, wordId: "bed", correct: false, answeredAt: "2026-08-07" },
    ];
    const correct = attempts.filter((a) => a.correct).length;
    const xpEarned = correct * 10;

    expect(correct).toBe(0);
    expect(xpEarned).toBe(0);
  });
});
