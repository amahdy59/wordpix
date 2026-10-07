import manifest from "./conversationReadingAudioManifest.json";

interface ReadingAudioEntry {
  key: string;
  text: string;
  timingKey: string;
}

interface ReadingAudioUnit {
  full: ReadingAudioEntry;
  paragraphs: ReadingAudioEntry[];
}

const units: Partial<Record<string, ReadingAudioUnit>> = manifest.units;

/** Select this verified take only while the authored transcript still matches. */
export function getConversationReadingAudioKey(
  unitId: string,
  track: "full" | number,
  text: string
): string | undefined {
  const unit = units[unitId];
  const entry = track === "full" ? unit?.full : unit?.paragraphs[track];
  return entry?.text === text.replace(/\s+/g, " ").trim() ? entry.key : undefined;
}
