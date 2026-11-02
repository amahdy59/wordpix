import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import type { VocabularyItem } from "../data/lessons";
import { useLessonUsage } from "../data/useLessonUsage";
import { ExerciseSentenceBuilder } from "../exercises/ExerciseSentenceBuilder";

vi.mock("../data/useLessonUsage", () => ({ useLessonUsage: vi.fn() }));

const words: VocabularyItem[] = [
  {
    id: "network-switch",
    label: "Network switch",
    phonetic: "",
    img: "/word-images/computer-lab/network-switch.avif",
    description: "A network switch routes traffic between local devices.",
    topic: "computer-lab",
  },
];
const wrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

describe("Sentence builder content readiness", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(useLessonUsage).mockReturnValue({ status: "loading", lessonId: "computer-lab-2" });
  });

  it("waits before exposing word tiles, then retains the fallback when no approved usage exists", () => {
    const dispatch = vi.fn();
    const { rerender } = render(
      <ExerciseSentenceBuilder
        step={3}
        lessonId="computer-lab-2"
        words={words}
        dispatch={dispatch}
      />,
      { wrapper }
    );
    expect(screen.queryByRole("group", { name: "Available words" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Loading screen…");
    vi.mocked(useLessonUsage).mockReturnValue({
      status: "ready",
      lessonId: "computer-lab-2",
      data: null,
    });
    rerender(
      <ExerciseSentenceBuilder
        step={3}
        lessonId="computer-lab-2"
        words={[...words]}
        dispatch={dispatch}
      />
    );
    const tile = screen.getByRole("button", { name: /Place network in blank 1/i });
    tile.focus();
    expect(tile).toHaveFocus();
    fireEvent.click(tile);
    expect(tile).toBeDisabled();
  });

  it("keeps the optional reading path available while lesson content is pending", () => {
    const dispatch = vi.fn();
    render(
      <ExerciseSentenceBuilder
        step={3}
        lessonId="computer-lab-2"
        words={words}
        dispatch={dispatch}
      />,
      { wrapper }
    );
    fireEvent.click(screen.getByRole("button", { name: "Skip to reading" }));
    expect(dispatch).toHaveBeenCalledExactlyOnceWith({ type: "LESSON_GOTO_STEP", step: 5 });
  });
});
