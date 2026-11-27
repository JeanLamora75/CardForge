import test from "node:test";
import assert from "node:assert/strict";
import {grimEnding} from "../src/application/grim-delve-ending.ts";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
test("ending art and score reflect actual result in both languages",()=>{
 for(const language of ["fr","en"]){
 const state={outcome:"loss",endReason:"damage",defeated:Array(11).fill("x"),damages:Array(7).fill("x"),victoryScore:null};
 assert.equal(grimEnding(state,language).scene,"defeat-damage");
 assert.equal(grimEnding(state,language).score,null);
 assert.match(grimEnding(state,language).narrative,/11|un monstre|One monster/i);
 assert.equal(grimEnding({...state,endReason:"exhaustion",damages:[]},language).scene,"defeat-exhaustion");
 assert.equal(grimEnding({...state,outcome:"win",endReason:"victory",victoryScore:0},language).score,0);
 assert.equal(grimEnding({...state,outcome:"win",endReason:"victory",victoryScore:4},language).scene,"victory");
 }
});
test("ending art originals match manifest",()=>{
 const manifest=JSON.parse(readFileSync("_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json","utf8"));
 for(const scene of ["defeat-damage","defeat-exhaustion","victory"]){
 const path="public/assets/banners/grim-delve/end-"+scene+".png";
 const entry=manifest.find(x=>x.path===path);assert.ok(entry);
 assert.equal(createHash("sha256").update(readFileSync(path)).digest("hex"),entry.sha256);
 }
});
