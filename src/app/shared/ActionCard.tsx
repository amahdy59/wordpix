import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export type ActionCardVariant = "default" | "primary" | "accent";

export interface ActionCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode;
  rightElement?: ReactNode;
  showArrow?: boolean;
  selected?: boolean;
  variant?: ActionCardVariant;
  children?: ReactNode;
}

const variantStyles: Record<ActionCardVariant, { base: string; selected: string }> = {
  default: {
    base: "bg-wp-card border-border hover:border-primary/40 hover:bg-muted/30 text-foreground",
    selected: "border-primary/60 bg-primary/5 text-foreground shadow-wp-xs",
  },
  primary: {
    base: "bg-wp-card border-primary/25 hover:border-primary/60 hover:bg-primary/5 text-foreground shadow-wp-xs",
    selected: "border-primary bg-primary/10 text-foreground shadow-wp-sm",
  },
  accent: {
    base: "bg-wp-panel border-wp-panel-border hover:border-primary/50 text-wp-text-on-panel",
    selected: "border-primary bg-wp-panel-raised text-wp-text-on-panel shadow-wp-sm",
  },
};

/**
 * Standardized interactive card component built on a native `<button>`.
 * Follows the native-first rule (avoids `role="button"` on static divs).
 * Guarantees WCAG 2.2 AAA minimum touch targets, visible focus, and keyboard accessibility.
 */
export const ActionCard = forwardRef<HTMLButtonElement, ActionCardProps>(function ActionCard(
  {
    title,
    description,
    icon,
    badge,
    meta,
    rightElement,
    showArrow = true,
    selected = false,
    variant = "default",
    disabled = false,
    type = "button",
    className = "",
    children,
    ...rest
  },
  ref
) {
  const currentVariant = variantStyles[variant];

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-pressed={selected ? "true" : undefined}
      className={`min-h-[56px] w-full text-start p-4 sm:p-5 rounded-2xl border transition-all duration-150 ease-out select-none cursor-pointer
        grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4
        focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary
        motion-safe:enabled:hover:scale-[1.01] motion-safe:enabled:active:scale-[0.985] motion-reduce:transition-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${selected ? currentVariant.selected : currentVariant.base}
        ${className}`}
      {...rest}
    >
      {/* Leading icon / indicator */}
      {icon ? <div className="shrink-0 leading-none">{icon}</div> : <div className="hidden" />}

      {/* Main content */}
      <div className="min-w-0 flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          {typeof title === "string" ? (
            <span className="font-sans font-bold text-sm sm:text-base leading-tight text-current">
              {title}
            </span>
          ) : (
            title
          )}
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed font-normal">
            {description}
          </p>
        )}

        {meta && <div className="mt-1 text-xs text-muted-foreground">{meta}</div>}
        {children}
      </div>

      {/* Trailing element / arrow */}
      <div className="shrink-0 flex items-center gap-2">
        {rightElement}
        {showArrow && !rightElement && (
          <ChevronRight
            className="size-5 text-muted-foreground rtl:rotate-180 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  );
});
