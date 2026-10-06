import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CURRICULUM_SEQUENCE } from "../src/app/data/curriculumSequence.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const USAGE_DIR = path.join(ROOT, "src", "app", "data", "usage");
const EDITORIAL_DIR = path.join(ROOT, "src", "app", "data", "editorial");
const SOURCE_WORKBOOK = path.join(ROOT, "output", "usage-authoring", "WordPix_usage_authoring_inventory.xlsx");
const OUTPUT_DIR = path.resolve(process.argv[2] ?? path.join(ROOT, "docs", "usage-editorial-batches"));

const DEFAULT_ARTIFACT_TOOL =
  "C:/Users/AhmedMahdy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";
const ARTIFACT_TOOL_URL = process.env.WORDPIX_ARTIFACT_TOOL_URL
  ? pathToFileURL(process.env.WORDPIX_ARTIFACT_TOOL_URL).href
  : pathToFileURL(DEFAULT_ARTIFACT_TOOL).href;
const { FileBlob, SpreadsheetFile, Workbook } = await import(ARTIFACT_TOOL_URL);

const FONT = "Arial";
const HEADER_FILL = "#1D2939";
const INPUT_FILL = "#FFF3CD";
const ID_FILL = "#F2F4F7";
const TEXT = "#101828";

const asArray = (value) => (Array.isArray(value) ? value : value == null ? [] : [value]);
const clean = (value) => String(value ?? "").replace(/^\uFEFF/u, "").trim();
const col = (index) => {
  let number = index + 1;
  let label = "";
  while (number > 0) {
    number -= 1;
    label = String.fromCharCode(65 + (number % 26)) + label;
    number = Math.floor(number / 26);
  }
  return label;
};

async function loadUnits() {
  const units = [];
  for (const unitId of CURRICULUM_SEQUENCE) {
    const filePath = path.join(USAGE_DIR, `${unitId}.usage.json`);
    const raw = await fs.readFile(filePath, "utf8");
    const lessons = JSON.parse(raw.replace(/^\uFEFF/u, ""));
    units.push({
      unitId,
      unitName: lessons[0]?.unitName ?? unitId,
      cefr: lessons[0]?.cefrStage ?? "",
      stageName: lessons[0]?.stageName ?? "",
      lessons,
    });
  }
  return units;
}

function partitionBatches(units) {
  const MAX_TARGET = 25;
  const batches = [];
  let current = [];
  let currentCount = 0;
  let currentCefr = units[0].cefr;

  for (const unit of units) {
    const wouldExceed = currentCount + unit.lessons.length > MAX_TARGET && currentCount > 0;
    const stageBreak = unit.cefr !== currentCefr && currentCount >= 16;

    if (wouldExceed || stageBreak) {
      batches.push({
        cefr: currentCefr,
        units: current,
        lessons: current.flatMap((u) => u.lessons),
      });
      current = [];
      currentCount = 0;
      currentCefr = unit.cefr;
    }

    current.push(unit);
    currentCount += unit.lessons.length;
    currentCefr = unit.cefr;
  }

  if (current.length > 0) {
    batches.push({
      cefr: currentCefr,
      units: current,
      lessons: current.flatMap((u) => u.lessons),
    });
  }

  for (let i = batches.length - 1; i > 0; i--) {
    if (
      batches[i].lessons.length < 12 &&
      batches[i - 1].cefr === batches[i].cefr &&
      batches[i - 1].lessons.length + batches[i].lessons.length <= 28
    ) {
      batches[i - 1].units.push(...batches[i].units);
      batches[i - 1].lessons.push(...batches[i].lessons);
      batches.splice(i, 1);
    }
  }

  return batches.map((batch, index) => ({
    ...batch,
    batchNumber: index + 1,
    firstOrder: batch.lessons[0].globalOrder,
    lastOrder: batch.lessons.at(-1).globalOrder,
  }));
}

async function loadPhraseRows() {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(SOURCE_WORKBOOK));
  const values = workbook.worksheets.getItem("Phrase authoring").getRange("A1:AF2593").values;
  const headers = values[0].map(String);
  return values.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
}

async function loadEditorialSnapshots() {
  const snapshots = {
    lessons: new Map(),
    words: new Map(),
    scenes: new Map(),
    phrases: new Map(),
  };

  try {
    const files = await fs.readdir(EDITORIAL_DIR);
    for (const f of files.filter((n) => n.endsWith(".json"))) {
      const raw = JSON.parse(await fs.readFile(path.join(EDITORIAL_DIR, f), "utf8"));
      if (raw.lessons) for (const l of raw.lessons) snapshots.lessons.set(clean(l.lesson_id), l);
      if (raw.words) for (const w of raw.words) snapshots.words.set(clean(w.word_id), w);
      if (raw.scenes) for (const s of raw.scenes) snapshots.scenes.set(clean(s.scene_id), s);
      if (raw.phrases) for (const p of raw.phrases) snapshots.phrases.set(clean(p.phrase_id), p);
    }
  } catch {}

  return snapshots;
}

function styleTable(sheet, headers, rowCount, editableHeaders = []) {
  const end = col(headers.length - 1);
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  sheet.getRange(`A1:${end}${rowCount + 1}`).format.font = { name: FONT, size: 10, color: TEXT };
  sheet.getRange(`A1:${end}1`).format = {
    fill: HEADER_FILL,
    font: { name: FONT, size: 10, bold: true, color: "#FFFFFF" },
    wrapText: true,
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "inside", style: "thin", color: "#FFFFFF" },
  };
  sheet.getRange(`A1:${end}1`).format.rowHeight = 34;
  sheet.getRange(`A2:${end}${rowCount + 1}`).format.verticalAlignment = "top";
  headers.forEach((header, index) => {
    const range = sheet.getRange(`${col(index)}2:${col(index)}${rowCount + 1}`);
    range.format.wrapText = true;
    range.format.fill = editableHeaders.includes(header) ? INPUT_FILL : ID_FILL;
    range.format.columnWidth = /scenario|reading|meaning|example|brief|notes|options|evidence/i.test(header)
      ? 42
      : /id|name|word|phrase|title/i.test(header)
      ? 24
      : 16;
  });
  if (rowCount > 0) sheet.tables.add(`A1:${end}${rowCount + 1}`, true, `${sheet.name.replaceAll(/[^A-Za-z0-9]/gu, "")}Table`);
}

function addInstructions(workbook, batchNumber, firstOrder, lastOrder, lessonCount, unitNames) {
  const sheet = workbook.worksheets.add("Instructions");
  sheet.showGridLines = false;
  sheet.getRange("B2:H2").merge();
  sheet.getRange("B2").values = [[`WordPix editorial batch ${batchNumber}`]];
  sheet.getRange("B2").format.font = { name: FONT, size: 16, bold: true, color: TEXT };
  sheet.getRange("B4:C15").values = [
    ["Coverage", `${lessonCount} lessons; global order ${firstOrder}-${lastOrder} (${unitNames})`],
    ["Purpose", "Edit English usage content, Arabic translations, scenes, readings, phrases, CEFR evidence, and image briefs."],
    ["Stable IDs", "Never change, remove, or regenerate lesson_id, word_id, scene_id, phrase_id, unit_id, or global_order."],
    ["Where to edit", "Edit only yellow columns. Existing values and identifiers are grey reference fields."],
    ["Approval", "Set approval_status to Approved only after language, level, relevance, Arabic, evidence, and answer-key review."],
    ["Sources", "Use learner dictionaries and primary references. Put the exact URL in evidence_url. Do not paste copyrighted example sentences; write an original natural example."],
    ["English", "Prefer frequent, useful, adult-relevant English. Avoid generic frames, forced idioms, rare senses, and repeated sentence patterns."],
    ["Levels", "Keep core language appropriate to lesson_cefr. Optional level-up language may range from A2 to C1 and must be clearly labelled."],
    ["Arabic", "Use natural Modern Standard Arabic meanings, not transliteration or phrases such as 'مصطلح مرتبط بالموضوع'."],
    ["Images", "Write concrete, adult-oriented briefs and accurate alt text. Do not rename image paths or alter R2 mappings."],
    ["Return format", "Return this workbook with the same filename, tab names, rows, columns, and IDs. Do not add, delete, merge, or reorder records."],
    ["Import rule", "Only rows marked Approved are eligible for import. Blank updated fields preserve the current app value."],
  ];
  sheet.getRange("B4:B15").format.font = { name: FONT, size: 10, bold: true, color: "#344054" };
  sheet.getRange("C4:C15").format = { font: { name: FONT, size: 10, color: TEXT }, wrapText: true };
  sheet.getRange("B4:C15").format.borders = { preset: "inside", style: "thin", color: "#D0D5DD" };
  sheet.getRange("B4:B15").format.columnWidth = 22;
  sheet.getRange("C4:C15").format.columnWidth = 95;
  sheet.getRange("B4:C15").format.autofitRows();
}

function addSheet(workbook, name, headers, rows, editableHeaders) {
  const sheet = workbook.worksheets.add(name);
  sheet.getRange(`A1:${col(headers.length - 1)}${rows.length + 1}`).values = [headers, ...rows];
  styleTable(sheet, headers, rows.length, editableHeaders);
  return sheet;
}

const units = await loadUnits();
const batches = partitionBatches(units);
const phraseRows = await loadPhraseRows();
const snapshots = await loadEditorialSnapshots();

const phrasesByLesson = new Map();
for (const row of phraseRows) {
  const group = phrasesByLesson.get(String(row["Lesson ID"])) ?? [];
  group.push(row);
  phrasesByLesson.set(String(row["Lesson ID"]), group);
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });
const outputFiles = [];

console.log(`Exporting ${batches.length} modular workbooks to ${OUTPUT_DIR}...`);

for (const batch of batches) {
  const batchNumber = String(batch.batchNumber).padStart(2, "0");
  const workbook = Workbook.create();
  const unitSummary = batch.units.map((u) => u.unitName).slice(0, 3).join(", ") + (batch.units.length > 3 ? "..." : "");
  addInstructions(workbook, batchNumber, batch.firstOrder, batch.lastOrder, batch.lessons.length, unitSummary);

  const lessonHeaders = [
    "lesson_id",
    "global_order",
    "unit_id",
    "unit_name",
    "unit_order",
    "lesson_name",
    "lesson_order_in_unit",
    "lesson_cefr",
    "stage_name",
    "current_goal",
    "updated_goal",
    "current_can_do",
    "updated_can_do",
    "current_text_type",
    "updated_text_type",
    "current_reading_title",
    "updated_reading_title",
    "current_reading_text",
    "updated_reading_text",
    "reading_evidence_url",
    "editor_notes",
    "approval_status",
    "reviewer",
    "review_date",
  ];

  const lessonRows = batch.lessons.map((lesson) => {
    const prev = snapshots.lessons.get(lesson.lessonId);
    return [
      lesson.lessonId,
      lesson.globalOrder,
      lesson.unitId,
      lesson.unitName,
      lesson.unitOrder,
      lesson.lessonName,
      lesson.lessonOrderInUnit,
      lesson.cefrStage,
      lesson.stageName,
      lesson.usage?.goal ?? "",
      prev?.updated_goal ?? "",
      lesson.usage?.canDoStatement ?? "",
      prev?.updated_can_do ?? "",
      lesson.usage?.textType ?? "",
      prev?.updated_text_type ?? "",
      lesson.reading?.title ?? "",
      prev?.updated_reading_title ?? "",
      lesson.reading?.text ?? "",
      prev?.updated_reading_text ?? "",
      prev?.reading_evidence_url ?? "",
      prev?.editor_notes ?? "",
      prev?.approval_status ?? "Needs review",
      prev?.reviewer ?? "",
      prev?.review_date ?? "",
    ];
  });
  addSheet(workbook, "Lessons", lessonHeaders, lessonRows, [
    "updated_goal",
    "updated_can_do",
    "updated_text_type",
    "updated_reading_title",
    "updated_reading_text",
    "reading_evidence_url",
    "editor_notes",
    "approval_status",
    "reviewer",
    "review_date",
  ]);

  const wordHeaders = [
    "word_id",
    "lesson_id",
    "global_order",
    "unit_name",
    "lesson_name",
    "lesson_cefr",
    "word_index",
    "current_english",
    "updated_english",
    "current_arabic",
    "updated_arabic",
    "word_cefr",
    "meaning_note",
    "natural_example",
    "collocation_or_pattern",
    "evidence_url",
    "editor_notes",
    "approval_status",
  ];

  const wordRows = batch.lessons.flatMap((lesson) =>
    asArray(lesson.targetWordsEnglish).map((word, index) => {
      const wordId = `${lesson.lessonId}-word-${String(index + 1).padStart(2, "0")}`;
      const prev = snapshots.words.get(wordId);
      return [
        wordId,
        lesson.lessonId,
        lesson.globalOrder,
        lesson.unitName,
        lesson.lessonName,
        lesson.cefrStage,
        index + 1,
        word,
        prev?.updated_english ?? "",
        asArray(lesson.targetWordsArabic)[index] ?? "",
        prev?.updated_arabic ?? "",
        prev?.word_cefr ?? "",
        prev?.meaning_note ?? "",
        prev?.natural_example ?? "",
        prev?.collocation_or_pattern ?? "",
        prev?.evidence_url ?? "",
        prev?.editor_notes ?? "",
        prev?.approval_status ?? "Needs review",
      ];
    })
  );
  addSheet(workbook, "Words", wordHeaders, wordRows, [
    "updated_english",
    "updated_arabic",
    "word_cefr",
    "meaning_note",
    "natural_example",
    "collocation_or_pattern",
    "evidence_url",
    "editor_notes",
    "approval_status",
  ]);

  const sceneHeaders = [
    "scene_id",
    "lesson_id",
    "global_order",
    "unit_name",
    "lesson_name",
    "lesson_cefr",
    "scene_number",
    "target_words",
    "current_scenario",
    "updated_scenario",
    "current_question",
    "updated_question",
    "current_options",
    "updated_options_pipe_separated",
    "current_answer",
    "updated_answer",
    "current_image_brief",
    "updated_image_brief",
    "image_path_read_only",
    "current_alt_text",
    "updated_alt_text",
    "evidence_url",
    "editor_notes",
    "approval_status",
  ];

  const sceneRows = batch.lessons.flatMap((lesson) =>
    asArray(lesson.usage?.scenes).map((scene, index) => {
      const chunkNumber = scene.chunkNumber ?? index + 1;
      const sceneId = `${lesson.lessonId}-usage-scene-${chunkNumber}`;
      const prev = snapshots.scenes.get(sceneId);
      return [
        sceneId,
        lesson.lessonId,
        lesson.globalOrder,
        lesson.unitName,
        lesson.lessonName,
        lesson.cefrStage,
        chunkNumber,
        asArray(scene.targetWords).join(" | "),
        scene.scenario ?? "",
        prev?.updated_scenario ?? "",
        scene.check?.question ?? "",
        prev?.updated_question ?? "",
        asArray(scene.check?.options).join(" | "),
        prev?.updated_options_pipe_separated ?? "",
        scene.check?.expectedAnswer ?? "",
        prev?.updated_answer ?? "",
        scene.imageBrief ?? "",
        prev?.updated_image_brief ?? "",
        scene.imagePath ?? "",
        scene.imageAlt ?? "",
        prev?.updated_alt_text ?? "",
        prev?.evidence_url ?? "",
        prev?.editor_notes ?? "",
        prev?.approval_status ?? "Needs review",
      ];
    })
  );
  addSheet(workbook, "Scenes", sceneHeaders, sceneRows, [
    "updated_scenario",
    "updated_question",
    "updated_options_pipe_separated",
    "updated_answer",
    "updated_image_brief",
    "updated_alt_text",
    "evidence_url",
    "editor_notes",
    "approval_status",
  ]);

  const phraseHeaders = [
    "phrase_id",
    "lesson_id",
    "global_order",
    "unit_name",
    "lesson_name",
    "lesson_cefr",
    "slot",
    "current_phrase",
    "updated_phrase",
    "current_type",
    "updated_type",
    "current_meaning",
    "updated_meaning",
    "current_arabic",
    "updated_arabic",
    "current_example",
    "updated_example",
    "phrase_cefr",
    "register_region",
    "pattern_common_error",
    "evidence_url",
    "frequency_evidence",
    "linked_scene_id",
    "image_decision",
    "image_brief_revision",
    "editor_notes",
    "approval_revision",
    "approval_status",
    "reviewer",
    "review_date",
  ];

  const phraseRowsForBatch = batch.lessons.flatMap((lesson) =>
    (phrasesByLesson.get(lesson.lessonId) ?? []).map((row) => {
      const phraseId = row["Phrase ID"];
      const prev = snapshots.phrases.get(phraseId);
      return [
        phraseId,
        lesson.lessonId,
        lesson.globalOrder,
        lesson.unitName,
        lesson.lessonName,
        lesson.cefrStage,
        row.Slot,
        row["Target phrase"],
        prev?.updated_phrase ?? "",
        row["Phrase type"],
        prev?.updated_type ?? "",
        row["Plain English meaning"] || row["Exact meaning"],
        prev?.updated_meaning ?? "",
        row["Arabic meaning"],
        prev?.updated_arabic ?? "",
        row["Original scene / dialogue"],
        prev?.updated_example ?? "",
        prev?.phrase_cefr ?? row["Phrase CEFR"],
        prev?.register_region ?? row["Register / region"],
        prev?.pattern_common_error ?? row["Pattern / common error"],
        prev?.evidence_url ?? row["CEFR evidence URL"],
        prev?.frequency_evidence ?? row["Frequency query and evidence"],
        prev?.linked_scene_id ?? row["Scene ID"],
        prev?.image_decision ?? row["Image decision"],
        prev?.image_brief_revision ?? row["Image brief / revision"],
        prev?.editor_notes ?? "",
        prev?.approval_revision ?? row["Approval revision"],
        prev?.approval_status ?? (row["Editorial status"] || "Needs review"),
        prev?.reviewer ?? row["Reviewer / date"],
        prev?.review_date ?? "",
      ];
    })
  );
  addSheet(workbook, "Phrases", phraseHeaders, phraseRowsForBatch, [
    "updated_phrase",
    "updated_type",
    "updated_meaning",
    "updated_arabic",
    "updated_example",
    "phrase_cefr",
    "register_region",
    "pattern_common_error",
    "evidence_url",
    "frequency_evidence",
    "linked_scene_id",
    "image_decision",
    "image_brief_revision",
    "editor_notes",
    "approval_revision",
    "approval_status",
    "reviewer",
    "review_date",
  ]);

  for (const [sheetName, headers] of [
    ["Lessons", lessonHeaders],
    ["Words", wordHeaders],
    ["Scenes", sceneHeaders],
    ["Phrases", phraseHeaders],
  ]) {
    const sheet = workbook.worksheets.getItem(sheetName);
    const statusIndex = headers.indexOf("approval_status");
    const rowCount = sheet.getUsedRange().values.length;
    sheet.getRange(`${col(statusIndex)}2:${col(statusIndex)}${rowCount}`).dataValidation = {
      rule: { type: "list", values: ["Needs review", "Draft", "Approved", "Rejected"] },
    };
  }

  const first = String(batch.firstOrder).padStart(3, "0");
  const last = String(batch.lastOrder).padStart(3, "0");
  const filename = `WordPix_editorial_batch_${batchNumber}_lessons_${first}-${last}.xlsx`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  const blob = await SpreadsheetFile.exportXlsx(workbook);
  await blob.save(outputPath);
  outputFiles.push(outputPath);

  console.log(
    `${filename}: ${batch.lessons.length} lessons (${batch.cefr}), ${wordRows.length} words, ${sceneRows.length} scenes, ${phraseRowsForBatch.length} phrase slots`
  );
}

console.log(`\nSuccessfully exported ${outputFiles.length} modular workbooks to ${OUTPUT_DIR}`);
