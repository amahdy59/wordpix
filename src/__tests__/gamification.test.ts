import { describe, it, expect } from "vitest";
import { calculateSM2State, createInitialWordState } from "../features/gamification/sm2";
import { calculateXP, calculateXPBreakdown, XP_RULES } from "../features/gamification/xp";
import { updateStreak, getWeekActivity, getLocalDateString } from "../features/gamification/streak";

/**
 * These previously ran against SM2Item / createInitialSM2Item / calculateSM2 —
 * a legacy-shape adapter whose only caller was this test, exactly the pattern
 * calculateXP had. The adapter is gone; these now exercise the WordLearningState
 * API that LearnerContext actually uses.
 */
describe("SM-2 Spaced Repetition Engine", () => {
  it("creates an initial word state", () => {
    const item = createInitialWordState("pillow");
    expect(item.wordId).toBe("pillow");
    expect(item.currentStreak).toBe(0);
    expect(item.intervalDays).toBe(0);
    expect(item.easeFactor).toBe(2.5);
    expect(item.mastery).toBe("new");
  });

  it("increases interval on successful recall (quality >= 3)", () => {
    const step1 = calculateSM2State(createInitialWordState("bed"), 4);
    expect(step1.currentStreak).toBe(1);
    expect(step1.intervalDays).toBe(1);

    const step2 = calculateSM2State(step1, 5);
    expect(step2.currentStreak).toBe(2);
    expect(step2.intervalDays).toBe(6);
  });

  it("resets streak and interval on failed recall (quality < 3)", () => {
    const strong = calculateSM2State(calculateSM2State(createInitialWordState("desk"), 5), 5);
    const failed = calculateSM2State(strong, 1);

    expect(failed.currentStreak).toBe(0);
    expect(failed.intervalDays).toBe(1);
    expect(failed.lapses).toBe(1);
  });

  it("never lets the ease factor fall below the SM-2 floor of 1.3", () => {
    let state = createInitialWordState("wardrobe");
    for (let i = 0; i < 12; i += 1) state = calculateSM2State(state, 0);
    expect(state.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("schedules the next review interval days out", () => {
    const now = new Date(2026, 0, 10);
    const state = calculateSM2State(createInitialWordState("lamp"), 4, now);
    const next = new Date(state.nextReviewAt as string);
    const days = Math.round((next.getTime() - now.getTime()) / 86_400_000);
    expect(days).toBe(state.intervalDays);
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

  it("itemises every credit so the total is explainable", () => {
    const breakdown = calculateXPBreakdown(5, 5, 3);
    expect(breakdown).toEqual({
      correctAnswers: 50,
      lessonComplete: 20,
      perfectSession: 25,
      streak: 45,
      total: 140,
    });
  });

  it("pays the streak bonus per streak day", () => {
    expect(calculateXPBreakdown(0, 5, 4).streak).toBe(60);
  });

  it("caps the streak bonus so a long streak cannot dwarf the session", () => {
    expect(calculateXPBreakdown(0, 5, 50).streak).toBe(XP_RULES.STREAK_BONUS_CAP);
  });

  it("pays no streak bonus when the streak is zero", () => {
    expect(calculateXPBreakdown(3, 5, 0).streak).toBe(0);
  });

  it("withholds the perfect bonus for an empty session", () => {
    expect(calculateXPBreakdown(0, 0, 0).perfectSession).toBe(0);
  });

  it("withholds the perfect bonus when any answer was wrong", () => {
    expect(calculateXPBreakdown(4, 5, 0).perfectSession).toBe(0);
  });

  it("never returns negative credit for a negative count", () => {
    expect(calculateXPBreakdown(-3, 5, 0).correctAnswers).toBe(0);
  });

  it("total always equals the sum of its parts", () => {
    const cases: [number, number, number][] = [
      [0, 0, 0],
      [3, 5, 1],
      [5, 5, 12],
      [1, 9, 40],
    ];
    cases.forEach(([correct, total, streak]) => {
      const b = calculateXPBreakdown(correct, total, streak);
      expect(b.total).toBe(b.correctAnswers + b.lessonComplete + b.perfectSession + b.streak);
    });
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
