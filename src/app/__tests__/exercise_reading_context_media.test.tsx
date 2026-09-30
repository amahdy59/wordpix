import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseReadingContext } from "../exercises/ExerciseReadingContext";

const words: VocabularyItem[] = [
  {
    id: "red",
    label: "Red",
    phonetic: "/red/",
    img: "/word-images/colors/red.avif",
    description: "A primary color.",
    topic: "colors",
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

describe("ExerciseReadingContext media", () => {
  beforeEach(() => localStorage.clear());

  it("shows the scene that supports the current Colors reading", () => {
    render(
      <ExerciseReadingContext step={5} lessonId="colors-1" words={words} dispatch={vi.fn()} />,
      { wrapper }
    );

    const image = screen.getByRole("img", {
      name: /easel and painting supplies beside a stream/i,
    });
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("learning-scenes/colors/colors-1-reading-1-painting-the-park.avif")
    );
  });
});
