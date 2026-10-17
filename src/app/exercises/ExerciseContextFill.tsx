import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { Button, ExerciseFamilyTemplate, FeedbackPanel } from "../shared";
import { getAuthoredSentence } from "./content/authoredLessonContent";
import { SentenceQuestionSupport, resolveSentenceMedia } from "../shared/SentenceQuestionSupport";
import { useLessonUsage } from "../data/useLessonUsage";
import { getRichSentence } from "./exerciseContent";
import { sentenceCloze } from "./sentenceCloze";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useSpokenFeedback } from "../shared/useSpokenFeedback";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { useI18n } from "../context/I18nContext";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseContextFill = memo(function ExerciseContextFill({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();
  const spoken = useSpokenFeedback();
  const queue = useDrillQueue(words);
  const currentTargetWord = queue.current ?? words[0];
  const usageState = useLessonUsage(lessonId);
  const usage = usageState.status === "ready" ? usageState.data : null;
  usePrefetchImage(queue.next);

  const options = useMemo(() => {
    const otherWords = words.filter((word) => word.id !== currentTargetWord.id);
    return shuffleArray([currentTargetWord, ...shuffleArray(otherWords).slice(0, 3)]);
  }, [currentTargetWord, words]);
  const authoredSentence = useMemo(
    () => getAuthoredSentence(currentTargetWord.id),
    [currentTargetWord.id]
  );
  const answerSentence = useMemo(
    () => authoredSentence?.full ?? getRichSentence(currentTargetWord, usage).full,
    [authoredSentence, currentTargetWord, usage]
  );
  const media = resolveSentenceMedia(currentTargetWord.id, answerSentence, usage);

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
  }, [queue.isComplete, feedback, dispatch]);

  const handleSelect = useCallback(
    (id: string) => {
      if (feedback !== null) return;
      playClick();
      setSelectedId(id);
      const correct = id === currentTargetWord.id;
      setFeedback(correct ? "correct" : "incorrect");
      if (correct) playCorrect();
      else playIncorrect();
      spoken.speakFeedback(
        {
          correct,
          targetLabel: currentTargetWord.label,
          targetTopic: currentTargetWord.topic,
          chosenLabel: options.find((option) => option.id === id)?.label,
          chosenTopic: currentTargetWord.topic,
        },
        () => {
          autoAdvance.schedule(
            spoken.enabled ? 200 : correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect,
            correct
          );
        }
      );
      dispatch({
        type: "LESSON_ATTEMPT",
        wordId: currentTargetWord.id,
        correct,
        dimension: "contextual-comprehension",
      });
    },
    [
      feedback,
      playClick,
      playCorrect,
      playIncorrect,
      currentTargetWord,
      options,
      spoken,
      dispatch,
      autoAdvance,
    ]
  );

  const handleContinue = useCallback(() => {
    autoAdvance.cancel();
    spoken.cancel();
    advanceNext();
  }, [autoAdvance, spoken, advanceNext]);
  const selectByIndex = useCallback(
    (index: number) => {
      const option = options[index];
      if (option) handleSelect(option.id);
    },
    [options, handleSelect]
  );
  useExerciseHotkeys({
    optionCount: options.length,
    onSelectIndex: selectByIndex,
    onContinue: feedback !== null ? handleContinue : undefined,
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
      title={t("exercise.pictureMatchTitle")}
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
        family="visual-choice"
        instruction={t("exercise.chooseCorrectWord")}
        helper={
          <span className="hidden sm:inline">
            {t("exercise.pressNumberToChooseWord", { count: options.length })}
          </span>
        }
        activityLabel={t("exercise.wordChoicesAria")}
        media={
          <SentenceQuestionSupport
            key={currentTargetWord.id}
            word={currentTargetWord}
            sentence={answerSentence}
            prompt={sentenceCloze(answerSentence, currentTargetWord.label)}
            media={media}
            answered={feedback !== null}
          />
        }
        activity={
          <div
            className="flex flex-col gap-3 sm:gap-3.5 w-full"
            role="group"
            aria-label={t("exercise.wordChoicesAria")}
            dir="ltr"
            lang="en"
          >
            {options.map((option, index) => {
              const isSelected = selectedId === option.id;
              const isCorrect = option.id === currentTargetWord.id;
              const showRevealed = feedback === "incorrect" && isCorrect;

              let stateClasses =
                "border-border bg-wp-card text-foreground hover:border-primary/70 hover:bg-secondary/40 shadow-wp-xs hover:shadow-wp-sm";
              if (isSelected) {
                if (feedback === "correct") {
                  stateClasses =
                    "border-wp-green bg-wp-green-light/40 dark:bg-wp-green/20 text-foreground shadow-wp-sm";
                } else if (feedback === "incorrect") {
                  stateClasses =
                    "border-wp-rose bg-wp-rose-light/40 dark:bg-wp-rose/20 text-foreground shadow-wp-sm";
                } else {
                  stateClasses = "border-primary bg-secondary text-primary shadow-wp-sm";
                }
              } else if (showRevealed) {
                stateClasses =
                  "border-wp-green bg-wp-green-light/20 dark:bg-wp-green/10 text-foreground";
              }

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileTap={!reduceMotion && feedback === null ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.1 }}
                  aria-pressed={isSelected}
                  aria-disabled={feedback !== null || undefined}
                  onClick={() => handleSelect(option.id)}
                  className={`group flex min-h-[56px] sm:min-h-[64px] lg:min-h-[70px] w-full items-center justify-between rounded-2xl border-2 p-3.5 sm:p-5 font-sans text-lg sm:text-xl font-bold transition-all motion-reduce:transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${stateClasses}`}
                >
                  <span className="flex items-center gap-3">
                    {isSelected && feedback === "correct" && (
                      <CheckCircle2 className="size-5 text-wp-green shrink-0" aria-hidden="true" />
                    )}
                    {isSelected && feedback === "incorrect" && (
                      <XCircle className="size-5 text-destructive shrink-0" aria-hidden="true" />
                    )}
                    {showRevealed && (
                      <CheckCircle2 className="size-5 text-wp-green shrink-0" aria-hidden="true" />
                    )}
                    <span className="capitalize">{option.label.toLowerCase()}</span>
                  </span>
                  <span className="hidden rounded-lg border border-border/80 bg-muted px-2.5 py-1 text-xs font-mono font-bold text-muted-foreground group-hover:border-primary/40 group-hover:text-primary sm:inline-block">
                    {index + 1}
                  </span>
                </motion.button>
              );
            })}
          </div>
        }
        feedback={
          feedback === "incorrect" ? (
            <FeedbackPanel
              tone="error"
              title={t("exercise.notQuiteTitle")}
              description={answerSentence}
              icon={<XCircle className="size-6 text-destructive" aria-hidden />}
            />
          ) : feedback === "correct" ? (
            <p className="sr-only" role="status" aria-live="polite">
              {t("exercise.correctTitle")}
            </p>
          ) : undefined
        }
        action={
          feedback === "incorrect" && !accessibility.autoAdvance ? (
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
