const path = require("node:path");

const overrides = require(path.join(
  __dirname,
  "..",
  "..",
  "src",
  "app",
  "shared",
  "pronunciationOverrides.json"
));

const overridesByText = new Map(
  overrides.flatMap((override) => override.matches.map((match) => [match, override]))
);

/** Keep this exact and case-sensitive for the same reason as the browser helper. */
function getPronunciationAssetText(text) {
  return overridesByText.get(text)?.synthesisText ?? text;
}

function getPronunciationAssetSpec(text, baseProfile) {
  const override = overridesByText.get(text);
  return {
    text: override?.synthesisText ?? text,
    profile: { ...baseProfile, ...(override?.profile ?? {}) },
  };
}

module.exports = { overrides, getPronunciationAssetText, getPronunciationAssetSpec };
