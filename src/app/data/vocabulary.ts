import type { VocabularyItem } from "./lessons";
import { VOCABULARY as BEDROOM_VOCABULARY } from "./units/bedroom";

/**
 * Loads a unit's vocabulary on demand, and answers word lookups for whatever
 * has been loaded so far.
 *
 * Every unit's words used to sit in `lessons.ts`, which meant a learner
 * opening one unit parsed all 182 of them — 2.6 MB of source to show about
 * sixty words. The arrays now live one file per unit and arrive as their own
 * chunk when that unit is opened.
 *
 * `getWords` stays synchronous on purpose. It is called from the reducer and
 * from the exercise components, and threading a promise through those for a
 * lookup that is almost always already resolved would spread async through
 * the whole drill loop. Instead the router loads a unit's words before it
 * renders any of that unit's screens, and this module keeps what has been
 * loaded in a flat id map. The invariant is "load at the boundary, read
 * synchronously inside it" — see `UnitVocabularyGate`.
 *
 * GENERATED loader map — regenerate with scripts/split-unit-vocabulary.mjs.
 */
const LOADERS: Record<string, () => Promise<VocabularyItem[]>> = {
  "3d-printer-lab": () => import("./units/3d-printer-lab").then((m) => m.VOCABULARY),
  "academic-life": () => import("./units/academic-life").then((m) => m.VOCABULARY),
  "accessories-jewelry": () => import("./units/accessories-jewelry").then((m) => m.VOCABULARY),
  "ages-life-stages": () => import("./units/ages-life-stages").then((m) => m.VOCABULARY),
  "amusement-park": () => import("./units/amusement-park").then((m) => m.VOCABULARY),
  "architect-s-studio": () => import("./units/architect-s-studio").then((m) => m.VOCABULARY),
  "architecture-styles": () => import("./units/architecture-styles").then((m) => m.VOCABULARY),
  arctic: () => import("./units/arctic").then((m) => m.VOCABULARY),
  "art-studio": () => import("./units/art-studio").then((m) => m.VOCABULARY),
  "auto-dealership": () => import("./units/auto-dealership").then((m) => m.VOCABULARY),
  bakery: () => import("./units/bakery").then((m) => m.VOCABULARY),
  bank: () => import("./units/bank").then((m) => m.VOCABULARY),
  "bar-culture": () => import("./units/bar-culture").then((m) => m.VOCABULARY),
  barbershop: () => import("./units/barbershop").then((m) => m.VOCABULARY),
  "basic-emotions": () => import("./units/basic-emotions").then((m) => m.VOCABULARY),
  bathroom: () => import("./units/bathroom").then((m) => m.VOCABULARY),
  bedroom: () => import("./units/bedroom").then((m) => m.VOCABULARY),
  beverages: () => import("./units/beverages").then((m) => m.VOCABULARY),
  "bicycle-shop": () => import("./units/bicycle-shop").then((m) => m.VOCABULARY),
  "bird-sanctuary": () => import("./units/bird-sanctuary").then((m) => m.VOCABULARY),
  "birthday-party": () => import("./units/birthday-party").then((m) => m.VOCABULARY),
  "body-systems": () => import("./units/body-systems").then((m) => m.VOCABULARY),
  "building-construction": () => import("./units/building-construction").then((m) => m.VOCABULARY),
  "bus-station": () => import("./units/bus-station").then((m) => m.VOCABULARY),
  "business-communication": () =>
    import("./units/business-communication").then((m) => m.VOCABULARY),
  "butterfly-garden": () => import("./units/butterfly-garden").then((m) => m.VOCABULARY),
  "camping-site": () => import("./units/camping-site").then((m) => m.VOCABULARY),
  "car-parts-mechanics": () => import("./units/car-parts-mechanics").then((m) => m.VOCABULARY),
  "car-types": () => import("./units/car-types").then((m) => m.VOCABULARY),
  "car-wash": () => import("./units/car-wash").then((m) => m.VOCABULARY),
  "classic-cocktails": () => import("./units/classic-cocktails").then((m) => m.VOCABULARY),
  classroom: () => import("./units/classroom").then((m) => m.VOCABULARY),
  "cocktail-bar": () => import("./units/cocktail-bar").then((m) => m.VOCABULARY),
  "coffee-shop": () => import("./units/coffee-shop").then((m) => m.VOCABULARY),
  colors: () => import("./units/colors").then((m) => m.VOCABULARY),
  "communication-verbs": () => import("./units/communication-verbs").then((m) => m.VOCABULARY),
  "community-center": () => import("./units/community-center").then((m) => m.VOCABULARY),
  "complex-feelings": () => import("./units/complex-feelings").then((m) => m.VOCABULARY),
  "computer-lab": () => import("./units/computer-lab").then((m) => m.VOCABULARY),
  "construction-site": () => import("./units/construction-site").then((m) => m.VOCABULARY),
  "cooking-methods": () => import("./units/cooking-methods").then((m) => m.VOCABULARY),
  "coral-reef": () => import("./units/coral-reef").then((m) => m.VOCABULARY),
  "costume-shop": () => import("./units/costume-shop").then((m) => m.VOCABULARY),
  courtroom: () => import("./units/courtroom").then((m) => m.VOCABULARY),
  "courtroom-trial": () => import("./units/courtroom-trial").then((m) => m.VOCABULARY),
  "coworking-space": () => import("./units/coworking-space").then((m) => m.VOCABULARY),
  "creative-hobbies": () => import("./units/creative-hobbies").then((m) => m.VOCABULARY),
  "currency-payment": () => import("./units/currency-payment").then((m) => m.VOCABULARY),
  "daily-action-verbs": () => import("./units/daily-action-verbs").then((m) => m.VOCABULARY),
  "daily-routines": () => import("./units/daily-routines").then((m) => m.VOCABULARY),
  "dance-studio": () => import("./units/dance-studio").then((m) => m.VOCABULARY),
  "data-center": () => import("./units/data-center").then((m) => m.VOCABULARY),
  "days-months": () => import("./units/days-months").then((m) => m.VOCABULARY),
  "dental-clinic": () => import("./units/dental-clinic").then((m) => m.VOCABULARY),
  dentist: () => import("./units/dentist").then((m) => m.VOCABULARY),
  desert: () => import("./units/desert").then((m) => m.VOCABULARY),
  "driving-road-rules": () => import("./units/driving-road-rules").then((m) => m.VOCABULARY),
  "drone-workshop": () => import("./units/drone-workshop").then((m) => m.VOCABULARY),
  "electric-vehicle-station": () =>
    import("./units/electric-vehicle-station").then((m) => m.VOCABULARY),
  embassy: () => import("./units/embassy").then((m) => m.VOCABULARY),
  "everyday-clothing": () => import("./units/everyday-clothing").then((m) => m.VOCABULARY),
  "extended-family": () => import("./units/extended-family").then((m) => m.VOCABULARY),
  "eye-doctor": () => import("./units/eye-doctor").then((m) => m.VOCABULARY),
  "fabrics-textiles": () => import("./units/fabrics-textiles").then((m) => m.VOCABULARY),
  "facial-expressions": () => import("./units/facial-expressions").then((m) => m.VOCABULARY),
  family: () => import("./units/family").then((m) => m.VOCABULARY),
  farm: () => import("./units/farm").then((m) => m.VOCABULARY),
  "fashion-atelier": () => import("./units/fashion-atelier").then((m) => m.VOCABULARY),
  "fashion-design": () => import("./units/fashion-design").then((m) => m.VOCABULARY),
  festival: () => import("./units/festival").then((m) => m.VOCABULARY),
  "financial-services": () => import("./units/financial-services").then((m) => m.VOCABULARY),
  "first-aid-room": () => import("./units/first-aid-room").then((m) => m.VOCABULARY),
  "five-senses": () => import("./units/five-senses").then((m) => m.VOCABULARY),
  footwear: () => import("./units/footwear").then((m) => m.VOCABULARY),
  forest: () => import("./units/forest").then((m) => m.VOCABULARY),
  "formal-business-wear": () => import("./units/formal-business-wear").then((m) => m.VOCABULARY),
  "freelancing-remote-work": () =>
    import("./units/freelancing-remote-work").then((m) => m.VOCABULARY),
  fruits: () => import("./units/fruits").then((m) => m.VOCABULARY),
  garden: () => import("./units/garden").then((m) => m.VOCABULARY),
  "gas-station": () => import("./units/gas-station").then((m) => m.VOCABULARY),
  "giving-directions": () => import("./units/giving-directions").then((m) => m.VOCABULARY),
  graduation: () => import("./units/graduation").then((m) => m.VOCABULARY),
  "grains-dairy": () => import("./units/grains-dairy").then((m) => m.VOCABULARY),
  gym: () => import("./units/gym").then((m) => m.VOCABULARY),
  "hair-salon": () => import("./units/hair-salon").then((m) => m.VOCABULARY),
  "hand-actions": () => import("./units/hand-actions").then((m) => m.VOCABULARY),
  harbor: () => import("./units/harbor").then((m) => m.VOCABULARY),
  "home-features": () => import("./units/home-features").then((m) => m.VOCABULARY),
  hotel: () => import("./units/hotel").then((m) => m.VOCABULARY),
  "ice-cream-shop": () => import("./units/ice-cream-shop").then((m) => m.VOCABULARY),
  "indoor-hobbies": () => import("./units/indoor-hobbies").then((m) => m.VOCABULARY),
  "insect-world": () => import("./units/insect-world").then((m) => m.VOCABULARY),
  "interior-design": () => import("./units/interior-design").then((m) => m.VOCABULARY),
  "internal-organs": () => import("./units/internal-organs").then((m) => m.VOCABULARY),
  jungle: () => import("./units/jungle").then((m) => m.VOCABULARY),
  kitchen: () => import("./units/kitchen").then((m) => m.VOCABULARY),
  "kitchen-utensils": () => import("./units/kitchen-utensils").then((m) => m.VOCABULARY),
  laboratory: () => import("./units/laboratory").then((m) => m.VOCABULARY),
  laundromat: () => import("./units/laundromat").then((m) => m.VOCABULARY),
  "law-firm": () => import("./units/law-firm").then((m) => m.VOCABULARY),
  "legal-documents": () => import("./units/legal-documents").then((m) => m.VOCABULARY),
  library: () => import("./units/library").then((m) => m.VOCABULARY),
  "life-events": () => import("./units/life-events").then((m) => m.VOCABULARY),
  "living-room": () => import("./units/living-room").then((m) => m.VOCABULARY),
  "maps-navigation": () => import("./units/maps-navigation").then((m) => m.VOCABULARY),
  market: () => import("./units/market").then((m) => m.VOCABULARY),
  materials: () => import("./units/materials").then((m) => m.VOCABULARY),
  "measurements-units": () => import("./units/measurements-units").then((m) => m.VOCABULARY),
  "meat-seafood": () => import("./units/meat-seafood").then((m) => m.VOCABULARY),
  mechanic: () => import("./units/mechanic").then((m) => m.VOCABULARY),
  "meeting-room": () => import("./units/meeting-room").then((m) => m.VOCABULARY),
  "money-currency": () => import("./units/money-currency").then((m) => m.VOCABULARY),
  mountain: () => import("./units/mountain").then((m) => m.VOCABULARY),
  "movement-verbs": () => import("./units/movement-verbs").then((m) => m.VOCABULARY),
  "moving-settling-in": () => import("./units/moving-settling-in").then((m) => m.VOCABULARY),
  "newspaper-office": () => import("./units/newspaper-office").then((m) => m.VOCABULARY),
  "numbers-counting": () => import("./units/numbers-counting").then((m) => m.VOCABULARY),
  observatory: () => import("./units/observatory").then((m) => m.VOCABULARY),
  office: () => import("./units/office").then((m) => m.VOCABULARY),
  "office-supplies": () => import("./units/office-supplies").then((m) => m.VOCABULARY),
  orchestra: () => import("./units/orchestra").then((m) => m.VOCABULARY),
  park: () => import("./units/park").then((m) => m.VOCABULARY),
  "patterns-textures": () => import("./units/patterns-textures").then((m) => m.VOCABULARY),
  "personality-character": () => import("./units/personality-character").then((m) => m.VOCABULARY),
  "pet-shop": () => import("./units/pet-shop").then((m) => m.VOCABULARY),
  pharmacy: () => import("./units/pharmacy").then((m) => m.VOCABULARY),
  "photography-studio": () => import("./units/photography-studio").then((m) => m.VOCABULARY),
  "physical-appearance": () => import("./units/physical-appearance").then((m) => m.VOCABULARY),
  "pizza-shop": () => import("./units/pizza-shop").then((m) => m.VOCABULARY),
  playground: () => import("./units/playground").then((m) => m.VOCABULARY),
  "police-station": () => import("./units/police-station").then((m) => m.VOCABULARY),
  "pottery-studio": () => import("./units/pottery-studio").then((m) => m.VOCABULARY),
  "prepositions-of-place": () => import("./units/prepositions-of-place").then((m) => m.VOCABULARY),
  "property-types": () => import("./units/property-types").then((m) => m.VOCABULARY),
  "radio-station": () => import("./units/radio-station").then((m) => m.VOCABULARY),
  "real-estate-agency": () => import("./units/real-estate-agency").then((m) => m.VOCABULARY),
  "relationships-roles": () => import("./units/relationships-roles").then((m) => m.VOCABULARY),
  "reptile-house": () => import("./units/reptile-house").then((m) => m.VOCABULARY),
  "research-study": () => import("./units/research-study").then((m) => m.VOCABULARY),
  "rights-regulations": () => import("./units/rights-regulations").then((m) => m.VOCABULARY),
  river: () => import("./units/river").then((m) => m.VOCABULARY),
  "robotics-lab": () => import("./units/robotics-lab").then((m) => m.VOCABULARY),
  "runway-show": () => import("./units/runway-show").then((m) => m.VOCABULARY),
  savanna: () => import("./units/savanna").then((m) => m.VOCABULARY),
  "seasonings-condiments": () => import("./units/seasonings-condiments").then((m) => m.VOCABULARY),
  "seasons-weather": () => import("./units/seasons-weather").then((m) => m.VOCABULARY),
  "shades-tones": () => import("./units/shades-tones").then((m) => m.VOCABULARY),
  "shapes-geometry": () => import("./units/shapes-geometry").then((m) => m.VOCABULARY),
  "shopping-mall": () => import("./units/shopping-mall").then((m) => m.VOCABULARY),
  skeleton: () => import("./units/skeleton").then((m) => m.VOCABULARY),
  "skin-hair": () => import("./units/skin-hair").then((m) => m.VOCABULARY),
  "smart-home": () => import("./units/smart-home").then((m) => m.VOCABULARY),
  "social-situations": () => import("./units/social-situations").then((m) => m.VOCABULARY),
  "solar-farm": () => import("./units/solar-farm").then((m) => m.VOCABULARY),
  spa: () => import("./units/spa").then((m) => m.VOCABULARY),
  "space-station": () => import("./units/space-station").then((m) => m.VOCABULARY),
  "spatial-relations": () => import("./units/spatial-relations").then((m) => m.VOCABULARY),
  "spirits-liqueurs": () => import("./units/spirits-liqueurs").then((m) => m.VOCABULARY),
  "sports-equipment": () => import("./units/sports-equipment").then((m) => m.VOCABULARY),
  "startup-culture": () => import("./units/startup-culture").then((m) => m.VOCABULARY),
  "stock-exchange": () => import("./units/stock-exchange").then((m) => m.VOCABULARY),
  "student-life": () => import("./units/student-life").then((m) => m.VOCABULARY),
  submarine: () => import("./units/submarine").then((m) => m.VOCABULARY),
  subway: () => import("./units/subway").then((m) => m.VOCABULARY),
  supermarket: () => import("./units/supermarket").then((m) => m.VOCABULARY),
  "tailor-shop": () => import("./units/tailor-shop").then((m) => m.VOCABULARY),
  "tech-gadgets": () => import("./units/tech-gadgets").then((m) => m.VOCABULARY),
  "telling-time": () => import("./units/telling-time").then((m) => m.VOCABULARY),
  theater: () => import("./units/theater").then((m) => m.VOCABULARY),
  "toys-games": () => import("./units/toys-games").then((m) => m.VOCABULARY),
  "tv-studio": () => import("./units/tv-studio").then((m) => m.VOCABULARY),
  "university-campus": () => import("./units/university-campus").then((m) => m.VOCABULARY),
  vegetables: () => import("./units/vegetables").then((m) => m.VOCABULARY),
  "vet-clinic": () => import("./units/vet-clinic").then((m) => m.VOCABULARY),
  vineyard: () => import("./units/vineyard").then((m) => m.VOCABULARY),
  volcano: () => import("./units/volcano").then((m) => m.VOCABULARY),
  "weather-station": () => import("./units/weather-station").then((m) => m.VOCABULARY),
  wedding: () => import("./units/wedding").then((m) => m.VOCABULARY),
  "wine-cellar": () => import("./units/wine-cellar").then((m) => m.VOCABULARY),
  "wine-tasting": () => import("./units/wine-tasting").then((m) => m.VOCABULARY),
  winemaking: () => import("./units/winemaking").then((m) => m.VOCABULARY),
  "human-body-head-and-face": () =>
    import("./units/human-body-head-and-face").then((m) => m.VOCABULARY),
  "human-body-upper-body": () => import("./units/human-body-upper-body").then((m) => m.VOCABULARY),
  "human-body-lower-body": () => import("./units/human-body-lower-body").then((m) => m.VOCABULARY),
  "human-body-hands-and-feet": () =>
    import("./units/human-body-hands-and-feet").then((m) => m.VOCABULARY),
  beach: () => import("./units/beach").then((m) => m.VOCABULARY),
  restaurant: () => import("./units/restaurant").then((m) => m.VOCABULARY),
  "sports-center": () => import("./units/sports-center").then((m) => m.VOCABULARY),
  "fire-station": () => import("./units/fire-station").then((m) => m.VOCABULARY),
  hospital: () => import("./units/hospital").then((m) => m.VOCABULARY),
  "post-office": () => import("./units/post-office").then((m) => m.VOCABULARY),
  zoo: () => import("./units/zoo").then((m) => m.VOCABULARY),
  airport: () => import("./units/airport").then((m) => m.VOCABULARY),
  aquarium: () => import("./units/aquarium").then((m) => m.VOCABULARY),
  museum: () => import("./units/museum").then((m) => m.VOCABULARY),
  "train-station": () => import("./units/train-station").then((m) => m.VOCABULARY),
  cinema: () => import("./units/cinema").then((m) => m.VOCABULARY),
  "music-room": () => import("./units/music-room").then((m) => m.VOCABULARY),
  "science-lab": () => import("./units/science-lab").then((m) => m.VOCABULARY),
  "space-center": () => import("./units/space-center").then((m) => m.VOCABULARY),
};

const byUnit = new Map<string, VocabularyItem[]>();
const byId = new Map<string, VocabularyItem>();

/**
 * Per-unit id maps, because word ids are not unique across the course.
 *
 * 10,848 word entries share only 7,675 ids. 1,841 ids appear in more than one
 * unit and "mirror" appears in fifteen, so a single global map cannot answer
 * "the mirror" — only "some mirror", whichever unit wrote that key last. A
 * bathroom lesson would render the gym's mirror photograph, and nothing about
 * it looks wrong, because it is a mirror.
 *
 * Callers that know their unit resolve here first and get their own copy.
 * `byId` stays as the fallback for the places that genuinely span units, like
 * a review session drawn from the whole schedule.
 */
const unitIndex = new Map<string, Map<string, VocabularyItem>>();

function register(unitId: string, words: VocabularyItem[]): VocabularyItem[] {
  byUnit.set(unitId, words);
  unitIndex.set(unitId, new Map(words.map((word) => [word.id, word])));
  for (const word of words) byId.set(word.id, word);
  return words;
}

// The default unit is in the main bundle already: the placement quiz and the
// splash screen both read it before a learner has chosen anything, so
// deferring it would buy a round trip and save nothing.
register("bedroom", BEDROOM_VOCABULARY);

export function isUnitLoaded(unitId: string): boolean {
  return byUnit.has(unitId);
}

export async function loadUnitVocabulary(unitId: string): Promise<VocabularyItem[]> {
  const loaded = byUnit.get(unitId);
  if (loaded) return loaded;
  const loader = LOADERS[unitId];
  if (!loader) return [];
  return register(unitId, await loader());
}

/** A unit's words, or an empty array if it has not been loaded yet. */
export function loadedUnitVocabulary(unitId: string): VocabularyItem[] {
  return byUnit.get(unitId) ?? [];
}

/** One word by id, from any unit loaded so far. */
export function findLoadedWord(wordId: string): VocabularyItem | undefined {
  return byId.get(wordId);
}

/**
 * Looks up vocabulary items by id, preserving the order of `wordIds`.
 *
 * Pass `unitId` whenever the caller knows which unit the words belong to — a
 * lesson always does. Without it the lookup can only return whichever unit's
 * copy of a shared id reached the global map last, which is how a bathroom
 * drill ends up showing the gym's mirror.
 */
export function getWords(wordIds: string[], unitId?: string): VocabularyItem[] {
  const preferred = unitId ? unitIndex.get(unitId) : undefined;
  return wordIds
    .map((id) => preferred?.get(id) ?? byId.get(id))
    .filter((item): item is VocabularyItem => Boolean(item));
}

/**
 * Every word from every unit loaded so far.
 *
 * This is the honest replacement for the old `ALL_VOCABULARY`, which was the
 * whole catalogue held in memory at module scope. Callers use it for
 * best-effort widening — finding a plausible distractor when the current
 * lesson cannot supply one — so seeing only what is loaded is correct
 * behaviour rather than a limitation: a distractor from a unit the learner
 * has not opened is exactly the cross-unit confusion this app removed.
 */
export function loadedVocabulary(): VocabularyItem[] {
  return [...byId.values()];
}

/**
 * Every unit's words, loaded together.
 *
 * This exists for the checks that must see the whole catalogue at once —
 * artwork integrity, id uniqueness, curriculum coverage — and for tooling.
 * Nothing that ships to a browser may call it: doing so would pull all 182
 * unit chunks and undo the split entirely. `bundle_split.test.ts` enforces
 * that, so this stays a testing affordance rather than a loaded gun.
 */
export async function loadAllVocabulary(): Promise<VocabularyItem[]> {
  const all = await Promise.all(Object.keys(LOADERS).map((id) => loadUnitVocabulary(id)));
  return all.flat();
}

/** Every unit's words keyed by unit id, for the same callers as above. */
export async function loadAllUnitVocabulary(): Promise<Map<string, VocabularyItem[]>> {
  await loadAllVocabulary();
  return new Map(byUnit);
}
