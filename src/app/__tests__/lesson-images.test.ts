import { describe, expect, it } from "vitest";
import { COURSE_UNITS } from "../data/lessons";
import { getWordFallbackDataUrl } from "../shared/WordImage";

describe("lesson image mapping", () => {
  const vocabulary = Object.values(COURSE_UNITS).flatMap((unit) =>
    unit.vocabulary.map((word) => ({ unitId: unit.id, word }))
  );

  it("ensures every vocabulary word has a self-hosted local asset path", () => {
    for (const { word } of vocabulary) {
      expect(word.img).toContain("word-images/");
      expect(word.img).not.toContain("images.unsplash.com");
    }
  });

  it("creates a valid semantic fallback for every vocabulary word", () => {
    for (const { word } of vocabulary) {
      const fallback = getWordFallbackDataUrl(word);
      expect(fallback.startsWith("data:image/svg+xml")).toBe(true);
      expect(fallback.length).toBeGreaterThan(50);
    }
  });
});
