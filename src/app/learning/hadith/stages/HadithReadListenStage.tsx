import { useState } from "react";
import { BookOpen, Columns2, Headphones, Info, Rows3, Volume2 } from "lucide-react";
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
  const [parallelReading, setParallelReading] = useState(false);

  return (
    <section
      className="mx-auto w-full max-w-5xl space-y-6"
      aria-labelledby="stage-readlisten-heading"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-primary">
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
          className="inline-flex w-fit rounded-2xl border border-border bg-card p-1"
          role="group"
          aria-label={t("hadith.readingLayout")}
        >
          <button
            type="button"
            aria-pressed={!parallelReading}
            onClick={() => setParallelReading(false)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-black ${focusRing} ${!parallelReading ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
          >
            <Rows3 className="size-4" aria-hidden />
            {t("hadith.stackedReading")}
          </button>
          <button
            type="button"
            aria-pressed={parallelReading}
            onClick={() => setParallelReading(true)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-black ${focusRing} ${parallelReading ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
          >
            <Columns2 className="size-4" aria-hidden />
            {t("hadith.parallelReading")}
          </button>
        </div>
      </header>

      <div className={parallelReading ? "space-y-6" : "grid gap-6 lg:grid-cols-[1.25fr_0.75fr]"}>
        {/* Main Source Block Cards */}
        <div className={parallelReading ? "grid gap-6 md:grid-cols-2" : "space-y-6"}>
          {/* 1. Classical Arabic Card */}
          <article className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                {t("hadith.arabic") || "Arabic Text"}
              </span>
              <BookOpen className="size-5 text-primary" aria-hidden />
            </div>

            <p
              className="mt-6 font-serif text-2xl font-bold leading-[2.3] text-foreground sm:text-3xl"
              lang="ar"
              dir="rtl"
            >
              {source.arabic}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => onPlayAudio("ar")}
                aria-busy={isPlaying && activeTrack === "ar"}
                className={`inline-flex min-h-12 items-center gap-2.5 rounded-2xl bg-primary px-5 font-black text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] ${focusRing}`}
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
          <article className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {t("hadith.partOfSpeech") || "English Translation"}
            </span>

            <p className="mt-4 text-base font-medium leading-8 text-foreground sm:text-lg">
              {source.translation}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => onPlayAudio("en")}
                aria-busy={isPlaying && activeTrack === "en"}
                className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-primary bg-primary/10 px-4 font-black text-primary transition-all hover:bg-primary/15 active:scale-[0.98] ${focusRing}`}
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
                className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-background px-4 font-black text-foreground transition-all hover:border-primary/40 hover:bg-muted/50 active:scale-[0.98] ${focusRing}`}
              >
                <Volume2 className="size-5" aria-hidden />
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

            <p className="mt-6 text-xs font-semibold italic text-muted-foreground">
              {source.citation}
            </p>
          </article>
        </div>

        {/* Listening Guide Sidebar */}
        <aside
          className={`rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8 ${parallelReading ? "mx-auto w-full max-w-5xl" : ""}`}
          aria-labelledby="listening-guide-heading"
        >
          <div className="flex items-center gap-2">
            <Info className="size-5 text-primary" aria-hidden />
            <h3 id="listening-guide-heading" className="text-xl font-black text-foreground">
              {t("hadith.listeningGuide") || "Learner flow"}
            </h3>
          </div>

          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {t("hadith.completeLanguageBankDescription") ||
              "Follow these three simple steps to practice listening and comprehension:"}
          </p>

          <ol className="mt-6 space-y-4">
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
                className="flex gap-3.5 rounded-2xl border border-border bg-background p-4 shadow-sm"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-black text-primary text-sm"
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
      </div>
    </section>
  );
}
