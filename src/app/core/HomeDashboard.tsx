import { memo } from "react";
import { Flame, Trophy, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import type { Action } from "../types";

const imgMascot = "https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgWorldPreview = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const STATS = [
  { icon: Flame, value: "7", label: "Day Streak", color: "text-wp-amber" },
  { icon: Sparkles, value: "240", label: "XP Points", color: "text-primary" },
  { icon: BookOpen, value: "45", label: "Words Mastered", color: "text-wp-green" },
];

export const HomeDashboard = memo(function HomeDashboard({ dispatch }: Props) {
  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-8">
      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-4">
        <div className="relative size-12 md:size-14 shrink-0 rounded-full overflow-hidden border-2 border-primary/20 shadow-wp-xs">
          <img
            alt="WordPix learner profile"
            className="absolute inset-0 object-cover size-full"
            src={imgMascot}
          />
        </div>
        <div>
          <h1 className="font-sans font-black text-foreground text-xl md:text-2xl leading-tight">
            Good morning, Learner!
          </h1>
          <p className="font-sans font-medium text-muted-foreground text-sm mt-0.5">
            Ready to explore your daily picture lessons?
          </p>
        </div>
      </header>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="Learning progress statistics"
        className="grid grid-cols-3 gap-3"
      >
        {STATS.map(({ icon: Icon, value, label, color }) => (
          <div
            key={label}
            className="bg-wp-card rounded-2xl border border-border p-3.5 md:p-5 flex flex-col items-center gap-1.5 text-center shadow-wp-xs hover:border-primary/30 transition-all"
          >
            <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
              <Icon className={`size-5 ${color}`} />
            </div>
            <p className="font-sans font-black text-foreground text-2xl leading-none mt-1">{value}</p>
            <p className="font-sans font-medium text-muted-foreground text-xs leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Active World + Review Column ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-5 items-start">
        {/* Active World Hero Card */}
        <section aria-labelledby="active-world-heading">
          <div className="bg-wp-card rounded-2xl border border-border overflow-hidden shadow-wp-xs">
            <div className="h-48 md:h-56 relative w-full">
              <img
                alt="The Bedroom learning world"
                className="absolute inset-0 object-cover size-full"
                src={imgWorldPreview}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" aria-hidden />
              <div className="absolute top-3 right-3">
                <span className="bg-wp-amber font-sans font-bold text-foreground text-xs px-3 py-1 rounded-full shadow-wp-xs">
                  Level 1 · Beginner
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2
                  id="active-world-heading"
                  className="font-sans font-black text-white text-2xl leading-tight"
                >
                  The Bedroom World
                </h2>
                <p className="font-sans text-white/80 text-xs mt-1 font-medium">
                  Master 56 essential vocabulary words through interactive visual scenes
                </p>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="font-sans font-semibold text-muted-foreground text-sm">Course Progress</span>
                <span className="font-sans font-bold text-primary text-sm">40% Complete</span>
              </div>
              
              <div
                className="bg-muted rounded-full h-2.5 w-full overflow-hidden"
                role="progressbar"
                aria-valuenow={40}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Bedroom world progress: 40 percent"
              >
                <div
                  className="bg-primary h-full rounded-full motion-safe:transition-all motion-safe:duration-700"
                  style={{ width: "40%" }}
                />
              </div>

              <button
                type="button"
                onClick={() => dispatch({ type: "GO", to: "lesson-entry" })}
                className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3.5 w-full font-sans font-bold text-white text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue min-h-[48px] transition-all flex items-center justify-center gap-2 shadow-wp-xs"
              >
                <span>Continue Learning</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Daily Review & Streak Card */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "practice" })}
            className="bg-wp-card rounded-2xl border border-border p-4 w-full text-left flex items-center gap-3.5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[52px] shadow-wp-xs hover:border-primary/40 motion-safe:transition-all"
            aria-label="Open daily review session: 3 words ready"
          >
            <div className="bg-secondary rounded-xl size-12 flex items-center justify-center shrink-0">
              <BookOpen className="size-6 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="font-sans font-bold text-foreground text-base">Daily Review</p>
              <p className="font-sans font-medium text-muted-foreground text-xs">3 words ready for mastery</p>
            </div>
            <div className="bg-primary rounded-full size-7 flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-primary-foreground text-xs">3</span>
            </div>
          </button>

          <div className="bg-secondary rounded-2xl p-4 flex flex-col gap-2.5 border border-primary/20">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-wp-amber shrink-0" />
              <p className="font-sans font-bold text-foreground text-sm">7-Day Streak Active!</p>
            </div>
            <p className="font-sans font-medium text-muted-foreground text-xs leading-relaxed">
              Complete your daily review session to extend your streak and earn +15 bonus XP!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
