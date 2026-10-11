const https = require('https');
const { loadEnv } = require('./lib/env.cjs');
loadEnv();

const apiKey = process.env.ELEVENLABS_API_KEY || process.env.Elevenlabs_API_key;
console.log('Testing with key:', apiKey ? apiKey.slice(0, 8) + '...' : 'NONE');

// Test eleven_v4 model with Nichalia voice
const voiceId = "XfNU2rGpBa01ckF309OY"; // Nichalia
const payload = JSON.stringify({
  text: "Hello",
  model_id: "eleven_v4",
  voice_settings: {
    stability: 0.7,
    similarity_boost: 0.75
  }
});

const req = https.request(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
  method: 'POST',
  headers: {
    'xi-api-key': apiKey,
    'Content-Type': 'application/json',
    'Accept': 'audio/mpeg'
  }
}, (res) => {
  let chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log('Status code:', res.statusCode);
    console.log('Response content-type:', res.headers['content-type']);
    console.log('Audio bytes received:', buffer.length);
    if (res.statusCode !== 200) {
      console.log('Error body:', buffer.toString('utf8'));
    } else {
      console.log('SUCCESS: eleven_v4 model generated audio cleanly!');
    }
  });
});

req.on('error', err => console.error('Req error:', err.message));
req.write(payload);
req.end();
