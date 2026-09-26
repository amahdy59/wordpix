import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Volume2, Image as ImageIcon } from "lucide-react";
import { useI18n } from "../../i18n";
import { useModalA11y } from "./useModalA11y";
import { useAudio } from "./useAudio";
import { getCurriculumAudioKey } from "../learning/shared/curriculumAudioManifest";
import type { VocabularyTableItem } from "./CurriculumVocabularyTable";

interface Props {
  item: VocabularyTableItem | null;
  isOpen: boolean;
  onClose: () => void;
  showArabic?: boolean;
}

export const VocabularyDetailModal = memo(function VocabularyDetailModal({
  item,
  isOpen,
  onClose,
  showArabic = true,
}: Props) {
  const { t } = useI18n();
  const [imgError, setImgError] = useState(false);

  const containerRef = useModalA11y({
    isOpen: Boolean(isOpen && item),
    onDismiss: onClose,
  });

  const audio = useAudio({ lang: "en-US", rate: 0.9, preferLocal: true });

  if (!isOpen || !item || typeof document === "undefined") {
    return null;
  }

  const handlePlayAudio = () => {
    if (!audio.isSupported) return;
    const manifestKey = getCurriculumAudioKey(item.term) ?? undefined;
    audio.speak(item.term, undefined, manifestKey);
  };

  const hasArabic =
    showArabic && (Boolean(item.termAr) || Boolean(item.definitionAr) || Boolean(item.exampleAr));

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="presentation"
    >
      {/* Backdrop dismiss */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vocab-detail-modal-term"
        tabIndex={-1}
        className="relative w-full max-w-lg overflow-hidden rounded-t-[28px] sm:rounded-3xl border border-border bg-card shadow-wp-xl z-10 flex flex-col max-h-[92dvh] sm:max-h-[88dvh] animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("action.close") || "Close dialog"}
          className="absolute top-3 end-3 sm:top-4 sm:end-4 z-20 flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white cursor-pointer"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {/* Top Visual Banner: Image or Gradient Card */}
        <div className="relative h-48 sm:h-56 w-full bg-muted/70 overflow-hidden shrink-0">
          {item.imageSrc && !imgError ? (
            <img
              src={item.imageSrc}
              alt=""
              aria-hidden="true"
              onError={() => setImgError(true)}
              className="size-full object-cover object-center"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/5 to-muted text-muted-foreground/60">
              <ImageIcon className="size-16" aria-hidden="true" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-black/25" />

          {/* Banner Word Tag & Title */}
          <div className="absolute bottom-3 start-4 end-4 sm:bottom-4 sm:start-6 sm:end-6 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              {item.type && (
                <span className="inline-block rounded-md bg-primary/25 text-foreground text-xs font-black uppercase tracking-wider px-2.5 py-0.5 mb-1.5 backdrop-blur-sm border border-primary/40 shadow-xs">
                  {item.type}
                </span>
              )}
              <h2
                id="vocab-detail-modal-term"
                className="text-2xl sm:text-3xl font-black text-foreground drop-shadow-sm tracking-tight break-words"
                lang="en"
              >
                {item.term}
              </h2>
              {hasArabic && item.termAr && (
                <p
                  dir="rtl"
                  lang="ar"
                  className="mt-0.5 font-arabic text-base font-bold text-primary"
                >
                  {item.termAr}
                </p>
              )}
            </div>

            {/* Pronounce Audio Button */}
            {audio.isSupported && (
              <button
                type="button"
                onClick={handlePlayAudio}
                aria-label={
                  t("vocabulary.playPronunciation", { term: item.term }) || `Listen to ${item.term}`
                }
                disabled={audio.status === "loading"}
                className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-2xl font-black text-xs sm:text-sm shadow-wp-md transition-all active:scale-95 cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  audio.isPlaying
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : "bg-primary text-primary-foreground hover:brightness-105"
                }`}
              >
                <Volume2 className="size-4.5" aria-hidden="true" />
                <span>
                  {audio.isPlaying
                    ? t("action.playing") || "Playing..."
                    : t("action.listen") || "Listen"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body: Definition and Context */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto overscroll-contain">
          {/* Definition */}
          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <span className="text-xs font-black uppercase tracking-wider text-primary block mb-1.5">
              {t("vocabulary.definitionHeader") || "Definition"}
            </span>
            <p className="text-base font-medium leading-relaxed text-foreground" lang="en">
              {item.definition}
            </p>
            {hasArabic && item.definitionAr && (
              <p
                dir="rtl"
                lang="ar"
                className="mt-2 text-sm font-semibold font-arabic leading-relaxed text-muted-foreground border-t border-border/50 pt-2"
              >
                {item.definitionAr}
              </p>
            )}
          </div>

          {/* Example in Context */}
          {item.example && (
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                {t("vocabulary.exampleInContext") || "Example in Context"}
              </span>
              <p
                className="text-sm sm:text-base font-medium italic text-foreground leading-relaxed"
                lang="en"
              >
                "{item.example}"
              </p>
              {hasArabic && item.exampleAr && (
                <p
                  dir="rtl"
                  lang="ar"
                  className="mt-2 text-xs sm:text-sm font-arabic text-muted-foreground leading-relaxed border-t border-border/50 pt-2"
                >
                  "{item.exampleAr}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer with Done button */}
        <div className="p-4 border-t border-border bg-muted/15 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-wp-xs hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            {t("action.done") || "Done"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});
