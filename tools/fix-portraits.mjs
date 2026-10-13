import fs from 'node:fs';
import sharp from 'sharp';
const crops=JSON.parse(fs.readFileSync('content/portrait-crops.json'));
for(const [key,crop] of Object.entries(crops)){const input='assets/source/'+crop.source+'.webp',meta=await sharp(input).metadata(),side=Math.min(Math.round(meta.width*crop.size),meta.width,meta.height),left=Math.max(0,Math.min(meta.width-side,Math.round(meta.width*crop.center[0]-side/2))),top=Math.max(0,Math.min(meta.height-side,Math.round(meta.height*crop.center[1]-side/2)));
 await sharp(input).extract({left,top,width:side,height:side}).resize(600,600).webp({quality:92}).toFile('assets/portraits/'+key+'.webp');
 const image=await sharp('assets/portraits/'+key+'.webp').resize(400,400).composite([{input:Buffer.from('<svg width="400" height="400"><circle cx="200" cy="200" r="192" fill="white"/></svg>'),blend:'dest-in'}]).png().toBuffer();
 await sharp(image).composite([{input:Buffer.from('<svg width="400" height="400"><circle cx="200" cy="200" r="192" fill="none" stroke="#b6a570" stroke-width="10"/></svg>')}]).png().toFile('assets/tokens/'+key+'.png');
}
console.log('Portraits et tokens recadrés : '+Object.keys(crops).length);
