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
            spoken.enabled ? 200 : correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect
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
        helper={t("exercise.pressNumberToChooseWord", { count: options.length })}
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
          <div className="grid w-full grid-cols-2 gap-2 sm:gap-3" dir="ltr" lang="en">
            {options.map((option, index) => (
              <motion.button
                key={option.id}
                type="button"
                whileTap={!reduceMotion && feedback === null ? { scale: 0.95 } : {}}
                transition={{ duration: 0.1 }}
                aria-pressed={selectedId === option.id}
                aria-disabled={feedback !== null || undefined}
                onClick={() => handleSelect(option.id)}
                className="flex min-h-[48px] items-center justify-between rounded-xl border-2 border-border bg-wp-card p-2.5 font-sans text-base font-bold text-foreground shadow-wp-xs transition-colors hover:border-primary hover:bg-secondary/50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary motion-reduce:transition-none sm:min-h-[52px] sm:p-3 sm:text-lg"
              >
                <span className="capitalize">{option.label.toLowerCase()}</span>
                <span className="hidden rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground sm:inline-block">
                  {index + 1}
                </span>
              </motion.button>
            ))}
          </div>
        }
        feedback={
          feedback ? (
            <FeedbackPanel
              tone={feedback === "correct" ? "success" : "error"}
              title={
                feedback === "correct" ? t("exercise.correctTitle") : t("exercise.notQuiteTitle")
              }
              description={answerSentence}
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
