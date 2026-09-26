import { memo, Fragment } from "react";
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
}

type PlainToken = { kind: "plain"; text: string };
type BoldToken = { kind: "bold"; text: string };
type VocabToken = { kind: "vocab"; text: string; term: string; bold: boolean };
type Token = PlainToken | BoldToken | VocabToken;

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
  bold: boolean
): Token[] {
  if (!matchers.length || !combinedRegex) {
    return [{ kind: bold ? "bold" : "plain", text: segmentText }];
  }

  const parts = segmentText.split(combinedRegex);
  const result: Token[] = [];

  for (const part of parts) {
    if (!part) continue;
    const matched = matchers.find((m) => m.testRegex.test(part));
    if (matched) {
      result.push({ kind: "vocab", text: part, term: matched.canonical, bold });
    } else {
      result.push({ kind: bold ? "bold" : "plain", text: part });
    }
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
      result.push(...tokeniseForVocab(plain, matchers, combinedRegex, false));
    }
    // Bold segment inside **
    result.push(...tokeniseForVocab(match[1], matchers, combinedRegex, true));
    cursor = match.index + match[0].length;
  }

  // Trailing plain segment
  if (cursor < text.length) {
    result.push(...tokeniseForVocab(text.slice(cursor), matchers, combinedRegex, false));
  }

  return result;
}

export const RichPassageText = memo(function RichPassageText({
  text,
  vocabTerms = [],
  onTermClick,
  className,
}: Props) {
  const { t } = useI18n();
  const tokens = tokenise(text, vocabTerms);

  return (
    <span className={className}>
      {tokens.map((token, i) => {
        switch (token.kind) {
          case "plain":
            return <Fragment key={i}>{token.text}</Fragment>;

          case "bold":
            return (
              <strong key={i} className="font-black text-foreground">
                {token.text}
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
                  "inline-flex items-baseline rounded-md px-1 py-0.5 mx-0.5 align-baseline cursor-pointer transition-all",
                  "bg-primary/10 text-primary border border-primary/25",
                  "underline decoration-primary/60 decoration-2 underline-offset-2",
                  "hover:bg-primary/20 hover:border-primary/50 active:scale-[0.98]",
                  "focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-1 focus-visible:outline-primary",
                  token.bold ? "font-black" : "font-bold",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {token.text}
              </button>
            );
        }
      })}
    </span>
  );
});
