import {
  authoredLessonContentSchema,
  type AuthoredLessonContent,
} from "./curriculumContentPipeline";

const sentence = (full: string, words: string[]) => ({ full, words });

const colorsOne = authoredLessonContentSchema.parse({
  lessonId: "colors-1",
  sourceLessonId: "colors-1",
  cefr: "Pre-A1",
  editorialStatus: "approved",
  words: [
    {
      id: "red",
      label: "Red",
      arabic: "أحمر",
      sentence: sentence("The apple is red.", ["The", "apple", "is", "red"]),
    },
    {
      id: "blue",
      label: "Blue",
      arabic: "أزرق",
      sentence: sentence("The sky is blue.", ["The", "sky", "is", "blue"]),
    },
    {
      id: "yellow",
      label: "Yellow",
      arabic: "أصفر",
      sentence: sentence("I like yellow flowers.", ["I", "like", "yellow", "flowers"]),
    },
    {
      id: "green",
      label: "Green",
      arabic: "أخضر",
      sentence: sentence("The grass is green.", ["The", "grass", "is", "green"]),
    },
    {
      id: "orange",
      label: "Orange",
      arabic: "برتقالي",
      sentence: sentence("She wore an orange hat.", ["She", "wore", "an", "orange", "hat"]),
    },
    {
      id: "purple",
      label: "Purple",
      arabic: "أرجواني",
      sentence: sentence("He has a purple pen.", ["He", "has", "a", "purple", "pen"]),
    },
    {
      id: "pink",
      label: "Pink",
      arabic: "وردي",
      sentence: sentence("The cup is pink.", ["The", "cup", "is", "pink"]),
    },
    {
      id: "brown",
      label: "Brown",
      arabic: "بني",
      sentence: sentence("A brown dog sat down.", ["A", "brown", "dog", "sat", "down"]),
    },
    {
      id: "black",
      label: "Black",
      arabic: "أسود",
      sentence: sentence("I wear black shoes.", ["I", "wear", "black", "shoes"]),
    },
    {
      id: "white",
      label: "White",
      arabic: "أبيض",
      sentence: sentence("The wall is white.", ["The", "wall", "is", "white"]),
    },
    {
      id: "cyan",
      label: "Cyan",
      arabic: "سماوي",
      sentence: sentence("The printer uses cyan ink.", ["The", "printer", "uses", "cyan", "ink"]),
    },
    {
      id: "magenta",
      label: "Magenta",
      arabic: "أرجواني فاتح",
      sentence: sentence("Magenta is a bright color.", ["Magenta", "is", "a", "bright", "color"]),
    },
    {
      id: "lime",
      label: "Lime",
      arabic: "أخضر ليموني",
      sentence: sentence("She bought a lime shirt.", ["She", "bought", "a", "lime", "shirt"]),
    },
    {
      id: "teal",
      label: "Teal",
      arabic: "أزرق مخضر",
      sentence: sentence("The door is painted teal.", ["The", "door", "is", "painted", "teal"]),
    },
    {
      id: "indigo",
      label: "Indigo",
      arabic: "نيلي",
      sentence: sentence("Indigo appears in the rainbow.", [
        "Indigo",
        "appears",
        "in",
        "the",
        "rainbow",
      ]),
    },
  ],
  clusters: [
    {
      id: "colors-primary-bright",
      targetWordIds: ["red", "blue", "yellow", "green", "orange"],
      microReading: {
        title: "Painting the park",
        text: "I paint a red apple under a yellow sun. Blue water flows through green grass near an orange bench.",
      },
      retrieval: {
        prompt: "What color is the apple?",
        options: ["Red", "Yellow", "Orange"],
        answer: "Red",
      },
    },
    {
      id: "colors-common-contrast",
      targetWordIds: ["purple", "pink", "brown", "black", "white"],
      microReading: {
        title: "Preparing school supplies",
        text: "She packed a purple notebook and a pink eraser. A brown bag holds black pens and clean white paper.",
      },
      retrieval: {
        prompt: "What color is the notebook?",
        options: ["Purple", "Pink", "Brown"],
        answer: "Purple",
      },
    },
    {
      id: "colors-digital-palette",
      targetWordIds: ["cyan", "magenta", "lime", "teal", "indigo"],
      microReading: {
        title: "The design studio",
        text: "Graphic designers mix cyan and magenta ink. Bright lime shapes and teal borders stand out on an indigo background.",
      },
      retrieval: {
        prompt: "What color is the background?",
        options: ["Cyan", "Teal", "Indigo"],
        answer: "Indigo",
      },
    },
  ],
  spacedReviewAfterLessons: [1, 3, 7],
}) satisfies AuthoredLessonContent;

const colorsTwo = authoredLessonContentSchema.parse({
  lessonId: "colors-2",
  sourceLessonId: "colors-2",
  cefr: "Pre-A1",
  editorialStatus: "approved",
  words: [
    {
      id: "violet",
      label: "Violet",
      arabic: "بنفسجي",
      sentence: sentence("A violet flower grew here.", ["A", "violet", "flower", "grew", "here"]),
    },
    {
      id: "coral",
      label: "Coral",
      arabic: "مرجاني",
      sentence: sentence("The dress is coral.", ["The", "dress", "is", "coral"]),
    },
    {
      id: "salmon",
      label: "Salmon",
      arabic: "وردي مائل للبرتقالي",
      sentence: sentence("They chose salmon paint.", ["They", "chose", "salmon", "paint"]),
    },
    {
      id: "turquoise",
      label: "Turquoise",
      arabic: "فيروزي",
      sentence: sentence("The water is turquoise.", ["The", "water", "is", "turquoise"]),
    },
    {
      id: "lavender",
      label: "Lavender",
      arabic: "خزامي",
      sentence: sentence("Lavender soap smells fresh.", ["Lavender", "soap", "smells", "fresh"]),
    },
    {
      id: "light",
      label: "Light",
      arabic: "فاتح",
      sentence: sentence("This room has light walls.", ["This", "room", "has", "light", "walls"]),
    },
    {
      id: "dark",
      label: "Dark",
      arabic: "داكن",
      sentence: sentence("It is dark outside.", ["It", "is", "dark", "outside"]),
    },
    {
      id: "bright",
      label: "Bright",
      arabic: "ساطع",
      sentence: sentence("The lamp is bright.", ["The", "lamp", "is", "bright"]),
    },
    {
      id: "dull",
      label: "Dull",
      arabic: "باهت",
      sentence: sentence("Old paint looks dull.", ["Old", "paint", "looks", "dull"]),
    },
    {
      id: "vivid",
      label: "Vivid",
      arabic: "ناصع",
      sentence: sentence("The sunset had vivid colors.", [
        "The",
        "sunset",
        "had",
        "vivid",
        "colors",
      ]),
    },
    {
      id: "pale",
      label: "Pale",
      arabic: "شاحب",
      sentence: sentence("She wore a pale scarf.", ["She", "wore", "a", "pale", "scarf"]),
    },
    {
      id: "deep",
      label: "Deep",
      arabic: "عميق",
      sentence: sentence("The lake is deep blue.", ["The", "lake", "is", "deep", "blue"]),
    },
    {
      id: "warm",
      label: "Warm",
      arabic: "دافئ",
      sentence: sentence("Yellow gives a warm feeling.", [
        "Yellow",
        "gives",
        "a",
        "warm",
        "feeling",
      ]),
    },
    {
      id: "cool",
      label: "Cool",
      arabic: "بارد",
      sentence: sentence("Blue is a cool color.", ["Blue", "is", "a", "cool", "color"]),
    },
    {
      id: "neutral",
      label: "Neutral",
      arabic: "محايد",
      sentence: sentence("Gray is a neutral shade.", ["Gray", "is", "a", "neutral", "shade"]),
    },
  ],
  clusters: [
    {
      id: "colors-delicate-shades",
      targetWordIds: ["violet", "coral", "salmon", "turquoise", "lavender"],
      microReading: {
        title: "The botanical garden",
        text: "Violet blossoms grow beside coral roses. Salmon ribbons decorate turquoise pots around fresh lavender bushes.",
      },
      retrieval: {
        prompt: "What decorates the turquoise pots?",
        options: ["Violet blossoms", "Salmon ribbons", "Coral roses"],
        answer: "Salmon ribbons",
      },
    },
    {
      id: "colors-contrast-intensity",
      targetWordIds: ["light", "dark", "bright", "dull", "vivid"],
      microReading: {
        title: "Morning sunlight",
        text: "Bright sunlight warmed the dark street. Light curtains replaced dull blinds to highlight vivid posters in the gallery.",
      },
      retrieval: {
        prompt: "What warmed the dark street?",
        options: ["Bright sunlight", "Light curtains", "Vivid posters"],
        answer: "Bright sunlight",
      },
    },
    {
      id: "colors-harmony-and-tone",
      targetWordIds: ["pale", "deep", "warm", "cool", "neutral"],
      microReading: {
        title: "Living room decoration",
        text: "She painted the walls a pale neutral cream. Warm lamps softened deep wood shelves, creating a cool and quiet space.",
      },
      retrieval: {
        prompt: "What color was the wall paint?",
        options: ["Pale neutral cream", "Deep wood", "Cool blue"],
        answer: "Pale neutral cream",
      },
    },
  ],
  spacedReviewAfterLessons: [1, 3, 7],
}) satisfies AuthoredLessonContent;

const colorsThree = authoredLessonContentSchema.parse({
  lessonId: "colors-3",
  sourceLessonId: "colors-3",
  cefr: "Pre-A1",
  editorialStatus: "approved",
  words: [
    {
      id: "mix",
      label: "Mix",
      arabic: "يمزج",
      sentence: sentence("Mix blue and red together.", ["Mix", "blue", "and", "red", "together"]),
    },
    {
      id: "blend",
      label: "Blend",
      arabic: "يدمج",
      sentence: sentence("Blend the edges softly.", ["Blend", "the", "edges", "softly"]),
    },
    {
      id: "shade",
      label: "Shade",
      arabic: "تدرج داكن",
      sentence: sentence("Add black for a darker shade.", [
        "Add",
        "black",
        "for",
        "a",
        "darker",
        "shade",
      ]),
    },
    {
      id: "tint",
      label: "Tint",
      arabic: "تدرج فاتح",
      sentence: sentence("White gives a lighter tint.", ["White", "gives", "a", "lighter", "tint"]),
    },
    {
      id: "hue",
      label: "Hue",
      arabic: "درجة لون",
      sentence: sentence("Each flower has a unique hue.", [
        "Each",
        "flower",
        "has",
        "a",
        "unique",
        "hue",
      ]),
    },
    {
      id: "saturation",
      label: "Saturation",
      arabic: "تشبع لوني",
      sentence: sentence("High saturation creates intense colors.", [
        "High",
        "saturation",
        "creates",
        "intense",
        "colors",
      ]),
    },
    {
      id: "gradient",
      label: "Gradient",
      arabic: "تدرج لوني",
      sentence: sentence("The poster has a smooth gradient.", [
        "The",
        "poster",
        "has",
        "a",
        "smooth",
        "gradient",
      ]),
    },
    {
      id: "rainbow",
      label: "Rainbow",
      arabic: "قوس قزح",
      sentence: sentence("A rainbow appeared after rain.", [
        "A",
        "rainbow",
        "appeared",
        "after",
        "rain",
      ]),
    },
    {
      id: "spectrum",
      label: "Spectrum",
      arabic: "طيف",
      sentence: sentence("Prisms split light into a spectrum.", [
        "Prisms",
        "split",
        "light",
        "into",
        "a",
        "spectrum",
      ]),
    },
    {
      id: "pigment",
      label: "Pigment",
      arabic: "صبغة",
      sentence: sentence("Natural mineral pigment lasts long.", [
        "Natural",
        "mineral",
        "pigment",
        "lasts",
        "long",
      ]),
    },
  ],
  clusters: [
    {
      id: "colors-mixing-principles",
      targetWordIds: ["mix", "blend", "shade", "tint", "hue"],
      microReading: {
        title: "Mixing water colors",
        text: "Art students mix pigments to discover every hue. Adding white creates a tint, adding black makes a shade, and artists blend them on paper.",
      },
      retrieval: {
        prompt: "What does adding white create?",
        options: ["A tint", "A shade", "A hue"],
        answer: "A tint",
      },
    },
    {
      id: "colors-light-and-optics",
      targetWordIds: ["saturation", "gradient", "rainbow", "spectrum", "pigment"],
      microReading: {
        title: "Light and pigments",
        text: "White light passes through rain to form a rainbow spectrum. Artists use fine pigment to print a smooth gradient with rich color saturation.",
      },
      retrieval: {
        prompt: "What does white light passing through rain form?",
        options: ["A rainbow spectrum", "A pigment print", "A dark shadow"],
        answer: "A rainbow spectrum",
      },
    },
  ],
  spacedReviewAfterLessons: [1, 3, 7],
}) satisfies AuthoredLessonContent;

export const COLORS_BATCH: readonly AuthoredLessonContent[] = [colorsOne, colorsTwo, colorsThree];
