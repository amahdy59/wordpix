/**
 * reimport_definitions.cjs
 *
 * Re-imports the `definition` field from the CSV for any bilingual JSON entry
 * that currently has no definition (or had its definition removed by cleanup).
 *
 * Skips definitions that match known bad patterns:
 *   - "A term used in the X context."  (generic placeholder)
 *   - Fewer than 20 characters
 *   - Starts with "To " (verb-only WordNet definition, wrong sense for a noun)
 */
const f = require('fs'), p = require('path');

const CSV_PATH = 'C:\\Users\\AhmedMahdy\\Downloads\\WordPix_FULL_BILINGUAL_CATALOGUE_10333_ALL_APPROVED.csv';
const BI_DIR   = p.join(__dirname, '..', 'src', 'app', 'data', 'bilingual');

const BAD_DEF  = /^A term used in the .+ context\.$/i;
const MIN_LEN  = 20;

function parseRow(line) {
  const c=[]; let cur='',inQ=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){if(inQ&&line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ;}
    else if(ch===','&&!inQ){c.push(cur);cur='';}
    else cur+=ch;
  }
  c.push(cur);return c;
}

const raw   = f.readFileSync(CSV_PATH,'utf8');
const lines = raw.split('\r\n').filter(l=>l.trim());
const hdr   = lines[0].split(',').map(h=>h.replace(/^\uFEFF/,'').trim());
const idx   = {unit:hdr.indexOf('unit'),id:hdr.indexOf('word_id'),def:hdr.indexOf('approved_english_definition')};

const lookup={};
lines.slice(1).forEach(line=>{
  const r=parseRow(line);
  const unit=r[idx.unit].replace(/^\uFEFF/,'').trim();
  const id=r[idx.id].trim();
  const def=r[idx.def].trim();
  lookup[unit+':'+id]=def;
});

const files=f.readdirSync(BI_DIR).filter(fn=>fn.endsWith('.json'));
let filled=0,skipped=0;

files.forEach(file=>{
  const unit=file.replace('.json','');
  const fPath=p.join(BI_DIR,file);
  const data=JSON.parse(f.readFileSync(fPath,'utf8'));
  let dirty=false;

  Object.entries(data).forEach(([wordId,entry])=>{
    if(typeof entry!=='object'||Array.isArray(entry))return;
    // Only fill if currently missing
    if(entry.definition&&entry.definition.trim())return;
    const def=lookup[unit+':'+wordId];
    if(!def)return;
    // Skip bad patterns
    if(BAD_DEF.test(def)||def.length<MIN_LEN||def.startsWith('To ')){
      skipped++;
      return;
    }
    entry.definition=def;
    filled++;
    dirty=true;
  });

  if(dirty)f.writeFileSync(fPath,JSON.stringify(data,null,2)+'\n','utf8');
});

console.log('Definitions filled:',filled,'Skipped (bad pattern):',skipped);

// Verify the specific words
['days-months:january','days-months:biannual','aquarium:shrimp','aquarium:eel'].forEach(key=>{
  const [unit,id]=key.split(':');
  const obj=JSON.parse(f.readFileSync(p.join(BI_DIR,unit+'.json'),'utf8'));
  console.log(key,'→ definition:',obj[id]?.definition||'(none)');
});
