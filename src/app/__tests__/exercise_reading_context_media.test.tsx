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

  it("withholds a mismatched canvas while retaining the complete reading evidence", () => {
    render(
      <ExerciseReadingContext step={5} lessonId="colors-1" words={words} dispatch={vi.fn()} />,
      { wrapper }
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(/Placeholder image/i)).toBeVisible();
    expect(screen.getByText(/I paint a red apple under a yellow sun/)).toBeVisible();
  });

  it("shows a verified scene that supports the current Colors reading", () => {
    render(
      <ExerciseReadingContext step={5} lessonId="colors-2" words={words} dispatch={vi.fn()} />,
      { wrapper }
    );
    const image = screen.getByRole("img", { name: /flower pots surrounded by roses/i });
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("question-images/v1/reading-colors-delicate-shades/")
    );
  });
});
