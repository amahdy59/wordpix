import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, PenTool, Undo2, XCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { Button, ExerciseFamilyTemplate, FeedbackPanel, MediaFrame, Surface } from "../shared";
import { WordImage } from "../shared/WordImage";
import { getRichSentence } from "./exerciseContent";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { usePrefetchImage } from "../shared/usePrefetchImage";
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
  usePrefetchImage(queue.next);
  const usage = usageState.status === "ready" ? usageState.data : null;
  const richSentence = useMemo(
    () => getRichSentence(currentTargetWord, usage, 1),
    [currentTargetWord, usage]
  );
  const answer = useMemo(() => richSentence.words, [richSentence]);
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
  const group = useMemo(
    () =>
      resolveGroup(
        lessonId,
        words.map((word) => word.id)
      ),
    [lessonId, words]
  );
  const remaining = answer.length - placed.length;
  const sentence = answer.join(" ");

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
        media={
          <MediaFrame aspect="scene" className="max-h-[30dvh] sm:max-h-[36dvh]">
            <WordImage
              word={currentTargetWord}
              className="size-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-3 pt-8 sm:px-5">
              <span className="font-sans text-base font-bold tracking-wide text-white drop-shadow-md sm:text-xl">
                {currentTargetWord.label}
              </span>
            </div>
          </MediaFrame>
        }
        activity={
          <div className="flex flex-col gap-4">
            <Surface
              variant="card"
              radius="lg"
              padding="xs"
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
                className={`flex min-h-[76px] flex-wrap items-center gap-2 rounded-xl border border-dashed p-2.5 transition-colors motion-reduce:transition-none sm:min-h-[84px] ${
                  feedback === "correct"
                    ? "border-wp-green bg-wp-green-light/30"
                    : feedback === "incorrect"
                      ? "border-destructive bg-destructive/10"
                      : "border-primary/40 bg-secondary/40"
                }`}
                aria-label={t("exercise.builtSentenceAria")}
                dir="ltr"
                lang="en"
              >
                {placed.map((item, index) => (
                  <motion.button
                    key={`${item}-${index}`}
                    type="button"
                    whileTap={!reduceMotion && feedback === null ? { scale: 0.95 } : {}}
                    transition={{ duration: 0.1 }}
                    aria-disabled={feedback !== null || undefined}
                    onClick={() => handleRemoveTile(index)}
                    className="min-h-[44px] rounded-xl bg-primary px-3.5 py-2 font-sans text-sm font-black text-primary-foreground shadow-wp-xs transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary motion-reduce:transition-none sm:text-base"
                  >
                    {item}
                  </motion.button>
                ))}
                {placed.length === 0 && (
                  <span className="px-2 font-sans text-xs font-medium text-muted-foreground sm:text-sm">
                    {t("exercise.sentencePlaceholder")}
                  </span>
                )}
              </div>
            </Surface>
            <div
              role="group"
              aria-label={t("exercise.availableWordsAria")}
              className="flex w-full flex-wrap justify-center gap-2.5"
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
                    disabled={used}
                    aria-disabled={feedback !== null || undefined}
                    onClick={() => handleTileClick(item)}
                    className={`min-h-[44px] rounded-xl border-2 border-border bg-wp-card px-5 py-2.5 font-sans text-sm font-bold text-foreground shadow-wp-xs transition-colors hover:border-primary hover:bg-secondary/50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary motion-reduce:transition-none disabled:opacity-30 sm:text-base ${feedback !== null ? "opacity-40" : ""}`}
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
