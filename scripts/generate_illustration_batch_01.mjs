import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const started = performance.now();
const out = 'output/illustrations/batch-01';
fs.mkdirSync(out, { recursive: true });
const theme = JSON.parse(fs.readFileSync('docs/illustration-trial-1000.json', 'utf8')).palette;
const ink = theme['--wp-text'], violet = theme['--wp-brand'], teal = theme['--wp-teal'];
const pale = theme['--wp-brand-light'], mint = theme['--wp-teal-light'];
const color = { Red:'#D52A32', Blue:'#2463CB', Yellow:'#F5D331', Green:'#30864D', Orange:'#F18A28', Purple:'#8134AF', Pink:'#F29DBD', Brown:'#865134', Black:'#171717', White:'#FFFFFF', Cyan:'#00C6D6', Magenta:'#DD2089', Lime:'#A5D634', Teal:'#087F83', Indigo:'#463B91', Violet:'#804AC9', Coral:'#F27968', Salmon:'#EE9B91', Turquoise:'#36C6BE', Lavender:'#C5B3E6', Light:'#DCE7FA', Dark:'#182F69', Bright:'#E3346F', Dull:'#987E89', Vivid:'#F01162', Pale:'#F6CCDF', Deep:'#72284A', Warm:'#E9A051', Cool:'#488FC0', Neutral:'#9A9287' };
let shapes = [];
const r=(x,y,w,h,fill,stroke=ink,radius=10,name='rectangle')=>shapes.push({type:'rect',x,y,w,h,fill,stroke,radius,name});
const e=(x,y,w,h,fill,stroke=ink,name='ellipse')=>shapes.push({type:'ellipse',x,y,w,h,fill,stroke,name});
const p=(d,fill='none',stroke=ink,name='path',width=7)=>shapes.push({type:'path',d,fill,stroke,name,width});
const t=(x,y,w,h,text,size=60,fill=ink,name='essential-numeral')=>shapes.push({type:'text',x,y,w,h,text,size,fill,name});
const line=(x,y,x2,y2,c=ink,width=7,name='line')=>p(`M${x} ${y}L${x2} ${y2}`,'none',c,name,width);
function base(){r(0,0,1200,675,theme['--wp-surface'],'none',0,'background');r(48,60,1104,550,'#FFFFFF','none',24,'scene-surface');r(48,570,1104,40,pale,'none',0,'table-edge');}
function panel(x,y=240,w=300,h=310){r(x,y,w,h,'#FFFFFF',ink,16,'comparison-panel');}
function selectedPanel(){const s=shapes.at(-1);s.stroke=violet;s.fill=pale;r(s.x+14,s.y+14,s.w-28,s.h-28,'none',violet,10,'selected-double-border');}
function box(x,y,s=64){r(x,y,s,s,'#DDB486',ink,5,'box');r(x+s*.43,y+3,s*.14,s-6,'#F7DFC0','none',1,'packing-tape');line(x+3,y+17,x+s-3,y+17,ink,4);}
function folder(x,y,w=70,h=110,fill=violet){p(`M${x} ${y+12}V${y}h${w*.35}l12 12h${w*.65-12}v${h}h-${w}Z`,fill,ink,'folder');r(x+10,y+32,w-20,8,'#FFFFFF','none',3,'folder-detail');}
function cup(x,y,s=62){e(x+s-11,y+9,25,30,'none',ink,'cup-handle');p(`M${x} ${y}h${s}l-6 ${s*.65}q-${s*.4} 16-${s-12} 0Z`,'#FFFFFF',ink,'cup-body');e(x,y-7,s,18,'#FFFFFF',ink,'cup-rim');e(x+8,y-2,s-16,8,'#785139','none','coffee');}
function person(x,y,blue=false){e(x+17,y,46,46,'#C48B65',ink,'adult-head');r(x,y+56,80,125,mint,ink,22,'adult-torso');r(x+10,y+185,23,80,ink,'none',6,'leg');r(x+47,y+185,23,80,ink,'none',6,'leg');if(blue)folder(x+44,y+100,57,76,color.Blue);}
function polygon(x,y,sides,size=90){const pts=Array.from({length:sides},(_,i)=>[x+Math.cos(-Math.PI/2+i*Math.PI*2/sides)*size,y+Math.sin(-Math.PI/2+i*Math.PI*2/sides)*size]);p('M'+pts.map(pt=>pt.join(' ')).join('L')+'Z',mint,ink,'polygon-'+sides);}
function cube(x,y,w=150,h=135){p(`M${x} ${y+30}l50-30h${w}l-50 30Z`,pale,ink,'solid-top');p(`M${x} ${y+30}h${w}v${h}h-${w}Z`,mint,ink,'solid-front');p(`M${x+w} ${y+30}l50-30v${h}l-50 30Z`,'#94C9C0',ink,'solid-side');}
function shape(word,x){const cx=x+150,cy=380;const z=teal;
 switch(word){
 case 'Circle':e(cx-85,cy-85,170,170,mint);break;
 case 'Square':r(cx-85,cy-85,170,170,mint,ink,0);break;
 case 'Triangle':polygon(cx,cy,3);break;
 case 'Rectangle':r(cx-110,cy-65,220,130,mint,ink,0);break;
 case 'Oval':e(cx-110,cy-65,220,130,mint);break;
 case 'Diamond':p(`M${cx} ${cy-100}l90 100-90 100-90-100Z`,mint);break;
 case 'Pentagon':polygon(cx,cy,5);break;
 case 'Hexagon':polygon(cx,cy,6);break;
 case 'Octagon':polygon(cx,cy,8);break;
 case 'Star':{const pts=Array.from({length:10},(_,i)=>{const s=i%2?43:95;return [cx+Math.cos(-Math.PI/2+i*Math.PI/5)*s,cy+Math.sin(-Math.PI/2+i*Math.PI/5)*s]});p('M'+pts.map(pt=>pt.join(' ')).join('L')+'Z',mint);break;}
 case 'Sphere':e(cx-85,cy-85,170,170,mint);p(`M${cx-65} ${cy-38}Q${cx} ${cy-88} ${cx+60} ${cy-34}`,'none',z,'sphere-curvature');p(`M${cx-75} ${cy+22}Q${cx} ${cy+73} ${cx+75} ${cy+22}`,'none',z);break;
 case 'Cube':cube(cx-94,cy-87,135,140);break;
 case 'Cuboid':cube(cx-115,cy-62,180,100);break;
 case 'Prism':p(`M${cx-110} ${cy+62}l70-120 70 120Z`,mint);p(`M${cx-40} ${cy-58}l90-45 70 120-90 45Z`,pale);line(cx+30,cy+62,cx+120,cy+17);break;
 case 'Cylinder':r(cx-75,cy-85,150,165,mint,ink,0);e(cx-75,cy+58,150,42,mint);e(cx-75,cy-105,150,42,pale);break;
 case 'Cone':p(`M${cx} ${cy-110}L${cx-85} ${cy+70}Q${cx} ${cy+112} ${cx+85} ${cy+70}Z`,mint);e(cx-85,cy+48,170,45,mint);break;
 case 'Pyramid':p(`M${cx} ${cy-110}L${cx-100} ${cy+70}l145 25 55-40Z`,mint);line(cx,cy-110,cx+45,cy+95);break;
 case 'Hemisphere':p(`M${cx-90} ${cy+28}A90 90 0 0 1 ${cx+90} ${cy+28}Z`,mint);e(cx-90,cy+6,180,44,pale);break;
 case 'Torus':e(cx-100,cy-66,200,132,mint);e(cx-45,cy-29,90,58,'#FFFFFF');break;
 case 'Tetrahedron':p(`M${cx} ${cy-105}L${cx-100} ${cy+75}L${cx+5} ${cy+10}Z`,mint);p(`M${cx} ${cy-105}L${cx+100} ${cy+75}L${cx+5} ${cy+10}Z`,pale);p(`M${cx-100} ${cy+75}H${cx+100}L${cx+5} ${cy+10}Z`,'#94C9C0');break;
 case 'Line':case 'Straight':line(cx-110,cy,cx+110,cy,z,10);break;
 case 'Curve':p(`M${cx-110} ${cy+60}Q${cx-90} ${cy-140} ${cx} ${cy}T${cx+110} ${cy-50}`,'none',z,'curve',10);break;
 case 'Zigzag':p(`M${cx-110} ${cy+50}l45-100 45 100 45-100 45 100`,'none',z,'zigzag',10);break;
 case 'Spiral':{let pts=[];for(let i=0;i<90;i++){const a=i*.16,s=7+i;pts.push([cx+Math.cos(a)*s,cy+Math.sin(a)*s]);}p('M'+pts.map(pt=>pt.join(' ')).join('L'),'none',z,'spiral',7);break;}
 case 'Right Angle':line(cx-90,cy-90,cx-90,cy+80,z,10);line(cx-90,cy+80,cx+90,cy+80,z,10);p(`M${cx-90} ${cy+50}h30v30`,'none',z);break;
 case 'Acute Angle':line(cx-90,cy+75,cx+100,cy+75,z,10);line(cx-90,cy+75,cx+20,cy-90,z,10);break;
 case 'Obtuse Angle':line(cx-20,cy+50,cx+100,cy+50,z,10);line(cx-20,cy+50,cx-100,cy-70,z,10);break;
 case 'Parallel':line(cx-90,cy-40,cx+90,cy-40,z,10);line(cx-90,cy+40,cx+90,cy+40,z,10);break;
 case 'Perpendicular':line(cx-100,cy,cx+100,cy,z,10);line(cx,cy-100,cx,cy+100,z,10);break;
 case 'Area':r(cx-90,cy-90,180,180,mint,ink,0);for(let j=1;j<4;j++){line(cx-90+j*45,cy-90,cx-90+j*45,cy+90,z,3);line(cx-90,cy-90+j*45,cx+90,cy-90+j*45,z,3);}break;
 case 'Perimeter':r(cx-90,cy-90,180,180,'#FFFFFF',z,0);break;
 case 'Volume':cube(cx-95,cy-90,140,145);for(let j=1;j<3;j++){line(cx-95+j*46,cy-60,cx-95+j*46,cy+85,z,3);line(cx-95,cy-60+j*48,cx+45,cy-60+j*48,z,3);}break;
 case 'Radius':case 'Diameter':case 'Circumference':e(cx-90,cy-90,180,180,'#FFFFFF',word==='Circumference'?z:ink);if(word==='Radius')line(cx,cy,cx+90,cy,z,10);if(word==='Diameter')line(cx-90,cy,cx+90,cy,z,10);e(cx-4,cy-4,8,8,ink,'none');break;
 case 'Diagonal':r(cx-90,cy-90,180,180,'#FFFFFF',ink,0);line(cx-90,cy-90,cx+90,cy+90,z,10);break;
 case 'Symmetry':p(`M${cx} ${cy-90}L${cx-80} ${cy+90}h160Z`,mint);line(cx,cy-100,cx,cy+105,z,5);break;
 case 'Vertex':p(`M${cx} ${cy-90}L${cx-80} ${cy+90}h160Z`,mint);e(cx-9,cy-99,18,18,z,'#FFFFFF');break;
 case 'Edge':cube(cx-100,cy-90,140,140);line(cx-100,cy-60,cx+40,cy-60,z,12);break;
 case 'Repeat':case 'Sequence':case 'Pattern':for(let j=0;j<4;j++){if(word==='Sequence')r(cx-110+j*58,cy+65-(j+1)*30,40,(j+1)*30,mint,ink,0);else if(j%2&&word==='Pattern')e(cx-110+j*58,cy-25,40,50,mint);else r(cx-110+j*58,cy-25,40,50,mint,ink,0);}break;
 case 'Tessellation':for(let a=0;a<4;a++)for(let b=0;b<4;b++)r(cx-100+a*50,cy-100+b*50,50,50,(a+b)%2?mint:pale,ink,0);break;
 case 'Fractal':{function branch(x,y,len,depth){if(!depth)return;line(x,y,x-len/2,y-len,z,4);line(x,y,x+len/2,y-len,z,4);branch(x-len/2,y-len,len*.58,depth-1);branch(x+len/2,y-len,len*.58,depth-1);}branch(cx,cy+100,95,4);break;}
 case 'Grid':for(let j=0;j<5;j++){line(cx-100+j*50,cy-100,cx-100+j*50,cy+100,z,5);line(cx-100,cy-100+j*50,cx+100,cy-100+j*50,z,5);}break;
 case 'Array':for(let a=0;a<3;a++)for(let b=0;b<3;b++)e(cx-85+a*65,cy-85+b*65,40,40,mint);break;
 case 'Matrix':r(cx-105,cy-95,210,190,'#FFFFFF',ink,0);for(let a=0;a<3;a++)for(let b=0;b<3;b++)t(cx-91+a*62,cy-70+b*50,48,40,String((a+b)%3),32);break;
 case 'Mosaic':for(let a=0;a<5;a++)for(let b=0;b<5;b++)r(cx-100+a*40,cy-100+b*40,36,36,Math.abs(a-2)+Math.abs(b-2)<3?teal:pale,ink,2);break;
 case 'Kaleidoscope':for(let j=0;j<8;j++){const a=j*Math.PI/4;const x1=cx+Math.cos(a)*90,y1=cy+Math.sin(a)*90,x2=cx+Math.cos(a+.5)*50,y2=cy+Math.sin(a+.5)*50;p(`M${cx} ${cy}L${x1} ${y1}L${x2} ${y2}Z`,j%2?mint:pale);}break;
 default:throw new Error('No shape renderer: '+word);
 }
}
function colorScene(lesson,chunk,words){const count=words.length,w=900/count;for(let j=0;j<count;j++){const x=150+j*w;panel(x,245,w-35,285);if(color[words[j]])r(x+30,280,w-95,180,color[words[j]],ink,8,'sample-'+words[j]);else{const palettes={Mix:['#E54049','#2765CB','#8139AE'],Blend:['#E54049','#AD4286','#2765CB'],Shade:['#7EAFED','#3978C4','#1C3D72'],Tint:['#307ACA','#83ADE1','#D9E8FC'],Hue:['#D52A32','#30864D','#2463CB'],Saturation:['#8F9CAE','#5784BF','#1262D2'],Gradient:['#DF4C73','#AB508E','#6154AD'],Spectrum:['#D52A32','#F18A28','#F5D331','#30864D','#2463CB','#8134AF']};if(words[j]==='Rainbow'){for(let k=0;k<6;k++)p(`M${x+35+k*12} 440A${(w-105)/2-k*12} ${(w-105)/2-k*12} 0 0 1 ${x+w-70-k*12} 440`,'none',Object.values(color).slice(0,6)[k],'rainbow-band',11);}else if(words[j]==='Pigment'){e(x+50,300,w-135,110,'#B97CBA',ink,'pigment-powder');r(x+35,385,w-105,60,pale,ink,5,'pigment-dish');}else{const colors=palettes[words[j]];if(!colors)throw new Error('No color concept '+words[j]);for(let k=0;k<colors.length;k++)r(x+30+k*(w-95)/colors.length,280,(w-95)/colors.length,180,colors[k],'none',0,'color-transition');r(x+30,280,w-95,180,'none',ink,0,'sample-boundary');}}}}
function numberScene(lesson,chunk,words){if(lesson===1){const nums=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].slice((chunk-1)*3,chunk*3);for(let g=0;g<3;g++){const x=70+g*355;panel(x,260,285,300);for(let j=0;j<nums[g];j++){if(chunk===1)folder(x+15+j*85,365,68,115);else if(chunk===2)cup(x+17+(j%3)*84,335+Math.floor(j/3)*95,54);else if(chunk===3)box(x+18+(j%3)*84,290+Math.floor(j/3)*83,60);else if(chunk===4)r(x+35,278+j*24,215,17,mint,ink,3,'ticket-'+(j+1));else{r(x+17+(j%3)*85,284+Math.floor(j/3)*52,66,40,pale,ink,4,'notebook-'+(j+1));line(x+28+(j%3)*85,285+Math.floor(j/3)*52,x+28+(j%3)*85,323+Math.floor(j/3)*52,teal,4);}}}if(chunk===1){r(1070,182,70,105,'#FFFFFF',ink,5,'clipboard');r(1085,170,40,22,teal,ink,3,'clipboard-clip');}if(chunk===2){p('M555 168Q530 195 543 230Q600 252 650 225L630 170Z',mint,ink,'kettle');p('M635 177Q694 163 681 213Q674 225 651 220','none',ink,'kettle-handle');p('M544 188l-36-15 13 38 25 6Z',mint,ink,'kettle-spout');r(584,145,21,24,teal,ink,4,'kettle-lid');}if(chunk===3){r(1035,85,100,150,ink,ink,0,'open-door');p('M1035 85l90 18v148l-90-16Z',pale,ink,'door-leaf');}return;}
 if(lesson===2||lesson===3&&[2,3].includes(chunk)){let digits=lesson===2?[[16,17,18],[19,20,30],[40,60,50],[70,80,90],[100,1000,1000000]][chunk-1]:chunk===2?[4,5,6]:[7,8,9,10];const selected=lesson===2?[2,1,-1,1,2][chunk-1]:chunk===2?1:3;for(let j=0;j<digits.length;j++){const x=70+j*1060/digits.length,w=1060/digits.length-24;r(x,235,w,270,'#FFFFFF',ink,18,'numeric-display');if(selected===j)selectedPanel();t(x+10,322,w-20,95,String(digits[j]),digits[j]>=1000000?52:78);}return;}
 if(lesson===3&&chunk===1){r(150,235,110,290,teal,ink,10,'service-counter');for(let j=0;j<3;j++)person(355+j*225,240,j===1);return;}
 if(lesson===3&&chunk===4){for(let j=0;j<3;j++){panel(70+j*355,255,300,255);if(j===1)selectedPanel();t(80+j*355,338,280,100,['2 + 3','=','5'][j],72);}return;}
 const formulas=lesson===3?['8 − 2 = 6','3 × 2 = 6','6 ÷ 2 = 3']:chunk===1?['5 + 2 = 7','5 − 2 = 3','5 × 2 = 10']:['10 ÷ 2 = 5','25%'];
 const selected=lesson===3?2:1;
 for(let j=0;j<formulas.length;j++){const x=80+j*1040/formulas.length,w=1040/formulas.length-20;panel(x,255,w,255);if(j===selected)selectedPanel();t(x+8,338,w-16,100,formulas[j],formulas.length>2?39:72);}
}
const scenes=[];
for(const unit of ['numbers-counting','colors','shapes-geometry','prepositions-of-place']){
 const lessons=JSON.parse(fs.readFileSync(`src/app/data/usage/${unit}.usage.json`,'utf8'));
 for(let li=0;li<lessons.length;li++){const lesson=lessons[li];for(const scene of lesson.usage.scenes){if(unit==='prepositions-of-place'&&(li!==0||scene.chunkNumber>2))continue;shapes=[];base();const words=Array.isArray(scene.targetWords)?scene.targetWords:[scene.targetWords];
 if(unit==='colors')colorScene(li+1,scene.chunkNumber,words);
 else if(unit==='numbers-counting')numberScene(li+1,scene.chunkNumber,words);
 else if(unit==='shapes-geometry'){for(let j=0;j<words.length;j++){const x=70+j*355;panel(x,215,300,330);shape(words[j],x);}}
 else if(scene.chunkNumber===1){r(150,305,820,40,pale,ink,5,'desk-top');r(180,345,30,210,teal,ink,3,'desk-leg');r(900,345,30,210,teal,ink,3,'desk-leg');r(225,235,220,65,mint,ink,7,'tray');folder(270,208,110,65);r(570,244,150,60,pale,ink,4,'notebook-on-desk');r(570,427,165,125,teal,ink,18,'bag-under-desk');p('M604 427v-24q47-40 94 0v24','none',ink,'bag-handle');}
 else{r(220,200,330,110,pale,ink,8,'printer-behind-chair');r(250,183,270,40,'#FFFFFF',ink,2,'printer-paper');r(265,300,190,155,mint,ink,20,'chair-back');r(250,450,220,30,teal,ink,8,'chair-seat');r(275,478,20,80,ink,'none',3,'chair-leg');r(425,478,20,80,ink,'none',3,'chair-leg');r(515,405,95,130,pale,ink,8,'bin-next-to-chair');r(700,410,320,35,pale,ink,8,'table-in-front');r(730,445,20,120,teal,ink,3,'table-leg');r(975,445,20,120,teal,ink,3,'table-leg');}
 if(unit==='prepositions-of-place'&&scene.chunkNumber===2){
   const legs=shapes.filter(s=>s.name==='table-leg');
   legs.forEach((s,i)=>{s.x=275+i*245;s.y=515;});
   Object.assign(shapes.find(s=>s.name==='table-in-front'),{x:250,y:480});
   Object.assign(shapes.find(s=>s.name==='bin-next-to-chair'),{x:565,y:405});
 }
 if(unit==='colors'){
   for(let j=0;j<words.length;j++)if(words[j]==='Mix'){
     const panelWidth=900/words.length,start=150+j*panelWidth+30;
     shapes=shapes.filter(s=>!(s.name==='color-transition'&&s.x>=start&&s.x<start+panelWidth-95));
     e(start+10,306,115,115,color.Red,ink,'mix-first-paint');
     e(start+85,306,115,115,color.Blue,ink,'mix-second-paint');
     p(`M${start+105} 311Q${start+145} 363 ${start+105} 416Q${start+65} 363 ${start+105} 311Z`,color.Purple,ink,'mixed-paint-overlap');
   }
   if(words.includes('Pigment')){const j=words.indexOf('Pigment'),panelWidth=900/words.length,start=150+j*panelWidth+50;for(let k=0;k<18;k++)e(start+35+(k%6)*30,320+Math.floor(k/6)*20,6,6,'#72284A','none','pigment-grain');}
   for(let j=0;j<words.length;j++)if(['Blend','Gradient'].includes(words[j])){
     const panelWidth=900/words.length,start=150+j*panelWidth+30;
     const bands=shapes.filter(s=>s.name==='color-transition'&&s.x>=start&&s.x<start+panelWidth-95);
     if(bands.length){const first=bands[0];first.w=panelWidth-95;first.gradient=bands.map(s=>s.fill);first.name='smooth-'+words[j];shapes=shapes.filter(s=>!bands.slice(1).includes(s));}
   }
   const rainbow=shapes.filter(s=>s.name==='rainbow-band');
   const rainbowColors=[color.Red,color.Orange,color.Yellow,color.Green,color.Blue,color.Indigo];
   rainbow.forEach((s,i)=>{s.stroke=rainbowColors[i];});
   if(rainbow.length){const j=words.indexOf('Rainbow'),panelWidth=900/words.length,x=150+j*panelWidth;p(`M${x+107} 440A${(panelWidth-105)/2-72} ${(panelWidth-105)/2-72} 0 0 1 ${x+panelWidth-142} 440`,'none',color.Purple,'rainbow-band',11);}
 }
 const id=`${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
 scenes.push({id,unitId:unit,scenario:scene.scenario,question:scene.check.question,expectedAnswer:scene.check.expectedAnswer,sourceImageBrief:scene.imageBrief,shapes:[...shapes],status:'generated-draft-needs-semantic-review'});
 }}
}
if(scenes.length!==50||new Set(scenes.map(s=>s.id)).size!==50)throw new Error('Expected 50 unique real scenes');
const xml=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const svgShape=s=>{const stroke=s.stroke&&s.stroke!=='none'?`stroke="${s.stroke}" stroke-width="${s.width||7}" stroke-linejoin="round" stroke-linecap="round"`:'';if(s.type==='rect')return `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.radius}" fill="${s.fill}" ${stroke}/>`;if(s.type==='ellipse')return `<ellipse cx="${s.x+s.w/2}" cy="${s.y+s.h/2}" rx="${s.w/2}" ry="${s.h/2}" fill="${s.fill}" ${stroke}/>`;if(s.type==='path')return `<path d="${s.d}" fill="${s.fill}" ${stroke}/>`;return `<text x="${s.x+s.w/2}" y="${s.y+s.h*.7}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="${s.size}" fill="${s.fill}">${xml(s.text)}</text>`;};
for(const scene of scenes){
 const gradients=scene.shapes.filter(s=>s.gradient);
 const defs=gradients.map(s=>`<linearGradient id="${s.name}" x1="0" x2="1" y1="0" y2="0">${s.gradient.map((c,i)=>`<stop offset="${i/(s.gradient.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient>`).join('');
 const markup=scene.shapes.map(s=>svgShape(s.gradient?{...s,fill:`url(#${s.name})`}:s)).join('');
 fs.writeFileSync(path.join(out,scene.id+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img"><title>${xml(scene.id)}</title><defs>${defs}</defs>${markup}</svg>`);
}
fs.writeFileSync(path.join(out,'scenes.json'),JSON.stringify(scenes,null,2)+'\n');
const elapsed=performance.now()-started;
fs.writeFileSync(path.join(out,'local-generation-report.json'),JSON.stringify({generated:scenes.length,elapsedMs:elapsed,svgBytes:scenes.map(s=>({id:s.id,bytes:fs.statSync(path.join(out,s.id+'.svg')).size})),approval:'Draft only: semantic, contrast, alternative-task, and mobile review still required'},null,2)+'\n');
console.log(JSON.stringify({generated:scenes.length,output:out,elapsedMs:elapsed,shapes:scenes.reduce((n,s)=>n+s.shapes.length,0)}));
