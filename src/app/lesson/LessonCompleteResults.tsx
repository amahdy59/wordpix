import { memo, useEffect } from "react";
import type { Action, AnswerAttempt } from "../types";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { Trophy, Star, CheckCircle2 } from "lucide-react";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { useProgress } from "../data/progress";

interface Props {
  attempts: AnswerAttempt[];
  wordQueue?: string[];
  dispatch: React.Dispatch<Action>;
}

export const LessonCompleteResults = memo(function LessonCompleteResults({
  attempts,
  wordQueue = ["pillow", "bed", "nightstand", "dresser", "blanket"],
  dispatch,
}: Props) {
  const { recordCompletedBatch } = useProgress();

  const correct = attempts.filter((a) => a.correct).length;
  const accuracy = attempts.length === 0 ? 100 : Math.round((correct / attempts.length) * 100);
  const stars = [accuracy >= 50, accuracy >= 75, accuracy >= 90];
  const xp = Math.max(25, correct * 10);

  useEffect(() => {
    recordCompletedBatch(wordQueue, xp);
  }, [wordQueue, xp, recordCompletedBatch]);

  const batchWords = wordQueue
    .map((id) => BEDROOM_VOCABULARY.find((v) => v.id === id))
    .filter(Boolean);

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
              Session Complete!
            </h1>
            <p className="font-sans font-semibold text-white/60 text-lg mt-2">
              You practiced {batchWords.length} words in this session.
            </p>
          </div>
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

      {/* ── Right / Mobile: Stats + Practiced Words ────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between min-h-svh lg:min-h-0">
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 gap-6 py-8 overflow-y-auto">
          {/* Mobile header */}
          <div className="lg:hidden flex flex-col items-center gap-3 text-center">
            <div className="size-20 rounded-3xl bg-wp-amber/20 border border-wp-amber/30 flex items-center justify-center">
              <Trophy className="size-10 text-wp-amber" aria-hidden />
            </div>
            <h1 className="font-sans font-black text-primary text-3xl">Session Complete!</h1>
            <p className="font-sans font-semibold text-foreground text-sm">
              Great job practicing {batchWords.length} vocabulary words.
            </p>
            <div className="flex gap-2 items-center" aria-label={`${stars.filter(Boolean).length} out of 3 stars`}>
              {stars.map((filled, i) => (
                <Star key={i} className={`size-8 ${filled ? "text-wp-amber fill-wp-amber" : "text-muted-foreground"}`} aria-hidden />
              ))}
            </div>
          </div>

          <div className="hidden lg:block text-center">
            <h2 className="font-sans font-bold text-foreground text-2xl">Session Performance</h2>
            <p className="font-sans text-muted-foreground text-sm mt-1">Here is your summary for this batch.</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { value: `${batchWords.length}`, label: "Words Practiced", color: "text-primary", bg: "bg-secondary" },
              { value: `${accuracy}%`, label: "Accuracy", color: "text-wp-blue", bg: "bg-wp-blue/10" },
              { value: `+${xp}`, label: "XP Earned", color: "text-wp-green", bg: "bg-wp-green-light" },
            ].map(({ value, label, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl border border-border p-3.5 flex flex-col items-center gap-1`}>
                <p className={`font-sans font-black text-2xl ${color}`}>{value}</p>
                <p className="font-sans font-medium text-muted-foreground text-[11px] text-center leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Batch Words List */}
          <div className="w-full flex flex-col gap-2">
            <h3 className="font-sans font-bold text-foreground text-sm">Words in this Session</h3>
            <div className="flex flex-col gap-1.5 w-full">
              {batchWords.map((w) => (
                <div key={w?.id} className="bg-wp-card border border-border rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-wp-green" />
                    <span className="font-sans font-bold text-foreground text-sm">{w?.label}</span>
                  </div>
                  <span className="font-sans text-xs text-muted-foreground">/{w?.phonetic}/</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="w-full max-w-md mx-auto px-6 pb-8 pt-4 flex flex-col gap-2.5 shrink-0 border-t border-border/60 bg-secondary/50">
          <PrimaryButton label="Continue to Lessons" onClick={() => dispatch({ type: "GO", to: "explore" })} />
          <SecondaryButton label="Start Another Session" onClick={() => dispatch({ type: "START_LESSON" })} />
        </footer>
        <HomeIndicator />
      </div>
    </div>
  );
});
