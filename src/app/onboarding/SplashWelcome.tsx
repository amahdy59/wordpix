import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { Sparkles, ArrowRight, BookOpen, Layers } from "lucide-react";

const imgHero = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export function SplashWelcome({ dispatch }: Props) {
  const advance = () => dispatch({ type: "ONBOARD_NEXT" });

  return (
    <div className="bg-background content-stretch flex flex-col items-center justify-between min-h-svh relative overflow-hidden">
      <StatusBar />

      {/* Header step indicator */}
      <header className="w-full max-w-md px-6 pt-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-wp-xs">
            <BookOpen className="size-4 text-primary-foreground" />
          </div>
          <span className="font-sans font-bold text-foreground text-base tracking-tight">WordPix</span>
        </div>
        <span className="text-xs font-sans font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
          Step 1 of 3
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 py-6 text-center gap-6 z-10">
        <div className="flex items-center gap-2 bg-secondary px-3.5 py-1.5 rounded-full border border-primary/20 shadow-wp-xs">
          <Sparkles className="size-3.5 text-primary animate-pulse" />
          <span className="font-sans font-semibold text-xs text-foreground">Visual English Learning Engine</span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-sans font-black text-foreground text-3xl md:text-4xl leading-tight tracking-tight">
            Learn English Through Pictures
          </h1>
          <p className="font-sans font-medium text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
            Master real-world vocabulary with interactive visual scenes and spaced-repetition memory drills.
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="w-full h-52 md:h-60 relative rounded-2xl overflow-hidden border border-border shadow-wp-md bg-muted">
          <img
            alt="Preview of WordPix picture learning visual scenes"
            className="absolute inset-0 object-cover size-full"
            src={imgHero}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
            <Layers className="size-4" />
            <span className="font-sans font-bold text-xs">56+ Bedroom Words Ready</span>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="w-full max-w-md px-6 pb-8 flex flex-col gap-3 z-10">
        <button
          type="button"
          onClick={advance}
          className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 font-sans font-bold text-white text-base min-h-[52px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            shadow-wp-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Get Started</span>
          <ArrowRight className="size-5" />
        </button>

        <button
          type="button"
          onClick={advance}
          className="w-full bg-transparent hover:bg-muted rounded-xl py-3 font-sans font-semibold text-muted-foreground text-sm min-h-[44px]
            focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary transition-colors"
        >
          Already have an account? Sign In
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
}
