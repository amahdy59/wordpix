import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { Action } from "../../types";
import { useAudio } from "../../shared/useAudio";
import { useI18n } from "../../../i18n";
import { useLearner } from "../../context/LearnerContext";
import { PrivateRecordCompare } from "./PrivateRecordCompare";
import {
  getFigmaPronunciationActivityData,
  pronunciationImagePath,
  seededPronunciationShuffle,
  type FigmaPronunciationImage,
} from "./figmaPronunciationCatalog";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { getPronunciationAudioClip } from "./pronunciationAudioManifest";

interface Props {
  lessonNumber: number;
  dispatch: React.Dispatch<Action>;
}
type Stage = 0 | 1 | 2 | 3 | 4;

const STAGES = ["Preview", "Listen", "Meaning", "Use it", "Transfer"] as const;
const TRIALS_PER_STAGE = 3;
const rolePool = (activity: ReturnType<typeof getFigmaPronunciationActivityData>, stage: Stage) =>
  stage === 4 && activity.transferItems.length
    ? [...activity.transferItems]
    : [...activity.teachItems, ...activity.guidedItems, ...activity.independentItems];

function imageFor(item: FigmaPronunciationImage) {
  return resolveAssetUrl(pronunciationImagePath(item.imageRef));
}

export function FigmaPronunciationLessonScreen({ lessonNumber, dispatch }: Props) {
  const { t } = useI18n();
  const { state, recordPronunciationCheckpoint, recordPronunciationCompletion } = useLearner();
  const activity = getFigmaPronunciationActivityData(lessonNumber);
  const progress = state.pronunciationProgress[`lesson-${String(lessonNumber).padStart(2, "0")}`];
  const restoredStage =
    progress?.status === "in-progress"
      ? (Math.min(4, Math.max(0, progress.currentStage)) as Stage)
      : 0;
  const [stage, setStage] = useState<Stage>(restoredStage);
  const [trial, setTrial] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [completedScore, setCompletedScore] = useState<number | null>(null);
  const { speak, stop, isPlaying } = useAudio({ lang: "en-US", rate: 0.78, preferLocal: true });
  const pool = rolePool(activity, stage);
  const target =
    stage === 0
      ? (activity.items.find(
          (item) =>
            item.label.toLocaleLowerCase("en-US") === activity.model.toLocaleLowerCase("en-US")
        ) ?? activity.items[0])
      : pool.length > 0
        ? pool[(lessonNumber * 7 + Math.max(0, stage - 1) * 5 + trial * 3) % pool.length]
        : activity.items[0];
  const audioClip = getPronunciationAudioClip(target?.label ?? activity.model, stage === 4);
  const choices = target
    ? seededPronunciationShuffle(
        [target, ...pool.filter((item) => item.label !== target.label).slice(0, 3)],
        lessonNumber * 31 + stage * 17 + trial * 13
      )
    : [];
  const answerable = stage === 1 || stage === 2 || stage === 3 || stage === 4;
  const passed = answer === target?.label;
  const selectAnswer = (value: string) => {
    if (passed) return;
    setAnswer(value);
    if (value === target?.label) {
      if (attempts === 0) setCorrectCount((count) => count + 1);
    } else {
      setAttempts((count) => count + 1);
    }
  };
  const advance = () => {
    stop();
    setAnswer(null);
    setAttempts(0);
    if (stage > 0 && trial < TRIALS_PER_STAGE - 1) {
      setTrial((value) => value + 1);
      return;
    }
    setTrial(0);
    if (stage === 4) {
      const score = Math.round(
        (correctCount / Math.max(1, (STAGES.length - 1) * TRIALS_PER_STAGE)) * 100
      );
      setCompletedScore(score);
      recordPronunciationCompletion(
        `lesson-${String(lessonNumber).padStart(2, "0")}`,
        score,
        stage
      );
      return;
    }
    recordPronunciationCheckpoint(`lesson-${String(lessonNumber).padStart(2, "0")}`, stage + 1);
    setStage((value) => (value + 1) as Stage);
  };
  const reset = () => {
    stop();
    setCompletedScore(null);
    setStage(0);
    setTrial(0);
    setAnswer(null);
    setAttempts(0);
    setCorrectCount(0);
  };
  const go = (number: number) => {
    window.location.hash = `#/pronunciation/lesson-${String(number).padStart(2, "0")}`;
  };

  if (completedScore !== null) {
    return (
      <main
        className="min-h-dvh w-full bg-background pb-24"
        aria-labelledby="pronunciation-complete-title"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 p-4 sm:p-8">
          <section className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-10">
            <Sparkles className="mx-auto size-10 text-primary" aria-hidden />
            <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-primary">
              {t("pronunciation.completeBadge")}
            </p>
            <h1
              id="pronunciation-complete-title"
              className="mt-2 text-3xl font-black"
              lang="en"
              dir="ltr"
            >
              {activity.title}
            </h1>
            <p
              className="mt-4 text-5xl font-black text-primary"
              aria-label={t("pronunciation.scoreLabel", { score: completedScore })}
            >
              {completedScore}%
            </p>
            <p className="mt-3 text-base font-bold text-muted-foreground">
              {completedScore >= 80
                ? t("pronunciation.masteredMessage")
                : t("pronunciation.reviewMessage")}
            </p>
            <div className="mt-6 grid gap-3 text-start sm:grid-cols-3">
              <div className="rounded-2xl bg-muted p-4">
                <p className="text-xs font-black uppercase text-muted-foreground">
                  {t("pronunciation.resultListening")}
                </p>
                <p className="mt-1 text-xl font-black">{t("pronunciation.resultReady")}</p>
              </div>
              <div className="rounded-2xl bg-muted p-4">
                <p className="text-xs font-black uppercase text-muted-foreground">
                  {t("pronunciation.resultMeaning")}
                </p>
                <p className="mt-1 text-xl font-black">{t("pronunciation.resultPractised")}</p>
              </div>
              <div className="rounded-2xl bg-muted p-4">
                <p className="text-xs font-black uppercase text-muted-foreground">
                  {t("pronunciation.resultReview")}
                </p>
                <p className="mt-1 text-xl font-black">
                  {completedScore >= 80
                    ? t("pronunciation.reviewInDays", { days: 3 })
                    : t("pronunciation.reviewTomorrow")}
                </p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="min-h-11 rounded-xl border border-border px-5 font-black focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("pronunciation.reviewAgain")}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "GO", to: "pronunciation-curriculum" })}
                className="min-h-11 rounded-xl bg-primary px-5 font-black text-primary-foreground focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("pronunciation.back")}
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-dvh w-full overflow-y-auto bg-background pb-24"
      aria-labelledby="pronunciation-title"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-4 sm:p-8">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "pronunciation-curriculum" })}
          className="min-h-11 w-fit rounded-xl px-3 font-bold focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="me-2 inline size-4" aria-hidden />
          {t("pronunciation.back")}
        </button>
        <header className="rounded-3xl bg-gradient-to-br from-primary/15 via-card to-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                {t("pronunciation.badge", { current: lessonNumber, total: 68 })}
              </p>
              <h1
                id="pronunciation-title"
                className="mt-2 text-3xl font-black tracking-tight"
                lang="en"
                dir="ltr"
              >
                {activity.title}
              </h1>
              <p
                className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground"
                lang="en"
                dir="ltr"
              >
                {activity.objective}
              </p>
            </div>
            <Sparkles className="size-8 text-primary" aria-hidden />
          </div>
          <div
            className="mt-5 grid grid-cols-5 gap-2"
            aria-label={t("pronunciation.stageProgress", {
              current: stage + 1,
              total: STAGES.length,
            })}
          >
            {STAGES.map((name, index) => (
              <div
                key={name}
                className={`h-2 rounded-full ${index <= stage ? "bg-primary" : "bg-muted"}`}
                aria-label={name}
              />
            ))}
          </div>
          {progress && (
            <p className="mt-3 text-sm font-bold text-primary">
              {t("pronunciation.previousBest", { score: progress.bestScorePercent })}
            </p>
          )}
        </header>
        {stage === 0 && (
          <section
            className="rounded-3xl border border-border bg-card p-5 shadow-sm"
            aria-labelledby="picture-preview-title"
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" aria-hidden />
              <h2 id="picture-preview-title" className="text-lg font-black">
                {t("pronunciation.picturePreview")}
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("pronunciation.picturePreviewDesc")}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {activity.items.slice(0, 8).map((item) => (
                <figure
                  key={`${item.label}-${item.imageRef}`}
                  className="overflow-hidden rounded-2xl border border-border bg-muted"
                >
                  <img
                    src={imageFor(item)}
                    alt={item.label}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="p-2 text-center text-sm font-bold" lang="en" dir="ltr">
                    {item.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
        <section
          className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7"
          aria-live="polite"
        >
          <p className="text-sm font-black text-primary">
            {t("pronunciation.stage", { number: stage + 1, name: STAGES[stage] })}
          </p>
          {answerable && (
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              {t("pronunciation.checkProgress", {
                current: trial + 1,
                total: TRIALS_PER_STAGE,
              })}
            </p>
          )}
          <h2 className="mt-1 text-2xl font-black">
            {stage === 0 ? t("pronunciation.readyTitle") : t("pronunciation.testTitle")}
          </h2>
          <button
            type="button"
            onClick={() => speak(target?.label ?? activity.model, undefined, audioClip?.objectKey)}
            className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 font-black text-primary-foreground focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Play className="size-5" aria-hidden />
            {isPlaying ? t("pronunciation.playing") : t("pronunciation.play")}
          </button>
          {stage === 0 && (
            <div className="mt-4 space-y-3">
              <p className="rounded-2xl bg-muted p-4 text-sm leading-6">
                {t("pronunciation.previewPrompt", { count: activity.items.length })}
              </p>
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
                <h3 className="text-sm font-black text-foreground">
                  {t("pronunciation.soundFocus")}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground" lang="en" dir="ltr">
                  {activity.focus}
                </p>
                {activity.contrastPairs.length > 0 && (
                  <ul
                    className="mt-3 flex flex-wrap gap-2"
                    aria-label={t("pronunciation.contrastPairs")}
                  >
                    {activity.contrastPairs.slice(0, 10).map(([first, second]) => (
                      <li
                        key={`${first}-${second}`}
                        className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-black text-foreground"
                        lang="en"
                        dir="ltr"
                      >
                        {first} / {second}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          {answerable && (
            <>
              <p className="mt-5 text-sm font-bold">
                {stage === 2
                  ? t("pronunciation.choosePicture")
                  : stage === 3
                    ? t("pronunciation.chooseUsage")
                    : t("pronunciation.chooseHeard")}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {choices.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectAnswer(item.label)}
                    aria-pressed={answer === item.label}
                    disabled={passed}
                    className={`min-h-14 rounded-2xl border-2 px-4 text-start font-black focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed ${answer === item.label ? (item.label === target?.label ? "border-feedback-success bg-feedback-success-surface" : "border-destructive bg-destructive/10") : "border-border hover:border-primary disabled:opacity-70"}`}
                    lang="en"
                    dir="ltr"
                  >
                    {stage === 2 ? (
                      <>
                        <img
                          src={imageFor(item)}
                          alt=""
                          className="me-3 inline size-10 rounded-lg object-cover"
                          aria-hidden
                        />
                        {item.label}
                      </>
                    ) : (
                      item.label
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
          {stage === 2 && target && (
            <p className="mt-4 text-xs text-muted-foreground">
              {t("pronunciation.imageHiddenDuringListening")}
            </p>
          )}
          {stage === 3 && <PrivateRecordCompare target={target?.label ?? activity.model} />}
          {answer && (
            <div
              role={passed ? "status" : "alert"}
              className="mt-5 rounded-2xl bg-muted p-4 font-bold"
            >
              {passed ? (
                <>
                  <Check className="me-2 inline size-5 text-success-foreground" aria-hidden />
                  {t("pronunciation.correct")}
                </>
              ) : attempts >= 2 ? (
                t("pronunciation.support")
              ) : (
                t("pronunciation.retry")
              )}
            </div>
          )}
          <div className="mt-6 flex justify-between gap-3">
            <button type="button" onClick={reset} className="min-h-11 rounded-xl px-3 font-bold">
              <RotateCcw className="me-2 inline size-4" aria-hidden />
              {t("pronunciation.reset")}
            </button>
            {(stage === 0 || passed || attempts >= 2) && (
              <button
                type="button"
                onClick={advance}
                className="min-h-11 rounded-xl bg-primary px-5 font-black text-primary-foreground"
              >
                {stage === 4 ? t("pronunciation.finish") : t("pronunciation.continue")}
                <ArrowRight className="ms-2 inline size-4" aria-hidden />
              </button>
            )}
          </div>
        </section>
        <nav
          className="flex justify-between gap-3"
          aria-label={t("pronunciation.lessonNavigation")}
        >
          <button
            type="button"
            disabled={lessonNumber === 1}
            onClick={() => go(lessonNumber - 1)}
            className="min-h-11 rounded-xl border px-4 font-bold disabled:opacity-50"
          >
            <ArrowLeft className="me-2 inline size-4" aria-hidden />
            {t("pronunciation.previous")}
          </button>
          <button
            type="button"
            disabled={lessonNumber === 68}
            onClick={() => go(lessonNumber + 1)}
            className="min-h-11 rounded-xl border px-4 font-bold disabled:opacity-50"
          >
            {t("pronunciation.next")}
            <ArrowRight className="ms-2 inline size-4" aria-hidden />
          </button>
        </nav>
      </div>
    </main>
  );
}
