import { spawn, fork } from "node:child_process";
import { createServer } from "node:http";
import { createServer as createSocket } from "node:net";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { dependencyFingerprint, dependenciesReady, nextStartupState, artProgress } from "./startup-state.mjs";
import { buildInputFingerprint, reusableBuild, rememberBuild, invalidateBuild } from "./build-cache.mjs";
import { openFreshPreview } from "./open-fresh-preview.mjs";

const host="127.0.0.1",port=4173,url="http://127.0.0.1:4173/";
const root=process.cwd(),profileRoot=join(process.env.LOCALAPPDATA||process.env.TEMP||root,"CardForge-Preview");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let status={stage:"start",progress:0,error:false},splashServer,browserProcess,buildProcess,server,browser,context,terminal,stopping=false;
const started=performance.now();let stageStarted=started;
const step=(stage,progress)=>{const now=performance.now();console.log("[CardForge] "+status.stage+" : "+((now-stageStarted)/1000).toFixed(2)+" s");stageStarted=now;status=nextStartupState(status,stage,progress);console.log("[CardForge] "+stage+" "+status.progress+"%");};
function optimize(){return new Promise((resolve,reject)=>{
 const child=fork("scripts/optimize-art.mjs",[],{stdio:["ignore","inherit","inherit","ipc"]});
 buildProcess=child;
 child.on("message",message=>{
  if(message?.type!=="art-progress"||status.stage!=="art")return;
  const {done,total,converted,reused}=message;
  try{const progress=artProgress(done,total);if(progress<status.progress)return;status={...nextStartupState(status,"art",progress),done,total,converted,reused};}catch(error){console.warn(error.message);}
 });
 child.once("error",reject);
 child.once("exit",code=>{buildProcess=undefined;code===0?resolve():reject(Error("Optimisation : code "+code));});
});}
const listen=(s,p)=>new Promise((resolve,reject)=>{s.once("error",reject);s.listen(p,host,()=>resolve(s.address().port));});
const close=s=>new Promise(resolve=>s.close(resolve));
async function freePort(){const s=createSocket();const p=await listen(s,0);await close(s);return p;}
async function waitHttp(address,check=()=>true,timeout=30000){const end=Date.now()+timeout;while(Date.now()<end&&!stopping){try{const r=await fetch(address,{signal:AbortSignal.timeout(1000)});if(r.ok&&await check(r))return;}catch{}await sleep(200);}throw Error("Service local indisponible : "+address);}
function run(command,args){return new Promise((resolve,reject)=>{const child=process.platform==="win32"&&command==="npm"?spawn("cmd.exe",["/d","/s","/c","npm "+args.join(" ")],{stdio:"inherit",windowsHide:true}):spawn(command,args,{stdio:"inherit"});buildProcess=child;child.once("error",reject);child.once("exit",(code)=>{buildProcess=undefined;code===0?resolve():reject(Error(command+" "+args.join(" ")+" : code "+code));});});}
function browserCandidates(){
 const roots=[process.env["ProgramFiles(x86)"],process.env.ProgramFiles,process.env.LOCALAPPDATA].filter(Boolean);
 return ["msedge","chrome"].flatMap(channel=>roots.map(base=>({channel,exe:join(base,channel==="msedge"?"Microsoft/Edge/Application/msedge.exe":"Google/Chrome/Application/chrome.exe")}))).filter(x=>existsSync(x.exe));
}
async function stop(){if(stopping)return;stopping=true;terminal?.close();buildProcess?.kill();server?.kill();if(browser)await browser.close().catch(()=>{});browserProcess?.kill();splashServer?.closeAllConnections();splashServer?.close();}
process.on("SIGINT",()=>void stop());process.on("SIGTERM",()=>void stop());
try{
 const probe=createSocket();try{await listen(probe,port);await close(probe);}catch{throw Error("Port 4173 déjà utilisé. Fermez la précédente recette.");}
 splashServer=createServer((req,res)=>{
  const path=new URL(req.url,"http://127.0.0.1").pathname;
  res.setHeader("Cache-Control","no-store");
  if(path==="/status"){res.setHeader("Content-Type","application/json");return res.end(JSON.stringify(status));}
  const allowed={"/":"startup.html","/startup.css":"startup.css","/startup-preview.js":"startup-preview.js","/assets/worlds/cardforge.png":"assets/worlds/cardforge.png","/assets/worlds-landscape/cardforge.png":"assets/worlds-landscape/cardforge.png","/assets/logos/cardforge.png":"assets/logos/cardforge.png"};
  const file=allowed[path];if(!file){res.writeHead(404);return res.end();}
  try{const bytes=readFileSync(join(root,"public",file));res.setHeader("Content-Type",file.endsWith(".png")?"image/png":file.endsWith(".css")?"text/css; charset=utf-8":file.endsWith(".js")?"text/javascript; charset=utf-8":"text/html; charset=utf-8");res.end(bytes);}catch{res.writeHead(500);res.end("CardForge startup resource unavailable");}
 });
 const splashPort=await listen(splashServer,0),splashUrl="http://"+host+":"+splashPort+"/";
 let debugPort;
 for(const {channel,exe} of browserCandidates()){
  const profile=join(profileRoot,channel);mkdirSync(profile,{recursive:true});
  const preferencesPath=join(profile,"Default","Preferences");
  if(existsSync(preferencesPath)){try{const prefs=JSON.parse(readFileSync(preferencesPath,"utf8"));if(prefs.partition){prefs.partition.default_zoom_level=0;delete prefs.partition.per_host_zoom_levels;writeFileSync(preferencesPath,JSON.stringify(prefs));}}catch(error){console.warn("Préférences de zoom non modifiées :",error.message);}}
  debugPort=await freePort();
  browserProcess=spawn(exe,["--user-data-dir="+profile,"--remote-debugging-address="+host,"--remote-debugging-port="+debugPort,"--window-size=500,850","--new-window","--no-first-run","--no-default-browser-check",splashUrl],{stdio:"ignore"});
  browserProcess.on("error",error=>console.warn(error.message));
  try{await waitHttp("http://"+host+":"+debugPort+"/json/list",async r=>(await r.json()).some(t=>t.url===splashUrl),10000);break;}catch{browserProcess.kill();browserProcess=undefined;}
 }
 if(!browserProcess)throw Error("Edge ou Chrome indisponible, ou profil CardForge déjà ouvert. Fermez la recette précédente.");
 step("deps");
 const fingerprint=dependencyFingerprint(root);
 if(!dependenciesReady(root,fingerprint)){await run("npm",["install"]);writeFileSync(join(root,"node_modules",".cardforge-install"),dependencyFingerprint(root));}
 else console.log("Dépendances inchangées : installation évitée.");
 const {chromium}=await import("playwright");
 browser=await chromium.connectOverCDP("http://"+host+":"+debugPort);
 context=browser.contexts()[0];
 const splash=context.pages().find(p=>p.url()===splashUrl);
 if(!splash)throw Error("Écran de démarrage introuvable.");
 browser.on("disconnected",()=>void stop());
 step("art");await optimize();
 step("build");
 const input=await buildInputFingerprint(root);
 let reusedBuild=await reusableBuild(root,input);
 if(reusedBuild){console.log("Compilation inchangée : réutilisation du build vérifié.");status={...status,reusedBuild:true};}
 else{
  await invalidateBuild(root);
  await run(process.execPath,["node_modules/typescript/bin/tsc","-b"]);
  await run(process.execPath,["node_modules/vite/bin/vite.js","build"]);
 }
 step("verify");await run(process.execPath,["scripts/verify-pwa-build.mjs"]);
 if(!reusedBuild&&await buildInputFingerprint(root)===input)await rememberBuild(root,input);
 server=spawn(process.execPath,["node_modules/vite/bin/vite.js","preview","--host",host,"--port",String(port),"--strictPort"],{stdio:"inherit"});
 server.on("error",error=>console.error(error));
 await waitHttp(url);
 step("cache");
 // Create the production tab in the background; the splash remains foreground
 // during both cache-bypassing navigations and the verified offline reload.
 const cdp=await browser.newBrowserCDPSession();
 const newPage=context.waitForEvent("page",{timeout:15000});
 await cdp.send("Target.createTarget",{url:"about:blank",background:true});
 const page=await newPage;
 await cdp.detach();
 const session=await context.newCDPSession(page);
 await session.send("Emulation.clearDeviceMetricsOverride");await session.send("Emulation.setPageScaleFactor",{pageScaleFactor:1});await session.detach();
 const version=readFileSync("dist/sw.js","utf8").match(/const CACHE_NAME = PREFIX [+] "([a-f0-9]{8})";/)?.[1];
 if(!version)throw Error("Version du build PWA introuvable.");
 await openFreshPreview(context,page,url,version);
 await page.locator("#cf-startup").waitFor({state:"detached",timeout:15000});
 step("ready");
 console.log("Démarrage total : "+((performance.now()-started)/1000).toFixed(2)+" s");
 await splash.waitForFunction(()=>document.getElementById("cf-progress")?.value===100,{},{timeout:5000});
 await page.bringToFront();await splash.close();
 splashServer.closeAllConnections();splashServer.close();
 console.log("Cache PWA du build "+version+" vérifié. Profil persistant : "+profileRoot);
 console.log("O + Entrée = hors ligne ; N + Entrée = en ligne ; Q + Entrée = quitter.");
 page.on("close",()=>void stop());
 terminal=createInterface({input:process.stdin,output:process.stdout});
 terminal.on("line",async line=>{const key=line.trim().toLowerCase();if(key==="q")await stop();else if(key==="o"||key==="n"){try{await context.setOffline(key==="o");console.log(key==="o"?"Mode hors ligne activé.":"Connexion réactivée.");}catch(error){console.error(error);}}});
}catch(error){if(!stopping){console.error(error);status={...status,error:true};process.exitCode=1;if(splashServer&&browserProcess){console.log("Fermez le navigateur ou appuyez sur Entrée pour quitter.");terminal=createInterface({input:process.stdin,output:process.stdout});terminal.once("line",()=>void stop());browserProcess.once("exit",()=>void stop());}else await stop();}}
