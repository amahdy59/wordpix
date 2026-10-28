import fs from 'node:fs';

const tasks = JSON.parse(fs.readFileSync('output/deck3_tasks.json', 'utf8'));

const contentIdTypes = {};
let countWithContentId = 0;
let countUsageScene = 0;
let countRefDialogue = 0;
let countRefPhrase = 0;

for (const t of tasks) {
  const cid = t.contentId || '';
  if (cid) {
    countWithContentId++;
    if (cid.includes('usage-scene')) countUsageScene++;
    else if (cid.includes('reference-dialogue') || cid.includes('reading')) countRefDialogue++;
    else if (cid.includes('reference:')) countRefPhrase++;
    else {
      const type = cid.split(':')[1] || 'other';
      contentIdTypes[type] = (contentIdTypes[type] || 0) + 1;
    }
  }
}

console.log({
  totalTasks: tasks.length,
  countWithContentId,
  countUsageScene,
  countRefDialogue,
  countRefPhrase,
  otherTypes: contentIdTypes
});
