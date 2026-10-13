import { CourseLessonNavigation } from "../../shared/CourseLessonNavigation";
import { useI18n } from "../../../i18n";
import { HADITH_STAGE_IDS, type HadithStageId } from "./hadithCurriculumStages";

interface Props {
  currentStageIndex: number;
  completedStages?: readonly HadithStageId[];
  onSelectStage: (index: number) => void;
}

export function HadithStageStepper({
  currentStageIndex,
  completedStages = [],
  onSelectStage,
}: Props) {
  const { t } = useI18n();
  return (
    <CourseLessonNavigation
      stages={HADITH_STAGE_IDS.map((id, index) => ({
        id,
        label: t(`hadith.stageLabels.${id}`),
        group: index as 0 | 1 | 2 | 3,
        completed: completedStages.includes(id),
      }))}
      currentIndex={currentStageIndex}
      onSelect={onSelectStage}
    />
  );
}
