import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const id=s=>crypto.createHash('sha256').update('rituel:'+s).digest('hex').slice(0,16);
const layouts=[
 ['omatqan','Omatqan — village','village'],['auberge','O bore de lo — salle et réserves','inn'],['ruelles','Ruelles — repère des braconniers','alley'],
 ['duplex','Duplex — rez-de-chaussée','house'],['chambre','Duplex — chambre de Taoxana','bedroom'],['vision','Vision — tombe et racines','vision'],
 ['intersection','Oqlan — intersections','swamp'],['dense','Oqlan — renfoncement dense','dense'],['ruisseau','Oqlan — ruisseau immobile','river'],
 ['gaama','Oqlan — clairière de Gaama','spider'],['noxiens','Oqlan — rencontre noxienne','camp'],['cabane','Barry — cabane et attente','cabin'],
 ['barry','Barry — salle inférieure','cellar'],['antiquaire','Antiquaire — rez-de-chaussée','antiques'],['etage','Antiquaire — étage','attic'],
 ['cave','Antiquaire — cave et puits','well'],['quais','Harelport — quais','dock'],['navire','Le Flot Persistant — pont','ship'],['cale','Le Flot Persistant — cale','hold']
];
export async function buildMaps(){
 fs.mkdirSync('assets/maps',{recursive:true});fs.mkdirSync('content/maps',{recursive:true});const output=[];
 for(const [key,name,kind] of layouts){
  let seed=parseInt(id(key).slice(0,8),16);const rnd=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
  const width=2400,height=1800,walls=[],lights=[],links=[],decor=[];let n=0;
  const wall=(x1,y1,x2,y2,door=0,window=false)=>{walls.push({_id:id(key+':w'+n++),c:[x1,y1,x2,y2],move:20,sight:window?10:20,light:window?10:20,sound:20,door,ds:0});decor.push(`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${door?'#b69265':'#241b16'}" stroke-width="${door?11:22}"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${door?'#d8b277':'#806347'}" stroke-width="${door?5:9}"/>`);};
  const room=(x,y,w,h,doorX=x+w/2)=>{decor.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#wood)" stroke="#211b13" stroke-width="25"/>`);wall(x,y,x+w,y);wall(x,y,x,y+h);wall(x+w,y,x+w,y+h);wall(x,y+h,doorX-45,y+h);wall(doorX-45,y+h,doorX+45,y+h,1);wall(doorX+45,y+h,x+w,y+h);};
  const rect=(x,y,w,h,fill,rx=5)=>decor.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="#292018" stroke-width="5"/>`);
  const table=(x,y)=>{rect(x-60,y-40,120,80,'url(#wood)',25);for(const [dx,dy] of [[0,-70],[0,70],[-90,0],[90,0]])rect(x+dx-18,y+dy-18,36,36,'#926a48');decor.push(`<ellipse cx="${x+20}" cy="${y}" rx="16" ry="12" fill="#cfbb91"/><circle cx="${x-25}" cy="${y+12}" r="9" fill="#653d23"/>`);};
  const lamp=(x,y)=>{lights.push({_id:id(key+':l'+lights.length),x,y,config:{dim:8,bright:3,color:'#ffc276',alpha:0.3,animation:{type:'torch',speed:2,intensity:3}}});decor.push(`<circle cx="${x}" cy="${y}" r="75" fill="url(#glow)"/><circle cx="${x}" cy="${y}" r="10" fill="#ffc676" stroke="#4b3020" stroke-width="5"/>`);};
  const stairs=(x,y,target,tx=x,ty=y)=>{rect(x-45,y-100,90,200,'#674d38');for(let i=0;i<9;i++)decor.push(`<path d="M${x-40} ${y-90+i*22}h80" stroke="#c5a078" stroke-width="4"/>`);links.push({x,y,target,tx,ty,label:'Escalier / passage'});};
  const tree=(x,y,r)=>{decor.push(`<ellipse cx="${x+10}" cy="${y+15}" rx="${r*1.1}" ry="${r}" fill="#11291d" opacity=".7"/>`);for(let i=0;i<8;i++){const a=i*Math.PI/4;decor.push(`<ellipse cx="${x+Math.cos(a)*r/2}" cy="${y+Math.sin(a)*r/2}" rx="${r*.55}" ry="${r*.45}" fill="${['#24482d','#345a36','#3c613c','#284d31'][i%4]}" stroke="#1d3b26" stroke-width="3"/>`);}decor.push(`<circle cx="${x}" cy="${y}" r="${r*.4}" fill="#47703e"/>`);};
  const exterior=['village','alley','swamp','dense','river','spider','camp','dock'].includes(kind);
  const svg=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="${Math.floor(rnd()*80)}"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="soft-light"/></filter><pattern id="wood" width="120" height="30" patternUnits="userSpaceOnUse"><rect width="120" height="30" fill="#856343"/><path d="M0 0H120M60 0V30" stroke="#513b2c" stroke-width="2"/><path d="M6 8Q30 3 52 9T113 7M12 20Q40 17 56 21T110 20" fill="none" stroke="#aa8461" opacity=".6"/></pattern><pattern id="stone" width="120" height="90" patternUnits="userSpaceOnUse"><rect width="120" height="90" fill="#686653"/><path d="M0 0H120M0 45H120M0 90H120M60 0V45M30 45V90M100 45V90" stroke="#454636" stroke-width="4"/></pattern><radialGradient id="glow"><stop stop-color="#ffd38b" stop-opacity=".45"/><stop offset="1" stop-color="#ffc474" stop-opacity="0"/></radialGradient></defs>`];
  svg.push(`<rect width="2400" height="1800" fill="${exterior?'#47513b':['cellar','well','vision'].includes(kind)?'#514e3f':'#303d38'}" filter="url(#grain)"/>`);
  if(exterior){
   for(let i=0;i<1200;i++){const x=rnd()*width,y=rnd()*height;decor.push(`<ellipse cx="${x}" cy="${y}" rx="${3+rnd()*14}" ry="${2+rnd()*6}" fill="${['#747452','#404c31','#6b6345','#253e2d'][i%4]}" opacity=".5"/>`);}
   const river=kind==='dock'?'M1500 -100Q1100 750 1550 1900':'M1350 -100Q1050 400 1330 850T1200 1900';
   decor.push(`<path d="${river}" fill="none" stroke="#253d3a" stroke-width="${kind==='dock'?1300:260}"/><path d="${river}" fill="none" stroke="#527776" stroke-width="${kind==='dock'?1200:180}"/>`);
   for(let i=0;i<100;i++){const x=1100+rnd()*260,y=rnd()*height;decor.push(`<path d="M${x} ${y}q20 -6 40 0" fill="none" stroke="#96aaa0" opacity=".2"/>`);}
   if(kind!=='dock')for(let i=0;i<95;i++){let x=rnd()*width,y=rnd()*height;if((x<350||x>2050||y<220||y>1580)||kind==='dense'&&x<800)tree(x,y,40+rnd()*55);}
   decor.push(`<path d="M0 1150Q500 900 1100 1150T2400 1100" stroke="#8d8060" stroke-width="150" fill="none" opacity=".85"/>`);
  }
  if(kind==='village'){for(const [x,y,w,h] of [[400,350,360,300],[400,1250,300,260],[1600,300,500,500],[1650,1250,320,260]])room(x,y,w,h);rect(1070,1010,350,190,'url(#wood)');lamp(1530,930);lamp(830,890);links.push({x:1790,y:750,target:'auberge',tx:1200,ty:1450,label:'Entrer à l’auberge'},{x:590,y:600,target:'duplex',tx:1100,ty:1500,label:'Duplex'},{x:2200,y:1100,target:'ruelles',tx:300,ty:1050,label:'Ruelles'},{x:1200,y:100,target:'intersection',tx:1200,ty:1500,label:'Marais'});}
  else if(['inn','house','bedroom','cabin','antiques','attic','well','cellar','hold'].includes(kind)){
   room(360,240,1680,1260,1200);
   if(['inn','house','antiques','well','hold'].includes(kind)){wall(900,240,900,780);wall(900,870,900,1500);wall(900,780,900,870,1);wall(1540,240,1540,900);wall(1540,990,1540,1500);wall(1540,900,1540,990,1);}
   if(kind==='inn'){for(const [x,y] of [[1160,490],[1290,850],[1110,1220],[1770,1150],[1770,600]])table(x,y);rect(470,400,120,650,'url(#wood)');for(let i=0;i<4;i++)rect(700,340+i*125,70,90,'#836844');lamp(600,1320);lamp(1810,400);}
   if(kind==='house'){table(1750,1100);rect(460,380,300,100,'#a28460');rect(550,1100,220,100,'#645345');stairs(1190,420,'chambre');}
   if(kind==='bedroom'){rect(1400,500,380,460,'#ab9983',25);rect(1430,520,320,90,'#dbc9a1');rect(400,500,140,270,'url(#stone)');lamp(480,640);lamp(1690,1130);stairs(1190,420,'duplex');links.push({x:1600,y:780,target:'vision',tx:1100,ty:1400,label:'Vision (choix MJ)'});}
   if(kind==='cabin'){for(let i=0;i<4;i++)rect(1150+i*130,800,65,65,'#a48055');table(650,600);stairs(1700,900,'barry',1200,1200);}
   if(kind==='cellar'){table(1200,650);stairs(1200,1200,'cabane',1700,900);for(let i=0;i<6;i++)rect(500+i*80,430,60,80,'#657f74');}
   if(['antiques','attic'].includes(kind)){for(let i=0;i<6;i++){rect(440,330+i*150,250,65,'url(#wood)');for(let j=0;j<4;j++)decor.push(`<circle cx="${465+j*55}" cy="${360+i*150}" r="${10+j*2}" fill="${['#b29c57','#678e88','#86627f','#9b7643'][j]}" stroke="#30251e" stroke-width="3"/>`);}table(1770,1070);stairs(1200,420,kind==='attic'?'antiquaire':'etage');if(kind==='antiques')stairs(1750,390,'cave',600,400);}
   if(kind==='well'){decor.push('<circle cx="1770" cy="1130" r="112" fill="#192e2f" stroke="#9b9a83" stroke-width="24"/><circle cx="1770" cy="1130" r="125" fill="none" stroke="#403f32" stroke-width="8"/>');stairs(600,400,'antiquaire',1750,390);links.push({x:1770,y:1130,target:'ruisseau',tx:1200,ty:1100,label:'Puits : transport à confirmer'});for(let i=0;i<7;i++)rect(1040+(i%3)*120,400+Math.floor(i/3)*150,75,80,'#967943');lamp(1000,1290);}
   if(kind==='hold'){stairs(1200,420,'navire',1200,600);for(let i=0;i<12;i++)rect(470+(i%3)*125,470+Math.floor(i/3)*170,100,120,'url(#wood)');table(1750,1150);}
   lamp(1100,700);lamp(1850,1370);
  }else if(kind==='alley'){room(300,220,600,600);room(1540,220,600,600);room(1540,1200,550,400);for(let i=0;i<5;i++)rect(1650+i*75,370,65,90,'url(#wood)');lamp(1850,740);}
  else if(kind==='vision'){room(400,300,1600,1150);rect(550,500,200,420,'url(#stone)',50);for(let i=0;i<12;i++)decor.push(`<path d="M${450+i*125} 320Q${750+i*80} 650 ${450+i*125} 1400" stroke="#343823" fill="none" stroke-width="16"/>`);lamp(1250,760);}
  else if(kind==='ship'){decor.push('<path d="M1200 150Q1920 450 1810 1250L1620 1600H780L590 1250Q480 450 1200 150Z" fill="url(#wood)" stroke="#35291d" stroke-width="28"/>');for(const [x1,y1,x2,y2] of [[1200,150,1810,600],[1810,600,1810,1250],[1810,1250,1620,1600],[1620,1600,780,1600],[780,1600,590,1250],[590,1250,590,600],[590,600,1200,150]])wall(x1,y1,x2,y2);for(let i=0;i<3;i++){rect(620,700+i*220,210,75,'#393d3c');rect(1570,700+i*220,210,75,'#393d3c');}decor.push('<circle cx="1200" cy="1000" r="50" fill="#6a4829" stroke="#282118" stroke-width="8"/>');stairs(1200,600,'cale');lamp(900,1400);lamp(1500,1400);}
  else if(kind==='dock'){rect(230,280,660,1240,'url(#stone)');rect(860,600,1150,160,'url(#wood)');rect(860,1180,1250,160,'url(#wood)');for(let i=0;i<8;i++)rect(300+(i%3)*140,380+Math.floor(i/3)*180,90,110,'url(#wood)');links.push({x:1930,y:680,target:'navire',tx:900,ty:1400,label:'Embarquer'});lamp(950,665);}
  else if(kind==='spider'){for(let i=0;i<18;i++){const a=i*Math.PI/9;decor.push(`<path d="M1200 850L${1200+Math.cos(a)*600} ${850+Math.sin(a)*600}" stroke="#c0bdaa" stroke-width="3" opacity=".6"/>`);}for(let r=100;r<650;r+=100)decor.push(`<ellipse cx="1200" cy="850" rx="${r}" ry="${r*.75}" fill="none" stroke="#adb69a" stroke-width="3" opacity=".65"/>`);}
  else if(kind==='camp'){for(let i=0;i<4;i++){const x=440+i*430,y=430+(i%2)*700;decor.push(`<path d="M${x} ${y}l140 -180 140 180 -140 85Z" fill="#694236" stroke="#2f261d" stroke-width="10"/><path d="M${x+140} ${y-160}v240" stroke="#b19173" stroke-width="4"/>`);}lamp(1180,980);}
  svg.push(...decor,`<rect width="2400" height="1800" fill="transparent" filter="url(#grain)" opacity=".08"/></svg>`);
  fs.writeFileSync('content/maps/'+key+'.svg',svg.join(''));
  await sharp(Buffer.from(svg.join(''))).webp({quality:88}).toFile('assets/maps/'+key+'.webp');
  const data={key,name,width,height,walls,lights,links,spawn:{x:1020,y:1560},path:'modules/le-rituel-du-marecage/assets/maps/'+key+'.webp'};fs.writeFileSync('content/maps/'+key+'.json',JSON.stringify(data,null,2));output.push(data);
 }
 return output;
}
