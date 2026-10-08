import fs from "node:fs";
import { execFileSync } from "node:child_process";
const filenames = execFileSync("git", ["diff", "--name-only", "--", "src/app/data/usage"], {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter(Boolean);
const changes = [];
const deleted = [];
for (const path of filenames) {
  const before = JSON.parse(
    execFileSync("git", ["show", `HEAD:${path}`], { encoding: "utf8", maxBuffer: 10e6 })
  );
  const after = JSON.parse(fs.readFileSync(path, "utf8"));
  function compare(left, right, at) {
    if (!left || typeof left !== "object") return;
    for (const [key, value] of Object.entries(left)) {
      if (right?.[key] === undefined) deleted.push(`${path}:${at}.${key}`);
      if (
        /^(?:imagePath|imageRef|imageFallbacks|audioUrl|audioPath)$/u.test(key) &&
        JSON.stringify(value) !== JSON.stringify(right?.[key])
      )
        changes.push(`${path}:${at}.${key}`);
      if (key !== "exercises") compare(value, right?.[key], `${at}.${key}`);
    }
  }
  compare(before, after, "content");
}
console.log(
  JSON.stringify(
    {
      files: filenames.length,
      mediaChanges: changes,
      deletedFields: deleted.filter((x) => !x.includes(".exercises.")),
    },
    null,
    2
  )
);
if (changes.length || deleted.filter((x) => !x.includes(".exercises.")).length)
  process.exitCode = 1;
