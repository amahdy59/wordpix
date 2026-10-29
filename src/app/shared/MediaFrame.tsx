import type { HTMLAttributes, ReactNode } from "react";

export type MediaFrameAspect = "square" | "recognition" | "scene" | "auto";
export type MediaFrameFit = "cover" | "contain";

export interface MediaFrameProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "figure";
  aspect?: MediaFrameAspect;
  fit?: MediaFrameFit;
  children: ReactNode;
}

const aspectStyles: Record<MediaFrameAspect, string> = {
  square: "aspect-square",
  recognition: "aspect-[4/3]",
  scene: "aspect-video",
  auto: "",
};

/**
 * Shared boundary for instructional and decorative media. The frame owns
 * ratio, clipping, surface, and child image fit so cards do not invent them.
 */
export function MediaFrame({
  as: Component = "div",
  aspect = "recognition",
  fit = "cover",
  className = "",
  children,
  ...rest
}: MediaFrameProps) {
  return (
    <Component
      className={`relative min-w-0 overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-wp-xs [&>img]:size-full ${
        fit === "cover" ? "[&>img]:object-cover" : "[&>img]:object-contain"
      } ${aspectStyles[aspect]} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
