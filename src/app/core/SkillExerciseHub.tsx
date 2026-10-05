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
  Mic,
} from "lucide-react";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { useLearner } from "../context/LearnerContext";
import { useI18n } from "../context/I18nContext";
import { useProgress } from "../data/progress";
import { REVIEW_GROUP_ID } from "../data/courseCatalog";
import { calculateDaysBetween, getLocalDateString } from "../../features/gamification/streak";
import { Button, FilterChip, PageContainer, PageHeader } from "../shared";

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

  const hasLearningHistory =
    (learnerState.learnerProgress?.sessionsCompleted ?? 0) > 0 ||
    Object.keys(progress.wordMemory ?? {}).length > 0;

  const nextScheduledDateStr = useMemo(() => {
    const futureItems = memoryItems.filter((item) => item.daysDiff > 0);
    if (futureItems.length === 0) return null;
    futureItems.sort((a, b) => a.daysDiff - b.daysDiff);
    const closest = futureItems[0];
    if (closest.daysDiff === 1) return t("practice.tomorrow", { defaultValue: "tomorrow" });
    return t("practice.inDays", {
      count: closest.daysDiff,
      defaultValue: `in ${closest.daysDiff} days`,
    });
  }, [memoryItems, t]);

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
    <PageContainer size="wide" className="gap-7 sm:gap-8">
      <PageHeader variant="plain" headingLevel="h1" title={t("nav.practice")} />

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

                <h2 className="font-sans text-xl sm:text-2xl font-black text-foreground leading-tight">
                  {t("masteryReview.title")}
                </h2>

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
        ) : hasLearningHistory ? (
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
                  {nextScheduledDateStr
                    ? t("practice.nextScheduled", {
                        time: nextScheduledDateStr,
                        defaultValue: `Next reviews scheduled for ${nextScheduledDateStr}. Great job keeping your memory strong!`,
                      })
                    : t("masteryReview.subtitle")}
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
              {t("masteryReview.viewSchedule")}
            </Button>
          </div>
        ) : (
          <div className="rounded-3xl border border-primary/25 bg-primary/5 p-5 sm:p-6 shadow-wp-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <BookOpen className="size-6" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="font-sans font-black text-base sm:text-lg text-foreground">
                  {t("practice.noReviewsTitle", { defaultValue: "No reviews due yet" })}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {t("practice.noReviewsDesc", {
                    defaultValue:
                      "Spaced-repetition reviews appear here after you study your first vocabulary unit.",
                  })}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              iconLeft={<Play className="size-4 fill-current" aria-hidden="true" />}
              onClick={() => dispatch({ type: "GO", to: "learn" })}
              className="min-h-[44px] shrink-0"
            >
              {t("practice.startLearning", { defaultValue: "Start First Lesson" })}
            </Button>
          </div>
        )}
      </section>

      {/* ── Section 2: Practice by Skill (Multimodal Skill Drills) ─────────────── */}
      <section aria-labelledby="skill-drills-heading" className="flex flex-col gap-4">
        <PageHeader
          variant="plain"
          headingLevel="h2"
          titleId="skill-drills-heading"
          eyebrow={
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-4 text-wp-amber" aria-hidden="true" />
              <span>
                {t("skillHub.multimodalExercises", {
                  count: formatNumber(availableCount, numeralSystem),
                  level: learnerLevel,
                })}
              </span>
            </span>
          }
          title={t("skillHub.title")}
          subtitle={t("skillHub.subtitle")}
        />

        {/* Category Filters */}
        <div
          role="radiogroup"
          aria-label={t("skillHub.categoriesAria")}
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,9rem),1fr))] gap-2 p-1 sm:flex sm:flex-wrap"
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
                selectionMode="single"
                onToggle={() => setActiveCategory(id)}
                count={count}
                icon={<Icon className="size-4" aria-hidden="true" />}
                size="md"
              />
            );
          })}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
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
                    {t(`skillHub.exercises.${ex.id}.title`)}
                  </h3>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-sans text-[10px] font-extrabold text-primary border border-primary/20">
                    {`${ex.minimumLevel ?? "A1"}+`}
                  </span>
                </div>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed mt-1.5">
                  {t(`skillHub.exercises.${ex.id}.description`)}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {ex.requiresMic && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-sans text-[10px] font-bold text-primary border border-primary/20">
                      <Mic className="size-3" aria-hidden="true" />
                      <span>
                        {t("skillHub.micRequired", { defaultValue: "Microphone required" })}
                      </span>
                    </span>
                  )}
                  {ex.isTimed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-wp-amber/10 px-2 py-0.5 font-sans text-[10px] font-bold text-wp-amber border border-wp-amber/20">
                      <Clock className="size-3" aria-hidden="true" />
                      <span>{t("skillHub.timedDrill", { defaultValue: "Timed drill" })}</span>
                    </span>
                  )}
                  {!ex.isTimed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 font-sans text-[10px] font-semibold text-muted-foreground">
                      <span>{t("skillHub.selfPaced", { defaultValue: "Self-paced" })}</span>
                    </span>
                  )}
                </div>
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
    </PageContainer>
  );
});
