import { useCallback, useEffect, useMemo, useState } from "react";
import { pronunciationMatches } from "./pronunciationSearch";
import { HelpDisclosure } from "../../shared/HelpDisclosure";
import { ArrowLeft, Headphones, Search } from "lucide-react";
import type { Action } from "../../types";
import { useLearner } from "../../context/LearnerContext";
import { useI18n } from "../../../i18n";
import { CurriculumFilterTabs } from "../../shared/CurriculumFilterTabs";
import { CurriculumHeroHeader } from "../../shared/CurriculumHeroHeader";
import { FIGMA_PRONUNCIATION_LESSONS, PRONUNCIATION_CHAPTERS } from "./figmaPronunciationCatalog";
import { PronunciationLessonCard } from "./PronunciationLessonCard";
import { PronunciationLessonInfoModal } from "./PronunciationLessonInfoModal";
import { Button, EmptyState } from "../../shared";

interface Props {
  dispatch: React.Dispatch<Action>;
}

type Filter = "all" | "due" | "in-progress" | "mastered";
function readBrowseState(): { query: string; filter: Filter } {
  try {
    const saved = JSON.parse(sessionStorage.getItem("wordpix:pronunciation-browse") ?? "{}") as {
      query?: unknown;
      filter?: unknown;
    };
    return {
      query: typeof saved.query === "string" ? saved.query : "",
      filter: ["all", "due", "in-progress", "mastered"].includes(String(saved.filter))
        ? (saved.filter as Filter)
        : "all",
    };
  } catch {
    return { query: "", filter: "all" };
  }
}

export function PronunciationCurriculumScreen({ dispatch }: Props) {
  const { t } = useI18n();
  const { state, setAccessibility } = useLearner();
  const [query, setQuery] = useState(() => readBrowseState().query);
  const [filter, setFilter] = useState<Filter>(() => readBrowseState().filter);
  const [selectedLessonForInfo, setSelectedLessonForInfo] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    try {
      sessionStorage.setItem("wordpix:pronunciation-browse", JSON.stringify({ query, filter }));
    } catch {
      /* Browsing still works when storage is unavailable. */
    }
  }, [query, filter]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      const current = new Date();
      setNow(current.getTime());
      const midnight = new Date(current);
      midnight.setHours(24, 0, 0, 0);
      timer = setTimeout(refresh, midnight.getTime() - current.getTime() + 100);
    };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const completed = FIGMA_PRONUNCIATION_LESSONS.filter(
    (lesson) =>
      state.pronunciationProgress[`lesson-${String(lesson.number).padStart(2, "0")}`]?.status ===
      "mastered"
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
    FIGMA_PRONUNCIATION_LESSONS.find((lesson) =>
      isDue(
        state.pronunciationProgress[`lesson-${String(lesson.number).padStart(2, "0")}`]
          ?.nextReviewAt
      )
    ) ??
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
          return pronunciationMatches(lesson.number, query);
        }),
      })).filter((chapter) => chapter.lessons.length > 0),
    [filter, isDue, query, state.pronunciationProgress]
  );

  if (state.accessibility.includePronunciation === false) {
    return (
      <div
        className="h-full min-h-0 overflow-y-auto bg-background pb-24 overscroll-y-contain"
        aria-labelledby="pronunciation-disabled-title"
      >
        <div className="wp-container-content wp-layout-gutter flex flex-col gap-6 py-6 sm:py-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: "GO", to: "learn" })}
            className="w-fit"
            iconLeft={<ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />}
          >
            {t("lessonShell.backToLearn")}
          </Button>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 text-center shadow-wp-xs sm:p-12">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Headphones className="size-8" aria-hidden />
            </div>
            <h1
              id="pronunciation-disabled-title"
              className="mt-4 text-2xl font-black text-foreground sm:text-3xl"
            >
              {t("pronunciation.disabledTitle")}
            </h1>
            <p className="mt-2 max-w-md text-base text-muted-foreground">
              {t("pronunciation.disabledNotice")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setAccessibility({ includePronunciation: true })}
              >
                {t("pronunciation.enableNow")}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => dispatch({ type: "GO", to: "learn" })}
              >
                {t("pronunciation.backToLearn")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full min-h-0 overflow-y-auto bg-background pb-24 overscroll-y-contain"
      aria-labelledby="pronunciation-curriculum-title"
    >
      <div className="wp-container-content wp-layout-gutter flex flex-col gap-4 py-4 sm:py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "GO", to: "learn" })}
          className="w-fit"
          iconLeft={<ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />}
        >
          {t("lessonShell.backToLearn")}
        </Button>

        <CurriculumHeroHeader
          titleId="pronunciation-curriculum-title"
          title={t("pronunciation.curriculumTitle")}
          metrics={[
            { label: t("pronunciation.summaryMastered"), value: completed },
            { label: t("pronunciation.summaryDue"), value: due },
            { label: t("pronunciation.summaryLessons"), value: FIGMA_PRONUNCIATION_LESSONS.length },
          ]}
          action={
            <Button
              size="lg"
              fullWidth
              onClick={() =>
                dispatch({ type: "OPEN_FIGMA_PRONUNCIATION", lessonNumber: nextLesson.number })
              }
              className="sm:w-auto"
              iconLeft={<Headphones className="size-5" aria-hidden />}
            >
              {t(
                state.pronunciationProgress[`lesson-${String(nextLesson.number).padStart(2, "0")}`]
                  ?.status === "in-progress"
                  ? "lessonShell.resumeLesson"
                  : completed === FIGMA_PRONUNCIATION_LESSONS.length ||
                      isDue(
                        state.pronunciationProgress[
                          `lesson-${String(nextLesson.number).padStart(2, "0")}`
                        ]?.nextReviewAt
                      )
                    ? "lessonShell.reviewLesson"
                    : "lessonShell.startLesson",
                { number: nextLesson.number }
              )}
            </Button>
          }
        >
          <HelpDisclosure
            label={t("lessonShell.filterSummary", {
              filter: t(
                filter === "all"
                  ? "pronunciation.filterAll"
                  : filter === "due"
                    ? "pronunciation.filterDue"
                    : filter === "in-progress"
                      ? "pronunciation.filterInProgress"
                      : "pronunciation.filterMastered"
              ),
            })}
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
          </HelpDisclosure>
        </CurriculumHeroHeader>

        <div>
          <label htmlFor="pronunciation-search" className="text-base font-bold text-foreground">
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
            className="border-b border-border pb-2"
            aria-label={t("pronunciation.chapterJumpLabel")}
          >
            <label className="flex flex-wrap items-center gap-2 text-base font-bold sm:hidden">
              <span className="sr-only">{t("pronunciation.chapterJumpLabel")}</span>
              <select
                className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
                defaultValue=""
                onChange={(event) => {
                  document.getElementById(event.target.value)?.scrollIntoView({ block: "start" });
                }}
              >
                <option value="" disabled>
                  {t("lessonShell.chooseChapter")}
                </option>
                {chapters.map((chapter) => (
                  <option key={chapter.start} value={`pronunciation-chapter-${chapter.index + 1}`}>
                    {t(chapter.titleKey)}
                  </option>
                ))}
              </select>
            </label>
            <div className="hidden flex-wrap gap-2 sm:flex">
              {chapters.map((chapter) => (
                <button
                  key={chapter.start}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(`pronunciation-chapter-${chapter.index + 1}`)
                      ?.scrollIntoView({
                        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                          ? "auto"
                          : "smooth",
                        block: "start",
                      })
                  }
                  className="min-h-11 shrink-0 snap-start rounded-xl border border-border bg-card px-3 text-base font-black text-foreground hover:border-primary/50 hover:bg-secondary motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
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
              const chapterCompleted = FIGMA_PRONUNCIATION_LESSONS.filter(
                (lesson) => lesson.number >= chapter.start && lesson.number <= chapter.end
              ).filter(
                (lesson) =>
                  state.pronunciationProgress[`lesson-${String(lesson.number).padStart(2, "0")}`]
                    ?.status === "mastered"
              ).length;
              return (
                <section
                  key={chapter.start}
                  id={`pronunciation-chapter-${chapter.index + 1}`}
                  className="scroll-mt-4 border-b border-border pb-5"
                >
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="mt-1 text-xl font-black text-foreground">
                        {t(chapter.titleKey)}
                      </h2>
                    </div>
                    <p className="text-base font-bold text-muted-foreground">
                      {t("pronunciation.chapterProgress", {
                        completed: chapterCompleted,
                        total: chapter.end - chapter.start + 1,
                      })}
                    </p>
                  </div>
                  <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
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
          <EmptyState
            title={t("pronunciation.noResultsTitle")}
            description={t("pronunciation.noResultsDescription")}
            live="polite"
            action={
              <Button
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                {t("lessonShell.resetFilters")}
              </Button>
            }
          />
        )}
        <HelpDisclosure label={t("help.aboutCourse")}>
          <p>{t("pronunciation.curriculumDescription")}</p>
        </HelpDisclosure>
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
    </div>
  );
}
