const apiKey = process.env.GEMINI_API_KEY;

async function testKey() {
  if (!apiKey) throw new Error("Set GEMINI_API_KEY before testing API access.");
  console.log("Testing API key against Generative Language API...");
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models";
    const res = await fetch(url, {
      headers: { "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(15000),
    });
    console.log("Status:", res.status, res.statusText);
    if (!res.ok) process.exitCode = 1;
  } catch (err) {
    console.error("API access check failed:", err.name);
    process.exitCode = 1;
  }
}

if (require.main === module)
  testKey().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
module.exports = { testKey };
