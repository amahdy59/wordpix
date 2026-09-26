import { memo, useMemo, useState } from "react";
import type { Action, SkillCategory } from "../types";
import {
  EXERCISES,
  availableCategories,
  countAvailableExercises,
  isExerciseAvailableForLevel,
} from "./skillExerciseCatalog";
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { useLearner } from "../context/LearnerContext";
import { useI18n } from "../context/I18nContext";
import { useProgress } from "../data/progress";
import { REVIEW_GROUP_ID } from "../data/lessons";
import { calculateDaysBetween, getLocalDateString } from "../../features/gamification/streak";
import { Button, FilterChip, PageHeader } from "../shared";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const REVIEW_SESSION_SIZE = 5;

/**
 * Practice Tab: Consolidates Spaced-Repetition Daily Review and Multimodal Skill Drills.
 * Always leads with "Reviews Due Today" as the primary action, followed by "Practice by Skill".
 */
export const SkillExerciseHub = memo(function SkillExerciseHub({ dispatch }: Props) {
  const { t } = useI18n();
  const { accessibility } = useAccessibility();
  const { state: learnerState } = useLearner();
  const { progress } = useProgress();
  const learnerLevel = learnerState?.preferences?.englishLevel ?? "A1";
  const includeSpeaking = accessibility?.includeSpeaking ?? true;
  const includeListening = accessibility?.includeListening ?? true;
  const numeralSystem = accessibility?.numeralSystem ?? "western";

  // 1. Spaced-Repetition Review Queue Calculations
  const todayStr = getLocalDateString(new Date());

  const memoryItems = useMemo(() => {
    const entries = Object.entries(progress.wordMemory ?? {});
    if (entries.length === 0) return [];
    return entries.flatMap(([wordId, entry]) => {
      const nextDate = entry.nextReviewAt ? entry.nextReviewAt.split("T")[0] : todayStr;
      const daysDiff = calculateDaysBetween(todayStr, nextDate);
      return [{ wordId, entry, daysDiff }];
    });
  }, [progress.wordMemory, todayStr]);

  const overdueList = useMemo(
    () => memoryItems.filter((item) => item.daysDiff < 0).sort((a, b) => a.daysDiff - b.daysDiff),
    [memoryItems]
  );

  const dueTodayList = useMemo(
    () => memoryItems.filter((item) => item.daysDiff === 0),
    [memoryItems]
  );

  const totalDue = overdueList.length + dueTodayList.length;
  const sessionSize = Math.min(REVIEW_SESSION_SIZE, totalDue);

  const startReviewSession = () => {
    const queue = [...overdueList, ...dueTodayList]
      .slice(0, REVIEW_SESSION_SIZE)
      .map((item) => item.wordId);
    if (queue.length === 0) return;

    dispatch({
      type: "START_LESSON",
      lessonId: REVIEW_GROUP_ID,
      mode: "SMART_REVIEW",
      wordQueue: queue,
    });
  };

  // 2. Multimodal Skill Categories & Drills
  const categories = useMemo(
    () => availableCategories(includeSpeaking, includeListening),
    [includeSpeaking, includeListening]
  );

  const [requestedCategory, setActiveCategory] = useState<SkillCategory>("listening");
  const activeCategory = categories.some((c) => c.id === requestedCategory)
    ? requestedCategory
    : (categories[0]?.id ?? "reading");

  const availableExercises = EXERCISES.filter((exercise) =>
    isExerciseAvailableForLevel(exercise, learnerLevel)
  );
  const categoryExercises = availableExercises.filter((e) => e.category === activeCategory);
  const availableCount = countAvailableExercises(includeSpeaking, includeListening, learnerLevel);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full py-2 sm:py-4">
      {/* ── Section 1: Reviews Due Today (Spaced-Repetition Hero) ──────────────── */}
      <section aria-label={t("masteryReview.todayReview")} className="flex flex-col gap-3">
        {totalDue > 0 ? (
          <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-wp-card to-wp-card p-5 sm:p-7 shadow-wp-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="size-20 sm:size-24 rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center shrink-0 shadow-wp-xs">
                <span className="text-3xl sm:text-4xl font-black leading-none">{totalDue}</span>
                <span className="text-[10px] sm:text-xs font-bold uppercase mt-1 tracking-wider opacity-90">
                  {t("masteryReview.wordsDue")}
                </span>
              </div>

              <div className="min-w-0 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <Clock className="size-3.5" aria-hidden="true" />
                    <span>{t("masteryReview.todayReview")}</span>
                  </span>
                  {progress.streak > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-wp-amber bg-wp-amber/10 px-2 py-0.5 rounded-full">
                      <Flame className="size-3.5" aria-hidden="true" />
                      <span>{t("masteryReview.dayStreak", { count: progress.streak })}</span>
                    </span>
                  )}
                </div>

                <h1 className="font-sans text-xl sm:text-2xl font-black text-foreground leading-tight">
                  {t("masteryReview.title")}
                </h1>

                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
                  {t("masteryReview.countsSummary", {
                    overdue: overdueList.length,
                    due: dueTodayList.length,
                  })}
                  {" — "}
                  {t("masteryReview.retentionTip")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                variant="primary"
                size="lg"
                iconLeft={<Play className="size-4 fill-current" aria-hidden="true" />}
                onClick={startReviewSession}
                className="min-h-[48px] px-6 shadow-wp-md"
              >
                {t("masteryReview.reviewNow", { count: sessionSize })}
              </Button>

              <Button
                variant="outline"
                size="lg"
                iconLeft={<BookOpen className="size-4" aria-hidden="true" />}
                onClick={() => dispatch({ type: "GO", to: "review" })}
                className="min-h-[48px]"
              >
                {t("masteryReview.badge")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-wp-card p-5 sm:p-6 shadow-wp-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-xl bg-wp-green/10 text-wp-green flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-6" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="font-sans font-black text-base sm:text-lg text-foreground">
                    {t("masteryReview.allCaughtUp")}
                  </h2>
                  {progress.streak > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-wp-amber bg-wp-amber/10 px-2 py-0.5 rounded-full">
                      <Flame className="size-3.5" aria-hidden="true" />
                      <span>{t("masteryReview.dayStreak", { count: progress.streak })}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {t("masteryReview.subtitle")}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              iconLeft={<RotateCcw className="size-4" aria-hidden="true" />}
              onClick={() => dispatch({ type: "GO", to: "review" })}
              className="min-h-[44px] shrink-0"
            >
              {t("masteryReview.badge")}
            </Button>
          </div>
        )}
      </section>

      {/* ── Section 2: Practice by Skill (Multimodal Skill Drills) ─────────────── */}
      <section aria-labelledby="skill-drills-heading" className="flex flex-col gap-4">
        <PageHeader
          variant="plain"
          headingLevel="h2"
          eyebrow={
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-4 text-wp-amber" aria-hidden="true" />
              <span>
                {t("skillHub.multimodalExercises", {
                  count: formatNumber(availableCount, numeralSystem),
                })}
              </span>
            </span>
          }
          title={t("skillHub.title")}
          subtitle={t("skillHub.subtitle", { count: formatNumber(availableCount, numeralSystem) })}
        />

        {/* Category Filters */}
        <div
          role="group"
          aria-label={t("skillHub.categoriesAria")}
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar snap-x"
        >
          {categories.map(({ id, labelBase, icon: Icon }) => {
            const count = availableExercises.filter((e) => e.category === id).length;
            const categoryLabel =
              id === "listening"
                ? t("skillHub.listening")
                : id === "reading"
                  ? t("skillHub.reading")
                  : id === "speaking"
                    ? t("skillHub.speaking")
                    : id === "writing"
                      ? t("skillHub.writing")
                      : labelBase;

            return (
              <FilterChip
                key={id}
                label={categoryLabel}
                selected={activeCategory === id}
                onToggle={() => setActiveCategory(id)}
                count={count}
                icon={<Icon className="size-4" aria-hidden="true" />}
                size="md"
              />
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
              className="min-h-[44px] bg-wp-card border border-border hover:border-primary/60 hover:bg-primary/5 rounded-2xl p-5 text-start flex flex-col justify-between gap-3 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-all group shadow-wp-xs hover:shadow-wp-sm cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans font-bold text-foreground text-base group-hover:text-primary transition-colors leading-tight">
                    {ex.title}
                  </h3>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-sans text-[10px] font-extrabold text-primary border border-primary/20">
                    {`${ex.minimumLevel ?? "A1"}+`}
                  </span>
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed mt-1.5 line-clamp-2">
                  {ex.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-primary pt-2 border-t border-border/40">
                <span>{t("skillHub.startExercise")}</span>
                <ArrowRight
                  className="size-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform"
                  aria-hidden="true"
                />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
});
