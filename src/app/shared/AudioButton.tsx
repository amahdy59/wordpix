import { memo } from "react";
import { Volume2, Loader2, VolumeX } from "lucide-react";
import { useI18n } from "../../i18n";

interface Props {
  onPlay: () => void;
  isPlaying?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "size-11 rounded-lg",
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
  isLoading = false,
  isError = false,
  label,
  size = "md",
  className = "",
}: Props) {
  const { t } = useI18n();
  const actionLabel = label ?? t("audioRecovery.play");
  const isActive = isPlaying || isLoading;
  const audioState = isError ? "error" : isActive ? "active" : "idle";

  const computedLabel = isError
    ? t("audioRecovery.retryLabel", { label: actionLabel })
    : isLoading
      ? t("audioRecovery.loadingLabel", { label: actionLabel })
      : isPlaying
        ? t("audioRecovery.playingLabel", { label: actionLabel })
        : actionLabel;

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={computedLabel}
      aria-pressed={isPlaying}
      aria-busy={isLoading}
      disabled={isLoading}
      data-audio-state={audioState}
      className={[
        "wp-audio-button flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px]",
        "border font-sans",
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary",
        "motion-safe:transition-all duration-200",
        SIZE_CLASSES[size],
        "motion-safe:active:scale-95",
        className,
      ].join(" ")}
    >
      {isError ? (
        <VolumeX className={ICON_CLASSES[size]} aria-hidden="true" />
      ) : isLoading ? (
        <Loader2 className={`${ICON_CLASSES[size]} motion-safe:animate-spin`} aria-hidden="true" />
      ) : isPlaying ? (
        <Volume2 className={`${ICON_CLASSES[size]} motion-safe:animate-pulse`} aria-hidden="true" />
      ) : (
        <Volume2 className={ICON_CLASSES[size]} aria-hidden="true" />
      )}
    </button>
  );
});
