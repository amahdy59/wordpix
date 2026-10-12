import { execSync } from "child_process";

const units = [
  "cocktail-bar",
  "spirits-liqueurs",
  "classic-cocktails",
  "bar-culture",
  "space-center"
];

console.log(`Starting Stage 6 Cluster 5 (FINAL CURRICULUM BATCH!) synthesis for ${units.length} units: ${units.join(", ")}...`);

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

console.log("\n🎉🎉🎉 WORDPIX 200/200 UNITS (100% CURRICULUM) SYNTHESIZED SUCCESSFULLY! 🎉🎉🎉");
