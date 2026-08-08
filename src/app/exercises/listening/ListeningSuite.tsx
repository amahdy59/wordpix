import { memo, useCallback, useMemo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";

import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { Trophy } from "lucide-react";
import { useAudio } from "../../shared/useAudio";
import { useSound } from "../../shared/useSound";
import { useProgress } from "../../data/progress";
import { useAccessibility } from "../../shared/useAccessibilityPreferences";
import { useCountdown } from "../../shared/useCountdown";
import { ExerciseTimer } from "../../shared/ExerciseTimer";

interface Props {
  dispatch: React.Dispatch<Action>;
}

/** Dictation sprint: duration and replay allowance. */
const DICTATION_SECONDS = 45;
const MAX_REPLAYS = 3;

// 3. Dictation Sprint
export const ExListeningDictationSprint = memo(function ExListeningDictationSprint({ dispatch }: Props) {
  const { accessibility } = useAccessibility();
  const timed = accessibility.timedExercises;
  const { speak } = useAudio();
  const { playCorrect, playIncorrect } = useSound();

  const [typed, setTyped] = useState("");
  const [replaysUsed, setReplaysUsed] = useState(0);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  const target = useMemo(() => BEDROOM_VOCABULARY.find((w) => w.id === "blanket") ?? BEDROOM_VOCABULARY[0], []);
  const sentence = `The cat is sleeping on the ${target.label.toLowerCase()}`;

  const reveal = useCallback(() => {
    setResult((current) => current ?? "incorrect");
  }, []);

  const countdown = useCountdown({
    seconds: DICTATION_SECONDS,
    enabled: timed,
    autoStart: timed,
    onExpire: reveal,
  });

  const handleReplay = () => {
    if (replaysUsed >= MAX_REPLAYS) return;
    setReplaysUsed((r) => r + 1);
    speak(sentence);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (result) return;
    const isRight = typed.trim().toLowerCase() === target.label.toLowerCase();
    setResult(isRight ? "correct" : "incorrect");
    if (isRight) playCorrect();
    else playIncorrect();
    countdown.pause();
  };

  const replaysLeft = MAX_REPLAYS - replaysUsed;

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Dictation Sprint (Cloze Input)" current={3} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-wp-card border border-border rounded-2xl p-4">
          <ExerciseTimer countdown={countdown} enabled={timed} label="Dictation time remaining" />
          <button
            type="button"
            onClick={handleReplay}
            disabled={replaysLeft === 0}
            className="px-3 min-h-[44px] rounded-xl bg-secondary text-primary font-sans font-bold text-xs border border-primary/20 disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {/* Was "Replays Left: {replays}/3" seeded from useState(2), so it
                opened claiming 2 of 3 before anything had been used. */}
            Replays left: {replaysLeft} of {MAX_REPLAYS}
          </button>
        </div>

        <form onSubmit={submit} className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col gap-4">
          <h2 className="font-sans font-bold text-foreground text-xl">
            &ldquo;The cat is sleeping on the{" "}
            <span className="underline text-primary decoration-primary decoration-2 underline-offset-4">
              {typed || "_______"}
            </span>
            .&rdquo;
          </h2>

          <label htmlFor="dictation-entry" className="sr-only">
            Type the missing word
          </label>
          <input
            id="dictation-entry"
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={result !== null}
            autoComplete="off"
            placeholder="Type missing word..."
            className="w-full min-h-[52px] bg-background border border-border rounded-xl p-4 font-sans font-bold text-foreground text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          />

          {result && (
            <div
              role="status"
              className={`rounded-2xl border p-4 font-sans text-sm ${
                result === "correct"
                  ? "border-wp-green bg-wp-green-light/40 text-foreground"
                  : "border-wp-rose bg-wp-rose-light/40 text-foreground"
              }`}
            >
              {result === "correct"
                ? `Correct — the word is "${target.label}".`
                : `The word was "${target.label}".`}
            </div>
          )}

          {result ? (
            <PrimaryButton label="Back to Exercises" onClick={() => dispatch({ type: "GO", to: "explore" })} />
          ) : (
            <PrimaryButton label="Submit Dictation" type="submit" />
          )}
        </form>
      </main>
    </div>
  );
});

// 7. Lesson Results (Listening)
export const ExListeningResults = memo(function ExListeningResults({ dispatch }: Props) {
  const { progress } = useProgress();
  const strongWords = Object.values(progress.wordMemory).filter((w) => w.mastery === "strong").length;

  return (
    <div className="min-h-svh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-wp-amber/20 border border-wp-amber/30 flex items-center justify-center shadow-2xl mb-4">
        <Trophy className="size-12 text-wp-amber" />
      </div>
      <h1 className="font-sans font-black text-foreground text-3xl">Listening Module Complete!</h1>
      <p className="font-sans text-muted-foreground text-sm mt-1 max-w-md">
        Skill drills are practice, not graded work. Your totals below come from your lesson sessions.
      </p>
      <div className="grid grid-cols-3 gap-3 w-full max-w-md my-6">
        <div className="bg-wp-card border border-border p-3 rounded-2xl">
          <p className="font-sans font-black text-2xl text-primary">{progress.xp}</p>
          <p className="font-sans text-[11px] text-muted-foreground">Total XP</p>
        </div>
        <div className="bg-wp-card border border-border p-3 rounded-2xl">
          <p className="font-sans font-black text-2xl text-wp-blue">{progress.streak}</p>
          <p className="font-sans text-[11px] text-muted-foreground">Day Streak</p>
        </div>
        <div className="bg-wp-card border border-border p-3 rounded-2xl">
          <p className="font-sans font-black text-2xl text-wp-green">{strongWords}</p>
          <p className="font-sans text-[11px] text-muted-foreground">Words Strong</p>
        </div>
      </div>
      <PrimaryButton label="Return to Explore Worlds" onClick={() => dispatch({ type: "GO", to: "explore" })} />
    </div>
  );
});

