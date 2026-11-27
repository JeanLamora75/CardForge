import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
export const sha256 = data => createHash("sha256").update(data).digest("hex");
export const startupStages = Object.freeze({start:0,deps:5,art:20,build:65,verify:80,cache:90,ready:100});
export function nextStartupState(previous,stage,progress=startupStages[stage]){
 if(!Object.hasOwn(startupStages,stage)||!Number.isInteger(progress)||progress<previous.progress||progress>100||(progress===100&&stage!=="ready")||(stage==="ready"&&progress!==100))throw Error("Invalid startup progress");
 return {stage,progress,error:false};
}
export function dependencyFingerprint(root, runtime=process){
 return sha256(JSON.stringify([runtime.version,runtime.platform,runtime.arch,readFileSync(root+"/package.json","utf8"),readFileSync(root+"/package-lock.json","utf8")]));
}
export function dependenciesReady(root,fingerprint){
 try{return readFileSync(root+"/node_modules/.cardforge-install","utf8")===fingerprint&&["vite","typescript","playwright","sharp","react","react-dom"].every(name=>existsSync(root+"/node_modules/"+name+"/package.json"));}catch{return false;}
}
export function cachedArtMatches(entry,key,output){return !!entry&&entry.key===key&&entry.output===sha256(output);}

export function artProgress(done,total){
 if(!Number.isInteger(done)||!Number.isInteger(total)||total<1||done<0||done>total)throw Error("Invalid artwork count");
 return 20+Math.floor(44*done/total);
}
export async function boundedMap(items,limit,work,onDone=()=>{}){
 if(!Number.isInteger(limit)||limit<1)throw Error("Invalid concurrency");
 let cursor=0,done=0,failure;
 await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{
  while(!failure&&cursor<items.length){const index=cursor++;try{await work(items[index],index);onDone(++done,items.length);}catch(error){failure=error;}}
 }));
 if(failure)throw failure;
}
