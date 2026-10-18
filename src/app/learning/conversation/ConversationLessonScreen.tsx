import { useEffect, useRef, useState, type Dispatch } from "react";
import {
  ArrowLeft,
  MessageSquare,
  BookOpen,
  Sparkles,
  MessageCircle,
  HelpCircle,
  MessageSquareText,
  Award,
} from "lucide-react";
import type { Action } from "../../types";
import { useLearner } from "../../context/LearnerContext";
import { useI18n } from "../../../i18n";
import { getConversationUnit } from "./conversationCatalog";
import { CONVERSATION_STAGE_IDS, type ConversationStageId } from "./conversationTypes";
import { canCompleteConversationUnit } from "./conversationProgress";
import { WarmupStage } from "./stages/WarmupStage";
import { ReadingStage } from "./stages/ReadingStage";
import { LanguageBankStage } from "./stages/LanguageBankStage";
import { ToolkitStage } from "./stages/ToolkitStage";
import { QuizStage } from "./stages/QuizStage";
import { DiscussionStage } from "./stages/DiscussionStage";
import { ChallengeStage } from "./stages/ChallengeStage";
import { CourseLessonNavigation } from "../../shared/CourseLessonNavigation";
import { useLessonProgress } from "../../shared/useLessonProgress";

interface Props {
  unitId: string;
  initialStage?: ConversationStageId;
  dispatch: Dispatch<Action>;
}

const STAGE_CONFIG: {
  id: ConversationStageId;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "warmup", icon: MessageSquare },
  { id: "reading", icon: BookOpen },
  { id: "vocabulary", icon: Sparkles },
  { id: "toolkit", icon: MessageCircle },
  { id: "quiz", icon: HelpCircle },
  { id: "discussion", icon: MessageSquareText },
  { id: "challenge", icon: Award },
];

export function ConversationLessonScreen({ unitId, initialStage, dispatch }: Props) {
  const {
    state: learnerState,
    checkpointConversation,
    recordConversationCompletion,
    saveConversationReflection,
    saveConversationChallenge,
  } = useLearner();
  const { t } = useI18n();
  const unit = getConversationUnit(unitId);
  const stagePanelRef = useRef<HTMLDivElement>(null);
  const progress = learnerState.conversationProgress?.[unitId];
  const isMastered = progress?.status === "mastered";
  const { completedStages, maxUnlockedIndex, initialIndex } = useLessonProgress({
    stageIds: CONVERSATION_STAGE_IDS,
    currentStage: progress?.currentStage,
    requestedStage: initialStage ? CONVERSATION_STAGE_IDS.indexOf(initialStage) : undefined,
    completedStages: progress?.completedStages,
    isMastered,
    lockFutureStages: false,
  });

  const [activeStageIdx, setActiveStageIdx] = useState<number>(initialIndex);

  const currentStageId = unit ? CONVERSATION_STAGE_IDS[activeStageIdx] : CONVERSATION_STAGE_IDS[0];
  const stageAnnouncement = unit
    ? t("conversation.stageAnnouncement", {
        current: activeStageIdx + 1,
        total: CONVERSATION_STAGE_IDS.length,
        stage: t(`conversation.stages.${currentStageId}`),
        level: unit.level,
      })
    : "";

  useEffect(() => {
    if (unit) stagePanelRef.current?.focus();
  }, [activeStageIdx, unit]);

  if (!unit) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-black text-foreground">{t("conversation.unitNotFound")}</h1>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "conversation-curriculum" })}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t("conversation.returnToUnits")}
        </button>
      </div>
    );
  }

  const navigateToStage = (newIdx: number) => {
    const clamped = Math.max(0, Math.min(maxUnlockedIndex, newIdx));
    setActiveStageIdx(clamped);
    checkpointConversation(unit.id, clamped);
  };

  const completeStageAndAdvance = (newIdx: number) => {
    const clamped = Math.max(0, Math.min(CONVERSATION_STAGE_IDS.length - 1, newIdx));
    checkpointConversation(unit.id, clamped, currentStageId);
    setActiveStageIdx(clamped);
  };

  const handleVote = (optionId: string) => {
    checkpointConversation(unit.id, activeStageIdx, undefined, undefined, optionId);
  };

  const handleSaveQuizScore = (score: number) => {
    checkpointConversation(unit.id, activeStageIdx, undefined, score);
  };

  const handleCompleteUnit = () => {
    recordConversationCompletion(unit.id);
  };

  return (
    <div
      className="wp-lesson-session flex h-full min-h-0 flex-col overflow-y-auto bg-background pb-[max(1rem,env(safe-area-inset-bottom))] overscroll-y-contain"
      aria-labelledby="lesson-header-title"
    >
      <h1 id="lesson-header-title" className="sr-only">
        {t("conversation.unitTitle", { number: unit.unitNumber, title: unit.title })}
      </h1>
      <p className="sr-only" aria-live="polite">
        {stageAnnouncement}
      </p>
      {/* Responsive Workspace Layout */}
      <div className="wp-container-shell wp-layout-gutter py-3 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          {/* Side-Rail Workspace on Desktop (lg+) / Navigation Header on Mobile */}
          <div className="w-full lg:w-80 lg:shrink-0 lg:sticky lg:top-6 flex flex-col gap-4">
            {/* Top Bar with Back and Unit Metadata */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: "GO", to: "conversation-curriculum" })}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1 text-sm font-bold text-foreground hover:bg-muted shadow-wp-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
                <span>{t("ux.backToCourse")}</span>
              </button>

              <span className="rounded-lg bg-secondary px-2.5 py-1 text-sm font-black text-primary">
                {t("conversation.level", { level: unit.level })}
              </span>
            </div>

            {/* Unit Context Card */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-wp-xs space-y-3">
              <header>
                <p className="text-xs sm:text-sm font-semibold text-primary">
                  {t("conversation.unitOfTotal", { number: unit.unitNumber, total: 40 })}
                </p>
                <h2 className="mt-1 text-lg sm:text-xl font-bold text-foreground">{unit.title}</h2>
              </header>

              <div className="pt-2 border-t border-border">
                <CourseLessonNavigation
                  stages={STAGE_CONFIG.map((stage, idx) => ({
                    id: stage.id,
                    label: t(`conversation.stages.${stage.id}`),
                    group: ([0, 0, 1, 1, 2, 3, 3] as const)[idx],
                    completed: completedStages.has(stage.id) || isMastered,
                    locked: idx > maxUnlockedIndex,
                  }))}
                  currentIndex={activeStageIdx}
                  onSelect={navigateToStage}
                />
              </div>
            </div>
          </div>

          {/* Main Stage Content */}
          <div
            ref={stagePanelRef}
            id={`panel-${currentStageId}`}
            role="region"
            aria-label={t(`conversation.stages.${currentStageId}`)}
            tabIndex={-1}
            className="flex-1 min-w-0 flex flex-col gap-6 py-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
          >
            {currentStageId === "warmup" && (
              <WarmupStage
                unit={unit}
                savedVote={progress?.selectedVoteOption}
                onVote={handleVote}
                onNext={() =>
                  progress?.selectedVoteOption ? completeStageAndAdvance(1) : navigateToStage(1)
                }
              />
            )}

            {currentStageId === "reading" && (
              <ReadingStage
                unit={unit}
                onNext={() => completeStageAndAdvance(2)}
                onPrev={() => navigateToStage(0)}
              />
            )}

            {currentStageId === "vocabulary" && (
              <LanguageBankStage
                unit={unit}
                onNext={() => completeStageAndAdvance(3)}
                onPrev={() => navigateToStage(1)}
              />
            )}

            {currentStageId === "toolkit" && (
              <ToolkitStage
                unit={unit}
                onNext={() => completeStageAndAdvance(4)}
                onPrev={() => navigateToStage(2)}
              />
            )}

            {currentStageId === "quiz" && (
              <QuizStage
                unit={unit}
                savedScore={progress?.quizBestScore}
                onSaveScore={handleSaveQuizScore}
                onNext={() => completeStageAndAdvance(5)}
                onSkip={() => navigateToStage(5)}
                onPrev={() => navigateToStage(3)}
              />
            )}

            {currentStageId === "discussion" && (
              <DiscussionStage
                unit={unit}
                initialNotes={progress?.notes ?? ""}
                onSaveNotes={(notes) => saveConversationReflection(unit.id, notes)}
                onNext={() => completeStageAndAdvance(6)}
                onPrev={() => navigateToStage(4)}
              />
            )}

            {currentStageId === "challenge" && (
              <ChallengeStage
                unit={unit}
                isMastered={isMastered}
                prerequisitesComplete={canCompleteConversationUnit(
                  learnerState.conversationProgress,
                  unit.id
                )}
                initialResponse={progress?.challengeResponse ?? ""}
                onSaveResponse={(response) => saveConversationChallenge(unit.id, response)}
                onComplete={handleCompleteUnit}
                onPrev={() => navigateToStage(5)}
                onExit={() => dispatch({ type: "GO", to: "conversation-curriculum" })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
