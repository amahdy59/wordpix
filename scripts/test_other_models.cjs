const apiKey = process.env.GEMINI_API_KEY;

async function testOtherModels() {
  const models = [
    "gemini-2.5-flash-image",
    "gemini-3.1-flash-lite-image",
    "imagen-3.0-generate-001"
  ];

  for (const model of models) {
    console.log(`\nTesting ${model}...`);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "A clean bowl of soup" }] }]
        })
      });
      console.log(`${model} status:`, res.status);
      const text = await res.text();
      console.log(`${model} response:`, text.slice(0, 200));
    } catch (e) {
      console.error(`${model} error:`, e.message);
    }
  }
}

testOtherModels();
