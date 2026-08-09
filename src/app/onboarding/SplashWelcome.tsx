import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { useProgress } from "../data/progress";
import { LESSON_WORLDS, DEFAULT_WORLD_ID } from "../data/lessons";
import { Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2, Globe } from "lucide-react";

const imgHero = "./scene-images/splash-hero.jpg";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export function SplashWelcome({ dispatch }: Props) {
  const { setPreferences } = useProgress();
  const flagshipWorld = LESSON_WORLDS[DEFAULT_WORLD_ID];
  const advance = () => dispatch({ type: "ONBOARD_NEXT" });

  // Bypasses the level/goal picker for a learner who just wants in. Sets the
  // same defaults LanguageSelect would submit unchanged (A1, 10 min/day,
  // everyday English), so skipping leaves preferences in the same state as
  // clicking through without changing anything — just faster.
  const skip = () => {
    setPreferences("A1", 10, "everyday");
    dispatch({ type: "GO", to: "home" });
  };

  return (
    <div className="bg-background flex flex-col md:flex-row min-h-svh md:min-h-[560px] relative overflow-hidden">
      <StatusBar />

      {/* ── Desktop Left Hero Column ────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 bg-wp-panel text-wp-text-on-panel relative overflow-hidden flex-col justify-between p-8 xl:p-12">
        <div className="absolute inset-0 opacity-40">
          <img
            alt="Preview of WordPix visual scenes"
            className="object-cover size-full"
            src={imgHero}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wp-panel via-wp-panel/70 to-transparent" />
        </div>

        {/* Brand Header Left */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <span className="font-sans font-black text-white text-xl tracking-tight">WordPix</span>
        </div>

        {/* Center Feature Highlights */}
        <div className="relative z-10 flex flex-col gap-4 my-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md self-start text-xs font-sans font-semibold">
            <Sparkles className="size-3.5 text-wp-amber" />
            <span>Visual English Learning Engine</span>
          </div>
          <h2 className="font-sans font-black text-3xl xl:text-4xl text-white leading-tight">
            Learn English Through Real-World Pictures
          </h2>
          <div className="flex flex-col gap-2.5 mt-2">
            {[
              "Interactive 2D scene discovery & audio pronunciation",
              "Visual language immersion matching drills",
              "Adaptive memory reviews",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-white/80 text-sm font-sans font-medium">
                <CheckCircle2 className="size-4 text-wp-green shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Left */}
        <div className="relative z-10 flex items-center gap-2 text-white/60 text-xs font-sans font-semibold">
          <Globe className="size-4" />
          <span>Flagship World 1: {flagshipWorld.name} ({flagshipWorld.vocabulary.length} Words Ready)</span>
        </div>
      </div>

      {/* ── Right Column / Mobile Layout ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-8 xl:p-12 min-h-svh md:min-h-0">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden w-full flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-wp-xs">
              <BookOpen className="size-4 text-primary-foreground" />
            </div>
            <span className="font-sans font-bold text-foreground text-base tracking-tight">WordPix</span>
          </div>
          <span className="text-xs font-sans font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
            Step 1 of 2
          </span>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center md:items-start justify-center w-full max-w-md mx-auto md:mx-0 py-6 text-center md:text-start gap-6 z-10">
          <div className="hidden md:flex items-center justify-between w-full">
            <span className="text-xs font-sans font-bold text-primary bg-secondary px-3 py-1 rounded-full border border-primary/20">
              Welcome to WordPix
            </span>
            <span className="text-xs font-sans font-semibold text-muted-foreground">Step 1 of 2</span>
          </div>

          <div className="md:hidden inline-flex items-center gap-2 bg-secondary px-3.5 py-1.5 rounded-full border border-primary/20 shadow-wp-xs">
            <Sparkles className="size-3.5 text-primary motion-safe:animate-pulse" />
            <span className="font-sans font-semibold text-xs text-foreground">Visual English Learning Engine</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-sans font-black text-foreground text-3xl md:text-4xl leading-tight tracking-tight">
              Master Vocabulary Faster
            </h1>
            <p className="font-sans font-medium text-muted-foreground text-base leading-relaxed">
              Connect words directly to pictures without translation. Practice listening, speaking, spelling, and sentence building.
            </p>
          </div>

          {/* Mobile Hero Illustration (Hidden on Desktop) */}
          <div className="md:hidden w-full h-48 relative rounded-2xl overflow-hidden border border-border shadow-wp-md bg-muted">
            <img
              alt={`${flagshipWorld.name} scene as shown in a WordPix lesson`}
              className="absolute inset-0 object-cover size-full"
              src={imgHero}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 start-4 flex items-center gap-2 text-white">
              <Layers className="size-4" />
              <span className="font-sans font-bold text-xs">{flagshipWorld.vocabulary.length} {flagshipWorld.name} Words Ready</span>
            </div>
          </div>
        </main>

        {/* Footer CTA */}
        <footer className="w-full max-w-md mx-auto md:mx-0 pt-4 shrink-0 z-10">
          <button
            type="button"
            onClick={advance}
            className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 font-sans font-bold text-wp-text-on-blue text-base min-h-[52px]
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
              shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="size-5" />
          </button>
          <button
            type="button"
            onClick={skip}
            className="w-full mt-2 py-2.5 font-sans font-semibold text-muted-foreground hover:text-foreground text-sm min-h-[44px] rounded-lg transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Skip setup — use default settings
          </button>
        </footer>

        <div className="md:hidden shrink-0">
          <HomeIndicator />
        </div>
      </div>
    </div>
  );
}
