import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { Button, ExerciseFamilyTemplate, FeedbackPanel, MediaFrame } from "../shared";
import { getAuthoredLessonContent } from "./content/authoredLessonContent";
import { resolveGroup } from "../data/courseCatalog";
import { useSound } from "../shared/useSound";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useI18n } from "../context/I18nContext";
import { useLessonUsage } from "../data/useLessonUsage";
import { LessonTransferPractice } from "./LessonTransferPractice";
import { ScenePlaceholder } from "../shared/SentenceQuestionSupport";
import { QuestionImage } from "../shared/QuestionImage";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseReadingContext = memo(function ExerciseReadingContext({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const { t } = useI18n();
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();
  const lesson = getAuthoredLessonContent(lessonId);
  const usageState = useLessonUsage(lessonId);
  const [clusterIndex, setClusterIndex] = useState(0);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const cluster = lesson?.clusters[clusterIndex] ?? null;
  const isLastCluster = Boolean(lesson && clusterIndex === lesson.clusters.length - 1);
  const group = useMemo(
    () =>
      resolveGroup(
        lessonId,
        words.map((word) => word.id)
      ),
    [lessonId, words]
  );

  const correct = cluster ? selected === cluster.retrieval.answer : false;
  const handleSelect = useCallback(
    (option: string) => {
      if (selected !== null || !cluster) return;
      playClick();
      setSelected(option);
      if (option === cluster.retrieval.answer) playCorrect();
      else playIncorrect();
      cluster.targetWordIds.forEach((wordId) =>
        dispatch({
          type: "LESSON_ATTEMPT",
          wordId,
          correct: option === cluster.retrieval.answer,
          dimension: "independent-transfer",
        })
      );
    },
    [cluster, dispatch, playClick, playCorrect, playIncorrect, selected]
  );
  const handleContinue = useCallback(() => {
    if (!lesson || !cluster) return;
    if (clusterIndex >= lesson.clusters.length - 1) dispatch({ type: "LESSON_NEXT" });
    else setClusterIndex((index) => index + 1);
    setSelected(null);
  }, [cluster, clusterIndex, dispatch, lesson]);
  useEffect(() => {
    // The final answer opens independent production and spaced transfer.
    // Never auto-dismiss that work before the learner can use it.
    if (selected && accessibility.autoAdvance && !isLastCluster) {
      const timer = window.setTimeout(handleContinue, 1200);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [accessibility.autoAdvance, handleContinue, isLastCluster, selected]);
  if (!lesson || !cluster) return null;

  return (
    <ExerciseShell
      step={step}
      title={t("exercise.readingContextTitle")}
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      progress={{ current: clusterIndex + 1, total: lesson.clusters.length }}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="rounded-full border border-primary/20 bg-secondary px-2.5 py-0.5 font-semibold text-primary">
            {t("exercise.positionOf", { current: clusterIndex + 1, total: lesson.clusters.length })}
          </span>
        </>
      }
    >
      <ExerciseFamilyTemplate
        family="reading-context"
        instruction={t("exercise.readingContextInstruction")}
        helper={cluster.microReading.title}
        activityLabel={t("exercise.readingContextActivityAria")}
        activity={
          <div className="space-y-5">
            {cluster.microReading.media && failedImage !== cluster.microReading.media.imagePath ? (
              <MediaFrame
                fit="contain"
                as="figure"
                aspect="scene"
                className="mx-auto w-full max-w-3xl"
              >
                <QuestionImage
                  media={cluster.microReading.media}
                  decoding="async"
                  onExhausted={() => setFailedImage(cluster.microReading.media!.imagePath)}
                />
              </MediaFrame>
            ) : cluster.microReading.media ? (
              <ScenePlaceholder />
            ) : null}
            <p
              lang="en"
              dir="ltr"
              className="rounded-2xl border border-border bg-wp-card p-5 font-sans text-lg leading-relaxed text-foreground shadow-wp-xs sm:p-6 sm:text-xl"
            >
              {cluster.microReading.text}
            </p>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                  {t("exercise.readingContextQuestion")}
                </span>
                <p
                  className="font-sans text-base sm:text-lg font-bold text-foreground"
                  lang="en"
                  dir="ltr"
                >
                  {cluster.retrieval.prompt}
                </p>
              </div>
              <div
                className="grid gap-2 sm:grid-cols-3"
                role="group"
                aria-label={t("exercise.readingContextActivityAria")}
                dir="ltr"
                lang="en"
              >
                {cluster.retrieval.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected === option}
                    aria-disabled={selected !== null || undefined}
                    onClick={() => handleSelect(option)}
                    className="min-h-[48px] rounded-xl border-2 border-border bg-wp-card px-4 py-3 text-start font-sans font-bold text-foreground shadow-wp-xs transition-colors hover:border-primary hover:bg-secondary/50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary motion-reduce:transition-none"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {selected &&
              lesson &&
              isLastCluster &&
              usageState.status === "ready" &&
              usageState.data && <LessonTransferPractice usage={usageState.data} />}
          </div>
        }
        feedback={
          selected ? (
            <FeedbackPanel
              tone={correct ? "success" : "error"}
              title={correct ? t("exercise.correctTitle") : t("exercise.notQuiteTitle")}
              description={
                correct
                  ? t("exercise.readingContextCorrect")
                  : t("exercise.readingContextAnswer", { answer: cluster.retrieval.answer })
              }
              icon={
                correct ? (
                  <CheckCircle2 className="size-6 text-wp-green" aria-hidden />
                ) : (
                  <XCircle className="size-6 text-destructive" aria-hidden />
                )
              }
            />
          ) : undefined
        }
        action={
          selected && (!accessibility.autoAdvance || isLastCluster) ? (
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
