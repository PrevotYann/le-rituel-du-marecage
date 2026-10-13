import fs from 'node:fs';
import {chromium} from 'playwright';
const browser=await chromium.launch(),page=await browser.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
async function join(p,name,password=''){await p.goto('http://localhost:30016');await p.locator('[name="username"]').fill(name);if(password)await p.locator('[name="password"]').fill(password);await p.locator('button[name="join"]').click();await p.waitForFunction(()=>globalThis.game?.ready&&game.rituel&&!canvas.loading,null,{timeout:300000});}
try{
 await join(page,'Gamemaster');
 const checks=await page.evaluate(async()=>{
  const M='le-rituel-du-marecage',checks=[],assert=(n,t)=>{if(!t)throw Error(n);checks.push(n);},actor=k=>game.actors.find(a=>a.getFlag(M,'key')===k),rng=CONFIG.Dice.randomUniform,confirm=foundry.applications.api.DialogV2.confirm;
  const cast=async(a,kind,options={})=>{const item=a.items.find(i=>i.type==='ability'&&i.system.variants.some(v=>v.rituel?.kind===kind)),v=item.system.variants.find(v=>v.rituel?.kind===kind);return item.use({variant:v.id,contextConfirmed:true,...options});};
  try{
   CONFIG.Dice.randomUniform=()=>.805;
   const kaelor=actor('kaelor'),model=actor('finisstier'),companions=[...kaelor.system.companions];
   await cast(kaelor,'capture',{creatureId:model.id});
   const captured=game.actors.find(a=>a.getFlag(M,'vivarium')===kaelor.uuid);
   assert('Capture : individu distinct, modèle conservé',captured&&captured.id!==model.id&&game.actors.has(model.id));
   assert('Capture : compagnon associé au Vivarium',captured.getFlag(M,'capturedBy')===kaelor.uuid&&kaelor.system.companions.includes(captured.uuid));
   await cast(kaelor,'tame',{creatureId:captured.id});assert('Apprivoisement après capture',captured.getFlag(M,'tamedBy')===kaelor.uuid);
   await kaelor.update({'system.companions':companions});await captured.delete();
   const eliora=actor('eliora'),joel=actor('joel');await cast(eliora,'contextReward',{recipientId:joel.id});
   const effect=joel.effects.find(e=>e.getFlag(M,'contextReward'));assert('Vulnérabilité : bonus sur le bénéficiaire choisi',!!effect&&!eliora.effects.some(e=>e.getFlag(M,'contextReward')));
   const base=joel.attributeValue('force'),roll=await joel.rollAttribute('force',{contextReward:effect.id});assert('Bonus natif de +10 sur le jet choisi',roll.value===Math.min(100,base+10));assert('Bonus consommé après un seul jet',!joel.effects.has(effect.id));
   const initial={force:joel.attributeValue('force'),stealth:joel.attributeValue('stealth')};await cast(joel,'exchange',{exchangePair:'force:stealth'});assert('Échange : valeurs natives permutées',joel.attributeValue('force')===initial.stealth&&joel.attributeValue('stealth')===initial.force);await joel.rollAttribute('perception');assert('Échange retiré après la prochaine action',joel.attributeValue('force')===initial.force&&joel.attributeValue('stealth')===initial.stealth);
   const wako=actor('wako'),item=wako.items.find(i=>i.getFlag(M,'key')==='wako:ability:2'),v=item.system.variants.find(v=>v.rituel?.reward==='onno-poison');await item.use({variant:v.id,contextConfirmed:true});
   const poison=wako.items.find(i=>i.getFlag(M,'key')==='crafted:onno-poison');await poison.update({'system.quantity':1});foundry.applications.api.DialogV2.confirm=async()=>true;
   const ids=new Set(game.messages.map(m=>m.id));await Promise.all([poison.use(),poison.use()]);const messages=game.messages.filter(m=>!ids.has(m.id)&&m.flags[M]?.ability===poison.uuid);
   assert('Dose unique : un seul débit et une seule carte malgré deux clics',poison.system.quantity===0&&messages.length===1);
   const modelTarget=actor('luis'),card=messages[0],targets=game.user.targets;
   const scene=game.scenes.find(s=>s.tokens.some(t=>t.actorId===modelTarget.id));await scene.view();const token=canvas.tokens.placeables.find(t=>t.actor?.id===modelTarget.id);if(!token)throw Error('Token cible absent');const target=token.actor;for(const e of target.effects.filter(e=>e.statuses.has('poison')))await e.delete();const targetEffects=new Set(target.effects.map(e=>e.id));game.user.targets=new Set([token]);
   try{const html=document.createElement('div');html.innerHTML=card.content;Hooks.callAll('renderChatMessageHTML',card,html);html.querySelector('[data-rt-action="effect"]').click();const start=Date.now();while(!card.getFlag('jdr-runeterra','appliedTargets')?.includes(target.uuid)){if(Date.now()-start>15000)throw Error('Application native du poison expirée');await new Promise(r=>setTimeout(r,50));}
    assert('Poison appliqué par la carte native : niveau 2',target.effects.some(e=>!targetEffects.has(e.id)&&e.statuses.has('poison')&&e.getFlag('jdr-runeterra','level')===2));
    const n=target.effects.size;html.querySelector('[data-rt-action="effect"]').click();await new Promise(r=>setTimeout(r,300));assert('Même carte : seconde application refusée',target.effects.size===n);
   }finally{game.user.targets=targets;for(const e of target.effects.filter(e=>!targetEffects.has(e.id)))await e.delete();}
   const player=game.users.find(u=>u.name==='Joueur QA');await wako.update({['ownership.'+player.id]:3});
  }finally{CONFIG.Dice.randomUniform=rng;foundry.applications.api.DialogV2.confirm=confirm;}
  return checks;
 });
 const player=await browser.newPage();player.on('pageerror',e=>errors.push(e.message));await join(player,'Joueur QA','rituel-qa');
 const playerChecks=await player.evaluate(async()=>{const M='le-rituel-du-marecage',a=game.actors.find(a=>a.getFlag(M,'key')==='wako'),item=a.items.find(i=>i.getFlag(M,'key')==='wako:ability:2'),v=item.system.variants.find(v=>v.rituel?.reward==='onno-potion'),rng=CONFIG.Dice.randomUniform;if(game.user.isGM||!a.isOwner)throw Error('Compte joueur requis');const quantity=()=>a.items.filter(i=>i.getFlag(M,'key')==='crafted:onno-potion').reduce((n,i)=>n+i.system.quantity,0),before=quantity(),hp=a.system.hp.base;try{CONFIG.Dice.randomUniform=()=>.805;const r=await item.use({variant:v.id,contextConfirmed:true});if(!game.runeterra.rules.success(r.result)||quantity()!==before+1||a.system.hp.base!==hp)throw Error('Fabrication joueur incorrecte');}finally{CONFIG.Dice.randomUniform=rng;}return ['Compte joueur propriétaire : jet et fabrication dans son inventaire, sans soin immédiat'];});
 if(errors.length)throw Error(errors.join('\n'));const report={checks:[...checks,...playerChecks],errors};fs.writeFileSync('test-results/ability-consequences.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
