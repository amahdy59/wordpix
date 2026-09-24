import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const assetsDir = path.resolve("dist/assets");
const files = (await readdir(assetsDir)).filter((file) => file.endsWith(".js"));
const budgets = [
  { pattern: /^index-/, limit: 900 * 1024, label: "initial runtime" },
  { pattern: /^(?!index-)(?!conversationCatalog)(?!course-lessons)(?!lexicon-dictionary).*\.js$/, limit: 600 * 1024, label: "runtime chunk" },
  { pattern: /^conversationCatalog/, limit: 700 * 1024, label: "conversation data" },
  { pattern: /^course-lessons/, limit: 800 * 1024, label: "course data" },
  { pattern: /^lexicon-dictionary/, limit: 2 * 1024 * 1024, label: "lexicon data" },
];

let failed = false;
for (const file of files) {
  const bytes = (await stat(path.join(assetsDir, file))).size;
  const budget = budgets.find(({ pattern }) => pattern.test(file));
  if (!budget) continue;
  const size = `${(bytes / 1024).toFixed(1)} kB`;
  if (bytes > budget.limit) {
    console.error(`Bundle budget exceeded (${budget.label}): ${file} is ${size}; limit ${(budget.limit / 1024).toFixed(0)} kB`);
    failed = true;
  } else if (budget.label !== "runtime chunk") {
    console.log(`Bundle budget ok (${budget.label}): ${file} ${size}`);
  }
}

if (failed) process.exitCode = 1;
