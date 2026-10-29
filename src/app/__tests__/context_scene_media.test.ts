import { describe, expect, it } from "vitest";
import { statSync } from "node:fs";
import { resolve } from "node:path";
import { findLessonSceneImage, loadLessonUsageForEditorial } from "../data/usageRegistry";
import {
  AUTHORED_LESSON_CONTENT,
  getAuthoredSentence,
} from "../exercises/content/authoredLessonContent";
import {
  reviewedPilotSentenceMedia,
  reviewedReadingMedia,
} from "../exercises/content/pilotSentenceMedia";
import figmaReview from "../generated/reviewedFigmaQuestionMedia.json";

function expectLocalAsset(path: string) {
  const file = resolve(
    process.cwd(),
    "public",
    path.replace(/^\.\/learning-scenes\//, "learning-scenes/")
  );
  expect(statSync(file).size).toBeGreaterThan(0);
}

describe("context question scene media", () => {
  it("links the white/cyan/magenta question to its reviewed design samples", async () => {
    const usage = await loadLessonUsageForEditorial("colors-1");
    expect(usage).not.toBeNull();

    const scene = findLessonSceneImage(usage!, "Magenta");
    expect(scene?.imagePath).toMatch(
      /^usage-illustrations\/v1\/colors-1-usage-scene-4\/[a-f0-9]{64}\.webp$/
    );
    expect(scene?.imageAlt).toMatch(/snow.+blue-green.+reddish-purple/i);
    expect(scene?.imageAlt).not.toMatch(/\bmagenta\b/i);
  });

  it("does not invent media for a scene without an authored asset", async () => {
    const usage = await loadLessonUsageForEditorial("colors-1");
    expect(usage).not.toBeNull();
    const withoutMedia = {
      ...usage!,
      usage: {
        ...usage!.usage,
        scenes: usage!.usage.scenes.map((scene) => ({ ...scene, imagePath: undefined })),
      },
    };
    expect(findLessonSceneImage(withoutMedia, "Red")).toBeUndefined();
  });

  it("uses sentence-specific black shoes media without announcing the answer", () => {
    const sentence = getAuthoredSentence("black");
    expect(sentence?.full).toBe("I wear black shoes.");
    expect(sentence?.media?.imagePath).toBe("./learning-scenes/colors/colors-1-black-shoes.avif");
    expect(sentence?.media?.imageAlt).toMatch(/shoes/i);
    expect(sentence?.media?.imageAlt).not.toMatch(/\bblack\b/i);
  });

  it("selects verified answer-safe media and withholds incorrect or ambiguous clues", () => {
    const words = Object.values(AUTHORED_LESSON_CONTENT).flatMap((lesson) => lesson.words);
    expect(words).toHaveLength(90);

    const rejected = new Set(
      Object.entries(figmaReview.sentences)
        .filter(([, review]) => review.status === "withheld")
        .map(([id]) => id)
    );
    expect(rejected).toContain("eight");
    expect(rejected).toContain("thirteen");
    expect(rejected).toContain("eighteen");
    expect(rejected).toContain("nineteen");
    for (const word of words) {
      if (rejected.has(word.id)) {
        expect(word.sentence.media, word.id).toBeUndefined();
        continue;
      }
      expect(word.sentence.media?.imagePath, word.id).toMatch(
        /^(question-images\/v1\/sentence-[a-z-]+\/[a-f0-9]{64}\.webp|\.\/learning-scenes\/colors\/colors-1-black-shoes\.avif)$/
      );
      expect(word.sentence.media?.imageAlt, word.id).toBeTruthy();
      expect(word.sentence.media?.imageAlt, word.id).not.toMatch(
        new RegExp(`\\b${word.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
      );
      if (word.id === "black") expectLocalAsset(word.sentence.media!.imagePath);
      for (const fallback of word.sentence.media?.imageFallbacks ?? [])
        expectLocalAsset(fallback.imagePath);
    }
  });

  it("withholds reviewed images if their sentence changes", () => {
    expect(reviewedPilotSentenceMedia("four", "There are four bags.")).toBeUndefined();
    expect(reviewedPilotSentenceMedia("four", "There are four chairs.")?.imagePath).toMatch(
      /^question-images\//
    );
  });

  it("keeps clear Colors reading images and withholds artwork depicting a different process", () => {
    const colorLessons = ["colors-1", "colors-2", "colors-3"].map(
      (lessonId) => AUTHORED_LESSON_CONTENT[lessonId]
    );
    const clusters = colorLessons.flatMap((lesson) => lesson.clusters);

    expect(clusters).toHaveLength(8);
    for (const cluster of clusters) {
      if (["colors-primary-bright", "colors-light-and-optics"].includes(cluster.id)) {
        expect(cluster.microReading.media, cluster.id).toBeUndefined();
        continue;
      }
      expect(cluster.microReading.media?.imagePath, cluster.id).toMatch(
        /^question-images\/v1\/reading-colors-[a-z-]+\/[a-f0-9]{64}\.webp$/
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
      expect(reviewedReadingMedia(cluster.id, "A different reading.")).toBeUndefined();
    }
  });

  it("links all Shapes & Geometry chunks to reviewed answer-safe scene images", async () => {
    const usage = await loadLessonUsageForEditorial("shapes-geometry-1");
    const allLessons = await Promise.all(
      [1, 2, 3, 4].map((number) => loadLessonUsageForEditorial(`shapes-geometry-${number}`))
    );
    expect(usage).not.toBeNull();

    const scenes = allLessons.flatMap((lesson) => lesson?.usage.scenes ?? []);
    expect(scenes).toHaveLength(17);
    for (const scene of scenes) {
      expect(scene.imagePath).toMatch(
        /^(usage-illustrations|question-images)\/v1\/shapes-geometry-\d-usage-scene-\d\/[a-f0-9]{64}\.webp$/
      );
      expect(scene.imageAlt).toBeTruthy();
      expect(scene.imageAlt).not.toContain(scene.check.expectedAnswer);
    }
  });
});
