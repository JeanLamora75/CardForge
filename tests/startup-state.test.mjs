import {test} from "node:test";
import assert from "node:assert/strict";
import {nextStartupState,startupStages,sha256,cachedArtMatches,dependencyFingerprint,dependenciesReady} from "../scripts/startup-state.mjs";
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
test("startup advances only through completed milestones and cannot show premature 100%",()=>{let state={progress:0};for(const stage of Object.keys(startupStages))state=nextStartupState(state,stage);assert.equal(state.progress,100);assert.throws(()=>nextStartupState({progress:90},"cache",100));assert.throws(()=>nextStartupState({progress:90},"deps"));});
test("art cache verifies both transform fingerprint and actual output",()=>{const output=Buffer.from("webp"),entry={key:"a",output:sha256(output)};assert.equal(cachedArtMatches(entry,"a",output),true);assert.equal(cachedArtMatches(entry,"b",output),false);assert.equal(cachedArtMatches(entry,"a",Buffer.from("corrupt")),false);});
test("dependency cache invalidates on lock change or missing package",()=>{const root=mkdtempSync(join(tmpdir(),"cf-startup-"));try{writeFileSync(join(root,"package.json"),"{}");writeFileSync(join(root,"package-lock.json"),"{}");mkdirSync(join(root,"node_modules"));const fp=dependencyFingerprint(root);writeFileSync(join(root,"node_modules",".cardforge-install"),fp);assert.equal(dependenciesReady(root,fp),false);for(const name of ["vite","typescript","playwright","sharp","react","react-dom"]){mkdirSync(join(root,"node_modules",name));writeFileSync(join(root,"node_modules",name,"package.json"),"{}");}assert.equal(dependenciesReady(root,fp),true);writeFileSync(join(root,"package-lock.json"),"{ }");assert.equal(dependenciesReady(root,dependencyFingerprint(root)),false);}finally{rmSync(root,{recursive:true,force:true});}});

import {artProgress,boundedMap} from "../scripts/startup-state.mjs";
test("artwork progress spans 20–64 without claiming compilation complete",()=>{
 assert.equal(artProgress(0,290),20);assert.equal(artProgress(290,290),64);
 let last=20;for(let i=0;i<=290;i++){const current=artProgress(i,290);assert.ok(current>=last);last=current;}
 assert.throws(()=>artProgress(291,290));assert.throws(()=>artProgress(0,0));
});
test("bounded workers report each successful completion exactly once",async()=>{
 let active=0,max=0;const reports=[];
 await boundedMap([1,2,3,4,5],2,async()=>{active++;max=Math.max(max,active);await new Promise(r=>setTimeout(r,5));active--;},(done,total)=>reports.push([done,total]));
 assert.equal(max,2);assert.deepEqual(reports,[[1,5],[2,5],[3,5],[4,5],[5,5]]);
 await assert.rejects(boundedMap([1,2],2,async()=>{throw Error("broken");}),/broken/);
});
