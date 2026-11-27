import {test} from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,mkdir,writeFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {treeFingerprint,buildInputFingerprint,reusableBuild,rememberBuild,invalidateBuild} from "../scripts/build-cache.mjs";
test("build cache requires unchanged source and exact output contents",async()=>{
 const root=await mkdtemp(join(tmpdir(),"cf-build-"));
 try{
  for(const dir of ["src","public","dist"])await mkdir(join(root,dir));
  for(const file of ["package.json","package-lock.json","index.html","tsconfig.json","src/app.ts","public/a.png","dist/sw.js"])await writeFile(join(root,file),"initial");
  const initial=await buildInputFingerprint(root);
  assert.equal(await reusableBuild(root,initial),false);
  await rememberBuild(root,initial);assert.equal(await reusableBuild(root,initial),true);
  await writeFile(join(root,"src/app.ts"),"modified");assert.notEqual(await buildInputFingerprint(root),initial);
  assert.equal(await reusableBuild(root,await buildInputFingerprint(root)),false);
  await writeFile(join(root,"src/app.ts"),"initial");
  await writeFile(join(root,"dist/sw.js"),"corrupt");assert.equal(await reusableBuild(root,initial),false);
  await writeFile(join(root,"dist/sw.js"),"initial");assert.equal(await reusableBuild(root,initial),true);
  await writeFile(join(root,"public/new.png"),"new");assert.notEqual(await buildInputFingerprint(root),initial);
  await rm(join(root,"public/new.png"));assert.equal(await buildInputFingerprint(root),initial);
  await invalidateBuild(root);assert.equal(await reusableBuild(root,initial),false);
 }finally{await rm(root,{recursive:true,force:true});}
});
