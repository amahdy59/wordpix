import { Check } from "lucide-react";

interface Props {
  items: readonly string[];
  checked: ReadonlySet<number>;
  onToggle: (index: number) => void;
  columns?: 1 | 2;
}

export function TaskChecklist({ items, checked, onToggle, columns = 1 }: Props) {
  return (
    <ul className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item, index) => {
        const isChecked = checked.has(index);
        return (
          <li key={`${index}-${item}`}>
            <button
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              onClick={() => onToggle(index)}
              className={`flex min-h-12 w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-start text-sm font-bold transition-all active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isChecked
                  ? "border-primary bg-primary/10 text-primary shadow-wp-sm"
                  : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                  isChecked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
                aria-hidden
              >
                {isChecked ? <Check className="size-4 stroke-[3]" /> : index + 1}
              </span>
              <span>{item}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
