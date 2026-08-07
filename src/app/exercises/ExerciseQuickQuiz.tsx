import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { Timer, TimerOff, HelpCircle, Lightbulb, Keyboard } from "lucide-react";
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
            <div className="flex items-center justify-center gap-1.5 text-xs font-sans font-bold text-amber-600 dark:text-amber-400">
              <Keyboard className="size-4" />
              <span>Press 1, 2, 3, or 4 on keyboard or tap image card</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleAction}
            className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] transition-colors duration-200 shadow-wp-xs ${
              shaking ? "animate-wp-shake" : ""
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
      <div className="flex flex-col gap-5 w-full">
        {/* Question Counter & Decluttered Single-Line Header Bar */}
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-sans font-bold text-muted-foreground">Quiz Question {questionIndex + 1} of {words.length}</span>
            <h2 className="font-sans font-black text-foreground text-xl md:text-2xl whitespace-nowrap truncate leading-tight">
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
              className={`min-h-[44px] px-3.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold font-sans transition-colors ${
                hintUsed
                  ? "bg-amber-500/20 text-amber-600 border-amber-500/30"
                  : "bg-wp-card border-border text-muted-foreground hover:text-foreground shadow-xs"
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
              className="min-h-[44px] min-w-[44px] px-3.5 rounded-xl border border-border bg-wp-card text-muted-foreground hover:text-foreground flex items-center gap-2 shrink-0 transition-colors shadow-xs"
            >
              {timerOn ? <Timer className="size-4" /> : <TimerOff className="size-4" />}
              <span className="text-xs font-bold font-sans">
                {timerOn ? `0:${String(timeLeft).padStart(2, "0")}` : "Timer"}
              </span>
            </button>
          </div>
        </div>

        {/* Decluttered Image Option Grid (No Redundant Option Badges) */}
        <div
          role="radiogroup"
          aria-label={`Choose the image that shows ${currentTargetWord.label}`}
          className="grid grid-cols-2 gap-4 w-full"
        >
          {options.map((option, idx) => {
            const selected = selectedId === option.id;
            const isEliminated = eliminatedIds.includes(option.id);

            let resultClass = "border-2 border-border bg-wp-card hover:border-primary/50 hover:shadow-md";
            if (selected) {
              if (checked) {
                resultClass = isCorrect
                  ? "border-2 border-wp-green bg-wp-green-light/40 shadow-md"
                  : "border-2 border-wp-rose bg-wp-rose-light/40 shadow-md animate-wp-shake";
              } else {
                resultClass = "border-2 border-primary bg-primary/5 shadow-md";
              }
            }

            if (isEliminated) {
              return (
                <div key={option.id} className="bg-muted/40 border-2 border-border/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center opacity-40 min-h-[200px]">
                  <HelpCircle className="size-10 text-muted-foreground mb-2" />
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
                className={`group relative rounded-3xl overflow-hidden min-h-[200px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-colors duration-200 flex flex-col shadow-wp-xs ${resultClass}`}
              >
                {/* Single Clean Physical Key Badge */}
                <span className="absolute top-3 left-3 z-10 bg-slate-900/90 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-xl border border-white/20 shadow-md backdrop-blur-md pointer-events-none">
                  Key [{idx + 1}]
                </span>

                <div className="h-44 sm:h-52 md:h-60 w-full relative bg-muted overflow-hidden shrink-0">
                  <WordImage
                    word={option}
                    width="600"
                    height="450"
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                    altMode="assessment"
                    optionIndex={idx}
                    checked={checked}
                  />
                </div>
                <div className="p-3 bg-wp-card flex items-center justify-between border-t border-border/60 flex-1">
                  <p className="font-sans font-bold text-foreground text-sm truncate">
                    {checked ? option.label : `Option ${["A", "B", "C", "D"][idx]}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {checked && (
          <div
            role="status"
            aria-live="polite"
            className={`w-full rounded-2xl p-4 flex flex-col gap-1 shadow-xs transition-all ${
              isCorrect ? "bg-wp-green text-white border border-wp-green" : "bg-wp-rose text-white border border-wp-rose"
            }`}
          >
            <p className="font-sans font-bold text-sm">
              {isCorrect ? "✨ Correct — excellent visual recall!" : `Not quite.`}
            </p>
            {!isCorrect && (
              <p className="font-sans text-xs text-white/90 leading-relaxed mt-0.5">
                The target item is <strong>{currentTargetWord.label}</strong> (/{currentTargetWord.phonetic}/). Keep building your vocabulary memory!
              </p>
            )}
          </div>
        )}
      </div>
    </ExerciseShell>
  );
});
