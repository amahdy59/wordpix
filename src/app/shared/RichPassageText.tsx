import { memo, Fragment, useMemo } from "react";
import { useI18n } from "../context/I18nContext";

/**
 * RichPassageText
 *
 * Renders passage/summary text with concurrent transformations:
 *  1. **Markdown bold** — `**word**` -> `<strong>word</strong>`
 *  2. Vocabulary highlights — terms from `vocabTerms` appearing in text
 *     (case-insensitive, hyphen/space-flexible, whole-word, plural-tolerant)
 *     are rendered as clickable interactive buttons that invoke `onTermClick`.
 *
 * Bold + Vocab overlap cleanly: a bolded vocab term gets both bold weight
 * and interactive highlight styling.
 */

interface Props {
  /** Raw text, may contain `**bold**` markdown. */
  text: string;
  /** List of vocabulary terms to highlight as clickable buttons. */
  vocabTerms?: string[];
  /** Called when a highlighted vocabulary term button is clicked. */
  onTermClick?: (term: string) => void;
  /** Extra className applied to the wrapping `<span>`. */
  className?: string;
  /** Raw-text offsets of the provider-timed sentence. Keeps controls mounted. */
  highlightRange?: { start: number; end: number };
}

type PlainToken = { kind: "plain"; text: string; start: number };
type BoldToken = { kind: "bold"; text: string; start: number };
type VocabToken = { kind: "vocab"; text: string; term: string; bold: boolean; start: number };
type Token = PlainToken | BoldToken | VocabToken;
const EMPTY_TERMS: string[] = [];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface TermMatcher {
  canonical: string;
  testRegex: RegExp;
  patternPart: string;
}

function buildTermMatchers(terms: string[]): TermMatcher[] {
  const unique = Array.from(new Set(terms.map((t) => t.trim()).filter(Boolean)));
  // Longest phrases match first so multi-word terms take precedence over single words
  unique.sort((a, b) => b.length - a.length);

  return unique.map((term) => {
    const esc = escapeRegex(term);
    // Support either space or hyphen between words (e.g. false positive <-> false-positive)
    const flex = esc.replace(/[ -]/g, "[ -]");
    // Support optional plural s/es if term doesn't already end in s
    const plural = flex.endsWith("s") ? flex : `${flex}(?:s|es)?`;
    return {
      canonical: term,
      testRegex: new RegExp(`^${plural}$`, "i"),
      patternPart: plural,
    };
  });
}

function tokeniseForVocab(
  segmentText: string,
  matchers: TermMatcher[],
  combinedRegex: RegExp | null,
  bold: boolean,
  offset: number
): Token[] {
  if (!matchers.length || !combinedRegex) {
    return [{ kind: bold ? "bold" : "plain", text: segmentText, start: offset }];
  }

  const parts = segmentText.split(combinedRegex);
  const result: Token[] = [];
  let cursor = offset;

  for (const part of parts) {
    if (!part) continue;
    const matched = matchers.find((m) => m.testRegex.test(part));
    if (matched) {
      result.push({ kind: "vocab", text: part, term: matched.canonical, bold, start: cursor });
    } else {
      result.push({ kind: bold ? "bold" : "plain", text: part, start: cursor });
    }
    cursor += part.length;
  }

  return result;
}

function tokenise(text: string, vocabTerms: string[]): Token[] {
  const matchers = buildTermMatchers(vocabTerms);
  const combinedRegex = matchers.length
    ? new RegExp(`\\b(${matchers.map((m) => m.patternPart).join("|")})\\b`, "gi")
    : null;

  const boldPattern = /\*\*(.+?)\*\*/g;
  const result: Token[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = boldPattern.exec(text)) !== null) {
    // Plain segment before this bold span
    if (match.index > cursor) {
      const plain = text.slice(cursor, match.index);
      result.push(...tokeniseForVocab(plain, matchers, combinedRegex, false, cursor));
    }
    // Bold segment inside **
    result.push(...tokeniseForVocab(match[1], matchers, combinedRegex, true, match.index + 2));
    cursor = match.index + match[0].length;
  }

  // Trailing plain segment
  if (cursor < text.length) {
    result.push(...tokeniseForVocab(text.slice(cursor), matchers, combinedRegex, false, cursor));
  }

  return result;
}

export const RichPassageText = memo(function RichPassageText({
  text,
  vocabTerms = EMPTY_TERMS,
  onTermClick,
  className,
  highlightRange,
}: Props) {
  const { t } = useI18n();
  const tokens = useMemo(() => tokenise(text, vocabTerms), [text, vocabTerms]);
  const content = (token: Token) => {
    const from = Math.max(0, (highlightRange?.start ?? 0) - token.start);
    const to = Math.min(token.text.length, (highlightRange?.end ?? 0) - token.start);
    if (to <= from) return token.text;
    return (
      <>
        {token.text.slice(0, from)}
        <mark className="rounded bg-muted text-foreground underline decoration-primary decoration-2 underline-offset-4">
          {token.text.slice(from, to)}
        </mark>
        {token.text.slice(to)}
      </>
    );
  };

  return (
    <span className={className}>
      {tokens.map((token, i) => {
        switch (token.kind) {
          case "plain":
            return <Fragment key={i}>{content(token)}</Fragment>;

          case "bold":
            return (
              <strong key={i} className="font-black text-foreground">
                {content(token)}
              </strong>
            );

          case "vocab":
            return (
              <button
                key={i}
                type="button"
                onClick={() => onTermClick?.(token.term)}
                aria-label={
                  t("conversation.learnWord", { word: token.term }) ||
                  `Learn more about ${token.term}`
                }
                className={[
                  "inline-flex min-h-11 min-w-11 items-baseline rounded-md px-1 py-0.5 mx-0.5 align-baseline cursor-pointer motion-safe:transition-colors",
                  "bg-secondary text-primary border border-primary/25",
                  "underline decoration-primary/60 decoration-2 underline-offset-2",
                  "hover:bg-secondary hover:border-primary/50 motion-safe:active:scale-[0.98]",
                  "focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-1 focus-visible:outline-primary",
                  token.bold ? "font-black" : "font-bold",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {content(token)}
              </button>
            );
        }
      })}
    </span>
  );
});
