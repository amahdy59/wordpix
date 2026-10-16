/**
 * Safe haptic feedback utility for mobile touch interactions.
 * Respects user preferences (reduced motion, silent/accessibility)
 * and safely no-ops on unsupported environments (desktop, iOS without WebKit haptics, etc.).
 */

export type HapticStyle = "selection" | "light" | "medium" | "success" | "error";

export function triggerHaptic(style: HapticStyle = "light"): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  // Never trigger if user prefers reduced motion
  try {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
  } catch {
    // Ignore query failure on legacy environments
  }

  if (typeof navigator.vibrate !== "function") return;

  try {
    switch (style) {
      case "selection":
        navigator.vibrate(8);
        break;
      case "light":
        navigator.vibrate(12);
        break;
      case "medium":
        navigator.vibrate(20);
        break;
      case "success":
        navigator.vibrate([10, 30, 15]);
        break;
      case "error":
        navigator.vibrate([20, 40, 20]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch {
    // Vibration failed or was blocked by browser security policy
  }
}
