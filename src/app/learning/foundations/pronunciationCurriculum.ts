import type { FoundationLessonDraft, FoundationQuestion } from "./foundationCurriculum";
import { PRONUNCIATION_IMAGE_FILES } from "./pronunciationImageVersions.ts";

const options = (...labels: string[]): FoundationQuestion["options"] =>
  labels.map((label, index) => ({ value: String(index + 1), label, mediaKind: "symbol" }));

const pronunciationImage = (word: string) => ({
  src: `/word-images/pronunciation/${PRONUNCIATION_IMAGE_FILES[word as keyof typeof PRONUNCIATION_IMAGE_FILES] ?? `${word}.webp`}`,
  alt: word,
});

const photoOptions = (...words: string[]): FoundationQuestion["options"] =>
  words.map((word, index) => ({
    value: String(index + 1),
    label: word,
    image: pronunciationImage(word),
    mediaKind: "photo",
  }));

const question = (
  prompt: string,
  audio: string,
  answer: number,
  labels: readonly string[],
  feedback: string,
  support: string,
  responseMode: FoundationQuestion["responseMode"] = "choice"
): FoundationQuestion => ({
  prompt,
  audio,
  options: options(...labels),
  answer: String(answer),
  correctFeedback: feedback,
  support: ["Listen once more. There is no need to rush.", support],
  responseMode,
});

const orderingQuestion = (
  prompt: string,
  audio: string,
  chunks: readonly string[],
  feedback: string,
  support: string
): FoundationQuestion => ({
  prompt,
  audio,
  responseMode: "ordering",
  options: options(...chunks),
  answer: chunks.map((_, index) => String(index + 1)).join("|"),
  correctFeedback: feedback,
  support: ["Listen once more. There is no need to rush.", support],
});

const photoQuestion = (
  prompt: string,
  audio: string,
  answer: number,
  words: readonly string[],
  feedback: string,
  support: string
): FoundationQuestion => ({
  prompt,
  audio,
  options: photoOptions(...words),
  answer: String(answer),
  correctFeedback: feedback,
  support: ["Listen again. Take your time.", support],
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
  instruction: "Listen, look, and choose. Open the hint only when you want help.",
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
      photoQuestion(
        "Listen, then choose the matching picture.",
        "teacher",
        1,
        ["teacher", "show"],
        "Teacher—nice listening!",
        "Look for the person teaching a class."
      ),
      photoQuestion(
        "Listen, then choose the matching picture.",
        "show",
        2,
        ["teacher", "show"],
        "Show—well matched!",
        "Look for someone presenting or pointing something out."
      ),
      question(
        "Choose the communication goal.",
        "Choose the communication goal.",
        1,
        ["Help people understand me", "Copy one voice exactly"],
        "Yes. The goal is clear communication, not copying an accent.",
        "Choose the goal that helps you share ideas."
      ),
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
      photoQuestion(
        "Listen, then tap the matching picture.",
        "cap",
        1,
        ["cap", "map"],
        "Cap—correct!",
        "Listen for the first sound."
      ),
      photoQuestion(
        "Listen, then tap the matching picture.",
        "map",
        2,
        ["cap", "map"],
        "Map—correct!",
        "The word begins with mmm."
      ),
      photoQuestion(
        "Listen closely, then choose the matching picture.",
        "pig",
        1,
        ["pig", "big"],
        "Pig begins with a quiet puff of air.",
        "Compare the first sound in each word."
      ),
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
      photoQuestion(
        "Listen to the whole word, then choose its picture.",
        "dog",
        1,
        ["dog", "saw"],
        "Dog ends with a clear g sound.",
        "Listen all the way to the end of the word."
      ),
      photoQuestion(
        "Listen to the whole word, then choose its picture.",
        "saw",
        2,
        ["dog", "saw"],
        "Saw ends with an open vowel sound.",
        "Let the word finish before you choose."
      ),
      question(
        "Complete the message: two ___.",
        "Two dogs.",
        2,
        ["dog", "dogs"],
        "Dogs has an ending that tells us there is more than one.",
        "Two means we need the plural ending."
      ),
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
      photoQuestion(
        "Listen for the beginning, then choose the picture.",
        "blue",
        1,
        ["blue", "bread"],
        "Blue begins with two sounds that stay together: bl.",
        "Listen to the beginning: b-l-ue."
      ),
      photoQuestion(
        "Listen for the beginning, then choose the picture.",
        "bread",
        2,
        ["blue", "bread"],
        "Bread begins with br.",
        "Listen to the beginning: b-r-ead."
      ),
      photoQuestion(
        "Listen to the message, then choose what to bring.",
        "Bring green milk.",
        2,
        ["green", "milk"],
        "Milk is the thing to bring.",
        "Use the whole message to find the right picture."
      ),
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
      photoQuestion(
        "Listen, then choose the word with two beats.",
        "teacher",
        1,
        ["teacher", "store"],
        "Teacher has two beats: TEA-cher.",
        "Tap the beats as you listen: TEA-cher."
      ),
      photoQuestion(
        "Listen, then choose the word with one beat.",
        "store",
        2,
        ["teacher", "store"],
        "Store has one strong beat.",
        "One word, one beat: store."
      ),
      question(
        "Listen, then choose the matching beat pattern.",
        "teacher",
        2,
        ["●", "● ·"],
        "Yes: TEA-cher has one strong beat and one lighter beat.",
        "The large dot is the stronger beat.",
        "rhythm"
      ),
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
      photoQuestion(
        "Listen, then choose the word with two beats.",
        "teacher",
        1,
        ["teacher", "rice"],
        "Teacher has two beats: TEA-cher.",
        "Tap once for TEA and once for cher."
      ),
      photoQuestion(
        "Listen, then choose the word with one beat.",
        "rice",
        2,
        ["teacher", "rice"],
        "Rice has one beat.",
        "Say it gently to yourself: rice."
      ),
      question(
        "Listen, then choose the matching beat pattern.",
        "teacher",
        2,
        ["●", "● ·"],
        "Correct: strong TEA, lighter cher.",
        "The word has two parts.",
        "rhythm"
      ),
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
      photoQuestion(
        "Listen closely, then tap pin or pen.",
        "pin",
        1,
        ["pin", "pen"],
        "Pin has the short i sound.",
        "Watch the picture only after you listen."
      ),
      photoQuestion(
        "Listen closely, then tap pin or pen.",
        "pen",
        2,
        ["pin", "pen"],
        "Pen has the short e sound.",
        "Compare the middle sound."
      ),
      photoQuestion(
        "Listen closely, then tap pat, tap, or sap.",
        "sap",
        3,
        ["pat", "tap", "sap"],
        "Sap begins with sss.",
        "Listen to the first sound, then check the picture."
      ),
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
      photoQuestion(
        "Listen, then choose the colour that stands out.",
        "I need the blue one.",
        1,
        ["blue", "brown", "green"],
        "Blue is the important detail.",
        "The colour tells you which one to choose."
      ),
      photoQuestion(
        "Listen, then choose the corrected colour.",
        "Not blue. The green one.",
        3,
        ["blue", "brown", "green"],
        "Green is the corrected information.",
        "Listen for the word after not blue."
      ),
      photoQuestion(
        "Listen, then choose the key colour.",
        "Bring the brown one.",
        2,
        ["blue", "brown", "green"],
        "Brown is the key detail.",
        "The colour carries the new information."
      ),
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
      photoQuestion(
        "Listen to both chunks, then choose the destination.",
        "After lunch, go to the park.",
        1,
        ["park", "house", "store"],
        "Park is the place in the second meaning chunk.",
        "Listen after the short pause."
      ),
      photoQuestion(
        "Listen to both chunks, then choose the destination.",
        "Before dinner, go to the store.",
        3,
        ["park", "house", "store"],
        "Store is the place after the pause.",
        "The message has a time chunk and a place chunk."
      ),
      orderingQuestion(
        "Put the meaning chunks in the order you hear them.",
        "When school ends, go home.",
        ["When school ends", "go home"],
        "The time chunk comes before the action chunk.",
        "Listen for what happens first, then what to do."
      ),
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
      photoQuestion(
        "Listen to the short phrase, then choose the size.",
        "A small dog.",
        1,
        ["small", "big"],
        "Small is linked smoothly to dog.",
        "Listen to the whole phrase, not one sound at a time."
      ),
      photoQuestion(
        "Listen to the short phrase, then choose the size.",
        "A big dog.",
        2,
        ["small", "big"],
        "Big is the important describing word.",
        "Let the short phrase flow naturally."
      ),
      question(
        "Choose the friendlier question melody.",
        "Would you like the small one?",
        2,
        ["Flat command", "Gentle question"],
        "Yes. A gentle rise can help a question sound inviting.",
        "Listen for a question, not a command."
      ),
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
      photoQuestion(
        "Listen to the extra clue, then choose the object.",
        "I mean the key. It opens a door.",
        1,
        ["key", "map", "show"],
        "The extra detail makes key clear.",
        "Use the clue: it opens a door."
      ),
      photoQuestion(
        "Listen, then choose the tool that explains the place.",
        "Let me show you on the map.",
        2,
        ["key", "map", "show"],
        "A map can repair a direction message.",
        "Look for the tool that shows places."
      ),
      question(
        "You did not hear the last word. Choose a kind reply.",
        "Could you say the last word again, please?",
        2,
        ["Speak properly", "Say the last word again, please"],
        "That reply is specific, polite, and useful.",
        "Ask for the exact part you missed."
      ),
    ],
    ["repair strategy", "self-advocacy", "multimodal communication"]
  ),
  lesson(
    "pronunciation-portfolio",
    12,
    "Lesson 13.12 · Pronunciation Communication Check",
    "Communication check",
    "Show what you can understand and use across sounds, stress, phrasing, and communication repair.",
    "A portfolio can show what became easier, which strategies help, and what the learner wants to practise next.",
    "Work independently, use meaning, and take all the time you need. One result never defines communication ability.",
    [
      photoQuestion(
        "Listen for the beginning sound, then choose the matching picture.",
        "cap",
        1,
        ["cap", "map"],
        "Cap begins with the sound you heard.",
        "Compare the first sound in each word."
      ),
      question(
        "Listen for the meaningful ending, then complete the message.",
        "Two dogs.",
        2,
        ["dog", "dogs"],
        "Dogs includes the plural ending needed after two.",
        "Listen through to the end of the word."
      ),
      question(
        "Listen, then choose the matching beat pattern.",
        "teacher",
        2,
        ["●", "● ·"],
        "Teacher has a strong first beat and a lighter second beat.",
        "Tap the two beats as you listen.",
        "rhythm"
      ),
      photoQuestion(
        "Listen for the corrected information, then choose it.",
        "Not blue. The green one.",
        3,
        ["blue", "brown", "green"],
        "Green carries the corrected information.",
        "Listen for the colour after not blue."
      ),
      orderingQuestion(
        "Put the meaning chunks in the order you hear them.",
        "After lunch, go to the park.",
        ["After lunch", "go to the park"],
        "The time chunk comes before the action chunk.",
        "Listen for the short pause between the two ideas."
      ),
      question(
        "Listen, then choose the matching speaking purpose.",
        "Would you like the small one?",
        2,
        ["Flat command", "Gentle question"],
        "The melody supports a friendly question.",
        "Listen to how the voice moves at the end."
      ),
      question(
        "You missed the last word. Choose the collaborative repair.",
        "Could you say the last word again, please?",
        2,
        ["Speak properly", "Say the last word again, please"],
        "This repair is specific, polite, and useful.",
        "Ask for the exact part you missed."
      ),
    ],
    [
      "sound contrasts",
      "meaningful endings",
      "word stress",
      "information focus",
      "meaning chunks",
      "intonation",
      "communication repair",
    ]
  ),
];
