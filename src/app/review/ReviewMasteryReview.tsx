import { memo, useMemo } from "react";
import { Flame, BookOpen, ArrowRight, RotateCcw, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { BEDROOM_VOCABULARY, type VocabItem } from "../data/lessons";
import { WordImage } from "../shared/WordImage";
import { calculateDaysBetween, getLocalDateString } from "../../features/gamification/streak";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ReviewMasteryReview = memo(function ReviewMasteryReview({ dispatch }: Props) {
  const { progress } = useProgress();

  const todayStr = getLocalDateString(new Date());

  const memoryItems = useMemo(() => {
    const memory = progress.wordMemory;
    const items: Array<{
      word: VocabItem;
      status: "overdue" | "today" | "upcoming";
      daysDiff: number;
      mastery: string;
    }> = [];

    Object.keys(memory).forEach((wordId) => {
      const wordState = memory[wordId];
      const wordObj = BEDROOM_VOCABULARY.find((v) => v.id === wordId);
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
  }, [progress.wordMemory, todayStr]);

  const overdueList = memoryItems.filter((i) => i.status === "overdue");
  const dueTodayList = memoryItems.filter((i) => i.status === "today");
  const upcomingList = memoryItems.filter((i) => i.status === "upcoming");

  const totalDue = overdueList.length + dueTodayList.length;

  const startReviewSession = () => {
    const dueQueue = [...overdueList, ...dueTodayList].map((i) => i.word.id);
    const queue = dueQueue.length >= 5
      ? dueQueue.slice(0, 5)
      : [...dueQueue, ...BEDROOM_VOCABULARY.slice(0, 5).map((w) => w.id)].slice(0, 5);

    dispatch({ type: "START_LESSON", wordQueue: queue });
  };

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-8 max-w-4xl w-full mx-auto">
      {/* Page header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="size-4" />
            <span>SM-2 Spaced Repetition Review</span>
          </div>
          <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight">
            Daily Vocabulary Review
          </h1>
          <p className="font-sans font-medium text-muted-foreground text-sm mt-0.5">
            {totalDue > 0
              ? `${totalDue} words ready for review based on memory decay`
              : "All reviews complete for today! Keep up the great work."}
          </p>
        </div>

        <div className="bg-secondary rounded-xl px-3 py-2 flex items-center gap-1.5 border border-primary/20 shrink-0 shadow-wp-xs">
          <Flame className="size-4 text-wp-amber" />
          <span className="font-sans font-bold text-foreground text-sm">{progress.streak} Day Streak</span>
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
              Start a Bedroom lesson session to discover words and build your personalized memory schedule.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* OVERDUE SECTION */}
          {overdueList.length > 0 && (
            <section aria-label="Overdue words" className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-sans font-bold text-sm">
                <AlertCircle className="size-4" />
                <span>OVERDUE ({overdueList.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {overdueList.map(({ word, daysDiff, mastery }) => (
                  <div
                    key={word.id}
                    className="bg-wp-card rounded-2xl border border-rose-500/30 p-4 flex items-center gap-4 shadow-wp-xs"
                  >
                    <div className="relative rounded-xl shrink-0 size-14 overflow-hidden border border-border bg-muted">
                      <WordImage word={word} width="56" height="56" className="size-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-sans font-bold text-foreground text-base">{word.label}</p>
                        <span className="font-sans font-bold text-rose-600 bg-rose-500/10 rounded-full px-2 py-0.5 text-[10px]">
                          {daysDiff}d overdue
                        </span>
                      </div>
                      <p className="font-sans text-muted-foreground text-xs font-medium">/{word.phonetic}/ · {mastery}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DUE TODAY SECTION */}
          {dueTodayList.length > 0 && (
            <section aria-label="Due today words" className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-wp-amber font-sans font-bold text-sm">
                <Clock className="size-4" />
                <span>DUE TODAY ({dueTodayList.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dueTodayList.map(({ word, mastery }) => (
                  <div
                    key={word.id}
                    className="bg-wp-card rounded-2xl border border-amber-500/30 p-4 flex items-center gap-4 shadow-wp-xs"
                  >
                    <div className="relative rounded-xl shrink-0 size-14 overflow-hidden border border-border bg-muted">
                      <WordImage word={word} width="56" height="56" className="size-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-sans font-bold text-foreground text-base">{word.label}</p>
                        <span className="font-sans font-bold text-amber-600 bg-amber-500/10 rounded-full px-2 py-0.5 text-[10px]">
                          Due now
                        </span>
                      </div>
                      <p className="font-sans text-muted-foreground text-xs font-medium">/{word.phonetic}/ · {mastery}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* UPCOMING SECTION */}
          {upcomingList.length > 0 && (
            <section aria-label="Upcoming words" className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-teal-600 dark:text-wp-teal font-sans font-bold text-sm">
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
                      <WordImage word={word} width="56" height="56" className="size-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-sans font-bold text-foreground text-base">{word.label}</p>
                        <span className="font-sans font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-[10px]">
                          In {daysDiff}d
                        </span>
                      </div>
                      <p className="font-sans text-muted-foreground text-xs font-medium">/{word.phonetic}/ · {mastery}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Start review CTA */}
      <footer>
        <button
          type="button"
          onClick={startReviewSession}
          className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 w-full font-sans font-bold text-wp-text-on-blue text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue min-h-[52px] shadow-wp-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Start Adaptive Review Session ({totalDue} due)</span>
          <ArrowRight className="size-5" />
        </button>
      </footer>
    </div>
  );
});
