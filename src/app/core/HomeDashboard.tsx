import { memo } from "react";
import { Flame, Sparkles, BookOpen, Compass, Lock, ArrowRight, RotateCcw } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { BEDROOM_VOCABULARY } from "../data/lessons";

const imgAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgBedroom  = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgBathroom = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgKitchen  = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

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

  const wordsPracticedCount = Object.keys(progress.wordMastery).length;
  const totalBedroomWords = BEDROOM_VOCABULARY.length;
  const progressPercent = Math.round((wordsPracticedCount / totalBedroomWords) * 100);

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-10">
      {/* ── Top Learner Greeting ────────────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative size-12 md:size-14 shrink-0 rounded-full overflow-hidden border-2 border-primary/20 shadow-wp-xs">
            <img
              alt="WordPix learner profile"
              className="absolute inset-0 object-cover size-full"
              src={imgAvatar}
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

        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "profile" })}
          className="hidden sm:flex items-center gap-2 bg-secondary text-primary font-sans font-bold text-xs px-3.5 py-2 rounded-xl border border-primary/20 hover:opacity-90 transition-all shadow-wp-xs"
        >
          <span>Level {progress.englishLevel} Profile</span>
        </button>
      </header>

      {/* ── Stat Cards: Anchored with Semantic Icons ───────────────────────── */}
      <div
        role="group"
        aria-label="Learning progress statistics"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Card 1: Streak */}
        <div className="bg-wp-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-wp-xs hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-amber-500/10 text-wp-amber flex items-center justify-center shrink-0">
              <Flame className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-sans font-black text-foreground text-2xl leading-none">{progress.streak}</p>
                <span className="font-sans font-bold text-[10px] bg-wp-amber/15 text-amber-600 dark:text-wp-amber px-2 py-0.5 rounded-full border border-amber-500/20">
                  Active
                </span>
              </div>
              <p className="font-sans font-medium text-muted-foreground text-xs mt-1">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Card 2: XP Points */}
        <div className="bg-wp-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-wp-xs hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-violet-500/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="size-6" />
            </div>
            <div>
              <p className="font-sans font-black text-foreground text-2xl leading-none">{progress.xp}</p>
              <p className="font-sans font-medium text-muted-foreground text-xs mt-1">XP Points</p>
            </div>
          </div>
          <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary flex items-center justify-center text-[10px] font-sans font-bold text-primary">
            XP
          </div>
        </div>

        {/* Card 3: Words Mastered */}
        <div className="bg-wp-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-wp-xs hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-teal-500/10 text-wp-teal flex items-center justify-center shrink-0">
              <BookOpen className="size-6" />
            </div>
            <div>
              <p className="font-sans font-black text-foreground text-2xl leading-none">{wordsPracticedCount}</p>
              <p className="font-sans font-medium text-muted-foreground text-xs mt-1">Words Practiced</p>
            </div>
          </div>
          <span className="font-sans font-bold text-[10px] text-wp-teal bg-teal-500/10 px-2 py-1 rounded-full">
            {progressPercent}% of L1
          </span>
        </div>
      </div>

      {/* ── Main Layout Grid: Hero + Right Rail ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Hero Active Lesson Card */}
        <div className="flex flex-col gap-6">
          <section aria-labelledby="hero-lesson-heading">
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-7 text-white shadow-wp-md overflow-hidden">
              <div className="absolute -top-16 -right-16 size-64 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-wp-teal/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-xs bg-white/10 text-white/90 border border-white/15 px-3 py-1 rounded-full backdrop-blur-md">
                    Flagship World · Level 1
                  </span>
                  <span className="font-sans text-xs text-white/60 font-semibold">{totalBedroomWords} Vocabulary Items</span>
                </div>

                <div>
                  <h2 id="hero-lesson-heading" className="font-sans font-black text-2xl md:text-3xl tracking-tight text-white">
                    The Bedroom
                  </h2>
                  <p className="font-sans text-white/70 text-sm mt-1 max-w-xl leading-relaxed">
                    Master essential bedroom furniture and accessories through visual discovery, audio drills, and interactive quizzes.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 w-full max-w-md">
                  <div className="flex justify-between items-center text-xs font-sans font-semibold">
                    <span className="text-white/70">Mastery Progress</span>
                    <span className="text-wp-amber font-bold">{progressPercent}%</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-3 w-full overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-primary to-wp-teal h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "START_LESSON" })}
                    className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3.5 px-6 font-sans font-bold text-white text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-sm transition-all flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <span>Start 5-Word Practice Session</span>
                    <ArrowRight className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "GO", to: "explore" })}
                    className="bg-white/10 hover:bg-white/20 text-white font-sans font-bold text-sm px-4 py-3.5 rounded-xl border border-white/15 transition-all min-h-[48px]"
                  >
                    Explore Scene
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick World Previews */}
          <section aria-label="Course Worlds" className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-foreground text-lg">Course Worlds</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-wp-card border border-primary/40 rounded-2xl p-4 flex items-center gap-4">
                <div className="size-16 rounded-xl overflow-hidden shrink-0 border border-border relative">
                  <img alt="The Bedroom" className="absolute inset-0 object-cover size-full" src={imgBedroom} />
                </div>
                <div>
                  <p className="font-sans font-bold text-foreground text-base">The Bedroom</p>
                  <p className="font-sans text-muted-foreground text-xs">{wordsPracticedCount} / {totalBedroomWords} words learned</p>
                  <span className="font-sans text-[10px] font-semibold text-primary bg-secondary px-2 py-0.5 rounded-full inline-block mt-1">Active</span>
                </div>
              </div>

              <div className="bg-wp-card border border-border rounded-2xl p-4 flex items-center gap-4 opacity-60">
                <div className="size-16 rounded-xl overflow-hidden shrink-0 border border-border relative">
                  <img alt="Bathroom" className="absolute inset-0 object-cover size-full" src={imgBathroom} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                    <Lock className="size-4" />
                  </div>
                </div>
                <div>
                  <p className="font-sans font-bold text-foreground text-base">Bathroom</p>
                  <p className="font-sans text-muted-foreground text-xs">30 Words</p>
                  <span className="font-sans text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full inline-block mt-1">Locked</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Rail: Daily Streak Calendar & Quick Review */}
        <aside className="flex flex-col gap-6">
          {/* Week Activity Widget */}
          <div className="bg-wp-card rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-wp-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-sans font-bold text-sm">
                <Flame className="size-4 text-wp-amber" />
                <span>Weekly Activity</span>
              </div>
              <span className="font-sans font-semibold text-xs text-wp-amber">{progress.streak} Day Streak</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
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

          {/* Quick Review Prompt */}
          <div className="bg-wp-card rounded-2xl border border-border p-5 flex flex-col gap-3 shadow-wp-xs">
            <div className="flex items-center gap-2 text-primary font-sans font-bold text-sm">
              <RotateCcw className="size-4" />
              <span>Spaced Repetition Review</span>
            </div>
            <p className="font-sans text-muted-foreground text-xs leading-relaxed">
              Reinforce learned words before memory decay sets in.
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: "GO", to: "practice" })}
              className="w-full bg-secondary hover:bg-primary/10 text-primary border border-primary/20 rounded-xl py-3 font-sans font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Open Daily Review</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
});
