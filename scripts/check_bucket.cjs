const crypto = require("crypto");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, profileFingerprint } = require("./lib/assetKey.cjs");

loadEnv();
const r2 = createClient();

function hashFor(text) {
  const profile = profileFingerprint(AUDIO_PROFILE);
  const normalised = String(text).replace(/['']/g, "'").replace(/[""]/g, '"').replace(/\s+/g, " ").trim();
  return crypto.createHash("sha256").update(profile + "\n" + normalised, "utf8").digest("hex");
}

const words = process.argv.slice(2).length ? process.argv.slice(2) :
  ["Bed", "Pillow", "Sheet", "Blanket", "Bathtub", "Sink", "Toilet", "Mirror"];

async function main() {
  for (const w of words) {
    const hash = hashFor(w);
    const key = `audio/${hash.slice(0, 2)}/${hash}.mp3`;
    try {
      const exists = await r2.exists(key);
      console.log(`${w.padEnd(20)} ${exists ? "✓ IN BUCKET" : "✗ NOT IN BUCKET (404)"}`);
    } catch (e) {
      console.log(`${w.padEnd(20)} ✗ ERROR: ${e.message}`);
    }
  }
}

main();
