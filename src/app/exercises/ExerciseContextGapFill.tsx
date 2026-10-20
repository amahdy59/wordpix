import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { Button, ExerciseFamilyTemplate, FeedbackPanel } from "../shared";
import { getAuthoredSentence } from "./content/authoredLessonContent";
import { sentenceCloze } from "./sentenceCloze";
import { getRichSentence } from "./exerciseContent";
import { resolveGroup } from "../data/courseCatalog";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { useI18n } from "../context/I18nContext";
import { useLessonUsage } from "../data/useLessonUsage";
import { SentenceQuestionSupport, resolveSentenceMedia } from "../shared/SentenceQuestionSupport";
import { ClozeText } from "../shared/SentenceBlank";
import { useKeyboardShortcutsActive } from "../shared/devicePreferences";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
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
  usePrefetchImage(queue.next);
  const usageState = useLessonUsage(lessonId);
  const currentTargetWord = queue.current ?? words[0];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const shortcutsActive = useKeyboardShortcutsActive();

  const authoredSentence = getAuthoredSentence(currentTargetWord.id);
  const usage = usageState.status === "ready" ? usageState.data : null;
  const fullSentence = authoredSentence?.full ?? getRichSentence(currentTargetWord, usage).full;
  const media = resolveSentenceMedia(currentTargetWord.id, fullSentence, usage);
  const candidate = sentenceCloze(fullSentence, currentTargetWord.label);
  const hasBlank = candidate !== fullSentence;
  const clozeSentence = hasBlank ? candidate : t("exercise.chooseMeaningClue");
  const options = useMemo(() => {
    const distractors = words.filter((word) => word.id !== currentTargetWord.id);
    return shuffleArray([currentTargetWord, ...shuffleArray(distractors).slice(0, 2)]);
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
      autoAdvance.schedule(
        correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect,
        correct
      );
    },
    [autoAdvance, currentTargetWord.id, dispatch, feedback, playClick, playCorrect, playIncorrect]
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
        family="visual-choice"
        instruction={hasBlank ? t("exercise.gapFillInstruction") : t("exercise.chooseMeaningClue")}
        helper={
          shortcutsActive ? (
            <span>{t("exercise.pressNumberToChooseWord", { count: options.length })}</span>
          ) : undefined
        }
        activityLabel={t("exercise.gapFillActivityAria")}
        prompt={
          hasBlank && (
            <div
              lang="en"
              dir="ltr"
              aria-label={t("exercise.gapFillSentenceAria", {
                sentence: clozeSentence.replace(
                  /_{2,}/gu,
                  options.find((option) => option.id === selectedId)?.label ??
                    t("exercise.missingWord")
                ),
              })}
              data-question-prompt
              className="text-start font-sans"
            >
              <p className="wp-question-prompt">
                <ClozeText
                  text={clozeSentence}
                  answer={options.find((option) => option.id === selectedId)?.label}
                />
              </p>
            </div>
          )
        }
        media={
          <SentenceQuestionSupport
            key={currentTargetWord.id}
            sentence={fullSentence}
            prompt={clozeSentence}
            word={currentTargetWord}
            media={media}
            answered={feedback !== null}
          />
        }
        activity={
          <div className="flex flex-col gap-2.5 sm:gap-4 w-full">
            <div
              className="flex flex-col gap-2 sm:gap-2.5 w-full"
              role="group"
              aria-label={t("exercise.gapFillChoicesAria")}
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
                  <button
                    key={option.id}
                    type="button"
                    data-is-target={isCorrect}
                    aria-pressed={isSelected}
                    aria-disabled={feedback !== null || undefined}
                    onClick={() => handleSelect(option.id)}
                    className={`wp-question-option group flex w-full items-center justify-between gap-3 border font-sans font-semibold transition-all motion-reduce:transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${stateClasses}`}
                  >
                    <span className="flex items-center gap-3">
                      {isSelected && feedback === "correct" && (
                        <CheckCircle2
                          className="size-5 text-wp-green shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      {isSelected && feedback === "incorrect" && (
                        <XCircle className="size-5 text-destructive shrink-0" aria-hidden="true" />
                      )}
                      {showRevealed && (
                        <CheckCircle2
                          className="size-5 text-wp-green shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                    </span>
                    {shortcutsActive && (
                      <span className="rounded-lg border border-border/80 bg-muted px-2.5 py-1 text-xs font-mono font-bold text-muted-foreground group-hover:border-primary/40 group-hover:text-primary inline-block">
                        {index + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        }
        feedback={
          feedback === "incorrect" ? (
            <FeedbackPanel
              tone="error"
              live="polite"
              title={t("exercise.notQuiteTitle")}
              description={
                <span className="flex flex-col gap-1">
                  <span
                    className="text-sm font-medium leading-relaxed text-muted-foreground"
                    lang="en"
                    dir="ltr"
                  >
                    {fullSentence}
                  </span>
                  {currentTargetWord.description && (
                    <span className="text-xs leading-snug text-foreground/75" lang="en" dir="ltr">
                      {currentTargetWord.description}
                    </span>
                  )}
                  {currentTargetWord.arabicTranslation && (
                    <span
                      className="font-arabic text-sm font-semibold text-foreground/80"
                      dir="rtl"
                      lang="ar"
                    >
                      {currentTargetWord.arabicTranslation}
                    </span>
                  )}
                </span>
              }
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
              hotkey="↵ Enter"
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
