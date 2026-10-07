const fs = require("node:fs");
const { course } = require("./conversationBatch.cjs");
const catalog = JSON.parse(
  fs.readFileSync(`src/app/learning/${course}/${course}Catalog.json`, "utf8")
);
module.exports = catalog.map((unit) =>
  course === "business"
    ? {
        ...unit,
        reading: {
          title: unit.mainInput.title,
          fullText: `${unit.mainInput.title}. ${unit.mainInput.context} ${unit.mainInput.dialogue.map((line) => line.text).join(" ")}`,
          paragraphs: [
            unit.mainInput.context,
            ...unit.mainInput.dialogue.map((line) => line.text),
            ...unit.languageBank.flatMap((item) => [item.term, item.example]),
          ],
        },
      }
    : unit
);
