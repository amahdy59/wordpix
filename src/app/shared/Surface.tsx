import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";

export type SurfaceVariant = "card" | "elevated" | "panel" | "muted" | "flat";
export type SurfaceRadius = "none" | "md" | "lg" | "xl" | "2xl" | "3xl" | "pill";
export type SurfacePadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: SurfaceVariant;
  radius?: SurfaceRadius;
  padding?: SurfacePadding;
  className?: string;
  children?: ReactNode;
}

const variantStyles: Record<SurfaceVariant, string> = {
  card: "bg-wp-card border border-border text-foreground shadow-wp-xs",
  elevated: "bg-wp-card border border-border text-foreground shadow-wp-md",
  panel: "bg-wp-panel border border-wp-panel-border text-wp-text-on-panel shadow-wp-sm",
  muted: "bg-muted/50 border border-border/60 text-foreground",
  flat: "bg-wp-card text-foreground",
};

const radiusStyles: Record<SurfaceRadius, string> = {
  none: "rounded-none",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
  "2xl": "rounded-[28px]",
  "3xl": "rounded-[32px]",
  pill: "rounded-full",
};

const paddingStyles: Record<SurfacePadding, string> = {
  none: "p-0",
  xs: "p-3",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
  xl: "p-8 sm:p-10",
};

/**
 * Foundational container primitive for elevation, paneling, and card surfaces.
 * Automatically aligns with WordPix semantic color tokens in light and dark mode.
 */
export const Surface = forwardRef<HTMLElement, SurfaceProps>(function Surface(
  {
    as: Component = "div",
    variant = "card",
    radius = "xl",
    padding = "none",
    className = "",
    children,
    ...rest
  },
  ref
) {
  return (
    <Component
      ref={ref}
      className={`${variantStyles[variant]} ${radiusStyles[radius]} ${paddingStyles[padding]} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
});
