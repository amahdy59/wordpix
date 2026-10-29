const apiKey = process.env.GEMINI_API_KEY;

async function testListModels() {
  console.log("Testing list models...");
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models";
    const res = await fetch(url, {
      headers: {
        "x-goog-api-key": apiKey
      }
    });
    const data = await res.json();
    console.log("Status:", res.status);
    if (data.models) {
      console.log("Total models available:", data.models.length);
      const imagenModels = data.models.filter(m => m.name.includes("image"));
      console.log("Image models:", imagenModels.map(m => m.name));
    } else {
      console.log("Response:", JSON.stringify(data).slice(0, 300));
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testListModels();
