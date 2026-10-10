import { HelpCircle, ArrowRight, ArrowLeft } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useI18n } from "../../../../i18n";
import { CurriculumQuizEngine } from "../../../shared/CurriculumQuizEngine";
import type { QuizQuestion, QuizResult } from "../../../shared/CurriculumQuizEngine";

interface Props {
  unit: ConversationUnit;
  savedScore?: number;
  onSaveScore: (score: number) => void;
  onNext: () => void;
  onSkip: () => void;
  onPrev: () => void;
}

export function QuizStage({ unit, savedScore, onSaveScore, onNext, onPrev, onSkip }: Props) {
  const { t } = useI18n();

  // Map conversation quiz format → unified QuizQuestion shape with 2-column option layout
  const questions: QuizQuestion[] = unit.quiz.map((q) => ({
    id: q.id,
    stem: q.question,
    correctValue: q.correctAnswer,
    explanation: q.explanation,
    optionColumns: "two",
    options: q.options.map((option) => ({
      value: option.key,
      label: option.text,
      prefix: option.key,
      accessibleLabel: t("conversation.answerOption", {
        key: option.key,
        text: option.text,
      }),
    })),
  }));

  const handleComplete = (result: QuizResult) => {
    onSaveScore(result.correct);
  };

  return (
    <div className="wp-stage-flow wp-container-content flex flex-col gap-4 py-2">
      {/* Stage Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <HelpCircle className="size-4" aria-hidden />
          {t("conversation.quizStage")}
        </span>
        {savedScore !== undefined && (
          <span className="text-sm font-bold text-muted-foreground">
            {t("conversation.bestScore", { score: savedScore, total: unit.quiz.length })}
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
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-black text-primary-foreground shadow-wp-md motion-safe:active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
            >
              <span>{t("conversation.continueDiscussion")}</span>
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
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 font-bold text-foreground hover:bg-muted motion-safe:active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          <span>{t("conversation.previous")}</span>
        </button>
      </div>
    </div>
  );
}
