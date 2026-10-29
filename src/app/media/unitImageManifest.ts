import { COURSE_UNITS } from "../data/courseCatalog";
import { loadUnitVocabulary } from "../data/vocabulary";
import { loadLessonUsage } from "../data/usageRegistry";
import { getRichSentence } from "../exercises/exerciseContent";
import { getAuthoredLessonContent } from "../exercises/content/authoredLessonContent";
import { resolveSentenceMedia } from "../content/sentenceMedia";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { imagePackManifestSchema, type ImagePackManifest } from "./offlineImagePacks";

/** Uses the real runtime selectors. Never guesses an R2 key or approves an image. */
export async function getUnitImageManifest(unitId: string): Promise<ImagePackManifest> {
  const unit = COURSE_UNITS[unitId];
  if (!unit) throw Error("Unknown unit");
  const words = await loadUnitVocabulary(unitId);
  const byId = new Map(words.map((word) => [word.id, word]));
  const paths = new Set(words.map((word) => word.img).filter(Boolean));
  const add = (
    media?: { imagePath?: string; imageFallbacks?: ReadonlyArray<{ imagePath: string }> } | null
  ) => {
    if (media?.imagePath) paths.add(media.imagePath);
    // A saved primary already satisfies this media use offline. Optional
    // alternatives must not inflate storage or block an otherwise complete pack.
  };
  for (const group of unit.groups) {
    const usage = await loadLessonUsage(group.id);
    for (const wordId of group.wordIds) {
      const word = byId.get(wordId);
      if (!word) throw Error("Incomplete unit vocabulary");
      for (const variant of [0, 1])
        add(resolveSentenceMedia(wordId, getRichSentence(word, usage, variant).full, usage));
    }
    usage?.usage.scenes.forEach(add);
    usage?.usage.phrases?.forEach(add);
    getAuthoredLessonContent(group.id)?.clusters.forEach((cluster) =>
      add(cluster.microReading.media)
    );
  }
  return imagePackManifestSchema.parse({
    unitId,
    urls: [
      ...new Set([...paths].map((path) => new URL(resolveAssetUrl(path), location.href).href)),
    ].sort(),
  });
}
