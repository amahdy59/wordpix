const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Load API key from .env.local
let apiKey = process.env.GEMINI_API_KEY;
if (fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  const match = content.match(/GEMINI_API_KEY=([^\r\n]+)/);
  if (match) apiKey = match[1].trim();
}
if (!apiKey) {
  throw new Error("Set GEMINI_API_KEY in .env.local before generating images.");
}

async function generateSceneImage(sceneId, prompt) {
  console.log(`\n========================================`);
  console.log(`Starting generation for: ${sceneId}`);
  console.log(`Prompt: ${prompt.slice(0, 120)}...`);

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent";
  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
  if (!part) {
    throw new Error(`No image inlineData found in response: ${JSON.stringify(data).slice(0, 300)}`);
  }

  const buffer = Buffer.from(part.inlineData.data, 'base64');
  const outDir = path.resolve('output/illustrations/generated');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const jpgPath = path.join(outDir, `${sceneId}.jpg`);
  const webpPath = path.join(outDir, `${sceneId}.webp`);

  fs.writeFileSync(jpgPath, buffer);

  // High-performance 1024x1024 WebP q85 effort 5
  await sharp(buffer)
    .resize(1024, 1024, { fit: 'cover' })
    .webp({ quality: 85, effort: 5 })
    .toFile(webpPath);

  const stats = fs.statSync(webpPath);
  console.log(`Successfully generated and saved ${sceneId} (${stats.size} bytes)`);
  return { sceneId, webpSize: stats.size, jpgPath, webpPath };
}

// If run directly with arguments
if (require.main === module) {
  const sceneId = process.argv[2] || "kitchen-3-usage-scene-2";
  const pipeline = JSON.parse(fs.readFileSync("output/illustrations/generation_batches_pipeline.json", 'utf8'));
  const item = pipeline.batches[0].items.find(i => i.sceneId === sceneId);
  const prompt = process.argv[3] || item?.optimizedPrompt || "A clean white ceramic bowl of soup on a sunlit table";

  generateSceneImage(sceneId, prompt)
    .then(res => {
      console.log('Result:', res);
      const { execSync } = require('child_process');
      execSync('node scripts/sync_pipeline.cjs', { stdio: 'inherit' });
      execSync('node scripts/build_generated_manifest.cjs', { stdio: 'inherit' });
    })
    .catch(err => console.error('Generation failed:', err.message));
}

module.exports = { generateSceneImage };
