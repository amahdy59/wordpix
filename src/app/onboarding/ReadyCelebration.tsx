import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { Sparkles, CheckCircle2, ArrowRight, UserCircle, BookOpen, Layers } from "lucide-react";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export function ReadyCelebration({ dispatch }: Props) {
  return (
    <div className="bg-background flex flex-col md:flex-row min-h-svh md:min-h-[560px] relative overflow-hidden">
      <StatusBar />

      {/* ── Desktop Left Hero Column ────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 text-white relative overflow-hidden flex-col justify-between p-8 xl:p-12">
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <span className="font-sans font-black text-white text-xl tracking-tight">WordPix</span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center gap-6 my-auto">
          <div aria-hidden className="relative rounded-full shrink-0 size-32 border-4 border-primary/30 bg-secondary/10 flex items-center justify-center shadow-2xl">
            <UserCircle className="size-20 text-primary" />
            <div className="absolute bottom-1 right-1 size-8 rounded-full bg-wp-green text-wp-text-on-green flex items-center justify-center border-2 border-slate-950">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div>
            <h2 className="font-sans font-black text-3xl text-white leading-tight">
              Environment Initialized
            </h2>
            <p className="font-sans text-white/70 text-sm mt-2 max-w-xs mx-auto">
              Your visual English learning engine is ready. Time to dive into your first lesson group!
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/60 text-xs font-sans font-semibold">
          <Layers className="size-4" />
          <span>Ready to Learn: The Bedroom World</span>
        </div>
      </div>

      {/* ── Right Column / Mobile Layout ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-8 xl:p-12 min-h-svh md:min-h-0">
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto md:mx-0 text-center md:text-left gap-6 z-10">
          <div aria-hidden className="md:hidden relative rounded-full shrink-0 size-36 border-4 border-primary/20 bg-secondary flex items-center justify-center shadow-wp-md">
            <UserCircle className="size-20 text-primary" />
            <div className="absolute bottom-1 right-1 size-9 rounded-full bg-wp-green text-wp-text-on-green flex items-center justify-center border-2 border-background">
              <CheckCircle2 className="size-5" />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="inline-flex items-center gap-2 bg-wp-green-light text-wp-green px-3.5 py-1.5 rounded-full border border-wp-green/20">
              <CheckCircle2 className="size-4" />
              <span className="font-sans font-bold text-xs">Environment Ready</span>
            </div>

            <h1 className="font-sans font-black text-foreground text-3xl md:text-4xl leading-tight tracking-tight mt-1">
              Welcome to WordPix!
            </h1>
            
            <p className="font-sans font-medium text-muted-foreground text-base max-w-xs md:max-w-none mt-1">
              Your visual English learning environment is initialized. Let&apos;s start your first interactive word group lesson!
            </p>
          </div>

          {/* Decorative Highlights */}
          <div aria-hidden className="flex items-center justify-center md:justify-start gap-3 text-primary">
            <Sparkles className="size-5 motion-safe:animate-pulse" />
            <span className="font-sans font-bold text-xs text-foreground uppercase tracking-widest">Level 1 · The Bedroom</span>
            <Sparkles className="size-5 motion-safe:animate-pulse" />
          </div>
        </main>

        <footer className="w-full max-w-md mx-auto md:mx-0 pt-4 shrink-0 z-10">
          <button
            type="button"
            onClick={() => dispatch({ type: "ONBOARD_NEXT" })}
            className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 font-sans font-bold text-wp-text-on-blue text-base min-h-[52px]
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
              shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Start Learning Group →</span>
            <ArrowRight className="size-5" />
          </button>
        </footer>

        <div className="md:hidden shrink-0">
          <HomeIndicator />
        </div>
      </div>
    </div>
  );
}
