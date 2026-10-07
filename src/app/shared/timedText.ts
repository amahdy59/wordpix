/** Deterministic transcript timing metadata derived from authored text.
 *
 * Media files remain content-addressed in R2. These ratios let any player
 * highlight authored sentences as native audio reports currentTime, without
 * changing or re-uploading an asset.
 */
export interface TimedTextSegment {
  text: string;
  startRatio: number;
  endRatio: number;
}

export function buildTimedTextSegments(text: string): TimedTextSegment[] {
  const sentences =
    text
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map((part) => part.trim())
      .filter(Boolean) ?? [];
  if (sentences.length === 0) return [{ text, startRatio: 0, endRatio: 1 }];
  const weights = sentences.map((sentence) => Math.max(1, sentence.replace(/\s+/g, " ").length));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = 0;
  return sentences.map((sentence, index) => {
    const startRatio = cursor / total;
    cursor += weights[index];
    return { text: sentence, startRatio, endRatio: cursor / total };
  });
}

export function activeTimedTextSegment(segments: TimedTextSegment[], progress: number): number {
  const index = segments.findIndex(
    (segment) => progress >= segment.startRatio && progress < segment.endRatio
  );
  return index === -1 ? Math.max(0, segments.length - 1) : index;
}
