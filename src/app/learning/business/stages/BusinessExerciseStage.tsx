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
}

export function BusinessExerciseStage({ unit, savedScore, onCompleteExercises, onNext }: Props) {
  const { t } = useI18n();
  // Map BusinessExercise (A/B/C options) → unified QuizQuestion shape
  const questions: QuizQuestion[] = unit.exercises.map((ex) => ({
    id: ex.id,
    stem: ex.question,
    correctValue: ex.correctAnswer,
    explanation: ex.explanation,
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
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Stage Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <HelpCircle className="size-4" aria-hidden />
          {t("business.exercises.stageTag")}
        </span>
        {savedScore !== undefined && (
          <span className="text-xs font-bold text-muted-foreground">
            {t("business.exercises.bestScore", {
              score: savedScore,
              total: unit.exercises.length,
            })}
          </span>
        )}
      </div>

      {/* Unified Quiz Engine */}
      <CurriculumQuizEngine questions={questions} onComplete={handleComplete} />

      {/* Proceed button (shown after engine reaches completion screen) */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("business.exercises.proceedToDiscussion")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
