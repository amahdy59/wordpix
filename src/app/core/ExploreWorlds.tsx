import { memo, useState, useId, useMemo } from "react";
import {
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
  ChevronDown,
  CheckCircle2,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { COURSE_UNITS, COURSE_MODULES, type CourseUnit } from "../data/lessons";
import { Badge, ProgressBar } from "../shared";
import { staggerContainer, staggerItem } from "../shared/animations";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ExploreWorlds = memo(function ExploreWorlds({ dispatch }: Props) {
  const { progress } = useProgress();
  const [selectedModuleId, setSelectedModuleId] = useState<string>("all");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "module-1-home-nature": true,
    "module-2-school-town": true,
    "module-3-city-wellness": true,
    "module-4-travel-services": true,
  });

  const tabListId = useId();

  // Aggregate stats per module
  const moduleStats = useMemo(() => {
    const stats: Record<
      string,
      { totalWords: number; masteredWords: number; percent: number; unitCount: number }
    > = {};

    COURSE_MODULES.forEach((mod) => {
      let total = 0;
      let mastered = 0;
      let unitCount = 0;

      mod.unitIds.forEach((uid) => {
        const unit = COURSE_UNITS[uid];
        if (unit) {
          unitCount++;
          const unitWords = unit.vocabulary || [];
          total += unitWords.length;
          mastered += unitWords.filter((w) => (progress.wordMastery[w.id] || 0) >= 3).length;
        }
      });

      const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
      stats[mod.id] = { totalWords: total, masteredWords: mastered, percent: pct, unitCount };
    });

    return stats;
  }, [progress.wordMastery]);

  // Overall course progress
  const overallStats = useMemo(() => {
    let total = 0;
    let mastered = 0;
    Object.values(moduleStats).forEach((s) => {
      total += s.totalWords;
      mastered += s.masteredWords;
    });
    return {
      totalWords: total,
      masteredWords: mastered,
      percent: total > 0 ? Math.round((mastered / total) * 100) : 0,
    };
  }, [moduleStats]);

  const toggleModuleExpand = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const filteredModules = useMemo(() => {
    if (selectedModuleId === "all") return COURSE_MODULES;
    return COURSE_MODULES.filter((m) => m.id === selectedModuleId);
  }, [selectedModuleId]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8"
    >
      {/* Page Header with Course Level Summary */}
      <motion.header variants={staggerItem} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-wp-card border-2 border-primary/30 p-6 rounded-3xl shadow-wp-md">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Compass className="size-4.5" />
              <span>Full Curriculum Pathway</span>
            </div>
            <h1 className="font-sans font-black text-foreground text-2xl sm:text-3xl leading-tight">
              English Core: Levels &amp; Modules
            </h1>
            <p className="font-sans font-medium text-muted-foreground text-sm max-w-xl leading-relaxed">
              Organized into structured levels from daily home foundations to international travel.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0 bg-primary/5 p-4 rounded-2xl border border-primary/20">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              <span className="font-bold text-foreground text-sm">Course Mastery</span>
            </div>
            <span className="font-black text-2xl text-primary">{overallStats.percent}%</span>
            <span className="text-xs text-muted-foreground font-medium">
              {overallStats.masteredWords} / {overallStats.totalWords} words strong
            </span>
          </div>
        </div>

        {/* Level / Module Selector Tabs */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="size-3.5" />
              <span>Jump to Level:</span>
            </span>
          </div>

          <div
            role="tablist"
            id={tabListId}
            aria-label="Course levels navigation"
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedModuleId === "all"}
              onClick={() => setSelectedModuleId("all")}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue ${
                selectedModuleId === "all"
                  ? "bg-wp-blue text-wp-text-on-blue border-wp-blue shadow-wp-xs"
                  : "bg-wp-card text-foreground hover:bg-muted/50 border-border"
              }`}
            >
              <span>All Levels</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
                {COURSE_MODULES.length}
              </span>
            </button>

            {COURSE_MODULES.map((mod) => {
              const stat = moduleStats[mod.id] || { percent: 0 };
              const isSelected = selectedModuleId === mod.id;

              return (
                <button
                  key={mod.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue ${
                    isSelected
                      ? "bg-wp-blue text-wp-text-on-blue border-wp-blue shadow-wp-xs"
                      : "bg-wp-card text-foreground hover:bg-muted/50 border-border"
                  }`}
                >
                  <span>Level {mod.level}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {stat.percent}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.header>

      {/* Modules & Their Grouped Units */}
      <div className="flex flex-col gap-8">
        {filteredModules.map((module) => {
          const stats = moduleStats[module.id] || {
            totalWords: 0,
            masteredWords: 0,
            percent: 0,
            unitCount: 0,
          };
          const isExpanded = expandedModules[module.id] ?? true;
          const units = module.unitIds
            .map((id) => COURSE_UNITS[id])
            .filter(Boolean) as CourseUnit[];

          return (
            <motion.section
              key={module.id}
              variants={staggerItem}
              className="flex flex-col gap-4 bg-muted/20 border-2 border-border rounded-3xl p-4 sm:p-6"
            >
              {/* Module Header Bar (Accordion Trigger) */}
              <button
                type="button"
                onClick={() => toggleModuleExpand(module.id)}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between gap-4 p-2 rounded-2xl text-start hover:bg-muted/30 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="primary" size="sm">
                      {module.levelBadge}
                    </Badge>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {stats.unitCount} Units · {stats.totalWords} High-Yield Words
                    </span>
                  </div>
                  <h2 className="font-sans font-black text-foreground text-xl sm:text-2xl">
                    {module.title}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-muted-foreground max-w-2xl">
                    {module.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-foreground">
                      {stats.percent}% Complete
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {stats.masteredWords}/{stats.totalWords} mastered
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-full bg-wp-card border border-border transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <ChevronDown className="size-5 text-foreground" />
                  </div>
                </div>
              </button>

              {/* Module Progress Bar */}
              <div className="px-2">
                <ProgressBar
                  progressPercent={stats.percent}
                  label={`Level ${module.level} Progress`}
                  labelRight={`${stats.percent}% (${stats.masteredWords}/${stats.totalWords} words)`}
                  ariaLabel={`Level ${module.level} progress: ${stats.percent}%`}
                />
              </div>

              {/* Units Grid / List */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col gap-5 pt-2"
                  >
                    {units.map((unit) => {
                      const unitWords = unit.vocabulary || [];
                      const wordsPracticedCount = unitWords.filter(
                        (w) => (progress.wordMastery[w.id] || 0) >= 3
                      ).length;
                      const totalWords = unitWords.length;
                      const unitPercent =
                        totalWords > 0 ? Math.round((wordsPracticedCount / totalWords) * 100) : 0;
                      const isComplete = unitPercent === 100 && totalWords > 0;

                      return (
                        <div
                          key={unit.id}
                          className="bg-wp-card rounded-2xl border border-border p-5 flex flex-col lg:flex-row gap-5 shadow-wp-xs hover:border-primary/50 transition-colors relative overflow-hidden"
                        >
                          {/* Unit Image Banner */}
                          <div className="h-44 lg:h-52 lg:w-72 relative rounded-xl overflow-hidden shrink-0 border border-border shadow-wp-xs">
                            <img
                              alt={`${unit.name} visual learning scene`}
                              className="absolute inset-0 object-cover size-full"
                              src={unit.heroImage}
                            />
                            {isComplete ? (
                              <Badge
                                variant="green"
                                size="md"
                                className="absolute top-3 start-3 shadow-wp-xs"
                              >
                                <CheckCircle2 className="size-3.5" />
                                <span>Mastered</span>
                              </Badge>
                            ) : (
                              <Badge
                                variant="primary"
                                size="md"
                                className="absolute top-3 start-3 shadow-wp-xs"
                              >
                                <Sparkles className="size-3.5" />
                                <span>Unlocked</span>
                              </Badge>
                            )}
                          </div>

                          {/* Unit Details */}
                          <div className="flex-1 flex flex-col justify-between gap-3">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  {unit.isRevision ? (
                                    unit.revisionKind === "milestone" ? (
                                      <Badge variant="teal" size="sm">
                                        🌟 Grand Milestone Review
                                      </Badge>
                                    ) : (
                                      <Badge variant="green" size="sm">
                                        ✨ Retention Checkpoint
                                      </Badge>
                                    )
                                  ) : (
                                    <Badge variant="amber" size="sm">
                                      Level {module.level} · High Yield
                                    </Badge>
                                  )}
                                </div>
                                <span className="font-sans text-xs text-muted-foreground font-semibold">
                                  {totalWords} Target Words
                                </span>
                              </div>

                              <h3 className="font-sans font-black text-foreground text-xl leading-tight">
                                {unit.name}
                              </h3>
                              <p className="font-sans text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2">
                                {unit.description}
                              </p>
                            </div>

                            {/* Progress & CTA */}
                            <div className="flex flex-col gap-3 pt-2">
                              <ProgressBar
                                progressPercent={unitPercent}
                                label="Unit progress"
                                labelRight={`${unitPercent}% (${wordsPracticedCount}/${totalWords})`}
                                ariaLabel={`${unit.name} progress: ${unitPercent}%`}
                              />

                              <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() =>
                                  dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id })
                                }
                                className="w-full sm:w-auto bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3 px-5 font-sans font-bold text-wp-text-on-blue text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-wp-xs transition-colors flex items-center justify-center gap-2 self-start min-h-[44px]"
                              >
                                <BookOpen className="size-4" />
                                <span>
                                  {wordsPracticedCount > 0 ? "Continue Unit" : "Enter Unit"}:{" "}
                                  {unit.name}
                                </span>
                                <ArrowRight className="size-4 rtl:rotate-180" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </div>
    </motion.div>
  );
});
