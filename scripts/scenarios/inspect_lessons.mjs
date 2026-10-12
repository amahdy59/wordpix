import fs from "fs";

const text = fs.readFileSync("./src/app/data/courseCatalog.ts", "utf8");

function showGroups(groupName) {
  const marker = `export const ${groupName}: Lesson[] = [`;
  const idx = text.indexOf(marker);
  if (idx === -1) {
    console.log(`${groupName} not found`);
    return;
  }
  const endMarker = `];\n`;
  const endIdx = text.indexOf(endMarker, idx);
  console.log(`=== ${groupName} ===`);
  console.log(text.slice(idx, endIdx + 3));
}

showGroups("DAILY_ROUTINES_GROUPS");
showGroups("CLASSROOM_GROUPS");
showGroups("TOYS_GAMES_GROUPS");
