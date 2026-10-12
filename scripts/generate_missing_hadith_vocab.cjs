const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');
const { AUDIO_PROFILE, audioHash, audioKey, profileFingerprint } = require('./lib/assetKey.cjs');
const { getPronunciationAssetSpec } = require('./lib/pronunciationOverrides.cjs');

loadEnv();

const ROOT = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'src', 'app', 'learning', 'shared', 'curriculumAudioManifest.json');

const MISSING_TERMS = [
  { lesson: 'hadith-07', term: 'give sincere advice' },
  { lesson: 'hadith-07', term: 'in private' },
  { lesson: 'hadith-07', term: 'accept advice' },
  { lesson: 'hadith-13', term: 'share with you' },
  { lesson: 'hadith-13', term: 'support you' },
  { lesson: 'hadith-17', term: 'handle with care' },
  { lesson: 'hadith-17', term: 'reduce suffering' },
  { lesson: 'hadith-17', term: 'prepare before' },
  { lesson: 'hadith-17', term: 'treat kindly' },
  { lesson: 'hadith-25', term: 'give charity' },
  { lesson: 'hadith-25', term: 'receive a reward' },
  { lesson: 'hadith-34', term: 'see wrongdoing' },
  { lesson: 'hadith-34', term: 'change through lawful action' },
  { lesson: 'hadith-34', term: 'speak against' },
  { lesson: 'hadith-34', term: 'be able to' },
  { lesson: 'hadith-34', term: 'reject in the heart' },
  { lesson: 'hadith-38', term: 'show enmity' },
  { lesson: 'hadith-38', term: 'draw near' },
  { lesson: 'hadith-39', term: 'be forced to' },
  { lesson: 'hadith-40', term: 'take advantage of' },
  { lesson: 'hadith-41', term: 'truly believe' },
  { lesson: 'hadith-41', term: 'align with' },
  { lesson: 'hadith-42', term: 'reach the clouds' },
];

async function synthesise(text, apiKey) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${AUDIO_PROFILE.voiceId}?output_format=mp3_44100_128`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_v4',
          voice_settings: {
            stability: AUDIO_PROFILE.stability,
            similarity_boost: AUDIO_PROFILE.similarityBoost,
          },
        }),
        signal: AbortSignal.timeout(60_000),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 300)}`);
      }

      const audio = Buffer.from(await res.arrayBuffer());
      if (audio.length < 1024) {
        throw new Error(`Invalid ${audio.length}-byte audio for '${text}'`);
      }
      return audio;
    } catch (err) {
      if (attempt === 3) throw err;
      console.warn(`   [Retry ${attempt}/3] ${err.message}, waiting 2s...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.Elevenlabs_API_key;
  if (!apiKey) {
    throw new Error('Missing ElevenLabs API key');
  }

  const r2 = createClient();
  await r2.verify();

  console.log(`Starting generation for ${MISSING_TERMS.length} missing Hadith vocabulary phrases...`);
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  let generated = 0;
  let uploaded = 0;

  for (let i = 0; i < MISSING_TERMS.length; i++) {
    const { lesson, term } = MISSING_TERMS[i];
    const spec = getPronunciationAssetSpec(term, AUDIO_PROFILE);
    const objectKey = audioKey(spec.text, spec.profile);
    const backupPath = path.join(ROOT, 'audio_backup', objectKey);

    let audioBuffer = null;
    if (fs.existsSync(backupPath)) {
      audioBuffer = fs.readFileSync(backupPath);
      console.log(`[${i + 1}/${MISSING_TERMS.length}] Found local backup: "${term}" (${objectKey})`);
    } else {
      console.log(`[${i + 1}/${MISSING_TERMS.length}] Generating with eleven_v4: "${term}" (${spec.text.length} chars)...`);
      audioBuffer = await synthesise(spec.text, apiKey);
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.writeFileSync(backupPath, audioBuffer);
      generated++;
      console.log(`   Saved locally: ${backupPath} (${audioBuffer.length} bytes)`);
      // Small delay between API calls
      await new Promise((r) => setTimeout(r, 600));
    }

    const existsInR2 = await r2.exists(objectKey);
    if (!existsInR2) {
      console.log(`   Uploading to R2: ${objectKey}...`);
      await r2.put(objectKey, audioBuffer, 'audio/mpeg');
      uploaded++;
      console.log(`   Uploaded successfully to R2.`);
    } else {
      console.log(`   Already exists in R2: ${objectKey}`);
    }

    // Add to manifest clips
    manifest.clips[term] = {
      objectKey,
      synthesisText: spec.text,
      category: 'vocabulary',
      domains: ['hadith'],
      chars: spec.text.length,
    };
  }

  // Save updated manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`\nUpdated manifest written to ${MANIFEST_PATH}`);
  console.log(`Summary: Generated ${generated} clips, Uploaded ${uploaded} clips.`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
