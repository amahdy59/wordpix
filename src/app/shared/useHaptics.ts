import { useCallback } from "react";

/**
 * Provides an easy interface for haptic feedback using the navigator.vibrate API
 * It fails silently on devices that do not support it (e.g. iOS Safari)
 */
export function useHaptics() {
  const vibrate = useCallback((pattern: number | number[]) => {
    // Only attempt to vibrate if the API is available
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {
        // Ignore errors
      }
    }
  }, []);

  const triggerSuccess = useCallback(() => {
    // Light double tap
    vibrate([30, 50, 30]);
  }, [vibrate]);

  const triggerError = useCallback(() => {
    // Heavy triple pulse
    vibrate([50, 100, 50, 100, 50]);
  }, [vibrate]);

  const triggerTap = useCallback(() => {
    // Single light tap
    vibrate(20);
  }, [vibrate]);

  const triggerCompletion = useCallback(() => {
    // Long success sequence
    vibrate([50, 100, 50, 100, 50, 100, 200]);
  }, [vibrate]);

  return {
    vibrate,
    triggerSuccess,
    triggerError,
    triggerTap,
    triggerCompletion,
  };
}
