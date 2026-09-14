import { memo, useMemo, useState, useEffect } from "react";
import {
  Flame,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Layers,
} from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { REVIEW_GROUP_ID, resolveUnitIdForWord, type VocabularyItem } from "../data/lessons";
import { getWords, loadUnitVocabulary } from "../data/vocabulary";
import { useI18n } from "../context/I18nContext";

import { WordInspectorModal } from "../shared/WordInspectorModal";
import { WordImage } from "../shared/WordImage";
import { calculateDaysBetween, getLocalDateString } from "../../features/gamification/streak";

/** Words per review session. */
const REVIEW_SESSION_SIZE = 5;

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ReviewMasteryReview = memo(function ReviewMasteryReview({ dispatch }: Props) {
  const { t } = useI18n();
  const { progress } = useProgress();
  const [loadedCount, setLoadedCount] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);

  const todayStr = getLocalDateString(new Date());

  useEffect(() => {
    const memoryWordIds = Object.keys(progress.wordMemory);
    const unitIds = new Set<string>();
    for (const wId of memoryWordIds) {
      const uId = resolveUnitIdForWord(wId);
      if (uId) unitIds.add(uId);
    }
    if (unitIds.size === 0) return;

    let cancelled = false;
    Promise.all(Array.from(unitIds).map((uId) => loadUnitVocabulary(uId)))
      .then(() => {
        if (!cancelled) setLoadedCount((prev) => prev + 1);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load review vocabulary", err);
          setLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [progress.wordMemory]);

  const memoryItems = useMemo(() => {
    void loadedCount;
    const entries = Object.entries(progress.wordMemory);
    if (entries.length === 0) return [];
    return entries.flatMap(([wordId, entry]) => {
      const word = getWords([wordId])[0];
      if (!word) return [];
      const nextDate = entry.nextReviewAt ? entry.nextReviewAt.split("T")[0] : todayStr;
      const daysDiff = calculateDaysBetween(todayStr, nextDate);
      return [{ word, entry, daysDiff }];
    });
  }, [progress.wordMemory, todayStr, loadedCount]);

  const overdueList = useMemo(
    () =>
      memoryItems
        .filter((item) => item.daysDiff < 0)
        .sort((a, b) => a.daysDiff - b.daysDiff)
        .map((item) => ({ ...item, daysDiff: Math.abs(item.daysDiff) })),
    [memoryItems]
  );

  const dueTodayList = useMemo(
    () => memoryItems.filter((item) => item.daysDiff === 0),
    [memoryItems]
  );

  const upcomingList = useMemo(
    () => memoryItems.filter((item) => item.daysDiff > 0).sort((a, b) => a.daysDiff - b.daysDiff),
    [memoryItems]
  );

  const totalDue = overdueList.length + dueTodayList.length;

  const startReviewSession = () => {
    const queue = [...overdueList, ...dueTodayList]
      .slice(0, REVIEW_SESSION_SIZE)
      .map((item) => item.word.id);
    if (queue.length === 0) return;

    dispatch({
      type: "START_LESSON",
      lessonId: REVIEW_GROUP_ID,
      mode: "SMART_REVIEW",
      wordQueue: queue,
    });
  };

  const sessionSize = Math.min(REVIEW_SESSION_SIZE, totalDue);
  const sections = [
    {
      key: "overdue",
      title: t("masteryReview.overdue"),
      items: overdueList,
      Icon: AlertCircle,
      tint: "bg-wp-rose/5 border-wp-rose/20",
      note: t("masteryReview.overdueNote"),
    },
    {
      key: "today",
      title: t("masteryReview.dueToday"),
      items: dueTodayList,
      Icon: Clock,
      tint: "bg-wp-amber/5 border-wp-amber/20",
      note: t("masteryReview.dueTodayNote"),
    },
    {
      key: "upcoming",
      title: t("masteryReview.upcoming"),
      items: upcomingList,
      Icon: CheckCircle2,
      tint: "bg-primary/5 border-primary/20",
      note: t("masteryReview.upcomingNote"),
    },
  ];
  const focus =
    "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-8 max-w-6xl w-full mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
            <BookOpen className="size-4" aria-hidden />
            {t("masteryReview.badge")}
          </p>
          <h1 className="font-black text-foreground text-2xl md:text-3xl leading-tight">
            {t("masteryReview.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">{t("masteryReview.subtitle")}</p>
        </div>
        <p className="flex items-center gap-2 text-sm font-bold text-foreground shrink-0">
          <Flame className="size-5 text-primary" aria-hidden />
          {t("masteryReview.dayStreak", { count: progress.streak })}
        </p>
      </header>
      {loadError && (
        <p role="alert" className="text-foreground">
          {t("masteryReview.loadError")}
        </p>
      )}
      <section
        aria-label={t("masteryReview.todayReview")}
        className="rounded-2xl border border-primary/15 bg-secondary p-4 md:p-6 flex items-center gap-4 md:gap-8"
      >
        <div className="size-28 md:size-36 rounded-full border-8 border-primary/20 border-t-primary flex flex-col items-center justify-center shrink-0 text-foreground">
          <span className="text-3xl md:text-4xl font-black">{totalDue}</span>
          <span className="text-xs font-semibold">{t("masteryReview.wordsDue")}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="hidden sm:block text-xl font-bold text-foreground mb-1">
            {t("masteryReview.todayReview")}
          </h2>
          <p className="text-sm text-foreground">
            {t("masteryReview.countsSummary", {
              overdue: overdueList.length,
              due: dueTodayList.length,
            })}
          </p>
          <button
            type="button"
            onClick={startReviewSession}
            disabled={totalDue === 0 || loadError}
            className={`mt-3 min-h-12 rounded-xl px-4 md:px-6 bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 ${focus}`}
          >
            {totalDue
              ? t("masteryReview.reviewNow", { count: sessionSize })
              : t("masteryReview.allCaughtUp")}
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>
        <p className="hidden lg:block max-w-48 text-sm text-foreground bg-primary/5 rounded-xl p-4">
          {t("masteryReview.retentionTip")}
        </p>
      </section>
      {memoryItems.length === 0 && !loadError && (
        <section className="rounded-2xl border border-border p-6 text-center text-foreground">
          <RotateCcw className="size-7 mx-auto mb-3 text-primary" aria-hidden />
          <h2 className="font-bold">{t("masteryReview.noDataTitle")}</h2>
          <p className="text-sm text-muted-foreground mt-2">{t("masteryReview.noDataDesc")}</p>
        </section>
      )}
      {sections
        .filter(({ items }) => items.length > 0)
        .map(({ key, title, items, Icon, tint, note }) => (
          <section
            key={key}
            aria-label={`${title} words`}
            className={`rounded-2xl border p-3 md:p-4 ${tint}`}
          >
            <div className="flex items-center gap-2 mb-3 text-foreground">
              <Icon className="size-5 shrink-0" aria-hidden />
              <h2 className="font-bold">{title}</h2>
              <span className="text-xs rounded-full bg-wp-card px-2 py-1">
                {t("masteryReview.wordsCount", { count: items.length })}
              </span>
              <span className="hidden md:block ms-auto text-xs">{note}</span>
            </div>
            <div id={`review-${key}`} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {items.map(({ word, daysDiff }, index) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => setSelectedWord(word)}
                  className={`${!expanded[key] && index > 0 ? (index < 3 ? "hidden md:flex" : "hidden") : "flex"} min-w-0 text-start items-center gap-3 bg-wp-card border border-border rounded-xl p-2 shadow-wp-xs ${focus}`}
                >
                  <WordImage
                    word={word}
                    width="72"
                    height="72"
                    className="size-16 md:size-18 shrink-0 rounded-lg object-cover"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-sm text-foreground break-words">
                      {word.label}
                    </span>
                    <span className="block mt-1 text-xs text-muted-foreground">
                      {key === "overdue"
                        ? daysDiff === 1
                          ? t("masteryReview.oneDayOverdue")
                          : t("masteryReview.daysOverdue", { count: daysDiff })
                        : key === "today"
                          ? t("masteryReview.dueToday")
                          : daysDiff === 1
                            ? t("masteryReview.inOneDay")
                            : t("masteryReview.inDays", { count: daysDiff })}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-primary" aria-hidden />
                </button>
              ))}
            </div>
            {items.length > 1 && (
              <button
                type="button"
                aria-expanded={!!expanded[key]}
                aria-controls={`review-${key}`}
                onClick={() => setExpanded((value) => ({ ...value, [key]: !value[key] }))}
                className={`${items.length <= 3 ? "md:hidden" : ""} min-h-11 mt-2 px-2 text-primary text-sm font-semibold rounded-lg ${focus}`}
              >
                {expanded[key]
                  ? t("masteryReview.showFewer")
                  : t("masteryReview.viewAll", { count: items.length })}
              </button>
            )}
          </section>
        ))}
      <section
        aria-label={t("masteryReview.skillDrillsTitle")}
        className="border-t border-border pt-5 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <Layers className="hidden sm:block size-10 text-primary shrink-0" aria-hidden />
        <div className="flex-1">
          <h2 className="font-bold text-lg text-foreground">
            {t("masteryReview.skillDrillsTitle")}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{t("masteryReview.skillDrillsDesc")}</p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "skill-hub" })}
          className={`min-h-12 px-5 rounded-xl border border-primary/20 bg-secondary text-primary font-bold text-sm flex items-center justify-center gap-2 ${focus}`}
        >
          {t("masteryReview.browseDrills")}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </section>
      <WordInspectorModal
        word={selectedWord}
        isOpen={selectedWord !== null}
        onClose={() => setSelectedWord(null)}
      />
    </div>
  );
});
