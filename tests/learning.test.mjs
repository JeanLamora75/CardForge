import test from "node:test";
import assert from "node:assert/strict";
import { createTutorialSession, readLearningPreferences, saveLearningPreferences } from "../src/application/learning.ts";
import { grimDelveEngine } from "../src/games/clear-the-dungeon/engine.ts";
import { thunderfighterEngine } from "../src/games/gridcannon/engine.ts";

function fakePreferences() {
  const values = new Map();
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
test("CAR-33: first access is per-game, no persisted game choice is invented", () => {
  const storage = fakePreferences();
  assert.deepEqual(readLearningPreferences(storage, "clear-the-dungeon"), {choice:null,hintsEnabled:true});
  assert.deepEqual(readLearningPreferences(storage, "gridcannon"), {choice:null,hintsEnabled:true});
  assert.equal(saveLearningPreferences(storage, "clear-the-dungeon", {choice:"learn",hintsEnabled:false}), true);
  assert.deepEqual(readLearningPreferences(storage, "clear-the-dungeon"), {choice:"learn",hintsEnabled:false});
  assert.deepEqual(readLearningPreferences(storage, "gridcannon"), {choice:null,hintsEnabled:true});
  assert.equal(saveLearningPreferences(storage, "gridcannon", {choice:"play",hintsEnabled:true}), true);
  assert.deepEqual(readLearningPreferences(storage, "gridcannon"), {choice:"play",hintsEnabled:true});
  assert.equal(storage.values.size,2);
});
test("CAR-33: hints can be disabled without changing access to the rules or chosen mode", () => {
  const storage = fakePreferences();
  const prefs = {choice:"play",hintsEnabled:true};
  saveLearningPreferences(storage,"gridcannon",prefs);
  saveLearningPreferences(storage,"gridcannon",{...prefs,hintsEnabled:false});
  assert.deepEqual(readLearningPreferences(storage,"gridcannon"),{choice:"play",hintsEnabled:false});
  assert.deepEqual(readLearningPreferences(null,"gridcannon"),{choice:null,hintsEnabled:true});
  storage.values.set("cardforge.learning.v1.gridcannon","{bad");
  assert.deepEqual(readLearningPreferences(storage,"gridcannon"),{choice:null,hintsEnabled:true});
});
for (const [name, engine, seed] of [
  ["Grim Delve",grimDelveEngine,3301],
  ["Thunderfighter",thunderfighterEngine,3201],
]) {
  test(`CAR-33: ${name} exercise stays in memory and restarts from the same scenario`, async () => {
    const original = engine.createInitialState({seed});
    const first = createTutorialSession(engine,{seed});
    const initial = first.getState();
    assert.deepEqual(initial, original);
    assert.deepEqual(engine.validateState(initial),{valid:true});
    const legal = first.getLegalActions();
    assert.ok(legal.length > 0);
    const action = legal[0];
    const output = await first.dispatch(action);
    assert.equal(output.accepted,true);
    assert.deepEqual(engine.validateState(output.state),{valid:true});
    assert.deepEqual(first.getState(),output.state);
    const restarted = createTutorialSession(engine,{seed});
    assert.deepEqual(restarted.getState(),initial);
    assert.deepEqual(engine.validateState(restarted.getState()),{valid:true});
  });
}
test("CAR-33: rejected training action does not modify the tutorial state", async () => {
  const tutorial = createTutorialSession(thunderfighterEngine,{seed:3201});
  const previous = tutorial.getState();
  const rejected = await tutorial.dispatch({type:"place-number",cell:999});
  assert.equal(rejected.accepted,false);
  assert.deepEqual(tutorial.getState(),previous);
});
