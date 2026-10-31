import corrections from "./sentenceMediaCorrections.json";
import { resolveTeachingVisual } from "./teachingVisuals";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";

const key = (url: string) =>
  url
    .replace(/^https:\/\/pub-e84a3f9882a141ac9f33296bbad85e2a\.r2\.dev\//, "")
    .replace(/^\.?\//, "");

/** Corrections require the exact text and original image; historical R2 mappings remain read-only. */
export function applySentenceMediaCorrection(
  wordId: string,
  sentence: string,
  original: PilotSentenceMedia,
  originalReference?: string
): PilotSentenceMedia | undefined {
  const correction = corrections.find(
    (row) =>
      row.wordId === wordId &&
      row.sentence === sentence &&
      row.originalKey === key(originalReference ?? original.imagePath)
  );
  if (!correction) return original;
  if (!correction.replacementKey) return undefined;
  return {
    imagePath: resolveTeachingVisual(correction.replacementKey),
    imageAlt: correction.imageAlt,
  };
}
