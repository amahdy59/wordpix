import { describe, it, expect } from "vitest";
import rejected from "../generated/rejectedSentenceMedia.json";
import registry from "../generated/reviewedExactSentenceMedia.json";
import reviews from "../../../docs/media/asset-reviews.json";
import { resolveSentenceMedia } from "../content/sentenceMedia";
import { identifySentence } from "../content/wordGrammar";

describe("reviewed image rejections", () => {
  it("excludes every known wrong association without mutating the source registry", () => {
    expect(rejected).toHaveLength(27);
    expect(rejected.map((row) => row.entryId).sort()).toEqual(
      reviews.bindings
        .filter((row) => row.status === "mismatch")
        .map((row) => row.entryId)
        .sort()
    );
    for (const row of rejected) {
      expect(registry[row.entryId as keyof typeof registry]).toMatchObject({
        wordId: row.wordId,
        sentence: row.sentence,
        imagePath: row.imagePath,
      });
      expect(resolveSentenceMedia(row.wordId, row.sentence)?.imagePath).not.toBe(row.imagePath);
    }
  });
  it("repairs mass-noun identification without changing countable containers", () => {
    expect(identifySentence("Firewood")).toBe("This is firewood.");
    expect(identifySentence("Sunscreen")).toBe("This is sunscreen.");
    expect(identifySentence("Sunscreen Bottle")).toBe("This is a sunscreen bottle.");
  });
});
