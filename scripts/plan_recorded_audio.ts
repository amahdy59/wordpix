/** Read-only content/R2 audit. Writes only local planning artifacts in output/. */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { COURSE_UNITS } from "../src/app/data/courseCatalog";
import { loadUnitVocabulary } from "../src/app/data/vocabulary";
import { loadLearningMaterials } from "../src/app/learning/registry";
import { getRichSentence, buildSentenceCompletion } from "../src/app/exercises/exerciseContent";
import { sentenceCloze } from "../src/app/exercises/sentenceCloze";
import { enrichReferenceLesson } from "../src/app/data/referenceUnitEnrichment";
import { applyLessonLearningContexts } from "../src/app/data/sceneLearningContext.mjs";
import { PLACEMENT_ITEMS } from "../src/app/onboarding/placementRecommendation";
import { HADITH_LESSONS } from "../src/app/learning/hadith/hadithCurriculum";
import {
  getHadithAudioAssets,
  getHadithRecordedSource,
} from "../src/app/learning/hadith/hadithAudioManifest";
import { LISTENING_EXERCISES } from "../src/app/exercises/content/listeningTasks";
import { SPEAKING_EXERCISES } from "../src/app/exercises/content/speakingWritingTasks";
import {
  edgeRecordingPayload,
  EDGE_VOICES,
  normalizeRecordingText,
} from "../src/app/shared/edgeRecording";
import {
  unitUsageDataSchema,
  unitUsageApprovalDataSchema,
  unitUsagePhraseDataSchema,
  type LessonUsageData,
} from "../src/app/data/usageTypes";
import { getOrGenerateStoryBundle } from "../src/app/data/storyTalesDictionary";
import {
  getLexiconEntry,
  getReviewedCollocations,
  type LexiconEntry,
} from "../src/app/data/lexiconCore";
import { CAN_DO_SCENARIOS } from "../src/app/data/canDoScenarios";
import { parseHadithVocabulary } from "../src/app/learning/hadith/hadithVocabularyContent";
import { getParsedHadithStages } from "../src/app/learning/hadith/hadithLessonContent";
import {
  CURRICULUM_AUDIO_MANIFEST,
  cleanCurriculumTerm,
  getCurriculumAudioKey,
} from "../src/app/learning/shared/curriculumAudioManifest";
import { FIGMA_PRONUNCIATION_LESSONS } from "../src/app/learning/foundations/figmaPronunciationCatalog";
import { getPronunciationAudioClip } from "../src/app/learning/foundations/pronunciationAudioManifest";
import { getAuthoredWord } from "../src/app/exercises/content/authoredLessonContent";

const require = createRequire(import.meta.url);
const { audioHash } = require("./lib/assetKey.cjs");
const { recordingInputsDigest } = require("./lib/recording_inputs.cjs");
const directory = path.resolve("output/recorded-audio");
fs.mkdirSync(directory, { recursive: true });
const profile = {
  voiceId: "XfNU2rGpBa01ckF309OY",
  modelId: "eleven_turbo_v2_5",
  stability: 0.7,
  similarityBoost: 0.75,
};
const profiles = [
  profile,
  { ...profile, modelId: "eleven_v4" },
  { ...profile, voiceId: "Xb7hH8MSUJpSbSDYk0k2" },
];
type Candidate = { text: string; language: "en" | "ar"; sources: string[]; keys: string[] };
const candidates = new Map<string, Candidate>();
function add(raw: unknown, source: string, language: "en" | "ar" = "en", explicit?: string) {
  if (typeof raw !== "string") return;
  const text = normalizeRecordingText(raw);
  if (!/[\p{L}\p{N}]/u.test(text) || text.includes("http") || /\{[\w]+\}/u.test(text)) return;
  const identity = `${language}\0${text}`;
  const item = candidates.get(identity) ?? { text, language, sources: [], keys: [] };
  if (item.sources.length < 4 && !item.sources.includes(source)) item.sources.push(source);
  if (explicit && !item.keys.includes(explicit)) item.keys.push(explicit);
  candidates.set(identity, item);
}
function prompt(text: string, source: string) {
  for (const part of text.split(/(?:_{2,}\s*)+/u)) add(part, source);
}
const spokenFields = new Set([
  "label",
  "term",
  "exampleUsage",
  "collocations",
  "exampleSentence",
  "word",
  "context",
  "text",
  "en",
  "phrase",
  "example",
  "scenario",
  "explanation",
  "modelResponseEn",
  "audioText",
  "noun",
  "verb",
  "adj",
  "adjective",
  "adv",
  "adverb",
]);
function walk(value: unknown, source: string, field = "") {
  if (typeof value === "string") {
    if (spokenFields.has(field)) prompt(value, source);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walk(item, source, field);
    return;
  }
  if (value && typeof value === "object")
    for (const [key, item] of Object.entries(value)) walk(item, source, key);
}
for (const item of PLACEMENT_ITEMS) if (item.audio) prompt(item.prompt, "placement");
for (const [source, exercises] of [
  ["listening-tasks", LISTENING_EXERCISES],
  ["speaking-tasks", SPEAKING_EXERCISES],
] as const) {
  for (const exercise of Object.values(exercises))
    for (const task of exercise.tasks) if ("audioText" in task) add(task.audioText, source);
}
walk(CAN_DO_SCENARIOS, "can-do");
for (const lesson of HADITH_LESSONS) {
  for (const item of parseHadithVocabulary(lesson.stages.vocabulary.text, lesson.number)) {
    const text = cleanCurriculumTerm(item.term);
    add(text, `hadith-vocabulary:${lesson.id}`, "en", getCurriculumAudioKey(text) ?? undefined);
  }
  const speak = getParsedHadithStages(lesson).speak.modelDialogue.join(" ");
  if (speak) add(speak, `hadith-speak:${lesson.id}`);
  else add(lesson.source.translation.split(/(?<=[.!?])\s+/)[0], `hadith-review:${lesson.id}`);
  const recorded = getHadithRecordedSource(lesson.id);
  const assets = getHadithAudioAssets(lesson.id);
  add(
    lesson.source.arabic,
    `hadith:${lesson.id}`,
    "ar",
    recorded?.arabic === lesson.source.arabic ? assets?.arabic.objectKey : undefined
  );
  add(
    lesson.source.translation,
    `hadith:${lesson.id}`,
    "en",
    recorded?.translation === lesson.source.translation ? assets?.translation.objectKey : undefined
  );
}
// Immutable specialist references are audited by their authored transcript and key.
for (const clip of Object.values(CURRICULUM_AUDIO_MANIFEST.clips))
  add(clip.synthesisText, `specialist-reference:${clip.category}`, "en", clip.objectKey);
for (const lesson of FIGMA_PRONUNCIATION_LESSONS)
  for (const item of lesson.images) {
    for (const transfer of [false, true]) {
      const clip = getPronunciationAudioClip(item.label, transfer);
      if (clip) add(clip.synthesisText, `pronunciation:${lesson.number}`, "en", clip.objectKey);
    }
  }
for (const text of [
  "Light switch.",
  "Vase.",
  "Hello! Welcome to WordPix.",
  "Bed. The lamp is on the nightstand beside the bed.",
])
  add(text, "settings-preview");
const dictionary: Record<string, LexiconEntry> = {};
const stories: Record<string, string> = {};
const lexiconModules = import.meta.glob<{ entries: Record<string, LexiconEntry> }>(
  "../src/app/data/contentChunks/lexicon-*.ts"
);
const storyModules = import.meta.glob<{ stories: Record<string, string> }>(
  "../src/app/data/contentChunks/story-*.ts"
);
for (const name of fs.readdirSync("src/app/data/contentChunks")) {
  if (/^lexicon-\d+\.ts$/.test(name))
    Object.assign(
      dictionary,
      (await lexiconModules[`../src/app/data/contentChunks/${name}`]()).entries
    );
  if (/^story-.*\.ts$/.test(name))
    Object.assign(stories, (await storyModules[`../src/app/data/contentChunks/${name}`]()).stories);
}
for (const unit of Object.values(COURSE_UNITS)) {
  const words = await loadUnitVocabulary(unit.id);
  const materials = await loadLearningMaterials(unit.id);
  walk(words, `vocabulary:${unit.id}`);
  if (materials) {
    add(materials.passage?.text, `materials:${unit.id}`);
    walk(materials.phrases, `materials:${unit.id}`);
    walk(materials.dialogue?.lines, `materials:${unit.id}`);
    for (const entry of materials.wordMeta ?? []) add(entry.word, `materials:${unit.id}`);
  }
  const usagePath = `src/app/data/usage/${unit.id}.usage.json`;
  const approvalPath = `src/app/data/usageApprovals/${unit.id}.approval.json`;
  const approved = new Set(
    fs.existsSync(approvalPath)
      ? unitUsageApprovalDataSchema
          .parse(JSON.parse(fs.readFileSync(approvalPath, "utf8")))
          .filter((item) => item.unitId === unit.id)
          .map((item) => item.lessonId)
      : []
  );
  const phrasePath = `src/app/data/usagePhrases/${unit.id}.phrases.json`;
  const phrases = fs.existsSync(phrasePath)
    ? unitUsagePhraseDataSchema.parse(JSON.parse(fs.readFileSync(phrasePath, "utf8")))
    : [];
  const usage: LessonUsageData[] = fs.existsSync(usagePath)
    ? unitUsageDataSchema
        .parse(JSON.parse(fs.readFileSync(usagePath, "utf8")))
        .map(enrichReferenceLesson)
        .filter(
          (lesson) =>
            approved.has(lesson.lessonId) &&
            lesson.targetWordsArabic.every(
              (translation) =>
                !/(?:يُسمّى|مصطلح مرتبط بالموضوع|جزء يُسمّى|شخص يُسمّى)/u.test(translation)
            )
        )
        .map((lesson) => {
          const sceneIds = new Set(
            lesson.usage.scenes.map(
              (scene) => `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`
            )
          );
          const slots = new Set<string>();
          return {
            ...lesson,
            usage: {
              ...lesson.usage,
              phrases: phrases.filter((phrase) => {
                if (
                  phrase.lessonId !== lesson.lessonId ||
                  phrase.unitId !== unit.id ||
                  !sceneIds.has(phrase.sceneId) ||
                  slots.has(phrase.slot)
                )
                  return false;
                slots.add(phrase.slot);
                return true;
              }),
            },
          };
        })
        .map(applyLessonLearningContexts)
    : [];
  for (const lesson of usage) {
    add(lesson.reading.text, `usage:${unit.id}`);
    for (const scene of lesson.usage.scenes) add(scene.scenario, `usage:${unit.id}`);
    for (const phrase of lesson.usage.phrases) {
      add(phrase.phrase, `usage:${unit.id}`);
      add(phrase.example, `usage:${unit.id}`);
    }
  }
  if (materials?.dialogue)
    add(
      materials.dialogue.lines.map((line) => `${line.speaker}: ${line.text}`).join(". "),
      `materials-dialogue:${unit.id}`
    );
  for (const word of words) {
    const entry = getLexiconEntry(dictionary, word.id, word.label, unit.id);
    const example =
      getAuthoredWord(word.id)?.sentence.full ?? word.exampleUsage ?? entry.exampleSentence;
    if (example) add(example, `word-details:${unit.id}`);
    else if (word.arabicTranslation === undefined)
      for (const sentence of entry.sentences) add(sentence.en, `word-details:${unit.id}`);
    for (const phrase of getReviewedCollocations(entry)) add(phrase, `collocations:${unit.id}`);
    for (const phrase of entry.phrasalVerbs ?? []) add(phrase.phrase, `phrasal-verbs:${unit.id}`);
    walk(entry.wordFamily, `word-family:${unit.id}`);
  }
  for (const group of unit.groups)
    for (const id of group.wordIds) {
      const word = words.find((item) => item.id === id);
      if (!word) continue;
      const lesson = usage.find((item) => item.lessonId === group.id);
      for (const context of [undefined, lesson])
        for (const index of [0, 1]) {
          const sentence = getRichSentence(word, context, index).full;
          add(sentence, `sentence:${group.id}`);
          if (index === 0) prompt(sentenceCloze(sentence, word.label), `cloze:${group.id}`);
          const completion = buildSentenceCompletion(sentence, word.label);
          if (index === 1)
            prompt(
              completion.tokens
                .map((token, tokenIndex) =>
                  tokenIndex >= completion.blankStart &&
                  tokenIndex < completion.blankStart + completion.answer.length
                    ? "____"
                    : token
                )
                .join(" "),
              `construction:${group.id}`
            );
        }
    }
  for (const group of unit.groups) {
    const groupWords = group.wordIds
      .map((id) => words.find((word) => word.id === id))
      .filter((word) => !!word);
    const lesson = usage.find((item) => item.lessonId === group.id);
    add(lesson?.reading.text ?? stories[group.id], `reading:${group.id}`);
    for (const context of [undefined, lesson]) {
      const bundle = getOrGenerateStoryBundle(group.id, group.name, groupWords, context);
      for (const passage of bundle.passages)
        add(`${passage.title}. ${passage.text}`, `story:${group.id}`);
      add(
        bundle.passages.map((passage) => `${passage.title}. ${passage.text}`).join(". "),
        `story-full:${group.id}`
      );
      for (const question of bundle.quiz) add(question.explanation, `story-quiz:${group.id}`);
    }
    if (groupWords.length >= 2) {
      const lines = [
        {
          speaker: "Alex",
          text: `Have you seen the new ${groupWords[0].label.toLowerCase()} over there?`,
        },
        {
          speaker: "Sam",
          text: `Yes! It looks great next to the ${groupWords[1].label.toLowerCase()}.`,
        },
        ...(groupWords[2]
          ? [
              {
                speaker: "Alex",
                text: `We should also check the ${groupWords[2].label.toLowerCase()} before we finish.`,
              },
            ]
          : []),
        ...(groupWords[3]
          ? [
              {
                speaker: "Sam",
                text: `Good idea, let's put it near the ${groupWords[3].label.toLowerCase()}.`,
              },
            ]
          : []),
      ];
      for (const line of lines) add(line.text, `story-dialogue:${group.id}`);
      add(
        lines.map((line) => `${line.speaker} says: ${line.text}`).join(". "),
        `story-dialogue-full:${group.id}`
      );
    }
  }
}
for (const domain of ["business", "conversation"]) {
  const data = JSON.parse(
    fs.readFileSync(`src/app/learning/${domain}/${domain}Catalog.json`, "utf8")
  );
  for (const unit of data) {
    walk(unit.languageBank, domain);
    if (domain === "conversation") {
      add(unit.warmup.bigQuestion, domain);
      for (const phrase of unit.toolkit.phrases) add(phrase.example, domain);
      for (const paragraph of unit.reading.paragraphs) add(paragraph, domain);
      add(`${unit.reading.title}. ${unit.reading.paragraphs.join(" ")}`, domain);
    } else {
      add(unit.mainInput.context, domain);
      for (const line of unit.mainInput.dialogue) add(line.text, domain);
      add(
        `${unit.mainInput.title}. ${unit.mainInput.context} ${unit.mainInput.dialogue.map((line: { text: string }) => line.text).join(" ")}`,
        domain
      );
    }
  }
}
// Existing reading takes include their exact transcript, so keep those preferred.
for (const domain of ["business", "conversation"]) {
  const data = JSON.parse(
    fs.readFileSync(`src/app/learning/${domain}/${domain}ReadingAudioManifest.json`, "utf8")
  );
  for (const unit of Object.values(data.units) as {
    full?: { text: string; key: string };
    paragraphs: { text: string; key: string }[];
  }[]) {
    for (const entry of [unit.full, ...unit.paragraphs])
      if (entry) add(entry.text, `${domain}-recording`, "en", entry.key);
  }
}
const feedback = JSON.parse(fs.readFileSync("src/app/exercises/feedbackPhrases.json", "utf8"));
for (const text of [...feedback.correct, ...feedback.incorrect]) add(text, "feedback");

const snapshot = process.argv.find((arg) => arg.startsWith("--r2-list="))?.slice(10);
let keys: string[];
if (snapshot) keys = JSON.parse(fs.readFileSync(snapshot, "utf8")).keys;
else {
  require("./lib/env.cjs").loadEnv();
  const client = require("./lib/r2.cjs").createClient();
  await require("./lib/recording_bucket.cjs").assertRecordingBucket(client);
  keys = [...(await client.list("audio/")), ...(await client.list("assets/audio/scenarios/"))];
}
for (const name of fs.readdirSync("src/app/data/scenarios"))
  if (/^curriculumScenarios\.units-.*\.json$/.test(name)) {
    const scenarios = JSON.parse(fs.readFileSync(`src/app/data/scenarios/${name}`, "utf8"));
    for (const scenario of scenarios)
      for (const line of scenario.lines)
        add(line.text, `scenario:${scenario.lessonId}`, "en", line.clipRelativePath);
  }
fs.writeFileSync(
  path.join(directory, "r2-snapshot.json"),
  JSON.stringify({ checkedAt: new Date().toISOString(), keys })
);
const existing = new Set(keys);
const rows = [...candidates.values()].map((item) => {
  const capitalized = item.text.charAt(0).toUpperCase() + item.text.slice(1);
  const legacyKeys = [item.text, capitalized].flatMap((text) =>
    profiles.map((profile) => {
      const hash = audioHash(text, profile);
      return `audio/${hash.slice(0, 2)}/${hash}.mp3`;
    })
  );
  const hash = crypto
    .createHash("sha256")
    .update(edgeRecordingPayload(item.text, item.language))
    .digest("hex");
  const edgeKey = `audio/edge-v1/${EDGE_VOICES[item.language]}/${hash}.mp3`;
  const existingKey = [...item.keys, ...legacyKeys, edgeKey].find((key) => existing.has(key));
  return { ...item, existingKey: existingKey ?? null, edgeKey };
});
const missing = rows.filter((item) => !item.existingKey);
fs.writeFileSync(
  path.join(directory, "plan.json"),
  JSON.stringify(
    { generatedAt: new Date().toISOString(), inputsDigest: recordingInputsDigest(), rows },
    null,
    2
  )
);
fs.writeFileSync(path.join(directory, "missing.json"), JSON.stringify(missing, null, 2));
console.log(
  JSON.stringify(
    {
      candidates: rows.length,
      existingRecordings: rows.length - missing.length,
      missing: missing.length,
      missingCharacters: missing.reduce((sum, item) => sum + item.text.length, 0),
      examples: missing.slice(0, 8).map(({ text, sources }) => ({ text, sources })),
    },
    null,
    2
  )
);
