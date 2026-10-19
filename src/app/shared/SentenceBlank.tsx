import { Fragment, type ReactNode } from "react";
import { useI18n } from "../context/I18nContext";

/** One visual gap, with a spoken label instead of punctuation read aloud. */
export function SentenceBlank({
  children,
  label,
  className = "",
}: {
  children?: ReactNode;
  label?: string;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <span className={`wp-question-blank ${className}`} data-filled={Boolean(children)}>
      {children || <span className="sr-only">{label ?? t("exercise.missingWord")}</span>}
    </span>
  );
}

/** Content keeps its authored tokens; only their presentation is normalized. */
export function ClozeText({ text, answer }: { text: string; answer?: string }) {
  return text
    .split(/(_{2,}|\{blank\})/gu)
    .map((part, index) => (
      <Fragment key={index}>
        {/^(?:_{2,}|\{blank\})$/u.test(part) ? <SentenceBlank>{answer}</SentenceBlank> : part}
      </Fragment>
    ));
}
