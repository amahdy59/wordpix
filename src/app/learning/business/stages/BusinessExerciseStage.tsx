import { HelpCircle, ArrowRight } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";
import { CurriculumQuizEngine } from "../../../shared/CurriculumQuizEngine";
import type { QuizQuestion, QuizResult } from "../../../shared/CurriculumQuizEngine";

interface Props {
  unit: BusinessUnit;
  savedScore?: number;
  onCompleteExercises: (score: number) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function BusinessExerciseStage({
  unit,
  savedScore,
  onCompleteExercises,
  onNext,
  onSkip,
}: Props) {
  const { t } = useI18n();

  // Map BusinessExercise (A/B/C options) → unified QuizQuestion shape
  const questions: QuizQuestion[] = unit.exercises.map((ex) => ({
    id: ex.id,
    stem: ex.question,
    correctValue: ex.correctAnswer,
    explanation: ex.explanation,
    optionColumns: "two",
    options: ex.options.map((option) => ({
      value: option.key,
      label: option.text,
      prefix: option.key,
      accessibleLabel: `${option.key}: ${option.text}`,
    })),
  }));

  const handleComplete = (result: QuizResult) => {
    onCompleteExercises(result.correct);
  };

  return (
    <div className="wp-stage-flow wp-container-content flex flex-col gap-4 py-2">
      {/* Stage Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <HelpCircle className="size-4" aria-hidden />
          {t("business.exercises.stageTag")}
        </span>
        {savedScore !== undefined && (
          <span className="text-sm font-bold text-muted-foreground">
            {t("business.exercises.bestScore", {
              score: savedScore,
              total: unit.exercises.length,
            })}
          </span>
        )}
      </div>

      {/* Unified Quiz Engine showing 1 focused question at a time */}
      <CurriculumQuizEngine
        questions={questions}
        onComplete={handleComplete}
        desktopPageSize={1}
        unitId={unit.id}
        renderCompletionAction={() => (
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onNext}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-md hover:brightness-105 motion-safe:active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span>{t("business.exercises.proceedToDiscussion")}</span>
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
            </button>
          </div>
        )}
      />

      <button
        type="button"
        onClick={onSkip}
        className="min-h-11 self-end rounded-xl px-4 py-2 font-bold text-primary underline underline-offset-4 hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("quiz.continueLesson")}
      </button>
      {/* Stage Navigation Footer */}
    </div>
  );
}
