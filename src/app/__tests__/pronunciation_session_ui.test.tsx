import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { I18nProvider } from "../../i18n";
import { FigmaPronunciationLessonScreen } from "../learning/foundations/FigmaPronunciationLessonScreen";
import {
  pronunciationEvidenceKey,
  pronunciationTargetId,
  pronunciationTrialCount,
} from "../learning/foundations/pronunciationTargets";
import { getPronunciationQuestion } from "../learning/foundations/figmaPronunciationCatalog";
import type { PronunciationProgress } from "../learning/foundations/pronunciationProgress";

const mocks = vi.hoisted(() => ({
  progress: {} as PronunciationProgress,
  checkpoint: vi.fn(),
  complete: vi.fn(),
  speak: vi.fn(),
  error: false,
  autoAdvance: false,
  speakFeedback: vi.fn((_input: unknown, onComplete?: () => void) => {
    onComplete?.();
  }),
}));
vi.mock("../context/LearnerContext", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../context/LearnerContext")>()),
  useLearner: () => ({
    state: {
      pronunciationProgress: mocks.progress,
      accessibility: { autoAdvance: mocks.autoAdvance },
    },
    setAccessibility: vi.fn(),
    recordPronunciationCheckpoint: mocks.checkpoint,
    recordPronunciationCompletion: mocks.complete,
  }),
}));
vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({
    speak: mocks.speak,
    stop: vi.fn(),
    isPlaying: false,
    isError: mocks.error,
    status: "idle",
  }),
}));
vi.mock("../shared/useSpokenFeedback", () => ({
  useSpokenFeedback: () => ({ speakFeedback: mocks.speakFeedback, cancel: vi.fn() }),
}));
vi.mock("../learning/foundations/PrivateRecordCompare", () => ({
  PrivateRecordCompare: () => null,
}));
vi.mock("../shared/useCourseNavigationHeight", () => ({
  useCourseNavigationHeight: () => ({ current: null }),
}));

const renderLesson = () =>
  render(
    <I18nProvider>
      <FigmaPronunciationLessonScreen lessonNumber={3} dispatch={vi.fn()} />
    </I18nProvider>
  );
const answer = (stage: 1 | 2 | 3 | 4, trial: number) => {
  const target = getPronunciationQuestion(3, stage, trial).target.label;
  return screen.getByRole("button", { name: new RegExp(`^Option \\d+: ${target}$`) });
};
describe("pronunciation lesson session", () => {
  beforeEach(() => {
    mocks.progress = {};
    mocks.error = false;
    vi.clearAllMocks();
  });
  it("keeps unavailable audio pending instead of recording a learner error", () => {
    mocks.error = true;
    renderLesson();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue without this audio check" }));
    expect(mocks.checkpoint.mock.calls.at(-1)![2].outcomes).toEqual({});
    fireEvent.click(screen.getByRole("button", { name: "Next question" }));
    expect(mocks.checkpoint.mock.calls.at(-1)![2].outcomes).toEqual({});
  });
  it("offers retry after a runtime failure without allowing a scored answer before recovery", () => {
    mocks.error = true;
    renderLesson();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    const retry = screen.getByRole("button", { name: "Try audio again" });
    expect(retry).toBeEnabled();
    expect(answer(1, 0)).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(retry);
    expect(mocks.speak).toHaveBeenCalled();
    expect(mocks.checkpoint.mock.calls.at(-1)![2].outcomes).toEqual({});
  });
  it("retains focus on a correct choice and prevents repeat scoring", () => {
    renderLesson();
    expect(mocks.speak).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    const button = answer(1, 0);
    button.focus();
    fireEvent.click(button);
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-disabled", "true");
    const calls = mocks.checkpoint.mock.calls.length;
    fireEvent.click(button);
    expect(mocks.checkpoint).toHaveBeenCalledTimes(calls);
    expect(screen.getByRole("button", { name: "Next question" })).toBeVisible();
  });
  it("resumes saved evidence and finishes once with an accurate score", () => {
    const outcomes: Record<string, boolean> = {};
    for (let stage = 1; stage <= 4; stage++)
      for (let trial = 0; trial < pronunciationTrialCount(3, stage); trial++)
        if (stage !== 3 && (stage < 4 || trial < pronunciationTrialCount(3, 4) - 1))
          outcomes[
            pronunciationEvidenceKey(
              stage,
              getPronunciationQuestion(3, stage as 1 | 2 | 3 | 4, trial).target.label
            )
          ] = true;
    mocks.progress["lesson-03"] = {
      status: "in-progress",
      currentStage: 4,
      bestScorePercent: 0,
      sessions: 0,
      updatedAt: new Date().toISOString(),
      session: {
        version: 2,
        trial: pronunciationTrialCount(3, 4) - 1,
        attempts: 0,
        answer: null,
        unlockedStage: 4,
        outcomes,
        targetEvidence: {
          [pronunciationTargetId(
            getPronunciationQuestion(3, 4, pronunciationTrialCount(3, 4) - 1).target.label
          )]: { speaking: "unassessed", updatedAt: new Date().toISOString() },
        },
      },
    };
    renderLesson();
    fireEvent.click(answer(4, pronunciationTrialCount(3, 4) - 1));
    fireEvent.click(screen.getByRole("button", { name: "See results" }));
    expect(mocks.complete).toHaveBeenCalledExactlyOnceWith("lesson-03", 100, 4);
    expect(screen.getByText("Recognition result: 100%")).toBeVisible();
  });
  it("revisiting a stage clears attempts and cannot replace failed first-attempt evidence", () => {
    renderLesson();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    const question = getPronunciationQuestion(3, 1, 0);
    const wrong = question.choices.find((item) => item.label !== question.target.label)!;
    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(`^Option \\d+: ${wrong.label}$`) })
    );
    fireEvent.click(answer(1, 0));
    fireEvent.click(screen.getByText("All steps"));
    fireEvent.click(screen.getByRole("button", { name: /Step 1 of 5/ }));
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    fireEvent.click(answer(1, 0));
    const saved = mocks.checkpoint.mock.calls.at(-1)![2];
    expect(saved.attempts).toBe(0);
    expect(saved.outcomes[pronunciationEvidenceKey(1, question.target.label)]).toBe(false);
  });
  it("enables manual question advance in transfer stage without requiring speaking evidence", () => {
    const trials = pronunciationTrialCount(3, 4);
    mocks.progress["lesson-03"] = {
      status: "in-progress",
      currentStage: 4,
      bestScorePercent: 0,
      sessions: 0,
      updatedAt: new Date().toISOString(),
      session: {
        version: 2,
        trial: 0,
        attempts: 0,
        answer: null,
        unlockedStage: 4,
        outcomes: {},
        targetEvidence: {},
      },
    };
    renderLesson();
    expect(screen.getByText(new RegExp(`^Check 1 of ${trials} in this stage$`))).toBeVisible();
    fireEvent.click(answer(4, 0));
    const nextButton = screen.getByRole("button", { name: "Next question" });
    expect(nextButton).toBeVisible();
    fireEvent.click(nextButton);
    expect(screen.getByText(new RegExp(`^Check 2 of ${trials} in this stage$`))).toBeVisible();
  });
  it("automatically advances to next question in transfer stage when autoAdvance is enabled", () => {
    vi.useFakeTimers();
    mocks.autoAdvance = true;
    const trials = pronunciationTrialCount(3, 4);
    mocks.progress["lesson-03"] = {
      status: "in-progress",
      currentStage: 4,
      bestScorePercent: 0,
      sessions: 0,
      updatedAt: new Date().toISOString(),
      session: {
        version: 2,
        trial: 0,
        attempts: 0,
        answer: null,
        unlockedStage: 4,
        outcomes: {},
        targetEvidence: {},
      },
    };
    renderLesson();
    expect(screen.getByText(new RegExp(`^Check 1 of ${trials} in this stage$`))).toBeVisible();
    fireEvent.click(answer(4, 0));
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getByText(new RegExp(`^Check 2 of ${trials} in this stage$`))).toBeVisible();
    vi.useRealTimers();
  });

  it("automatically plays target audio upon entering a listening stage", () => {
    vi.useFakeTimers();
    renderLesson();
    expect(mocks.speak).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    expect(mocks.speak).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(mocks.speak).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
