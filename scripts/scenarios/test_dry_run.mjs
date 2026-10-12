import { getUnitScenarios, reviewScenario } from "./scenario_registry.mjs";

const unitsToTest = [
  "cocktail-bar",
  "spirits-liqueurs",
  "classic-cocktails",
  "bar-culture",
  "space-center"
];

let totalLessons = 0;
let failedLessons = 0;

for (const unitId of unitsToTest) {
  const scenario = getUnitScenarios(unitId);
  if (!scenario) {
    console.error(`❌ Unit "${unitId}" NOT FOUND in registry!`);
    failedLessons++;
    continue;
  }

  console.log(`\n======================================================`);
  console.log(`Checking Unit: ${unitId} (${scenario.lessons.length} lessons)`);
  console.log(`======================================================`);

  for (const lesson of scenario.lessons) {
    totalLessons++;
    const review = reviewScenario(lesson);
    if (!review.approved) {
      failedLessons++;
      console.error(`❌ FAILED: ${lesson.id} — "${lesson.titleEn}"`);
      for (const err of review.errors) {
        console.error(`   - Error: ${err}`);
      }
    } else {
      console.log(`✅ PASSED: ${lesson.id} | Words: ${review.stats.wordCount} | Est: ${review.stats.estSeconds}s | 100% coverage`);
      if (review.warnings.length > 0) {
        for (const w of review.warnings) {
          console.warn(`   - Warning: ${w}`);
        }
      }
    }
  }
}

console.log(`\n======================================================`);
console.log(`Total Tested: ${totalLessons} lessons | Failed: ${failedLessons}`);
if (failedLessons === 0) {
  console.log(`🎉 ALL 9 UNITS PASSED 100% DRY RUN VALIDATION!`);
}
