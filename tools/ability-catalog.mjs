// Explicit, isolated profiles: selecting one variant never inherits another one's effect.
const component=(formula='0',type='physical')=>({formula,type,penetration:0,penetrating:false});
export function variant(id,label,attribute,overrides={}) {
 const v={id,label,attribute,alternateAttribute:attribute,damageFormula:'0',damageType:'physical',healFormula:'0',components:[component()],modifications:[],associatedEffects:[],dot:{kind:'bleeding',level:0,elapsed:0,lost:0},targetMode:'targets',duration:0,area:0,conditions:'Choisir cette action, vérifier ses conditions et les cibles avant le jet.',...overrides};
 if(overrides.damageFormula&&!overrides.components)v.components=[component(overrides.damageFormula,overrides.damageType||'physical')];
 return v;
}
const v=variant,action=(kind,more={})=>({kind,...more}),rm=(value=10)=>[{resistance:'magicResistance',value,condition:'Bouclier local ; durée proposée : un round du système (30 s), à confirmer.'}],status=id=>[{status:id,condition:'Effet à confirmer sur les cibles choisies.'}];
export const catalog={
 eliora:{
  '1':[v('boost','Renforcer un attribut allié (+10)','first',{rituel:action('targetBonus',{choice:true,amount:10}),duration:30}),v('rm','Protection en méditation (+10 RM)','second',{associatedEffects:rm(),duration:30,conditions:'Eliora médite ; choisir les alliés protégés.'})],
  '2':[v('read','Ressentir une émotion','first'),v('send','Transmettre une émotion vécue','second',{conditions:'Choisir une émotion réellement vécue ; le MJ fixe le malus si elle ne l’est pas.'})],
  '3':[v('weaken','Affaiblir l’attaque d’un ennemi','first',{conditions:'Le montant de réduction n’est pas chiffré dans la source ; décision MJ après le jet, pas de réduction automatique inventée.'}),v('vulnerability','Repérer une zone vulnérable (+10 au prochain jet)','second',{rituel:action('contextReward',{amount:10}),conditions:'Le MJ confirme la zone vulnérable ; +10 au prochain jet visant cette zone, pas +10 dégâts automatiques.'})],
  'U':[v('command','Prononcer un ordre en Amaretsu','first',{associatedEffects:status('charmed'),conditions:'Préciser le mot et les auditeurs. Le MJ décide de la possession narrative ; Charmé est le marqueur natif retirable.'})]
 },
 joel:{
  '1':[v('encourage','Planifier avec Paternité ; Communication si échec','first',{rituel:action('retryBonus',{attribute:'second',choice:true,amount:10}),duration:30,conditions:'Si Paternité échoue, lancer Communication ; seul ce second jet réussi donne +10 à un attribut allié.'})],
  '2':[v('vibration','Vibration : traverser la matière et infliger 15 DB','first',{damageFormula:'15',damageType:'brut',conditions:'Ellen agit sous la direction de Joël ; choisir la cible.'}),v('mental','Choc mental : déstabiliser / paralyser','first',{associatedEffects:status('paralyzed'),conditions:'La cible voit Ellen. Joël est immunisé à son Choc mental ; ne pas le choisir comme cible.'})],
  '3':[v('exchange','Intervertir deux attributs pour la prochaine action','second',{rituel:action('exchange'),conditions:'Choisir Force/Discrétion ou Intimidation/Agilité. Effet local pendant la prochaine action seulement.'}),v('protect','S’interposer pour protéger Ellen','first',{conditions:'Effet Délivrance narratif : Joël se précipite auprès d’Ellen. Le MJ résout l’attaque selon le système, sans réduction chiffrée inventée.'})],
  'U':[v('zone','Vibration mentale : 15 DB et paralysie de zone','first',{damageFormula:'15',damageType:'brut',associatedEffects:status('paralyzed'),area:3,rituel:action('joelUltimate'),conditions:'Choisir les victimes ; Joël peut libérer ses alliés avec Communication. Un échec de son contrôle rend Ellen inconsciente.'})]
 },
 kaelor:{
  '1':[v('scout','Invoquer le Carapateur en reconnaissance','first',{rituel:action('companion',{key:'carapateur-compagnon'})}),v('bulb','Extraire un bulbe de soin (+15 PV)','second',{rituel:action('rewardItem',{reward:'bulb'}),conditions:'Le Carapateur est disponible. Une réussite crée un bulbe à consommer dans l’inventaire ; aucun soin au moment de l’extraction.'})],
  '2':[v('attack','Guetteuse : serres, 10 DP','first',{damageFormula:'10',damageType:'physical'}),v('protect','Guetteuse : parade magique, +10 RM','first',{associatedEffects:rm(),duration:30}),v('fear','Guetteuse : effrayer pendant la nuit','first',{associatedEffects:status('fear'),conditions:'Nuit seulement ; cible capable de percevoir la Guetteuse.'})],
  '3':[v('capture','Capturer une créature apaisée dans le Vivarium','second',{rituel:action('capture'),conditions:'Cibler une créature apaisée et capturable ; le MJ confirme cette condition.'}),v('tame','Apprivoiser une créature du Vivarium','first',{rituel:action('tame'),conditions:'Créature déjà dans le Vivarium ; dressage décidé avec le MJ.'})],
  'U':[v('call','Appeler la faune environnante','first',{conditions:'La présence, le nombre et les actions des créatures sont décidés par le MJ selon le résultat ; aucune armée créée automatiquement.'})]
 },
 klaus:{
  '1':[v('strike','Fléau-Fist : frapper, 20 DP','first',{damageFormula:'20',damageType:'physical',conditions:'Klaus pilote le Hexotech. Dégâts 20 DP : adaptation chiffrée, absente de la source.'}),v('restrain','Fléau-Fist : immobiliser une cible','first',{associatedEffects:status('restrained'),conditions:'Klaus pilote le Hexotech ; bonne réussite et prise possible à confirmer par le MJ.'})],
  '2':[v('bomb','Fabriquer une bombe instable de 10 DM','second',{rituel:action('rewardItem',{reward:'bomb'}),conditions:'Une réussite crée une bombe à usage unique dans l’inventaire ; sa détonation est une action distincte.'})],
  '3':[v('craft','Renforcer une arme : +10 DM à sa prochaine utilisation','second',{rituel:action('weaponBonus',{amount:10}),conditions:'Choisir une arme embarquée ; bonus temporaire retiré après sa prochaine utilisation.'}),v('repair','Réparer un mécanisme ou équipement','second',{rituel:action('repair'),conditions:'Choisir l’équipement endommagé ; réparation native sans restauration de pertes permanentes.'}),v('rm','Renforcer le Hexotech : +10 RM','first',{associatedEffects:rm(),duration:30})],
  'U':[v('iem','Sortir du Hexotech puis décharge I.E.M. : 60 DM','first',{damageFormula:'60',damageType:'magic',area:3,conditions:'Klaus sort de l’armure ; choisir les cibles dans la zone, y compris les alliés exposés.'})]
 },
 lianne:{
  '1':[v('laugh','Chatouille : provoquer un fou rire','second',{associatedEffects:status('restrained'),conditions:'Fou rire contrôlé par Magie Yordle ; poursuivre les contrôles de Démence avec le MJ. Entravé est le marqueur natif adapté.'})],
  '2':[v('steal','Chapardeur : téléporter un petit objet visible','second',{rituel:action('steal'),conditions:'Objet proche, visible et transportable ; choisir l’objet et son propriétaire, avec permission MJ pour un transfert.'})],
  '3':[v('bubble','Créer Chamallow : Magie Yordle puis Démence','second',{rituel:action('lianneShield',{followup:'first'}),conditions:'La création est suivie d’un contrôle de Démence. Si ce contrôle échoue : passif et 20 DM contre Lianne ; aucun bouclier attribué.'}),v('maintain','Maintenir Chamallow avec Démence','first',{rituel:action('lianneShield'),conditions:'Bulle déjà active ; échec : perte du bouclier, passif et 20 DM contre Lianne.'})],
  'U':[v('imagine','Créer un compagnon imaginaire selon le besoin','second',{conditions:'Préciser le désir et l’action. Une action importante appelle un contrôle de Démence (attribut spécial 1) ; l’effet reste une décision MJ.'})]
 },
 regan:{
  '1':[v('force','Synthexine : Force +10','second',{rituel:action('selfBonus',{modifications:[{attribute:'force',value:10}]}),duration:30}),v('reflexes','Synthexine : Réflexes +10','first',{rituel:action('selfBonus',{modifications:[{attribute:'reflexes',value:10}]}),duration:30})],
  '2':[v('focus','Métaniphénédream : Perception et Concentration +10','first',{rituel:action('selfBonus',{modifications:[{attribute:'perception',value:10},{attribute:'concentration',value:10}]}),duration:30,conditions:'La source ne chiffre pas la durée : un round de 30 s est proposé, réglable par le MJ.'})],
  '3':[v('poison','Hématoxine : infecter une cible','second',{dot:{kind:'poison',level:1,elapsed:0,lost:0},conditions:'Contact avec le mélange infecté ; niveau 1 de poison proposé, la source ne chiffre pas son niveau.'})],
  'U':[v('experiment','Substance expérimentale : attributs à 100','first',{rituel:action('selfOverride',{value:100}),duration:30,conditions:'Un round de 30 s proposé ; l’ultime peut échouer au jet de Métabolisme. Les bases permanentes ne sont pas modifiées.'})]
 },
 wako:{
  '1':[v('physical','Danse Fluide : esquiver une attaque physique','first',{rituel:action('defense',{type:'physical'}),conditions:'Une attaque physique arrive ; réussite = esquive, jet ≤ moitié du seuil = renvoi à son lanceur. Aucun soin.'}),v('magic','Danse Fluide : esquiver une attaque magique','first',{rituel:action('defense',{type:'magic'}),conditions:'Une attaque magique arrive ; réussite = esquive, jet ≤ moitié du seuil = renvoi à son lanceur. Aucun soin.'})],
  '2':[v('heal','Transformer l’eau en une potion de +10 PV','first',{rituel:action('rewardItem',{reward:'onno-potion'}),conditions:'Eau et récipient disponibles. Une réussite crée une potion dans l’inventaire ; elle soigne seulement lorsqu’elle est consommée.'}),v('poison','Transformer l’eau en une dose de poison niveau 2','second',{rituel:action('rewardItem',{reward:'onno-poison'}),conditions:'Eau et récipient disponibles. Une réussite ajoute une dose dans l’inventaire ; elle n’empoisonne pas une cible pendant sa création.'})],
  '3':[v('traps','Reconnaître et déjouer un petit ou moyen piège','first',{conditions:'Piège accessible ; le MJ confirme sa difficulté et les conséquences du jet.'}),v('reflexes','Anticiper une intention hostile : Réflexes +10','second',{rituel:action('selfBonus',{modifications:[{attribute:'reflexes',value:10}]}),duration:30})],
  'U':[v('rain-heal','Pluie de soins : +20 PV aux cibles','first',{healFormula:'20',area:3}),v('rain-poison','Pluie de poison niveau 2','second',{dot:{kind:'poison',level:2,elapsed:0,lost:0},area:3})]
 },
 will:{
  '1':[v('physical','Ressentir une faiblesse physique','second'),v('mental','Ressentir une faiblesse psychologique','second')],
  '2':[v('taunt','Attirer l’attention vers Will','second',{conditions:'Provocation narrative décidée avec le MJ, sans imposer une action sociale par algorithme.'}),v('fear','Transmettre la terreur de Huul','first',{associatedEffects:status('fear')})],
  '3':[v('predict','Demander à Huul une action future possible','first',{conditions:'Le MJ révèle une prémonition adaptée au résultat ; aucune lecture automatique de journaux secrets.'})],
  'U':[v('secret','Demander à Huul un secret précieux','first',{conditions:'Le MJ choisit l’information révélée sur la personne désignée selon le résultat.'})]
 }
};
