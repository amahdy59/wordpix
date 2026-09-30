import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const manifestPath = "docs/usage-image-manifest-batch-02.csv";
const source = await readFile(manifestPath, "utf8");
function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted && char === '"' && text[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (!quoted && char === ",") { row.push(value); value = ""; }
    else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(value); value = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else value += char;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  const [headers, ...data] = rows;
  return data.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
}
const rows = parseCsv(source.replace(/^\uFEFF/u, ""));
const expected = new Set(rows.map((row) => row.image_name));
const results = [];
for (const row of rows) {
  const file = path.join("public", row.image_path.replace(/^\.\//u, ""));
  try {
    const fileStat = await stat(file);
    const metadata = await sharp(file).metadata();
    const issues = [];
    if (fileStat.size === 0) issues.push("zero-byte file");
    const ratio = metadata.width && metadata.height ? metadata.width / metadata.height : 0;
    if (Math.abs(ratio - 4 / 3) > 0.01 || (metadata.width ?? 0) < 1200 || (metadata.height ?? 0) < 900) {
      issues.push(`expected 4:3 at least 1200x900, found ${metadata.width ?? "?"}x${metadata.height ?? "?"}`);
    }
    if (metadata.format !== "heif") issues.push(`expected AVIF, found ${metadata.format ?? "unknown"}`);
    results.push({ image: row.image_name, status: issues.length ? "invalid" : "ready", issues });
  } catch {
    await access(file).catch(() => undefined);
    results.push({ image: row.image_name, status: "missing", issues: [] });
  }
}
const expectedScenePattern = /^(bedroom|bathroom|kitchen|living-room|fruits)-\d+-scene-\d+\.avif$/u;
const folders = [...new Set(rows.map((row) => path.dirname(row.image_path.replace(/^\.\//u, ""))))];
const extras = [];
for (const folder of folders) {
  for (const file of await readdir(path.join("public", folder)).catch(() => [])) {
    if (expectedScenePattern.test(file) && !expected.has(file)) extras.push(path.join(folder, file));
  }
}
const summary = {
  expected: expected.size,
  ready: results.filter((item) => item.status === "ready").length,
  missing: results.filter((item) => item.status === "missing").length,
  invalid: results.filter((item) => item.status === "invalid").length,
  extras: extras.length,
};
console.log(JSON.stringify({ summary, problems: results.filter((item) => item.status !== "ready"), extras }, null, 2));
if (summary.missing || summary.invalid || summary.extras) process.exitCode = 1;
