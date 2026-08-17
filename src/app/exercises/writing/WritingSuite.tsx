import { memo, useCallback, useMemo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";
import { WordImage } from "../../shared/WordImage";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";

import { PenTool } from "lucide-react";
import { useSound } from "../../shared/useSound";
import { useAccessibility } from "../../shared/useAccessibilityPreferences";
import { useCountdown } from "../../shared/useCountdown";
import { ExerciseTimer } from "../../shared/ExerciseTimer";
import { shuffleArray } from "../../../utils/shuffle";

interface Props {
  dispatch: React.Dispatch<Action>;
}

// 8. Writing Results
export const ExWritingResults = memo(function ExWritingResults({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-2xl mb-4">
        <PenTool className="size-12 text-primary" />
      </div>
      <h1 className="font-sans font-black text-foreground text-3xl">Writing Complete!</h1>
      <p className="font-sans text-muted-foreground text-sm mt-1 max-w-md">
        Writing drills are self-checked practice and are not scored. Head back to a lesson to earn XP toward your streak.
      </p>
      <PrimaryButton label="Return to Explore" onClick={() => dispatch({ type: "GO", to: "explore" })} />
    </div>
  );
});

// 9. Timed Writing Sprint
//
// This screen used to render the literal text "0:30 SPRINT" with no timer, no
// input, and a button that navigated away. It is now a real spelling sprint:
// the learner types each word from its picture, answers are checked, and the
// countdown is pausable, extendable, and can be switched off entirely.
const SPRINT_SECONDS = 60;

export const ExWritingTimedSprint = memo(function ExWritingTimedSprint({ dispatch }: Props) {
  const { accessibility } = useAccessibility();
  const timed = accessibility.timedExercises;
  const { playCorrect, playIncorrect } = useSound();

  const words = useMemo(() => shuffleArray(BEDROOM_VOCABULARY).slice(0, 10), []);
  const [index, setIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [correct, setCorrect] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const finish = useCallback(() => setFinished(true), []);
  const countdown = useCountdown({ seconds: SPRINT_SECONDS, enabled: timed, autoStart: timed, onExpire: finish });

  const current = words[index];
  const isLast = index >= words.length - 1;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finished || !current) return;

    const isRight = entry.trim().toLowerCase() === current.label.toLowerCase();
    if (isRight) {
      setCorrect((c) => [...c, current.id]);
      playCorrect();
    } else {
      setMissed((m) => [...m, current.id]);
      playIncorrect();
    }

    setEntry("");
    if (isLast) finish();
    else setIndex((i) => i + 1);
  };

  if (finished) {
    return (
      <div className="min-h-svh bg-background flex flex-col">
        <LessonHeader title="Timed Speed Writing Sprint" current={9} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
        <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
          <div role="status" className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col items-center gap-2 text-center">
            <span className="font-sans font-black text-foreground text-3xl">
              {correct.length} of {correct.length + missed.length} spelled correctly
            </span>
            <p className="font-sans text-sm text-muted-foreground">
              {missed.length === 0
                ? "Every word correct."
                : `Worth another look: ${missed
                    .map((id) => BEDROOM_VOCABULARY.find((w) => w.id === id)?.label)
                    .filter(Boolean)
                    .join(", ")}`}
            </p>
          </div>
          <PrimaryButton label="Back to Exercises" onClick={() => dispatch({ type: "GO", to: "explore" })} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Timed Speed Writing Sprint" current={9} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-sans font-bold text-sm text-foreground">
            Word {index + 1} of {words.length}
          </span>
          <ExerciseTimer countdown={countdown} enabled={timed} label="Sprint time remaining" />
        </div>

        <div className="w-full rounded-3xl overflow-hidden border border-border shadow-wp-xs bg-muted">
          <WordImage word={current} altMode="assessment" optionIndex={index} className="w-full h-auto block object-contain" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label htmlFor="sprint-entry" className="font-sans font-bold text-sm text-foreground">
            Type the word for this picture
          </label>
          <input
            id="sprint-entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-full min-h-[52px] bg-wp-card border-2 border-border rounded-2xl px-4 font-sans text-foreground text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
          <PrimaryButton label={isLast ? "Finish Sprint" : "Next Word"} type="submit" />
        </form>
      </main>
    </div>
  );
});
