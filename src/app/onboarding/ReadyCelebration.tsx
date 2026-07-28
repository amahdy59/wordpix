import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const imgMascotCelebration = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export function ReadyCelebration({ dispatch }: Props) {
  return (
    <div className="bg-background content-stretch flex flex-col items-center justify-between min-h-svh relative overflow-hidden">
      <StatusBar />

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 py-6 text-center gap-6 z-10">
        <div aria-hidden className="relative rounded-full shrink-0 size-40 md:size-48 border-4 border-primary/20 shadow-wp-md overflow-hidden bg-muted">
          <img
            alt=""
            className="absolute inset-0 object-cover size-full"
            src={imgMascotCelebration}
          />
          <div className="absolute inset-0 bg-primary/10" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-wp-green-light text-wp-green px-3.5 py-1.5 rounded-full border border-wp-green/20">
            <CheckCircle2 className="size-4" />
            <span className="font-sans font-bold text-xs">Profile Initialized</span>
          </div>

          <h1 className="font-sans font-black text-foreground text-3xl md:text-4xl leading-tight tracking-tight mt-1">
            You&rsquo;re All Set!
          </h1>
          
          <p className="font-sans font-medium text-muted-foreground text-base max-w-xs mx-auto mt-1">
            Your personalized visual English learning path is ready. Explore your first world now!
          </p>
        </div>

        {/* Decorative Sparkle Highlights */}
        <div aria-hidden className="flex items-center justify-center gap-3 text-primary">
          <Sparkles className="size-5 animate-pulse" />
          <span className="font-sans font-bold text-xs text-foreground uppercase tracking-widest">Level 1 · The Bedroom</span>
          <Sparkles className="size-5 animate-pulse" />
        </div>
      </main>

      <footer className="w-full max-w-md px-6 pb-8 flex flex-col gap-3 z-10">
        <button
          type="button"
          onClick={() => dispatch({ type: "ONBOARD_NEXT" })}
          className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 font-sans font-bold text-white text-base min-h-[52px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            shadow-wp-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Start Learning Now</span>
          <ArrowRight className="size-5" />
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
}
