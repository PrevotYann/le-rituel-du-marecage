import fs from 'node:fs';
import {chromium} from 'playwright';
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://localhost:30016');await page.locator('[name="username"]').fill('Gamemaster');await page.locator('button[name="join"]').click();await page.waitForFunction(()=>globalThis.game?.ready&&game.runeterra.waitForTime&&game.rituel,null,{timeout:300000});
 const actors=await page.evaluate(()=>game.actors.filter(a=>a.getFlag('le-rituel-du-marecage','reviewVersion')==='0.1.1').map(a=>({id:a.id,name:a.name})));
 const checks=[];
 for(const actor of actors){const result=await page.evaluate(async id=>{
  const M='le-rituel-du-marecage',actor=game.actors.get(id),rules=game.runeterra.rules,{attackProfile}=await import('/systems/jdr-runeterra/scripts/attack-data.mjs'),checks=[],assert=(name,test)=>{if(!test)throw Error(actor.name+' : '+name);checks.push(name);},items=actor.items.filter(i=>i.type==='ability'),initialHP=actor.system.hp.base,initialUltimate=actor.system.ultimate;
  const rng=CONFIG.Dice.randomUniform;assert('Générateur D100 contrôlable',typeof rng==='function');
  const [weapon,equipment]=await actor.createEmbeddedDocuments('Item',[{name:'Arme test',type:'weapon',flags:{[M]:{qaFixture:true}},system:{damageFormula:'5',components:[{formula:'5',type:'physical',penetration:0}],quantity:1}},{name:'Équipement test',type:'equipment',flags:{[M]:{qaFixture:true}},system:{integrity:{value:0,max:20},broken:true}}]);
  const victim=game.actors.find(a=>a.getFlag(M,'key')==='luis'),[object]=await victim.createEmbeddedDocuments('Item',[{name:'Objet test visible',type:'resource',flags:{[M]:{qaFixture:true}},system:{quantity:4}}]);
  try{for(const item of items){for(const variant of item.system.variants){const p=attackProfile(item.system,variant.id);assert(item.name+' / '+variant.id+' : profil complet',p.components.length>0&&p.attribute===variant.attribute&&p.alternateAttribute===variant.attribute);const initial={xp:item.system.xp,level:item.system.level,uses:item.system.uses.value};
   for(const good of [true,false]){
    await actor.update({'system.hp.base':Math.max(40,initialHP),'system.ultimate':3});await item.update({'system.uses.value':Math.max(1,item.system.uses.max),'system.remainingCooldown':0});
    const hp=actor.system.hp.base,before=new Set(actor.items.map(i=>i.id)),effectsBefore=new Set(actor.effects.map(e=>e.id)),quantity=key=>actor.items.filter(i=>i.getFlag(M,'key')===key).reduce((n,i)=>n+i.system.quantity,0),reward=variant.rituel?.reward,rewardKey='crafted:'+reward,rewardBefore=quantity(rewardKey),beforeMessage=new Set(game.messages.map(m=>m.id));
    CONFIG.Dice.randomUniform=()=>good?.805:.105;
    const creature=variant.rituel?.kind==='tame'?game.actors.find(a=>a.getFlag(M,'vivarium')===actor.uuid):game.actors.find(a=>a.getFlag(M,'key')==='finisstier');
    const result=await item.use({variant:variant.id,contextConfirmed:true,modifier:0,bonusAttribute:'perception',weaponId:weapon.id,equipmentId:equipment.id,exchangePair:'force:stealth',creatureId:creature.id,objectUuid:object.uuid});
    assert(item.name+' / '+variant.id+' : D100 '+(good?'réussite':'échec')+' '+JSON.stringify({die:result?.die,total:result?.roll.total,outcome:result?.result,value:result?.value,quantity:item.system.quantity}),!!result&&result.roll.total===(good?20:90)&&rules.success(result.result)===good);
    const messages=game.messages.filter(m=>!beforeMessage.has(m.id)),native=messages.find(m=>m.content.includes('rt-test-result'))?.flags?.['jdr-runeterra']||{};
    if(good){const expected=p.components.reduce((n,c)=>n+Number(c.formula),0);if(expected)assert(item.name+' / '+variant.id+' : dégâts de la variante',native.damage===expected);if(p.healFormula!=='0')assert(item.name+' / '+variant.id+' : soin de la variante',native.heal===Number(p.healFormula));if(p.dot.level)assert(item.name+' / '+variant.id+' : poison/état de la variante',native.dot.level===p.dot.level&&native.dot.kind===p.dot.kind);}
    else assert(item.name+' / '+variant.id+' : aucun dégât/soin/poison de cible sur échec',!native.damage&&!native.heal&&!native.dot?.level);
    if(reward){assert(item.name+' / '+variant.id+' : récompense seulement après réussite',quantity(rewardKey)===rewardBefore+(good?1:0));assert(item.name+' / '+variant.id+' : fabrication ne soigne pas',actor.system.hp.base===hp);}
    if(item.getFlag(M,'key')==='wako:ability:1')assert('Danse Fluide sans soin ni création',actor.system.hp.base===hp&&actor.items.size===before.size&&!native.heal);
    if(good&&variant.rituel?.kind==='selfBonus')for(const mod of variant.rituel.modifications)assert(item.name+' : bonus natif '+mod.attribute,actor.effects.some(e=>!effectsBefore.has(e.id)&&e.changes.some(c=>c.key==='system.attributes.'+mod.attribute+'.bonus'&&Number(c.value)===mod.value)));
    if(good&&variant.rituel?.kind==='selfOverride')assert('Regan : tous les attributs à 100, malus inclus',Object.keys(actor.system.attributes).every(k=>actor.attributeValue(k)===100));
    if(good&&variant.rituel?.kind==='weaponBonus'){assert('Bonus de dégâts sur arme',weapon.system.components.some(c=>c.type==='magic'&&c.formula==='10'));await weapon.use({modifier:0});assert('Bonus retiré après la prochaine utilisation',!weapon.getFlag(M,'weaponBonus')&&weapon.system.components.length===1);}
    for(const effect of actor.effects.filter(e=>!effectsBefore.has(e.id)))await effect.delete();for(const created of actor.items.filter(i=>!before.has(i.id)))if(created.getFlag(M,'qaFixture'))await created.delete();await actor.update({'system.hp.base':initialHP,'system.ultimate':initialUltimate});
   }
   await item.update({'system.xp':initial.xp,'system.level':initial.level,'system.uses.value':initial.uses});
  }}
  const pc=actor.type==='character';if(pc)assert('Quatre compétences après les récompenses',actor.items.filter(i=>i.type==='ability').length===4);
  }finally{CONFIG.Dice.randomUniform=rng;for(const item of actor.items.filter(i=>i.getFlag(M,'qaFixture')))await item.delete();if(victim.items.has(object.id))await object.delete();}
  return {name:actor.name,abilities:items.length,variants:items.reduce((n,i)=>n+i.system.variants.length,0),checks};
 },actor.id);checks.push(result);console.log('ACTOR',result.name,result.abilities+' compétences',result.variants+' variantes',result.checks.length+' contrôles');}
 const wako=actors.find(a=>a.name==='Wako');const inventory=await page.evaluate(async id=>{const a=game.actors.get(id),M='le-rituel-du-marecage',potion=a.items.find(i=>i.getFlag(M,'key')==='crafted:onno-potion'),poison=a.items.find(i=>i.getFlag(M,'key')==='crafted:onno-poison');if(!potion||!poison)throw Error('Récompenses Onno absentes');await a.update({'system.hp.base':40});const quantity=potion.system.quantity;await potion.use();if(a.system.hp.base!==50||potion.system.quantity!==quantity-1)throw Error('Consommation native de la potion incorrecte');if(poison.type!=='consumable'||poison.system.dot.level!==2)throw Error('Dose de poison incorrecte');return {potionHP:a.system.hp.base,poisonLevel:poison.system.dot.level};},wako.id);
 fs.writeFileSync('test-results/ability-variants.json',JSON.stringify({actors:checks,inventory,errors},null,2));if(errors.length)throw Error(errors.join('\n'));console.log('ALL VARIANTS',checks.reduce((n,a)=>n+a.variants,0),'Inventory',inventory);
}finally{await browser.close();}
