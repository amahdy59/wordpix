import type { LessonUsageData } from "../data/usageTypes";
import { getAuthoredSentence } from "../exercises/content/authoredLessonContent";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";
import { getExactSentenceMedia } from "./sentenceMediaStore";
import { applyReviewedMediaFollowup } from "./reviewedMediaFollowup";

/** A word ID alone cannot establish that an image supports a sentence. */
export function resolveSentenceMedia(
  wordId: string,
  sentence: string,
  usage?: LessonUsageData | null
): PilotSentenceMedia | undefined {
  const exact = getExactSentenceMedia(wordId, sentence);
  if (exact)
    return applyReviewedMediaFollowup(wordId, sentence, {
      imagePath: exact.imagePath,
      imageAlt: exact.imageAlt,
      ...(exact.imageFallbacks ? { imageFallbacks: exact.imageFallbacks } : {}),
    });
  const authored = getAuthoredSentence(wordId);
  if (authored?.full === sentence && authored.media) return authored.media;
  const scene = usage?.usage.scenes.find(
    (candidate) =>
      candidate.imagePath &&
      candidate.imageAlt &&
      candidate.imagePurpose !== "word-reference" &&
      (candidate.scenario.includes(sentence) ||
        Boolean(candidate.learningContext?.scenario?.includes(sentence)))
  );
  return scene?.imagePath && scene.imageAlt
    ? { imagePath: scene.imagePath, imageAlt: scene.imageAlt, imageFallbacks: scene.imageFallbacks }
    : undefined;
}
