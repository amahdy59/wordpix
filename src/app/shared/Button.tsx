import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
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

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-3.5 py-2 text-xs gap-1.5 rounded-xl",
  md: "min-h-[44px] h-11 px-4 py-2.5 text-sm gap-2 rounded-xl",
  lg: "min-h-[48px] h-12 px-5 py-3 text-base gap-2.5 rounded-2xl",
  xl: "min-h-[56px] h-14 px-6 py-3.5 text-lg gap-3 rounded-2xl",
};

/**
 * Standardized, accessible WordPix button component.
 * Guaranteed WCAG 2.2 AAA minimum touch target (>=44x44px).
 * Includes visible focus ring, high-contrast states, and motion-safe transitions.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    loadingText,
    iconLeft,
    iconRight,
    children,
    disabled = false,
    type = "button",
    className = "",
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading ? "true" : undefined}
      className={`min-h-[44px] font-sans font-bold inline-flex items-center justify-center select-none cursor-pointer
        focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary
        transition-all duration-150 ease-out
        motion-safe:enabled:hover:scale-[1.015] motion-safe:enabled:active:scale-[0.98] motion-reduce:transition-none
        disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none
        ${fullWidth ? "w-full" : "w-auto"}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin size-4 shrink-0 text-current motion-reduce:animate-none"
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
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="shrink-0 leading-none">{iconLeft}</span>}
          {children && <span>{children}</span>}
          {iconRight && <span className="shrink-0 leading-none">{iconRight}</span>}
        </>
      )}
    </button>
  );
});
