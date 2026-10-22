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
  stop: vi.fn(),
  preload: vi.fn(),
  error: false,
  status: "idle",
  autoAdvance: false,
  includeSpeaking: true,
  autoPlayAudio: true,
  setAccessibility: vi.fn(),
  speakFeedback: vi.fn((_input: unknown, onComplete?: () => void) => {
    onComplete?.();
  }),
}));
vi.mock("../context/LearnerContext", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../context/LearnerContext")>()),
  useLearner: () => ({
    state: {
      pronunciationProgress: mocks.progress,
      accessibility: {
        autoAdvance: mocks.autoAdvance,
        includeSpeaking: mocks.includeSpeaking,
        autoPlayAudio: mocks.autoPlayAudio,
      },
    },
    setAccessibility: mocks.setAccessibility,
    recordPronunciationCheckpoint: mocks.checkpoint,
    recordPronunciationCompletion: mocks.complete,
  }),
}));
vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({
    speak: mocks.speak,
    stop: mocks.stop,
    isPlaying: mocks.status === "playing" || mocks.status === "loading",
    isError: mocks.error,
    status: mocks.status,
  }),
  preloadAudioClip: (key: string) => mocks.preload(key),
  unlockAudio: vi.fn(),
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
    mocks.includeSpeaking = true;
    mocks.autoPlayAudio = true;
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

  it("autoplays prompt audio across consecutive trials in listening stage", () => {
    vi.useFakeTimers();
    mocks.autoAdvance = true;
    renderLesson();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(mocks.speak).toHaveBeenCalledTimes(1);

    // Answer Check 1 correctly
    fireEvent.click(answer(1, 0));
    // Advance timers for feedback and autoAdvance
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    // Check 2 should be active; advance timers for Check 2 autoplay
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(mocks.speak).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("autoplays prompt audio across consecutive trials in stage 2 (meaning)", () => {
    vi.useFakeTimers();
    mocks.autoAdvance = true;
    mocks.progress["lesson-03"] = {
      status: "in-progress",
      currentStage: 2,
      bestScorePercent: 0,
      sessions: 1,
      updatedAt: new Date().toISOString(),
      session: {
        trial: 0,
        attempts: 0,
        answer: null,
        unlockedStage: 2,
        outcomes: {},
        version: 2,
      },
    };
    renderLesson();
    // Entering stage 2 Check 1 autoplays
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(mocks.speak).toHaveBeenCalledTimes(1);

    // Answer Check 1
    fireEvent.click(answer(2, 0));
    // Advance timers for feedback and autoAdvance
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    // Check 2 should be active; advance timers for Check 2 autoplay
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(mocks.speak).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("does not autoplay audio when autoPlayAudio is disabled in accessibility settings", () => {
    vi.useFakeTimers();
    mocks.autoPlayAudio = false;
    renderLesson();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(mocks.speak).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("allows toggling autoPlayAudio from lesson options menu", () => {
    renderLesson();
    fireEvent.click(screen.getByLabelText("Lesson options"));
    const toggleButton = screen.getByRole("button", {
      name: /Auto-play question audio: Enabled/i,
    });
    fireEvent.click(toggleButton);
    expect(mocks.setAccessibility).toHaveBeenCalledWith({ autoPlayAudio: false });
  });

  it("does not stop audio when play button is clicked while status is loading", () => {
    mocks.status = "loading";
    renderLesson();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    mocks.stop.mockClear();
    mocks.speak.mockClear();
    const playButton = screen.getByRole("button", { name: "Play model pronunciation" });
    fireEvent.click(playButton);
    expect(mocks.stop).not.toHaveBeenCalled();
    expect(mocks.speak).toHaveBeenCalled();
  });

  it("allows skipping the entire speaking section in stage 3 and advances directly to transfer stage", () => {
    const stage3Targets = pronunciationTrialCount(3, 3);
    mocks.progress["lesson-03"] = {
      status: "in-progress",
      currentStage: 3,
      bestScorePercent: 0,
      sessions: 0,
      updatedAt: new Date().toISOString(),
      session: {
        version: 2,
        trial: 0,
        attempts: 0,
        answer: null,
        unlockedStage: 3,
        outcomes: {},
        targetEvidence: {},
      },
    };
    renderLesson();
    expect(
      screen.getByText(new RegExp(`^Check 1 of ${stage3Targets} in this stage$`))
    ).toBeVisible();
    const skipButtons = screen.getAllByRole("button", { name: "Skip speaking section" });
    expect(skipButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(skipButtons[0]);

    expect(mocks.checkpoint).toHaveBeenCalled();
    const lastCall = mocks.checkpoint.mock.calls.at(-1)!;
    expect(lastCall[1]).toBe(4);
    expect(lastCall[2].unlockedStage).toBe(4);

    const evidence = lastCall[2].targetEvidence;
    expect(Object.keys(evidence).length).toBe(stage3Targets);
    for (const tId of Object.keys(evidence)) {
      expect(evidence[tId].speaking).toBe("unassessed");
    }

    const transferTrials = pronunciationTrialCount(3, 4);
    expect(
      screen.getByText(new RegExp(`^Check 1 of ${transferTrials} in this stage$`))
    ).toBeVisible();
  });

  it("skips stage 3 automatically when includeSpeaking is disabled in accessibility", () => {
    mocks.includeSpeaking = false;
    const meaningTrials = pronunciationTrialCount(3, 2);
    mocks.progress["lesson-03"] = {
      status: "in-progress",
      currentStage: 2,
      bestScorePercent: 0,
      sessions: 0,
      updatedAt: new Date().toISOString(),
      session: {
        version: 2,
        trial: meaningTrials - 1,
        attempts: 0,
        answer: null,
        unlockedStage: 2,
        outcomes: {},
        targetEvidence: {},
      },
    };
    renderLesson();
    fireEvent.click(answer(2, meaningTrials - 1));
    const nextButton = screen.getByRole("button", { name: /Next:/ });
    fireEvent.click(nextButton);

    expect(mocks.checkpoint).toHaveBeenCalled();
    const lastCall = mocks.checkpoint.mock.calls.at(-1)!;
    expect(lastCall[1]).toBe(4);
  });

  it("shows disabled message when navigating to stage 3 with includeSpeaking disabled and allows re-enabling", () => {
    mocks.includeSpeaking = false;
    mocks.progress["lesson-03"] = {
      status: "in-progress",
      currentStage: 3,
      bestScorePercent: 0,
      sessions: 0,
      updatedAt: new Date().toISOString(),
      session: {
        version: 2,
        trial: 0,
        attempts: 0,
        answer: null,
        unlockedStage: 3,
        outcomes: {},
        targetEvidence: {},
      },
    };
    renderLesson();
    expect(
      screen.getByText("Speaking exercises are currently disabled in your settings.")
    ).toBeVisible();
    const enableButton = screen.getByRole("button", { name: "Enabled" });
    fireEvent.click(enableButton);
    expect(mocks.setAccessibility).toHaveBeenCalledWith({ includeSpeaking: true });
  });

  it("allows skipping speaking section from lesson options menu in stage 3", () => {
    mocks.progress["lesson-03"] = {
      status: "in-progress",
      currentStage: 3,
      bestScorePercent: 0,
      sessions: 0,
      updatedAt: new Date().toISOString(),
      session: {
        version: 2,
        trial: 1,
        attempts: 0,
        answer: null,
        unlockedStage: 3,
        outcomes: {},
        targetEvidence: {},
      },
    };
    renderLesson();
    fireEvent.click(screen.getByLabelText("Lesson options"));
    const skipOptionsButton = screen.getAllByRole("button", { name: "Skip speaking section" });
    fireEvent.click(skipOptionsButton.at(-1)!);

    expect(mocks.checkpoint).toHaveBeenCalled();
    const lastCall = mocks.checkpoint.mock.calls.at(-1)!;
    expect(lastCall[1]).toBe(4);
  });
  it("provides clean audio and visual-on-card feedback without bulky textual cards", () => {
    renderLesson();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));
    const question = getPronunciationQuestion(3, 1, 0);
    const wrong = question.choices.find((item) => item.label !== question.target.label)!;
    const wrongButton = screen.getByRole("button", {
      name: new RegExp(`^Option \\d+: ${wrong.label}$`),
    });

    // Select incorrect choice
    fireEvent.click(wrongButton);

    // Audio feedback is triggered
    expect(mocks.speakFeedback).toHaveBeenCalledWith(
      expect.objectContaining({
        correct: false,
        chosenLabel: wrong.label,
        targetLabel: question.target.label,
      }),
      expect.any(Function)
    );

    // Visual feedback on card: aria-invalid and error border styling
    expect(wrongButton).toHaveAttribute("aria-invalid", "true");
    expect(wrongButton.className).toContain("border-feedback-error-border");

    // Textual clutter is removed: no confusion text or Replay feedback button
    expect(screen.queryByRole("button", { name: "Replay feedback" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Compare the physical cue/)).not.toBeInTheDocument();

    // Accessible screen-reader announcement is preserved in sr-only role="status"
    const retryStatus = screen.getByText("Listen once more and try again.");
    expect(retryStatus).toHaveClass("sr-only");
    expect(retryStatus).toHaveAttribute("role", "status");

    // Now select correct choice
    const correctButton = answer(1, 0);
    fireEvent.click(correctButton);

    // Audio feedback is triggered for correct
    expect(mocks.speakFeedback).toHaveBeenCalledWith(
      expect.objectContaining({
        correct: true,
        chosenLabel: null,
        targetLabel: question.target.label,
      }),
      expect.any(Function)
    );

    // Visual feedback on correct card
    expect(correctButton).toHaveAttribute("aria-disabled", "true");
    expect(correctButton.className).toContain("border-feedback-success");
    expect(screen.queryByRole("button", { name: "Replay feedback" })).not.toBeInTheDocument();

    // Screen reader announcement updates to Correct
    const correctStatus = screen.getByText(/Correct\. You noticed the contrast/);
    expect(correctStatus).toHaveClass("sr-only");
    expect(correctStatus).toHaveAttribute("role", "status");
  });

  it("keeps Next button and auto-advance toggle at the top header and renders nothing below choices", () => {
    renderLesson();
    fireEvent.click(screen.getByRole("button", { name: "Start listening" }));

    // Auto-advance toggle is persistently present at the top header before answering (not intermittent)
    const autoToggle = screen.getByRole("button", {
      name: /Automatic next question|Auto-advance|Auto:/i,
    });
    expect(autoToggle).toBeVisible();

    // Verify no sticky footer under choices exists
    expect(document.querySelector(".wp-sticky-controls")).toBeNull();

    // Answer correctly
    const choice = answer(1, 0);
    fireEvent.click(choice);

    // Next question button appears at the top header, not below choices
    const nextButton = screen.getByRole("button", { name: "Next question" });
    expect(nextButton).toBeVisible();
    expect(document.querySelector(".wp-sticky-controls")).toBeNull();

    // Auto-advance toggle is still visible and can be toggled to disable progression
    fireEvent.click(autoToggle);
    expect(mocks.setAccessibility).toHaveBeenCalledWith({ autoAdvance: false });

    // Choice grid has nothing rendered below it in the choices container
    const choicesGrid = choice.closest(".grid");
    expect(choicesGrid).not.toBeNull();
    expect(choicesGrid?.nextElementSibling).toBeNull();
  });
});
