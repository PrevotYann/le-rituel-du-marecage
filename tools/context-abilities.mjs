import fs from 'node:fs';
import crypto from 'node:crypto';
import {catalog,variant} from './ability-catalog.mjs';
const M='le-rituel-du-marecage',REV='0.1.1',p='content/adventure.json',data=JSON.parse(fs.readFileSync(p)),a=data.documents[0],definitions=JSON.parse(fs.readFileSync('content/ability-definitions.json')).actors,origins=JSON.parse(fs.readFileSync('content/actor-origins.json')).actors;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'),html=s=>'<p>'+esc(s).replaceAll('\n','<br>')+'</p>',id=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16),neutral={damageFormula:'0',damageType:'physical',healFormula:'0',components:[{formula:'0',type:'physical',penetration:0,penetrating:false}],modifications:[],associatedEffects:[],dot:{kind:'bleeding',level:0,elapsed:0,lost:0},duration:0,area:0,targetMode:'targets',attribute:'first',alternateAttribute:'first',slots:0,originalRarity:'blue',conditions:'Choisir la variante et vérifier son contexte avant le jet.'};
const contexts={};
for(const actor of a.actors){
 const key=actor.flags[M].key,origin=origins[key];if(!origin)throw Error('Origine absente : '+key);
 actor.flags[M].reviewLegacy??={biography:actor.system.biography};actor.flags[M].originLegacy=origin.legacy;actor.flags[M].originDefaults=Object.fromEntries(['species','subspecies','region','appearance'].map(k=>[k,origin[k]]));actor.flags[M].originNote=origin.reason;actor.flags[M].subtypeLabel=origin.subtypeLabel;actor.flags[M].reviewVersion=REV;actor.flags[M].contentVersion=REV;
 Object.assign(actor.system,actor.flags[M].originDefaults);actor.system.morphology=origin.appearance;actor.system.environment=origin.region||'Origine non précisée';
 if(origin.biography)actor.system.biography=html(origin.biography);
 const definition=definitions[key];
 if(definition){
  const oldItems=actor.items;actor.flags[M].passive={name:definition.passive.name,description:html(definition.passive.description)};
  actor.system.biography=html(definition.biography)+'<aside class="rituel-passive"><h3>Trait passif — '+esc(definition.passive.name)+'</h3>'+html(definition.passive.description)+'</aside>';
  const skills=definition.skills.map((source,index)=>{const semantic=key+':ability:'+source.slot,old=oldItems.find(i=>i.flags?.[M]?.key===semantic),legacy=old?.flags?.[M]?.abilityLegacy??(old?{name:old.name,system:structuredClone(old.system)}:null),variants=catalog[key]?.[source.slot];if(!variants?.length)throw Error('Variantes absentes : '+semantic);
   return {...old,_id:old?._id||id(semantic),name:source.slot+' — '+source.name,type:'ability',sort:(index+1)*100000,img:actor.img,flags:{...old?.flags,[M]:{...old?.flags?.[M],key:semantic,contentVersion:REV,abilityRevision:REV,slot:source.slot,abilityLegacy:legacy}},system:{...old?.system,...neutral,abilityKind:source.slot==='U'?'ultimate':'skill',description:html(source.description)+'<p>Choisir une variante avant le jet. Intelligence → Concentration ; ultimes : trois charges natives. Les durées absentes et marqueurs d’état adaptés sont indiqués dans les variantes.</p>',variants:variants.map(v=>({...v,description:html(source.name+' — '+v.label+'\n'+v.conditions)}))},effects:old?.effects||[]};
  });
  actor.items=[...oldItems.filter(i=>i.type!=='ability'||!/^.+:ability:(?:P|[123]|U)$/.test(i.flags?.[M]?.key||'')),...skills];
 }else{
  let index=0;for(const item of actor.items.filter(i=>i.type==='ability')){
   const semantic=item.flags?.[M]?.key;if(!semantic)continue;item.flags[M].abilityLegacy??={name:item.name,system:structuredClone(item.system)};item.flags[M].abilityRevision=REV;item.flags[M].contentVersion=REV;item.flags[M].slot=String(++index);item.sort=index*100000;item.name=item.name.replace(/^\d+ — /,'');item.name=index+' — '+item.name;
   // Non-PC attacks remain their native, source-specific actions, not invented four-skill lists.
   if(!item.system.variants?.length)item.system.variants=[variant('action','Utiliser '+item.name.replace(/^\d+ — /,''),item.system.attribute||'first',{...Object.fromEntries(['damageFormula','damageType','healFormula','components','modifications','associatedEffects','dot','duration','targetMode','area'].filter(k=>item.system[k]!==undefined).map(k=>[k,item.system[k]])),description:item.system.description})];
   for(const v of item.system.variants){if(!v.components?.length)v.components=[{formula:v.damageFormula??item.system.damageFormula??'0',type:v.damageType??item.system.damageType??'physical',penetration:0,penetrating:false}];v.alternateAttribute=v.attribute;}
  }
 }
 for(const item of actor.items){item.system.originalRarity||='blue';if(item.type==='ability')contexts[item.flags[M].key]=item.system.variants;}
}
for(const item of a.items)item.system.originalRarity||='blue';
fs.writeFileSync(p,JSON.stringify(data,null,2));fs.writeFileSync('content/actors.json',JSON.stringify(a.actors,null,2));fs.writeFileSync('content/items.json',JSON.stringify(a.items,null,2));fs.writeFileSync('content/context-abilities.json',JSON.stringify(contexts,null,2));
console.log('Acteurs audités : '+a.actors.length+' ; 32 compétences PJ, variantes isolées, traits passifs en biographie.');
