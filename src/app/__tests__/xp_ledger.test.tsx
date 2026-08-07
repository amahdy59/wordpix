import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { LearnerProvider, useLearner } from "../context/LearnerContext";
import { XP_RULES } from "../../features/gamification/xp";
import type { AnswerAttempt } from "../types";

const wrapper = ({ children }: { children: ReactNode }) => <LearnerProvider>{children}</LearnerProvider>;

function attempts(correct: number, wrong: number): AnswerAttempt[] {
  const made: AnswerAttempt[] = [];
  for (let i = 0; i < correct; i += 1) {
    made.push({ exerciseStep: 1, wordId: `w${i}`, correct: true, answeredAt: new Date().toISOString() });
  }
  for (let i = 0; i < wrong; i += 1) {
    made.push({ exerciseStep: 1, wordId: `x${i}`, correct: false, answeredAt: new Date().toISOString() });
  }
  return made;
}

beforeEach(() => {
  localStorage.clear();
});

/**
 * calculateXP was fully implemented and covered by unit tests, but its only
 * caller was that test — LearnerContext inlined `correct * 10`, so the
 * completion, perfect-session, and streak bonuses were never paid. Testing the
 * calculator alone stayed green through the entire bug; these assertions go
 * through the ledger.
 */
describe("XP ledger", () => {
  it("credits the completion bonus, not just per-answer XP", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });

    act(() => {
      result.current.recordSessionCompletion("s1", attempts(3, 2), ["w0", "w1", "w2"]);
    });

    const expected =
      3 * XP_RULES.PER_CORRECT_ANSWER + XP_RULES.LESSON_COMPLETE_BONUS + XP_RULES.STREAK_DAY_BONUS;
    expect(result.current.state.learnerProgress.xp).toBe(expected);
  });

  it("credits the perfect-session bonus on a flawless run", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });

    act(() => {
      result.current.recordSessionCompletion("s1", attempts(5, 0), ["w0"]);
    });

    const record = result.current.state.sessionHistory[0];
    expect(record.xp.perfectSession).toBe(XP_RULES.PERFECT_SESSION_BONUS);
  });

  it("withholds the perfect bonus when an answer was wrong", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });

    act(() => {
      result.current.recordSessionCompletion("s1", attempts(4, 1), ["w0"]);
    });

    expect(result.current.state.sessionHistory[0].xp.perfectSession).toBe(0);
  });

  it("pays the streak bonus only on the first session of the day", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });

    act(() => {
      result.current.recordSessionCompletion("s1", attempts(2, 0), ["w0"]);
    });
    act(() => {
      result.current.recordSessionCompletion("s2", attempts(2, 0), ["w0"]);
    });

    const [second, first] = result.current.state.sessionHistory;
    expect(first.xp.streak).toBeGreaterThan(0);
    expect(second.xp.streak).toBe(0);
  });

  it("records an itemised breakdown whose total matches the credited XP", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });

    act(() => {
      result.current.recordSessionCompletion("s1", attempts(3, 1), ["w0", "w1"]);
    });

    const { xp } = result.current.state.sessionHistory[0];
    expect(xp.total).toBe(xp.correctAnswers + xp.lessonComplete + xp.perfectSession + xp.streak);
    expect(result.current.state.learnerProgress.xp).toBe(xp.total);
  });

  it("stays idempotent — replaying a session id credits nothing extra", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });

    act(() => {
      result.current.recordSessionCompletion("s1", attempts(3, 0), ["w0"]);
    });
    const afterFirst = result.current.state.learnerProgress.xp;

    act(() => {
      result.current.recordSessionCompletion("s1", attempts(3, 0), ["w0"]);
    });

    expect(result.current.state.learnerProgress.xp).toBe(afterFirst);
    expect(result.current.state.sessionHistory).toHaveLength(1);
  });

  it("credits zero answer XP for a session with no correct answers", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });

    act(() => {
      result.current.recordSessionCompletion("s1", attempts(0, 4), ["w0"]);
    });

    expect(result.current.state.sessionHistory[0].xp.correctAnswers).toBe(0);
  });
});
