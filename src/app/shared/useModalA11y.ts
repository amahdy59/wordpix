import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Number of modals currently open. Tracked so a nested dialog closing does not
 * prematurely restore the background for the dialog still on screen.
 */
let openModalCount = 0;

function setBackgroundInert(inert: boolean) {
  const root = document.getElementById("root");
  if (!root) return;
  if (inert) root.setAttribute("inert", "");
  else root.removeAttribute("inert");
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

interface Options {
  isOpen: boolean;
  /** Called on Escape. Omit for dialogs that must not be dismissible. */
  onDismiss?: () => void;
}

/**
 * Accessible dialog behaviour, per WAI-ARIA APG:
 * moves focus in on open, traps Tab inside, closes on Escape, marks the rest of
 * the app inert, and returns focus to the invoking element on close.
 *
 * Returns a ref to attach to the dialog container.
 */
export function useModalA11y({ isOpen, onDismiss }: Options) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const dismissRef = useRef(onDismiss);

  // Keep the latest handler without re-running the effect (and thus re-stealing
  // focus) every time the parent re-renders with a new closure.
  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      dismissRef.current?.();
      return;
    }

    if (event.key !== "Tab") return;

    const container = containerRef.current;
    if (!container) return;

    const focusable = getFocusable(container);
    if (focusable.length === 0) {
      event.preventDefault();
      container.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !container.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    openModalCount += 1;
    setBackgroundInert(true);

    // Focus after paint so the container has rendered its children.
    const frame = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const focusable = getFocusable(container);
      (focusable[0] ?? container).focus();
    });

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown, true);

      openModalCount = Math.max(0, openModalCount - 1);
      if (openModalCount === 0) setBackgroundInert(false);

      // Restore focus to whatever opened the dialog, if it is still around.
      const toRestore = restoreFocusRef.current;
      if (toRestore && document.contains(toRestore)) {
        toRestore.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  return containerRef;
}
