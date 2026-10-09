import { useI18n } from "../../i18n";
import { ArrowRightLeft, GitBranch, Lightbulb } from "lucide-react";

export function LanguageInsightCard({
  kind,
  title,
  text,
}: {
  kind: "family" | "contrast" | "error";
  title: string;
  text?: string;
}) {
  const { t } = useI18n();
  if (!text) return null;
  const Icon = kind === "family" ? GitBranch : kind === "contrast" ? ArrowRightLeft : Lightbulb;
  const surface =
    kind === "family"
      ? "border-primary"
      : kind === "contrast"
        ? "border-feedback-success-border"
        : "border-feedback-warning-border";
  const color =
    kind === "family"
      ? "text-primary"
      : kind === "contrast"
        ? "text-feedback-success-foreground"
        : "text-feedback-warning-foreground";
  const family = kind === "family" && text.includes("→") ? text.split("→") : [];
  const correction = kind === "error" ? text.match(/^Not:\s*(.+?)\s*\|\s*Use:\s*(.+)$/i) : null;
  return (
    <aside className={`min-w-0 border-s-2 ps-4 py-2 ${surface}`}>
      <h3 className={`flex items-center gap-2 text-sm font-bold ${color}`}>
        <Icon className="size-5 shrink-0" aria-hidden />
        {title}
      </h3>
      <div className="mt-3 text-base leading-7 text-foreground" lang="en" dir="ltr">
        {family.length ? (
          <p className="flex flex-wrap items-center gap-2">
            {family.map((word, index) => (
              <span key={`${index}-${word}`} className="inline-flex items-center gap-2">
                {index > 0 && <span aria-hidden>→</span>}
                <span className="font-bold">{word.trim()}</span>
              </span>
            ))}
          </p>
        ) : correction ? (
          <div className="space-y-2">
            <p className="border-s-2 border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-feedback-error-foreground">
              <strong>{t("courseLesson.avoid")} </strong>
              {correction[1]}
            </p>
            <p className="border-s-2 border-feedback-success-border bg-feedback-success-surface px-3 py-2 text-feedback-success-foreground">
              <strong>{t("courseLesson.use")} </strong>
              {correction[2]}
            </p>
          </div>
        ) : (
          <p className="font-medium">{text}</p>
        )}
      </div>
    </aside>
  );
}
