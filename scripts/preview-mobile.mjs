import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { openFreshPreview } from './open-fresh-preview.mjs';
import { createInterface } from 'node:readline';
import { chromium, devices } from 'playwright';

const host = '127.0.0.1';
const port = 4173;
const url = 'http://127.0.0.1:4173/';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const probe = createServer();
try {
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(port, host, resolve);
  });
  await new Promise(resolve => probe.close(resolve));
} catch {
  console.error('Port 4173 deja utilise. Fermez le serveur precedent puis relancez.');
  process.exit(1);
}
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','preview','--host',host,'--port',String(port),'--strictPort'], {stdio:'inherit'});
let context;
let terminal;
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  terminal?.close();
  if (context) await context.close().catch(()=>{});
  server.kill();
}
process.on('SIGINT',()=>{void stop();});
process.on('SIGTERM',()=>{void stop();});
try {
  let ready = false;
  for (let i=0;i<100;i++) {
    if (server.exitCode !== null || stopping) break;
    try {
      const response = await fetch(url,{signal:AbortSignal.timeout(1000)});
      if (response.ok) { ready = true; break; }
    } catch {}
    await sleep(200);
  }
  if (!ready) throw new Error('Le serveur de previsualisation ne repond pas.');
  const profileRoot = join(process.env.LOCALAPPDATA || process.env.TEMP || process.cwd(),'CardForge-Preview');
  for (const channel of ['msedge','chrome']) {
    try {
      context = await chromium.launchPersistentContext(join(profileRoot,channel),{
        channel,headless:false,...devices['Pixel 7'],
        args:['--window-size=520,1000'],
      });
      break;
    } catch (error) {
      console.warn('Navigateur mobile indisponible : '+channel);
    }
  }
  if (context) {
    const page = context.pages()[0] || await context.newPage();
    const worker = readFileSync('dist/sw.js','utf8');
    const version = worker.match(/const CACHE_NAME = PREFIX [+] "([a-f0-9]{8})";/)?.[1];
    if (!version) throw new Error('Version du build PWA introuvable.');
    await openFreshPreview(context,page,url,version);
    console.log('Interface UX V2 chargee ; cache PWA du build '+version+' controle.');
    context.on('close',()=>{void stop();});
    console.log('\nVue mobile Pixel 7. Profil de test persistant : '+profileRoot);
    console.log('Attendez le message "prets hors ligne" dans CardForge.');
    console.log('Dans cette console : O + Entree = hors ligne ; N + Entree = en ligne ; Q + Entree = quitter.');
  } else {
    console.log('Ouverture du navigateur par defaut, sans emulation mobile. Si une ancienne interface apparait, Ctrl+F5 puis recharger apres activation de la PWA.');
    spawn('cmd.exe',['/d','/c','start','',''+url],{stdio:'ignore',windowsHide:true});
    console.log('F12 puis Ctrl+Shift+M pour la vue mobile. Utilisez Network > Offline pour tester.');
    console.log('Q + Entree = arreter le serveur.');
  }
  terminal = createInterface({input:process.stdin,output:process.stdout});
  terminal.on('line',async line=>{
    const key=line.trim().toLowerCase();
    if(key==='q') await stop();
    else if(context && (key==='o'||key==='n')) {
      try { await context.setOffline(key==='o'); console.log(key==='o'?'Mode hors ligne active.':'Connexion reactivee.'); }
      catch(error) { console.error(String(error)); }
    }
  });
} catch(error) {
  console.error(String(error));
  process.exitCode=1;
  await stop();
}
