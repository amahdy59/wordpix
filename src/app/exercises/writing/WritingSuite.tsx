import { memo, useCallback, useMemo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";
import { WordImage } from "../../shared/WordImage";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";

import { PenTool } from "lucide-react";
import { useSound } from "../../shared/useSound";
import { useAccessibility } from "../../shared/useAccessibilityPreferences";
import { useCountdown } from "../../shared/useCountdown";
import { ExerciseTimer } from "../../shared/ExerciseTimer";
import { shuffleArray } from "../../../utils/shuffle";

interface Props {
  dispatch: React.Dispatch<Action>;
}

// 1. Caption Builder
export const ExWritingCaptionBuilder = memo(function ExWritingCaptionBuilder({ dispatch }: Props) {
  const [tokens, setTokens] = useState<string[]>([]);
  const { playClick, playCorrect } = useSound();

  const wordBank = ["The", "bed", "is", "soft", "and", "clean"];

  const addToken = (t: string) => {
    playClick();
    setTokens([...tokens, t]);
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Caption Builder (Word Bank)" current={1} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="h-56 w-full rounded-3xl overflow-hidden border border-border shadow-wp-xs">
          <WordImage word={BEDROOM_VOCABULARY[0]} width="600" height="400" className="size-full object-cover" />
        </div>

        <div className="bg-wp-card border-2 border-primary/30 rounded-2xl p-4 min-h-[72px] flex items-center gap-2 flex-wrap">
          {tokens.length === 0 ? (
            <span className="font-sans text-muted-foreground text-sm">Tap word chips to construct sentence...</span>
          ) : (
            tokens.map((t, idx) => (
              <span key={idx} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-xl font-sans font-bold text-sm">
                {t}
              </span>
            ))
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {wordBank.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => addToken(w)}
              className="bg-wp-card border border-border px-3.5 py-2 rounded-xl font-sans font-semibold text-sm hover:border-primary"
            >
              {w}
            </button>
          ))}
        </div>

        <PrimaryButton label="Submit Caption" onClick={() => { playCorrect(); dispatch({ type: "GO", to: "explore" }); }} />
      </main>
    </div>
  );
});

// 2. Sentence Assembly Arcade
export const ExWritingSentenceAssembly = memo(function ExWritingSentenceAssembly({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Sentence Assembly Arcade" current={2} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="flex justify-between items-center bg-wp-panel text-wp-text-on-panel rounded-2xl p-4">
          <span className="font-sans font-black text-wp-amber text-xl">Sentence Assembly</span>
          <span className="font-sans font-bold text-sm">Drag the tiles into order</span>
        </div>
        <PrimaryButton label="Assembly Complete" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 3. Photo Journal Free Writing
export const ExWritingPhotoJournal = memo(function ExWritingPhotoJournal({ dispatch }: Props) {
  const [text, setText] = useState("");

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Photo Journal Free Writing" current={3} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write 3 sentences describing your bedroom..."
          className="w-full h-40 bg-wp-card border border-border rounded-2xl p-4 font-sans text-foreground text-sm focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary"
        />
        {/* Was an "Assessment Rubric" showing fixed ●●●○○ ratings for Grammar,
            Vocabulary, and Coherence. Nothing evaluated the learner's text, so
            the dots were identical no matter what they wrote. */}
        <div className="bg-wp-card border border-border rounded-2xl p-4 flex flex-col gap-1">
          <span className="font-sans font-bold text-xs text-primary uppercase">What to aim for</span>
          <p className="font-sans text-xs text-muted-foreground">
            Three sentences, each naming one object and saying where it is. WordPix does not grade free writing.
          </p>
        </div>
        <PrimaryButton label="Submit Photo Journal Entry" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 4. Video Summary
export const ExWritingVideoSummary = memo(function ExWritingVideoSummary({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Video Summary Academic Writing" current={4} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-panel text-wp-text-on-panel rounded-3xl p-6 flex flex-col items-center justify-center h-48">
          <span className="font-sans font-black text-2xl">Academic Video Player</span>
        </div>
        <PrimaryButton label="Submit Summary" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 5. Error Correction
export const ExWritingErrorCorrection = memo(function ExWritingErrorCorrection({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Error Correction Paragraph" current={5} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-2xl p-5">
          <p className="font-sans text-base text-foreground leading-relaxed">
            The students <span className="underline text-wp-rose font-bold">was</span> studying furniture vocabulary.
          </p>
        </div>
        <PrimaryButton label="Correct to 'were'" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 6. Paraphrase Challenge
export const ExWritingParaphraseChallenge = memo(function ExWritingParaphraseChallenge({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Paraphrase Challenge" current={6} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-2xl p-5 flex flex-col gap-2">
          <span className="font-sans font-bold text-xs text-muted-foreground">Original Sentence</span>
          <p className="font-sans font-bold text-foreground">&ldquo;The athlete was very tired after the marathon.&rdquo;</p>
          <span className="font-sans text-xs text-primary font-bold">Must use target word: EXHAUSTED</span>
        </div>
        <PrimaryButton label="Submit Paraphrase" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 7. Image Story Chain
export const ExWritingImageStoryChain = memo(function ExWritingImageStoryChain({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Image Story Chain Narrative" current={7} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="flex gap-2">
          {["Meanwhile...", "Later that day...", "Unexpectedly..."].map((c) => (
            <span key={c} className="bg-secondary text-primary font-sans font-bold text-xs px-3 py-1.5 rounded-xl border border-primary/20">
              {c}
            </span>
          ))}
        </div>
        <PrimaryButton label="Submit Narrative Scene" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 8. Writing Results
export const ExWritingResults = memo(function ExWritingResults({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-2xl mb-4">
        <PenTool className="size-12 text-primary" />
      </div>
      <h1 className="font-sans font-black text-foreground text-3xl">Writing Complete!</h1>
      <p className="font-sans text-muted-foreground text-sm mt-1 max-w-md">
        Writing drills are self-checked practice and are not scored. Head back to a lesson to earn XP toward your streak.
      </p>
      <PrimaryButton label="Return to Explore" onClick={() => dispatch({ type: "GO", to: "explore" })} />
    </div>
  );
});

// 9. Timed Writing Sprint
//
// This screen used to render the literal text "0:30 SPRINT" with no timer, no
// input, and a button that navigated away. It is now a real spelling sprint:
// the learner types each word from its picture, answers are checked, and the
// countdown is pausable, extendable, and can be switched off entirely.
const SPRINT_SECONDS = 60;

export const ExWritingTimedSprint = memo(function ExWritingTimedSprint({ dispatch }: Props) {
  const { accessibility } = useAccessibility();
  const timed = accessibility.timedExercises;
  const { playCorrect, playIncorrect } = useSound();

  const words = useMemo(() => shuffleArray(BEDROOM_VOCABULARY).slice(0, 10), []);
  const [index, setIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [correct, setCorrect] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const finish = useCallback(() => setFinished(true), []);
  const countdown = useCountdown({ seconds: SPRINT_SECONDS, enabled: timed, autoStart: timed, onExpire: finish });

  const current = words[index];
  const isLast = index >= words.length - 1;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finished || !current) return;

    const isRight = entry.trim().toLowerCase() === current.label.toLowerCase();
    if (isRight) {
      setCorrect((c) => [...c, current.id]);
      playCorrect();
    } else {
      setMissed((m) => [...m, current.id]);
      playIncorrect();
    }

    setEntry("");
    if (isLast) finish();
    else setIndex((i) => i + 1);
  };

  if (finished) {
    return (
      <div className="min-h-svh bg-background flex flex-col">
        <LessonHeader title="Timed Speed Writing Sprint" current={9} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
        <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
          <div role="status" className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col items-center gap-2 text-center">
            <span className="font-sans font-black text-foreground text-3xl">
              {correct.length} of {correct.length + missed.length} spelled correctly
            </span>
            <p className="font-sans text-sm text-muted-foreground">
              {missed.length === 0
                ? "Every word correct."
                : `Worth another look: ${missed
                    .map((id) => BEDROOM_VOCABULARY.find((w) => w.id === id)?.label)
                    .filter(Boolean)
                    .join(", ")}`}
            </p>
          </div>
          <PrimaryButton label="Back to Exercises" onClick={() => dispatch({ type: "GO", to: "explore" })} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Timed Speed Writing Sprint" current={9} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-sans font-bold text-sm text-foreground">
            Word {index + 1} of {words.length}
          </span>
          <ExerciseTimer countdown={countdown} enabled={timed} label="Sprint time remaining" />
        </div>

        <div className="h-48 w-full rounded-3xl overflow-hidden border border-border shadow-wp-xs bg-muted">
          <WordImage word={current} width="600" height="400" altMode="assessment" optionIndex={index} className="size-full object-cover" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label htmlFor="sprint-entry" className="font-sans font-bold text-sm text-foreground">
            Type the word for this picture
          </label>
          <input
            id="sprint-entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-full min-h-[52px] bg-wp-card border-2 border-border rounded-2xl px-4 font-sans text-foreground text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
          <PrimaryButton label={isLast ? "Finish Sprint" : "Next Word"} type="submit" />
        </form>
      </main>
    </div>
  );
});
