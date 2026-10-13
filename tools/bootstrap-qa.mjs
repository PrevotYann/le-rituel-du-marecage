import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true}),page=await browser.newPage();
page.on('pageerror',e=>console.log('PAGEERROR',e.message));await page.goto('http://localhost:30016',{waitUntil:'networkidle'});console.log('PAGE',await page.title());
console.log((await page.locator('body').innerText()).slice(0,2500));
if(await page.locator('[name="username"]').count()){await page.locator('[name="username"]').fill('Gamemaster');await page.locator('button[name="join"]').click();await page.waitForFunction(()=>game.ready,{timeout:60000});console.log('READY',await page.evaluate(()=>({version:game.version,packs:[...game.packs.keys()],modules:[...game.modules.keys()]})));await page.evaluate(async()=>{await game.settings.set('core','moduleConfiguration',{'le-rituel-du-marecage':true});});console.log('ENABLED');}
await browser.close();
