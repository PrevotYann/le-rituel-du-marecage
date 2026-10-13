import fs from 'node:fs';
import crypto from 'node:crypto';
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else files.push(p);}}walk('assets');
const hashes=new Map(),replacements=[];for(const p of files){const h=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(hashes.has(h))replacements.push([p,hashes.get(h)]);else hashes.set(h,p);}
for(const p of fs.readdirSync('content').filter(p=>p.endsWith('.json')).map(p=>'content/'+p)){let s=fs.readFileSync(p,'utf8');for(const[from,to]of replacements)s=s.replaceAll(from,to);fs.writeFileSync(p,s);}
for(const[from]of replacements)fs.unlinkSync(from);console.log('Doublons binaires fusionnés : '+replacements.length);
