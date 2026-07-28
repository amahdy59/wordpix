import { memo } from "react";
import { Flame, Sparkles, BookOpen, Compass, Lock, CheckCircle2, ArrowRight, Calendar, Trophy } from "lucide-react";
import type { Action } from "../types";

const imgAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgBedroom  = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgBathroom = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgKitchen  = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgLiving   = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const DASHBOARD_WORLDS = [
  { id: "bedroom",  name: "The Bedroom",  img: imgBedroom,  status: "active",   progress: 40, wordCount: 56 },
  { id: "bathroom", name: "Bathroom",     img: imgBathroom, status: "locked",   progress: 0,  wordCount: 30 },
  { id: "kitchen",  name: "Kitchen",      img: imgKitchen,  status: "locked",   progress: 0,  wordCount: 45 },
  { id: "living",   name: "Living Room",  img: imgLiving,   status: "locked",   progress: 0,  wordCount: 40 },
];

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
              Ready to expand your English visual vocabulary today?
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "profile" })}
          className="hidden sm:flex items-center gap-2 bg-secondary text-primary font-sans font-bold text-xs px-3.5 py-2 rounded-xl border border-primary/20 hover:opacity-90 transition-all shadow-wp-xs"
        >
          <span>Level 3 Learner</span>
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
                <p className="font-sans font-black text-foreground text-2xl leading-none">7</p>
                <span className="font-sans font-bold text-[10px] bg-wp-amber/15 text-amber-600 dark:text-wp-amber px-2 py-0.5 rounded-full border border-amber-500/20">
                  +1 Today
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
              <p className="font-sans font-black text-foreground text-2xl leading-none">240</p>
              <p className="font-sans font-medium text-muted-foreground text-xs mt-1">XP Points</p>
            </div>
          </div>
          <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary flex items-center justify-center text-[10px] font-sans font-bold text-primary">
            L3
          </div>
        </div>

        {/* Card 3: Words Mastered */}
        <div className="bg-wp-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-wp-xs hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-teal-500/10 text-wp-teal flex items-center justify-center shrink-0">
              <BookOpen className="size-6" />
            </div>
            <div>
              <p className="font-sans font-black text-foreground text-2xl leading-none">45</p>
              <p className="font-sans font-medium text-muted-foreground text-xs mt-1">Words Mastered</p>
            </div>
          </div>
          <span className="font-sans font-bold text-[10px] text-wp-teal bg-teal-500/10 px-2 py-1 rounded-full">
            40% of L1
          </span>
        </div>
      </div>

      {/* ── Main Layout Grid: Hero + Worlds & Right Rail ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Hero Lesson Card + Worlds Grid */}
        <div className="flex flex-col gap-6">
          {/* Hero Active Lesson Card (Depth via radial gradient, no raw photo overlays) */}
          <section aria-labelledby="hero-lesson-heading">
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-7 text-white shadow-wp-md overflow-hidden">
              {/* Radial color washes for visual depth */}
              <div className="absolute -top-16 -right-16 size-64 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-wp-teal/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="bg-wp-amber/20 text-wp-amber font-sans font-bold text-xs px-3 py-1 rounded-full border border-wp-amber/30">
                    Level 1 · The Bedroom
                  </span>
                  <span className="font-sans text-white/70 text-xs font-semibold">56 Vocabulary Words</span>
                </div>

                <div>
                  <h2
                    id="hero-lesson-heading"
                    className="font-sans font-black text-white text-2xl md:text-3xl leading-tight tracking-tight"
                  >
                    Master Bedroom Vocabulary
                  </h2>
                  <p className="font-sans text-slate-300 text-sm mt-1 max-w-lg leading-relaxed">
                    Explore real-life bedroom furniture, bedding, and accessories through interactive 2D scene discovery.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex justify-between items-center text-xs font-sans font-semibold">
                    <span className="text-slate-300">World Mastery Progress</span>
                    <span className="text-primary font-bold">40% Complete</span>
                  </div>
                  <div
                    className="bg-slate-800 rounded-full h-3 w-full overflow-hidden border border-slate-700"
                    role="progressbar"
                    aria-valuenow={40}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Bedroom world progress: 40 percent"
                  >
                    <div
                      className="bg-gradient-to-r from-primary to-wp-teal h-full rounded-full motion-safe:transition-all motion-safe:duration-700"
                      style={{ width: "40%" }}
                    />
                  </div>
                </div>

                {/* Embedded CTA Button */}
                <button
                  type="button"
                  onClick={() => dispatch({ type: "GO", to: "lesson-entry" })}
                  className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3.5 px-6 font-sans font-bold text-white text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue min-h-[48px] transition-all flex items-center justify-center gap-2 self-start mt-2 shadow-wp-xs"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Vocabulary Worlds Grid */}
          <section aria-labelledby="worlds-grid-heading" className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="size-5 text-primary" />
                <h3 id="worlds-grid-heading" className="font-sans font-bold text-foreground text-lg">
                  Vocabulary Worlds
                </h3>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: "GO", to: "explore" })}
                className="font-sans font-bold text-xs text-primary hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {DASHBOARD_WORLDS.map((world) => {
                const isLocked = world.status === "locked";
                return (
                  <button
                    key={world.id}
                    type="button"
                    onClick={() => !isLocked && dispatch({ type: "GO", to: "lesson-entry" })}
                    disabled={isLocked}
                    aria-disabled={isLocked}
                    aria-label={`${world.name}: ${isLocked ? "Locked" : `${world.progress}% complete`}`}
                    className={`bg-wp-card rounded-2xl border border-border p-3.5 text-left flex items-center gap-3 transition-all ${
                      isLocked
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:border-primary/40 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary shadow-wp-xs"
                    }`}
                  >
                    <div className="size-12 rounded-xl overflow-hidden shrink-0 border border-border bg-muted relative">
                      <img
                        alt={world.name}
                        className="absolute inset-0 object-cover size-full"
                        src={world.img}
                      />
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white" aria-hidden>
                          <Lock className="size-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-foreground text-sm truncate">{world.name}</p>
                      <p className="font-sans text-muted-foreground text-xs mt-0.5">{world.wordCount} words</p>
                      {world.status === "active" && (
                        <div className="bg-secondary text-primary font-sans font-bold text-[10px] px-2 py-0.5 rounded-full inline-flex mt-1">
                          {world.progress}% Done
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Rail: 3 Purposeful Panels */}
        <div className="flex flex-col gap-4">
          {/* Panel 1: Daily Review with Word Chips */}
          <div className="bg-wp-card rounded-2xl border border-border p-5 flex flex-col gap-3 shadow-wp-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-wp-blue" />
                <h3 className="font-sans font-bold text-foreground text-base">Daily Review</h3>
              </div>
              <span className="font-sans font-bold text-xs bg-wp-blue/10 text-wp-blue px-2.5 py-0.5 rounded-full">
                3 Words Due
              </span>
            </div>

            <p className="font-sans text-muted-foreground text-xs">
              Reinforce memory strength using spaced repetition:
            </p>

            {/* Word Chips */}
            <div className="flex flex-wrap gap-1.5">
              {["Pillow", "Lamp", "Blanket"].map((w) => (
                <span
                  key={w}
                  className="font-sans font-semibold text-xs text-foreground bg-secondary px-2.5 py-1 rounded-lg border border-primary/20"
                >
                  {w}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => dispatch({ type: "GO", to: "practice" })}
              className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3 font-sans font-bold text-white text-xs min-h-[44px]
                focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-wp-blue transition-all mt-1 flex items-center justify-center gap-1.5 shadow-wp-xs"
            >
              <span>Review Now (+15 XP)</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* Panel 2: Streak Tip & Momentum Card */}
          <div className="bg-secondary rounded-2xl border border-primary/20 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-wp-amber font-sans font-bold text-sm">
              <Trophy className="size-4 shrink-0" />
              <span>7-Day Streak Active!</span>
            </div>
            <p className="font-sans text-muted-foreground text-xs leading-relaxed">
              You are 1 session away from unlocking the <strong className="text-foreground">Weekly Mastery Badge</strong>.
            </p>
          </div>

          {/* Panel 3: Weekly Goal Tracker (7-Day Dots) */}
          <div className="bg-wp-card rounded-2xl border border-border p-4 flex flex-col gap-3 shadow-wp-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span className="font-sans font-bold text-foreground text-xs">Weekly Activity</span>
              </div>
              <span className="font-sans font-semibold text-xs text-wp-green">6/7 Days</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {WEEK_DAYS.map(({ day, done }, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="font-sans text-[10px] font-medium text-muted-foreground">{day}</span>
                  <div
                    className={`size-7 rounded-xl flex items-center justify-center text-[10px] font-sans font-bold ${
                      done
                        ? "bg-wp-green text-white shadow-wp-xs"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {done ? <CheckCircle2 className="size-3.5" /> : "○"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
