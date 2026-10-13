import fs from 'node:fs';
import path from 'node:path';
const data=path.resolve('.qa');
fs.mkdirSync(data+'/Config',{recursive:true});
fs.copyFileSync(process.env.FOUNDRY_LICENSE_FILE||'C:/Users/yannp/AppData/Local/FoundryVTT/Config/license.json',data+'/Config/license.json');
fs.writeFileSync(data+'/Config/options.json',JSON.stringify({dataPath:data,port:30016,upnp:false,telemetry:false,language:'fr',world:'rituel-qa'}));
fs.mkdirSync(data+'/Data/systems',{recursive:true});fs.mkdirSync(data+'/Data/modules',{recursive:true});fs.mkdirSync(data+'/Data/worlds/rituel-qa',{recursive:true});
const qaSystem=data+'/Data/systems/jdr-runeterra',sourceSystem=process.env.RUNETERRA_PATH||'C:/git/jdr-runeterra';
if(!fs.existsSync(qaSystem)){fs.mkdirSync(qaSystem,{recursive:true});for(const name of ['system.json','scripts','styles','templates','lang','assets','packs'])fs.cpSync(sourceSystem+'/'+name,qaSystem+'/'+name,{recursive:true});}
fs.mkdirSync(qaSystem+'/content',{recursive:true});fs.copyFileSync(sourceSystem+'/content/asset-map.json',qaSystem+'/content/asset-map.json');
const link=data+'/Data/modules/le-rituel-du-marecage';if(!fs.existsSync(link))fs.symlinkSync(process.cwd(),link,'junction');
fs.writeFileSync(data+'/Data/worlds/rituel-qa/world.json',JSON.stringify({id:'rituel-qa',title:'Validation isolée — Le Rituel',system:'jdr-runeterra',coreVersion:'14.368',systemVersion:'0.8.0',compatibility:{minimum:'14',verified:'14.368'},description:'Monde vierge de validation temporaire.'}));
console.log('QA isolée, port 30016, aucun monde utilisateur modifié.');
