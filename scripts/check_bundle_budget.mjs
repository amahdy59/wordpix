import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const assetsDir = path.resolve("dist/assets");
const files = (await readdir(assetsDir)).filter((file) => file.endsWith(".js"));
const budgets = [
  { pattern: /^index-/, limit: 500 * 1024, label: "initial runtime" },
  // A monolithic dictionary must never re-enter the browser graph.
  { pattern: /^lexicon-dictionary/, limit: 0, label: "forbidden monolithic dictionary" },
  { pattern: /^lexicon-\d+-/, limit: 48 * 1024, label: "dictionary shard" },
  { pattern: /^story-/, limit: 16 * 1024, label: "lesson passage shard" },
  { pattern: /^conversation-units/, limit: 400 * 1024, label: "conversation data shard" },
  { pattern: /^business-units/, limit: 400 * 1024, label: "business data shard" },
  { pattern: /^course-lessons/, limit: 550 * 1024, label: "curriculum summaries" },
  { pattern: /\.js$/, limit: 600_000, label: "runtime chunk" },
];

let failed = false;
for (const file of files) {
  const bytes = (await stat(path.join(assetsDir, file))).size;
  const budget = budgets.find(({ pattern }) => pattern.test(file));
  if (!budget) continue;
  const size = `${(bytes / 1024).toFixed(1)} kB`;
  if (bytes > budget.limit) {
    console.error(
      `Bundle budget exceeded (${budget.label}): ${file} is ${size}; limit ${(budget.limit / 1024).toFixed(0)} kB`
    );
    failed = true;
  } else if (budget.label !== "runtime chunk") {
    console.log(`Bundle budget ok (${budget.label}): ${file} ${size}`);
  }
}

if (failed) process.exitCode = 1;
