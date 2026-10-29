import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import approved from "../../../docs/media/APPROVED_HADITH_REUSE.json";
import { FIGMA_HADITH_LESSONS } from "../learning/hadith/figmaHadithCatalog";
import { parseHadithVocabulary } from "../learning/hadith/hadithVocabularyContent";
import {
  getReviewedHadithVocabularyMedia,
  REVIEWED_HADITH_VOCABULARY_MEDIA,
} from "../learning/hadith/reviewedVocabularyMedia";

describe("approved Hadith vocabulary media", () => {
  it("pins only the three approved terms to their current lesson text revisions", () => {
    expect(approved.status).toBe("published");
    expect(approved.creates).toBe(6);
    expect(approved.overwrites).toBe(0);
    expect(approved.deletes).toBe(0);
    expect(approved.proposals).toHaveLength(3);
    expect(Object.keys(REVIEWED_HADITH_VOCABULARY_MEDIA).sort()).toEqual([
      "26/joint",
      "3/establish the daily prayers",
      "3/perform Hajj or go on pilgrimage",
    ]);
    for (const [identity, media] of Object.entries(REVIEWED_HADITH_VOCABULARY_MEDIA)) {
      const [number, term] = identity.split(/\/(.+)/);
      const proof = approved.proposals.find(
        (proposal) =>
          proposal.lesson === `hadith-${number.padStart(2, "0")}` && proposal.term === term
      );
      expect(proof).toBeDefined();
      expect(proof!.contentId).toBe(media.contentId);
      expect(proof!.contentSha256).toBe(media.contentSha256);
      expect(proof!.imageAlt).toBe(media.alt);
      expect(proof!.variants.map((variant) => variant.key)).toEqual([
        media.image480,
        media.image960,
      ]);
      const lesson = FIGMA_HADITH_LESSONS.find((item) => item.number === Number(number));
      expect(lesson).toBeDefined();
      expect(parseHadithVocabulary(lesson!.stages.vocabulary.text, lesson!.number)).toEqual(
        expect.arrayContaining([expect.objectContaining({ term })])
      );
      const digest = createHash("sha256")
        .update(JSON.stringify(["hadith", `${lesson!.id}/${term}`, "vocabulary", term]))
        .digest("hex");
      expect(media.contentSha256).toBe(digest);
      expect(media.contentId).toBe(`coverage-${digest.slice(0, 24)}`);
      expect(getReviewedHadithVocabularyMedia(lesson!.number, term)).toBe(media);
      for (const path of [media.image480, media.image960])
        expect(path).toMatch(/^question-images\/v2\/hadith-reviewed-media\/[a-f0-9]{64}\.webp$/);
      expect(media.alt.length).toBeGreaterThan(20);
    }
    expect(getReviewedHadithVocabularyMedia(4, "joint")).toBeUndefined();
  });
});
