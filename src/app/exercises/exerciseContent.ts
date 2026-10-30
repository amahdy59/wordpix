import { type VocabularyItem } from "../data/lessons";
import { loadedVocabulary } from "../data/vocabulary";
import { shuffleArray } from "../../utils/shuffle";
import { articleFor, classifyLabel, spokenLabel } from "../content/wordGrammar";
import { getAuthoredSentence } from "./content/authoredLessonContent";
import type { LessonUsageData } from "../data/usageTypes";
import { findLessonContextSentences } from "../data/lessonContext";
import { findSentenceTarget, sentenceCloze } from "./sentenceCloze";
import { isGenericLearningExample } from "../content/learningExampleQuality";
import { hasSentenceMediaCandidate } from "../content/sentenceMedia";

export const CONFUSION_PAIRS: Record<string, string[]> = {
  pillow: ["blanket", "nightstand", "bed", "dresser"],
  blanket: ["pillow", "bed", "nightstand"],
  bed: ["pillow", "blanket", "nightstand"],
  nightstand: ["dresser", "wardrobe", "desk"],
  dresser: ["wardrobe", "nightstand", "bookshelf"],
  wardrobe: ["dresser", "closet", "mirror"],
  desk: ["chair", "bookshelf", "lamp"],
  chair: ["desk", "bedroom-bench"],
  bookshelf: ["desk", "dresser"],
  mirror: ["wardrobe", "dresser"],
};

export interface RichSentence {
  clozeBefore: string;
  clozeAfter: string;
  full: string;
  words: string[];
}

export interface SentenceCompletion {
  tokens: string[];
  blankStart: number;
  answer: string[];
}

export const RICH_CONTEXT_SENTENCES: Record<string, RichSentence> = {
  bed: {
    clozeBefore: "I rest comfortably on my wooden",
    clozeAfter: "after a long day.",
    full: "I rest comfortably on my wooden bed after a long day.",
    words: ["I", "rest", "comfortably", "on", "my", "bed"],
  },
  nightstand: {
    clozeBefore: "The brass lamp sits on the small wooden",
    clozeAfter: "beside the bed.",
    full: "The brass lamp sits on the small wooden nightstand beside the bed.",
    words: ["The", "lamp", "sits", "on", "the", "nightstand"],
  },
  dresser: {
    clozeBefore: "She keeps her folded sweaters inside the top drawer of the",
    clozeAfter: ".",
    full: "She keeps her folded sweaters inside the top drawer of the dresser.",
    words: ["She", "keeps", "sweaters", "in", "the", "dresser"],
  },
  wardrobe: {
    clozeBefore: "He hung his winter coats neatly inside the tall wooden",
    clozeAfter: ".",
    full: "He hung his winter coats neatly inside the tall wooden wardrobe.",
    words: ["He", "hung", "coats", "inside", "the", "wardrobe"],
  },
  desk: {
    clozeBefore: "The student organized her notebook and pens on the study",
    clozeAfter: ".",
    full: "The student organized her notebook and pens on the study desk.",
    words: ["The", "student", "organized", "her", "study", "desk"],
  },
  pillow: {
    clozeBefore: "He fluffed the soft feather",
    clozeAfter: "before going to sleep.",
    full: "He fluffed the soft feather pillow before going to sleep.",
    words: ["He", "fluffed", "the", "soft", "feather", "pillow"],
  },
  blanket: {
    clozeBefore: "He pulled the warm wool",
    clozeAfter: "over his shoulders.",
    full: "He pulled the warm wool blanket over his shoulders.",
    words: ["He", "pulled", "the", "warm", "wool", "blanket"],
  },
  sheet: {
    clozeBefore: "Samir places a clean",
    clozeAfter: "directly over the mattress.",
    full: "Samir places a clean sheet directly over the mattress.",
    words: ["Samir", "places", "a", "clean", "sheet"],
  },
  mattress: {
    clozeBefore: "The thick memory foam",
    clozeAfter: "is very comfortable to sleep on.",
    full: "The thick memory foam mattress is very comfortable to sleep on.",
    words: ["The", "memory foam", "mattress", "is", "very", "comfortable"],
  },
  quilt: {
    clozeBefore: "Her grandmother made this beautiful patchwork",
    clozeAfter: "by hand.",
    full: "Her grandmother made this beautiful patchwork quilt by hand.",
    words: ["She", "made", "this", "beautiful", "patchwork", "quilt"],
  },
  chair: {
    clozeBefore: "He sat in the comfortable cushioned",
    clozeAfter: "to read a book.",
    full: "He sat in the comfortable cushioned chair to read a book.",
    words: ["He", "sat", "in", "the", "cushioned", "chair"],
  },
  "bedroom-bench": {
    clozeBefore: "They placed a padded",
    clozeAfter: "at the foot of the bed.",
    full: "They placed a padded bedroom bench at the foot of the bed.",
    words: ["They", "placed", "a", "padded", "bedroom bench", "there"],
  },
  bookshelf: {
    clozeBefore: "He arranged his novel collection neatly on the wooden",
    clozeAfter: ".",
    full: "He arranged his novel collection neatly on the wooden bookshelf.",
    words: ["He", "arranged", "books", "on", "the", "bookshelf"],
  },
  stool: {
    clozeBefore: "She perched on the small wooden",
    clozeAfter: "to reach the top shelf.",
    full: "She perched on the small wooden stool to reach the top shelf.",
    words: ["She", "sat", "on", "the", "wooden", "stool"],
  },
  pillowcase: {
    clozeBefore: "He slipped a clean cotton",
    clozeAfter: "over the pillow.",
    full: "He slipped a clean cotton pillowcase over the pillow.",
    words: ["He", "put", "a", "clean", "pillowcase", "on"],
  },
  duvet: {
    clozeBefore: "The thick down",
    clozeAfter: "kept him warm during the blizzard.",
    full: "The thick down duvet kept him warm during the blizzard.",
    words: ["The", "thick", "duvet", "kept", "him", "warm"],
  },
  "bed-sheet": {
    clozeBefore: "He washed the fitted",
    clozeAfter: "and put it back on the bed.",
    full: "He washed the fitted bed sheet and put it back on the bed.",
    words: ["He", "washed", "the", "fitted", "bed sheet"],
  },
  clock: {
    clozeBefore: "He checked the round wall",
    clozeAfter: "to see if it was time for bed.",
    full: "He checked the round wall clock to see if it was time for bed.",
    words: ["He", "checked", "the", "round", "wall", "clock"],
  },
  "toy-box": {
    clozeBefore: "The child tossed all the colorful blocks back into the large wooden",
    clozeAfter: ".",
    full: "The child tossed all the colorful blocks back into the large wooden toy box.",
    words: ["The", "child", "filled", "the", "wooden", "toy box"],
  },
  door: {
    clozeBefore: "She closed the bedroom",
    clozeAfter: "quietly to keep the noise out.",
    full: "She closed the bedroom door quietly to keep the noise out.",
    words: ["She", "closed", "the", "bedroom", "door", "quietly"],
  },
  blinds: {
    clozeBefore: "He lowered the",
    clozeAfter: "to block out the morning sun.",
    full: "He lowered the blinds to block out the morning sun.",
    words: ["He", "lowered", "the", "blinds", "to", "block", "the", "sun"],
  },
  outlet: {
    clozeBefore: "She plugged her charger into the",
    clozeAfter: "near the bed.",
    full: "She plugged her charger into the outlet near the bed.",
    words: ["She", "plugged", "her", "charger", "into", "the", "outlet"],
  },
  carpet: {
    clozeBefore: "The thick",
    clozeAfter: "kept his feet warm in winter.",
    full: "The thick carpet kept his feet warm in winter.",
    words: ["The", "thick", "carpet", "kept", "his", "feet", "warm"],
  },
  "ceiling-light": {
    clozeBefore: "He turned on the",
    clozeAfter: "to brighten up the whole room.",
    full: "He turned on the ceiling light to brighten up the whole room.",
    words: ["He", "turned", "on", "the", "ceiling light", "to", "brighten", "it"],
  },
  "light-switch": {
    clozeBefore: "He flipped the",
    clozeAfter: "before leaving the room.",
    full: "He flipped the light switch before leaving the room.",
    words: ["He", "flipped", "the", "light switch", "before", "leaving", "the", "room"],
  },
  "reading-light": {
    clozeBefore: "He clicked on his",
    clozeAfter: "to read a few chapters.",
    full: "He clicked on his reading light to read a few chapters.",
    words: ["He", "clicked", "on", "his", "reading light", "to", "read"],
  },
  "picture-frame": {
    clozeBefore: "There is a silver",
    clozeAfter: "sitting on his nightstand.",
    full: "There is a silver picture frame sitting on his nightstand.",
    words: ["There", "is", "a", "silver", "picture frame", "on", "the", "nightstand"],
  },
  plant: {
    clozeBefore: "She watered the green",
    clozeAfter: "growing by the window.",
    full: "She watered the green plant growing by the window.",
    words: ["She", "watered", "the", "green", "plant", "by", "the", "window"],
  },
  vase: {
    clozeBefore: "He arranged the fresh flowers in a glass",
    clozeAfter: "on the dresser.",
    full: "He arranged the fresh flowers in a glass vase on the dresser.",
    words: ["He", "arranged", "the", "flowers", "in", "a", "glass", "vase"],
  },
  candle: {
    clozeBefore: "He lit a scented",
    clozeAfter: "to relax before sleeping.",
    full: "He lit a scented candle to relax before sleeping.",
    words: ["He", "lit", "a", "scented", "candle", "to", "relax"],
  },
  poster: {
    clozeBefore: "He hung a large movie",
    clozeAfter: "on his bedroom wall.",
    full: "He hung a large movie poster on his bedroom wall.",
    words: ["He", "hung", "a", "movie", "poster", "on", "his", "wall"],
  },
  "alarm-clock": {
    clozeBefore: "The loud",
    clozeAfter: "woke him up at six sharp.",
    full: "The loud alarm clock woke him up at six sharp.",
    words: ["The", "loud", "alarm clock", "woke", "him", "up", "early"],
  },
  calendar: {
    clozeBefore: "He marked the date on his wall",
    clozeAfter: "with a red pen.",
    full: "He marked the date on his wall calendar with a red pen.",
    words: ["He", "marked", "the", "date", "on", "his", "wall", "calendar"],
  },
  hanger: {
    clozeBefore: "He placed his clean shirt on a wooden",
    clozeAfter: "in the closet.",
    full: "He placed his clean shirt on a wooden hanger in the closet.",
    words: ["He", "placed", "his", "shirt", "on", "a", "wooden", "hanger"],
  },
  "chest-of-drawers": {
    clozeBefore: "She folded her sweaters and put them in the",
    clozeAfter: ".",
    full: "She folded her sweaters and put them in the chest of drawers.",
    words: ["She", "put", "her", "sweaters", "in", "the", "chest of drawers"],
  },
  "laundry-basket": {
    clozeBefore: "He tossed his dirty clothes into the tall",
    clozeAfter: "in the corner.",
    full: "He tossed his dirty clothes into the tall laundry basket in the corner.",
    words: ["He", "tossed", "his", "clothes", "into", "the", "laundry basket"],
  },
  wastebasket: {
    clozeBefore: "Tariq puts the used tissue in the",
    clozeAfter: "below the calendar.",
    full: "Tariq puts the used tissue in the wastebasket below the calendar.",
    words: ["Tariq", "puts", "the", "tissue", "in", "the", "wastebasket"],
  },
  "jewelry-box": {
    clozeBefore: "She carefully placed her rings into the velvet",
    clozeAfter: ".",
    full: "She carefully placed her rings into the velvet jewelry box.",
    words: ["She", "placed", "her", "rings", "into", "the", "velvet", "jewelry box"],
  },
  pajamas: {
    clozeBefore: "He put on his warm flannel",
    clozeAfter: "before getting into bed.",
    full: "He put on his warm flannel pajamas before getting into bed.",
    words: ["He", "put", "on", "his", "flannel", "pajamas", "before", "bed"],
  },
  slippers: {
    clozeBefore: "He slid his feet into soft",
    clozeAfter: "on the cold floor.",
    full: "He slid his feet into soft slippers on the cold floor.",
    words: ["He", "slid", "his", "feet", "into", "soft", "slippers"],
  },
  robe: {
    clozeBefore: "He wrapped a thick bath",
    clozeAfter: "around himself after the shower.",
    full: "He wrapped a thick bath robe around himself after the shower.",
    words: ["He", "wrapped", "a", "thick", "bath", "robe", "around", "himself"],
  },
  "teddy-bear": {
    clozeBefore: "The child hugged their fluffy",
    clozeAfter: "tightly all night.",
    full: "The child hugged their fluffy teddy bear tightly all night.",
    words: ["The", "child", "hugged", "their", "fluffy", "teddy bear", "tightly"],
  },
  "bed-frame": {
    clozeBefore: "They bought a sturdy wooden",
    clozeAfter: "to support the new mattress.",
    full: "They bought a sturdy wooden bed frame to support the new mattress.",
    words: ["They", "bought", "a", "wooden", "bed frame", "for", "the", "mattress"],
  },
  books: {
    clozeBefore: "He keeps a stack of interesting",
    clozeAfter: "on his nightstand to read.",
    full: "He keeps a stack of interesting books on his nightstand to read.",
    words: ["He", "keeps", "some", "interesting", "books", "on", "his", "nightstand"],
  },
  "photo-album": {
    clozeBefore: "They looked through an old",
    clozeAfter: "filled with childhood memories.",
    full: "They looked through an old photo album filled with childhood memories.",
    words: ["They", "looked", "through", "an", "old", "photo album"],
  },
  backpack: {
    clozeBefore: "He packed his school",
    clozeAfter: "and left it by the bedroom door.",
    full: "He packed his school backpack and left it by the bedroom door.",
    words: ["He", "packed", "his", "school", "backpack", "and", "left", "it"],
  },
  headboard: {
    clozeBefore: "She leaned against the padded",
    clozeAfter: "to read her book.",
    full: "She leaned against the padded headboard to read her book.",
    words: ["She", "leaned", "against", "the", "padded", "headboard", "to", "read"],
  },
  glasses: {
    clozeBefore: "He took off his reading",
    clozeAfter: "and placed them on the desk.",
    full: "He took off his reading glasses and placed them on the desk.",
    words: ["He", "took", "off", "his", "reading", "glasses", "and", "rested"],
  },
  phone: {
    clozeBefore: "He plugged his mobile",
    clozeAfter: "in to charge overnight.",
    full: "He plugged his mobile phone in to charge overnight.",
    words: ["He", "plugged", "his", "mobile", "phone", "in", "to", "charge"],
  },
  charger: {
    clozeBefore: "He needs a new phone",
    clozeAfter: "because the old cable broke.",
    full: "He needs a new phone charger because the old cable broke.",
    words: ["He", "needs", "a", "new", "phone", "charger", "for", "his", "phone"],
  },
  laptop: {
    clozeBefore: "He closed his",
    clozeAfter: "after finishing his homework at the desk.",
    full: "He closed his laptop after finishing his homework at the desk.",
    words: ["He", "closed", "his", "laptop", "after", "finishing", "his", "homework"],
  },
  headphones: {
    clozeBefore: "He put on his noise-canceling",
    clozeAfter: "to listen to music.",
    full: "He put on his noise-canceling headphones to listen to music.",
    words: ["He", "put", "on", "his", "noise-canceling", "headphones"],
  },
  tablet: {
    clozeBefore: "She watched a movie on her",
    clozeAfter: "while lying in bed.",
    full: "She watched a movie on her tablet while lying in bed.",
    words: ["She", "watched", "a", "movie", "on", "her", "tablet"],
  },
  speaker: {
    clozeBefore: "He played loud music from the wireless",
    clozeAfter: "on the shelf.",
    full: "He played loud music from the wireless speaker on the shelf.",
    words: ["He", "played", "loud", "music", "from", "the", "wireless", "speaker"],
  },
  "remote-control": {
    clozeBefore: "He used the",
    clozeAfter: "to turn off the television from his bed.",
    full: "He used the remote control to turn off the television from his bed.",
    words: ["He", "used", "the", "remote control", "to", "turn", "off", "the", "TV"],
  },
  "tissue-box": {
    clozeBefore: "He grabbed a tissue from the",
    clozeAfter: "when he sneezed.",
    full: "He grabbed a tissue from the tissue box when he sneezed.",
    words: ["He", "grabbed", "a", "tissue", "from", "the", "tissue box"],
  },
  lamp: {
    clozeBefore: "He turned on the bedside",
    clozeAfter: "to read in the dark.",
    full: "He turned on the bedside lamp to read in the dark.",
    words: ["He", "turned", "on", "the", "bedside", "lamp"],
  },
  mirror: {
    clozeBefore: "He checked his outfit in the full-length",
    clozeAfter: "before leaving.",
    full: "He checked his outfit in the full-length mirror before leaving.",
    words: ["He", "checked", "his", "outfit", "in", "the", "mirror"],
  },
  comforter: {
    clozeBefore: "He pulled the thick",
    clozeAfter: "up to his chin to stay warm.",
    full: "He pulled the thick comforter up to his chin to stay warm.",
    words: ["He", "pulled", "the", "thick", "comforter", "up"],
  },
  cushion: {
    clozeBefore: "She placed a decorative",
    clozeAfter: "on the bedroom chair.",
    full: "She placed a decorative cushion on the bedroom chair.",
    words: ["She", "placed", "a", "decorative", "cushion"],
  },
  bedspread: {
    clozeBefore: "He smoothed the patterned",
    clozeAfter: "over the made bed.",
    full: "He smoothed the patterned bedspread over the made bed.",
    words: ["He", "smoothed", "the", "patterned", "bedspread"],
  },
  window: {
    clozeBefore: "He opened the",
    clozeAfter: "to let some fresh air into the room.",
    full: "He opened the window to let some fresh air into the room.",
    words: ["He", "opened", "the", "window", "for", "fresh air"],
  },
  curtain: {
    clozeBefore: "He pulled the heavy",
    clozeAfter: "shut to block the streetlights.",
    full: "He pulled the heavy curtain shut to block the streetlights.",
    words: ["He", "pulled", "the", "heavy", "curtain", "shut"],
  },
  rug: {
    clozeBefore: "She stepped out of bed onto the soft, fuzzy",
    clozeAfter: ".",
    full: "She stepped out of bed onto the soft, fuzzy rug.",
    words: ["She", "stepped", "onto", "the", "soft", "rug"],
  },
  shelf: {
    clozeBefore: "He put his trophies on the wooden wall",
    clozeAfter: "above his desk.",
    full: "He put his trophies on the wooden wall shelf above his desk.",
    words: ["He", "put", "trophies", "on", "the", "wall", "shelf"],
  },
};

/**
 * Frames for the fallback sentence, one per grammatical class.
 *
 * `RICH_CONTEXT_SENTENCES` only covers the bedroom unit, so almost every word
 * in the corpus reaches the drills through this fallback — which makes its
 * grammar the app’s most-read sentence by a wide margin. It used to be
 * `This is ${article} ${label}` unconditionally, and so taught "This is a
 * pliers", "This is a water" and "This is a run".
 *
 * The `term` frame drops the quotation marks that `identifySentence` uses.
 * Sentence Builder turns `words` into draggable tiles, and a tile reading
 * `“run”` would ask the learner to place punctuation.
 */
function fallbackFrame(word: VocabularyItem): { lead: string[]; spoken: string } {
  const kind = classifyLabel(word.label, word.topic);
  const spoken = spokenLabel(word.label, kind);
  switch (kind) {
    case "count":
      return { lead: ["This", "is", articleFor(word.label)], spoken };
    case "pair":
      return { lead: ["This", "is", "a", "pair", "of"], spoken };
    case "plural":
      return { lead: ["These", "are"], spoken };
    case "term":
      return { lead: ["The", "word", "is"], spoken };
    default:
      return { lead: ["This", "is"], spoken };
  }
}

function sentenceToTiles(sentence: string): string[] {
  return sentence.trim().split(/\s+/u).filter(Boolean);
}

function normaliseSentenceToken(token: string): string {
  return token.toLocaleLowerCase("en-US").replace(/[^a-z0-9'-]/gu, "");
}

function sentenceChoiceToken(token: string): string {
  return token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}'-]+$/gu, "");
}

/**
 * Keeps sentence construction focused: the learner completes one useful
 * two- or three-word chunk instead of rebuilding an entire sentence token by
 * token. The selected chunk always includes as much of the target label as a
 * three-word task permits.
 */
export function buildSentenceCompletion(sentence: string, targetLabel: string): SentenceCompletion {
  const tokens = sentenceToTiles(sentence);
  if (tokens.length === 0) return { tokens: [], blankStart: 0, answer: [] };

  const normalisedTokens = tokens.map(normaliseSentenceToken);
  const targetTokens = sentenceToTiles(targetLabel).map(normaliseSentenceToken).filter(Boolean);
  const completeTargetStart = normalisedTokens.findIndex((_, candidateStart) =>
    targetTokens.every(
      (targetToken, offset) => normalisedTokens[candidateStart + offset] === targetToken
    )
  );
  const naturalTarget = findSentenceTarget(sentence, targetLabel);
  const targetStart = naturalTarget
    ? sentenceToTiles(sentence.slice(0, naturalTarget.start)).length
    : completeTargetStart >= 0
      ? completeTargetStart
      : Math.max(
          0,
          normalisedTokens.findIndex((token) => token === targetTokens[0])
        );
  const targetSpan = Math.max(
    1,
    Math.min(3, naturalTarget ? sentenceToTiles(naturalTarget.text).length : targetTokens.length)
  );
  const blankCount = Math.min(tokens.length <= 3 ? 2 : 3, tokens.length);
  const earliestStartContainingTarget = Math.max(0, targetStart + targetSpan - blankCount);
  const latestStartContainingTarget = Math.min(targetStart, tokens.length - blankCount);
  const preferredStart = targetStart - Math.floor((blankCount - targetSpan) / 2);
  const blankStart = Math.min(
    latestStartContainingTarget,
    Math.max(earliestStartContainingTarget, preferredStart)
  );

  return {
    tokens,
    blankStart,
    answer: tokens.slice(blankStart, blankStart + blankCount).map(sentenceChoiceToken),
  };
}

function isUsefulExample(value: string | undefined): value is string {
  if (!value?.trim()) return false;
  return !isGenericLearningExample(value);
}

/** Group counting drills are reading contexts, not individual usage examples. */
function isStandaloneExample(sentence: string): boolean {
  if (/_{2,}/u.test(sentence)) return false;
  const numbers =
    sentence.match(
      /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/giu
    ) ?? [];
  return !(numbers.length >= 3 && /[,;:]/u.test(sentence));
}

export function getRichSentence(
  word: VocabularyItem,
  usage?: LessonUsageData | null,
  contextIndex = 0
): RichSentence {
  const authoredSentence = getAuthoredSentence(word.id);
  const curatedSentence = RICH_CONTEXT_SENTENCES[word.id];
  const lessonContextSentences = findLessonContextSentences(word, usage);
  const filterCandidate = (
    sentence: string | undefined,
    enforceOwnership = true
  ): sentence is string => {
    if (!isUsefulExample(sentence) || !isStandaloneExample(sentence)) return false;
    // Construction and gap fill must actually assess the selected target.
    // Inflected examples remain available as reading, not an unrelated blank.
    if (sentenceCloze(sentence, word.label) === sentence) return false;
    if (!enforceOwnership) return true;
    const mentionedTargets =
      usage?.targetWordsEnglish.filter((label) => sentenceCloze(sentence, label) !== sentence) ??
      [];
    if (mentionedTargets.length < 2) return true;
    // A useful scene may mention several words, but is assigned to one target
    // rather than repeated for every word. Prefer the earliest full phrase.
    const owner = mentionedTargets.sort((a, b) => {
      const first = sentence.toLowerCase().indexOf(a.toLowerCase());
      const second = sentence.toLowerCase().indexOf(b.toLowerCase());
      return first - second || b.length - a.length;
    })[0];
    return (
      owner.toLowerCase() === word.label.toLowerCase() &&
      !(mentionedTargets.length >= 3 && /[,;:]/u.test(sentence))
    );
  };

  const primaryCandidates = [
    authoredSentence?.full,
    curatedSentence?.full,
    ...lessonContextSentences,
    isUsefulExample(word.exampleUsage) ? word.exampleUsage.trim() : undefined,
  ].filter((s): s is string => filterCandidate(s, true));

  const candidates =
    primaryCandidates.length > 0
      ? primaryCandidates
      : [
          authoredSentence?.full,
          curatedSentence?.full,
          ...lessonContextSentences,
          isUsefulExample(word.exampleUsage) ? word.exampleUsage.trim() : undefined,
        ].filter((s): s is string => filterCandidate(s, false));
  const { lead, spoken } = fallbackFrame(word);
  const fallback = `${lead.join(" ")} ${spoken}.`;
  // Keep valid illustrated examples available when a richer dictionary example
  // is added. An image is eligible only for the exact wording it supports.
  const illustratedCandidates = [
    authoredSentence?.full,
    curatedSentence?.full,
    ...lessonContextSentences,
    word.exampleUsage,
    fallback,
  ].filter(
    (sentence): sentence is string =>
      filterCandidate(sentence, false) && hasSentenceMediaCandidate(word.id, sentence, usage)
  );
  const uniqueCandidates = [
    ...new Set(
      illustratedCandidates.length > 0 && (usage || contextIndex === 0)
        ? illustratedCandidates
        : candidates
    ),
  ];
  const selected =
    uniqueCandidates[Math.min(Math.max(0, contextIndex), uniqueCandidates.length - 1)];
  if (selected) {
    if (selected === authoredSentence?.full) {
      return {
        clozeBefore: "",
        clozeAfter: "",
        full: selected,
        words: authoredSentence.words,
      };
    }
    if (selected === curatedSentence?.full) return curatedSentence;
    return {
      clozeBefore: "",
      clozeAfter: "",
      full: selected,
      words: sentenceToTiles(selected),
    };
  }
  const clozeBefore = lead.join(" ");
  return {
    clozeBefore,
    clozeAfter: ".",
    full: `${clozeBefore} ${spoken}.`,
    words: [...lead, spoken],
  };
}

/**
 * Picks wrong answers that are worth thinking about, from words the learner
 * has actually been taught.
 *
 * `lessonWords` is the current lesson's word list and is the pool that matters.
 * Without it this fell back to the whole unit — and a unit is much bigger than
 * a lesson (bathroom is 67 words split into lessons of 15), so a learner
 * halfway through "The Bathroom 1" was shown options from words three lessons
 * away. Those are not distractors, they are unknowns: you cannot rule out a
 * picture whose word you have never seen, so the question stops testing
 * recognition and starts testing luck.
 *
 * Tier order within the lesson: confusion pairs first, because a near-miss is
 * what makes the question teach something, then the rest of the lesson.
 *
 * The unit-wide tier survives only as a last resort, for a lesson too small to
 * fill the options by itself — some units end in a short chunk (bathroom's
 * last group has 7 words, but a 3-word tail is possible). Showing three
 * choices instead of four would leak the answer by arithmetic, so a slightly
 * unfamiliar option beats a missing one.
 */
export function getSemanticDistractors(
  word: VocabularyItem,
  count = 3,
  lessonWords?: readonly VocabularyItem[]
): VocabularyItem[] {
  const confusionIds = CONFUSION_PAIRS[word.id] ?? [];
  const eligible = (item: VocabularyItem) => item.id !== word.id && !item.hasWoman;

  const withinLesson = (lessonWords ?? []).filter(eligible);
  const lessonConfusion = withinLesson.filter((item) => confusionIds.includes(item.id));
  const lessonRest = withinLesson.filter((item) => !confusionIds.includes(item.id));

  // Shuffle within each tier so we get variety, but preserve tier priority.
  const pool = [...shuffleArray(lessonConfusion), ...shuffleArray(lessonRest)];
  if (pool.length >= count) return pool.slice(0, count);

  const chosen = new Set(pool.map((item) => item.id));
  const sameTopic = loadedVocabulary().filter(
    (item) => eligible(item) && item.topic === word.topic && !chosen.has(item.id)
  );
  const topicConfusion = sameTopic.filter((item) => confusionIds.includes(item.id));
  const topicRest = sameTopic.filter((item) => !confusionIds.includes(item.id));

  return [...pool, ...shuffleArray(topicConfusion), ...shuffleArray(topicRest)].slice(0, count);
}

export function getDistractors(
  word: VocabularyItem,
  count = 3,
  lessonWords?: readonly VocabularyItem[]
): VocabularyItem[] {
  return getSemanticDistractors(word, count, lessonWords);
}

/**
 * Re-exported so existing callers keep working. The implementation moved to
 * `content/wordGrammar`, where it can consider sound rather than spelling —
 * "an hour", "a uniform", "an MRI scan".
 */
export { articleFor };
