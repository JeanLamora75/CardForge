import test from "node:test";
import assert from "node:assert/strict";
import { makeDeckWithJokers } from "../src/core/cards.ts";
import { thunderfighterEngine, getThunderfighterResult } from "../src/games/gridcannon/engine.ts";

const all = makeDeckWithJokers().map(card => card.id);
const base = [
  "clubs-2", "hearts-6", "spades-5",
  "diamonds-6", "diamonds-7", "spades-8",
  "clubs-5", "hearts-9", "clubs-9",
];
function scenario() {
  const figureSlots = Array.from({length:12}, (_,i) => ({3:"clubs-11",6:"spades-11"})[i] ?? null);
  const grid = base.map(id => [id]);
  const used = [...base,...figureSlots.filter(Boolean),"hearts-10"];
  const state = {
    ...thunderfighterEngine.createInitialState({seed: 32}),
    phase: "playing", outcome: "in-progress", grid, figureSlots, defeatedFigures: [],
    pendingFigures: [], drawPile: all.filter(id => !used.includes(id)),
    specialReserve: [], spentSpecials: [], pendingNumeric: "hearts-10",
    searchBuffer: [], placingFromSearch: false, armorCards: [], lastShot: [],
    replacementSlot: null, replacementUsed: false, victoryScore: null, lossReason: null,
  };
  assert.deepEqual(thunderfighterEngine.validateState(state),{valid:true});
  return state;
}
test("CAR-32: preview via engine transition does not modify current state", () => {
  const state = scenario();
  const before = structuredClone(state);
  const action = {type:"place-number",cell:0};
  assert.ok(thunderfighterEngine.getLegalActions(state).some(a => JSON.stringify(a) === JSON.stringify(action)));
  const preview = thunderfighterEngine.transition(structuredClone(state),action);
  assert.equal(preview.accepted,true);
  assert.deepEqual(state,before);
  assert.deepEqual(preview.state.lastShot,["clubs-11","spades-11"]);
  assert.deepEqual(preview.state.defeatedFigures,["clubs-11","spades-11"]);
  assert.equal(getThunderfighterResult(preview.state).physicalCardCount,54);
  const confirmed = thunderfighterEngine.transition(state,action);
  assert.equal(confirmed.accepted,true);
  assert.deepEqual(confirmed.state,preview.state);
});
test("CAR-32: refused action leaves the grid unchanged", () => {
  const state = scenario();
  const before = structuredClone(state);
  const refused = thunderfighterEngine.transition(structuredClone(state),{type:"place-number",cell:9});
  assert.equal(refused.accepted,false);
  assert.deepEqual(state,before);
  assert.equal(getThunderfighterResult(state).physicalCardCount,54);
});
test("CAR-32: scenario exposes no secret future draw order in action choices", () => {
  const state = scenario();
  const legal = thunderfighterEngine.getLegalActions(state);
  assert.ok(legal.length > 0);
  assert.ok(legal.every(action => !("drawPile" in action) && !("nextCard" in action)));
});
