const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, profileFingerprint } = require("./lib/assetKey.cjs");

loadEnv();
const r2 = createClient();
const profile = profileFingerprint(AUDIO_PROFILE);
const root = path.resolve(__dirname, "..");

function extractLabels(file) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  return [...content.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);
}

function keyFor(text) {
  const n = String(text).replace(/['']/g, "'").replace(/[""]/g, '"').replace(/\s+/g, " ").trim();
  const h = crypto.createHash("sha256").update(profile + "\n" + n, "utf8").digest("hex");
  return "audio/" + h.slice(0, 2) + "/" + h + ".mp3";
}

async function main() {
  const units = ["bedroom", "bathroom"];
  for (const unit of units) {
    const labels = extractLabels(`src/app/data/units/${unit}.ts`);
    const unique = [...new Set(labels)];
    const missing = [];
    for (const label of unique) {
      const ok = await r2.exists(keyFor(label));
      if (!ok) missing.push(label);
    }
    const pct = Math.round(((unique.length - missing.length) / unique.length) * 100);
    console.log(`\n${unit} (${unique.length} words, ${pct}% in bucket):`);
    if (missing.length === 0) console.log("  All clips present ✓");
    else missing.forEach((w) => console.log(`  ✗ MISSING: ${w}`));
  }
}

main().catch((e) => { console.error(e.message); process.exitCode = 1; });
