const apiKey = process.env.GEMINI_API_KEY;

async function testGenerate() {
  console.log("Testing generateContent with x-goog-api-key...");
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });
    const text = await res.text();
    console.log("Status:", res.status, res.statusText);
    console.log("Response:", text.slice(0, 400));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testGenerate();
