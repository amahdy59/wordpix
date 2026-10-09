import { useId } from "react";

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
  const name = useId();
  return (
    <fieldset
      role="radiogroup"
      aria-label={label}
      className={`flex min-h-11 items-center gap-1 rounded-xl border border-border bg-card p-1 ${className}`}
      disabled={disabled}
    >
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={`relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-semibold motion-safe:transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${disabled ? "cursor-not-allowed opacity-60" : ""} ${
              selected
                ? "bg-primary text-primary-foreground shadow-wp-xs"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              disabled={disabled}
              aria-label={option.label}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
            {option.label}
          </label>
        );
      })}
    </fieldset>
  );
}
