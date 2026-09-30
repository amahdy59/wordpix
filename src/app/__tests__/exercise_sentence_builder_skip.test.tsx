import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseSentenceBuilder } from "../exercises/ExerciseSentenceBuilder";

const words: VocabularyItem[] = [
  {
    id: "pink",
    label: "Pink",
    phonetic: "/pɪŋk/",
    img: "/word-images/colors/pink.avif",
    description: "A light red color.",
    topic: "colors",
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

describe("ExerciseSentenceBuilder optional path", () => {
  beforeEach(() => localStorage.clear());

  it("skips directly to reading without recording an attempt", () => {
    const dispatch = vi.fn();
    render(
      <ExerciseSentenceBuilder step={3} lessonId="colors-1" words={words} dispatch={dispatch} />,
      { wrapper }
    );

    fireEvent.click(screen.getByRole("button", { name: "Skip to reading" }));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: "LESSON_GOTO_STEP", step: 5 });
    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: "LESSON_ATTEMPT" }));
  });
});
