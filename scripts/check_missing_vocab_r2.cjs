const crypto = require('crypto');
const https = require('https');

const terms = [
  'give sincere advice', 'in private', 'accept advice',
  'share with you', 'support you',
  'handle with care', 'reduce suffering', 'prepare before', 'treat kindly',
  'give charity', 'receive a reward',
  'see wrongdoing', 'change through lawful action', 'speak against', 'be able to', 'reject in the heart',
  'show enmity', 'draw near',
  'be forced to',
  'take advantage of',
  'truly believe', 'align with',
  'reach the clouds'
];

const profiles = [
  { name: 'turbo', fp: 'XfNU2rGpBa01ckF309OY|eleven_turbo_v2_5|0.7|0.75' },
  { name: 'v4', fp: 'XfNU2rGpBa01ckF309OY|eleven_v4|0.7|0.75' }
];

const baseUrl = 'https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev';

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve(500));
  });
}

async function run() {
  console.log(`Checking ${terms.length} terms in R2...`);
  for (const term of terms) {
    let found = false;
    for (const p of profiles) {
      const hash = crypto.createHash('sha256').update(p.fp + '\n' + term).digest('hex');
      const key = 'audio/' + hash.slice(0, 2) + '/' + hash + '.mp3';
      const status = await checkUrl(baseUrl + '/' + key);
      if (status === 200) {
        console.log(`FOUND in R2: "${term}" (${p.name}) -> ${key}`);
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`NOT FOUND in R2: "${term}"`);
    }
  }
}

run();
