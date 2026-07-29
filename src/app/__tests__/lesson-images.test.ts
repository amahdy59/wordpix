import { describe, expect, it } from "vitest";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { getWordFallbackDataUrl } from "../shared/WordImage";

describe("lesson image mapping", () => {
  it.each([
    ["bed", "bed.jpg"],
    ["nightstand", "nightstand.jpg"],
    ["dresser", "dresser.jpg"],
  ])("maps %s to its verified local asset", (wordId, fileName) => {
    const word = BEDROOM_VOCABULARY.find((item) => item.id === wordId);
    expect(word).toBeDefined();
    expect(word?.img).toContain(`/word-images/${fileName}`);
  });

  it("creates a semantic fallback for every vocabulary word", () => {
    for (const word of BEDROOM_VOCABULARY) {
      const fallback = decodeURIComponent(getWordFallbackDataUrl(word));
      expect(fallback).toContain(word.label);
      expect(fallback).toContain(word.topic.toUpperCase());
    }
  });
});
