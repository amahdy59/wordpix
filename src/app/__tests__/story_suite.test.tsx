import { describe, it, expect } from "vitest";
import { getOrGenerateStoryBundle } from "../data/storyTalesDictionary";
import { BEDROOM_GROUPS, BEDROOM_VOCABULARY } from "../data/lessons";

describe("Story Mastery Suite & Comprehension Quiz Integrity", () => {
  it("ensures every curated bedroom group has a 3-passage extended story bundle", () => {
    for (const group of BEDROOM_GROUPS) {
      const bundle = getOrGenerateStoryBundle(
        group.id,
        group.name,
        BEDROOM_VOCABULARY.filter((w) => group.wordIds.includes(w.id))
      );

      expect(bundle).toBeDefined();
      expect(bundle.passages.length).toBeGreaterThanOrEqual(3);
      expect(bundle.quiz.length).toBeGreaterThanOrEqual(3);

      // Verify each passage has English and Arabic content
      for (const passage of bundle.passages) {
        expect(passage.title).toBeTruthy();
        expect(passage.text).toBeTruthy();
        expect(passage.textArabic).toBeTruthy();
        expect(passage.partNumber).toBeGreaterThanOrEqual(1);
      }

      // Verify each quiz question has options, valid correctIndex, and explanation
      for (const q of bundle.quiz) {
        expect(q.question).toBeTruthy();
        expect(q.options.length).toBe(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.explanation).toBeTruthy();
        expect(q.explanationArabic).toBeTruthy();
      }
    }
  });

  it("ensures fallback generator works for any custom group without crash", () => {
    const customBundle = getOrGenerateStoryBundle("custom_group", "Art & Craft", [
      { id: "brush", label: "Brush" },
      { id: "canvas", label: "Canvas" },
      { id: "paint", label: "Paint" },
    ]);

    expect(customBundle.passages.length).toBe(3);
    expect(customBundle.quiz.length).toBe(3);
    expect(customBundle.themeTitle).toContain("Art & Craft");
  });
});
