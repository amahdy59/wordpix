import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { Sparkles, CheckCircle2, ArrowRight, UserCircle } from "lucide-react";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export function ReadyCelebration({ dispatch }: Props) {
  return (
    <div className="bg-background content-stretch flex flex-col items-center justify-between min-h-svh relative overflow-hidden">
      <StatusBar />

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 py-6 text-center gap-6 z-10">
        {/* Clean Guest Profile Illustration */}
        <div aria-hidden className="relative rounded-full shrink-0 size-36 md:size-44 border-4 border-primary/20 bg-secondary flex items-center justify-center shadow-wp-md">
          <UserCircle className="size-20 md:size-24 text-primary" />
          <div className="absolute bottom-1 right-1 size-9 rounded-full bg-wp-green text-white flex items-center justify-center border-2 border-background">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-wp-green-light text-wp-green px-3.5 py-1.5 rounded-full border border-wp-green/20">
            <CheckCircle2 className="size-4" />
            <span className="font-sans font-bold text-xs">Guest Profile Ready</span>
          </div>

          <h1 className="font-sans font-black text-foreground text-3xl md:text-4xl leading-tight tracking-tight mt-1">
            Welcome, Guest!
          </h1>
          
          <p className="font-sans font-medium text-muted-foreground text-base max-w-xs mx-auto mt-1">
            Your visual English learning environment is initialized. Start exploring your first world now!
          </p>
        </div>

        {/* Decorative Highlights */}
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
          <span>Continue as Guest</span>
          <ArrowRight className="size-5" />
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
}
