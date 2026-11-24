import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const HOST = 'http://127.0.0.1:4388/';
const vite = spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4388','--strictPort'],{stdio:['ignore','pipe','pipe']});
let output='';
vite.stdout.on('data',chunk=>{output+=String(chunk);});
vite.stderr.on('data',chunk=>{output+=String(chunk);});
let browser;

async function waitForServer(){
  for(let i=0;i<100;i++){
    if(vite.exitCode!==null)throw new Error('Preview process exited: '+output);
    try{const r=await fetch(HOST);if(r.ok)return;}catch{}
    await new Promise(r=>setTimeout(r,150));
  }
  throw new Error('Production preview unavailable: '+output);
}
async function readSaved(page,id){
  return page.evaluate(async gameId=>{
    const db=await new Promise((resolve,reject)=>{
      const request=indexedDB.open('cardforge',1);
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    try{return await new Promise((resolve,reject)=>{
      const tx=db.transaction('sessions','readonly');
      const r=tx.objectStore('sessions').get(gameId);
      r.onsuccess=()=>resolve(r.result ?? null);
      r.onerror=()=>reject(r.error);
    });}finally{db.close();}
  },id);
}
async function waitSavedChanged(page,id,before){
  for(let i=0;i<100;i++){
    const current=await readSaved(page,id);
    if(current && JSON.stringify(current.state)!==JSON.stringify(before.state))return current;
    await new Promise(resolve=>setTimeout(resolve,75));
  }
  const notice=await page.locator(id==='gridcannon'?'.thunder-notice':'.grim-notice').allTextContents();
  throw new Error('No persisted engine transition after UI action: '+id+' / notice: '+notice.join(' | '));
}
async function interact(page,locator,mobile,key='Enter'){
  await locator.waitFor({state:'visible',timeout:15000});
  if(mobile)await locator.tap();
  else{
    // Keyboard activation does not auto-wait for enabled controls, unlike click/tap.
    // The real board starts disabled while its asynchronous IndexedDB lookup finishes.
    await locator.click({trial:true,timeout:15000});
    await locator.focus();
    await page.keyboard.press(key);
  }
}
async function ready(page){
  await page.locator('[data-offline-phase="ready"]').waitFor({timeout:30000}).catch(async()=>{
    await page.reload();
    await page.locator('[data-offline-phase="ready"]').waitFor({timeout:30000});
  });
  assert.equal(await page.evaluate(()=>!!navigator.serviceWorker.controller),true,'PWA must be controlled before offline claim');
  const probe=await page.evaluate(async()=>{
    const worker=navigator.serviceWorker.controller;
    return new Promise((resolve,reject)=>{
      const channel=new MessageChannel();
      const timeout=setTimeout(()=>reject(Error('SW probe timeout')),5000);
      channel.port1.onmessage=e=>{clearTimeout(timeout);resolve(e.data);};
      worker.postMessage({type:'CARDFORGE_CHECK_OFFLINE'},[channel.port2]);
    });
  });
  assert.equal(probe.ready,true,'full precache must be ready');
  assert.ok(probe.assetCount>=8);
  assert.match(probe.version,/^[a-f0-9]{8}$/);
  return probe;
}
const GAMES=[{id:'clear-the-dungeon',name:'Grim Delve',root:'.grim-board',actions:'.grim-hand button.grim-card',confirm:false},
 {id:'gridcannon',name:'Thunderfighter',root:'.thunder-board',actions:'.thunder-actions button',confirm:true},
 {id:'loot-the-loop',name:'Midnight Syndicate',root:'.ms-board',actions:'.ms-actions button',confirm:true}];

async function journey(locale,mobile){
  const context=await browser.newContext({
    locale:locale==='fr'?'fr-FR':'en-US',
    viewport:mobile?{width:390,height:844}:{width:1365,height:850},
    ...(mobile?{hasTouch:true,isMobile:true,deviceScaleFactor:2}:{}),
  });
  // Persist the choice before React renders, but exercise the visible locale selector too.
  await context.addInitScript(chosen=>{
    if(location.origin==='http://127.0.0.1:4388')
      localStorage.setItem('cardforge.language.v1',chosen);
  },locale);
  const page=await context.newPage();
  const label=locale+(mobile?'/touch':'/keyboard');
  try{
    await page.goto(HOST);
    const probe=await ready(page);
    const select=page.locator('.topbar-actions select');
    await select.selectOption(locale);
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    assert.equal(await page.getByRole('heading',{name:'Choisissez votre univers'}).count(),locale==='fr'?1:0);
    assert.equal(await page.getByRole('heading',{name:'Choose your universe'}).count(),locale==='en'?1:0);
    if(!mobile){
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement?.tagName!=='BODY'),true,'Tab must activate a focusable control');
    }
    const saved={};
    for(const game of GAMES){
      await page.goto(HOST);
      const card=page.locator('.game-card').filter({has:page.getByRole('heading',{name:game.name})});
      await interact(page,card.getByRole('button'),mobile,'Enter');
      await interact(page,page.locator('.context-actions button.primary-action').first(),mobile,'Space');
      await page.locator('.learning-intro').waitFor({state:'visible',timeout:15000});
      await interact(page,page.locator('.learning-intro button.secondary-action').first(),mobile);
      await page.locator(game.root).waitFor({state:'visible',timeout:20000});
      const first=page.locator(game.root+' button.primary-action').filter({hasText:/Commencer une partie|Start a game|Start playing/}).first();
      await interact(page,first,mobile);
      await page.locator(game.actions).first().waitFor({state:'visible',timeout:15000}).catch(async error=>{
        const diagnostic=await page.evaluate(()=>({
          url:location.href,
          thunderNotice:document.querySelector('.thunder-notice')?.textContent,
          grimNotice:document.querySelector('.grim-notice')?.textContent,
          thunderMetrics:document.querySelector('.thunder-metrics')?.textContent,
          startButtons:[...document.querySelectorAll('button.primary-action')].map(b=>b.textContent?.trim()),
          visibleActions:document.querySelectorAll('.thunder-actions button').length,
          intro:document.querySelector('.learning-intro')?.textContent,
          mode:document.querySelector('.learning-mode')?.textContent,
        }));
        throw new Error('No executable UI actions for '+game.name+': '+JSON.stringify(diagnostic),{cause:error});
      });
      const before=await readSaved(page,game.id);
      assert.ok(before,'start must persist '+game.name);
      if(game.id==='loot-the-loop'){
        assert.equal(await page.locator('.ms-top .ms-hidden').count(),2);
        await interact(page,page.locator(game.actions).first(),mobile);
        assert.deepEqual(await readSaved(page,game.id),before);
        await interact(page,page.locator('.ms-confirm button.secondary-action'),mobile);
        assert.deepEqual(await readSaved(page,game.id),before);
        await interact(page,page.locator(game.actions).first(),mobile);
        await interact(page,page.locator('.ms-confirm button.primary-action'),mobile);
      }else if(game.confirm){
        await interact(page,page.locator(game.actions).first(),mobile);
        await page.locator('.thunder-confirm').waitFor({state:'visible'});
        const onCancel=await readSaved(page,game.id);
        assert.deepEqual(onCancel,before,'Thunderfighter preview must not write');
        await interact(page,page.locator('.thunder-confirm button.back-link'),mobile);
        assert.deepEqual(await readSaved(page,game.id),before,'cancel must not write');
        await interact(page,page.locator(game.actions).first(),mobile);
        await interact(page,page.locator('.thunder-confirm button.primary-action'),mobile);
      }else{
        await interact(page,page.locator(game.actions).first(),mobile);
        await page.locator('.grim-actions button.secondary-action').first().waitFor({state:'visible'});
        // A real discard asks for confirmation; Playwright dismisses dialogs by default.
        // First verify cancellation cannot alter the save, then explicitly confirm the damage.
        page.once('dialog',dialog=>void dialog.dismiss());
        await interact(page,page.locator('.grim-actions button.secondary-action').filter({hasText:/Défausser|Discard/}).first(),mobile);
        assert.deepEqual(await readSaved(page,game.id),before,'discard cancellation must preserve the saved state');
        page.once('dialog',dialog=>void dialog.accept());
        await interact(page,page.locator('.grim-actions button.secondary-action').filter({hasText:/Défausser|Discard/}).first(),mobile);
      }
      const after=await waitSavedChanged(page,game.id,before);
      assert.ok(after,'action must leave a saved game');
      assert.notDeepEqual(after.state,before.state,'UI action must persist a different real-engine state for '+game.name);
      saved[game.id]=after;
      if(game.id==='loot-the-loop'){
        assert.deepEqual(after.state.deck.map(c=>c.id),before.state.deck.map(c=>c.id));
        assert.ok(after.state.deck.slice(0,2).every(c=>c.faceUp));
        await page.locator('.ms-board').getByText(/Action enregistrée|Action saved/).waitFor();
        await select.selectOption(locale==='fr'?'en':'fr');
        assert.equal(await page.locator('html').getAttribute('lang'),locale==='fr'?'en':'fr');
        assert.deepEqual(await readSaved(page,game.id),after,'switching language must not alter game state');
        await select.selectOption(locale);
      }
      await page.goto(HOST+'#game/'+game.id+'/rules');
      await page.getByRole('heading',{name:/Règles et mécanismes|Rules and mechanics/}).waitFor();
      assert.equal(await page.locator('html').getAttribute('lang'),locale);
    }
    await page.close();
    await context.setOffline(true);
    const offline=await context.newPage();
    const browserErrors=[];
    offline.on('requestfailed',request=>browserErrors.push('request '+request.url()+': '+request.failure()?.errorText));
    offline.on('pageerror',error=>browserErrors.push('page '+error.message));
    offline.on('console',message=>{if(message.type()==='error')browserErrors.push('console '+message.text());});
    try{
      await offline.goto(HOST,{waitUntil:'domcontentloaded',timeout:15000});
      await offline.locator('[data-offline-phase="ready"]').waitFor({timeout:20000}).catch(async error=>{
        const diagnostic=await offline.evaluate(async()=>{
          const scripts=[...document.scripts].map(x=>({url:x.src,type:x.type}));
          const keys=await caches.keys();
          const cached=await Promise.all(scripts.filter(x=>x.url).map(async item=>({
            url:item.url,match:!!(await caches.match(item.url)),
          })));
          return {
            controller:!!navigator.serviceWorker?.controller,
            online:navigator.onLine,
            visiblePhase:document.querySelector('[data-offline-phase]')?.getAttribute('data-offline-phase') ?? null,
            root:document.querySelector('#root')?.textContent?.slice(0,120)??null,
            scripts,cached,cacheKeys:keys,
          };
        });
        throw new Error('Offline cold restart did not become ready: '+JSON.stringify({diagnostic,browserErrors}),{cause:error});
      });
      await offline.locator('.offline-readiness small').getByText(locale==='fr'?'Hors connexion':'Offline',{exact:true}).waitFor();
      for(const game of GAMES){
        await offline.goto(HOST+'#game/'+game.id+'/board',{waitUntil:'domcontentloaded',timeout:15000});
        await offline.locator(game.root).waitFor({state:'visible',timeout:15000});
        const restored=await readSaved(offline,game.id);
        assert.deepEqual(restored,saved[game.id],game.name+' must survive offline cold tab reopen without shuffling');
        await offline.getByText(/Partie locale restaurée|Partie restaurée sans remélange|Partie reprise · sauvegarde locale|Game resumed · local save|Game restored|restored without/).first().waitFor({timeout:10000});
        await offline.goto(HOST+'#game/'+game.id+'/rules',{waitUntil:'domcontentloaded'});
        await offline.getByRole('heading',{name:/Règles et mécanismes|Rules and mechanics/}).waitFor();
      }
      assert.equal(await offline.locator('html').getAttribute('lang'),locale);
      // Mobile browser uses real touch events, no desktop-only hover action.
      await offline.goto(HOST+'#game/loot-the-loop/board',{waitUntil:'domcontentloaded'});
      await offline.locator('.ms-board .ms-top').waitFor();
      const msScreen=await offline.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(msScreen.scroll<=msScreen.width+4,JSON.stringify({label,msScreen}));
      const screen=await offline.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(screen.scroll<=screen.width+4,JSON.stringify({label,screen}));
      console.log('CAR-42 production:',label,'three games played and resumed offline, rules and localization verified; cache '+probe.version);
    }finally{await offline.close();}
  }finally{await context.close();}
}
try{
  await waitForServer();
  browser=await chromium.launch({headless:true});
  for(const locale of ['fr','en'])
    for(const mobile of [false,true])
      await journey(locale,mobile);
  console.log('CAR-42 PRODUCTION E2E PASS — FR/EN desktop keyboard and touch-emulated mobile, three games, offline service worker.');
}finally{
  if(browser)await browser.close();
  vite.kill('SIGTERM');
}
