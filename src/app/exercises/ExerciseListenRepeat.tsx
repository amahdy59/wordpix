import { memo, useEffect, useRef } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { AudioButton } from "../shared/AudioButton";
import { useAudio } from "../shared/useAudio";
import { Volume2, Mic } from "lucide-react";

interface Props {
  step: number;
  word: VocabItem;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseListenRepeat = memo(function ExerciseListenRepeat({ step, word, dispatch }: Props) {
  const { speak, stop, isPlaying, isSupported, isError } = useAudio({ lang: "en-US", rate: 0.75 });
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current && isSupported) {
      mountedRef.current = true;
      const timer = setTimeout(() => speak(word.label), 700);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isSupported, speak, word.label]);

  useEffect(() => () => stop(), [stop]);

  const handleToggle = () => {
    if (isPlaying) stop();
    else speak(word.label);
  };

  const handleListenAgain = () => {
    stop();
    setTimeout(() => speak(word.label), 80);
  };

  return (
    <div className="bg-background flex flex-col min-h-full relative">
      <LessonHeader
        title="Listen & Practice"
        step={step}
        onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${word.label}` : ""}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center w-full px-5 gap-5" aria-label="Listen and practice exercise">
        <section aria-label={`Word: ${word.label}`} className="bg-wp-card rounded-3xl border border-border p-5 flex flex-col items-center gap-4 w-full shadow-wp-xs max-w-md">
          <div className="h-44 relative rounded-xl w-full overflow-hidden bg-muted">
            <img alt={word.label} className="absolute inset-0 object-cover size-full" src={word.img} width="600" height="400" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h2 className="font-sans font-black text-foreground text-[32px] leading-none">{word.label}</h2>
            <p className="font-sans text-muted-foreground text-sm tracking-wide mt-1">Syllables: {word.phonetic}</p>
          </div>
        </section>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-base">
            {isPlaying ? <><Volume2 className="size-5 motion-safe:animate-pulse text-wp-blue" /><span>Listening…</span></> : <><Mic className="size-5 text-wp-green" /><span>Listen, then practise it out loud</span></>}
          </div>
          <AudioButton onPlay={handleToggle} isPlaying={isPlaying} isError={isError} label={`Listen to pronunciation of ${word.label}`} size="lg" />
          {!isSupported && <p className="font-sans text-muted-foreground text-sm text-center">Audio is not supported in this browser.</p>}
        </div>
      </main>

      <footer className="w-full max-w-md mx-auto px-5 pb-10 pt-3 flex flex-col gap-2.5">
        <PrimaryButton label="Continue" onClick={() => { stop(); dispatch({ type: "LESSON_NEXT" }); }} />
        <SecondaryButton label="Listen Again" onClick={handleListenAgain} />
      </footer>
      <HomeIndicator />
    </div>
  );
});
