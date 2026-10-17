import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { useEffect, type ReactNode } from "react";
import { LearnerProvider, useLearner } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { ExerciseRecallMatch } from "../exercises/ExerciseRecallMatch";
import { ExListeningDictationSprint } from "../exercises/listening/ListeningSuite";
import { ExSpeakingEchoPractice } from "../exercises/speaking/EchoPractice";
import { SkillExerciseRunner } from "../exercises/SkillExerciseRunner";
import { LISTENING_EXERCISES } from "../exercises/content/listeningTasks";

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

function ManualAudioHarness({ children }: { children: ReactNode }) {
  const { setAccessibility } = useLearner();
  useEffect(() => {
    setAccessibility({ autoPlayAudio: false });
  }, [setAccessibility]);
  return <>{children}</>;
}

const manualWrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>
      <ManualAudioHarness>{children}</ManualAudioHarness>
    </I18nProvider>
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

  it("does not auto-play prompt audio in ExerciseRecallMatch when manual audio is configured", () => {
    render(
      <ExerciseRecallMatch
        step={2}
        words={BEDROOM_VOCABULARY.slice(0, 3)}
        lessonId="bedroom-1"
        dispatch={vi.fn()}
      />,
      { wrapper: manualWrapper }
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(audio.speak).not.toHaveBeenCalled();
  });

  it("automatically plays sentence prompt in ExListeningDictationSprint", () => {
    render(<ExListeningDictationSprint dispatch={vi.fn()} />, { wrapper });

    expect(audio.speak).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(audio.speak).toHaveBeenCalledWith(expect.stringMatching(/The cat is sleeping on the/i));
  });

  it("does not auto-play sentence prompt in ExListeningDictationSprint when manual audio is configured", () => {
    render(<ExListeningDictationSprint dispatch={vi.fn()} />, { wrapper: manualWrapper });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(audio.speak).not.toHaveBeenCalled();
  });

  it("automatically plays model utterance in ExSpeakingEchoPractice", () => {
    render(<ExSpeakingEchoPractice dispatch={vi.fn()} />, { wrapper });

    expect(audio.speak).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(audio.speak).toHaveBeenCalledWith(BEDROOM_VOCABULARY[0].label);
  });

  it("does not auto-play model utterance in ExSpeakingEchoPractice when manual audio is configured", () => {
    render(<ExSpeakingEchoPractice dispatch={vi.fn()} />, { wrapper: manualWrapper });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(audio.speak).not.toHaveBeenCalled();
  });

  it("automatically plays listening task prompt in SkillExerciseRunner", () => {
    render(
      <SkillExerciseRunner
        definition={LISTENING_EXERCISES["listen-word-match"]}
        dispatch={vi.fn()}
      />,
      { wrapper }
    );

    expect(audio.speak).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(audio.speak).toHaveBeenCalled();
  });

  it("does not auto-play listening task prompt in SkillExerciseRunner when manual audio is configured", () => {
    render(
      <SkillExerciseRunner
        definition={LISTENING_EXERCISES["listen-word-match"]}
        dispatch={vi.fn()}
      />,
      { wrapper: manualWrapper }
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(audio.speak).not.toHaveBeenCalled();
  });
});
