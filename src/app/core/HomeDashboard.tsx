import { memo, useMemo } from "react";
import {
  ArrowRight,
  RotateCcw,
  WifiOff,
  CheckCircle2,
  Trophy,
  Library,
  Target,
  BookOpen,
} from "lucide-react";
import { getDueWordsForReview, type WordLearningState } from "../../features/gamification/sm2";
import { motion } from "framer-motion";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { nextGroupToStudy, resolveUnitForLesson, REVIEW_GROUP_ID } from "../data/lessons";
import { getLocalDateString } from "../../features/gamification/streak";

import { useOfflineReadiness } from "../shared/useOfflineReadiness";
import { useI18n } from "../context/I18nContext";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { PageContainer, Section, Card, Badge, ProgressBar } from "../shared";
import { ReleaseNotesCard } from "./ReleaseNotesCard";
import { LearnerAvatar } from "../shared/LearnerAvatar";
import { staggerContainer, staggerItem } from "../shared/animations";

interface Props {
  dispatch: React.Dispatch<Action>;
}

/** Rough pacing estimate used for the session-length hint on the Today card. */
const SECONDS_PER_WORD = 48;

function getGreetingKey(hour: number): string {
  if (hour < 12) return "dashboard.greetingMorning";
  if (hour < 18) return "dashboard.greetingAfternoon";
  return "dashboard.greetingEvening";
}

export const HomeDashboard = memo(function HomeDashboard({ dispatch }: Props) {
  const { progress } = useProgress();

  const { t } = useI18n();
  const { accessibility } = useAccessibility();
  const num = (v: number) => formatNumber(v, accessibility.numeralSystem);
  const greeting = t(getGreetingKey(new Date().getHours()));

  const activeLesson = useMemo(
    () => nextGroupToStudy((wordId) => progress.wordMemory[wordId]?.mastery === "strong"),
    [progress.wordMemory]
  );
  const lessonWordsSeen = useMemo(
    () => activeLesson.wordIds.filter((id) => progress.wordMemory[id]).length,
    [activeLesson.wordIds, progress.wordMemory]
  );
  const lessonPct = Math.round((lessonWordsSeen / Math.max(1, activeLesson.wordIds.length)) * 100);
  const estimatedMinutes = Math.max(
    1,
    Math.round((activeLesson.wordIds.length * SECONDS_PER_WORD) / 60)
  );
  const activeUnit = useMemo(() => resolveUnitForLesson(activeLesson.id), [activeLesson.id]);
  const dueWords = useMemo(() => getDueWordsForReview(progress.wordMemory), [progress.wordMemory]);
  const todayStr = getLocalDateString(new Date());

  const todayReviewedCount = useMemo(() => {
    let count = 0;
    Object.values(progress.wordMemory).forEach((w) => {
      if (w.lastReviewedAt) {
        const lastStr = getLocalDateString(new Date(w.lastReviewedAt));
        if (lastStr === todayStr) count++;
      }
    });
    return count;
  }, [progress.wordMemory, todayStr]);

  const dailyWordTarget = 10;
  const dailyTargetPct = Math.min(100, Math.round((todayReviewedCount / dailyWordTarget) * 100));
  const isDailyTargetMet = todayReviewedCount >= dailyWordTarget;

  const offline = useOfflineReadiness(activeUnit.id);

  return (
    <PageContainer>
      <ReleaseNotesCard />

      {/* Top Learner Greeting */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative size-12 lg:size-14 shrink-0 rounded-full overflow-hidden border-2 border-primary/20 shadow-wp-xs">
            <LearnerAvatar />
          </div>
          <div>
            <h1 className="font-sans font-black text-foreground text-xl lg:text-2xl leading-tight">
              {greeting}, Learner!
            </h1>
            <p className="font-sans font-medium text-muted-foreground text-xs lg:text-sm mt-0.5">
              Level {progress.englishLevel} · Goal: {num(progress.dailyGoalMinutes)} min/day
            </p>
          </div>
        </div>

        {offline && offline.ready && (
          <Badge variant="teal" size="md" className="hidden sm:flex">
            <WifiOff className="size-3.5" aria-hidden />
            <span>{t("dashboard.offlineReady")}</span>
          </Badge>
        )}
        {offline && !offline.ready && offline.cached > 0 && (
          <Badge variant="muted" size="md" className="hidden sm:flex">
            <WifiOff className="size-3.5" aria-hidden />
            <span>
              {t("dashboard.offlineSaving", { cached: offline.cached, total: offline.total })}
            </span>
          </Badge>
        )}
      </header>

      {/* Main Content (Single Centered Column for maximum clarity) */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6 max-w-2xl mx-auto w-full mt-4"
      >
        {/* SECTION 0: DAILY TARGET PROGRESS */}
        <motion.div variants={staggerItem}>
          <Card variant="default" className="border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-sans font-bold text-sm text-foreground">
                <Target className="size-4 text-primary" aria-hidden />
                <span>Daily Vocabulary Target</span>
              </div>
              {isDailyTargetMet ? (
                <Badge variant="green" size="sm" className="flex items-center gap-1 font-bold">
                  <Trophy className="size-3.5" />
                  <span>Target Met!</span>
                </Badge>
              ) : (
                <Badge variant="muted" size="sm">
                  {num(todayReviewedCount)} / {num(dailyWordTarget)} words
                </Badge>
              )}
            </div>
            <div className="mt-2.5">
              <ProgressBar
                progressPercent={dailyTargetPct}
                label="Today's words practiced"
                labelRight={`${dailyTargetPct}%`}
                ariaLabel={`Daily word target: ${todayReviewedCount} of ${dailyWordTarget} words (${dailyTargetPct}%)`}
              />
            </div>
          </Card>
        </motion.div>

        {/* SECTION 1: TODAY */}
        <motion.div variants={staggerItem}>
          <Section id="section-today" title={t("dashboard.today")}>
            <Card variant="primary">
              <div className="flex items-center justify-between">
                <span className="font-sans font-semibold text-xs text-primary bg-secondary border border-primary/20 px-3 py-1 rounded-full">
                  {activeUnit.name} · ~{num(estimatedMinutes)} min
                </span>
                <span className="font-sans text-xs font-bold text-muted-foreground">
                  {num(lessonWordsSeen)} of {num(activeLesson.wordIds.length)} words
                </span>
              </div>

              <div>
                <h2 className="font-sans font-black text-foreground text-2xl lg:text-3xl mt-4">
                  {activeLesson.name}
                </h2>
                <p className="font-sans text-muted-foreground text-sm mt-1 leading-relaxed">
                  {activeLesson.description}
                </p>
              </div>

              <div className="mt-3">
                <ProgressBar
                  progressPercent={lessonPct}
                  label="Words mastered"
                  labelRight={`${num(lessonWordsSeen)}/${num(activeLesson.wordIds.length)} (${lessonPct}%)`}
                  ariaLabel={`Group progress: ${lessonPct}%`}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "START_LESSON",
                      lessonId: activeLesson.id,
                      mode: "NEW_LESSON",
                      wordQueue: activeLesson.wordIds,
                    })
                  }
                  className="flex-1 w-full bg-primary hover:opacity-90 active:opacity-80 rounded-2xl py-3.5 font-sans font-black text-primary-foreground text-base min-h-[52px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary shadow-wp-md transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="size-5 shrink-0" />
                  <span>{t("dashboard.continueSession")}</span>
                  <ArrowRight className="size-5 shrink-0 rtl:rotate-180" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "GO",
                      to: "learning-materials",
                      unitId: activeUnit.id,
                      area: "learn",
                    })
                  }
                  title={`Study materials for ${activeUnit.name}`}
                  aria-label={`Study materials for ${activeUnit.name}`}
                  className="w-full sm:w-auto px-5 py-3.5 bg-secondary text-primary hover:bg-primary/10 border border-primary/20 rounded-2xl font-sans font-bold text-sm min-h-[52px] flex items-center justify-center gap-2 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue"
                >
                  <Library className="size-4 shrink-0" />
                  <span>Study Guide</span>
                </motion.button>
              </div>
            </Card>
          </Section>
        </motion.div>

        {/* SECTION 2: REVIEW */}
        <motion.div variants={staggerItem}>
          <Section id="section-review" title={t("dashboard.review")}>
            <Card variant="default">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-sans font-bold text-sm">
                  <RotateCcw className="size-4 text-primary" />
                  <span>Spaced Repetition Review</span>
                </div>
                {dueWords.length > 0 ? (
                  <Badge variant="amber" size="sm">
                    {num(dueWords.length)} Due Today
                  </Badge>
                ) : (
                  <Badge variant="green" size="sm">
                    <CheckCircle2 className="size-3.5" />
                    <span>All Caught Up</span>
                  </Badge>
                )}
              </div>
              <p className="font-sans text-muted-foreground text-xs leading-relaxed mt-2">
                {dueWords.length > 0
                  ? `You have ${num(dueWords.length)} vocabulary items scheduled for retention practice based on your forgetting curve.`
                  : "Excellent memory retention! You have reviewed all active vocabulary items for today."}
              </p>
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  if (dueWords.length > 0) {
                    dispatch({
                      type: "START_LESSON",
                      lessonId: REVIEW_GROUP_ID,
                      mode: "SMART_REVIEW",
                      wordQueue: dueWords.slice(0, 15).map((w: WordLearningState) => w.wordId),
                    });
                  } else {
                    dispatch({ type: "GO", to: "practice" });
                  }
                }}
                className="w-full bg-secondary hover:bg-primary/10 text-primary border border-primary/20 rounded-xl py-3 font-sans font-bold text-sm min-h-[44px] transition-colors flex items-center justify-center gap-2 mt-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue"
              >
                <span>
                  {dueWords.length > 0
                    ? `Review ${num(Math.min(15, dueWords.length))} Words Now`
                    : t("dashboard.startReview")}
                </span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </motion.button>
            </Card>
          </Section>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
});
