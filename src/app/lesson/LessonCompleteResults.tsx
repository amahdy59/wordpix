import { memo, useEffect } from "react";
import type { Action, AnswerAttempt, LearnerMode } from "../types";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { Trophy, Star, CheckCircle2, Layers, Sparkles, ShieldCheck } from "lucide-react";
import {
  COURSE_UNITS,
  resolveGroup,
  resolveUnitForLesson,
  getNextGroupChronological,
} from "../data/lessons";
import { getWords } from "../data/vocabulary";
import { useProgress } from "../data/progress";
import { useSound } from "../shared/useSound";

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

  const group = resolveGroup(lessonId, wordQueue);

  const correct = attempts.filter((a) => a.correct).length;
  // 0 attempts = 0% accuracy (never 100%)
  const accuracy = attempts.length === 0 ? 0 : Math.round((correct / attempts.length) * 100);
  const stars = [accuracy >= 50, accuracy >= 75, accuracy >= 90];
  const isStrongSession = accuracy >= 80 && attempts.length > 0;

  const isAssessment = mode === "UNIT_ASSESSMENT";
  const isPreLessonAssessment = mode === "PRE_LESSON_ASSESSMENT";
  const assessmentPassed =
    (isAssessment || isPreLessonAssessment) &&
    accuracy === 100 &&
    attempts.length === wordQueue.length;

  useEffect(() => {
    if (isAssessment) {
      if (unitId && assessmentPassed) {
        // Find all word IDs in the entire unit
        const unit =
          Object.values(COURSE_UNITS).find((u) => u.id === unitId) || COURSE_UNITS[unitId || ""];
        if (unit) {
          const allWordIds = unit.wordIds;
          recordUnitAssessmentCompletion(true, allWordIds);
        }
      }
      recordSessionCompletion(sessionId, attempts, wordQueue);
    } else if (isPreLessonAssessment) {
      if (assessmentPassed) {
        // Instantly master the words in this group
        recordUnitAssessmentCompletion(true, group.wordIds);
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
    group.wordIds,
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

  return (
    <div className="bg-secondary min-h-dvh flex flex-col lg:flex-row lg:overflow-hidden relative">
      {/* ── Desktop Left: Celebration visual ────────────────────────────────── */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:w-1/2 bg-wp-panel relative overflow-hidden px-12">
        <div className="absolute -top-24 -end-24 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-24 size-72 rounded-full bg-wp-amber/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="size-32 rounded-3xl bg-wp-amber/20 border border-wp-amber/30 flex items-center justify-center shadow-2xl">
            <Trophy className="size-16 text-wp-amber" aria-hidden />
          </div>
          <div>
            <span className="font-sans font-bold text-xs text-wp-amber bg-wp-amber/10 border border-wp-amber/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {isAssessment
                ? assessmentPassed
                  ? "Unit Test Passed"
                  : "More Practice Needed"
                : isStrongSession
                  ? "Strong Session"
                  : "Session Complete"}
            </span>
            <h1 className="font-sans font-black text-white text-4xl xl:text-5xl leading-tight tracking-tight mt-2">
              {isAssessment
                ? assessmentPassed
                  ? "Passed!"
                  : "Keep Practicing!"
                : `${group.name} ${isStrongSession ? "Practiced Well!" : "Completed!"}`}
            </h1>
            <p className="font-sans font-semibold text-white/60 text-base mt-2">
              {isAssessment
                ? assessmentPassed
                  ? `You answered every word correctly in this unit test.`
                  : `You need 100% to test out of this unit.`
                : isStrongSession
                  ? `You recalled these ${groupWords.length} words well in this session.`
                  : `You completed practice for ${groupWords.length} words.`}
            </p>
          </div>
          <div
            className="flex gap-3 items-center"
            aria-label={`${stars.filter(Boolean).length} out of 3 stars`}
          >
            {stars.map((filled, i) => (
              <Star
                key={i}
                className={`size-10 ${filled ? "text-wp-amber fill-wp-amber" : "text-white/20"}`}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right / Mobile: Stats + Group Words ───────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between min-h-dvh lg:min-h-0">
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 gap-6 py-8 overflow-y-auto">
          {/* Mobile header */}
          <div className="lg:hidden flex flex-col items-center gap-3 text-center">
            <div className="size-20 rounded-3xl bg-wp-amber/20 border border-wp-amber/30 flex items-center justify-center">
              <Trophy className="size-10 text-wp-amber" aria-hidden />
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-primary bg-secondary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
                {isAssessment
                  ? assessmentPassed
                    ? "Unit Test Passed"
                    : "More Practice Needed"
                  : isStrongSession
                    ? "Strong Session"
                    : "Session Complete"}
              </span>
              <h1 className="font-sans font-black text-foreground text-3xl mt-1">
                {isAssessment ? (assessmentPassed ? "Passed!" : "Keep Practicing!") : group.name}
              </h1>
            </div>
            <p className="font-sans font-semibold text-muted-foreground text-sm">
              {isAssessment
                ? assessmentPassed
                  ? `Answered every word correctly in this unit test.`
                  : `You need 100% to test out of this unit.`
                : isStrongSession
                  ? `Recalled ${groupWords.length} vocabulary words well in this session.`
                  : `Completed session for ${groupWords.length} words.`}
            </p>
            <div
              className="flex gap-2 items-center"
              aria-label={`${stars.filter(Boolean).length} out of 3 stars`}
            >
              {stars.map((filled, i) => (
                <Star
                  key={i}
                  className={`size-8 ${filled ? "text-wp-amber fill-wp-amber" : "text-muted-foreground"}`}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          <div className="hidden lg:block text-center">
            <h2 className="font-sans font-bold text-foreground text-2xl">
              Session Results Breakdown
            </h2>
            <p className="font-sans text-muted-foreground text-sm mt-1">
              Here is your performance for the {group.name} group.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              {
                value: `${groupWords.length}`,
                label: "Group Words",
                color: "text-primary",
                bg: "bg-secondary",
              },
              {
                value: `${accuracy}%`,
                label: "Accuracy",
                color: "text-wp-blue",
                bg: "bg-wp-blue/10",
              },
              {
                value: `+${xp}`,
                label: "XP Earned",
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
                <Sparkles className="size-4 text-wp-amber" aria-hidden />
                <span>How you earned {xp} XP</span>
              </div>
              <dl className="flex flex-col gap-1">
                {[
                  {
                    label: `${correct} correct answer${correct === 1 ? "" : "s"}`,
                    value: xpBreakdown.correctAnswers,
                  },
                  { label: "Lesson completed", value: xpBreakdown.lessonComplete },
                  { label: "Perfect session", value: xpBreakdown.perfectSession },
                  { label: `${progress.streak}-day streak`, value: xpBreakdown.streak },
                ]
                  .filter((row) => row.value > 0)
                  .map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between font-sans text-xs"
                    >
                      <dt className="text-muted-foreground font-medium">{row.label}</dt>
                      <dd className="text-foreground font-bold">+{row.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}

          {/* Mastery Level Upgrades Card */}
          <div className="w-full bg-wp-card border border-primary/30 rounded-2xl p-4 flex flex-col gap-2 shadow-wp-xs">
            <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider">
              <Sparkles className="size-4 text-wp-amber" aria-hidden />
              <span>Word Memory Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-foreground text-sm">Words Practiced</span>
              <span className="font-sans font-bold text-wp-green text-xs bg-wp-green-light px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="size-3.5" />
                SM-2 Scheduled
              </span>
            </div>
          </div>

          {/* Group Words List */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-2 text-foreground font-sans font-bold text-sm">
              <Layers className="size-4 text-primary" />
              <span>Words in Session</span>
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
        </main>

        <footer className="w-full max-w-md mx-auto px-6 pb-8 pt-4 flex flex-col gap-2.5 shrink-0 border-t border-border/60 bg-secondary/50">
          <PrimaryButton
            label={isAssessment ? "Return to Unit" : "Continue to Lessons"}
            onClick={() =>
              dispatch({ type: "GO", to: isAssessment ? "lesson-entry" : "explore", unitId })
            }
          />
          {!isAssessment && (
            <SecondaryButton
              label="Practice Next Group"
              onClick={() =>
                dispatch({
                  type: "START_LESSON",
                  lessonId: nextGroup.id,
                  mode: "NEW_LESSON",
                  wordQueue: nextGroup.wordIds,
                })
              }
            />
          )}
        </footer>
        <HomeIndicator />
      </div>
    </div>
  );
});
