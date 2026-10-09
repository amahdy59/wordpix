import { RichPassageText } from "./RichPassageText";

export interface TranscriptSpan {
  start: number;
  end: number;
  from: number;
  to: number;
}

export function getActiveTranscriptRange(
  spans: readonly TranscriptSpan[],
  time: number
): TranscriptSpan | undefined {
  return spans.find((span) => time >= span.from && time < span.to);
}

/** Highlight without moving focus, scrolling, or announcing every sentence. */
export function TimedPassageText({
  text,
  spans = [],
  time,
  offset = 0,
  vocabTerms,
  onTermClick,
  interactiveVocabulary,
}: {
  text: string;
  spans?: readonly TranscriptSpan[];
  time: number | null;
  offset?: number;
  vocabTerms?: string[];
  onTermClick?: (term: string) => void;
  interactiveVocabulary?: boolean;
}) {
  const active = time === null ? undefined : getActiveTranscriptRange(spans, time);
  const from = active ? Math.max(0, active.start - offset) : 0;
  const to = active ? Math.min(text.length, active.end - offset) : 0;
  return (
    <RichPassageText
      text={text}
      vocabTerms={vocabTerms}
      onTermClick={onTermClick}
      interactiveVocabulary={interactiveVocabulary}
      highlightRange={to > from ? { start: from, end: to } : undefined}
    />
  );
}
