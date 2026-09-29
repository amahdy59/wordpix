import { useState } from "react";
import { BookOpen, Columns2, Globe, Headphones, Info, Rows3, Volume2 } from "lucide-react";
import { useI18n } from "../../../../i18n";

interface Props {
  source: {
    arabic: string;
    translation: string;
    citation: string;
  };
  onPlayAudio: (track: "ar" | "en" | "en-slow") => void;
  isPlaying: boolean;
  activeTrack: "ar" | "en" | "en-slow" | null;
  isAudioError: boolean;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithReadListenStage({
  source,
  onPlayAudio,
  isPlaying,
  activeTrack,
  isAudioError,
}: Props) {
  const { t } = useI18n();
  const [parallelReading, setParallelReading] = useState(true);

  return (
    <section
      id="hadith-read-listen-section"
      className="wp-container-content space-y-6"
      aria-labelledby="stage-readlisten-heading"
    >
      {/* Section Header & Reading Layout Switcher */}
      <header className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-wp-xs sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary">
            <BookOpen className="size-3.5" aria-hidden />
            {t("hadith.canonicalLabel") || "Complete Hadith"}
          </span>
          <h2
            id="stage-readlisten-heading"
            tabIndex={-1}
            className="mt-1 text-2xl font-black tracking-tight text-foreground outline-none sm:text-3xl"
          >
            {t("hadith.completeText") || "Read and listen"}
          </h2>
        </div>

        <div
          className="inline-flex w-fit rounded-2xl border border-border bg-background p-1"
          role="group"
          aria-label={t("hadith.readingLayout")}
        >
          <button
            type="button"
            aria-pressed={!parallelReading}
            onClick={() => setParallelReading(false)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-black transition-colors ${focusRing} ${
              !parallelReading
                ? "bg-primary text-primary-foreground shadow-wp-xs"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Rows3 className="size-4" aria-hidden />
            {t("hadith.stackedReading")}
          </button>
          <button
            type="button"
            aria-pressed={parallelReading}
            onClick={() => setParallelReading(true)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-black transition-colors ${focusRing} ${
              parallelReading
                ? "bg-primary text-primary-foreground shadow-wp-xs"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Columns2 className="size-4" aria-hidden />
            {t("hadith.parallelReading")}
          </button>
        </div>
      </header>

      {/* Main Bilingual Source Cards */}
      <div className={parallelReading ? "grid gap-6 lg:grid-cols-2 lg:items-stretch" : "space-y-6"}>
        {/* 1. Classical Arabic Card */}
        <article className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
                <BookOpen className="size-3.5" aria-hidden />
                {t("hadith.arabic") || "Arabic"}
              </span>
              <BookOpen className="size-4 text-primary" aria-hidden />
            </div>

            <p
              className="mt-6 font-serif text-2xl font-bold leading-[2.35] text-foreground sm:text-3xl"
              lang="ar"
              dir="rtl"
            >
              {source.arabic}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={() => onPlayAudio("ar")}
              aria-busy={isPlaying && activeTrack === "ar"}
              className={`inline-flex min-h-12 items-center gap-2.5 rounded-2xl bg-primary px-5 font-black text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] motion-reduce:transition-none ${focusRing}`}
            >
              <Headphones className="size-5" aria-hidden />
              <span>
                {isPlaying && activeTrack === "ar"
                  ? t("hadith.playing") || "Playing…"
                  : t("hadith.listenArabic") || "Listen to Arabic"}
              </span>
            </button>
          </div>
        </article>

        {/* 2. English Translation Card */}
        <article className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
                <Globe className="size-3.5" aria-hidden />
                {t("hadith.englishTranslation") || "English Translation"}
              </span>
              <Globe className="size-4 text-primary" aria-hidden />
            </div>

            <p
              className="mt-6 text-base font-semibold leading-8 text-foreground sm:text-lg sm:leading-9"
              lang="en"
              dir="ltr"
            >
              {source.translation}
            </p>

            <p className="mt-5 rounded-xl bg-muted/50 px-3.5 py-2 text-xs font-bold italic text-muted-foreground">
              {source.citation}
            </p>
          </div>

          <div className="mt-8 border-t border-border pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onPlayAudio("en")}
                aria-busy={isPlaying && activeTrack === "en"}
                className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-primary bg-primary/10 px-4 font-black text-primary transition-all hover:bg-primary/15 active:scale-[0.98] motion-reduce:transition-none ${focusRing}`}
              >
                <Volume2 className="size-5" aria-hidden />
                <span>
                  {isPlaying && activeTrack === "en"
                    ? t("hadith.playing") || "Playing…"
                    : t("hadith.listenTranslation") || "Listen to translation"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onPlayAudio("en-slow")}
                aria-busy={isPlaying && activeTrack === "en-slow"}
                className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-background px-4 font-black text-foreground transition-all hover:border-primary/40 hover:bg-muted/50 active:scale-[0.98] motion-reduce:transition-none ${focusRing}`}
              >
                <Volume2 className="size-5 text-primary" aria-hidden />
                <span>
                  {isPlaying && activeTrack === "en-slow"
                    ? t("hadith.playing") || "Playing…"
                    : t("hadith.listenSlowly") || "Listen slowly"}
                </span>
              </button>
            </div>

            {isAudioError && (
              <p
                className="mt-4 rounded-xl border border-feedback-error-border bg-feedback-error-surface p-3 text-xs font-semibold text-feedback-error-foreground"
                role="alert"
              >
                {t("hadith.audioError") ||
                  "The audio could not load. Check your connection or try again."}
              </p>
            )}
          </div>
        </article>
      </div>

      {/* 3-Step Interactive Learner Flow Bar */}
      <aside
        className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-7"
        aria-labelledby="listening-guide-heading"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Info className="size-5 text-primary" aria-hidden />
            <h3 id="listening-guide-heading" className="text-lg font-black text-foreground">
              {t("hadith.listeningGuide") || "Learner flow"}
            </h3>
          </div>
          <p className="text-xs font-semibold text-muted-foreground">
            {t("hadith.listeningGuideDescription") ||
              "Follow these three simple steps to practice listening and build deep comprehension:"}
          </p>
        </div>

        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              step: 1,
              title: t("hadith.listenStepOne") || "Listen once for the main idea.",
              tip: t("hadith.listenTipOne"),
            },
            {
              step: 2,
              title: t("hadith.listenStepTwo") || "Replay slowly and notice key expressions.",
              tip: t("hadith.listenTipTwo"),
            },
            {
              step: 3,
              title: t("hadith.listenStepThree") || "Read the translation and connect meaning.",
              tip: t("hadith.listenTipThree"),
            },
          ].map((item) => (
            <li
              key={item.step}
              className="flex gap-3.5 rounded-2xl border border-border bg-background/70 p-4 shadow-wp-xs"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary"
                aria-hidden
              >
                {item.step}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-black text-foreground">{item.title}</p>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                  {item.tip}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  );
}
