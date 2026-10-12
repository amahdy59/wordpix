import { execSync } from "child_process";

const units = [
  "observatory",
  "science-lab"
];

console.log(`Starting Stage 4 Cluster 9 synthesis for ${units.length} units: ${units.join(", ")}...`);

for (const unit of units) {
  console.log(`\n======================================================`);
  console.log(`🚀 Synthesizing Unit: ${unit}`);
  console.log(`======================================================`);
  try {
    execSync(`node scripts/generate_listening_scenarios.mjs --unit=${unit}`, {
      stdio: "inherit",
      cwd: process.cwd()
    });
    console.log(`✅ Finished Unit: ${unit}`);
  } catch (err) {
    console.error(`❌ Error in unit ${unit}:`, err.message);
    process.exit(1);
  }
}

console.log("\n🎉 Stage 4 Cluster 9 (Units 140-141) synthesized successfully!");
console.log("🏆 ALL 40 UNITS OF STAGE 4 (B1 WIDER WORLD) ARE NOW 100% COMPLETE!");
