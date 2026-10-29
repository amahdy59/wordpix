import { useEffect } from "react";
import type { VocabularyItem } from "../data/lessons";
import { getWordImageSrc } from "./WordImage";

export function canPrefetchImages() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  return (
    navigator.onLine !== false &&
    !connection?.saveData &&
    !["slow-2g", "2g"].includes(connection?.effectiveType ?? "")
  );
}

/**
 * Warms the browser's image cache for the word coming up next in a drill.
 *
 * Without this, each exercise step pays a cold fetch for its hero photo the
 * moment it mounts — the learner sees a blank image well while the network
 * catches up. The current question already has its own `<img>` loading
 * eagerly, so only the *next* word needs a background nudge here.
 */
export function usePrefetchImage(
  word: VocabularyItem | null | undefined,
  sizePreset: "thumb" | "card" | "hero" = "card"
) {
  useEffect(() => {
    if (!word || !canPrefetchImages()) return;
    const img = new Image();
    img.fetchPriority = "low";
    img.src = getWordImageSrc(word, sizePreset);
  }, [word, sizePreset]);
}
