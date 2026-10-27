import type { LessonUsageData } from "../data/usageTypes";
import { getAuthoredSentence } from "../exercises/content/authoredLessonContent";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";
import exactSentenceMedia from "../generated/reviewedExactSentenceMedia.json";

const exactImages = new Map<string, PilotSentenceMedia>();
for (const entry of Object.values(exactSentenceMedia)) {
  const key = `${entry.wordId}\0${entry.sentence}`;
  // Preserve the registry's first-match precedence, including duplicate rows.
  if (!exactImages.has(key)) exactImages.set(key, entry);
}

/** A word ID alone cannot establish that an image supports a sentence. */
export function resolveSentenceMedia(
  wordId: string,
  sentence: string,
  usage?: LessonUsageData | null
): PilotSentenceMedia | undefined {
  const exact = exactImages.get(`${wordId}\0${sentence}`);
  if (exact) return { imagePath: exact.imagePath, imageAlt: exact.imageAlt };
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
