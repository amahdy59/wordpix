import { memo } from "react";

interface Props {
  children: React.ReactNode;
  variant?: "default" | "primary";
  className?: string;
  onClick?: () => void;
}

/**
 * A standardized card container.
 * "primary" variant has a tinted border and hover effect, used for primary actions.
 * "default" uses standard borders.
 */
export const Card = memo(function Card({
  children,
  variant = "default",
  className = "",
  onClick,
}: Props) {
  const baseStyles = "bg-wp-card rounded-3xl p-6 flex flex-col gap-4 shadow-wp-xs transition-all";

  const variantStyles =
    variant === "primary"
      ? "border border-primary/30 hover:border-primary/50 cursor-pointer"
      : "border border-border";

  // If there's an onClick but variant is default, still show cursor pointer
  const interactiveStyles =
    onClick && variant !== "primary" ? "cursor-pointer hover:border-border/80" : "";

  // Hover lift + press scale previously came from framer-motion; the CSS
  // below keeps identical visuals and stays inert under reduced motion,
  // matching the app-wide MotionConfig reducedMotion="user" behaviour.
  const motionStyles = onClick
    ? "motion-safe:hover:scale-[1.015] motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
    : "";

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions --
          Interactive cards predate this rule surfacing (framer-motion's
          motion.div was invisible to it): role="button", tabIndex, and
          Enter/Space handling are all present when onClick is set. */}
      <div
        className={`${baseStyles} ${variantStyles} ${interactiveStyles} ${motionStyles} ${className}`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        {children}
      </div>
    </>
  );
});
