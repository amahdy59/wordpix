import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  FOUNDATION_CURRICULUM_SCHEMA_VERSION,
  FOUNDATION_LESSONS,
  FOUNDATION_PICTURE_WORDS,
  FOUNDATION_STAGES,
} from "../src/app/learning/foundations/foundationCurriculum.ts";
import { validateFoundationCurriculum } from "../src/app/learning/foundations/foundationCurriculumSchema.ts";

interface AuditIssue {
  severity: "error" | "warning";
  location: string;
  message: string;
}

const issues: AuditIssue[] = [];
const checkAsset = (src: string, location: string) => {
  if (!existsSync(resolve(process.cwd(), "public", src.replace(/^\//, "")))) {
    issues.push({ severity: "error", location, message: `Missing local asset: ${src}` });
  }
};

try {
  validateFoundationCurriculum({
    schemaVersion: FOUNDATION_CURRICULUM_SCHEMA_VERSION,
    lessons: FOUNDATION_LESSONS,
    stages: FOUNDATION_STAGES,
  });
} catch (error) {
  issues.push({
    severity: "error",
    location: "curriculum",
    message: error instanceof Error ? error.message : "Curriculum validation failed.",
  });
}

for (const lesson of FOUNDATION_LESSONS) {
  lesson.models.forEach((model, index) => {
    if (model.image) checkAsset(model.image.src, `${lesson.id}.models[${index}]`);
  });
  lesson.questions.forEach((question, questionIndex) => {
    question.options.forEach((option, optionIndex) => {
      const location = `${lesson.id}.questions[${questionIndex}].options[${optionIndex}]`;
      if (option.mediaKind === "photo" && !option.image) {
        issues.push({ severity: "error", location, message: "Concrete choice has no photo." });
      }
      if (option.image) checkAsset(option.image.src, location);
    });
  });
  (FOUNDATION_PICTURE_WORDS[lesson.id] ?? []).forEach((picture, index) =>
    checkAsset(picture.src, `${lesson.id}.pictureWords[${index}]`)
  );
}

const summary = {
  schemaVersion: FOUNDATION_CURRICULUM_SCHEMA_VERSION,
  stages: FOUNDATION_STAGES.length,
  units: FOUNDATION_STAGES.reduce((total, stage) => total + stage.units.length, 0),
  lessons: FOUNDATION_LESSONS.length,
  questions: FOUNDATION_LESSONS.reduce((total, lesson) => total + lesson.questions.length, 0),
  errors: issues.filter((issue) => issue.severity === "error").length,
  warnings: issues.filter((issue) => issue.severity === "warning").length,
};

console.log(JSON.stringify({ summary, issues }, null, 2));
if (summary.errors > 0) process.exitCode = 1;
