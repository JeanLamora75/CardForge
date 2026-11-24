import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { games } from "../src/catalog.ts";
import { ATTRIBUTIONS } from "../src/application/credits.ts";
import {
  GAME_RELEASE_EVIDENCE, RELEASE_CRITERIA, checkGamePublication,
  assertCatalogueReleaseSafety, publicationReadyCount,
} from "../src/application/publication-gate.ts";

test("all five public game IDs have a release dossier with matching approved public title and creator credit",()=>{
  assert.deepEqual(Object.keys(GAME_RELEASE_EVIDENCE).sort(),games.map(game=>game.id).sort());
  assert.deepEqual(games.map(game=>GAME_RELEASE_EVIDENCE[game.id].publicName),games.map(game=>game.title));
  assert.deepEqual(ATTRIBUTIONS.map(a=>a.gameId),games.map(game=>game.id));
  for(const game of games){
    const checks=GAME_RELEASE_EVIDENCE[game.id].criteria;
    assert.deepEqual(Object.keys(checks).sort(),[...RELEASE_CRITERIA].sort());
    for(const field of RELEASE_CRITERIA){
      assert.ok(checks[field].note.length>20,game.id+" lacks documentary context for "+field);
      if(checks[field].verified)assert.ok(new URL(checks[field].reference).protocol==="https:");
    }
  }
});
test("two MVP and three future games cannot be published from test coverage, title choice or attribution alone",()=>{
  assert.equal(publicationReadyCount(),0);
  assert.deepEqual(games.map(game=>checkGamePublication(GAME_RELEASE_EVIDENCE[game.id]).allowed),
    [false,false,false,false,false]);
  assert.ok(checkGamePublication(GAME_RELEASE_EVIDENCE["clear-the-dungeon"]).missing.includes("adaptationPermission"));
  assert.ok(checkGamePublication(GAME_RELEASE_EVIDENCE.gridcannon).missing.includes("publicTitle"));
  assert.ok(games.slice(2).every(game=>game.status==="coming-soon"));
  assertCatalogueReleaseSafety(games);
});
test("a fraudulent Available flag is rejected regardless of a playable local route",()=>{
  const forged=games.map((game,i)=>i===0?{...game,status:"available",playableRoute:"/play/clear-the-dungeon"}:game);
  assert.throws(()=>assertCatalogueReleaseSafety(forged),/Publication blocked for Grim Delve/);
  const grid=games.map(game=>game.id==="gridcannon"?{...game,status:"available",playableRoute:"/play/gridcannon"}:game);
  assert.throws(()=>assertCatalogueReleaseSafety(grid),/Publication blocked for Thunderfighter/);
});
test("complete evidence requires every specific criterion with genuine reference and a playable route",()=>{
  const base=GAME_RELEASE_EVIDENCE["clear-the-dungeon"];
  const approved={...base,criteria:Object.fromEntries(RELEASE_CRITERIA.map(key=>
    [key,{verified:true,reference:"https://example.org/approved/"+key,note:"Documented specific review for "+key}]))};
  assert.equal(checkGamePublication(approved).allowed,true);
  assert.doesNotThrow(()=>assertCatalogueReleaseSafety(
    games.map((game,i)=>i===0?{...game,status:"available",playableRoute:"/play/clear-the-dungeon"}:game),
    {...GAME_RELEASE_EVIDENCE,"clear-the-dungeon":approved}));
  assert.throws(()=>assertCatalogueReleaseSafety(
    games.map((game,i)=>i===0?{...game,status:"available",playableRoute:null}:game),
    {...GAME_RELEASE_EVIDENCE,"clear-the-dungeon":approved}),/Publication blocked/);
  const missingReference={...approved,criteria:{...approved.criteria,
    adaptationPermission:{verified:true,reference:null,note:"Claim without proof"}}};
  assert.ok(checkGamePublication(missingReference).invalidEvidence.includes("adaptationPermission"));
  assert.equal(checkGamePublication(missingReference).allowed,false);
});
test("publication CLI is non-blocking for internal CI audit but refuses release of both unapproved MVP games",()=>{
  const run=args=>spawnSync(process.execPath,["scripts/audit-publication-gate.mjs",...args],
    {cwd:process.cwd(),encoding:"utf8"});
  const audit=run([]);
  assert.equal(audit.status,0,audit.stderr);
  assert.match(audit.stdout,/Grim Delve: BLOCKED/);
  assert.match(audit.stdout,/Thunderfighter: BLOCKED/);
  const publish=run(["--require-mvp-publication"]);
  assert.equal(publish.status,1);
  assert.match(publish.stderr,/PUBLICATION REFUSED/);
});
