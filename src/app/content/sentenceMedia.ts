import type { LessonUsageData } from "../data/usageTypes";
import { getAuthoredSentence } from "../exercises/content/authoredLessonContent";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";
import { getExactSentenceMedia } from "./sentenceMediaStore";
import { applyReviewedMediaFollowup } from "./reviewedMediaFollowup";
import { applySentenceMediaCorrection } from "./sentenceMediaCorrections";
import { applySuppliedSentenceMedia } from "./suppliedMedia";
import { isReviewedImageHeld } from "./reviewedImageHolds";

/** Holding an incorrect picture must not change an existing spoken exercise. */
export function hasSentenceMediaCandidate(
  wordId: string,
  sentence: string,
  usage?: LessonUsageData | null
): boolean {
  return Boolean(
    getExactSentenceMedia(wordId, sentence) || resolveOriginalSentenceMedia(wordId, sentence, usage)
  );
}

/** A word ID alone cannot establish that an image supports a sentence. */
export function resolveSentenceMedia(
  wordId: string,
  sentence: string,
  usage?: LessonUsageData | null
): PilotSentenceMedia | undefined {
  const original = resolveOriginalSentenceMedia(wordId, sentence, usage);
  const scene = usage?.usage.scenes.find(
    (candidate) =>
      candidate.imagePath &&
      candidate.imageAlt &&
      candidate.imagePurpose !== "word-reference" &&
      (candidate.scenario.includes(sentence) ||
        candidate.learningContext?.scenario?.includes(sentence))
  );
  const sourceKey =
    getExactSentenceMedia(wordId, sentence)?.imagePath ??
    scene?.reviewedOriginalImagePath ??
    scene?.imagePath ??
    null;
  const selected = applySuppliedSentenceMedia(
    wordId,
    sentence,
    original,
    sourceKey,
    usage?.lessonId
  );
  return isReviewedImageHeld("sentence", wordId, sentence, selected?.imagePath, usage?.lessonId)
    ? undefined
    : selected;
}

function resolveOriginalSentenceMedia(
  wordId: string,
  sentence: string,
  usage?: LessonUsageData | null
): PilotSentenceMedia | undefined {
  const exact = getExactSentenceMedia(wordId, sentence);
  if (exact)
    return applySentenceMediaCorrection(
      wordId,
      sentence,
      applyReviewedMediaFollowup(wordId, sentence, {
        imagePath: exact.imagePath,
        imageAlt: exact.imageAlt,
        ...(exact.imageFallbacks ? { imageFallbacks: exact.imageFallbacks } : {}),
      })
    );
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
    ? applySentenceMediaCorrection(
        wordId,
        sentence,
        {
          imagePath: scene.imagePath,
          imageAlt: scene.imageAlt,
          imageFallbacks: scene.imageFallbacks,
        },
        scene.reviewedOriginalImagePath
      )
    : undefined;
}
