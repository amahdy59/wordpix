import { memo, useState, useId, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Compass,
  ChevronDown,
  Search,
  X,
  Play,
  BookOpen,
  RotateCcw,
  Sparkles,
  ChevronsUpDown,
  Layers,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { COURSE_UNITS, type CourseUnit } from "../data/courseCatalog";
import { CEFR_STAGES, CURRICULUM_SEQUENCE } from "../data/curriculumSequence";
import { Badge } from "../shared/Badge";
import { CurriculumTopicCard } from "../shared/CurriculumTopicCard";
import { ProgressBar } from "../shared/ProgressBar";
import { FilterChip } from "../shared/FilterChip";
import { PageHeader } from "../shared/PageHeader";
import { PageContainer } from "../shared/PageContainer";
import { staggerContainer, staggerItem } from "../shared/animations";
import { useI18n } from "../context/I18nContext";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { getUnitCurriculumDesign } from "../learning/curriculumModel";
import { loadUnitVocabulary } from "../data/vocabulary";
import { WordInspectorModal } from "../shared/WordInspectorModal";
import { LibraryWordCard } from "./LibraryWordCard";
import type { VocabularyItem } from "../data/lessons";

import { useDevicePreference, isTextInput } from "../shared/devicePreferences";

import { loadVocabularySearch, searchVocabulary, type SearchEntry } from "../data/vocabularySearch";
import { emitLearningEvent } from "../analytics/learningAnalytics";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export type MasteryFilter = "all" | "mastered" | "in-progress" | "not-started";
export type SearchScope = "all" | "words" | "units";

interface WordReference {
  wordId: string;
  unitId: string;
  unitName: string;
  cefr: string;
  label: string;
  arabic: string;
}

const POPULAR_TOPICS = [
  { id: "airport", query: "airport", labelKey: "explore.topicTravel", icon: "✈️" },
  { id: "hospital", query: "health", labelKey: "explore.topicHealth", icon: "🏥" },
  { id: "office", query: "work", labelKey: "explore.topicBusiness", icon: "💼" },
  { id: "restaurant", query: "food", labelKey: "explore.topicDining", icon: "🍽️" },
  { id: "bedroom", query: "home", labelKey: "explore.topicHome", icon: "🏡" },
  { id: "science-lab", query: "science", labelKey: "explore.topicScience", icon: "🌿" },
] as const;

function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
}

/**
 * Filter units by query string across name, description, groups, CEFR level, topics, and word IDs.
 */
function searchUnits(units: CourseUnit[], query: string): CourseUnit[] {
  if (!query.trim()) return units;
  const rawQ = query.toLowerCase().trim();
  const normQ = normalizeSearchText(query);

  return units.filter((unit) => {
    if (unit.name.toLowerCase().includes(rawQ) || normalizeSearchText(unit.name).includes(normQ))
      return true;
    if (
      unit.description.toLowerCase().includes(rawQ) ||
      normalizeSearchText(unit.description).includes(normQ)
    )
      return true;
    if (
      unit.topics?.some(
        (t) =>
          t.name.toLowerCase().includes(rawQ) ||
          t.id.toLowerCase().includes(rawQ) ||
          normalizeSearchText(t.name).includes(normQ) ||
          (t.description && normalizeSearchText(t.description).includes(normQ))
      )
    )
      return true;
    if (
      unit.groups?.some(
        (g) =>
          g.name.toLowerCase().includes(rawQ) ||
          g.description.toLowerCase().includes(rawQ) ||
          normalizeSearchText(g.name).includes(normQ) ||
          normalizeSearchText(g.description).includes(normQ)
      )
    )
      return true;
    const design = getUnitCurriculumDesign(unit);
    if (design.cefr.toLowerCase().includes(rawQ)) return true;
    if (
      design.outcome.toLowerCase().includes(rawQ) ||
      normalizeSearchText(design.outcome).includes(normQ)
    )
      return true;
    // Search individual word IDs in the unit
    return unit.wordIds.some((id) => id.replace(/-/g, " ").includes(rawQ));
  });
}

/**
 * Pure reference & search tool for all 200 curriculum vocabulary units and 10,800+ words.
 * Features instant lookup, CEFR stage filters, direct word results, mastery tracking, and study access.
 */
export const LibraryScreen = memo(function LibraryScreen({ dispatch }: Props) {
  const { progress } = useProgress();
  const { t } = useI18n();
  const shortcutsEnabled = useDevicePreference("character-shortcuts");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStageId, setSelectedStageId] = useState<string>("all");
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>("all");
  const [searchScope, setSearchScope] = useState<SearchScope>("all");

  // Collections begin collapsed so the library opens as an organized overview
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Active word inspection modal state
  const [inspectedWord, setInspectedWord] = useState<{
    word: VocabularyItem;
    unitId: string;
  } | null>(null);

  // Loaded vocabulary items map for matching words
  const [searchIndex, setSearchIndex] = useState<SearchEntry[]>([]);
  const [indexStatus, setIndexStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [indexRetry, setIndexRetry] = useState(0);
  const [wordLimit, setWordLimit] = useState(36);
  const [failedUnits, setFailedUnits] = useState<string[]>([]);
  const [detailsRetry, setDetailsRetry] = useState(0);
  const [loadedWordsMap, setLoadedWordsMap] = useState<Record<string, VocabularyItem>>({});

  const searchInputId = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchStarted = useRef(0);
  useEffect(() => {
    if (!searchQuery.trim() || indexStatus !== "ready" || searchStarted.current === 0) return;
    const frame = requestAnimationFrame(() => {
      emitLearningEvent({
        name: "search_timing",
        properties: { milliseconds: Math.round(performance.now() - searchStarted.current) },
      });
      searchStarted.current = 0;
    });
    return () => cancelAnimationFrame(frame);
  }, [searchQuery, indexStatus]);

  // Global keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        shortcutsEnabled &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !isTextInput(e.target) &&
        e.key === "/" &&
        document.activeElement !== searchInputRef.current &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName ?? "")
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutsEnabled]);

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

  useEffect(() => {
    if (!searchQuery.trim()) return;
    let cancelled = false;
    setIndexStatus("loading");
    void loadVocabularySearch().then(
      (entries) => {
        if (!cancelled) {
          setSearchIndex(entries);
          setIndexStatus("ready");
        }
      },
      () => {
        if (!cancelled) setIndexStatus("error");
      }
    );
    return () => {
      cancelled = true;
    };
  }, [searchQuery, indexRetry]);
  useEffect(() => {
    setWordLimit(36);
  }, [searchQuery, selectedStageId, masteryFilter]);

  const matchingWordRefs = useMemo<WordReference[]>(() => {
    const stage = CEFR_STAGES.find((item) => item.id === selectedStageId);
    const eligible = new Set(
      (stage ? allCurriculumUnits.slice(stage.start, stage.end) : allCurriculumUnits).map(
        (unit) => unit.id
      )
    );
    return searchVocabulary(searchIndex, searchQuery)
      .filter(([unitId, wordId]) => {
        if (!eligible.has(unitId)) return false;
        const mastery = progress.wordMastery[wordId] ?? 0;
        return (
          masteryFilter === "all" ||
          (masteryFilter === "mastered"
            ? mastery >= 3
            : masteryFilter === "in-progress"
              ? mastery > 0 && mastery < 3
              : mastery === 0)
        );
      })
      .map(([unitId, wordId, label, arabic, cefr]) => ({
        unitId,
        wordId,
        label,
        arabic,
        cefr,
        unitName: COURSE_UNITS[unitId].name,
      }));
  }, [
    searchIndex,
    searchQuery,
    selectedStageId,
    allCurriculumUnits,
    masteryFilter,
    progress.wordMastery,
  ]);
  const visibleWordRefs = useMemo(
    () =>
      searchScope === "units"
        ? []
        : matchingWordRefs.slice(0, searchScope === "words" ? wordLimit : 6),
    [searchScope, matchingWordRefs, wordLimit]
  );
  const visibleUnitIdsKey = [...new Set(visibleWordRefs.map((ref) => ref.unitId))].join("|");

  // Hydrate only visible results, two units at a time, with a retryable failure state.
  useEffect(() => {
    const unitIds = visibleUnitIdsKey ? visibleUnitIdsKey.split("|") : [];
    let cancelled = false;
    setFailedUnits([]);
    const hydrate = async () => {
      for (let offset = 0; offset < unitIds.length && !cancelled; offset += 2) {
        await Promise.all(
          unitIds.slice(offset, offset + 2).map(async (unitId) => {
            try {
              const items = await loadUnitVocabulary(unitId);
              if (!cancelled)
                setLoadedWordsMap((prev) => ({
                  ...prev,
                  ...Object.fromEntries(items.map((item) => [unitId + ":" + item.id, item])),
                }));
            } catch {
              if (!cancelled) setFailedUnits((prev) => [...prev, unitId]);
            }
          })
        );
      }
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [visibleUnitIdsKey, detailsRetry]);

  const toggleStageExpand = (stageId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const areAllExpanded = useMemo(() => {
    return CEFR_STAGES.every((s) => Boolean(expandedModules[s.id]));
  }, [expandedModules]);

  const toggleExpandAll = () => {
    if (areAllExpanded) {
      setExpandedModules({});
    } else {
      const all: Record<string, boolean> = {};
      CEFR_STAGES.forEach((s) => {
        all[s.id] = true;
      });
      setExpandedModules(all);
    }
  };

  const activeStage = useMemo(
    () => CEFR_STAGES.find((s) => s.id === selectedStageId),
    [selectedStageId]
  );

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedStageId !== "all" || masteryFilter !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedStageId("all");
    setMasteryFilter("all");
    setSearchScope("all");
  };

  const handleInspectWord = useCallback((word: VocabularyItem, unitId: string) => {
    setInspectedWord({ word, unitId });
  }, []);

  const handleGoToUnit = useCallback(
    (unitId: string) => {
      dispatch({
        type: "GO",
        to: "learning-materials",
        unitId,
        area: "reference",
        returnTo: "library",
      });
    },
    [dispatch]
  );

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <PageContainer size="wide">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex w-full flex-col gap-4 sm:gap-6"
      >
        {/* Page Header with Catalog Summary */}
        <motion.div variants={staggerItem} className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PageHeader variant="plain" title={t("nav.library")} />
            {overallStats.masteredWords > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/80 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
                <span>
                  {t("explore.masteryFraction", {
                    mastered: overallStats.masteredWords,
                    total: overallStats.totalWords,
                  })}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{t("explore.searchHint")}</p>
        </motion.div>

        {/* Command Search Bar & Interactive Exposed Filters */}
        <motion.div
          variants={staggerItem}
          className="wp-sticky-controls sticky top-0 z-20 flex flex-col gap-3 rounded-2xl bg-background/95 backdrop-blur-md py-2 border-b border-border/50"
        >
          {/* Enhanced Command Search Input */}
          <div className="relative flex items-center w-full rounded-2xl border border-border/90 bg-wp-card shadow-xs transition-all focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-primary">
            <div className="ps-3.5 pe-2 flex items-center pointer-events-none text-muted-foreground">
              <Search className="size-5" aria-hidden="true" />
            </div>
            <input
              ref={searchInputRef}
              id={searchInputId}
              type="search"
              role="searchbox"
              value={searchQuery}
              onChange={(e) => {
                searchStarted.current = performance.now();
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchQuery("");
                  searchInputRef.current?.blur();
                }
              }}
              placeholder={t("explore.searchPlaceholder")}
              aria-label={t("explore.searchLabel")}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/70 py-3 pe-24 text-base focus:outline-none min-h-[48px] [&::-webkit-search-cancel-button]:appearance-none"
            />
            {/* Action buttons / Shortcut Badge */}
            <div className="absolute inset-y-0 end-0 flex items-center pe-2.5 gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label={t("explore.clearSearchInput")}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                >
                  <X className="size-4.5" aria-hidden="true" />
                </button>
              ) : (
                <kbd
                  aria-hidden="true"
                  title={t("explore.searchShortcutHint")}
                  className="hidden sm:inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-mono font-medium text-muted-foreground shadow-xs select-none"
                >
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Collapsible Filter Disclosure */}
          <details className="group rounded-2xl border border-border bg-wp-card p-3">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-1 font-bold text-sm text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span>{t("explore.filterOptions")}</span>
                {(selectedStageId !== "all" || masteryFilter !== "all") && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedStageId !== "all" && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                        {activeStage?.label ?? selectedStageId}
                      </span>
                    )}
                    {masteryFilter !== "all" && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                        {masteryFilter === "mastered"
                          ? t("explore.statusMastered")
                          : masteryFilter === "in-progress"
                            ? t("explore.statusInProgress")
                            : t("explore.statusNotStarted")}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div className="flex flex-col gap-3 pt-3">
              {/* Row 1: CEFR Stage Level Filter Chips */}
              <div
                role="radiogroup"
                aria-label={t("explore.collectionNavigation")}
                className="flex flex-wrap items-center gap-1.5 pb-0.5 pt-0.5"
              >
                <FilterChip
                  label={t("explore.filterAll")}
                  selected={selectedStageId === "all"}
                  selectionMode="single"
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
                      selectionMode="single"
                      onToggle={() => setSelectedStageId(stage.id)}
                      count={count}
                      size="sm"
                    />
                  );
                })}
              </div>

              {/* Row 2: Mastery Status Filter & Reset Trigger */}
              <div
                role="radiogroup"
                aria-label={t("explore.masteryFilterAria")}
                className="flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
                  <span className="text-muted-foreground font-semibold text-xs shrink-0 pe-1">
                    {t("explore.filterStatus")}
                  </span>
                  <FilterChip
                    label={t("explore.statusAll")}
                    selected={masteryFilter === "all"}
                    selectionMode="single"
                    onToggle={() => setMasteryFilter("all")}
                    size="sm"
                  />
                  <FilterChip
                    label={t("explore.statusMastered")}
                    selected={masteryFilter === "mastered"}
                    selectionMode="single"
                    onToggle={() => setMasteryFilter("mastered")}
                    count={overallStats.completedUnits}
                    size="sm"
                  />
                  <FilterChip
                    label={t("explore.statusInProgress")}
                    selected={masteryFilter === "in-progress"}
                    selectionMode="single"
                    onToggle={() => setMasteryFilter("in-progress")}
                    size="sm"
                  />
                  <FilterChip
                    label={t("explore.statusNotStarted")}
                    selected={masteryFilter === "not-started"}
                    selectionMode="single"
                    onToggle={() => setMasteryFilter("not-started")}
                    size="sm"
                  />
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="flex min-h-[44px] items-center gap-1.5 font-bold text-primary hover:underline px-2 rounded-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer shrink-0"
                  >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    <span>{t("explore.resetFilters")}</span>
                  </button>
                )}
              </div>
            </div>
          </details>

          {/* Results Header / Active Filters bar */}
          {/* Results Status announcement */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground font-medium px-1">
            <span role="status" aria-live="polite" aria-atomic="true">
              {searchQuery.trim()
                ? indexStatus === "loading"
                  ? t("reviewUpdate.searchLoading")
                  : t("explore.unitsAndWordsFound", {
                      units: filteredUnits.length,
                      words: matchingWordRefs.length,
                    })
                : t("explore.unitsFound", { count: filteredUnits.length })}
            </span>
          </div>
        </motion.div>

        {/* Empty-State Topic Discovery Chips */}
        {!hasActiveFilters && (
          <details className="rounded-xl border border-border p-3">
            <summary className="min-h-11 cursor-pointer rounded-lg py-2 text-sm font-semibold text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary">
              {t("explore.popularTopics")}
            </summary>
            <motion.div variants={staggerItem} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("explore.popularTopics")}
                </span>
                <button
                  type="button"
                  onClick={toggleExpandAll}
                  className="flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-primary hover:underline px-2 rounded-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                >
                  <ChevronsUpDown className="size-3.5" aria-hidden="true" />
                  <span>{areAllExpanded ? t("explore.collapseAll") : t("explore.expandAll")}</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {POPULAR_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSearchQuery(topic.query)}
                    className="flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-wp-card px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-secondary/40 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer shadow-wp-xs"
                  >
                    <span aria-hidden="true">{topic.icon}</span>
                    <span>{t(topic.labelKey)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </details>
        )}

        {/* Results Feedback & Search Result Scope Tabs */}
        {isSearchActive && (
          <div className="flex flex-col gap-3">
            {/* Scope Tabs: All / Words / Units */}
            <div
              role="tablist"
              aria-label={t("explore.collectionNavigation")}
              className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold"
            >
              <button
                type="button"
                role="tab"
                aria-selected={searchScope === "all"}
                onClick={() => setSearchScope("all")}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                  searchScope === "all"
                    ? "bg-primary text-primary-foreground shadow-wp-xs"
                    : "text-muted-foreground hover:text-foreground bg-muted/40"
                }`}
              >
                <Layers className="size-3.5" aria-hidden="true" />
                <span>
                  {t("explore.tabAll", {
                    count: filteredUnits.length + matchingWordRefs.length,
                  })}
                </span>
              </button>

              {matchingWordRefs.length > 0 && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={searchScope === "words"}
                  onClick={() => setSearchScope("words")}
                  className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                    searchScope === "words"
                      ? "bg-primary text-primary-foreground shadow-wp-xs"
                      : "text-muted-foreground hover:text-foreground bg-muted/40"
                  }`}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  <span>{t("explore.tabWords", { count: matchingWordRefs.length })}</span>
                </button>
              )}

              <button
                type="button"
                role="tab"
                aria-selected={searchScope === "units"}
                onClick={() => setSearchScope("units")}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                  searchScope === "units"
                    ? "bg-primary text-primary-foreground shadow-wp-xs"
                    : "text-muted-foreground hover:text-foreground bg-muted/40"
                }`}
              >
                <FileText className="size-3.5" aria-hidden="true" />
                <span>{t("explore.tabUnits", { count: filteredUnits.length })}</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Section: Empty state vs Search Results vs Default Stage Accordions */}
        {indexStatus === "error" && (
          <div role="alert">
            <p>{t("reviewUpdate.searchFailed")}</p>
            <button
              type="button"
              className="min-h-11 min-w-11 rounded-xl border border-border px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setIndexRetry((value) => value + 1)}
            >
              {t("action.retry")}
            </button>
          </div>
        )}
        {filteredUnits.length === 0 &&
        matchingWordRefs.length === 0 &&
        indexStatus !== "loading" &&
        indexStatus !== "error" ? (
          <div className="p-8 text-center bg-wp-card rounded-3xl border border-border flex flex-col items-center gap-3">
            <Compass className="size-10 text-muted-foreground opacity-50" aria-hidden="true" />
            <p className="font-bold text-foreground text-base">
              {t("explore.noUnitsFound", { query: searchQuery || t("explore.selectedFilters") })}
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm font-semibold text-primary underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] flex items-center cursor-pointer"
            >
              {t("explore.resetFilters")}
            </button>
          </div>
        ) : isSearchActive ? (
          /* Active Search Dual-Track View */
          <div className="flex flex-col gap-6">
            {/* Matching Vocabulary Words Grid */}
            {matchingWordRefs.length > 0 && searchScope !== "units" && (
              <section aria-labelledby="matching-words-heading" className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h2
                    id="matching-words-heading"
                    className="font-sans font-bold text-base sm:text-lg text-foreground flex items-center gap-2"
                  >
                    <Sparkles className="size-4 text-primary" aria-hidden="true" />
                    <span>{t("explore.matchingWordsTitle")}</span>
                    <Badge variant="primary" size="sm">
                      {matchingWordRefs.length}
                    </Badge>
                  </h2>
                  {searchScope === "all" && matchingWordRefs.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setSearchScope("words")}
                      className="text-xs font-bold text-primary hover:underline min-h-[44px] flex items-center px-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg cursor-pointer"
                    >
                      {t("explore.tabWords", { count: matchingWordRefs.length })}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleWordRefs.map((ref) => {
                    const item = loadedWordsMap[ref.unitId + ":" + ref.wordId];
                    if (!item)
                      return (
                        <article
                          key={ref.unitId + ":" + ref.wordId}
                          aria-busy={!failedUnits.includes(ref.unitId)}
                          className="rounded-2xl border border-border bg-card p-4"
                        >
                          <h3 className="text-base font-semibold" lang="en" dir="ltr">
                            {ref.label}
                          </h3>
                          <p lang="ar" dir="rtl">
                            {ref.arabic}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t(
                              failedUnits.includes(ref.unitId)
                                ? "reviewUpdate.detailsFailed"
                                : "app.loading"
                            )}
                          </p>
                          {failedUnits.includes(ref.unitId) && (
                            <button
                              type="button"
                              onClick={() => setDetailsRetry((value) => value + 1)}
                              className="min-h-11 min-w-11 rounded-lg px-3 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              {t("action.retry")}
                            </button>
                          )}
                        </article>
                      );

                    return (
                      <LibraryWordCard
                        key={`${ref.unitId}-${ref.wordId}`}
                        word={item}
                        unitId={ref.unitId}
                        unitName={ref.unitName}
                        onInspect={handleInspectWord}
                        onGoToUnit={handleGoToUnit}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {searchScope === "words" && matchingWordRefs.length > wordLimit && (
              <button
                type="button"
                className="min-h-11 rounded-xl border border-border px-4 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setWordLimit((value) => value + 36)}
              >
                {t("reviewUpdate.moreWords", {
                  current: wordLimit,
                  total: matchingWordRefs.length,
                })}
              </button>
            )}
            {/* Matching Topic Units List */}
            {filteredUnits.length > 0 && searchScope !== "words" && (
              <section aria-labelledby="matching-units-heading" className="flex flex-col gap-3">
                <h2
                  id="matching-units-heading"
                  className="font-sans font-bold text-base sm:text-lg text-foreground flex items-center gap-2"
                >
                  <FileText className="size-4 text-primary" aria-hidden="true" />
                  <span>{t("explore.matchingUnitsTitle")}</span>
                  <Badge variant="muted" size="sm">
                    {filteredUnits.length}
                  </Badge>
                </h2>

                <div className="flex flex-col">
                  {filteredUnits.map((unit) => (
                    <UnitCard
                      compact
                      key={unit.id}
                      unit={unit}
                      stats={unitStatsMap.get(unit.id)}
                      dispatch={dispatch}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* Default Browsing Mode: Grouped Stages with Visual Previews */
          <div className="flex flex-col gap-5 sm:gap-6">
            {stageGroups
              .filter(({ stage }) => selectedStageId === "all" || selectedStageId === stage.id)
              .map(({ stage, units, stats }) => {
                const isExpanded = expandedModules[stage.id] ?? false;
                const sampleUnits = units.slice(0, 3);

                return (
                  <section
                    key={stage.id}
                    aria-labelledby={`stage-heading-${stage.id}`}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-wp-card/50 p-3 sm:p-5 transition-all"
                  >
                    {/* Stage Accordion Header Button */}
                    <button
                      type="button"
                      onClick={() => toggleStageExpand(stage.id)}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between gap-3 min-h-[44px] rounded-xl text-start hover:bg-muted/40 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer p-1"
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="primary" size="sm" className="font-bold">
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
                          className="font-sans font-black text-foreground text-lg sm:text-2xl truncate"
                        >
                          {stage.label}
                        </h2>

                        {/* Visual unit thumbnails preview */}
                        {!isExpanded && sampleUnits.length > 0 && (
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            {sampleUnits.map((u) => (
                              <span
                                key={u.id}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/10 truncate max-w-[140px]"
                              >
                                {u.name}
                              </span>
                            ))}
                            {units.length > 3 && (
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {t("explore.moreUnitsCount", { count: units.length - 3 })}
                              </span>
                            )}
                          </div>
                        )}
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
                      <div className="px-1">
                        <ProgressBar
                          progressPercent={stats.percent}
                          label={`${stage.label} progress`}
                          labelRight={`${stats.percent}% (${stats.masteredWords}/${stats.totalWords} words)`}
                          ariaLabel={`${stage.label} progress: ${stats.percent}%`}
                        />
                      </div>
                    )}

                    {/* Stage Units Grid */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 xl:grid-cols-3"
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
        )}

        {/* Word Inspector Modal */}
        {inspectedWord && (
          <WordInspectorModal
            isOpen={Boolean(inspectedWord)}
            word={inspectedWord.word}
            unitId={inspectedWord.unitId}
            onClose={() => setInspectedWord(null)}
          />
        )}
      </motion.div>
    </PageContainer>
  );
});

interface UnitCardProps {
  compact?: boolean;
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

const UnitCard = memo(function UnitCard({
  unit,
  stats,
  dispatch,
  t,
  compact = false,
}: UnitCardProps) {
  const curriculum = getUnitCurriculumDesign(unit);
  const wordsPracticedCount = stats?.masteredWords ?? 0;
  const totalWords = stats?.totalWords ?? unit.wordIds.length;
  const unitPercent = stats?.percent ?? 0;
  const isComplete = stats?.isComplete ?? false;

  return (
    <CurriculumTopicCard
      layout={compact ? "row" : "card"}
      levelBadge={curriculum.cefr}
      isMastered={isComplete}
      title={unit.name}
      imageSrc={unit.heroImage ? resolveAssetUrl(unit.heroImage) : undefined}
      imageAlt={`${unit.name} visual learning scene`}
      tooltipText={curriculum.outcome}
      statusIcon={<Play className="size-3.5 shrink-0" aria-hidden="true" />}
      statusText={t("explore.wordsBadge", { count: totalWords })}
      actionLabel={t("dashboard.studyGuide")}
      onClick={() =>
        dispatch({
          type: "GO",
          to: "learning-materials",
          area: "reference",
          unitId: unit.id,
          returnTo: "library",
        })
      }
      secondaryAction={
        <div className="flex flex-col gap-2.5">
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

          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "GO",
                to: "learning-materials",
                unitId: unit.id,
                area: "learn",
                returnTo: "library",
              })
            }
            title={t("explore.studyMaterialsAria", { unit: unit.name })}
            aria-label={t("explore.studyMaterialsAria", { unit: unit.name })}
            className="min-h-[44px] w-full px-3 py-2 bg-secondary text-primary hover:bg-secondary/80 border border-primary/20 rounded-xl font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            <BookOpen className="size-4 shrink-0" aria-hidden="true" />
            <span>{t("explore.studyButton")}</span>
          </button>
        </div>
      }
    />
  );
});
