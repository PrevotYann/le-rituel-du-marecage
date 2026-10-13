import fs from 'node:fs';
import sharp from 'sharp';
const a=JSON.parse(fs.readFileSync('content/actors.json')),tiles=[];let i=0;
for(const actor of a){const input=actor.img.replace('modules/le-rituel-du-marecage/','');if(!fs.existsSync(input))continue;const label=Buffer.from(`<svg width="180" height="26"><rect width="180" height="26" fill="#16251e"/><text x="5" y="19" fill="white" font-size="14">${actor.name.replaceAll('&','&amp;').replaceAll('<','&lt;')}</text></svg>`);tiles.push({input:await sharp(input).resize(180,180).toBuffer(),left:i%6*180,top:Math.floor(i/6)*206},{input:label,left:i%6*180,top:Math.floor(i/6)*206+180});i++;}
fs.mkdirSync('test-results',{recursive:true});await sharp({create:{width:1080,height:Math.ceil(i/6)*206,channels:3,background:'#16251e'}}).composite(tiles).png().toFile('test-results/portraits-contact.png');
