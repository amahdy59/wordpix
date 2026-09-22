import { describe, expect, it } from "vitest";
import { FIGMA_PRONUNCIATION_LESSON_1 } from "../learning/foundations/pronunciationLesson1";

describe("Figma pronunciation exercise contract", () => {
  it("validates Lesson 1's varied, image-supported flow", () => {
    expect(FIGMA_PRONUNCIATION_LESSON_1.number).toBe(1);
    expect(FIGMA_PRONUNCIATION_LESSON_1.stages).toEqual([
      "hear",
      "notice",
      "contrast",
      "use",
      "transfer",
      "retry-recovery",
      "delayed-review",
    ]);
    expect(FIGMA_PRONUNCIATION_LESSON_1.exercises).toHaveLength(3);
    expect(FIGMA_PRONUNCIATION_LESSON_1.exercises[2].imageVisibility).toBe("after-answer");
    expect(FIGMA_PRONUNCIATION_LESSON_1.exercises[1].freshSpeaker).toBe(true);
  });
});
