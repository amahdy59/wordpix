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

  const opName = "models/veo-3.1-generate-preview/operations/wklz2zkdrdq2";
  const url = `https://generativelanguage.googleapis.com/v1beta/${opName}?key=${key}`;

  console.log('Polling operation:', opName);
  const res = await fetch(url);
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Operation response:', JSON.stringify(data, null, 2).slice(0, 500));
}

main().catch(console.error);
