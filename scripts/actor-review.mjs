const MID='le-rituel-du-marecage',REV='0.1.1',clone=v=>foundry.utils.deepClone(v);
const defaults={attribute:'first',alternateAttribute:'second',damageFormula:'10',damageType:'physical',healFormula:'0',components:[],variants:[],modifications:[],associatedEffects:[],targetMode:'self',duration:0,area:0,dot:{kind:'bleeding',level:0,elapsed:0,lost:0},conditions:'',slots:1};
const matches=(value,prior)=>Array.isArray(prior)?Array.isArray(value)&&value.length===prior.length&&prior.every((x,i)=>matches(value[i],x)):prior&&typeof prior==='object'?value&&Object.entries(prior).every(([k,x])=>matches(value[k],x)):value===prior;
let reviewing;
export function refreshActors({notify=false}={}){
 if(!game.user.isGM||game.users.activeGM?.id!==game.user.id)throw Error(game.i18n.localize('RITUEL.Authority'));
 if(reviewing)return reviewing;reviewing=review({notify}).finally(()=>{reviewing=null;});return reviewing;
}
async function review({notify}){
 if(!game.actors.some(a=>a.getFlag(MID,'key')))return {actors:0,items:0,tokens:0};
 const pack=game.packs.get(MID+'.adventure');if(!pack)return {actors:0,items:0,tokens:0};const index=await pack.getIndex(),data=(await pack.getDocument(index.contents[0]._id)).toObject(),byKey=new Map(data.actors.map(a=>[a.flags[MID].key,a])),report={actors:0,items:0,tokens:0};
 for(const actor of game.actors){const source=byKey.get(actor.getFlag(MID,'key'));if(!source||actor.getFlag(MID,'reviewVersion')===REV)continue;
  const flags=source.flags[MID],patch={};for(const field of ['species','subspecies','region','appearance','morphology','environment']){
   const old=flags.originLegacy[field]??'',current=actor.system[field];if(current===old||current==='')patch['system.'+field]=source.system[field];
  }
  if(actor.system.biography===flags.reviewLegacy.biography)patch['system.biography']=source.system.biography;
  for(const field of ['originDefaults','originLegacy','originNote','subtypeLabel','reviewLegacy','reviewVersion','contentVersion','passive'])if(flags[field]!==undefined)patch['flags.'+MID+'.'+field]=clone(flags[field]);
  const passive=actor.items.find(i=>i.getFlag(MID,'key')===actor.getFlag(MID,'key')+':ability:P');
  if(passive){if(passive.system.description!==flags.passive?.description)patch['flags.'+MID+'.passive']={name:passive.name,description:passive.system.description};await passive.delete();report.items++;}
  const updates=[],creates=[];
  for(const sourceItem of source.items.filter(i=>i.type==='ability')){
   const existing=actor.items.find(i=>i.getFlag(MID,'key')===sourceItem.flags[MID].key);
   if(!existing){const d=clone(sourceItem);if(actor.items.has(d._id))d._id=foundry.utils.randomID();creates.push(d);continue;}
   const legacy=sourceItem.flags[MID].abilityLegacy,update={_id:existing.id,sort:sourceItem.sort};
   if(legacy&&existing.name===legacy.name)update.name=sourceItem.name;
   for(const field of ['description','attribute','alternateAttribute','damageFormula','damageType','healFormula','components','variants','modifications','associatedEffects','targetMode','duration','area','dot','conditions','slots']){
    const previous=legacy?.system[field]??defaults[field];if(matches(existing.system[field],previous))update['system.'+field]=clone(sourceItem.system[field]??defaults[field]);
   }
   for(const field of ['abilityRevision','slot','abilityLegacy','contentVersion'])update['flags.'+MID+'.'+field]=clone(sourceItem.flags[MID][field]);updates.push(update);
  }
  if(updates.length)await actor.updateEmbeddedDocuments('Item',updates);if(creates.length)await actor.createEmbeddedDocuments('Item',creates);report.items+=updates.length+creates.length;
  await actor.update(patch);report.actors++;
 }
 // Unlinked tokens can carry their own obsolete origins in ActorDelta.
 for(const scene of game.scenes)for(const token of scene.tokens){if(token.actorLink||!token.actor)continue;const source=byKey.get(token.actor.getFlag(MID,'key'));if(!source)continue;const delta=token.delta?._source?.system||{},patch={};for(const field of ['species','subspecies','region','appearance','morphology','environment'])if(field in delta&&(delta[field]===source.flags[MID].originLegacy[field]||delta[field]===''))patch['system.'+field]=source.system[field];if(Object.keys(patch).length){await token.actor.update(patch);report.tokens++;}}
 if(notify&&report.actors)ui.notifications.info(game.i18n.format('RITUEL.ActorReviewUpdated',{count:report.actors}));return report;
}
export function renderActorReview(sheet,html,context){
 const actor=sheet.actor;if(!actor?.getFlag(MID,'key')||!['character','npc'].includes(actor.type))return;const root=html instanceof HTMLElement?html:html?.[0]||sheet.element,identity=root?.querySelector('.rt-identity');if(!identity)return;
 const label=k=>game.i18n.localize('RITUEL.'+k),escape=s=>foundry.utils.escapeHTML(String(s||''));
 if(actor.type==='npc'&&!identity.querySelector('.rituel-origins')){
  const row=document.createElement('div');row.className='rt-row rituel-origins';
  for(const [field,options]of [['species',context.species],['subspecies',context.subspecies],['region',context.regions]]){const input=document.createElement('select');input.name='system.'+field;input.setAttribute('aria-label',game.i18n.localize('RUNETERRA.Fields.'+field));input.disabled=!sheet.isEditable;const list=[...(options||[])];if(!list.some(o=>o.key===actor.system[field]))list.unshift({key:actor.system[field],label:actor.system[field]});for(const option of list){const el=document.createElement('option');el.value=option.key;el.textContent=option.label;el.selected=option.key===actor.system[field];input.append(el);}row.append(input);}
  identity.querySelector('.rt-name')?.after(row);
 }
 const subspecies=identity.querySelector('[name="system.subspecies"] option[value=""]');if(subspecies)subspecies.textContent=actor.getFlag(MID,'subtypeLabel')||label(actor.system.species==='human'?'HumanDefault':'SubtypeUnknown');
 const region=identity.querySelector('[name="system.region"] option[value=""]');if(region)region.textContent=label('RegionUnknown');
 const species=identity.querySelector('[name="system.species"] option[value=""]');if(species)species.textContent=label('SpeciesUnclassified');
 for(const input of identity.querySelectorAll('select[name^="system."]'))input.title=actor.getFlag(MID,'originNote')||'';
 const abilities=root.querySelector('[data-rt-tab="abilities"]');if(abilities){
  const rows=[...abilities.querySelectorAll('.rt-item-card')].filter(row=>actor.items.get(row.dataset.itemId)?.type==='ability').sort((a,b)=>(actor.items.get(a.dataset.itemId).sort||0)-(actor.items.get(b.dataset.itemId).sort||0));if(rows.length){const marker=document.createComment('rituel skill order');rows[0].before(marker);for(const row of rows)marker.before(row);marker.remove();}
  const passive=actor.getFlag(MID,'passive');if(passive&&!abilities.querySelector('.rituel-passive')){const panel=document.createElement('details');panel.className='rt-panel rituel-passive';panel.innerHTML='<summary>'+escape(label('PassiveTrait')+' — '+passive.name)+'</summary>'+passive.description;abilities.append(panel);}
 }
}
