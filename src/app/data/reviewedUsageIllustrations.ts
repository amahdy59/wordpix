import mediaManifest from "../generated/reviewedUsageIllustrations.json";
import figmaManifest from "../generated/reviewedFigmaQuestionMedia.json";
import objectManifest from "../generated/reviewedFigmaObjectScenes.json";
import type { UnitUsageData } from "./usageTypes";

/** Only content-hashed R2 images that passed media review and remote verification. */
type ReviewedSceneMedia = {
  reviewedScenario: string;
  reviewedAnswer: string;
  imagePath: string;
  imageAlt: string;
  imageFallbacks?: Array<{ imagePath: string; imageAlt: string }>;
};

const reviewedMedia: Readonly<Record<string, ReviewedSceneMedia>> = {
  ...mediaManifest,
  ...figmaManifest.scenes,
  ...objectManifest,
};

/** Fail closed if editorial changes make an illustration's visual evidence stale. */
export function attachReviewedUsageIllustrations(lessons: UnitUsageData): UnitUsageData {
  return lessons.map((lesson) => ({
    ...lesson,
    usage: {
      ...lesson.usage,
      scenes: lesson.usage.scenes.map((scene) => {
        const key = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
        const media = reviewedMedia[key];
        if (
          !media ||
          media.reviewedScenario !== scene.scenario ||
          media.reviewedAnswer !== scene.check.expectedAnswer
        )
          return scene;
        return {
          ...scene,
          imagePath: media.imagePath,
          imageAlt: media.imageAlt,
          imageFallbacks: media.imageFallbacks,
        };
      }),
    },
  }));
}
