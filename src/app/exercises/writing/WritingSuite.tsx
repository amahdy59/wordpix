import { memo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";
import { WordImage } from "../../shared/WordImage";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";

import { PenTool } from "lucide-react";
import { useSound } from "../../shared/useSound";

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
          <span className="font-sans font-black text-wp-amber text-xl">x4 COMBO</span>
          <span className="font-sans font-bold text-sm">340 Points</span>
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
        <div className="bg-wp-card border border-border rounded-2xl p-4 flex flex-col gap-1">
          <span className="font-sans font-bold text-xs text-primary uppercase">Assessment Rubric</span>
          <p className="font-sans text-xs text-muted-foreground">Grammar: ●●●○○ | Vocabulary: ●●●●○ | Coherence: ●●●○○</p>
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
export const ExWritingTimedSprint = memo(function ExWritingTimedSprint({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Timed Speed Writing Sprint" current={9} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-panel text-wp-text-on-panel rounded-3xl p-6 flex flex-col items-center gap-3">
          <span className="font-sans font-black text-wp-amber text-3xl">0:30 SPRINT</span>
          <p className="font-sans text-xs text-white/70">Type the English word as fast as possible!</p>
        </div>
        <PrimaryButton label="Finish Speed Sprint" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});
