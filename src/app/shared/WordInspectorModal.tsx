import { memo, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { VocabularyItem } from "../data/lessons";
import { getLexiconEntry } from "../data/lexiconDictionary";
import { useAudio } from "./useAudio";
import { useModalA11y } from "./useModalA11y";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { WordDetailsContent } from "./WordDetailsContent";

interface Props {
  word: VocabularyItem | null;
  unitId?: string;
  lessonPanel?: boolean;
  bilingual?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const WordInspectorModal = memo(function WordInspectorModal({
  word,
  unitId,
  lessonPanel = false,
  bilingual = true,
  isOpen,
  onClose,
}: Props) {
  const { speak } = useAudio();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useModalA11y({ isOpen, onDismiss: onClose });

  if (!isOpen || !word) return null;

  const entry = getLexiconEntry(word.id, word.label, unitId);

  return createPortal(
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-50 flex items-end ${lessonPanel ? "lg:items-stretch lg:justify-end" : "sm:items-center justify-center sm:p-6"} bg-black/70`}
      >
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="word-inspector-title"
          className={`${lessonPanel ? "lg:max-w-sm lg:h-dvh lg:!max-h-dvh lg:!rounded-none" : "max-w-xl sm:rounded-3xl"} relative w-full bg-wp-card border-t sm:border border-border rounded-t-[28px] lg:rounded-3xl shadow-wp-lg overflow-hidden flex flex-col max-h-[90dvh] z-10 pb-[env(safe-area-inset-bottom)] sm:pb-0 pointer-events-auto`}
        >
          {/* Top Header with Image & Close Button */}
          <div className="relative h-44 sm:h-52 w-full bg-muted overflow-hidden shrink-0">
            <img src={resolveAssetUrl(word.img)} alt="" className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            {/* Close button */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close word details"
              className="absolute top-3 end-3 size-11 min-h-[44px] min-w-[44px] rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Word Header on bottom of image */}
            <div className="absolute bottom-3 start-3 end-3 sm:bottom-3.5 sm:start-4 sm:end-4 flex flex-wrap sm:flex-nowrap items-end justify-between gap-2 sm:gap-3">
              <div className="min-w-0 flex-1">
                <h2
                  id="word-inspector-title"
                  className="font-sans font-black text-white text-2xl sm:text-3xl leading-tight drop-shadow break-words"
                >
                  {word.label}
                </h2>
                <p className="font-sans text-white/90 text-xs sm:text-sm drop-shadow font-mono break-words mt-0.5">
                  {entry.phonetic || word.phonetic}
                </p>
              </div>

              {/* Fast Pronounce Button */}
              <button
                type="button"
                onClick={() => speak(word.label)}
                aria-label={`Pronounce ${word.label}`}
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 min-h-[44px] rounded-full bg-primary text-primary-foreground font-sans font-bold text-xs sm:text-sm shadow-md hover:opacity-90 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-white shrink-0 cursor-pointer"
              >
                <Volume2 className="size-4" />
                <span>Listen</span>
              </button>
            </div>
          </div>

          <WordDetailsContent word={word} bilingual={bilingual} />

          {/* Bottom Footer */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm shadow-xs hover:opacity-90 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
});
