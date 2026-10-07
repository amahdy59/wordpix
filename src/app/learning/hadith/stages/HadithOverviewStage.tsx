import { HelpDisclosure } from "../../../shared/HelpDisclosure";
import { useI18n } from "../../../../i18n";
import type { ParsedOverview } from "../hadithLessonContent";

interface Props {
  overview: ParsedOverview;
  lessonNumber: number;
}

export function HadithOverviewSummary({ overview }: { overview: ParsedOverview }) {
  const { t } = useI18n();
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground">
      <div className="flex items-baseline gap-2">
        <dt>{t("hadith.pilot.overview.timeLabel")}</dt>
        <dd className="font-bold">{t("hadith.minutes", { count: overview.estimatedMinutes })}</dd>
      </div>
      <div className="flex items-baseline gap-2">
        <dt>{t("hadith.pilot.overview.wordsLabel")}</dt>
        <dd className="font-bold">{overview.coreWordsCount}</dd>
      </div>
    </dl>
  );
}

export function HadithOverviewStage({ overview }: Props) {
  const { t } = useI18n();

  return (
    <section className="wp-container-content space-y-6" aria-labelledby="stage-overview-heading">
      <h2 id="stage-overview-heading" tabIndex={-1} className="text-2xl font-black text-foreground">
        {overview.title}
      </h2>
      <HadithOverviewSummary overview={overview} />
      <HelpDisclosure label={t("help.aboutLesson")}>
        <p>{overview.purpose}</p>
        <ol className="space-y-3">
          {overview.outcomes.map((outcome) => (
            <li key={outcome.id}>
              <p className="font-bold">{outcome.title}</p>
              <p>{outcome.description}</p>
            </li>
          ))}
        </ol>
      </HelpDisclosure>
    </section>
  );
}
