import { memo, useRef } from "react";
import { X, Volume2, Sparkles, BookOpen, Layers, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { VocabularyItem } from "../data/lessons";
import { getLexiconEntry } from "../data/lexiconDictionary";
import { useAudio } from "./useAudio";
import { useModalA11y } from "./useModalA11y";
import { resolveAssetUrl } from "../../utils/assetUrl";

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
  const containerRef = useModalA11y({ isOpen, onDismiss: onClose });

  if (!isOpen || !word) return null;

  const entry = getLexiconEntry(word.id, word.label);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
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
          className="relative w-full max-w-xl bg-wp-card border border-border rounded-3xl shadow-wp-lg overflow-hidden flex flex-col max-h-[92dvh] z-10"
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
              className="absolute top-3 end-3 size-11 min-h-[44px] min-w-[44px] rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white"
            >
              <X className="size-5" />
            </button>

            {/* Word Header on bottom of image */}
            <div className="absolute bottom-3 start-3 end-3 sm:bottom-3.5 sm:start-4 sm:end-4 flex flex-wrap sm:flex-nowrap items-end justify-between gap-2 sm:gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-wp-amber flex items-center gap-1.5 drop-shadow">
                  <Sparkles className="size-3 sm:size-3.5 shrink-0" />
                  <span>Oxford / Cambridge Lexicon</span>
                </span>
                <h2
                  id="word-inspector-title"
                  className="font-sans font-black text-white text-xl sm:text-2xl lg:text-3xl leading-tight capitalize drop-shadow break-words"
                >
                  {word.label.toLowerCase()}
                </h2>
                <p className="font-sans text-white/90 text-xs sm:text-sm drop-shadow font-mono break-words">
                  {entry.phonetic || word.phonetic}
                </p>
              </div>

              {/* Fast Pronounce Button */}
              <button
                type="button"
                onClick={() => speak(word.label)}
                aria-label={`Pronounce ${word.label}`}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] rounded-full bg-primary text-primary-foreground font-sans font-bold text-xs sm:text-sm shadow-md hover:opacity-90 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-white shrink-0"
              >
                <Volume2 className="size-3.5 sm:size-4" />
                <span>Listen</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
            {/* Arabic Translation Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <span className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Verified Arabic Meaning
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

            {/* Pronunciation Tip */}
            {entry.pronunciationTip && (
              <div className="bg-wp-amber/10 border border-wp-amber/25 rounded-2xl p-3.5 flex items-start gap-2.5">
                <Sparkles className="size-4 text-wp-amber shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-foreground leading-relaxed">
                  <strong className="font-bold">Pronunciation Guide: </strong>
                  {entry.pronunciationTip}
                </p>
              </div>
            )}

            {/* Authentic Collocations (Up to 6) */}
            {entry.collocations && entry.collocations.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  <span>Essential Collocations & Word Partners ({entry.collocations.length})</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {entry.collocations.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => speak(col)}
                      aria-label={`Listen to collocation: ${col}`}
                      className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-secondary hover:bg-primary/10 text-foreground text-xs sm:text-sm font-sans font-semibold border border-border hover:border-primary/40 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>{col}</span>
                      <Volume2 className="size-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Related Phrasal Verbs (Up to 3) */}
            {entry.phrasalVerbs && entry.phrasalVerbs.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="size-3.5 text-primary" />
                  <span>Related Phrasal Verbs ({entry.phrasalVerbs.length})</span>
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {entry.phrasalVerbs.map((pv, idx) => (
                    <div
                      key={idx}
                      className="bg-muted/30 border border-border/80 rounded-2xl p-3.5 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => speak(pv.phrase)}
                          aria-label={`Pronounce phrasal verb: ${pv.phrase}`}
                          className="flex items-center gap-1.5 text-primary font-sans font-bold text-sm hover:underline min-h-[44px] px-1"
                        >
                          <span>{pv.phrase}</span>
                          <Volume2 className="size-3.5" />
                        </button>
                        <span
                          className="font-arabic text-xs font-bold text-foreground bg-background/80 px-2.5 py-1 rounded-lg border border-border"
                          dir="rtl"
                          lang="ar"
                        >
                          {pv.arabic}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-muted-foreground italic">
                        &ldquo;{pv.example}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3+ Contextual Example Sentences */}
            {entry.sentences && entry.sentences.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-primary" />
                  <span>Real-World Usage Contexts ({entry.sentences.length})</span>
                </span>
                <div className="flex flex-col gap-3">
                  {entry.sentences.map((sentence, idx) => (
                    <div
                      key={idx}
                      className="bg-muted/40 border border-border rounded-2xl p-4 flex flex-col gap-2 transition-colors hover:border-primary/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        {sentence.context ? (
                          <span className="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary uppercase tracking-wide">
                            {sentence.context}
                          </span>
                        ) : (
                          <span className="text-[11px] font-sans font-bold text-muted-foreground uppercase">
                            Context {idx + 1}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => speak(sentence.en)}
                          aria-label={`Listen to example ${idx + 1}`}
                          className="flex items-center gap-1 text-xs font-sans font-bold text-primary hover:underline min-h-[44px] px-2"
                        >
                          <Volume2 className="size-3.5" />
                          <span>Play</span>
                        </button>
                      </div>

                      <p className="font-sans text-foreground text-sm sm:text-base leading-relaxed">
                        &ldquo;{sentence.en}&rdquo;
                      </p>
                      <p
                        className="font-arabic text-muted-foreground text-xs sm:text-sm"
                        dir="rtl"
                        lang="ar"
                      >
                        {sentence.ar}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
    </AnimatePresence>
  );
});
