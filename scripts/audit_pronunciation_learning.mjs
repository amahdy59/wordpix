import fs from "node:fs";
import path from "node:path";

// Read-only input audit. Outputs are review artifacts, never runtime media maps.
const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const curriculum = read("src/app/learning/foundations/figmaPronunciationContent.json");
const manifest = read("src/app/learning/foundations/pronunciationAudioManifest.json");
const normalize = (label) => label.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();
const rows = [];
for (const lesson of curriculum.lessons) {
  for (const item of lesson.images) {
    const clips = manifest.clips[normalize(item.label)] ?? [];
    for (const clip of clips.length ? clips : [null]) {
      const local = clip ? path.join(root, "public", clip.objectKey) : null;
      const bytes = local && fs.existsSync(local) ? fs.statSync(local).size : null;
      rows.push({ lessonId: `lesson-${String(lesson.number).padStart(2, "0")}`, targetId: `target:${encodeURIComponent(item.label.trim().toLowerCase())}`, label: item.label, role: item.role, contextImage: item.context, objectKey: clip?.objectKey ?? "", displayText: clip?.displayText ?? "", synthesisText: clip?.synthesisText ?? "", speaker: clip?.speaker ?? "", localBytes: bytes, status: normalize(item.label) === "pin" ? "reported-pin-pinned-issue" : !clip ? "missing-reference" : bytes === 0 ? "empty-file" : "identity-review-required" });
    }
  }
}
const summary = { lessons: curriculum.lessons.length, lessonTargets: curriculum.lessons.reduce((sum, lesson) => sum + lesson.images.length, 0), clipRows: rows.length, missingReferences: rows.filter((row) => row.status === "missing-reference").length, emptyLocalFiles: rows.filter((row) => row.status === "empty-file").length, reportedIssueRows: rows.filter((row) => row.status === "reported-pin-pinned-issue").length, humanReviewedClips: 0 };
if (!process.argv.includes("--check")) {
  const directory = path.join(root, "output", "pronunciation-review"); fs.mkdirSync(directory, { recursive: true });
  const columns = Object.keys(rows[0]); const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  fs.writeFileSync(path.join(directory, "audio-review.csv"), [columns.join(","), ...rows.map((row) => columns.map((column) => quote(row[column])).join(","))].join("\n") + "\n");
  fs.writeFileSync(path.join(directory, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
}
console.log(JSON.stringify(summary));
if (summary.missingReferences || summary.emptyLocalFiles) process.exitCode = 1;
