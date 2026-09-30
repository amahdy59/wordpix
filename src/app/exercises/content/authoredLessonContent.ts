import {
  authoredLessonContentSchema,
  buildAuthoredLessonRegistry,
  type AuthoredLessonContent,
} from "./curriculumContentPipeline";
import { NUMBERS_COUNTING_BATCH } from "./numbersCountingBatch";
import { COLORS_BATCH } from "./colorsBatch";
import { withPilotSentenceMedia } from "./pilotSentenceMedia";

const sentence = (full: string, words: string[]) => ({ full, words });

const numbersCountingOne = authoredLessonContentSchema.parse(
  withPilotSentenceMedia({
    lessonId: "numbers-counting-1",
    sourceLessonId: "numbers-counting-1",
    cefr: "Pre-A1",
    editorialStatus: "approved",
    words: [
      {
        id: "one",
        label: "One",
        arabic: "واحد",
        sentence: sentence("I need one ticket.", ["I", "need", "one", "ticket"]),
      },
      {
        id: "two",
        label: "Two",
        arabic: "اثنان",
        sentence: sentence("We have two bags.", ["We", "have", "two", "bags"]),
      },
      {
        id: "three",
        label: "Three",
        arabic: "ثلاثة",
        sentence: sentence("She bought three apples.", ["She", "bought", "three", "apples"]),
      },
      {
        id: "four",
        label: "Four",
        arabic: "أربعة",
        sentence: sentence("There are four chairs.", ["There", "are", "four", "chairs"]),
      },
      {
        id: "five",
        label: "Five",
        arabic: "خمسة",
        sentence: sentence("I can see five books.", ["I", "can", "see", "five", "books"]),
      },
      {
        id: "six",
        label: "Six",
        arabic: "ستة",
        sentence: sentence("We need six cups.", ["We", "need", "six", "cups"]),
      },
      {
        id: "seven",
        label: "Seven",
        arabic: "سبعة",
        sentence: sentence("A week has seven days.", ["A", "week", "has", "seven", "days"]),
      },
      {
        id: "eight",
        label: "Eight",
        arabic: "ثمانية",
        sentence: sentence("Eight students are here.", ["Eight", "students", "are", "here"]),
      },
      {
        id: "nine",
        label: "Nine",
        arabic: "تسعة",
        sentence: sentence("The shop has nine boxes.", ["The", "shop", "has", "nine", "boxes"]),
      },
      {
        id: "ten",
        label: "Ten",
        arabic: "عشرة",
        sentence: sentence("I have ten fingers.", ["I", "have", "ten", "fingers"]),
      },
      {
        id: "eleven",
        label: "Eleven",
        arabic: "أحد عشر",
        sentence: sentence("The team has eleven players.", [
          "The",
          "team",
          "has",
          "eleven",
          "players",
        ]),
      },
      {
        id: "twelve",
        label: "Twelve",
        arabic: "اثنا عشر",
        sentence: sentence("A year has twelve months.", ["A", "year", "has", "twelve", "months"]),
      },
      {
        id: "thirteen",
        label: "Thirteen",
        arabic: "ثلاثة عشر",
        sentence: sentence("Thirteen people are waiting.", [
          "Thirteen",
          "people",
          "are",
          "waiting",
        ]),
      },
      {
        id: "fourteen",
        label: "Fourteen",
        arabic: "أربعة عشر",
        sentence: sentence("We stayed for fourteen days.", [
          "We",
          "stayed",
          "for",
          "fourteen",
          "days",
        ]),
      },
      {
        id: "fifteen",
        label: "Fifteen",
        arabic: "خمسة عشر",
        sentence: sentence("The break is fifteen minutes.", [
          "The",
          "break",
          "is",
          "fifteen",
          "minutes",
        ]),
      },
    ],
    clusters: [
      {
        id: "numbers-one-to-five",
        targetWordIds: ["one", "two", "three", "four", "five"],
        microReading: {
          title: "A small order",
          text: "I need one ticket and two bags. My friend buys three apples, four bananas, and five oranges.",
        },
        retrieval: {
          prompt: "How many apples does my friend buy?",
          options: ["Two", "Three", "Five"],
          answer: "Three",
        },
      },
      {
        id: "numbers-six-to-ten",
        targetWordIds: ["six", "seven", "eight", "nine", "ten"],
        microReading: {
          title: "In the classroom",
          text: "I see six books on the desk and seven apples in the basket. We count eight chairs, nine bags, and ten pencils.",
        },
        retrieval: {
          prompt: "How many books are on the desk?",
          options: ["Six", "Eight", "Ten"],
          answer: "Six",
        },
      },
      {
        id: "numbers-eleven-to-fifteen",
        targetWordIds: ["eleven", "twelve", "thirteen", "fourteen", "fifteen"],
        microReading: {
          title: "The sports club",
          text: "Eleven players arrive at twelve. Thirteen people wait for fourteen chairs. Practice starts in fifteen minutes.",
        },
        retrieval: {
          prompt: "How many minutes until practice starts?",
          options: ["Thirteen", "Fourteen", "Fifteen"],
          answer: "Fifteen",
        },
      },
    ],
    spacedReviewAfterLessons: [1, 3, 7],
  })
) satisfies AuthoredLessonContent;

export const AUTHORED_LESSON_CONTENT = buildAuthoredLessonRegistry([
  numbersCountingOne,
  ...NUMBERS_COUNTING_BATCH,
  ...COLORS_BATCH,
]);

const authoredSentenceByWordId = new Map(
  Object.values(AUTHORED_LESSON_CONTENT).flatMap((lesson) =>
    lesson.words.map((word) => [word.id, word.sentence] as const)
  )
);

const authoredWordByWordId = new Map(
  Object.values(AUTHORED_LESSON_CONTENT).flatMap((lesson) =>
    lesson.words.map((word) => [word.id, word] as const)
  )
);

export function getAuthoredSentence(wordId: string) {
  return authoredSentenceByWordId.get(wordId);
}

export function getAuthoredWord(wordId: string) {
  return authoredWordByWordId.get(wordId);
}

export function getAuthoredLessonContent(lessonId: string) {
  return AUTHORED_LESSON_CONTENT[lessonId];
}
