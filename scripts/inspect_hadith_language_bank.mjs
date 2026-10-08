import fs from 'node:fs/promises';
const content = JSON.parse(await fs.readFile('src/app/learning/hadith/figmaHadithContent.json','utf8'));
for(const lesson of content.lessons) {
  const lines=lesson.stages.vocabulary.text;
  const start=lines.findIndex(line=>/^useful|^extra vocabulary|^phrasal verbs & collocations/i.test(line));
  console.log(`HADITH ${lesson.number}: ${lesson.title}\n${lines.slice(start).join(' | ')}`);
}
