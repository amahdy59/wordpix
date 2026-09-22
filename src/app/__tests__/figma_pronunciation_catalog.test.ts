import { describe, expect, it } from "vitest";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  FIGMA_PRONUNCIATION_SOURCE,
  getFigmaPronunciationActivityData,
  getFigmaPronunciationLesson,
} from "../learning/foundations/figmaPronunciationCatalog";

describe("Figma pronunciation source", () => {
  it("contains the complete 68-lesson source in stable order", () => {
    expect(FIGMA_PRONUNCIATION_SOURCE.pageId).toBe("1126:3665");
    expect(FIGMA_PRONUNCIATION_LESSONS).toHaveLength(68);
    expect(FIGMA_PRONUNCIATION_LESSONS.map((lesson) => lesson.number)).toEqual(
      Array.from({ length: 68 }, (_, index) => index + 1)
    );
    expect(FIGMA_PRONUNCIATION_SOURCE.imageRefs).toHaveLength(650);
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
    }
  });
});
