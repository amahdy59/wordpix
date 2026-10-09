import { HelpDisclosure } from "../shared/HelpDisclosure";
import { memo, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Library,
  Route,
  Sparkles,
  Headphones,
  MessagesSquare,
  Briefcase,
} from "lucide-react";
import type { Action } from "../types";
import { COURSE_UNITS, LEARNING_PATH_UNIT_IDS, type CourseUnit } from "../data/courseCatalog";
import { CEFR_STAGES } from "../data/curriculumSequence";
import { getUnitCurriculumDesign } from "../learning/curriculumModel";
import { recommendPathUnit } from "../learning/recommendPathUnit";
import { useProgress } from "../data/progress";
import { useLearner } from "../context/LearnerContext";
import { useI18n } from "../context/I18nContext";
import { CurriculumTopicCard, ProgressBar, PageContainer, PageHeader, Button } from "../shared";
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

  const pronunciationMastered = useMemo(
    () =>
      Object.values(learnerState.pronunciationProgress).filter((item) => item.status === "mastered")
        .length,
    [learnerState.pronunciationProgress]
  );
  const hadithMastered = useMemo(
    () =>
      Object.values(learnerState.hadithProgress).filter((item) => item.status === "mastered")
        .length,
    [learnerState.hadithProgress]
  );
  const conversationMastered = useMemo(
    () =>
      Object.values(learnerState.conversationProgress ?? {}).filter(
        (item) => item.status === "mastered"
      ).length,
    [learnerState.conversationProgress]
  );
  const businessMastered = useMemo(
    () =>
      Object.values(learnerState.businessProgress ?? {}).filter(
        (item) => item.status === "mastered"
      ).length,
    [learnerState.businessProgress]
  );

  if (!recommendedUnit) {
    return (
      <PageContainer size="wide">
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
          <p className="mx-auto mt-2 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground">
            {t("learn.emptyRecommendedDesc")}
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => dispatch({ type: "GO", to: "library" })}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-wp-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Library className="size-5" aria-hidden />
              <span>{t("learn.browseLibrary")}</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "GO", to: "home" })}
              className="flex min-h-[48px] items-center justify-center rounded-2xl px-6 py-3 text-base font-bold text-primary underline underline-offset-4 hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("nav.home")}
            </button>
          </div>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="wide">
      <PageHeader
        variant="hero"
        eyebrow={
          <span className="flex items-center gap-2 text-sm font-bold text-primary">
            <Route className="size-4" aria-hidden />
            <span>{t("learn.pathBadge")}</span>
          </span>
        }
        title={t("learn.title")}
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
        aria-labelledby="recommended-heading"
        className="grid gap-5 rounded-3xl border-2 border-primary/35 bg-secondary p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
            <Sparkles className="size-4" aria-hidden />
            <span>{t("learn.recommendedWorld")}</span>
          </div>
          <h2 id="recommended-heading" className="text-xl font-black text-foreground sm:text-2xl">
            {recommendedUnit.name}
          </h2>
          <HelpDisclosure label={t("help.aboutLesson")}>
            <p>{getUnitCurriculumDesign(recommendedUnit).outcome}</p>
          </HelpDisclosure>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "lesson-entry", unitId: recommendedUnit.id })}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-wp-md motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transform-none lg:w-auto"
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
          <span className="block text-sm font-black uppercase tracking-wide text-primary">
            {t("learn.routeBadge")}
          </span>
          <span className="mt-1 block text-xl font-black text-foreground">
            {t("learn.routeToggle")}
          </span>
          <span className="mt-1 block text-base font-medium text-muted-foreground">
            {t("learn.routeHint")}
          </span>
        </span>
        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground motion-safe:transition-transform ${showPictureWorldPath ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {showPictureWorldPath && (
        <div id="picture-world-path" className="contents">
          <div className="rounded-2xl border border-border bg-wp-card p-4 sm:p-5">
            <p className="text-sm font-black uppercase tracking-wide text-primary">
              {t("learn.routeLabel")}
            </p>
            <h2 className="mt-1 text-xl font-black text-foreground">{t("learn.routeHeading")}</h2>

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
                      <span className="mt-0.5 block text-sm font-semibold text-muted-foreground">
                        {t("learn.phaseSummary", {
                          complete: completedCount,
                          total: units.length,
                          start: stage.start + 1,
                          end: stage.end,
                        })}
                      </span>
                    </span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-muted-foreground motion-safe:transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>

                  {isExpanded && (
                    <ol
                      id={`path-phase-content-${phaseIndex}`}
                      className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {units.map(({ unit, familiar, mastered, due, percent }, index) => {
                        const step = stage.start + index + 1;
                        const design = getUnitCurriculumDesign(unit);
                        const isCurrent = unit.id === recommendedUnit.id;
                        const isComplete = percent === 100;

                        return (
                          <li key={unit.id}>
                            <CurriculumTopicCard
                              numberBadge={step}
                              levelBadge={
                                design.reviewStatus === "authored"
                                  ? design.cefr
                                  : t("study.suggestedLevel", { level: design.cefr })
                              }
                              isMastered={isComplete}
                              isCurrent={isCurrent}
                              title={unit.name}
                              imageSrc={
                                unit.heroImage ? resolveAssetUrl(unit.heroImage) : undefined
                              }
                              fallbackIcon={<BookOpen className="size-8" aria-hidden />}
                              priority={index < 3}
                              tooltipText={design.outcome}
                              statusText={
                                familiar > 0 || mastered > 0 || isCurrent
                                  ? t("learn.wordProgress", {
                                      familiar,
                                      mastered,
                                      due,
                                      total: unit.wordIds.length,
                                    })
                                  : t("explore.wordsBadge", { count: unit.wordIds.length })
                              }
                              statusClassName={
                                familiar > 0 || mastered > 0 || isCurrent
                                  ? "text-primary"
                                  : "text-muted-foreground font-semibold"
                              }
                              onClick={() =>
                                dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id })
                              }
                            />
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
      <section className="flex flex-col gap-4 mt-2" aria-label={t("learn.specialCurricula")}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            <h2 className="font-sans text-xl font-black text-foreground">
              {t("learn.specialCurricula")}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "pronunciation-curriculum" })}
            className="group min-h-[160px] rounded-3xl border border-border bg-wp-card p-5 text-start shadow-wp-xs hover:border-primary/60 hover:bg-secondary motion-safe:active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <Headphones className="size-7 text-primary" aria-hidden />
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold text-primary border border-primary/20">
                  {t("learn.pronunciationScope")}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-black text-foreground">
                {t("pronunciation.curriculumTitle")}
              </h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {t("help.completed", {
                  completed: pronunciationMastered,
                  total: 68,
                })}
              </p>
              <div className="mt-2.5">
                <ProgressBar
                  progressPercent={Math.round((pronunciationMastered / 68) * 100)}
                  ariaLabel={t("pronunciation.curriculumTitle")}
                  size="sm"
                />
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-primary">
              {t("pronunciation.viewCurriculum")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "hadith-curriculum" })}
            className="group min-h-[160px] rounded-3xl border border-border bg-wp-card p-5 text-start shadow-wp-xs hover:border-primary/60 hover:bg-secondary motion-safe:active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <BookOpen className="size-7 text-primary" aria-hidden />
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold text-primary border border-primary/20">
                  {t("learn.hadithScope")}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-black text-foreground">
                {t("hadith.curriculumTitle")}
              </h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {t("help.completed", {
                  completed: hadithMastered,
                  total: 42,
                })}
              </p>
              <div className="mt-2.5">
                <ProgressBar
                  progressPercent={Math.round((hadithMastered / 42) * 100)}
                  ariaLabel={t("hadith.curriculumTitle")}
                  size="sm"
                />
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-primary">
              {t("hadith.viewCurriculum")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "conversation-curriculum" })}
            className="group min-h-[160px] rounded-3xl border border-border bg-wp-card p-5 text-start shadow-wp-xs hover:border-primary/60 hover:bg-secondary motion-safe:active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <MessagesSquare className="size-7 text-primary" aria-hidden />
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold text-primary border border-primary/20">
                  {t("learn.conversationScope")}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-black text-foreground">{t("conversation.title")}</h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {t("conversation.completedUnits", {
                  completed: conversationMastered,
                  total: 40,
                })}
              </p>
              <div className="mt-2.5">
                <ProgressBar
                  progressPercent={Math.round((conversationMastered / 40) * 100)}
                  ariaLabel={t("conversation.title")}
                  size="sm"
                />
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-primary">
              {t("conversation.exploreUnits")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "business-curriculum" })}
            className="group min-h-[160px] rounded-3xl border border-border bg-wp-card p-5 text-start shadow-wp-xs hover:border-primary/60 hover:bg-secondary motion-safe:active:scale-[0.995] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <Briefcase className="size-7 text-primary" aria-hidden />
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold text-primary border border-primary/20">
                  {t("learn.businessScope")}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-black text-foreground">{t("business.title")}</h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {t("business.completedUnits", {
                  completed: businessMastered,
                  total: 40,
                })}
              </p>
              <div className="mt-2.5">
                <ProgressBar
                  progressPercent={Math.round((businessMastered / 40) * 100)}
                  ariaLabel={t("business.title")}
                  size="sm"
                />
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-primary">
              {t("business.exploreUnits")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </span>
          </button>
        </div>
      </section>
    </PageContainer>
  );
});
