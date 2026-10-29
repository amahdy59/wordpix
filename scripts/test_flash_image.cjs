const apiKey = process.env.GEMINI_API_KEY;

async function testGenerateImage() {
  console.log("Testing generateContent on gemini-3.1-flash-image...");
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent";
  
  const body = {
    contents: [
      {
        parts: [
          { text: "A pristine white ceramic bowl of steaming soup on a clean table" }
        ]
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  console.log("Status:", res.status, res.statusText);
  const data = await res.json();
  if (data.candidates && data.candidates[0]) {
    const parts = data.candidates[0].content.parts;
    console.log("Candidates parts count:", parts.length);
    parts.forEach((p, idx) => {
      if (p.text) console.log(`Part ${idx} text:`, p.text.slice(0, 100));
      if (p.inlineData) console.log(`Part ${idx} inlineData mime:`, p.inlineData.mimeType, "bytes length:", p.inlineData.data ? p.inlineData.data.length : 0);
    });
  } else {
    console.log("Response:", JSON.stringify(data).slice(0, 500));
  }
}

testGenerateImage();
