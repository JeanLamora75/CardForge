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
  await page.goto(url,{waitUntil:'load',timeout:30000});
  await page.evaluate(async()=>{for(const registration of await navigator.serviceWorker.getRegistrations())if(registration.scope===new URL('./',document.baseURI).href&&!registration.active?.scriptURL.endsWith('/sw.js'))await registration.unregister();});


  await page.goto(url,{waitUntil:'load',timeout:30000});
  await waitForSurface();
  await page.locator('.forge-cover img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  await page.evaluate(async()=>{
   const registration=await navigator.serviceWorker.register(new URL('sw.js',document.baseURI),{scope:'./',updateViaCache:'none'});
   await registration.update();
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
