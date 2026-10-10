import fs from "node:fs";
import path from "node:path";

const dir = "src/app/data/usagePhrases";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".phrases.json"));

let total = 0;
let withImg = 0;
let withoutImg = 0;
const uniqueMissing = new Map();

for (const file of files) {
  const items = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  for (const item of items) {
    total++;
    if (item.imagePath) {
      withImg++;
    } else {
      withoutImg++;
      if (!uniqueMissing.has(item.phrase)) {
        uniqueMissing.set(item.phrase, {
          phrase: item.phrase,
          meaning: item.meaning,
          example: item.example,
          kind: item.kind,
          unitId: item.unitId,
          items: []
        });
      }
      uniqueMissing.get(item.phrase).items.push({ id: item.id, file });
    }
  }
}

console.log("Total phrase cards:", total);
console.log("With image:", withImg);
console.log("Without image:", withoutImg);
console.log("Unique missing phrases to generate:", uniqueMissing.size);

const missingList = Array.from(uniqueMissing.values());
fs.writeFileSync("docs/remaining-phrases-queue.json", JSON.stringify(missingList, null, 2));
console.log("Wrote docs/remaining-phrases-queue.json");
