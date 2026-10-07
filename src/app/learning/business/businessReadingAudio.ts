import manifest from "./businessReadingAudioManifest.json";
import timing from "./businessTranscriptTiming.json";
import type { TranscriptSpan } from "../../shared/TimedPassageText";

interface AudioEntry {
  key: string;
  text: string;
  timingKey: string;
}
interface AudioUnit {
  full: AudioEntry | null;
  paragraphs: (AudioEntry | null)[];
}
const units: Partial<Record<string, AudioUnit>> = manifest.units;
const timings: Partial<Record<string, TranscriptSpan[]>> = timing;

/** Missing or edited transcripts retain the existing audio fallback. */
export function getBusinessReadingAudio(unitId: string, text: string) {
  const unit = units[unitId];
  const normalized = text.replace(/\s+/g, " ").trim();
  const entry = unit && [unit.full, ...unit.paragraphs].find((item) => item?.text === normalized);
  return entry ? { key: entry.key, spans: timings[entry.key] ?? [] } : undefined;
}
