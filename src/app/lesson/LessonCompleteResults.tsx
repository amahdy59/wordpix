import { memo } from "react";
import type { Action, AnswerAttempt } from "../types";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { Trophy, Star } from "lucide-react";

interface Props {
  attempts: AnswerAttempt[];
  selectedWordId: string;
  dispatch: React.Dispatch<Action>;
}

export const LessonCompleteResults = memo(function LessonCompleteResults({ attempts, selectedWordId, dispatch }: Props) {
  const correct = attempts.filter((a) => a.correct).length;
  const accuracy = attempts.length === 0 ? 100 : Math.round((correct / attempts.length) * 100);
  const stars = [accuracy >= 50, accuracy >= 75, accuracy >= 90];
  const xp = correct * 10;

  return (
    <div className="bg-secondary min-h-svh flex flex-col lg:flex-row lg:overflow-hidden relative">

      {/* ── Desktop Left: Celebration visual ────────────────────────────────── */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:w-1/2 bg-slate-900 relative overflow-hidden px-12">
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-wp-amber/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="size-32 rounded-3xl bg-wp-amber/20 border border-wp-amber/30 flex items-center justify-center shadow-2xl">
            <Trophy className="size-16 text-wp-amber" aria-hidden />
          </div>
          <div>
            <h1 className="font-sans font-black text-white text-4xl xl:text-5xl leading-tight tracking-tight">
              Great Work!
            </h1>
            <p className="font-sans font-semibold text-white/60 text-lg mt-2">
              Word lesson complete.
            </p>
          </div>
          {/* Stars */}
          <div className="flex gap-3 items-center" aria-label={`${stars.filter(Boolean).length} out of 3 stars`}>
            {stars.map((filled, i) => (
              <Star
                key={i}
                className={`size-10 ${filled ? "text-wp-amber fill-wp-amber" : "text-white/20"}`}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right / Mobile: Stats + CTAs ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between min-h-svh lg:min-h-0">
        <main className="flex-1 flex flex-col items-center justify-center w-full px-6 gap-6 py-10">

          {/* Mobile trophy (hidden on desktop) */}
          <div className="lg:hidden flex flex-col items-center gap-4">
            <div className="size-24 rounded-3xl bg-wp-amber/20 border border-wp-amber/30 flex items-center justify-center">
              <Trophy className="size-12 text-wp-amber" aria-hidden />
            </div>
            <h1 className="font-sans font-black text-primary text-3xl text-center">Great Work!</h1>
            <p className="font-sans font-semibold text-foreground text-base text-center">
              You completed this word lesson.
            </p>
            {/* Stars mobile */}
            <div className="flex gap-2 items-center" aria-label={`${stars.filter(Boolean).length} out of 3 stars`}>
              {stars.map((filled, i) => (
                <Star key={i} className={`size-9 ${filled ? "text-wp-amber fill-wp-amber" : "text-muted-foreground"}`} aria-hidden />
              ))}
            </div>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block text-center">
            <h2 className="font-sans font-bold text-foreground text-2xl">Your Performance</h2>
            <p className="font-sans text-muted-foreground text-sm mt-1">Here's how you did on this session.</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {[
              { value: "1", label: "Word Practised", color: "text-primary", bg: "bg-secondary" },
              { value: `${accuracy}%`, label: "Accuracy", color: "text-wp-blue", bg: "bg-wp-blue/10" },
              { value: `+${xp}`, label: "XP Earned", color: "text-wp-green", bg: "bg-wp-green-light" },
            ].map(({ value, label, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl border border-border p-4 flex flex-col items-center gap-1`}>
                <p className={`font-sans font-black text-2xl ${color}`}>{value}</p>
                <p className="font-sans font-medium text-muted-foreground text-[11px] text-center leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </main>

        <footer className="w-full px-6 pb-10 flex flex-col gap-2.5 shrink-0 border-t border-border/60 pt-4 bg-secondary/50">
          <PrimaryButton label="Continue to Explore" onClick={() => dispatch({ type: "GO", to: "explore" })} />
          <SecondaryButton label="Practice Again" onClick={() => dispatch({ type: "START_LESSON", wordId: selectedWordId })} />
        </footer>
        <HomeIndicator />
      </div>
    </div>
  );
});
