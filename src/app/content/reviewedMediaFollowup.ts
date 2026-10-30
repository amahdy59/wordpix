import approved from "../generated/reviewedMediaFollowup.json";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";

/** User-approved exact contexts only; existing objects remain unchanged. */
export function applyReviewedMediaFollowup(
  wordId: string,
  sentence: string,
  original: PilotSentenceMedia
): PilotSentenceMedia {
  const review = approved.find((item) => item.wordId === wordId && item.sentence === sentence);
  if (!review) return original;
  const key = (url: string) =>
    url
      .replace(/^https:\/\/pub-e84a3f9882a141ac9f33296bbad85e2a\.r2\.dev\//, "")
      .replace(/^\.?\//, "");
  if (key(original.imagePath) !== key(review.originalUrl)) return original;
  return {
    ...original,
    imagePath: review.imagePath,
    imageAlt: review.imageAlt,
    // Incorrect old action art remains archived, not a semantic fallback.
    ...(review.responsiveSources
      ? { responsiveSources: review.responsiveSources }
      : { imageFallbacks: undefined }),
  };
}
