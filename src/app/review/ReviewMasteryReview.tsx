import { memo } from "react";
import { Flame, BookOpen, ArrowRight, RotateCcw } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { WordImage } from "../shared/WordImage";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const MASTERY_BARS: Record<number, { filled: number; color: string; label: string }> = {
  1: { filled: 1, color: "var(--wp-brand)", label: "Recognized" },
  2: { filled: 2, color: "var(--wp-amber)", label: "Practiced" },
  3: { filled: 3, color: "var(--wp-green)", label: "Mastered" },
};

function MasteryMeter({ level }: { level: number }) {
  const { filled, color, label } = MASTERY_BARS[level] || { filled: 1, color: "var(--wp-brand)", label: "Learning" };
  return (
    <div
      className="flex gap-1 items-center shrink-0"
      role="img"
      aria-label={`Mastery level: ${label}`}
    >
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className="rounded-sm h-3.5 w-2 transition-all"
          style={{ background: bar <= filled ? color : "var(--wp-border)" }}
          aria-hidden
        />
      ))}
    </div>
  );
}

export const ReviewMasteryReview = memo(function ReviewMasteryReview({ dispatch }: Props) {
  const { progress } = useProgress();

  const practicedWordIds = Object.keys(progress.wordMastery);
  const reviewWords = practicedWordIds
    .map((id) => BEDROOM_VOCABULARY.find((v) => v.id === id))
    .filter(Boolean);

  const startReviewSession = () => {
    const queue = reviewWords.length >= 5
      ? reviewWords.slice(0, 5).map((w) => w!.id)
      : BEDROOM_VOCABULARY.slice(0, 5).map((w) => w.id);
    
    dispatch({ type: "START_LESSON", wordQueue: queue });
  };

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-8 max-w-4xl w-full mx-auto">
      {/* Page header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="size-4" />
            <span>Spaced Repetition Review</span>
          </div>
          <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight">
            Daily Vocabulary Review
          </h1>
          <p className="font-sans font-medium text-muted-foreground text-sm mt-0.5">
            {reviewWords.length > 0
              ? `${reviewWords.length} words scheduled for review based on memory decay`
              : "Review schedule is empty. Complete your first lesson to add words!"}
          </p>
        </div>

        <div className="bg-secondary rounded-xl px-3 py-2 flex items-center gap-1.5 border border-primary/20 shrink-0 shadow-wp-xs">
          <Flame className="size-4 text-wp-amber" />
          <span className="font-sans font-bold text-foreground text-sm">{progress.streak} Day Streak</span>
        </div>
      </header>

      {/* Word card list */}
      <section aria-label="Words to review" className="w-full">
        {reviewWords.length === 0 ? (
          <div className="bg-wp-card rounded-2xl border border-border p-8 flex flex-col items-center gap-3 text-center">
            <div className="size-14 rounded-2xl bg-secondary text-primary flex items-center justify-center">
              <RotateCcw className="size-7" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-foreground text-lg">No Words Due for Review Yet</h2>
              <p className="font-sans text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                Start a Bedroom lesson session to discover words and add them to your memory queue.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reviewWords.map((word) => {
            const level = progress.wordMastery[word!.id] || 1;
            return (
              <div
                key={word!.id}
                className="bg-wp-card rounded-2xl border border-border p-4 flex items-center gap-4 shadow-wp-xs hover:border-primary/40 transition-all"
              >
                <div className="relative rounded-xl shrink-0 size-14 overflow-hidden border border-border bg-muted">
                  <WordImage word={word!} width="56" height="56" className="size-full object-cover" />
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-sans font-bold text-foreground text-base">{word!.label}</p>
                    <span className="font-sans font-bold text-primary text-[10px] bg-secondary rounded-full px-2.5 py-0.5 border border-primary/20 uppercase tracking-wide">
                      Due Today
                    </span>
                  </div>
                  <p className="font-sans text-muted-foreground text-xs font-medium">/{word!.phonetic}/</p>
                </div>

                <MasteryMeter level={level} />
              </div>
            );
          })}
          </div>
        )}
      </section>

      {/* Start review CTA */}
      <footer>
        <button
          type="button"
          onClick={startReviewSession}
          className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 w-full font-sans font-bold text-white text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue min-h-[52px] shadow-wp-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Start 5-Word Review Session (+25 XP)</span>
          <ArrowRight className="size-5" />
        </button>
      </footer>
    </div>
  );
});
