import { useRef, type ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export interface ChoiceOption<T extends string> {
  value: T;
  label: ReactNode;
  accessibleLabel: string;
  prefix?: ReactNode;
  secondary?: ReactNode;
}

interface Props<T extends string> {
  label: string;
  options: readonly ChoiceOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  correctValue?: T;
  revealFeedback?: boolean;
  className?: string;
}

export function ChoiceOptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  correctValue,
  revealFeedback = false,
  className = "grid gap-3 sm:grid-cols-2",
}: Props<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (currentIndex: number, direction: -1 | 1) => {
    if (disabled) return;
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) return;
    onChange(next.value);
    refs.current[nextIndex]?.focus();
  };

  return (
    <div className={className} role="radiogroup" aria-label={label}>
      {options.map((option, index) => {
        const selected = value === option.value;
        const correct = revealFeedback && option.value === correctValue;
        const incorrect = revealFeedback && selected && option.value !== correctValue;
        const muted = revealFeedback && !correct && !incorrect;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.accessibleLabel}
            disabled={disabled}
            tabIndex={selected || (!value && index === 0) ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                move(index, -1);
              } else if (event.key === "Home") {
                event.preventDefault();
                const first = options[0];
                if (first && !disabled) {
                  onChange(first.value);
                  refs.current[0]?.focus();
                }
              } else if (event.key === "End") {
                event.preventDefault();
                const lastIndex = options.length - 1;
                const last = options[lastIndex];
                if (last && !disabled) {
                  onChange(last.value);
                  refs.current[lastIndex]?.focus();
                }
              }
            }}
            className={`flex min-h-12 items-center gap-3 rounded-2xl border-2 p-4 text-start text-sm font-bold transition-all active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-100 ${
              correct
                ? "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground"
                : incorrect
                  ? "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground"
                  : selected
                    ? "border-primary bg-primary/10 text-foreground shadow-wp-sm"
                    : muted
                      ? "border-border bg-muted/30 text-muted-foreground opacity-70"
                      : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            {option.prefix && (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted font-black text-xs text-foreground">
                {option.prefix}
              </span>
            )}
            <span className="min-w-0 flex-1 leading-snug">
              <span className="block">{option.label}</span>
              {option.secondary && <span className="mt-1 block">{option.secondary}</span>}
            </span>
            {correct && <CheckCircle2 className="size-5 shrink-0" aria-hidden />}
            {incorrect && <XCircle className="size-5 shrink-0" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}
