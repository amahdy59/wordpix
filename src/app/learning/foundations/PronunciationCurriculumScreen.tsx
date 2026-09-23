import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Headphones, Search, Volume2 } from "lucide-react";
import type { Action } from "../../types";
import { useLearner } from "../../context/LearnerContext";
import { useI18n } from "../../../i18n";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  PRONUNCIATION_CHAPTERS,
  getFigmaPronunciationActivityData,
} from "./figmaPronunciationCatalog";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export function PronunciationCurriculumScreen({ dispatch }: Props) {
  const { t } = useI18n();
  const { state } = useLearner();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("en-US");
  const completed = Object.values(state.pronunciationProgress).filter(
    (entry) => entry.status === "mastered"
  ).length;
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
          if (!normalizedQuery) return true;
          const activity = getFigmaPronunciationActivityData(lesson.number);
          return `${lesson.number} ${activity.title} ${activity.objective}`
            .toLocaleLowerCase("en-US")
            .includes(normalizedQuery);
        }),
      })).filter((chapter) => chapter.lessons.length > 0),
    [normalizedQuery]
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

        <header className="grid gap-6 rounded-3xl border-2 border-primary/35 bg-gradient-to-br from-primary/15 via-card to-card p-5 shadow-wp-sm sm:p-8 lg:grid-cols-[1fr_280px] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              {t("pronunciation.curriculumBadge")}
            </p>
            <h1
              id="pronunciation-curriculum-title"
              className="mt-2 text-3xl font-black tracking-tight sm:text-4xl"
            >
              {t("pronunciation.curriculumTitle")}
            </h1>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-muted-foreground sm:text-base">
              {t("pronunciation.curriculumDescription")}
            </p>
            <p className="mt-4 font-black text-primary">
              {t("pronunciation.curriculumProgress", {
                completed,
                total: FIGMA_PRONUNCIATION_LESSONS.length,
              })}
            </p>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "OPEN_FIGMA_PRONUNCIATION", lessonNumber: nextLesson.number })
              }
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-black text-primary-foreground shadow-wp-md hover:opacity-90 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
            >
              <Headphones className="size-5" aria-hidden />
              {t("pronunciation.continueCurriculum", { number: nextLesson.number })}
            </button>
          </div>
          <img
            src={resolveAssetUrl(
              `pronunciation/v1/lesson-${String(nextLesson.number).padStart(2, "0")}.png`
            )}
            alt=""
            className="hidden aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-wp-sm lg:block"
            aria-hidden
          />
        </header>

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

        {chapters.length ? (
          <div className="space-y-5">
            {chapters.map((chapter) => {
              const chapterCompleted = chapter.lessons.filter(
                (lesson) =>
                  state.pronunciationProgress[`lesson-${String(lesson.number).padStart(2, "0")}`]
                    ?.status === "mastered"
              ).length;
              return (
                <section
                  key={chapter.start}
                  className="rounded-3xl border border-border bg-card p-4 shadow-wp-xs sm:p-6"
                >
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-primary">
                        {t("pronunciation.chapterNumber", { number: chapter.index + 1 })}
                      </p>
                      <h2 className="mt-1 text-xl font-black text-foreground">
                        {t(chapter.titleKey)}
                      </h2>
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
                      const activity = getFigmaPronunciationActivityData(lesson.number);
                      const progress =
                        state.pronunciationProgress[
                          `lesson-${String(lesson.number).padStart(2, "0")}`
                        ];
                      const mastered = progress?.status === "mastered";
                      return (
                        <li key={lesson.number}>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch({
                                type: "OPEN_FIGMA_PRONUNCIATION",
                                lessonNumber: lesson.number,
                              })
                            }
                            className="grid min-h-[118px] w-full grid-cols-[auto_1fr_auto] items-start gap-3 rounded-2xl border border-border bg-background p-4 text-start hover:border-primary/50 hover:bg-primary/5 active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            <span
                              className={`flex size-11 items-center justify-center rounded-xl font-black ${mastered ? "bg-wp-green text-wp-text-on-green" : "bg-primary/10 text-primary"}`}
                            >
                              {mastered ? (
                                <CheckCircle2 className="size-5" aria-hidden />
                              ) : (
                                lesson.number
                              )}
                            </span>
                            <span className="min-w-0">
                              <span
                                className="block font-black text-foreground"
                                lang="en"
                                dir="ltr"
                              >
                                {activity.title}
                              </span>
                              <span
                                className="mt-1 line-clamp-2 block text-sm leading-5 text-muted-foreground"
                                lang="en"
                                dir="ltr"
                              >
                                {activity.objective}
                              </span>
                              <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">
                                <Volume2 className="size-4" aria-hidden />
                                {progress?.status === "in-progress"
                                  ? t("pronunciation.resumeStage", {
                                      stage: progress.currentStage + 1,
                                    })
                                  : mastered
                                    ? t("pronunciation.masteredScore", {
                                        score: progress.bestScorePercent,
                                      })
                                    : t("pronunciation.lessonFormat")}
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
    </main>
  );
}
