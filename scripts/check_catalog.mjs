import fs from 'node:fs';

const catalog = JSON.parse(fs.readFileSync('src/app/learning/conversation/conversationCatalog.json', 'utf8'));
console.log('Catalog keys or count:', Array.isArray(catalog) ? catalog.length : Object.keys(catalog));
if (Array.isArray(catalog)) {
  console.log('Sample unit:', catalog[0]);
} else if (catalog.units) {
  console.log('Units count:', catalog.units.length);
  console.log('Sample unit:', catalog.units[0]);
}
