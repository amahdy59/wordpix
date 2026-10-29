const fs = require('fs');
const path = require('path');

async function main() {
  const envText = fs.readFileSync('.env.local', 'utf8');
  const env = Object.fromEntries(
    envText
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  );
  const key = env.Elevenlabs_API_key_2;

  const outDir = path.resolve('assets/samples/audio');
  fs.mkdirSync(outDir, { recursive: true });

  const VOICE_TARIQ = 'JBFqnCBsd6RMkjVDRZzb'; // George (British, warm, articulate)
  const VOICE_ADAM = 'bIHbv24MWmeRgasZH58o';  // Will (American, expressive)

  const lines = [
    {
      id: '01_tariq_alarm',
      speaker: 'Tariq',
      voiceId: VOICE_TARIQ,
      text: 'Adam, wake up! Did you check the alarm clock?'
    },
    {
      id: '02_adam_nightstand',
      speaker: 'Adam',
      voiceId: VOICE_ADAM,
      text: "Oh no, I'm late! Where is my watch? Is it on the nightstand?"
    },
    {
      id: '03_tariq_lamp',
      speaker: 'Tariq',
      voiceId: VOICE_TARIQ,
      text: 'No, only the lamp is on the nightstand.'
    },
    {
      id: '04_adam_blanket',
      speaker: 'Adam',
      voiceId: VOICE_ADAM,
      text: 'Look under the blanket on the bed!'
    },
    {
      id: '05_tariq_wardrobe',
      speaker: 'Tariq',
      voiceId: VOICE_TARIQ,
      text: "Nothing here. Wait... look at the wardrobe door! It's hanging right there."
    },
    {
      id: '06_adam_resolution',
      speaker: 'Adam',
      voiceId: VOICE_ADAM,
      text: 'Aha! Thank goodness. Time to get ready!'
    }
  ];

  console.log(`Generating ${lines.length} ElevenLabs scenario dialogue clips...`);

  for (const item of lines) {
    console.log(`Synthesizing [${item.speaker}]: "${item.text}"`);
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${item.voiceId}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'xi-api-key': key
      },
      body: JSON.stringify({
        text: item.text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.72,
          similarity_boost: 0.75
        }
      })
    });

    if (!res.ok) {
      console.error(`Failed ${item.id}:`, await res.text());
      continue;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const filePath = path.join(outDir, `${item.id}.mp3`);
    fs.writeFileSync(filePath, buf);
    console.log(` Saved ${filePath} (${buf.length} bytes)`);
  }

  console.log('Finished generating dialogue audio clips successfully!');
}

main().catch(console.error);
