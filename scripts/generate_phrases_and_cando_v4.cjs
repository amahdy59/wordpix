const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');
const { audioHash, audioKey } = require('./lib/assetKey.cjs');

loadEnv();

const V4_PROFILE = {
  voiceId: "XfNU2rGpBa01ckF309OY", // Nichalia
  modelId: "eleven_v4",
  stability: 0.7,
  similarityBoost: 0.75
};

const missingPhrases = [
  'check the gate number',
  'Which gate does the flight leave from?',
  'check the departure time',
  'Is the flight on time?',
  'board the plane',
  'Which pier does the ferry leave from?',
  'confirm the departure pier'
];

const missingExamples = [
  'Check the gate number on your boarding pass before going to the departure area.',
  'Omar checks in online before travelling to the airport.',
  'After landing, collect your luggage at baggage claim.',
  'Excuse me, which gate does the flight leave from?',
  'Omar sets off for the airport early to leave time for check-in.',
  'Omar checks the departure time before leaving for the airport.',
  'Excuse me, is the flight on time?',
  'Passengers board the plane after the gate agent calls their group.',
  'The venue implemented a responsible-service policy across all staff roles.',
  'The tutor describes the heart’s pumping function to the class.',
  'I do not understand the term filtration. Could you explain that in simpler terms?',
  'The heart and lungs work together to supply the body with oxygen.',
  'Leila understands the diagram showing the stomach and intestines.',
  'Which part does this diagram show beside the stomach?',
  'The research team plans an observation and carries it out.',
  'The learner identifies the liver on the teaching model.',
  'This model shows the spleen. What is its main function?',
  'Digestion breaks food down into smaller substances.',
  'Which pier does the ferry leave from this afternoon?',
  'She confirmed the departure pier with the ferry operator.',
  'Is the property still available for rent, or has another tenant taken it?'
];

const canDoModelResponses = [
  'Excuse me, does the house soup contain any dairy or nuts? I have a slight allergy.',
  'Hello, this is room 304. There is no hot water in the shower. Could maintenance please check it?',
  'I have had a persistent dry cough and mild fever for three days. What medication do you recommend?',
  'The quarterly report draft is ready for review. Could you take a look and share feedback by 3 PM?',
  'Excuse me, my boarding pass shows Gate 14, but the screen changed. Could you confirm the current gate?',
  'Excuse me, which aisle can I find olive oil in? And do you have organic vegetables?',
  'Does this queen-size bed frame come with a mattress, and do you offer home delivery?',
  'The bathroom sink faucet is constantly dripping, and the shower drain seems clogged.',
  'Hello! It is a pleasure to meet you. I live nearby, and in my free time I enjoy learning languages.'
];

const canDoKeyPhrases = [
  'Does this contain...?',
  'I have an allergy to...',
  'Could I please have...?',
  'There is an issue with...',
  'Could someone check...?',
  'Could we have extra pillows?',
  'I have been experiencing...',
  'How often should I take this?',
  'Are there any side effects?',
  'The draft is ready for review',
  'Could you share your thoughts?',
  "Let's reach a decision together",
  'Which gate is flight...?',
  'Is the flight on schedule?',
  'Where is baggage claim?',
  'Which aisle is... in?',
  'Do you have any in stock?',
  'How much does this cost?',
  'Does it come with...?',
  'Do you offer delivery?',
  'What are the dimensions?',
  'The faucet is leaking',
  'The drain is clogged',
  'Could you fix this today?',
  'It is a pleasure to meet you',
  'In my daily routine, I...',
  'Could you tell me more about...?'
];

async function synthesise(text, apiKey) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${V4_PROFILE.voiceId}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: V4_PROFILE.modelId,
      voice_settings: {
        stability: V4_PROFILE.stability,
        similarity_boost: V4_PROFILE.similarityBoost,
      },
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const error = new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 300)}`);
    error.status = res.status;
    throw error;
  }

  const audio = Buffer.from(await res.arrayBuffer());
  if (audio.length < 1024) {
    throw new Error(`Invalid ${audio.length}-byte audio for '${text}'`);
  }
  return audio;
}

async function withRetry(fn, label, attempts = 4) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      const status = error.status ?? 0;
      const retriable = status === 429 || status >= 500 || status === 0;
      if (!retriable || attempt >= attempts) throw error;
      const waitMs = Math.min(30000, 1000 * 2 ** attempt);
      console.warn(`  [Retry ${attempt}/${attempts - 1}] ${label} in ${waitMs}ms: ${error.message}`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

async function main() {
  const isConfirm = process.argv.includes('--confirm');
  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.Elevenlabs_API_key;
  if (!apiKey) throw new Error("No ElevenLabs API key found in .env.local");

  const r2 = createClient();
  await r2.verify();

  const allItems = [
    ...missingPhrases.map(t => ({ text: t, tier: 'phrases' })),
    ...missingExamples.map(t => ({ text: t, tier: 'phrase-examples' })),
    ...canDoModelResponses.map(t => ({ text: t, tier: 'can-do-responses' })),
    ...canDoKeyPhrases.map(t => ({ text: t, tier: 'can-do-phrases' }))
  ];

  // Deduplicate by text
  const uniqueItems = [];
  const seen = new Set();
  for (const item of allItems) {
    const norm = item.text.trim();
    if (!seen.has(norm)) {
      seen.add(norm);
      uniqueItems.push({ ...item, text: norm, hash: audioHash(norm, V4_PROFILE), key: audioKey(norm, V4_PROFILE) });
    }
  }

  console.log(`Total unique items to process: ${uniqueItems.length}`);
  const totalChars = uniqueItems.reduce((acc, i) => acc + i.text.length, 0);
  console.log(`Total characters: ${totalChars}`);

  let missingOnR2 = [];
  for (const item of uniqueItems) {
    const exists = await r2.exists(item.key);
    if (!exists) {
      missingOnR2.push(item);
    }
  }

  console.log(`Missing on R2: ${missingOnR2.length}/${uniqueItems.length}`);
  const missingChars = missingOnR2.reduce((acc, i) => acc + i.text.length, 0);
  console.log(`Missing characters: ${missingChars}`);

  if (!isConfirm) {
    console.log("\n[DRY RUN] Pass --confirm to generate and upload.");
    return;
  }

  console.log("\nStarting generation with model 'eleven_v4'...");
  let ledgerPath = path.join(__dirname, '..', 'assets', 'audio-ledger-v4-repaired.json');
  let ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

  let generated = 0;
  for (const item of missingOnR2) {
    console.log(`[${generated + 1}/${missingOnR2.length}] Synthesizing (${item.text.length} chars): "${item.text.slice(0, 50)}"...`);
    const audio = await withRetry(() => synthesise(item.text, apiKey), item.text);

    // Save local backup
    const backupPath = path.join(__dirname, '..', 'audio_backup', item.key);
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.writeFileSync(backupPath, audio);

    // Upload to R2
    await r2.put(item.key, audio, { contentType: 'audio/mpeg', immutable: true });

    // Update ledger
    ledger.clips[item.hash] = {
      tier: item.tier,
      chars: item.text.length,
      bytes: audio.length,
      model: "eleven_v4"
    };

    generated++;
    // Small delay to be gentle on API rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
  console.log(`\nSuccessfully generated, backed up locally, and uploaded ${generated} clips to R2!`);
}

main().catch(console.error);
