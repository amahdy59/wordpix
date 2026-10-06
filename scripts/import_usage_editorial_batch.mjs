import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const DEFAULT_ARTIFACT_TOOL =
  "C:/Users/AhmedMahdy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";
const ARTIFACT_TOOL_URL = process.env.WORDPIX_ARTIFACT_TOOL_URL
  ? pathToFileURL(process.env.WORDPIX_ARTIFACT_TOOL_URL).href
  : pathToFileURL(DEFAULT_ARTIFACT_TOOL).href;
const { FileBlob, SpreadsheetFile } = await import(ARTIFACT_TOOL_URL);

const inputPath = path.resolve(process.argv[2] ?? "");
const batchStem = path.basename(inputPath, path.extname(inputPath));
const outputPath = path.resolve(
  process.argv[3] ??
    path.join(ROOT, "outputs", "editorial-imports", `${batchStem}_final.xlsx`)
);
const usageDirectory = path.join(ROOT, "src", "app", "data", "usage");
const requiredSheets = ["Instructions", "Lessons", "Words", "Scenes", "Phrases"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clean(value) {
  return String(value ?? "").trim();
}

function records(workbook, sheetName) {
  const sheet = workbook.worksheets.getItem(sheetName);
  const values = sheet.getUsedRange().values;
  const headers = values[0].map(String);
  return {
    sheet,
    headers,
    rows: values.slice(1).filter((row) => row.some((value) => value !== "" && value != null)),
  };
}

function recordObjects(table) {
  return table.rows.map((row, rowIndex) => ({
    data: Object.fromEntries(table.headers.map((header, index) => [header, row[index] ?? ""])),
    row,
    worksheetRow: rowIndex + 2,
  }));
}

function columnName(index) {
  let number = index + 1;
  let label = "";
  while (number > 0) {
    number -= 1;
    label = String.fromCharCode(65 + (number % 26)) + label;
    number = Math.floor(number / 26);
  }
  return label;
}

function setCell(table, rowNumber, header, value) {
  const index = table.headers.indexOf(header);
  assert(index >= 0, `${table.sheet.name}: missing ${header}`);
  table.sheet.getRange(`${columnName(index)}${rowNumber}`).values = [[value]];
}

function selected(row, currentField, updatedField) {
  const updated = clean(row[updatedField]);
  return updated || clean(row[currentField]);
}

function splitOptions(value) {
  return clean(value)
    .split("|")
    .map((option) => option.trim())
    .filter(Boolean);
}

function normalizeArticleAndSetting(text) {
  return text
    .replace(/^During a invoice review,/u, "During an invoice review,")
    .replace(/^At a interior meeting,/u, "At an interior-design meeting,")
    .replace(/^During a apartment setup,/u, "During an apartment setup,")
    .replace(/^At a appointment planner,/u, "In an appointment planner,")
    .replace(/^At a office schedule,/u, "In an office schedule,")
    .replace(/^In a appointment calendar,/u, "In an appointment calendar,")
    .replace(/^During an delivery setup,/u, "During a delivery setup,")
    .replace(/^During an reception area,/u, "In a reception area,")
    .replace(/^During an storeroom,/u, "In a storeroom,")
    .replace(/^At an community course,/u, "In a community course,")
    .replace(/^At an computer workshop,/u, "In a computer workshop,")
    .replace(/^At an workplace training room,/u, "In a workplace training room,")
    .replace(/^At an language class,/u, "In a language class,")
    .replace(/^During a outdoor activity,/u, "During an outdoor activity,")
    .replace(/^At the grocery aisle,/u, "In the grocery aisle,")
    .replace(/^During a home bathroom,/u, "In a home bathroom,")
    .replace(/^During a guest bathroom,/u, "In a guest bathroom,")
    .replace(/^During a home kitchen,/u, "In a home kitchen,")
    .replace(/^During a technical drawing desk,/u, "At a technical drawing desk,")
    .replace(/^During a hotel room,/u, "In a hotel room,")
    .replace(/^During a shared kitchen,/u, "In a shared kitchen,")
    .replace(/^During a booking screen,/u, "On a booking screen,")
    .replace(/^During a reception desk,/u, "At a reception desk,")
    .replace(/^At a station clock,/u, "On a station clock,")
    .replace(/^At a meeting reminder,/u, "In a meeting reminder,")
    .replace(/^In the bakery shelf,/u, "On the bakery shelf,")
    .replace(/^In the fresh-food counter,/u, "At the fresh-food counter,")
    .replace(/^In the station exit,/u, "At the station exit,")
    .replace(/p\.m\.\./gu, "p.m.");
}

const QUESTION_REVISIONS = new Map([
  ["numbers-counting-1-usage-scene-2", "How many cups are on the tray nearest the kettle?"],
  ["numbers-counting-1-usage-scene-4", "How many tickets are in the middle stack?"],
  ["numbers-counting-1-usage-scene-5", "How many notebooks are in the set on the right?"],
  ["numbers-counting-2-usage-scene-1", "Which ticket number is highlighted?"],
  ["numbers-counting-2-usage-scene-3", "Which number appears on the centre display?"],
  ["numbers-counting-2-usage-scene-5", "Which word describes the highlighted figure?"],
  ["bedroom-1-usage-scene-4", "Which piece of furniture is highlighted for the move?"],
  ["bedroom-3-usage-scene-3", "Where should the used tissue go?"],
  ["bathroom-1-usage-scene-2", "Where does the water leave the sink?"],
  ["bathroom-2-usage-scene-2", "What does Sami use to dry his face?"],
  ["bathroom-3-usage-scene-2", "What does the guest use to shave?"],
  ["bathroom-4-usage-scene-2", "Which towel is large enough to use after a bath?"],
  ["bathroom-5-usage-scene-2", "What does the person use to wash their hands?"],
  ["bathroom-6-usage-scene-2", "What does Omar use to wipe the mirror?"],
  ["kitchen-1-usage-scene-1", "Where were the vegetables kept before cooking?"],
  ["kitchen-2-usage-scene-4", "Which utensil is used to serve the soup?"],
  ["kitchen-4-usage-scene-3", "What is being washed at the sink?"],
  ["living-room-2-usage-scene-2", "Where should the shoes be stored?"],
  ["living-room-3-usage-scene-5", "Which floor covering is highlighted?"],
  ["living-room-4-usage-scene-1", "What protects the table from the drink?"],
  ["days-months-2-usage-scene-3", "Which month is highlighted in the agenda?"],
  ["days-months-4-usage-scene-2", "What helps the person remember the event?"],
  ["prepositions-of-place-1-usage-scene-3", "Where is the chair in relation to the desks?"],
  ["prepositions-of-place-3-usage-scene-2", "Which side of the layout is highlighted?"],
]);

async function loadUsageFiles() {
  const byLesson = new Map();
  const byUnit = new Map();
  const baselineMediaByScene = new Map();
  const filenames = (await fs.readdir(usageDirectory)).filter((name) => name.endsWith(".usage.json"));
  for (const filename of filenames) {
    const fullPath = path.join(usageDirectory, filename);
    const lessons = JSON.parse((await fs.readFile(fullPath, "utf8")).replace(/^\uFEFF/u, ""));
    // A small number of legacy units store one scene as an object instead of
    // the canonical array shape. Normalize that read-only source shape before
    // validating/importing so the editorial row counts remain stable.
    for (const lesson of lessons) {
      for (const field of ["targetWordsEnglish", "targetWordsArabic"]) {
        if (lesson?.[field] != null && !Array.isArray(lesson[field])) {
          lesson[field] = [lesson[field]];
        }
      }
      if (lesson?.usage && lesson.usage.scenes && !Array.isArray(lesson.usage.scenes)) {
        lesson.usage.scenes = [lesson.usage.scenes];
      }
    }
    byUnit.set(filename.replace(/\.usage\.json$/u, ""), { filename, fullPath, lessons });
    try {
      const baseline = JSON.parse(
        execFileSync("git", ["show", `HEAD:src/app/data/usage/${filename}`], {
          cwd: ROOT,
          encoding: "utf8",
          maxBuffer: 20_000_000,
        }).replace(/^\uFEFF/u, "")
      );
      for (const lesson of baseline) {
        const baselineScenes = Array.isArray(lesson.usage.scenes)
          ? lesson.usage.scenes
          : [lesson.usage.scenes];
        for (const scene of baselineScenes) {
          baselineMediaByScene.set(`${lesson.lessonId}-usage-scene-${scene.chunkNumber}`, {
            imagePath: clean(scene.imagePath),
            imageAlt: clean(scene.imageAlt),
          });
        }
      }
    } catch {
      // A newly added source file has no Git baseline; workbook validation still applies.
    }
    for (const lesson of lessons) {
      assert(!byLesson.has(lesson.lessonId), `Duplicate app lesson ID: ${lesson.lessonId}`);
      byLesson.set(lesson.lessonId, lesson);
    }
  }
  return { byLesson, byUnit, baselineMediaByScene };
}

assert(inputPath && inputPath.toLowerCase().endsWith(".xlsx"), "Pass the editorial .xlsx input path.");
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
assert(
  JSON.stringify(workbook.worksheets.items.map((sheet) => sheet.name)) === JSON.stringify(requiredSheets),
  "Workbook tab names or order changed."
);

const tables = Object.fromEntries(requiredSheets.slice(1).map((name) => [name, records(workbook, name)]));
const { byLesson, byUnit, baselineMediaByScene } = await loadUsageFiles();

const lessons = recordObjects(tables.Lessons);
const words = recordObjects(tables.Words);
const scenes = recordObjects(tables.Scenes);
const phrases = recordObjects(tables.Phrases);

assert(lessons.length > 0, "Workbook contains no lessons.");

const expectedCounts = {
  Lessons: lessons.length,
  Words: 0,
  Scenes: 0,
  Phrases: lessons.length * 3,
};
for (const { data } of lessons) {
  const lessonId = clean(data.lesson_id);
  const lesson = byLesson.get(lessonId);
  assert(lesson, `Workbook lesson not found in app: ${lessonId}`);
  assert(Number(data.global_order) === lesson.globalOrder, `${lessonId}: global_order changed.`);
  assert(clean(data.unit_id) === lesson.unitId, `${lessonId}: unit_id changed.`);
  expectedCounts.Words += lesson.targetWordsEnglish.length;
  expectedCounts.Scenes += lesson.usage.scenes.length;
}

assert(words.length === expectedCounts.Words, `Words: expected ${expectedCounts.Words} rows for ${lessons.length} lessons; found ${words.length}.`);
assert(scenes.length === expectedCounts.Scenes, `Scenes: expected ${expectedCounts.Scenes} rows for ${lessons.length} lessons; found ${scenes.length}.`);
assert(phrases.length === expectedCounts.Phrases, `Phrases: expected ${expectedCounts.Phrases} rows for ${lessons.length} lessons; found ${phrases.length}.`);

const uniqueChecks = [
  [lessons, "lesson_id"],
  [words, "word_id"],
  [scenes, "scene_id"],
  [phrases, "phrase_id"],
];
for (const [rows, idField] of uniqueChecks) {
  const ids = rows.map(({ data }) => clean(data[idField]));
  assert(ids.every(Boolean), `Blank ${idField}.`);
  assert(new Set(ids).size === ids.length, `Duplicate ${idField}.`);
}

const numbersLesson = lessons.find(({ data }) => data.lesson_id === "numbers-counting-2");
if (numbersLesson) {
  const improvedNumbersReading =
    "A hotel worker checks a booking screen before a busy weekend. Room requests include sixteen, seventeen, eighteen, nineteen, and twenty guests. Larger group bookings show thirty, forty, fifty, sixty, seventy, eighty, and ninety people. The conference summary shows one hundred places. One report records one thousand bookings, while the company website records one million visits across all its locations.";
  numbersLesson.data.updated_reading_text = improvedNumbersReading;
  setCell(tables.Lessons, numbersLesson.worksheetRow, "updated_reading_text", improvedNumbersReading);
}

const readingRevisions = new Map([
  [
    "daily-action-verbs-1",
    "When the alarm rings, Yusuf wakes up and gets up. He tries not to yawn, then stretches and takes a shower. After he brushes his teeth and gets dressed, he has time to eat breakfast and pack lunch before he leaves home. At the table, he takes time to eat and drink. He chews each bite before he can swallow, then takes a final sip of coffee before work.",
  ],
  [
    "living-room-5",
    "After dinner, Omar turns on a lamp and puts his phone and tablet on charge. He wears headphones for a short online call, then decides to watch TV for a while. Later, he and a friend play games and listen to music. When the room becomes quiet, he reads a book, sits down to chat, and relaxes on the sofa. Before getting ready for bed, he decides to take a nap.",
  ],
]);
for (const [lessonId, readingText] of readingRevisions) {
  const record = lessons.find(({ data }) => data.lesson_id === lessonId);
  if (record) {
    record.data.updated_reading_text = readingText;
    setCell(tables.Lessons, record.worksheetRow, "updated_reading_text", readingText);
  }
}

const instructions = workbook.worksheets.getItem("Instructions");
instructions.getRange("C15").values = [[
  "All non-empty updated_* fields in this batch have been imported into the app's editorial source. Learner release remains fail-closed: a lesson or phrase appears only when its separate runtime approval record satisfies the stricter application schema.",
]];

let correctedScenarios = 0;
for (const scene of scenes) {
  const original = clean(scene.data.updated_scenario);
  const corrected = normalizeArticleAndSetting(original);
  if (corrected !== original) {
    scene.data.updated_scenario = corrected;
    setCell(tables.Scenes, scene.worksheetRow, "updated_scenario", corrected);
    correctedScenarios += 1;
  }
  const revisedQuestion = QUESTION_REVISIONS.get(clean(scene.data.scene_id));
  if (revisedQuestion) {
    scene.data.updated_question = revisedQuestion;
    setCell(tables.Scenes, scene.worksheetRow, "updated_question", revisedQuestion);
  }
}

const affectedUnits = new Set();
for (const { data } of lessons) {
  const lesson = byLesson.get(clean(data.lesson_id));
  assert(lesson, `Workbook lesson not found in app: ${data.lesson_id}`);
  assert(Number(data.global_order) === lesson.globalOrder, `${data.lesson_id}: global_order changed.`);
  assert(clean(data.unit_id) === lesson.unitId, `${data.lesson_id}: unit_id changed.`);
  assert(clean(data.lesson_name) === lesson.lessonName, `${data.lesson_id}: lesson_name changed.`);
  lesson.usage.goal = selected(data, "current_goal", "updated_goal");
  lesson.usage.canDoStatement = selected(data, "current_can_do", "updated_can_do");
  lesson.usage.textType = selected(data, "current_text_type", "updated_text_type");
  lesson.reading.title = selected(data, "current_reading_title", "updated_reading_title");
  lesson.reading.text = selected(data, "current_reading_text", "updated_reading_text");
  affectedUnits.add(lesson.unitId);
}

const wordsByLesson = Map.groupBy(words, ({ data }) => clean(data.lesson_id));
for (const [lessonId, rows] of wordsByLesson) {
  const lesson = byLesson.get(lessonId);
  assert(lesson, `Word rows reference missing lesson: ${lessonId}`);
  rows.sort((left, right) => Number(left.data.word_index) - Number(right.data.word_index));
  assert(rows.length === lesson.targetWordsEnglish.length, `${lessonId}: word count changed.`);
  rows.forEach(({ data }, index) => {
    const expectedId = `${lessonId}-word-${String(index + 1).padStart(2, "0")}`;
    assert(clean(data.word_id) === expectedId, `${lessonId}: word ID or order changed at ${index + 1}.`);
  });
  lesson.targetWordsEnglish = rows.map(({ data }) => selected(data, "current_english", "updated_english"));
  lesson.targetWordsArabic = rows.map(({ data }) => selected(data, "current_arabic", "updated_arabic"));
}

const scenesByLesson = Map.groupBy(scenes, ({ data }) => clean(data.lesson_id));
let revisedVideoStarters = 0;
for (const [lessonId, rows] of scenesByLesson) {
  const lesson = byLesson.get(lessonId);
  assert(lesson, `Scene rows reference missing lesson: ${lessonId}`);
  rows.sort((left, right) => Number(left.data.scene_number) - Number(right.data.scene_number));
  assert(rows.length === lesson.usage.scenes.length, `${lessonId}: scene count changed.`);
  rows.forEach(({ data }, index) => {
    const source = lesson.usage.scenes[index];
    const sceneNumber = Number(data.scene_number);
    const expectedId = `${lessonId}-usage-scene-${sceneNumber}`;
    assert(clean(data.scene_id) === expectedId, `${lessonId}: scene ID changed at ${sceneNumber}.`);
    assert(source.chunkNumber === sceneNumber, `${lessonId}: scene order changed at ${sceneNumber}.`);
    const workbookImagePath = clean(data.image_path_read_only);
    const sourceImagePath = clean(source.imagePath);
    assert(workbookImagePath === sourceImagePath, `${expectedId}: read-only image path differs from app source.`);
    const baselineMedia = baselineMediaByScene.get(expectedId);
    if (baselineMedia) {
      assert(baselineMedia.imagePath === sourceImagePath, `${expectedId}: Git media path differs from app source.`);
    }
    const options = splitOptions(selected(data, "current_options", "updated_options_pipe_separated"));
    const expectedAnswer = selected(data, "current_answer", "updated_answer");
    assert(options.length === 3, `${expectedId}: expected exactly three answer options.`);
    assert(new Set(options.map((option) => option.toLocaleLowerCase())).size === 3, `${expectedId}: options are not unique.`);
    assert(options.includes(expectedAnswer), `${expectedId}: expected answer is not an option.`);
    source.scenario = selected(data, "current_scenario", "updated_scenario");
    source.check.question = selected(data, "current_question", "updated_question");
    source.check.options = options;
    source.check.expectedAnswer = expectedAnswer;
    source.imageBrief = selected(data, "current_image_brief", "updated_image_brief");
    const altText = selected(data, "current_alt_text", "updated_alt_text");
    if (sourceImagePath && baselineMedia?.imageAlt) {
      source.imageAlt = baselineMedia.imageAlt;
    } else if (altText) {
      source.imageAlt = altText;
    }
    // source.imagePath is deliberately never assigned here.
  });
  if (/^Look closely\. I can see\b/iu.test(lesson.video.scriptStarter)) {
    lesson.video.scriptStarter = `Watch the situation: ${lesson.usage.scenes[0].scenario}`;
    revisedVideoStarters += 1;
  }
}

const placeholderArabic = /(?:يُسمّى|مصطلح مرتبط بالموضوع|جزء يُسمّى|شخص يُسمّى)/u;
for (const { data } of words) {
  assert(!placeholderArabic.test(selected(data, "current_arabic", "updated_arabic")), `${data.word_id}: placeholder Arabic remains.`);
}
for (const { data } of phrases) {
  assert(!placeholderArabic.test(selected(data, "current_arabic", "updated_arabic")), `${data.phrase_id}: placeholder Arabic remains.`);
  assert(byLesson.has(clean(data.lesson_id)), `${data.phrase_id}: unknown lesson.`);
  assert(scenes.some(({ data: scene }) => scene.scene_id === data.linked_scene_id && scene.lesson_id === data.lesson_id), `${data.phrase_id}: invalid linked scene.`);
}

// Preserve every workbook field and status for the next editorial/release pass.
// This source is deliberately outside the learner-facing approved phrase registry.
const editorialDirectory = path.join(ROOT, "src", "app", "data", "editorial");
await fs.mkdir(editorialDirectory, { recursive: true });
await fs.writeFile(
  path.join(editorialDirectory, `${batchStem}.json`),
  `${JSON.stringify({ revision: batchStem, lessons: lessons.map(({ data }) => data), words: words.map(({ data }) => data), scenes: scenes.map(({ data }) => data), phrases: phrases.map(({ data }) => data) }, null, 2)}\n`,
  "utf8"
);

for (const unitId of affectedUnits) {
  const unit = byUnit.get(unitId);
  assert(unit, `Missing usage file for affected unit ${unitId}.`);
  await fs.writeFile(unit.fullPath, `${JSON.stringify(unit.lessons, null, 2)}\n`, "utf8");
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const outputBlob = await SpreadsheetFile.exportXlsx(workbook);
await outputBlob.save(outputPath);

const reloaded = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));
const formulaErrorPattern = /#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!|SPILL!|CALC!)/u;
for (const sheet of reloaded.worksheets.items) {
  for (const row of sheet.getUsedRange().values) {
    assert(!row.some((value) => formulaErrorPattern.test(String(value ?? ""))), `${sheet.name}: formula error found.`);
  }
}
const approvedCounts = Object.fromEntries(
  Object.entries({ Lessons: lessons, Words: words, Scenes: scenes, Phrases: phrases }).map(([name, rows]) => [
    name,
    rows.filter(({ data }) => clean(data.approval_status) === "Approved").length,
  ])
);
console.log(
  JSON.stringify(
    {
      inputPath,
      outputPath,
      imported: expectedCounts,
      affectedUnits: affectedUnits.size,
      correctedScenarios,
      revisedQuestions: QUESTION_REVISIONS.size,
      revisedVideoStarters,
      correctedReading: "numbers-counting-2",
      approvedCounts,
      mediaPathsChanged: 0,
      phraseReleaseChanged: 0,
      lessonApprovalReleaseChanged: 0,
    },
    null,
    2
  )
);
await fs.rm(`${outputPath}.inspect.ndjson`, { force: true });
