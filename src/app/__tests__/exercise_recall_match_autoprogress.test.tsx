import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { ExerciseRecallMatch } from "../exercises/ExerciseRecallMatch";
import { ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";

vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({
    speak: vi.fn(),
    stop: vi.fn(),
    isPlaying: false,
    isSupported: true,
    isError: false,
  }),
}));

vi.mock("../shared/useSound", () => ({
  useSound: () => ({
    playCorrect: vi.fn(),
    playIncorrect: vi.fn(),
    playClick: vi.fn(),
  }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

describe("ExerciseRecallMatch autoprogress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("autoprogresses on correct answer and does not show the continue button", () => {
    const dispatch = vi.fn();
    const words = BEDROOM_VOCABULARY.slice(0, 3);
    const targetWord = words[0]; // first word in queue

    render(
      <ExerciseRecallMatch step={2} words={words} lessonId="bedroom-1" dispatch={dispatch} />,
      { wrapper }
    );

    // Initial audio prompt timer
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Find the correct option button
    const options = screen.getAllByRole("button", { name: /Option/i });
    expect(options.length).toBeGreaterThanOrEqual(2);

    // Find option corresponding to targetWord
    const correctButton = options.find((btn) =>
      btn.getAttribute("aria-label")?.includes(targetWord.description)
    );
    expect(correctButton).toBeDefined();

    // Click the correct button
    act(() => {
      fireEvent.click(correctButton!);
    });

    // Continue button must NOT be in the document
    expect(screen.queryByRole("button", { name: /continue/i })).toBeNull();

    // Advance timer past ADVANCE_DELAY_MS.correct
    act(() => {
      vi.advanceTimersByTime(ADVANCE_DELAY_MS.correct + 50);
    });

    // Feedback is cleared and queue moves to the next question
    expect(screen.queryByRole("button", { name: /continue/i })).toBeNull();
  });

  it("shows continue button on incorrect answer when auto-advance is disabled", () => {
    const dispatch = vi.fn();
    const words = BEDROOM_VOCABULARY.slice(0, 3);
    const targetWord = words[0];

    render(
      <ExerciseRecallMatch step={2} words={words} lessonId="bedroom-1" dispatch={dispatch} />,
      { wrapper }
    );

    act(() => {
      vi.advanceTimersByTime(250);
    });

    const options = screen.getAllByRole("button", { name: /Option/i });
    // Find an incorrect option button
    const incorrectButton = options.find(
      (btn) => !btn.getAttribute("aria-label")?.includes(targetWord.description)
    );
    expect(incorrectButton).toBeDefined();

    // Click the incorrect button
    act(() => {
      fireEvent.click(incorrectButton!);
    });

    // For incorrect answer when autoAdvance is disabled (default), the continue button must be shown
    expect(screen.getByRole("button", { name: /continue/i })).toBeDefined();
  });
});
