import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Headphones,
  Info,
  Play,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import type { Action } from "../../types";
import { ProgressBar } from "../../shared";
import { useLearner } from "../../context/LearnerContext";
import { useAudio } from "../../shared/useAudio";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import {
  FOUNDATION_PICTURE_WORDS,
  getAdjacentFoundationLesson,
  getFoundationLesson,
  type FoundationLessonId,
} from "./foundationCurriculum";
import { getFoundationActivityContract } from "./foundationActivities";
import { PrivateRecordCompare } from "./PrivateRecordCompare";
import { useI18n } from "../../context/I18nContext";

interface Props {
  lessonId: FoundationLessonId;
  dispatch: React.Dispatch<Action>;
}

type Step =
  | { kind: "intro" }
  | { kind: "model"; index: number }
  | { kind: "question"; index: number }
  | { kind: "summary" };

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function FoundationLessonScreen({ lessonId, dispatch }: Props) {
  const { interfaceLang, t } = useI18n();
  const { state, recordFoundationCheckpoint, recordFoundationCompletion } = useLearner();
  const lesson = getFoundationLesson(lessonId);
  const steps = useMemo<Step[]>(
    () => [
      { kind: "intro" },
      ...lesson.models.map((_, index) => ({ kind: "model" as const, index })),
      ...lesson.questions.map((_, index) => ({ kind: "question" as const, index })),
      { kind: "summary" },
    ],
    [lesson]
  );
  const savedProgress = state.foundationProgress[lesson.id];
  const [stepIndex, setStepIndex] = useState(() => {
    if (!savedProgress || savedProgress.status !== "in-progress") return 0;
    const savedStep = Math.min(savedProgress.currentStep, Math.max(0, steps.length - 1));
    const savedStepDefinition = steps[savedStep];
    const wasAnswered =
      savedStepDefinition?.kind === "question" &&
      savedProgress.questionResults[String(savedStepDefinition.index)] !== undefined;
    return wasAnswered ? Math.min(savedStep + 1, steps.length - 1) : savedStep;
  });
  const [attempts, setAttempts] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [rhythmTaps, setRhythmTaps] = useState(0);
  const [orderedChoices, setOrderedChoices] = useState<readonly string[]>([]);
  const [confidence, setConfidence] = useState<"again" | "supported" | "ready" | null>(null);
  const [questionResults, setQuestionResults] = useState<Readonly<Record<number, boolean>>>(() =>
    savedProgress?.status === "in-progress"
      ? Object.fromEntries(
          Object.entries(savedProgress.questionResults).map(([index, result]) => [
            Number(index),
            result,
          ])
        )
      : {}
  );
  const [hintOpen, setHintOpen] = useState(false);
  const [heardOptions, setHeardOptions] = useState<ReadonlySet<string>>(() => new Set());
  const { speak, stop, status, isPlaying, isError } = useAudio({
    lang: "en-US",
    rate: 0.78,
    preferLocal: true,
  });
  const step = steps[stepIndex];
  const previousLesson = getAdjacentFoundationLesson(lesson.id, -1);
  const nextLesson = getAdjacentFoundationLesson(lesson.id, 1);
  const pictureWords = FOUNDATION_PICTURE_WORDS[lesson.id] ?? [];
  const progress = Math.round((stepIndex / Math.max(1, steps.length - 1)) * 100);
  const correct = Object.values(questionResults).filter(Boolean).length;
  const scorePercent = Math.round((correct / Math.max(1, lesson.questions.length)) * 100);
  const usesQualitativeRouting = lesson.completionMode === "qualitative-routing";
  const mastered =
    usesQualitativeRouting ||
    savedProgress?.status === "mastered" ||
    scorePercent >= lesson.masteryThreshold;
  const isPronunciationLesson = lesson.level === 13;
  const canDoGoal = `${lesson.goal.charAt(0).toLowerCase()}${lesson.goal.slice(1)}`;
  const independentCheckStart = Math.max(
    0,
    lesson.questions.length - (isPronunciationLesson ? 1 : 2)
  );

  useEffect(() => () => stop(), [stop]);
  useEffect(() => {
    if (step.kind === "summary") return;
    recordFoundationCheckpoint(lesson.id, stepIndex, questionResults);
  }, [lesson.id, questionResults, recordFoundationCheckpoint, step.kind, stepIndex]);
  useEffect(() => {
    if (step.kind !== "summary") return;
    recordFoundationCompletion(
      lesson.id,
      correct,
      lesson.questions.length,
      stepIndex,
      questionResults,
      lesson.masteryThreshold
    );
  }, [
    correct,
    lesson.id,
    lesson.questions.length,
    lesson.masteryThreshold,
    questionResults,
    recordFoundationCompletion,
    step.kind,
    stepIndex,
  ]);

  const resetStepInteraction = useCallback(() => {
    stop();
    setAttempts(0);
    setAnswered(false);
    setFeedback(null);
    setSelectedChoice(null);
    setRhythmTaps(0);
    setOrderedChoices([]);
    setConfidence(null);
    setHintOpen(false);
    setHeardOptions(new Set());
  }, [stop]);

  const playStepAudio = useCallback(
    (nextStep: Step) => {
      if (nextStep.kind === "model") speak(lesson.models[nextStep.index].audio);
      if (nextStep.kind === "question") speak(lesson.questions[nextStep.index].audio);
    },
    [lesson.models, lesson.questions, speak]
  );

  const advance = useCallback(() => {
    const nextIndex = Math.min(stepIndex + 1, steps.length - 1);
    resetStepInteraction();
    setStepIndex(nextIndex);
    playStepAudio(steps[nextIndex]);
  }, [playStepAudio, resetStepInteraction, stepIndex, steps]);

  useEffect(() => {
    if (!answered || step.kind !== "question" || !state.accessibility.autoAdvance) return;
    const delay = attempts >= 2 ? 1600 : 700;
    const timeout = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timeout);
  }, [advance, answered, attempts, state.accessibility.autoAdvance, step.kind]);

  const goBack = () => {
    if (stepIndex === 0) return;
    const previousIndex = Math.max(0, stepIndex - 1);
    resetStepInteraction();
    setStepIndex(previousIndex);
    playStepAudio(steps[previousIndex]);
  };

  const choose = (value: string) => {
    if (step.kind !== "question" || answered) return;
    stop();
    const question = lesson.questions[step.index];
    setSelectedChoice(value);
    if (value === question.answer) {
      setQuestionResults((results) => ({ ...results, [step.index]: true }));
      setFeedback(question.correctFeedback);
      setAnswered(true);
      return;
    }
    const nextAttempt = attempts + 1;
    setAttempts(nextAttempt);
    setFeedback(nextAttempt === 1 ? question.support[0] : question.support[1]);
    if (nextAttempt >= 2) {
      setQuestionResults((results) => ({ ...results, [step.index]: false }));
      setAnswered(true);
    }
  };

  const openLesson = (id: FoundationLessonId) => {
    stop();
    setHintOpen(false);
    setHeardOptions(new Set());
    dispatch({ type: "START_FOUNDATION_LESSON", lessonId: id });
  };

  const listenToOption = (value: string, audio: string) => {
    setHeardOptions((heard) => new Set([...heard, value]));
    speak(audio);
  };

  const finish = () => {
    if (nextLesson) openLesson(nextLesson.id);
    else dispatch({ type: "GO", to: "explore" });
  };

  const restartLesson = () => {
    resetStepInteraction();
    setQuestionResults({});
    setStepIndex(0);
  };

  return (
    <div className="flex min-h-dvh flex-col overflow-y-auto bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-wp-card/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "explore" })}
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted ${focusRing}`}
            aria-label="Return to the curriculum"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-wide text-primary">
              {t("foundation.lessonPosition", {
                level: lesson.level,
                unit: lesson.unitId,
                lesson: lesson.number,
              })}
            </p>
            <h1 className="truncate text-lg font-black text-foreground sm:text-xl">
              {lesson.title}
            </h1>
          </div>
          <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary sm:inline">
            {lesson.reviewStatus === "pilot"
              ? t("foundation.pronunciationPilot")
              : lesson.audioOnly
                ? t("foundation.listen")
                : t("foundation.soundsLetters")}
          </span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-5 sm:px-6 sm:py-7">
        <ProgressBar
          progressPercent={progress}
          label={t("foundation.lessonProgress")}
          labelRight={`${progress}%`}
          ariaLabel={t("foundation.lessonProgressAria", { progress })}
        />
        {isError && (
          <div
            role="alert"
            className="mt-3 rounded-xl border border-[var(--feedback-warning)] bg-[var(--feedback-warning-surface)] px-4 py-3 text-sm font-bold text-foreground"
          >
            {t("foundation.soundError")}
          </div>
        )}
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={goBack}
            className={`mt-3 flex min-h-11 w-fit items-center gap-2 rounded-xl px-3 font-bold text-foreground hover:bg-muted ${focusRing}`}
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            {t("foundation.backStep")}
          </button>
        )}
        <div className="flex flex-1 flex-col justify-center py-6">
          {step.kind === "intro" && (
            <section className="mx-auto w-full max-w-xl rounded-3xl border border-primary/30 bg-wp-card p-5 text-center shadow-wp-sm sm:p-7">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Headphones className="size-6" aria-hidden />
                </div>
                <h2 className="text-2xl font-black text-foreground sm:text-3xl">
                  {lesson.shortTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => setHintOpen((open) => !open)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setHintOpen(false);
                  }}
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary hover:bg-primary/10 ${focusRing}`}
                  aria-label={hintOpen ? "Hide lesson hint" : "Show lesson hint"}
                  aria-expanded={hintOpen}
                  aria-controls="lesson-hint"
                  title={hintOpen ? "Hide lesson hint" : "Show lesson hint"}
                >
                  <Info className="size-5" aria-hidden />
                </button>
              </div>
              <p className="mx-auto mt-3 max-w-md text-base font-semibold leading-relaxed text-foreground">
                {lesson.goal}
              </p>
              {interfaceLang === "ar" && (
                <p
                  lang="ar"
                  className="mx-auto mt-3 max-w-md rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-bold leading-relaxed text-foreground"
                >
                  {t("foundation.arabicLessonHelp")}
                </p>
              )}
              {isPronunciationLesson && (
                <div className="mx-auto mt-4 max-w-md rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 text-start">
                  <p className="text-xs font-black uppercase tracking-wide text-primary">
                    {t("foundation.canDoHeading")}
                  </p>
                  <p className="mt-1 font-bold leading-relaxed text-foreground">{canDoGoal}</p>
                </div>
              )}
              {lesson.reviewStatus === "pilot" && (
                <p className="mx-auto mt-3 max-w-md rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-bold leading-relaxed text-foreground">
                  {t("foundation.pilotNote")}
                </p>
              )}
              {hintOpen && (
                <div
                  id="lesson-hint"
                  role="tooltip"
                  className="mx-auto mt-3 max-w-md rounded-xl border border-border bg-background px-4 py-3 text-start text-sm font-semibold leading-relaxed text-foreground shadow-wp-xs"
                >
                  {lesson.instruction}
                </div>
              )}
              {pictureWords.length > 0 && (
                <div className="mt-5" aria-labelledby="picture-words-heading">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="size-5 text-primary" aria-hidden />
                    <h3 id="picture-words-heading" className="font-black text-foreground">
                      {t("foundation.tapPicture")}
                    </h3>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {pictureWords.map((item) => (
                      <button
                        key={item.word}
                        type="button"
                        onClick={() => speak(item.word)}
                        className={`overflow-hidden rounded-2xl border-2 border-border bg-background text-start hover:border-primary/55 ${focusRing}`}
                        aria-label={`Hear the word ${item.word}`}
                      >
                        <img
                          src={resolveAssetUrl(item.src)}
                          alt=""
                          className="aspect-[4/3] w-full object-cover"
                          loading="lazy"
                        />
                        <span className="block px-3 py-2 text-center text-base font-black capitalize text-foreground">
                          {item.word}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={advance}
                className={`mt-5 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-bold text-primary-foreground ${focusRing}`}
              >
                <Play className="size-5" aria-hidden /> {t("foundation.startLesson")}
              </button>
            </section>
          )}

          {step.kind === "model" &&
            (() => {
              const model = lesson.models[step.index];
              return (
                <section
                  className="mx-auto w-full max-w-xl text-center"
                  aria-labelledby="model-heading"
                >
                  <p className="text-xs font-black uppercase tracking-wider text-primary">
                    {t("foundation.exampleNumber", { number: step.index + 1 })}
                  </p>
                  <h2 id="model-heading" className="mt-2 text-2xl font-black text-foreground">
                    {t("foundation.learnTogether")}
                  </h2>
                  {model.image && (
                    <img
                      src={resolveAssetUrl(model.image.src)}
                      alt={model.image.alt}
                      className="mx-auto mt-6 aspect-[4/3] w-full max-w-[260px] rounded-3xl border border-border object-cover shadow-wp-sm"
                    />
                  )}
                  {model.tiles && (
                    <div
                      className="mt-7 flex flex-wrap justify-center gap-3"
                      aria-label="Teaching tiles"
                    >
                      {model.tiles.map((tile, index) => (
                        <span
                          key={`${tile}-${index}`}
                          className="flex min-h-16 min-w-16 items-center justify-center rounded-2xl border-2 border-primary/40 bg-wp-card px-4 text-3xl font-black text-foreground shadow-wp-xs"
                        >
                          {tile}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => speak(model.audio)}
                    disabled={isPlaying}
                    className={`mx-auto mt-7 flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-wp-md disabled:opacity-60 ${focusRing}`}
                    aria-label="Play the teaching example"
                  >
                    <Volume2 className="size-10" aria-hidden />
                  </button>
                  <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/5 p-5">
                    <p className="font-black leading-relaxed text-foreground">
                      {model.explanation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={advance}
                    className={`mt-6 min-h-[52px] w-full rounded-2xl bg-primary px-5 font-bold text-primary-foreground ${focusRing}`}
                  >
                    {t("action.continue")}
                  </button>
                </section>
              );
            })()}

          {step.kind === "question" &&
            (() => {
              const question = lesson.questions[step.index];
              const challengeStart = Math.max(1, lesson.questions.length - 2);
              const activity = getFoundationActivityContract(question);
              const responseMode = question.responseMode ?? "choice";
              const hasSpokenOptions = activity.kind === "listen-and-choose";
              const allOptionsHeard = question.options.every(
                (item) => !item.audio || heardOptions.has(item.value)
              );
              return (
                <section
                  className="mx-auto w-full max-w-xl text-center"
                  aria-labelledby="question-heading"
                >
                  <p className="text-xs font-black uppercase tracking-wider text-primary">
                    {isPronunciationLesson
                      ? step.index >= independentCheckStart
                        ? t("foundation.independentCheck")
                        : t("foundation.guidedPractice")
                      : step.index >= challengeStart
                        ? t("foundation.challengeRound")
                        : t("foundation.yourTurn")}{" "}
                    ·{" "}
                    {t("foundation.questionCount", {
                      current: step.index + 1,
                      total: lesson.questions.length,
                    })}
                  </p>
                  <h2 id="question-heading" className="mt-2 text-2xl font-black text-foreground">
                    {question.prompt}
                  </h2>
                  {question.display && (
                    <div
                      className="mx-auto mt-7 rounded-3xl border-2 border-primary/35 bg-wp-card px-8 py-7 text-5xl font-black tracking-wide text-foreground shadow-wp-sm"
                      aria-label={`Word to read: ${question.display}`}
                    >
                      {question.display}
                    </div>
                  )}
                  {question.visual && !question.display && !hasSpokenOptions && (
                    <div className="mt-7 flex justify-center gap-3" aria-hidden>
                      {[0, 1, 2].map((item) => (
                        <span
                          key={item}
                          className="size-7 rounded-full border-2 border-primary/45 bg-primary/10"
                        />
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => speak(question.audio)}
                    disabled={isPlaying}
                    className={`mx-auto mt-7 flex ${hasSpokenOptions ? "size-20" : "size-24"} items-center justify-center rounded-full bg-primary text-primary-foreground shadow-wp-md disabled:opacity-60 ${focusRing}`}
                    aria-label={
                      isPlaying
                        ? "Audio is playing"
                        : hasSpokenOptions
                          ? "Play the target audio"
                          : "Play the question audio"
                    }
                  >
                    <Volume2 className={hasSpokenOptions ? "size-8" : "size-10"} aria-hidden />
                  </button>
                  <p className="mt-3 min-h-5 text-sm font-bold text-muted-foreground">
                    {status === "loading"
                      ? "Loading sound…"
                      : status === "playing"
                        ? "Playing the target…"
                        : isError
                          ? "Audio did not play. Tap to retry."
                          : hasSpokenOptions
                            ? "Hear the target sound"
                            : "Tap to listen again"}
                  </p>
                  {isPronunciationLesson && state.accessibility.includeSpeaking && (
                    <PrivateRecordCompare target={question.audio} />
                  )}
                  {responseMode === "rhythm" ? (
                    <div className="mt-7 rounded-3xl border border-border bg-wp-card p-5 shadow-wp-xs">
                      <p className="font-bold text-foreground">{t("foundation.tapEachBeat")}</p>
                      <div
                        className="mt-4 flex min-h-12 items-center justify-center gap-2"
                        aria-live="polite"
                        aria-label={`${rhythmTaps} beats tapped`}
                      >
                        {rhythmTaps === 0 ? (
                          <span className="text-sm font-semibold text-muted-foreground">
                            {t("foundation.noBeats")}
                          </span>
                        ) : (
                          Array.from({ length: rhythmTaps }, (_, index) => (
                            <span
                              key={index}
                              className="size-6 rounded-full bg-primary"
                              aria-hidden
                            />
                          ))
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setRhythmTaps((count) => Math.min(question.options.length, count + 1))
                        }
                        disabled={answered || rhythmTaps >= question.options.length}
                        className={`mt-4 min-h-[64px] w-full rounded-2xl border-2 border-primary bg-primary/10 text-lg font-black text-primary disabled:opacity-60 ${focusRing}`}
                      >
                        {t("foundation.tapBeat")}
                      </button>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRhythmTaps(0)}
                          disabled={answered || rhythmTaps === 0}
                          className={`min-h-12 rounded-xl border border-border font-bold text-foreground disabled:opacity-50 ${focusRing}`}
                        >
                          {t("foundation.resetTaps")}
                        </button>
                        <button
                          type="button"
                          onClick={() => choose(String(rhythmTaps))}
                          disabled={answered || rhythmTaps === 0}
                          className={`min-h-12 rounded-xl bg-primary font-bold text-primary-foreground disabled:opacity-50 ${focusRing}`}
                        >
                          {t("foundation.checkRhythm")}
                        </button>
                      </div>
                    </div>
                  ) : responseMode === "ordering" ? (
                    <div className="mt-7 rounded-3xl border border-border bg-wp-card p-5 shadow-wp-xs">
                      <p className="font-bold text-foreground">
                        {t("foundation.buildListeningOrder")}
                      </p>
                      <div
                        className="mt-4 flex min-h-16 flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/35 bg-primary/5 p-3"
                        aria-live="polite"
                        aria-label={
                          orderedChoices.length
                            ? `Current order: ${orderedChoices
                                .map(
                                  (value) =>
                                    question.options.find((option) => option.value === value)?.label
                                )
                                .join(", ")}`
                            : "No chunks selected"
                        }
                      >
                        {orderedChoices.length === 0 ? (
                          <span className="text-sm font-semibold text-muted-foreground">
                            {t("foundation.chooseFirstChunk")}
                          </span>
                        ) : (
                          orderedChoices.map((value, index) => (
                            <span
                              key={value}
                              className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground"
                            >
                              {index + 1}.{" "}
                              {question.options.find((item) => item.value === value)?.label}
                            </span>
                          ))
                        )}
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {question.options.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setOrderedChoices((current) => [...current, item.value])}
                            disabled={answered || orderedChoices.includes(item.value)}
                            className={`min-h-[52px] rounded-xl border-2 border-primary bg-background px-3 font-bold text-primary disabled:opacity-45 ${focusRing}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setOrderedChoices((current) => current.slice(0, -1))}
                          disabled={answered || orderedChoices.length === 0}
                          className={`min-h-12 rounded-xl border border-border font-bold text-foreground disabled:opacity-50 ${focusRing}`}
                        >
                          {t("foundation.undo")}
                        </button>
                        <button
                          type="button"
                          onClick={() => choose(orderedChoices.join("|"))}
                          disabled={answered || orderedChoices.length !== question.options.length}
                          className={`min-h-12 rounded-xl bg-primary font-bold text-primary-foreground disabled:opacity-50 ${focusRing}`}
                        >
                          {t("foundation.checkOrder")}
                        </button>
                      </div>
                    </div>
                  ) : hasSpokenOptions ? (
                    <div className="mt-6 grid grid-cols-2 gap-3" aria-label="Spoken answer choices">
                      {question.options.map((item, index) => {
                        const heard = heardOptions.has(item.value);
                        const isAnswer = item.value === question.answer;
                        const isSelected = selectedChoice === item.value;
                        const isWrongSelection = isSelected && !isAnswer;
                        const revealImage =
                          question.imageReveal === "always" || (answered && isAnswer);
                        return (
                          <div
                            key={item.value}
                            className={`relative overflow-hidden rounded-2xl border-2 bg-wp-card shadow-wp-xs ${answered && isAnswer ? "border-[var(--feedback-success)]" : isWrongSelection ? "border-[var(--feedback-error)]" : "border-border"}`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (!item.audio || answered) return;
                                if (allOptionsHeard) choose(item.value);
                                else listenToOption(item.value, item.audio);
                              }}
                              className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-primary/10 text-primary ${focusRing}`}
                              aria-label={
                                answered
                                  ? `${isAnswer ? "Correct answer" : "Other choice"}: ${item.label}`
                                  : allOptionsHeard
                                    ? `Choose option ${index + 1}`
                                    : `Listen to choice ${index + 1}`
                              }
                            >
                              {item.image ? (
                                <img
                                  src={resolveAssetUrl(item.image.src)}
                                  alt=""
                                  className={`size-full object-cover transition duration-500 ${revealImage ? "scale-100 blur-0" : "scale-110 blur-xl"}`}
                                />
                              ) : (
                                <Volume2 className="size-12" aria-hidden />
                              )}
                              <span
                                className="absolute start-2 top-2 flex size-9 items-center justify-center rounded-full bg-background/95 text-sm font-black text-foreground shadow-wp-xs"
                                aria-hidden
                              >
                                {index + 1}
                              </span>
                              {answered && isAnswer && (
                                <span className="absolute inset-x-2 bottom-2 rounded-lg bg-background/95 px-2 py-1 text-base font-black capitalize text-foreground">
                                  {item.label}
                                </span>
                              )}
                              {(isWrongSelection || (answered && isAnswer)) && (
                                <span
                                  className={`absolute end-2 top-2 flex size-9 items-center justify-center rounded-full shadow-wp-xs ${isAnswer ? "bg-wp-green text-wp-text-on-green" : "bg-wp-rose text-wp-text-on-rose"}`}
                                  aria-hidden
                                >
                                  {isAnswer ? (
                                    <Check className="size-5" />
                                  ) : (
                                    <X className="size-5" />
                                  )}
                                </span>
                              )}
                            </button>
                            <div
                              className={`flex min-h-12 w-full items-center justify-center gap-2 border-t border-border px-3 text-sm font-black ${allOptionsHeard ? "text-primary" : "text-muted-foreground"}`}
                              aria-hidden
                            >
                              {allOptionsHeard
                                ? "Tap your answer"
                                : heard
                                  ? "Heard"
                                  : "Tap to listen"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className={`mt-7 grid gap-3 ${question.options.length > 2 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}
                    >
                      {question.options.map((item) => {
                        const isAnswer = item.value === question.answer;
                        const isSelected = selectedChoice === item.value;
                        const isWrongSelection = isSelected && !isAnswer;
                        const showCorrect = answered && isAnswer;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => choose(item.value)}
                            disabled={answered}
                            aria-label={
                              showCorrect
                                ? `Correct answer: ${item.label}`
                                : isWrongSelection
                                  ? `Incorrect answer: ${item.label}`
                                  : undefined
                            }
                            className={`group relative min-h-[64px] overflow-hidden rounded-2xl border-2 bg-wp-card text-lg font-black text-primary hover:bg-primary/10 disabled:opacity-100 ${showCorrect ? "border-[var(--feedback-success)]" : isWrongSelection ? "border-[var(--feedback-error)]" : "border-primary"} ${focusRing}`}
                          >
                            {item.image ? (
                              <>
                                <span className="block aspect-[4/3] overflow-hidden bg-primary/10">
                                  <img
                                    src={resolveAssetUrl(item.image.src)}
                                    alt=""
                                    className="size-full object-cover transition duration-300 group-hover:scale-105"
                                  />
                                </span>
                                <span className="block border-t border-border px-3 py-3 capitalize">
                                  {item.label}
                                </span>
                              </>
                            ) : (
                              <span className="block px-3 py-4">{item.label}</span>
                            )}
                            {(isWrongSelection || showCorrect) && (
                              <span
                                className={`absolute end-2 top-2 flex size-9 items-center justify-center rounded-full shadow-wp-xs ${showCorrect ? "bg-wp-green text-wp-text-on-green" : "bg-wp-rose text-wp-text-on-rose"}`}
                                aria-hidden
                              >
                                {showCorrect ? (
                                  <Check className="size-5" aria-hidden />
                                ) : (
                                  <X className="size-5" aria-hidden />
                                )}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {feedback && (
                    <p className="sr-only" role="status" aria-live="polite">
                      {feedback}
                      {answered && attempts >= 2
                        ? ` The answer is ${question.options.find((item) => item.value === question.answer)?.label}.`
                        : ""}
                    </p>
                  )}
                  {answered && !state.accessibility.autoAdvance && (
                    <button
                      type="button"
                      onClick={advance}
                      className={`mt-4 min-h-[52px] w-full rounded-2xl bg-primary px-5 font-bold text-primary-foreground ${focusRing}`}
                    >
                      {t("foundation.nextActivity")}
                    </button>
                  )}
                </section>
              );
            })()}

          {step.kind === "summary" && (
            <section className="mx-auto w-full max-w-xl rounded-3xl border border-[var(--feedback-success-border)] bg-wp-card p-6 text-center shadow-wp-sm sm:p-8">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--feedback-success-surface)] text-[var(--feedback-success)]">
                <Check className="size-8" aria-hidden />
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-wider text-primary">
                {t("foundation.lessonComplete")}
              </p>
              <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
                {t("foundation.youDidIt")}
              </h2>
              <p className="mt-3 font-semibold text-muted-foreground">
                {t("foundation.summaryScore", { correct, total: lesson.questions.length })}
              </p>
              <div
                className={`mt-5 rounded-2xl border p-4 text-start ${mastered ? "border-[var(--feedback-success-border)] bg-[var(--feedback-success-surface)]" : "border-[var(--feedback-warning)] bg-[var(--feedback-warning-surface)]"}`}
              >
                <p className="text-xs font-black uppercase tracking-wide text-foreground">
                  {usesQualitativeRouting
                    ? "Learning evidence saved"
                    : mastered
                      ? "Mastered"
                      : "Practice recommended"}
                </p>
                <p className="mt-1 font-bold text-foreground">
                  {usesQualitativeRouting
                    ? "This lesson records communication evidence without using an accent, speed, or pronunciation score as a gate."
                    : mastered
                      ? `Score: ${scorePercent}%. You are ready for the next lesson.`
                      : `Score: ${scorePercent}%. Try once more to reach ${lesson.masteryThreshold}%.`}
                </p>
              </div>
              {usesQualitativeRouting && (
                <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-4 text-start">
                  <p className="text-xs font-black uppercase tracking-wide text-primary">
                    {t("foundation.skillResults")}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {lesson.evidenceDimensions.map((dimension, index) => {
                      const result = questionResults[index % Math.max(1, lesson.questions.length)];
                      return (
                        <li key={dimension} className="flex items-center justify-between gap-3">
                          <span className="font-semibold capitalize text-foreground">
                            {dimension}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${result ? "bg-[var(--feedback-success-surface)] text-foreground" : "bg-[var(--feedback-warning-surface)] text-foreground"}`}
                          >
                            {result ? t("foundation.demonstrated") : t("foundation.keepPractising")}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                    {t("foundation.resultsNote")}
                  </p>
                </div>
              )}
              {usesQualitativeRouting && (
                <fieldset className="mt-4 rounded-2xl border border-border p-4 text-start">
                  <legend className="px-2 text-xs font-black uppercase tracking-wide text-primary">
                    {t("foundation.confidenceHeading")}
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      ["again", t("foundation.confidenceAgain")],
                      ["supported", t("foundation.confidenceSupported")],
                      ["ready", t("foundation.confidenceReady")],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setConfidence(value as typeof confidence)}
                        aria-pressed={confidence === value}
                        className={`min-h-12 rounded-xl border px-3 text-sm font-bold ${confidence === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"} ${focusRing}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {confidence && (
                    <p className="mt-3 text-sm font-semibold text-muted-foreground" role="status">
                      {confidence === "again"
                        ? t("foundation.recommendRepeat")
                        : confidence === "supported"
                          ? t("foundation.recommendReview")
                          : t("foundation.recommendContinue")}
                    </p>
                  )}
                </fieldset>
              )}
              {mastered && nextLesson && (
                <div className="mt-5 rounded-2xl bg-primary/5 p-4 text-start">
                  <p className="text-xs font-black uppercase tracking-wide text-primary">
                    {t("foundation.upNext")}
                  </p>
                  <p className="mt-1 font-black text-foreground">{nextLesson.title}</p>
                </div>
              )}
              <button
                type="button"
                onClick={mastered ? finish : restartLesson}
                className={`mt-6 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-bold text-primary-foreground ${focusRing}`}
              >
                {mastered
                  ? nextLesson
                    ? t("foundation.startNext")
                    : t("foundation.backCurriculum")
                  : t("foundation.practiceAgain")}
                {mastered && <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />}
              </button>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {previousLesson && (
                  <button
                    type="button"
                    onClick={() => openLesson(previousLesson.id)}
                    className={`min-h-12 rounded-xl border border-border px-3 font-bold text-foreground ${focusRing}`}
                  >
                    {t("foundation.previousLesson")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dispatch({ type: "GO", to: "explore" })}
                  className={`min-h-12 rounded-xl border border-border px-3 font-bold text-foreground ${previousLesson ? "" : "col-span-2"} ${focusRing}`}
                >
                  {t("foundation.viewCurriculum")}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {isPlaying ? t("foundation.audioPlaying") : ""}
      </div>
    </div>
  );
}
