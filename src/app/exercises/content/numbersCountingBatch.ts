import {
  authoredLessonContentSchema,
  type AuthoredLessonContent,
} from "./curriculumContentPipeline";
import { withPilotSentenceMedia } from "./pilotSentenceMedia";

const sentence = (full: string, words: string[]) => ({ full, words });

const numbersCountingTwo = authoredLessonContentSchema.parse(
  withPilotSentenceMedia({
    lessonId: "numbers-counting-2",
    sourceLessonId: "numbers-counting-2",
    cefr: "Pre-A1",
    editorialStatus: "approved",
    words: [
      {
        id: "sixteen",
        label: "Sixteen",
        arabic: "ستة عشر",
        sentence: sentence("There are sixteen desks.", ["There", "are", "sixteen", "desks"]),
      },
      {
        id: "seventeen",
        label: "Seventeen",
        arabic: "سبعة عشر",
        sentence: sentence("I can see seventeen birds.", ["I", "can", "see", "seventeen", "birds"]),
      },
      {
        id: "eighteen",
        label: "Eighteen",
        arabic: "ثمانية عشر",
        sentence: sentence("We need eighteen plates.", ["We", "need", "eighteen", "plates"]),
      },
      {
        id: "nineteen",
        label: "Nineteen",
        arabic: "تسعة عشر",
        sentence: sentence("Nineteen people are here.", ["Nineteen", "people", "are", "here"]),
      },
      {
        id: "twenty",
        label: "Twenty",
        arabic: "عشرون",
        sentence: sentence("The bus has twenty seats.", ["The", "bus", "has", "twenty", "seats"]),
      },
      {
        id: "thirty",
        label: "Thirty",
        arabic: "ثلاثون",
        sentence: sentence("The class has thirty students.", [
          "The",
          "class",
          "has",
          "thirty",
          "students",
        ]),
      },
      {
        id: "forty",
        label: "Forty",
        arabic: "أربعون",
        sentence: sentence("This book has forty pages.", ["This", "book", "has", "forty", "pages"]),
      },
      {
        id: "fifty",
        label: "Fifty",
        arabic: "خمسون",
        sentence: sentence("I have fifty pounds.", ["I", "have", "fifty", "pounds"]),
      },
      {
        id: "sixty",
        label: "Sixty",
        arabic: "ستون",
        sentence: sentence("One minute has sixty seconds.", [
          "One",
          "minute",
          "has",
          "sixty",
          "seconds",
        ]),
      },
      {
        id: "seventy",
        label: "Seventy",
        arabic: "سبعون",
        sentence: sentence("My grandfather is seventy.", ["My", "grandfather", "is", "seventy"]),
      },
      {
        id: "eighty",
        label: "Eighty",
        arabic: "ثمانون",
        sentence: sentence("The box holds eighty cards.", [
          "The",
          "box",
          "holds",
          "eighty",
          "cards",
        ]),
      },
      {
        id: "ninety",
        label: "Ninety",
        arabic: "تسعون",
        sentence: sentence("The trip costs ninety pounds.", [
          "The",
          "trip",
          "costs",
          "ninety",
          "pounds",
        ]),
      },
      {
        id: "hundred",
        label: "Hundred",
        arabic: "مئة",
        sentence: sentence("One hundred people came.", ["One", "hundred", "people", "came"]),
      },
      {
        id: "thousand",
        label: "Thousand",
        arabic: "ألف",
        sentence: sentence("The town has one thousand homes.", [
          "The",
          "town",
          "has",
          "one thousand",
          "homes",
        ]),
      },
      {
        id: "million",
        label: "Million",
        arabic: "مليون",
        sentence: sentence("The city has one million people.", [
          "The",
          "city",
          "has",
          "one million",
          "people",
        ]),
      },
    ],
    clusters: [
      {
        id: "numbers-sixteen-to-twenty",
        targetWordIds: ["sixteen", "seventeen", "eighteen", "nineteen", "twenty"],
        microReading: {
          title: "The small bus",
          text: "The bus has twenty seats. Sixteen people sit down. Seventeen, eighteen, and nineteen are the next numbers we practise.",
        },
        retrieval: {
          prompt: "How many seats does the bus have?",
          options: ["Eighteen", "Nineteen", "Twenty"],
          answer: "Twenty",
        },
      },
      {
        id: "numbers-thirty-to-seventy",
        targetWordIds: ["thirty", "forty", "fifty", "sixty", "seventy"],
        microReading: {
          title: "Numbers at the shop",
          text: "A notebook costs thirty pounds. A bag costs forty. I have fifty pounds. There are sixty minutes in an hour, and my grandfather is seventy.",
        },
        retrieval: {
          prompt: "How much money do I have?",
          options: ["Forty pounds", "Fifty pounds", "Sixty pounds"],
          answer: "Fifty pounds",
        },
      },
      {
        id: "numbers-eighty-to-million",
        targetWordIds: ["eighty", "ninety", "hundred", "thousand", "million"],
        microReading: {
          title: "Big numbers",
          text: "The box holds eighty cards, and the trip costs ninety pounds. One hundred, one thousand, and one million are bigger numbers.",
        },
        retrieval: {
          prompt: "How many cards does the box hold?",
          options: ["Eighty", "Ninety", "One hundred"],
          answer: "Eighty",
        },
      },
    ],
    spacedReviewAfterLessons: [1, 3, 7],
  })
) satisfies AuthoredLessonContent;

const numbersCountingThree = authoredLessonContentSchema.parse(
  withPilotSentenceMedia({
    lessonId: "numbers-counting-3",
    sourceLessonId: "numbers-counting-3",
    cefr: "Pre-A1",
    editorialStatus: "approved",
    words: [
      {
        id: "first",
        label: "First",
        arabic: "الأول",
        sentence: sentence("I am first in line.", ["I", "am", "first", "in", "line"]),
      },
      {
        id: "second",
        label: "Second",
        arabic: "الثاني",
        sentence: sentence("Mona is second in line.", ["Mona", "is", "second", "in", "line"]),
      },
      {
        id: "third",
        label: "Third",
        arabic: "الثالث",
        sentence: sentence("Ali is third in line.", ["Ali", "is", "third", "in", "line"]),
      },
      {
        id: "fourth",
        label: "Fourth",
        arabic: "الرابع",
        sentence: sentence("This is the fourth page.", ["This", "is", "the", "fourth", "page"]),
      },
      {
        id: "fifth",
        label: "Fifth",
        arabic: "الخامس",
        sentence: sentence("Today is the fifth day.", ["Today", "is", "the", "fifth", "day"]),
      },
      {
        id: "sixth",
        label: "Sixth",
        arabic: "السادس",
        sentence: sentence("She finished in sixth place.", [
          "She",
          "finished",
          "in",
          "sixth",
          "place",
        ]),
      },
      {
        id: "seventh",
        label: "Seventh",
        arabic: "السابع",
        sentence: sentence("He lives on the seventh floor.", [
          "He",
          "lives",
          "on",
          "the",
          "seventh",
          "floor",
        ]),
      },
      {
        id: "eighth",
        label: "Eighth",
        arabic: "الثامن",
        sentence: sentence("This is my eighth lesson.", ["This", "is", "my", "eighth", "lesson"]),
      },
      {
        id: "ninth",
        label: "Ninth",
        arabic: "التاسع",
        sentence: sentence("She chose the ninth card.", ["She", "chose", "the", "ninth", "card"]),
      },
      {
        id: "tenth",
        label: "Tenth",
        arabic: "العاشر",
        sentence: sentence("Today is the tenth lesson.", ["Today", "is", "the", "tenth", "lesson"]),
      },
      {
        id: "addition",
        label: "Addition",
        arabic: "الجمع",
        sentence: sentence("Addition joins numbers together.", [
          "Addition",
          "joins",
          "numbers",
          "together",
        ]),
      },
      {
        id: "subtraction",
        label: "Subtraction",
        arabic: "الطرح",
        sentence: sentence("Subtraction takes a number away.", [
          "Subtraction",
          "takes",
          "a",
          "number",
          "away",
        ]),
      },
      {
        id: "multiplication",
        label: "Multiplication",
        arabic: "الضرب",
        sentence: sentence("Multiplication adds equal groups.", [
          "Multiplication",
          "adds",
          "equal",
          "groups",
        ]),
      },
      {
        id: "division",
        label: "Division",
        arabic: "القسمة",
        sentence: sentence("Division makes equal groups.", [
          "Division",
          "makes",
          "equal",
          "groups",
        ]),
      },
      {
        id: "equals",
        label: "Equals",
        arabic: "يساوي",
        sentence: sentence("Two plus three equals five.", [
          "Two",
          "plus",
          "three",
          "equals",
          "five",
        ]),
      },
    ],
    clusters: [
      {
        id: "ordinals-first-to-fifth",
        targetWordIds: ["first", "second", "third", "fourth", "fifth"],
        microReading: {
          title: "The race",
          text: "Mona is first. Ali is second, and Noor is third. Sami is fourth, and Huda is fifth.",
        },
        retrieval: {
          prompt: "Who is third?",
          options: ["Ali", "Noor", "Sami"],
          answer: "Noor",
        },
      },
      {
        id: "ordinals-sixth-to-tenth",
        targetWordIds: ["sixth", "seventh", "eighth", "ninth", "tenth"],
        microReading: {
          title: "The next five places",
          text: "Lina is sixth, Omar is seventh, and Adam is eighth. Reem is ninth, and Tarek is tenth.",
        },
        retrieval: {
          prompt: "Who is seventh?",
          options: ["Lina", "Omar", "Adam"],
          answer: "Omar",
        },
      },
      {
        id: "basic-operations",
        targetWordIds: ["addition", "subtraction", "multiplication", "division", "equals"],
        microReading: {
          title: "Four ways to work with numbers",
          text: "Addition joins numbers. Subtraction takes away. Multiplication and division use equal groups. The equals sign shows the answer.",
        },
        retrieval: {
          prompt: "Which operation takes a number away?",
          options: ["Addition", "Subtraction", "Division"],
          answer: "Subtraction",
        },
      },
    ],
    spacedReviewAfterLessons: [1, 3, 7],
  })
) satisfies AuthoredLessonContent;

const numbersCountingFour = authoredLessonContentSchema.parse(
  withPilotSentenceMedia({
    lessonId: "numbers-counting-4",
    sourceLessonId: "numbers-counting-4",
    cefr: "Pre-A1",
    editorialStatus: "approved",
    words: [
      {
        id: "plus",
        label: "Plus",
        arabic: "زائد",
        sentence: sentence("Two plus three equals five.", [
          "Two",
          "plus",
          "three",
          "equals",
          "five",
        ]),
      },
      {
        id: "minus",
        label: "Minus",
        arabic: "ناقص",
        sentence: sentence("Five minus two equals three.", [
          "Five",
          "minus",
          "two",
          "equals",
          "three",
        ]),
      },
      {
        id: "times",
        label: "Times",
        arabic: "في",
        sentence: sentence("Three times four equals twelve.", [
          "Three",
          "times",
          "four",
          "equals",
          "twelve",
        ]),
      },
      {
        id: "divided-by",
        label: "Divided By",
        arabic: "مقسوم على",
        sentence: sentence("Twelve divided by three equals four.", [
          "Twelve",
          "divided by",
          "three",
          "equals",
          "four",
        ]),
      },
      {
        id: "percentage",
        label: "Percentage",
        arabic: "نسبة مئوية",
        sentence: sentence("The percentage is fifty percent.", [
          "The",
          "percentage",
          "is",
          "fifty",
          "percent",
        ]),
      },
    ],
    clusters: [
      {
        id: "math-language",
        targetWordIds: ["plus", "minus", "times", "divided-by", "percentage"],
        microReading: {
          title: "A quick maths quiz",
          text: "Two plus three is five. Five minus two is three. Three times four is twelve, and twelve divided by three is four. The percentage is fifty percent, which means one half.",
        },
        retrieval: {
          prompt: "What does fifty percent mean?",
          options: ["One half", "One third", "Two"],
          answer: "One half",
        },
      },
    ],
    spacedReviewAfterLessons: [1, 3, 7],
  })
) satisfies AuthoredLessonContent;

export const NUMBERS_COUNTING_BATCH: readonly AuthoredLessonContent[] = [
  numbersCountingTwo,
  numbersCountingThree,
  numbersCountingFour,
];
