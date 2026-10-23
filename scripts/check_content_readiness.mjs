import fs from "node:fs/promises";

// Reports evidence without converting structural checks into editorial approval.
const ledger = JSON.parse(
  await fs.readFile("docs/lesson-content-audit/manual-review-progress.json", "utf8")
);
if (
  ledger.records.length !== ledger.units ||
  new Set(ledger.records.map((row) => row.unit)).size !== ledger.units
)
  throw new Error("Editorial ledger has incomplete or duplicate unit identities");
const read = ledger.records.filter((row) =>
  row.definitionAndArabicReview.startsWith("read-individually")
).length;
if (read !== ledger.vocabularyUnitsRead)
  throw new Error("Editorial vocabulary count disagrees with its records");
console.log(
  JSON.stringify(
    {
      units: ledger.units,
      vocabularyUnitsRead: read,
      vocabularyUnitsPending: ledger.units - read,
      completeLessonApprovals: ledger.completeLessonApprovals,
      learnerCalibration:
        "Pending participant recruitment and delayed transfer sessions; not inferred from automated checks",
    },
    null,
    2
  )
);
if (
  process.argv.includes("--require-complete") &&
  (read !== ledger.units || ledger.completeLessonApprovals === 0)
) {
  console.error(
    "Editorial approval is incomplete. Do not claim that all lessons or CEFR levels are validated."
  );
  process.exitCode = 1;
}
