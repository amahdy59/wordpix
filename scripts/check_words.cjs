const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { AUDIO_PROFILE, profileFingerprint } = require("./lib/assetKey.cjs");

const ledger = JSON.parse(fs.readFileSync(path.join(__dirname, "../assets/audio-ledger.json"), "utf8"));

function hashFor(text) {
  const profile = profileFingerprint(AUDIO_PROFILE);
  const normalised = String(text).replace(/['']/g, "'").replace(/[""]/g, '"').replace(/\s+/g, " ").trim();
  const payload = profile + "\n" + normalised;
  return crypto.createHash("sha256").update(payload, "utf8").digest("hex");
}

const words = process.argv.slice(2).length ? process.argv.slice(2) :
  ["Bed", "Bedroom", "Pillow", "Sheet", "Blanket", "Bathtub", "Bathroom", "Sink", "Toilet", "Mirror"];

console.log("Profiles match:", profileFingerprint(AUDIO_PROFILE) === ledger.profile);
console.log("Total ledger clips:", Object.keys(ledger.clips).length);
console.log("");
for (const w of words) {
  const hash = hashFor(w);
  const found = hash in ledger.clips;
  console.log(`${w.padEnd(20)} ${found ? "✓ IN LEDGER" : "✗ MISSING"}`);
}
