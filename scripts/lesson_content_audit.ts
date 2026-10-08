import { mkdir, readFile, writeFile } from "node:fs/promises";
import { COURSE_UNITS, LEARNING_PATH_UNIT_IDS } from "../src/app/data/courseCatalog";
import { loadUnitVocabulary } from "../src/app/data/vocabulary";
import { loadUnitUsageForEditorial, loadUnitUsage } from "../src/app/data/usageRegistry";
import { loadLearningMaterials } from "../src/app/learning/registry";
import { getRichSentence } from "../src/app/exercises/exerciseContent";
import { sentenceCloze } from "../src/app/exercises/sentenceCloze";
import { resolveSentenceMedia } from "../src/app/shared/SentenceQuestionSupport";
import { auditContextualLesson } from "../src/app/data/contextualQuality";
import { BUSINESS_UNITS } from "../src/app/learning/business/businessCatalog";
import { CONVERSATION_UNITS } from "../src/app/learning/conversation/conversationCatalog";
import { FIGMA_HADITH_LESSONS } from "../src/app/learning/hadith/figmaHadithCatalog";
import { getParsedHadithStages } from "../src/app/learning/hadith/hadithLessonContent";
import { getHadithExerciseSet } from "../src/app/learning/hadith/hadithExerciseCatalog";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  getFigmaPronunciationActivityData,
} from "../src/app/learning/foundations/figmaPronunciationCatalog";
import { EXERCISE_DEFINITIONS } from "../src/app/exercises/content";
import { buildPracticeItems } from "../src/app/learning/study/practice/buildPracticeItems";
import { PLACEHOLDER_DESCRIPTION } from "../src/app/data/placeholderDescription";

interface Finding {
  code: string;
  field: string;
  detail: string;
  severity: "error" | "review";
}
interface RecordEntry {
  section: string;
  id: string;
  title: string;
  source: string;
  released: boolean;
  counts: Record<string, number>;
  findings: Finding[];
}
const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
const generic =
  /glossary uses the term|was used during the activity|in an educational description|can see, use, or|uses or discusses|each word connected to|places .+ in one coherent situation|belongs to a different part|worker and customer deal with|patient and medical team deal with/iu;
function finding(
  record: RecordEntry,
  code: string,
  field: string,
  detail: string,
  severity: Finding["severity"] = "error"
) {
  record.findings.push({ code, field, detail, severity });
}
function checkChoice(
  record: RecordEntry,
  field: string,
  prompt: string,
  options: readonly string[],
  answerIndex: number
) {
  if (!prompt.trim()) finding(record, "empty-question", field, "The question has no instruction.");
  if (options.length < 2 || options.some((s) => !s.trim()))
    finding(record, "invalid-options", field, JSON.stringify(options));
  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length)
    finding(
      record,
      "missing-answer",
      field,
      `Answer index ${answerIndex}; ${options.length} options.`
    );
  if (new Set(options.map(normalize)).size !== options.length)
    finding(record, "duplicate-options", field, JSON.stringify(options));
}
function inspectTree(record: RecordEntry, value: unknown, field = "content") {
  if (typeof value === "string") {
    if (generic.test(value)) finding(record, "generic-context", field, value, "review");
    if (/\b(?:TODO|TBD|lorem ipsum)\b|\ufffd/iu.test(value))
      finding(record, "unfinished-content", field, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => inspectTree(record, v, `${field}[${i}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  const obj = value as Record<string, unknown>;
  if (Array.isArray(obj.options)) {
    const raw = obj.options;
    const options = raw.map((v) =>
      typeof v === "string"
        ? v
        : String(
            (v as Record<string, unknown>).label ??
              (v as Record<string, unknown>).text ??
              (v as Record<string, unknown>).value ??
              ""
          )
    );
    const correct =
      obj.correctIndex ??
      (typeof obj.correctAnswer === "string"
        ? raw.findIndex((v) =>
            typeof v === "string"
              ? v === obj.correctAnswer
              : (v as Record<string, unknown>).key === obj.correctAnswer
          )
        : undefined) ??
      (typeof obj.answerId === "string"
        ? raw.findIndex((v) => (v as Record<string, unknown>).id === obj.answerId)
        : undefined) ??
      (typeof obj.expectedAnswer === "string" ? options.indexOf(obj.expectedAnswer) : undefined);
    if (correct !== undefined)
      checkChoice(
        record,
        field,
        String(obj.question ?? obj.prompt ?? obj.stem ?? ""),
        options,
        Number(correct)
      );
  }
  for (const [key, child] of Object.entries(obj)) {
    if (/image|audio|source|citation|url|nodeId|imageRef/i.test(key)) continue;
    inspectTree(record, child, `${field}.${key}`);
  }
}
export async function runAudit(phase: string) {
  const records: RecordEntry[] = [];
  for (const unitId of LEARNING_PATH_UNIT_IDS) {
    if (records.length % 50 < 6)
      console.log(`Auditing ${unitId}; ${records.length} records inspected.`);
    const unit = COURSE_UNITS[unitId];
    const [vocab, rawUsage, releasedUsage, materials] = await Promise.all([
      loadUnitVocabulary(unitId),
      loadUnitUsageForEditorial(unitId),
      loadUnitUsage(unitId),
      loadLearningMaterials(unitId),
    ]);
    const releasedIds = new Set((releasedUsage ?? []).map((l) => l.lessonId));
    for (const lesson of rawUsage ?? []) {
      const record: RecordEntry = {
        section: "vocabulary",
        id: lesson.lessonId,
        title: lesson.lessonName,
        source: `src/app/data/usage/${unitId}.usage.json`,
        released: releasedIds.has(lesson.lessonId),
        counts: {
          words: lesson.targetWordsEnglish.length,
          scenes: lesson.usage.scenes.length,
          questions: lesson.usage.scenes.length + lesson.exercises.length,
        },
        findings: [],
      };
      inspectTree(record, lesson);
      const quality = auditContextualLesson(lesson);
      quality.errors.forEach((detail) =>
        finding(
          record,
          "context-quality",
          "content",
          `${detail} ${quality.targetCoverage
            .filter((target) => target.sources.length === 0)
            .map((target) => target.target)
            .join(", ")}`,
          "review"
        )
      );
      const questions = new Set<string>();
      for (const scene of lesson.usage.scenes) {
        const key =
          normalize(scene.check.question) +
          "|" +
          scene.check.options.map(normalize).sort().join("|");
        if (questions.has(key))
          finding(
            record,
            "repeated-scene-question",
            `scene.${scene.chunkNumber}`,
            scene.check.question
          );
        questions.add(key);
        if (/_{2,}/u.test(scene.scenario))
          finding(record, "unfinished-context", `scene.${scene.chunkNumber}`, scene.scenario);
      }
      const sentences = new Map<string, string[]>();
      for (const label of lesson.targetWordsEnglish) {
        const word = vocab.find((w) => normalize(w.label) === normalize(label));
        if (!word) {
          finding(
            record,
            "unresolved-word",
            label,
            "Target cannot be resolved in this unit's vocabulary."
          );
          continue;
        }
        if (!word.description.trim() || word.description === PLACEHOLDER_DESCRIPTION)
          finding(record, "missing-meaning-clue", label, word.description);
        if (/مصطلح مرتبط|يُسمّى|يُسمى/u.test(word.arabicTranslation ?? "")) {
          finding(record, "generic-arabic-gloss", label, word.arabicTranslation!, "review");
        }
        if (word.arabicTranslation === "") {
          finding(
            record,
            "missing-arabic-gloss",
            label,
            "The bilingual overlay explicitly rejects the translation.",
            "review"
          );
        }
        const meaningWords = word.description.split(/\s+/u).length;
        if (["Pre-A1", "A1", "A2"].includes(lesson.cefrStage) && meaningWords > 24) {
          finding(record, "long-beginner-meaning", label, word.description, "review");
        }
        for (const stage of [0, 1]) {
          const sentence = getRichSentence(word, lesson, stage).full;
          const cloze = sentenceCloze(sentence, label);
          if (cloze === sentence)
            finding(record, "unclozable-target", `${label}.stage-${stage}`, sentence);
          if (stage === 0) {
            const key = normalize(sentence);
            sentences.set(key, [...(sentences.get(key) ?? []), label]);
            if (!resolveSentenceMedia(word.id, sentence, lesson))
              record.counts.placeholderScenes = (record.counts.placeholderScenes ?? 0) + 1;
          }
          if (generic.test(sentence))
            finding(record, "generic-practice-sentence", `${label}.stage-${stage}`, sentence);
          if (/_{2,}/u.test(sentence))
            finding(record, "unfinished-practice-sentence", `${label}.stage-${stage}`, sentence);
          if (["Pre-A1", "A1"].includes(lesson.cefrStage) && sentence.split(/\s+/u).length > 35)
            finding(
              record,
              "long-beginner-question",
              `${label}.stage-${stage}`,
              sentence,
              "review"
            );
        }
      }
      for (const [sentence, labels] of sentences)
        if (labels.length > 1)
          finding(record, "repeated-usage-example", labels.join(", "), sentence, "review");
      records.push(record);
    }
    // Every curriculum group receives a record, even if usage content is absent.
    for (const group of unit.groups)
      if (!(rawUsage ?? []).some((l) => l.lessonId === group.id)) {
        records.push({
          section: "vocabulary-group",
          id: group.id,
          title: group.name,
          source: "src/app/data/courseCatalog.ts",
          released: true,
          counts: { words: group.wordIds.length },
          findings: [
            {
              code: "no-matching-usage-record",
              field: "group.id",
              detail:
                "Group does not have an identically named usage record; verify the fallback flow.",
              severity: "review",
            },
          ],
        });
      }
    if (materials) {
      const record: RecordEntry = {
        section: "study-materials",
        id: unitId,
        title: unit.name,
        source: `src/app/learning/units/${unitId}.ts`,
        released: true,
        counts: { practice: buildPracticeItems(materials, vocab, 0).length },
        findings: [],
      };
      inspectTree(record, materials);
      const blanks = materials.blankExercises ?? [];
      for (const blank of blanks)
        if (!/BLANK|_{2,}/u.test(blank.sentence))
          finding(record, "missing-blank", blank.id, blank.sentence);
      const seen = new Map<string, string>();
      for (const item of buildPracticeItems(materials, vocab, 0)) {
        const text = item.type === "blank" ? item.data.sentence : item.data.question;
        const key = normalize(text) + "|" + normalize(item.answerText);
        if (seen.has(key))
          finding(
            record,
            "repeated-practice-question",
            item.id,
            `${text}; earlier ${seen.get(key)}`
          );
        seen.set(key, item.id);
      }
      records.push(record);
    }
  }
  for (const [section, units] of [
    ["business", BUSINESS_UNITS],
    ["conversation", CONVERSATION_UNITS],
  ] as const) {
    for (const lesson of units) {
      const record: RecordEntry = {
        section,
        id: lesson.id,
        title: lesson.title,
        source: `src/app/learning/${section}/${section}Catalog.units-${lesson.unitNumber <= 20 ? "01-20" : "21-40"}.json`,
        released: true,
        counts: {},
        findings: [],
      };
      inspectTree(record, lesson);
      records.push(record);
    }
  }
  for (const lesson of FIGMA_HADITH_LESSONS) {
    const stages = getParsedHadithStages(lesson);
    const exercises = getHadithExerciseSet(lesson.id);
    const record: RecordEntry = {
      section: "hadith",
      id: lesson.id,
      title: lesson.title,
      source: "src/app/learning/hadith/figmaHadithContent.json",
      released: true,
      counts: { review: stages.review.length, exercises: exercises?.exercises.length ?? 0 },
      findings: [],
    };
    inspectTree(record, stages);
    inspectTree(record, exercises);
    const seen = new Set<string>();
    for (const item of stages.review) {
      if (!item.answer.trim())
        finding(record, "missing-review-answer", item.question, "No model answer.");
      if (seen.has(normalize(item.question)))
        finding(record, "repeated-review-question", "review", item.question);
      seen.add(normalize(item.question));
    }
    records.push(record);
  }
  for (const lesson of FIGMA_PRONUNCIATION_LESSONS) {
    const activity = getFigmaPronunciationActivityData(lesson.number);
    const record: RecordEntry = {
      section: "pronunciation",
      id: `pronunciation-${lesson.number}`,
      title: activity.title,
      source: "src/app/learning/foundations/figmaPronunciationContent.json",
      released: true,
      counts: { items: activity.items.length, contrasts: activity.contrastPairs.length },
      findings: [],
    };
    inspectTree(record, activity);
    if (!activity.items.length)
      finding(record, "empty-pronunciation-lesson", "items", "No usable items.");
    if (!activity.model.trim())
      finding(record, "missing-pronunciation-model", "model", "No model.");
    records.push(record);
  }
  for (const definition of Object.values(EXERCISE_DEFINITIONS)) {
    const record: RecordEntry = {
      section: "skill-practice",
      id: definition.id,
      title: definition.title,
      source: "src/app/exercises/content",
      released: true,
      counts: { tasks: definition.tasks.length },
      findings: [],
    };
    inspectTree(record, definition);
    records.push(record);
  }
  const codes: Record<string, number> = {};
  for (const record of records)
    for (const f of record.findings) codes[f.code] = (codes[f.code] ?? 0) + 1;
  const report = {
    generatedAt: new Date().toISOString(),
    phase,
    method:
      "Individual data and runtime-resolution checks for every catalogued lesson; semantic flags are review candidates, not automatic proof of a defect. This is not a criterion-by-criterion WCAG audit or a visual inspection of every remote image.",
    units: LEARNING_PATH_UNIT_IDS.length,
    sections: Object.fromEntries(
      [...new Set(records.map((r) => r.section))].map((section) => [
        section,
        records.filter((r) => r.section === section).length,
      ])
    ),
    totals: {
      records: records.length,
      withFindings: records.filter((r) => r.findings.length).length,
      errors: records.flatMap((r) => r.findings).filter((f) => f.severity === "error").length,
      review: records.flatMap((r) => r.findings).filter((f) => f.severity === "review").length,
    },
    codes,
    records,
  };
  const directory = "docs/lesson-content-audit";
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/${phase}.json`, JSON.stringify(report, null, 2) + "\n");
  const rows = [
    "section,lesson_id,title,findings,errors,source",
    ...records.map((r) =>
      [
        r.section,
        r.id,
        r.title,
        r.findings.length,
        r.findings.filter((f) => f.severity === "error").length,
        r.source,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  await writeFile(`${directory}/${phase}-lessons.csv`, rows.join("\n") + "\n");
  const baseline =
    phase === "baseline"
      ? report
      : JSON.parse(await readFile(`${directory}/baseline.json`, "utf8"));
  await writeFile(
    `${directory}/README.md`,
    `# WordPix lesson and section content audit\n\n${report.method}\n\nBaseline: ${baseline.totals.records} records; ${baseline.totals.errors} error-level findings; ${baseline.totals.review} automated review flags.\n\nCurrent: ${report.totals.records} records; ${report.totals.errors} error-level findings; ${report.totals.review} automated review flags.\n\nA zero flag count does not complete the manual editorial or image review. See [the current review report](REVIEW.md) for completed corrections and remaining work.\n\nEach record includes its exact source, inspected counts, findings, and release state. See [baseline](baseline.json), [current](current.json), and the per-lesson CSV files.\n\nR2 assets and ID-to-URL mappings are read-only. Intentional spaced review is retained.\n`
  );
  console.log(JSON.stringify({ sections: report.sections, totals: report.totals, codes }, null, 2));
}
