import {chromium} from 'playwright';
const browser=await chromium.launch(),page=await browser.newPage();
page.on('pageerror',e=>console.log('ERROR',e.message));
page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text());});
try{
 await page.goto('http://localhost:30016');await page.locator('[name="username"]').fill('Gamemaster');await page.locator('button[name="join"]').click();await page.waitForFunction(()=>globalThis.game?.ready,null,{timeout:60000});
 console.log(JSON.stringify(await page.evaluate(async()=>{await game.babele.init();return {language:game.i18n.lang,modules:game.modules.filter(m=>m.active).map(m=>m.id),cache:game.babele.cacheDiagnostics(),sources:await game.babele.sourceDiagnostics(),mapping:game.babele.inspectMapping?.('Adventure'),pack:game.babele.translatedCompendiumFor('le-rituel-du-marecage.adventure')?.name};}),null,2));
}finally{await browser.close();}
