import { describe, it, expect } from "vitest";
import { calculateSM2, createInitialSM2Item } from "../features/gamification/sm2";
import { calculateXP } from "../features/gamification/xp";
import { updateStreak, getWeekActivity, getLocalDateString } from "../features/gamification/streak";

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

describe("Week Activity Strip", () => {
  // Local-date constructor (not the UTC-parsing string form) so these assertions
  // hold in every timezone.
  const today = new Date(2026, 6, 28); // Tue 28 Jul 2026

  it("reports no activity for a learner with no sessions", () => {
    const week = getWeekActivity([], today);
    expect(week).toHaveLength(7);
    expect(week.every((d) => d.done === false)).toBe(true);
  });

  it("marks only days that actually have a completed session", () => {
    const sessions = [
      new Date(2026, 6, 28, 9, 0).toISOString(), // today
      new Date(2026, 6, 26, 20, 30).toISOString(), // 2 days ago
    ];
    const week = getWeekActivity(sessions, today);
    const doneDates = week.filter((d) => d.done).map((d) => d.date);
    expect(doneDates).toEqual(["2026-07-26", "2026-07-28"]);
  });

  it("ends on today and spans exactly 7 trailing days", () => {
    const week = getWeekActivity([], today);
    expect(week[6].date).toBe(getLocalDateString(today));
    expect(week[6].isToday).toBe(true);
    expect(week[0].date).toBe("2026-07-22");
    expect(week.filter((d) => d.isToday)).toHaveLength(1);
  });

  it("collapses multiple sessions on one day to a single active day", () => {
    const sessions = [
      new Date(2026, 6, 27, 8, 0).toISOString(),
      new Date(2026, 6, 27, 19, 0).toISOString(),
    ];
    expect(getWeekActivity(sessions, today).filter((d) => d.done)).toHaveLength(1);
  });

  it("ignores unparseable timestamps instead of marking a day done", () => {
    const week = getWeekActivity(["not-a-date", ""], today);
    expect(week.every((d) => d.done === false)).toBe(true);
  });

  it("exposes a full weekday name for screen readers", () => {
    const week = getWeekActivity([], today);
    expect(week[6].name).toBe("Tuesday");
    expect(week[6].initial).toBe("T");
  });
});
