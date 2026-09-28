import type { ElementType, ReactNode } from "react";
import { Surface } from "./Surface";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  titleAs?: "h2" | "h3" | "p";
  live?: "off" | "polite";
  className?: string;
}

/** Calm, consistent empty state with an optional next action. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  titleAs = "h2",
  live = "off",
  className = "",
}: EmptyStateProps) {
  const Title = titleAs as ElementType;

  return (
    <Surface
      variant="card"
      radius="lg"
      padding="lg"
      role={live === "off" ? undefined : "status"}
      aria-live={live === "off" ? undefined : live}
      aria-atomic={live === "off" ? undefined : "true"}
      className={`flex min-h-48 w-full flex-col items-center justify-center text-center ${className}`}
    >
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <Title className={`${icon ? "mt-4" : ""} font-sans text-base font-bold text-foreground`}>
        {title}
      </Title>
      {description && (
        <p className="mt-1 max-w-prose text-sm font-medium leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </Surface>
  );
}
