import { memo } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { useModalA11y } from "./useModalA11y";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ExitConfirmModal = memo(function ExitConfirmModal({ isOpen, onCancel, onConfirm }: Props) {
  const containerRef = useModalA11y({ isOpen, onDismiss: onCancel });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={containerRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="exit-modal-title"
        aria-describedby="exit-modal-description"
        tabIndex={-1}
        className="bg-wp-card border border-border rounded-3xl p-6 w-full max-w-sm flex flex-col items-center gap-4 text-center shadow-2xl outline-none motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200"
      >
        <div className="size-14 rounded-2xl bg-wp-rose-light text-wp-rose border border-wp-rose/20 flex items-center justify-center" aria-hidden>
          <AlertTriangle className="size-7" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 id="exit-modal-title" className="font-sans font-black text-foreground text-xl">
            Quit Lesson Session?
          </h2>
          <p id="exit-modal-description" className="font-sans text-muted-foreground text-sm leading-relaxed">
            Your progress on the current batch of words will not be saved.
          </p>
        </div>

        <div className="flex flex-col w-full gap-2.5 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-primary hover:opacity-90 active:opacity-80 rounded-xl py-3.5 font-sans font-bold text-primary-foreground text-base min-h-[48px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all shadow-sm"
          >
            Keep Practicing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-muted hover:bg-wp-rose-light hover:text-wp-rose text-muted-foreground rounded-xl py-3 font-sans font-semibold text-sm min-h-[44px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary transition-colors"
          >
            Leave Lesson
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});
