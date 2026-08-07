import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { Timer, TimerOff } from "lucide-react";
import { WordImage } from "../shared/WordImage";
import { shuffleArray } from "../../utils/shuffle";

interface Props {
  step: number;
  words: VocabItem[];
  groupId?: string;
  dispatch: React.Dispatch<Action>;
}

const TIMER_SECONDS = 45;

export const ExerciseQuickQuiz = memo(function ExerciseQuickQuiz({
  step,
  words,
  groupId,
  dispatch,
}: Props) {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentTargetWord = words[questionIndex] || words[0];

  const options = useMemo(() => {
    const otherWords = words.filter((w) => w.id !== currentTargetWord.id);
    const shuffledDistractors = shuffleArray(otherWords).slice(0, 3);
    const pool = [currentTargetWord, ...shuffledDistractors];
    return shuffleArray(pool);
  }, [currentTargetWord, words]);

  const isCorrect = selectedId === currentTargetWord.id;

  useEffect(() => {
    if (!timerOn || checked) return undefined;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { if (intervalRef.current) clearInterval(intervalRef.current); setTimerOn(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerOn, checked]);

  const toggleTimer = () => { if (!timerOn) setTimeLeft(TIMER_SECONDS); setTimerOn((v) => !v); };

  // Keyboard Arrow key navigation across radio options
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (checked) return;
      let nextIndex = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = (index + 1) % options.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = (index - 1 + options.length) % options.length;
      }
      if (nextIndex !== index) {
        setSelectedId(options[nextIndex].id);
        radioRefs.current[nextIndex]?.focus();
      }
    },
    [checked, options]
  );

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
    setTimerOn(false);
    dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct: isCorrect });
  };

  return (
    <ExerciseShell
      step={step}
      title="Group Quick Quiz"
      words={words}
      activeWord={currentTargetWord}
      mode="assessment"
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="flex flex-col gap-1.5">
          {!selectedId && !checked && (
            <p className="text-[11px] font-sans font-semibold text-center text-amber-600 dark:text-amber-400">
              Tap an image option to select
            </p>
          )}
          <button
            type="button"
            onClick={handleAction}
            className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] transition-all ${
              shaking ? "animate-bounce motion-reduce:animate-none" : ""
            } ${
              checked
                ? isCorrect ? "bg-wp-green" : "bg-wp-rose"
                : selectedId ? "bg-wp-blue opacity-100" : "bg-wp-blue opacity-50"
            }`}
          >
            {checked
              ? isCorrect
                ? questionIndex + 1 < words.length
                  ? `Next Quiz Question (${questionIndex + 2}/${words.length}) →`
                  : "Finish Group Session 🎉"
                : "Try Again"
              : "Check Answer"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
        {/* Question counter & timer header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-sans font-bold text-muted-foreground">Quiz Question {questionIndex + 1} of {words.length}</span>
            <h2 className="font-sans font-bold text-foreground text-xl leading-tight">
              Which image shows &ldquo;{currentTargetWord.label.toLowerCase()}&rdquo;?
            </h2>
          </div>
          <button
            type="button"
            onClick={toggleTimer}
            aria-label={timerOn ? "Turn optional timer off" : "Turn optional timer on"}
            aria-pressed={timerOn}
            className="min-h-[44px] min-w-[44px] px-3 rounded-xl border border-border bg-wp-card text-muted-foreground hover:text-foreground flex items-center gap-2 shrink-0 transition-colors"
          >
            {timerOn ? <Timer className="size-4" /> : <TimerOff className="size-4" />}
            <span className="text-xs font-bold font-sans">
              {timerOn ? `0:${String(timeLeft).padStart(2, "0")}` : "Timer off"}
            </span>
          </button>
        </div>

        {/* Image option grid */}
        <div
          role="radiogroup"
          aria-label={`Choose the image that shows ${currentTargetWord.label}`}
          className="grid grid-cols-2 gap-3"
        >
          {options.map((option, idx) => {
            const selected = selectedId === option.id;
            const resultClass = checked && selected
              ? isCorrect ? "border-wp-green border-[3px] ring-2 ring-wp-green/30" : "border-wp-rose border-[3px] ring-2 ring-wp-rose/30"
              : selected ? "border-primary border-[3px] ring-2 ring-primary/20" : "border-border hover:border-primary/40";
            return (
              <button
                key={option.id}
                ref={(el) => { radioRefs.current[idx] = el; }}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected || (!selectedId && idx === 0) ? 0 : -1}
                disabled={checked}
                onClick={() => setSelectedId(option.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`bg-wp-card rounded-2xl border overflow-hidden min-h-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all ${resultClass}`}
              >
                <WordImage
                  word={option}
                  width="400"
                  height="300"
                  className="h-36 w-full object-cover"
                  altMode="assessment"
                  optionIndex={idx}
                  checked={checked}
                />
                <p className="font-sans font-semibold text-foreground text-sm px-3 py-2 text-left truncate">
                  {checked ? option.label : `Option ${["A", "B", "C", "D"][idx]}`}
                </p>
              </button>
            );
          })}
        </div>

        {timeLeft === 0 && (
          <p role="status" className="w-full bg-secondary border border-primary rounded-xl px-4 py-3 text-sm font-semibold text-primary font-sans">
            Challenge time ended. Take as long as you need.
          </p>
        )}
        {checked && (
          <p
            role="status"
            aria-live="polite"
            className={`w-full rounded-xl p-4 text-sm font-sans font-semibold ${isCorrect ? "bg-wp-green-light text-wp-green" : "bg-wp-rose-light text-wp-rose"}`}
          >
            {isCorrect ? "Correct — great visual recall." : `Not yet. Find the image showing ${currentTargetWord.label}.`}
          </p>
        )}
      </div>
    </ExerciseShell>
  );
});
