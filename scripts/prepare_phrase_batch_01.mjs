import fs from "node:fs";
import path from "node:path";

const dir = "src/app/data/usagePhrases";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".phrases.json"));

const candidateUnits = [
  "airport",
  "daily-routines",
  "coffee-shop",
  "academic-life",
  "computer-lab",
  "3d-printer-lab",
  "driving-road-rules",
  "post-office",
  "social-situations"
];

const selected = [];

for (const unit of candidateUnits) {
  const file = `${unit}.phrases.json`;
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  const list = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const item of list) {
    if (item.kind === "phrasal-verb" || item.kind === "collocation" || item.kind === "idiom") {
      selected.push({
        id: item.id,
        unitId: item.unitId,
        lessonId: item.lessonId,
        file,
        phrase: item.phrase,
        meaning: item.meaning,
        example: item.example,
        kind: item.kind
      });
    }
  }
}

console.log(`Found ${selected.length} candidates across ${candidateUnits.length} units.`);
// Group by unique phrase to avoid generating identical images for the same phrase
const uniqueByPhrase = new Map();
for (const item of selected) {
  if (!uniqueByPhrase.has(item.phrase)) {
    uniqueByPhrase.set(item.phrase, []);
  }
  uniqueByPhrase.get(item.phrase).push(item);
}

console.log(`Unique phrases: ${uniqueByPhrase.size}`);
const batch = Array.from(uniqueByPhrase.keys()).slice(0, 25).map(phrase => {
  const occurrences = uniqueByPhrase.get(phrase);
  return {
    phrase,
    meaning: occurrences[0].meaning,
    example: occurrences[0].example,
    kind: occurrences[0].kind,
    units: occurrences.map(o => o.unitId),
    items: occurrences.map(o => ({ id: o.id, file: o.file }))
  };
});

console.log("\nBatch of 25 unique phrase actions:");
batch.forEach((b, i) => {
  console.log(`${i + 1}. [${b.kind}] "${b.phrase}" (${b.meaning}) -> used in ${b.items.length} card(s)`);
});

fs.writeFileSync("docs/phrase-batch-01-candidates.json", JSON.stringify(batch, null, 2));
