const https = require('https');
const { loadEnv } = require('./lib/env.cjs');
loadEnv();
const req = https.request('https://api.elevenlabs.io/v1/user/subscription', {
  headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Accept': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const s = JSON.parse(data);
    console.log('Tier:', s.tier, 'Chars used:', s.character_count, '/', s.character_limit, 'Remaining:', s.character_limit - s.character_count);
  });
});
req.end();
