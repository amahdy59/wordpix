const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

/** Bind coverage to playback code and content, excluding generated availability indexes. */
function recordingInputsDigest() {
  const files = [
    "scripts/plan_recorded_audio.ts",
    "src/app/core/SettingsPage.tsx",
    "src/app/core/SettingsModal.tsx",
  ];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.posix.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.(?:ts|tsx|mjs|json)$/.test(file) && entry.name !== "releaseNotes.json")
        files.push(file);
    }
  }
  for (const directory of [
    "src/app/data",
    "src/app/exercises",
    "src/app/learning",
    "src/app/shared",
    "src/app/onboarding",
  ])
    visit(directory);
  const digest = crypto.createHash("sha256");
  for (const file of files.sort())
    digest
      .update(file)
      .update("\0")
      .update(fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n"))
      .update("\0");
  return digest.digest("hex");
}

module.exports = { recordingInputsDigest };
