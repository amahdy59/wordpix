import type { LessonUsageData } from "../data/usageTypes";
import { getAuthoredSentence } from "../exercises/content/authoredLessonContent";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";
import runtime from "../generated/sentenceMediaRuntime.json";

const exactImages = new Map<string, PilotSentenceMedia>();
for (const row of runtime.rows) {
  const [wordId, sentence, imagePath, imageAlt, ...fallbacks] = row.map(
    (index) => runtime.strings[index]
  );
  const imageFallbacks = [];
  for (let index = 0; index < fallbacks.length; index += 2)
    imageFallbacks.push({ imagePath: fallbacks[index], imageAlt: fallbacks[index + 1] });
  exactImages.set(`${wordId}\0${sentence}`, {
    imagePath,
    imageAlt,
    ...(imageFallbacks.length ? { imageFallbacks } : {}),
  });
}

/** A word ID alone cannot establish that an image supports a sentence. */
export function resolveSentenceMedia(
  wordId: string,
  sentence: string,
  usage?: LessonUsageData | null
): PilotSentenceMedia | undefined {
  const exact = exactImages.get(`${wordId}\0${sentence}`);
  if (exact)
    return {
      imagePath: exact.imagePath,
      imageAlt: exact.imageAlt,
      ...(exact.imageFallbacks ? { imageFallbacks: exact.imageFallbacks } : {}),
    };
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
