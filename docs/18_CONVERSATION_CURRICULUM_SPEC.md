# Conversation & Debate (B1–C2) Curriculum Specification

## 1. Overview & Pedagogical Purpose

The **Conversation & Debate (B1–C2)** curriculum is a 40-unit spoken English pathway designed for intermediate to advanced learners. The curriculum prioritizes substantive discussion, critical thinking, linguistic nuance, and debate skills over isolated grammar drills.

### CEFR Progression Matrix

- **B1 (Units 01–10) — EXPRESS**: State opinions, give reasons and examples, compare options, agree and disagree politely, make simple joint decisions.
- **B2 (Units 11–20) — DEFEND**: Support claims with evidence, respond to counterarguments, speculate, make concessions, weigh alternatives, persuade.
- **C1 (Units 21–30) — ANALYSE**: Qualify claims, identify assumptions, evaluate evidence, reframe issues, reconcile competing interests, synthesise viewpoints.
- **C2 (Units 31–40) — NAVIGATE**: Define contested concepts, question premises, manage ambiguity, examine second-order consequences, construct nuanced syntheses.

---

## 2. Locked 7-Stage Lesson Architecture

Every unit adheres to a locked 7-stage learning journey:

1. **Stage 1: Warm-Up & Vote (`warmup`)**
   - Central Big Question framed prominently.
   - Three warm-up reflection prompts activating prior knowledge.
   - Quick Vote interactive poll (Choices A, B, C) committing learner to an initial stance.
2. **Stage 2: Read & Understand (`reading`)**
   - High-contrast, level-calibrated article with bolded target terms.
   - Interactive vocabulary tooltips and audio narration.
   - "In Short" takeaway box highlighting 4–8 core concepts.
3. **Stage 3: Language Bank (`vocabulary`)**
   - 10 high-value target vocabulary and expressions with type, definition, example sentence.
   - WordPix image integration: Connected to matching app images from `public/word-images/`.
   - Photorealistic image descriptions preserved for assets to be dropped in.
   - Bilingual English/Arabic translations and audio pronunciation.
4. **Stage 4: Conversation Toolkit (`toolkit`)**
   - Four functional spoken language templates for the lesson's target communication goal.
   - Example dialogues and Arabic equivalents.
5. **Stage 5: Quick Quiz (`quiz`)**
   - 10 interactive multiple-choice questions testing comprehension, vocabulary, and inference.
   - Instant visual/auditory feedback, rationale explanation, and score tracking.
6. **Stage 6: Discussion Studio (`discussion`)**
   - Six progressive discussion prompts ranging from personal experience to abstract debate.
   - Reflection notepad for learner notes.
7. **Stage 7: Speaking Challenge & Graduation (`challenge`)**
   - High-stakes real-world task (e.g. policy panel, negotiation, dilemma).
   - Actionable checklist and useful speech frames reference drawer.
   - Unit completion celebratory graduation and mastery recording (≥80% on quiz).
   - Authoritative research citations link drawer (e.g. Pew Research, PNAS, Nature).

---

## 3. Data Schema & Contracts

### Path: `src/app/learning/conversation/conversationTypes.ts`

```typescript
export type CefrLevel = "B1" | "B2" | "C1" | "C2";

export type ConversationStageId =
  "warmup" | "reading" | "vocabulary" | "toolkit" | "quiz" | "discussion" | "challenge";

export interface LanguageBankItem {
  id: string;
  term: string;
  termAr: string;
  type: "Vocabulary" | "Expression" | "Phrasal verb" | "Idiom / natural expression" | "Collocation";
  meaning: string;
  meaningAr: string;
  example: string;
  imageDescription: string;
  imageSrc?: string;
}

export interface ConversationUnit {
  id: string;
  unitNumber: number;
  level: CefrLevel;
  title: string;
  titleAr: string;
  topic: string;
  topicAr: string;
  speakingSkill: string;
  speakingSkillAr: string;
  heroImage?: string;
  warmup: {
    bigQuestion: string;
    bigQuestionAr: string;
    prompts: { en: string; ar: string }[];
    quickVote: {
      question: string;
      options: { id: string; text: string; textAr: string }[];
    };
  };
  reading: {
    title: string;
    titleAr: string;
    paragraphs: string[];
    inShort: {
      summary: string;
      summaryAr: string;
      targetTerms: string[];
    };
  };
  languageBank: LanguageBankItem[];
  toolkit: {
    title: string;
    functionDescription: string;
    phrases: {
      template: string;
      example: string;
      arabic: string;
    }[];
  };
  quiz: {
    id: string;
    question: string;
    options: { key: "A" | "B" | "C" | "D"; text: string }[];
    correctAnswer: "A" | "B" | "C" | "D";
    explanation?: string;
  }[];
  discussion: {
    id: number;
    title: string;
    prompt: string;
    promptAr: string;
  }[];
  speakingChallenge: {
    title: string;
    scenario: string;
    tasks: string[];
    usefulFrames: string[];
  };
  researchBasis: {
    source: string;
    url: string;
  }[];
}
```

---

## 4. Routing, Navigation & State

### Routes

- `#/conversation` -> Curriculum Overview Hub (`ConversationCurriculumScreen`)
- `#/conversation/:unitId` -> Active Unit (`ConversationLessonScreen`)
- `#/conversation/:unitId/:stage` -> Deep-linked stage in unit

### Learner Progress State (`LearnerContext`)

```typescript
export interface ConversationUnitProgress {
  status: "not-started" | "in-progress" | "mastered";
  completedStages: ConversationStageId[];
  quizBestScore?: number;
  selectedVoteOption?: string;
  lastStudiedAt: string;
}
```

---

## 5. Media & Accessibility Rules

- **No AI image generation**. Connect directly to app images in `public/word-images/` and `public/scene-images/`.
- **WCAG 2.2 AAA Contrast**: ≥ 7:1 for normal text, ≥ 4.5:1 for large text.
- **Hit targets**: Minimum 44×44px for touch and pointer targets.
- **RTL Support**: Full layout mirroring and `font-arabic` styling when Arabic mode is enabled.
- **Screen Reader Announcements**: Polite live regions on stage changes, quiz selections, and vote submissions.
