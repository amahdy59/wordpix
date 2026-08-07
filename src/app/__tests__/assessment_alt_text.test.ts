import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getImageAltText } from "../shared/WordImage";
import { BEDROOM_VOCABULARY } from "../data/lessons";

const word = BEDROOM_VOCABULARY[0];

describe("Assessment image alt text", () => {
  it("names the word in learning mode", () => {
    expect(getImageAltText(word, "learning")).toBe(word.label);
  });

  it("never leaks the word before the option is chosen", () => {
    const alt = getImageAltText(word, "assessment", 0, false);
    expect(alt).toBe("Picture option A");
    expect(alt.toLowerCase()).not.toContain(word.label.toLowerCase());
  });

  it("reveals the word once the option is chosen", () => {
    expect(getImageAltText(word, "assessment", 1, true)).toBe(`Picture option B: ${word.label}`);
  });

  it("gives every option in a set a distinct label", () => {
    const labels = [0, 1, 2, 3].map((i) => getImageAltText(word, "assessment", i, false));
    expect(new Set(labels).size).toBe(4);
  });

  it("falls back to a number past the letter table", () => {
    expect(getImageAltText(word, "assessment", 99, false)).toBe("Picture option 100");
  });

  it("returns empty alt for decorative images", () => {
    expect(getImageAltText(word, "decorative")).toBe("");
  });
});

// Guards the wiring, not just the helper: the helper existed and was correct
// before this fix, but the graded exercises never passed altMode, so every
// option image was alt-texted with its own answer.
describe("Graded exercises opt into assessment alt text", () => {
  const gradedExercises = ["ExerciseQuickQuiz.tsx", "ExerciseRecallMatch.tsx"];

  gradedExercises.forEach((file) => {
    it(`${file} passes altMode="assessment" to every option image`, () => {
      const source = readFileSync(resolve(__dirname, "../exercises", file), "utf8");
      const wordImageTags = source.match(/<WordImage[\s\S]*?\/>/g) ?? [];

      expect(wordImageTags.length).toBeGreaterThan(0);
      wordImageTags.forEach((tag) => {
        expect(tag).toContain('altMode="assessment"');
        expect(tag).toContain("optionIndex=");
      });
    });
  });
});
