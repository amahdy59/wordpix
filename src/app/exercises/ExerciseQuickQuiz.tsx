import { memo, useState, useEffect, useCallback, useRef } from "react";
import type { Action } from "../types";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { Timer, TimerOff } from "lucide-react";

const IMG_PILLOW  = "https://images.unsplash.com/photo-1623944436679-5412c658a358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const IMG_BLANKET = "https://images.unsplash.com/photo-1600369672770-985fd30004eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const IMG_CURTAIN = "https://images.unsplash.com/photo-1528822855841-e8bf3134cdc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const IMG_RUG     = "https://images.unsplash.com/photo-1652634213812-f0deeb1de78e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  step: number;
  dispatch: React.Dispatch<Action>;
}

const IMAGES = [
  { id: "pillow",  img: IMG_PILLOW,  alt: "White pillows on a bed",             correct: true  },
  { id: "blanket", img: IMG_BLANKET, alt: "A cosy knit blanket",                correct: false },
  { id: "curtain", img: IMG_CURTAIN, alt: "White curtains on a window",         correct: false },
  { id: "rug",     img: IMG_RUG,     alt: "A decorative coloured floor rug",    correct: false },
];

const TIMER_SECONDS = 45;

export const ExerciseQuickQuiz = memo(function ExerciseQuickQuiz({ step, dispatch }: Props) {
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerOn, setTimerOn] = useState(true);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const correctItem = IMAGES.find((i) => i.correct)!;
  const isCorrect = sel === correctItem.id;

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Countdown
  useEffect(() => {
    if (!timerOn || checked || expired) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setExpired(true);
          setChecked(true);
          setTimeout(() => dispatch({ type: "LESSON_NEXT" }), 2200);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerOn, checked, expired]);

  // WCAG 2.2.3 No Timing — user can toggle timer off
  const toggleTimer = useCallback(() => {
    setTimerOn((prev) => {
      if (!prev) {
        // Re-enable: reset countdown
        setTimeLeft(TIMER_SECONDS);
        setExpired(false);
      } else {
        clearTimer();
      }
      return !prev;
    });
  }, []);

  const handleCheck = () => {
    if (!sel || checked) return;
    clearTimer();
    setChecked(true);
    setTimeout(() => dispatch({ type: "LESSON_NEXT" }), 1600);
  };

  const mm = "0";
  const ss = String(timeLeft % 60).padStart(2, "0");
  const urgent = timerOn && timeLeft <= 10 && !checked;

  return (
    <div className="bg-background flex flex-col min-h-full relative">
      <LessonHeader
        title="Quick Quiz"
        step={step}
        onBack={() => dispatch({ type: "LESSON_NEXT" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />

      {/* Assertive alert when time expires */}
      {expired && (
        <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
          Time is up. Moving to the next exercise.
        </div>
      )}

      <main
        id="quiz-main"
        tabIndex={-1}
        className="flex-1 flex flex-col items-center w-full px-5 gap-4 pt-4"
        aria-label="Quick quiz exercise"
      >
        <div className="flex items-center justify-between w-full gap-3">
          <h2 className="font-sans font-bold text-foreground text-xl flex-1">
            {"Which one is the 'pillow'?"}
          </h2>

          <div className="flex items-center gap-2 shrink-0">
            {/* Toggle timer — WCAG 2.2.3 No Timing */}
            <button
              type="button"
              onClick={toggleTimer}
              aria-label={timerOn ? "Disable timer" : "Enable timer"}
              aria-pressed={timerOn}
              title={timerOn ? "Disable timer" : "Enable timer"}
              className="size-9 rounded-lg border border-border bg-wp-card text-muted-foreground
                flex items-center justify-center min-h-[44px] min-w-[44px]
                focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary
                hover:text-foreground motion-safe:transition-colors"
            >
              {timerOn
                ? <Timer className="size-4" aria-hidden />
                : <TimerOff className="size-4" aria-hidden />
              }
            </button>

            {/* Timer display — decorative, screen readers use the sr-only timer below */}
            {timerOn && (
              <div
                aria-hidden="true"
                className={[
                  "rounded-full px-3 py-1 border font-sans font-semibold text-[13px] motion-safe:transition-colors",
                  urgent
                    ? "bg-primary/10 border-primary text-primary motion-safe:animate-pulse"
                    : "bg-secondary border-primary/40 text-primary",
                ].join(" ")}
              >
                {mm}:{ss}
              </div>
            )}
          </div>
        </div>

        {/* Accessible timer — announced every 10 seconds and when urgent */}
        <div
          role="timer"
          aria-live={urgent ? "assertive" : "off"}
          aria-atomic="true"
          className="sr-only"
        >
          {timerOn && !checked ? `${timeLeft} seconds remaining` : ""}
        </div>

        {/* Time-expired banner */}
        {expired && (
          <div
            role="status"
            className="w-full bg-secondary border border-primary rounded-xl px-4 py-3 text-center"
          >
            <p className="font-sans font-semibold text-primary text-sm">
              Time&apos;s up! Moving on…
            </p>
          </div>
        )}

        {/* 2×2 image option grid */}
        <div
          role="radiogroup"
          aria-label="Choose the image that shows a pillow"
          aria-required="true"
          className="grid grid-cols-2 gap-2.5 w-full"
        >
          {IMAGES.map((item) => {
            const isSelected = sel === item.id;
            const showResult = checked && isSelected;
            const borderClasses = showResult
              ? isCorrect
                ? "border-[3px] border-accent"
                : "border-[3px] border-primary"
              : isSelected
              ? "border-[3px] border-primary"
              : "border-border";

            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-disabled={checked}
                disabled={checked}
                onClick={() => !checked && setSel(item.id)}
                className={[
                  "bg-wp-card rounded-xl border overflow-hidden",
                  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary",
                  "motion-safe:transition-all disabled:cursor-not-allowed",
                  borderClasses,
                ].join(" ")}
              >
                <div className="h-[120px] relative w-full">
                  <img
                    alt={item.alt}
                    className="absolute inset-0 object-cover size-full"
                    src={item.img}
                  />
                </div>
                {showResult && (
                  <div
                    aria-hidden
                    className={`py-1.5 text-xs font-sans font-semibold text-center ${
                      isCorrect ? "text-accent bg-wp-green-light" : "text-primary bg-secondary"
                    }`}
                  >
                    {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      <footer className="w-full px-5 pb-10 pt-3">
        <button
          type="button"
          onClick={handleCheck}
          disabled={!sel || checked}
          aria-label={
            checked
              ? isCorrect
                ? "Correct! Proceeding to next exercise"
                : expired
                ? "Time is up, proceeding to next exercise"
                : "Incorrect answer, proceeding to next exercise"
              : sel
              ? "Check your answer"
              : "Select an image to check your answer"
          }
          className={[
            "rounded-xl py-4 w-full font-sans font-bold text-white text-[17px] min-h-[56px]",
            "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "motion-safe:transition-colors duration-300",
            checked
              ? isCorrect
                ? "bg-accent focus-visible:outline-accent"
                : "bg-primary focus-visible:outline-primary"
              : "bg-wp-blue focus-visible:outline-wp-blue",
          ].join(" ")}
        >
          {checked
            ? isCorrect
              ? "Correct! ✓"
              : expired
              ? "Time's Up"
              : "Incorrect"
            : "Check"}
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
});
