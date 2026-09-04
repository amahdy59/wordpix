import { BookOpen, Layers, Volume2, Zap } from "lucide-react";
import type { VocabularyItem } from "../data/lessons";
import { getLexiconEntry, hasArabicGloss } from "../data/lexiconDictionary";
import { useAudio } from "./useAudio";

export function WordDetailsContent({
  word,
  bilingual = true,
  className = "",
}: {
  word: VocabularyItem;
  bilingual?: boolean;
  className?: string;
}) {
  const { speak } = useAudio();
  const entry = getLexiconEntry(word.id, word.label);
  return (
    <div
      className={`flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto overscroll-contain touch-pan-y flex flex-col gap-4 ${className}`}
    >
      {/* Arabic Translation Card. The part of speech is worth showing on
      its own, so the card stays when the gloss is missing and only
      the Arabic line drops out — see `hasArabicGloss`. */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3">
        {bilingual && hasArabicGloss(entry) ? (
          <p
            className="font-arabic font-black text-foreground text-xl sm:text-2xl"
            dir="rtl"
            lang="ar"
          >
            {entry.arabic}
          </p>
        ) : bilingual ? (
          <p className="font-sans text-sm text-muted-foreground italic">
            Translation not available yet
          </p>
        ) : null}
        <span className="text-xs font-sans font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider border border-primary/20 shrink-0">
          {entry.partOfSpeech}
        </span>
      </div>

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
                  {bilingual && (
                    <span
                      className="font-arabic text-xs font-bold text-foreground bg-background/80 px-2.5 py-1 rounded-lg border border-border"
                      dir="rtl"
                      lang="ar"
                    >
                      {pv.arabic}
                    </span>
                  )}
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
                {bilingual && (
                  <p
                    className="font-arabic text-muted-foreground text-xs sm:text-sm"
                    dir="rtl"
                    lang="ar"
                  >
                    {sentence.ar}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
