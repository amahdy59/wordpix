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

  const opName = "models/veo-3.1-generate-preview/operations/wklz2zkdrdq2";
  const url = `https://generativelanguage.googleapis.com/v1beta/${opName}?key=${key}`;

  console.log('Waiting for Veo operation to complete...');

  for (let attempt = 1; attempt <= 20; attempt++) {
    console.log(`Poll attempt ${attempt}/20...`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Error polling:', await res.text());
      return;
    }
    const data = await res.json();
    if (data.done) {
      console.log('Operation completed!');
      console.log('Full completed response keys:', Object.keys(data));
      if (data.error) {
        console.error('Operation error:', data.error);
        return;
      }
      
      const outDir = path.resolve('assets/samples/veo');
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'operation_response.json'), JSON.stringify(data, null, 2));

      // Check for video URI or base64 data
      const videoResult = data.response;
      console.log('Response content:', JSON.stringify(videoResult, null, 2).slice(0, 500));

      // Extract video data or download if URI
      const sample = videoResult?.generatedSamples?.[0] || videoResult?.generatedVideos?.[0] || videoResult?.videos?.[0];
      if (sample?.video?.uri) {
        console.log('Downloading video from URI:', sample.video.uri);
        const vidRes = await fetch(sample.video.uri, {
          headers: { 'x-goog-api-key': key }
        });
        const vidBuf = Buffer.from(await vidRes.arrayBuffer());
        const vidFile = path.join(outDir, 'shot_01_alarm_clock.mp4');
        fs.writeFileSync(vidFile, vidBuf);
        console.log(`Successfully saved Veo video to ${vidFile} (${vidBuf.length} bytes)!`);
      } else if (sample?.video?.bytesBase64Encoded) {
        const vidBuf = Buffer.from(sample.video.bytesBase64Encoded, 'base64');
        const vidFile = path.join(outDir, 'shot_01_alarm_clock.mp4');
        fs.writeFileSync(vidFile, vidBuf);
        console.log(`Successfully saved Veo video to ${vidFile} (${vidBuf.length} bytes)!`);
      }
      return;
    }

    // Wait 10 seconds before next poll
    await new Promise(r => setTimeout(r, 10000));
  }
}

main().catch(console.error);
