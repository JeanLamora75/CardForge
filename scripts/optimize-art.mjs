import {readFileSync} from "node:fs";
import {readFile,mkdir,writeFile,rename} from "node:fs/promises";
import {availableParallelism} from "node:os";
import {dirname,resolve} from "node:path";
import {createHash} from "node:crypto";
import sharp from "sharp";
import {sha256,cachedArtMatches,boundedMap} from "./startup-state.mjs";
const cachePath=".cardforge-cache/art.json";
let previous={};try{previous=JSON.parse(readFileSync(cachePath,"utf8"));}catch{try{previous=JSON.parse(readFileSync("node_modules/.cache/cardforge-art.json","utf8"));}catch{}}
const next={};
const manifest=JSON.parse(readFileSync("_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json","utf8"));
// Le fond de plateau est contrôlé par son empreinte Git, puis optimisé comme les autres PNG.
const boardPath="public/assets/boards/grim-delve.png";
const boardSource=readFileSync(boardPath);
const boardGitSha=createHash("sha1").update(`blob ${boardSource.length}\0`).update(boardSource).digest("hex");
if(boardGitSha!=="8ef3221256d82a02ff5d62c58607c49c8c24711a")throw Error("Original Git checksum mismatch: "+boardPath);
const boardMetadata=await sharp(boardSource).metadata();
manifest.push({path:boardPath,width:boardMetadata.width,height:boardMetadata.height,mode:boardMetadata.hasAlpha?"RGBA":"RGB",sha256:createHash("sha256").update(boardSource).digest("hex")});
if(new Set(manifest.map(item=>item.path)).size!==manifest.length)throw Error("Duplicate asset manifest path");
const targets=manifest.filter(item=>item.path.startsWith("public/assets/"));
const concurrency=Math.max(1,Math.min(4,Math.floor(availableParallelism()/2)));
let converted=0,reused=0;
const report=(done,total)=>{if(process.send)process.send({type:"art-progress",done,total,converted,reused});};
report(0,targets.length);
await boundedMap(manifest,concurrency,async item=>{
 const source=await readFile(item.path);
 if(createHash("sha256").update(source).digest("hex")!==item.sha256)throw Error("Original checksum mismatch: "+item.path);
 if(!item.path.startsWith("public/assets/"))return;
 const target=resolve("public/art",item.path.slice("public/assets/".length).replace(/\.png$/,".webp"));
 await mkdir(dirname(target),{recursive:true});
 const size=(item.path.includes("/worlds")||item.path.includes("/boards/"))?1600:item.path.includes("/covers/")?760:1000;
 const key=sha256(JSON.stringify([item.sha256,size,82,90,sharp.versions]));
 let existing;try{existing=await readFile(target);}catch(error){if(error.code!=="ENOENT")throw error;}
 if(existing&&cachedArtMatches(previous[item.path],key,existing)){next[item.path]=previous[item.path];reused++;report(converted+reused,targets.length);return;}
 const buffer=await sharp(source).resize({width:size,height:size,fit:"inside",withoutEnlargement:true}).webp({quality:82,alphaQuality:90}).toBuffer();
 await writeFile(target,buffer);
 next[item.path]={key,output:sha256(buffer)};
 converted++;report(converted+reused,targets.length);
 console.log(item.path+" -> "+buffer.length+" bytes");
});

await mkdir(dirname(cachePath),{recursive:true});
await writeFile(cachePath+".tmp",JSON.stringify(next));
await rename(cachePath+".tmp",cachePath);
console.log("Illustrations vérifiées : "+Object.keys(next).length+" ; converties : "+converted+" ; réutilisées : "+reused+" ; parallélisme : "+concurrency);
