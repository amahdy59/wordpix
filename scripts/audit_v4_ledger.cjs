const fs = require('fs');

if (fs.existsSync('assets/audio-ledger-v4-repaired.json')) {
  const v4 = JSON.parse(fs.readFileSync('assets/audio-ledger-v4-repaired.json', 'utf8'));
  console.log('Profile in v4-repaired:', v4.profile);
  console.log('Total clips in v4-repaired:', Object.keys(v4.clips).length);
  const sample = Object.entries(v4.clips).slice(0, 3);
  console.log('Sample clips in v4-repaired:', JSON.stringify(sample, null, 2));
}

if (fs.existsSync('assets/audio-ledger.json')) {
  const legacy = JSON.parse(fs.readFileSync('assets/audio-ledger.json', 'utf8'));
  console.log('Profile in legacy audio-ledger:', legacy.profile);
  console.log('Total clips in legacy audio-ledger:', Object.keys(legacy.clips).length);
}
