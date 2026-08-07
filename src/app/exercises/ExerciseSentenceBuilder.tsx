import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { PenTool } from "lucide-react";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { FeedbackModal } from "../shared/FeedbackModal";
import { useProgress } from "../data/progress";

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
  const [showModal, setShowModal] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { progress } = useProgress();
  const { playCorrect, playIncorrect, playClick } = useSound();

  const currentTargetWord = words[questionIndex] || words[0];
  const richSentence = useMemo(() => getRichSentence(currentTargetWord), [currentTargetWord]);

  const answer = useMemo(() => richSentence.words, [richSentence]);
  const shuffled = useMemo(() => shuffleArray([...answer]), [answer]);

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
    if (placed.length !== answer.length) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setChecked(true);
    if (isCorrect) playCorrect();
    else playIncorrect();

    setShowModal(true);
    dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct: isCorrect });
  };

  const handleModalContinue = () => {
    setShowModal(false);
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
        <div className="w-full flex flex-col gap-1">
          {placed.length < answer.length && (
            <p className="text-[11px] font-sans font-semibold text-center text-amber-600 dark:text-amber-400">
              Tap tiles below in correct order to build the sentence
            </p>
          )}
          <button
            type="button"
            onClick={handleAction}
            className={`rounded-xl py-3.5 w-full font-sans font-bold text-white text-sm sm:text-base min-h-[48px] transition-all shadow-wp-xs ${
              shaking ? "animate-wp-shake" : ""
            } ${
              placed.length === answer.length ? "bg-wp-blue opacity-100" : "bg-wp-blue opacity-50"
            }`}
          >
            Check Sentence
          </button>
        </div>
      }
    >
      <FeedbackModal
        streakCount={progress.streak}
        isOpen={showModal}
        isCorrect={isCorrect}
        title={isCorrect ? "✓ Great Sentence Structure!" : "Try Re-ordering"}
        wordLabel={currentTargetWord.label}
        explanation={
          isCorrect
            ? `"${richSentence.full}"`
            : `Correct sentence order: "${answer.join(" ")}"`
        }
        onContinue={handleModalContinue}
        onTryAgain={handleModalContinue}
      />

      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
        {/* Question Counter & Skill Badge */}
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground px-1">
          <span>Sentence {questionIndex + 1} of {words.length}</span>
          <span className="flex items-center gap-1 text-primary bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full">
            <PenTool className="size-3" />
            <span>Spelling &amp; Sentence Skill</span>
          </span>
        </div>

        {/* Fluid Hero Target Image Display */}
        <div className="h-40 sm:h-48 md:h-52 max-h-[28vh] w-full relative rounded-2xl overflow-hidden border border-border shadow-wp-md bg-muted shrink-0">
          <WordImage word={currentTargetWord} width="800" height="500" className="size-full object-cover" />
        </div>

        {/* Sentence Assembly Canvas */}
        <div className="bg-wp-card rounded-2xl border-2 border-primary/30 p-3.5 sm:p-4 w-full flex flex-col gap-1.5 shadow-wp-xs">
          <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-wider">
            Sentence Assembly Canvas
          </span>
          <div
            className="flex flex-wrap gap-2 items-center min-h-[56px] bg-secondary/40 p-2.5 rounded-xl border border-dashed border-primary/40"
            aria-label="Built sentence"
          >
            {placed.map((item, index) => (
              <button
                key={`${item}-${index}`}
                type="button"
                disabled={checked}
                onClick={() => handleRemoveTile(index)}
                className="bg-primary rounded-xl px-3.5 py-2 font-sans font-black text-primary-foreground text-sm sm:text-base shadow-xs hover:bg-primary/90 transition-all focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary"
              >
                {item}
              </button>
            ))}
            {placed.length === 0 && (
              <span className="text-muted-foreground text-xs sm:text-sm font-sans font-medium px-2">
                Tap word tiles below in the correct order...
              </span>
            )}
          </div>
        </div>

        {/* Available Word Tiles */}
        <div role="group" aria-label="Available words" className="flex flex-wrap gap-2.5 justify-center w-full">
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
                className="bg-wp-card rounded-xl border-2 border-border px-5 py-2.5 font-sans font-bold text-foreground text-sm sm:text-base disabled:opacity-30 min-h-[44px] hover:border-primary hover:bg-secondary/50 transition-colors duration-200 shadow-wp-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </ExerciseShell>
  );
});
