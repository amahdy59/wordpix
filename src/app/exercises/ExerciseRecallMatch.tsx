import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { WordImage } from "../shared/WordImage";

interface Props {
  step: number;
  words: VocabItem[];
  groupId?: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseRecallMatch = memo(function ExerciseRecallMatch({
  step,
  words,
  groupId,
  dispatch,
}: Props) {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [shaking, setShaking] = useState(false);

  const currentTargetWord = words[questionIndex] || words[0];

  const options = useMemo(() => {
    // Options drawn from group words plus fallbacks if words length < 4
    const otherWords = words.filter((w) => w.id !== currentTargetWord.id);
    const shuffled = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    const pool = [currentTargetWord, ...shuffled];
    return pool.sort(() => 0.5 - Math.random());
  }, [currentTargetWord, words]);

  const isCorrect = selectedId === currentTargetWord.id;

  const handleAction = () => {
    if (checked) {
      if (isCorrect) {
        if (questionIndex + 1 < words.length) {
          setQuestionIndex((i) => i + 1);
          setSelectedId(null);
          setChecked(false);
        } else {
          dispatch({ type: "LESSON_NEXT" });
        }
      } else {
        setSelectedId(null);
        setChecked(false);
      }
      return;
    }
    if (!selectedId) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setChecked(true);
    dispatch({ type: "LESSON_ATTEMPT", correct: isCorrect });
  };

  return (
    <ExerciseShell
      step={step}
      title="Recall & Match"
      words={words}
      activeWord={currentTargetWord}
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="flex flex-col gap-1.5">
          {!selectedId && !checked && (
            <p className="text-[11px] font-sans font-semibold text-center text-amber-600 dark:text-amber-400">
              Tap an option above to answer
            </p>
          )}
          <button
            type="button"
            onClick={handleAction}
            className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] transition-all ${
              shaking ? "animate-bounce" : ""
            } ${
              checked
                ? isCorrect ? "bg-wp-green" : "bg-wp-rose"
                : selectedId ? "bg-wp-blue opacity-100" : "bg-wp-blue opacity-50"
            }`}
          >
            {checked
              ? isCorrect
                ? questionIndex + 1 < words.length
                  ? `Next Item (${questionIndex + 2}/${words.length}) →`
                  : "Complete Step →"
                : "Try Again"
              : "Check Answer"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 w-full max-w-lg">
        {/* Question Counter */}
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground">
          <span>Question {questionIndex + 1} of {words.length}</span>
          <span className="text-primary font-semibold">Match target image</span>
        </div>

        {/* Prompt Card */}
        <div className="bg-wp-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="size-20 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
            <WordImage word={currentTargetWord} width="80" height="80" className="size-full object-cover" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-foreground text-xl">What is this item?</h2>
            <p className="font-sans text-muted-foreground text-xs mt-0.5">Select the matching group label below.</p>
          </div>
        </div>

        {/* Group Word Options */}
        <div role="radiogroup" aria-label="Choose the correct word" className="grid grid-cols-2 gap-3">
          {options.map((option) => {
            const selected = selectedId === option.id;
            const resultClass = checked && selected
              ? isCorrect ? "border-wp-green bg-wp-green-light text-wp-green" : "border-wp-rose bg-wp-rose-light text-wp-rose"
              : selected ? "border-primary bg-secondary border-2 text-primary" : "border-border bg-wp-card text-foreground";
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={checked}
                onClick={() => setSelectedId(option.id)}
                className={`rounded-xl border p-4 min-h-[64px] font-sans font-semibold text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all ${resultClass}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {checked && (
          <p
            role="status"
            aria-live="polite"
            className={`w-full rounded-xl p-4 text-sm font-sans font-semibold ${isCorrect ? "bg-wp-green-light text-wp-green" : "bg-wp-rose-light text-wp-rose"}`}
          >
            {isCorrect ? `Correct — this is ${currentTargetWord.label}.` : `Not quite. Look closely, then try ${currentTargetWord.label} again.`}
          </p>
        )}
      </div>
    </ExerciseShell>
  );
});
