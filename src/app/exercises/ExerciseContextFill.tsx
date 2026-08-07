import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { FeedbackModal } from "../shared/FeedbackModal";

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
  const [showModal, setShowModal] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { playCorrect, playIncorrect, playClick } = useSound();

  const currentTargetWord = words[questionIndex] || words[0];
  const richSentence = useMemo(() => getRichSentence(currentTargetWord), [currentTargetWord]);

  const options = useMemo(() => {
    const otherWords = words.filter((w) => w.id !== currentTargetWord.id);
    const shuffled = shuffleArray(otherWords).slice(0, 3);
    const pool = [currentTargetWord, ...shuffled];
    return shuffleArray(pool);
  }, [currentTargetWord, words]);

  const isCorrect = selectedId === currentTargetWord.id;
  const selectedWord = options.find((item) => item.id === selectedId);

  const handleSelect = (id: string) => {
    if (checked) return;
    playClick();
    setSelectedId(id);
  };

  const handleAction = () => {
    if (!selectedId) {
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
        setSelectedId(null);
        setChecked(false);
      } else {
        dispatch({ type: "LESSON_NEXT" });
      }
    } else {
      setSelectedId(null);
      setChecked(false);
    }
  };

  return (
    <ExerciseShell
      step={step}
      title="Complete the Sentence"
      words={words}
      activeWord={currentTargetWord}
      mode="guided"
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex flex-col gap-1">
          {!selectedId && (
            <p className="text-[11px] font-sans font-semibold text-center text-amber-600 dark:text-amber-400">
              Select a word below to complete the sentence
            </p>
          )}
          <button
            type="button"
            onClick={handleAction}
            className={`rounded-xl py-3.5 w-full font-sans font-bold text-white text-sm sm:text-base min-h-[48px] transition-all shadow-wp-xs ${
              shaking ? "animate-wp-shake" : ""
            } ${selectedId ? "bg-wp-blue opacity-100" : "bg-wp-blue opacity-50"}`}
          >
            Check Answer
          </button>
        </div>
      }
    >
      <FeedbackModal
        isOpen={showModal}
        isCorrect={isCorrect}
        title={isCorrect ? "✓ Sentence Completed!" : "Check Sentence Context"}
        wordLabel={currentTargetWord.label}
        explanation={
          isCorrect
            ? `"${richSentence.full}"`
            : `Correct sentence: "${richSentence.full}"`
        }
        onContinue={handleModalContinue}
        onTryAgain={handleModalContinue}
      />

      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
        {/* Question Counter Header */}
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground px-1">
          <span>Sentence {questionIndex + 1} of {words.length}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full">
            Context Drill · {currentTargetWord.label}
          </span>
        </div>

        {/* Fluid Hero Target Image Display */}
        <div className="h-40 sm:h-48 md:h-52 max-h-[28vh] w-full relative rounded-2xl overflow-hidden border border-border shadow-wp-md bg-muted shrink-0">
          <WordImage word={currentTargetWord} width="800" height="500" className="size-full object-cover" />
        </div>

        {/* Centered Rich Sentence Display Box */}
        <div className="bg-wp-card rounded-2xl border border-border p-4 text-center shadow-wp-xs flex flex-col items-center justify-center gap-1">
          <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-wider">
            Sentence Context Clue
          </span>
          <p className="font-sans font-bold text-foreground text-lg sm:text-xl leading-relaxed flex items-center justify-center flex-wrap gap-2 py-0.5">
            <span>{richSentence.clozeBefore}</span>
            <span
              className={`inline-flex items-center justify-center min-w-[120px] h-10 px-3 rounded-xl border-2 transition-all font-sans font-black text-lg shadow-xs ${
                selectedWord
                  ? checked
                    ? isCorrect
                      ? "bg-wp-green text-white border-wp-green"
                      : "bg-wp-rose text-white border-wp-rose"
                    : "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/80 border-dashed border-primary/50 text-muted-foreground"
              }`}
            >
              {selectedWord ? selectedWord.label.toLowerCase() : "_______"}
            </span>
            <span>{richSentence.clozeAfter}</span>
          </p>
        </div>

        {/* Word Options Grid (2x2 Grid) */}
        <div role="radiogroup" aria-label="Word choices" className="grid grid-cols-2 gap-3 w-full">
          {options.map((option, idx) => {
            const isSelected = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={checked}
                onClick={() => handleSelect(option.id)}
                className={`rounded-xl p-3 sm:p-3.5 font-sans font-bold text-sm sm:text-base border-2 min-h-[48px] transition-colors duration-200 flex items-center justify-between shadow-wp-xs ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground shadow-md"
                    : "bg-wp-card border-border text-foreground hover:border-primary/50 hover:shadow-md"
                } focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary`}
              >
                <span className="capitalize">{option.label.toLowerCase()}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  [{idx + 1}]
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </ExerciseShell>
  );
});
