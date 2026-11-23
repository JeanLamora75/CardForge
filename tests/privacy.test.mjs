import test from "node:test";
import assert from "node:assert/strict";
import { PRIVACY_INVENTORY, DELETION_POLICY, OWNED_PREFERENCE_KEYS, PRIVACY_GAME_IDS, executePrivacyDeletion, clearCardForgePreferences } from "../src/application/privacy.ts";

test("privacy inventory covers every persisted data family and temporary tutorials", () => {
  const actual=PRIVACY_INVENTORY.map(item=>item.id);
  assert.deepEqual(actual,["sessions","results","statistics","language","settings","learning","tutorial"]);
  assert.equal(new Set(actual).size,actual.length);
  for(const entry of PRIVACY_INVENTORY){
    assert.ok(entry.descriptionFr.length>10);
    assert.ok(entry.descriptionEn.length>10);
    assert.ok(entry.effectFr.length>10);
    assert.ok(entry.effectEn.length>10);
  }
  assert.equal(PRIVACY_INVENTORY.find(item=>item.id==="tutorial")?.area,"memory");
  assert.ok(PRIVACY_INVENTORY.filter(item=>item.area==="indexeddb").length===3);
  assert.ok(PRIVACY_INVENTORY.filter(item=>item.area==="localStorage").length===3);
});
test("approved option B does not delete any data when confirmation is cancelled", async () => {
  assert.equal(DELETION_POLICY,"approved-option-b");
  let writes=0;
  const gameStorage={deleteGame:async()=>{writes++;},deleteAllGames:async()=>{writes++;}};
  const prefs={removeItem(){writes++;}};
  for(const scope of [{kind:"game",gameId:"gridcannon"},{kind:"preferences"},{kind:"all"}]){
    assert.equal(await executePrivacyDeletion(scope,false,gameStorage,prefs),false);
  }
  assert.equal(writes,0);
});
test("per-game deletion leaves all preferences and other games untouched",async()=>{
  const removed=[];
  const gameStorage={deleteGame:async id=>removed.push(id),deleteAllGames:async()=>{throw Error("wrong scope");}};
  const prefs={removeItem(){throw Error("preferences should remain");}};
  assert.equal(await executePrivacyDeletion({kind:"game",gameId:"gridcannon"},true,gameStorage,prefs),true);
  assert.deepEqual(removed,["gridcannon"]);
  assert.equal(PRIVACY_GAME_IDS.length,5);
});
test("preferences deletion removes only owned keys and preserves IndexedDB data",async()=>{
  const removed=[];
  const gameStorage={deleteGame:async()=>{throw Error("wrong scope");},deleteAllGames:async()=>{throw Error("wrong scope");}};
  const prefs={removeItem:key=>removed.push(key)};
  assert.equal(await executePrivacyDeletion({kind:"preferences"},true,gameStorage,prefs),true);
  assert.deepEqual(removed,[...OWNED_PREFERENCE_KEYS]);
  assert.equal(OWNED_PREFERENCE_KEYS.length,7);
  assert.ok(removed.every(key=>key.startsWith("cardforge.")));
});
test("full deletion clears games and only named CardForge preference keys",async()=>{
  const events=[];
  const gameStorage={deleteGame:async()=>{throw Error("wrong scope");},deleteAllGames:async()=>events.push("games")};
  const prefs={removeItem:key=>events.push(key)};
  assert.equal(await executePrivacyDeletion({kind:"all"},true,gameStorage,prefs),true);
  assert.deepEqual(events,["games",...OWNED_PREFERENCE_KEYS]);
});
test("invalid game IDs and preference storage failures are rejected without deleting other stores",async()=>{
  let games=0;
  const gameStorage={deleteGame:async()=>{games++;},deleteAllGames:async()=>{games++;}};
  await assert.rejects(()=>executePrivacyDeletion({kind:"game",gameId:"unknown"},true,gameStorage,null),TypeError);
  await assert.rejects(()=>executePrivacyDeletion({kind:"preferences"},true,gameStorage,null));
  await assert.rejects(()=>executePrivacyDeletion({kind:"all"},true,gameStorage,null));
  assert.equal(games,0);
  const throwing={removeItem(){throw Error("storage unavailable");}};
  assert.throws(()=>clearCardForgePreferences(throwing));
});

