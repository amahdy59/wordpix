import fs from "node:fs/promises";
import {
  buildQualityRows,
  parseLearnerImageReports,
  safeInlineJson,
} from "./lib/image_quality_dashboard.mjs";

const read = async (path) => JSON.parse(await fs.readFile(path, "utf8"));
const args = process.argv.slice(2);
if (args.length !== 0 && !(args.length === 2 && args[0] === "--reports"))
  throw Error(
    "Usage: node scripts/build_image_quality_dashboard.mjs [--reports exported-reports.json]"
  );
const [runtime, additional, catalog, decisions, purposes] = await Promise.all([
  read("output/media-catalog/visual-reconciliation.json"),
  read("output/media-catalog/additional-visual-coverage.json"),
  read("output/media-catalog/catalog.json"),
  read("docs/media/visual-decisions.json"),
  read("docs/media/visual-purpose-decisions.json"),
]);
const rows = buildQualityRows({
  demands: runtime.demands,
  additional: additional.uses,
  catalog,
  decisions,
  purposes,
});
const reports = args.includes("--reports")
  ? parseLearnerImageReports(await read(args[args.indexOf("--reports") + 1]))
  : [];
// Practice images outside this audit's scope still need a visible triage row.
for (const report of reports) {
  if (
    rows.some(
      (row) =>
        row.text === report.context.text &&
        row.url === report.assetUrl &&
        (!report.context.wordId ||
          row.wordId === report.context.wordId ||
          `${row.lessonId}-${row.wordId}` === report.context.wordId)
    )
  )
    continue;
  rows.push({
    id: `report-${report.id}`,
    unitId: report.context.unitId ?? "learner-reports/unmatched",
    wordId: report.context.wordId ?? null,
    kind: "learner-report",
    text: report.context.text,
    revision: report.contentId,
    url: report.assetUrl,
    key: null,
    status: "learner-report",
    semantic: "not reviewed",
    purpose: "needs review",
    referenceOnly: false,
    inventory: "outside current coverage scope",
    byteEvidence: "not verified by dashboard",
    candidateCount: 0,
  });
}
const template = await fs.readFile("scripts/templates/image-quality-dashboard.html", "utf8");
const html = template.replace(
  "/* DASHBOARD_DATA */",
  `const data = ${safeInlineJson({ generatedAt: new Date().toISOString(), inventoryAt: catalog.summary.inventoryCapturedAt, rows, reports })};`
);
await fs.mkdir("output/image-quality", { recursive: true });
await fs.writeFile("output/image-quality/index.html", html);
await fs.writeFile(
  "output/image-quality/summary.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      uses: rows.length,
      unassigned: rows.filter((row) => !row.url).length,
      confirmedMismatches: rows.filter((row) => row.semantic === "confirmed mismatch").length,
      purposeUnreviewed: rows.filter((row) => row.purpose === "needs review").length,
      importedReports: reports.length,
      r2Writes: 0,
    },
    null,
    2
  ) + "\n"
);
console.log("Dashboard: output/image-quality/index.html (local maintainer report; no live writes)");
