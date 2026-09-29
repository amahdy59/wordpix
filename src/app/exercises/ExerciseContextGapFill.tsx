import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { Button, ExerciseFamilyTemplate, FeedbackPanel } from "../shared";
import { getAuthoredSentence } from "./content/authoredLessonContent";
import { getRichSentence } from "./exerciseContent";
import { resolveGroup } from "../data/courseCatalog";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { useI18n } from "../context/I18nContext";
import { useLessonUsage } from "../data/useLessonUsage";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

function toWordPattern(label: string) {
  return new RegExp(
    `\\b${label
      .trim()
      .split(/\\s+/)
      .map((part) => part.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"))
      .join("\\\\s+")}\\b`,
    "i"
  );
}

export const ExerciseContextGapFill = memo(function ExerciseContextGapFill({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const { t } = useI18n();
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();
  const queue = useDrillQueue(words);
  const usageState = useLessonUsage(lessonId);
  const currentTargetWord = queue.current ?? words[0];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const authoredSentence = getAuthoredSentence(currentTargetWord.id);
  const usage = usageState.status === "ready" ? usageState.data : null;
  const fullSentence = authoredSentence?.full ?? getRichSentence(currentTargetWord, usage).full;
  const clozeSentence = fullSentence
    .replace(toWordPattern(currentTargetWord.label), "_____ ")
    .trim();
  const options = useMemo(() => {
    const distractors = words.filter((word) => word.id !== currentTargetWord.id);
    return shuffleArray([currentTargetWord, ...shuffleArray(distractors).slice(0, 3)]);
  }, [currentTargetWord, words]);

  const advanceNext = useCallback(() => {
    if (feedback !== null) queue.submit(feedback === "correct");
    setSelectedId(null);
    setFeedback(null);
  }, [feedback, queue]);
  const autoAdvance = useAutoAdvance({
    enabled: accessibility.autoAdvance,
    onAdvance: advanceNext,
  });

  useEffect(() => {
    if (queue.isComplete && feedback === null) dispatch({ type: "LESSON_NEXT" });
  }, [dispatch, feedback, queue.isComplete]);

  const handleSelect = useCallback(
    (id: string) => {
      if (feedback !== null) return;
      playClick();
      const correct = id === currentTargetWord.id;
      setSelectedId(id);
      setFeedback(correct ? "correct" : "incorrect");
      if (correct) playCorrect();
      else playIncorrect();
      dispatch({
        type: "LESSON_ATTEMPT",
        wordId: currentTargetWord.id,
        correct,
        dimension: "contextual-comprehension",
      });
      if (accessibility.autoAdvance) {
        autoAdvance.schedule(correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect);
      }
    },
    [
      accessibility.autoAdvance,
      autoAdvance,
      currentTargetWord.id,
      dispatch,
      feedback,
      playClick,
      playCorrect,
      playIncorrect,
    ]
  );

  const handleContinue = useCallback(() => {
    autoAdvance.cancel();
    advanceNext();
  }, [advanceNext, autoAdvance]);
  const selectByIndex = useCallback(
    (index: number) => {
      const option = options[index];
      if (option) handleSelect(option.id);
    },
    [handleSelect, options]
  );
  useExerciseHotkeys({
    optionCount: options.length,
    onSelectIndex: selectByIndex,
    disabled: feedback !== null,
  });

  const group = useMemo(
    () =>
      resolveGroup(
        lessonId,
        words.map((word) => word.id)
      ),
    [lessonId, words]
  );

  return (
    <ExerciseShell
      step={step}
      title={t("exercise.gapFillTitle")}
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      progress={{ current: queue.position, total: queue.total }}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="rounded-full border border-primary/20 bg-secondary px-2.5 py-0.5 font-semibold text-primary">
            {t("exercise.sentenceOf", { current: queue.position, total: queue.total })}
          </span>
        </>
      }
    >
      <ExerciseFamilyTemplate
        family="reading-context"
        instruction={t("exercise.gapFillInstruction")}
        helper={t("exercise.pressNumberToChooseWord", { count: options.length })}
        activityLabel={t("exercise.gapFillActivityAria")}
        activity={
          <div className="space-y-4">
            <p
              lang="en"
              dir="ltr"
              aria-label={t("exercise.gapFillSentenceAria", { sentence: clozeSentence })}
              className="rounded-2xl border border-border bg-wp-card p-5 text-center font-sans text-xl font-semibold leading-relaxed text-foreground shadow-wp-xs sm:text-2xl"
            >
              {clozeSentence}
            </p>
            <div
              className="grid w-full grid-cols-2 gap-2 sm:gap-3"
              role="group"
              aria-label={t("exercise.gapFillChoicesAria")}
              dir="ltr"
              lang="en"
            >
              {options.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selectedId === option.id}
                  aria-disabled={feedback !== null || undefined}
                  onClick={() => handleSelect(option.id)}
                  className="flex min-h-[48px] items-center justify-between rounded-xl border-2 border-border bg-wp-card p-2.5 font-sans text-base font-bold text-foreground shadow-wp-xs transition-colors hover:border-primary hover:bg-secondary/50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary motion-reduce:transition-none sm:min-h-[52px] sm:p-3 sm:text-lg"
                >
                  <span>{option.label}</span>
                  <span className="hidden rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline-block">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        }
        feedback={
          feedback ? (
            <FeedbackPanel
              tone={feedback === "correct" ? "success" : "error"}
              title={
                feedback === "correct" ? t("exercise.correctTitle") : t("exercise.notQuiteTitle")
              }
              description={fullSentence}
              icon={
                feedback === "correct" ? (
                  <CheckCircle2 className="size-6 text-wp-green" aria-hidden />
                ) : (
                  <XCircle className="size-6 text-destructive" aria-hidden />
                )
              }
            />
          ) : undefined
        }
        action={
          feedback !== null && !accessibility.autoAdvance ? (
            <Button
              size="lg"
              iconRight={<ArrowRight className="size-4 rtl:rotate-180" aria-hidden />}
              onClick={handleContinue}
            >
              {t("action.continue")}
            </Button>
          ) : undefined
        }
      />
    </ExerciseShell>
  );
});
