import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { articleFor } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { PenTool } from "lucide-react";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";

interface Props {
  step: number;
  words: VocabItem[];
  groupId?: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseSentenceBuilder = memo(function ExerciseSentenceBuilder({
  step,
  words,
  groupId,
  dispatch,
}: Props) {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { playCorrect, playIncorrect, playClick } = useSound();

  const currentTargetWord = words[questionIndex] || words[0];

  const answer = useMemo(
    () => ["This", "is", articleFor(currentTargetWord.label), currentTargetWord.label.toLowerCase()],
    [currentTargetWord.label]
  );
  const shuffled = useMemo(() => shuffleArray([answer[3], answer[0], answer[2], answer[1]]), [answer]);

  const isCorrect = placed.join(" ") === answer.join(" ");

  const handleTileClick = (item: string) => {
    if (checked) return;
    playClick();
    setPlaced((items) => [...items, item]);
  };

  const handleRemoveTile = (index: number) => {
    if (checked) return;
    playClick();
    setPlaced((items) => items.filter((_, i) => i !== index));
  };

  const handleAction = () => {
    if (checked) {
      if (isCorrect) {
        if (questionIndex + 1 < words.length) {
          setQuestionIndex((i) => i + 1);
          setPlaced([]);
          setChecked(false);
        } else {
          dispatch({ type: "LESSON_NEXT" });
        }
      } else {
        setPlaced([]);
        setChecked(false);
      }
      return;
    }
    if (placed.length !== answer.length) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setChecked(true);
    if (isCorrect) playCorrect();
    else playIncorrect();
    dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct: isCorrect });
  };

  return (
    <ExerciseShell
      step={step}
      title="Writing & Sentence Construction"
      words={words}
      activeWord={currentTargetWord}
      mode="guided"
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="flex flex-col gap-1.5">
          {placed.length < answer.length && !checked && (
            <p className="text-[11px] font-sans font-semibold text-center text-amber-600 dark:text-amber-400">
              Tap tiles below in correct order to build the sentence
            </p>
          )}
          <button
            type="button"
            onClick={handleAction}
            className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] transition-all shadow-wp-xs ${
              shaking ? "animate-bounce" : ""
            } ${
              checked
                ? isCorrect ? "bg-wp-green" : "bg-wp-rose"
                : placed.length === answer.length ? "bg-wp-blue opacity-100" : "bg-wp-blue opacity-50"
            }`}
          >
            {checked
              ? isCorrect
                ? questionIndex + 1 < words.length
                  ? `Next Sentence (${questionIndex + 2}/${words.length}) →`
                  : "Continue to Quick Quiz →"
                : "Try Again"
              : "Check Sentence"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 w-full">
        {/* Question Counter & Skill Badge */}
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground px-1">
          <span>Writing Item {questionIndex + 1} of {words.length}</span>
          <span className="flex items-center gap-1 text-primary bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full">
            <PenTool className="size-3" />
            <span>Spelling &amp; Sentence Skill</span>
          </span>
        </div>

        {/* Target Image Preview Card */}
        <div className="bg-wp-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-wp-xs">
          <div className="size-20 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
            <WordImage word={currentTargetWord} width="80" height="80" className="size-full object-cover" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-foreground text-xl">Describe the picture</h2>
            <p className="font-sans text-muted-foreground text-xs mt-0.5">Build a complete sentence for this item.</p>
          </div>
        </div>

        {/* Sentence Assembly Area */}
        <div className="bg-wp-card rounded-2xl border-2 border-primary/30 p-5 w-full flex flex-col gap-2 shadow-wp-xs">
          <span className="font-sans font-bold text-[11px] text-primary uppercase tracking-wider">
            Sentence Assembly Canvas
          </span>
          <div
            className="flex flex-wrap gap-2.5 items-center min-h-[64px] bg-secondary/40 p-3 rounded-xl border border-dashed border-primary/40"
            aria-label="Built sentence"
          >
            {placed.map((item, index) => (
              <button
                key={`${item}-${index}`}
                type="button"
                disabled={checked}
                onClick={() => handleRemoveTile(index)}
                className="bg-primary rounded-xl px-4 py-2.5 font-sans font-black text-primary-foreground text-base shadow-xs hover:bg-primary/90 transition-all focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary"
              >
                {item}
              </button>
            ))}
            {placed.length === 0 && (
              <span className="text-muted-foreground text-sm font-sans font-medium px-2">
                Tap word tiles below in the correct order...
              </span>
            )}
          </div>
        </div>

        {/* Available Word Tiles */}
        <div role="group" aria-label="Available words" className="flex flex-wrap gap-3 justify-center w-full">
          {shuffled.map((item, index) => {
            const usedCount = placed.filter((p) => p === item).length;
            const availableCount = shuffled.slice(0, index + 1).filter((t) => t === item).length;
            const used = usedCount >= availableCount;
            return (
              <button
                key={`${item}-${index}`}
                type="button"
                disabled={checked || used}
                onClick={() => handleTileClick(item)}
                className="bg-wp-card rounded-2xl border border-border px-6 py-3.5 font-sans font-bold text-foreground text-base disabled:opacity-30 min-h-[52px] hover:border-primary hover:bg-secondary/50 transition-all shadow-wp-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
              >
                {item}
              </button>
            );
          })}
        </div>

        {checked && (
          <div
            role="status"
            aria-live="polite"
            className={`w-full rounded-2xl p-4 text-sm font-sans font-bold text-center border shadow-xs transition-all ${
              isCorrect
                ? "bg-wp-green text-white border-wp-green"
                : "bg-wp-rose text-white border-wp-rose"
            }`}
          >
            {isCorrect ? "✓ Great sentence structure!" : `Try this order: ${answer.join(" ")}.`}
          </div>
        )}
      </div>
    </ExerciseShell>
  );
});
