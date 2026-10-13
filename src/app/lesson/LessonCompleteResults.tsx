import { memo, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Action, AnswerAttempt, LearnerMode } from "../types";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { Trophy, Star, CheckCircle2, Layers, Sparkles, ShieldCheck } from "lucide-react";
import {
  resolveGroup,
  resolveUnitForLesson,
  getNextGroupChronological,
} from "../data/courseCatalog";
import { getWords } from "../data/vocabulary";
import { useProgress } from "../data/progress";
import { useSound } from "../shared/useSound";
import { useI18n } from "../../i18n";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { ASSESSMENT_PASS_PERCENT } from "./assessmentBlueprint";

interface Props {
  sessionId?: string;
  attempts: AnswerAttempt[];
  lessonId?: string;
  unitId?: string;
  mode?: LearnerMode;
  wordQueue?: string[];
  dispatch: React.Dispatch<Action>;
}

export const LessonCompleteResults = memo(function LessonCompleteResults({
  sessionId = "sess_default",
  attempts,
  lessonId = "essential-furniture",
  unitId,
  mode = "NEW_LESSON",
  wordQueue = ["bed", "nightstand", "dresser", "wardrobe", "desk"],
  dispatch,
}: Props) {
  const { progress, recordSessionCompletion, recordUnitAssessmentCompletion } = useProgress();
  const { playLevelUp } = useSound();
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  const group = resolveGroup(lessonId, wordQueue);

  const correct = attempts.filter((a) => a.correct).length;
  // 0 attempts = 0% accuracy (never 100%)
  const accuracy = attempts.length === 0 ? 0 : Math.round((correct / attempts.length) * 100);
  const stars = [accuracy >= 50, accuracy >= 75, accuracy >= 90];
  const isStrongSession = accuracy >= 80 && attempts.length > 0;

  const isAssessment = mode === "UNIT_ASSESSMENT";
  const isPreLessonAssessment = mode === "PRE_LESSON_ASSESSMENT";
  const attemptedWordIds = new Set(attempts.map((attempt) => attempt.wordId));
  const hasFullCoverage = wordQueue.every((wordId) => attemptedWordIds.has(wordId));
  const assessmentPassed =
    (isAssessment || isPreLessonAssessment) &&
    accuracy >= ASSESSMENT_PASS_PERCENT &&
    hasFullCoverage;

  useEffect(() => {
    if (isAssessment) {
      if (assessmentPassed) recordUnitAssessmentCompletion(true, wordQueue);
      recordSessionCompletion(sessionId, attempts, wordQueue);
    } else if (isPreLessonAssessment) {
      if (assessmentPassed) {
        recordUnitAssessmentCompletion(true, wordQueue);
      }
      recordSessionCompletion(sessionId, attempts, wordQueue);
    } else {
      recordSessionCompletion(sessionId, attempts, wordQueue);
    }

    if ((isAssessment || isPreLessonAssessment) && !assessmentPassed) {
      // Did not pass the assessment
    } else {
      playLevelUp();
    }
  }, [
    sessionId,
    attempts,
    wordQueue,
    recordSessionCompletion,
    recordUnitAssessmentCompletion,
    playLevelUp,
    isAssessment,
    isPreLessonAssessment,
    assessmentPassed,
    unitId,
  ]);

  // Read the credited amount back out of the ledger rather than recomputing it.
  // This screen used to run its own `correct * 10`, which was a fourth
  // independent XP formula in the codebase and could not stay in step with the
  // bonuses.
  const sessionRecord = progress.sessionHistory.find((s) => s.sessionId === sessionId);
  const xpBreakdown = sessionRecord?.xp;
  const xp = xpBreakdown?.total ?? 0;

  const groupWords = getWords(wordQueue, resolveUnitForLesson(lessonId).id);
  const nextGroup = getNextGroupChronological(lessonId);

  const { accessibility } = useAccessibility();
  const num = (v: number) => formatNumber(v, accessibility.numeralSystem);

  const badgeLabel = isAssessment
    ? assessmentPassed
      ? t("lesson.unitTestPassed")
      : t("lesson.morePracticeNeeded")
    : isStrongSession
      ? t("lesson.strongSession")
      : t("lesson.sessionComplete");

  const titleText = isAssessment
    ? assessmentPassed
      ? t("lesson.passedTitle")
      : t("lesson.keepPracticingTitle")
    : isStrongSession
      ? t("lesson.groupPracticedWell", { group: group.name })
      : t("lesson.groupCompleted", { group: group.name });

  const descText = isAssessment
    ? assessmentPassed
      ? t("lesson.assessmentPassedDesc")
      : t("lesson.assessmentFailedDesc", { percent: num(ASSESSMENT_PASS_PERCENT) })
    : isStrongSession
      ? t("lesson.strongSessionDesc", { count: num(groupWords.length) })
      : t("lesson.completedSessionDesc", { count: num(groupWords.length) });

  const starsAriaLabel = t("lesson.starsLabel", { count: num(stars.filter(Boolean).length) });

  return (
    <div className="bg-secondary min-h-dvh flex flex-col lg:flex-row lg:overflow-hidden relative">
      {/* ── Desktop Left: Celebration visual ────────────────────────────────── */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:w-1/2 bg-wp-panel relative overflow-hidden px-12">
        <div className="absolute -top-24 -end-24 size-72 rounded-full bg-secondary blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-24 size-72 rounded-full bg-wp-amber/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <motion.div
            initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 20 }
            }
            className="size-32 rounded-3xl bg-wp-amber/20 border border-wp-amber/30 flex items-center justify-center shadow-2xl"
          >
            <Trophy className="size-16 text-wp-amber-foreground" aria-hidden />
          </motion.div>
          <div>
            <span className="font-sans font-bold text-xs text-wp-amber-foreground bg-wp-amber/10 border border-wp-amber/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {badgeLabel}
            </span>
            <h1 className="font-sans font-black text-white text-4xl xl:text-5xl leading-tight tracking-tight mt-2">
              {titleText}
            </h1>
            <p className="font-sans font-semibold text-wp-text-on-panel-muted text-base mt-2">
              {descText}
            </p>
          </div>
          <motion.div
            initial={reduceMotion ? false : { y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { delay: 0.2, type: "spring", stiffness: 300, damping: 20 }
            }
            className="flex gap-3 items-center"
            aria-label={starsAriaLabel}
          >
            {stars.map((filled, i) => (
              <Star
                key={i}
                className={`size-10 ${filled ? "text-wp-amber-foreground fill-wp-amber" : "text-white/20"}`}
                aria-hidden
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right / Mobile: Stats + Group Words ───────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between min-h-dvh lg:min-h-0">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 gap-6 py-8 overflow-y-auto">
          {/* Mobile header */}
          <div className="lg:hidden flex flex-col items-center gap-3 text-center">
            <motion.div
              initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={
                reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 20 }
              }
              className="size-20 rounded-3xl bg-wp-amber/20 border border-wp-amber/30 flex items-center justify-center"
            >
              <Trophy className="size-10 text-wp-amber-foreground" aria-hidden />
            </motion.div>
            <div>
              <span className="font-sans font-bold text-xs text-primary bg-secondary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
                {badgeLabel}
              </span>
              <h1 className="font-sans font-black text-foreground text-3xl mt-1">{titleText}</h1>
            </div>
            <p className="font-sans font-semibold text-muted-foreground text-sm">{descText}</p>
            <motion.div
              initial={reduceMotion ? false : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { delay: 0.2, type: "spring", stiffness: 300, damping: 20 }
              }
              className="flex gap-2 items-center"
              aria-label={starsAriaLabel}
            >
              {stars.map((filled, i) => (
                <Star
                  key={i}
                  className={`size-8 ${filled ? "text-wp-amber-foreground fill-wp-amber" : "text-muted-foreground"}`}
                  aria-hidden
                />
              ))}
            </motion.div>
          </div>

          <div className="hidden lg:block text-center">
            <h2 className="font-sans font-bold text-foreground text-2xl">
              {t("lesson.sessionBreakdown")}
            </h2>
            <p className="font-sans text-muted-foreground text-sm mt-1">
              {t("lesson.performanceForGroup", { group: group.name })}
            </p>
          </div>

          {/* Progress save confirmation banner */}
          <div
            className="w-full flex items-center justify-between gap-3 rounded-2xl bg-card border border-border p-3.5 shadow-wp-xs"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-wp-green-light">
                <CheckCircle2 className="size-4 text-wp-green" aria-hidden />
              </div>
              <div className="text-start min-w-0">
                <p className="font-sans text-xs font-bold text-foreground truncate">
                  {t("lesson.progressSavedTitle")}
                </p>
                <p className="font-sans text-[11px] text-muted-foreground truncate">
                  {t("lesson.progressSavedDevice")}
                </p>
              </div>
            </div>
            <span className="font-sans text-[10px] font-black uppercase tracking-wider text-wp-green bg-wp-green-light px-2.5 py-1 rounded-full shrink-0">
              {t("lesson.savedStatus")}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              {
                value: num(groupWords.length),
                label: t("lesson.groupWords"),
                color: "text-primary",
                bg: "bg-secondary",
              },
              {
                value: `${num(accuracy)}%`,
                label: t("lesson.accuracy"),
                color: "text-wp-blue-foreground",
                bg: "bg-wp-blue/10",
              },
              {
                value: `+${num(xp)}`,
                label: t("lesson.xpEarned"),
                color: "text-wp-green",
                bg: "bg-wp-green-light",
              },
            ].map(({ value, label, color, bg }) => (
              <div
                key={label}
                className={`${bg} rounded-2xl border border-border p-3.5 flex flex-col items-center gap-1`}
              >
                <p className={`font-sans font-black text-2xl ${color}`}>{value}</p>
                <p className="font-sans font-medium text-muted-foreground text-[11px] text-center leading-tight">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* XP breakdown — every line here is a real credit from XP_RULES,
              so the total above is explainable rather than an opaque number. */}
          {xpBreakdown && xp > 0 && (
            <div className="w-full bg-wp-card border border-border rounded-2xl p-4 flex flex-col gap-1.5 shadow-wp-xs">
              <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider mb-0.5">
                <Sparkles className="size-4 text-wp-amber-foreground" aria-hidden />
                <span>{t("lesson.howEarnedXp", { xp: num(xp) })}</span>
              </div>
              <dl className="flex flex-col gap-1">
                {[
                  {
                    label:
                      correct === 1
                        ? t("lesson.correctAnswerSingular")
                        : t("lesson.correctAnswersCount", { count: num(correct) }),
                    value: xpBreakdown.correctAnswers,
                  },
                  { label: t("lesson.lessonCompletedBonus"), value: xpBreakdown.lessonComplete },
                  { label: t("lesson.perfectSessionBonus"), value: xpBreakdown.perfectSession },
                  {
                    label: t("lesson.streakBonus", { streak: num(progress.streak) }),
                    value: xpBreakdown.streak,
                  },
                ]
                  .filter((row) => row.value > 0)
                  .map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between font-sans text-xs"
                    >
                      <dt className="text-muted-foreground font-medium">{row.label}</dt>
                      <dd className="text-foreground font-bold">+{num(row.value)}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}

          {/* Mastery Level Upgrades Card */}
          <div className="w-full bg-wp-card border border-primary/30 rounded-2xl p-4 flex flex-col gap-2 shadow-wp-xs">
            <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider">
              <Sparkles className="size-4 text-wp-amber-foreground" aria-hidden />
              <span>{t("lesson.wordMemoryProgress")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-foreground text-sm">
                {t("lesson.wordsPracticed")}
              </span>
              <span className="font-sans font-bold text-wp-green text-xs bg-wp-green-light px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="size-3.5" />
                {t("lesson.sm2Scheduled")}
              </span>
            </div>
          </div>

          {/* Group Words List */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-2 text-foreground font-sans font-bold text-sm">
              <Layers className="size-4 text-primary" />
              <span>{t("lesson.wordsInSession")}</span>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              {groupWords.map((w) => (
                <div
                  key={w?.id}
                  className="bg-wp-card border border-border rounded-xl px-3.5 py-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-wp-green" />
                    <span className="font-sans font-bold text-foreground text-sm">{w?.label}</span>
                  </div>
                  <span className="font-sans text-xs text-muted-foreground">/{w?.phonetic}/</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="w-full max-w-md mx-auto px-6 pb-8 pt-4 flex flex-col gap-2.5 shrink-0 border-t border-border/60 bg-secondary/50">
          {isAssessment ? (
            <>
              <PrimaryButton
                label={assessmentPassed ? t("lesson.continueCurriculum") : t("lesson.returnToUnit")}
                onClick={() =>
                  dispatch({
                    type: "GO",
                    to: assessmentPassed ? "explore" : "lesson-entry",
                    unitId,
                  })
                }
              />
              <SecondaryButton
                label={
                  assessmentPassed ? t("lesson.viewUnitOverview") : t("lesson.backToLearningPath")
                }
                onClick={() =>
                  dispatch({
                    type: "GO",
                    to: assessmentPassed ? "lesson-entry" : "explore",
                    unitId,
                  })
                }
              />
            </>
          ) : (
            <>
              {nextGroup ? (
                <>
                  <PrimaryButton
                    label={t("lesson.practiceNextGroup")}
                    onClick={() =>
                      dispatch({
                        type: "START_LESSON",
                        lessonId: nextGroup.id,
                        unitId: resolveUnitForLesson(nextGroup.id).id,
                        mode: "NEW_LESSON",
                        wordQueue: nextGroup.wordIds,
                      })
                    }
                  />
                  <SecondaryButton
                    label={t("lesson.backToLearningPath")}
                    onClick={() => dispatch({ type: "GO", to: "explore" })}
                  />
                </>
              ) : (
                <PrimaryButton
                  label={t("lesson.continueCurriculum")}
                  onClick={() => dispatch({ type: "GO", to: "explore" })}
                />
              )}
            </>
          )}
        </footer>
        <HomeIndicator />
      </div>
    </div>
  );
});
