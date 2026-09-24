import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Search } from "lucide-react";
import type { Action } from "../../types";
import { useLearner } from "../../context/LearnerContext";
import { useI18n } from "../../../i18n";
import { FIGMA_HADITH_LESSONS } from "./figmaHadithCatalog";
import { HADITH_THEMES } from "./hadithThemes";
import { CurriculumFilterTabs } from "../../shared/CurriculumFilterTabs";
import { CurriculumHeroHeader } from "../../shared/CurriculumHeroHeader";

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
    <main
      className="h-full min-h-0 overflow-y-auto bg-background pb-24 overscroll-y-contain"
      aria-labelledby="hadith-curriculum-title"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-8">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "explore" })}
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-3 font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          {t("hadith.backToLearningPath")}
        </button>

        <CurriculumHeroHeader
          titleId="hadith-curriculum-title"
          badge={t("hadith.curriculumBadge")}
          title={t("hadith.curriculumTitle")}
          description={t("hadith.curriculumDescription")}
          metrics={[
            { label: t("hadith.totalLessons"), value: FIGMA_HADITH_LESSONS.length },
            { label: t("hadith.masteredLessons"), value: completed },
            { label: t("hadith.dueForReview"), value: due },
          ]}
          action={
            <button
              type="button"
              onClick={() => dispatch({ type: "OPEN_HADITH_LESSON", lessonId: nextLesson.id })}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-black text-primary-foreground shadow-wp-md hover:opacity-90 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
            >
              <BookOpen className="size-5" aria-hidden />
              {t("hadith.continueCurriculum", { number: nextLesson.number })}
            </button>
          }
        >
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
                <ol className="mt-4 grid gap-3 md:grid-cols-2" aria-label={t(theme.titleKey)}>
                  {theme.lessons.map((lesson) => {
                    const progress = state.hadithProgress[lesson.id];
                    const isMastered = progress?.status === "mastered";
                    const isDue = Boolean(progress?.nextReviewAt && progress.nextReviewAt <= now);
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({ type: "OPEN_HADITH_LESSON", lessonId: lesson.id })
                          }
                          className="grid min-h-[132px] w-full grid-cols-[auto_1fr_auto] items-start gap-4 rounded-2xl border border-border bg-card p-4 text-start shadow-wp-xs hover:border-primary/50 hover:bg-primary/5 active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <span
                            className={`flex size-11 items-center justify-center rounded-xl font-black ${isMastered ? "bg-wp-green text-wp-text-on-green" : "bg-primary/10 text-primary"}`}
                          >
                            {isMastered ? (
                              <CheckCircle2 className="size-5" aria-hidden />
                            ) : (
                              lesson.number
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-base font-black text-foreground">
                              {lesson.title}
                            </span>
                            <span className="mt-1 line-clamp-2 block text-sm leading-6 text-muted-foreground">
                              {lessonPurpose(lesson.stages.overview.text)}
                            </span>
                            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">
                              <Clock3 className="size-4" aria-hidden />
                              {isDue
                                ? t("hadith.dueNow")
                                : progress?.status === "in-progress"
                                  ? t("hadith.resumeStage", { stage: progress.currentStage + 1 })
                                  : isMastered
                                    ? t("hadith.masteredStatus", {
                                        score: progress.bestScorePercent,
                                      })
                                    : t("hadith.estimatedTime")}
                            </span>
                          </span>
                          <ArrowRight
                            className="mt-3 size-5 text-primary rtl:rotate-180"
                            aria-hidden
                          />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        ) : (
          <section
            className="rounded-2xl border border-border bg-card p-8 text-center"
            role="status"
          >
            <h2 className="text-lg font-black text-foreground">{t("hadith.noResultsTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("hadith.noResultsDescription")}</p>
          </section>
        )}
      </div>
    </main>
  );
}
