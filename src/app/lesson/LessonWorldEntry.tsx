import { memo } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { BackButton } from "../shared/BackButton";
import { Sparkles, RotateCcw, CheckCircle2, ArrowRight, BookOpen } from "lucide-react";

const imgBedroom = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const PROGRESS_ITEMS = [
  {
    id: "new",
    label: "New Words",
    count: 4,
    desc: "4 remaining to learn",
    icon: Sparkles,
    iconBg: "bg-violet-500/10 text-primary border-violet-500/20",
  },
  {
    id: "practice",
    label: "Practice",
    count: 4,
    desc: "4 words due for review",
    icon: RotateCcw,
    iconBg: "bg-amber-500/10 text-wp-amber border-amber-500/20",
  },
  {
    id: "mastered",
    label: "Mastered",
    count: 4,
    desc: "4 words mastered so far",
    icon: CheckCircle2,
    iconBg: "bg-teal-500/10 text-wp-teal border-teal-500/20",
  },
];

export const LessonWorldEntry = memo(function LessonWorldEntry({ dispatch }: Props) {
  return (
    <div className="bg-background flex flex-col min-h-svh lg:flex-row lg:overflow-hidden relative">
      <StatusBar />

      {/* ── Desktop Left: Hero Image ─────────────────────────────────────────── */}
      <div className="hidden lg:block lg:w-[45%] xl:w-1/2 shrink-0 relative overflow-hidden">
        <img
          alt="The Bedroom visual scene"
          className="absolute inset-0 object-cover size-full"
          src={imgBedroom}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />

        {/* Overlay badge */}
        <div className="absolute bottom-8 left-8">
          <span className="font-sans font-bold text-xs text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            Bedroom Furniture &amp; Accessories
          </span>
        </div>
      </div>

      {/* ── Right / Mobile: Lesson info + CTA ───────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between min-h-svh lg:min-h-0">
        {/* Header Bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-wp-card shrink-0">
          <div className="flex items-center gap-3">
            <BackButton onClick={() => dispatch({ type: "GO", to: "explore" })} />
            <div>
              <h1 className="font-sans font-black text-foreground text-lg leading-none">
                The Bedroom
              </h1>
              <p className="font-sans text-muted-foreground text-xs mt-0.5">Visual Scene Discovery</p>
            </div>
          </div>
          <span className="font-sans font-semibold text-xs bg-secondary text-primary px-3 py-1 rounded-full border border-primary/20">
            Level 1 · A1
          </span>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-4 p-5 lg:p-8 overflow-y-auto">
          {/* Mobile-only hero image */}
          <div className="lg:hidden h-44 sm:h-56 relative rounded-2xl w-full overflow-hidden border border-border shadow-sm shrink-0">
            <img
              alt="The Bedroom visual scene"
              className="absolute inset-0 object-cover size-full"
              src={imgBedroom}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
              <span className="font-sans font-bold text-sm">Bedroom Furniture &amp; Accessories</span>
              <span className="font-sans text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold">56 Words</span>
            </div>
          </div>

          {/* Desktop lesson summary heading */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-3 mb-1">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <BookOpen className="size-5" />
              </div>
              <div>
                <h2 className="font-sans font-black text-foreground text-2xl leading-none">Lesson Overview</h2>
                <p className="font-sans text-muted-foreground text-sm mt-0.5">56 vocabulary items across 6 interactive exercises</p>
              </div>
            </div>
          </div>

          {/* Progress breakdown cards */}
          <section aria-label="Lesson progress" className="flex flex-col gap-2.5 w-full">
            {PROGRESS_ITEMS.map(({ id, label, count, desc, icon: Icon, iconBg }) => (
              <div
                key={id}
                className="bg-wp-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-sm hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 border ${iconBg}`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-sans font-bold text-foreground text-base leading-tight">{label}</p>
                    <p className="font-sans text-muted-foreground text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
                <div className="size-9 rounded-full bg-secondary flex items-center justify-center font-sans font-black text-primary text-sm border border-primary/20">
                  {count}
                </div>
              </div>
            ))}
          </section>
        </main>

        {/* Pinned CTA — always visible, never scrolls off */}
        <footer className="w-full px-5 lg:px-8 pb-8 pt-4 shrink-0 bg-background border-t border-border/60">
          <button
            type="button"
            onClick={() => dispatch({ type: "START_LESSON" })}
            className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 font-sans font-bold text-white text-base min-h-[52px]
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
              shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Start Lesson</span>
            <ArrowRight className="size-5" />
          </button>
        </footer>
        <HomeIndicator />
      </div>
    </div>
  );
});
