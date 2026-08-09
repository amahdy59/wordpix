import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { getWordFallbackDataUrl } from "../shared/WordImage";

const publicDir = resolve(__dirname, "../../../public");

describe("lesson image mapping", () => {
  /**
   * Every vocabulary photo used to be hotlinked to images.unsplash.com except
   * bed/nightstand/dresser — no SLA, no offline guarantee, and the app's own
   * "offline ready" PWA badge could never honestly report true on a cold
   * cache. All 58 words are self-hosted now; this guards against a future
   * addition reintroducing a remote URL.
   */
  it.each(BEDROOM_VOCABULARY.map((w) => [w.id] as const))(
    "maps %s to a self-hosted local asset that actually exists on disk",
    (wordId) => {
      const word = BEDROOM_VOCABULARY.find((item) => item.id === wordId);
      expect(word).toBeDefined();
      expect(word?.img).toContain(`/word-images/${wordId}.jpg`);
      expect(word?.img).not.toContain("images.unsplash.com");
      expect(existsSync(resolve(publicDir, "word-images", `${wordId}.jpg`))).toBe(true);
    }
  );

  it("creates a semantic fallback for every vocabulary word", () => {
    for (const word of BEDROOM_VOCABULARY) {
      const fallback = decodeURIComponent(getWordFallbackDataUrl(word));
      expect(fallback).toContain(word.label);
      expect(fallback).toContain(word.topic.toUpperCase());
    }
  });
});
