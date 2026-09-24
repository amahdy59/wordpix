interface PlaybackSpeedOption {
  value: number;
  label: string;
}

interface Props {
  value: number;
  onChange: (value: number) => void;
  label: string;
  options: readonly PlaybackSpeedOption[];
  disabled?: boolean;
  className?: string;
}

/** Compact, accessible playback-rate selector shared by listening activities. */
export function PlaybackSpeedControl({
  value,
  onChange,
  label,
  options,
  disabled = false,
  className = "",
}: Props) {
  return (
    <fieldset
      className={`flex min-h-11 items-center gap-1 rounded-xl border border-border bg-card p-1 ${className}`}
      disabled={disabled}
    >
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            aria-label={option.label}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`min-h-11 rounded-lg px-3 text-xs font-black transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              selected
                ? "bg-primary text-primary-foreground shadow-wp-xs"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
}
