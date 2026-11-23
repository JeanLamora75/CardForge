import test from "node:test";
import assert from "node:assert/strict";
import { games } from "../src/catalog.ts";
import { APP_VERSION, ATTRIBUTIONS, NOTICE_REFERENCES } from "../src/application/credits.ts";
import appPackage from "../package.json" with { type: "json" };

test("the visible application version is the released package version",()=>{
  assert.equal(APP_VERSION,appPackage.version);
  assert.match(APP_VERSION,/^\d+\.\d+\.\d+/);
});
test("the five approved public titles map one-to-one to original games and stable game IDs",()=>{
  assert.deepEqual(ATTRIBUTIONS.map(x=>[x.gameId,x.publicName,x.originalTitle]),[
    ["clear-the-dungeon","Grim Delve","Clear the Dungeon"],
    ["gridcannon","Thunderfighter","Gridcannon Version 2"],
    ["card-capture","Skydeck","Card Capture"],
    ["loot-the-loop","Midnight Syndicate","Loot the Loop"],
    ["regicide","Les Douze Tyrans","Regicide"],
  ]);
  assert.deepEqual(ATTRIBUTIONS.map(x=>x.gameId),games.map(x=>x.id));
  assert.deepEqual(ATTRIBUTIONS.map(x=>x.publicName),games.map(x=>x.title));
});
test("each game clearly credits its author, source and distinct original CardForge visual universe",()=>{
  assert.deepEqual(ATTRIBUTIONS.map(x=>x.originalAuthors),[
    "Mark S. Ball","Tom Francis","Lucas Gentry","Wil Su (Isaludo)","Paul Abrahams, Luke Badger et Andy Richdale",
  ]);
  for(const item of ATTRIBUTIONS){
    assert.equal(new URL(item.source).protocol,"https:");
    assert.ok(item.visualUniverseFr.includes("CardForge"),item.gameId);
    assert.ok(item.visualUniverseEn.includes("CardForge"),item.gameId);
    assert.ok(item.licenceFr.length>25 && item.licenceEn.length>25);
    assert.ok(item.permissionFr.length>25 && item.permissionEn.length>25);
  }
});
test("no licence notice presents unverified adaptation or public-name clearance as granted",()=>{
  const combined=ATTRIBUTIONS.map(x=>x.permissionEn).join(" ");
  assert.ok(combined.includes("not cleared"));
  assert.ok(combined.includes("not legally cleared"));
  assert.ok(combined.includes("not verified") || combined.includes("not independently verified"));
  const grim=ATTRIBUTIONS[0];
  assert.match(grim.licenceFr,/BY-NC-ND 4\.0/);
  assert.match(grim.permissionFr,/déclaré/);
  assert.match(grim.permissionFr,/non vérifiés/);
  assert.ok(ATTRIBUTIONS.filter(x=>x.gameId==="gridcannon")[0].permissionFr.includes("pas juridiquement validé"));
  assert.equal(NOTICE_REFERENCES.releaseGate,"https://lmn24.atlassian.net/browse/CAR-43");
});
