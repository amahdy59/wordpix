const fs = require("node:fs");
const { recordingInputsDigest } = require("./lib/recording_inputs.cjs");
const report = JSON.parse(fs.readFileSync("src/app/generated/recordedAudioCoverage.json", "utf8"));
if (
  report.status !== "complete" ||
  report.missingRecordings !== 0 ||
  report.unlinkedNewRecordings !== 0 ||
  report.brokenAliases !== 0 ||
  report.removedOriginals !== 0 ||
  report.inputsDigest !== recordingInputsDigest()
) {
  console.error(
    "Recorded audio coverage is incomplete or stale. Finish generation, linking and read-only reconciliation before publishing."
  );
  if (process.argv.includes("--draft"))
    console.log(
      "Draft branch only: production publishing remains blocked until reconciliation is complete."
    );
  else process.exitCode = 1;
} else {
  console.log(
    `Recorded audio release gate passed: ${report.candidates} playback transcripts reconciled.`
  );
}
