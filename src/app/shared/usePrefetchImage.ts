import { useEffect } from "react";
import type { VocabularyItem } from "../data/lessons";
import { getWordImageSrc } from "./WordImage";

/**
 * Warms the browser's image cache for the word coming up next in a drill.
 *
 * Without this, each exercise step pays a cold fetch for its hero photo the
 * moment it mounts — the learner sees a blank image well while the network
 * catches up. The current question already has its own `<img>` loading
 * eagerly, so only the *next* word needs a background nudge here.
 */
export function usePrefetchImage(word: VocabularyItem | null | undefined, sizePreset: "thumb" | "card" | "hero" = "card") {
  useEffect(() => {
    if (!word) return;
    const img = new Image();
    img.src = getWordImageSrc(word, sizePreset);
  }, [word, sizePreset]);
}
