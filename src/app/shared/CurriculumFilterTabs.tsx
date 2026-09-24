import { useRef } from "react";

export interface CurriculumFilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface Props<T extends string> {
  label: string;
  options: readonly CurriculumFilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  panelId: string;
}

export function CurriculumFilterTabs<T extends string>({
  label,
  options,
  value,
  onChange,
  panelId,
}: Props<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (currentIndex: number, direction: -1 | 1) => {
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) return;
    onChange(next.value);
    refs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={label}>
      {options.map((option, index) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${panelId}-tab-${option.value}`}
            aria-controls={panelId}
            aria-selected={selected}
            aria-label={
              option.count === undefined ? option.label : `${option.label}: ${option.count}`
            }
            tabIndex={selected ? 0 : -1}
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
                if (first) {
                  onChange(first.value);
                  refs.current[0]?.focus();
                }
              } else if (event.key === "End") {
                event.preventDefault();
                const lastIndex = options.length - 1;
                const last = options[lastIndex];
                if (last) {
                  onChange(last.value);
                  refs.current[lastIndex]?.focus();
                }
              }
            }}
            className={`min-h-11 rounded-xl border px-3 text-sm font-black transition-colors active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"}`}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="ms-1.5 opacity-80" aria-hidden>
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
