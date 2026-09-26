import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  label: string;
  selected: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  count?: number;
  icon?: ReactNode;
  size?: "sm" | "md";
}

/**
 * Standardized toggleable filter chip for category, level, and status filters.
 * Implements WAI-ARIA toggle button pattern (`aria-pressed`).
 * Guaranteed WCAG 2.2 AAA touch target (>=44px height).
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  {
    label,
    selected,
    onToggle,
    onClick,
    count,
    icon,
    size = "md",
    disabled = false,
    type = "button",
    className = "",
    ...rest
  },
  ref
) {
  const handleClick = () => {
    if (disabled) return;
    if (onToggle) onToggle();
    else if (onClick) onClick();
  };

  const sizeClasses =
    size === "sm"
      ? "min-h-[44px] px-3.5 py-1.5 text-xs rounded-xl gap-1.5"
      : "min-h-[44px] h-11 px-4 py-2 text-sm rounded-xl gap-2";

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-pressed={selected}
      onClick={handleClick}
      className={`min-h-[44px] font-sans inline-flex items-center justify-center select-none cursor-pointer border
        focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary
        transition-all duration-150 ease-out
        motion-safe:enabled:hover:scale-[1.02] motion-safe:enabled:active:scale-[0.97] motion-reduce:transition-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        ${sizeClasses}
        ${
          selected
            ? "bg-primary text-primary-foreground border-primary font-bold shadow-wp-xs"
            : "bg-wp-card border-border hover:border-primary/40 hover:bg-muted/40 text-foreground font-semibold"
        }
        ${className}`}
      {...rest}
    >
      {icon && (
        <span className="shrink-0 leading-none" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="leading-tight">{label}</span>
      {count !== undefined && (
        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none transition-colors ${
            selected
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </button>
  );
});
