import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const USAGE_DIR = path.join(ROOT, "src", "app", "data", "usage");
const SOURCE_WORKBOOK = path.join(ROOT, "output", "usage-authoring", "WordPix_usage_authoring_inventory.xlsx");
const OUTPUT_DIR = path.join(ROOT, "docs", "usage-editorial-batches");
const BATCH_COUNT = 10;
const FONT = "Arial";
const HEADER_FILL = "#1D2939";
const INPUT_FILL = "#FFF3CD";
const ID_FILL = "#F2F4F7";
const TEXT = "#101828";

const asArray = (value) => Array.isArray(value) ? value : value == null ? [] : [value];
const clean = (value) => String(value ?? "").replace(/^\uFEFF/u, "");
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

async function loadLessons() {
  const lessons = [];
  for (const filename of (await fs.readdir(USAGE_DIR)).filter((name) => name.endsWith(".usage.json"))) {
    lessons.push(...JSON.parse(clean(await fs.readFile(path.join(USAGE_DIR, filename), "utf8"))));
  }
  return lessons.sort((a, b) => a.globalOrder - b.globalOrder);
}

async function loadPhraseRows() {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(SOURCE_WORKBOOK));
  const values = workbook.worksheets.getItem("Phrase authoring").getRange("A1:AF2593").values;
  const headers = values[0].map(String);
  return values.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
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
    range.format.columnWidth = /scenario|reading|meaning|example|brief|notes|options|evidence/i.test(header) ? 42 : /id|name|word|phrase|title/i.test(header) ? 24 : 16;
  });
  if (rowCount > 0) sheet.tables.add(`A1:${end}${rowCount + 1}`, true, `${sheet.name.replaceAll(/[^A-Za-z0-9]/gu, "")}Table`);
}

function addInstructions(workbook, batchNumber, firstOrder, lastOrder, lessonCount) {
  const sheet = workbook.worksheets.add("Instructions");
  sheet.showGridLines = false;
  sheet.getRange("B2:H2").merge();
  sheet.getRange("B2").values = [[`WordPix editorial batch ${batchNumber}`]];
  sheet.getRange("B2").format.font = { name: FONT, size: 16, bold: true, color: TEXT };
  sheet.getRange("B4:C15").values = [
    ["Coverage", `${lessonCount} lessons; global order ${firstOrder}-${lastOrder}`],
    ["Purpose", "Edit English usage content, Arabic translations, scenes, readings, phrases, CEFR evidence, and image briefs."],
    ["Stable IDs", "Never change, remove, or regenerate lesson_id, word_id, scene_id, phrase_id, unit_id, or global_order."],
    ["Where to edit", "Edit only yellow columns. Existing values and identifiers are grey reference fields."],
    ["Approval", "Set approval_status to Approved only after language, level, relevance, Arabic, evidence, and answer-key review."],
    ["Sources", "Use learner dictionaries and primary references. Put the exact URL in evidence_url. Do not paste copyrighted example sentences; write an original natural example."],
    ["English", "Prefer frequent, useful, adult-relevant English. Avoid generic frames, forced idioms, rare senses, and repeated sentence patterns."],
    ["Levels", "Keep core language appropriate to lesson_cefr. Optional level-up language may range from A2 to C1 and must be clearly labelled."],
    ["Arabic", "Use natural Modern Standard Arabic meanings, not transliteration or phrases such as ‘a related term called…’."],
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

const lessons = await loadLessons();
const phraseRows = await loadPhraseRows();
const phrasesByLesson = new Map();
for (const row of phraseRows) {
  const group = phrasesByLesson.get(String(row["Lesson ID"])) ?? [];
  group.push(row);
  phrasesByLesson.set(String(row["Lesson ID"]), group);
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });
const batchSize = Math.ceil(lessons.length / BATCH_COUNT);
const outputFiles = [];

for (let batchIndex = 0; batchIndex < BATCH_COUNT; batchIndex += 1) {
  const batch = lessons.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);
  const batchNumber = String(batchIndex + 1).padStart(2, "0");
  const workbook = Workbook.create();
  addInstructions(workbook, batchNumber, batch[0].globalOrder, batch.at(-1).globalOrder, batch.length);

  const lessonHeaders = ["lesson_id", "global_order", "unit_id", "unit_name", "unit_order", "lesson_name", "lesson_order_in_unit", "lesson_cefr", "stage_name", "current_goal", "updated_goal", "current_can_do", "updated_can_do", "current_text_type", "updated_text_type", "current_reading_title", "updated_reading_title", "current_reading_text", "updated_reading_text", "reading_evidence_url", "editor_notes", "approval_status", "reviewer", "review_date"];
  const lessonRows = batch.map((lesson) => [lesson.lessonId, lesson.globalOrder, lesson.unitId, lesson.unitName, lesson.unitOrder, lesson.lessonName, lesson.lessonOrderInUnit, lesson.cefrStage, lesson.stageName, lesson.usage?.goal ?? "", "", lesson.usage?.canDoStatement ?? "", "", lesson.usage?.textType ?? "", "", lesson.reading?.title ?? "", "", lesson.reading?.text ?? "", "", "", "", "Needs review", "", ""]);
  addSheet(workbook, "Lessons", lessonHeaders, lessonRows, ["updated_goal", "updated_can_do", "updated_text_type", "updated_reading_title", "updated_reading_text", "reading_evidence_url", "editor_notes", "approval_status", "reviewer", "review_date"]);

  const wordHeaders = ["word_id", "lesson_id", "global_order", "unit_name", "lesson_name", "lesson_cefr", "word_index", "current_english", "updated_english", "current_arabic", "updated_arabic", "word_cefr", "meaning_note", "natural_example", "collocation_or_pattern", "evidence_url", "editor_notes", "approval_status"];
  const wordRows = batch.flatMap((lesson) => asArray(lesson.targetWordsEnglish).map((word, index) => [`${lesson.lessonId}-word-${String(index + 1).padStart(2, "0")}`, lesson.lessonId, lesson.globalOrder, lesson.unitName, lesson.lessonName, lesson.cefrStage, index + 1, word, "", asArray(lesson.targetWordsArabic)[index] ?? "", "", "", "", "", "", "", "", "Needs review"]));
  addSheet(workbook, "Words", wordHeaders, wordRows, ["updated_english", "updated_arabic", "word_cefr", "meaning_note", "natural_example", "collocation_or_pattern", "evidence_url", "editor_notes", "approval_status"]);

  const sceneHeaders = ["scene_id", "lesson_id", "global_order", "unit_name", "lesson_name", "lesson_cefr", "scene_number", "target_words", "current_scenario", "updated_scenario", "current_question", "updated_question", "current_options", "updated_options_pipe_separated", "current_answer", "updated_answer", "current_image_brief", "updated_image_brief", "image_path_read_only", "current_alt_text", "updated_alt_text", "evidence_url", "editor_notes", "approval_status"];
  const sceneRows = batch.flatMap((lesson) => asArray(lesson.usage?.scenes).map((scene, index) => [`${lesson.lessonId}-usage-scene-${scene.chunkNumber ?? index + 1}`, lesson.lessonId, lesson.globalOrder, lesson.unitName, lesson.lessonName, lesson.cefrStage, scene.chunkNumber ?? index + 1, asArray(scene.targetWords).join(" | "), scene.scenario ?? "", "", scene.check?.question ?? "", "", asArray(scene.check?.options).join(" | "), "", scene.check?.expectedAnswer ?? "", "", scene.imageBrief ?? "", "", scene.imagePath ?? "", scene.imageAlt ?? "", "", "", "", "Needs review"]));
  addSheet(workbook, "Scenes", sceneHeaders, sceneRows, ["updated_scenario", "updated_question", "updated_options_pipe_separated", "updated_answer", "updated_image_brief", "updated_alt_text", "evidence_url", "editor_notes", "approval_status"]);

  const phraseHeaders = ["phrase_id", "lesson_id", "global_order", "unit_name", "lesson_name", "lesson_cefr", "slot", "current_phrase", "updated_phrase", "current_type", "updated_type", "current_meaning", "updated_meaning", "current_arabic", "updated_arabic", "current_example", "updated_example", "phrase_cefr", "register_region", "pattern_common_error", "evidence_url", "frequency_evidence", "linked_scene_id", "image_decision", "image_brief_revision", "editor_notes", "approval_revision", "approval_status", "reviewer", "review_date"];
  const phraseRowsForBatch = batch.flatMap((lesson) => (phrasesByLesson.get(lesson.lessonId) ?? []).map((row) => [row["Phrase ID"], lesson.lessonId, lesson.globalOrder, lesson.unitName, lesson.lessonName, lesson.cefrStage, row.Slot, row["Target phrase"], "", row["Phrase type"], "", row["Plain English meaning"] || row["Exact meaning"], "", row["Arabic meaning"], "", row["Original scene / dialogue"], "", row["Phrase CEFR"], row["Register / region"], row["Pattern / common error"], row["CEFR evidence URL"], row["Frequency query and evidence"], row["Scene ID"], row["Image decision"], row["Image brief / revision"], "", row["Approval revision"], row["Editorial status"] || "Needs review", row["Reviewer / date"], ""]));
  addSheet(workbook, "Phrases", phraseHeaders, phraseRowsForBatch, ["updated_phrase", "updated_type", "updated_meaning", "updated_arabic", "updated_example", "phrase_cefr", "register_region", "pattern_common_error", "evidence_url", "frequency_evidence", "linked_scene_id", "image_decision", "image_brief_revision", "editor_notes", "approval_revision", "approval_status", "reviewer", "review_date"]);

  for (const [sheetName, headers] of [["Lessons", lessonHeaders], ["Words", wordHeaders], ["Scenes", sceneHeaders], ["Phrases", phraseHeaders]]) {
    const sheet = workbook.worksheets.getItem(sheetName);
    const statusIndex = headers.indexOf("approval_status");
    const rowCount = sheet.getUsedRange().values.length;
    sheet.getRange(`${col(statusIndex)}2:${col(statusIndex)}${rowCount}`).dataValidation = { rule: { type: "list", values: ["Needs review", "Draft", "Approved", "Rejected"] } };
  }

  const first = String(batch[0].globalOrder).padStart(3, "0");
  const last = String(batch.at(-1).globalOrder).padStart(3, "0");
  const filename = `WordPix_editorial_batch_${batchNumber}_lessons_${first}-${last}.xlsx`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  const blob = await SpreadsheetFile.exportXlsx(workbook);
  await blob.save(outputPath);
  outputFiles.push(outputPath);

  const check = await workbook.inspect({ kind: "table", range: "Instructions!B2:C15", include: "values,formulas", tableMaxRows: 15, tableMaxCols: 2 });
  if (!check.ndjson.includes(`WordPix editorial batch ${batchNumber}`)) throw new Error(`Instruction verification failed for ${filename}`);
  const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 20 }, summary: `formula errors in ${filename}` });
  if (/"count":\s*[1-9]/u.test(errors.ndjson)) throw new Error(`Formula error found in ${filename}`);
  const preview = await workbook.render({ sheetName: "Instructions", range: "B2:C15", scale: 1, format: "png" });
  await fs.writeFile(path.join(OUTPUT_DIR, `.preview-${batchNumber}.png`), new Uint8Array(await preview.arrayBuffer()));
  console.log(`${filename}: ${batch.length} lessons, ${wordRows.length} words, ${sceneRows.length} scenes, ${phraseRowsForBatch.length} phrase slots`);
}

if (outputFiles.length !== BATCH_COUNT) throw new Error(`Expected ${BATCH_COUNT} workbooks, created ${outputFiles.length}`);
console.log(`Created ${outputFiles.length} import-ready editorial workbooks in ${OUTPUT_DIR}`);
