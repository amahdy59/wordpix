import type { ElementType, ReactNode } from "react";

export type FeedbackTone = "neutral" | "info" | "success" | "warning" | "error";

export interface FeedbackPanelProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  titleAs?: "h1" | "h2" | "h3" | "p";
  tone?: FeedbackTone;
  live?: "off" | "polite" | "assertive";
  className?: string;
}

const toneStyles: Record<FeedbackTone, string> = {
  neutral: "border-border bg-wp-card",
  info: "border-primary/35 bg-secondary",
  success: "border-wp-green/40 bg-wp-green/10",
  warning: "border-wp-amber/45 bg-wp-amber/10",
  error: "border-destructive/45 bg-destructive/10",
};

/** Stable in-flow feedback region for success, error, guidance, and recovery. */
export function FeedbackPanel({
  title,
  description,
  icon,
  action,
  titleAs = "h2",
  tone = "neutral",
  live = tone === "error" ? "assertive" : "polite",
  className = "",
}: FeedbackPanelProps) {
  const Title = titleAs as ElementType;

  return (
    <section
      role={tone === "error" ? "alert" : "status"}
      aria-live={live === "off" ? undefined : live}
      aria-atomic="true"
      className={`w-full rounded-2xl border p-5 shadow-wp-xs sm:p-6 ${toneStyles[tone]} ${className}`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/80 text-foreground">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <Title className="font-sans text-base font-bold text-foreground">{title}</Title>
          {description && (
            <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          {action && <div className="mt-4 flex flex-wrap gap-2">{action}</div>}
        </div>
      </div>
    </section>
  );
}
