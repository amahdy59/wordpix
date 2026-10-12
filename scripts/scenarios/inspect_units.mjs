import fs from "fs";

const content = fs.readFileSync("src/app/data/lessons.ts", "utf8");

export function getUnitDetails(unitId) {
  console.log(`\n========================================`);
  console.log(`UNIT: ${unitId}`);
  console.log(`========================================`);
  
  const regex = new RegExp(`id:\\s*"(${unitId}-\\d+)",[\\s\\S]*?name:\\s*"([^"]+)",[\\s\\S]*?wordIds:\\s*\\[([\\s\\S]*?)\\]`, "g");
  let match;
  while ((match = regex.exec(content)) !== null) {
    const lessonId = match[1];
    const lessonName = match[2];
    const rawWords = match[3];
    const words = rawWords.split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
    console.log(`\nLesson: ${lessonId} — ${lessonName}`);
    console.log(`Words (${words.length}): ${JSON.stringify(words)}`);
  }
}

const targetUnits = process.argv.slice(2);
for (const u of targetUnits) {
  getUnitDetails(u);
}
