import { memo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";
import { WordImage } from "../../shared/WordImage";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { SecondaryButton } from "../../shared/SecondaryButton";
import { BookOpen, Sparkles, Trophy, CheckCircle2, AlertTriangle, Lightbulb, HelpCircle } from "lucide-react";
import { useSound } from "../../shared/useSound";

interface Props {
  dispatch: React.Dispatch<Action>;
}

// 1. Visual Context (Image-Based Vocabulary)
export const ExReadingVisualContext = memo(function ExReadingVisualContext({ dispatch }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const { playCorrect } = useSound();

  const target = BEDROOM_VOCABULARY[1]; // Blanket
  const choices = ["Blanket", "Dresser", "Wardrobe", "Nightstand"];

  const handleCheck = () => {
    setChecked(true);
    playCorrect();
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Visual Context & Clues" step={1} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="h-64 w-full rounded-3xl overflow-hidden border border-border shadow-wp-xs">
          <WordImage word={target} width="600" height="400" className="size-full object-cover" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {choices.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelected(c)}
              className={`p-4 rounded-2xl border font-sans font-bold text-base transition-all ${
                checked
                  ? c === target.label
                    ? "bg-wp-green-light border-wp-green text-wp-green"
                    : selected === c
                    ? "bg-wp-rose-light border-wp-rose text-wp-rose"
                    : "bg-wp-card border-border opacity-50"
                  : selected === c
                  ? "bg-secondary border-primary border-[2px] text-primary"
                  : "bg-wp-card border-border text-foreground hover:border-primary/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {checked && (
          <div className="bg-wp-card border border-border rounded-2xl p-4 flex flex-col gap-2">
            <span className="font-sans font-bold text-xs text-primary uppercase">Why This Matters</span>
            <p className="font-sans text-xs text-foreground/80 leading-relaxed">
              <strong>Blanket</strong> — a thick cloth cover used on a bed for warmth. Context clue: layered over the mattress and duvet.
            </p>
          </div>
        )}

        <PrimaryButton label={checked ? "Next →" : "Check Answer"} onClick={checked ? () => dispatch({ type: "GO", to: "explore" }) : handleCheck} />
      </main>
    </div>
  );
});

// 2. Progressive Reveal (Sentence-by-Sentence Reading)
export const ExReadingProgressiveReveal = memo(function ExReadingProgressiveReveal({ dispatch }: Props) {
  const [stepIndex, setStepIndex] = useState(0);

  const sentences = [
    "Elena stood in the sunlit bedroom, her hands smoothing the fresh blanket.",
    "Next to the bed sat a small nightstand with a glowing brass lamp.",
    "She opened the tall wardrobe to hang her favorite winter coat.",
  ];

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Progressive Reveal Reading" step={2} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col gap-3 shadow-wp-xs">
          <span className="font-sans font-bold text-xs text-primary bg-secondary px-3 py-1 rounded-full w-fit">
            Sentence {stepIndex + 1} of {sentences.length}
          </span>
          <p className="font-sans font-bold text-foreground text-xl leading-relaxed">
            {sentences[stepIndex]}
          </p>
          <span className="font-sans text-xs text-muted-foreground">Tap any word to view instant translation (Costs 2 XP)</span>
        </div>

        <PrimaryButton
          label={stepIndex + 1 < sentences.length ? "Reveal Next Sentence →" : "Finish Reading"}
          onClick={() => {
            if (stepIndex + 1 < sentences.length) setStepIndex((i) => i + 1);
            else dispatch({ type: "GO", to: "explore" });
          }}
        />
      </main>
    </div>
  );
});

// 3. Error Detection (Grammar Proofreading)
export const ExReadingErrorDetection = memo(function ExReadingErrorDetection({ dispatch }: Props) {
  const [found, setFound] = useState<string[]>([]);
  const { playCorrect } = useSound();

  const handleTapWord = (w: string, isError: boolean) => {
    if (isError && !found.includes(w)) {
      setFound([...found, w]);
      playCorrect();
    }
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Error Detection Proofreading" step={3} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col gap-3">
          <h2 className="font-sans font-bold text-foreground text-lg">Tap on the grammatical error in the paragraph:</h2>
          <p className="font-sans text-base text-foreground leading-loose">
            The bedroom <span onClick={() => handleTapWord("have", true)} className={`cursor-pointer px-1 py-0.5 rounded font-bold underline ${found.includes("have") ? "bg-wp-rose text-white" : "hover:bg-muted"}`}>have</span> two large windows and a soft carpet.
          </p>
        </div>

        {found.length > 0 && (
          <div className="bg-wp-card border border-wp-rose/30 rounded-2xl p-4 flex flex-col gap-1">
            <span className="font-sans font-bold text-xs text-wp-rose uppercase">Grammar Rule Explanation</span>
            <p className="font-sans text-xs text-foreground/80">
              <strong>Subject-Verb Agreement:</strong> The singular noun &ldquo;bedroom&rdquo; requires the singular verb <strong>has</strong>, not &ldquo;have&rdquo;.
            </p>
          </div>
        )}

        <PrimaryButton label="Continue" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 4. Comic Strip
export const ExReadingComicStrip = memo(function ExReadingComicStrip({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Comic Strip Narrative Sequencing" step={4} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 h-40">
            <span className="text-3xl">🖼️ Panel 1</span>
            <p className="font-sans text-xs text-white/80">&ldquo;I need to organize my bedroom today.&rdquo;</p>
          </div>
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 h-40">
            <span className="text-3xl">🖼️ Panel 2</span>
            <p className="font-sans text-xs text-white/80">&ldquo;First, I will fold blankets into the dresser.&rdquo;</p>
          </div>
        </div>

        <PrimaryButton label="Answer Comic Question →" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 5. Infographic Reading
export const ExReadingInfographic = memo(function ExReadingInfographic({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Infographic Data Reading" step={5} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border-2 border-primary/30 rounded-3xl p-6 flex flex-col gap-3 shadow-wp-xs">
          <span className="font-sans font-bold text-xs text-primary bg-secondary px-3 py-1 rounded-full w-fit">
            Infographic Stats
          </span>
          <h2 className="font-sans font-black text-foreground text-2xl">8 Hours of Recommended Sleep</h2>
          <p className="font-sans text-xs text-muted-foreground">
            Key word: <strong>recommended</strong> — suggested as the best choice for optimal health.
          </p>
        </div>

        <PrimaryButton label="Submit Comprehension" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 6. Category Sort (Drag-and-Drop Classification)
export const ExReadingCategorySort = memo(function ExReadingCategorySort({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Category Sort Classification" step={6} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-wp-card border-2 border-dashed border-primary/40 rounded-2xl p-4 min-h-[160px] flex flex-col items-center justify-center text-center">
            <span className="font-sans font-bold text-sm text-primary">Furniture Bucket</span>
            <span className="font-sans text-xs text-muted-foreground mt-1">Drop Bed, Dresser</span>
          </div>
          <div className="bg-wp-card border-2 border-dashed border-wp-teal/40 rounded-2xl p-4 min-h-[160px] flex flex-col items-center justify-center text-center">
            <span className="font-sans font-bold text-sm text-wp-teal">Bedding Bucket</span>
            <span className="font-sans text-xs text-muted-foreground mt-1">Drop Pillow, Blanket</span>
          </div>
        </div>

        <PrimaryButton label="Submit Sort" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 7. Lesson Results (Reading)
export const ExReadingResults = memo(function ExReadingResults({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-2xl mb-4">
        <BookOpen className="size-12 text-primary" />
      </div>
      <h1 className="font-sans font-black text-foreground text-3xl">Reading Module Complete!</h1>
      <p className="font-sans text-muted-foreground text-sm mt-1 max-w-md">
        Reading drills are untimed practice and are not scored. Head back to a lesson to earn XP toward your streak.
      </p>
      <PrimaryButton label="Continue" onClick={() => dispatch({ type: "GO", to: "explore" })} />
    </div>
  );
});

// 8. Subtitle Correction
export const ExReadingSubtitleCorrection = memo(function ExReadingSubtitleCorrection({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Subtitle Correction" step={8} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col gap-3">
          <span className="font-sans font-bold text-xs text-wp-rose">Fix Highlighted Error</span>
          <p className="font-sans text-lg font-bold text-white">&ldquo;There are thousands of <span className="underline decoration-wp-rose decoration-2 text-wp-rose font-black">mile</span> to travel.&rdquo;</p>
        </div>
        <PrimaryButton label="Correct to 'miles'" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 9. Confidence Check
export const ExReadingConfidenceCheck = memo(function ExReadingConfidenceCheck({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Pre-Lesson Confidence Check" step={9} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-3xl p-8 flex flex-col items-center text-center gap-3">
          <h2 className="font-sans font-black text-foreground text-3xl">Ephemeral</h2>
          <p className="font-sans text-muted-foreground text-sm font-medium">/ɪˈfɛmərəl/</p>
          <p className="font-sans text-foreground text-sm mt-2">&ldquo;The beauty of the morning mist was ephemeral, vanishing quickly.&rdquo;</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <SecondaryButton label="Don't Know" onClick={() => dispatch({ type: "GO", to: "explore" })} />
          <SecondaryButton label="Somewhat" onClick={() => dispatch({ type: "GO", to: "explore" })} />
          <PrimaryButton label="Mastered (Skip)" onClick={() => dispatch({ type: "GO", to: "explore" })} />
        </div>
      </main>
    </div>
  );
});
