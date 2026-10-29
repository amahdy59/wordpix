const fs = require('fs');
const path = require('path');

async function generateVeoShot(shotName, prompt, duration = 4) {
  const envText = fs.readFileSync('.env.local', 'utf8');
  const env = Object.fromEntries(
    envText
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  );
  const key = env.GEMINI_API_KEY;

  console.log(`\n========================================`);
  console.log(`Submitting Veo prompt for: ${shotName}`);
  console.log(`Prompt: "${prompt}"`);

  const submitUrl = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning`;
  const body = {
    instances: [{ prompt }],
    parameters: {
      aspectRatio: "16:9",
      durationSeconds: duration
    }
  };

  const submitRes = await fetch(submitUrl, {
    method: "POST",
    headers: {
      "x-goog-api-key": key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!submitRes.ok) {
    console.error(`Submit error (${submitRes.status}):`, await submitRes.text());
    return null;
  }

  const submitData = await submitRes.json();
  const opName = submitData.name;
  console.log(`Operation launched: ${opName}`);

  const pollUrl = `https://generativelanguage.googleapis.com/v1beta/${opName}?key=${key}`;
  for (let i = 1; i <= 25; i++) {
    await new Promise(r => setTimeout(r, 8000));
    const pollRes = await fetch(pollUrl);
    if (!pollRes.ok) {
      console.error(`Poll error:`, await pollRes.text());
      continue;
    }
    const pollData = await pollRes.json();
    if (pollData.done) {
      if (pollData.error) {
        console.error(`Operation failed:`, pollData.error);
        return null;
      }
      const uri = pollData.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
      if (!uri) {
        console.error(`No video URI found in response:`, JSON.stringify(pollData.response).slice(0, 300));
        return null;
      }
      console.log(`Video ready! Downloading from: ${uri}`);
      const vidRes = await fetch(uri, { headers: { 'x-goog-api-key': key } });
      const buf = Buffer.from(await vidRes.arrayBuffer());

      const outDir = path.resolve('assets/samples/veo');
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, `${shotName}.mp4`);
      fs.writeFileSync(outPath, buf);
      console.log(`Saved: ${outPath} (${buf.length} bytes)`);
      return outPath;
    }
    process.stdout.write(`.`);
  }

  console.error(`Timed out waiting for ${shotName}`);
  return null;
}

async function main() {
  // Let's generate Shot 2: Tariq switching on the lamp at the nightstand
  const shot2Prompt = "Cinematic medium shot. A dignified young Arab man with neat short dark hair and a trimmed beard wearing a clean modest linen shirt walks over to a wooden bedside nightstand in a sunlit bedroom. He switches on the modern brass reading lamp, warm light glows across the tabletop. 35mm film, warm natural sunlight, shallow depth of field.";
  await generateVeoShot("shot_02_nightstand_lamp", shot2Prompt, 4);

  // Let's generate Shot 4: Wardrobe discovery
  const shot4Prompt = "Cinematic medium shot. A tall wooden wardrobe in a bright modern bedroom. A young man's hand reaches toward the brass door handle where a leather wristwatch is hanging. Warm natural morning sunlight, shallow depth of field, 35mm film.";
  await generateVeoShot("shot_04_wardrobe_watch", shot4Prompt, 4);
}

main().catch(console.error);
