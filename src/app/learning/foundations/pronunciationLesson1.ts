import type { PronunciationLesson } from "./pronunciationExerciseSchema";
import { validatePronunciationLesson } from "./pronunciationExerciseSchema";

const image = (word: string, src: string) => ({ src, alt: word });

export const FIGMA_PRONUNCIATION_LESSON_1: PronunciationLesson = validatePronunciationLesson({
  id: "figma-pronunciation-01-same-or-different",
  number: 1,
  title: "Same or Different?",
  objective:
    "Identify whether two familiar spoken words are exactly the same or different without relying on print.",
  stages: ["hear", "notice", "contrast", "use", "transfer", "retry-recovery", "delayed-review"],
  delayedReviewDays: [1, 3, 7],
  exercises: [
    {
      id: "l01-guided-sheep-ship",
      stage: "contrast",
      prompt: "Listen to both words, then choose Same or Different.",
      targetAudio: "sheep. ship.",
      responseMode: "listen-and-choose",
      options: [
        { value: "same", label: "Same" },
        { value: "different", label: "Different" },
      ],
      answer: "different",
      support: ["Listen to the middle vowel again.", "The words are close, but not the same."],
      replayLimit: 1,
      freshSpeaker: false,
      imageVisibility: "hidden-during-check",
    },
    {
      id: "l01-transfer-fan-van",
      stage: "transfer",
      prompt: "A new speaker is reading the pair. Do the words match?",
      targetAudio: "fan. van.",
      responseMode: "listen-and-choose",
      options: [
        { value: "same", label: "Same" },
        { value: "different", label: "Different" },
      ],
      answer: "different",
      support: [
        "Replay once and listen for the first sound.",
        "Fan starts quietly; van starts with a voice buzz.",
      ],
      replayLimit: 1,
      freshSpeaker: true,
      imageVisibility: "hidden-during-check",
    },
    {
      id: "l01-use-cat-fish",
      stage: "use",
      prompt: "Preview the words, then listen without the pictures and decide.",
      targetAudio: "cat. fish.",
      responseMode: "listen-and-choose",
      options: [
        {
          value: "same",
          label: "Same",
          image: image("same", "/word-images/pronunciation/cat.webp"),
        },
        {
          value: "different",
          label: "Different",
          image: image("different", "/word-images/pronunciation/fish.webp"),
        },
      ],
      answer: "different",
      support: [
        "The pictures are only a preview; listen again.",
        "Cat and fish are two different words.",
      ],
      replayLimit: 1,
      freshSpeaker: false,
      imageVisibility: "after-answer",
    },
  ],
});
