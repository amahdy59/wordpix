import { describe, expect, it } from "vitest";
import { COURSE_UNITS } from "../data/lessons";
import { loadAllUnitVocabulary } from "../data/vocabulary";
import { getWordFallbackDataUrl } from "../shared/WordImage";

// Vocabulary now lives one chunk per unit, so a check that spans the whole
// catalogue has to ask for it rather than read it off the catalogue object.
const loaded = await loadAllUnitVocabulary();
const vocabulary = Object.values(COURSE_UNITS).flatMap((unit) =>
  (loaded.get(unit.id) ?? []).map((word) => ({ unitId: unit.id, word }))
);

describe("lesson image mapping", () => {
  it("ensures every vocabulary word has a self-hosted local asset path", () => {
    for (const { word } of vocabulary) {
      expect(word.img).toContain("word-images/");
      expect(word.img).not.toContain("images.unsplash.com");
    }
  }, 30000);

  it("creates a valid semantic fallback for every vocabulary word", () => {
    for (const { word } of vocabulary) {
      const fallback = getWordFallbackDataUrl(word);
      expect(fallback.startsWith("data:image/svg+xml")).toBe(true);
      expect(fallback.length).toBeGreaterThan(50);
    }
  }, 30000);
});
