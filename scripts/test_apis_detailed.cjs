const apiKey = process.env.GEMINI_API_KEY;

async function testV1() {
  console.log("Testing v1 models endpoint...");
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const res = await fetch(url);
    const text = await res.text();
    console.log("v1 status:", res.status);
    console.log("v1 response:", text.slice(0, 300));
  } catch (err) {
    console.error("v1 error:", err);
  }
}

async function testV1Beta() {
  console.log("Testing v1beta models endpoint with key param...");
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    const text = await res.text();
    console.log("v1beta status:", res.status);
    console.log("v1beta response:", text.slice(0, 300));
  } catch (err) {
    console.error("v1beta error:", err);
  }
}

async function run() {
  await testV1();
  await testV1Beta();
}

run();
