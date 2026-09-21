import { memo, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Library,
  Route,
  Sparkles,
  Headphones,
  RotateCcw,
} from "lucide-react";
import type { Action } from "../types";
import { COURSE_UNITS, type CourseUnit } from "../data/lessons";
import { FOUNDATION_SEQUENCE } from "../data/curriculumSequence";
import { getUnitCurriculumDesign } from "../learning/curriculumModel";
import { useProgress } from "../data/progress";
import { useLearner } from "../context/LearnerContext";
import { useI18n } from "../context/I18nContext";
import { Badge, ProgressBar } from "../shared";
import {
  FOUNDATION_LESSONS,
  FOUNDATION_LESSON_IDS,
  FOUNDATION_STAGES,
  getFoundationLesson,
} from "../learning/foundations/foundationCurriculum";
import { getRecommendedFoundationLessonId } from "../learning/foundations/foundationProgress";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface PathUnit {
  unit: CourseUnit;
  mastered: number;
  percent: number;
}

const PHASES = [
  { key: "learn.phaseFoundations", start: 0, end: 6 },
  { key: "learn.phasePeoplePlaces", start: 6, end: 12 },
  { key: "learn.phaseInteraction", start: 12, end: FOUNDATION_SEQUENCE.length },
] as const;

export const LearningPath = memo(function LearningPath({ dispatch }: Props) {
  const { t } = useI18n();
  const { progress } = useProgress();
  const { state: learnerState } = useLearner();

  const pathUnits = useMemo<PathUnit[]>(
    () =>
      FOUNDATION_SEQUENCE.map((unitId) => COURSE_UNITS[unitId])
        .filter((unit): unit is CourseUnit => Boolean(unit))
        .map((unit) => {
          const mastered = unit.wordIds.filter(
            (wordId) => (progress.wordMastery[wordId] ?? 0) >= 3
          ).length;
          return {
            unit,
            mastered,
            percent: unit.wordIds.length ? Math.round((mastered / unit.wordIds.length) * 100) : 0,
          };
        }),
    [progress.wordMastery]
  );

  const hasStartedLearning = Object.keys(progress.wordMemory).length > 0;
  const preferredUnit = COURSE_UNITS[learnerState.preferences.startingUnitId];
  const nextPathUnit = pathUnits.find((item) => item.percent < 100) ?? pathUnits.at(-1);
  const recommendedUnit = !hasStartedLearning && preferredUnit ? preferredUnit : nextPathUnit?.unit;
  const totalWords = pathUnits.reduce((sum, item) => sum + item.unit.wordIds.length, 0);
  const masteredWords = pathUnits.reduce((sum, item) => sum + item.mastered, 0);
  const pathPercent = totalWords ? Math.round((masteredWords / totalWords) * 100) : 0;

  const recommendedIndex = pathUnits.findIndex((item) => item.unit.id === recommendedUnit?.id);
  const currentPhaseIndex = Math.max(
    0,
    PHASES.findIndex((phase) => recommendedIndex >= phase.start && recommendedIndex < phase.end)
  );
  const [expandedPhase, setExpandedPhase] = useState(currentPhaseIndex);
  const [showAllFoundationLessons, setShowAllFoundationLessons] = useState(false);
  const [showPictureWorldPath, setShowPictureWorldPath] = useState(false);
  const foundationProgress = learnerState.foundationProgress;
  const completedFoundationLessons = FOUNDATION_LESSONS.filter(
    (lesson) => foundationProgress[lesson.id]?.status === "mastered"
  ).map((lesson) => lesson.id);
  const nextFoundationLesson = getFoundationLesson(
    getRecommendedFoundationLessonId(FOUNDATION_LESSON_IDS, foundationProgress)
  );
  const hasFoundationProgress = Object.keys(foundationProgress).length > 0;
  const foundationPercent = Math.round(
    (completedFoundationLessons.length / FOUNDATION_LESSONS.length) * 100
  );

  if (!recommendedUnit) return null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-0 sm:p-2 lg:p-4">
      <header className="grid gap-5 rounded-3xl border border-primary/25 bg-wp-card p-5 shadow-wp-sm sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
            <Route className="size-4" aria-hidden />
            <span>{t("learn.pathBadge")}</span>
          </div>
          <h1 className="font-sans text-2xl font-black leading-tight text-foreground sm:text-3xl">
            {t("learn.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
            {t("learn.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "library" })}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground hover:border-primary/40 hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Library className="size-5" aria-hidden />
          <span>Explore picture worlds</span>
        </button>
      </header>

      <section
        aria-labelledby="listening-foundations-heading"
        className="rounded-3xl border-2 border-primary/35 bg-primary/5 p-5 sm:p-6"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
              <Headphones className="size-4" aria-hidden />
              <span>Learn to read and communicate · Levels 0–13</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="listening-foundations-heading"
                className="text-xl font-black text-foreground sm:text-2xl"
              >
                Sounds, Reading, and Clear Communication
              </h2>
              <Badge variant="primary" size="sm">
                Pre-A1
              </Badge>
            </div>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
              Follow the core path from careful listening to first words, or test the optional
              pronunciation pilot. Every lesson remains open and progress is saved locally.
            </p>
            <div className="mt-4 max-w-xl">
              <ProgressBar
                progressPercent={foundationPercent}
                label="Lessons completed"
                labelRight={`${completedFoundationLessons.length}/${FOUNDATION_LESSONS.length}`}
                ariaLabel={`${completedFoundationLessons.length} of ${FOUNDATION_LESSONS.length} lessons complete`}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              dispatch({ type: "START_FOUNDATION_LESSON", lessonId: nextFoundationLesson.id })
            }
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-wp-md hover:opacity-90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary lg:w-auto"
          >
            {hasFoundationProgress ? (
              <CheckCircle2 className="size-5" aria-hidden />
            ) : (
              <Headphones className="size-5" aria-hidden />
            )}
            <span>
              {hasFoundationProgress
                ? `Continue: ${nextFoundationLesson.shortTitle}`
                : "Start Lesson 1"}
            </span>
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
          </button>
        </div>

        <div className="mt-6 grid gap-5" aria-label="Foundation curriculum stages">
          {FOUNDATION_STAGES.filter(
            (stage) =>
              showAllFoundationLessons ||
              stage.units.some((unit) =>
                unit.lessons.some((lesson) => lesson.id === nextFoundationLesson.id)
              )
          ).map((stage) => {
            const stageIndex = FOUNDATION_STAGES.findIndex(
              (candidate) => candidate.id === stage.id
            );
            return (
              <section
                key={stage.id}
                className="relative rounded-3xl border border-primary/25 bg-wp-card p-4 sm:p-5"
                aria-labelledby={`foundation-stage-${stage.id}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-base font-black text-primary-foreground"
                    aria-hidden
                  >
                    {stageIndex + 1}
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-primary">
                      Level {stage.level}
                    </p>
                    <h3
                      id={`foundation-stage-${stage.id}`}
                      className="mt-0.5 text-lg font-black text-foreground sm:text-xl"
                    >
                      {stage.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {stage.units.map((unit) => {
                    const unitMastered = unit.lessons.filter(
                      (lesson) => foundationProgress[lesson.id]?.status === "mastered"
                    ).length;
                    return (
                      <section
                        key={unit.id}
                        className="rounded-2xl border border-border bg-background p-3 sm:p-4"
                        aria-labelledby={`foundation-unit-${unit.id.replace(".", "-")}`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-black text-primary">Unit {unit.id}</p>
                            <h4
                              id={`foundation-unit-${unit.id.replace(".", "-")}`}
                              className="mt-0.5 font-black text-foreground"
                            >
                              {unit.title}
                            </h4>
                            <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
                              {unit.outcome}
                            </p>
                          </div>
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                            {unitMastered}/{unit.lessons.length}{" "}
                            {unit.lessons.some(
                              (lesson) => lesson.completionMode === "qualitative-routing"
                            )
                              ? "completed"
                              : "mastered"}
                          </span>
                        </div>
                        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                          {unit.lessons.map((lesson) => {
                            const lessonProgress = foundationProgress[lesson.id];
                            const isComplete = lessonProgress?.status === "mastered";
                            const needsPractice = lessonProgress?.status === "needs-practice";
                            const isRecommended = lesson.id === nextFoundationLesson.id;
                            return (
                              <li key={lesson.id}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    dispatch({
                                      type: "START_FOUNDATION_LESSON",
                                      lessonId: lesson.id,
                                    })
                                  }
                                  className={`flex min-h-[68px] w-full items-center gap-3 rounded-xl border p-3 text-start focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${isRecommended ? "border-primary/55 bg-primary/10 shadow-wp-xs" : "border-border bg-wp-card hover:border-primary/45 hover:bg-primary/5"}`}
                                  aria-current={isRecommended ? "step" : undefined}
                                >
                                  <span
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${isComplete ? "bg-wp-green text-wp-text-on-green" : isRecommended ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
                                  >
                                    {isComplete ? (
                                      <CheckCircle2 className="size-5" aria-hidden />
                                    ) : needsPractice ? (
                                      <RotateCcw className="size-5" aria-hidden />
                                    ) : (
                                      lesson.number
                                    )}
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block font-black leading-snug text-foreground">
                                      {lesson.shortTitle}
                                    </span>
                                    <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                                      {isComplete
                                        ? lesson.completionMode === "qualitative-routing"
                                          ? "Completed · evidence saved"
                                          : `Mastered · best ${lessonProgress.bestScorePercent}%`
                                        : needsPractice
                                          ? `Practice again · best ${lessonProgress.bestScorePercent}%`
                                          : lessonProgress?.status === "in-progress"
                                            ? `Resume · step ${lessonProgress.currentStep + 1}`
                                            : isRecommended
                                              ? "Start here"
                                              : lesson.reviewStatus === "pilot"
                                                ? "Pilot · qualitative progress"
                                                : lesson.audioOnly
                                                  ? "Listen and respond"
                                                  : "Sounds, letters, and words"}
                                    </span>
                                  </span>
                                  <ArrowRight
                                    className="size-4 shrink-0 text-primary rtl:rotate-180"
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
              </section>
            );
          })}
          <button
            type="button"
            onClick={() => setShowAllFoundationLessons((value) => !value)}
            aria-expanded={showAllFoundationLessons}
            className="min-h-12 rounded-xl border border-primary/25 bg-background px-5 py-3 text-sm font-bold text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {showAllFoundationLessons
              ? "Show only my current stage"
              : "Explore all lessons and the optional pronunciation course"}
          </button>
        </div>
      </section>

      <section
        aria-labelledby="recommended-heading"
        className="grid gap-5 rounded-3xl border-2 border-primary/35 bg-primary/5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
            <Sparkles className="size-4" aria-hidden />
            <span>Recommended picture world</span>
          </div>
          <h2 id="recommended-heading" className="text-xl font-black text-foreground sm:text-2xl">
            {recommendedUnit.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {getUnitCurriculumDesign(recommendedUnit).outcome}
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "lesson-entry", unitId: recommendedUnit.id })}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-wp-md hover:opacity-90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary lg:w-auto"
        >
          <BookOpen className="size-5" aria-hidden />
          <span>{t("learn.continueUnit")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </section>

      <button
        type="button"
        onClick={() => setShowPictureWorldPath((value) => !value)}
        aria-expanded={showPictureWorldPath}
        aria-controls="picture-world-path"
        className="flex min-h-[52px] w-full items-center justify-between gap-4 rounded-2xl border border-border bg-wp-card p-4 text-start focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5"
      >
        <span>
          <span className="block text-xs font-black uppercase tracking-wide text-primary">
            Optional practice
          </span>
          <span className="mt-1 block text-xl font-black text-foreground">
            Explore picture worlds
          </span>
          <span className="mt-1 block text-sm font-medium text-muted-foreground">
            Browse topic-based vocabulary separately from your core reading path.
          </span>
        </span>
        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform ${showPictureWorldPath ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {showPictureWorldPath && (
        <div id="picture-world-path" className="contents">
          <div className="rounded-2xl border border-border bg-wp-card p-4 sm:p-5">
            <p className="text-xs font-black uppercase tracking-wide text-primary">
              Explore by topic
            </p>
            <h2 className="mt-1 text-xl font-black text-foreground">Picture worlds</h2>
            <p className="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
              Build useful vocabulary through familiar places and interests. These topics support
              the reading journey, but they do not replace its ordered lessons.
            </p>
            <div className="mt-4 max-w-xl">
              <ProgressBar
                progressPercent={pathPercent}
                label="Picture-word mastery"
                labelRight={`${masteredWords}/${totalWords}`}
                ariaLabel={t("learn.foundationProgressAria", {
                  mastered: masteredWords,
                  total: totalWords,
                })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {PHASES.map((phase, phaseIndex) => {
              const units = pathUnits.slice(phase.start, phase.end);
              const isExpanded = expandedPhase === phaseIndex;
              const completedCount = units.filter((item) => item.percent === 100).length;
              return (
                <section
                  key={phase.key}
                  aria-labelledby={`path-phase-${phaseIndex}`}
                  className="rounded-2xl border border-border bg-wp-card p-3 sm:p-4"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedPhase(isExpanded ? -1 : phaseIndex)}
                    aria-expanded={isExpanded}
                    aria-controls={`path-phase-content-${phaseIndex}`}
                    className="flex min-h-[52px] w-full items-center justify-between gap-4 rounded-xl px-2 text-start focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span>
                      <span
                        id={`path-phase-${phaseIndex}`}
                        className="block font-sans text-lg font-black text-foreground sm:text-xl"
                      >
                        {t(phase.key)}
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                        {t("learn.phaseSummary", {
                          complete: completedCount,
                          total: units.length,
                          start: phase.start + 1,
                          end: phase.end,
                        })}
                      </span>
                    </span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>

                  {isExpanded && (
                    <ol id={`path-phase-content-${phaseIndex}`} className="mt-3 grid gap-3">
                      {units.map(({ unit, mastered, percent }, index) => {
                        const step = phase.start + index + 1;
                        const design = getUnitCurriculumDesign(unit);
                        const isCurrent = unit.id === recommendedUnit.id;
                        const isComplete = percent === 100;

                        return (
                          <li key={unit.id}>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id })
                              }
                              className={`grid min-h-[96px] w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border p-4 text-start transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-4 ${
                                isCurrent
                                  ? "border-primary/50 bg-primary/10 shadow-wp-xs"
                                  : "border-border bg-wp-card hover:border-primary/35 hover:bg-muted/30"
                              }`}
                              aria-current={isCurrent ? "step" : undefined}
                            >
                              <span
                                className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                                  isComplete
                                    ? "bg-wp-green text-wp-text-on-green"
                                    : isCurrent
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-foreground"
                                }`}
                              >
                                {isComplete ? (
                                  <CheckCircle2 className="size-5" aria-hidden />
                                ) : (
                                  step
                                )}
                              </span>

                              <span className="min-w-0">
                                <span className="flex flex-wrap items-center gap-2">
                                  <span className="font-sans text-sm font-black text-foreground sm:text-base">
                                    {unit.name}
                                  </span>
                                  <Badge variant="primary" size="sm">
                                    {design.cefr}
                                  </Badge>
                                </span>
                                <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                  {design.outcome}
                                </span>
                                {(mastered > 0 || isCurrent) && (
                                  <span className="mt-2 block text-xs font-semibold text-primary">
                                    {t("learn.wordsMastered", {
                                      mastered,
                                      total: unit.wordIds.length,
                                    })}
                                  </span>
                                )}
                              </span>

                              <ArrowRight
                                className="size-5 shrink-0 text-muted-foreground rtl:rotate-180"
                                aria-hidden
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
