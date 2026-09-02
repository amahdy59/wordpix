import { Award, RotateCcw } from "lucide-react";
import { ForwardIcon } from "./ForwardIcon";
import { useI18n } from "../../../context/I18nContext";
import { formatNumber } from "../../../shared/useAccessibilityPreferences";
import { useLearner } from "../../../context/LearnerContext";

interface Props {
  firstTryCorrectCount: number;
  totalAnswered: number;
  reviewAddedWords: string[];
  onRestart: () => void;
  onNextActivity: () => void;
}

export function SessionCompleteCard({
  firstTryCorrectCount,
  totalAnswered,
  reviewAddedWords,
  onRestart,
  onNextActivity,
}: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const { numeralSystem, reduceMotion } = learnerState.accessibility;

  const answeredCount = Math.max(1, totalAnswered);
  const scorePercent = Math.round((firstTryCorrectCount / answeredCount) * 100);

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-2xl mx-auto w-full text-center ${
        reduceMotion ? "" : "animate-in fade-in zoom-in-95 duration-300"
      }`}
    >
      <div className="size-20 rounded-3xl bg-wp-green-light/20 text-wp-green flex items-center justify-center mb-6 shadow-xs border border-wp-green/30">
        <Award className="size-10" aria-hidden />
      </div>
      <h1 className="text-3xl font-extrabold mb-2 text-foreground">
        {t("practice.sessionComplete")}
      </h1>
      <p className="text-muted-foreground text-base mb-6">
        {t("practice.sessionScore", {
          correct: formatNumber(firstTryCorrectCount, numeralSystem),
          total: formatNumber(answeredCount, numeralSystem),
          percent: formatNumber(scorePercent, numeralSystem),
        })}
      </p>

      {reviewAddedWords.length > 0 && (
        <div className="w-full bg-secondary/30 border border-border rounded-3xl p-5 mb-8 text-start">
          <h2 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
            <RotateCcw className="size-4 text-wp-amber" aria-hidden />
            {t("practice.wordsForReview", {
              count: formatNumber(reviewAddedWords.length, numeralSystem),
            })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {reviewAddedWords.map((w) => (
              <span
                key={w}
                lang="en"
                dir="ltr"
                className="px-3 py-1 bg-background border border-border rounded-full text-xs font-bold text-foreground"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border text-foreground font-bold rounded-2xl hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs min-h-[48px]"
        >
          <RotateCcw className="size-4" aria-hidden />
          <span>{t("practice.practiceAgain")}</span>
        </button>
        <button
          onClick={onNextActivity}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[48px] shadow-xs"
        >
          <span>
            {reviewAddedWords.length > 0
              ? t("practice.continueToReview")
              : t("practice.continueNext")}
          </span>
          <ForwardIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
