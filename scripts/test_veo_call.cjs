const fs = require('fs');

async function main() {
  const envText = fs.readFileSync('.env.local', 'utf8');
  const env = Object.fromEntries(
    envText
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  );
  const key = env.GEMINI_API_KEY;

  console.log('Testing Veo predictLongRunning with key...');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning`;
  const body = {
    instances: [
      {
        prompt: "A modern wooden alarm clock on a bedside nightstand glowing 07:45 AM, warm morning sunlight, cinematic 35mm film."
      }
    ],
    parameters: {
      aspectRatio: "16:9",
      durationSeconds: 5
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  console.log('Response status:', res.status);
  const text = await res.text();
  console.log('Response body:', text);
}

main().catch(console.error);
