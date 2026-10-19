import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence, getDistractors } from "./exerciseContent";
import { identifySentence } from "../content/wordGrammar";
import { shuffleArray } from "../../utils/shuffle";
import { Button } from "../shared/Button";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useSpokenFeedback } from "../shared/useSpokenFeedback";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { HelpCircle, Keyboard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useI18n } from "../context/I18nContext";
import { ImmersiveImageChoiceGrid } from "../shared/ImmersiveImageChoiceGrid";
import { ImageChoiceCard } from "../shared/ImageChoiceCard";
import { useKeyboardShortcutsActive } from "../shared/devicePreferences";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseQuickQuiz = memo(function ExerciseQuickQuiz({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const shortcutsActive = useKeyboardShortcutsActive();
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();
  const spoken = useSpokenFeedback();

  const queue = useDrillQueue(words);
  const currentTargetWord = queue.current ?? words[0];
  const richSentence = useMemo(() => getRichSentence(currentTargetWord), [currentTargetWord]);
  usePrefetchImage(queue.next);

  const options = useMemo(() => {
    const distractors = getDistractors(currentTargetWord, 3, words);
    return shuffleArray([currentTargetWord, ...distractors]);
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
          chosenLabel: options.find((o) => o.id === id)?.label,
          chosenTopic: currentTargetWord.topic,
        },
        () => {
          // Extra 200ms pause after voice finishes so it doesn't snap instantly
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
        dimension: "visual-recognition",
      });
    },
    [
      feedback,
      playClick,
      playCorrect,
      playIncorrect,
      currentTargetWord.id,
      currentTargetWord.label,
      currentTargetWord.topic,
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
        words.map((w) => w.id)
      ),
    [lessonId, words]
  );

  return (
    <ExerciseShell
      step={step}
      title="Mastery Quick Quiz"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      layout="media"
      progress={{ current: queue.position, total: queue.total }}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <HelpCircle className="size-3" aria-hidden />
            <span>{t("exercise.questionOf", { current: queue.position, total: queue.total })}</span>
          </span>
        </>
      }
      // The keyboard hint is shown only where there is a keyboard.
      // `pointer-fine` asks the device directly, which a width breakpoint only
      // guesses at: a tablet in landscape is wide and still has nothing to
      // press "1" with, and telling a learner to press a key they do not have
      // is noise in the one strip of the screen reserved for what to do next.
      footer={
        <div className="w-full hidden pointer-fine:flex items-center text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-wp-amber-foreground font-bold">
            <Keyboard className="size-4" aria-hidden />
            <span>{t("exercise.pressNumberToChoose", { count: options.length })}</span>
          </div>
        </div>
      }
    >
      <div className="relative flex min-h-0 w-full flex-1 flex-col gap-3 sm:gap-4">
        {/* Question card */}
        <div className="flex shrink-0 flex-col gap-3 py-2">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h2
              className="wp-question-prompt font-sans flex-1 text-pretty"
              data-question-prompt
              data-question="Which picture shows"
            >
              {t("exercise.whichPictureShows", { word: currentTargetWord.label })}
            </h2>
            <span className="text-sm font-sans font-semibold text-muted-foreground shrink-0 whitespace-nowrap">
              /{currentTargetWord.phonetic}/
            </span>
          </div>
        </div>

        <ImmersiveImageChoiceGrid aria-label={`Which image matches ${currentTargetWord.label}?`}>
          {options.map((option, idx) => (
            <ImageChoiceCard
              key={option.id}
              option={option}
              index={idx}
              totalOptions={options.length}
              isSelected={selectedId === option.id}
              feedback={feedback}
              isRevealedAnswer={feedback === "incorrect" && option.id === currentTargetWord.id}
              disabled={feedback !== null}
              onClick={() => handleSelect(option.id)}
              reduceMotion={Boolean(reduceMotion)}
              showShortcut={shortcutsActive}
            />
          ))}
        </ImmersiveImageChoiceGrid>

        {/* Screen-reader announcement */}
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          {feedback === "correct"
            ? `Correct! ${identifySentence(currentTargetWord.label, currentTargetWord.topic)} ${richSentence.full}`
            : feedback === "incorrect"
              ? `Incorrect. The correct answer is ${currentTargetWord.label}.`
              : ""}
        </span>

        {/* Continue strip — appears below grid only after incorrect answer when manual advance is preferred */}
        <AnimatePresence>
          {feedback === "incorrect" && !accessibility.autoAdvance && (
            <motion.div
              key="continue-strip"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.3 }}
              className="shrink-0 rounded-2xl px-5 py-3 flex flex-col gap-2 border bg-wp-rose/10 border-wp-rose/30"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-sans font-semibold text-foreground text-sm">
                  {`✗ ${identifySentence(currentTargetWord.label, currentTargetWord.topic)}`}
                </span>
                <Button
                  onClick={handleContinue}
                  hotkey="↵ Enter"
                  size="sm"
                  iconRight={<ArrowRight className="size-4 rtl:rotate-180" aria-hidden />}
                >
                  {t("action.continue")}
                </Button>
              </div>
              {/* "Why incorrect" contextual explanation */}
              {feedback === "incorrect" && (
                <div className="flex flex-col gap-0.5">
                  {currentTargetWord.description && (
                    <p
                      className="font-sans text-xs text-foreground/80 leading-snug"
                      lang="en"
                      dir="ltr"
                    >
                      {currentTargetWord.description}
                    </p>
                  )}
                  {currentTargetWord.arabicTranslation && (
                    <p
                      className="font-arabic text-sm text-foreground/80 font-semibold"
                      dir="rtl"
                      lang="ar"
                    >
                      {currentTargetWord.arabicTranslation}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ExerciseShell>
  );
});
