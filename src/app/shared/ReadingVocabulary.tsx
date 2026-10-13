import { useI18n } from "../../i18n";
import { ChevronDown } from "lucide-react";

/** Word actions are separate from prose so 44px targets never expand its lines. */
export function ReadingVocabulary({
  terms,
  onSelect,
}: {
  terms: string[];
  onSelect: (term: string) => void;
}) {
  const { t } = useI18n();
  if (!terms.length) return null;
  const wordButton = (term: string) => (
    <button
      key={term}
      type="button"
      onClick={() => onSelect(term)}
      aria-label={t("conversation.learnWord", { word: term })}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border px-3 font-semibold text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:transition-colors"
    >
      {term}
    </button>
  );
  return (
    <section
      aria-label={t("readingPlayer.vocabulary")}
      className="space-y-3 border-t border-border pt-5"
    >
      <h3 className="text-base font-semibold text-foreground">{t("readingPlayer.vocabulary")}</h3>
      <p className="text-sm text-foreground">{t("readingPlayer.vocabularyHint")}</p>
      <div className="flex flex-wrap gap-2" lang="en" dir="ltr">
        {terms.slice(0, 6).map(wordButton)}
      </div>
      {terms.length > 6 && (
        <details className="group">
          <summary className="inline-flex min-h-11 min-w-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {t("audioRecovery.moreWords", { count: terms.length - 6 })}
            <ChevronDown className="size-4 group-open:rotate-180" aria-hidden />
          </summary>
          <div className="mt-2 flex flex-wrap gap-2" lang="en" dir="ltr">
            {terms.slice(6).map(wordButton)}
          </div>
        </details>
      )}
    </section>
  );
}
