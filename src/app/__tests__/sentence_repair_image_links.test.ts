import { describe, expect, it } from "vitest";
import { loadUnitVocabulary } from "../data/vocabulary";
import { loadUnitUsage } from "../data/usageRegistry";
import { getRichSentence } from "../exercises/exerciseContent";
import { resolveSentenceMedia } from "../content/sentenceMedia";

const repairedTargets = [
  ["river", "canoeing"],
  ["coral-reef", "coral-bleaching"],
  ["river", "skipping-stones"],
  ["river", "swimming"],
  ["river", "wading"],
  ["camping-site", "star-gazing"],
  ["camping-site", "bird-watching"],
  ["mountain", "camping"],
  ["gym", "elliptical"],
  ["camping-site", "explore"],
  ["camping-site", "hiking"],
  ["camping-site", "mountain-biking"],
  ["mountain", "snowboarding"],
] as const;

describe("repaired sentence illustrations", () => {
  it.each(repairedTargets)("selects the exact uploaded image for %s/%s", async (unitId, wordId) => {
    const words = await loadUnitVocabulary(unitId);
    const word = words.find((item) => item.id === wordId)!;
    expect(word).toBeDefined();
    const lessons = (await loadUnitUsage(unitId)) ?? [];
    const usage = lessons.find((lesson) => lesson.targetWordsEnglish.includes(word.label));
    for (const contextIndex of [0, 1]) {
      const sentence = getRichSentence(word, usage, contextIndex).full;
      expect(sentence).not.toMatch(/^The word is /iu);
      const media = resolveSentenceMedia(wordId, sentence, usage);
      expect(media?.imagePath).toMatch(
        /^question-images\/v3\/sentence-repair-20261026-[a-z0-9-]+\/[a-f0-9]{64}\.webp$/u
      );
      expect(media?.imageAlt).toBeTruthy();
      expect(resolveSentenceMedia(wordId, sentence + " Extra detail.", usage)).toBeUndefined();
    }
  });
});
