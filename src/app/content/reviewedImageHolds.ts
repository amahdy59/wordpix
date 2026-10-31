import holds from "./reviewedImageHolds.json";
import { resolveAssetUrl } from "../../utils/assetUrl";

function sourceKey(path: string): string {
  return resolveAssetUrl(path)
    .replace(/^https:\/\/pub-e84a3f9882a141ac9f33296bbad85e2a\.r2\.dev\//, "")
    .replace(/^\/wordpix\//, "")
    .replace(/^\.?\//, "");
}

const byContext = new Map<string, typeof holds>();
for (const row of holds) {
  const key = JSON.stringify([row.kind, row.wordId, row.text]);
  byContext.set(key, [...(byContext.get(key) ?? []), row]);
}

/** Display-only holds are pinned to the text, source object and lesson context. */
export function isReviewedImageHeld(
  kind: "sentence" | "usage-scene",
  wordId: string,
  text: string,
  imagePath: string | undefined,
  lessonId?: string
): boolean {
  if (!imagePath) return false;
  return (byContext.get(JSON.stringify([kind, wordId, text])) ?? []).some(
    (row) => (!lessonId || row.lessonId === lessonId) && row.sourceKey === sourceKey(imagePath)
  );
}
