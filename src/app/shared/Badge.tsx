import { memo } from "react";

interface Props {
  children: React.ReactNode;
  variant?: "primary" | "amber" | "green" | "muted" | "teal" | "rose";
  className?: string;
  size?: "sm" | "md";
}

/**
 * A pill-shaped badge for statuses, counts, and minor attributes.
 */
export const Badge = memo(function Badge({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}: Props) {
  const baseStyles =
    "font-sans font-bold rounded-full border flex items-center justify-center gap-1.5 whitespace-nowrap";

  const sizeStyles = size === "sm" ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1";

  const variants = {
    primary: "bg-secondary text-primary border-primary/20",
    amber: "bg-wp-amber/10 text-wp-amber-foreground border-wp-amber/20",
    green:
      "bg-feedback-success-surface text-feedback-success-foreground border-feedback-success-border",
    teal: "bg-wp-teal-light text-wp-teal-foreground border-wp-teal/20",
    rose: "bg-feedback-error-surface text-feedback-error-foreground border-feedback-error-border",
    muted: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
});
