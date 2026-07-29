import { memo } from "react";
import type { Action, AnswerAttempt } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";

interface Props {
  attempts: AnswerAttempt[];
  selectedWordId: string;
  dispatch: React.Dispatch<Action>;
}

export const LessonCompleteResults = memo(function LessonCompleteResults({ attempts, selectedWordId, dispatch }: Props) {
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const accuracy = attempts.length === 0 ? 100 : Math.round((correct / attempts.length) * 100);
  const stars = [accuracy >= 50, accuracy >= 75, accuracy >= 90];
  const xp = correct * 10;

  return (
    <div className="bg-secondary flex flex-col justify-between min-h-full relative">
      <StatusBar />
      <main className="flex-1 flex flex-col items-center justify-center w-full px-6 gap-5">
        <div className="bg-wp-amber rounded-full size-24 flex items-center justify-center text-5xl" aria-hidden>🏆</div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-sans font-black text-primary text-3xl text-center">Great Work!</h1>
          <p className="font-sans font-semibold text-foreground text-lg text-center">You completed this word lesson.</p>
        </div>
        <div className="flex gap-2 items-center" aria-label={`${stars.filter(Boolean).length} out of 3 stars`}>
          {stars.map((filled, index) => <span key={index} className="text-4xl" aria-hidden>{filled ? "⭐" : "☆"}</span>)}
        </div>
        <div className="grid grid-cols-3 gap-2.5 w-full">
          {[
            { value: "1", label: "Word Practised", color: "var(--wp-brand)" },
            { value: `${accuracy}%`, label: "Accuracy", color: "var(--wp-blue)" },
            { value: `+${xp}`, label: "XP Earned", color: "var(--wp-green)" },
          ].map(({ value, label, color }) => (
            <div key={label} className="bg-wp-card rounded-xl border border-border p-3 flex flex-col items-center gap-1">
              <p className="font-sans font-black text-xl" style={{ color }}>{value}</p>
              <p className="font-sans font-medium text-muted-foreground text-[10px] text-center">{label}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="w-full px-6 pb-10 flex flex-col gap-2.5">
        <PrimaryButton label="Continue to Explore" onClick={() => dispatch({ type: "GO", to: "explore" })} />
        <SecondaryButton label="Practice Again" onClick={() => dispatch({ type: "START_LESSON", wordId: selectedWordId })} />
      </footer>
      <HomeIndicator />
    </div>
  );
});
