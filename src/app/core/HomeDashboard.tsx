import { memo, useMemo } from "react";
import { ArrowRight, RotateCcw, WifiOff } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { nextGroupToStudy, resolveUnitForLesson } from "../data/lessons";

import { useOfflineReadiness } from "../shared/useOfflineReadiness";
import { useI18n } from "../context/I18nContext";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { PageContainer, Section, Card, Badge } from "../shared";

const imgAvatar = "/images/core/learner-avatar.webp";

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
  const estimatedMinutes = Math.max(1, Math.round((activeLesson.wordIds.length * SECONDS_PER_WORD) / 60));
  const activeUnit = useMemo(() => resolveUnitForLesson(activeLesson.id), [activeLesson.id]);

  const offline = useOfflineReadiness(activeUnit.id);

  return (
    <PageContainer>
      {/* Top Learner Greeting */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative size-12 lg:size-14 shrink-0 rounded-full overflow-hidden border-2 border-primary/20 shadow-wp-xs">
            <img
              alt="WordPix learner profile"
              className="absolute inset-0 object-cover size-full"
              src={imgAvatar}
              loading="eager"
            />
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
            <span>{t("dashboard.offlineSaving", { cached: offline.cached, total: offline.total })}</span>
          </Badge>
        )}
      </header>

      {/*
        The skill-exercise hub used to be promoted here *and* on Explore, above
        the lesson itself in both places — so the loudest thing on the home
        screen was a 35-item catalogue rather than the one lesson the learner
        was part-way through. It now lives in one place, under Practice.
      */}

      {/* Main Content (Single Centered Column for maximum clarity) */}
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full mt-4">
        {/* SECTION 1: TODAY */}
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

            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "START_LESSON",
                  lessonId: activeLesson.id,
                  mode: "NEW_LESSON",
                  wordQueue: activeLesson.wordIds,
                })
              }
              className="w-full bg-primary hover:opacity-90 active:opacity-80 rounded-2xl py-4 font-sans font-black text-primary-foreground text-lg min-h-[56px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary shadow-wp-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{t("dashboard.continueSession")}</span>
              <ArrowRight className="size-5" />
            </button>
          </Card>
        </Section>

        {/* SECTION 2: REVIEW */}
        <Section id="section-review" title={t("dashboard.review")}>
          <Card variant="default">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-sans font-bold text-sm">
                <RotateCcw className="size-4 text-primary" />
                <span>Smart Review</span>
              </div>
            </div>
            <p className="font-sans text-muted-foreground text-xs leading-relaxed mt-2">
              Review words scheduled for memory retention before decay occurs.
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: "GO", to: "practice" })}
              className="w-full bg-secondary hover:bg-primary/10 text-primary border border-primary/20 rounded-xl py-3 font-sans font-bold text-sm min-h-[44px] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{t("dashboard.startReview")}</span>
              <ArrowRight className="size-4" />
            </button>
          </Card>
        </Section>
      </div>
    </PageContainer>
  );
});
