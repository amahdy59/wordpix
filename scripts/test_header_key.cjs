const apiKey = process.env.GEMINI_API_KEY;

async function testHeader() {
  console.log("Testing with x-goog-api-key header...");
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models";
    const res = await fetch(url, {
      headers: {
        "x-goog-api-key": apiKey
      }
    });
    const text = await res.text();
    console.log("Status:", res.status, res.statusText);
    console.log("Response:", text.slice(0, 400));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testHeader();
