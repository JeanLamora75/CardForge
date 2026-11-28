import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_SETTINGS, SETTINGS_KEY, motionAllowed, normalizeSettings,
  readSharedSettings, saveSharedSettings,
} from "../src/application/shared-settings.ts";
import { grimDelveEngine } from "../src/games/clear-the-dungeon/engine.ts";
import { thunderfighterEngine } from "../src/games/gridcannon/engine.ts";

const storage = () => {
  const data = new Map();
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};
test("shared sound and visual settings default to silent system behavior", () => {
  assert.deepEqual(readSharedSettings(storage()), DEFAULT_SETTINGS);
  assert.deepEqual(readSharedSettings(null), DEFAULT_SETTINGS);
  assert.deepEqual(normalizeSettings({ music:true, sounds:false, musicVolume:100, soundsVolume:0, ambienceVolume:0, animations:"off", hints:false }),
    { music:true, sounds:false, musicVolume:100, soundsVolume:0, ambienceVolume:0, animations:"off", hints:false });
});
test("four controls persist separately and invalid data never enables unwanted sound", () => {
  const db=storage();
  const selection={music:true,sounds:false,musicVolume:35,soundsVolume:0,ambienceVolume:0,animations:"off",hints:false};
  assert.equal(saveSharedSettings(db,selection),true);
  assert.deepEqual(readSharedSettings(db),selection);
  assert.equal(db.data.size,1);
  assert.deepEqual(JSON.parse(db.data.get(SETTINGS_KEY)),selection);
  db.data.set(SETTINGS_KEY,JSON.stringify({music:"1",sounds:"yes",animations:"hyper",hints:null}));
  assert.deepEqual(readSharedSettings(db),DEFAULT_SETTINGS);
  db.data.set(SETTINGS_KEY,"{oops");
  assert.deepEqual(readSharedSettings(db),DEFAULT_SETTINGS);
  assert.equal(saveSharedSettings({getItem:()=>null,setItem:()=>{throw Error("denied")}},selection),false);
});
test("legacy per-game hint opt-out migrates without modifying learning choices", () => {
  const db=storage();
  db.data.set("cardforge.learning.v1.gridcannon",JSON.stringify({choice:"learn",hintsEnabled:false}));
  assert.equal(readSharedSettings(db).hints,false);
  assert.equal(db.data.size,1);
  assert.deepEqual(JSON.parse(db.data.get("cardforge.learning.v1.gridcannon")),{choice:"learn",hintsEnabled:false});
  saveSharedSettings(db,{...DEFAULT_SETTINGS,hints:true});
  assert.equal(readSharedSettings(db).hints,true);
});
test("system motion preference and explicit overrides are predictable", () => {
  assert.equal(motionAllowed("system",true),false);
  assert.equal(motionAllowed("system",false),true);
  assert.equal(motionAllowed("on",true),true);
  assert.equal(motionAllowed("on",false),true);
  assert.equal(motionAllowed("off",true),false);
  assert.equal(motionAllowed("off",false),false);
});
test("settings toggles leave cards, legal actions and both game states unchanged", () => {
  for (const [engine, seed] of [[grimDelveEngine,6301],[thunderfighterEngine,6302]]) {
    const initial=engine.createInitialState({seed});
    const actions=engine.getLegalActions(initial);
    const before=structuredClone(initial);
    const db=storage();
    saveSharedSettings(db,{music:true,sounds:true,animations:"off",hints:false});
    readSharedSettings(db);
    assert.deepEqual(initial,before);
    assert.deepEqual(engine.getLegalActions(initial),actions);
    assert.deepEqual(engine.validateState(initial),{valid:true});
  }
});

test("legacy audio preferences migrate and numerical volume wins",()=>{const db=storage();db.data.set(SETTINGS_KEY,JSON.stringify({music:true,sounds:false,animations:"off",hints:false}));assert.deepEqual(readSharedSettings(db),{music:true,sounds:false,musicVolume:100,soundsVolume:0,ambienceVolume:0,animations:"off",hints:false});assert.deepEqual(normalizeSettings({music:true,musicVolume:0,sounds:false,soundsVolume:65}),{...DEFAULT_SETTINGS,sounds:true,soundsVolume:65});assert.equal(normalizeSettings({musicVolume:120}).musicVolume,100);assert.equal(normalizeSettings({soundsVolume:-5}).soundsVolume,0);});
