import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { Timer, TimerOff, HelpCircle, Lightbulb } from "lucide-react";
import { WordImage } from "../shared/WordImage";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";

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
  const [hintUsed, setHintUsed] = useState(false);
  const [eliminatedIds, setEliminatedIds] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { playCorrect, playIncorrect, playClick } = useSound();

  const currentTargetWord = words[questionIndex] || words[0];

  const options = useMemo(() => {
    const otherWords = words.filter((w) => w.id !== currentTargetWord.id);
    const shuffledDistractors = shuffleArray(otherWords).slice(0, 3);
    const pool = [currentTargetWord, ...shuffledDistractors];
    return shuffleArray(pool);
  }, [currentTargetWord, words]);

  const isCorrect = selectedId === currentTargetWord.id;

  // Handle 1, 2, 3, 4 number key shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (checked) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (options[idx] && !eliminatedIds.includes(options[idx].id)) {
          setSelectedId(options[idx].id);
          playClick();
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [checked, options, eliminatedIds, playClick]);

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

  const handleUseHint = () => {
    if (hintUsed || checked) return;
    const wrongDistractorIds = options
      .filter((opt) => opt.id !== currentTargetWord.id)
      .map((opt) => opt.id);
    const toEliminate = shuffleArray(wrongDistractorIds).slice(0, 2);
    setEliminatedIds(toEliminate);
    setHintUsed(true);
    playClick();
  };

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
      if (nextIndex !== index && !eliminatedIds.includes(options[nextIndex].id)) {
        setSelectedId(options[nextIndex].id);
        playClick();
        radioRefs.current[nextIndex]?.focus();
      }
    },
    [checked, options, eliminatedIds, playClick]
  );

  const handleAction = () => {
    if (checked) {
      if (isCorrect) {
        if (questionIndex + 1 < words.length) {
          setQuestionIndex((i) => i + 1);
          setSelectedId(null);
          setChecked(false);
          setHintUsed(false);
          setEliminatedIds([]);
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

    if (isCorrect) {
      playCorrect();
    } else {
      playIncorrect();
    }

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
              Tap an image option or press 1–4 on keyboard
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
        {/* Question counter & header actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-sans font-bold text-muted-foreground">Quiz Question {questionIndex + 1} of {words.length}</span>
            <h2 className="font-sans font-bold text-foreground text-xl leading-tight">
              Which image shows &ldquo;{currentTargetWord.label.toLowerCase()}&rdquo;?
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleUseHint}
              disabled={hintUsed || checked}
              aria-label="50/50 Hint: Eliminate two wrong choices"
              aria-expanded={hintUsed}
              className={`min-h-[44px] px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold font-sans transition-all ${
                hintUsed
                  ? "bg-amber-500/20 text-amber-600 border-amber-500/30"
                  : "bg-wp-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lightbulb className="size-4 text-wp-amber" />
              <span>50/50 Hint</span>
            </button>
            <button
              type="button"
              onClick={toggleTimer}
              aria-label={timerOn ? "Turn optional timer off" : "Turn optional timer on"}
              aria-pressed={timerOn}
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl border border-border bg-wp-card text-muted-foreground hover:text-foreground flex items-center gap-2 shrink-0 transition-colors"
            >
              {timerOn ? <Timer className="size-4" /> : <TimerOff className="size-4" />}
              <span className="text-xs font-bold font-sans">
                {timerOn ? `0:${String(timeLeft).padStart(2, "0")}` : "Timer"}
              </span>
            </button>
          </div>
        </div>

        {/* Image option grid */}
        <div
          role="radiogroup"
          aria-label={`Choose the image that shows ${currentTargetWord.label}`}
          className="grid grid-cols-2 gap-3"
        >
          {options.map((option, idx) => {
            const selected = selectedId === option.id;
            const isEliminated = eliminatedIds.includes(option.id);
            const resultClass = checked && selected
              ? isCorrect ? "border-wp-green border-[3px] ring-2 ring-wp-green/30" : "border-wp-rose border-[3px] ring-2 ring-wp-rose/30"
              : selected ? "border-primary border-[3px] ring-2 ring-primary/20" : "border-border hover:border-primary/40";

            if (isEliminated) {
              return (
                <div key={option.id} className="bg-muted/40 border border-border/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center opacity-40 min-h-[160px]">
                  <HelpCircle className="size-8 text-muted-foreground mb-1" />
                  <span className="font-sans text-xs font-semibold text-muted-foreground">Eliminated Option {idx + 1}</span>
                </div>
              );
            }

            return (
              <button
                key={option.id}
                ref={(el) => { radioRefs.current[idx] = el; }}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected || (!selectedId && idx === 0) ? 0 : -1}
                disabled={checked}
                onClick={() => { setSelectedId(option.id); playClick(); }}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`bg-wp-card rounded-2xl border overflow-hidden min-h-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all relative ${resultClass}`}
              >
                <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Key [{idx + 1}]
                </div>
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

        {checked && (
          <div
            role="status"
            aria-live="polite"
            className={`w-full rounded-2xl p-4 flex flex-col gap-1 ${
              isCorrect ? "bg-wp-green-light/40 border border-wp-green/30 text-wp-green" : "bg-wp-rose-light/40 border border-wp-rose/30 text-wp-rose"
            }`}
          >
            <p className="font-sans font-bold text-sm">
              {isCorrect ? "✨ Correct — excellent visual recall!" : `Not quite.`}
            </p>
            {!isCorrect && (
              <p className="font-sans text-xs text-foreground/80 leading-relaxed mt-0.5">
                The target item is <strong>{currentTargetWord.label}</strong> (/{currentTargetWord.phonetic}/). Keep building your vocabulary memory!
              </p>
            )}
          </div>
        )}
      </div>
    </ExerciseShell>
  );
});
