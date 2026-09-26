import { memo } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { useModalA11y } from "./useModalA11y";
import { useI18n } from "../context/I18nContext";

import { Button } from "./Button";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ExitConfirmModal = memo(function ExitConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: Props) {
  const containerRef = useModalA11y({ isOpen, onDismiss: onCancel });
  const { t } = useI18n();

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
        <div
          className="size-14 rounded-2xl bg-wp-rose-light text-wp-rose border border-wp-rose/20 flex items-center justify-center"
          aria-hidden
        >
          <AlertTriangle className="size-7" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 id="exit-modal-title" className="font-sans font-black text-foreground text-xl">
            {t("lesson.quitTitle")}
          </h2>
          <p
            id="exit-modal-description"
            className="font-sans text-muted-foreground text-sm leading-relaxed"
          >
            {t("lesson.quitDescription")}
          </p>
        </div>

        <div className="flex flex-col w-full gap-2.5 mt-2">
          <Button type="button" variant="primary" size="lg" fullWidth onClick={onCancel}>
            {t("lesson.keepPracticing")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth
            onClick={onConfirm}
            className="hover:bg-wp-rose-light hover:text-wp-rose"
          >
            {t("lesson.leaveLesson")}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
});
