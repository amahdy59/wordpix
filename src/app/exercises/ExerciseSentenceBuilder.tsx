import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, PenTool, Undo2, XCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { Button, ExerciseFamilyTemplate, FeedbackPanel, Surface } from "../shared";
import { SentenceQuestionSupport, resolveSentenceMedia } from "../shared/SentenceQuestionSupport";
import { buildSentenceCompletion, getRichSentence } from "./exerciseContent";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
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

export const ExerciseSentenceBuilder = memo(function ExerciseSentenceBuilder({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [placed, setPlaced] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();
  const queue = useDrillQueue(words);
  const usageState = useLessonUsage(lessonId);
  const currentTargetWord = queue.current ?? words[0];
  const usage = usageState.status === "ready" ? usageState.data : null;
  const richSentence = useMemo(
    () => getRichSentence(currentTargetWord, usage, 1),
    [currentTargetWord, usage]
  );
  const completion = useMemo(
    () => buildSentenceCompletion(richSentence.full, currentTargetWord.label),
    [currentTargetWord.label, richSentence.full]
  );
  const answer = completion.answer;
  const shuffled = useMemo(() => shuffleArray([...answer]), [answer]);

  const advanceNext = useCallback(() => {
    if (feedback !== null) queue.submit(feedback === "correct");
    setPlaced([]);
    setFeedback(null);
  }, [feedback, queue]);
  const autoAdvance = useAutoAdvance({
    enabled: accessibility.autoAdvance,
    onAdvance: advanceNext,
  });

  useEffect(() => {
    if (queue.isComplete && feedback === null) dispatch({ type: "LESSON_NEXT" });
  }, [queue.isComplete, feedback, dispatch]);

  const commit = useCallback(
    (finalPlaced: string[]) => {
      const correct = finalPlaced.join(" ") === answer.join(" ");
      setFeedback(correct ? "correct" : "incorrect");
      if (correct) playCorrect();
      else playIncorrect();
      dispatch({
        type: "LESSON_ATTEMPT",
        wordId: currentTargetWord.id,
        correct,
        dimension: "controlled-production",
      });
      autoAdvance.schedule(correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect);
    },
    [answer, playCorrect, playIncorrect, dispatch, currentTargetWord.id, autoAdvance]
  );

  const handleTileClick = useCallback(
    (item: string) => {
      if (feedback !== null) return;
      playClick();
      const next = [...placed, item];
      setPlaced(next);
      if (next.length === answer.length) commit(next);
    },
    [feedback, playClick, placed, answer.length, commit]
  );
  const handleRemoveTile = useCallback(
    (index: number) => {
      if (feedback !== null) return;
      playClick();
      setPlaced((items) => items.filter((_, itemIndex) => itemIndex !== index));
    },
    [feedback, playClick]
  );

  useEffect(() => {
    if (feedback !== null || placed.length === 0) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Backspace") return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      )
        return;
      event.preventDefault();
      handleRemoveTile(placed.length - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [feedback, placed.length, handleRemoveTile]);

  const handleContinue = useCallback(() => {
    autoAdvance.cancel();
    advanceNext();
  }, [autoAdvance, advanceNext]);
  const handleSkipToReading = useCallback(() => {
    autoAdvance.cancel();
    dispatch({ type: "LESSON_GOTO_STEP", step: step + 2 });
  }, [autoAdvance, dispatch, step]);
  const group = useMemo(
    () =>
      resolveGroup(
        lessonId,
        words.map((word) => word.id)
      ),
    [lessonId, words]
  );
  const remaining = answer.length - placed.length;
  const sentence = richSentence.full;

  return (
    <ExerciseShell
      step={step}
      title={t("exercise.sentenceBuilderTitle")}
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      progress={{ current: queue.position, total: queue.total }}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary px-2.5 py-0.5 font-semibold text-primary">
            <PenTool className="size-3" aria-hidden />
            <span>{t("exercise.sentenceOf", { current: queue.position, total: queue.total })}</span>
          </span>
        </>
      }
    >
      <ExerciseFamilyTemplate
        family="text-construction"
        instruction={t("exercise.buildSentence")}
        helper={t("exercise.wordsRemaining", { count: remaining })}
        activityLabel={t("exercise.sentenceBuilderActivityAria")}
        activity={
          <div className="grid w-full gap-4 lg:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-6">
            <SentenceQuestionSupport
              key={currentTargetWord.id}
              word={currentTargetWord}
              sentence={sentence}
              prompt={completion.tokens
                .map((token, index) =>
                  index >= completion.blankStart && index < completion.blankStart + answer.length
                    ? "____"
                    : token
                )
                .join(" ")}
              media={resolveSentenceMedia(currentTargetWord.id, sentence, usage)}
              answered={feedback !== null}
            />

            <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
              <Surface
                variant="card"
                radius="lg"
                padding="sm"
                className="flex w-full flex-col gap-2 border-2 border-primary/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 font-sans text-xs font-bold text-primary">
                    {t("exercise.sentenceAssemblyCanvas")}
                    {feedback === "correct" && (
                      <CheckCircle2 className="size-4 text-wp-green" aria-hidden />
                    )}
                    {feedback === "incorrect" && (
                      <XCircle className="size-4 text-destructive" aria-hidden />
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeft={<Undo2 className="size-4" aria-hidden />}
                    onClick={() => handleRemoveTile(placed.length - 1)}
                    disabled={placed.length === 0 || feedback !== null}
                  >
                    {t("exercise.undo")}
                  </Button>
                </div>
                <div
                  className={`flex min-h-[88px] flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-xl border border-dashed p-3 text-center font-sans text-base font-bold leading-relaxed transition-colors motion-reduce:transition-none sm:min-h-[96px] sm:p-4 sm:text-lg ${
                    feedback === "correct"
                      ? "border-wp-green bg-wp-green-light/30"
                      : feedback === "incorrect"
                        ? "border-destructive bg-destructive/10"
                        : "border-primary/40 bg-secondary/40"
                  }`}
                  aria-label={t("exercise.sentenceWithMissingWordsAria")}
                  dir="ltr"
                  lang="en"
                >
                  {completion.tokens.map((token, tokenIndex) => {
                    const blankIndex = tokenIndex - completion.blankStart;
                    const isBlank = blankIndex >= 0 && blankIndex < answer.length;
                    if (!isBlank) {
                      return <span key={`${token}-${tokenIndex}`}>{token}</span>;
                    }

                    const placedWord = placed[blankIndex];
                    const trailingPunctuation = token.match(/[.,!?;:]+$/u)?.[0] ?? "";
                    return (
                      <span
                        key={`blank-${tokenIndex}`}
                        className="inline-flex items-center gap-0.5"
                      >
                        {placedWord ? (
                          <motion.button
                            type="button"
                            whileTap={!reduceMotion && feedback === null ? { scale: 0.95 } : {}}
                            transition={{ duration: 0.1 }}
                            disabled={feedback !== null}
                            aria-label={t("exercise.removePlacedWord", {
                              word: placedWord,
                              position: blankIndex + 1,
                            })}
                            onClick={() => handleRemoveTile(blankIndex)}
                            className="min-h-11 rounded-xl bg-primary px-3.5 py-2 font-sans text-sm font-black text-primary-foreground shadow-wp-xs transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
                          >
                            {placedWord}
                          </motion.button>
                        ) : (
                          <span className="inline-flex min-h-11 min-w-20 items-center justify-center rounded-xl border-2 border-dashed border-primary/60 bg-card px-3 py-2 text-primary">
                            <span className="sr-only">
                              {t("exercise.sentenceBlank", {
                                position: blankIndex + 1,
                                total: answer.length,
                              })}
                            </span>
                            <span aria-hidden>___</span>
                          </span>
                        )}
                        {trailingPunctuation && <span aria-hidden>{trailingPunctuation}</span>}
                      </span>
                    );
                  })}
                </div>
              </Surface>
              <div
                role="group"
                aria-label={t("exercise.availableWordsAria")}
                className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-3"
                dir="ltr"
                lang="en"
              >
                {shuffled.map((item, index) => {
                  const usedCount = placed.filter((placedItem) => placedItem === item).length;
                  const availableCount = shuffled
                    .slice(0, index + 1)
                    .filter((tile) => tile === item).length;
                  const used = usedCount >= availableCount;
                  return (
                    <motion.button
                      key={`${item}-${index}`}
                      type="button"
                      whileTap={!reduceMotion && !used && feedback === null ? { scale: 0.95 } : {}}
                      transition={{ duration: 0.1 }}
                      disabled={used || feedback !== null}
                      aria-label={t("exercise.placeWord", {
                        word: item,
                        position: placed.length + 1,
                      })}
                      onClick={() => handleTileClick(item)}
                      className="min-h-11 rounded-xl border-2 border-border bg-wp-card px-4 py-2.5 font-sans text-sm font-bold text-foreground shadow-wp-xs transition-colors hover:border-primary hover:bg-secondary/50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-30 sm:text-base"
                    >
                      {item}
                    </motion.button>
                  );
                })}
              </div>
              <span aria-live="polite" aria-atomic="true" className="sr-only">
                {feedback === "correct"
                  ? t("exercise.correctSentence", { sentence })
                  : feedback === "incorrect"
                    ? t("exercise.incorrectSentence", { sentence })
                    : placed.length === 0
                      ? t("exercise.noWordsPlaced")
                      : t("exercise.sentenceProgress", {
                          sentence: placed.join(" "),
                          count: remaining,
                        })}
              </span>
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
              description={
                feedback === "correct"
                  ? t("exercise.correctSentence", { sentence })
                  : t("exercise.incorrectSentence", { sentence })
              }
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
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              iconLeft={<BookOpen className="size-4" aria-hidden />}
              onClick={handleSkipToReading}
            >
              {t("exercise.skipToReading")}
            </Button>
            {feedback !== null && !accessibility.autoAdvance && (
              <Button
                size="lg"
                iconRight={<ArrowRight className="size-4 rtl:rotate-180" aria-hidden />}
                onClick={handleContinue}
              >
                {t("action.continue")}
              </Button>
            )}
          </div>
        }
      />
    </ExerciseShell>
  );
});
