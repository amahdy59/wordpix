import figmaReview from "../../generated/reviewedFigmaQuestionMedia.json";

export interface PilotSentenceMedia {
  imagePath: string;
  /** Describes the visual clue without spelling out the assessed word. */
  imageAlt: string;
  imageFallbacks?: Array<{ imagePath: string; imageAlt: string }>;
}

const media = (folder: "numbers-counting" | "colors", file: string, imageAlt: string) => ({
  imagePath: `./learning-scenes/${folder}/${file}.avif`,
  imageAlt,
});

/**
 * Original local pilot media keyed by stable curriculum word ID.
 *
 * Images that contain answer-revealing text, incorrect counts, generic swatches,
 * or an inaccurate subject stay out of this registry until a replacement passes
 * visual review. Selection below applies the independent content review.
 */
export const PILOT_SENTENCE_MEDIA: Readonly<Record<string, PilotSentenceMedia>> = {
  one: media(
    "numbers-counting",
    "numbers-counting-1-one-ticket",
    "A blank admission ticket resting on a wooden counter."
  ),
  two: media(
    "numbers-counting",
    "numbers-counting-1-two-bags",
    "Travel bags standing together on a station floor."
  ),
  three: media(
    "numbers-counting",
    "numbers-counting-1-three-apples",
    "Apples grouped on a kitchen table."
  ),
  four: media(
    "numbers-counting",
    "numbers-counting-1-four-chairs",
    "Matching chairs arranged around a small table."
  ),
  five: media(
    "numbers-counting",
    "numbers-counting-1-five-books",
    "Books stacked neatly with blank covers."
  ),
  six: media(
    "numbers-counting",
    "numbers-counting-1-six-cups",
    "Plain drinking cups arranged in rows."
  ),
  seven: media(
    "numbers-counting",
    "numbers-counting-1-seven-days",
    "A weekly planner made from a complete row of blank day cards."
  ),
  eight: media(
    "numbers-counting",
    "numbers-counting-1-eight-students",
    "Adult students seated together in a bright classroom."
  ),
  nine: media(
    "numbers-counting",
    "numbers-counting-1-nine-boxes",
    "Cardboard boxes arranged in an orderly group inside a shop."
  ),
  ten: media(
    "numbers-counting",
    "numbers-counting-1-ten-fingers",
    "Two open adult hands with every finger extended."
  ),
  eleven: media(
    "numbers-counting",
    "numbers-counting-1-eleven-players",
    "A complete football team represented by wooden figures beside a ball."
  ),
  twelve: media(
    "numbers-counting",
    "numbers-counting-1-twelve-months",
    "Blank calendar cards arranged as a complete year."
  ),
  thirteen: media(
    "numbers-counting",
    "numbers-counting-1-thirteen-people",
    "Adults waiting in an orderly queue."
  ),
  fourteen: media(
    "numbers-counting",
    "numbers-counting-1-fourteen-days",
    "Blank travel-day cards arranged in two equal rows."
  ),
  fifteen: media(
    "numbers-counting",
    "numbers-counting-1-fifteen-minutes",
    "An analog clock with one quarter of its face highlighted."
  ),
  sixteen: media(
    "numbers-counting",
    "numbers-counting-2-sixteen-desks",
    "Classroom desks arranged in equal rows."
  ),
  seventeen: media(
    "numbers-counting",
    "numbers-counting-2-seventeen-birds",
    "Birds perched across several bare branches."
  ),
  eighteen: media(
    "numbers-counting",
    "numbers-counting-2-eighteen-plates",
    "Plain plates arranged in equal rows on a long table."
  ),
  nineteen: media(
    "numbers-counting",
    "numbers-counting-2-nineteen-people",
    "Adults gathered together in a bright community room."
  ),
  twenty: media(
    "numbers-counting",
    "numbers-counting-2-twenty-seats",
    "Paired passenger seats inside a small bus."
  ),
  thirty: media(
    "numbers-counting",
    "numbers-counting-2-thirty-students",
    "Student figures seated at desks in an orderly classroom."
  ),
  forty: media(
    "numbers-counting",
    "numbers-counting-2-forty-pages",
    "An open slim book showing a block of blank pages."
  ),
  fifty: media(
    "numbers-counting",
    "numbers-counting-2-fifty-pounds",
    "Equal stacks of pound coins arranged on a wooden table."
  ),
  sixty: media(
    "numbers-counting",
    "numbers-counting-2-sixty-seconds",
    "An analog stopwatch completing one full revolution."
  ),
  seventy: media(
    "numbers-counting",
    "numbers-counting-2-seventy-grandfather",
    "An elderly grandfather seated at a family table."
  ),
  eighty: media(
    "numbers-counting",
    "numbers-counting-2-eighty-cards",
    "An orderly stack of blank cards inside a box."
  ),
  ninety: media(
    "numbers-counting",
    "numbers-counting-2-ninety-pounds",
    "Grouped stacks of pound coins arranged for a travel payment."
  ),
  hundred: media(
    "numbers-counting",
    "numbers-counting-2-one-hundred-people",
    "Wooden people arranged in an even square formation."
  ),
  thousand: media(
    "numbers-counting",
    "numbers-counting-2-one-thousand-homes",
    "Grouped trays containing a large planned collection of miniature homes."
  ),
  million: media(
    "numbers-counting",
    "numbers-counting-2-one-million-people",
    "An immense crowd of wooden people filling a model city."
  ),
  first: media(
    "numbers-counting",
    "numbers-counting-3-first-in-line",
    "A queue of adults with the front person approaching a counter."
  ),
  second: media(
    "numbers-counting",
    "numbers-counting-3-second-in-line",
    "A woman standing directly behind the front person in a queue."
  ),
  third: media(
    "numbers-counting",
    "numbers-counting-3-third-in-line",
    "A man standing behind two people in a queue."
  ),
  fourth: media(
    "numbers-counting",
    "numbers-counting-3-fourth-page",
    "A hand selecting one sheet from a small ordered stack."
  ),
  fifth: media(
    "numbers-counting",
    "numbers-counting-3-fifth-day",
    "A weekly row of blank cards with one card raised."
  ),
  sixth: media(
    "numbers-counting",
    "numbers-counting-3-sixth-place",
    "A woman finishing a race behind several runners."
  ),
  seventh: media(
    "numbers-counting",
    "numbers-counting-3-seventh-floor",
    "A man visible at the top window of a multi-storey building."
  ),
  eighth: media(
    "numbers-counting",
    "numbers-counting-3-eighth-lesson",
    "An adult learner opening the final card in a sequence."
  ),
  ninth: media(
    "numbers-counting",
    "numbers-counting-3-ninth-card",
    "A woman choosing the final blank card from a row."
  ),
  tenth: media(
    "numbers-counting",
    "numbers-counting-3-tenth-lesson",
    "The final blank lesson card open on a desk."
  ),
  addition: media(
    "numbers-counting",
    "numbers-counting-3-addition-groups",
    "Two groups of counters being pushed together."
  ),
  subtraction: media(
    "numbers-counting",
    "numbers-counting-3-subtraction-away",
    "A hand removing a counter from a group."
  ),
  multiplication: media(
    "numbers-counting",
    "numbers-counting-3-multiplication-groups",
    "Identical counters arranged in equal rows."
  ),
  division: media(
    "numbers-counting",
    "numbers-counting-3-division-groups",
    "Counters shared evenly among matching bowls."
  ),
  equals: media(
    "numbers-counting",
    "numbers-counting-3-two-plus-three-equals-five",
    "Two groups of apples combined into one complete group."
  ),
  plus: media(
    "numbers-counting",
    "numbers-counting-4-plus-two-and-three",
    "Two groups of wooden blocks moving together."
  ),
  minus: media(
    "numbers-counting",
    "numbers-counting-4-minus-five-and-two",
    "A hand taking oranges away from a small group."
  ),
  times: media(
    "numbers-counting",
    "numbers-counting-4-times-three-by-four",
    "Identical counters arranged in equal rows and columns."
  ),
  "divided-by": media(
    "numbers-counting",
    "numbers-counting-4-divided-twelve-by-three",
    "Counters divided evenly among matching bowls."
  ),
  percentage: media(
    "numbers-counting",
    "numbers-counting-4-fifty-percent",
    "A circle divided into two equal parts with one part filled."
  ),
  red: media("colors", "colors-1-red-apple", "An apple on a neutral tabletop."),
  blue: media("colors", "colors-1-blue-sky", "A daytime sky above a low horizon."),
  yellow: media("colors", "colors-1-yellow-flowers", "Flowers arranged in a plain vase."),
  green: media("colors", "colors-1-green-grass", "Fresh grass filling an outdoor scene."),
  orange: media(
    "colors",
    "colors-1-orange-hat",
    "An adult woman wearing a knitted hat and neutral clothing."
  ),
  purple: media("colors", "colors-1-purple-pen", "An adult man holding a pen over blank paper."),
  pink: media("colors", "colors-1-pink-cup", "A ceramic cup on a neutral table."),
  brown: media("colors", "colors-1-brown-dog", "An adult dog sitting on a neutral floor."),
  white: media(
    "colors",
    "colors-1-white-wall",
    "A room dominated by a plain wall in neutral daylight."
  ),
  cyan: media(
    "colors",
    "colors-1-cyan-printer-ink",
    "An open color printer showing a blue-green ink cartridge."
  ),
  magenta: media(
    "colors",
    "colors-1-bright-magenta",
    "A vivid reddish-purple fabric ribbon on a gray surface."
  ),
  lime: media(
    "colors",
    "colors-1-lime-shirt",
    "An adult woman holding a vivid yellow-green shirt."
  ),
  teal: media("colors", "colors-1-teal-door", "A painted blue-green door in a neutral room."),
  indigo: media(
    "colors",
    "colors-1-indigo-rainbow",
    "Three ribbons progress from blue through deep blue-violet to purple."
  ),
  violet: media("colors", "colors-2-violet-flower", "A purple-blue flower growing in soil."),
  coral: media("colors", "colors-2-coral-dress", "A pink-orange dress on a plain mannequin."),
  salmon: media(
    "colors",
    "colors-2-salmon-paint",
    "A wall being painted a soft pink-orange with a roller."
  ),
  turquoise: media(
    "colors",
    "colors-2-turquoise-water",
    "Clear tropical water with a vivid blue-green appearance."
  ),
  lavender: media(
    "colors",
    "colors-2-lavender-soap",
    "A pale purple bar of soap beside flower sprigs."
  ),
  light: media(
    "colors",
    "colors-2-light-walls",
    "A bright room with near-white walls and darker furniture."
  ),
  dark: media("colors", "colors-2-dark-outside", "A nighttime street viewed through a window."),
  bright: media(
    "colors",
    "colors-2-bright-lamp",
    "A switched-on lamp casting strong light in a dim room."
  ),
  dull: media("colors", "colors-2-dull-paint", "An old wall with faded low-saturation paint."),
  vivid: media("colors", "colors-2-vivid-sunset", "An intensely colored sunset over a landscape."),
  pale: media("colors", "colors-2-pale-scarf", "An adult woman wearing a softly colored scarf."),
  deep: media("colors", "colors-2-deep-blue-lake", "A large lake with rich blue water."),
  warm: media(
    "colors",
    "colors-2-warm-yellow-feeling",
    "A cozy living room illuminated by golden lamplight."
  ),
  cool: media("colors", "colors-2-cool-blue", "A calm modern room dominated by blue tones."),
  neutral: media(
    "colors",
    "colors-2-neutral-gray",
    "A gray ceramic vase centered between pale and muted blue vessels."
  ),
  mix: media("colors", "colors-3-mix-blue-red", "Blue and red paint being stirred in one bowl."),
  blend: media("colors", "colors-3-blend-edges", "A soft boundary between two painted colors."),
  shade: media(
    "colors",
    "colors-3-darker-shade",
    "Dark pigment being poured into blue paint to make it darker."
  ),
  tint: media(
    "colors",
    "colors-3-lighter-tint",
    "White paint being poured into blue paint to make it lighter."
  ),
  hue: media(
    "colors",
    "colors-3-unique-flower-hues",
    "Flowers of the same type shown in several distinct colors."
  ),
  saturation: media(
    "colors",
    "colors-3-high-saturation",
    "Intensely colored fruit and fabric on a neutral surface."
  ),
  gradient: media(
    "colors",
    "colors-3-smooth-gradient",
    "A poster transitioning smoothly from dark blue to pale blue."
  ),
  rainbow: media(
    "colors",
    "colors-3-rainbow-after-rain",
    "A multicolored arc over a wet landscape after rain."
  ),
  spectrum: media(
    "colors",
    "colors-3-prism-spectrum",
    "A glass prism separating white light into a band of colors."
  ),
  pigment: media(
    "colors",
    "colors-3-natural-mineral-pigment",
    "Bowls of ground mineral powder beside raw stones."
  ),
};

type SentenceDraft = {
  full: string;
  words: string[];
  media?: PilotSentenceMedia;
};

type LessonDraft = {
  clusters?: Array<{
    id: string;
    microReading: { text: string; media?: PilotSentenceMedia; [key: string]: unknown };
    [key: string]: unknown;
  }>;
  words: Array<{
    id: string;
    sentence: SentenceDraft;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

type SentenceMediaReview = {
  status: string;
  reviewedSentence: string;
  imagePath?: string;
  imageAlt?: string;
  imageFallbacks?: Array<{ imagePath: string; imageAlt: string }>;
};
const sentenceReviews: Readonly<Record<string, SentenceMediaReview>> = figmaReview.sentences;
const readingReviews: Readonly<
  Record<
    string,
    {
      status: string;
      reviewedText: string;
      imagePath?: string;
      imageAlt?: string;
    }
  >
> = figmaReview.readings;

export function reviewedReadingMedia(
  clusterId: string,
  text: string,
  original?: PilotSentenceMedia
): PilotSentenceMedia | undefined {
  const review = readingReviews[clusterId];
  if (!review) return original;
  if (
    review.status !== "approved" ||
    review.reviewedText !== text ||
    !review.imagePath ||
    !review.imageAlt
  )
    return undefined;
  return { imagePath: review.imagePath, imageAlt: review.imageAlt };
}

/** Withhold rejected or stale images; preserve their underlying files and URLs. */
export function reviewedPilotSentenceMedia(
  wordId: string,
  full: string
): PilotSentenceMedia | undefined {
  const review = sentenceReviews[wordId];
  if (!review) return PILOT_SENTENCE_MEDIA[wordId];
  if (
    review.status !== "approved" ||
    review.reviewedSentence !== full ||
    !review.imagePath ||
    !review.imageAlt
  )
    return undefined;
  return {
    imagePath: review.imagePath,
    imageAlt: review.imageAlt,
    imageFallbacks: review.imageFallbacks,
  };
}

/** Adds reviewed media before the lesson is validated by the production schema. */
export function withPilotSentenceMedia<T extends LessonDraft>(lesson: T): T {
  return {
    ...lesson,
    ...(lesson.clusters && {
      clusters: lesson.clusters.map((cluster) => ({
        ...cluster,
        microReading: {
          ...cluster.microReading,
          media: reviewedReadingMedia(
            cluster.id,
            cluster.microReading.text,
            cluster.microReading.media
          ),
        },
      })),
    }),
    words: lesson.words.map((word) => ({
      ...word,
      sentence: {
        ...word.sentence,
        media: word.sentence.media ?? reviewedPilotSentenceMedia(word.id, word.sentence.full),
      },
    })),
  } as T;
}
