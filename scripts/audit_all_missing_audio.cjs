const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');
const { AUDIO_PROFILE, AUDIO_PROFILE_V4, audioKey, audioHash } = require('./lib/assetKey.cjs');

loadEnv();

async function main() {
  const r2 = createClient();
  await r2.verify();
  console.log("R2 connection verified.\n");

  const v4Profile = {
    voiceId: "XfNU2rGpBa01ckF309OY",
    modelId: "eleven_v4",
    stability: 0.7,
    similarityBoost: 0.75
  };

  const results = {
    phrases: { total: 0, onR2: 0, missing: [] },
    phraseExamples: { total: 0, onR2: 0, missing: [] },
    curriculumWords: { total: 0, onR2: 0, missing: [] },
    hadithPassages: { total: 0, onR2: 0, missing: [] },
    lessonParagraphs: { total: 0, onR2: 0, missing: [] },
    lessonQuestions: { total: 0, onR2: 0, missing: [] }
  };

  // 1. Phrases & Examples
  const phraseDir = "src/app/data/usagePhrases";
  const uniquePhrases = new Map();
  const uniqueExamples = new Map();

  for (const f of fs.readdirSync(phraseDir)) {
    if (!f.endsWith(".phrases.json")) continue;
    const items = JSON.parse(fs.readFileSync(path.join(phraseDir, f), 'utf8'));
    for (const item of items) {
      if (item.phrase && !uniquePhrases.has(item.phrase)) {
        uniquePhrases.set(item.phrase, { text: item.phrase, kind: item.kind, lessonId: item.lessonId });
      }
      if (item.example && !uniqueExamples.has(item.example)) {
        uniqueExamples.set(item.example, { text: item.example, kind: item.kind, lessonId: item.lessonId });
      }
    }
  }

  results.phrases.total = uniquePhrases.size;
  results.phraseExamples.total = uniqueExamples.size;

  console.log(`Auditing ${uniquePhrases.size} unique phrases...`);
  for (const [text, meta] of uniquePhrases.entries()) {
    const keyLegacy = audioKey(text, AUDIO_PROFILE);
    const keyV4 = audioKey(text, v4Profile);
    const hasLegacy = await r2.exists(keyLegacy);
    const hasV4 = await r2.exists(keyV4);
    if (hasLegacy || hasV4) {
      results.phrases.onR2++;
    } else {
      results.phrases.missing.push({ text, meta, chars: text.length, keyLegacy, keyV4 });
    }
  }

  console.log(`Auditing ${uniqueExamples.size} unique phrase examples (short sentences)...`);
  for (const [text, meta] of uniqueExamples.entries()) {
    const keyLegacy = audioKey(text, AUDIO_PROFILE);
    const keyV4 = audioKey(text, v4Profile);
    const hasLegacy = await r2.exists(keyLegacy);
    const hasV4 = await r2.exists(keyV4);
    if (hasLegacy || hasV4) {
      results.phraseExamples.onR2++;
    } else {
      results.phraseExamples.missing.push({ text, meta, chars: text.length, keyLegacy, keyV4 });
    }
  }

  // 2. Curriculum Words (1,232 terms from manifest)
  const manifestPath = "src/app/learning/shared/curriculumAudioManifest.json";
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const terms = Object.entries(manifest.terms || {});
    results.curriculumWords.total = terms.length;
    console.log(`Auditing ${terms.length} specialist curriculum terms...`);
    for (const [term, entry] of terms) {
      const key = entry.objectKey;
      const keyV4 = audioKey(entry.synthesisText, v4Profile);
      const exists = (await r2.exists(key)) || (await r2.exists(keyV4));
      if (exists) {
        results.curriculumWords.onR2++;
      } else {
        results.curriculumWords.missing.push({ term, text: entry.synthesisText, chars: entry.chars, key, keyV4 });
      }
    }
  }

  // Summary
  console.log("\n=== AUDIT RESULTS ACROSS AUDIO ASSET TYPES ===");
  console.log(`1. Phrases (collocations, expressions, phrasal verbs, idioms):`);
  console.log(`   Total: ${results.phrases.total} | On R2: ${results.phrases.onR2} | Missing: ${results.phrases.missing.length}`);
  const missingPhraseChars = results.phrases.missing.reduce((acc, i) => acc + i.chars, 0);
  console.log(`   Missing characters: ${missingPhraseChars}`);

  console.log(`2. Phrase Examples (short sentences & everyday usage):`);
  console.log(`   Total: ${results.phraseExamples.total} | On R2: ${results.phraseExamples.onR2} | Missing: ${results.phraseExamples.missing.length}`);
  const missingExampleChars = results.phraseExamples.missing.reduce((acc, i) => acc + i.chars, 0);
  console.log(`   Missing characters: ${missingExampleChars}`);

  console.log(`3. Specialist Curriculum Terms (Business, Hadith, Conversation):`);
  console.log(`   Total: ${results.curriculumWords.total} | On R2: ${results.curriculumWords.onR2} | Missing: ${results.curriculumWords.missing.length}`);
  const missingWordChars = results.curriculumWords.missing.reduce((acc, i) => acc + i.chars, 0);
  console.log(`   Missing characters: ${missingWordChars}`);

  const totalMissingClips = results.phrases.missing.length + results.phraseExamples.missing.length + results.curriculumWords.missing.length;
  const totalMissingChars = missingPhraseChars + missingExampleChars + missingWordChars;

  console.log(`\nTOTAL MISSING SHORT CLIPS: ${totalMissingClips} clips | ${totalMissingChars} characters`);
  console.log(`Account Character Balance: 131,000 available`);

  fs.writeFileSync("scratch/audit_audio_results.json", JSON.stringify(results, null, 2));
}

main().catch(console.error);
