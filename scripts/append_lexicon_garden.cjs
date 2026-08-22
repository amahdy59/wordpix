// scripts/append_lexicon_garden.cjs
const fs = require('fs');
const path = require('path');

const gardenLexicon = require('./lexicon_garden.cjs');
const lexiconPath = path.resolve('src/app/data/lexiconDictionary.ts');

let content = fs.readFileSync(lexiconPath, 'utf8');

// Format each entry into TypeScript syntax
const entries = Object.entries(gardenLexicon).map(([key, value]) => {
  const json = JSON.stringify({ id: key, ...value }, null, 2);
  // Indent by 2 spaces
  const indented = json.split('\n').map((line, i) => i === 0 ? `  "${key}": ${line}` : `  ${line}`).join('\n');
  return indented;
}).join(',\n');

// Insert before the closing `};` of LEXICON_DICTIONARY
if (!content.includes('"tulip":')) {
  content = content.replace(/\n\};\s*\n\/\*\*\s*\n\s*\* Retrieve verified dictionary entry/m, `,\n${entries}\n};\n\n/**\n * Retrieve verified dictionary entry`);
  fs.writeFileSync(lexiconPath, content, 'utf8');
  console.log('Successfully added Garden lexicon entries to lexiconDictionary.ts!');
} else {
  console.log('Garden lexicon entries already present in lexiconDictionary.ts');
}
