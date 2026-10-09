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
} from "lucide-react";
import { CourseLessonNavigation } from "../../shared/CourseLessonNavigation";
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

  const groupForStage: Record<BusinessStageId, 0 | 1 | 2 | 3> = {
    recall: 0,
    warmup: 0,
    input: 0,
    vocabulary: 1,
    usage: 1,
    exercises: 2,
    discussion: 3,
    speaking: 3,
    review: 3,
  };
  return (
    <CourseLessonNavigation
      stages={stagesToRender.map((stage, index) => ({
        id: stage.id,
        label: t(stage.shortLabelKey),
        group: groupForStage[stage.id],
        completed: completedSet.has(stage.id),
        locked: !isMastered && index > maxUnlockedIndex,
      }))}
      currentIndex={activeStageIdx}
      onSelect={onSelectStage}
    />
  );
}
