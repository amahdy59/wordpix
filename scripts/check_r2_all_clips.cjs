const https = require('https');
const manifest = require('../src/app/learning/hadith/hadithAudioManifest.json');
const baseUrl = 'https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev';

async function checkR2Clip(key) {
  return new Promise((resolve) => {
    https.get(`${baseUrl}/${key}`, (res) => {
      if (res.statusCode !== 200) {
        resolve({ ok: false, error: `HTTP ${res.statusCode}` });
        return;
      }
      let firstChunk = null;
      res.on('data', (chunk) => {
        if (!firstChunk) {
          firstChunk = chunk;
          res.destroy(); // Got initial bytes
          const isId3 = chunk[0] === 0x49 && chunk[1] === 0x44 && chunk[2] === 0x33;
          const isFrameSync = chunk[0] === 0xFF && (chunk[1] & 0xE0) === 0xE0;
          resolve({
            ok: isId3 || isFrameSync,
            contentType: res.headers['content-type'],
            contentLength: res.headers['content-length'],
            isMp3: isId3 || isFrameSync,
          });
        }
      });
      res.on('error', (err) => resolve({ ok: false, error: err.message }));
    }).on('error', (err) => resolve({ ok: false, error: err.message }));
  });
}

async function run() {
  console.log('Checking all 84 R2 clips headers and mime types...');
  let issues = 0;
  for (const lesson of manifest.lessons) {
    for (const track of ['arabic', 'translation']) {
      const res = await checkR2Clip(lesson[track].objectKey);
      if (!res.ok || res.contentType !== 'audio/mpeg') {
        console.log(`ISSUE: ${lesson.id} ${track} ->`, res);
        issues++;
      }
    }
  }
  console.log(`Finished checking 84 clips on R2. Total issues: ${issues}`);
}

run();
