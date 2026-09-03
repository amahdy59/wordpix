import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ExerciseListenRepeat } from "../exercises/ExerciseListenRepeat";
import { BEDROOM_VOCABULARY } from "../data/lessons";

const audio = vi.hoisted(() => ({ speak: vi.fn(), stop: vi.fn() }));

vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({
    speak: audio.speak,
    stop: audio.stop,
    isPlaying: false,
    isSupported: true,
    isError: false,
  }),
}));

const speech = vi.hoisted(() => ({ listen: vi.fn(), stop: vi.fn(), reset: vi.fn() }));
vi.mock("../shared/useSpeechRecognition", () => ({
  useSpeechRecognition: () => ({
    ...speech,
    status: "idle",
    isListening: false,
    attempt: null,
    audioLevel: 0,
  }),
}));

describe("Listen and repeat mobile focus", () => {
  beforeEach(() => {
    audio.speak.mockClear();
    audio.stop.mockClear();
    speech.listen.mockClear();
  });

  it("keeps the image clean and exposes one clearly labelled details action", () => {
    render(
      <ExerciseListenRepeat
        step={1}
        words={BEDROOM_VOCABULARY.slice(0, 2)}
        lessonId="bedroom-1"
        dispatch={vi.fn()}
      />
    );

    const image = screen
      .getAllByRole("img", { name: BEDROOM_VOCABULARY[0].label })
      .find((candidate) => candidate.getAttribute("fetchpriority") === "high")!;
    expect(image).toBeDefined();
    expect(image.parentElement?.querySelector("button")).toBeNull();
    expect(screen.queryByText("Target Visual")).toBeNull();
    expect(screen.getAllByRole("button", { name: "Word details" })).toHaveLength(1);
    expect(screen.queryByText(/Use Left\/Right arrows/i)).toBeNull();
  });

  it("waits for the learner to request audio", () => {
    render(
      <ExerciseListenRepeat
        step={1}
        words={BEDROOM_VOCABULARY.slice(0, 2)}
        lessonId="bedroom-1"
        dispatch={vi.fn()}
      />
    );

    expect(audio.speak).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Play audio pronunciation/i }));
    expect(audio.speak).toHaveBeenCalledWith(BEDROOM_VOCABULARY[0].label);
  });

  it("uses Next word until the final word, then continues the lesson", () => {
    const dispatch = vi.fn();
    render(
      <ExerciseListenRepeat
        step={1}
        words={BEDROOM_VOCABULARY.slice(0, 2)}
        lessonId="bedroom-1"
        dispatch={dispatch}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Next word/i }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Word 2 of 2");
    expect(screen.getByRole("button", { name: /Continue to sentences/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous word" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /Continue to sentences/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: "LESSON_NEXT" });
  });
  it("starts the microphone only on request and stops playback first", () => {
    render(
      <ExerciseListenRepeat
        step={1}
        words={BEDROOM_VOCABULARY.slice(0, 2)}
        lessonId="bedroom-1"
        dispatch={vi.fn()}
      />
    );
    expect(speech.listen).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Practice speaking/ }));
    expect(audio.stop).toHaveBeenCalled();
    expect(speech.listen).toHaveBeenCalledWith(BEDROOM_VOCABULARY[0].label);
    expect(audio.stop.mock.invocationCallOrder.at(-1)).toBeLessThan(
      speech.listen.mock.invocationCallOrder.at(-1)!
    );
  });

  it("does not navigate on a predominantly vertical swipe", () => {
    render(
      <ExerciseListenRepeat
        step={1}
        words={BEDROOM_VOCABULARY.slice(0, 2)}
        lessonId="bedroom-1"
        dispatch={vi.fn()}
      />
    );
    const hero = document.querySelector('img[fetchpriority="high"]')!;
    fireEvent.touchStart(hero, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(hero, { changedTouches: [{ clientX: 145, clientY: 250 }] });
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Word 1 of 2");
  });
});
