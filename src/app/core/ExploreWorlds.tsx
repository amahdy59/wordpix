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
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { COURSE_UNITS, type CourseUnit } from "../data/lessons";
import { CEFR_STAGES, CURRICULUM_SEQUENCE } from "../data/curriculumSequence";
import { Badge, ProgressBar, FilterChip, PageHeader } from "../shared";
import { staggerContainer, staggerItem } from "../shared/animations";
import { useI18n } from "../context/I18nContext";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { getUnitCurriculumDesign } from "../learning/curriculumModel";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export type MasteryFilter = "all" | "mastered" | "in-progress" | "not-started";

/**
 * Filter units by query string across name, description, CEFR level, topics, and word IDs.
 */
function searchUnits(units: CourseUnit[], query: string): CourseUnit[] {
  if (!query.trim()) return units;
  const q = query.toLowerCase().trim();

  return units.filter((unit) => {
    if (unit.name.toLowerCase().includes(q)) return true;
    if (unit.description.toLowerCase().includes(q)) return true;
    if (
      unit.topics?.some((t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
    )
      return true;
    const design = getUnitCurriculumDesign(unit);
    if (design.cefr.toLowerCase().includes(q)) return true;
    if (design.outcome.toLowerCase().includes(q)) return true;
    // Search individual word IDs in the unit
    return unit.wordIds.some((id) => id.replace(/-/g, " ").includes(q));
  });
}

/**
 * Pure reference & search tool for all 200 curriculum vocabulary units.
 * Features instant lookup, CEFR stage filters, mastery tracking, and direct study access.
 */
export const ExploreWorlds = memo(function ExploreWorlds({ dispatch }: Props) {
  const { progress } = useProgress();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStageId, setSelectedStageId] = useState<string>("all");
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>("all");

  // Collections begin collapsed so the library opens as an organized overview
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const searchInputId = useId();

  // All 200 vocabulary units mapped from CURRICULUM_SEQUENCE
  const allCurriculumUnits = useMemo<CourseUnit[]>(() => {
    return CURRICULUM_SEQUENCE.map((id) => COURSE_UNITS[id]).filter((unit): unit is CourseUnit =>
      Boolean(unit)
    );
  }, []);

  // Compute unit statistics (mastered words, completion percentage)
  const unitStatsMap = useMemo(() => {
    const map = new Map<
      string,
      {
        totalWords: number;
        masteredWords: number;
        percent: number;
        isComplete: boolean;
      }
    >();

    allCurriculumUnits.forEach((unit) => {
      const totalWords = unit.wordIds.length;
      const masteredWords = unit.wordIds.filter(
        (id) => (progress.wordMastery[id] || 0) >= 3
      ).length;
      const percent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;
      map.set(unit.id, {
        totalWords,
        masteredWords,
        percent,
        isComplete: percent === 100 && totalWords > 0,
      });
    });

    return map;
  }, [allCurriculumUnits, progress.wordMastery]);

  // Overall catalog progress summary
  const overallStats = useMemo(() => {
    let totalWords = 0;
    let masteredWords = 0;
    let completedUnits = 0;

    allCurriculumUnits.forEach((unit) => {
      const stats = unitStatsMap.get(unit.id);
      if (stats) {
        totalWords += stats.totalWords;
        masteredWords += stats.masteredWords;
        if (stats.isComplete) completedUnits++;
      }
    });

    return {
      totalUnits: allCurriculumUnits.length,
      completedUnits,
      totalWords,
      masteredWords,
      percent: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0,
    };
  }, [allCurriculumUnits, unitStatsMap]);

  // Group units by CEFR stages
  const stageGroups = useMemo(() => {
    return CEFR_STAGES.map((stage) => {
      const stageUnits = allCurriculumUnits.slice(stage.start, stage.end);
      let stageTotalWords = 0;
      let stageMasteredWords = 0;
      let stageCompletedUnits = 0;

      stageUnits.forEach((u) => {
        const stats = unitStatsMap.get(u.id);
        if (stats) {
          stageTotalWords += stats.totalWords;
          stageMasteredWords += stats.masteredWords;
          if (stats.isComplete) stageCompletedUnits++;
        }
      });

      const stagePercent =
        stageTotalWords > 0 ? Math.round((stageMasteredWords / stageTotalWords) * 100) : 0;

      return {
        stage,
        units: stageUnits,
        stats: {
          unitCount: stageUnits.length,
          completedUnits: stageCompletedUnits,
          totalWords: stageTotalWords,
          masteredWords: stageMasteredWords,
          percent: stagePercent,
        },
      };
    });
  }, [allCurriculumUnits, unitStatsMap]);

  // Filtered units based on active search, stage, and mastery filters
  const filteredUnits = useMemo(() => {
    let list = allCurriculumUnits;

    // Stage filter
    if (selectedStageId !== "all") {
      const activeStage = CEFR_STAGES.find((s) => s.id === selectedStageId);
      if (activeStage) {
        list = allCurriculumUnits.slice(activeStage.start, activeStage.end);
      }
    }

    // Mastery filter
    if (masteryFilter !== "all") {
      list = list.filter((unit) => {
        const stats = unitStatsMap.get(unit.id);
        if (!stats) return false;
        if (masteryFilter === "mastered") return stats.isComplete;
        if (masteryFilter === "in-progress") return stats.masteredWords > 0 && !stats.isComplete;
        if (masteryFilter === "not-started") return stats.masteredWords === 0;
        return true;
      });
    }

    // Search query
    return searchUnits(list, searchQuery);
  }, [allCurriculumUnits, selectedStageId, masteryFilter, searchQuery, unitStatsMap]);

  const toggleStageExpand = (stageId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedStageId !== "all" || masteryFilter !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedStageId("all");
    setMasteryFilter("all");
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-0 sm:p-2 lg:p-4"
    >
      {/* Page Header */}
      <motion.div variants={staggerItem}>
        <PageHeader
          variant="hero"
          eyebrow={
            <span className="flex items-center gap-1.5 uppercase tracking-wider font-extrabold text-xs">
              <Library className="size-4" aria-hidden="true" />
              <span>{t("explore.pathwayBadge")}</span>
            </span>
          }
          title={t("explore.pageTitle")}
          subtitle={t("explore.pageSubtitle")}
          actions={
            <div className="flex shrink-0 flex-col gap-1.5 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:items-end">
              <div className="flex items-center gap-2">
                <Award className="size-5 text-primary" aria-hidden="true" />
                <span className="font-bold text-foreground text-sm">
                  {overallStats.masteredWords > 0
                    ? t("explore.curriculumMastery")
                    : t("explore.topicsAvailable")}
                </span>
              </div>
              {overallStats.masteredWords > 0 ? (
                <>
                  <span className="font-black text-2xl text-primary">{overallStats.percent}%</span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {t("explore.masteryFraction", {
                      mastered: overallStats.masteredWords,
                      total: overallStats.totalWords,
                    })}
                  </span>
                </>
              ) : (
                <span className="font-black text-2xl text-primary">
                  {overallStats.totalUnits} {t("explore.wordsCount")}
                </span>
              )}
            </div>
          }
        />
      </motion.div>

      {/* Search & Filter Controls */}
      <motion.div variants={staggerItem} className="flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative w-full">
          <label htmlFor={searchInputId} className="sr-only">
            {t("explore.searchLabel")}
          </label>
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
            <Search className="size-4" aria-hidden="true" />
          </div>
          <input
            id={searchInputId}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("explore.searchPlaceholder")}
            className="w-full bg-wp-card text-foreground placeholder:text-muted-foreground border border-border rounded-xl py-2.5 ps-10 pe-9 text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] justify-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* CEFR Stage Filter Chips */}
        <div
          role="group"
          aria-label={t("explore.collectionNavigation")}
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar snap-x"
        >
          <FilterChip
            label={t("explore.allLevels")}
            selected={selectedStageId === "all"}
            onToggle={() => setSelectedStageId("all")}
            count={allCurriculumUnits.length}
            size="sm"
          />

          {CEFR_STAGES.map((stage) => {
            const isSelected = selectedStageId === stage.id;
            const count = stage.end - stage.start;
            return (
              <FilterChip
                key={stage.id}
                label={stage.label}
                selected={isSelected}
                onToggle={() => setSelectedStageId(stage.id)}
                count={count}
                size="sm"
              />
            );
          })}
        </div>

        {/* Mastery Status Filter Chips */}
        <div
          role="group"
          aria-label="Filter by mastery status"
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs"
        >
          <span className="text-muted-foreground font-semibold text-xs shrink-0 ps-1">
            {t("explore.filterStatus")}
          </span>
          <FilterChip
            label={t("explore.statusAll")}
            selected={masteryFilter === "all"}
            onToggle={() => setMasteryFilter("all")}
            size="sm"
          />
          <FilterChip
            label={t("explore.statusMastered")}
            selected={masteryFilter === "mastered"}
            onToggle={() => setMasteryFilter("mastered")}
            count={overallStats.completedUnits}
            size="sm"
          />
          <FilterChip
            label={t("explore.statusInProgress")}
            selected={masteryFilter === "in-progress"}
            onToggle={() => setMasteryFilter("in-progress")}
            size="sm"
          />
          <FilterChip
            label={t("explore.statusNotStarted")}
            selected={masteryFilter === "not-started"}
            onToggle={() => setMasteryFilter("not-started")}
            size="sm"
          />
        </div>
      </motion.div>

      {/* Results Header / Active Filters bar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
          <span>{t("explore.unitsFound", { count: filteredUnits.length })}</span>
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-primary underline font-bold min-h-[44px] flex items-center hover:opacity-80 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
          >
            {t("explore.clearSearch")}
          </button>
        </div>
      )}

      {/* Main Content: Grouped Stages vs Flat Filtered Grid */}
      {filteredUnits.length === 0 ? (
        <div className="p-8 text-center bg-wp-card rounded-3xl border border-border flex flex-col items-center gap-3">
          <Compass className="size-10 text-muted-foreground opacity-50" aria-hidden="true" />
          <p className="font-bold text-foreground text-base">
            {t("explore.noUnitsFound", { query: searchQuery || "selected filters" })}
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm font-semibold text-primary underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary min-h-[44px] flex items-center"
          >
            {t("explore.clearSearch")}
          </button>
        </div>
      ) : !hasActiveFilters ? (
        /* Default Stage-Grouped View */
        <div className="flex flex-col gap-6">
          {stageGroups.map(({ stage, units, stats }) => {
            const isExpanded = expandedModules[stage.id] ?? false;

            return (
              <section
                key={stage.id}
                aria-labelledby={`stage-heading-${stage.id}`}
                className="flex flex-col gap-4 bg-muted/20 border border-border rounded-3xl p-4 sm:p-6"
              >
                {/* Stage Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleStageExpand(stage.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between gap-4 p-2 min-h-[44px] rounded-2xl text-start hover:bg-muted/30 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="primary" size="sm">
                        {stage.cefr}
                      </Badge>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {t("explore.moduleStats", {
                          units: stats.unitCount,
                          words: stats.totalWords,
                        })}
                      </span>
                    </div>
                    <h2
                      id={`stage-heading-${stage.id}`}
                      className="font-sans font-black text-foreground text-xl sm:text-2xl"
                    >
                      {stage.label}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {stats.masteredWords > 0 && (
                      <div className="hidden flex-col items-end gap-1 sm:flex">
                        <span className="text-xs font-bold text-foreground">
                          {t("explore.percentComplete", { percent: stats.percent })}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {t("explore.masteredCount", {
                            mastered: stats.masteredWords,
                            total: stats.totalWords,
                          })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`p-2 rounded-full bg-wp-card border border-border transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="size-5 text-foreground" aria-hidden="true" />
                    </div>
                  </div>
                </button>

                {stats.masteredWords > 0 && (
                  <div className="px-2">
                    <ProgressBar
                      progressPercent={stats.percent}
                      label={`${stage.label} progress`}
                      labelRight={`${stats.percent}% (${stats.masteredWords}/${stats.totalWords} words)`}
                      ariaLabel={`${stage.label} progress: ${stats.percent}%`}
                    />
                  </div>
                )}

                {/* Units Grid */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2"
                    >
                      {units.map((unit) => (
                        <UnitCard
                          key={unit.id}
                          unit={unit}
                          stats={unitStatsMap.get(unit.id)}
                          dispatch={dispatch}
                          t={t}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            );
          })}
        </div>
      ) : (
        /* Flat Filtered Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              stats={unitStatsMap.get(unit.id)}
              dispatch={dispatch}
              t={t}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
});

interface UnitCardProps {
  unit: CourseUnit;
  stats?: {
    totalWords: number;
    masteredWords: number;
    percent: number;
    isComplete: boolean;
  };
  dispatch: React.Dispatch<Action>;
  t: (key: string, options?: Record<string, string | number>) => string;
}

const UnitCard = memo(function UnitCard({ unit, stats, dispatch, t }: UnitCardProps) {
  const curriculum = getUnitCurriculumDesign(unit);
  const wordsPracticedCount = stats?.masteredWords ?? 0;
  const totalWords = stats?.totalWords ?? unit.wordIds.length;
  const unitPercent = stats?.percent ?? 0;
  const isComplete = stats?.isComplete ?? false;

  return (
    <div className="relative flex flex-col justify-between gap-3 overflow-hidden rounded-2xl border border-border bg-wp-card p-3.5 shadow-wp-xs transition-colors hover:border-primary/50">
      {/* Unit Image Banner with responsive aspect ratio */}
      <div className="relative aspect-[16/9] min-h-[120px] max-h-[170px] shrink-0 overflow-hidden rounded-xl border border-border shadow-wp-xs">
        {unit.heroImage ? (
          <img
            alt={`${unit.name} visual learning scene`}
            className="absolute inset-0 object-cover size-full"
            src={resolveAssetUrl(unit.heroImage)}
            loading="lazy"
          />
        ) : (
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
          <Badge variant="green" size="sm" className="absolute top-2.5 start-2.5 shadow-wp-xs">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            <span>{t("gamification.mastered")}</span>
          </Badge>
        ) : (
          <Badge variant="primary" size="sm" className="absolute top-2.5 start-2.5 shadow-wp-xs">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>{curriculum.cefr}</span>
          </Badge>
        )}
      </div>

      {/* Unit Details */}
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <h3 className="font-sans font-black text-foreground text-base sm:text-lg leading-tight">
            {unit.name}
          </h3>
          <span className="font-sans text-xs text-muted-foreground font-semibold">
            {t("explore.wordsBadge", { count: totalWords })}
          </span>
        </div>
        <p className="line-clamp-2 font-sans text-xs leading-relaxed text-muted-foreground">
          {curriculum.outcome}
        </p>
      </div>

      {/* Progress & Actions */}
      <div className="flex flex-col gap-2.5 border-t border-border/60 pt-2.5">
        {wordsPracticedCount > 0 && (
          <ProgressBar
            progressPercent={unitPercent}
            label="Unit progress"
            labelRight={`${unitPercent}%`}
            ariaLabel={`${unit.name} progress: ${unitPercent}%`}
            size="sm"
            variant={isComplete ? "success" : "brand"}
          />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id })}
            className="min-h-[44px] flex-1 bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-2 px-3 font-sans font-bold text-wp-text-on-blue text-xs sm:text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary shadow-wp-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{wordsPracticedCount > 0 ? t("action.continue") : t("explore.startUnit")}</span>
            <ArrowRight className="size-3.5 rtl:rotate-180 shrink-0" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "GO",
                to: "learning-materials",
                unitId: unit.id,
                area: "learn",
              })
            }
            title={t("dashboard.studyGuideAria", { unit: unit.name })}
            aria-label={t("dashboard.studyGuideAria", { unit: unit.name })}
            className="min-h-[44px] px-3 py-2 bg-secondary text-primary hover:bg-secondary/80 border border-primary/20 rounded-xl font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary shrink-0 cursor-pointer"
          >
            <BookOpen className="size-4 shrink-0" aria-hidden="true" />
            <span>{t("explore.studyButton")}</span>
          </button>
        </div>
      </div>
    </div>
  );
});
