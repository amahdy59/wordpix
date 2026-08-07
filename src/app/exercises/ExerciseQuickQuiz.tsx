import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { FeedbackModal } from "../shared/FeedbackModal";
import { HelpCircle, Keyboard } from "lucide-react";

interface Props {
  step: number;
  words: VocabItem[];
  groupId?: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseQuickQuiz = memo(function ExerciseQuickQuiz({
  step,
  words,
  groupId,
  dispatch,
}: Props) {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleSelect = (id: string) => {
    if (feedback) return;
    playClick();
    setSelectedId(id);

    const correct = id === currentTargetWord.id;
    if (correct) {
      setFeedback("correct");
      playCorrect();
    } else {
      setFeedback("incorrect");
      playIncorrect();
    }
    setShowModal(true);
    dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct });
  };

  const handleModalContinue = () => {
    setShowModal(false);
    if (isCorrect) {
      if (questionIndex + 1 < words.length) {
        setQuestionIndex((i) => i + 1);
        setSelectedId(null);
        setFeedback(null);
      } else {
        dispatch({ type: "LESSON_NEXT" });
      }
    } else {
      setSelectedId(null);
      setFeedback(null);
    }
  };

  return (
    <ExerciseShell
      step={step}
      title="Mastery Quick Quiz"
      words={words}
      activeWord={currentTargetWord}
      mode="assessment"
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
            <Keyboard className="size-4" />
            <span>Press 1–4 on keyboard to select option</span>
          </div>
          <span>Question {questionIndex + 1} of {words.length}</span>
        </div>
      }
    >
      <FeedbackModal
        isOpen={showModal}
        isCorrect={isCorrect}
        title={isCorrect ? "✓ Mastered Visual Recall!" : "Not Quite"}
        wordLabel={currentTargetWord.label}
        explanation={
          isCorrect
            ? `"${richSentence.full}"`
            : `The correct word for this image is "${currentTargetWord.label}".`
        }
        onContinue={handleModalContinue}
        onTryAgain={handleModalContinue}
      />

      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
        {/* Single-Line Question Heading */}
        <div className="bg-wp-card border border-border rounded-2xl p-3.5 sm:p-4 text-center shadow-wp-xs shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-primary font-bold text-xs shrink-0">
            <HelpCircle className="size-4 text-wp-blue" />
            <span>Quiz Q{questionIndex + 1}</span>
          </div>
          <h2 className="font-sans font-black text-foreground text-base sm:text-lg md:text-xl truncate text-center flex-1">
            Which picture shows &ldquo;<span className="text-primary">{currentTargetWord.label}</span>&rdquo;?
          </h2>
          <span className="text-[11px] font-sans font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0">
            /{currentTargetWord.phonetic}/
          </span>
        </div>

        {/* 2x2 Grid Layout */}
        <div
          role="radiogroup"
          aria-label={`Which image matches ${currentTargetWord.label}?`}
          className="grid grid-cols-2 gap-3.5 w-full"
        >
          {options.map((option, idx) => {
            const isSelected = selectedId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={feedback !== null}
                onClick={() => handleSelect(option.id)}
                className={`group relative rounded-2xl overflow-hidden p-1.5 border-2 flex flex-col items-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all duration-200 shadow-wp-xs ${
                  isSelected
                    ? isCorrect
                      ? "border-wp-green bg-wp-green-light/40"
                      : "border-wp-rose bg-wp-rose-light/40 animate-wp-shake"
                    : "border-border bg-wp-card hover:border-primary/60 hover:shadow-md"
                }`}
              >
                {/* Physical Keyboard Badge */}
                <span
                  aria-hidden
                  className="absolute top-2.5 start-2.5 z-10 bg-slate-900/90 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow-md backdrop-blur-md pointer-events-none"
                >
                  Key [{idx + 1}]
                </span>

                <div className="h-32 sm:h-40 md:h-44 max-h-[24vh] w-full relative rounded-xl overflow-hidden bg-muted border border-border/60 shrink-0">
                  <WordImage
                    word={option}
                    width="600"
                    height="450"
                    altMode="assessment"
                    optionIndex={idx}
                    checked={isSelected}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </ExerciseShell>
  );
});
