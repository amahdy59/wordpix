import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
require('./lib/env.cjs').loadEnv();
const token=process.env.FIGMA_TOKEN||process.env.Figma_token;
if(!token) throw new Error('Configured Figma token missing');
const root='output/illustrations/figma-reuse';
fs.mkdirSync(root,{recursive:true});
const fileKey='gRlyhrMavAHXUAT5brWFWu';
const focus=process.argv.includes('--focus');
async function request(route){
 const response=await fetch(`https://api.figma.com/v1${route}`,{headers:{'X-Figma-Token':token},signal:AbortSignal.timeout(300000)});
 if(!response.ok) throw new Error(`Figma read failed: ${response.status}`);
 return response.json();
}
const cache=path.join(root,'page-index.json');
const index=fs.existsSync(cache)?JSON.parse(fs.readFileSync(cache,'utf8')):await request(`/files/${fileKey}?depth=1`);
if(!fs.existsSync(cache)) fs.writeFileSync(cache,JSON.stringify(index));
const source={version:index.version,document:{children:[]}};
const selectedPages=focus?index.document.children.filter(p=>p.name==='Pilot Images'||p.name.startsWith('WordPix Batch')||p.name.startsWith('WordPix Reviewed')):index.document.children;
const batches=[];
for(let offset=0;offset<selectedPages.length;offset+=5)batches.push(selectedPages.slice(offset,offset+5));
let cursor=0;
await Promise.all(Array.from({length:3},async()=>{
 while(cursor<batches.length){
  const ordinal=cursor++;const batch=batches[ordinal];
  const chunk=path.join(root,`${focus?'focus':'pages'}-${String(ordinal).padStart(3,'0')}.json`);
  const data=fs.existsSync(chunk)?JSON.parse(fs.readFileSync(chunk,'utf8')):await request(`/files/${fileKey}/nodes?ids=${batch.map(p=>encodeURIComponent(p.id)).join(',')}`);
  if(!fs.existsSync(chunk))fs.writeFileSync(chunk,JSON.stringify(data));
  source.document.children.push(...batch.map(p=>data.nodes[p.id]?.document).filter(Boolean));
  console.log(`Inventoried page batch ${ordinal+1}/${batches.length}`);
 }
}));
const images=[]; const pages=[];
function nearbyText(node,depth=0){
 if(node.type==='TEXT')return [node.characters||''];
 if(depth>=2)return [];
 return (node.children||[]).flatMap(c=>nearbyText(c,depth+1));
}
function walk(node,ancestors,page){
 const fills=(node.fills||[]).filter(f=>f.type==='IMAGE'&&f.imageRef);
 if(fills.length)images.push({nodeId:node.id,name:node.name,pageId:page.id,pageName:page.name,path:ancestors.map(a=>a.name),imageRefs:fills.map(f=>f.imageRef),width:node.absoluteBoundingBox?.width,height:node.absoluteBoundingBox?.height,visible:node.visible!==false,texts:[...new Set(ancestors.slice(-3).reverse().flatMap(a=>nearbyText(a)))].filter(Boolean).slice(0,24)});
 for(const child of node.children||[])walk(child,[...ancestors,node],page);
}
for(const page of source.document.children){const before=images.length;walk(page,[],page);pages.push({id:page.id,name:page.name,placements:images.length-before});}
fs.writeFileSync(path.join(root,focus?'focus-inventory.json':'full-inventory.json'),JSON.stringify({fileKey,version:source.version,pages,images},null,2));
if(!fs.existsSync(path.join(root,'source-urls.json'))){
 const urls=await request(`/files/${fileKey}/images`);
 fs.writeFileSync(path.join(root,'source-urls.json'),JSON.stringify(urls.meta.images));
}
console.log(JSON.stringify({pages:pages.length,placements:images.length,uniqueSources:new Set(images.flatMap(i=>i.imageRefs)).size,pagesWithImages:pages.filter(p=>p.placements),output:root}));
