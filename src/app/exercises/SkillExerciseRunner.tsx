import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Volume2, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import type { Action } from "../types";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { LessonHeader } from "../shared/LessonHeader";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { WordImage } from "../shared/WordImage";
import { ExerciseTimer } from "../shared/ExerciseTimer";
import { useCountdown } from "../shared/useCountdown";
import { useAudio } from "../shared/useAudio";
import { useSound } from "../shared/useSound";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { shuffleArray } from "../../utils/shuffle";
import {
  isChoiceCorrect,
  isEntryCorrect,
  isMultiCorrect,
  isOrderCorrect,
  isSortCorrect,
  isGraded,
  type ExerciseDefinition,
  type ExerciseTask,
} from "./taskTypes";

interface Props {
  definition: ExerciseDefinition;
  dispatch: React.Dispatch<Action>;
}

type Verdict = "correct" | "incorrect" | "acknowledged";

const OPTION_KEY_HINT = "Press 1 to 9 to choose an option";

/**
 * Runs an ExerciseDefinition.
 *
 * One implementation of scoring, feedback, keyboard operation, focus, and live
 * announcements for every hub screen — previously each screen either
 * reimplemented a slice of this or, far more often, skipped it entirely and
 * just navigated away.
 */
export const SkillExerciseRunner = memo(function SkillExerciseRunner({ definition, dispatch }: Props) {
  const { accessibility } = useAccessibility();
  const { speak } = useAudio();
  const { playCorrect, playIncorrect, playClick } = useSound();

  const [index, setIndex] = useState(0);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  // Per-task answer state.
  const [choice, setChoice] = useState<string | null>(null);
  const [entry, setEntry] = useState("");
  const [multi, setMulti] = useState<string[]>([]);
  const [arrangement, setArrangement] = useState<string[]>([]);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [announcement, setAnnouncement] = useState("");

  const task: ExerciseTask | undefined = definition.tasks[index];
  const timed = accessibility.timedExercises && definition.timeLimitSeconds !== undefined;

  const finish = useCallback(() => setFinished(true), []);
  const countdown = useCountdown({
    seconds: definition.timeLimitSeconds ?? 0,
    enabled: timed,
    autoStart: timed,
    onExpire: finish,
  });

  const tokenPool = useMemo(
    () => (task?.kind === "order" ? shuffleArray(task.solution) : []),
    [task]
  );

  const imageWord = task?.imageWordId
    ? BEDROOM_VOCABULARY.find((w) => w.id === task.imageWordId)
    : undefined;

  // Speak the prompt audio when a listening task opens.
  useEffect(() => {
    if (task?.audioText) speak(task.audioText);
  }, [task, speak]);

  const resetAnswer = useCallback(() => {
    setChoice(null);
    setEntry("");
    setMulti([]);
    setArrangement([]);
    setPlacements({});
    setVerdict(null);
  }, []);

  const check = useCallback(() => {
    if (!task || verdict) return;

    if (!isGraded(task)) {
      setVerdict("acknowledged");
      setAnnouncement("Noted. Nothing here is marked.");
      return;
    }

    let correct = false;
    if (task.kind === "choice") correct = choice !== null && isChoiceCorrect(task, choice);
    else if (task.kind === "entry") correct = isEntryCorrect(task, entry);
    else if (task.kind === "multi") correct = isMultiCorrect(task, multi);
    else if (task.kind === "order") correct = isOrderCorrect(task, arrangement);
    else if (task.kind === "sort") correct = isSortCorrect(task, placements);

    setVerdict(correct ? "correct" : "incorrect");
    setResults((r) => [...r, correct]);
    setAnnouncement(correct ? "Correct." : "Not quite.");
    if (correct) playCorrect();
    else playIncorrect();
  }, [task, verdict, choice, entry, multi, arrangement, placements, playCorrect, playIncorrect]);

  const next = useCallback(() => {
    resetAnswer();
    if (index + 1 >= definition.tasks.length) finish();
    else setIndex((i) => i + 1);
  }, [index, definition.tasks.length, finish, resetAnswer]);

  // Number keys select options, matching the core lesson exercises.
  useEffect(() => {
    if (!task || task.kind !== "choice" || verdict) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && (["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable)) return;
      if (!/^[1-9]$/.test(e.key)) return;
      const option = task.options[Number(e.key) - 1];
      if (!option) return;
      e.preventDefault();
      playClick();
      setChoice(option.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [task, verdict, playClick]);

  const answered = results.length;
  const score = results.filter(Boolean).length;
  const gradedCount = definition.tasks.filter(isGraded).length;

  if (finished || !task) {
    return (
      <div className="min-h-svh bg-background flex flex-col">
        <LessonHeader
          title={definition.title}
          current={definition.step}
          total={definition.totalSteps}
          onBack={() => dispatch({ type: "GO", to: "skill-hub" })}
          onClose={() => dispatch({ type: "GO", to: "home" })}
        />
        <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5 justify-center">
          <div role="status" className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="size-12 text-wp-green" aria-hidden />
            <h2 className="font-sans font-black text-foreground text-2xl">Exercise complete</h2>
            {gradedCount > 0 ? (
              <p className="font-sans text-sm text-muted-foreground">
                {formatNumber(score, accessibility.numeralSystem)} of{" "}
                {formatNumber(answered, accessibility.numeralSystem)} correct.
              </p>
            ) : (
              <p className="font-sans text-sm text-muted-foreground">
                This drill is practice and is not scored.
              </p>
            )}
          </div>
          <PrimaryButton label="Back to Exercise Hub" onClick={() => dispatch({ type: "GO", to: "skill-hub" })} />
        </main>
      </div>
    );
  }

  const canCheck =
    (task.kind === "choice" && choice !== null) ||
    (task.kind === "entry" && entry.trim().length > 0) ||
    (task.kind === "multi" && multi.length > 0) ||
    (task.kind === "order" && arrangement.length === task.solution.length) ||
    (task.kind === "sort" && Object.keys(placements).length === task.items.length) ||
    task.kind === "practice";

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader
        title={definition.title}
        current={definition.step}
        total={definition.totalSteps}
        onBack={() => dispatch({ type: "GO", to: "skill-hub" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />

      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-sans font-bold text-sm text-foreground">
            Question {formatNumber(index + 1, accessibility.numeralSystem)} of{" "}
            {formatNumber(definition.tasks.length, accessibility.numeralSystem)}
          </span>
          {definition.timeLimitSeconds !== undefined && (
            <ExerciseTimer countdown={countdown} enabled={timed} />
          )}
        </div>

        {imageWord && (
          <div className="w-full rounded-3xl overflow-hidden border border-border shadow-wp-xs bg-muted">
            <WordImage
              word={imageWord}
              altMode={task.kind === "choice" && !task.optionsAreImages ? "assessment" : "learning"}
              className="w-full h-auto block object-contain"
            />
          </div>
        )}

        <div className="bg-wp-card border border-border rounded-2xl p-4 flex items-start justify-between gap-3">
          <h2 className="font-sans font-bold text-foreground text-lg text-balance">{task.prompt}</h2>
          {task.audioText && (
            <button
              type="button"
              onClick={() => speak(task.audioText as string)}
              aria-label="Replay the audio"
              className="shrink-0 flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl border border-border bg-wp-card text-xs font-sans font-bold hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Volume2 className="size-4" aria-hidden />
              <span>Replay</span>
            </button>
          )}
        </div>

        <TaskBody
          task={task}
          disabled={verdict !== null}
          choice={choice}
          setChoice={setChoice}
          entry={entry}
          setEntry={setEntry}
          multi={multi}
          setMulti={setMulti}
          arrangement={arrangement}
          setArrangement={setArrangement}
          tokenPool={tokenPool}
          placements={placements}
          setPlacements={setPlacements}
        />

        {verdict && (
          <div
            role="status"
            className={`rounded-2xl border p-4 flex items-start gap-3 ${
              verdict === "correct"
                ? "border-wp-green bg-wp-green-light/40"
                : verdict === "incorrect"
                  ? "border-wp-rose bg-wp-rose-light/40"
                  : "border-border bg-wp-card"
            }`}
          >
            {verdict === "correct" ? (
              <CheckCircle2 className="size-5 text-wp-green shrink-0 mt-0.5" aria-hidden />
            ) : verdict === "incorrect" ? (
              <XCircle className="size-5 text-wp-rose shrink-0 mt-0.5" aria-hidden />
            ) : null}
            <p className="font-sans text-sm text-foreground">{task.explanation}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {verdict ? (
            <PrimaryButton
              label={index + 1 >= definition.tasks.length ? "See results" : "Next question"}
              onClick={next}
            />
          ) : (
            <PrimaryButton label="Check answer" onClick={check} disabled={!canCheck} />
          )}
          {task.kind === "order" && arrangement.length > 0 && !verdict && (
            <SecondaryButton label="Clear my sentence" onClick={() => setArrangement([])} />
          )}
        </div>

        {task.kind === "choice" && (
          <p className="font-sans text-xs text-muted-foreground text-center">{OPTION_KEY_HINT}</p>
        )}
      </main>
    </div>
  );
});

interface BodyProps {
  task: ExerciseTask;
  disabled: boolean;
  choice: string | null;
  setChoice: (v: string) => void;
  entry: string;
  setEntry: (v: string) => void;
  multi: string[];
  setMulti: (v: string[]) => void;
  arrangement: string[];
  setArrangement: (v: string[]) => void;
  tokenPool: string[];
  placements: Record<string, string>;
  setPlacements: (v: Record<string, string>) => void;
}

const optionClasses = (selected: boolean) =>
  `w-full min-h-[52px] px-4 py-3 rounded-2xl border-2 font-sans font-semibold text-sm text-start transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
    selected
      ? "border-primary bg-secondary text-primary"
      : "border-border bg-wp-card text-foreground hover:border-primary/50"
  }`;

function TaskBody({
  task,
  disabled,
  choice,
  setChoice,
  entry,
  setEntry,
  multi,
  setMulti,
  arrangement,
  setArrangement,
  tokenPool,
  placements,
  setPlacements,
}: BodyProps) {
  if (task.kind === "choice") {
    return (
      <div role="group" aria-label={task.prompt} className="flex flex-col gap-2.5">
        {task.options.map((option, i) => (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            aria-pressed={choice === option.id}
            onClick={() => setChoice(option.id)}
            className={optionClasses(choice === option.id)}
          >
            <span className="font-bold me-2" aria-hidden>
              [{i + 1}]
            </span>
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  if (task.kind === "multi") {
    return (
      <fieldset className="flex flex-col gap-2.5">
        <legend className="sr-only">{task.prompt}. Choose all that apply.</legend>
        {task.options.map((option) => {
          const checked = multi.includes(option.id);
          return (
            <label
              key={option.id}
              className={`flex items-center gap-3 cursor-pointer ${optionClasses(checked)}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() =>
                  setMulti(checked ? multi.filter((id) => id !== option.id) : [...multi, option.id])
                }
                className="size-5 shrink-0 accent-[var(--wp-brand)]"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </fieldset>
    );
  }

  if (task.kind === "entry") {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor="task-entry" className="font-sans font-bold text-sm text-foreground">
          Your answer
        </label>
        <input
          id="task-entry"
          value={entry}
          disabled={disabled}
          onChange={(e) => setEntry(e.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          className="w-full min-h-[52px] bg-wp-card border-2 border-border rounded-2xl px-4 font-sans text-foreground text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
        />
      </div>
    );
  }

  if (task.kind === "order") {
    const remaining = tokenPool.filter(
      (t, i) => !arrangement.includes(`${t}#${i}`) && !arrangement.includes(t)
    );
    return (
      <div className="flex flex-col gap-3">
        <div
          className="bg-wp-card border-2 border-primary/30 rounded-2xl p-4 min-h-[72px] flex items-center gap-2 flex-wrap"
          aria-live="polite"
        >
          {arrangement.length === 0 ? (
            <span className="font-sans text-muted-foreground text-sm">
              Choose words below to build the sentence.
            </span>
          ) : (
            arrangement.map((token, i) => (
              <button
                key={`${token}-${i}`}
                type="button"
                disabled={disabled}
                onClick={() => setArrangement(arrangement.filter((_, j) => j !== i))}
                aria-label={`Remove ${token} from position ${i + 1}`}
                className="bg-primary text-primary-foreground px-3 min-h-[44px] min-w-[44px] rounded-xl font-sans font-bold text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {token}
              </button>
            ))
          )}
        </div>

        <div className="flex gap-2 flex-wrap" role="group" aria-label="Available words">
          {remaining.map((token, i) => (
            <button
              key={`${token}-pool-${i}`}
              type="button"
              disabled={disabled}
              onClick={() => setArrangement([...arrangement, token])}
              aria-label={`Add ${token}`}
              className="bg-wp-card border border-border px-3.5 min-h-[44px] min-w-[44px] rounded-xl font-sans font-semibold text-sm hover:border-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {token}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (task.kind === "sort") {
    return (
      <div className="flex flex-col gap-3">
        {task.items.map((item) => (
          <div key={item.id} className="bg-wp-card border border-border rounded-2xl p-3 flex flex-col gap-2">
            <span className="font-sans font-bold text-sm text-foreground">{item.label}</span>
            <div role="group" aria-label={`Category for ${item.label}`} className="flex gap-2 flex-wrap">
              {task.buckets.map((bucket) => (
                <button
                  key={bucket.id}
                  type="button"
                  disabled={disabled}
                  aria-pressed={placements[item.id] === bucket.id}
                  onClick={() => setPlacements({ ...placements, [item.id]: bucket.id })}
                  className={`px-3 min-h-[44px] rounded-xl border-2 font-sans font-bold text-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    placements[item.id] === bucket.id
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {bucket.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // practice
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-secondary border border-primary/20 rounded-2xl p-4 flex flex-col gap-2">
        <span className="font-sans font-bold text-xs uppercase tracking-wider text-primary">
          What to aim for
        </span>
        <ul className="flex flex-col gap-1 list-disc ps-5">
          {task.guidance.map((line) => (
            <li key={line} className="font-sans text-sm text-foreground">
              {line}
            </li>
          ))}
        </ul>
        <p className="font-sans text-xs text-muted-foreground mt-1">
          <RotateCcw className="inline size-3 me-1" aria-hidden />
          Nothing here is marked — WordPix cannot grade open answers.
        </p>
      </div>

      {task.freeText && (
        <>
          <label htmlFor="practice-entry" className="font-sans font-bold text-sm text-foreground">
            Your notes (kept on this screen only)
          </label>
          <textarea
            id="practice-entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            rows={5}
            className="w-full bg-wp-card border-2 border-border rounded-2xl p-4 font-sans text-foreground text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </>
      )}
    </div>
  );
}
