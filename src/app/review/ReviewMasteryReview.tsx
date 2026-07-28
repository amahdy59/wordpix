import { memo } from "react";
import { Flame, BookOpen, ArrowRight } from "lucide-react";
import type { Action } from "../types";

const imgThumb  = "https://images.unsplash.com/photo-1623944436679-5412c658a358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80";
const imgThumb1 = "https://images.unsplash.com/photo-1776476269609-c41ae855bb8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80";
const imgThumb2 = "https://images.unsplash.com/photo-1600369672770-985fd30004eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

type Mastery = "mastered" | "practiced" | "recognized";

interface WordCard {
  id: string;
  word: string;
  daysAgo: string;
  mastery: Mastery;
  img: string;
  urgent?: boolean;
}

const WORD_CARDS: WordCard[] = [
  { id: "pillow",  word: "Pillow",  daysAgo: "2 days ago", mastery: "recognized", img: imgThumb,  urgent: true },
  { id: "lamp",    word: "Lamp",    daysAgo: "3 days ago", mastery: "practiced",  img: imgThumb1               },
  { id: "blanket", word: "Blanket", daysAgo: "5 days ago", mastery: "mastered",   img: imgThumb2               },
];

const MASTERY_BARS: Record<Mastery, { filled: number; color: string; label: string }> = {
  mastered:   { filled: 3, color: "var(--wp-green)", label: "Mastered"   },
  practiced:  { filled: 2, color: "var(--wp-amber)", label: "Practiced"  },
  recognized: { filled: 1, color: "var(--wp-brand)", label: "Recognized" },
};

function MasteryMeter({ mastery }: { mastery: Mastery }) {
  const { filled, color, label } = MASTERY_BARS[mastery];
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
  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-8 max-w-xl mx-auto">
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
            3 words scheduled for review today based on memory strength
          </p>
        </div>

        {/* Streak badge */}
        <div className="bg-secondary rounded-xl px-3 py-2 flex items-center gap-1.5 border border-primary/20 shrink-0 shadow-wp-xs">
          <Flame className="size-4 text-wp-amber" />
          <span className="font-sans font-bold text-foreground text-sm">7 Day Streak</span>
        </div>
      </header>

      {/* Word card list */}
      <section aria-label="Words to review" className="flex flex-col gap-3">
        {WORD_CARDS.map((card) => (
          <div
            key={card.id}
            className="bg-wp-card rounded-2xl border border-border p-4 flex items-center gap-4 shadow-wp-xs hover:border-primary/40 transition-all"
          >
            <div className="relative rounded-xl shrink-0 size-14 overflow-hidden border border-border bg-muted">
              <img
                alt={card.word}
                className="absolute inset-0 object-cover size-full"
                src={card.img}
              />
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-sans font-bold text-foreground text-base">{card.word}</p>
                {card.urgent && (
                  <span className="font-sans font-bold text-primary text-[10px] bg-secondary rounded-full px-2.5 py-0.5 border border-primary/20 uppercase tracking-wide">
                    DUE TODAY
                  </span>
                )}
              </div>
              <p className="font-sans text-muted-foreground text-xs font-medium">Last reviewed {card.daysAgo}</p>
            </div>

            <MasteryMeter mastery={card.mastery} />
          </div>
        ))}
      </section>

      {/* Start review CTA */}
      <footer>
        <button
          type="button"
          onClick={() => dispatch({ type: "START_LESSON" })}
          className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 w-full font-sans font-bold text-white text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue min-h-[52px] shadow-wp-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Start Review Session (+15 XP)</span>
          <ArrowRight className="size-5" />
        </button>
      </footer>
    </div>
  );
});
