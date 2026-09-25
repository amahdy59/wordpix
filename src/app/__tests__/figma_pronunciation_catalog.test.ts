import { describe, expect, it } from "vitest";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  FIGMA_PRONUNCIATION_SOURCE,
  PRONUNCIATION_CHAPTERS,
  getFigmaPronunciationActivityData,
  getFigmaPronunciationLesson,
  getPronunciationContrastPartner,
  getPronunciationQuestion,
} from "../learning/foundations/figmaPronunciationCatalog";
import {
  getPronunciationAudioClip,
  normalizePronunciationAudioLabel,
} from "../learning/foundations/pronunciationAudioManifest";

describe("Figma pronunciation source", () => {
  it("keeps the spoken answer and its picture in every question across all stages and modes", () => {
    for (const lesson of FIGMA_PRONUNCIATION_LESSONS) {
      for (const stage of [1, 2, 3, 4] as const) {
        for (const childMode of [false, true]) {
          for (let trial = 0; trial < 3; trial++) {
            const { target, choices } = getPronunciationQuestion(
              lesson.number,
              stage,
              trial,
              childMode
            );
            const context = `lesson ${lesson.number}, stage ${stage}, trial ${trial}, child ${childMode}`;
            expect(
              choices.filter((item) => item.label === target.label),
              context
            ).toEqual([target]);
            expect(new Set(choices.map((item) => item.label.toLowerCase())).size, context).toBe(
              choices.length
            );
            expect(choices.length, context).toBe(childMode || stage <= 2 ? 2 : 4);
            const clip = getPronunciationAudioClip(target.label, stage === 4);
            expect(clip, context).not.toBeNull();
            expect(normalizePronunciationAudioLabel(clip!.displayText), context).toBe(
              normalizePronunciationAudioLabel(target.label)
            );
            const partner = getPronunciationContrastPartner(
              getFigmaPronunciationActivityData(lesson.number),
              target.label
            );
            if (
              partner &&
              partner.toLowerCase() !== target.label.toLowerCase() &&
              lesson.images.some((item) => item.label.toLowerCase() === partner.toLowerCase())
            ) {
              expect(
                choices.map((item) => item.label.toLowerCase()),
                context
              ).toContain(partner.toLowerCase());
            }
          }
        }
      }
    }
  });
  it("contains the complete 68-lesson source in stable order", () => {
    expect(FIGMA_PRONUNCIATION_SOURCE.pageId).toBe("1126:3665");
    expect(FIGMA_PRONUNCIATION_LESSONS).toHaveLength(68);
    expect(FIGMA_PRONUNCIATION_LESSONS.map((lesson) => lesson.number)).toEqual(
      Array.from({ length: 68 }, (_, index) => index + 1)
    );
    expect(FIGMA_PRONUNCIATION_SOURCE.imageRefs).toHaveLength(650);
  });

  it("consolidates every useful legacy pronunciation topic into one revised chapter", () => {
    expect(PRONUNCIATION_CHAPTERS).toHaveLength(8);
    expect(PRONUNCIATION_CHAPTERS.flatMap((chapter) => chapter.legacyTopics)).toEqual([
      "meaningful-contrasts",
      "consonant-sequences",
      "vowel-clarity",
      "clear-word-endings",
      "meaning-chunks",
      "connected-speech",
      "word-stress",
      "syllable-prominence",
      "important-information",
      "pronunciation-goals",
      "communication-repair",
      "pronunciation-portfolio",
    ]);
    expect(new Set(PRONUNCIATION_CHAPTERS.map((chapter) => chapter.descriptionKey)).size).toBe(8);
  });

  it("exposes lesson-level source content without inventing runtime answers", () => {
    const lesson = getFigmaPronunciationLesson(1);
    expect(lesson.sourceName).toBe("lesson-01-same-or-different");
    expect(lesson.text.length).toBeGreaterThan(20);
    expect(lesson.text.some((line) => /same or different/i.test(line))).toBe(true);
  });

  it("derives a playable model and word bank for every Figma lesson", () => {
    for (let number = 1; number <= 68; number += 1) {
      const activity = getFigmaPronunciationActivityData(number);
      expect(activity.title).not.toMatch(/^Pronunciation lesson/);
      expect(activity.objective).toBeTruthy();
      expect(activity.model).toBeTruthy();
      expect(activity.teachWords.length).toBeGreaterThanOrEqual(2);
      expect(activity.items.length).toBeGreaterThanOrEqual(activity.teachItems.length);
      expect(activity.items.every((item) => item.imageRef.length === 40)).toBe(true);
      expect(new Set(activity.items.map((item) => item.label.toLowerCase())).size).toBe(
        activity.items.length
      );
    }
  });

  it("keeps every mapped image reachable in the uploaded pronunciation prefix", () => {
    const mapped = FIGMA_PRONUNCIATION_LESSONS.flatMap((lesson) => lesson.images);
    expect(new Set(mapped.map((item) => item.imageRef)).size).toBeGreaterThan(500);
    expect(mapped.every((item) => item.label.trim().length > 0)).toBe(true);
  });

  it("preserves authored contrast banks and teaching focus", () => {
    const sheepOrShip = getFigmaPronunciationActivityData(2);
    expect(sheepOrShip.contrastPairs).toContainEqual(["sheep", "ship"]);
    expect(sheepOrShip.contrastPairs).toContainEqual(["seat", "sit"]);
    expect(sheepOrShip.focus).toMatch(/vowel|duration|tension/i);
  });

  it("extracts authored recovery cues and maps contrast partners accurately", () => {
    const penOrPan = getFigmaPronunciationActivityData(4);
    expect(penOrPan.recoveryCue).toBeTruthy();
    expect(penOrPan.recoveryCue).toMatch(/mouth|jaw|pan/i);
    expect(getPronunciationContrastPartner(penOrPan, "pen")).toBe("pan");
    expect(getPronunciationContrastPartner(penOrPan, "pan")).toBe("pen");
    expect(getPronunciationContrastPartner(penOrPan, "men")).toBe("man");
  });

  it("surfaces authored physical articulation guidance", () => {
    const pAndB = getFigmaPronunciationActivityData(9);
    expect(pAndB.articulationCues.length).toBeGreaterThan(0);
    expect(pAndB.articulationCues.join(" ")).toMatch(/lip|voice|air|vibration/i);
    expect(pAndB.articulationCues.length).toBeLessThanOrEqual(3);
  });

  it("has a complete progression contract for every lesson", () => {
    for (const lesson of FIGMA_PRONUNCIATION_LESSONS) {
      const roles = new Set(lesson.images.map((item) => item.role));
      expect(lesson.images.length, `lesson ${lesson.number}`).toBeGreaterThanOrEqual(10);
      expect(roles).toEqual(new Set(["teach", "guided", "independent", "transfer"]));
      expect(lesson.images.every((item) => /^[0-9a-f]{40}$/i.test(item.imageRef))).toBe(true);
    }
  });
});
