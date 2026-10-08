import { memo, useMemo } from "react";
import {
  Headphones,
  BookOpen,
  MessagesSquare,
  Briefcase,
  ArrowRight,
  Sparkles,
  Play,
} from "lucide-react";
import type { Action } from "../types";
import { useLearner } from "../context/LearnerContext";
import { useI18n } from "../context/I18nContext";
import { FIGMA_HADITH_LESSONS } from "../learning/hadith/figmaHadithCatalog";
import { getConversationUnit } from "../learning/conversation/conversationCatalog";
import { getBusinessUnit } from "../learning/business/businessCatalog";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  getFigmaPronunciationActivityData,
} from "../learning/foundations/figmaPronunciationCatalog";
import { LEGACY_PRONUNCIATION_LESSON_NUMBERS } from "../learning/foundations/pronunciationProgress";
import { HADITH_STAGE_IDS } from "../learning/hadith/hadithCurriculumStages";
import { CONVERSATION_STAGE_IDS } from "../learning/conversation/conversationTypes";
import { BUSINESS_STAGE_IDS } from "../learning/business/businessTypes";
import { Card, Badge, ProgressBar } from "../shared";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface RecentTrackItem {
  type: "pronunciation" | "hadith" | "conversation" | "business";
  id: string;
  title: string;
  badge: string;
  progressPercent: number;
  statusText: string;
  updatedAt: string;
  onResume: () => void;
}

export const SpecializedTracksCard = memo(function SpecializedTracksCard({ dispatch }: Props) {
  const { state: learnerState } = useLearner();
  const { t } = useI18n();

  const mostRecentTrack = useMemo<RecentTrackItem | null>(() => {
    const candidates: RecentTrackItem[] = [];

    // 1. Hadith
    const hadith = learnerState.hadithProgress || {};
    for (const [lessonId, p] of Object.entries(hadith)) {
      if (!p?.updatedAt || !Number.isFinite(Date.parse(p.updatedAt))) continue;
      const lesson = FIGMA_HADITH_LESSONS.find((l) => l.id === lessonId);
      if (!lesson) continue;
      const completedCount = HADITH_STAGE_IDS.filter((stage) =>
        p.completedStages.includes(stage)
      ).length;
      const pct = Math.round((completedCount / HADITH_STAGE_IDS.length) * 100);
      candidates.push({
        type: "hadith",
        id: lessonId,
        title: lesson.title,
        badge: t("learn.hadithScope"),
        progressPercent: pct,
        statusText:
          p.status === "mastered"
            ? t("mastery.mastered")
            : t("help.completed", { completed: completedCount, total: HADITH_STAGE_IDS.length }),
        updatedAt: p.updatedAt,
        onResume: () => dispatch({ type: "OPEN_HADITH_LESSON", lessonId }),
      });
    }

    // 2. Pronunciation
    const pronunciation = learnerState.pronunciationProgress || {};
    for (const [lessonKey, p] of Object.entries(pronunciation)) {
      if (!p?.updatedAt || !Number.isFinite(Date.parse(p.updatedAt))) continue;
      const canonicalNumber = /^lesson-(\d{2})$/.exec(lessonKey)?.[1];
      const lessonNumber = canonicalNumber
        ? Number(canonicalNumber)
        : LEGACY_PRONUNCIATION_LESSON_NUMBERS[lessonKey];
      if (
        !lessonNumber ||
        !FIGMA_PRONUNCIATION_LESSONS.some((lesson) => lesson.number === lessonNumber)
      )
        continue;
      const activity = getFigmaPronunciationActivityData(lessonNumber);
      if (!activity) continue;
      const currentStage = Math.min(5, Math.max(1, p.currentStage + 1));
      const pct = p.status === "mastered" ? 100 : Math.round((currentStage / 5) * 100);
      candidates.push({
        type: "pronunciation",
        id: lessonKey,
        title: activity.title,
        badge: t("learn.pronunciationScope"),
        progressPercent: pct,
        statusText:
          p.status === "mastered"
            ? t("mastery.mastered")
            : t("pronunciation.stageProgress", { current: currentStage, total: 5 }),
        updatedAt: p.updatedAt,
        onResume: () => dispatch({ type: "OPEN_FIGMA_PRONUNCIATION", lessonNumber }),
      });
    }

    // 3. Conversation
    const conversation = learnerState.conversationProgress || {};
    for (const [unitId, p] of Object.entries(conversation)) {
      if (!p?.updatedAt || !Number.isFinite(Date.parse(p.updatedAt))) continue;
      const unit = getConversationUnit(unitId);
      if (!unit) continue;
      const completedCount = CONVERSATION_STAGE_IDS.filter((stage) =>
        p.completedStages.includes(stage)
      ).length;
      const pct = Math.round((completedCount / CONVERSATION_STAGE_IDS.length) * 100);
      candidates.push({
        type: "conversation",
        id: unitId,
        title: unit.title,
        badge: t("learn.conversationScope"),
        progressPercent: pct,
        statusText:
          p.status === "mastered"
            ? t("mastery.mastered")
            : t("help.completed", {
                completed: completedCount,
                total: CONVERSATION_STAGE_IDS.length,
              }),
        updatedAt: p.updatedAt,
        onResume: () => dispatch({ type: "OPEN_CONVERSATION_LESSON", unitId }),
      });
    }

    // 4. Business
    const business = learnerState.businessProgress || {};
    for (const [unitId, p] of Object.entries(business)) {
      if (!p?.updatedAt || !Number.isFinite(Date.parse(p.updatedAt))) continue;
      const unit = getBusinessUnit(unitId);
      if (!unit) continue;
      const completedCount = BUSINESS_STAGE_IDS.filter((stage) =>
        p.completedStages.includes(stage)
      ).length;
      const pct = Math.round((completedCount / BUSINESS_STAGE_IDS.length) * 100);
      candidates.push({
        type: "business",
        id: unitId,
        title: unit.title,
        badge: t("learn.businessScope"),
        progressPercent: pct,
        statusText:
          p.status === "mastered"
            ? t("mastery.mastered")
            : t("help.completed", { completed: completedCount, total: BUSINESS_STAGE_IDS.length }),
        updatedAt: p.updatedAt,
        onResume: () => dispatch({ type: "OPEN_BUSINESS_LESSON", unitId }),
      });
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return candidates[0];
  }, [learnerState, dispatch, t]);

  const trackIcon = (type: RecentTrackItem["type"]) => {
    switch (type) {
      case "pronunciation":
        return <Headphones className="size-5 text-primary" aria-hidden />;
      case "hadith":
        return <BookOpen className="size-5 text-primary" aria-hidden />;
      case "conversation":
        return <MessagesSquare className="size-5 text-primary" aria-hidden />;
      case "business":
        return <Briefcase className="size-5 text-primary" aria-hidden />;
    }
  };

  const tracks = [
    {
      id: "pronunciation",
      title: t("pronunciation.curriculumTitle"),
      badge: t("learn.pronunciationScope"),
      icon: <Headphones className="size-4 text-primary" aria-hidden />,
      onClick: () => dispatch({ type: "GO", to: "pronunciation-curriculum" }),
    },
    {
      id: "hadith",
      title: t("hadith.curriculumTitle"),
      badge: t("learn.hadithScope"),
      icon: <BookOpen className="size-4 text-primary" aria-hidden />,
      onClick: () => dispatch({ type: "GO", to: "hadith-curriculum" }),
    },
    {
      id: "conversation",
      title: t("conversation.title"),
      badge: t("learn.conversationScope"),
      icon: <MessagesSquare className="size-4 text-primary" aria-hidden />,
      onClick: () => dispatch({ type: "GO", to: "conversation-curriculum" }),
    },
    {
      id: "business",
      title: t("business.curriculumTitle"),
      badge: t("learn.businessScope"),
      icon: <Briefcase className="size-4 text-primary" aria-hidden />,
      onClick: () => dispatch({ type: "GO", to: "business-curriculum" }),
    },
  ];

  return (
    <Card variant="default">
      <div className="flex flex-col gap-4">
        {mostRecentTrack ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {trackIcon(mostRecentTrack.type)}
                <span className="font-sans text-xs font-black uppercase tracking-wider text-primary">
                  {t("dashboard.resumeTrack") || "Active Special Course"}
                </span>
              </div>
              <Badge variant="teal" size="sm">
                <span>{mostRecentTrack.badge}</span>
              </Badge>
            </div>

            <h3 className="mt-2.5 font-sans text-lg font-black text-foreground sm:text-xl">
              {mostRecentTrack.title}
            </h3>

            <div className="mt-3">
              <ProgressBar
                progressPercent={mostRecentTrack.progressPercent}
                label={mostRecentTrack.statusText}
                ariaLabel={t("dashboard.trackProgress", { title: mostRecentTrack.title })}
                ariaValueText={mostRecentTrack.statusText}
                size="sm"
              />
            </div>

            <button
              type="button"
              onClick={mostRecentTrack.onResume}
              className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-sans text-sm font-black text-primary-foreground shadow-wp-xs transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:active:scale-[0.99]"
            >
              <Play className="size-4" aria-hidden />
              <span>
                {t("dashboard.continueTrack", { title: mostRecentTrack.title }) ||
                  `Continue ${mostRecentTrack.title}`}
              </span>
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              <h3 className="font-sans text-base font-black text-foreground">
                {t("learn.specialCurricula")}
              </h3>
            </div>
            <p className="mt-1 font-sans text-xs font-semibold leading-relaxed text-muted-foreground">
              {t("learn.specialCurriculaSubheading")}
            </p>
          </div>
        )}

        {/* Quick Launch Strip for All Special Tracks */}
        <div className="border-t border-border pt-3">
          <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
            {t("dashboard.specializedTracks") || "Specialized Tracks"}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tracks.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={track.onClick}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-card p-2.5 text-start transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:active:scale-[0.98]"
              >
                <div className="shrink-0">{track.icon}</div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-foreground">{track.title}</p>
                  <p className="truncate text-[10px] font-bold text-muted-foreground">
                    {track.badge}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
});
