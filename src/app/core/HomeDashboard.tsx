import { memo, useMemo } from "react";
import { Flame, BookOpen, ArrowRight, RotateCcw, ShieldCheck, Brain, WifiOff, CheckCircle2 } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { calculateDaysBetween, getLocalDateString } from "../../features/gamification/streak";
import { isOfflineAvailable } from "../../pwa";
import { WordImage } from "../shared/WordImage";

const imgAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgBedroom  = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const WEEK_DAYS = [
  { day: "M", done: true },
  { day: "T", done: true },
  { day: "W", done: true },
  { day: "T", done: true },
  { day: "F", done: true },
  { day: "S", done: true },
  { day: "S", done: false },
];

export const HomeDashboard = memo(function HomeDashboard({ dispatch }: Props) {
  const { progress } = useProgress();

  const todayStr = getLocalDateString(new Date());

  const memoryValues = useMemo(() => Object.values(progress.wordMemory), [progress.wordMemory]);
  const strongCount = useMemo(() => memoryValues.filter((w) => w.mastery === "strong").length, [memoryValues]);
  const learningCount = useMemo(() => memoryValues.filter((w) => w.mastery === "learning" || w.mastery === "familiar").length, [memoryValues]);

  const dueCount = useMemo(() => {
    return memoryValues.filter((w) => {
      if (!w.nextReviewAt) return true;
      const nextDateStr = getLocalDateString(new Date(w.nextReviewAt));
      return calculateDaysBetween(todayStr, nextDateStr) <= 0;
    }).length;
  }, [memoryValues, todayStr]);

  const isOfflineReady = isOfflineAvailable("bedroom");

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-10 max-w-6xl mx-auto w-full">
      {/* Top Learner Greeting */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative size-12 md:size-14 shrink-0 rounded-full overflow-hidden border-2 border-primary/20 shadow-wp-xs">
            <img
              alt="WordPix learner profile"
              className="absolute inset-0 object-cover size-full"
              src={imgAvatar}
              loading="eager"
            />
          </div>
          <div>
            <h1 className="font-sans font-black text-foreground text-xl md:text-2xl leading-tight">
              Good morning, Learner!
            </h1>
            <p className="font-sans font-medium text-muted-foreground text-xs md:text-sm mt-0.5">
              Level {progress.englishLevel} · Goal: {progress.dailyGoalMinutes} min/day
            </p>
          </div>
        </div>

        {isOfflineReady && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-sans font-semibold text-wp-teal bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
            <WifiOff className="size-3.5" />
            <span>Bedroom available offline</span>
          </div>
        )}
      </header>

      {/* Main Grid: TODAY + REVIEW (Left) | YOUR LEARNING + THIS WEEK (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* ── LEFT COLUMN ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* SECTION 1: TODAY */}
          <section aria-labelledby="section-today" className="flex flex-col gap-3">
            <span id="section-today" className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground">
              TODAY
            </span>
            <div className="bg-wp-card rounded-3xl border border-primary/30 p-6 flex flex-col gap-4 shadow-wp-xs hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-sans font-semibold text-xs text-primary bg-secondary border border-primary/20 px-3 py-1 rounded-full">
                  Essential Furniture · ~4 min
                </span>
                <span className="font-sans text-xs font-bold text-muted-foreground">4 of 5 words</span>
              </div>

              <div>
                <h2 className="font-sans font-black text-foreground text-2xl md:text-3xl">
                  Continue Bedroom
                </h2>
                <p className="font-sans text-muted-foreground text-sm mt-1 leading-relaxed">
                  Master key furniture &amp; bedroom items through visual discovery and active recall.
                </p>
              </div>

              <button
                type="button"
                onClick={() => dispatch({ type: "START_LESSON" })}
                className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3.5 font-sans font-bold text-white text-base min-h-[48px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Continue Session</span>
                <ArrowRight className="size-5" />
              </button>
            </div>
          </section>

          {/* SECTION 2: REVIEW */}
          <section aria-labelledby="section-review" className="flex flex-col gap-3">
            <span id="section-review" className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground">
              REVIEW
            </span>
            <div className="bg-wp-card rounded-3xl border border-border p-6 flex flex-col gap-4 shadow-wp-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-sans font-bold text-sm">
                  <RotateCcw className="size-4 text-primary" />
                  <span>Spaced Repetition</span>
                </div>
                <span className="font-sans font-bold text-xs text-wp-amber bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {dueCount} words ready · ~3 min
                </span>
              </div>
              <p className="font-sans text-muted-foreground text-xs leading-relaxed">
                Review words scheduled for memory retention before decay occurs.
              </p>
              <button
                type="button"
                onClick={() => dispatch({ type: "GO", to: "practice" })}
                className="w-full bg-secondary hover:bg-primary/10 text-primary border border-primary/20 rounded-xl py-3 font-sans font-bold text-sm min-h-[44px] transition-all flex items-center justify-center gap-2"
              >
                <span>Start Review</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* SECTION 3: YOUR LEARNING */}
          <section aria-labelledby="section-learning" className="flex flex-col gap-3">
            <span id="section-learning" className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground">
              YOUR LEARNING
            </span>
            <div className="bg-wp-card rounded-3xl border border-border p-6 flex flex-col gap-4 shadow-wp-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-wp-green-light/40 border border-wp-green/20 rounded-2xl p-3.5 flex flex-col items-center">
                  <span className="font-sans font-black text-wp-green text-2xl">{strongCount}</span>
                  <span className="font-sans font-semibold text-muted-foreground text-xs mt-1">Strong</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex flex-col items-center">
                  <span className="font-sans font-black text-amber-600 dark:text-wp-amber text-2xl">{learningCount}</span>
                  <span className="font-sans font-semibold text-muted-foreground text-xs mt-1">Learning</span>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3.5 flex flex-col items-center">
                  <span className="font-sans font-black text-rose-600 dark:text-rose-400 text-2xl">{dueCount}</span>
                  <span className="font-sans font-semibold text-muted-foreground text-xs mt-1">Due</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: THIS WEEK */}
          <section aria-labelledby="section-this-week" className="flex flex-col gap-3">
            <span id="section-this-week" className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground">
              THIS WEEK
            </span>
            <div className="bg-wp-card rounded-3xl border border-border p-6 flex flex-col gap-4 shadow-wp-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-sans font-bold text-sm text-foreground">
                  <Flame className="size-4 text-wp-amber" />
                  <span>Streak Activity</span>
                </div>
                <span className="font-sans font-bold text-xs text-wp-amber">{progress.streak} Day Streak</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {WEEK_DAYS.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="font-sans text-[11px] text-muted-foreground font-medium">{d.day}</span>
                    <div className={`size-8 rounded-xl flex items-center justify-center font-sans text-xs font-bold ${d.done ? "bg-wp-amber text-white shadow-sm" : "bg-muted text-muted-foreground"}`}>
                      {d.done ? "✓" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});
