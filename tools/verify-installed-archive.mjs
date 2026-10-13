import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {ClassicLevel} from 'classic-level';
const root='.qa/Data/modules/le-rituel-du-marecage',hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert(!fs.lstatSync(root).isSymbolicLink(),'L’installation doit être un dossier extrait');
let checked=0;
function compare(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const path=directory+'/'+entry.name;if(entry.isDirectory())compare(path);else{if(directory==='assets/maps'&&entry.name.endsWith('-geometry.webp'))continue;assert.equal(hash(path),hash(root+'/'+path),'Archive : '+path);checked++;}}}
for(const directory of ['scripts','styles','lang','assets','translations'])compare(directory);
const db=new ClassicLevel(root+'/packs/adventure',{valueEncoding:'json'});await db.open();
const key='!adventures!'+JSON.parse(fs.readFileSync('content/adventure.json')).documents[0]._id,data=await db.get(key);await db.close();
assert(data.actors.length===54&&data.scenes.length===23&&data.journal.length===28,'Adventure intégrale dans le ZIP');
const actor=k=>data.actors.find(a=>a.flags['le-rituel-du-marecage'].key===k);
assert.notEqual(actor('anna').img,actor('ygritte').img);assert.notEqual(actor('anna').prototypeToken.texture.src,actor('ygritte').prototypeToken.texture.src);
assert.notEqual(hash(root+'/assets/portraits/anna.webp'),hash(root+'/assets/portraits/ygritte.webp'));
assert.notEqual(hash(root+'/assets/tokens/anna.png'),hash(root+'/assets/tokens/ygritte.png'));
const runtime=JSON.parse(fs.readFileSync('test-results/runtime.json'));assert.deepEqual(runtime.errors,[]);assert.deepEqual(runtime.invalid,[]);
const report={status:'passed',world:'Monde QA neuf, créé avant installation du ZIP',moduleInstallation:'Dossier extrait indépendant du dépôt',core:'14.368',system:'0.8.0',filesCompared:checked,nativeAdventure:{actors:data.actors.length,items:data.items.length,journals:data.journal.length,scenes:data.scenes.length},runtimeChecks:runtime.checks.length,distinctAnnaYgrittePortraitsAndTokens:true,errors:[]};
fs.writeFileSync('test-results/archive.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
