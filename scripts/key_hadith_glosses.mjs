import fs from 'node:fs/promises';
import {createServer} from 'vite';
const file='src/app/learning/hadith/hadithLearnerGlosses.json';
const glosses=JSON.parse(await fs.readFile(file,'utf8'));
if(!Array.isArray(glosses['1'])) process.exit(0);
const content=JSON.parse(await fs.readFile('src/app/learning/hadith/figmaHadithContent.json','utf8'));
const server=await createServer({configFile:false,server:{middlewareMode:true,watch:null},optimizeDeps:{noDiscovery:true},appType:'custom'});
try {
  const {parseHadithVocabulary}=await server.ssrLoadModule('/src/app/learning/hadith/hadithVocabularyContent.ts');
  const keyed=Object.fromEntries(content.lessons.map(lesson=>[lesson.id,Object.fromEntries(parseHadithVocabulary(lesson.stages.vocabulary.text).map((word,index)=>[word.term,glosses[lesson.number][index]]))]));
  await fs.writeFile(file,JSON.stringify(keyed,null,2)+'\n');
} finally {await server.close();}
