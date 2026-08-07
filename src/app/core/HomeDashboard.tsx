import { memo, useMemo } from "react";
import { Flame, ArrowRight, RotateCcw, WifiOff, Layers } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { BEDROOM_GROUPS } from "../data/lessons";
import { calculateDaysBetween, getLocalDateString, getWeekActivity } from "../../features/gamification/streak";
import { useOfflineReadiness } from "../shared/useOfflineReadiness";
import { useI18n } from "../context/I18nContext";

const imgAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

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
  const todayStr = getLocalDateString(new Date());
  const greeting = t(getGreetingKey(new Date().getHours()));

  const memoryValues = useMemo(() => Object.values(progress.wordMemory), [progress.wordMemory]);
  const strongCount = useMemo(() => memoryValues.filter((w) => w.mastery === "strong").length, [memoryValues]);
  const learningCount = useMemo(() => memoryValues.filter((w) => w.mastery === "learning" || w.mastery === "familiar").length, [memoryValues]);

  const dueCount = useMemo(() => {
    return memoryValues.filter((w) => {
      if (!w.nextReviewAt) return true;
      const nextDateStr = getLocalDateString(new Date(w.nextReviewAt));
      return calculateDaysBetween(todayStr, nextDateStr) <= 0;
    }).length;
  }, [memoryValues, todayStr]);

  const weekActivity = useMemo(
    () => getWeekActivity(progress.sessionHistory.map((s) => s.completedAt)),
    [progress.sessionHistory]
  );

  // The Today card resumes the first group; report its real coverage, not a constant.
  const activeGroup = BEDROOM_GROUPS[0];
  const groupWordsSeen = useMemo(
    () => activeGroup.wordIds.filter((id) => progress.wordMemory[id]).length,
    [activeGroup.wordIds, progress.wordMemory]
  );
  const estimatedMinutes = Math.max(1, Math.round((activeGroup.wordIds.length * SECONDS_PER_WORD) / 60));

  const offline = useOfflineReadiness("bedroom");

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-10 max-w-6xl mx-auto w-full">
      {/* Top Learner Greeting */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative size-12 md:size-14 shrink-0 rounded-full overflow-hidden border-2 border-primary/20 shadow-wp-xs">
            <img
              alt="WordPix learner profile"
              className="absolute inset-0 object-cover size-full"
              src={imgAvatar}
              loading="eager"
            />
          </div>
          <div>
            <h1 className="font-sans font-black text-foreground text-xl md:text-2xl leading-tight">
              {greeting}, Learner!
            </h1>
            <p className="font-sans font-medium text-muted-foreground text-xs md:text-sm mt-0.5">
              Level {progress.englishLevel} · Goal: {progress.dailyGoalMinutes} min/day
            </p>
          </div>
        </div>

        {offline && offline.ready && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-sans font-semibold text-wp-teal bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
            <WifiOff className="size-3.5" aria-hidden />
            <span>{t("dashboard.offlineReady")}</span>
          </div>
        )}
        {offline && !offline.ready && offline.cached > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-sans font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
            <WifiOff className="size-3.5" aria-hidden />
            <span>{t("dashboard.offlineSaving", { cached: offline.cached, total: offline.total })}</span>
          </div>
        )}
      </header>

      {/* 35 Specialized Skill Exercises Quick Hub Card */}
      <section aria-label="35 Specialized Skill Drills">
        <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800 shadow-wp-md">
          <div className="flex items-center gap-4">
            <div className="size-12 md:size-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md">
              <Layers className="size-6 md:size-7" />
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-wp-amber bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                35 Specialized Screens
              </span>
              <h2 className="font-sans font-black text-white text-lg md:text-xl mt-1">
                Multimodal Skill Exercises Suite
              </h2>
              <p className="font-sans text-xs text-white/70 mt-0.5">
                Practice Listening, Reading, Speaking, and Writing drills.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "skill-hub" })}
            className="w-full md:w-auto bg-primary hover:opacity-90 active:opacity-80 rounded-xl py-3 px-5 font-sans font-bold text-primary-foreground text-sm flex items-center justify-center gap-2 shrink-0 min-h-[44px] shadow-sm transition-all"
          >
            <span>Open Exercise Hub (35)</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* Main Grid: TODAY + REVIEW (Left) | YOUR LEARNING + THIS WEEK (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* ── LEFT COLUMN ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* SECTION 1: TODAY */}
          <section aria-labelledby="section-today" className="flex flex-col gap-3">
            <span id="section-today" className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground">
              {t("dashboard.today")}
            </span>
            <div className="bg-wp-card rounded-3xl border border-primary/30 p-6 flex flex-col gap-4 shadow-wp-xs hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-sans font-semibold text-xs text-primary bg-secondary border border-primary/20 px-3 py-1 rounded-full">
                  {activeGroup.name} · ~{estimatedMinutes} min
                </span>
                <span className="font-sans text-xs font-bold text-muted-foreground">
                  {groupWordsSeen} of {activeGroup.wordIds.length} words
                </span>
              </div>

              <div>
                <h2 className="font-sans font-black text-foreground text-2xl md:text-3xl">
                  Continue Bedroom
                </h2>
                <p className="font-sans text-muted-foreground text-sm mt-1 leading-relaxed">
                  Master key furniture &amp; bedroom items through visual discovery and active recall.
                </p>
              </div>

              <button
                type="button"
                onClick={() => dispatch({ type: "START_LESSON" })}
                className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3.5 font-sans font-bold text-wp-text-on-blue text-base min-h-[48px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{t("dashboard.continueSession")}</span>
                <ArrowRight className="size-5" />
              </button>
            </div>
          </section>

          {/* SECTION 2: REVIEW */}
          <section aria-labelledby="section-review" className="flex flex-col gap-3">
            <span id="section-review" className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground">
              {t("dashboard.review")}
            </span>
            <div className="bg-wp-card rounded-3xl border border-border p-6 flex flex-col gap-4 shadow-wp-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-sans font-bold text-sm">
                  <RotateCcw className="size-4 text-primary" />
                  <span>Spaced Repetition</span>
                </div>
                <span className="font-sans font-bold text-xs text-wp-amber bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {dueCount} words ready · ~3 min
                </span>
              </div>
              <p className="font-sans text-muted-foreground text-xs leading-relaxed">
                Review words scheduled for memory retention before decay occurs.
              </p>
              <button
                type="button"
                onClick={() => dispatch({ type: "GO", to: "practice" })}
                className="w-full bg-secondary hover:bg-primary/10 text-primary border border-primary/20 rounded-xl py-3 font-sans font-bold text-sm min-h-[44px] transition-all flex items-center justify-center gap-2"
              >
                <span>{t("dashboard.startReview")}</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* SECTION 3: YOUR LEARNING */}
          <section aria-labelledby="section-learning" className="flex flex-col gap-3">
            <span id="section-learning" className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground">
              {t("dashboard.yourLearning")}
            </span>
            <div className="bg-wp-card rounded-3xl border border-border p-6 flex flex-col gap-4 shadow-wp-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-wp-green-light/40 border border-wp-green/20 rounded-2xl p-3.5 flex flex-col items-center">
                  <span className="font-sans font-black text-wp-green text-2xl">{strongCount}</span>
                  <span className="font-sans font-semibold text-muted-foreground text-xs mt-1">{t("dashboard.strong")}</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex flex-col items-center">
                  <span className="font-sans font-black text-amber-600 dark:text-wp-amber text-2xl">{learningCount}</span>
                  <span className="font-sans font-semibold text-muted-foreground text-xs mt-1">{t("dashboard.learning")}</span>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3.5 flex flex-col items-center">
                  <span className="font-sans font-black text-rose-600 dark:text-rose-400 text-2xl">{dueCount}</span>
                  <span className="font-sans font-semibold text-muted-foreground text-xs mt-1">{t("dashboard.due")}</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: THIS WEEK */}
          <section aria-labelledby="section-this-week" className="flex flex-col gap-3">
            <span id="section-this-week" className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground">
              {t("dashboard.thisWeek")}
            </span>
            <div className="bg-wp-card rounded-3xl border border-border p-6 flex flex-col gap-4 shadow-wp-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-sans font-bold text-sm text-foreground">
                  <Flame className="size-4 text-wp-amber" />
                  <span>Streak Activity</span>
                </div>
                <span className="font-sans font-bold text-xs text-wp-amber">{progress.streak} Day Streak</span>
              </div>

              <ul className="grid grid-cols-7 gap-2 text-center list-none">
                {weekActivity.map((d) => (
                  <li key={d.date} className="flex flex-col items-center gap-1.5">
                    <span className="font-sans text-[11px] text-muted-foreground font-medium" aria-hidden>
                      {d.initial}
                    </span>
                    <div
                      className={`size-8 rounded-xl flex items-center justify-center font-sans text-xs font-bold ${
                        d.done ? "bg-wp-amber text-wp-text-on-amber shadow-sm" : "bg-muted text-muted-foreground"
                      } ${d.isToday ? "ring-2 ring-primary ring-offset-2 ring-offset-wp-card" : ""}`}
                    >
                      <span className="sr-only">
                        {d.name}
                        {d.isToday ? " (today)" : ""}: {d.done ? "practiced" : "no session"}
                      </span>
                      <span aria-hidden>{d.done ? "✓" : ""}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});
