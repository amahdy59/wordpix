const fs = require('fs');
const path = require('path');

const mp4Path = path.resolve('assets/samples/veo/shot_01_alarm_clock.mp4');
const buf = fs.readFileSync(mp4Path);
console.log('MP4 bytes:', buf.length);
fs.writeFileSync(
  'C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/scratch/veo_shot01_base64.txt',
  buf.toString('base64')
);
console.log('Saved Veo base64 text');
