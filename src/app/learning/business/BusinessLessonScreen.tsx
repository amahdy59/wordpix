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

  // Browsing is independent of completion; checkpoints record position only.
  const maxUnlockedIndex = availableStages.length - 1;

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

  // Keep PageUp/PageDown available for scrolling and native form controls.
  useEffect(() => {
    if (!unit) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "[") {
        e.preventDefault();
        setActiveStageIdx((prev) => {
          const next = Math.max(0, prev - 1);
          checkpointBusiness(unit.id, next);
          return next;
        });
      } else if (e.key === "]") {
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
      <div className="flex h-full min-h-0 flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-black text-foreground">{t("business.unitNotFound")}</h1>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "business-curriculum" })}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t("business.returnToHub")}
        </button>
      </div>
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
    <div
      className="wp-lesson-session flex h-full min-h-0 flex-col overflow-y-auto bg-background"
      aria-labelledby="lesson-header-title"
    >
      {/* Top Banner Navigation */}
      <header className="shrink-0 flex items-center justify-between border-b border-border bg-card px-4 sm:px-8 py-3.5 shadow-wp-xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "business-curriculum" })}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl px-2.5 font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Back to Business English Curriculum"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
            <span className="hidden sm:inline text-base">{t("business.curriculumNavLabel")}</span>
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
            <span className="shrink-0 rounded-lg bg-secondary px-2 py-0.5 text-sm font-black text-primary uppercase">
              {unit.level}
            </span>
            <h1
              id="lesson-header-title"
              className="min-w-0 break-words text-base sm:text-lg font-bold text-foreground"
            >
              {t("business.unitColonTitle", { number: unit.unitNumber, title: unit.title })}
            </h1>
          </div>
        </div>

        {isMastered && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-feedback-success-surface px-3 py-1 text-sm font-black text-feedback-success-foreground">
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
      <div className="wp-lesson-workspace shrink-0 flex flex-col">
        {/* Four course sections with detailed stages inside the active section */}
        <div className="wp-course-sticky wp-layout-gutter sticky top-0 z-40 shrink-0 border-b border-border bg-background py-2">
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
          className="wp-lesson-panel wp-layout-gutter py-4 sm:py-8 outline-none"
        >
          {currentStageId === "recall" && (
            <BusinessRecallStage
              key={unit.id}
              unit={unit}
              savedAnswers={Object.fromEntries(
                (unit.recall?.prompts ?? []).flatMap((prompt) => {
                  const answer = progress?.reflectionNotes?.[`recall-answer-${prompt.id}`];
                  return answer === undefined ? [] : [[prompt.id, answer]];
                })
              )}
              onSaveAnswer={(id, answer) =>
                saveBusinessReflection(unit.id, `recall-answer-${id}`, answer)
              }
              onNext={() => navigateToStage(activeStageIdx + 1)}
              onComplete={() => checkpointBusiness(unit.id, activeStageIdx, "recall")}
            />
          )}

          {currentStageId === "warmup" && (
            <BusinessWarmupStage
              key={unit.id}
              unit={unit}
              savedNotes={progress?.reflectionNotes}
              onSaveNote={(id, note) => saveBusinessReflection(unit.id, id, note)}
              onComplete={() => checkpointBusiness(unit.id, activeStageIdx, "warmup")}
              onNext={() => navigateToStage(activeStageIdx + 1)}
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
              onSkip={() => navigateToStage(activeStageIdx + 1)}
              savedScore={progress?.quizBestScore}
              onCompleteExercises={(score) =>
                checkpointBusiness(unit.id, activeStageIdx, "exercises", score)
              }
              onNext={() => navigateToStage(activeStageIdx + 1)}
            />
          )}

          {currentStageId === "discussion" && (
            <BusinessDiscussionStage
              unit={unit}
              savedNotes={progress?.reflectionNotes}
              onSaveNote={(id, note) => saveBusinessReflection(unit.id, id, note)}
              onNext={() => navigateToStage(activeStageIdx + 1)}
            />
          )}

          {currentStageId === "speaking" && (
            <BusinessSpeakingStage
              unit={unit}
              savedChecklist={progress?.checklistCompleted}
              onSaveChecklist={(checklist) => saveBusinessChecklist(unit.id, checklist)}
              onNext={() => {
                const checklist = unit.speakingTask.checklist;
                if (
                  checklist.length > 0 &&
                  checklist.every((item) => progress?.checklistCompleted?.includes(item))
                ) {
                  handleNext();
                } else {
                  navigateToStage(activeStageIdx + 1);
                }
              }}
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
    </div>
  );
}
