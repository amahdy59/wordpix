import { useState, type Dispatch, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  MessageSquare,
  BookOpen,
  Sparkles,
  MessageCircle,
  HelpCircle,
  MessageSquareText,
  Award,
  Check,
} from "lucide-react";
import type { Action } from "../../types";
import { useLearner } from "../../context/LearnerContext";
import { useI18n } from "../../context/I18nContext";
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
  const progress = learnerState.conversationProgress?.[unitId];
  const completedStages = new Set(progress?.completedStages ?? []);
  const isMastered = progress?.status === "mastered";
  const firstIncompleteIndex = CONVERSATION_STAGE_IDS.findIndex(
    (stage) => !completedStages.has(stage)
  );
  const maxUnlockedIndex = isMastered
    ? CONVERSATION_STAGE_IDS.length - 1
    : firstIncompleteIndex === -1
      ? CONVERSATION_STAGE_IDS.length - 1
      : firstIncompleteIndex;

  const requestedInitialIndex = initialStage
    ? CONVERSATION_STAGE_IDS.indexOf(initialStage)
    : (progress?.currentStage ?? 0);
  const initialIndex = Math.min(Math.max(0, requestedInitialIndex), maxUnlockedIndex);

  const [activeStageIdx, setActiveStageIdx] = useState<number>(initialIndex);

  if (!unit) {
    return (
      <main className="flex h-full min-h-0 flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-black text-foreground">{t("conversation.unitNotFound")}</h1>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "conversation-curriculum" })}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t("conversation.returnToUnits")}
        </button>
      </main>
    );
  }

  const currentStageId = CONVERSATION_STAGE_IDS[activeStageIdx];

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

  const handleStageKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const availableCount = maxUnlockedIndex + 1;
    const nextIndex = (index + direction + availableCount) % availableCount;
    navigateToStage(nextIndex);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not(:disabled)'
    );
    tabs?.[nextIndex]?.focus();
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
    <main
      className="flex h-full min-h-0 flex-col overflow-y-auto bg-background pb-20 overscroll-y-contain"
      aria-labelledby="lesson-header-title"
    >
      <h1 id="lesson-header-title" className="sr-only">
        {t("conversation.unitTitle", { number: unit.unitNumber, title: unit.title })}
      </h1>
      {/* Sticky Header & Stepper */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3">
          {/* Top Bar with Back and Unit Metadata */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "GO", to: "conversation-curriculum" })}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
              <span>{t("conversation.allUnits")}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">
                {t("conversation.level", { level: unit.level })}
              </span>
              <span className="text-xs font-bold text-muted-foreground hidden sm:inline">
                {t("conversation.unitOfTotal", { number: unit.unitNumber, total: 40 })}
              </span>
            </div>
          </div>

          {/* Stepper Tabs Bar */}
          <div
            role="tablist"
            aria-label={t("conversation.lessonStages")}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1"
          >
            {STAGE_CONFIG.map((stage, idx) => {
              const isActive = activeStageIdx === idx;
              const isDone = completedStages.has(stage.id) || isMastered;
              const isLocked = idx > maxUnlockedIndex;
              const Icon = stage.icon;

              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  id={`tab-${stage.id}`}
                  aria-selected={isActive}
                  aria-current={isActive ? "step" : undefined}
                  aria-controls={`panel-${stage.id}`}
                  tabIndex={isActive ? 0 : -1}
                  disabled={isLocked}
                  onClick={() => navigateToStage(idx)}
                  onKeyDown={(event) => handleStageKeyDown(event, idx)}
                  className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-wp-xs"
                      : isDone
                        ? "bg-accent/15 text-accent hover:bg-accent/25"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  }`}
                >
                  {isDone && !isActive ? (
                    <Check className="size-4 text-accent" aria-hidden />
                  ) : (
                    <Icon className="size-4 shrink-0" aria-hidden />
                  )}
                  <span>{t(`conversation.stages.${stage.id}`)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Stage Content */}
      <div
        id={`panel-${currentStageId}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentStageId}`}
        tabIndex={0}
        className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
      >
        {currentStageId === "warmup" && (
          <WarmupStage
            unit={unit}
            savedVote={progress?.selectedVoteOption}
            onVote={handleVote}
            onNext={() => completeStageAndAdvance(1)}
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
    </main>
  );
}
