import { useEffect, useRef } from "react";
import { resolveUnitForLesson, getNextGroupChronological } from "../data/courseCatalog";
import { getWords, loadUnitVocabulary } from "../data/vocabulary";
import { preloadAudioClip } from "./useAudio";
import { getCurriculumAudioKey } from "../learning/shared/curriculumAudioManifest";
import { getWordImageSrc } from "./WordImage";

// Track preloaded lesson IDs across the application lifecycle so we never redundantly preload.
const preloadedLessonIds = new Set<string>();

/**
 * Predictively warms the browser cache with audio and image assets
 * for the chronologically next group when approaching the end of the current lesson (step >= 3).
 *
 * Honors `Save-Data` preference to respect learner bandwidth budgets.
 */
export function usePredictiveLessonPreload(lessonId: string | undefined, step: number): void {
  const preloadedRef = useRef(false);

  useEffect(() => {
    // Only preload towards the later stages of a lesson (e.g. step 3+ out of 6)
    if (!lessonId || step < 3 || preloadedRef.current || preloadedLessonIds.has(lessonId)) {
      return;
    }

    // Bandwidth protection: skip preloading if the learner has Save-Data enabled
    if (
      typeof navigator !== "undefined" &&
      "connection" in navigator &&
      Boolean((navigator as { connection?: { saveData?: boolean } }).connection?.saveData)
    ) {
      return;
    }

    let isCancelled = false;

    const performPreload = async () => {
      try {
        const nextGroup = getNextGroupChronological(lessonId);
        if (
          !nextGroup ||
          nextGroup.id === lessonId ||
          !nextGroup.wordIds ||
          nextGroup.wordIds.length === 0
        ) {
          return;
        }

        const unit = resolveUnitForLesson(nextGroup.id);
        if (!unit) return;

        // Ensure vocabulary for the unit is loaded asynchronously
        await loadUnitVocabulary(unit.id);
        if (isCancelled) return;

        const words = getWords(nextGroup.wordIds, unit.id);
        if (words.length === 0) return;

        // Mark as preloaded
        preloadedRef.current = true;
        preloadedLessonIds.add(lessonId);

        // Warm up hero & card images
        for (const word of words) {
          if (isCancelled) break;
          const heroUrl = getWordImageSrc(word, "hero");
          if (heroUrl) {
            const img = new Image();
            img.src = heroUrl;
          }

          // Warm up primary curriculum audio
          const audioKey = getCurriculumAudioKey(word.label);
          if (audioKey) {
            preloadAudioClip(audioKey);
          }
        }
      } catch {
        // Preloading is strictly best-effort and non-fatal; swallow errors
      }
    };

    if (
      typeof window !== "undefined" &&
      "requestIdleCallback" in window &&
      typeof (window as unknown as { requestIdleCallback?: unknown }).requestIdleCallback ===
        "function"
    ) {
      const idleWindow = window as Window & {
        requestIdleCallback: (cb: () => void, options?: { timeout: number }) => number;
        cancelIdleCallback: (id: number) => void;
      };
      const handle = idleWindow.requestIdleCallback(performPreload, { timeout: 2000 });
      return () => {
        isCancelled = true;
        idleWindow.cancelIdleCallback(handle);
      };
    } else {
      const timer = setTimeout(performPreload, 250);
      return () => {
        isCancelled = true;
        clearTimeout(timer);
      };
    }
  }, [lessonId, step]);
}
