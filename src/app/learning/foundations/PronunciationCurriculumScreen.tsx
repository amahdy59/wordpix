import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, Headphones, Search } from "lucide-react";
import type { Action } from "../../types";
import { useLearner } from "../../context/LearnerContext";
import { useI18n } from "../../../i18n";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { CurriculumFilterTabs } from "../../shared/CurriculumFilterTabs";
import { CurriculumHeroHeader } from "../../shared/CurriculumHeroHeader";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  PRONUNCIATION_CHAPTERS,
  getFigmaPronunciationActivityData,
} from "./figmaPronunciationCatalog";
import { PronunciationLessonCard } from "./PronunciationLessonCard";
import { PronunciationLessonInfoModal } from "./PronunciationLessonInfoModal";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export function PronunciationCurriculumScreen({ dispatch }: Props) {
  const { t } = useI18n();
  const { state } = useLearner();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "due" | "in-progress" | "mastered">("all");
  const [selectedLessonForInfo, setSelectedLessonForInfo] = useState<number | null>(null);
  const [now] = useState(() => Date.now());
  const normalizedQuery = query.trim().toLocaleLowerCase("en-US");
  const completed = Object.values(state.pronunciationProgress).filter(
    (entry) => entry.status === "mastered"
  ).length;
  const isDue = useCallback(
    (nextReviewAt?: string) => {
      if (!nextReviewAt) return false;
      const dueDate = new Date(nextReviewAt);
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);
      return dueDate.getTime() <= todayEnd.getTime();
    },
    [now]
  );
  const due = FIGMA_PRONUNCIATION_LESSONS.filter((lesson) => {
    const item = state.pronunciationProgress[`lesson-${String(lesson.number).padStart(2, "0")}`];
    return isDue(item?.nextReviewAt);
  }).length;
  const nextLesson =
    FIGMA_PRONUNCIATION_LESSONS.find((lesson) => {
      const status =
        state.pronunciationProgress[`lesson-${String(lesson.number).padStart(2, "0")}`]?.status;
      return status === "in-progress";
    }) ??
    FIGMA_PRONUNCIATION_LESSONS.find((lesson) => {
      const status =
        state.pronunciationProgress[`lesson-${String(lesson.number).padStart(2, "0")}`]?.status;
      return status !== "mastered";
    }) ??
    FIGMA_PRONUNCIATION_LESSONS[0];
  const chapters = useMemo(
    () =>
      PRONUNCIATION_CHAPTERS.map((chapter, index) => ({
        ...chapter,
        index,
        lessons: FIGMA_PRONUNCIATION_LESSONS.filter((lesson) => {
          if (lesson.number < chapter.start || lesson.number > chapter.end) return false;
          const progress =
            state.pronunciationProgress[`lesson-${String(lesson.number).padStart(2, "0")}`];
          if (filter === "mastered" && progress?.status !== "mastered") return false;
          if (filter === "in-progress" && progress?.status !== "in-progress") return false;
          if (filter === "due" && !isDue(progress?.nextReviewAt)) return false;
          if (!normalizedQuery) return true;
          const activity = getFigmaPronunciationActivityData(lesson.number);
          return `${lesson.number} ${activity.title} ${activity.objective}`
            .toLocaleLowerCase("en-US")
            .includes(normalizedQuery);
        }),
      })).filter((chapter) => chapter.lessons.length > 0),
    [filter, isDue, normalizedQuery, state.pronunciationProgress]
  );

  return (
    <main
      className="h-full min-h-0 overflow-y-auto bg-background pb-24 overscroll-y-contain"
      aria-labelledby="pronunciation-curriculum-title"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-8">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "explore" })}
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-3 font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          {t("pronunciation.backToLearningPath")}
        </button>

        <CurriculumHeroHeader
          titleId="pronunciation-curriculum-title"
          badge={t("pronunciation.curriculumBadge")}
          title={t("pronunciation.curriculumTitle")}
          description={t("pronunciation.curriculumDescription")}
          metrics={[
            { label: t("pronunciation.summaryMastered"), value: completed },
            { label: t("pronunciation.summaryDue"), value: due },
            { label: t("pronunciation.summaryLessons"), value: FIGMA_PRONUNCIATION_LESSONS.length },
          ]}
          action={
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "OPEN_FIGMA_PRONUNCIATION", lessonNumber: nextLesson.number })
              }
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-black text-primary-foreground shadow-wp-md hover:opacity-90 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
            >
              <Headphones className="size-5" aria-hidden />
              {t("pronunciation.continueCurriculum", { number: nextLesson.number })}
            </button>
          }
          media={
            <img
              src={resolveAssetUrl(
                `pronunciation/v1/lesson-${String(nextLesson.number).padStart(2, "0")}.png`
              )}
              alt=""
              className="hidden aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-wp-sm lg:block"
              aria-hidden
            />
          }
        >
          <CurriculumFilterTabs
            label={t("pronunciation.filtersLabel")}
            value={filter}
            onChange={setFilter}
            panelId="pronunciation-lesson-results"
            options={[
              {
                value: "all",
                label: t("pronunciation.filterAll"),
                count: FIGMA_PRONUNCIATION_LESSONS.length,
              },
              { value: "due", label: t("pronunciation.filterDue"), count: due },
              {
                value: "in-progress",
                label: t("pronunciation.filterInProgress"),
                count: Object.values(state.pronunciationProgress).filter(
                  (entry) => entry.status === "in-progress"
                ).length,
              },
              { value: "mastered", label: t("pronunciation.filterMastered"), count: completed },
            ]}
          />
        </CurriculumHeroHeader>

        <div>
          <label htmlFor="pronunciation-search" className="text-sm font-bold text-foreground">
            {t("pronunciation.searchLabel")}
          </label>
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id="pronunciation-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("pronunciation.searchPlaceholder")}
              className="min-h-12 w-full rounded-2xl border border-border bg-card py-3 ps-12 pe-4 text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>
        </div>

        {chapters.length > 1 && (
          <nav
            className="sticky top-2 z-10 rounded-2xl border border-border bg-background/95 p-2 shadow-wp-sm backdrop-blur"
            aria-label={t("pronunciation.chapterJumpLabel")}
          >
            <div className="flex snap-x gap-2 overflow-x-auto pb-1">
              {chapters.map((chapter) => (
                <button
                  key={chapter.start}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(`pronunciation-chapter-${chapter.index + 1}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="min-h-11 shrink-0 snap-start rounded-xl border border-border bg-card px-3 text-sm font-black text-foreground hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {t("pronunciation.chapterShort", { number: chapter.index + 1 })}
                </button>
              ))}
            </div>
          </nav>
        )}

        {chapters.length ? (
          <div
            id="pronunciation-lesson-results"
            role="tabpanel"
            aria-labelledby={`pronunciation-lesson-results-tab-${filter}`}
            className="space-y-5"
          >
            {chapters.map((chapter) => {
              const chapterCompleted = chapter.lessons.filter(
                (lesson) =>
                  state.pronunciationProgress[`lesson-${String(lesson.number).padStart(2, "0")}`]
                    ?.status === "mastered"
              ).length;
              return (
                <section
                  key={chapter.start}
                  id={`pronunciation-chapter-${chapter.index + 1}`}
                  className="scroll-mt-24 rounded-3xl border border-border bg-card p-4 shadow-wp-xs sm:p-6"
                >
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-primary">
                        {t("pronunciation.chapterNumber", { number: chapter.index + 1 })}
                      </p>
                      <h2 className="mt-1 text-xl font-black text-foreground">
                        {t(chapter.titleKey)}
                      </h2>
                      <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-muted-foreground">
                        {t(chapter.descriptionKey)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">
                      {t("pronunciation.chapterProgress", {
                        completed: chapterCompleted,
                        total: chapter.end - chapter.start + 1,
                      })}
                    </p>
                  </div>
                  <ol className="mt-4 grid gap-3 md:grid-cols-2">
                    {chapter.lessons.map((lesson) => {
                      const progress =
                        state.pronunciationProgress[
                          `lesson-${String(lesson.number).padStart(2, "0")}`
                        ];
                      const mastered = progress?.status === "mastered";
                      return (
                        <PronunciationLessonCard
                          key={lesson.number}
                          lesson={lesson}
                          mastered={mastered}
                          isDue={isDue(progress?.nextReviewAt)}
                          progress={progress}
                          onStartLesson={(number) =>
                            dispatch({
                              type: "OPEN_FIGMA_PRONUNCIATION",
                              lessonNumber: number,
                            })
                          }
                          onOpenDetails={(number) => setSelectedLessonForInfo(number)}
                        />
                      );
                    })}
                  </ol>
                </section>
              );
            })}
          </div>
        ) : (
          <section
            className="rounded-2xl border border-border bg-card p-8 text-center"
            role="status"
          >
            <h2 className="text-lg font-black text-foreground">
              {t("pronunciation.noResultsTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("pronunciation.noResultsDescription")}
            </p>
          </section>
        )}
      </div>

      <PronunciationLessonInfoModal
        lessonNumber={selectedLessonForInfo}
        onClose={() => setSelectedLessonForInfo(null)}
        onStartLesson={(lessonNumber) =>
          dispatch({
            type: "OPEN_FIGMA_PRONUNCIATION",
            lessonNumber,
          })
        }
      />
    </main>
  );
}
