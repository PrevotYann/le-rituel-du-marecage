import fs from 'node:fs';
import {ClassicLevel} from 'classic-level';
const manifest=JSON.parse(fs.readFileSync('module.json','utf8'));
// Adventure contents use SetField(EmbeddedDataField), stored inline, unlike EmbeddedCollectionField.
const children={Adventure:[],Actor:['items','effects'],Item:['effects'],JournalEntry:['pages'],Scene:['tokens','walls','lights','sounds','tiles','drawings','notes','regions','levels'],RollTable:['results'],Playlist:['sounds'],Cards:['cards'],Combat:['combatants'],JournalEntryPage:[]};
const childType={actors:'Actor',items:'Item',journal:'JournalEntry',scenes:'Scene',tables:'RollTable',macros:'Macro',folders:'Folder',combats:'Combat',cards:'Cards',playlists:'Playlist',pages:'JournalEntryPage'};
for(const pack of manifest.packs){const data=JSON.parse(fs.readFileSync('content/'+pack.name+'.json','utf8')),db=new ClassicLevel(pack.path,{valueEncoding:'json'});await db.open();await db.clear();const ops=[];
 function put(doc,type,parts,ids){const d=structuredClone(doc);for(const field of children[type]||[]){if(!Array.isArray(d[field]))continue;for(const sub of d[field])put(sub,childType[field]||field,parts+'.'+field,ids+'.'+sub._id);d[field]=d[field].map(d=>d._id);}ops.push({type:'put',key:'!'+parts+'!'+ids,value:d});}
 for(const doc of data.documents)put(doc,pack.type,'adventures',doc._id);for(const f of data.folders)ops.push({type:'put',key:'!folders!'+f._id,value:f});await db.batch(ops);await db.close();console.log(pack.name+': '+data.documents.length+' Adventure, '+ops.length+' enregistrements LevelDB');}
