import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseContextGapFill } from "../exercises/ExerciseContextGapFill";

const words: VocabularyItem[] = [
  {
    id: "red",
    label: "Red",
    phonetic: "/red/",
    img: "/word-images/colors/red.avif",
    description: "A primary color.",
    topic: "colors",
  },
  {
    id: "orange",
    label: "Orange",
    phonetic: "/ˈɒrɪndʒ/",
    img: "/word-images/colors/orange.avif",
    description: "A warm color.",
    topic: "colors",
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

describe("ExerciseContextGapFill sentence media", () => {
  beforeEach(() => localStorage.clear());

  it("shows the authored image above its usage question without revealing the answer", () => {
    render(
      <ExerciseContextGapFill step={3} lessonId="colors-1" words={words} dispatch={vi.fn()} />,
      { wrapper }
    );

    const image = screen.getByRole("img", { name: /apple on a neutral tabletop/i });
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("learning-scenes/colors/colors-1-red-apple.avif")
    );
    expect(image).not.toHaveAttribute("alt", expect.stringMatching(/\bred\b/i));
  });

  it("selects media from whichever usage question is currently active", () => {
    render(
      <ExerciseContextGapFill
        step={3}
        lessonId="colors-1"
        words={[words[1], words[0]]}
        dispatch={vi.fn()}
      />,
      { wrapper }
    );

    const nextImage = screen.getByRole("img", {
      name: /adult woman wearing a knitted hat/i,
    });
    expect(nextImage).toHaveAttribute(
      "src",
      expect.stringContaining("learning-scenes/colors/colors-1-orange-hat.avif")
    );
    expect(nextImage).not.toHaveAttribute("alt", expect.stringMatching(/\borange\b/i));
  });
});
