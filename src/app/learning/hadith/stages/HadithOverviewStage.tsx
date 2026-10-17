import { useI18n } from "../../../../i18n";
import type { ParsedOverview } from "../hadithLessonContent";

interface Props {
  overview: ParsedOverview;
  lessonNumber: number;
}

export function HadithOverviewSummary({ overview }: { overview: ParsedOverview }) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <dl className="flex flex-wrap gap-x-6 gap-y-2 text-base text-foreground">
        <div className="flex items-baseline gap-2">
          <dt>{t("hadith.pilot.overview.timeLabel")}</dt>
          <dd className="font-bold">{t("hadith.minutes", { count: overview.estimatedMinutes })}</dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt>{t("hadith.pilot.overview.wordsLabel")}</dt>
          <dd className="font-bold">{overview.coreWordsCount}</dd>
        </div>
      </dl>
      <ul className="list-disc space-y-2 ps-5 text-base text-foreground" lang="en" dir="ltr">
        {overview.outcomes.map((outcome) => (
          <li key={outcome.id}>{outcome.description}</li>
        ))}
      </ul>
    </div>
  );
}

export function HadithOverviewStage({ overview }: Props) {
  return (
    <section className="wp-container-content space-y-6" aria-labelledby="stage-overview-heading">
      <h2
        id="stage-overview-heading"
        tabIndex={-1}
        className="wp-type-stage-title font-black text-foreground"
      >
        {overview.title}
      </h2>
      <HadithOverviewSummary overview={overview} />
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <p className="text-base text-muted-foreground">{overview.purpose}</p>
        <ol className="space-y-2">
          {overview.outcomes.map((outcome) => (
            <li key={outcome.id}>
              <p className="font-bold text-foreground text-sm">{outcome.title}</p>
              <p className="text-sm text-muted-foreground">{outcome.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
