import { execSync } from "child_process";

const units = [
  "money-currency",
  "sports-equipment",
  "sports-center",
  "beach",
  "amusement-park"
];

console.log(`Starting Batch 2 synthesis for ${units.length} units: ${units.join(", ")}...`);

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

console.log("\n🎉 Batch 2 synthesized successfully! All Stage 2 (A1 Foundations) complete!");
