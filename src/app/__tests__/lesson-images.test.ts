import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { COURSE_UNITS } from "../data/lessons";
import { getWordFallbackDataUrl } from "../shared/WordImage";

const publicDir = resolve(__dirname, "../../../public");

describe("lesson image mapping", () => {
  const vocabulary = Object.values(COURSE_UNITS).flatMap((unit) =>
    unit.vocabulary.map((word) => ({ unitId: unit.id, word }))
  );
  /**
   * Every vocabulary photo used to be hotlinked to images.unsplash.com except
   * bed/nightstand/dresser — no SLA, no offline guarantee, and the app's own
   * "offline ready" PWA badge could never honestly report true on a cold
   * cache. All 58 words are self-hosted now; this guards against a future
   * addition reintroducing a remote URL.
   */
  it.each(vocabulary.map(({ unitId, word }) => [unitId, word.id, word] as const))(
    "maps %s/%s to a self-hosted local asset that exists on disk",
    (unitId, _wordId, word) => {
      expect(word.img).toContain("word-images/");
      expect(word.img).not.toContain("images.unsplash.com");
      const relativeAsset = word.img.replace(/^\.\//, "");
      expect(
        existsSync(resolve(publicDir, relativeAsset)),
        `${unitId}/${word.id}: ${relativeAsset}`
      ).toBe(true);
    }
  );

  it("creates a semantic fallback for every vocabulary word", () => {
    for (const { word } of vocabulary) {
      const fallback = decodeURIComponent(getWordFallbackDataUrl(word));
      expect(fallback).toContain(word.label);
      expect(fallback).toContain(word.topic.replace(/-/g, " ").toUpperCase());
    }
  });
});
