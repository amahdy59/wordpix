const fs = require('fs');
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');
const { AUDIO_PROFILE, audioKey } = require('./lib/assetKey.cjs');

loadEnv();

async function main() {
  const r2 = createClient();
  const fileContent = fs.readFileSync('src/app/data/canDoScenarios.ts', 'utf8');

  // Parse modelResponseEn and keyPhrases
  const modelResponses = [...fileContent.matchAll(/modelResponseEn:\s*\"([^\"]+)\"/g)].map(m => m[1]);
  const keyPhrases = [...fileContent.matchAll(/en:\s*\"([^\"]+)\"/g)].map(m => m[1]);

  console.log(`Found ${modelResponses.length} model responses and ${keyPhrases.length} key phrases in canDoScenarios.ts`);

  const v4Profile = {
    voiceId: "XfNU2rGpBa01ckF309OY",
    modelId: "eleven_v4",
    stability: 0.7,
    similarityBoost: 0.75
  };

  let missingMR = [];
  for (const text of modelResponses) {
    const k1 = audioKey(text, AUDIO_PROFILE);
    const k2 = audioKey(text, v4Profile);
    const has = (await r2.exists(k1)) || (await r2.exists(k2));
    if (!has) missingMR.push(text);
  }

  let missingKP = [];
  for (const text of keyPhrases) {
    const k1 = audioKey(text, AUDIO_PROFILE);
    const k2 = audioKey(text, v4Profile);
    const has = (await r2.exists(k1)) || (await r2.exists(k2));
    if (!has) missingKP.push(text);
  }

  console.log(`Model responses missing: ${missingMR.length}/${modelResponses.length}`);
  if (missingMR.length) console.log('Missing model responses:', missingMR);

  console.log(`Key phrases missing: ${missingKP.length}/${keyPhrases.length}`);
  if (missingKP.length) console.log('Missing key phrases:', missingKP);
}

main().catch(console.error);
