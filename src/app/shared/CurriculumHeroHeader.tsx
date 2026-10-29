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
    <header className="space-y-4 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1
          id={titleId}
          className="min-w-0 break-words text-2xl font-black text-foreground sm:text-3xl"
        >
          {title}
        </h1>
        {badge && <span className="text-sm font-semibold text-foreground">{badge}</span>}
      </div>
      {metrics.length > 0 && (
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground">
          {metrics.map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-2">
              <dt>{label}</dt>
              <dd className="font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div>{action}</div>
      {description && (
        <HelpDisclosure label={t("help.aboutCourse")}>
          <p>{description}</p>
        </HelpDisclosure>
      )}
      {children}
    </header>
  );
}
