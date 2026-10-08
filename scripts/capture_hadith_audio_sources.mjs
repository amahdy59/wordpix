import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const file = 'src/app/learning/hadith/hadithRecordedSourceTexts.json';
try { await fs.access(file); } catch {
  const baseline = JSON.parse(execFileSync('git',['show','HEAD:src/app/learning/hadith/figmaHadithContent.json'],{encoding:'utf8',maxBuffer:8*1024*1024}));
  await fs.writeFile(file,JSON.stringify(Object.fromEntries(baseline.lessons.map(l=>[l.id,{arabic:l.source.arabic,translation:l.source.translation}])),null,2)+'\n');
}
