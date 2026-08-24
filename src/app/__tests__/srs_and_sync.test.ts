import { describe, it, expect } from "vitest";
import {
  calculateSM2State,
  createInitialWordState,
  getDueWordsForReview,
  type WordLearningState,
} from "../../features/gamification/sm2";

describe("Phase 6: Spaced Repetition (SRS) Engine", () => {
  it("initializes new word state with zero intervals and standard ease factor", () => {
    const word = createInitialWordState("pillow");
    expect(word.wordId).toBe("pillow");
    expect(word.intervalDays).toBe(0);
    expect(word.easeFactor).toBe(2.5);
    expect(word.mastery).toBe("new");
    expect(word.currentStreak).toBe(0);
    expect(word.lapses).toBe(0);
  });

  it("advances review intervals on successful recall (quality >= 3)", () => {
    const base = createInitialWordState("bed");
    const now = new Date("2026-08-24T12:00:00Z");

    // 1st successful recall -> interval 1 day
    const step1 = calculateSM2State(base, 4, now);
    expect(step1.intervalDays).toBe(1);
    expect(step1.correctRecalls).toBe(1);
    expect(step1.currentStreak).toBe(1);

    // 2nd successful recall -> interval 6 days
    const step2 = calculateSM2State(step1, 5, now);
    expect(step2.intervalDays).toBe(6);
    expect(step2.correctRecalls).toBe(2);
    expect(step2.currentStreak).toBe(2);

    // 3rd successful recall -> interval = 6 * 2.6 = ~16 days
    const step3 = calculateSM2State(step2, 5, now);
    expect(step3.intervalDays).toBeGreaterThanOrEqual(15);
    expect(step3.mastery).toBe("strong");
  });

  it("resets interval and increments lapses on failed recall (quality < 3)", () => {
    const learnedWord: WordLearningState = {
      wordId: "lamp",
      exposures: 5,
      correctRecalls: 4,
      incorrectRecalls: 0,
      currentStreak: 4,
      lapses: 0,
      lastSeenAt: "2026-08-20T10:00:00Z",
      lastReviewedAt: "2026-08-20T10:00:00Z",
      nextReviewAt: "2026-08-26T10:00:00Z",
      intervalDays: 6,
      easeFactor: 2.5,
      mastery: "familiar",
    };

    const lapsed = calculateSM2State(learnedWord, 1, new Date("2026-08-24T12:00:00Z"));
    expect(lapsed.intervalDays).toBe(1);
    expect(lapsed.currentStreak).toBe(0);
    expect(lapsed.lapses).toBe(1);
    expect(lapsed.incorrectRecalls).toBe(1);
    expect(lapsed.easeFactor).toBeLessThan(2.5);
  });

  it("filters and prioritizes due review words correctly", () => {
    const now = new Date("2026-08-24T12:00:00Z");

    const memory: Record<string, WordLearningState> = {
      // Due: overdue date
      wordOverdue: {
        wordId: "wordOverdue",
        exposures: 3,
        correctRecalls: 2,
        incorrectRecalls: 1,
        currentStreak: 1,
        lapses: 1,
        lastSeenAt: "2026-08-20T10:00:00Z",
        lastReviewedAt: "2026-08-20T10:00:00Z",
        nextReviewAt: "2026-08-22T10:00:00Z", // Past
        intervalDays: 2,
        easeFactor: 2.3,
        mastery: "learning",
      },
      // Due: lapsed word today
      wordLapsed: {
        wordId: "wordLapsed",
        exposures: 4,
        correctRecalls: 2,
        incorrectRecalls: 2,
        currentStreak: 0,
        lapses: 2,
        lastSeenAt: "2026-08-23T10:00:00Z",
        lastReviewedAt: "2026-08-23T10:00:00Z",
        nextReviewAt: "2026-08-24T10:00:00Z", // Past today
        intervalDays: 1,
        easeFactor: 2.1,
        mastery: "learning",
      },
      // Not due: scheduled for future
      wordFuture: {
        wordId: "wordFuture",
        exposures: 5,
        correctRecalls: 5,
        incorrectRecalls: 0,
        currentStreak: 5,
        lapses: 0,
        lastSeenAt: "2026-08-23T10:00:00Z",
        lastReviewedAt: "2026-08-23T10:00:00Z",
        nextReviewAt: "2026-08-30T10:00:00Z", // Future
        intervalDays: 7,
        easeFactor: 2.6,
        mastery: "familiar",
      },
    };

    const due = getDueWordsForReview(memory, now);
    expect(due.length).toBe(2);
    expect(due.map((w) => w.wordId)).not.toContain("wordFuture");

    // Lapsed word with 2 lapses is prioritized first
    expect(due[0].wordId).toBe("wordLapsed");
    expect(due[1].wordId).toBe("wordOverdue");
  });
});
