import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  Gauge,
} from "lucide-react";
import type { Action } from "../../types";
import { useAudio } from "../../shared/useAudio";
import { useI18n } from "../../../i18n";
import { useLearner } from "../../context/LearnerContext";
import { PrivateRecordCompare } from "./PrivateRecordCompare";
import {
  getFigmaPronunciationActivityData,
  pronunciationImagePath,
  getPronunciationQuestion,
  getStressBeatPattern,
  type FigmaPronunciationImage,
} from "./figmaPronunciationCatalog";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { getPronunciationAudioClip } from "./pronunciationAudioManifest";
import { ADVANCE_DELAY_MS, useAutoAdvance } from "../../shared/useAutoAdvance";
import { useSpokenFeedback } from "../../shared/useSpokenFeedback";

interface Props {
  lessonNumber: number;
  dispatch: React.Dispatch<Action>;
}
type Stage = 0 | 1 | 2 | 3 | 4;

const STAGES = ["Preview", "Listen", "Meaning", "Use it", "Transfer"] as const;
const TRIALS_PER_STAGE = 3;
const EMPTY_CHOICES: readonly FigmaPronunciationImage[] = [];

function imageFor(item: FigmaPronunciationImage) {
  return resolveAssetUrl(pronunciationImagePath(item.imageRef));
}

function getCueBadge(cue: string): { labelKey: string; icon: string } | null {
  const lower = cue.toLowerCase();
  if (lower.includes("lip")) return { labelKey: "pronunciation.cueLips", icon: "👄" };
  if (lower.includes("tongue") || lower.includes("palate") || lower.includes("alveolar"))
    return { labelKey: "pronunciation.cueTongue", icon: "👅" };
  if (lower.includes("voice") || lower.includes("vibrat") || lower.includes("throat"))
    return { labelKey: "pronunciation.cueVocalCords", icon: "🎙️" };
  if (
    lower.includes("air") ||
    lower.includes("breath") ||
    lower.includes("puff") ||
    lower.includes("pop")
  )
    return { labelKey: "pronunciation.cueAirflow", icon: "💨" };
  if (
    lower.includes("stress") ||
    lower.includes("syllable") ||
    lower.includes("beat") ||
    lower.includes("pitch")
  )
    return { labelKey: "pronunciation.cueRhythmStress", icon: "🎵" };
  if (lower.includes("jaw")) return { labelKey: "pronunciation.cueJaw", icon: "↕️" };
  return null;
}

export function FigmaPronunciationLessonScreen({ lessonNumber, dispatch }: Props) {
  const { t } = useI18n();
  const { state, recordPronunciationCheckpoint, recordPronunciationCompletion } = useLearner();
  const childMode = state.preferences.expression === "child";
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
  const [slowPlayback, setSlowPlayback] = useState(false);
  const { speak, stop, isPlaying } = useAudio({
    lang: "en-US",
    rate: slowPlayback ? 0.65 : 0.9,
    preferLocal: true,
  });
  const { speakFeedback, cancel: cancelSpokenFeedback } = useSpokenFeedback();
  const question =
    stage === 0 ? null : getPronunciationQuestion(lessonNumber, stage, trial, childMode);
  const target =
    stage === 0
      ? (activity.items.find(
          (item) =>
            item.label.toLocaleLowerCase("en-US") === activity.model.toLocaleLowerCase("en-US")
        ) ?? activity.items[0])
      : question!.target;
  const audioClip = getPronunciationAudioClip(target?.label ?? activity.model, stage === 4);
  const visibleChoices = question?.choices ?? EMPTY_CHOICES;
  const contrastHero = activity.contrastPairs[0];
  const contrastHeroItems = contrastHero
    ?.map((label) =>
      activity.items.find(
        (item) => item.label.toLocaleLowerCase("en-US") === label.toLocaleLowerCase("en-US")
      )
    )
    .filter(Boolean) as FigmaPronunciationImage[] | undefined;
  const answerable = stage === 1 || stage === 2 || stage === 3 || stage === 4;
  const passed = answer === target?.label;
  // Each new prompt begins with a model. Learners can still replay it, and auto-advance
  // remains their explicit control over whether correct answers move forward automatically.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      speak(target?.label ?? activity.model, undefined, audioClip?.objectKey);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [activity.model, audioClip?.objectKey, lessonNumber, speak, stage, target?.label, trial]);
  const advance = () => {
    stop();
    cancelSpokenFeedback();
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
  const autoAdvance = useAutoAdvance({
    enabled: state.accessibility.autoAdvance,
    onAdvance: advance,
  });
  const selectAnswer = (value: string) => {
    if (passed) return;
    const isCorrect = value === target?.label;
    stop();
    setAnswer(value);
    if (isCorrect) {
      if (attempts === 0) setCorrectCount((count) => count + 1);
      speakFeedback({ correct: true, targetLabel: target?.label ?? activity.model }, () =>
        autoAdvance.schedule(ADVANCE_DELAY_MS.correct)
      );
    } else {
      setAttempts((count) => count + 1);
      speakFeedback({
        correct: false,
        targetLabel: target?.label ?? activity.model,
        chosenLabel: value,
      });
    }
  };
  const selectAnswerRef = useRef(selectAnswer);
  useEffect(() => {
    selectAnswerRef.current = selectAnswer;
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest(
          "button, a, input, textarea, select, summary, [contenteditable='true']"
        )
      )
        return;
      if (event.key === " " || event.key.toLowerCase() === "r") {
        event.preventDefault();
        speak(target?.label ?? activity.model, undefined, audioClip?.objectKey);
      }
      const index = Number(event.key) - 1;
      if (answerable && Number.isInteger(index) && visibleChoices[index] && !passed) {
        selectAnswerRef.current(visibleChoices[index].label);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    activity.model,
    answer,
    answerable,
    passed,
    audioClip?.objectKey,
    speak,
    target?.label,
    visibleChoices,
  ]);
  const replayFeedback = () => {
    if (!answer) return;
    autoAdvance.cancel();
    speakFeedback(
      {
        correct: passed,
        targetLabel: target?.label ?? activity.model,
        chosenLabel: passed ? null : answer,
      },
      passed ? () => autoAdvance.schedule(ADVANCE_DELAY_MS.correct) : undefined
    );
  };
  const reset = () => {
    stop();
    cancelSpokenFeedback();
    autoAdvance.cancel();
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
            {activity.reviewSentences.length > 0 && (
              <section
                className="mt-7 rounded-2xl border border-primary/25 bg-primary/5 p-5 text-start"
                aria-labelledby="pronunciation-usage-review"
              >
                <h2 id="pronunciation-usage-review" className="text-lg font-black">
                  {t("pronunciation.usageReviewTitle")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("pronunciation.usageReviewDescription")}
                </p>
                <div className="mt-4 grid gap-3">
                  {activity.reviewSentences.map((sentence) => (
                    <div key={sentence} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => speak(sentence)}
                        className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-start font-bold hover:border-primary focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        lang="en"
                        dir="ltr"
                      >
                        <Volume2 className="size-5 shrink-0 text-primary" aria-hidden />
                        {sentence}
                      </button>
                      <PrivateRecordCompare target={sentence} />
                    </div>
                  ))}
                </div>
              </section>
            )}
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
              <button
                key={name}
                type="button"
                onClick={() => {
                  if (index <= stage) {
                    stop();
                    cancelSpokenFeedback();
                    setStage(index as Stage);
                    setTrial(0);
                    setAnswer(null);
                  }
                }}
                disabled={index > stage}
                aria-current={index === stage ? "step" : undefined}
                aria-label={t("pronunciation.stage", { number: index + 1, name })}
                className={`min-h-11 rounded-xl transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed ${index <= stage ? "bg-primary hover:bg-primary/80" : "bg-muted"}`}
              />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {t("pronunciation.stage", { number: stage + 1, name: STAGES[stage] })}
          </p>
          {progress && (
            <p className="mt-3 text-sm font-bold text-primary">
              {t("pronunciation.previousBest", { score: progress.bestScorePercent })}
            </p>
          )}
        </header>
        {contrastHero && contrastHeroItems?.length === 2 && stage === 0 && (
          <section
            className="rounded-3xl border-2 border-primary/25 bg-card p-5 shadow-sm sm:p-7"
            aria-labelledby="pronunciation-contrast-title"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  {t("pronunciation.contrastHeroBadge")}
                </p>
                <h2 id="pronunciation-contrast-title" className="mt-1 text-2xl font-black">
                  {t("pronunciation.contrastHeroTitle")}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {childMode
                    ? t("pronunciation.childContrastHint")
                    : t("pronunciation.contrastHeroDescription")}
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                {activity.focus}
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {contrastHeroItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    speak(item.label, undefined, getPronunciationAudioClip(item.label)?.objectKey)
                  }
                  className="group flex min-h-24 items-center gap-4 rounded-2xl border border-border bg-muted/50 p-3 text-start hover:border-primary focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  lang="en"
                  dir="ltr"
                >
                  <img
                    src={imageFor(item)}
                    alt=""
                    className="size-20 rounded-xl object-cover"
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block text-xl font-black">{item.label}</span>
                    <span className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-primary">
                      <Volume2 className="size-4" aria-hidden />
                      {t("pronunciation.listenToContrast")}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
        {contrastHero && contrastHeroItems?.length === 2 && stage > 0 && (
          <details className="group rounded-2xl border border-border bg-card/80 p-3 text-start shadow-xs">
            <summary className="flex cursor-pointer items-center justify-between text-xs font-black uppercase tracking-wider text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <span className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" aria-hidden />
                {t("pronunciation.soundGuide")}: {contrastHero[0]} / {contrastHero[1]}
              </span>
              <ChevronDown
                className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {contrastHeroItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    speak(item.label, undefined, getPronunciationAudioClip(item.label)?.objectKey)
                  }
                  className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-muted/50 p-2 text-start hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  lang="en"
                  dir="ltr"
                >
                  <img
                    src={imageFor(item)}
                    alt=""
                    className="size-10 rounded-lg object-cover"
                    aria-hidden
                  />
                  <span className="min-w-0 font-bold">{item.label}</span>
                  <Volume2 className="ms-auto size-4 text-primary" aria-hidden />
                </button>
              ))}
            </div>
          </details>
        )}
        {stage === 0 && (
          <section
            className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7"
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
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  {activity.focus}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {activity.items.slice(0, 8).map((item) => (
                    <button
                      key={`${item.label}-${item.imageRef}`}
                      type="button"
                      onClick={() =>
                        speak(
                          item.label,
                          undefined,
                          getPronunciationAudioClip(item.label)?.objectKey
                        )
                      }
                      aria-label={t("pronunciation.playWord", { word: item.label })}
                      className="group overflow-hidden rounded-2xl border border-border bg-muted text-start hover:border-primary focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <img
                        src={imageFor(item)}
                        alt={item.label}
                        className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <span
                        className="flex min-h-11 items-center justify-center gap-2 p-2 text-center text-sm font-bold"
                        lang="en"
                        dir="ltr"
                      >
                        <Volume2 className="size-4 text-primary" aria-hidden />
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {activity.items.length > 8 && (
                <details className="group rounded-2xl border border-border bg-muted/30 p-3">
                  <summary className="cursor-pointer text-xs font-black uppercase tracking-wider text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    +{activity.items.length - 8} {t("pronunciation.picturePreview")}
                  </summary>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {activity.items.slice(8).map((item) => (
                      <button
                        key={`${item.label}-${item.imageRef}`}
                        type="button"
                        onClick={() =>
                          speak(
                            item.label,
                            undefined,
                            getPronunciationAudioClip(item.label)?.objectKey
                          )
                        }
                        aria-label={t("pronunciation.playWord", { word: item.label })}
                        className="group overflow-hidden rounded-2xl border border-border bg-muted text-start hover:border-primary focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <img
                          src={imageFor(item)}
                          alt={item.label}
                          className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        <span
                          className="flex min-h-11 items-center justify-center gap-2 p-2 text-center text-sm font-bold"
                          lang="en"
                          dir="ltr"
                        >
                          <Volume2 className="size-4 text-primary" aria-hidden />
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </section>
        )}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
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
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/60 p-3">
            <span className="inline-flex items-center gap-2 text-sm font-bold">
              <Gauge className="size-4 text-primary" aria-hidden />
              {t("pronunciation.playbackSpeed")}
            </span>
            <div className="flex gap-2" role="group" aria-label={t("pronunciation.playbackSpeed")}>
              {[false, true].map((slow) => (
                <button
                  key={String(slow)}
                  type="button"
                  aria-pressed={slowPlayback === slow}
                  onClick={() => setSlowPlayback(slow)}
                  className={`min-h-11 rounded-xl border px-4 text-sm font-black focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary ${slowPlayback === slow ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}
                >
                  {slow ? t("pronunciation.slowSpeed") : t("pronunciation.normalSpeed")}
                </button>
              ))}
            </div>
          </div>
          {stage === 0 && (
            <div className="mt-4 space-y-3">
              <p className="rounded-2xl bg-muted p-4 text-sm leading-6">
                {t("pronunciation.previewPrompt", { count: activity.items.length })}
              </p>
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
                <h3 className="text-sm font-black text-foreground">
                  {t("pronunciation.soundFocus")}
                </h3>
                <p
                  className="mt-1 whitespace-pre-line text-sm leading-6 text-muted-foreground"
                  lang="en"
                  dir="ltr"
                >
                  {activity.focus}
                </p>
                {activity.articulationCues.length > 0 && (
                  <div className="mt-4 border-t border-primary/20 pt-4">
                    <h4 className="text-sm font-black text-foreground">
                      {t("pronunciation.articulationTitle")}
                    </h4>
                    <ul className="mt-2 grid gap-2" lang="en" dir="ltr">
                      {activity.articulationCues.map((cue) => {
                        const badge = getCueBadge(cue);
                        return (
                          <li
                            key={cue}
                            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-sm leading-6 text-foreground"
                          >
                            <div className="flex items-center justify-between gap-2">
                              {badge ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-black text-primary">
                                  <span aria-hidden>{badge.icon}</span>
                                  <span>{t(badge.labelKey)}</span>
                                </span>
                              ) : (
                                <span
                                  className="size-2 shrink-0 rounded-full bg-primary"
                                  aria-hidden
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => speak(cue)}
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                              >
                                <Volume2 className="size-3.5" aria-hidden />
                                {t("pronunciation.listenToContrast")}
                              </button>
                            </div>
                            <span>{cue}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
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
                {visibleChoices.map((item, choiceIndex) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectAnswer(item.label)}
                    aria-pressed={answer === item.label}
                    aria-label={t("pronunciation.choiceLabel", {
                      number: choiceIndex + 1,
                      word: item.label,
                    })}
                    disabled={passed}
                    className={`min-h-14 overflow-hidden rounded-2xl border-2 p-0 text-start font-black transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed ${answer === item.label ? (item.label === target?.label ? "border-feedback-success bg-feedback-success-surface" : "border-destructive bg-destructive/10") : "border-border hover:border-primary disabled:opacity-70"}`}
                    lang="en"
                    dir="ltr"
                  >
                    <img
                      src={imageFor(item)}
                      alt=""
                      className="block aspect-[16/9] w-full object-cover transition-opacity duration-300"
                      aria-hidden
                    />
                    <span className="flex min-h-11 items-center justify-center gap-2 px-3 py-2 text-center text-base font-black">
                      {answer === item.label && passed && (
                        <Check className="size-5 shrink-0" aria-hidden />
                      )}
                      <span>{item.label}</span>
                      {(() => {
                        const beat = getStressBeatPattern(lessonNumber, item.label);
                        return beat ? (
                          <span
                            className="ms-1 rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary"
                            aria-label={t("pronunciation.rhythmBeatAria", { beat })}
                          >
                            {beat}
                          </span>
                        ) : null;
                      })()}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          {(stage === 3 || stage === 4) && (
            <PrivateRecordCompare target={target?.label ?? activity.model} />
          )}
          {answer && (
            <div
              role={passed ? "status" : "alert"}
              className={`mt-5 flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-4 py-3 font-bold ${passed ? "border-feedback-success-border bg-feedback-success-surface" : "border-feedback-error-border bg-feedback-error-surface"}`}
            >
              <span>
                {passed ? (
                  <>
                    <Check className="me-2 inline size-5 text-feedback-success" aria-hidden />
                    {t("pronunciation.correct")}
                  </>
                ) : attempts >= 2 ? (
                  t("pronunciation.support")
                ) : (
                  t("pronunciation.retry")
                )}
              </span>
              <button
                type="button"
                onClick={replayFeedback}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-black text-foreground hover:bg-background/70 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Volume2 className="size-5" aria-hidden />
                {t("pronunciation.replayFeedback")}
              </button>
            </div>
          )}
          {answer && !passed && (activity.recoveryCue || activity.articulationCues.length > 0) && (
            <aside
              className="mt-3 rounded-2xl border border-primary/30 bg-primary/5 p-4"
              role="note"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-black text-primary">
                  {t("pronunciation.recoveryCueTitle")}
                </p>
                <button
                  type="button"
                  onClick={() => speak(activity.recoveryCue ?? activity.articulationCues[0])}
                  className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-primary/30 bg-background px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  <Volume2 className="size-3.5" aria-hidden />
                  {t("pronunciation.listenToContrast")}
                </button>
              </div>
              <p className="mt-1 text-sm font-bold leading-6">
                {t("pronunciation.confusionPair", {
                  heard: answer,
                  target: target?.label ?? activity.model,
                })}
              </p>
              <p className="mt-1 text-sm leading-6" lang="en" dir="ltr">
                {activity.recoveryCue ?? activity.articulationCues[0]}
              </p>
            </aside>
          )}
          <div className="mt-6 flex justify-between gap-3">
            <button type="button" onClick={reset} className="min-h-11 rounded-xl px-3 font-bold">
              <RotateCcw className="me-2 inline size-4" aria-hidden />
              {t("pronunciation.reset")}
            </button>
            {(stage === 0 || (passed && !state.accessibility.autoAdvance) || attempts >= 2) && (
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
