import { memo, useEffect, useRef } from "react";
import { X, Volume2, Sparkles, BookOpen, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { VocabularyItem } from "../data/lessons";
import { getLexiconEntry } from "../data/lexiconDictionary";
import { useAudio } from "./useAudio";

interface Props {
  word: VocabularyItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WordInspectorModal = memo(function WordInspectorModal({
  word,
  isOpen,
  onClose,
}: Props) {
  const { speak } = useAudio();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !word) return null;

  const entry = getLexiconEntry(word.id, word.label);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="word-inspector-title"
          className="relative w-full max-w-lg bg-wp-card border border-border rounded-3xl shadow-wp-lg overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Top Header with Image & Close Button */}
          <div className="relative h-48 sm:h-56 w-full bg-muted overflow-hidden shrink-0">
            <img src={word.img} alt="" className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Close button */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close word details"
              className="absolute top-4 end-4 size-11 min-h-[44px] min-w-[44px] rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white"
            >
              <X className="size-5" />
            </button>

            {/* Word Header on bottom of image */}
            <div className="absolute bottom-4 start-5 end-5 flex items-end justify-between gap-3">
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-wp-amber flex items-center gap-1.5 drop-shadow">
                  <Sparkles className="size-3.5" />
                  <span>Lexicon Inspector</span>
                </span>
                <h2
                  id="word-inspector-title"
                  className="font-sans font-black text-white text-2xl sm:text-3xl leading-tight capitalize drop-shadow"
                >
                  {word.label.toLowerCase()}
                </h2>
                <p className="font-sans text-white/90 text-sm drop-shadow">{word.phonetic}</p>
              </div>

              {/* Fast Pronounce Button */}
              <button
                type="button"
                onClick={() => speak(word.label)}
                aria-label={`Pronounce ${word.label}`}
                className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full bg-primary text-primary-foreground font-sans font-bold text-sm shadow-md hover:opacity-90 transition-all focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-white shrink-0"
              >
                <Volume2 className="size-4" />
                <span>Listen</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-4">
            {/* Arabic Translation Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <span className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Arabic Meaning
                </span>
                <p
                  className="font-arabic font-black text-foreground text-xl sm:text-2xl mt-0.5"
                  dir="rtl"
                  lang="ar"
                >
                  {entry.arabic}
                </p>
              </div>
              <span className="text-xs font-sans font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider border border-primary/20">
                {entry.partOfSpeech}
              </span>
            </div>

            {/* Natural Collocations */}
            {entry.collocations.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  <span>Common Word Partners (Collocations)</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {entry.collocations.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => speak(col)}
                      aria-label={`Listen to phrase: ${col}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl bg-secondary text-foreground text-xs sm:text-sm font-sans font-semibold border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <span>{col}</span>
                      <Volume2 className="size-3 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Real-World Context Example */}
            <div className="bg-muted/40 border border-border rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-primary" />
                  <span>Example Sentence</span>
                </span>
                <button
                  type="button"
                  onClick={() => speak(entry.exampleSentence)}
                  aria-label="Listen to example sentence"
                  className="flex items-center gap-1 text-xs font-sans font-bold text-primary hover:underline min-h-[44px] px-2"
                >
                  <Volume2 className="size-3.5" />
                  <span>Play Sentence</span>
                </button>
              </div>

              <p className="font-sans text-foreground text-sm sm:text-base leading-relaxed">
                &ldquo;{entry.exampleSentence}&rdquo;
              </p>
              <p
                className="font-arabic text-muted-foreground text-xs sm:text-sm"
                dir="rtl"
                lang="ar"
              >
                {entry.exampleArabic}
              </p>
            </div>

            {/* Pronunciation Tip */}
            {entry.pronunciationTip && (
              <div className="bg-wp-amber/10 border border-wp-amber/20 rounded-2xl p-3.5 flex items-start gap-2.5">
                <Sparkles className="size-4 text-wp-amber shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-foreground leading-relaxed">
                  <strong className="font-bold">Pronunciation Tip: </strong>
                  {entry.pronunciationTip}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Footer */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm shadow-xs hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});
