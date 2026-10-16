import { HelpDisclosure } from "../shared/HelpDisclosure";
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
  Headphones,
  PenTool,
} from "lucide-react";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { useLearner } from "../context/LearnerContext";
import { useI18n } from "../context/I18nContext";
import { useProgress } from "../data/progress";
import { REVIEW_GROUP_ID } from "../data/courseCatalog";
import { calculateDaysBetween, getLocalDateString } from "../../features/gamification/streak";
import { Button, FilterChip, PageContainer, PageHeader } from "../shared";
import { getDuePronunciationReviews } from "../learning/foundations/pronunciationProgress";
import { useReviewDate } from "../shared/useReviewDate";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const DEFAULT_REVIEW_SESSION_SIZE = 10;

const CATEGORY_ICONS: Record<SkillCategory, React.ComponentType<{ className?: string }>> = {
  listening: Headphones,
  reading: BookOpen,
  speaking: Mic,
  writing: PenTool,
};

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
  const includePronunciation = accessibility?.includePronunciation ?? true;
  const numeralSystem = accessibility?.numeralSystem ?? "western";

  // 1. Spaced-Repetition Review Queue Calculations
  const reviewDate = useReviewDate();
  const todayStr = getLocalDateString(reviewDate);
  const pronunciationReviews = getDuePronunciationReviews(
    learnerState.pronunciationProgress ?? {},
    reviewDate
  );

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

  const [selectedBatchSize, setSelectedBatchSize] = useState<number>(DEFAULT_REVIEW_SESSION_SIZE);
  const totalDue = overdueList.length + dueTodayList.length;
  const sessionSize = Math.min(selectedBatchSize, totalDue);
  const estimatedMinutes = Math.max(1, Math.ceil(sessionSize * 0.3));

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
      .slice(0, sessionSize)
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
    <PageContainer size="wide" className="gap-4 sm:gap-5">
      <PageHeader variant="plain" headingLevel="h1" title={t("nav.practice")} />

      {/* ── Section 1: Reviews Due Today (Spaced-Repetition Hero) ──────────────── */}
      <section aria-label={t("masteryReview.todayReview")} className="flex flex-col gap-3">
        {totalDue > 0 ? (
          <div className="rounded-2xl border border-primary/30 bg-secondary p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center shrink-0 shadow-wp-xs">
                <span className="text-2xl sm:text-4xl font-bold leading-none">{totalDue}</span>
                <span className="text-xs sm:text-sm font-bold mt-0.5 sm:mt-1">
                  {t("masteryReview.wordsDue")}
                </span>
              </div>

              <div className="min-w-0 flex flex-col gap-1 sm:gap-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary">
                    <Clock className="size-3.5" aria-hidden="true" />
                    <span>{t("masteryReview.todayReview")}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-muted-foreground bg-card px-2 sm:px-2.5 py-0.5 rounded-full border border-border">
                    <Clock className="size-3 text-muted-foreground" aria-hidden="true" />
                    <span>
                      {t("masteryReview.estimatedDuration", {
                        minutes: formatNumber(estimatedMinutes, numeralSystem),
                        defaultValue: `~${estimatedMinutes} min`,
                      })}
                    </span>
                  </span>
                  {progress.streak > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-wp-amber-foreground bg-wp-amber/10 px-2 py-0.5 rounded-full">
                      <Flame className="size-3.5" aria-hidden="true" />
                      <span>{t("masteryReview.dayStreak", { count: progress.streak })}</span>
                    </span>
                  )}
                  {overdueList.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-feedback-error-foreground bg-feedback-error-surface px-2 sm:px-2.5 py-0.5 rounded-full border border-feedback-error-border">
                      <span>
                        {t("dashboard.overdueBadge", {
                          count: formatNumber(overdueList.length, numeralSystem),
                        })}
                      </span>
                    </span>
                  )}
                </div>

                <h2 className="font-sans text-lg sm:text-2xl font-bold text-foreground leading-tight">
                  {t("masteryReview.title")}
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-xl">
                  {t("masteryReview.countsSummary", {
                    overdue: overdueList.length,
                    due: dueTodayList.length,
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
              {totalDue > 10 && (
                <div
                  className="flex items-center gap-1.5 self-start sm:self-center"
                  role="group"
                  aria-label={t("masteryReview.wordsDue")}
                >
                  {[10, totalDue]
                    .filter((size, i, arr) => arr.indexOf(size) === i)
                    .map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedBatchSize(size)}
                        className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-sm font-bold font-sans transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                          selectedBatchSize === size
                            ? "bg-primary text-primary-foreground shadow-wp-xs"
                            : "bg-card text-foreground hover:bg-secondary border border-border"
                        }`}
                        aria-pressed={selectedBatchSize === size}
                      >
                        {size === totalDue
                          ? `${formatNumber(size, numeralSystem)} (${t("action.all", { defaultValue: "All" })})`
                          : `${formatNumber(size, numeralSystem)} (${t("practice.smartBatch", { defaultValue: "Smart" })})`}
                      </button>
                    ))}
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                iconLeft={<Play className="size-4 fill-current" aria-hidden="true" />}
                onClick={startReviewSession}
                className="min-h-[48px] px-6 shadow-wp-xs font-bold rounded-2xl"
              >
                {t("masteryReview.smartReviewAction", {
                  count: formatNumber(sessionSize, numeralSystem),
                  defaultValue: t("masteryReview.reviewNow", {
                    count: formatNumber(sessionSize, numeralSystem),
                    defaultValue: `Smart Review (${formatNumber(sessionSize, numeralSystem)} words)`,
                  }),
                })}
              </Button>

              <Button
                variant="outline"
                size="lg"
                iconLeft={<BookOpen className="size-4" aria-hidden="true" />}
                onClick={() => dispatch({ type: "GO", to: "review" })}
                className="min-h-[48px] rounded-2xl"
              >
                {t("masteryReview.badge")}
              </Button>
            </div>
          </div>
        ) : hasLearningHistory ? (
          <div className="rounded-2xl border border-border bg-wp-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-xl bg-wp-green/10 text-wp-green flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-6" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="font-sans font-bold text-base sm:text-lg text-foreground">
                    {t("masteryReview.allCaughtUp")}
                  </h2>
                  {progress.streak > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-wp-amber-foreground bg-wp-amber/10 px-2 py-0.5 rounded-full">
                      <Flame className="size-3.5" aria-hidden="true" />
                      <span>{t("masteryReview.dayStreak", { count: progress.streak })}</span>
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  {nextScheduledDateStr
                    ? t("practice.nextScheduled", {
                        time: nextScheduledDateStr,
                        defaultValue: `Next reviews scheduled for ${nextScheduledDateStr}. Great job keeping your memory strong!`,
                      })
                    : t("masteryReview.allCaughtUpDesc", {
                        defaultValue:
                          "You're all caught up! Practice any skill below to strengthen memory.",
                      })}
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
          <div className="rounded-2xl border border-primary/25 bg-secondary p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
                <BookOpen className="size-6" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="font-sans font-bold text-base sm:text-lg text-foreground">
                  {t("practice.noReviewsTitle", { defaultValue: "No reviews due yet" })}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
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
        {includePronunciation && pronunciationReviews.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {t("pronunciationEnhancements.dueTitle")}
              </h2>
              <p className="text-sm text-foreground">
                {t("pronunciationEnhancements.dueDescription", {
                  count: pronunciationReviews.reduce(
                    (count, review) => count + review.targets.length,
                    0
                  ),
                })}
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() =>
                dispatch({
                  type: "OPEN_FIGMA_PRONUNCIATION",
                  lessonNumber: pronunciationReviews[0].lessonNumber,
                })
              }
            >
              {t("pronunciationEnhancements.reviewAction")}
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
            <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
              <Sparkles className="size-4 text-wp-amber-foreground" aria-hidden="true" />
              <span>
                {t("skillHub.multimodalExercises", {
                  count: formatNumber(availableCount, numeralSystem),
                  level: learnerLevel,
                })}
              </span>
            </span>
          }
          title={t("skillHub.title")}
        />

        {/* Category Filters */}
        <div
          role="radiogroup"
          aria-label={t("skillHub.categoriesAria")}
          className="grid grid-cols-2 gap-2 p-1 sm:flex sm:flex-wrap"
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
        <div className="flex flex-col divide-y divide-border">
          {categoryExercises.map((ex) => (
            <article key={ex.id} className="relative">
              <button
                type="button"
                onClick={() => dispatch({ type: "OPEN_SKILL_EXERCISE", exerciseId: ex.id })}
                className="w-full min-h-[44px] hover:bg-secondary rounded-xl py-4 px-3 pe-16 text-start flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-primary border border-primary/20">
                        {(() => {
                          const IconComp = CATEGORY_ICONS[ex.category] ?? Headphones;
                          return <IconComp className="size-3" aria-hidden="true" />;
                        })()}
                        <span>{t(`skillHub.${ex.category}`, { defaultValue: ex.category })}</span>
                      </span>
                      <h3 className="font-sans font-bold text-foreground text-base group-hover:text-primary transition-colors leading-tight">
                        {t(`skillHub.exercises.${ex.id}.title`)}
                      </h3>
                    </div>
                    <span className="shrink-0 font-sans text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                      {`${ex.minimumLevel ?? "A1"}+`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {!ex.isTimed && (
                      <span className="text-sm font-semibold text-muted-foreground">
                        {t("skillHub.estimatedTime")}
                      </span>
                    )}
                    {ex.requiresMic && (
                      <span className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-muted-foreground">
                        <Mic className="size-3" aria-hidden="true" />
                        <span>
                          {t("skillHub.micRequired", { defaultValue: "Microphone required" })}
                        </span>
                      </span>
                    )}
                    {ex.isTimed && (
                      <span className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-muted-foreground">
                        <Clock className="size-3" aria-hidden="true" />
                        <span>{t("skillHub.timedDrill", { defaultValue: "Timed drill" })}</span>
                      </span>
                    )}
                    {!ex.isTimed && (
                      <span className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-muted-foreground">
                        <span>{t("skillHub.selfPaced", { defaultValue: "Self-paced" })}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 text-sm font-sans font-bold text-primary">
                  <span>{t("skillHub.startExercise")}</span>
                  <ArrowRight
                    className="size-4 motion-safe:group-hover:translate-x-1 rtl:motion-safe:group-hover:-translate-x-1 rtl:rotate-180 motion-safe:transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </button>
              <HelpDisclosure
                variant="icon"
                label={t("help.aboutTopic", { title: t(`skillHub.exercises.${ex.id}.title`) })}
                className="absolute end-2 top-2 z-10"
              >
                {t(`skillHub.exercises.${ex.id}.description`)}
              </HelpDisclosure>
            </article>
          ))}
        </div>
      </section>
    </PageContainer>
  );
});
