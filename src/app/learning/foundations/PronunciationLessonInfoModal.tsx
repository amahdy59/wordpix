import { useEffect, useRef } from "react";
import { Headphones, Volume2, X, Sparkles } from "lucide-react";
import { useI18n } from "../../../i18n";
import {
  getFigmaPronunciationActivityData,
  getPronunciationChapter,
} from "./figmaPronunciationCatalog";

interface PronunciationLessonInfoModalProps {
  lessonNumber: number | null;
  onClose: () => void;
  onStartLesson: (lessonNumber: number) => void;
}

export function PronunciationLessonInfoModal({
  lessonNumber,
  onClose,
  onStartLesson,
}: PronunciationLessonInfoModalProps) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (lessonNumber === null) return;

    // Focus close button on open
    closeButtonRef.current?.focus();

    // Trap Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lessonNumber, onClose]);

  if (lessonNumber === null) return null;

  const activity = getFigmaPronunciationActivityData(lessonNumber);
  const chapter = getPronunciationChapter(lessonNumber);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pronunciation-modal-title"
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-wp-lg"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border/60 p-5 sm:p-6">
          <div className="min-w-0 pe-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-black uppercase text-primary">
              <Volume2 className="size-3.5" aria-hidden />
              {t("pronunciation.badge", { current: lessonNumber, total: 68 })}
            </span>
            <h2
              id="pronunciation-modal-title"
              className="mt-2 text-xl font-black text-foreground"
              lang="en"
              dir="ltr"
            >
              {activity.title}
            </h2>
            <p className="mt-0.5 text-xs font-bold text-muted-foreground">{t(chapter.titleKey)}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t("pronunciation.modalClose") || "Close"}
            className="flex size-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6 overscroll-contain">
          {/* Pedagogical Objective (Preserved in full!) */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              {t("pronunciation.modalObjective") || "Learning Objective"}
            </h3>
            <p
              className="mt-1.5 text-sm font-medium leading-relaxed text-foreground"
              lang="en"
              dir="ltr"
            >
              {activity.objective}
            </p>
          </div>

          {/* Articulation Guidance Callout */}
          {activity.articulationCues.length > 0 && (
            <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
                <Sparkles className="size-4" aria-hidden />
                <span>
                  {t("pronunciation.modalArticulation") || "Mouth & Articulation Guidance"}
                </span>
              </div>
              <ul
                className="mt-2 space-y-1.5 text-sm font-medium text-foreground"
                lang="en"
                dir="ltr"
              >
                {activity.articulationCues.map((cue, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Minimal Pairs Bank */}
          {activity.contrastPairs.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                {t("pronunciation.modalContrasts") || "Target Sound Contrasts"}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2" lang="en" dir="ltr">
                {activity.contrastPairs.map(([first, second], idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-bold text-foreground"
                  >
                    <span>{first}</span>
                    <span className="text-muted-foreground/60">/</span>
                    <span>{second}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/20 p-4 sm:flex-row sm:justify-end sm:p-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("pronunciation.modalClose") || "Close"}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartLesson(lessonNumber);
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-wp-xs hover:opacity-90 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Headphones className="size-4" aria-hidden />
            <span>
              {t("pronunciation.modalStartLesson", { number: lessonNumber }) ||
                `Start Lesson ${lessonNumber}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
