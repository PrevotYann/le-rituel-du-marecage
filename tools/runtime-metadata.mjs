import fs from 'node:fs';
const M='le-rituel-du-marecage',p='content/adventure.json',d=JSON.parse(fs.readFileSync(p));d.documents[0].flags[M].runtimeData={chapters:JSON.parse(fs.readFileSync('content/chapters.json')),tables:JSON.parse(fs.readFileSync('content/tables.json'))};fs.writeFileSync(p,JSON.stringify(d,null,2));
