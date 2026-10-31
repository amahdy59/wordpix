import { describe, expect, it } from "vitest";
import holds from "../content/reviewedImageHolds.json";
import audit from "../../../docs/media/ACTIVE_IMAGE_TRIAGE_2026-10-30.json";
import { isReviewedImageHeld } from "../content/reviewedImageHolds";
import { resolveSentenceMedia, hasSentenceMediaCandidate } from "../content/sentenceMedia";
import { loadUnitVocabulary } from "../data/vocabulary";
import { loadLessonUsage } from "../data/usageRegistry";
import { getRichSentence } from "../exercises/exerciseContent";

describe("exact-context visual review holds", () => {
  it("pins each hold to inspected bytes and fails closed for changed contexts", () => {
    for (const row of holds) {
      const kind = row.kind === "sentence" ? "sentence" : "usage-scene";
      const asset = audit.assets.find((asset) => asset.key === row.sourceKey)!;
      expect(asset.servedSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(
        asset.uses.some(
          (use) =>
            use.demandId &&
            use.wordId === row.wordId &&
            use.text === row.text &&
            use.disposition === "hold-mismatch"
        )
      ).toBe(true);
      expect(isReviewedImageHeld(kind, row.wordId, row.text, row.sourceKey, row.lessonId)).toBe(
        true
      );
      expect(
        isReviewedImageHeld(kind, row.wordId, row.text + " Changed.", row.sourceKey, row.lessonId)
      ).toBe(false);
      expect(isReviewedImageHeld(kind, row.wordId, row.text, "different.webp", row.lessonId)).toBe(
        false
      );
      expect(isReviewedImageHeld(kind, row.wordId, row.text, row.sourceKey, "other-lesson")).toBe(
        false
      );
    }
  });

  it("suppresses wrong sentence pictures without changing selected recorded wording", async () => {
    const demands = audit.assets.flatMap((asset) =>
      asset.uses.filter((use) => use.kind === "sentence" && use.disposition === "hold-mismatch")
    );
    for (const row of demands) {
      const words = await loadUnitVocabulary(row.unitId);
      const usage = await loadLessonUsage(row.lessonId);
      const word = words.find((word) => word.id === row.wordId)!;
      expect(hasSentenceMediaCandidate(row.wordId, row.text, usage)).toBe(true);
      expect([getRichSentence(word, usage).full, getRichSentence(word, usage, 1).full]).toContain(
        row.text
      );
      expect(
        resolveSentenceMedia(row.wordId, row.text, usage),
        `${row.lessonId}/${row.wordId}`
      ).toBeUndefined();
    }
  });
});
