// One-time source extraction. Normal builds read the resulting, committed JSON.
import fs from 'node:fs';
const text=fs.readFileSync('.private-sources/pregens.txt','utf8').replaceAll('\r','').replace(/[\v\f]/g,'\n');
const names={eliora:'ELIORA',joel:'JOËL',kaelor:'KAËLOR',klaus:'KLAUS',lianne:'LIANNE',regan:'REGAN',wako:'WAKO',will:'WILL'},definitions={};
const heads=[...text.matchAll(/^(ELIORA|JOËL(?: \(ET ELLEN\))?|KAËLOR|KLAUS|LIANNE|REGAN|WAKO|WILL)\s*:/gm)];
for(const [key,name] of Object.entries(names)){
 const index=heads.findIndex(h=>h[1].startsWith(name)),block=text.slice(heads[index].index,heads[index+1]?.index||text.length),slots=[...block.matchAll(/^\s*(P|[123]|U)\.\s*([^\n]+)/gm)];
 definitions[key]={biography:block.slice(0,slots[0].index).trim(),skills:[],passive:null};
 for(const [i,slot] of slots.entries()){const colon=slot[2].indexOf(':'),title=colon<0?'Métaniphénédream':slot[2].slice(0,colon).trim(),body=(colon<0?slot[2]:slot[2].slice(colon+1))+'\n'+block.slice(slot.index+slot[0].length,slots[i+1]?.index||block.length);const entry={slot:slot[1],name:title,description:body.trim()};if(entry.slot==='P')definitions[key].passive=entry;else definitions[key].skills.push(entry);}
 if(definitions[key].skills.map(s=>s.slot).join(',')!=='1,2,3,U')throw Error(key+' : source mal séparée');
}
fs.writeFileSync('content/ability-definitions.json',JSON.stringify({source:'PERSONNAGES PRÉTIRÉS — document Drive fourni',controlCharacters:'Retours verticaux et sauts de page normalisés avant séparation des compétences.',actors:definitions},null,2));
const people=fs.readFileSync('.private-sources/1_9OefmonPRnBrSze003OcGg_C452F7hWVIEA4B0js1k.txt','utf8').replaceAll('\r','').replace(/[\v\f]/g,'\n');
const a=JSON.parse(fs.readFileSync('content/adventure.json')).documents[0],origins={};
function put(keys,species,subspecies,region,appearance,reason,subtypeLabel='') {for(const key of keys.split(',')){const actor=a.actors.find(a=>a.flags['le-rituel-du-marecage'].key===key);origins[key]={species,subspecies,region,appearance,reason,subtypeLabel,legacy:{species:actor.system.species??'human',subspecies:actor.system.subspecies??'',region:actor.system.region??'',appearance:actor.system.appearance??'',morphology:actor.system.morphology??'',environment:actor.system.environment??''}};}}
put('eliora','human','bornMage','ionia','Humaine muette, télépathe.','Humaine née avec sa magie, élevée dans un monastère d’Ionia : texte source explicite.');
put('joel','human','','demacia','Ancien menuisier demacien.','Demacien sans pouvoir selon le texte source.');
put('ellen','human','bornMage','demacia','Fille adoptive de Joël, 13 ans.','Née en Demacia et magie manifestée dans l’enfance : source.');
put('kaelor','vastaya','','piltover','Vastaya aux traits de loup.','Vastaya loup élevé à Piltover : source. Aucune tribu lupine dans les choix natifs du système ; pas d’hybridation inventée.','Non répertoriée — Vastaya loup');
put('klaus','human','','noxus','Très petite taille ; pilote du Hexotech.','Humain selon sa déclaration source, commandant à Noxus ; ambiguïté de son apparence conservée.');
put('lianne','yordle','common','bandle','Yordle de Bandle, amis imaginaires.','Yordle de Bandle à magie active et tempérament fantasque : commun selon les règles du système.');
put('regan','human','altered','zaun','Humain altéré par le Shimmer ; griffe Chemic-O-Spike.','Humain enfant du Shimmer : source. Zaun retenue par cohérence avec le Shimmer ; origine géographique non explicitée dans sa biographie, adaptation.');
put('wako','vastaya','ondrashi','ionia','Vastaya caprin, disciple d’Onno.','Bouc ionien : source ; Wako est explicitement cité comme exemple Ondrashi dans le compendium de création du système.');
put('will','human','','bilgewater','Humain navigateur lié à Huul.','Humain de Bilgewater : source. Un lien spirituel ne suffit pas à établir une naissance mage.');
put('toadrick','vastaya','','ixtal','Vastaya reptile aux traits de tortue.','Vastaya tortue : source. Ixtal retenue comme lieu de vie ; aucune tribu native ne correspond sans supposer de métamorphose.','Non répertoriée — tortue');
put('teekaya','vastaya','','ixtal','Vastaya d’une tribu côtière, guide des marais.','Vastaya de tribu côtière : source. Tribu non nommée ; Ixtal est son territoire de guide, adaptation de résidence.','Tribu côtière non précisée');
put('riva','vastaya','marai','ixtal','Vastaya Marai aquatique.','Marai explicitement nommée. Marais d’Ixtal retenus comme résidence, naissance non précisée.');
put('azucena','vastaya','nirask','ixtal','Vastaya porc-épic/hérisson, archère.','Traits de rongeur correspondant aux Nirask du système. Ixtal retenue comme territoire, adaptation de résidence.');
put('brik,brak','yordle','common','bandle','Yordle voyageur, magie Bandle active.','Origine Bandle et magie Yordle : source ; catégorie commune selon leurs descriptions.');
put('camille','human','','zaun','Scientifique zaunienne transférée à Noxus.','Origine Zaun explicite : ne pas confondre avec son affectation noxienne.');
put('mariane,soldat-noxien','human','','noxus','Membre de l’escouade noxienne.','Affiliation noxienne source ; origine Noxus et espèce humaine retenues pour cette escouade, adaptation.');
put('gobi','human','altered','piltover','Gabriel, homme transformé progressivement en poisson.','Piltovien puis altéré par le contrat de Barry : source.');
put('barry','human','altered','bilgewater','Humain maudit aux traits de crapaud.','Humain de Bilgewater transformé par une malédiction : source.');
put('malek','human','bornMage','shurima','Sorcier, aiguilles et corps marqué par sa captivité.','Shurima explicite ; don découvert naturellement, mage né retenu comme interprétation du système.');
put('dorovik','human','','freljord','Dresseur de bêtes du Freljord.','Freljord explicitement indiqué ; humain retenu depuis le portrait, adaptation.');
put('willburn','human','altered','bilgewater','Capitaine malade et marqué par Ga’Hun.','Bilgewater est son port d’attache ; altération physique persistante après son combat, adaptation.');
put('diz,pete,obrill','human','','bilgewater','Pirate du Flot Persistant.','Port d’attache Bilgewater de leur équipage ; humain depuis les portraits. Naissance non explicitée, adaptation.');
put('luis,tania','human','','ixtal','Habitant d’Omatqan.','Lieu de vie source à Omatqan ; origine Ixtal et humain retenus, adaptation.');
put('guyamtel,wern,xandor','human','','bilgewater','Habitant ou commerçant d’Harelport.','Harelport/Bilgewater retenus comme résidence ; espèce et origine non détaillées, adaptation.');
put('marchand-ionien','human','','ionia','Marchand ionien.','Appellation source ionienne ; humain retenu pour le marchand, adaptation.');
put('blake,braconnier','human','','','Braconnier venu exploiter Ixtal.','Espèce humaine retenue depuis les portraits ; aucune origine explicitée. Ne pas confondre terrain de chasse et origine.');
put('anna,ygritte,taoxana,taoxana-vision','','','','Démon Taoxana ou l’une de ses deux apparences humaines.','Démon sans catégorie native. Freljord est seulement la couverture annoncée par Anna et Ygritte ; leur véritable origine reste inconnue.','Démon — hors des sous-espèces jouables');
put('tahm-kench','','','bilgewater','Démon aquatique.','Démon sans catégorie native ; Bilgewater retenue comme lieu d’activité, adaptation.','Démon — hors des sous-espèces jouables');
for(const actor of a.actors.filter(a=>a.type==='creature'))put(actor.flags['le-rituel-du-marecage'].key,'','','ixtal',actor.name,'Faune de l’aventure dans les marais d’Ixtal ; catégories jouables inapplicables.','Sans objet — créature');
put('navire','','','bilgewater','Navire Le Flot Persistant.','Port d’attache Bilgewater ; espèces et sous-espèces inapplicables.','Sans objet — véhicule');
if(Object.keys(origins).length!==a.actors.length)throw Error('Origines non auditées');
const headings={luis:'LUIS',toadrick:'TOADRICK',diz:'DIZ TORENNO ET PETE',pete:'DIZ TORENNO ET PETE',anna:'ANNA ET YGRITTE',ygritte:'ANNA ET YGRITTE',taoxana:'TAOXANA','taoxana-vision':'TAOXANA',teekaya:'TEEKAYA',blake:'BLAKE',brik:'BRIK ET BRAK',brak:'BRIK ET BRAK',azucena:'AZUCENA',riva:'RIVA (MARAI)',mariane:'MARIANE',camille:'CAMILLE',gobi:'LE GOBI',barry:'BARRY L’USURPATEUR','tahm-kench':'TAHM KENCH',malek:'MALEK',willburn:'WILLBURN',obrill:'OBRILL',dorovik:'DOROVIK'};
const sections=[...people.matchAll(/^([A-ZÀ-Ÿ][A-ZÀ-Ÿ’'’\d ()/—–-]+)\s*:\s*$/gm)];
for(const [key,heading] of Object.entries(headings)){const index=sections.findIndex(s=>s[1].trim()===heading);if(index<0)throw Error('Biographie source '+heading);origins[key].biography=people.slice(sections[index].index+sections[index][0].length,sections[index+1]?.index||people.length).trim().replace(/\n_+[\s\S]*$/,'');}
fs.writeFileSync('content/actor-origins.json',JSON.stringify({systemVersion:'0.8.0',revision:'0.1.1',policy:'Clés natives uniquement. Une valeur vide est explicitement affichée comme non précisée, non répertoriée ou sans objet. Les inférences de résidence ne sont pas présentées comme des naissances établies.',actors:origins},null,2));
console.log('Sources : huit blocs 1/2/3/U séparés ; '+Object.keys(origins).length+' origines auditées.');
