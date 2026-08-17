const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, 'src', 'app', 'data', 'lessons.ts');
let code = fs.readFileSync(lessonsPath, 'utf8');

function fixGroups(groupRegex) {
  let match = code.match(groupRegex);
  if (!match) return;
  
  let originalGroupsStr = match[2];
  let groups = eval(`(${originalGroupsStr})`);
  
  for (let g of groups) {
    g.wordIds = [...new Set(g.wordIds)];
  }
  
  let newGroupsStr = `[\n`;
  for (let g of groups) {
    newGroupsStr += `  {
    id: "${g.id}",
    name: "${g.name}",
    topicId: "${g.topicId}",
    wordIds: ${JSON.stringify(g.wordIds).replace(/"/g, "'")},
    description: "${g.description}",
    story: ${JSON.stringify(g.story)}
  },\n`;
  }
  newGroupsStr += `]`;
  
  code = code.replace(groupRegex, (fullMatch, prefix, arrayBody) => {
    return prefix + newGroupsStr + ";";
  });
}

fixGroups(/(export const BEDROOM_GROUPS: Lesson\[\] = )([\s\S]*?);/);
fixGroups(/(export const KITCHEN_GROUPS: Lesson\[\] = )([\s\S]*?);/);
fixGroups(/(export const LIVING_ROOM_GROUPS: Lesson\[\] = )([\s\S]*?);/);
fixGroups(/(export const FARM_GROUPS: Lesson\[\] = )([\s\S]*?);/);

fs.writeFileSync(lessonsPath, code);
console.log("Deduplication complete");
