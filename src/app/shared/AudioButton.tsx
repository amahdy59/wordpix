import { memo } from "react";
import { Volume2, Loader2, VolumeX } from "lucide-react";

interface Props {
  onPlay: () => void;
  isPlaying?: boolean;
  isError?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "size-10 rounded-lg",
  md: "size-14 rounded-xl",
  lg: "size-20 rounded-2xl",
};

const ICON_CLASSES = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

export const AudioButton = memo(function AudioButton({
  onPlay,
  isPlaying = false,
  isError = false,
  label = "Play pronunciation",
  size = "md",
  className = "",
}: Props) {
  const stateClasses = isError
    ? "bg-muted border-border text-muted-foreground opacity-60 cursor-not-allowed"
    : isPlaying
    ? "bg-primary border-primary text-primary-foreground shadow-wp-sm"
    : "bg-secondary border-border text-primary hover:bg-primary hover:text-primary-foreground active:scale-95";

  return (
    <button
      type="button"
      onClick={isError ? undefined : onPlay}
      aria-label={isPlaying ? `Stop pronunciation of ${label}` : label}
      aria-pressed={isPlaying}
      aria-busy={isPlaying}
      disabled={isError}
      className={[
        "flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px]",
        "border font-sans",
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary",
        "motion-safe:transition-all duration-200",
        SIZE_CLASSES[size],
        stateClasses,
        className,
      ].join(" ")}
    >
      {isError ? (
        <VolumeX className={ICON_CLASSES[size]} aria-hidden />
      ) : isPlaying ? (
        <Loader2 className={`${ICON_CLASSES[size]} animate-spin`} aria-hidden />
      ) : (
        <Volume2 className={ICON_CLASSES[size]} aria-hidden />
      )}
      <span className="sr-only">
        {isError ? "Audio unavailable" : isPlaying ? "Playing audio…" : label}
      </span>
    </button>
  );
});
