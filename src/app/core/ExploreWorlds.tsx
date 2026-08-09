import { memo } from "react";
import { Lock, Compass, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { COURSE_UNITS } from "../data/lessons";
import { Badge, ProgressBar } from "../shared";

const imgBathroom = "/images/core/bathroom-scene.webp";
const imgKitchen  = "/images/core/kitchen-scene.webp";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ExploreWorlds = memo(function ExploreWorlds({ dispatch }: Props) {
  const { progress } = useProgress();

  // Only "bedroom" is real today, but rendering from the registry rather than
  // a hardcoded card means a second registered world shows up here for free.
  const activeWorlds = Object.values(COURSE_UNITS);

  return (
    <div className="flex flex-col gap-6 p-5 lg:p-8">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <Compass className="size-5" />
          <span className="font-sans font-bold text-xs uppercase tracking-wider">Learning Path</span>
        </div>
        <h1 className="font-sans font-black text-foreground text-2xl lg:text-3xl leading-tight">
          Level 1 Course: Foundations
        </h1>
        <p className="font-sans font-medium text-muted-foreground text-sm">
          Master every unit and lesson in our flagship course before advancing.
        </p>
      </header>

      {/* The skill-exercise hub banner used to sit here, above the world it was
          meant to support, duplicating the identical card on Home. Explore is
          for worlds; the hub is reached from Practice. */}

      {/* Active World Card(s) — one per registered world; only "bedroom" is
          real today, so this renders exactly as it used to, but a second
          registered world would get a real card here instead of a code
          change. */}
      {activeWorlds.map((world) => {
        const wordsPracticedCount = world.vocabulary.filter((w) => (progress.wordMastery[w.id] || 0) >= 3).length;
        const totalWords = world.vocabulary.length;
        const progressPercent = Math.round((wordsPracticedCount / totalWords) * 100);

        return (
          <section aria-label={`Active Unit: ${world.name}`} key={world.id}>
            <div className="bg-wp-card rounded-3xl border-2 border-primary/40 p-6 flex flex-col lg:flex-row gap-6 shadow-wp-md relative overflow-hidden">
              <div className="absolute -top-12 -right-12 size-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

              {/* World Image Banner */}
              <div className="h-48 lg:h-64 lg:w-80 relative rounded-2xl overflow-hidden shrink-0 border border-border shadow-wp-xs">
                <img
                  alt={`${world.name} visual learning scene`}
                  className="absolute inset-0 object-cover size-full"
                  src={world.heroImage}
                />
                <Badge variant="primary" size="md" className="absolute top-3 start-3 shadow-wp-xs">
                  <Sparkles className="size-3.5" />
                  <span>Ready &amp; Fully Unlocked</span>
                </Badge>
              </div>

              {/* World Info & Details */}
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="amber" size="sm">
                      Level 1 · A1 Beginner
                    </Badge>
                    <span className="font-sans text-xs text-muted-foreground font-semibold">{totalWords} Vocabulary Words</span>
                  </div>

                  <h2 className="font-sans font-black text-foreground text-2xl lg:text-3xl leading-tight">
                    {world.name}
                  </h2>
                  <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                    {world.description}
                  </p>
                </div>

                {/* Progress bar */}
                <ProgressBar
                  progressPercent={progressPercent}
                  label="Unit Completed"
                  labelRight={`${progressPercent}% (${wordsPracticedCount}/${totalWords})`}
                  ariaLabel={`${world.name} progress: ${progressPercent}%`}
                />

                {/* Start CTA */}
                <button
                  type="button"
                  onClick={() => dispatch({ type: "GO", to: "lesson-entry", unitId: world.id })}
                  className="w-full sm:w-auto bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3.5 px-6 font-sans font-bold text-wp-text-on-blue text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-wp-xs transition-all flex items-center justify-center gap-2 self-start mt-2 min-h-[48px]"
                >
                  <BookOpen className="size-4" />
                  <span>Enter Unit: {world.name}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </section>
        );
      })}

      {/* Upcoming Expansion Preview Section */}
      <section aria-label="Upcoming Worlds" className="flex flex-col gap-3 mt-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="size-4" />
          <h3 className="font-sans font-bold text-foreground text-base">Upcoming Expansion Units</h3>
        </div>
        <p className="font-sans text-muted-foreground text-xs">
          These units will unlock automatically after you complete 100% of The Bedroom unit.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-75">
          {/* Bathroom preview */}
          <div className="bg-wp-card rounded-2xl border border-border p-4 flex items-center gap-4">
            <div className="size-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted relative">
              <img alt="Bathroom unit" className="absolute inset-0 object-cover size-full" src={imgBathroom} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                <Lock className="size-5" />
              </div>
            </div>
            <div>
              <p className="font-sans font-bold text-foreground text-base">Bathroom</p>
              <p className="font-sans text-muted-foreground text-xs mt-0.5">30 Vocabulary Items</p>
              <Badge variant="muted" size="sm" className="inline-flex mt-1">
                Unlocks at 100% Bedroom Mastery
              </Badge>
            </div>
          </div>

          {/* Kitchen preview */}
          <div className="bg-wp-card rounded-2xl border border-border p-4 flex items-center gap-4">
            <div className="size-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted relative">
              <img alt="Kitchen unit" className="absolute inset-0 object-cover size-full" src={imgKitchen} />
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
