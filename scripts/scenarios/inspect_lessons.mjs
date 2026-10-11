import fs from "fs";

const text = fs.readFileSync("./src/app/data/courseCatalog.ts", "utf8");

function showGroups(groupName) {
  const marker = `export const ${groupName}: Lesson[] = [`;
  const idx = text.indexOf(marker);
  if (idx === -1) {
    console.log(`${groupName} not found`);
    return;
  }
  const endMarker = `];`;
  const endIdx = text.indexOf(endMarker, idx);
  console.log(`=== ${groupName} ===`);
  console.log(text.slice(idx, endIdx + 2));
}

showGroups("FRUITS_GROUPS");
showGroups("VEGETABLES_GROUPS");
showGroups("TELLING_TIME_GROUPS");
showGroups("DAYS_MONTHS_GROUPS");
showGroups("DAILY_ACTION_VERBS_GROUPS");
