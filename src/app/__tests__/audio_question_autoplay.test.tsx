import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { ExerciseRecallMatch } from "../exercises/ExerciseRecallMatch";
import { ExListeningDictationSprint } from "../exercises/listening/ListeningSuite";
import { ExSpeakingEchoPractice } from "../exercises/speaking/EchoPractice";

const audio = vi.hoisted(() => ({
  speak: vi.fn(),
  stop: vi.fn(),
}));

vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({
    speak: audio.speak,
    stop: audio.stop,
    isPlaying: false,
    isSupported: true,
    isError: false,
  }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

describe("Audio question auto-play", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("automatically plays prompt audio in ExerciseRecallMatch", () => {
    render(
      <ExerciseRecallMatch
        step={2}
        words={BEDROOM_VOCABULARY.slice(0, 3)}
        lessonId="bedroom-1"
        dispatch={vi.fn()}
      />,
      { wrapper }
    );

    // Prompt is scheduled with 200ms delay
    expect(audio.speak).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(audio.speak).toHaveBeenCalledWith(BEDROOM_VOCABULARY[0].label);
  });

  it("automatically plays sentence prompt in ExListeningDictationSprint", () => {
    render(<ExListeningDictationSprint dispatch={vi.fn()} />, { wrapper });

    expect(audio.speak).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(audio.speak).toHaveBeenCalledWith(expect.stringMatching(/The cat is sleeping on the/i));
  });

  it("automatically plays model utterance in ExSpeakingEchoPractice", () => {
    render(<ExSpeakingEchoPractice dispatch={vi.fn()} />, { wrapper });

    expect(audio.speak).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(audio.speak).toHaveBeenCalledWith(BEDROOM_VOCABULARY[0].label);
  });
});
