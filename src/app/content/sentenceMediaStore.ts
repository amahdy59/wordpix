import { createContentRequestCache } from "../data/contentRequestCache";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";

interface SentenceMediaTable {
  strings: string[];
  rows: number[][];
}

const loaders = import.meta.glob<{ default: SentenceMediaTable }>(
  "../generated/sentenceMediaUnits/*.json"
);
const requestUnit = createContentRequestCache<string, void>();
const loadedUnits = new Set<string>();
const exactImages = new Map<string, PilotSentenceMedia>();

export function isUnitSentenceMediaLoaded(unitId: string): boolean {
  return loadedUnits.has(unitId);
}

/** Prepare at the vocabulary boundary so sentence selection stays synchronous. */
export function loadUnitSentenceMedia(unitId: string): Promise<void> {
  return requestUnit(unitId, async () => {
    const loader = loaders[`../generated/sentenceMediaUnits/${unitId}.json`];
    if (!loader) throw Error(`Sentence media unavailable for unit: ${unitId}`);
    const { default: runtime } = await loader();
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
    loadedUnits.add(unitId);
  });
}

export function getExactSentenceMedia(wordId: string, sentence: string) {
  return exactImages.get(`${wordId}\0${sentence}`);
}
