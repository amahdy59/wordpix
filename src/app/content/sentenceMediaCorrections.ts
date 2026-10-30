import corrections from "./sentenceMediaCorrections.json";
import circle from "./visuals/circle.svg?url";
import square from "./visuals/square.svg?url";
import triangle from "./visuals/triangle.svg?url";
import rectangle from "./visuals/rectangle.svg?url";
import oval from "./visuals/oval.svg?url";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";

const drawings: Readonly<Record<string, string>> = { circle, square, triangle, rectangle, oval };
const key = (url: string) =>
  url
    .replace(/^https:\/\/pub-e84a3f9882a141ac9f33296bbad85e2a\.r2\.dev\//, "")
    .replace(/^\.?\//, "");

/** Corrections require the exact text and original image; historical R2 mappings remain read-only. */
export function applySentenceMediaCorrection(
  wordId: string,
  sentence: string,
  original: PilotSentenceMedia
): PilotSentenceMedia | undefined {
  const correction = corrections.find(
    (row) =>
      row.wordId === wordId &&
      row.sentence === sentence &&
      row.originalKey === key(original.imagePath)
  );
  if (!correction) return original;
  if (!correction.replacementKey) return undefined;
  return {
    imagePath: drawings[correction.replacementKey] ?? correction.replacementKey,
    imageAlt: correction.imageAlt,
  };
}
