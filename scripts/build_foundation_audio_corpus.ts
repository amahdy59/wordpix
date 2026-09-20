import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import {
  FOUNDATION_LESSONS,
  FOUNDATION_PICTURE_WORDS,
} from "../src/app/learning/foundations/foundationCurriculum.ts";

const require = createRequire(import.meta.url);
const { AUDIO_PROFILE, audioHash, normaliseText } = require("./lib/assetKey.cjs") as {
  AUDIO_PROFILE: { voiceId: string; modelId: string; stability: number; similarityBoost: number };
  audioHash: (text: string, profile?: typeof AUDIO_PROFILE) => string;
  normaliseText: (text: string) => string;
};
const { getPronunciationAssetSpec } = require("./lib/pronunciationOverrides.cjs") as {
  getPronunciationAssetSpec: (text: string, profile: typeof AUDIO_PROFILE) => {
    text: string;
    profile: typeof AUDIO_PROFILE;
  };
};

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "scratch", "foundation_audio_corpus.json");
const rawTexts = FOUNDATION_LESSONS.flatMap((lesson) => [
  ...lesson.models.map((model) => model.audio),
  ...lesson.questions.map((question) => question.audio),
  ...lesson.questions.flatMap((question) => question.options.flatMap((option) => option.audio ? [option.audio] : [])),
  ...(FOUNDATION_PICTURE_WORDS[lesson.id] ?? []).map((item) => item.word),
]);

const entries = [...new Set(rawTexts.map((text) => normaliseText(text)).filter((text) => text.length >= 1))]
  .map((displayText) => {
    const pronunciation = getPronunciationAssetSpec(displayText, AUDIO_PROFILE);
    const text = pronunciation.text;
    return {
      hash: audioHash(text, pronunciation.profile),
      text,
      ...(text !== displayText ? { displayText } : {}),
      ...(pronunciation.profile.modelId !== AUDIO_PROFILE.modelId
        ? { profile: pronunciation.profile }
        : {}),
      tier: "foundations",
      chars: text.length,
    };
  })
  .sort((left, right) => left.text.localeCompare(right.text));

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(entries, null, 2)}\n`, "utf8");

const chars = entries.reduce((sum, entry) => sum + entry.chars, 0);
console.log(`Foundation audio: ${entries.length} unique clips, ${chars.toLocaleString()} characters.`);
console.log(`Wrote ${path.relative(root, output)}.`);
