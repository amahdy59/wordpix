import { describe, expect, it } from "vitest";
import { attachReviewedUsageIllustrations } from "../data/reviewedUsageIllustrations";
import { unitUsageDataSchema } from "../data/usageTypes";
import vectors from "../generated/reviewedUsageIllustrations.json";
import figma from "../generated/reviewedFigmaQuestionMedia.json";
import objects from "../generated/reviewedFigmaObjectScenes.json";
import generated from "../generated/reviewedGeneratedSceneMedia.json";
import corrections from "../content/sceneMediaCorrections.json";
import { resolveTeachingVisual } from "../content/teachingVisuals";

const sources = import.meta.glob<{ default: unknown }>("../data/usage/*.usage.json");
const combined = { ...vectors, ...figma.scenes, ...objects, ...generated };

describe("unit usage-media loading", () => {
  it("preserves the legacy result for every scene in every unit, including holds and corrections", async () => {
    for (const [path, load] of Object.entries(sources)) {
      const lessons = unitUsageDataSchema.parse((await load()).default);
      const before = structuredClone(lessons);
      const expected = lessons.map((lesson) => ({
        ...lesson,
        usage: {
          ...lesson.usage,
          scenes: lesson.usage.scenes.map((original) => {
            const media =
              combined[
                `${lesson.lessonId}-usage-scene-${original.chunkNumber}` as keyof typeof combined
              ];
            let scene = { ...original };
            if (
              media &&
              media.reviewedScenario === scene.scenario &&
              media.reviewedAnswer === scene.check.expectedAnswer &&
              (!("reviewedQuestion" in media) || media.reviewedQuestion === scene.check.question) &&
              (!("imagePurpose" in media) || media.imagePurpose === "word-reference")
            ) {
              scene = {
                ...scene,
                imagePath: media.imagePath,
                imageAlt: media.imageAlt,
                imagePurpose: "imagePurpose" in media ? ("word-reference" as const) : undefined,
                imageFallbacks: "imageFallbacks" in media ? media.imageFallbacks : undefined,
              };
            }
            const correction = corrections.find(
              (row) => row.sentence === scene.scenario && scene.imagePath?.endsWith(row.originalKey)
            );
            if (!correction) return scene;
            return correction.replacementKey
              ? {
                  ...scene,
                  imagePath: resolveTeachingVisual(correction.replacementKey),
                  reviewedOriginalImagePath: scene.imagePath,
                  imageReviewHold: undefined,
                  imageAlt: correction.imageAlt,
                  imageFallbacks: undefined,
                }
              : {
                  ...scene,
                  imagePath: undefined,
                  imageAlt: undefined,
                  imageFallbacks: undefined,
                  imageReviewHold: correction.reason,
                };
          }),
        },
      }));
      expect(await attachReviewedUsageIllustrations(lessons), path).toEqual(expected);
      expect(lessons, path).toEqual(before);
    }
  });

  it("handles mixed-unit callers independently and rejects unknown unit tables", async () => {
    const a = unitUsageDataSchema.parse(
      (await sources["../data/usage/numbers-counting.usage.json"]()).default
    );
    const b = unitUsageDataSchema.parse(
      (await sources["../data/usage/classroom.usage.json"]()).default
    );
    expect(await attachReviewedUsageIllustrations([...a, ...b])).toEqual([
      ...(await attachReviewedUsageIllustrations(a)),
      ...(await attachReviewedUsageIllustrations(b)),
    ]);
    await expect(
      attachReviewedUsageIllustrations([{ ...a[0], unitId: "unknown-unit" }])
    ).rejects.toThrow(/unavailable/);
    expect(await attachReviewedUsageIllustrations([])).toEqual([]);
  });
});
