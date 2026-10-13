import fs from 'node:fs';
import sharp from 'sharp';
const base='C:/Users/yannp/.codex/generated_images/01a13500-d221-72b0-babd-07a178a56c63/';
const originals={auberge:'exec-0a16f8c1-0596-4b2f-b2c5-9eda4ccd82c7.png',antiquaire:'exec-38477d6f-6ab1-4817-8b59-42b8288dbaad.png',cave:'exec-acea5b1b-5ea7-45b4-b3c0-fe146297b0a3.png'};
for(const [key,file] of Object.entries(originals)){fs.copyFileSync('assets/maps/'+key+'.webp','assets/maps/'+key+'-geometry.webp');await sharp(base+file).resize(2400,1800,{fit:'fill'}).webp({quality:92}).toFile('assets/maps/'+key+'.webp');}
fs.writeFileSync('content/generated-art.json',JSON.stringify({tool:'Built-in image_gen',license:'Visuels originaux générés pour cette adaptation.',maps:Object.keys(originals),prompt:'Retexturer les plans de géométrie sans déplacer les murs, portes, puits et escaliers. Vue orthographique du dessus, matériaux détaillés, aucun texte ni grille. Les images source restent des références privées.'},null,2));
