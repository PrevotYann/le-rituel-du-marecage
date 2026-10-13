import {refreshActors} from './actor-review.mjs';
export const MID='le-rituel-du-marecage',ROOT=`modules/${MID}/`;
export const collections={Actor:'actors',Item:'items',JournalEntry:'journal',Scene:'scenes',RollTable:'tables',Macro:'macros',Folder:'folders'};
export const authority=()=>{if(!game.user.isGM||game.users.activeGM?.id!==game.user.id)throw Error(game.i18n.localize('RITUEL.Authority'));};
const clone=v=>foundry.utils.deepClone(v),getKey=d=>d.flags?.[MID]?.key;
export async function json(file){if(['content/chapters.json','content/tables.json'].includes(file)){if(!game.user.isGM)throw Error(game.i18n.localize('RITUEL.GMOnly'));const pack=game.packs.get(MID+'.adventure'),index=await pack.getIndex(),adventure=await pack.getDocument(index.contents[0]._id),key=file==='content/chapters.json'?'chapters':'tables';const value=adventure.getFlag(MID,'runtimeData')?.[key];if(!value)throw Error('Métadonnées Adventure absentes : '+key);return foundry.utils.deepClone(value);}const r=await fetch(ROOT+file);if(!r.ok)throw Error(file+': '+r.status);return r.json();}
export function world(key,type){return game.collections.get(type)?.find(d=>getKey(d)===key);}
export async function diagnostic(){
 const references=await json('content/system-references.json'),problems=[],resolved={};
 if(game.system.id!=='jdr-runeterra'||game.system.version!=='0.8.0')problems.push({key:'system',uuid:'jdr-runeterra@0.8.0',message:'Version du système non auditée : '+game.system.id+'@'+game.system.version});
 if(game.release.generation!==14||game.release.build<368)problems.push({key:'core',uuid:'Foundry 14.368',message:'Moteur non pris en charge.'});
 for(const ref of references.filter(r=>r.decision.startsWith('reuse'))){let doc;try{doc=await fromUuid(ref.uuid);}catch{}if(doc&&doc.documentName===ref.type)resolved[ref.key]=doc;else{
  const pack=game.packs.get(ref.uuid.split('.').slice(1,3).join('.'));const index=pack?await pack.getIndex():[];const candidates=[];
  for(const c of index.filter(c=>c.name===ref.name)){const verified=await pack.getDocument(c._id);if(verified)candidates.push({uuid:verified.uuid,name:verified.name});}
  problems.push({key:ref.key,uuid:ref.uuid,message:'UUID introuvable ou mauvais type : '+ref.name,candidates});
 }}
 return {ok:!problems.length,problems,resolved,references};
}
export function remap(value,uuidMap,idMap){
 if(typeof value==='string'){if(idMap.has(value))return idMap.get(value);for(const [from,to] of uuidMap)value=value.replaceAll(from,to);return value;}
 if(Array.isArray(value))return value.map(v=>remap(v,uuidMap,idMap));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,remap(v,uuidMap,idMap)]));return value;
}
let importing=false;
export async function importAdventure({pregens=['eliora','joel','kaelor','klaus','wako'],preserveMemory=false,stopAfter=null,open=true,language='fr'}={}){
 authority();if(importing)throw Error('Import déjà en cours.');importing=true;
 try{
  const diag=await diagnostic();if(!diag.ok)throw Error(diag.problems.map(p=>p.uuid+' — '+p.message).join('\n'));
  const pack=game.packs.get(MID+'.adventure');if(!pack)throw Error('Compendium aventure absent.');const index=await pack.getIndex(),adventure=await pack.getDocument(index.contents[0]._id);
  if(!adventure)throw Error('Adventure absent.');const data=adventure.toObject(),plan=await json('content/import-plan.json');
  await refreshActors();
  const lang=await localization(language);if(lang)applyLocalization(data,lang);
  const selected=new Set(pregens);for(const key of pregens){if(!plan.pregens.includes(key))throw Error('Prétiré inconnu : '+key);for(const k of plan.companions[key]||[])selected.add(k);}
  data.actors=data.actors.filter(a=>a.type!=='character'||selected.has(getKey(a))).filter(a=>!a.flags[MID].parent||selected.has(a.flags[MID].parent));
  const sourceModels=[];
  for(const key of plan.dependencyActors){const ref=diag.resolved[key],existing=game.actors.find(a=>a.getFlag(MID,'systemUuid')===ref.uuid||a._stats.compendiumSource===ref.uuid||a.getFlag('core','sourceId')===ref.uuid);if(existing){sourceModels.push({key,doc:existing,existing:true});continue;}const doc=ref.toObject();delete doc.folder;doc._id=foundry.utils.randomID();doc.flags={...doc.flags,[MID]:{key:'system:'+key,systemUuid:ref.uuid,contentVersion:'0.1.0'},core:{sourceId:ref.uuid}};doc._stats={...doc._stats,compendiumSource:ref.uuid};doc.folder=data.folders.find(f=>f.type==='Actor'&&f.name==='Créatures spécifiques')?._id;doc.ownership={default:0};sourceModels.push({key,doc});data.actors.push(doc);}
  for(const a of data.actors){for(const spec of plan.sourceInventories[getKey(a)]||[]){const ref=await fromUuid(spec.uuid);if(!ref)throw Error('Inventaire source absent : '+spec.uuid);const doc=ref.toObject();doc._id=foundry.utils.randomID();delete doc.folder;doc.system.quantity=spec.quantity;doc.flags={...doc.flags,[MID]:{key:getKey(a)+':inventory:'+spec.uuid,contentVersion:'0.1.0'},core:{sourceId:spec.uuid}};doc._stats={...doc._stats,compendiumSource:spec.uuid};a.items.push(doc);}}
  const uuidMap=new Map(),idMap=new Map();const create={},preserved=[];
  for(const [type,field] of Object.entries(collections))for(const doc of data[field]||[]){const key=getKey(doc);const existing=world(key,type);const oldId=doc._id,newId=existing?.id||(game.collections.get(type).has(oldId)?foundry.utils.randomID():oldId);idMap.set(oldId,newId);uuidMap.set(type+'.'+oldId,type+'.'+newId);if(existing){preserved.push({type,key,name:existing.name,contentVersion:existing.getFlag(MID,'contentVersion')});continue;}(create[type]??=[]).push(doc);}
  const stagedModel=key=>{const row=sourceModels.find(x=>x.key===key);return row.existing?row.doc.toObject():row.doc;};
  for(const [sceneKey,modelKey,x,y] of [['auberge','poro',1700,1200],['ruelles','rooye',1120,1020]]){const scene=create.Scene?.find(s=>getKey(s)===sceneKey);if(!scene)continue;const a=stagedModel(modelKey);scene.tokens.push({_id:foundry.utils.randomID(),name:a.name,actorId:a._id,actorLink:false,x,y,width:1,height:1,texture:{src:a.prototypeToken?.texture?.src||a.img},disposition:1,bar1:{attribute:'health'},hidden:false,flags:{[MID]:{key:sceneKey+':system-token:'+modelKey}}});}
  const arrival=create.Scene?.find(s=>getKey(s)==='omatqan');if(arrival)for(const [i,a] of data.actors.filter(a=>a.type==='character').entries())arrival.tokens.push({...a.prototypeToken,_id:foundry.utils.randomID(),actorId:a._id,actorLink:true,x:1440+(i%4)*70,y:1440+Math.floor(i/4)*70,disposition:1,hidden:false,flags:{[MID]:{key:'arrival-pc:'+getKey(a)}}});
  for(const type of Object.keys(create))create[type]=remap(create[type],uuidMap,idMap);
  for(const scene of create.Scene||[]){const c=(await json('content/chapters.json')).find(c=>c.scene===getKey(scene));if(c){const jId=idMap.get(data.journal.find(j=>getKey(j)===c.key)?._id);if(jId)scene.notes.push({_id:foundry.utils.randomID(),entryId:jId,x:180,y:180,text:c.name,icon:'icons/svg/book.svg',global:false});}}
  const registry={...game.settings.get(MID,'importRegistry'),status:'running',operation:foundry.utils.randomID(),started:Date.now(),selected:pregens,preserveMemory,preserved,completed:[]};await game.settings.set(MID,'importRegistry',registry);
  await game.settings.set(MID,'preserveMemory',preserveMemory);
  // Use core Adventure.import, its hooks and importContent; never invoke core overwrite mode.
  const result=await adventure.import({dialog:false,rituelManaged:true,preImport:[async function(importData){for(const key of Object.keys(importData.toCreate))delete importData.toCreate[key];for(const key of Object.keys(importData.toUpdate))delete importData.toUpdate[key];
   for(const type of ['Folder','Item','Actor','JournalEntry','RollTable','Macro','Scene'])if(create[type]?.length)importData.toCreate[type]=create[type];importData.documentCount=Object.values(create).reduce((n,a)=>n+a.length,0);
   if(stopAfter){const entries=Object.entries(importData.toCreate);for(const [type] of entries)if(entries.findIndex(e=>e[0]===type)>=stopAfter)delete importData.toCreate[type];}
  }]});
  const completed=Object.entries(result.created||{}).flatMap(([type,docs])=>docs.map(d=>({type,id:d.id,key:getKey(d)})));
  await game.settings.set(MID,'importRegistry',{...registry,status:stopAfter?'interrupted':'complete',completed,finished:Date.now()});
  if(open&&!stopAfter){await world('start','JournalEntry')?.sheet.render({force:true});await world('omatqan','Scene')?.activate();}
  return {created:completed.length,preserved:preserved.length,status:stopAfter?'interrupted':'complete',result};
 }finally{importing=false;}
}
export async function localization(language){if(language==='fr')return null;try{return await json('translations/'+language+'/adventure-content.json');}catch{return null;}}
export function applyLocalization(data,entries){for(const [field,docs] of Object.entries(data)){if(!Array.isArray(docs))continue;for(const d of docs){const t=entries[getKey(d)];if(!t)continue;if(t.name)d.name=t.name;if(t.biography&&d.system)d.system.biography=t.biography;if(t.description&&d.system)d.system.description=t.description;if(t.pages&&d.pages)for(const p of d.pages){const text=t.pages[p._id];if(text)p.text.content=text;}if(t.items&&d.items)for(const i of d.items){const it=t.items[getKey(i)];if(it?.name)i.name=it.name;if(it?.description)i.system.description=it.description;}}}}
export async function preview(){const pack=game.packs.get(MID+'.adventure'),index=await pack.getIndex(),a=await pack.getDocument(index.contents[0]._id);return Object.entries(collections).flatMap(([type,field])=>(a.toObject()[field]||[]).map(d=>{const existing=world(getKey(d),type);return {type,key:getKey(d),name:d.name,action:existing?'préserver':'créer',conflict:existing&&existing.getFlag(MID,'contentVersion')!==d.flags[MID].contentVersion};}));}
export async function wizard(){authority();const diag=await diagnostic();if(!diag.ok){await foundry.applications.api.DialogV2.wait({window:{title:'RITUEL.Diagnostic'},content:'<pre>'+foundry.utils.escapeHTML(diag.problems.map(p=>p.uuid+'\n'+p.message+'\nCandidats vérifiés : '+JSON.stringify(p.candidates||[])).join('\n\n'))+'</pre>',buttons:[{action:'close',label:'RITUEL.Close'}]});return;}
 const plan=await json('content/import-plan.json'),changes=await preview();const form=await foundry.applications.api.DialogV2.input({window:{title:'RITUEL.Import'},position:{width:620},content:`<p>${game.i18n.localize('RITUEL.ImportHint')}</p>${plan.pregens.map(k=>`<label><input type="checkbox" name="${k}" ${['eliora','joel','kaelor','klaus','wako'].includes(k)?'checked':''}> ${k}</label>`).join('')}<label><input type="checkbox" name="preserveMemory">${game.i18n.localize('RITUEL.PreserveMemory')}</label><p>${changes.filter(c=>c.action==='créer').length} créations ; ${changes.filter(c=>c.action==='préserver').length} documents conservés.</p><details><summary>${game.i18n.localize('RITUEL.Changes')}</summary><ul>${changes.map(c=>'<li>'+foundry.utils.escapeHTML(c.name)+': '+c.action+(c.conflict?' — nouvelle version disponible, choix manuel requis':'')+'</li>').join('')}</ul></details>`,ok:{label:'RITUEL.Import'},rejectClose:false});if(!form)return;return importAdventure({pregens:plan.pregens.filter(k=>form[k]),preserveMemory:!!form.preserveMemory});}

