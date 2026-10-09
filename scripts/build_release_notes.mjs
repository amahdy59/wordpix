import { readFile, writeFile } from "node:fs/promises";

const source = await readFile("src/app/data/releaseNotes.json", "utf8");
const data = JSON.parse(source);
if (!data.version || !Array.isArray(data.notes) || !Array.isArray(data.releases)) {
  throw new Error("Release notes require a version, update summary and release history.");
}
if (data.releases[0]?.version !== data.version) {
  throw new Error("The newest release must match the update notification version.");
}
const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
if (
  !data.notes.every(nonempty) ||
  !Array.isArray(data.notesAr) ||
  data.notesAr.length !== data.notes.length ||
  !data.notesAr.every(nonempty)
) {
  throw new Error("The latest summary requires matching nonempty English and Arabic notes.");
}
const ids = new Set();
let lastDate = "9999-12-31";
for (const release of data.releases) {
  if (
    !nonempty(release.id) ||
    ids.has(release.id) ||
    !nonempty(release.title?.en) ||
    !nonempty(release.title?.ar) ||
    !Array.isArray(release.changes) ||
    release.changes.length === 0
  ) {
    throw new Error("Each release needs a unique ID, bilingual title and changes.");
  }
  ids.add(release.id);
  if (release.date) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(release.date) ||
      !Number.isFinite(Date.parse(release.date)) ||
      release.date > lastDate
    ) {
      throw new Error("Release dates must be valid and ordered newest first.");
    }
    lastDate = release.date;
  }
  const changeIds = new Set();
  for (const change of release.changes) {
    if (
      !nonempty(change.id) ||
      changeIds.has(change.id) ||
      !["added", "improved", "fixed"].includes(change.category) ||
      !nonempty(change.en) ||
      !nonempty(change.ar)
    ) {
      throw new Error(`Release ${release.id} has an invalid or untranslated change.`);
    }
    changeIds.add(change.id);
  }
}
if ((await readFile("public/release-notes.json", "utf8").catch(() => "")) !== source) {
  await writeFile("public/release-notes.json", source, "utf8");
}
console.log("Prepared release notes from the canonical release history.");
