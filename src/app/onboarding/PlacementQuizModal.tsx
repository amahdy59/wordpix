import { memo, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { WordImage } from "../shared/WordImage";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { useModalA11y } from "../shared/useModalA11y";
import { Sparkles, X } from "lucide-react";
import { useI18n, type TranslationValues } from "../context/I18nContext";
import { recommendPlacement, type PlacementRecommendation } from "./placementRecommendation";
import { emitLearningEvent } from "../analytics/learningAnalytics";

// Placement always starts from the default world's vocabulary — there is only
// one world to place a learner into today. This is also why bedroom is the
// one unit kept in the main bundle: placement runs before a learner has
// chosen anything, so its words cannot be fetched on demand.
const PLACEMENT_VOCABULARY = BEDROOM_VOCABULARY;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (recommendation: PlacementRecommendation) => void;
}

const QUESTIONS: Array<{
  targetId: string;
  promptKey: string;
  promptArgs?: TranslationValues;
  level: "A1" | "A2" | "B1";
}> = [
  {
    targetId: "pillow",
    promptKey: "onboarding.quizPrompt1",
    promptArgs: { word: "pillow" },
    level: "A1",
  },
  {
    targetId: "nightstand",
    promptKey: "onboarding.quizPrompt2",
    promptArgs: { sentence: "I put my lamp on the _______." },
    level: "A2",
  },
  {
    targetId: "wardrobe",
    promptKey: "onboarding.quizPrompt3",
    promptArgs: { sentence: "This is a wardrobe." },
    level: "B1",
  },
];

export const PlacementQuizModal = memo(function PlacementQuizModal({
  isOpen,
  onClose,
  onComplete,
}: Props) {
  const { t } = useI18n();
  const [stepIndex, setStepIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const containerRef = useModalA11y({ isOpen, onDismiss: onClose });

  const currentQ = QUESTIONS[stepIndex] ?? QUESTIONS[0];
  const targetWord =
    PLACEMENT_VOCABULARY.find((v) => v.id === currentQ.targetId) ?? PLACEMENT_VOCABULARY[0];
  const options = useMemo(() => {
    const distractors = PLACEMENT_VOCABULARY.filter((v) => v.id !== targetWord.id);
    const selectedDistractors = distractors.slice(stepIndex * 2, stepIndex * 2 + 3);
    const finalDistractors =
      selectedDistractors.length === 3 ? selectedDistractors : distractors.slice(0, 3);
    const targetPos = stepIndex % 4;
    const result = [...finalDistractors];
    result.splice(targetPos, 0, targetWord);
    return result;
  }, [targetWord, stepIndex]);

  if (!isOpen) return null;

  const handleSelectOption = (wordId: string) => {
    const isCorrect = wordId === targetWord.id;
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;

    if (stepIndex + 1 < QUESTIONS.length) {
      setCorrectCount(newCorrect);
      setStepIndex((i) => i + 1);
    } else {
      // Determine level recommendation
      const recommendation = recommendPlacement(newCorrect, QUESTIONS.length);
      emitLearningEvent({
        name: "placement_completed",
        properties: {
          recommendedLevel: recommendation.level,
          scoreBand:
            recommendation.level === "B1"
              ? "ready"
              : recommendation.level === "A2"
                ? "developing"
                : "emerging",
        },
      });
      onComplete(recommendation);
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="placement-modal-title"
        tabIndex={-1}
        className="bg-wp-card border border-border rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 sm:gap-5 relative outline-none max-h-[92dvh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("onboarding.closePlacementAria")}
          className="absolute top-4 end-4 size-10 min-h-[44px] min-w-[44px] rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div>
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="size-4 text-wp-amber" />
            <span>{t("onboarding.adaptiveCheck", { current: stepIndex + 1, total: 3 })}</span>
          </div>
          <h2 id="placement-modal-title" className="font-sans font-black text-foreground text-2xl">
            {t("onboarding.testYourLevel")}
          </h2>
          <p className="font-sans text-muted-foreground text-xs mt-1">
            {t("onboarding.testYourLevelDesc")}
          </p>
        </div>

        {/* Question Prompt */}
        <div className="bg-muted p-4 rounded-2xl border border-border">
          <p className="font-sans font-bold text-foreground text-base text-center">
            {t(currentQ.promptKey, currentQ.promptArgs)}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, idx) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(opt.id)}
              className="bg-background border border-border rounded-2xl p-2 flex flex-col items-center gap-1.5 hover:border-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all min-h-[44px]"
            >
              <div className="h-24 w-full rounded-xl overflow-hidden bg-muted">
                <WordImage
                  word={opt}
                  width="200"
                  height="150"
                  className="size-full object-cover"
                  altMode="assessment"
                  optionIndex={idx}
                />
              </div>
              {/* No word label here: this is a graded placement question, and
                  printing the answer under each picture makes it unanswerable
                  as an assessment. */}
              <span className="font-sans font-semibold text-xs text-muted-foreground">
                {t("onboarding.optionNum", { num: idx + 1 })}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
});
