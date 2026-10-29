const apiKey = process.env.GOOGLE_ACCESS_TOKEN;
if (!apiKey) throw new Error('Set GOOGLE_ACCESS_TOKEN before testing bearer access.');

async function testBearer() {
  console.log("Testing as Bearer Token...");
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const text = await res.text();
    console.log("Status:", res.status, res.statusText);
    console.log("Response:", text.slice(0, 500));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testBearer();
