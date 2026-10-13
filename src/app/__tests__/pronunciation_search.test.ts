import { describe, expect, it } from "vitest";
import {
  normalizePronunciationSearch,
  pronunciationMatches,
} from "../learning/foundations/pronunciationSearch";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  getFigmaPronunciationActivityData,
} from "../learning/foundations/figmaPronunciationCatalog";

describe("pronunciation search", () => {
  it("finds authored words that are absent from the title", () => {
    expect(pronunciationMatches(3, "led")).toBe(true);
    expect(pronunciationMatches(3, "no-such-word")).toBe(false);
  });
  it("normalizes Arabic diacritics and Alef variants without collapsing IPA", () => {
    expect(normalizePronunciationSearch(" إِيقَاعـ ")).toBe("ايقاع");
    expect(normalizePronunciationSearch("/iː/ /ɪ/")).toBe("/iː/ /ɪ/");
  });
  it("indexes Arabic guidance", () => {
    const lesson = FIGMA_PRONUNCIATION_LESSONS.find(
      (item) => getFigmaPronunciationActivityData(item.number).arabicSpeakerTip
    );
    expect(lesson).toBeDefined();
    const tip = getFigmaPronunciationActivityData(lesson!.number).arabicSpeakerTip!;
    expect(pronunciationMatches(lesson!.number, tip.titleAr)).toBe(true);
  });
});
