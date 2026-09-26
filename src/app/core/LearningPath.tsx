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
  MessagesSquare,
  Briefcase,
} from "lucide-react";
import type { Action } from "../types";
import { COURSE_UNITS, LEARNING_PATH_UNIT_IDS, type CourseUnit } from "../data/lessons";
import { CEFR_STAGES } from "../data/curriculumSequence";
import { getUnitCurriculumDesign } from "../learning/curriculumModel";
import { recommendPathUnit } from "../learning/recommendPathUnit";
import { useProgress } from "../data/progress";
import { useLearner } from "../context/LearnerContext";
import { useI18n } from "../context/I18nContext";
import { Badge, ProgressBar, PageHeader, Button } from "../shared";
import { resolveAssetUrl } from "../../utils/assetUrl";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface PathUnit {
  unit: CourseUnit;
  familiar: number;
  mastered: number;
  due: number;
  percent: number;
}

export const LearningPath = memo(function LearningPath({ dispatch }: Props) {
  const { t } = useI18n();
  const { progress } = useProgress();
  const { state: learnerState } = useLearner();

  const pathUnits = useMemo<PathUnit[]>(() => {
    const now = new Date().toISOString();
    return LEARNING_PATH_UNIT_IDS.map((unitId) => COURSE_UNITS[unitId])
      .filter((unit): unit is CourseUnit => Boolean(unit))
      .map((unit) => {
        const familiar = unit.wordIds.filter((wordId) =>
          ["familiar", "strong"].includes(progress.wordMemory[wordId]?.mastery ?? "new")
        ).length;
        const mastered = unit.wordIds.filter(
          (wordId) => (progress.wordMastery[wordId] ?? 0) >= 3
        ).length;
        const due = unit.wordIds.filter((wordId) => {
          const nextReviewAt = progress.wordMemory[wordId]?.nextReviewAt;
          return Boolean(nextReviewAt && nextReviewAt <= now);
        }).length;
        return {
          unit,
          familiar,
          mastered,
          due,
          percent: unit.wordIds.length ? Math.round((mastered / unit.wordIds.length) * 100) : 0,
        };
      });
  }, [progress.wordMastery, progress.wordMemory]);

  const recommendedUnit = recommendPathUnit(
    pathUnits.map((item) => item.unit),
    learnerState.preferences.startingUnitId,
    progress.wordMemory
  );
  const totalWords = pathUnits.reduce((sum, item) => sum + item.unit.wordIds.length, 0);
  const masteredWords = pathUnits.reduce((sum, item) => sum + item.mastered, 0);
  const pathPercent = totalWords ? Math.round((masteredWords / totalWords) * 100) : 0;

  const recommendedIndex = pathUnits.findIndex((item) => item.unit.id === recommendedUnit?.id);
  const currentPhaseIndex = Math.max(
    0,
    CEFR_STAGES.findIndex(
      (stage) => recommendedIndex >= stage.start && recommendedIndex < stage.end
    )
  );
  const [expandedPhase, setExpandedPhase] = useState(currentPhaseIndex);
  const [showPictureWorldPath, setShowPictureWorldPath] = useState(false);

  if (!recommendedUnit) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-0 sm:p-2 lg:p-4">
        <section
          aria-labelledby="learning-path-empty-heading"
          className="rounded-3xl border border-border bg-wp-card p-5 text-center sm:p-6"
        >
          <h1
            id="learning-path-empty-heading"
            className="font-sans text-xl font-black text-foreground sm:text-2xl"
          >
            {t("learn.emptyRecommendedTitle")}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
            {t("learn.emptyRecommendedDesc")}
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => dispatch({ type: "GO", to: "library" })}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-wp-md hover:opacity-90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Library className="size-5" aria-hidden />
              <span>{t("learn.browseLibrary")}</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "GO", to: "home" })}
              className="flex min-h-[48px] items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold text-primary underline underline-offset-4 hover:bg-primary/5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("nav.home")}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-0 sm:p-2 lg:p-4">
      <PageHeader
        variant="hero"
        eyebrow={
          <span className="flex items-center gap-2 text-xs font-bold text-primary">
            <Route className="size-4" aria-hidden />
            <span>{t("learn.pathBadge")}</span>
          </span>
        }
        title={t("learn.title")}
        subtitle={t("learn.subtitle")}
        actions={
          <Button
            variant="outline"
            size="md"
            iconLeft={<Library className="size-4" aria-hidden />}
            onClick={() => dispatch({ type: "GO", to: "library" })}
          >
            {t("learn.pictureWorlds")}
          </Button>
        }
      />

      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label={t("learn.specialCurricula")}
      >
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "pronunciation-curriculum" })}
          className="group min-h-[180px] rounded-3xl border-2 border-primary/35 bg-primary/5 p-5 text-start shadow-wp-xs hover:border-primary hover:bg-primary/10 active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6"
        >
          <Headphones className="size-8 text-primary" aria-hidden />
          <p className="mt-4 text-xs font-black uppercase tracking-wide text-primary">
            {t("pronunciation.curriculumBadge")}
          </p>
          <h2 className="mt-1 text-xl font-black text-foreground">
            {t("pronunciation.curriculumTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("pronunciation.curriculumCardDescription", {
              completed: Object.values(learnerState.pronunciationProgress).filter(
                (item) => item.status === "mastered"
              ).length,
              total: 68,
            })}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 font-black text-primary">
            {t("pronunciation.viewCurriculum")}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
          </span>
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "hadith-curriculum" })}
          className="group min-h-[180px] rounded-3xl border-2 border-primary/35 bg-primary/5 p-5 text-start shadow-wp-xs hover:border-primary hover:bg-primary/10 active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6"
        >
          <BookOpen className="size-8 text-primary" aria-hidden />
          <p className="mt-4 text-xs font-black uppercase tracking-wide text-primary">
            {t("hadith.curriculumBadge")}
          </p>
          <h2 className="mt-1 text-xl font-black text-foreground">{t("hadith.curriculumTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("hadith.curriculumCardDescription", {
              completed: Object.values(learnerState.hadithProgress).filter(
                (item) => item.status === "mastered"
              ).length,
              total: 42,
            })}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 font-black text-primary">
            {t("hadith.viewCurriculum")}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
          </span>
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "conversation-curriculum" })}
          className="group min-h-[180px] rounded-3xl border-2 border-primary/35 bg-primary/5 p-5 text-start shadow-wp-xs hover:border-primary hover:bg-primary/10 active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6"
        >
          <MessagesSquare className="size-8 text-primary" aria-hidden />
          <p className="mt-4 text-xs font-black uppercase tracking-wide text-primary">
            {t("conversation.badge")}
          </p>
          <h2 className="mt-1 text-xl font-black text-foreground">{t("conversation.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("conversation.completedUnits", {
              completed: Object.values(learnerState.conversationProgress ?? {}).filter(
                (item) => item.status === "mastered"
              ).length,
              total: 40,
            })}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 font-black text-primary">
            {t("conversation.exploreUnits")}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
          </span>
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "business-curriculum" })}
          className="group min-h-[180px] rounded-3xl border-2 border-primary/35 bg-primary/5 p-5 text-start shadow-wp-xs hover:border-primary hover:bg-primary/10 active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6"
        >
          <Briefcase className="size-8 text-primary" aria-hidden />
          <p className="mt-4 text-xs font-black uppercase tracking-wide text-primary">
            {t("business.badge")}
          </p>
          <h2 className="mt-1 text-xl font-black text-foreground">{t("business.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("business.completedUnits", {
              completed: Object.values(learnerState.businessProgress ?? {}).filter(
                (item) => item.status === "mastered"
              ).length,
              total: 40,
            })}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 font-black text-primary">
            {t("business.exploreUnits")}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
          </span>
        </button>
      </section>

      <section
        aria-labelledby="recommended-heading"
        className="grid gap-5 rounded-3xl border-2 border-primary/35 bg-primary/5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
            <Sparkles className="size-4" aria-hidden />
            <span>{t("learn.recommendedWorld")}</span>
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
            {t("learn.routeBadge")}
          </span>
          <span className="mt-1 block text-xl font-black text-foreground">
            {t("learn.routeToggle")}
          </span>
          <span className="mt-1 block text-sm font-medium text-muted-foreground">
            {t("learn.routeHint")}
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
              {t("learn.routeLabel")}
            </p>
            <h2 className="mt-1 text-xl font-black text-foreground">{t("learn.routeHeading")}</h2>
            <p className="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
              {t("learn.routeDescription")}
            </p>
            <div className="mt-4 max-w-xl">
              <ProgressBar
                progressPercent={pathPercent}
                label={t("learn.routeMastery")}
                labelRight={`${masteredWords}/${totalWords}`}
                ariaLabel={t("learn.routeMasteryAria", {
                  mastered: masteredWords,
                  total: totalWords,
                })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {CEFR_STAGES.map((stage, phaseIndex) => {
              const units = pathUnits.slice(stage.start, stage.end);
              const isExpanded = expandedPhase === phaseIndex;
              const completedCount = units.filter((item) => item.percent === 100).length;
              return (
                <section
                  key={stage.id}
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
                        {stage.label}
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                        {t("learn.phaseSummary", {
                          complete: completedCount,
                          total: units.length,
                          start: stage.start + 1,
                          end: stage.end,
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
                      {units.map(({ unit, familiar, mastered, due, percent }, index) => {
                        const step = stage.start + index + 1;
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
                              className={`group flex min-h-[96px] w-full items-center justify-between gap-3.5 rounded-2xl border p-3 text-start transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-4 sm:p-3.5 ${
                                isCurrent
                                  ? "border-primary/50 bg-primary/10 shadow-wp-xs"
                                  : "border-border bg-wp-card hover:border-primary/35 hover:bg-muted/30"
                              }`}
                              aria-current={isCurrent ? "step" : undefined}
                            >
                              {/* Media Anchor with Floating Step Badge */}
                              <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/40 shadow-wp-xs sm:w-20">
                                {unit.heroImage ? (
                                  <img
                                    src={resolveAssetUrl(unit.heroImage)}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex size-full items-center justify-center bg-primary/10 text-primary">
                                    <BookOpen className="size-6" aria-hidden />
                                  </div>
                                )}
                                <span
                                  className={`absolute start-1 top-1 flex size-6 items-center justify-center rounded-md text-xs font-black shadow-wp-xs backdrop-blur-sm ${
                                    isComplete
                                      ? "bg-wp-green text-wp-text-on-green"
                                      : isCurrent
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-border/50 bg-card/90 text-foreground"
                                  }`}
                                >
                                  {isComplete ? (
                                    <CheckCircle2 className="size-3.5" aria-hidden />
                                  ) : (
                                    step
                                  )}
                                </span>
                              </div>

                              {/* Center Information */}
                              <div className="min-w-0 flex-1 flex-col justify-center gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-sans text-sm font-black text-foreground sm:text-base leading-snug">
                                    {unit.name}
                                  </span>
                                  <Badge variant="primary" size="sm">
                                    {design.reviewStatus === "authored"
                                      ? design.cefr
                                      : t("study.suggestedLevel", { level: design.cefr })}
                                  </Badge>
                                </div>
                                <p className="mt-0.5 line-clamp-1 text-xs font-medium text-muted-foreground sm:text-sm">
                                  {design.outcome}
                                </p>
                                {(familiar > 0 || mastered > 0 || isCurrent) && (
                                  <span className="mt-1 block text-xs font-semibold text-primary">
                                    {t("learn.wordProgress", {
                                      familiar,
                                      mastered,
                                      due,
                                      total: unit.wordIds.length,
                                    })}
                                  </span>
                                )}
                              </div>

                              {/* Trailing Arrow */}
                              <ArrowRight
                                className="size-5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary rtl:rotate-180"
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
