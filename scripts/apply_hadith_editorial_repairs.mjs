import fs from 'node:fs/promises';
import { createServer } from 'vite';
const file = 'src/app/learning/hadith/figmaHadithContent.json';
const content = JSON.parse(await fs.readFile(file,'utf8'));
const repairs = JSON.parse(await fs.readFile('scripts/hadith_definition_repairs.json','utf8'));
const server = await createServer({configFile:false,server:{middlewareMode:true,watch:null},optimizeDeps:{noDiscovery:true},appType:'custom'});
const notes = [];
try {
  const {parseHadithVocabulary} = await server.ssrLoadModule('/src/app/learning/hadith/hadithVocabularyContent.ts');
  for (const lesson of content.lessons) {
    const lines = lesson.stages.vocabulary.text;
    const words = parseHadithVocabulary(lines);
    if (words.length !== 5 || repairs[lesson.number]?.length !== 5) throw new Error(`Vocabulary requires review: ${lesson.id}`);
    words.forEach((word,index)=>{
      const after = repairs[lesson.number][index];
      const position = lines.indexOf(word.definition);
      if (position < 0) throw new Error(`Definition not found: ${lesson.id}/${word.term}`);
      if (word.definition !== after) notes.push({lessonId:lesson.id,term:word.term,field:'definition',before:word.definition,after});
      lines[position] = after;
    });
    if (lesson.number === 4) {
      const examples = ['The team brought together its ideas before making a plan.','The first task took ten minutes; the second continued for a like period.','Please write down the date of your appointment.','Parents work to provide sustenance for their families.','The average life span of this species is ten years.'];
      let exampleIndex = 0;
      lesson.stages.vocabulary.text = lines.map(line => /^e\.g\./i.test(line) && exampleIndex < 5 ? `e.g. "${examples[exampleIndex++]}"` : line);
    }
    for (const stage of Object.values(lesson.stages)) {
      stage.text = stage.text.map(line => line.replace('a Islamic scholars','an Islamic scholar').replace('gainlove','gain love').replace('whatpossessions','what possessions').replace('both teams to both do well','both teams to do well').replace('handle with care injured animals','handle injured animals with care').replace('treat kindly all laboratory animals','treat all laboratory animals kindly').replace(/Record yourself|Record a |Record your voice|record your voice/g,'Speak aloud ').replace('record another attempt','try speaking again'));
    }
    const languageCorrections = {
      6: ["lawful ≈ permitted; pure emphasizes high spiritual and physical quality", "lawful ≈ permitted; pure describes cleanliness or freedom from unwanted elements"],
      9: ["can ≈ be able to; 'can' is informal while 'be able to' is preferred in formal contexts", "can ≈ be able to; use be able to where can has no required verb form, for example will be able to"],
      20: ["modest ≠ shy; shy describes social anxiety, while modest reflects ethical dignity", "modest ≠ shy; modest describes not boasting, while shy describes feeling reserved or uncomfortable with others"],
      26: ["Not: Say a kind word to them.", "Not: Say them a kind word."],
      32: ["Not: Do not do harm to them.", "Not: Do not cause them harmful."],
      34: ["respond ≠ react; respond suggests deliberate, thoughtful reply while react is automatic impulse", "respond and react both describe a response; respond often emphasizes a reply, while react emphasizes a change in behaviour or feeling"],
      39: ["mistake ≠ accident; a mistake is an error in action, while an accident is an unforeseen physical event", "a mistake is an error; an accident is an unintended event, often one causing damage or injury"],
      41: ["guide ≠ control; guidance directs illuminatingly while control forces physically", "guide means help someone find a direction; control means determine or restrict what happens"]
    };
    const correction = languageCorrections[lesson.number];
    if (correction) lesson.stages.vocabulary.text = lesson.stages.vocabulary.text.map(line=>line === correction[0] ? correction[1] : line);
  }
  const third = content.lessons[2];
  third.stages['check-review'].text = third.stages['check-review'].text.map(line => line.replace('Shahada, prayer, charity, fasting, and pilgrimage.','Shahada, prayer, zakat, pilgrimage, and fasting.'));
} finally {await server.close();}
for(let attempt=0;;attempt++) {
  try {await fs.writeFile(file,JSON.stringify(content,null,2)+'\n'); break;} catch(error) {
    if(attempt>=4||!['UNKNOWN','EBUSY','EPERM'].includes(error.code)) throw error;
    await new Promise(resolve=>setTimeout(resolve,100*2**attempt));
  }
}
const ledgerFile = 'docs/lesson-content-audit/hadith-vocabulary-corrections.json';
const existing = JSON.parse(await fs.readFile(ledgerFile,'utf8').catch(()=> '[]'));
for(const note of notes) {
  const prior = existing.find(item=>item.lessonId===note.lessonId && item.term===note.term && item.field===note.field);
  if(prior) prior.after=note.after; else existing.push(note);
}
await fs.writeFile(ledgerFile,JSON.stringify(existing,null,2)+'\n');
console.log(`${notes.length} individual definitions simplified across all 42 lessons.`);
