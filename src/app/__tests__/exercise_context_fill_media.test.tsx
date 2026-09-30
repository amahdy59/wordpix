import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseContextFill } from "../exercises/ExerciseContextFill";

const words: VocabularyItem[] = [
  {
    id: "black",
    label: "Black",
    phonetic: "/blæk/",
    img: "/word-images/colors/black.avif",
    description: "A very dark color.",
    topic: "colors",
  },
  {
    id: "lime",
    label: "Lime",
    phonetic: "/laɪm/",
    img: "/word-images/colors/lime.avif",
    description: "A vivid yellow-green color.",
    topic: "colors",
  },
  {
    id: "cyan",
    label: "Cyan",
    phonetic: "/ˈsaɪæn/",
    img: "/word-images/colors/cyan.avif",
    description: "A bright blue-green color.",
    topic: "colors",
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

describe("ExerciseContextFill sentence media", () => {
  beforeEach(() => localStorage.clear());

  it("shows the authored black shoes image for its sentence", () => {
    render(<ExerciseContextFill step={1} lessonId="colors-1" words={words} dispatch={vi.fn()} />, {
      wrapper,
    });

    const image = screen.getByRole("img", {
      name: /very dark leather lace-up shoes/i,
    });
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("learning-scenes/colors/colors-1-black-shoes.avif")
    );
  });
});
