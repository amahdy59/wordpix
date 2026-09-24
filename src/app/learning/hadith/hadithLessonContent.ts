import type { FigmaHadithLesson } from "./figmaHadithCatalog";

export interface LearningOutcome {
  id: string;
  title: string;
  description: string;
}

export interface ParsedOverview {
  title: string;
  purpose: string;
  estimatedMinutes: number;
  coreWordsCount: number;
  outcomes: LearningOutcome[];
}

export interface PreviewTerm {
  term: string;
  meaning: string;
}

export interface ParsedWarmup {
  title: string;
  scenario: string;
  prompt: string;
  question: string;
  choices: string[];
  feedback?: string;
  frame?: string;
  previewTerms: PreviewTerm[];
}

export interface ParsedSpeakTask {
  title: string;
  description: string;
  frames: string[];
  modelDialogue: string[];
  checklist: string[];
}

export interface ParsedReviewItem {
  question: string;
  hint?: string;
  feedback?: string;
  answer: string;
}

export interface ParsedLessonStages {
  overview: ParsedOverview;
  warmup: ParsedWarmup;
  speak: ParsedSpeakTask;
  review: ParsedReviewItem[];
}

const FIGMA_NOISE: readonly RegExp[] = [
  /^progress$/i,
  /^\d+\s+of\s+\d+\s+steps$/i,
  /^\d+%\s+complete$/i,
  /^\d+%$/i,
  /^begin lesson$/i,
  /^submit\s*&\s*continue$/i,
  /^retry\s+speaking/i,
  /^simulate\s*&\s*record/i,
  /^audio controls$/i,
  /^normal pace reading$/i,
  /^slow pace reading$/i,
  /^complete arabic text$/i,
  /^complete translation/i,
  /^learner flow$/i,
  /^three simple steps to practice/i,
];

function isFigmaNoise(line: string): boolean {
  if (!line || !line.trim()) return true;
  return FIGMA_NOISE.some((pattern) => pattern.test(line.trim()));
}

function cleanLines(lines: readonly string[]): string[] {
  return (lines ?? []).map((l) => l.trim()).filter((l) => !isFigmaNoise(l));
}

function parseOverview(rawLines: readonly string[], lesson: FigmaHadithLesson): ParsedOverview {
  const lines = cleanLines(rawLines);

  const pIdx = lines.findIndex((l) => /^lesson purpose/i.test(l));
  const candidate = lines.slice(1, 6).find((l) => l.length > 40 && !/HADITH/i.test(l));
  const purpose =
    pIdx >= 0 && pIdx + 1 < lines.length
      ? lines[pIdx + 1]
      : (candidate ??
        `Study the core message, vocabulary, and application of Hadith ${lesson.number}.`);

  const timeLine = lines.find((l) => /time/i.test(l) && /\d+/.test(l));
  const timeMatch = timeLine?.match(/\d+/);
  const estimatedMinutes = timeMatch ? parseInt(timeMatch[0], 10) : 25;

  const coreLine = lines.find((l) => /\b\d+\s+core\b/i.test(l));
  const coreMatch = coreLine?.match(/\d+/);
  const coreWordsCount = coreMatch ? parseInt(coreMatch[0], 10) : 5;

  const outcomes: LearningOutcome[] = [];
  const oIdx = lines.findIndex((l) => /learning outcomes/i.test(l));
  if (oIdx >= 0) {
    let i = oIdx + 1;
    if (i < lines.length && /by the end of/i.test(lines[i])) i++;
    while (i < lines.length) {
      const line = lines[i];
      if (/^HADITH/i.test(line)) break;
      if (line.length < 50 && i + 1 < lines.length && lines[i + 1].length >= 25) {
        outcomes.push({
          id: `outcome-${outcomes.length + 1}`,
          title: line,
          description: lines[i + 1],
        });
        i += 2;
      } else {
        outcomes.push({
          id: `outcome-${outcomes.length + 1}`,
          title: `Outcome ${outcomes.length + 1}`,
          description: line,
        });
        i++;
      }
    }
  }

  if (outcomes.length === 0) {
    outcomes.push(
      {
        id: "outcome-1",
        title: "Understand",
        description: `Understand the primary message and context of Hadith ${lesson.number}.`,
      },
      {
        id: "outcome-2",
        title: "Key Vocabulary",
        description: "Master the core words and purposeful language patterns in English.",
      },
      {
        id: "outcome-3",
        title: "Transfer & Apply",
        description: "Express and reflect upon the prophetic guidance in clear everyday English.",
      }
    );
  }

  return {
    title: lesson.title,
    purpose,
    estimatedMinutes,
    coreWordsCount,
    outcomes,
  };
}

function parseWarmup(rawLines: readonly string[], lesson: FigmaHadithLesson): ParsedWarmup {
  const lines = cleanLines(rawLines);
  const title = lines[1] && lines[1].length < 80 ? lines[1] : "Notice Before Reading";

  const scenario =
    lines.slice(1, 4).find((l) => l.length > 40) ??
    "Consider an everyday situation before reading the sacred text.";

  const prompt =
    lines.slice(3, 7).find((l) => /think|reflect|notice|prompt/i.test(l) && l.length > 30) ??
    "Notice how small details in intention and context shape meaning.";

  const pollIdx = lines.findIndex(
    (l) => /\?$/.test(l) || /poll|question|what changes|how familiar/i.test(l)
  );
  const question =
    pollIdx >= 0 ? lines[pollIdx] : "Reflect on how this theme connects to everyday choices:";

  let choices: string[] = [];
  if (pollIdx >= 0) {
    let i = pollIdx + 1;
    while (
      i < lines.length &&
      choices.length < 4 &&
      !/preview|useful expression|frame/i.test(lines[i])
    ) {
      if (lines[i].length > 3 && lines[i].length < 90) choices.push(lines[i]);
      i++;
    }
  }
  if (choices.length < 2) {
    choices = [
      "I can connect this easily to my experience",
      "I can explain simple reasons with support",
      "I prefer to listen and reflect first",
    ];
  }

  const frameIdx = lines.findIndex((l) => /frame/i.test(l));
  const frame = frameIdx >= 0 && frameIdx + 1 < lines.length ? lines[frameIdx + 1] : undefined;

  const previewIdx = lines.findIndex((l) => /preview|useful/i.test(l));
  const previewTerms: PreviewTerm[] = [];
  if (previewIdx >= 0) {
    let i = previewIdx + 1;
    while (i < lines.length && previewTerms.length < 5) {
      if (lines[i].length < 35 && i + 1 < lines.length && lines[i + 1].length >= 10) {
        previewTerms.push({ term: lines[i], meaning: lines[i + 1].replace(/^[-–]\s*/, "") });
        i += 2;
      } else {
        i++;
      }
    }
  }

  return {
    title,
    scenario,
    prompt,
    question,
    choices,
    frame,
    feedback: `Keep this contrast in mind as you read and listen to Hadith ${lesson.number}.`,
    previewTerms,
  };
}

function parseSpeak(rawLines: readonly string[], _lesson: FigmaHadithLesson): ParsedSpeakTask {
  const lines = cleanLines(rawLines);
  const title = lines[1] && lines[1].length < 80 ? lines[1] : "Speaking & Application";
  const description =
    lines.slice(1, 4).find((l) => l.length > 40) ??
    "Practice speaking clearly using the target structures and vocabulary.";

  const frames: string[] = [];
  const fIdx = lines.findIndex((l) => /frame/i.test(l));
  if (fIdx >= 0) {
    let i = fIdx + 1;
    while (i < lines.length && frames.length < 3 && !/model|dialogue|check/i.test(lines[i])) {
      if (lines[i].length > 10) frames.push(lines[i]);
      i++;
    }
  }

  const modelDialogue: string[] = [];
  const mIdx = lines.findIndex((l) => /model/i.test(l));
  if (mIdx >= 0) {
    let i = mIdx + 1;
    while (i < lines.length && !/check|self-check|checklist/i.test(lines[i])) {
      if (lines[i].length > 10) modelDialogue.push(lines[i]);
      i++;
    }
  }

  const checklist: string[] = [];
  const cIdx = lines.findIndex((l) => /check/i.test(l));
  if (cIdx >= 0) {
    let i = cIdx + 1;
    while (i < lines.length) {
      const line = lines[i];
      if (line.length > 5 && !/^\d+$/.test(line) && !/submit|retry/i.test(line)) {
        checklist.push(line.replace(/^\d+[.)]\s*/, ""));
      }
      i++;
    }
  }
  if (checklist.length === 0) {
    checklist.push(
      "I stated my answer clearly.",
      "I used target vocabulary from the lesson.",
      "My pronunciation was steady and intelligible."
    );
  }

  return {
    title,
    description,
    frames,
    modelDialogue,
    checklist,
  };
}

function parseReview(rawLines: readonly string[], lesson: FigmaHadithLesson): ParsedReviewItem[] {
  const lines = cleanLines(rawLines);
  const items: ParsedReviewItem[] = [];
  let current: ParsedReviewItem | null = null;

  for (const line of lines) {
    if (/outcome-aligned/i.test(line)) continue;
    if (/^\d+$/.test(line) || /^\d+[.)]/.test(line)) {
      if (current?.question) items.push(current);
      current = { question: "", hint: "", feedback: "", answer: "" };
      continue;
    }
    if (!current) current = { question: "", hint: "", feedback: "", answer: "" };

    if (/^hint/i.test(line)) {
      current.hint = line.replace(/^hint:?\s*/i, "");
    } else if (/^(?:explanatory )?feedback/i.test(line)) {
      current.feedback = line.replace(/^(?:explanatory )?feedback:?\s*/i, "");
    } else if (/^model answer/i.test(line)) {
      current.answer = line.replace(/^model answer:?\s*/i, "");
    } else if (!current.question && !/outcome:/i.test(line)) {
      current.question = line;
    } else if (current.answer) {
      current.answer += " " + line;
    }
  }
  if (current?.question) items.push(current);

  if (items.length === 0) {
    items.push({
      question: `What is the core takeaway of Hadith ${lesson.number} (${lesson.title})?`,
      hint: "Recall the main action and message presented in Read & Listen.",
      feedback: "Connect the lesson's main theme with practical everyday guidance.",
      answer: `${lesson.title}: ${lesson.source.translation.slice(0, 140)}...`,
    });
  }

  return items;
}

const cache = new Map<string, ParsedLessonStages>();

const HADITH_01_CURATED: ParsedLessonStages = {
  overview: {
    title: "What this lesson will help you do",
    purpose:
      "Connect an action with the reason behind it, understand the Hadith's main message, and explain a personal purpose in clear English.",
    estimatedMinutes: 25,
    coreWordsCount: 5,
    outcomes: [
      {
        id: "outcome-1",
        title: "Understand",
        description: "Identify the main message without making detailed religious rulings.",
      },
      {
        id: "outcome-2",
        title: "Build vocabulary",
        description:
          "Learn action, intention, motive, migrate, worldly gain, and connected expressions.",
      },
      {
        id: "outcome-3",
        title: "Express purpose",
        description: "Use to, in order to, and because accurately.",
      },
      {
        id: "outcome-4",
        title: "Use it",
        description: "Give a short, clear example from everyday life.",
      },
    ],
  },
  warmup: {
    title: "One action, different reasons",
    scenario: "Two people help clean the same room.",
    prompt:
      "One wants to support the family. The other wants a reward. Their action looks the same, but their reasons are different.",
    question: "What changes between the two people?",
    choices: ["Their intention or motive", "The physical action", "Nothing changes"],
    feedback:
      "The action can look identical while the intention changes. Keep that contrast in mind as you read and listen.",
    previewTerms: [
      { term: "intention (noun)", meaning: "your clear reason or plan" },
      { term: "intend to (verb)", meaning: "plan to carry out an action" },
      { term: "motive (noun)", meaning: "the internal reason behind an action" },
    ],
  },
  speak: {
    title: "Explain an action and its intention",
    description:
      "Choose a helpful or neutral everyday action. Speak for two or three sentences; your response is private and is not stored.",
    frames: ["I [action]. I did it because [reason]. My intention was to [purpose]."],
    modelDialogue: [
      "I helped my sibling with their studies. I did it because the homework was difficult. My intention was to help them understand.",
    ],
    checklist: [
      "I named the action.",
      "I explained the reason.",
      "I used to, because, intention, or motive.",
      "My pronunciation was easy to understand.",
    ],
  },
  review: [
    {
      question: "What is the main message of the Hadith?",
      answer: "An action is connected to the intention or motive behind it.",
    },
    {
      question: "Can you explain the five core expressions?",
      answer:
        "Action is a deed; intention is a plan or purpose; motive is the internal reason; migrate means move to another place; worldly gain is a material benefit.",
    },
    {
      question: "How do to, in order to, and because express purpose or reason?",
      answer:
        "Use to or in order to before a verb: I study to learn. Use because before a clause: I study because I want to learn.",
    },
    {
      question: "Give a two-sentence everyday example.",
      answer: "I called my friend because they felt worried. My intention was to support them.",
    },
  ],
};

export function getParsedHadithStages(lesson: FigmaHadithLesson): ParsedLessonStages {
  if (lesson.id === "hadith-01") return HADITH_01_CURATED;

  const cached = cache.get(lesson.id);
  if (cached) return cached;

  const parsed: ParsedLessonStages = {
    overview: parseOverview(lesson.stages.overview.text, lesson),
    warmup: parseWarmup(lesson.stages["warm-up"].text, lesson),
    speak: parseSpeak(lesson.stages.speak.text, lesson),
    review: parseReview(lesson.stages["check-review"].text, lesson),
  };

  cache.set(lesson.id, parsed);
  return parsed;
}
