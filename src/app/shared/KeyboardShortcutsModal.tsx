import { memo } from "react";
import { createPortal } from "react-dom";
import { Keyboard, X } from "lucide-react";
import { useModalA11y } from "./useModalA11y";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: "1 – 4", description: "Select multiple-choice / flashcard option" },
  { key: "Space / R", description: "Replay audio pronunciation" },
  { key: "Enter", description: "Submit answer / continue to next step" },
  { key: "Esc", description: "Close dialogs or cancel current action" },
  { key: "?", description: "Toggle this keyboard shortcuts cheat-sheet" },
];

export const KeyboardShortcutsModal = memo(function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: Props) {
  const containerRef = useModalA11y({ isOpen, onDismiss: onClose });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
        tabIndex={-1}
        className="bg-wp-card border border-border rounded-3xl p-6 w-full max-w-md flex flex-col gap-5 shadow-2xl outline-none motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
              aria-hidden
            >
              <Keyboard className="size-5" />
            </div>
            <h2 id="shortcuts-modal-title" className="font-sans font-black text-foreground text-xl">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts modal"
            className="wp-touch-target size-11 min-h-[44px] min-w-[44px] rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary"
          >
            <X className="size-5" />
          </button>
        </div>

        <ul className="flex flex-col gap-2.5 divide-y divide-border/40">
          {SHORTCUTS.map(({ key, description }) => (
            <li key={key} className="flex items-center justify-between pt-2.5 first:pt-0">
              <span className="font-sans text-xs sm:text-sm text-foreground font-medium">
                {description}
              </span>
              <kbd className="px-2.5 py-1 bg-secondary text-primary font-mono text-xs font-bold rounded-lg border border-border/80 shadow-wp-xs">
                {key}
              </kbd>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-primary hover:opacity-90 active:opacity-80 rounded-xl py-3 font-sans font-bold text-primary-foreground text-sm min-h-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all shadow-sm"
        >
          Got it
        </button>
      </div>
    </div>,
    document.body
  );
});
