import { useRef, type ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { answerLayout } from "./answerLayout";

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
  className,
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
    <div
      className={className ?? answerLayout(options.map((option) => option.accessibleLabel))}
      role="radiogroup"
      aria-label={label}
    >
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
            className={`group relative flex min-h-[48px] min-w-0 items-center gap-2 rounded-xl border-2 p-3 text-start text-base font-semibold transition-all duration-150 motion-safe:active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed ${revealFeedback ? "disabled:opacity-100" : ""} ${
              correct
                ? "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground shadow-wp-xs"
                : incorrect
                  ? "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground shadow-wp-xs"
                  : selected
                    ? "border-primary bg-secondary text-foreground shadow-wp-sm"
                    : muted
                      ? "border-border/40 bg-card/40 text-muted-foreground"
                      : "border-border/80 bg-card text-foreground hover:border-primary/50 hover:bg-secondary motion-safe:hover:translate-y-[-1px] shadow-wp-xs"
            }`}
          >
            {option.prefix && (
              <span
                className={`hidden sm:flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                  correct
                    ? "bg-feedback-success/20 text-feedback-success-foreground"
                    : incorrect
                      ? "bg-feedback-error/20 text-feedback-error-foreground"
                      : selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/80 text-muted-foreground group-hover:bg-secondary group-hover:text-primary"
                }`}
              >
                {option.prefix}
              </span>
            )}
            <span className="min-w-0 flex-1 break-words leading-normal">
              <span className="block">{option.label}</span>
              {option.secondary && (
                <span className="mt-1 block text-sm font-normal text-muted-foreground">
                  {option.secondary}
                </span>
              )}
            </span>
            {correct && (
              <CheckCircle2
                className="size-5 shrink-0 text-feedback-success-foreground"
                aria-hidden
              />
            )}
            {incorrect && (
              <XCircle className="size-5 shrink-0 text-feedback-error-foreground" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}
