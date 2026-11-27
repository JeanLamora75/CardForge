import { createHash } from "node:crypto";
import { readdir, readFile, mkdir, writeFile, rename, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { dependencyFingerprint } from "./startup-state.mjs";

// Hash file names and contents, including additions and removals; never trust timestamps alone.
export async function treeFingerprint(root,entries){
 const hash=createHash("sha256");
 async function visit(relative){
  const full=join(root,relative);
  const info=await import("node:fs/promises").then(fs=>fs.lstat(full));
  if(info.isDirectory()){
   const names=(await readdir(full)).sort();
   for(const name of names)await visit(relative+"/"+name);
  }else if(info.isFile()){
   const digest=createHash("sha256").update(await readFile(full)).digest("hex");
   hash.update(JSON.stringify([relative,digest])+"\n");
  }else throw Error("Unsupported build input: "+relative);
 }
 for(const entry of [...entries].sort())await visit(entry);
 return hash.digest("hex");
}
export async function buildInputFingerprint(root){
 const configs=(await readdir(root)).filter(name=>/^(?:tsconfig.*\.json|vite\.config\..*|\.env(?:\..*)?|\.npmrc|postcss\.config\..*|tailwind\.config\..*)$/.test(name));
 const input=await treeFingerprint(root,["src","public","index.html","package.json","package-lock.json",...configs]);
 const env=createHash("sha256").update(JSON.stringify(Object.entries(process.env).filter(([key])=>/^(VITE_|NODE_ENV$|MODE$)/.test(key)).sort())).digest("hex");
 return createHash("sha256").update(JSON.stringify([input,dependencyFingerprint(root),env])).digest("hex");
}
export async function reusableBuild(root,input){
 try{
  const record=JSON.parse(await readFile(join(root,".cardforge-cache/build.json"),"utf8"));
  return record.input===input&&record.output===await treeFingerprint(root,["dist"]);
 }catch{return false;}
}
export async function rememberBuild(root,input){
 const path=join(root,".cardforge-cache/build.json");
 const output=await treeFingerprint(root,["dist"]);
 await mkdir(dirname(path),{recursive:true});
 await writeFile(path+".tmp",JSON.stringify({input,output}));
 await rename(path+".tmp",path);
}
export async function invalidateBuild(root){await rm(join(root,".cardforge-cache/build.json"),{force:true});}
