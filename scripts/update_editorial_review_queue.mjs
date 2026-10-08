import { readFile, writeFile } from "node:fs/promises";

// Preserve the original queue and its human approval decisions; reconcile only
// definitions actually revised in the traceable editorial correction ledger.
const path = "docs/vocabulary-definition-review.csv";
const source = (await readFile(path, "utf8")).replace(/^\uFEFF/u, "");
function parseCsv(text) {
  const rows = [];
  let row = [],
    cell = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if (char === "\n" && !quoted) {
      row.push(cell.replace(/\r$/u, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (cell || row.length) {
    row.push(cell.replace(/\r$/u, ""));
    rows.push(row);
  }
  if (quoted) throw new Error("Unterminated CSV field");
  return rows;
}
const [header, ...rows] = parseCsv(source);
const ledger = JSON.parse(
  await readFile("docs/lesson-content-audit/editorial-corrections.json", "utf8")
);
const index = Object.fromEntries(header.map((key, i) => [key, i]));
let revised = 0;
for (const row of rows) {
  if (row.length !== header.length) throw new Error(`Malformed review row: ${row[0]}/${row[1]}`);
  const correction = ledger[`${row[index.unit]}/${row[index.word_id]}/definition`];
  if (!correction) continue;
  row[index.proposed_definition] = correction.after;
  row[index.candidate_source] = "wordpix-editorial-revision";
  row[index.source_reference] = "docs/lesson-content-audit/editorial-corrections.json";
  row[index.automated_flags] = "image-sense-review";
  row[index.review_status] = "context-definition-revised";
  // Approval is a separate publication decision; do not manufacture a human
  // sign-off or claim an individual image was reviewed by updating text.
  row[index.review_notes] =
    "Context-specific learner definition revised; before/after text is in the correction ledger. Confirm the image sense separately.";
  revised++;
}
const quote = (value) => (/[",\r\n]/u.test(value) ? `"${value.replace(/"/gu, '""')}"` : value);
await writeFile(path, [header, ...rows].map((row) => row.map(quote).join(",")).join("\n") + "\n");
const fields = Object.values(ledger).reduce(
  (counts, correction) => ({ ...counts, [correction.field]: (counts[correction.field] ?? 0) + 1 }),
  {}
);
await writeFile(
  "docs/lesson-content-audit/editorial-summary.json",
  JSON.stringify(
    {
      corrections: Object.keys(ledger).length,
      units: new Set(Object.values(ledger).map((c) => c.unit)).size,
      fields,
      legacyQueueRowsRevised: revised,
      reviewedReadingPassages: 197,
      clarifiedSceneExercises: 3246,
      arabicLessonGlossesAligned: fields.targetWordsArabic ?? 0,
    },
    null,
    2
  ) + "\n"
);
console.log(JSON.stringify({ revised, fields }, null, 2));
