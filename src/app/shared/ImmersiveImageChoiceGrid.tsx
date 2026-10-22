import type { ComponentPropsWithoutRef } from "react";

interface ImmersiveImageChoiceGridProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "aria-label" | "role"
> {
  "aria-label": string;
}

/**
 * Shared full-stage layout for image-based answer cards.
 *
 * Uses a balanced 2x2 grid (2 columns × 2 rows) across mobile, tablet,
 * and desktop so images maintain natural aspect ratios and visual clarity
 * rather than being squashed into narrow vertical strips.
 */
export function ImmersiveImageChoiceGrid({
  className = "",
  ...props
}: ImmersiveImageChoiceGridProps) {
  return (
    <div
      {...props}
      role="group"
      className={`grid min-h-0 w-full flex-1 auto-rows-fr grid-cols-2 grid-rows-2 gap-2.5 sm:gap-4 lg:gap-5 xl:gap-6 ${className}`}
    />
  );
}
