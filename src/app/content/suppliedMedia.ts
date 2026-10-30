import manifest from "../generated/suppliedMedia.json";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";
import type { LessonUsageData } from "../data/usageTypes";

interface SuppliedBinding {
  kind: string;
  lessonId: string;
  wordId: string;
  text: string;
  expectedSourceKey: string | null;
  imagePath: string;
  imageAlt: string;
  responsiveSources: Array<{ url: string; width: number }>;
}
const bindings: readonly SuppliedBinding[] = manifest;
const key = (value: string | null) =>
  value
    ?.replace(/^https:\/\/pub-e84a3f9882a141ac9f33296bbad85e2a\.r2\.dev\//, "")
    .replace(/^\.?\//, "") ?? null;
const media = (row: SuppliedBinding): PilotSentenceMedia => ({
  imagePath: row.imagePath,
  imageAlt: row.imageAlt,
  responsiveSources: row.responsiveSources,
  imagePurpose: "word-reference",
  fallbackToVocabulary: false,
});

/** Exact context and retained source identity; no historic R2 mapping is edited. */
export function applySuppliedSentenceMedia(
  wordId: string,
  sentence: string,
  original: PilotSentenceMedia | undefined,
  sourceKey: string | null,
  lessonId?: string
): PilotSentenceMedia | undefined {
  const row = bindings.find(
    (item) =>
      item.kind === "sentence" &&
      item.wordId === wordId &&
      item.text === sentence &&
      key(item.expectedSourceKey) === key(sourceKey) &&
      (lessonId ? item.lessonId === lessonId : sourceKey !== null)
  );
  return row ? media(row) : original;
}

/** Story-only display overlay keeps sentence selection and recorded text stable. */
export function getSuppliedSceneMedia(
  lessonId: string,
  scene: LessonUsageData["usage"]["scenes"][number]
): PilotSentenceMedia | undefined {
  const source = scene.reviewedOriginalImagePath ?? scene.imagePath ?? null;
  const row = bindings.find(
    (item) =>
      item.kind === "scene" &&
      item.lessonId === lessonId &&
      item.wordId === `scene-${scene.chunkNumber}` &&
      item.text === scene.scenario &&
      key(item.expectedSourceKey) === key(source)
  );
  return row ? media(row) : undefined;
}
