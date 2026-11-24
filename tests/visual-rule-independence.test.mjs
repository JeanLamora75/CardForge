import test from "node:test";
import assert from "node:assert/strict";
import { grimDelveEngine } from "../src/games/clear-the-dungeon/engine.ts";
import { thunderfighterEngine } from "../src/games/gridcannon/engine.ts";

const stripPresentation = ({ cosmeticPresentation: _ignored, ...mechanics }) => mechanics;
const presentationA = Object.freeze({ theme: "fantasy", illustration: "warrior", music: "on" });
const presentationB = Object.freeze({ theme: "space", illustration: "starship", music: "off" });

for (const [reference, engine] of [["T-20", grimDelveEngine], ["GC-T26", thunderfighterEngine]]) {
  test(`${reference}: cosmetic-only metadata cannot change actual engine actions, cards or outcomes`,()=>{
    const initial=engine.createInitialState({seed: 91023});
    assert.deepEqual(engine.validateState(initial),{valid:true});
    const variants=[{...initial,cosmeticPresentation:presentationA},{...initial,cosmeticPresentation:presentationB}];
    for(const state of variants)assert.deepEqual(engine.validateState(state),{valid:true});
    let [left,right]=variants;
    for(let step=0;step<35;step++){
      assert.deepEqual(stripPresentation(left),stripPresentation(right),`mechanics diverged on step ${step}`);
      assert.deepEqual(engine.getLegalActions(left),engine.getLegalActions(right));
      assert.equal(engine.getOutcome(left),engine.getOutcome(right));
      const actions=engine.getLegalActions(left);
      if(!actions.length)break;
      const action=actions[(step*7+2)%actions.length];
      const first=engine.transition(left,action),second=engine.transition(right,action);
      assert.equal(first.accepted,true);
      assert.equal(second.accepted,true);
      assert.deepEqual(stripPresentation(first.state),stripPresentation(second.state));
      left=first.state;
      right=second.state;
    }
  });
}
