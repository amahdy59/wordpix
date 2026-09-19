import { memo, useMemo } from "react";
import {
  ArrowRight,
  RotateCcw,
  WifiOff,
  CheckCircle2,
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
              {t("dashboard.welcomeLearner", { greeting })}
            </h1>
            <p className="font-sans font-medium text-muted-foreground text-xs lg:text-sm mt-0.5">
              {t("dashboard.levelGoal", {
                level: progress.englishLevel,
                goal: num(progress.dailyGoalMinutes),
              })}
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

      <section
        aria-label={t("dashboard.dailyTarget")}
        className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-border bg-wp-card px-4 py-3"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Target className="size-4 text-primary" aria-hidden />
          <span>{t("dashboard.dailyTarget")}</span>
        </div>
        <div
          className="h-2 min-w-24 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label={`Daily word target: ${todayReviewedCount} of ${dailyWordTarget} words`}
          aria-valuemin={0}
          aria-valuemax={dailyWordTarget}
          aria-valuenow={Math.min(todayReviewedCount, dailyWordTarget)}
        >
          <div
            className="h-full rounded-full bg-primary motion-safe:transition-all"
            style={{ width: `${dailyTargetPct}%` }}
          />
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          {isDailyTargetMet
            ? t("dashboard.targetMet")
            : t("dashboard.wordsProgress", {
                current: num(todayReviewedCount),
                total: num(dailyWordTarget),
              })}
        </span>
      </section>

      {/* Main Content: 1 Column on Mobile/Tablet, 2 Column Grid on Desktop (lg+) */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-5xl mx-auto w-full mt-4"
      >
        {/* LEFT COLUMN: Main Learning Loop (lg:col-span-7) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* SECTION 1: TODAY'S LESSON */}
          <motion.div variants={staggerItem}>
            <Section id="section-today" title={t("dashboard.today")}>
              <Card variant="primary">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-xs text-primary bg-secondary border border-primary/20 px-3 py-1 rounded-full">
                    {t("dashboard.unitEstimate", {
                      unit: activeUnit.name,
                      min: num(estimatedMinutes),
                    })}
                  </span>
                  <span className="font-sans text-xs font-bold text-muted-foreground">
                    {t("dashboard.wordsOfTotal", {
                      current: num(lessonWordsSeen),
                      total: num(activeLesson.wordIds.length),
                    })}
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
                    title={t("dashboard.studyGuideAria", { unit: activeUnit.name })}
                    aria-label={t("dashboard.studyGuideAria", { unit: activeUnit.name })}
                    className="w-full sm:w-auto px-5 py-3.5 bg-secondary text-primary hover:bg-primary/10 border border-primary/20 rounded-2xl font-sans font-bold text-sm min-h-[52px] flex items-center justify-center gap-2 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue"
                  >
                    <Library className="size-4 shrink-0" />
                    <span>{t("dashboard.studyGuide")}</span>
                  </motion.button>
                </div>
              </Card>
            </Section>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Review Queue & Spaced Repetition (lg:col-span-5) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* SECTION 2: REVIEW */}
          <motion.div variants={staggerItem}>
            <Section id="section-review" title={t("dashboard.review")}>
              {dueWords.length > 0 ? (
                <Card variant="default">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground font-sans font-bold text-sm">
                      <RotateCcw className="size-4 text-primary" />
                      <span>{t("dashboard.srsReview")}</span>
                    </div>
                    <Badge variant="amber" size="sm">
                      {t("dashboard.dueToday", { count: num(dueWords.length) })}
                    </Badge>
                  </div>
                  <p className="font-sans text-muted-foreground text-xs leading-relaxed mt-2">
                    {t("dashboard.retentionPractice", { count: num(dueWords.length) })}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "START_LESSON",
                        lessonId: REVIEW_GROUP_ID,
                        mode: "SMART_REVIEW",
                        wordQueue: dueWords.slice(0, 15).map((w: WordLearningState) => w.wordId),
                      })
                    }
                    className="w-full bg-secondary hover:bg-primary/10 text-primary border border-primary/20 rounded-xl py-3 font-sans font-bold text-sm min-h-[44px] transition-colors flex items-center justify-center gap-2 mt-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-blue"
                  >
                    <span>{`Review ${num(Math.min(15, dueWords.length))} Words Now`}</span>
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </motion.button>
                </Card>
              ) : (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-2xl border border-wp-green/30 bg-wp-green-light/30 px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-wp-green" aria-hidden />
                  <div className="min-w-0">
                    <Badge variant="green" size="sm">
                      <span>{t("dashboard.allCaughtUp")}</span>
                    </Badge>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground">
                      {t("dashboard.excellentRetention")}
                    </p>
                  </div>
                </div>
              )}
            </Section>
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
});
