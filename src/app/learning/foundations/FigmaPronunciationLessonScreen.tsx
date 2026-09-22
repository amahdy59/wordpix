import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Mic, Play, RotateCcw, Sparkles } from "lucide-react";
import type { Action } from "../../types";
import { useAudio } from "../../shared/useAudio";
import {
  getFigmaPronunciationActivityData,
  getFigmaPronunciationLesson,
} from "./figmaPronunciationCatalog";
import { PRONUNCIATION_IMAGE_FILES } from "./pronunciationImageVersions";
import { resolveAssetUrl } from "../../../utils/assetUrl";

interface Props {
  lessonNumber: number;
  dispatch: React.Dispatch<Action>;
}
const FLOW = [
  ["Hear & notice", "Listen first. Keep the pictures out of the way while you focus on sound."],
  ["See the sound", "Use the visual cue to connect what you heard with how the sound is made."],
  ["Say & try", "Copy the model at your own pace. Recording is optional practice, never a gate."],
  ["Transfer", "Try a fresh word or a new speaker so the skill travels beyond this screen."],
] as const;

export function FigmaPronunciationLessonScreen({ lessonNumber, dispatch }: Props) {
  const lesson = getFigmaPronunciationLesson(lessonNumber);
  const activity = getFigmaPronunciationActivityData(lessonNumber);
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const { speak, stop, isPlaying } = useAudio({ lang: "en-US", rate: 0.78, preferLocal: true });
  const title = activity.title;
  const objective = activity.objective;
  const activeTargets =
    activity.teachWords.join(" · ") || "Listen for the target pattern in a fresh example.";
  const focusLabel =
    step === 0
      ? "Hear the target in context"
      : step === 1
        ? "Notice what changes"
        : step === 2
          ? "Practise at your pace"
          : "Transfer to a fresh example";
  const targetWord =
    step === 3
      ? (activity.transferWords[0] ?? activity.teachWords.at(-1) ?? activity.model)
      : (activity.teachWords[0] ?? activity.model);
  const audioText = step === 0 || step === 3 ? targetWord : activity.model;
  const choices = useMemo(() => {
    const pool =
      step === 3 ? [...activity.transferWords, ...activity.teachWords] : activity.teachWords;
    return [
      ...new Set([
        targetWord,
        ...pool.filter((word) => word.toLowerCase() !== targetWord.toLowerCase()),
      ]),
    ].slice(0, 4);
  }, [activity, step, targetWord]);
  const imageWords = Object.keys(PRONUNCIATION_IMAGE_FILES)
    .filter((word) => lesson.text.some((line) => new RegExp(`\\b${word}\\b`, "i").test(line)))
    .slice(0, 4);
  const answerable = step === 0 || step === 3;
  const answer = targetWord;
  const correct = choice === answer;
  const locked = Boolean(choice && (correct || attempts >= 2));
  const choose = (value: string) => {
    if (!choice) {
      setChoice(value);
      if (value !== answer) setAttempts((n) => n + 1);
    }
  };
  const advance = () => {
    stop();
    setChoice(null);
    setAttempts(0);
    setStep((n) => Math.min(n + 1, FLOW.length - 1));
  };
  const go = (n: number) => {
    window.location.hash = `#/pronunciation/lesson-${String(n).padStart(2, "0")}`;
  };
  return (
    <main
      className="min-h-dvh w-full overflow-y-auto bg-background pb-24"
      aria-labelledby="pronunciation-title"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 p-4 sm:p-8">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "explore" })}
          className="min-h-11 w-fit rounded-xl px-3 font-bold focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="me-2 inline size-4" aria-hidden />
          Back to curriculum
        </button>
        <header className="rounded-3xl bg-gradient-to-br from-primary/15 via-card to-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                Pronunciation · Lesson {lessonNumber} of 68
              </p>
              <h1 id="pronunciation-title" className="mt-2 text-3xl font-black tracking-tight">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{objective}</p>
            </div>
            <Sparkles className="size-8 text-primary" aria-hidden />
          </div>
          <div
            className="mt-5 grid grid-cols-4 gap-2"
            aria-label={`Step ${step + 1} of ${FLOW.length}`}
          >
            {FLOW.map((item, i) => (
              <div
                key={item[0]}
                className={`h-2 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
                aria-hidden
              />
            ))}
          </div>
        </header>
        {imageWords.length > 0 && (
          <section
            className="rounded-3xl border border-border bg-card p-5 shadow-sm"
            aria-label="Lesson picture cues"
          >
            <p className="text-sm font-black text-primary">Picture cues</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {imageWords.map((word) => (
                <figure
                  key={word}
                  className="overflow-hidden rounded-2xl border border-border bg-muted"
                >
                  <img
                    src={resolveAssetUrl(
                      `/word-images/pronunciation/${PRONUNCIATION_IMAGE_FILES[word as keyof typeof PRONUNCIATION_IMAGE_FILES]}`
                    )}
                    alt={word}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="p-2 text-center text-sm font-bold capitalize">
                    {word}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Pictures support meaning; keep them hidden while you check listening.
            </p>
          </section>
        )}
        <section
          className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-primary">
                Step {step + 1} · {FLOW[step][0]}
              </p>
              <h2 className="mt-1 text-2xl font-black">{focusLabel}</h2>
            </div>
            <span className="rounded-2xl bg-primary/10 px-3 py-2 text-2xl" aria-hidden>
              ◉
            </span>
          </div>
          <button
            type="button"
            onClick={() => speak(audioText)}
            className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 font-black text-primary-foreground focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Play className="size-5" aria-hidden />
            {isPlaying ? "Playing model…" : "Play model pronunciation"}
          </button>
          <p className="mt-4 rounded-2xl bg-muted p-4 text-sm leading-6">
            <span className="font-black text-primary">Target:</span> {activeTargets}
          </p>
          {answerable && (
            <>
              <p className="mt-5 text-sm font-bold">Listen, then choose the word you heard.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {choices.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => choose(value)}
                    aria-pressed={choice === value}
                    className={`min-h-14 rounded-2xl border-2 px-4 text-start font-black capitalize focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary ${choice === value ? (value === answer ? "border-feedback-success bg-feedback-success-surface" : "border-destructive bg-destructive/10") : "border-border hover:border-primary"}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <button
              type="button"
              onClick={() => speak(audioText)}
              className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/50 px-5 font-black"
            >
              <Mic className="size-5" aria-hidden />
              Tap to practise speaking (optional)
            </button>
          )}
          {choice && (
            <div role="status" className="mt-5 rounded-2xl bg-muted p-4 font-bold">
              {correct ? (
                <>
                  <Check className="me-2 inline size-5 text-success-foreground" aria-hidden />
                  Nice work. Keep that contrast in mind.
                </>
              ) : attempts >= 2 ? (
                "Let’s continue with a support cue. You can revisit this step during review."
              ) : (
                "Listen once more and try again."
              )}
            </div>
          )}
          <div className="mt-6 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setChoice(null);
                setAttempts(0);
              }}
              className="min-h-11 rounded-xl px-3 font-bold"
            >
              <RotateCcw className="me-2 inline size-4" aria-hidden />
              Reset step
            </button>
            {(!answerable || locked) && (
              <button
                type="button"
                onClick={advance}
                className="min-h-11 rounded-xl bg-primary px-5 font-black text-primary-foreground"
              >
                {step === FLOW.length - 1 ? "Finish lesson" : "Continue"}
                <ArrowRight className="ms-2 inline size-4" aria-hidden />
              </button>
            )}
          </div>
        </section>
        <nav className="flex justify-between gap-3" aria-label="Pronunciation lesson navigation">
          <button
            type="button"
            disabled={lessonNumber === 1}
            onClick={() => go(lessonNumber - 1)}
            className="min-h-11 rounded-xl border px-4 font-bold disabled:opacity-50"
          >
            <ArrowLeft className="me-2 inline size-4" aria-hidden />
            Previous lesson
          </button>
          <button
            type="button"
            disabled={lessonNumber === 68}
            onClick={() => go(lessonNumber + 1)}
            className="min-h-11 rounded-xl border px-4 font-bold disabled:opacity-50"
          >
            Next lesson
            <ArrowRight className="ms-2 inline size-4" aria-hidden />
          </button>
        </nav>
      </div>
    </main>
  );
}
