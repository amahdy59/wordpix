import { NUMBERS_COUNTING_SCENARIOS } from "./units/numbers_counting.mjs";
import { COLORS_SCENARIOS } from "./units/colors.mjs";
import { SHAPES_GEOMETRY_SCENARIOS } from "./units/shapes_geometry.mjs";
import { BASIC_EMOTIONS_SCENARIOS } from "./units/basic_emotions.mjs";
import { FAMILY_SCENARIOS } from "./units/family.mjs";
import { BEDROOM_SCENARIOS } from "./units/bedroom.mjs";
import { BATHROOM_SCENARIOS } from "./units/bathroom.mjs";
import { KITCHEN_SCENARIOS } from "./units/kitchen.mjs";
import { LIVING_ROOM_SCENARIOS } from "./units/living_room.mjs";

export const SCENARIO_CATALOG = {
  "numbers-counting": NUMBERS_COUNTING_SCENARIOS,
  colors: COLORS_SCENARIOS,
  "shapes-geometry": SHAPES_GEOMETRY_SCENARIOS,
  "basic-emotions": BASIC_EMOTIONS_SCENARIOS,
  family: FAMILY_SCENARIOS,
  bedroom: BEDROOM_SCENARIOS,
  bathroom: BATHROOM_SCENARIOS,
  kitchen: KITCHEN_SCENARIOS,
  "living-room": LIVING_ROOM_SCENARIOS,
};

export function getUnitScenarios(unitId) {
  return SCENARIO_CATALOG[unitId] || null;
}

export function reviewScenario(lesson) {
  const errors = [];
  const warnings = [];

  // 1. Text concatenation & length check
  const allText = lesson.lines.map((l) => l.text).join(" ");
  const totalChars = allText.length;
  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  // Average conversational speech rate: ~140-150 words per minute (2.3-2.5 words/sec)
  const estSeconds = Math.round((wordCount / 2.3) * 10) / 10;

  if (estSeconds > 60) {
    errors.push(`Duration exceeds 60 seconds (estimated: ${estSeconds}s, words: ${wordCount})`);
  }
  if (estSeconds < 18) {
    warnings.push(`Duration is short (estimated: ${estSeconds}s, words: ${wordCount})`);
  }

  // 2. Word coverage check
  const coveredWords = [];
  const missingWords = [];

  for (const wordId of lesson.wordIds) {
    const parts = wordId.toLowerCase().split("-").map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const patternStr = `\\b` + parts.join("(?:[-\\s]+(?:a|an|the|my|your|his|her|our|their)[-\\s]+|[-\\s]+)") + `(s|es|d|ed|ing)?\\b`;
    const pattern = new RegExp(patternStr, "i");

    if (pattern.test(allText)) {
      coveredWords.push(wordId);
    } else {
      missingWords.push(wordId);
    }
  }

  if (missingWords.length > 0) {
    errors.push(`Missing target vocabulary words (${missingWords.length}/${lesson.wordIds.length}): ${missingWords.join(", ")}`);
  }

  // 3. Dialogue check
  const speakers = new Set(lesson.lines.map((l) => l.speaker));
  if (speakers.size < 2) {
    errors.push(`Dialogue must feature at least 2 distinct characters (found: ${Array.from(speakers).join(", ")})`);
  }

  // 4. Voice ID validity
  const validVoices = {
    Tariq: "JBFqnCBsd6RMkjVDRZzb",
    Adam: "bIHbv24MWmeRgasZH58o",
    Omar: "IKne3meq5aSn9XLyUdCD",
  };
  for (const line of lesson.lines) {
    if (!validVoices[line.speaker]) {
      errors.push(`Unknown speaker: "${line.speaker}" in line ${line.id}`);
    } else if (line.voiceId !== validVoices[line.speaker]) {
      errors.push(`Voice ID mismatch for speaker ${line.speaker}: expected ${validVoices[line.speaker]}, got ${line.voiceId}`);
    }
  }

  const approved = errors.length === 0;

  return {
    approved,
    errors,
    warnings,
    stats: {
      lessonId: lesson.id,
      titleEn: lesson.titleEn,
      wordCount,
      totalChars,
      estSeconds,
      targetCount: lesson.wordIds.length,
      coveredCount: coveredWords.length,
      missingWords,
    },
  };
}
