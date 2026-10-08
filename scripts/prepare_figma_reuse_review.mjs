import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const root='output/illustrations/figma-reuse';
const inventory=JSON.parse(fs.readFileSync(`${root}/focus-inventory.json`,'utf8'));
const urls=JSON.parse(fs.readFileSync(`${root}/source-urls.json`,'utf8'));
const mediaSource=fs.readFileSync('src/app/exercises/content/pilotSentenceMedia.ts','utf8');
const media=[...mediaSource.matchAll(/(?:"([^"]+)"|([a-z-]+)):\s*media\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g)].map(m=>({wordId:m[1]||m[2],localPath:`./learning-scenes/${m[3]}/${m[4]}.avif`,name:`${m[4]}.avif`,alt:m[5]}));
const candidates=JSON.parse(fs.readFileSync(`${root}/scene-candidates.json`,'utf8')).map(i=>({...i,kind:'scene'}));
for(const record of media){
 const image=inventory.images.find(i=>i.name===record.name&&i.path.includes('Revised'));
 if(image)candidates.push({...image,...record,kind:'sentence'});
}
const geometry=inventory.images.filter(i=>/^shapes-geometry-\d+-scene-\d+\.avif$/.test(i.name)&&i.path.some(p=>/Revised/.test(p)));
for(const i of geometry)candidates.push({...i,kind:'geometry-scene'});
fs.mkdirSync(`${root}/originals`,{recursive:true});
fs.mkdirSync(`${root}/review`,{recursive:true});
let cursor=0;
await Promise.all(Array.from({length:5},async()=>{
 while(cursor<candidates.length){const item=candidates[cursor++];const ref=item.imageRefs[0];const file=`${root}/originals/${ref}.source`;
  if(!fs.existsSync(file)){const response=await fetch(urls[ref],{signal:AbortSignal.timeout(120000)});if(!response.ok)throw new Error(`Source download ${response.status}`);const bytes=Buffer.from(await response.arrayBuffer());if(!bytes.length)throw new Error('Empty source');fs.writeFileSync(file,bytes);}
  const meta=await sharp(file).metadata();Object.assign(item,{sourceFile:file,sourceWidth:meta.width,sourceHeight:meta.height,sourceFormat:meta.format});
 }
}));
fs.writeFileSync(`${root}/visual-review-candidates.json`,JSON.stringify(candidates,null,2));
const tiles=[];
for(let index=0;index<candidates.length;index++){
 const item=candidates[index];const pic=await sharp(item.sourceFile).resize(380,250,{fit:'contain',background:'#ffffff'}).png().toBuffer();
 const label=`${index} ${item.wordId||item.name.replace('.avif','')}`.replace(/[<>&]/g,'');
 const svg=Buffer.from(`<svg width="380" height="32"><rect width="380" height="32" fill="white"/><text x="6" y="21" font-family="Arial" font-size="14" fill="black">${label}</text></svg>`);
 tiles.push(await sharp({create:{width:380,height:282,channels:4,background:'white'}}).composite([{input:pic,top:0,left:0},{input:svg,top:250,left:0}]).png().toBuffer());
}
for(let start=0;start<tiles.length;start+=12){const part=tiles.slice(start,start+12);await sharp({create:{width:1520,height:Math.ceil(part.length/4)*282,channels:4,background:'white'}}).composite(part.map((input,i)=>({input,left:(i%4)*380,top:Math.floor(i/4)*282}))).png().toFile(`${root}/review/sheet-${Math.floor(start/12)}.png`);}
console.log(JSON.stringify({candidates:candidates.length,sentences:candidates.filter(c=>c.kind==='sentence').length,geometry:geometry.length,sheets:Math.ceil(candidates.length/12)}));
