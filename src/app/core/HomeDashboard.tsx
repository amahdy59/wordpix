import { memo } from "react";
import type { Action } from "../types";

const imgMascot = "https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgWorldPreview = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const STATS = [
  { emoji: "🔥", value: "7",   label: "Day Streak",   ar: "أيام متتالية" },
  { emoji: "⭐", value: "240", label: "XP Points",    ar: "نقاط XP"      },
  { emoji: "📚", value: "45",  label: "Words",         ar: "كلمة"         },
];

export const HomeDashboard = memo(function HomeDashboard({ dispatch }: Props) {
  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-8">
      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-4">
        <div className="relative size-12 md:size-14 shrink-0 rounded-full overflow-hidden border-2 border-primary/20">
          <img
            alt="WordPix mascot"
            className="absolute inset-0 object-cover size-full"
            src={imgMascot}
          />
        </div>
        <div>
          <h1 className="font-sans font-black text-foreground text-xl md:text-2xl leading-tight">
            Good morning! 👋
          </h1>
          <p
            className="font-arabic font-medium text-primary text-sm leading-tight"
            dir="auto"
            lang="ar"
          >
            صباح الخير!
          </p>
        </div>
      </header>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="Learning progress statistics"
        className="grid grid-cols-3 gap-3"
      >
        {STATS.map(({ emoji, value, label, ar }) => (
          <div
            key={label}
            className="bg-wp-card rounded-2xl border border-border p-3 md:p-4 flex flex-col items-center gap-1 text-center shadow-wp-xs"
          >
            <span className="text-2xl leading-none" aria-hidden>{emoji}</span>
            <p className="font-sans font-black text-foreground text-2xl leading-none mt-1">{value}</p>
            <p className="font-sans font-medium text-muted-foreground text-xs leading-tight">{label}</p>
            <p className="font-arabic text-primary text-xs leading-none" dir="auto" lang="ar">{ar}</p>
          </div>
        ))}
      </div>

      {/* ── Active world + side widgets ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4 items-start">
        {/* Active world card */}
        <section aria-labelledby="active-world-heading">
          <div className="bg-wp-card rounded-2xl border border-border overflow-hidden shadow-wp-xs">
            <div className="h-44 md:h-52 relative w-full">
              <img
                alt="The Bedroom learning world — your active world"
                className="absolute inset-0 object-cover size-full"
                src={imgWorldPreview}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />
              <div className="absolute top-3 right-3">
                <span className="bg-wp-amber font-sans font-bold text-foreground text-xs px-2.5 py-1 rounded-full">
                  Level 1
                </span>
              </div>
              <div className="absolute bottom-3 left-4">
                <h2
                  id="active-world-heading"
                  className="font-sans font-black text-white text-xl leading-tight"
                >
                  The Bedroom
                </h2>
                <p
                  className="font-arabic font-bold text-white/80 text-sm"
                  dir="auto"
                  lang="ar"
                >
                  غرفة النوم
                </p>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-sans font-semibold text-muted-foreground text-sm">Progress</span>
                <span className="font-sans font-bold text-primary text-sm">40%</span>
              </div>
              <div
                className="bg-muted rounded-full h-2 w-full overflow-hidden"
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
                onClick={() => dispatch({ type: "GO", to: "lesson-entry" })}
                className="bg-wp-blue rounded-xl py-3 w-full font-sans font-bold text-white text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue min-h-[44px] motion-safe:transition-opacity active:opacity-90"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </section>

        {/* Right column: review CTA + gamification widget */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => dispatch({ type: "GO", to: "practice" })}
            className="bg-wp-card rounded-2xl border border-border p-4 w-full text-left flex items-center gap-3 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] shadow-wp-xs hover:shadow-wp-sm motion-safe:transition-shadow"
            aria-label="Open daily review: 3 words ready"
          >
            <div
              className="bg-secondary rounded-xl size-11 flex items-center justify-center shrink-0"
              aria-hidden
            >
              <span className="text-2xl">📚</span>
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <p className="font-sans font-semibold text-foreground text-sm md:text-base">Daily Review</p>
              <p className="font-sans font-medium text-muted-foreground text-xs">3 words ready</p>
            </div>
            <div
              className="bg-primary rounded-full size-6 flex items-center justify-center shrink-0"
              aria-hidden
            >
              <span className="font-sans font-bold text-primary-foreground text-xs">3</span>
            </div>
          </button>

          <div className="bg-secondary rounded-2xl p-4 flex flex-col gap-2 border border-primary/20">
            <p className="font-sans font-bold text-primary text-sm">🏆 Keep it up!</p>
            <p className="font-sans font-medium text-foreground text-xs leading-relaxed">
              You're on a 7-day streak. Review 3 words to stay on track!
            </p>
            <p
              className="font-arabic font-medium text-primary text-xs"
              dir="auto"
              lang="ar"
            >
              أنت في سلسلة 7 أيام. راجع 3 كلمات للاستمرار!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
