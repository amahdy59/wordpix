if (!process.env.GEMINI_API_KEY || /[\r\n]/.test(process.env.GEMINI_API_KEY))
  throw new Error("Set a valid GEMINI_API_KEY environment variable first.");
const fs = require("fs");
let env = fs.readFileSync(".env.local", "utf8");
if (!env.includes("GEMINI_API_KEY")) {
  env += "\nGEMINI_API_KEY=" + process.env.GEMINI_API_KEY + "\n";
  fs.writeFileSync(".env.local", env, "utf8");
  console.log("Successfully saved GEMINI_API_KEY to .env.local");
} else {
  console.log("GEMINI_API_KEY is already present in .env.local");
}
