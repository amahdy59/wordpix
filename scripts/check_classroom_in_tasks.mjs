import fs from 'node:fs';

const tasks = JSON.parse(fs.readFileSync('output/deck3_tasks.json', 'utf8'));
const usageSceneTasks = tasks.filter(t => (t.contentId || '').includes('usage-scene'));
const classroomTasks = usageSceneTasks.filter(t => t.unit === 'classroom');

console.log(`Classroom usage tasks in Deck 3: ${classroomTasks.length}`);
