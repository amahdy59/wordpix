import type {
  FoundationLessonDraft,
  FoundationQuestion,
} from "./foundationCurriculum";

const options = (...labels: string[]): FoundationQuestion["options"] =>
  labels.map((label, index) => ({ value: String(index + 1), label, mediaKind: "symbol" }));

const question = (
  prompt: string,
  audio: string,
  answer: number,
  labels: readonly string[],
  feedback: string,
  support: string
): FoundationQuestion => ({
  prompt,
  audio,
  options: options(...labels),
  answer: String(answer),
  correctFeedback: feedback,
  support: ["Listen once more. There is no need to rush.", support],
});

const sharedNonGoals = [
  "ranking accents as better or worse",
  "requiring native-speaker conformity",
  "diagnosing a speech or reading disorder",
  "using speed or an automated pronunciation score as a gate",
] as const;

const lesson = (
  id: FoundationLessonDraft["id"],
  number: number,
  title: string,
  shortTitle: string,
  goal: string,
  modelAudio: string,
  modelExplanation: string,
  questions: readonly FoundationQuestion[],
  evidenceDimensions: readonly string[]
): FoundationLessonDraft => ({
  id,
  level: 13,
  unitId: "13.1",
  number,
  title,
  shortTitle,
  goal,
  instruction: "Listen, notice what supports understanding, and choose the response that helps communication.",
  audioOnly: false,
  prerequisites: [],
  completionMode: "qualitative-routing",
  reviewStatus: "pilot",
  evidenceDimensions,
  nonGoals: sharedNonGoals,
  models: [{ audio: modelAudio, explanation: modelExplanation }],
  questions,
});

export const PRONUNCIATION_LESSON_DRAFTS: readonly FoundationLessonDraft[] = [
  lesson(
    "pronunciation-goals",
    1,
    "Lesson 13.1 · Accents, Communication, and My Goals",
    "My communication goals",
    "Understand that accents are part of identity and choose a useful personal communication goal—or no change.",
    "People can say the same message in different ways. Your accent is part of your language story.",
    "The goal is easier communication when it matters to the learner, never erasing an accent.",
    [
      question("Which idea respects every speaker?", "Every accent is a real way of speaking.", 1, ["Accents are part of identity", "One accent is best"], "Exactly. Accents are part of language identity.", "Choose the statement that does not rank people."),
      question("Which goal is about communication?", "I want my group to understand my idea without asking me to repeat it.", 2, ["Sound exactly like one model", "Be understood in group work"], "Yes. That goal is practical and learner chosen.", "Look for the goal connected to participation."),
      question("What may a learner choose?", "My communication already works well for me.", 2, ["A compulsory new accent", "No change needed"], "Correct. No change needed is a valid outcome.", "A child may decide that communication is already effective."),
    ],
    ["respectful language", "goal selection", "communication awareness"]
  ),
  lesson(
    "meaningful-contrasts",
    2,
    "Lesson 13.2 · Notice and Use Meaningful Sound Contrasts",
    "Meaningful contrasts",
    "Notice a sound difference only when it changes meaning in the learner's accepted English variety.",
    "A sound contrast matters when it changes the message for the people communicating.",
    "Context and meaning come first. Legitimate dialect mergers are not errors.",
    [
      question("What should we check first?", "Did the sound difference change the message in this conversation?", 1, ["Whether meaning changed", "Whether the speaker copied one accent"], "Right. Communication meaning decides whether a contrast matters.", "Focus on the message, not imitation."),
      question("The listener heard the intended word from context. What helped?", "Please put the cup on the table.", 2, ["A speed score", "The sentence context"], "Yes. Context supports understanding.", "Think about the surrounding words."),
      question("What if a contrast does not exist in the learner's dialect?", "Do not score a legitimate dialect pattern as wrong.", 1, ["Accept the dialect pattern", "Force a different accent"], "Correct. Established dialect patterns are accepted.", "Choose the respectful, communication-based response."),
    ],
    ["listening discrimination", "meaning", "dialect awareness"]
  ),
  lesson(
    "clear-word-endings",
    3,
    "Lesson 13.3 · Clear Word Endings When They Matter",
    "Clear word endings",
    "Notice when a word ending carries meaning and use context to make the message easier to understand.",
    "Small endings can carry important meaning, such as one cat or two cats.",
    "The lesson values understandable meaning, not exaggerated or unnatural speech.",
    [
      question("Which ending shows more than one?", "Two cats are sleeping.", 2, ["cat", "cats"], "Yes. The final sound helps show plural meaning.", "Listen for the word that means more than one."),
      question("Which message talks about the past?", "Yesterday, we walked home.", 2, ["We walk home", "We walked home"], "Correct. The ending supports the time meaning.", "Use yesterday as a context clue."),
      question("What is the best retry?", "Say the whole message a little more clearly, without shouting.", 1, ["Use a clear whole message", "Repeat one ending many times"], "Exactly. Clear, natural messages are the goal.", "Choose the response that preserves natural communication."),
    ],
    ["morphological endings", "message clarity", "self-monitoring"]
  ),
  lesson(
    "consonant-sequences",
    4,
    "Lesson 13.4 · Consonant Sequences in Useful Messages",
    "Consonant sequences",
    "Keep important sounds in familiar word sequences when omitting them could obscure the message.",
    "In the message, please bring the blue plate, every word helps the listener know what to do.",
    "Learners may listen, point, type, sign, or speak. Production is optional unless it is the chosen goal.",
    [
      question("Which strategy helps with a difficult sequence?", "Say the word in a short useful phrase, then return to the full message.", 1, ["Use a short meaningful phrase", "Race through the word"], "Yes. A meaningful phrase supports the whole message.", "Choose the strategy without speed pressure."),
      question("What should stay most important?", "The listener understands the intended message.", 2, ["Perfect imitation", "The intended message"], "Correct. Understanding is the priority.", "Think about the purpose of speaking."),
      question("Which is an accessible response?", "Point to the words you heard in the message.", 2, ["Speaking is always required", "Pointing to the heard words"], "Yes. Pointing can show listening without requiring speech.", "Choose the option that measures listening directly."),
    ],
    ["sequence perception", "message transfer", "accessible response"]
  ),
  lesson(
    "word-stress",
    5,
    "Lesson 13.5 · Word Stress and Meaning",
    "Word stress and meaning",
    "Notice which syllable is prominent when stress helps a listener identify a familiar word.",
    "Longer words have a beat that listeners often notice more strongly.",
    "Stress is taught through familiar words and meaning, never as a reason to reject a legitimate accent.",
    [
      question("What is word stress?", "One syllable is usually more prominent than the others.", 1, ["A more noticeable syllable", "Every syllable shouted"], "Right. One syllable is more noticeable.", "Prominent means it stands out naturally."),
      question("Which practice is most useful?", "Hear the word, tap its beats, then use it in a sentence.", 2, ["Repeat without meaning", "Tap beats and use the word"], "Yes. Rhythm plus meaning supports memory.", "Choose the practice connected to a real word and message."),
      question("What evidence matters?", "The listener identifies the intended familiar word with reasonable effort.", 1, ["The intended word is understood", "The learner copies one voice exactly"], "Correct. Functional understanding is the evidence.", "Look for communication evidence."),
    ],
    ["stress perception", "word identification", "meaning"]
  ),
  lesson(
    "syllable-prominence",
    6,
    "Lesson 13.6 · Strong and Less-Prominent Syllables",
    "Strong and quiet beats",
    "Hear how syllables can differ in prominence while the whole word remains understandable.",
    "Some beats stand out and some are lighter. Together they make the rhythm of the word.",
    "Reduced syllables are explored through listening and familiar vocabulary, not rigid accent rules.",
    [
      question("How can syllables differ?", "One beat may stand out while another is lighter.", 1, ["Some are more prominent", "All must be equally loud"], "Exactly. Natural rhythm includes different prominence.", "Listen for natural differences, not shouting."),
      question("What supports learning?", "Use a familiar word, tap the beats, and keep the meaning clear.", 2, ["Use unfamiliar nonsense only", "Use a familiar meaningful word"], "Yes. Familiar meaning reduces unnecessary memory load.", "Choose the option grounded in known vocabulary."),
      question("Which response can show understanding?", "Move one large counter and one small counter for the two beats.", 2, ["Speech only", "Large and small counters"], "Correct. Counters provide a non-speaking response.", "Look for an accessible way to show prominence."),
    ],
    ["syllable awareness", "prominence", "multimodal response"]
  ),
  lesson(
    "vowel-clarity",
    7,
    "Lesson 13.7 · Vowel Contrasts When They Matter",
    "Vowels in context",
    "Use context to notice vowel contrasts that repeatedly affect understanding for this learner.",
    "We practise a vowel contrast only when it matters for meaning in a real communication context.",
    "Accepted dialect patterns and mergers are documented and never penalized.",
    [
      question("When should a vowel contrast become a target?", "It repeatedly changes or obscures an important message.", 1, ["When it affects meaning", "Whenever it differs from one model"], "Correct. A target must be communication relevant.", "Choose meaning over accent matching."),
      question("What should happen before scoring a pair?", "Check whether both words and their meanings are familiar.", 2, ["Start a timer", "Check vocabulary"], "Yes. Unknown vocabulary cannot provide fair evidence.", "Separate word knowledge from sound perception."),
      question("What if the learner's dialect merges the contrast?", "Use another communication-relevant target instead.", 1, ["Choose another target", "Mark every answer wrong"], "Exactly. Legitimate mergers are not errors.", "Respect the learner's accepted English variety."),
    ],
    ["vowel perception", "context use", "dialect awareness"]
  ),
  lesson(
    "important-information",
    8,
    "Lesson 13.8 · Highlighting Important Information",
    "Highlight key information",
    "Notice and choose the word that carries the most important new information in a message.",
    "Speakers can make an important word stand out so the listener catches the key idea.",
    "Prominence is flexible and meaning-driven; there is no single accent pattern to copy.",
    [
      question("I asked for the blue cup, not the red cup. Which word needs emphasis?", "I asked for the blue cup.", 1, ["blue", "cup"], "Yes. Blue carries the corrected information.", "Which detail changes the listener's choice?"),
      question("Meet me on Tuesday, not Thursday. Which word is new?", "Meet me on Tuesday.", 2, ["meet", "Tuesday"], "Correct. Tuesday is the important correction.", "Choose the detail that contrasts with Thursday."),
      question("What may a learner do instead of speaking?", "Select the important word on the screen.", 2, ["Lose the lesson", "Select the key word"], "Yes. Selection demonstrates meaning without requiring speech.", "Choose a response that measures comprehension."),
    ],
    ["information focus", "listening comprehension", "pragmatic meaning"]
  ),
  lesson(
    "meaning-chunks",
    9,
    "Lesson 13.9 · Meaning Chunks and Phrasing",
    "Meaning chunks",
    "Group a message into short meaning units that reduce listener effort.",
    "A short pause can help the listener hear where one idea ends and the next begins.",
    "Phrasing supports meaning; learners are not rewarded for dramatic performance or speed.",
    [
      question("Where is a helpful meaning break?", "After lunch, we will visit the library.", 1, ["After lunch | we will visit the library", "After | lunch we | will visit"], "Right. The break separates two meaningful parts.", "Keep words that belong to one idea together."),
      question("Why use meaning chunks?", "They can make a longer message easier to follow.", 2, ["To speak faster", "To reduce listener effort"], "Yes. Chunks help the listener follow the idea.", "Think about the listener's work."),
      question("Which practice is accessible?", "Drag words into two meaning groups.", 1, ["Group written words", "Require a recording"], "Correct. Grouping demonstrates phrasing without mandatory speech.", "Choose the non-speaking option."),
    ],
    ["phrasing", "syntax", "listener effort"]
  ),
  lesson(
    "connected-speech",
    10,
    "Lesson 13.10 · Connected Speech, Intonation, and Flexible Pacing",
    "Connected speech",
    "Notice how pacing and intonation support meaning while keeping communication natural and flexible.",
    "Connected speech can sound smooth without becoming rushed. The message still needs room to breathe.",
    "Natural variation is expected. Speed is never the sole goal or gate.",
    [
      question("Which pacing supports a complex message?", "Use a comfortable pace and pause at a meaning boundary.", 1, ["Comfortable pace with useful pauses", "As fast as possible"], "Exactly. Flexible pacing supports the message.", "Choose the strategy based on meaning."),
      question("What can rising intonation sometimes signal?", "The speaker may be checking or asking a question.", 2, ["A spelling error", "A question or check"], "Yes. Intonation can help signal speaker intent.", "Listen for what the speaker is doing socially."),
      question("What is valid evidence?", "The listener follows the intended message without unusual effort.", 1, ["The message is easy to follow", "A maximum words-per-minute score"], "Correct. Comprehensibility matters more than raw speed.", "Choose listener-centered evidence."),
    ],
    ["pacing", "intonation", "comprehensibility"]
  ),
  lesson(
    "communication-repair",
    11,
    "Lesson 13.11 · Collaborative Communication Repair",
    "Repair the message",
    "Use respectful strategies when a listener does not understand the first time.",
    "Communication repair is teamwork. A speaker can repeat, rephrase, point, type, or add context.",
    "A repair request is not proof that an accent or speaker is wrong.",
    [
      question("The listener looks unsure. What can the speaker do?", "Say it another way and add a helpful detail.", 1, ["Rephrase and add context", "Speak much louder"], "Yes. Rephrasing is a useful repair strategy.", "Choose the strategy that adds information."),
      question("Which listener response is respectful?", "Could you say the last part again, please?", 2, ["Your accent is wrong", "Could you repeat the last part?"], "Correct. A specific, polite request supports teamwork.", "Choose the request that identifies what is needed."),
      question("Which tools may support repair?", "A picture, gesture, typed word, or another sentence.", 2, ["Only repeating louder", "Pictures, gestures, or text"], "Exactly. Communication can use many modes.", "Look for flexible ways to share meaning."),
    ],
    ["repair strategy", "self-advocacy", "multimodal communication"]
  ),
  lesson(
    "pronunciation-portfolio",
    12,
    "Lesson 13.12 · Pronunciation Growth Portfolio",
    "My growth portfolio",
    "Reflect on communication growth using learner-selected evidence and choose an appropriate next step.",
    "A portfolio can show what became easier, which strategies help, and what the learner wants to practise next.",
    "Recordings are optional and private by default. One score never defines communication ability.",
    [
      question("What belongs in a useful portfolio?", "A message, a reflection, and the strategy that helped.", 1, ["Evidence plus reflection", "Only one speed score"], "Yes. Multiple kinds of evidence show growth more fairly.", "Choose evidence that explains both performance and strategy."),
      question("Who helps choose the next goal?", "The learner chooses with appropriate adult support when needed.", 2, ["An automatic score alone", "The learner with support"], "Correct. Goals require learner voice and assent.", "Choose the option that includes the child in the decision."),
      question("Which outcome is valid?", "My communication is effective, so I will keep using my successful strategies.", 2, ["I must erase my accent", "My current strategies work"], "Exactly. Effective communication is a successful outcome.", "No accent change is required when communication works."),
    ],
    ["reflection", "strategy use", "learner agency", "transfer"]
  ),
];
