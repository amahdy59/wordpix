const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, 'src', 'app', 'data', 'lessons.ts');
let code = fs.readFileSync(lessonsPath, 'utf8');

const farmData = JSON.parse(fs.readFileSync(path.join('C:/Users/AhmedMahdy/.gemini/antigravity/brain/1cbfa07d-1fa8-4416-a9f4-473977461d8c/scratch', 'farm_data.json'), 'utf8'));
const validTopics = farmData.topics.filter(t => t.name && t.words.length > 0);

// Deduplicate words (if any duplicates)
let allWordsMap = {};
for (const t of validTopics) {
  for (const w of t.words) {
    if (!allWordsMap[w.id]) {
      allWordsMap[w.id] = {
        id: w.id,
        label: w.label,
        topic: 'farm-' + t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      };
    }
  }
}
const allWords = Object.values(allWordsMap);

// Build FARM_VOCABULARY as array
let farmVocabCode = `export const FARM_VOCABULARY: VocabularyItem[] = [\n`;
for (const w of allWords) {
  farmVocabCode += `  {
    id: '${w.id}',
    label: '${w.label.replace(/'/g, "\\'")}',
    phonetic: '',
    img: '/word-images/farm/${w.id}.webp',
    topic: '${w.topic}',
    description: 'An entity found in the agricultural area.'
  },\n`;
}
farmVocabCode += `];\n\n`;

// Build FARM_TOPICS as array
let farmTopicsCode = `export const FARM_TOPICS: TopicCategory[] = [\n`;
for (const t of validTopics) {
  let topicId = 'farm-' + t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  farmTopicsCode += `  {
    id: '${topicId}',
    name: '${t.name.replace(/'/g, "\\'")}',
    itemsCount: ${t.words.length}
  },\n`;
}
farmTopicsCode += `];\n\n`;

code = code.replace(/export const FARM_VOCABULARY(?:[\s\S]*?)export const FARM_TOPICS/m, `${farmVocabCode}export const FARM_TOPICS`);
code = code.replace(/export const FARM_TOPICS(?:[\s\S]*?)export const FARM_GROUPS/m, `${farmTopicsCode}export const FARM_GROUPS`);

fs.writeFileSync(lessonsPath, code);
console.log('Fixed FARM types to be arrays in lessons.ts');
