import { describe, expect, it } from "vitest";
import { statSync } from "node:fs";
import { resolve } from "node:path";
import { findLessonSceneImage, loadLessonUsageForEditorial } from "../data/usageRegistry";
import {
  AUTHORED_LESSON_CONTENT,
  getAuthoredSentence,
} from "../exercises/content/authoredLessonContent";

function expectLocalAsset(path: string) {
  const file = resolve(
    process.cwd(),
    "public",
    path.replace(/^\.\/learning-scenes\//, "learning-scenes/")
  );
  expect(statSync(file).size).toBeGreaterThan(0);
}

describe("context question scene media", () => {
  it("links the white/cyan/magenta question to its authored visual", async () => {
    const usage = await loadLessonUsageForEditorial("colors-1");
    expect(usage).not.toBeNull();

    const scene = findLessonSceneImage(usage!, "Magenta");
    expect(scene?.imagePath).toBe("./learning-scenes/colors/colors-1-scene-4.avif");
    expect(scene?.imageAlt).toMatch(/cloud.+shirt.+flower/i);
    expect(scene?.imageAlt).not.toMatch(/\bmagenta\b/i);
  });

  it("does not invent media for a scene without an authored asset", async () => {
    const usage = await loadLessonUsageForEditorial("colors-1");
    expect(usage).not.toBeNull();
    expect(findLessonSceneImage(usage!, "Red")).toBeUndefined();
  });

  it("uses sentence-specific black shoes media without announcing the answer", () => {
    const sentence = getAuthoredSentence("black");
    expect(sentence?.full).toBe("I wear black shoes.");
    expect(sentence?.media?.imagePath).toBe("./learning-scenes/colors/colors-1-black-shoes.avif");
    expect(sentence?.media?.imageAlt).toMatch(/shoes/i);
    expect(sentence?.media?.imageAlt).not.toMatch(/\bblack\b/i);
  });

  it("gives every pilot sentence a non-empty, answer-safe local image", () => {
    const words = Object.values(AUTHORED_LESSON_CONTENT).flatMap((lesson) => lesson.words);
    expect(words).toHaveLength(90);

    for (const word of words) {
      expect(word.sentence.media?.imagePath, word.id).toMatch(
        /^\.\/learning-scenes\/(numbers-counting|colors)\/.+\.avif$/
      );
      expect(word.sentence.media?.imageAlt, word.id).toBeTruthy();
      expect(word.sentence.media?.imageAlt, word.id).not.toMatch(
        new RegExp(`\\b${word.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
      );
      expectLocalAsset(word.sentence.media!.imagePath);
    }
  });

  it("links every Colors reading to an answer-safe local scene image", () => {
    const colorLessons = ["colors-1", "colors-2", "colors-3"].map(
      (lessonId) => AUTHORED_LESSON_CONTENT[lessonId]
    );
    const clusters = colorLessons.flatMap((lesson) => lesson.clusters);

    expect(clusters).toHaveLength(8);
    for (const cluster of clusters) {
      expect(cluster.microReading.media?.imagePath, cluster.id).toMatch(
        /^\.\/learning-scenes\/colors\/colors-\d-reading-\d-[a-z-]+\.avif$/
      );
      expect(cluster.microReading.media?.imageAlt, cluster.id).toBeTruthy();
      const assessedTerms = cluster.retrieval.answer
        .match(/[A-Za-z]+/g)
        ?.filter((term) => term.length > 3);
      for (const term of assessedTerms ?? []) {
        expect(cluster.microReading.media?.imageAlt, cluster.id).not.toMatch(
          new RegExp(`\\b${term}\\b`, "i")
        );
      }
      expectLocalAsset(cluster.microReading.media!.imagePath);
    }
  });

  it("links all Shapes & Geometry chunks to answer-safe local scene images", async () => {
    const usage = await loadLessonUsageForEditorial("shapes-geometry-1");
    const allLessons = await Promise.all(
      [1, 2, 3, 4].map((number) => loadLessonUsageForEditorial(`shapes-geometry-${number}`))
    );
    expect(usage).not.toBeNull();

    const scenes = allLessons.flatMap((lesson) => lesson?.usage.scenes ?? []);
    expect(scenes).toHaveLength(17);
    for (const scene of scenes) {
      expect(scene.imagePath).toMatch(
        /^\.\/learning-scenes\/shapes-geometry\/shapes-geometry-\d-scene-\d\.avif$/
      );
      expect(scene.imageAlt).toBeTruthy();
      expect(scene.imageAlt).not.toContain(scene.check.expectedAnswer);
      expectLocalAsset(scene.imagePath!);
    }
  });
});
