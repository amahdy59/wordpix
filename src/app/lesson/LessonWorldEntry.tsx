import { memo } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { BackButton } from "../shared/BackButton";
import { Sparkles, RotateCcw, CheckCircle2, ArrowRight } from "lucide-react";

const imgBedroom = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80";

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
    desc: "4 words mastered",
    icon: CheckCircle2,
    iconBg: "bg-teal-500/10 text-wp-teal border-teal-500/20",
  },
];

export const LessonWorldEntry = memo(function LessonWorldEntry({ dispatch }: Props) {
  return (
    <div className="bg-background content-stretch flex flex-col justify-between min-h-svh max-h-svh overflow-hidden relative">
      <StatusBar />

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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-4 p-4 md:p-6 overflow-y-auto w-full max-w-2xl mx-auto">
        {/* Hero Image */}
        <div className="h-40 sm:h-48 relative rounded-2xl w-full overflow-hidden border border-border shadow-wp-xs shrink-0">
          <img
            alt="The Bedroom visual scene"
            className="absolute inset-0 object-cover size-full"
            src={imgBedroom}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" aria-hidden />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="font-sans font-bold text-sm">Bedroom Furniture &amp; Accessories</span>
            <span className="font-sans text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold">
              56 Words
            </span>
          </div>
        </div>

        {/* Progress Breakdown Cards */}
        <section aria-label="Lesson progress" className="flex flex-col gap-2.5 w-full">
          {PROGRESS_ITEMS.map(({ id, label, count, desc, icon: Icon, iconBg }) => (
            <div
              key={id}
              className="bg-wp-card rounded-2xl border border-border p-3.5 flex items-center justify-between shadow-wp-xs hover:border-primary/30 transition-all"
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

              <div className="size-8 rounded-full bg-secondary flex items-center justify-center font-sans font-black text-primary text-sm border border-primary/20">
                {count}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Pinned Viewport Footer CTA — Always visible without scrolling */}
      <footer className="w-full max-w-2xl mx-auto px-5 pb-6 pt-2 shrink-0 bg-background border-t border-border/60">
        <button
          type="button"
          onClick={() => dispatch({ type: "START_LESSON" })}
          className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 font-sans font-bold text-white text-base min-h-[52px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            shadow-wp-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Start Lesson</span>
          <ArrowRight className="size-5" />
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
});
