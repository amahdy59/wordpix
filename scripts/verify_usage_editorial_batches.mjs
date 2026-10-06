import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIRECTORY = path.resolve(process.argv[2] ?? path.join(ROOT, "docs", "usage-editorial-batches"));

const DEFAULT_ARTIFACT_TOOL =
  "C:/Users/AhmedMahdy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";
const ARTIFACT_TOOL_URL = process.env.WORDPIX_ARTIFACT_TOOL_URL
  ? pathToFileURL(process.env.WORDPIX_ARTIFACT_TOOL_URL).href
  : pathToFileURL(DEFAULT_ARTIFACT_TOOL).href;
const { FileBlob, SpreadsheetFile } = await import(ARTIFACT_TOOL_URL);

const REQUIRED_SHEETS = ["Instructions", "Lessons", "Words", "Scenes", "Phrases"];
const EXPECTED_TOTALS = { files: 38, lessons: 864, words: 11847, scenes: 3657, phrases: 2592 };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function records(sheet) {
  const values = sheet.getUsedRange().values;
  const headers = values[0].map(String);
  return {
    headers,
    rows: values.slice(1).filter((row) => row.some((value) => value !== "" && value != null)),
  };
}

function verifyUnique(rows, headers, idHeader, seen, filename) {
  const index = headers.indexOf(idHeader);
  assert(index >= 0, `${filename}: missing ${idHeader}`);
  for (const row of rows) {
    const id = String(row[index] ?? "").trim();
    assert(id, `${filename}: blank ${idHeader}`);
    assert(!seen.has(id), `${filename}: duplicate ${idHeader} ${id}`);
    seen.add(id);
  }
}

const filenames = (await fs.readdir(DIRECTORY))
  .filter((name) => /^WordPix_editorial_batch_\d{2}_lessons_\d{3}-\d{3}\.xlsx$/u.test(name))
  .sort();
assert(filenames.length === EXPECTED_TOTALS.files, `Expected ${EXPECTED_TOTALS.files} workbooks; found ${filenames.length}.`);

const totals = { files: filenames.length, lessons: 0, words: 0, scenes: 0, phrases: 0 };
const lessonIds = new Set();
const wordIds = new Set();
const sceneIds = new Set();
const phraseIds = new Set();
const globalOrders = new Set();

for (const filename of filenames) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(path.join(DIRECTORY, filename)));
  const sheetNames = workbook.worksheets.items.map((sheet) => sheet.name);
  assert(JSON.stringify(sheetNames) === JSON.stringify(REQUIRED_SHEETS), `${filename}: tab names or order changed.`);

  const lessons = records(workbook.worksheets.getItem("Lessons"));
  const words = records(workbook.worksheets.getItem("Words"));
  const scenes = records(workbook.worksheets.getItem("Scenes"));
  const phrases = records(workbook.worksheets.getItem("Phrases"));
  verifyUnique(lessons.rows, lessons.headers, "lesson_id", lessonIds, filename);
  verifyUnique(words.rows, words.headers, "word_id", wordIds, filename);
  verifyUnique(scenes.rows, scenes.headers, "scene_id", sceneIds, filename);
  verifyUnique(phrases.rows, phrases.headers, "phrase_id", phraseIds, filename);

  const orderIndex = lessons.headers.indexOf("global_order");
  for (const row of lessons.rows) {
    const order = Number(row[orderIndex]);
    assert(Number.isInteger(order) && order >= 1 && order <= EXPECTED_TOTALS.lessons, `${filename}: invalid global_order ${row[orderIndex]}`);
    assert(!globalOrders.has(order), `${filename}: duplicate global_order ${order}`);
    globalOrders.add(order);
  }

  totals.lessons += lessons.rows.length;
  totals.words += words.rows.length;
  totals.scenes += scenes.rows.length;
  totals.phrases += phrases.rows.length;
}

for (const [key, expected] of Object.entries(EXPECTED_TOTALS)) assert(totals[key] === expected, `${key}: expected ${expected}; found ${totals[key]}`);
for (let order = 1; order <= EXPECTED_TOTALS.lessons; order += 1) assert(globalOrders.has(order), `Missing global_order ${order}`);

console.log(JSON.stringify({ status: "valid", totals }, null, 2));
