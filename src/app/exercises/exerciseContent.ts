import { ALL_VOCABULARY, type VocabularyItem } from "../data/lessons";
import { shuffleArray } from "../../utils/shuffle";

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
    clozeBefore: "She fluffed the soft feather",
    clozeAfter: "before going to sleep.",
    full: "She fluffed the soft feather pillow before going to sleep.",
    words: ["She", "fluffed", "the", "soft", "feather", "pillow"],
  },
  blanket: {
    clozeBefore: "He pulled the warm wool",
    clozeAfter: "over his shoulders.",
    full: "He pulled the warm wool blanket over his shoulders.",
    words: ["He", "pulled", "the", "warm", "wool", "blanket"],
  },
  sheet: {
    clozeBefore: "She smoothed the crisp white",
    clozeAfter: "over the mattress.",
    full: "She smoothed the crisp white sheet over the mattress.",
    words: ["She", "smoothed", "the", "crisp", "white", "sheet"],
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
    clozeAfter: "kept her warm during the blizzard.",
    full: "The thick down duvet kept her warm during the blizzard.",
    words: ["The", "thick", "duvet", "kept", "her", "warm"],
  },
  "bed-sheet": {
    clozeBefore: "She washed the fitted",
    clozeAfter: "and put it back on the bed.",
    full: "She washed the fitted bed sheet and put it back on the bed.",
    words: ["She", "washed", "the", "fitted", "bed sheet"],
  },
  clock: {
    clozeBefore: "She checked the round wall",
    clozeAfter: "to see if it was time for bed.",
    full: "She checked the round wall clock to see if it was time for bed.",
    words: ["She", "checked", "the", "round", "wall", "clock"],
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
    clozeBefore: "She flipped the",
    clozeAfter: "before leaving the room.",
    full: "She flipped the light switch before leaving the room.",
    words: ["She", "flipped", "the", "light switch", "before", "leaving", "the", "room"],
  },
  "reading-light": {
    clozeBefore: "He clicked on his",
    clozeAfter: "to read a few chapters.",
    full: "He clicked on his reading light to read a few chapters.",
    words: ["He", "clicked", "on", "his", "reading light", "to", "read"],
  },
  "picture-frame": {
    clozeBefore: "There is a silver",
    clozeAfter: "sitting on her nightstand.",
    full: "There is a silver picture frame sitting on her nightstand.",
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
    clozeBefore: "She lit a scented",
    clozeAfter: "to relax before sleeping.",
    full: "She lit a scented candle to relax before sleeping.",
    words: ["She", "lit", "a", "scented", "candle", "to", "relax"],
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
    clozeBefore: "She marked the date on her wall",
    clozeAfter: "with a red pen.",
    full: "She marked the date on her wall calendar with a red pen.",
    words: ["She", "marked", "the", "date", "on", "her", "wall", "calendar"],
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
    clozeBefore: "She threw the crumpled paper into the small",
    clozeAfter: ".",
    full: "She threw the crumpled paper into the small wastebasket.",
    words: ["She", "threw", "the", "paper", "into", "the", "small", "wastebasket"],
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
    clozeBefore: "She slid her feet into soft",
    clozeAfter: "on the cold floor.",
    full: "She slid her feet into soft slippers on the cold floor.",
    words: ["She", "slid", "her", "feet", "into", "soft", "slippers"],
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
    clozeBefore: "She keeps a stack of interesting",
    clozeAfter: "on her nightstand to read.",
    full: "She keeps a stack of interesting books on her nightstand to read.",
    words: ["She", "keeps", "some", "interesting", "books", "on", "her", "nightstand"],
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
    clozeBefore: "She plugged her mobile",
    clozeAfter: "in to charge overnight.",
    full: "She plugged her mobile phone in to charge overnight.",
    words: ["She", "plugged", "her", "mobile", "phone", "in", "to", "charge"],
  },
  charger: {
    clozeBefore: "He needs a new phone",
    clozeAfter: "because the old cable broke.",
    full: "He needs a new phone charger because the old cable broke.",
    words: ["He", "needs", "a", "new", "phone", "charger", "for", "his", "phone"],
  },
  laptop: {
    clozeBefore: "She closed her",
    clozeAfter: "after finishing her homework at the desk.",
    full: "She closed her laptop after finishing her homework at the desk.",
    words: ["She", "closed", "her", "laptop", "after", "finishing", "her", "homework"],
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
    clozeBefore: "She used the",
    clozeAfter: "to turn off the television from her bed.",
    full: "She used the remote control to turn off the television from her bed.",
    words: ["She", "used", "the", "remote control", "to", "turn", "off", "the", "TV"],
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
    clozeBefore: "She checked her outfit in the full-length",
    clozeAfter: "before leaving.",
    full: "She checked her outfit in the full-length mirror before leaving.",
    words: ["She", "checked", "her", "outfit", "in", "the", "mirror"],
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
    clozeBefore: "She opened the",
    clozeAfter: "to let some fresh air into the room.",
    full: "She opened the window to let some fresh air into the room.",
    words: ["She", "opened", "the", "window", "for", "fresh air"],
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

export function getRichSentence(word: VocabularyItem): RichSentence {
  if (RICH_CONTEXT_SENTENCES[word.id]) {
    return RICH_CONTEXT_SENTENCES[word.id];
  }
  const article = articleFor(word.label);
  return {
    clozeBefore: `This is ${article}`,
    clozeAfter: `.`,
    full: `This is ${article} ${word.label.toLowerCase()}.`,
    words: ["This", "is", article, word.label.toLowerCase()],
  };
}

/**
 * Generates semantically and visually related distractors instead of purely random picks.
 */
export function getSemanticDistractors(word: VocabularyItem, count = 3): VocabularyItem[] {
  const confusionIds = CONFUSION_PAIRS[word.id] ?? [];
  const confusionWords = confusionIds
    .map((id) => ALL_VOCABULARY.find((item) => item.id === id))
    .filter((item): item is VocabularyItem => item !== undefined && !item.hasWoman);

  const sameTopic = ALL_VOCABULARY.filter(
    (item) =>
      item.id !== word.id &&
      item.topic === word.topic &&
      !confusionIds.includes(item.id) &&
      !item.hasWoman
  );

  // Shuffle within each tier so we get variety, but preserve tier priority:
  // confusion pairs always fill slots first, same-topic fills any remainder.
  const pool = [...shuffleArray(confusionWords), ...shuffleArray(sameTopic)];
  return pool.slice(0, count);
}

export function getDistractors(word: VocabularyItem, count = 3): VocabularyItem[] {
  return getSemanticDistractors(word, count);
}

export function articleFor(label: string): "a" | "an" {
  return /^[aeiou]/i.test(label) ? "an" : "a";
}
