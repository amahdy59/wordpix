import { memo } from "react";
import type { Action } from "../types";
import svgLesson from "@/imports/FlowLessonExercises/svg-2zwti0wuib";

const imgThumb  = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80";
const imgThumb1 = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80";
const imgThumb2 = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

type Mastery = "mastered" | "practiced" | "recognized";

interface WordCard {
  id: string;
  word: string;
  ar: string;
  daysAgo: string;
  mastery: Mastery;
  img: string;
  urgent?: boolean;
}

const WORD_CARDS: WordCard[] = [
  { id: "pillow",  word: "Pillow",  ar: "وسادة",  daysAgo: "2 days ago", mastery: "recognized", img: imgThumb,  urgent: true },
  { id: "lamp",    word: "Lamp",    ar: "مصباح",  daysAgo: "3 days ago", mastery: "practiced",  img: imgThumb1               },
  { id: "blanket", word: "Blanket", ar: "بطانية", daysAgo: "5 days ago", mastery: "mastered",   img: imgThumb2               },
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
          className="rounded-sm h-3 w-2"
          style={{ background: bar <= filled ? color : "var(--wp-border)" }}
          aria-hidden
        />
      ))}
    </div>
  );
}

export const ReviewMasteryReview = memo(function ReviewMasteryReview({ dispatch }: Props) {
  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-8">
      {/* Page header */}
      <header className="flex items-center gap-3">
        <div className="flex-1">
          <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight">
            Review Time!
          </h1>
          <p
            className="font-arabic font-bold text-primary text-lg"
            dir="auto"
            lang="ar"
          >
            وقت المراجعة!
          </p>
        </div>

        {/* Streak badge */}
        <div className="bg-secondary rounded-xl px-3 py-2 flex items-center gap-2 border border-primary/20 shrink-0">
          <svg fill="none" height="20" viewBox="0 0 24 24" width="20" aria-hidden>
            <path d={svgLesson.p38bc1900} fill="var(--wp-brand)" />
          </svg>
          <span className="font-sans font-bold text-primary text-base">7</span>
        </div>
      </header>

      <p className="font-sans font-medium text-muted-foreground text-sm -mt-4">
        3 words ready for review
      </p>

      {/* Word card list */}
      <section aria-label="Words to review" className="flex flex-col gap-3">
        {WORD_CARDS.map((card) => (
          <div
            key={card.id}
            className="bg-wp-card rounded-xl border border-border p-4 flex items-center gap-4 shadow-wp-xs"
          >
            <div className="relative rounded-xl shrink-0 size-14 overflow-hidden">
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
                  <span className="font-sans font-semibold text-primary text-[9px] bg-secondary rounded-full px-2 py-0.5 border border-primary/20 whitespace-nowrap">
                    REVIEW TODAY
                  </span>
                )}
              </div>
              <p
                className="font-arabic text-muted-foreground text-xs"
                dir="auto"
                lang="ar"
              >
                {card.ar}
              </p>
              <p className="font-sans text-muted-foreground text-xs">{card.daysAgo}</p>
            </div>

            <MasteryMeter mastery={card.mastery} />
          </div>
        ))}
      </section>

      {/* Start review CTA */}
      <footer>
        <button
          onClick={() => dispatch({ type: "START_LESSON" })}
          className="bg-wp-blue rounded-xl py-4 w-full font-sans font-bold text-white text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wp-blue min-h-[56px] motion-safe:transition-opacity active:opacity-90"
        >
          Start Review
        </button>
      </footer>
    </div>
  );
});
