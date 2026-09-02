import { memo, useState, useId, useMemo } from "react";
import {
  Compass,
  ArrowRight,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Award,
  Search,
  X,
  Library,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { COURSE_UNITS, COURSE_MODULES, type CourseUnit, type CourseModule } from "../data/lessons";
import { Badge, ProgressBar } from "../shared";
import { staggerContainer, staggerItem } from "../shared/animations";
import { useI18n } from "../context/I18nContext";
import { resolveAssetUrl } from "../../utils/assetUrl";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ExploreWorlds = memo(function ExploreWorlds({ dispatch }: Props) {
  const { progress } = useProgress();
  const { dir } = useI18n();
  const isRtl = dir === "rtl";
  const [selectedModuleId, setSelectedModuleId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initialize expanded modules for all available modules dynamically
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    COURSE_MODULES.forEach((mod, idx) => {
      // Expand level 1 by default, or all if preferred
      initial[mod.id] = idx === 0 || mod.level === 1;
    });
    return initial;
  });

  const tabListId = useId();
  const searchInputId = useId();

  // Aggregate stats per module
  const moduleStats = useMemo(() => {
    const stats: Record<
      string,
      {
        totalWords: number;
        masteredWords: number;
        percent: number;
        unitCount: number;
        completedUnits: number;
      }
    > = {};

    COURSE_MODULES.forEach((mod) => {
      let total = 0;
      let mastered = 0;
      let unitCount = 0;
      let completedUnits = 0;

      mod.unitIds.forEach((uid) => {
        const unit = COURSE_UNITS[uid];
        if (unit) {
          unitCount++;
          // Ids are all this needs: how many words, and how many are strong.
          // Reading `unit.vocabulary` here used to pull all 182 units into the
          // main bundle so that Explore could count to sixty.
          const wordIds = unit.wordIds;
          total += wordIds.length;
          const unitMastered = wordIds.filter((id) => (progress.wordMastery[id] || 0) >= 3).length;
          mastered += unitMastered;
          if (wordIds.length > 0 && unitMastered === wordIds.length) {
            completedUnits++;
          }
        }
      });

      const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
      stats[mod.id] = {
        totalWords: total,
        masteredWords: mastered,
        percent: pct,
        unitCount,
        completedUnits,
      };
    });

    return stats;
  }, [progress.wordMastery]);

  // Overall course progress
  const overallStats = useMemo(() => {
    let total = 0;
    let mastered = 0;
    let totalUnits = 0;
    let completedUnits = 0;

    Object.values(moduleStats).forEach((s) => {
      total += s.totalWords;
      mastered += s.masteredWords;
      totalUnits += s.unitCount;
      completedUnits += s.completedUnits;
    });

    return {
      totalWords: total,
      masteredWords: mastered,
      totalUnits,
      completedUnits,
      percent: total > 0 ? Math.round((mastered / total) * 100) : 0,
    };
  }, [moduleStats]);

  const toggleModuleExpand = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  // Filter modules based on level selection and search query
  const filteredModules = useMemo(() => {
    let modules = COURSE_MODULES;
    if (selectedModuleId !== "all") {
      modules = modules.filter((m) => m.id === selectedModuleId);
    }

    if (!searchQuery.trim()) {
      return modules;
    }

    const q = searchQuery.toLowerCase().trim();
    return modules
      .map((mod) => {
        const matchingUnitIds = mod.unitIds.filter((uid) => {
          const unit = COURSE_UNITS[uid];
          if (!unit) return false;
          return (
            unit.name.toLowerCase().includes(q) ||
            unit.description.toLowerCase().includes(q) ||
            // Word ids are the label slugged — "bathtub" for "Bathtub" — for
            // 10,826 of the 10,848 items, so they carry search without the
            // labels themselves being in the bundle. The exceptions are
            // accented words: searching "rosé" misses where "rose" matches.
            unit.wordIds.some((id) => id.replace(/-/g, " ").includes(q))
          );
        });

        if (matchingUnitIds.length === 0 && !mod.title.toLowerCase().includes(q)) {
          return null;
        }

        return {
          ...mod,
          unitIds: matchingUnitIds.length > 0 ? matchingUnitIds : mod.unitIds,
        };
      })
      .filter(Boolean) as CourseModule[];
  }, [selectedModuleId, searchQuery]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8"
    >
      {/* Page Header with Course Level Summary */}
      <motion.header variants={staggerItem} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-wp-card border-2 border-primary/30 p-6 rounded-3xl shadow-wp-md">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Compass className="size-4.5" />
              <span>Structured Curriculum Pathway</span>
            </div>
            <h1 className="font-sans font-black text-foreground text-2xl sm:text-3xl leading-tight">
              5-Level Progressive Mastery
            </h1>
            <p className="font-sans font-medium text-muted-foreground text-sm max-w-xl leading-relaxed">
              Step through 5 progressive levels from everyday essentials to advanced specialist
              scenarios.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0 bg-primary/5 p-4 rounded-2xl border border-primary/20">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              <span className="font-bold text-foreground text-sm">Curriculum Mastery</span>
            </div>
            <span className="font-black text-2xl text-primary">{overallStats.percent}%</span>
            <span className="text-xs text-muted-foreground font-medium">
              {overallStats.masteredWords} / {overallStats.totalWords} words mastered
            </span>
          </div>
        </div>

        {/* Search & Level Quick Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <label htmlFor={searchInputId} className="sr-only">
              Search units or vocabulary
            </label>
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
              <Search className="size-4" />
            </div>
            <input
              id={searchInputId}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g., Kitchen, Airport, Body)..."
              className="w-full bg-wp-card text-foreground placeholder:text-muted-foreground border border-border rounded-xl py-2.5 ps-10 pe-9 text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Level Filter Tabs */}
          <div
            role="tablist"
            id={tabListId}
            aria-label="Course levels navigation"
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedModuleId === "all"}
              onClick={() => setSelectedModuleId("all")}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue ${
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
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue ${
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
        {filteredModules.length === 0 ? (
          <div className="p-8 text-center bg-wp-card rounded-2xl border border-border flex flex-col items-center gap-3">
            <Compass className="size-8 text-muted-foreground opacity-50" />
            <p className="font-bold text-foreground">
              No units found matching &quot;{searchQuery}&quot;
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs font-semibold text-primary underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue min-h-[44px] flex items-center"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          filteredModules.map((module) => {
            const stats = moduleStats[module.id] || {
              totalWords: 0,
              masteredWords: 0,
              percent: 0,
              unitCount: 0,
              completedUnits: 0,
            };
            const isExpanded = expandedModules[module.id] ?? false;
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
                        {stats.unitCount} Units · {stats.totalWords} Vocabulary Items
                      </span>
                    </div>
                    <h2 className="font-sans font-black text-foreground text-xl sm:text-2xl">
                      {isRtl && module.titleAr ? module.titleAr : module.title}
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
                      className={`p-2 rounded-full bg-wp-card border border-border transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
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
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2"
                    >
                      {units.map((unit) => {
                        const wordsPracticedCount = unit.wordIds.filter(
                          (id) => (progress.wordMastery[id] || 0) >= 3
                        ).length;
                        const totalWords = unit.wordIds.length;
                        const unitPercent =
                          totalWords > 0 ? Math.round((wordsPracticedCount / totalWords) * 100) : 0;
                        const isComplete = unitPercent === 100 && totalWords > 0;

                        return (
                          <div
                            key={unit.id}
                            className="bg-wp-card rounded-2xl border border-border p-4 flex flex-col justify-between gap-4 shadow-wp-xs hover:border-primary/50 transition-colors relative overflow-hidden"
                          >
                            {/* Unit Image Banner with responsive aspect ratio */}
                            <div className="relative aspect-[16/9] min-h-[140px] max-h-[190px] rounded-xl overflow-hidden shrink-0 border border-border shadow-wp-xs">
                              {unit.heroImage ? (
                                <img
                                  alt={`${unit.name} visual learning scene`}
                                  className="absolute inset-0 object-cover size-full"
                                  src={resolveAssetUrl(unit.heroImage)}
                                  loading="lazy"
                                />
                              ) : (
                                // Seven units have word cards in Figma but no
                                // scene illustration. A named panel reads as a
                                // deliberate cover; a broken <img> reads as a
                                // bug, and the unit is perfectly usable either
                                // way.
                                <div
                                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/25 via-primary/10 to-transparent p-4"
                                  aria-hidden
                                >
                                  <span className="font-sans font-bold text-center text-balance text-foreground/70 text-sm sm:text-base">
                                    {unit.name}
                                  </span>
                                </div>
                              )}
                              {isComplete ? (
                                <Badge
                                  variant="green"
                                  size="sm"
                                  className="absolute top-2.5 start-2.5 shadow-wp-xs"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                  <span>Mastered</span>
                                </Badge>
                              ) : (
                                <Badge
                                  variant="primary"
                                  size="sm"
                                  className="absolute top-2.5 start-2.5 shadow-wp-xs"
                                >
                                  <Sparkles className="size-3.5" />
                                  <span>Level {module.level}</span>
                                </Badge>
                              )}
                            </div>

                            {/* Unit Details */}
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex items-center justify-between flex-wrap gap-1">
                                <h3 className="font-sans font-black text-foreground text-lg leading-tight">
                                  {unit.name}
                                </h3>
                                <span className="font-sans text-xs text-muted-foreground font-semibold">
                                  {totalWords} Words
                                </span>
                              </div>
                              <p className="font-sans text-muted-foreground text-xs leading-relaxed line-clamp-2">
                                {unit.description}
                              </p>
                            </div>

                            {/* Progress & Action CTA */}
                            <div className="flex flex-col gap-2.5 pt-1 border-t border-border/60">
                              <ProgressBar
                                progressPercent={unitPercent}
                                label="Unit progress"
                                labelRight={`${unitPercent}%`}
                                ariaLabel={`${unit.name} progress: ${unitPercent}%`}
                              />

                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="button"
                                  onClick={() =>
                                    dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id })
                                  }
                                  className="flex-1 bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-2.5 px-3.5 font-sans font-bold text-wp-text-on-blue text-xs sm:text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-wp-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                                >
                                  <Play className="size-3.5 shrink-0" />
                                  <span>{wordsPracticedCount > 0 ? "Continue" : "Start Unit"}</span>
                                  <ArrowRight className="size-3.5 rtl:rotate-180 shrink-0" />
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="button"
                                  onClick={() =>
                                    dispatch({
                                      type: "GO",
                                      to: "learning-materials",
                                      unitId: unit.id,
                                      area: "learn",
                                    })
                                  }
                                  title={`Study materials for ${unit.name}`}
                                  aria-label={`Study materials for ${unit.name}`}
                                  className="px-3.5 py-2.5 bg-secondary text-primary hover:bg-primary/10 border border-primary/20 rounded-xl font-sans font-bold text-xs sm:text-sm min-h-[44px] flex items-center justify-center gap-1.5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue shrink-0"
                                >
                                  <Library className="size-4 shrink-0" />
                                  <span>Study</span>
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
          })
        )}
      </div>
    </motion.div>
  );
});
