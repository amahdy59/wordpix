import { useEffect, useMemo, useRef, useState, type Dispatch } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Action } from "../../types";
import { useI18n } from "../../../i18n";
import { useLearner } from "../../context/LearnerContext";
import { getBusinessUnit, BUSINESS_UNITS } from "./businessCatalog";
import { BUSINESS_STAGE_IDS, type BusinessStageId } from "./businessTypes";
import { canCompleteBusinessUnit } from "./businessProgress";
import { BusinessStageStepper } from "./BusinessStageStepper";
import { BusinessRecallStage } from "./stages/BusinessRecallStage";
import { BusinessWarmupStage } from "./stages/BusinessWarmupStage";
import { BusinessInputStage } from "./stages/BusinessInputStage";
import { BusinessVocabularyStage } from "./stages/BusinessVocabularyStage";
import { BusinessUsageStage } from "./stages/BusinessUsageStage";
import { BusinessExerciseStage } from "./stages/BusinessExerciseStage";
import { BusinessDiscussionStage } from "./stages/BusinessDiscussionStage";
import { BusinessSpeakingStage } from "./stages/BusinessSpeakingStage";
import { BusinessReviewStage } from "./stages/BusinessReviewStage";
import { resolveAssetUrl } from "../../../utils/assetUrl";

interface Props {
  unitId: string;
  initialStage?: BusinessStageId;
  dispatch: Dispatch<Action>;
}

const EMPTY_COMPLETED_STAGES: BusinessStageId[] = [];

export function BusinessLessonScreen({ unitId, initialStage, dispatch }: Props) {
  const { t } = useI18n();
  const {
    state: learnerState,
    checkpointBusiness,
    recordBusinessCompletion,
    saveBusinessReflection,
    saveBusinessChecklist,
    saveBusinessConfidence,
  } = useLearner();

  const unit = getBusinessUnit(unitId);
  const stagePanelRef = useRef<HTMLDivElement>(null);
  const progress = learnerState.businessProgress?.[unitId];
  const isMastered = progress?.status === "mastered";

  const availableStages = useMemo(() => {
    if (unit?.recall && unit.recall.prompts.length > 0) {
      return [...BUSINESS_STAGE_IDS];
    }
    return BUSINESS_STAGE_IDS.filter((s) => s !== "recall");
  }, [unit]);

  const completedStages = progress?.completedStages ?? EMPTY_COMPLETED_STAGES;

  const maxUnlockedIndex = useMemo(() => {
    if (isMastered) return availableStages.length - 1;
    let max = 0;
    for (let i = 0; i < availableStages.length; i++) {
      if (completedStages.includes(availableStages[i])) {
        max = Math.max(max, i + 1);
      }
    }
    return Math.min(availableStages.length - 1, max);
  }, [isMastered, availableStages, completedStages]);

  const initialIndex = useMemo(() => {
    if (initialStage) {
      const idx = availableStages.indexOf(initialStage);
      if (idx >= 0) return Math.min(idx, maxUnlockedIndex);
    }
    const saved = progress?.currentStage ?? 0;
    return Math.min(Math.max(0, saved), maxUnlockedIndex);
  }, [initialStage, availableStages, maxUnlockedIndex, progress?.currentStage]);

  const [activeStageIdx, setActiveStageIdx] = useState<number>(initialIndex);

  const currentStageId = availableStages[activeStageIdx] || availableStages[0];

  useEffect(() => {
    if (unit) stagePanelRef.current?.focus();
  }, [activeStageIdx, unit]);

  // Keyboard navigation: [ / ] or PageUp / PageDown
  useEffect(() => {
    if (!unit) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "[" || e.key === "PageUp") {
        e.preventDefault();
        setActiveStageIdx((prev) => {
          const next = Math.max(0, prev - 1);
          checkpointBusiness(unit.id, next);
          return next;
        });
      } else if (e.key === "]" || e.key === "PageDown") {
        e.preventDefault();
        setActiveStageIdx((prev) => {
          const next = Math.min(maxUnlockedIndex, prev + 1);
          checkpointBusiness(unit.id, next);
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [checkpointBusiness, maxUnlockedIndex, unit]);

  if (!unit) {
    return (
      <main className="flex h-full min-h-0 flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-black text-foreground">{t("business.unitNotFound")}</h1>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "business-curriculum" })}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t("business.returnToHub")}
        </button>
      </main>
    );
  }

  const navigateToStage = (newIdx: number) => {
    const targetIdx = Math.max(0, Math.min(maxUnlockedIndex, newIdx));
    setActiveStageIdx(targetIdx);
    checkpointBusiness(unit.id, targetIdx);
  };

  const handleNext = () => {
    if (activeStageIdx < availableStages.length - 1) {
      const nextIdx = Math.min(availableStages.length - 1, activeStageIdx + 1);
      setActiveStageIdx(nextIdx);
      checkpointBusiness(unit.id, nextIdx, currentStageId);
    } else {
      if (canCompleteBusinessUnit(learnerState.businessProgress, unit.id)) {
        recordBusinessCompletion(unit.id);
      }
      dispatch({ type: "GO", to: "business-curriculum" });
    }
  };

  // Find next unit
  const nextUnit = BUSINESS_UNITS.find((u) => u.unitNumber === unit.unitNumber + 1);

  return (
    <main
      className="flex h-full min-h-0 flex-col bg-background overflow-hidden"
      aria-labelledby="lesson-header-title"
    >
      {/* Top Banner Navigation */}
      <header className="shrink-0 flex items-center justify-between border-b border-border bg-card px-4 sm:px-8 py-3.5 shadow-wp-xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "business-curriculum" })}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-2.5 font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Back to Business English Curriculum"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
            <span className="hidden sm:inline text-sm">{t("business.curriculumNavLabel")}</span>
          </button>

          <div className="h-4 w-px bg-border hidden sm:block" aria-hidden />

          <div className="flex items-center gap-2.5 min-w-0">
            {unit.heroImageSrc && (
              <div className="size-8 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted/40 relative hidden sm:block">
                <img
                  src={resolveAssetUrl(unit.heroImageSrc)}
                  alt=""
                  aria-hidden="true"
                  className="size-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <span className="shrink-0 rounded-lg bg-primary/15 px-2 py-0.5 text-xs font-black text-primary uppercase">
              {unit.level}
            </span>
            <span
              id="lesson-header-title"
              className="truncate text-sm sm:text-base font-black text-foreground"
            >
              {t("business.unitColonTitle", { number: unit.unitNumber, title: unit.title })}
            </span>
          </div>
        </div>

        {isMastered && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-black text-accent">
            <CheckCircle2 className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t("business.masteredBadge")}</span>
          </span>
        )}
      </header>

      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite">
        {t("business.stageLoadedAnnouncement", {
          current: activeStageIdx + 1,
          total: availableStages.length,
          stage: currentStageId,
        })}
      </div>

      {/* Workspace Area: Stepper + Content */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Stage Stepper: mobile top, desktop sticky sidebar */}
        <div className="shrink-0 lg:p-6 lg:overflow-y-auto">
          <BusinessStageStepper
            activeStageIdx={activeStageIdx}
            completedStages={completedStages}
            availableStages={availableStages}
            isMastered={isMastered}
            maxUnlockedIndex={maxUnlockedIndex}
            onSelectStage={navigateToStage}
          />
        </div>

        {/* Stage Content Panel */}
        <div
          ref={stagePanelRef}
          tabIndex={-1}
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8 outline-none overscroll-y-contain"
        >
          {currentStageId === "recall" && (
            <BusinessRecallStage
              unit={unit}
              onNext={handleNext}
              onRecordSrsConfidence={() => {
                checkpointBusiness(unit.id, activeStageIdx, "recall");
              }}
            />
          )}

          {currentStageId === "warmup" && (
            <BusinessWarmupStage
              unit={unit}
              savedNotes={progress?.reflectionNotes}
              onSaveNote={(id, note) => saveBusinessReflection(unit.id, id, note)}
              onNext={handleNext}
            />
          )}

          {currentStageId === "input" && <BusinessInputStage unit={unit} onNext={handleNext} />}

          {currentStageId === "vocabulary" && (
            <BusinessVocabularyStage unit={unit} onNext={handleNext} />
          )}

          {currentStageId === "usage" && <BusinessUsageStage unit={unit} onNext={handleNext} />}

          {currentStageId === "exercises" && (
            <BusinessExerciseStage
              unit={unit}
              savedScore={progress?.quizBestScore}
              onCompleteExercises={(score) =>
                checkpointBusiness(unit.id, activeStageIdx, "exercises", score)
              }
              onNext={handleNext}
            />
          )}

          {currentStageId === "discussion" && (
            <BusinessDiscussionStage
              unit={unit}
              savedNotes={progress?.reflectionNotes}
              onSaveNote={(id, note) => saveBusinessReflection(unit.id, id, note)}
              onNext={handleNext}
            />
          )}

          {currentStageId === "speaking" && (
            <BusinessSpeakingStage
              unit={unit}
              savedChecklist={progress?.checklistCompleted}
              onSaveChecklist={(checklist) => saveBusinessChecklist(unit.id, checklist)}
              onNext={handleNext}
            />
          )}

          {currentStageId === "review" && (
            <BusinessReviewStage
              unit={unit}
              nextUnitId={nextUnit?.id}
              savedConfidence={progress?.confidenceRating}
              onSaveConfidence={(rating) => saveBusinessConfidence(unit.id, rating)}
              onCompleteUnit={() => {
                if (canCompleteBusinessUnit(learnerState.businessProgress, unit.id)) {
                  recordBusinessCompletion(unit.id);
                }
                dispatch({ type: "GO", to: "business-curriculum" });
              }}
              onGoToUnit={(nextId) => {
                if (canCompleteBusinessUnit(learnerState.businessProgress, unit.id)) {
                  recordBusinessCompletion(unit.id);
                }
                dispatch({ type: "OPEN_BUSINESS_LESSON", unitId: nextId });
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
