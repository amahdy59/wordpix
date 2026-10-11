import fs from "node:fs";

const items = JSON.parse(fs.readFileSync("docs/unresolved_figma_items_59.json", "utf8"))
  .filter((i) => i.nextAction.includes("Replacement artwork needed"));

console.log(`Total replacement items: ${items.length}\n`);

items.forEach((it, idx) => {
  console.log(`${idx + 1}. [${it.questionId}]`);
  console.log(`   Reason: ${it.reason}`);
  console.log(`   Text: ${it.currentText}\n`);
});
