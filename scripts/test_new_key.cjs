const apiKey = process.env.GEMINI_API_KEY;

async function testNewKey() {
  console.log("Testing new API key with gemini-flash-latest...");
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: "Explain how AI works in a few words" }]
          }
        ]
      })
    });
    const text = await res.text();
    console.log("Status:", res.status, res.statusText);
    console.log("Response:", text.slice(0, 500));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testNewKey();
