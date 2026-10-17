import type { ReactNode } from "react";
import { useI18n } from "../context/I18nContext";
import { HelpDisclosure } from "./HelpDisclosure";

interface Metric {
  label: string;
  value: ReactNode;
}
interface Props {
  titleId: string;
  badge?: string;
  title: string;
  description?: string;
  metrics?: readonly Metric[];
  action: ReactNode;
  children?: ReactNode;
}

/** Compact orientation shared by all specialist curricula. */
export function CurriculumHeroHeader({
  titleId,
  badge,
  title,
  description,
  metrics = [],
  action,
  children,
}: Props) {
  const { t } = useI18n();
  return (
    <header className="space-y-3 py-1">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1
              id={titleId}
              className="min-w-0 break-words text-2xl font-black text-foreground sm:text-3xl"
            >
              {title}
            </h1>
            {badge && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                {badge}
              </span>
            )}
          </div>
          {metrics.length > 0 && (
            <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground sm:text-sm">
              {metrics.map(({ label, value }) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <dt>{label}:</dt>
                  <dd className="font-bold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {(description || children) && (
        <div className="flex flex-wrap items-center gap-3">
          {description && (
            <HelpDisclosure label={t("help.aboutCourse")}>
              <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
            </HelpDisclosure>
          )}
          {children}
        </div>
      )}
    </header>
  );
}
