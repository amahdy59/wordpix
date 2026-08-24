import { useEffect, useRef } from "react";

const TEXT_ENTRY_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** True when the user is typing, so number keys must stay literal characters. */
function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return TEXT_ENTRY_TAGS.has(target.tagName) || target.isContentEditable;
}

/** True when the key press is part of a browser/OS shortcut such as Cmd+1. */
function hasModifier(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.altKey;
}

interface Options {
  /** Number of numbered options currently on screen (1-9). */
  optionCount: number;
  /** Called with the 0-based index when the learner presses its number key. */
  onSelectIndex: (index: number) => void;
  /** Optional replay-audio action, bound to R and to Space when nothing is focused. */
  onReplayAudio?: () => void;
  /** Optional action to toggle keyboard shortcuts cheatsheet modal (?) */
  onToggleHelp?: () => void;
  /** Suspend all hotkeys, e.g. while a modal owns the keyboard. */
  disabled?: boolean;
}

/**
 * Number-key shortcuts for exercise option grids.
 *
 * Deliberately does NOT claim Space from a focused control: Space is the
 * standard activation key for a button, so preventDefault-ing it globally means
 * a keyboard user who tabs to an option and presses Space triggers audio replay
 * instead of choosing that option. Space is only treated as "replay" when focus
 * is on the page body; R always works.
 */
export function useExerciseHotkeys({
  optionCount,
  onSelectIndex,
  onReplayAudio,
  onToggleHelp,
  disabled = false,
}: Options) {
  // Held in refs so re-created callbacks do not detach and re-attach the
  // listener on every render.
  const handlers = useRef({ onSelectIndex, onReplayAudio, onToggleHelp, optionCount });
  useEffect(() => {
    handlers.current = { onSelectIndex, onReplayAudio, onToggleHelp, optionCount };
  }, [onSelectIndex, onReplayAudio, onToggleHelp, optionCount]);

  useEffect(() => {
    if (disabled) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || hasModifier(event) || isTextEntryTarget(event.target)) return;

      const {
        onSelectIndex: select,
        onReplayAudio: replay,
        onToggleHelp: toggleHelp,
        optionCount: count,
      } = handlers.current;

      if (toggleHelp && (event.key === "?" || (event.shiftKey && event.key === "/"))) {
        event.preventDefault();
        toggleHelp();
        return;
      }

      if (replay) {
        const focusIsOnAControl =
          document.activeElement instanceof HTMLElement && document.activeElement !== document.body;

        if (event.key.toLowerCase() === "r" || (event.code === "Space" && !focusIsOnAControl)) {
          event.preventDefault();
          replay();
          return;
        }
      }

      if (!/^[1-9]$/.test(event.key)) return;
      const index = Number(event.key) - 1;
      if (index < count) {
        event.preventDefault();
        select(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled]);
}
