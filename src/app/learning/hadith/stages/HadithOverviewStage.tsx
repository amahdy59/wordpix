import { Clock3, Sparkles, Target, Trophy } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { ParsedOverview } from "../hadithLessonContent";

interface Props {
  overview: ParsedOverview;
  lessonNumber: number;
}

export function HadithOverviewStage({ overview, lessonNumber }: Props) {
  const { t } = useI18n();

  return (
    <section
      className="mx-auto w-full max-w-5xl space-y-6"
      aria-labelledby="stage-overview-heading"
    >
      {/* Hero Orientation Banner */}
      <header className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-wp-sm sm:p-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            {t("hadith.pilot.overview.eyebrow") || "Lesson Map"}
          </span>
          <span className="text-xs font-bold text-muted-foreground">
            {t("hadith.badge", { number: lessonNumber }) || `Hadith ${lessonNumber} · B1`}
          </span>
        </div>

        <h2
          id="stage-overview-heading"
          tabIndex={-1}
          className="mt-3 text-2xl font-black tracking-tight text-foreground outline-none sm:text-3xl"
        >
          {overview.purpose
            ? t("hadith.pilot.overview.title") || "What this lesson will help you do"
            : overview.title}
        </h2>

        <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-muted-foreground">
          {overview.purpose}
        </p>

        {/* 3 Metric Summary Cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock3 className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                {t("hadith.pilot.overview.timeLabel") || "Time"}
              </p>
              <p className="text-base font-black text-foreground">
                {t("hadith.minutes", { count: overview.estimatedMinutes }) ||
                  `${overview.estimatedMinutes} minutes`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                {t("hadith.pilot.overview.wordsLabel") || "Core Language"}
              </p>
              <p className="text-base font-black text-foreground">
                {t("hadith.pilot.overview.words", { count: overview.coreWordsCount }) ||
                  `${overview.coreWordsCount} core words + phrases`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Trophy className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                {t("hadith.pilot.overview.goalLabel") || "Final Task"}
              </p>
              <p className="text-base font-black text-foreground">
                {t("hadith.pilot.overview.goal") || "Explain in clear English"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Learning Outcomes Section */}
      <section
        className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8"
        aria-labelledby="stage-outcomes-heading"
      >
        <h3
          id="stage-outcomes-heading"
          className="flex items-center gap-2.5 text-xl font-black text-foreground"
        >
          <Target className="size-5 text-primary" aria-hidden />
          {t("hadith.pilot.overview.outcomesTitle") || "Your Learning Path"}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("hadith.learningOutcomes") || "By the end of this lesson, you will be able to:"}
        </p>

        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {overview.outcomes.map((outcome, index) => (
            <li
              key={outcome.id}
              className="flex gap-4 rounded-2xl border border-border bg-background p-4.5 shadow-sm transition-all hover:border-primary/40"
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary font-black text-primary-foreground shadow-sm"
                aria-hidden
              >
                {index + 1}
              </span>
              <div className="space-y-1">
                <p className="text-base font-black text-foreground">{outcome.title}</p>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                  {outcome.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
