const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, 'src', 'app', 'data', 'lessons.ts');
let code = fs.readFileSync(lessonsPath, 'utf8');

// 1. Fix the image paths for FARM and LIVING_ROOM
// Replace img: '/word-images/farm/... to use `${LOCAL_WORD_IMAGES}/farm/...`
code = code.replace(/img:\s*['"]\/word-images\/farm\/([^'"]+)['"]/g, 'img: `${LOCAL_WORD_IMAGES}/farm/$1`');
// Same for living-room if any
code = code.replace(/img:\s*['"]\/word-images\/living-room\/([^'"]+)['"]/g, 'img: `${LOCAL_WORD_IMAGES}/living-room/$1`');

// 2. Refactor Groups

function mergeGroups(groupRegex) {
  let match = code.match(groupRegex);
  if (!match) return;
  
  let originalGroupsStr = match[2]; // match 2 is the array part
  
  // Parse the array using an evil eval since it's just objects
  let groups;
  try {
    groups = eval(`(${originalGroupsStr})`);
  } catch (e) {
    console.error("Failed to eval", groupRegex);
    return;
  }
  
  let newGroups = [];
  let currentGroup = null;
  
  for (let g of groups) {
    if (!currentGroup || currentGroup.topicId !== g.topicId) {
      if (currentGroup) newGroups.push(currentGroup);
      currentGroup = {
        id: g.topicId,
        name: g.name.replace(/\s\d+$/, ''),
        topicId: g.topicId,
        wordIds: [...g.wordIds],
        description: `Learn about ${g.name.replace(/\s\d+$/, '').toLowerCase()}.`,
        story: g.story
      };
    } else {
      currentGroup.wordIds.push(...g.wordIds);
      if (g.story) {
        currentGroup.story += " " + g.story;
      }
    }
  }
  if (currentGroup) newGroups.push(currentGroup);
  
  // Format back to string
  let newGroupsStr = `[\n`;
  for (let g of newGroups) {
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

mergeGroups(/(export const BEDROOM_GROUPS: Lesson\[\] = )([\s\S]*?);/);
mergeGroups(/(export const KITCHEN_GROUPS: Lesson\[\] = )([\s\S]*?);/);
mergeGroups(/(export const LIVING_ROOM_GROUPS: Lesson\[\] = )([\s\S]*?);/);
mergeGroups(/(export const FARM_GROUPS: Lesson\[\] = )([\s\S]*?);/);

fs.writeFileSync(lessonsPath, code);
console.log("Refactoring complete");
