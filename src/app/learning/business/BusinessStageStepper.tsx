import {
  Zap,
  MessageSquare,
  BookOpen,
  Sparkles,
  Layers,
  HelpCircle,
  MessageSquareText,
  Mic,
  Award,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useI18n } from "../../../i18n";
import type { BusinessStageId } from "./businessTypes";

interface Props {
  activeStageIdx: number;
  completedStages: BusinessStageId[];
  onSelectStage: (idx: number) => void;
  availableStages?: BusinessStageId[];
  isMastered?: boolean;
  maxUnlockedIndex?: number;
}

export const STAGE_CONFIG: {
  id: BusinessStageId;
  label: string;
  shortLabel: string;
  labelKey: string;
  shortLabelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "recall",
    label: "Quick Recall",
    shortLabel: "Recall",
    labelKey: "business.stages.recall",
    shortLabelKey: "business.stagesShort.recall",
    icon: Zap,
  },
  {
    id: "warmup",
    label: "Warm-Up",
    shortLabel: "Warm-Up",
    labelKey: "business.stages.warmup",
    shortLabelKey: "business.stagesShort.warmup",
    icon: MessageSquare,
  },
  {
    id: "input",
    label: "Main Input",
    shortLabel: "Input",
    labelKey: "business.stages.input",
    shortLabelKey: "business.stagesShort.input",
    icon: BookOpen,
  },
  {
    id: "vocabulary",
    label: "Language Bank",
    shortLabel: "Vocab",
    labelKey: "business.stages.vocabulary",
    shortLabelKey: "business.stagesShort.vocabulary",
    icon: Sparkles,
  },
  {
    id: "usage",
    label: "Usage Focus",
    shortLabel: "Usage",
    labelKey: "business.stages.usage",
    shortLabelKey: "business.stagesShort.usage",
    icon: Layers,
  },
  {
    id: "exercises",
    label: "Exercise Set",
    shortLabel: "Quiz",
    labelKey: "business.stages.exercises",
    shortLabelKey: "business.stagesShort.exercises",
    icon: HelpCircle,
  },
  {
    id: "discussion",
    label: "Discussion",
    shortLabel: "Discuss",
    labelKey: "business.stages.discussion",
    shortLabelKey: "business.stagesShort.discussion",
    icon: MessageSquareText,
  },
  {
    id: "speaking",
    label: "Speaking Task",
    shortLabel: "Speak",
    labelKey: "business.stages.speaking",
    shortLabelKey: "business.stagesShort.speaking",
    icon: Mic,
  },
  {
    id: "review",
    label: "Review & Recycling",
    shortLabel: "Review",
    labelKey: "business.stages.review",
    shortLabelKey: "business.stagesShort.review",
    icon: Award,
  },
];

export function BusinessStageStepper({
  activeStageIdx,
  completedStages,
  onSelectStage,
  availableStages,
  isMastered = false,
  maxUnlockedIndex = 99,
}: Props) {
  const { t } = useI18n();
  const completedSet = new Set(completedStages);

  const stagesToRender = availableStages
    ? STAGE_CONFIG.filter((s) => availableStages.includes(s.id))
    : STAGE_CONFIG;

  const hasRecall = stagesToRender[0]?.id === "recall";

  return (
    <>
      {/* Mobile / Tablet Horizontal Stepper (< 1024px) */}
      <nav
        aria-label={t("business.stepperMobileAria")}
        className="flex lg:hidden w-full items-center gap-1.5 overflow-x-auto p-2 bg-card border-b border-border shadow-wp-xs"
      >
        {stagesToRender.map((stage, idx) => {
          const isCurrent = idx === activeStageIdx;
          const isDone = completedSet.has(stage.id);
          const isLocked = !isMastered && idx > maxUnlockedIndex;
          const Icon = stage.icon;
          const displayNum = hasRecall ? idx : idx + 1;

          return (
            <button
              key={stage.id}
              type="button"
              disabled={isLocked}
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => onSelectStage(idx)}
              className={`flex min-h-[44px] items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isCurrent
                  ? "bg-primary text-primary-foreground shadow-wp-xs font-black"
                  : isDone
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : isLocked
                      ? "bg-muted/40 text-muted-foreground/60 cursor-not-allowed opacity-60"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="size-3.5 text-accent shrink-0" aria-hidden />
              ) : isLocked ? (
                <Lock className="size-3.5 shrink-0 opacity-60" aria-hidden />
              ) : (
                <Icon className="size-3.5 shrink-0" aria-hidden />
              )}
              <span>{`${displayNum}. ${t(stage.shortLabelKey)}`}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Vertical Sidebar (>= 1024px) */}
      <nav
        aria-label={t("business.stepperNavAria")}
        className="hidden lg:flex flex-col gap-2 w-64 shrink-0 rounded-3xl border border-border bg-card p-4 shadow-wp-xs sticky top-4 h-fit"
      >
        <div className="px-3 py-2">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            {t("business.stepperTitle")}
          </p>
          <p className="text-sm font-black text-foreground mt-0.5">
            {t("business.stepperSubtitle", { count: stagesToRender.length })}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          {stagesToRender.map((stage, idx) => {
            const isCurrent = idx === activeStageIdx;
            const isDone = completedSet.has(stage.id);
            const isLocked = !isMastered && idx > maxUnlockedIndex;
            const Icon = stage.icon;
            const displayNum = hasRecall ? idx : idx + 1;

            return (
              <button
                key={stage.id}
                type="button"
                disabled={isLocked}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => onSelectStage(idx)}
                className={`flex min-h-[44px] items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-start text-sm font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-wp-xs font-black"
                    : isDone
                      ? "bg-muted/40 text-foreground hover:bg-muted/70"
                      : isLocked
                        ? "text-muted-foreground/50 bg-muted/20 cursor-not-allowed opacity-60"
                        : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      isCurrent
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : isDone
                          ? "bg-accent/15 text-accent"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {displayNum}
                  </span>
                  <span className="truncate">{t(stage.labelKey)}</span>
                </div>

                {isDone ? (
                  <CheckCircle2
                    className={`size-4 shrink-0 ${
                      isCurrent ? "text-primary-foreground" : "text-accent"
                    }`}
                    aria-hidden
                  />
                ) : isLocked ? (
                  <Lock className="size-4 shrink-0 opacity-40 text-muted-foreground" aria-hidden />
                ) : (
                  <Icon
                    className={`size-4 shrink-0 opacity-60 ${
                      isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
