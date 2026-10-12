import { NUMBERS_COUNTING_SCENARIOS } from "./units/numbers_counting.mjs";
import { COLORS_SCENARIOS } from "./units/colors.mjs";
import { SHAPES_GEOMETRY_SCENARIOS } from "./units/shapes_geometry.mjs";
import { BASIC_EMOTIONS_SCENARIOS } from "./units/basic_emotions.mjs";
import { FAMILY_SCENARIOS } from "./units/family.mjs";
import { BEDROOM_SCENARIOS } from "./units/bedroom.mjs";
import { BATHROOM_SCENARIOS } from "./units/bathroom.mjs";
import { KITCHEN_SCENARIOS } from "./units/kitchen.mjs";
import { LIVING_ROOM_SCENARIOS } from "./units/living_room.mjs";
import { FRUITS_SCENARIOS } from "./units/fruits.mjs";
import { VEGETABLES_SCENARIOS } from "./units/vegetables.mjs";
import { TELLING_TIME_SCENARIOS } from "./units/telling_time.mjs";
import { DAYS_MONTHS_SCENARIOS } from "./units/days_months.mjs";
import { DAILY_ACTION_VERBS_SCENARIOS } from "./units/daily_action_verbs.mjs";
import { PREPOSITIONS_OF_PLACE_SCENARIOS } from "./units/prepositions_of_place.mjs";
import { DAILY_ROUTINES_SCENARIOS } from "./units/daily_routines.mjs";
import { CLASSROOM_SCENARIOS } from "./units/classroom.mjs";
import { TOYS_GAMES_SCENARIOS } from "./units/toys_games.mjs";
import { MARKET_SCENARIOS } from "./units/market.mjs";
import { GIVING_DIRECTIONS_SCENARIOS } from "./units/giving_directions.mjs";
import { MOVEMENT_VERBS_SCENARIOS } from "./units/movement_verbs.mjs";
import { HAND_ACTIONS_SCENARIOS } from "./units/hand_actions.mjs";
import { FARM_SCENARIOS } from "./units/farm.mjs";
import { GARDEN_SCENARIOS } from "./units/garden.mjs";
import { PARK_SCENARIOS } from "./units/park.mjs";
import { PLAYGROUND_SCENARIOS } from "./units/playground.mjs";
import { PET_SHOP_SCENARIOS } from "./units/pet_shop.mjs";
import { VET_CLINIC_SCENARIOS } from "./units/vet_clinic.mjs";
import { BAKERY_SCENARIOS } from "./units/bakery.mjs";
import { COFFEE_SHOP_SCENARIOS } from "./units/coffee_shop.mjs";
import { ICE_CREAM_SHOP_SCENARIOS } from "./units/ice_cream_shop.mjs";
import { PIZZA_SHOP_SCENARIOS } from "./units/pizza_shop.mjs";
import { RESTAURANT_SCENARIOS } from "./units/restaurant.mjs";

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
  fruits: FRUITS_SCENARIOS,
  vegetables: VEGETABLES_SCENARIOS,
  "telling-time": TELLING_TIME_SCENARIOS,
  "days-months": DAYS_MONTHS_SCENARIOS,
  "daily-action-verbs": DAILY_ACTION_VERBS_SCENARIOS,
  "prepositions-of-place": PREPOSITIONS_OF_PLACE_SCENARIOS,
  "daily-routines": DAILY_ROUTINES_SCENARIOS,
  classroom: CLASSROOM_SCENARIOS,
  "toys-games": TOYS_GAMES_SCENARIOS,
  market: MARKET_SCENARIOS,
  "giving-directions": GIVING_DIRECTIONS_SCENARIOS,
  "movement-verbs": MOVEMENT_VERBS_SCENARIOS,
  "hand-actions": HAND_ACTIONS_SCENARIOS,
  farm: FARM_SCENARIOS,
  garden: GARDEN_SCENARIOS,
  park: PARK_SCENARIOS,
  playground: PLAYGROUND_SCENARIOS,
  "pet-shop": PET_SHOP_SCENARIOS,
  "vet-clinic": VET_CLINIC_SCENARIOS,
  bakery: BAKERY_SCENARIOS,
  "coffee-shop": COFFEE_SHOP_SCENARIOS,
  "ice-cream-shop": ICE_CREAM_SHOP_SCENARIOS,
  "pizza-shop": PIZZA_SHOP_SCENARIOS,
  restaurant: RESTAURANT_SCENARIOS,
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
    let pattern;
    if (wordId === "jalape-o") {
      pattern = /\bjalape[ñn]o(s)?\b/i;
    } else if (wordId === "o-clock") {
      pattern = /\bo['\s]?clock\b/i;
    } else if (wordId === "a-m-") {
      pattern = /(?:^|[\s\d:])a\.?m\.?(?=[\s,.;!?]|$)/i;
    } else if (wordId === "p-m-") {
      pattern = /(?:^|[\s\d:])p\.?m\.?(?=[\s,.;!?]|$)/i;
    } else if (wordId === "clair") {
      pattern = /(?:^|[\s"'])[eé]?clair(s)?\b/i;
    } else {
      const parts = wordId.toLowerCase().split("-").filter(Boolean).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      const patternStr = `\\b` + parts.join("(?:[-\\s]+(?:a|an|the|my|your|his|her|our|their)[-\\s]+|[-\\s]+)") + `(s|es|d|ed|ing)?\\b`;
      pattern = new RegExp(patternStr, "i");
    }

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
