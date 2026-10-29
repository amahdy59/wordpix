const fs = require('fs');
const path = require('path');

async function main() {
  const envText = fs.readFileSync('.env.local', 'utf8');
  const env = Object.fromEntries(
    envText
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  );
  const key = env.GEMINI_API_KEY;

  const downloadUrl = `https://generativelanguage.googleapis.com/v1beta/files/bf6919ovvg1n:download?alt=media&key=${key}`;
  console.log('Downloading video file from:', downloadUrl);

  const res = await fetch(downloadUrl, {
    headers: {
      'x-goog-api-key': key
    }
  });

  console.log('Download status:', res.status);
  if (!res.ok) {
    console.error('Download error:', await res.text());
    return;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const outDir = path.resolve('assets/samples/veo');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'shot_01_alarm_clock.mp4');
  fs.writeFileSync(outPath, buf);
  console.log(`SUCCESS! Saved real Google Veo video to: ${outPath} (${buf.length} bytes / ${(buf.length / 1024 / 1024).toFixed(2)} MB)`);

  // Also copy to artifact directory
  const artifactPath = 'C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/shot_01_alarm_clock.mp4';
  fs.copyFileSync(outPath, artifactPath);
  console.log(`Copied to artifact dir: ${artifactPath}`);
}

main().catch(console.error);
