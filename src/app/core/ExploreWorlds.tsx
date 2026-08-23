import { memo } from "react";
import { Compass, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { COURSE_UNITS } from "../data/lessons";
import { Badge, ProgressBar } from "../shared";
import { staggerContainer, staggerItem } from "../shared/animations";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ExploreWorlds = memo(function ExploreWorlds({ dispatch }: Props) {
  const { progress } = useProgress();

  // Only "bedroom" is real today, but rendering from the registry rather than
  // a hardcoded card means a second registered world shows up here for free.
  const activeWorlds = Object.values(COURSE_UNITS);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 max-w-3xl mx-auto w-full p-5 lg:p-8"
    >
      {/* Page header */}
      <motion.header variants={staggerItem} className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <Compass className="size-5" />
          <span className="font-sans font-bold text-xs uppercase tracking-wider">
            Learning Path
          </span>
        </div>
        <h1 className="font-sans font-black text-foreground text-2xl lg:text-3xl leading-tight">
          Level 1 Course: Foundations
        </h1>
        <p className="font-sans font-medium text-muted-foreground text-sm">
          Build practical vocabulary one short learning group at a time.
        </p>
      </motion.header>

      {/* Active World Card(s) */}
      {activeWorlds.map((world) => {
        const wordsPracticedCount = world.vocabulary.filter(
          (w) => (progress.wordMastery[w.id] || 0) >= 3
        ).length;
        const totalWords = world.vocabulary.length;
        const progressPercent = Math.round((wordsPracticedCount / totalWords) * 100);

        return (
          <motion.section
            variants={staggerItem}
            aria-label={`Active Unit: ${world.name}`}
            key={world.id}
          >
            <div className="bg-wp-card rounded-3xl border-2 border-primary/40 p-6 flex flex-col lg:flex-row gap-6 shadow-wp-md relative overflow-hidden">
              <div className="absolute -top-12 -end-12 size-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

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
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {world.isRevision ? (
                        world.revisionKind === "milestone" ? (
                          <Badge variant="teal" size="sm">
                            🌟 Grand Milestone Review
                          </Badge>
                        ) : (
                          <Badge variant="green" size="sm">
                            ✨ Spaced Retention Checkpoint
                          </Badge>
                        )
                      ) : (
                        <Badge variant="amber" size="sm">
                          Level 1 · A1 Beginner
                        </Badge>
                      )}
                    </div>
                    <span className="font-sans text-xs text-muted-foreground font-semibold">
                      {totalWords} High-Yield Words
                    </span>
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
                  label="Unit progress"
                  labelRight={`${progressPercent}% (${wordsPracticedCount}/${totalWords})`}
                  ariaLabel={`${world.name} progress: ${progressPercent}%`}
                />

                {/* Start CTA */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => dispatch({ type: "GO", to: "lesson-entry", unitId: world.id })}
                  className="w-full sm:w-auto bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3.5 px-6 font-sans font-bold text-wp-text-on-blue text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-wp-xs transition-colors flex items-center justify-center gap-2 self-start mt-2 min-h-[48px]"
                >
                  <BookOpen className="size-4" />
                  <span>Enter Unit: {world.name}</span>
                  <ArrowRight className="size-4" />
                </motion.button>
              </div>
            </div>
          </motion.section>
        );
      })}
    </motion.div>
  );
});
