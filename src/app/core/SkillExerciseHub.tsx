import { memo, useMemo, useState } from "react";
import type { Action, SkillCategory } from "../types";
import {
  EXERCISES,
  availableCategories,
  countAvailableExercises,
  isExerciseAvailableForLevel,
} from "./skillExerciseCatalog";
import { Sparkles, ArrowRight } from "lucide-react";
import { AppShell } from "../shared/AppShell";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { useLearner } from "../context/LearnerContext";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const SkillExerciseHub = memo(function SkillExerciseHub({ dispatch }: Props) {
  const { accessibility } = useAccessibility();
  const { state } = useLearner();
  const learnerLevel = state.preferences.englishLevel;
  const { includeSpeaking, includeListening, numeralSystem } = accessibility;

  /*
    The Settings toggles "Include Speaking Drills" and "Include Listening
    Drills" existed with copy explaining they are for quiet environments and
    hard-of-hearing learners — and did nothing at all. They now actually remove
    those categories.
  */
  const categories = useMemo(
    () => availableCategories(includeSpeaking, includeListening),
    [includeSpeaking, includeListening]
  );

  const [requestedCategory, setActiveCategory] = useState<SkillCategory>("listening");
  // If the learner disables the category they were viewing, fall back rather
  // than rendering an empty grid.
  const activeCategory = categories.some((c) => c.id === requestedCategory)
    ? requestedCategory
    : (categories[0]?.id ?? "reading");

  const availableExercises = EXERCISES.filter((exercise) =>
    isExerciseAvailableForLevel(exercise, learnerLevel)
  );
  const categoryExercises = availableExercises.filter((e) => e.category === activeCategory);
  const availableCount = countAvailableExercises(includeSpeaking, includeListening, learnerLevel);

  return (
    <AppShell activeTab="explore" dispatch={dispatch}>
      <div className="py-6 flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider">
            <Sparkles className="size-4 text-wp-amber" />
            <span>{formatNumber(availableCount, numeralSystem)} Multimodal Skill Exercises</span>
          </div>
          <h1 className="font-sans font-black text-foreground text-3xl md:text-4xl">
            Skill Exercise Hub
          </h1>
          <p className="font-sans text-muted-foreground text-sm max-w-xl">
            Select a learning category below to launch any of the{" "}
            {formatNumber(availableCount, numeralSystem)} available exercises.
          </p>
        </div>

        {/* Category Tabs */}
        <div
          role="group"
          aria-label="Exercise categories"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-wp-card border border-border p-2 rounded-2xl"
        >
          {categories.map(({ id, labelBase, icon: Icon }) => {
            const count = availableExercises.filter((e) => e.category === id).length;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={activeCategory === id}
                onClick={() => setActiveCategory(id)}
                className={`p-3 min-h-[44px] rounded-xl flex items-center justify-center gap-2 font-sans font-bold text-xs transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  activeCategory === id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="truncate">
                  {labelBase} ({formatNumber(count, numeralSystem)})
                </span>
              </button>
            );
          })}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoryExercises.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => dispatch({ type: "OPEN_SKILL_EXERCISE", exerciseId: ex.id })}
              className="bg-wp-card border border-border hover:border-primary rounded-2xl p-5 text-start flex flex-col justify-between gap-3 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all group shadow-wp-xs hover:shadow-md"
            >
              <div>
                <h2 className="font-sans font-bold text-foreground text-base group-hover:text-primary transition-colors">
                  {ex.title}
                </h2>
                <span className="inline-flex mt-1 rounded-full bg-secondary px-2 py-0.5 font-sans text-[10px] font-bold text-primary">
                  {ex.minimumLevel ?? "A1"}+
                </span>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed mt-1.5">
                  {ex.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-sans font-bold text-primary">
                <span>Start Exercise</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
});
