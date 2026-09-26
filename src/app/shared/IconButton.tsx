import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { ButtonVariant } from "./Button";

export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required programmatic label for screen readers (WCAG 2.2 AAA 4.1.2). */
  "aria-label": string;
  icon?: ReactNode;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-95 shadow-wp-xs border border-transparent active:opacity-90",
  secondary:
    "bg-secondary text-primary hover:bg-secondary/80 border border-primary/25 shadow-wp-xs active:opacity-90",
  outline:
    "bg-wp-card border border-border text-foreground hover:border-primary/50 hover:bg-muted/40 shadow-wp-xs active:bg-muted/60",
  ghost:
    "bg-transparent text-foreground hover:bg-muted/60 border border-transparent active:bg-muted/80",
  destructive:
    "bg-destructive text-destructive-foreground hover:opacity-95 shadow-wp-xs border border-transparent active:opacity-90",
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "min-h-[44px] min-w-[44px] size-11 p-2.5 rounded-xl",
  md: "min-h-[48px] min-w-[48px] size-12 p-3 rounded-xl",
  lg: "min-h-[56px] min-w-[56px] size-14 p-3.5 rounded-2xl",
};

/**
 * Standardized icon-only button component.
 * Strictly enforces an `aria-label` for screen reader accessibility.
 * Guaranteed WCAG 2.2 AAA minimum touch target (>=44x44px).
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    "aria-label": ariaLabel,
    icon,
    children,
    variant = "ghost",
    size = "sm",
    loading = false,
    disabled = false,
    type = "button",
    className = "",
    ...rest
  },
  ref
) {
  const content = icon ?? children;
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={isDisabled}
      aria-busy={loading ? "true" : undefined}
      className={`min-h-[44px] inline-flex items-center justify-center select-none cursor-pointer shrink-0
        focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary
        transition-all duration-150 ease-out
        motion-safe:enabled:hover:scale-105 motion-safe:enabled:active:scale-95 motion-reduce:transition-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}`}
      {...rest}
    >
      {loading ? (
        <svg
          className="animate-spin size-5 shrink-0 text-current motion-reduce:animate-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        content
      )}
    </button>
  );
});
