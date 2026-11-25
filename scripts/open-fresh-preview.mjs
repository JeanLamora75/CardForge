// Use the persistent browser profile without reusing stale navigation responses.
// Only the first online navigation bypasses the old worker; game storage is untouched.
export async function openFreshPreview(context,page,url,version){
 const cdp=await context.newCDPSession(page);
 try{
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.setBypassServiceWorker',{bypass:true});
  await page.goto(url,{waitUntil:'load',timeout:30000});
  await page.locator('.forge-gallery').waitFor({timeout:15000});
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
 await page.reload({waitUntil:'load'});
 await page.locator('.forge-gallery').waitFor({timeout:15000});
 await page.locator('.forge-cover img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
}
