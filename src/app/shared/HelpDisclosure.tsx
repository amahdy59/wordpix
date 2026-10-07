import { useEffect, useRef, useState, type ReactNode } from "react";
import { Info, ChevronDown } from "lucide-react";

interface Props {
  label: string;
  children: ReactNode;
  variant?: "inline" | "icon";
  className?: string;
}

/** Optional help opens deliberately on click/tap, never merely on hover or focus. */
export function HelpDisclosure({ label, children, variant = "inline", className = "" }: Props) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (
        variant === "icon" &&
        event.target instanceof Node &&
        !ref.current?.contains(event.target)
      ) {
        if (ref.current) ref.current.open = false;
      }
    };
    const dismissWithKeyboard = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        event.target instanceof Node &&
        ref.current?.contains(event.target)
      ) {
        event.preventDefault();
        event.stopPropagation();
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismissWithKeyboard, true);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", dismissWithKeyboard, true);
    };
  }, [open, variant]);
  return (
    <details
      ref={ref}
      className={`group/help ${variant === "icon" ? (className.includes("absolute") ? "" : "relative") : "w-full"} ${className}`}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        onBlur={(event) => {
          if (variant === "icon" && !ref.current?.contains(event.relatedTarget)) {
            if (ref.current) ref.current.open = false;
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && ref.current?.open) {
            event.stopPropagation();
            ref.current.open = false;
            ref.current.querySelector("summary")?.focus();
          }
        }}
        aria-label={variant === "icon" ? label : undefined}
        className={`flex min-h-11 min-w-11 cursor-pointer list-none items-center gap-2 rounded-xl text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden ${variant === "icon" ? "size-11 justify-center border border-border bg-card" : "w-fit px-2"}`}
      >
        {variant === "icon" ? (
          <Info className="size-5" aria-hidden />
        ) : (
          <>
            <span>{label}</span>
            <ChevronDown
              className="size-4 motion-safe:transition-transform group-open/help:rotate-180"
              aria-hidden
            />
          </>
        )}
      </summary>
      <div
        className={
          variant === "icon"
            ? "absolute end-0 top-full z-30 w-56 max-w-[calc(100vw-2rem)] break-words rounded-xl border border-border bg-card p-4 text-start text-sm leading-relaxed text-foreground shadow-wp-lg"
            : "mt-1 space-y-3 break-words rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground"
        }
      >
        {children}
      </div>
    </details>
  );
}
