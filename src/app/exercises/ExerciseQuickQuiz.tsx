import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { Timer, TimerOff } from "lucide-react";
import { getWordOptions } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";

interface Props {
  step: number;
  word: VocabItem;
  dispatch: React.Dispatch<Action>;
}

const TIMER_SECONDS = 45;

export const ExerciseQuickQuiz = memo(function ExerciseQuickQuiz({ step, word, dispatch }: Props) {
  const options = useMemo(() => getWordOptions(word), [word]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCorrect = selectedId === word.id;

  useEffect(() => {
    if (!timerOn || checked) return undefined;
    intervalRef.current = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimerOn(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerOn, checked]);

  const toggleTimer = () => {
    if (!timerOn) setTimeLeft(TIMER_SECONDS);
    setTimerOn((current) => !current);
  };

  const handleAction = () => {
    if (checked) {
      if (isCorrect) dispatch({ type: "LESSON_NEXT" });
      else {
        setSelectedId(null);
        setChecked(false);
      }
      return;
    }
    if (!selectedId) return;
    setChecked(true);
    setTimerOn(false);
    dispatch({ type: "LESSON_ATTEMPT", correct: isCorrect });
  };

  return (
    <div className="bg-background flex flex-col justify-between min-h-full relative">
      <LessonHeader title="Quick Quiz" step={step} onBack={() => dispatch({ type: "LESSON_PREVIOUS" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 flex flex-col items-center w-full px-5 gap-4 pt-4">
        <div className="flex items-center justify-between w-full gap-3">
          <h2 className="font-sans font-bold text-foreground text-xl flex-1">Which image shows “{word.label.toLowerCase()}”?</h2>
          <button type="button" onClick={toggleTimer} aria-label={timerOn ? "Turn optional timer off" : "Turn optional timer on"} aria-pressed={timerOn} className="min-h-[44px] px-3 rounded-lg border border-border bg-wp-card text-muted-foreground flex items-center gap-2">
            {timerOn ? <Timer className="size-4" /> : <TimerOff className="size-4" />}
            <span className="text-xs font-bold">{timerOn ? `0:${String(timeLeft).padStart(2, "0")}` : "Timer off"}</span>
          </button>
        </div>
        <div role="radiogroup" aria-label={`Choose the image that shows ${word.label}`} className="grid grid-cols-2 gap-2.5 w-full">
          {options.map((option) => {
            const selected = selectedId === option.id;
            const resultClass = checked && selected ? isCorrect ? "border-wp-green border-[3px]" : "border-wp-rose border-[3px]" : selected ? "border-primary border-[3px]" : "border-border";
            return (
              <button key={option.id} type="button" role="radio" aria-checked={selected} disabled={checked} onClick={() => setSelectedId(option.id)} className={`bg-wp-card rounded-xl border overflow-hidden focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary ${resultClass}`}>
                <WordImage word={option} width="400" height="300" className="h-32 w-full object-cover" />
              </button>
            );
          })}
        </div>
        {timeLeft === 0 && <p role="status" className="w-full bg-secondary border border-primary rounded-xl px-4 py-3 text-sm font-semibold text-primary">Challenge time ended. Take as long as you need to answer.</p>}
        {checked && <p role="status" aria-live="polite" className={`w-full rounded-xl p-3 text-sm font-sans font-semibold ${isCorrect ? "bg-wp-green-light text-wp-green" : "bg-wp-rose-light text-wp-rose"}`}>{isCorrect ? "Correct — great visual recall." : `Not yet. Find the image labelled ${word.label}.`}</p>}
      </main>
      <footer className="w-full px-5 pb-10 pt-3">
        <button type="button" onClick={handleAction} disabled={!selectedId} className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] disabled:opacity-40 ${checked ? isCorrect ? "bg-wp-green" : "bg-wp-rose" : "bg-wp-blue"}`}>
          {checked ? isCorrect ? "Finish Lesson" : "Try Again" : "Check Answer"}
        </button>
      </footer>
      <HomeIndicator />
    </div>
  );
});
