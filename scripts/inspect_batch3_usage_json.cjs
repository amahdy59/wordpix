const fs = require('fs');

const f1 = 'src/app/data/usage/classroom.usage.json';
const f2 = 'src/app/data/usage/office-supplies.usage.json';

if (fs.existsSync(f1)) {
  const d1 = JSON.parse(fs.readFileSync(f1, 'utf8'));
  console.log('classroom.usage.json lessons:', Array.isArray(d1) ? d1.length : 'not array');
  const scenes1 = Array.isArray(d1) ? d1.flatMap(l => l.usage?.scenes || []) : (d1.scenes || []);
  console.log('classroom total scenes:', scenes1.length);
}

if (fs.existsSync(f2)) {
  const d2 = JSON.parse(fs.readFileSync(f2, 'utf8'));
  console.log('office-supplies.usage.json lessons:', Array.isArray(d2) ? d2.length : 'not array');
  const scenes2 = Array.isArray(d2) ? d2.flatMap(l => l.usage?.scenes || []) : (d2.scenes || []);
  console.log('office-supplies total scenes:', scenes2.length);
}
