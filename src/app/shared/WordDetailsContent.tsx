import { BookOpen, Layers, Volume2, Zap } from "lucide-react";
import type { VocabularyItem } from "../data/lessons";
import {
  getLexiconEntry,
  getReviewedCollocations,
  hasArabicGloss,
} from "../data/lexiconDictionary";
import { useAudio } from "./useAudio";
import { useI18n } from "../context/I18nContext";

export function WordDetailsContent({
  word,
  unitId,
  bilingual = true,
  className = "",
}: {
  word: VocabularyItem;
  unitId?: string;
  bilingual?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const { speak } = useAudio();
  const baseEntry = getLexiconEntry(word.id, word.label, unitId);
  const entry = {
    ...baseEntry,
    collocations: getReviewedCollocations(baseEntry),
    arabic: word.arabicTranslation ?? baseEntry.arabic,
    sentences: word.exampleUsage
      ? [
          {
            context: "Example",
            en: word.exampleUsage,
            ar: baseEntry.sentences.find((sentence) => sentence.en === word.exampleUsage)?.ar ?? "",
          },
        ]
      : word.arabicTranslation !== undefined
        ? []
        : baseEntry.sentences,
    exampleSentence: word.exampleUsage ?? baseEntry.exampleSentence,
  };
  return (
    <div
      className={`flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto overscroll-contain touch-pan-y flex flex-col gap-4 ${className}`}
    >
      <section
        aria-label={t("wordDetails.meaning")}
        className="rounded-2xl border border-border bg-muted/30 p-4"
      >
        <h3 className="font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {t("wordDetails.meaning")}
        </h3>
        <p className="mt-2 font-sans text-base leading-relaxed text-foreground" lang="en" dir="ltr">
          {word.description}
        </p>
      </section>

      {/* Arabic Translation Card. The part of speech is worth showing on
      its own, so the card stays when the gloss is missing and only
      the Arabic line drops out — see `hasArabicGloss`. */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
        {bilingual && hasArabicGloss(entry) ? (
          <p
            className="font-arabic font-bold text-foreground text-lg sm:text-xl"
            dir="rtl"
            lang="ar"
          >
            {entry.arabic}
          </p>
        ) : bilingual ? (
          <p className="font-sans text-sm text-muted-foreground italic">
            {t("wordDetails.translationNotAvailable")}
          </p>
        ) : null}
        <span className="text-xs font-sans font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider border border-primary/20 shrink-0">
          {entry.partOfSpeech}
        </span>
      </div>

      {entry.sentences && entry.sentences.length > 0 && (
        <section
          className="flex flex-col gap-2.5"
          aria-label={t("wordDetails.usageContexts", { count: entry.sentences.length })}
        >
          <h3 className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <BookOpen className="size-3.5 text-primary" aria-hidden="true" />
            <span>{t("wordDetails.usageContexts", { count: entry.sentences.length })}</span>
          </h3>
          <div className="flex flex-col gap-3">
            {entry.sentences.map((sentence, idx) => (
              <div
                key={idx}
                className="bg-muted/40 border border-border rounded-2xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-sans font-bold text-primary uppercase tracking-wide">
                    {sentence.context || t("wordDetails.contextNum", { num: idx + 1 })}
                  </span>
                  <button
                    type="button"
                    onClick={() => speak(sentence.en)}
                    aria-label={`Listen to example ${idx + 1}`}
                    className="flex items-center gap-1 text-xs font-sans font-bold text-primary hover:underline min-h-[44px] px-2"
                  >
                    <Volume2 className="size-3.5" aria-hidden="true" />
                    <span>{t("wordDetails.play")}</span>
                  </button>
                </div>
                <p
                  className="font-sans text-foreground text-sm sm:text-base leading-relaxed"
                  lang="en"
                  dir="ltr"
                >
                  &ldquo;{sentence.en}&rdquo;
                </p>
                {bilingual && sentence.ar && (
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
        </section>
      )}

      {/* Authentic Collocations (Up to 6) */}
      {entry.collocations && entry.collocations.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className="font-sans text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            <span>{t("wordDetails.collocations", { count: entry.collocations.length })}</span>
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
            <span>{t("wordDetails.phrasalVerbs", { count: entry.phrasalVerbs.length })}</span>
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
    </div>
  );
}
