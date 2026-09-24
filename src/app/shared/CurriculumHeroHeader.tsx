import type { ReactNode } from "react";

interface Metric {
  label: string;
  value: ReactNode;
}

interface Props {
  titleId: string;
  badge: string;
  title: string;
  description: string;
  metrics: readonly Metric[];
  action: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
}

export function CurriculumHeroHeader({
  titleId,
  badge,
  title,
  description,
  metrics,
  action,
  media,
  children,
}: Props) {
  return (
    <header
      className={`grid gap-6 rounded-3xl border-2 border-primary/35 bg-gradient-to-br from-primary/15 via-card to-card p-5 shadow-wp-sm sm:p-8 ${media ? "lg:grid-cols-[1fr_280px] lg:items-center" : ""}`}
    >
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{badge}</p>
        <h1 id={titleId} className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border bg-background/80 p-4"
            >
              <dt className="text-xs font-bold uppercase text-muted-foreground">{metric.label}</dt>
              <dd className="mt-1 text-2xl font-black text-foreground">{metric.value}</dd>
            </div>
          ))}
        </dl>
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6">{action}</div>
      </div>
      {media}
    </header>
  );
}
