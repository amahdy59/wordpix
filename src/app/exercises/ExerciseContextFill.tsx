import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { articleFor } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";

interface Props {
  step: number;
  words: VocabItem[];
  groupId?: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseContextFill = memo(function ExerciseContextFill({
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
    const otherWords = words.filter((w) => w.id !== currentTargetWord.id);
    const shuffled = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    const pool = [currentTargetWord, ...shuffled];
    return pool.sort(() => 0.5 - Math.random());
  }, [currentTargetWord, words]);

  const isCorrect = selectedId === currentTargetWord.id;
  const selectedWord = options.find((item) => item.id === selectedId);

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
      title="Complete the Sentence"
      words={words}
      activeWord={currentTargetWord}
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="flex flex-col gap-1.5">
          {!selectedId && !checked && (
            <p className="text-[11px] font-sans font-semibold text-center text-amber-600 dark:text-amber-400">
              Select a word to complete the sentence
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
                  ? `Next Sentence (${questionIndex + 2}/${words.length}) →`
                  : "Complete Step →"
                : "Try Again"
              : "Check Answer"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 w-full max-w-lg">
        {/* Question Counter */}
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground">
          <span>Sentence {questionIndex + 1} of {words.length}</span>
          <span className="text-primary font-semibold">Group context drill</span>
        </div>

        {/* Target Image Preview */}
        <div className="bg-wp-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="size-20 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
            <WordImage word={currentTargetWord} width="80" height="80" className="size-full object-cover" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-foreground text-xl">Fill in the blank</h2>
            <p className="font-sans text-muted-foreground text-xs mt-0.5">Match the image to the sentence.</p>
          </div>
        </div>

        {/* Sentence display */}
        <div className="bg-wp-card rounded-2xl border border-border p-5 text-center shadow-xs">
          <p className="font-sans font-bold text-foreground text-xl leading-relaxed">
            This is {articleFor(currentTargetWord.label)}{" "}
            <span className="inline-block min-w-28 border-b-2 border-primary text-primary px-1">
              {selectedWord?.label.toLowerCase() ?? "_______"}
            </span>
            .
          </p>
        </div>

        {/* Word options */}
        <div role="group" aria-label="Word choices" className="flex flex-wrap gap-3 justify-center">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={selectedId === option.id}
              disabled={checked}
              onClick={() => setSelectedId(option.id)}
              className={`rounded-xl px-5 py-3 font-sans font-bold text-sm border min-h-[48px] transition-all ${
                selectedId === option.id
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-wp-card border-border text-foreground hover:border-primary/40"
              } focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary`}
            >
              {option.label.toLowerCase()}
            </button>
          ))}
        </div>

        {checked && (
          <p
            role="status"
            aria-live="polite"
            className={`w-full rounded-xl p-4 text-sm font-sans font-semibold ${isCorrect ? "bg-wp-green-light text-wp-green" : "bg-wp-rose-light text-wp-rose"}`}
          >
            {isCorrect
              ? "Correct. The sentence matches the target image."
              : `Try again — the picture shows ${articleFor(currentTargetWord.label)} ${currentTargetWord.label.toLowerCase()}.`}
          </p>
        )}
      </div>
    </ExerciseShell>
  );
});
