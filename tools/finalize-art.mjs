import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const M='le-rituel-du-marecage',read=p=>JSON.parse(fs.readFileSync(p)),data=read('content/adventure.json'),a=data.documents[0],id=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const scene=key=>a.scenes.find(s=>s.flags[M].key===key);
const wall=(s,coords,{door=0,window=false}={})=>s.walls.push({_id:id(s._id+':wall:'+s.walls.length),c:coords.map((v,i)=>Math.round(v*(i%2?1800:2400))),move:20,sight:window?10:20,light:window?10:20,sound:20,door,ds:0});
function room(s,x,y,w,h,doorX=x+w/2,doorY=null){wall(s,[x,y,x+w,y]);wall(s,[x,y,x,y+h]);wall(s,[x+w,y,x+w,y+h]);wall(s,[x,y+h,doorX-.018,y+h]);wall(s,[doorX-.018,y+h,doorX+.018,y+h],{door:1});wall(s,[doorX+.018,y+h,x+w,y+h]);}
for(const s of a.scenes){const k=s.flags[M].key;if(fs.existsSync('assets/maps/'+k+'-art.webp')){s.background.src=`modules/${M}/assets/maps/${k}-art.webp`;s.walls=[];}}
const rooms={duplex:[.09,.165,.82,.47],chambre:[.13,.12,.78,.57],vision:[.11,.12,.81,.66],cabane:[.18,.18,.63,.50],barry:[.13,.08,.73,.68],etage:[.12,.10,.79,.63]};
for(const[k,r]of Object.entries(rooms))room(scene(k),...r);
const alleys=scene('ruelles');room(alleys,.135,.08,.245,.235);room(alleys,.15,.405,.245,.255);room(alleys,.54,.105,.385,.445,.73);
const ship=scene('navire'),hull=[[.50,.05],[.70,.27],[.79,.57],[.76,.80],[.65,.94],[.34,.94],[.23,.80],[.20,.57],[.29,.27],[.5,.05]];for(let i=1;i<hull.length;i++)wall(ship,[...hull[i-1],...hull[i]]);
const hold=scene('cale');room(hold,.065,.08,.89,.84);wall(hold,[.39,.10,.39,.45]);wall(hold,[.39,.45,.39,.49],{door:1});wall(hold,[.39,.49,.39,.91]);wall(hold,[.65,.10,.65,.53]);wall(hold,[.65,.53,.65,.58],{door:1});wall(hold,[.65,.58,.65,.91]);
const village=scene('omatqan');village.background.src=`modules/${M}/assets/maps/omatqan-art.webp`;village.walls=[];
// Roofed houses block sight; the open tavern and duplex use their visible perimeter.
for(const r of [[.64,.21,.26,.30],[.037,.235,.145,.24],[.59,.65,.145,.11],[.795,.665,.14,.13],[.205,.052,.21,.15],[.127,.027,.065,.105],[.287,.482,.167,.19],[.775,.08,.082,.115]])room(village,...r);
village.flags[M].spawn={x:1440,y:1440};village.tokens[0].x=1500;village.tokens[0].y=980;
village.flags[M].links=[{x:1830,y:930,target:'auberge',tx:1200,ty:1450,label:'O bore de lo'},{x:400,y:820,target:'duplex',tx:1200,ty:1180,label:'Duplex'},{x:2240,y:1200,target:'ruelles',tx:1100,ty:650,label:'Ruelles'},{x:1200,y:100,target:'intersection',tx:1200,ty:1500,label:'Oqlan'}];
for(const s of a.scenes){for(const passage of s.flags[M].links||[]){if(s.flags[M].key==='duplex'&&passage.target==='chambre'){passage.x=1200;passage.y=400;passage.tx=1200;passage.ty=400;}if(s.flags[M].key==='chambre'&&passage.target==='duplex'){passage.x=1200;passage.y=400;passage.tx=1200;passage.ty=400;}if(s.flags[M].key==='cabane'){passage.x=1740;passage.y=1000;passage.tx=1200;passage.ty=1080;}if(s.flags[M].key==='barry'){passage.x=1200;passage.y=1080;passage.tx=1740;passage.ty=1000;}}}
// Add a visible window on the tavern; never overlap a blocking wall.
const inn=scene('auberge');const left=inn.walls.find(w=>w.c[0]===360&&w.c[2]===360);if(left){const index=inn.walls.indexOf(left);inn.walls.splice(index,1);wall(inn,[.15,.133,.15,.39]);wall(inn,[.15,.39,.15,.44],{window:true});wall(inn,[.15,.44,.15,.833]);}
fs.writeFileSync('content/adventure.json',JSON.stringify(data,null,2));fs.writeFileSync('content/scenes.json',JSON.stringify(a.scenes,null,2));
for(const s of a.scenes.filter(s=>s.flags[M].links)){const k=s.flags[M].key;const svg=`<svg width="2400" height="1800">${s.walls.map(w=>`<path d="M${w.c[0]} ${w.c[1]}L${w.c[2]} ${w.c[3]}" stroke="${w.door?'#31dc57':'#ff3b50'}" stroke-width="5"/>`).join('')}${(s.flags[M].links||[]).map(l=>`<circle cx="${l.x}" cy="${l.y}" r="28" fill="none" stroke="#37bdf3" stroke-width="5"/>`).join('')}</svg>`;fs.mkdirSync('test-results/walls',{recursive:true});await sharp(s.background.src.replace(`modules/${M}/`,'')).resize(2400,1800,{fit:'fill'}).composite([{input:Buffer.from(svg)}]).webp().toFile('test-results/walls/'+k+'.webp');}

