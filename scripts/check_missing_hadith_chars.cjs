const fs = require('fs');
const { createHadithAudioCorpus } = require('./lib/hadithAudio.cjs');
const { createClient } = require('./lib/r2.cjs');
const { loadEnv } = require('./lib/env.cjs');

loadEnv();

async function main() {
  const r2 = createClient();
  const curriculum = JSON.parse(fs.readFileSync('src/app/learning/hadith/figmaHadithContent.json', 'utf8'));
  const corpus = createHadithAudioCorpus(curriculum);
  
  let missing = [];
  for (const clip of corpus) {
    const exists = await r2.exists(clip.objectKey);
    if (!exists) {
      missing.push(clip);
    }
  }
  const totalChars = missing.reduce((sum, c) => sum + c.chars, 0);
  console.log(`Missing Hadith Clips: ${missing.length}, Total Characters: ${totalChars}`);
  for (const m of missing) {
    console.log(`  Lesson ${m.lessonNumber} (${m.language}): ${m.chars} chars - "${m.text.slice(0, 40)}..."`);
  }
}

main().catch(console.error);
