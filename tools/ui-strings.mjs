import fs from 'node:fs';
const source=fs.readFileSync('scripts/main.mjs','utf8'),literal=source.match(/const entries=(\[.*?\]);/s)[1],entries=Function('return '+literal)(),p='lang/fr.json',data=JSON.parse(fs.readFileSync(p));data.RITUEL.Actions=Object.fromEntries(entries);fs.writeFileSync(p,JSON.stringify(data,null,2));
