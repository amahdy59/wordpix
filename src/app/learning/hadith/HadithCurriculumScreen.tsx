import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Clock3, Search } from "lucide-react";
import type { Action } from "../../types";
import { useLearner } from "../../context/LearnerContext";
import { useI18n } from "../../../i18n";
import { FIGMA_HADITH_LESSONS, getHadithLessonThumbnail } from "./figmaHadithCatalog";
import { HADITH_THEMES } from "./hadithThemes";
import { CurriculumFilterTabs } from "../../shared/CurriculumFilterTabs";
import { CurriculumHeroHeader } from "../../shared/CurriculumHeroHeader";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { Button, CurriculumTopicCard, EmptyState } from "../../shared";

interface Props {
  dispatch: React.Dispatch<Action>;
}

function lessonPurpose(lines: readonly string[]): string {
  const marker = lines.findIndex((line) => line.toLocaleLowerCase("en-US") === "lesson purpose");
  return marker >= 0 ? (lines[marker + 1] ?? "") : "";
}

export function HadithCurriculumScreen({ dispatch }: Props) {
  const { t } = useI18n();
  const { state } = useLearner();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "due" | "in-progress" | "mastered">("all");
  const now = new Date().toISOString();
  const lessons = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("en-US");
    return FIGMA_HADITH_LESSONS.filter((lesson) => {
      const progress = state.hadithProgress[lesson.id];
      const reviewAt = progress?.nextReviewAt;
      if (filter === "due" && !(reviewAt && reviewAt <= now)) return false;
      if (filter === "in-progress" && progress?.status !== "in-progress") return false;
      if (filter === "mastered" && progress?.status !== "mastered") return false;
      return (
        !normalized ||
        `${lesson.number} ${lesson.title} ${lessonPurpose(lesson.stages.overview.text)}`
          .toLocaleLowerCase("en-US")
          .includes(normalized)
      );
    });
  }, [filter, now, query, state.hadithProgress]);
  const completed = FIGMA_HADITH_LESSONS.filter(
    (lesson) => state.hadithProgress[lesson.id]?.status === "mastered"
  ).length;
  const due = FIGMA_HADITH_LESSONS.filter((lesson) => {
    const reviewAt = state.hadithProgress[lesson.id]?.nextReviewAt;
    return Boolean(reviewAt && reviewAt <= now);
  }).length;
  const inProgress = FIGMA_HADITH_LESSONS.filter(
    (lesson) => state.hadithProgress[lesson.id]?.status === "in-progress"
  ).length;
  const themedLessons = HADITH_THEMES.map((theme) => ({
    ...theme,
    lessons: lessons.filter((lesson) => lesson.number >= theme.start && lesson.number <= theme.end),
  })).filter((theme) => theme.lessons.length > 0);
  const nextLesson =
    FIGMA_HADITH_LESSONS.find((lesson) => {
      const progress = state.hadithProgress[lesson.id];
      return (
        progress?.status === "in-progress" ||
        Boolean(progress?.nextReviewAt && progress.nextReviewAt <= now)
      );
    }) ??
    FIGMA_HADITH_LESSONS.find((lesson) => state.hadithProgress[lesson.id]?.status !== "mastered") ??
    FIGMA_HADITH_LESSONS[0];

  return (
    <div
      className="h-full min-h-0 overflow-y-auto bg-background pb-24 overscroll-y-contain"
      aria-labelledby="hadith-curriculum-title"
    >
      <div className="wp-container-content wp-layout-gutter flex flex-col gap-6 py-4 sm:py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "GO", to: "explore" })}
          className="w-fit"
          iconLeft={<ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />}
        >
          {t("hadith.backToLearningPath")}
        </Button>

        <CurriculumHeroHeader
          titleId="hadith-curriculum-title"
          badge={t("hadith.curriculumBadge")}
          title={t("hadith.curriculumTitle")}
          description={t("hadith.curriculumShortOutcome")}
          metrics={[
            { label: t("hadith.totalLessons"), value: FIGMA_HADITH_LESSONS.length },
            { label: t("hadith.masteredLessons"), value: completed },
            { label: t("hadith.dueForReview"), value: due },
          ]}
          action={
            <Button
              size="lg"
              fullWidth
              onClick={() => dispatch({ type: "OPEN_HADITH_LESSON", lessonId: nextLesson.id })}
              className="sm:w-auto"
              iconLeft={<BookOpen className="size-5" aria-hidden />}
            >
              {t("hadith.continueCurriculum", { number: nextLesson.number })}
            </Button>
          }
        >
          <details className="mb-4 text-xs text-muted-foreground group">
            <summary className="cursor-pointer font-semibold text-foreground hover:text-primary list-none flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-primary rounded-md">
              <span className="underline underline-offset-2">{t("hadith.pedagogyDetails")}</span>
            </summary>
            <div className="mt-1.5 space-y-1.5 leading-relaxed">
              <p>{t("hadith.curriculumDescription")}</p>
              <p className="text-[11px] text-muted-foreground">{t("hadith.canonicalScopeNote")}</p>
            </div>
          </details>

          <CurriculumFilterTabs
            label={t("hadith.filtersLabel")}
            value={filter}
            onChange={setFilter}
            panelId="hadith-lesson-results"
            options={[
              { value: "all", label: t("hadith.filterAll"), count: FIGMA_HADITH_LESSONS.length },
              { value: "due", label: t("hadith.filterDue"), count: due },
              { value: "in-progress", label: t("hadith.filterInProgress"), count: inProgress },
              { value: "mastered", label: t("hadith.filterMastered"), count: completed },
            ]}
          />
        </CurriculumHeroHeader>

        <div>
          <label htmlFor="hadith-search" className="text-sm font-bold text-foreground">
            {t("hadith.searchLabel")}
          </label>
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id="hadith-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("hadith.searchPlaceholder")}
              className="min-h-12 w-full rounded-2xl border border-border bg-card py-3 ps-12 pe-4 text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>
        </div>

        {lessons.length ? (
          <div
            id="hadith-lesson-results"
            role="tabpanel"
            aria-labelledby={`hadith-lesson-results-tab-${filter}`}
            className="space-y-5"
          >
            {themedLessons.map((theme) => (
              <section
                key={theme.id}
                className="rounded-3xl border border-border bg-card p-4 shadow-wp-xs sm:p-6"
                aria-labelledby={`hadith-theme-${theme.id}`}
              >
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
                      {t("hadith.themeLabel")}
                    </p>
                    <h2 id={`hadith-theme-${theme.id}`} className="mt-1 text-xl font-black">
                      {t(theme.titleKey)}
                    </h2>
                  </div>
                  <p className="text-sm font-bold text-muted-foreground">
                    {t("hadith.themeLessonCount", { count: theme.lessons.length })}
                  </p>
                </div>
                <ol
                  className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  aria-label={t(theme.titleKey)}
                >
                  {theme.lessons.map((lesson) => {
                    const progress = state.hadithProgress[lesson.id];
                    const isMastered = progress?.status === "mastered";
                    const isDue = Boolean(progress?.nextReviewAt && progress.nextReviewAt <= now);
                    const thumbnail = getHadithLessonThumbnail(lesson);
                    const purpose = lessonPurpose(lesson.stages.overview.text);
                    const statusText = isDue
                      ? t("hadith.dueNow")
                      : progress?.status === "in-progress"
                        ? t("hadith.resumeStage", { stage: progress.currentStage + 1 })
                        : isMastered
                          ? t("hadith.masteredStatus", {
                              score: progress.bestScorePercent,
                            })
                          : t("hadith.estimatedTime");
                    return (
                      <li key={lesson.id}>
                        <CurriculumTopicCard
                          numberBadge={lesson.number}
                          isMastered={isMastered}
                          title={lesson.title}
                          imageSrc={resolveAssetUrl(`hadith/v1/images/${thumbnail.imageRef}.png`)}
                          priority={lesson.number <= 2}
                          tooltipText={purpose}
                          statusIcon={<Clock3 className="size-3.5 shrink-0" aria-hidden />}
                          statusText={statusText}
                          onClick={() =>
                            dispatch({ type: "OPEN_HADITH_LESSON", lessonId: lesson.id })
                          }
                        />
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("hadith.noResultsTitle")}
            description={t("hadith.noResultsDescription")}
            live="polite"
          />
        )}
      </div>
    </div>
  );
}
