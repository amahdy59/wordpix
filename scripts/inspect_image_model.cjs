const apiKey = process.env.GEMINI_API_KEY;

async function inspectModel() {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image";
  const res = await fetch(url, {
    headers: { "x-goog-api-key": apiKey }
  });
  const data = await res.json();
  console.log("Model details:", JSON.stringify(data, null, 2));
}

inspectModel();
