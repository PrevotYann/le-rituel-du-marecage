import fs from 'node:fs';
import sharp from 'sharp';
const a=JSON.parse(fs.readFileSync('content/adventure.json')).documents[0],tiles=[],scenes=a.scenes.filter(s=>s.flags['le-rituel-du-marecage'].links);let i=0;
for(const s of scenes){const input=s.background.src.replace('modules/le-rituel-du-marecage/','');tiles.push({input:await sharp(input).resize(480,360,{fit:'fill'}).toBuffer(),left:i%3*480,top:Math.floor(i/3)*390});const label=Buffer.from(`<svg width="480" height="30"><rect width="480" height="30" fill="#14281f"/><text x="8" y="22" fill="#e3d6ad" font-size="18">${s.name.replaceAll('&','&amp;')}</text></svg>`);tiles.push({input:label,left:i%3*480,top:Math.floor(i/3)*390+360});i++;}
fs.mkdirSync('previews',{recursive:true});await sharp({create:{width:1440,height:Math.ceil(i/3)*390,channels:3,background:'#14281f'}}).composite(tiles).webp({quality:86}).toFile('previews/cartes.webp');fs.copyFileSync('test-results/portraits-contact.png','previews/portraits.png');
