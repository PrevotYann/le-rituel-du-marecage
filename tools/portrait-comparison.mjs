import sharp from 'sharp';
const tiles=[];
for(const [index,key] of ['anna','ygritte'].entries()){
 tiles.push({input:await sharp('assets/portraits/'+key+'.webp').resize(300,300).toBuffer(),left:index*340,top:40});
 tiles.push({input:await sharp('assets/tokens/'+key+'.png').resize(180,180).toBuffer(),left:index*340+60,top:360});
 const label=`<svg width="300" height="30"><text x="12" y="23" fill="white" font-size="22">${index?'Ygritte':'Anna'}</text></svg>`;
 tiles.push({input:Buffer.from(label),left:index*340,top:5});
}
await sharp({create:{width:640,height:560,channels:3,background:'#16251e'}}).composite(tiles).png().toFile('previews/anna-ygritte.png');
