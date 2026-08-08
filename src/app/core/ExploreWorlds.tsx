import { memo } from "react";
import { Lock, Compass, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { BEDROOM_VOCABULARY } from "../data/lessons";

const imgBedroom  = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=85";
const imgBathroom = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=85";
const imgKitchen  = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=85";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ExploreWorlds = memo(function ExploreWorlds({ dispatch }: Props) {
  const { progress } = useProgress();

  const wordsPracticedCount = Object.keys(progress.wordMastery).length;
  const totalBedroomWords = BEDROOM_VOCABULARY.length;
  const progressPercent = Math.round((wordsPracticedCount / totalBedroomWords) * 100);

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <Compass className="size-5" />
          <span className="font-sans font-bold text-xs uppercase tracking-wider">Lessons &amp; Course Worlds</span>
        </div>
        <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight">
          Level 1 Vocabulary Worlds
        </h1>
        <p className="font-sans font-medium text-muted-foreground text-sm">
          Master every word and exercise in our flagship world before advancing.
        </p>
      </header>

      {/* The skill-exercise hub banner used to sit here, above the world it was
          meant to support, duplicating the identical card on Home. Explore is
          for worlds; the hub is reached from Practice. */}

      {/* Primary Active Flagship World Card */}
      <section aria-label="Active World">
        <div className="bg-wp-card rounded-3xl border-2 border-primary/40 p-6 flex flex-col md:flex-row gap-6 shadow-wp-md relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          {/* World Image Banner */}
          <div className="h-48 md:h-64 md:w-80 relative rounded-2xl overflow-hidden shrink-0 border border-border shadow-wp-xs">
            <img
              alt="The Bedroom visual learning scene"
              className="absolute inset-0 object-cover size-full"
              src={imgBedroom}
            />
            <div className="absolute top-3 start-3 bg-secondary text-primary font-sans font-bold text-xs px-3 py-1 rounded-full border border-primary/20 shadow-wp-xs flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              <span>Ready &amp; Fully Unlocked</span>
            </div>
          </div>

          {/* World Info & Details */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-sans font-bold text-xs text-wp-amber bg-wp-amber/10 px-2.5 py-0.5 rounded-full border border-wp-amber/20">
                  Level 1 · A1 Beginner
                </span>
                <span className="font-sans text-xs text-muted-foreground font-semibold">{totalBedroomWords} Vocabulary Words</span>
              </div>

              <h2 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight">
                The Bedroom
              </h2>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                Explore real-life bedroom furniture, bedding, and accessories through 2D scene discovery, audio practice, recall matching, and sentence building.
              </p>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-sans font-semibold">
                <span className="text-muted-foreground">World Mastery Progress</span>
                <span className="text-primary font-bold">{progressPercent}% Complete ({wordsPracticedCount}/{totalBedroomWords})</span>
              </div>
              <div
                className="bg-muted rounded-full h-3 w-full overflow-hidden border border-border"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`The Bedroom progress: ${progressPercent}%`}
              >
                <div
                  className="bg-gradient-to-r from-primary to-wp-teal h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Start CTA */}
            <button
              type="button"
              onClick={() => dispatch({ type: "GO", to: "lesson-entry" })}
              className="w-full sm:w-auto bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3.5 px-6 font-sans font-bold text-wp-text-on-blue text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-wp-xs transition-all flex items-center justify-center gap-2 self-start mt-2 min-h-[48px]"
            >
              <BookOpen className="size-4" />
              <span>Enter The Bedroom Lesson</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Expansion Preview Section */}
      <section aria-label="Upcoming Worlds" className="flex flex-col gap-3 mt-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="size-4" />
          <h3 className="font-sans font-bold text-foreground text-base">Upcoming Expansion Worlds</h3>
        </div>
        <p className="font-sans text-muted-foreground text-xs">
          These worlds will unlock automatically after you complete 100% of The Bedroom lesson.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-75">
          {/* Bathroom preview */}
          <div className="bg-wp-card rounded-2xl border border-border p-4 flex items-center gap-4">
            <div className="size-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted relative">
              <img alt="Bathroom world" className="absolute inset-0 object-cover size-full" src={imgBathroom} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                <Lock className="size-5" />
              </div>
            </div>
            <div>
              <p className="font-sans font-bold text-foreground text-base">Bathroom</p>
              <p className="font-sans text-muted-foreground text-xs mt-0.5">30 Vocabulary Items</p>
              <span className="font-sans text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full inline-block mt-1">
                Unlocks at 100% Bedroom Mastery
              </span>
            </div>
          </div>

          {/* Kitchen preview */}
          <div className="bg-wp-card rounded-2xl border border-border p-4 flex items-center gap-4">
            <div className="size-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted relative">
              <img alt="Kitchen world" className="absolute inset-0 object-cover size-full" src={imgKitchen} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                <Lock className="size-5" />
              </div>
            </div>
            <div>
              <p className="font-sans font-bold text-foreground text-base">Kitchen</p>
              <p className="font-sans text-muted-foreground text-xs mt-0.5">45 Vocabulary Items</p>
              <span className="font-sans text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full inline-block mt-1">
                Unlocks at 100% Bedroom Mastery
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});
