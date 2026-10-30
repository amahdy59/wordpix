import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

vi.mock("../generated/sentenceMediaRuntime.json", () => {
  throw Error("Opening one unit must not download or initialize all-course sentence media.");
});

import { resolveSentenceMedia } from "../content/sentenceMedia";
import { isUnitLoaded, loadUnitVocabulary } from "../data/vocabulary";
import { COURSE_UNITS } from "../data/courseCatalog";
import { getExactSentenceMedia } from "../content/sentenceMediaStore";

describe("unit-scoped sentence media", () => {
  it("prepares the exact image before exposing a unit as ready", async () => {
    await loadUnitVocabulary("camping-site");
    expect(isUnitLoaded("camping-site")).toBe(true);
    expect(resolveSentenceMedia("sleeping-bag", "This is a sleeping bag.")?.imagePath).toBeTruthy();
  });

  it("keeps repeated and concurrent unit loads consistent", async () => {
    const [first, second] = await Promise.all([
      loadUnitVocabulary("garden"),
      loadUnitVocabulary("garden"),
    ]);
    expect(first).toEqual(second);
    expect(isUnitLoaded("garden")).toBe(true);
    expect(resolveSentenceMedia("garden-gloves", "This is a pair of garden gloves.")).toBeDefined();
  });

  it("preserves every current unit's exact pairs, alternative text and fallbacks", async () => {
    const runtime: { strings: string[]; rows: number[][] } = JSON.parse(
      readFileSync("src/app/generated/sentenceMediaRuntime.json", "utf8")
    );
    for (const unitId of Object.keys(COURSE_UNITS)) {
      const words = await loadUnitVocabulary(unitId);
      const ids = new Set(words.map((word) => word.id));
      for (const row of runtime.rows) {
        const [wordId, sentence, imagePath, imageAlt, ...fallbacks] = row.map(
          (index) => runtime.strings[index]
        );
        if (!ids.has(wordId)) continue;
        const imageFallbacks = [];
        for (let index = 0; index < fallbacks.length; index += 2)
          imageFallbacks.push({ imagePath: fallbacks[index], imageAlt: fallbacks[index + 1] });
        expect(getExactSentenceMedia(wordId, sentence), `${unitId}/${wordId}`).toEqual({
          imagePath,
          imageAlt,
          ...(imageFallbacks.length ? { imageFallbacks } : {}),
        });
      }
    }
  });
});
