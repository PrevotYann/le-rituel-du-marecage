import fs from 'node:fs';
import sharp from 'sharp';
const files=JSON.parse(fs.readFileSync('.private-sources/art-files.json'));
for(const [k,f] of Object.entries(files))await sharp('C:/Users/yannp/.codex/generated_images/01a13500-d221-72b0-babd-07a178a56c63/'+f).resize(2400,1800,{fit:'fill'}).webp({quality:90}).toFile('assets/maps/'+k+'-art.webp');
const tiles=[];let i=0;
for(const k of Object.keys(files)){const image=await sharp('assets/maps/'+k+'-art.webp').resize(480,360).toBuffer();const label=Buffer.from(`<svg width="480" height="30"><rect width="480" height="30" fill="black"/><text x="10" y="22" fill="white" font-size="20">${k}</text></svg>`);tiles.push({input:image,left:i%3*480,top:Math.floor(i/3)*390});tiles.push({input:label,left:i%3*480,top:Math.floor(i/3)*390+360});i++;}
await sharp({create:{width:1440,height:Math.ceil(i/3)*390,channels:3,background:'black'}}).composite(tiles).png().toFile('.private-sources/maps-contact.png');
