import { describe, it, expect } from "vitest";
import { loadUnitVocabulary } from "../data/vocabulary";
import { resolveSentenceMedia, hasSentenceMediaCandidate } from "../content/sentenceMedia";
import { applySentenceMediaCorrection } from "../content/sentenceMediaCorrections";
import { attachReviewedUsageIllustrations } from "../data/reviewedUsageIllustrations";
import corrections from "../content/sentenceMediaCorrections.json";
import retail from "../data/usage/shopping-mall.usage.json";
import { unitUsageDataSchema } from "../data/usageTypes";

describe("visually checked sentence corrections", () => {
  it("preserves selection of an existing recorded sentence when its wrong image is held", async () => {
    await loadUnitVocabulary("spirits-liqueurs");
    const row = corrections.find((item) => item.wordId === "kahl-a")!;
    expect(hasSentenceMediaCandidate(row.wordId, row.sentence)).toBe(true);
    expect(resolveSentenceMedia(row.wordId, row.sentence)).toBeUndefined();
  });
  it("replaces the screenshot mismatches through the real lazy sentence resolver", async () => {
    await loadUnitVocabulary("shapes-geometry");
    for (const wordId of ["circle", "square", "triangle", "rectangle", "oval"]) {
      const row = corrections.find((item) => item.wordId === wordId)!;
      const media = resolveSentenceMedia(wordId, row.sentence);
      expect(media?.imagePath).toBeTruthy();
      expect(media?.imagePath).not.toContain("library-images");
      expect(media?.imageAlt).toBe(row.imageAlt);
      expect(media?.imageFallbacks).toBeUndefined();
    }
  });

  it("never applies a correction to changed text, another word or a different original image", () => {
    for (const row of corrections) {
      const original = { imagePath: row.originalKey, imageAlt: "Original" };
      expect(applySentenceMediaCorrection(row.wordId, row.sentence + " Changed.", original)).toBe(
        original
      );
      expect(applySentenceMediaCorrection("unrelated", row.sentence, original)).toBe(original);
      const changed = { ...original, imagePath: "another.webp" };
      expect(applySentenceMediaCorrection(row.wordId, row.sentence, changed)).toBe(changed);
      if (!row.replacementKey)
        expect(applySentenceMediaCorrection(row.wordId, row.sentence, original)).toBeUndefined();
    }
  });

  it("holds the unrelated retail scene instead of silently restoring a word-image fallback", () => {
    const lessons = attachReviewedUsageIllustrations(unitUsageDataSchema.parse(retail));
    const scene = lessons
      .find((item) => item.lessonId === "shopping-mall-4")!
      .usage.scenes.find((item) => item.chunkNumber === 4)!;
    expect(scene.imageReviewHold).toBeTruthy();
    expect(scene.imagePath).toBeUndefined();
    expect(scene.imageFallbacks).toBeUndefined();
  });
});
