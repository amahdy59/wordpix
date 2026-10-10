import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const sourceRoot = path.resolve(".");
const baselineFile = path.join(sourceRoot, "output/protected-media-baseline-2026-10-10.json");

if (!fs.existsSync(baselineFile)) {
  throw new Error("Baseline file missing.");
}

const baseline = JSON.parse(fs.readFileSync(baselineFile, "utf8"));
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

console.log(`Verifying ${baseline.totalFiles} protected files against baseline...`);

let verified = 0;
let mismatches = [];
let missing = [];

for (const entry of baseline.files) {
  const full = path.join(sourceRoot, entry.path);
  if (!fs.existsSync(full)) {
    missing.push(entry.path);
    continue;
  }
  const buf = fs.readFileSync(full);
  const hash = sha256(buf);
  if (hash !== entry.sha256) {
    mismatches.push({ path: entry.path, expected: entry.sha256, actual: hash });
  } else {
    verified++;
  }
}

console.log(`Verification completed:`);
console.log(`  - Verified matching: ${verified}`);
console.log(`  - Mismatches: ${mismatches.length}`);
console.log(`  - Missing: ${missing.length}`);

if (mismatches.length > 0 || missing.length > 0) {
  console.error("Baseline verification failed!", { mismatches, missing });
  process.exit(1);
}

console.log("All protected files unchanged! Media & audio integrity confirmed.");
