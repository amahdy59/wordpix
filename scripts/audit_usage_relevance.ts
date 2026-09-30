import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { LEXICON_DICTIONARY } from "../src/app/data/lexiconDictionary";
import {
  getLexiconEntry,
  getReviewedCollocations,
  hasReviewedLexiconExamples,
} from "../src/app/data/lexiconCore";
import { loadLearningMaterials } from "../src/app/learning/registry";
import type { UnitLearningMaterials } from "../src/app/learning/types";

interface UsageScene {
  targetWords: string | string[];
  scenario: string;
}

interface UsageLesson {
  lessonId: string;
  unitId: string;
  cefrStage: string;
  usage: { scenes: UsageScene | UsageScene[] };
}

const GENERIC_PATTERNS = [
  /\bdeal with\b/iu,
  /\bbelongs? to a different part\b/iu,
  /\bnaturally belong in the same\b/iu,
  /\bdraws? attention to\b/iu,
  /\bconnects? the words? to\b/iu,
  /\bplaces? .+ in one coherent situation\b/iu,
  /\bhas a clear role\b/iu,
  /\bwith each word connected to\b/iu,
  /\buses? or discusses?\b/iu,
  /\buses? or notices?\b/iu,
  /\bcan see(?:, use, or do|, use, or meet| or use)\b/iu,
];

function asArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

function wordId(label: string): string {
  return label
    .normalize("NFKD")
    .replace(/\p{Mark}/gu, "")
    .toLocaleLowerCase()
    .replace(/&/gu, " and ")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

const files = (await readdir("src/app/data/usage")).filter((name) => name.endsWith(".usage.json"));
const lessons: UsageLesson[] = [];
for (const filename of files) {
  const source = await readFile(path.join("src/app/data/usage", filename), "utf8");
  lessons.push(...JSON.parse(source.replace(/^\uFEFF/u, "")));
}

let scenes = 0;
let genericScenes = 0;
let targetSlots = 0;
let examples = 0;
let reviewedExamples = 0;
let collocations = 0;
const missing = new Map<string, number>();
const genericByLevel = new Map<string, number>();
let scenesCoveredByRichMaterials = 0;
let scenesCoveredByOneSource = 0;
let genericScenesCoveredByRichMaterials = 0;

function normalized(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Mark}/gu, "")
    .toLocaleLowerCase()
    .replace(/[’']/gu, "'")
    .replace(/[^a-z0-9'&-]+/gu, " ")
    .trim();
}

function containsTarget(text: string, target: string): boolean {
  const haystack = ` ${normalized(text).replace(/-/gu, " ")} `;
  const needle = normalized(target).replace(/-/gu, " ");
  if (haystack.includes(` ${needle} `)) return true;

  // Permit the common plural in authored prose while avoiding broad stemming.
  if (!needle.includes(" ")) {
    return haystack.includes(` ${needle}s `) || haystack.includes(` ${needle}es `);
  }
  return false;
}

function richMaterialTexts(materials: UnitLearningMaterials | null): string[] {
  if (!materials) return [];
  return [
    materials.passage?.text,
    materials.dialogue?.scene,
    ...(materials.dialogue?.lines.map((line) => line.text) ?? []),
    ...(materials.phrases?.flatMap((entry) => [entry.phrase, entry.example]) ?? []),
    ...(materials.mistakes?.flatMap((entry) => [entry.right, entry.note]) ?? []),
    ...(materials.blankExercises?.map((entry) => entry.sentence.replace("____", entry.answer)) ??
      []),
    ...(materials.culturalNotes?.flatMap((entry) => [entry.title, entry.body]) ?? []),
    ...(materials.collocations?.flatMap((entry) => [entry.phrase, entry.example]) ?? []),
    ...(materials.additionalExercises?.rewrite?.flatMap((entry) => [
      entry.sentence,
      entry.answer,
    ]) ?? []),
    ...(materials.errorCorrection?.map((entry) => entry.right) ?? []),
    ...(materials.writingPrompts?.flatMap((entry) => [
      entry.title,
      entry.prompt,
      ...(entry.suggestedVocabulary ?? []),
    ]) ?? []),
  ].filter((value): value is string => Boolean(value?.trim()));
}

const richTextsByUnit = new Map<string, string[]>();
for (const unitId of new Set(lessons.map((lesson) => lesson.unitId))) {
  richTextsByUnit.set(unitId, richMaterialTexts(await loadLearningMaterials(unitId)));
}

for (const lesson of lessons) {
  for (const scene of asArray(lesson.usage.scenes)) {
    scenes += 1;
    const generic = GENERIC_PATTERNS.some((pattern) => pattern.test(scene.scenario));
    if (generic) {
      genericScenes += 1;
      genericByLevel.set(lesson.cefrStage, (genericByLevel.get(lesson.cefrStage) ?? 0) + 1);
    }
    const targets = asArray(scene.targetWords);
    const sources = richTextsByUnit.get(lesson.unitId) ?? [];
    if (targets.every((target) => sources.some((source) => containsTarget(source, target)))) {
      scenesCoveredByRichMaterials += 1;
      if (generic) genericScenesCoveredByRichMaterials += 1;
    }
    if (sources.some((source) => targets.every((target) => containsTarget(source, target)))) {
      scenesCoveredByOneSource += 1;
    }
    for (const target of targets) {
      targetSlots += 1;
      const id = wordId(target);
      const entry = getLexiconEntry(LEXICON_DICTIONARY, id, target, lesson.unitId);
      if (!hasReviewedLexiconExamples(entry) && getReviewedCollocations(entry).length === 0) {
        missing.set(id, (missing.get(id) ?? 0) + 1);
      }
      if (entry.exampleSentence || entry.sentences.length > 0) examples += 1;
      if (hasReviewedLexiconExamples(entry)) reviewedExamples += 1;
      if (getReviewedCollocations(entry).length > 0) collocations += 1;
    }
  }
}

console.log(
  JSON.stringify(
    {
      lessons: lessons.length,
      scenes,
      genericScenes,
      genericPercent: Math.round((genericScenes / scenes) * 1000) / 10,
      targetSlots,
      targetSlotsWithExamples: examples,
      targetSlotsWithReviewedExamples: reviewedExamples,
      targetSlotsWithReviewedCollocations: collocations,
      scenesCoveredByRichMaterials,
      scenesCoveredByOneSource,
      genericScenesCoveredByRichMaterials,
      genericByLevel: Object.fromEntries(genericByLevel),
      missingLexiconIds: [...missing.entries()]
        .sort((left, right) => right[1] - left[1])
        .slice(0, 30),
    },
    null,
    2
  )
);
