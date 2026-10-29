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
 * Phones and tablets use a 2x2 grid so each option remains comfortably tappable.
 * Large landscape viewports use one row and let every card share the available
 * stage height instead of collapsing to its intrinsic image size.
 */
export function ImmersiveImageChoiceGrid({
  className = "",
  ...props
}: ImmersiveImageChoiceGridProps) {
  return (
    <div
      {...props}
      role="group"
      className={`grid min-h-0 w-full flex-1 auto-rows-fr grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:grid-rows-1 xl:gap-6 ${className}`}
    />
  );
}
