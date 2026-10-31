import type { UnitUsageData } from "./usageTypes";
import { createContentRequestCache } from "./contentRequestCache";
import corrections from "../content/sceneMediaCorrections.json";
import { resolveTeachingVisual } from "../content/teachingVisuals";

function correctScene(scene: UnitUsageData[number]["usage"]["scenes"][number]) {
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
}

/** Only content-hashed R2 images that passed media review and remote verification. */
type ReviewedSceneMedia = {
  reviewedScenario: string;
  reviewedAnswer: string;
  reviewedQuestion?: string;
  imagePath: string;
  imageAlt: string;
  imagePurpose?: unknown;
  imageFallbacks?: Array<{ imagePath: string; imageAlt: string }>;
};

type ReviewedUnitMedia = Readonly<Record<string, ReviewedSceneMedia>>;
const loaders = import.meta.glob<{ default: ReviewedUnitMedia }>(
  "../generated/usageMediaUnits/*.json"
);
const requestUnit = createContentRequestCache<string, ReviewedUnitMedia>();

/** A failed chunk must fail the content load, never silently remove imagery. */
export function loadReviewedUnitMedia(unitId: string): Promise<ReviewedUnitMedia> {
  return requestUnit(unitId, async () => {
    const loader = loaders[`../generated/usageMediaUnits/${unitId}.json`];
    if (!loader) throw Error(`Reviewed usage media unavailable for unit: ${unitId}`);
    return (await loader()).default;
  });
}

/** Fail closed if editorial changes make an illustration's visual evidence stale. */
export async function attachReviewedUsageIllustrations(
  lessons: UnitUsageData
): Promise<UnitUsageData> {
  const units = [...new Set(lessons.map((lesson) => lesson.unitId))];
  const reviewedMedia = new Map(
    await Promise.all(
      units.map(async (unitId) => [unitId, await loadReviewedUnitMedia(unitId)] as const)
    )
  );
  return lessons.map((lesson) => ({
    ...lesson,
    usage: {
      ...lesson.usage,
      scenes: lesson.usage.scenes.map((scene) => {
        const key = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
        const media = reviewedMedia.get(lesson.unitId)?.[key];
        if (
          !media ||
          media.reviewedScenario !== scene.scenario ||
          media.reviewedAnswer !== scene.check.expectedAnswer ||
          (media.reviewedQuestion !== undefined &&
            media.reviewedQuestion !== scene.check.question) ||
          (media.imagePurpose !== undefined && media.imagePurpose !== "word-reference")
        )
          return correctScene(scene);
        return correctScene({
          ...scene,
          imagePath: media.imagePath,
          imageAlt: media.imageAlt,
          imagePurpose: media.imagePurpose,
          imageFallbacks: media.imageFallbacks,
        });
      }),
    },
  }));
}
