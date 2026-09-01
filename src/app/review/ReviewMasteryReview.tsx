import { memo, useMemo, useState, useEffect } from "react";
import {
  Flame,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Layers,
} from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { REVIEW_GROUP_ID, resolveUnitIdForWord, type VocabularyItem } from "../data/lessons";
import { getWords, loadUnitVocabulary } from "../data/vocabulary";

/** Words per review session. */
const REVIEW_SESSION_SIZE = 5;
import { WordImage } from "../shared/WordImage";
import { calculateDaysBetween, getLocalDateString } from "../../features/gamification/streak";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ReviewMasteryReview = memo(function ReviewMasteryReview({ dispatch }: Props) {
  const { progress } = useProgress();
  const [loadedCount, setLoadedCount] = useState(0);

  const todayStr = getLocalDateString(new Date());

  useEffect(() => {
    const memoryWordIds = Object.keys(progress.wordMemory);
    const unitIds = new Set<string>();
    for (const wId of memoryWordIds) {
      const uId = resolveUnitIdForWord(wId);
      if (uId) unitIds.add(uId);
    }
    if (unitIds.size === 0) return;
    let isCancelled = false;
    Promise.all([...unitIds].map((id) => loadUnitVocabulary(id))).then(() => {
      if (!isCancelled) {
        setLoadedCount((c) => c + 1);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [progress.wordMemory]);

  const memoryItems = useMemo(() => {
    const memory = progress.wordMemory;
    const items: Array<{
      word: VocabularyItem;
      status: "overdue" | "today" | "upcoming";
      daysDiff: number;
      mastery: string;
    }> = [];

    Object.keys(memory).forEach((wordId) => {
      const wordState = memory[wordId];
      const wordObj = getWords([wordId])[0];
      if (!wordObj || !wordState) return;

      const nextDateStr = wordState.nextReviewAt
        ? getLocalDateString(new Date(wordState.nextReviewAt))
        : todayStr;

      const diff = calculateDaysBetween(todayStr, nextDateStr);

      const status: "overdue" | "today" | "upcoming" =
        diff < 0 ? "overdue" : diff === 0 ? "today" : "upcoming";

      items.push({
        word: wordObj,
        status,
        daysDiff: Math.abs(diff),
        mastery: wordState.mastery,
      });
    });

    return items;
  }, [progress.wordMemory, todayStr, loadedCount]);

  const overdueList = memoryItems.filter((i) => i.status === "overdue");
  const dueTodayList = memoryItems.filter((i) => i.status === "today");
  const upcomingList = memoryItems.filter((i) => i.status === "upcoming");

  const totalDue = overdueList.length + dueTodayList.length;

  /**
   * Builds the review queue from what is actually due.
   *
   * A short queue used to be padded from `BEDROOM_VOCABULARY.slice(0, 5)` —
   * bed, nightstand, dresser, wardrobe, desk — so a review with two due words
   * became three furniture words the learner had not asked to review. Padding
   * now draws on the words with the weakest memory instead, and the session
   * carries the review group id rather than inheriting the furniture one.
   */
  const startReviewSession = () => {
    const dueQueue = [...overdueList, ...dueTodayList].map((i) => i.word.id);
    const weakestFirst = memoryItems
      .filter((i) => !dueQueue.includes(i.word.id))
      .sort((a, b) => a.daysDiff - b.daysDiff)
      .map((i) => i.word.id);

    const queue = [...dueQueue, ...weakestFirst].slice(0, REVIEW_SESSION_SIZE);
    if (queue.length === 0) return;

    dispatch({
      type: "START_LESSON",
      lessonId: REVIEW_GROUP_ID,
      mode: "SMART_REVIEW",
      wordQueue: queue,
    });
  };

  const canStartReview = memoryItems.length > 0;

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-8 max-w-4xl w-full mx-auto">
      {/* Page header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="size-4" />
            <span>Smart Daily Review</span>
          </div>
          <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight">
            Daily Vocabulary Review
          </h1>
          <p className="font-sans font-medium text-muted-foreground text-sm mt-0.5">
            {totalDue > 0
              ? `${totalDue} words are ready for a memory review`
              : memoryItems.length === 0
                ? "Complete your first lesson to begin your memory review."
                : "All reviews complete for today! Keep up the great work."}
          </p>
        </div>

        <div className="bg-secondary rounded-xl px-3 py-2 flex items-center gap-1.5 border border-primary/20 shrink-0 shadow-wp-xs">
          <Flame className="size-4 text-wp-amber" />
          <span className="font-sans font-bold text-foreground text-sm">
            {progress.streak} Day Streak
          </span>
        </div>
      </header>

      {/* Review Queue Sections */}
      {memoryItems.length === 0 ? (
        <div className="bg-wp-card rounded-2xl border border-border p-8 flex flex-col items-center gap-3 text-center">
          <div className="size-14 rounded-2xl bg-secondary text-primary flex items-center justify-center">
            <RotateCcw className="size-7" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-foreground text-lg">No Memory Data Yet</h2>
            <p className="font-sans text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
              Complete any lesson to discover words and build your personalized memory schedule.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* OVERDUE SECTION */}
          {overdueList.length > 0 && (
            <section aria-label="Overdue words" className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-wp-rose font-sans font-bold text-sm">
                <AlertCircle className="size-4" />
                <span>OVERDUE ({overdueList.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {overdueList.map(({ word, daysDiff, mastery }) => (
                  <div
                    key={word.id}
                    className="bg-wp-card rounded-2xl border border-wp-rose/30 p-4 flex items-center gap-4 shadow-wp-xs"
                  >
                    <div className="relative rounded-xl shrink-0 size-14 overflow-hidden border border-border bg-muted">
                      <WordImage
                        word={word}
                        width="56"
                        height="56"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-sans font-bold text-foreground text-base">
                          {word.label}
                        </p>
                        <span className="font-sans font-bold text-wp-rose bg-wp-rose/10 rounded-full px-2 py-0.5 text-[10px]">
                          {daysDiff}d overdue
                        </span>
                      </div>
                      <p className="font-sans text-muted-foreground text-xs font-medium">
                        /{word.phonetic}/ · {mastery}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DUE TODAY SECTION */}
          {dueTodayList.length > 0 && (
            <section aria-label="Due today words" className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-wp-amber font-sans font-bold text-sm">
                <Clock className="size-4" />
                <span>DUE TODAY ({dueTodayList.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dueTodayList.map(({ word, mastery }) => (
                  <div
                    key={word.id}
                    className="bg-wp-card rounded-2xl border border-wp-amber/30 p-4 flex items-center gap-4 shadow-wp-xs"
                  >
                    <div className="relative rounded-xl shrink-0 size-14 overflow-hidden border border-border bg-muted">
                      <WordImage
                        word={word}
                        width="56"
                        height="56"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-sans font-bold text-foreground text-base">
                          {word.label}
                        </p>
                        <span className="font-sans font-bold text-wp-amber bg-wp-amber/10 rounded-full px-2 py-0.5 text-[10px]">
                          Due now
                        </span>
                      </div>
                      <p className="font-sans text-muted-foreground text-xs font-medium">
                        /{word.phonetic}/ · {mastery}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* UPCOMING SECTION */}
          {upcomingList.length > 0 && (
            <section aria-label="Upcoming words" className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-wp-teal font-sans font-bold text-sm">
                <CheckCircle2 className="size-4" />
                <span>UPCOMING ({upcomingList.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingList.map(({ word, daysDiff, mastery }) => (
                  <div
                    key={word.id}
                    className="bg-wp-card rounded-2xl border border-border p-4 flex items-center gap-4 opacity-75 shadow-wp-xs"
                  >
                    <div className="relative rounded-xl shrink-0 size-14 overflow-hidden border border-border bg-muted">
                      <WordImage
                        word={word}
                        width="56"
                        height="56"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-sans font-bold text-foreground text-base">
                          {word.label}
                        </p>
                        <span className="font-sans font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-[10px]">
                          In {daysDiff}d
                        </span>
                      </div>
                      <p className="font-sans text-muted-foreground text-xs font-medium">
                        /{word.phonetic}/ · {mastery}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/*
        The one route to the skill-exercise hub.
        It sits below the review queue because spaced repetition is the point of
        this tab and the drills are the optional extra — not the other way
        round, which is how it read when this card was the first thing on both
        Home and Explore.
      */}
      <section aria-label="Skill drills" className="border-t border-border pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <Layers className="size-5" aria-hidden />
            </div>
            <div>
              <h2 className="font-sans font-bold text-foreground text-base">Skill Drills</h2>
              <p className="font-sans text-muted-foreground text-xs mt-0.5 max-w-md">
                Standalone listening, reading, speaking and writing practice, separate from your
                lesson progress.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "skill-hub" })}
            className="shrink-0 bg-secondary hover:bg-primary/10 text-primary border border-primary/20 rounded-xl py-3 px-5 font-sans font-bold text-sm min-h-[44px] transition-all flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>Browse drills</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </section>

      {/* Start review CTA — nothing to review means nothing to start, rather
          than quietly launching a furniture lesson instead. */}
      <footer>
        <button
          type="button"
          onClick={startReviewSession}
          disabled={!canStartReview}
          className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 w-full font-sans font-bold text-wp-text-on-blue text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue min-h-[52px] shadow-wp-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>
            {canStartReview ? `Start Review Session (${totalDue} due)` : "Nothing to review yet"}
          </span>
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </footer>
    </div>
  );
});
