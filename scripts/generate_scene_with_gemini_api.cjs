const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const API_KEY = process.env.GEMINI_API_KEY;

async function generateWithImagen(prompt, sceneId) {
  if (!API_KEY) throw new Error("Set GEMINI_API_KEY before generating images.");
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(sceneId))
    throw new Error("Use a scene ID containing only letters, numbers, hyphens and underscores.");
  if (typeof prompt !== "string" || !prompt.trim())
    throw new Error("Provide a non-empty image prompt.");
  console.log(`Generating image for scene: ${sceneId}...`);
  console.log(`Prompt: ${prompt.slice(0, 100)}...`);

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict";

  const body = {
    instances: [{ prompt: prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "1:1",
      outputMimeType: "image/jpeg",
      personGeneration: "ALLOW_ADULT",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    signal: AbortSignal.timeout(120000),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Image API request failed (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (!data.predictions || !data.predictions[0] || !data.predictions[0].bytesBase64Encoded) {
    throw new Error("Image API returned no image bytes.");
  }

  const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, "base64");
  if (buffer.length === 0) throw new Error("Image API returned an empty image.");

  // Output directory
  const outDir = path.resolve(__dirname, "../output/illustrations/generated");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const jpgPath = path.join(outDir, `${sceneId}.jpg`);
  const webpPath = path.join(outDir, `${sceneId}.webp`);

  fs.writeFileSync(jpgPath, buffer);

  // Encode to 1024x1024 WebP q85 effort 5
  await sharp(buffer)
    .resize(1024, 1024, { fit: "cover" })
    .webp({ quality: 85, effort: 5 })
    .toFile(webpPath);

  const stats = fs.statSync(webpPath);
  console.log(`Successfully generated and saved ${sceneId} (${stats.size} bytes)`);
  return { jpgPath, webpPath, size: stats.size };
}

module.exports = { generateWithImagen };

if (require.main === module) {
  const prompt = process.argv[2] || "A clean white ceramic bowl of soup on a sunlit table";
  const sceneId = process.argv[3] || "test-scene";
  generateWithImagen(prompt, sceneId)
    .then((res) => console.log("Done:", res))
    .catch((err) => {
      console.error("Error:", err.message);
      process.exitCode = 1;
    });
}
