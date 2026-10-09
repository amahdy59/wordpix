import { useState } from "react";
import { BookOpen, Columns2, Globe, Headphones, Rows3, Volume2 } from "lucide-react";
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
          <span className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-[0.18em] text-primary">
            <BookOpen className="size-3.5" aria-hidden />
            {t("hadith.canonicalLabel") || "Complete Hadith"}
          </span>
          <h2
            id="stage-readlisten-heading"
            tabIndex={-1}
            className="wp-type-stage-title mt-1 font-black tracking-tight text-foreground outline-none"
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
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-base font-black transition-colors ${focusRing} ${
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
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-base font-black transition-colors ${focusRing} ${
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
      <div className={parallelReading ? "grid items-stretch gap-6 lg:grid-cols-2" : "space-y-6"}>
        {/* 1. Classical Arabic Card */}
        <article className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-black uppercase tracking-wider text-primary">
                <BookOpen className="size-3.5" aria-hidden />
                {t("hadith.arabic") || "Arabic"}
              </span>
              <BookOpen className="size-4 text-primary" aria-hidden />
            </div>

            <p
              className="mt-6 whitespace-pre-line font-serif text-2xl font-bold leading-[2] text-foreground"
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
              className={`inline-flex min-h-12 items-center gap-2.5 rounded-2xl bg-primary px-5 font-black text-primary-foreground shadow-sm transition-all hover:bg-primary motion-safe:active:scale-[0.98] motion-reduce:transition-none ${focusRing}`}
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
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-black uppercase tracking-wider text-primary">
                <Globe className="size-3.5" aria-hidden />
                {t("hadith.englishTranslation") || "English Translation"}
              </span>
              <Globe className="size-4 text-primary" aria-hidden />
            </div>

            <div
              className="mt-6 space-y-4 text-base font-semibold leading-8 text-foreground sm:text-lg"
              lang="en"
              dir="ltr"
            >
              {source.translation
                .split(/\n+/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>

            <p className="mt-5 rounded-xl bg-muted/50 px-3.5 py-2 text-sm font-bold italic text-muted-foreground">
              {source.citation}
            </p>
          </div>

          <div className="mt-8 border-t border-border pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onPlayAudio("en")}
                aria-busy={isPlaying && activeTrack === "en"}
                className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-primary bg-secondary px-4 font-black text-primary transition-all hover:bg-secondary motion-safe:active:scale-[0.98] motion-reduce:transition-none ${focusRing}`}
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
                className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-background px-4 font-black text-foreground transition-all hover:border-primary/40 hover:bg-muted/50 motion-safe:active:scale-[0.98] motion-reduce:transition-none ${focusRing}`}
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
                className="mt-4 rounded-xl border border-feedback-error-border bg-feedback-error-surface p-3 text-sm font-semibold text-feedback-error-foreground"
                role="alert"
              >
                {t("hadith.audioError") ||
                  "The audio could not load. Check your connection or try again."}
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
