import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { openFreshPreview } from './open-fresh-preview.mjs';

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
async function installSkydeckFixture(page, save, outcome){
  const target=outcome==='win'?'hearts-9':'hearts-13';
  const hand=['hearts-4','hearts-5','clubs-2','spades-3'];
  const old=save.state;
  const ids=[...old.playerDeck,...old.enemyDeck,...old.enemyLine.filter(Boolean),...old.hand,...old.discard,...old.enemyCapture];
  const state={...old,round:2,phase:'capture',outcome:'in-progress',hand,enemyDeck:[],enemyLine:[target,null,null,null],playerDeck:ids.filter(id=>id!==target&&!hand.includes(id)),discard:[],enemyCapture:[]};
  const fixture={...save,sessionId:save.sessionId+'-'+outcome,state};
  await page.evaluate(async fixture=>{
    const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('cardforge',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    try{await new Promise((resolve,reject)=>{const tx=db.transaction('sessions','readwrite');tx.objectStore('sessions').put(fixture);tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});}finally{db.close();}
  },fixture);
  await page.reload();
  await page.locator('.sd-resumed').waitFor();
  return fixture;
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
  await page.locator('[data-offline-phase="ready"]').waitFor({state:"attached",timeout:30000}).catch(async()=>{
    await page.reload();
    await page.locator('[data-offline-phase="ready"]').waitFor({state:"attached",timeout:30000});
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
 {id:'gridcannon',name:'Thunderfighter',root:'.thunder-board',actions:'.tf-target, .thunder-actions button.secondary-action',confirm:true},
 {id:'loot-the-loop',name:'Midnight Syndicate',root:'.ms-board',actions:'.ms-actions button',confirm:true}];

async function stalePreviewRecovery(){
 const context=await browser.newContext();
 try{
  const page=await context.newPage();
  // Install a deliberately stale worker on the same origin which serves the old launcher.
  writeFileSync('dist/legacy-preview-worker.js', `self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(e.request.mode==='navigate')e.respondWith(new Response('<html><body>OLD LAUNCHER</body></html>',{headers:{'Content-Type':'text/html'}}));});`);
  // Seed an ordinary same-origin page without running the real app registration.
  await page.route(HOST,route=>route.fulfill({contentType:'text/html',body:'<html><body>seed</body></html>'}));
  await page.goto(HOST);
  await page.evaluate(async()=>{await navigator.serviceWorker.register('/legacy-preview-worker.js');await navigator.serviceWorker.ready;});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await page.unroute(HOST);
  await page.reload();
  await page.getByText('OLD LAUNCHER').waitFor();
  await page.evaluate(()=>localStorage.setItem('preview-preserve','yes'));
  const version=readFileSync('dist/sw.js','utf8').match(/const CACHE_NAME = PREFIX [+] "([a-f0-9]{8})";/)?.[1];
  assert.ok(version);
  await openFreshPreview(context,page,HOST,version);
  assert.equal(await page.evaluate(()=>localStorage.getItem('preview-preserve')),'yes');
  await context.setOffline(true);
  await page.reload();await page.locator('.forge-gallery').waitFor();
 }finally{await context.close();rmSync('dist/legacy-preview-worker.js',{force:true});}
}
async function assertPaintedArt(page,selector,kind){
 const nodes=page.locator(selector);
 assert.ok(await nodes.count()>0,selector);
 for(const node of await nodes.all()){
  const value=await node.evaluate(async img=>{await img.decode();const r=img.getBoundingClientRect();const s=getComputedStyle(img);return {url:img.currentSrc,width:img.naturalWidth,visible:r.width>0&&r.height>0&&s.visibility==="visible"&&s.display!=="none"&&Number(s.opacity)>0};});
  assert.ok(value.visible&&value.width>0&&value.url.includes("/assets/"+kind+"/"),JSON.stringify(value));
 }
}
async function immersiveScreens(){
 for(const locale of ["fr","en"]) for(const viewport of [{width:320,height:568},{width:360,height:640},{width:390,height:844},{width:412,height:915},{width:768,height:1024},{width:844,height:390},{width:1024,height:768},{width:1920,height:1080}]){
  const context=await browser.newContext({viewport,locale:locale==="fr"?"fr-FR":"en-US",reducedMotion:"reduce",hasTouch:viewport.width<900});
  await context.addInitScript(chosen=>{if(location.origin==="http://127.0.0.1:4388")localStorage.setItem("cardforge.language.v1",chosen);},locale);
  try{
   const page=await context.newPage();await page.goto(HOST);await ready(page);
   await page.locator(".forge-grid button").last().waitFor();
   assert.equal(await page.locator(".forge-tile-scene").count(),5);
   assert.equal(await page.locator(".forge-tile-logo").count(),5);
   if(viewport.width<=600&&viewport.width<viewport.height){
     assert.ok(await page.locator(".forge-cover button").evaluateAll(nodes=>nodes.every(n=>n.getBoundingClientRect().width>=innerWidth*.85)),"portrait gallery must fill available width");
     assert.ok(await page.locator(".forge-gallery-header .brand").evaluate(n=>n.getBoundingClientRect().width>=innerWidth*.5),"gallery logo must be readable");
   }
   assert.equal(await page.getByRole("heading",{name:/Choisissez votre univers|Choose your universe/}).count(),0);
   assert.ok(await page.locator(".forge-cover button").evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return Math.abs(r.width/r.height-2)<.06;})),"game tiles must be 2:1");
   assert.ok(await page.locator(".forge-settings-tile").evaluate(n=>{const r=n.getBoundingClientRect();return r.height>=44&&r.width/r.height>=2.8;}),"settings tile must be compact and touch accessible");
   await page.locator(".forge-tile-scene,.forge-tile-logo,.forge-settings-art").evaluateAll(nodes=>Promise.all(nodes.map(n=>n.decode())));
   assert.ok(await page.locator(".forge-home .offline-readiness[data-offline-phase=ready]").evaluate(n=>n.getBoundingClientRect().height<=1),"ready status must not occupy visible gallery space");
   assert.ok(await page.locator(".forge-home .offline-readiness").evaluate(n=>{
     const card=document.querySelector(".forge-cover");const before=card.getBoundingClientRect().top;
     const phase=n.dataset.offlinePhase,notice=n.dataset.offlineNotice;
     try{for(const p of ["installing","ready","reload-required","error"]){n.dataset.offlinePhase=p;n.dataset.offlineNotice="hidden";if(n.getBoundingClientRect().height>1||card.getBoundingClientRect().top!==before)return false;}
     for(const p of ["reload-required","error"]){n.dataset.offlinePhase=p;n.dataset.offlineNotice="visible";if(getComputedStyle(n).position!=="fixed"||card.getBoundingClientRect().top!==before)return false;}return true;
     }finally{n.dataset.offlinePhase=phase;n.dataset.offlineNotice=notice;}
   }),"offline status and warning must never shift gallery");
   assert.equal(await page.locator(".forge-home select, .forge-home .settings-button").count(),0);
   assert.equal(await page.locator(".forge-grid > :last-child").getAttribute("class"),"forge-settings-card");
   assert.equal(await page.locator(".forge-grid").evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(" ").length),viewport.width<600?1:viewport.width<1100?2:3);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),"gallery must not scroll horizontally");
   await page.keyboard.press("Tab");
   await page.locator(".forge-cover button").first().focus();
   assert.ok(await page.locator(".forge-cover button").first().evaluate(n=>n.matches(":focus-visible")&&getComputedStyle(n).outlineStyle!=="none"),"keyboard focus must be visible");
   await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"}));
   const end=await page.locator(".forge-settings-tile").evaluate(n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:innerHeight,scrollY,scrollHeight:document.documentElement.scrollHeight};});
   assert.ok(end.top>=0&&end.height-end.bottom>=79, "settings must be fully visible with bottom margin: "+JSON.stringify(end));
   assert.ok(await page.locator(".forge-settings-art").evaluate(n=>n.currentSrc.includes("settings-forge")||n.currentSrc.startsWith("data:image/svg+xml")),"dedicated settings art");
   if(viewport.width<600){assert.ok(await page.locator(".forge-cover button").evaluateAll(nodes=>nodes.every(n=>n.getBoundingClientRect().width>=innerWidth*.9)),"full-width portrait cards");}
   if(viewport.width===390){const {mkdirSync}=await import("node:fs");mkdirSync("ux-screenshots",{recursive:true});await page.screenshot({path:"ux-screenshots/cardforge-gallery-end-390-"+locale+".png"});}
   await page.locator(".forge-settings-tile").click();
   assert.equal(await page.locator(".settings-top-back").count(),1);
   assert.equal(await page.locator(".forge-settings-footer").count(),0);
   assert.ok(await page.locator(".forge-settings-heading").evaluate(n=>{const r=n.getBoundingClientRect(),h=n.querySelector("h1").getBoundingClientRect();return Math.abs((h.left+h.right-r.left-r.right)/2)<2;}),"centered settings title");
   await page.locator('[data-settings-category="language"]').click();
   await page.locator("#settings-language").waitFor();
   await page.locator(".settings-top-back").click();
   await page.locator('[data-settings-category="audio"]').click();
   assert.equal(await page.getByRole("slider").count(),2);
   const music=page.locator("#musicVolume"),sounds=page.locator("#soundsVolume");
   await music.fill("0");await sounds.fill("35");
   assert.equal(await sounds.inputValue(),"35");await page.locator(".audio-preview").click();
   await sounds.fill("0");assert.ok(await page.locator(".audio-preview").isDisabled());
   await sounds.focus();await page.keyboard.press("ArrowRight");assert.equal(await sounds.inputValue(),"1");
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem("cardforge.settings.v1")).soundsVolume),1);
   await sounds.fill("0");
   assert.equal(await page.locator(".volume-muted").count(),2);
   await sounds.fill("35");
   assert.equal(await page.locator(".volume-muted").count(),1);
   await page.locator(".settings-top-back").click();
   assert.match(await page.locator('[data-settings-category="audio"]').innerText(),/35 %/);
   await page.locator('[data-settings-category="audio"]').click();await page.locator("#soundsVolume").fill("0");await page.locator(".settings-top-back").click();
   await page.locator('[data-settings-category="comfort"]').click();
   await page.locator("#settings-animations").waitFor();
   await page.locator(".settings-top-back").click();
   await page.locator('[data-settings-category="privacy"]').click();
   assert.equal(await page.locator(".privacy-sensitive-zone").count(),1);
   await page.locator(".forge-privacy-details summary").first().click();
   assert.doesNotMatch(await page.locator(".privacy-panel").innerText(),/GitHub|Jira|IndexedDB|localStorage/i);
   await page.locator(".forge-privacy-details summary").first().click();
   assert.equal(await page.locator(".settings-top-back").count(),1);
   await page.locator(".inventory-details summary").click();
   assert.ok(await page.locator(".privacy-inventory li").count()>=7);
   await page.locator("details.privacy-action summary").first().click();
   await page.locator(".privacy-action button").first().click();
   await page.getByRole("alertdialog").waitFor();
   assert.ok(await page.locator(".privacy-confirm-actions button").first().evaluate(n=>document.activeElement===n));
   await page.locator(".privacy-confirm-actions button").first().click();
   assert.equal(await page.getByRole("alertdialog").count(),0);
   await page.locator(".settings-top-back").click();
   await page.locator('[data-settings-category="about"]').click();
   await page.locator(".settings-credits").click();
   await page.locator(".credits-page").waitFor();
   assert.equal(await page.locator("details.credits-item summary img").count(),5);
   await page.locator(".credits-page details").evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
   assert.doesNotMatch(await page.locator(".credits-page").innerText(),/GitHub|Jira|CAR-43|porteur du projet|project owner|jeu CardForge à venir|upcoming CardForge game/i);
   assert.equal(await page.locator('.credits-page a[href*="lmn24.atlassian.net"], .credits-page a[href*="github.com/JeanLamora75/CardForge"]').count(),0);
   assert.equal(await page.locator('.credits-page a[href*="licenses/fonts/"]').count(),5);
   await page.locator(".credits-page details").evaluateAll(nodes=>nodes.forEach(n=>n.open=false));
   await page.locator("details.credits-item summary").first().click();
   assert.ok(await page.locator("details.credits-item").first().getAttribute("open")!==null);
   await page.locator(".credits-page .settings-top-back").click();
   await page.locator('[data-settings-category="language"]').waitFor();
   await page.locator(".settings-top-back").click();
   await page.locator(".forge-gallery").waitFor();
   await assertPaintedArt(page,".forge-home > .forge-world-bg img",viewport.width>viewport.height?"worlds-landscape":"worlds");
   await assertPaintedArt(page,".forge-home > .forge-effect","effects");
   if(viewport.width===390||viewport.width===844) { const {mkdirSync}=await import("node:fs");mkdirSync("ux-screenshots",{recursive:true});await page.screenshot({path:"ux-screenshots/cardforge-"+viewport.width+"-"+locale+".png"}); }
   assert.ok(await page.locator(".forge-tile-scene").evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));
   for(const id of ["gridcannon","clear-the-dungeon","loot-the-loop","card-capture","regicide"]){
    await page.goto(HOST+"#game/"+id);await page.locator(".forge-menu").waitFor();
    await page.locator(".forge-title img").evaluate(i=>i.decode());
    const family={"gridcannon":"Rajdhani","clear-the-dungeon":"Cinzel","loot-the-loop":"Josefin Sans","card-capture":"Alegreya SC","regicide":"Kaushan Script"}[id];
    await page.evaluate(async family=>{const node=document.querySelector(".forge-command span");const s=getComputedStyle(node);const faces=await document.fonts.load(s.fontWeight+" "+s.fontSize+' "'+family+'"',"Nouvelle partie Règles Statistiques Reprendre New game");if(!faces.length||faces.some(f=>f.status!=="loaded"))throw Error("font not loaded: "+family);},family);
    assert.ok(await page.locator(".forge-command span").evaluateAll((nodes,family)=>nodes.every(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return s.fontFamily.includes(family)&&r.left>=b.left&&r.right<=b.right&&r.top>=b.top&&r.bottom<=b.bottom&&n.scrollWidth<=n.clientWidth+1;}),family),"labels fit with themed font "+family);

    await assertPaintedArt(page,".forge-menu .forge-world-bg img",viewport.width>viewport.height?"worlds-landscape":"worlds");
    await assertPaintedArt(page,".forge-button-art","buttons");
    await assertPaintedArt(page,".forge-menu .forge-effect","effects");
    if(viewport.width===390||viewport.width===844) { const {mkdirSync}=await import("node:fs");mkdirSync("ux-screenshots",{recursive:true});await page.screenshot({path:"ux-screenshots/"+id+"-"+viewport.width+"-"+locale+".png"}); }
    assert.ok(await page.locator(".forge-command").evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.top>=document.querySelector(".forge-title").getBoundingClientRect().bottom-1&&r.left>=0&&r.bottom<=Math.min(innerHeight,visualViewport?.height??innerHeight)-31&&r.right<=innerWidth+1&&r.height>=44;})),id+" commands fit "+JSON.stringify(viewport));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+2&&document.documentElement.scrollWidth<=innerWidth+2));
    if(viewport.width<viewport.height){
      const geometry=await page.locator(".forge-menu-actions").evaluate(n=>{const r=n.getBoundingClientRect();return {width:r.width,viewport:innerWidth,bottom:r.bottom,height:innerHeight};});
      assert.ok(Math.abs(geometry.width-Math.min(geometry.viewport*.9,540))<=2,JSON.stringify(geometry));
      assert.ok(geometry.bottom<=geometry.height-31,JSON.stringify(geometry));
    }
    assert.ok(await page.locator(".forge-button-art").evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).clipPath!=="none")),"button art must not expose rectangular corners");
    assert.equal(await page.locator(".forge-menu > .forge-return,.forge-menu-foot,.forge-credits").count(),0);
    assert.ok(await page.locator(".forge-title").evaluate((n,{id,portrait})=>{
      const r=n.getBoundingClientRect(),menu=n.closest(".forge-menu").getBoundingClientRect(),img=n.querySelector("img"),image=img.getBoundingClientRect(),style=getComputedStyle(img);
      const offset=r.x+r.width/2-innerWidth/2;
      if(portrait&&id==="loot-the-loop"){
        const safeProbe=document.createElement("div");
        safeProbe.style.paddingRight="env(safe-area-inset-right, 0px)";
        n.append(safeProbe);
        const safeRight=parseFloat(getComputedStyle(safeProbe).paddingRight)||0;
        safeProbe.remove();
        const margin=menu.right-r.right;
        return Math.abs(margin-Math.max(6,safeRight))<=1&&r.left>=menu.left&&image.right<=menu.right&&image.left>=menu.left&&image.top>=menu.top&&image.bottom<=menu.bottom&&img.naturalWidth>0&&img.naturalHeight>0&&style.objectFit==="contain"&&style.objectPosition==="100% 50%";
      }
      if(portrait&&id==="regicide")return Math.abs(offset-Math.min(innerWidth*.16,96))<=2&&r.right<=innerWidth;
      return r.left>=0&&Math.abs(offset)<2;
    },{id,portrait:viewport.width<viewport.height}),"logo placement per world");
    assert.equal(await page.locator(".forge-command").count(),5);
    await assertThreeRowMenu(page);
    assert.deepEqual(await page.locator(".forge-command span").allTextContents(),locale==="fr"?["Nouvelle partie","Apprendre","Règles","Statistiques","Retour"]:["New game","Learn","Rules","Statistics","Back"],"menu labels in selected language");
    await page.keyboard.press("Tab");
    await page.locator(".forge-command").first().focus();
    assert.ok(await page.locator(".forge-command").first().evaluate(n=>n.matches(":focus-visible")&&getComputedStyle(n).outlineStyle==="solid"),"visible keyboard focus");
    assert.match(await page.locator(".forge-command").last().textContent(),/^(Retour|Back)$/);
    assert.equal(await page.locator(".forge-command.primary-action").count(),1);
    if(viewport.width<=600&&viewport.width<viewport.height)assert.ok(await page.locator(".forge-menu-actions").evaluate(n=>n.getBoundingClientRect().width>=innerWidth*.85),"portrait commands must fill available width");
    assert.equal(await page.locator(".forge-command-back").count(),1);
    assert.ok(await page.locator(".forge-command.primary-action .forge-button-art").evaluate(n=>Number(getComputedStyle(n).opacity))>await page.locator(".forge-command-back .forge-button-art").evaluate(n=>Number(getComputedStyle(n).opacity)),"primary action must stand out from return");
    assert.ok(await page.locator(".forge-command").evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect(),l=n.querySelector("span").getBoundingClientRect();return Math.abs((r.top+r.bottom-l.top-l.bottom)/2)<=2;})),"labels must be vertically centered");
    if(viewport.width<viewport.height) assert.ok(await page.locator(".forge-menu-actions").evaluate(n=>n.getBoundingClientRect().bottom<=innerHeight-31),"menu must leave room below commands");
    await page.locator(".forge-command").last().click();
    await page.locator(".forge-gallery").waitFor();
    await page.goto(HOST+"#game/"+id);await page.locator(".forge-menu").waitFor();


    await page.locator(".forge-command").filter({hasText:/Règles|Rules/i}).click();await page.locator(".context-page").waitFor();
   }
   await context.setOffline(true);
   await page.goto(HOST+"#settings");await page.reload();await page.locator('[data-settings-category="audio"]').click();
   assert.equal(await page.locator("#soundsVolume").inputValue(),"0");
   await page.locator("#soundsVolume").fill("25");assert.equal(await page.locator("#soundsVolume").inputValue(),"25");
   await page.locator("#soundsVolume").fill("0");
   for(const [id,family] of Object.entries({"gridcannon":"Rajdhani","clear-the-dungeon":"Cinzel","loot-the-loop":"Josefin Sans","card-capture":"Alegreya SC","regicide":"Kaushan Script"})){
    await page.goto(HOST+"#game/"+id);await page.reload();await page.locator(".forge-title img").evaluate(i=>i.decode());
    assert.ok(await page.evaluate(async family=>{const s=getComputedStyle(document.querySelector(".forge-command span"));const faces=await document.fonts.load(s.fontWeight+" "+s.fontSize+' "'+family+'"',"Règles New game");return faces.length>0&&faces.every(f=>f.status==="loaded");},family),"offline font "+family);
   }
  }finally{await context.close();}
 }
}

async function assertThreeRowMenu(page){
  const geometry=await page.locator(".forge-menu-actions").evaluate(menu=>{
    const area=menu.getBoundingClientRect(),root=menu.closest(".forge-menu").getBoundingClientRect();
    const buttons=[...menu.querySelectorAll(".forge-command")].map(button=>{
      const r=button.getBoundingClientRect(),label=button.querySelector("span"),l=label.getBoundingClientRect();
      return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height,labelFits:l.left>=r.left-1&&l.right<=r.right+1&&l.top>=r.top-1&&l.bottom<=r.bottom+1&&label.scrollWidth<=label.clientWidth+1};
    });
    return {area:{x:area.x,right:area.right,width:area.width,bottom:area.bottom},bottom:root.bottom,buttons};
  });
  const {area,bottom,buttons:b}=geometry;
  const near=(a,b)=>Math.abs(a-b)<=1;
  assert.equal(b.length,5);
  assert.ok(near(b[0].x,area.x)&&near(b[0].right,area.right),"primary spans both columns");
  assert.ok(near(b[1].y,b[2].y)&&near(b[3].y,b[4].y)&&b[1].y>=b[0].bottom&&b[3].y>=b[1].bottom,"exactly three rows");
  assert.ok(near(b[1].x,b[3].x)&&near(b[2].x,b[4].x)&&b[2].x>b[1].right&&near(b[1].width,b[2].width),"two equal secondary columns");
  assert.ok(b.every(r=>r.height>=44&&near(r.height,b[0].height)&&r.labelFits),"equal accessible targets and unclipped labels");
  assert.ok(bottom-area.bottom>=31,"32px bottom safety margin");
}
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
    assert.equal(await page.locator('.forge-home select').count(),0);
    await interact(page,page.locator('.forge-settings-tile'),mobile);
    await page.locator('[data-settings-category="language"]').click();
    const select=page.locator('#settings-language');
    await select.selectOption(locale);
    await page.locator('.settings-top-back').click();
    await page.locator('.settings-top-back').click();
    await page.locator('.forge-gallery').waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    assert.equal(await page.getByRole('heading',{name:/Choisissez votre univers|Choose your universe/}).count(),0);
    assert.equal(await page.locator('.forge-gallery').getAttribute('aria-label'),locale==='fr'?'Galerie des jeux':'Game gallery');
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
      if(game.id==='gridcannon'){
        assert.equal(await page.locator('.thunder-grid .thunder-pile').count(),9);
        assert.equal(await page.locator('.thunder-battlefield .thunder-slot').count(),12);
        assert.equal(await page.locator('.thunder-metrics>span').count(),3);
        assert.equal(await page.locator('.thunder-id,.thunder-command-page .status').count(),0);
        assert.doesNotMatch(await page.locator('.thunder-metrics').innerText(),/54|physical/i);
        assert.ok(await page.locator('.thunder-battlefield').evaluate(n=>{const r=n.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&document.documentElement.scrollWidth<=innerWidth+2;}));
        assert.ok(await page.locator('.thunder-battlefield').evaluate(n=>n.getBoundingClientRect().bottom<=document.querySelector('.thunder-action-zone').getBoundingClientRect().top));
      }
      const before=await readSaved(page,game.id);
      assert.ok(before,'start must persist '+game.name);
      if(game.id==='gridcannon'){
        const card=page.locator('.thunder-grid .tf-tactical').first();
        const id=await card.getAttribute('data-card-id');
        await interact(page,card,mobile);
        const detail=page.locator('.tf-card-detail[open]');await detail.waitFor();
        assert.equal(await detail.getAttribute('data-card-id'),id);
        assert.equal(await detail.getByRole('button',{name:locale==='fr'?'Fermer la carte':'Close card'}).count(),1);
        assert.deepEqual(await readSaved(page,game.id),before,'inspection must not write');
        if(mobile)await detail.getByRole('button').click();else await page.keyboard.press('Escape');
        await detail.waitFor({state:'detached'});
        assert.equal(await card.evaluate(n=>document.activeElement===n),true);
        assert.deepEqual(await readSaved(page,game.id),before);
      }
      if(game.id==='loot-the-loop'){
        assert.equal(await page.locator('.ms-top .ms-hidden').count(),2);
        await interact(page,page.locator(game.actions).first(),mobile);
        assert.deepEqual(await readSaved(page,game.id),before);
        await interact(page,page.locator('.ms-confirm button.secondary-action'),mobile);
        assert.deepEqual(await readSaved(page,game.id),before);
        await interact(page,page.locator(game.actions).first(),mobile);
        await interact(page,page.locator('.ms-confirm button.primary-action'),mobile);
      }else if(game.confirm){
        const target=page.locator('.tf-target').first();
        const direct=await target.count()>0;
        const action=direct?target:page.locator(game.actions).first();
        await interact(page,action,mobile);
        if(direct)assert.equal(await target.getAttribute('aria-pressed'),'true');
        await page.locator('.thunder-confirm').waitFor({state:'visible'});
        const onCancel=await readSaved(page,game.id);
        assert.deepEqual(onCancel,before,'Thunderfighter preview must not write');
        await interact(page,page.locator('.thunder-confirm button.back-link'),mobile);
        assert.deepEqual(await readSaved(page,game.id),before,'cancel must not write');
        if(direct)assert.equal(await target.getAttribute('aria-pressed'),'false');
        await interact(page,action,mobile);
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
      await page.goto(HOST+'#game/'+game.id);
      await page.locator('.forge-menu[data-saved="yes"]').waitFor();
      assert.equal(await page.locator('.forge-command').count(),5);
      await assertThreeRowMenu(page);
      assert.ok(await page.locator('.forge-command').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();const e=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return r.top>=document.querySelector(".forge-title").getBoundingClientRect().bottom-1&&r.bottom<=Math.min(innerHeight,visualViewport?.height??innerHeight)-31&&r.height>=44&&!!e&&n.contains(e);})), 'saved menu: all five commands must fit and be clickable');
      if(mobile){const {mkdirSync}=await import('node:fs');mkdirSync('ux-screenshots',{recursive:true});await page.screenshot({path:'ux-screenshots/'+game.id+'-saved-'+locale+'.png'});}
      await page.goto(HOST+'#game/'+game.id+'/board');
      await page.locator(game.root).waitFor();

      if(game.id==='loot-the-loop'){
        assert.deepEqual(after.state.deck.map(c=>c.id),before.state.deck.map(c=>c.id));
        assert.ok(after.state.deck.slice(0,2).every(c=>c.faceUp));
        await page.locator('.ms-board').getByText(/Action enregistrée|Action saved/).waitFor();
        await page.locator('.topbar .settings-button').click();
        await page.locator('[data-settings-category="language"]').click();
        await select.selectOption(locale==='fr'?'en':'fr');
        assert.equal(await page.locator('html').getAttribute('lang'),locale==='fr'?'en':'fr');
        assert.deepEqual(await readSaved(page,game.id),after,'switching language must not alter game state');
        await select.selectOption(locale);
        await page.locator('.settings-top-back').click();
        await page.locator('.settings-top-back').click();
      }
      await page.goto(HOST+'#game/'+game.id+'/rules');
      await page.getByRole('heading',{name:/Règles et mécanismes|Rules and mechanics/}).waitFor();
      assert.equal(await page.locator('html').getAttribute('lang'),locale);
    }
    // Skydeck normal play: persistence and exact offline resume.
    await page.goto(HOST+'#game/card-capture/board');
    await page.locator('.learning-intro').waitFor();
    await interact(page,page.locator('.learning-intro button.secondary-action').first(),mobile);
    const sd=page.locator('.sd-board');
    await sd.waitFor();
    await interact(page,sd.getByRole('button',{name:locale==='fr'?'Commencer une partie':'Start a game'}),mobile);
    await sd.locator('.sd-line:not(.sd-hand) button[data-position="1"]').waitFor();
    assert.deepEqual(await sd.locator('.sd-line:not(.sd-hand) button').evaluateAll(nodes=>nodes.map(n=>n.dataset.position)),['4','3','2','1']);
    const initial=await sd.locator('[role=status]').textContent();
    await interact(page,sd.locator('.sd-preview'),mobile);
    await interact(page,sd.locator('.sd-confirm button.secondary-action'),mobile);
    assert.equal(await sd.locator('[role=status]').textContent(),initial);
    for(let phase=0;phase<3;phase++){
      await interact(page,sd.locator('.sd-preview'),mobile);
      await interact(page,sd.locator('.sd-confirm button.primary-action'),mobile);
    }
    await sd.getByRole('button',{name:locale==='fr'?'B · Laisser capturer':'B · Let enemy capture',exact:true}).waitFor();
    assert.equal(await sd.locator('.sd-hand button').count(),4);
    await sd.getByRole('button',{name:locale==='fr'?'B · Laisser capturer':'B · Let enemy capture',exact:true}).waitFor();
    const sdScreen=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(sdScreen.scroll<=sdScreen.width+4,JSON.stringify({label,sdScreen}));
    saved['card-capture']=await readSaved(page,'card-capture');
    assert.ok(saved['card-capture']);
    assert.equal(saved['card-capture'].state.phase,'capture');
    // CAR-78 internal Regicide board: keyboard/touch, bilingual, preview cancellation.
    await page.goto(HOST+'#game/regicide/board');
    const ldt=page.locator('.ldt-board');
    await interact(page,ldt.getByRole('button',{name:locale==='fr'?'Commencer une partie':'Start a game'}),mobile);
    await ldt.locator('.ldt-hand button').first().waitFor();
    assert.equal(await ldt.locator('.ldt-hand button').count(),8);
    const original=await ldt.locator('.ldt-status').textContent();
    await interact(page,ldt.locator('.ldt-hand button').first(),mobile);
    await interact(page,ldt.locator('.ldt-preview'),mobile);
    await ldt.locator('.ldt-confirm').waitFor();
    assert.equal(await ldt.locator('.ldt-status').textContent(),original);
    await interact(page,ldt.locator('.ldt-confirm .secondary-action'),mobile);
    assert.equal(await ldt.locator('.ldt-status').textContent(),original);
    await interact(page,ldt.locator('.ldt-preview'),mobile);
    await interact(page,ldt.locator('.ldt-confirm .primary-action'),mobile);
    await ldt.locator('.ldt-next').waitFor();
    assert.equal(await ldt.locator('.ldt-hand button').count(),7);
    assert.match(await ldt.locator('.ldt-status').textContent(),/Pouvoirs|Powers/);
    await interact(page,ldt.locator('.ldt-next'),mobile);
    await interact(page,ldt.locator('.ldt-confirm .primary-action'),mobile);
    await ldt.getByRole('button',{name:locale==='fr'?'Résoudre les dégâts':'Resolve damage'}).waitFor();
    assert.match(await ldt.locator('.ldt-status').textContent(),/Dégâts|Damage/);
    await interact(page,ldt.locator('.ldt-next'),mobile);
    await interact(page,ldt.locator('.ldt-confirm .primary-action'),mobile);
    await ldt.locator('.ldt-confirm').waitFor({state:'hidden'});
    assert.match(await ldt.locator('.ldt-status').textContent(),/Riposte|Retaliation|Attaque|Attack/);
    const regicideSave=await readSaved(page,'regicide');
    assert.ok(regicideSave);
    assert.equal(regicideSave.formatVersion,1);
    await page.reload();
    await ldt.locator('.ldt-resumed').waitFor();
    assert.deepEqual(await readSaved(page,'regicide'),regicideSave);
    saved.regicide=regicideSave;
    await interact(page,page.getByRole('button',{name:locale==='fr'?'Recrutement exact':'Exact recruitment'}),mobile);
    await ldt.locator('.ldt-hand button').first().waitFor();
    await interact(page,ldt.locator('.ldt-hand button').first(),mobile);
    await interact(page,ldt.locator('.ldt-preview'),mobile);
    await interact(page,ldt.locator('.ldt-confirm .primary-action'),mobile);
    await ldt.locator('.ldt-next').waitFor();
    assert.deepEqual(await readSaved(page,'regicide'),regicideSave);
    await interact(page,page.getByRole('button',{name:locale==='fr'?'Partie normale':'Normal game',exact:true}),mobile);
    await ldt.locator('.ldt-resumed').waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+4));
    await page.close();
    await context.setOffline(true);
    const offline=await context.newPage();
    const browserErrors=[];
    offline.on('requestfailed',request=>browserErrors.push('request '+request.url()+': '+request.failure()?.errorText));
    offline.on('pageerror',error=>browserErrors.push('page '+error.message));
    offline.on('console',message=>{if(message.type()==='error')browserErrors.push('console '+message.text());});
    try{
      await offline.goto(HOST,{waitUntil:'domcontentloaded',timeout:15000});
      await offline.locator('[data-offline-phase="ready"]').waitFor({state:"attached",timeout:20000}).catch(async error=>{
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
      await offline.locator('.offline-readiness small').getByText(locale==='fr'?'Hors connexion':'Offline',{exact:true}).waitFor({state:"attached"});
      for(const game of GAMES){
        await offline.goto(HOST+'#game/'+game.id+'/board',{waitUntil:'domcontentloaded',timeout:15000});
        await offline.locator(game.root).waitFor({state:'visible',timeout:15000});
        const restored=await readSaved(offline,game.id);
        assert.deepEqual(restored,saved[game.id],game.name+' must survive offline cold tab reopen without shuffling');
        await offline.getByText(/Partie locale restaurée|Partie restaurée sans remélange|Partie reprise · sauvegarde locale|Game resumed · local save|Game restored|restored without/).first().waitFor({timeout:10000});
        await offline.goto(HOST+'#game/'+game.id+'/rules',{waitUntil:'domcontentloaded'});
        await offline.getByRole('heading',{name:/Règles et mécanismes|Rules and mechanics/}).waitFor();
      }
      await offline.goto(HOST+'#game/regicide/board');
      await offline.locator('.ldt-resumed').waitFor();
      assert.deepEqual(await readSaved(offline,'regicide'),saved.regicide);
      // CAR-81: real terminal transitions on prepared snapshots; not a natural full playthrough.
      const reg=offline.locator('.ldt-board');
      for(const scenario of ['joker','win','loss','abandoned']){
        const base=saved.regicide.state;
        const ids=[base.activeEnemy,...base.castle,...base.hand,...base.tavern,...base.discard,...base.combat,...base.pending].filter(Boolean);
        const enemy=scenario==='win'?'spades-13':'spades-11';
        const castle=scenario==='win'?[]:ids.filter(id=>Number(id.split('-')[1])>=11&&id!==enemy).sort((a,b)=>Number(a.split('-')[1])-Number(b.split('-')[1]));
        const hand=scenario==='win'?['clubs-10']:scenario==='loss'?[]:['hearts-1'];
        const state={...base,turn:12,phase:scenario==='loss'?'retaliation':'play',outcome:'in-progress',activeEnemy:enemy,castle,hand,discard:[],combat:[],pending:[],shield:0,enemyHealth:scenario==='win'?20:20,enemyAttack:scenario==='win'?20:10,tavern:ids.filter(id=>id!==enemy&&!castle.includes(id)&&!hand.includes(id)),jokers:base.jokers.map(j=>({...j,used:scenario==='loss'}))};
        const fixture={...saved.regicide,sessionId:saved.regicide.sessionId+'-'+scenario,state};
        await offline.evaluate(async fixture=>{
          const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('cardforge',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
          try{await new Promise((resolve,reject)=>{const tx=db.transaction('sessions','readwrite');tx.objectStore('sessions').put(fixture);tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});}finally{db.close();}
        },fixture);
        await offline.reload();await reg.locator('.ldt-resumed').waitFor();
        const confirm=async()=>{await interact(offline,reg.locator('.ldt-confirm .primary-action'),mobile);await reg.locator('.ldt-confirm').waitFor({state:'hidden'});};
        if(scenario==='joker'){await interact(offline,reg.locator('.ldt-jokers button').first(),mobile);await confirm();assert.equal((await readSaved(offline,'regicide')).state.jokers[0].used,true);}
        else if(scenario==='win'){await interact(offline,reg.locator('.ldt-hand button').first(),mobile);await interact(offline,reg.locator('.ldt-preview'),mobile);await confirm();for(let i=0;i<2;i++){await interact(offline,reg.locator('.ldt-next'),mobile);await confirm();}}
        else {await interact(offline,reg.getByRole('button',{name:scenario==='loss'?(locale==='fr'?'Accepter la défaite':'Accept defeat'):(locale==='fr'?'Abandonner':'Abandon'),exact:true}),mobile);await confirm();}
        const durable=await readSaved(offline,'regicide');assert.equal(durable.state.outcome,scenario==='joker'?'in-progress':scenario);await offline.reload();await reg.locator('.ldt-resumed').waitFor();assert.deepEqual(await readSaved(offline,'regicide'),durable);
      }
      await offline.goto(HOST+'#game/regicide/rules');
      await offline.getByRole('heading',{name:locale==='fr'?'Règles des Douze Tyrans':'Twelve Tyrants rules'}).waitFor();
      await offline.goto(HOST+'#game/card-capture/board',{waitUntil:'domcontentloaded'});
      await offline.locator('.sd-resumed').waitFor();
      assert.deepEqual(await readSaved(offline,'card-capture'),saved['card-capture']);
      // Prepared late-game snapshots exercise real UI transitions, not a full natural playthrough.
      const sd=offline.locator('.sd-board');
      for(const outcome of ['win','loss','abandoned']){
        const fixture=await installSkydeckFixture(offline,saved['card-capture'],outcome);
        if(outcome==='abandoned'){
          await interact(offline,sd.getByRole('button',{name:locale==='fr'?'Abandonner':'Abandon',exact:true}),mobile);
        }else{
          if(outcome==='loss')await interact(offline,sd.getByRole('button',{name:locale==='fr'?'B · Laisser capturer':'B · Let enemy capture',exact:true}),mobile);
          else await interact(offline,sd.locator('[data-position="1"]'),mobile);
          await interact(offline,sd.locator('.sd-hand button').nth(outcome==='win'?0:2),mobile);
          if(outcome==='win')await interact(offline,sd.locator('.sd-hand button').nth(1),mobile);
          await interact(offline,sd.locator('.sd-preview'),mobile);
        }
        await interact(offline,sd.locator('.sd-confirm button.primary-action'),mobile);
        await sd.getByRole('link',{name:locale==='fr'?'Retour au catalogue':'Back to catalogue'}).waitFor();
        assert.equal((await readSaved(offline,'card-capture')).state.outcome,outcome);
        await offline.reload();
        await sd.getByRole('link',{name:locale==='fr'?'Retour au catalogue':'Back to catalogue'}).waitFor();
        assert.equal((await readSaved(offline,'card-capture')).sessionId,fixture.sessionId);
      }
      await offline.goto(HOST+'#game/card-capture/rules');
      await offline.getByRole('heading',{name:locale==='fr'?'Règles de Skydeck':'Skydeck rules'}).waitFor();
      assert.equal(await offline.locator('html').getAttribute('lang'),locale);
      // Mobile browser uses real touch events, no desktop-only hover action.
      await offline.goto(HOST+'#game/loot-the-loop/board',{waitUntil:'domcontentloaded'});
      await offline.locator('.ms-board .ms-top').waitFor();
      const msScreen=await offline.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(msScreen.scroll<=msScreen.width+4,JSON.stringify({label,msScreen}));
      const screen=await offline.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(screen.scroll<=screen.width+4,JSON.stringify({label,screen}));
      console.log('CAR-42 production:',label,'four games played and resumed offline, rules and localization verified; cache '+probe.version);
    }finally{await offline.close();}
  }finally{await context.close();}
}
try{
  await waitForServer();
  browser=await chromium.launch({headless:true});
  await immersiveScreens();
  await stalePreviewRecovery();
  for(const locale of ['fr','en'])
    for(const mobile of [false,true])
      await journey(locale,mobile);
  console.log('CAR-42 PRODUCTION E2E PASS — FR/EN desktop keyboard and touch-emulated mobile, four games, offline service worker.');
}finally{
  if(browser)await browser.close();
  vite.kill('SIGTERM');
}
