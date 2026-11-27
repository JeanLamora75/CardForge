// Use the persistent browser profile without reusing stale navigation responses.
// Only the first online navigation bypasses the old worker; game storage is untouched.
export async function openFreshPreview(context,page,url,version){
 const errors=[];
 const onError=error=>{errors.push(error.stack??String(error));};
 const onConsole=message=>{if(message.type()==='error')errors.push(message.text());};
 page.on('pageerror',onError);page.on('console',onConsole);
 async function waitForSurface(){
  try{await page.locator('.forge-gallery, .forge-menu, .board-page, .context-page').first().waitFor({timeout:15000});}
  catch(error){throw new Error('Interface unavailable at '+page.url()+'\n'+(errors.join('\n')||'No browser exception captured')+'\n'+(await page.locator('body').innerText().catch(()=>'')),{cause:error});}
 }
 const cdp=await context.newCDPSession(page);
 try{
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.setBypassServiceWorker',{bypass:true});
  // Remove obsolete registrations before the first online load; keep IndexedDB and preferences.
  // A neutral same-origin document prevents the app from registering a new worker
  // while an obsolete registration is being removed.
  const cleanupUrl=new URL("?cardforge-preview-cleanup=1",url).href;
  const neutral=route=>route.fulfill({contentType:"text/html",body:"<!doctype html><title>CardForge</title>"});
  await page.route(cleanupUrl,neutral);
  try{
   await page.goto(cleanupUrl,{waitUntil:"load",timeout:30000});
   await page.evaluate(async()=>{
    for(const registration of await navigator.serviceWorker.getRegistrations()){
     const worker=registration.installing||registration.waiting||registration.active;
     if(registration.scope===new URL("./",document.baseURI).href&&!worker?.scriptURL.endsWith("/sw.js"))await registration.unregister();
    }
   });
   await page.goto("about:blank");
  }finally{await page.unroute(cleanupUrl,neutral);}
  await page.goto(url,{waitUntil:"load",timeout:30000});
  await waitForSurface();
  await page.locator('.forge-cover img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  await page.evaluate(async()=>{
   await navigator.serviceWorker.register(new URL("sw.js",document.baseURI),{scope:"./",updateViaCache:"none"});
   // Registration already initiates the update; the version-specific probe below
   // remains the acceptance gate, not a redundant update() on a racing registration.
  });
  await page.waitForFunction(async expected=>{
   const controller=navigator.serviceWorker.controller;
   if(!controller)return false;
   return new Promise(resolve=>{
    const channel=new MessageChannel();
    const timer=setTimeout(()=>{channel.port1.close();resolve(false);},1000);
    channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data?.ready===true&&e.data?.version===expected);};
    controller.postMessage({type:'CARDFORGE_CHECK_OFFLINE'},[channel.port2]);
   });
  },version,{timeout:60000});

 }finally{
  await cdp.send('Network.setBypassServiceWorker',{bypass:false}).catch(()=>{});
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:false}).catch(()=>{});
  await cdp.detach().catch(()=>{});
 }
 try{
 await page.reload({waitUntil:'load'});
 await waitForSurface();
 await page.locator('.forge-cover img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
 }finally{page.off('pageerror',onError);page.off('console',onConsole);}
}
