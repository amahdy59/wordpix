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

  console.log('Testing GEMINI_API_KEY prefix:', key ? key.slice(0, 10) + '...' : 'none');

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  const res = await fetch(url);
  console.log('Models endpoint status:', res.status);
  if (!res.ok) {
    console.error('Error:', await res.text());
    return;
  }
  const data = await res.json();
  const models = data.models || [];
  console.log('Total models available:', models.length);

  const videoOrImage = models.filter(m => 
    m.name.includes('veo') || 
    m.name.includes('video') || 
    m.name.includes('flow') || 
    m.name.includes('image') || 
    m.name.includes('imagen')
  );

  console.log('Video / Image / Flow models:');
  for (const m of videoOrImage) {
    console.log(`- ${m.name}: ${m.displayName || ''} (methods: ${m.supportedGenerationMethods?.join(', ')})`);
  }
}

main().catch(console.error);
