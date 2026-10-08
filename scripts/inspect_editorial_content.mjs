import fs from "node:fs";
const mode = process.argv[2];
if (mode === "readings") {
  const repairs = JSON.parse(fs.readFileSync("scripts/reading_editorial_repairs.json", "utf8"));
  for (const [id, text] of Object.entries(repairs)) {
    const start = Number(process.argv[3] ?? 0);
    const limit = Number(process.argv[4] ?? 20);
    const index = Object.keys(repairs).indexOf(id);
    if (index < start || index >= start + limit) continue;
    const unit = id.replace(/-\d+$/, "");
    const lesson = JSON.parse(
      fs.readFileSync(`src/app/data/usage/${unit}.usage.json`, "utf8")
    ).find((l) => l.lessonId === id);
    console.log(id, "|", text);
  }
} else {
  for (const unit of process.argv.slice(2)) {
    const data = JSON.parse(fs.readFileSync(`src/app/data/bilingual/${unit}.json`, "utf8"));
    console.log("UNIT", unit);
    for (const [id, item] of Object.entries(data))
      console.log(id, "|", item.definition, "|", item.arabicTranslation);
  }
}
