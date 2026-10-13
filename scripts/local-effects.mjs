import {MID,authority,world} from './importer.mjs';
import {chooseAbility} from './ability-actions.mjs';
export async function syncArmature(item){if(item.getFlag(MID,'key')!=='armature'||!item.actor||game.users.activeGM?.id!==game.user.id)return;const actor=item.actor,effect=actor.effects.find(e=>e.getFlag(MID,'armature')===item.id),active=item.system.equipped&&!item.system.broken;if(!active&&effect)await effect.delete();else if(active&&!effect)await actor.createEmbeddedDocuments('ActiveEffect',[{name:'Armature — contrainte magique',changes:[{key:'system.magicResistance.persistent',mode:CONST.ACTIVE_EFFECT_MODES.ADD,value:'-10'}],flags:{[MID]:{armature:item.id,local:true}}}]);}
export async function contextualAbility(item){if(!item?.actor)throw Error('Capacité embarquée requise.');return chooseAbility(item);}
Hooks.on('updateItem',item=>syncArmature(item));Hooks.on('createItem',item=>syncArmature(item));
