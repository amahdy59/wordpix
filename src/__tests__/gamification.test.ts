import { describe, it, expect } from "vitest";
import { calculateSM2, createInitialSM2Item } from "../features/gamification/sm2";
import { calculateXP } from "../features/gamification/xp";
import { updateStreak } from "../features/gamification/streak";

describe("SM-2 Spaced Repetition Engine", () => {
  it("creates initial SM-2 item", () => {
    const item = createInitialSM2Item("pillow");
    expect(item.wordId).toBe("pillow");
    expect(item.repetition).toBe(0);
    expect(item.interval).toBe(0);
    expect(item.easinessFactor).toBe(2.5);
  });

  it("increases interval on successful recall (quality >= 3)", () => {
    const initial = createInitialSM2Item("bed");
    const step1 = calculateSM2(initial, 4);
    expect(step1.repetition).toBe(1);
    expect(step1.interval).toBe(1);

    const step2 = calculateSM2(step1, 5);
    expect(step2.repetition).toBe(2);
    expect(step2.interval).toBe(6);
  });

  it("resets repetition and interval on failed recall (quality < 3)", () => {
    const item = {
      wordId: "desk",
      repetition: 3,
      interval: 15,
      easinessFactor: 2.5,
      lastReviewed: new Date().toISOString(),
      nextReview: new Date().toISOString(),
    };
    const failed = calculateSM2(item, 1);
    expect(failed.repetition).toBe(0);
    expect(failed.interval).toBe(1);
  });
});

describe("XP Calculation Engine", () => {
  it("calculates base XP correctly", () => {
    const xp = calculateXP(3, 5, 0);
    expect(xp).toBe(50); // (3 * 10) + 20 complete
  });

  it("adds perfect session bonus", () => {
    const xp = calculateXP(5, 5, 0);
    expect(xp).toBe(95); // (5 * 10) + 20 complete + 25 perfect
  });
});

describe("Streak Management Engine", () => {
  it("increments streak on consecutive day", () => {
    const state = { currentStreak: 5, lastActiveDate: "2026-07-27" };
    const today = new Date("2026-07-28");
    const updated = updateStreak(state, today);
    expect(updated.currentStreak).toBe(6);
    expect(updated.lastActiveDate).toBe("2026-07-28");
  });

  it("resets streak if more than 1 day missed", () => {
    const state = { currentStreak: 10, lastActiveDate: "2026-07-20" };
    const today = new Date("2026-07-28");
    const updated = updateStreak(state, today);
    expect(updated.currentStreak).toBe(1);
  });
});
