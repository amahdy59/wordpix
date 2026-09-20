import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Headphones,
  Info,
  Play,
  Sparkles,
  Volume2,
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
  const mastered = savedProgress?.status === "mastered" || scorePercent >= lesson.masteryThreshold;

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

  const resetStepInteraction = () => {
    stop();
    setAttempts(0);
    setAnswered(false);
    setFeedback(null);
    setHintOpen(false);
    setHeardOptions(new Set());
  };

  const advance = () => {
    resetStepInteraction();
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    resetStepInteraction();
    setStepIndex((current) => Math.max(0, current - 1));
  };

  const choose = (value: string) => {
    if (step.kind !== "question" || answered) return;
    stop();
    const question = lesson.questions[step.index];
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
              Level {lesson.level} · Unit {lesson.unitId} · Lesson {lesson.number}
            </p>
            <h1 className="truncate text-lg font-black text-foreground sm:text-xl">
              {lesson.title}
            </h1>
          </div>
          <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary sm:inline">
            {lesson.audioOnly ? "Listen" : "Sounds + letters"}
          </span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-5 sm:px-6 sm:py-7">
        <ProgressBar
          progressPercent={progress}
          label="Lesson progress"
          labelRight={`${progress}%`}
          ariaLabel={`Lesson ${progress}% complete`}
        />
        {isError && (
          <div
            role="alert"
            className="mt-3 rounded-xl border border-[var(--feedback-warning)] bg-[var(--feedback-warning-surface)] px-4 py-3 text-sm font-bold text-foreground"
          >
            Sound could not play. Check the device volume, then tap the sound button to retry.
          </div>
        )}
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={goBack}
            className={`mt-3 flex min-h-11 w-fit items-center gap-2 rounded-xl px-3 font-bold text-foreground hover:bg-muted ${focusRing}`}
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            Back one step
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
                      Tap a picture to hear it
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
                <Play className="size-5" aria-hidden /> Start lesson
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
                    Watch and listen · Example {step.index + 1}
                  </p>
                  <h2 id="model-heading" className="mt-2 text-2xl font-black text-foreground">
                    Let’s learn it together
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
                    Continue
                  </button>
                </section>
              );
            })()}

          {step.kind === "question" &&
            (() => {
              const question = lesson.questions[step.index];
              const challengeStart = Math.max(1, lesson.questions.length - 2);
              const activity = getFoundationActivityContract(question);
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
                    {step.index >= challengeStart ? "Challenge round" : "Your turn"} ·{" "}
                    {step.index + 1} of {lesson.questions.length}
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
                  {hasSpokenOptions ? (
                    <div className="mt-6 grid grid-cols-2 gap-3" aria-label="Spoken answer choices">
                      {question.options.map((item, index) => {
                        const heard = heardOptions.has(item.value);
                        const isAnswer = item.value === question.answer;
                        return (
                          <div
                            key={item.value}
                            className={`overflow-hidden rounded-2xl border-2 bg-wp-card shadow-wp-xs ${answered && isAnswer ? "border-[var(--feedback-success-border)]" : "border-border"}`}
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
                                  className={`size-full object-cover transition duration-500 ${answered && isAnswer ? "blur-0 scale-100" : "scale-110 blur-xl"}`}
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
                            </button>
                            <div
                              className={`flex min-h-12 w-full items-center justify-center gap-2 border-t border-border px-3 text-sm font-black ${allOptionsHeard ? "text-primary" : "text-muted-foreground"}`}
                              aria-hidden
                            >
                              {answered ? (
                                isAnswer ? (
                                  <>
                                    <Check className="size-4" />
                                    Correct answer
                                  </>
                                ) : (
                                  "Not this one"
                                )
                              ) : allOptionsHeard ? (
                                "Tap your answer"
                              ) : heard ? (
                                "Heard"
                              ) : (
                                "Tap to listen"
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className={`mt-7 grid gap-3 ${question.options.length > 2 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}
                    >
                      {question.options.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => choose(item.value)}
                          disabled={answered}
                          className={`min-h-[64px] rounded-2xl border-2 border-primary bg-wp-card px-3 text-lg font-black text-primary hover:bg-primary/10 disabled:opacity-65 ${focusRing}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {feedback && (
                    <div
                      className={`mt-5 rounded-2xl border p-4 text-start ${answered ? "border-[var(--feedback-success-border)] bg-[var(--feedback-success-surface)]" : "border-[var(--feedback-warning)] bg-[var(--feedback-warning-surface)]"}`}
                      role="status"
                      aria-live="polite"
                    >
                      <p className="font-bold leading-relaxed text-foreground">
                        {feedback}
                        {answered && attempts >= 2
                          ? ` The answer is ${question.options.find((item) => item.value === question.answer)?.label}.`
                          : ""}
                      </p>
                    </div>
                  )}
                  {answered && (
                    <button
                      type="button"
                      onClick={advance}
                      className={`mt-3 min-h-[52px] w-full rounded-2xl bg-primary px-5 font-bold text-primary-foreground ${focusRing}`}
                    >
                      Continue
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
                Lesson complete
              </p>
              <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">You did it!</h2>
              <p className="mt-3 font-semibold text-muted-foreground">
                You answered {correct} of {lesson.questions.length} on your first or second try.
                Practice is how strong listening and reading grow.
              </p>
              <div
                className={`mt-5 rounded-2xl border p-4 text-start ${mastered ? "border-[var(--feedback-success-border)] bg-[var(--feedback-success-surface)]" : "border-[var(--feedback-warning)] bg-[var(--feedback-warning-surface)]"}`}
              >
                <p className="text-xs font-black uppercase tracking-wide text-foreground">
                  {mastered ? "Mastered" : "Practice recommended"}
                </p>
                <p className="mt-1 font-bold text-foreground">
                  {mastered
                    ? `Score: ${scorePercent}%. You are ready for the next lesson.`
                    : `Score: ${scorePercent}%. Try once more to reach ${lesson.masteryThreshold}%.`}
                </p>
              </div>
              {mastered && nextLesson && (
                <div className="mt-5 rounded-2xl bg-primary/5 p-4 text-start">
                  <p className="text-xs font-black uppercase tracking-wide text-primary">Up next</p>
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
                    ? "Start next lesson"
                    : "Back to curriculum"
                  : "Practice this lesson again"}
                {mastered && <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />}
              </button>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {previousLesson && (
                  <button
                    type="button"
                    onClick={() => openLesson(previousLesson.id)}
                    className={`min-h-12 rounded-xl border border-border px-3 font-bold text-foreground ${focusRing}`}
                  >
                    Previous lesson
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dispatch({ type: "GO", to: "explore" })}
                  className={`min-h-12 rounded-xl border border-border px-3 font-bold text-foreground ${previousLesson ? "" : "col-span-2"} ${focusRing}`}
                >
                  View curriculum
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {isPlaying ? "Audio playing" : ""}
      </div>
    </div>
  );
}
