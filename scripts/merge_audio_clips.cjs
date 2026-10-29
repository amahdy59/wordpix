const fs = require('fs');
const path = require('path');

const audioDir = path.resolve('assets/samples/audio');
const files = [
  '01_tariq_alarm.mp3',
  '02_adam_nightstand.mp3',
  '03_tariq_lamp.mp3',
  '04_adam_blanket.mp3',
  '05_tariq_wardrobe.mp3',
  '06_adam_resolution.mp3'
];

// Concatenate MP3 buffers into a single full dialogue file
const buffers = files.map(f => fs.readFileSync(path.join(audioDir, f)));
const fullBuffer = Buffer.concat(buffers);

const fullPath = path.join(audioDir, 'full_scenario_dialogue.mp3');
fs.writeFileSync(fullPath, fullBuffer);
console.log(`Saved full dialogue audio to: ${fullPath} (${fullBuffer.length} bytes)`);

// Also copy all audio files to the artifact directory for easy clickable links
const artifactDir = 'C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47';
fs.copyFileSync(fullPath, path.join(artifactDir, 'full_scenario_dialogue.mp3'));

for (const f of files) {
  fs.copyFileSync(path.join(audioDir, f), path.join(artifactDir, f));
}

console.log('Copied all audio files to artifact directory successfully!');
