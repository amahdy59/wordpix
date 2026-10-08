import { describe, expect, it } from "vitest";
import { attachReviewedUsageIllustrations } from "../data/reviewedUsageIllustrations";
import { loadUnitUsageForEditorial } from "../data/usageRegistry";
import { unitUsageDataSchema } from "../data/usageTypes";
import numbers from "../data/usage/numbers-counting.usage.json";

describe("reviewed usage illustration integration", () => {
  it("attaches exactly 50 reviewed scenes through the real usage loader", async () => {
    const lessons = (
      await Promise.all(
        ["numbers-counting", "colors", "shapes-geometry", "prepositions-of-place"].map(
          loadUnitUsageForEditorial
        )
      )
    ).flatMap((unit) => unit ?? []);
    const scenes = lessons
      .flatMap((lesson) => lesson.usage.scenes)
      .filter(
        (scene) =>
          scene.imagePath?.startsWith("usage-illustrations/v1/") ||
          scene.imageFallbacks?.some((media) =>
            media.imagePath.startsWith("usage-illustrations/v1/")
          )
      );
    expect(scenes).toHaveLength(50);
    for (const scene of scenes) {
      expect(scene.imagePath).toMatch(
        /^(usage-illustrations|question-images)\/v1\/[a-z0-9-]+\/[a-f0-9]{64}\.webp$/
      );
      expect(scene.imageAlt?.trim().length).toBeGreaterThan(20);
    }
  });

  it("withholds a stale picture when the scenario or assessed answer changes", () => {
    for (const change of ["scenario", "answer"] as const) {
      const lessons = unitUsageDataSchema.parse(numbers);
      const scene = lessons[0].usage.scenes[0];
      scene.imagePath = "https://example.com/original-scene.webp";
      if (change === "scenario") scene.scenario = "A completely different task with travel bags.";
      else scene.check.expectedAnswer = "One";
      const result = attachReviewedUsageIllustrations(lessons);
      expect(result[0].usage.scenes[0].imagePath).toBe("https://example.com/original-scene.webp");
      expect(lessons[0].usage.scenes[0].imagePath).toBe("https://example.com/original-scene.webp");
    }
  });

  it("does not mutate the authored source media or approve unreleased lessons", () => {
    const lessons = unitUsageDataSchema.parse(numbers);
    const previous = structuredClone(lessons);
    const result = attachReviewedUsageIllustrations(lessons);
    expect(lessons).toEqual(previous);
    expect(result.map((lesson) => lesson.lessonId)).toEqual(
      lessons.map((lesson) => lesson.lessonId)
    );
    expect(result[0].usage.scenes[0].scenario).toBe(lessons[0].usage.scenes[0].scenario);
    expect(result[0].usage.scenes[0].check).toEqual(lessons[0].usage.scenes[0].check);
  });
});
