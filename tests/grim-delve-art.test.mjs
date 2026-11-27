import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {makeDeckWithJokers} from "../src/core/cards.ts";
import {grimCardView,grimCardBack} from "../src/application/grim-delve-art.ts";
const manifest=JSON.parse(readFileSync("_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json","utf8"));
test("all 54 physical cards have distinct art, localized labels and stable values",()=>{
 const deck=makeDeckWithJokers();
 const views=deck.map(c=>grimCardView(c.id,"fr"));
 assert.equal(new Set(views.map(v=>v.illustration)).size,54);
 for(const c of deck){
 const fr=grimCardView(c.id,"fr"),en=grimCardView(c.id,"en");
 assert.equal(fr.illustration,en.illustration);
 assert.equal(fr.value,"rank" in c?c.rank:10);
 assert.equal(fr.monster,"rank" in c&&c.rank>=11);
 assert.ok(fr.label&&en.label);
 }
 assert.equal(grimCardView("hearts-13","fr").title,"Le Souverain");
 assert.equal(grimCardView("hearts-13","en").title,"The Sovereign");
 assert.equal(grimCardView("joker-2","fr").title,"Le Dragon primordial");
});
test("all 64 original resources are registered and match their SHA256",()=>{
 const paths=new Set([grimCardBack]);
 for(const c of makeDeckWithJokers()){
 const v=grimCardView(c.id,"fr");paths.add(v.illustration);paths.add(v.frame);if(v.emblem)paths.add(v.emblem);
 }
 assert.equal(paths.size,64);
 for(const p of paths){
 const source="public/assets/"+p.replace(/\.webp$/,".png");
 const entry=manifest.find(x=>x.path===source);assert.ok(entry,source);
 assert.equal(createHash("sha256").update(readFileSync(source)).digest("hex"),entry.sha256,source);
 }
});
