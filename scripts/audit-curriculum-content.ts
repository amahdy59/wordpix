import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  auditCurriculumContent,
  rawCurriculumLessonSchema,
  rawWorkingModelSchema,
} from "../src/app/exercises/content/curriculumContentPipeline.ts";

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const modelPath = argument("--model");
const lessonsPath = argument("--lessons");
const outputPath = resolve(argument("--out") ?? "output/curriculum/content-audit.json");

if (!modelPath || !lessonsPath) {
  throw new Error(
    "Usage: pnpm content:curriculum:audit -- --model <working-model.json> --lessons <lessons.jsonl> [--out <report.json>]"
  );
}

const modelPayload: unknown = JSON.parse(await readFile(resolve(modelPath), "utf8"));
const model = rawWorkingModelSchema.parse(modelPayload);
const jsonl = await readFile(resolve(lessonsPath), "utf8");
const jsonlLessons = jsonl
  .split(/\r?\n/u)
  .filter((line) => line.trim().length > 0)
  .map((line, index) => {
    try {
      return rawCurriculumLessonSchema.parse(JSON.parse(line) as unknown);
    } catch (error) {
      throw new Error(`Invalid JSONL lesson at line ${index + 1}.`, { cause: error });
    }
  });

const report = auditCurriculumContent(
  model.schema_version,
  model.lesson_count,
  model.lessons,
  jsonlLessons
);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

process.stdout.write(
  [
    `Audited ${report.modelLessonCount} model lessons against ${report.jsonlLessonCount} JSONL lessons.`,
    `Eligible: ${report.eligibleLessons}; blocked: ${report.blockedLessons}.`,
    `Missing usage sentences: ${report.missingUsageSentences}.`,
    `Missing cluster readings: ${report.missingClusterReadings}.`,
    `Report: ${outputPath}`,
  ].join("\n") + "\n"
);
