import test from "node:test";
import assert from "node:assert/strict";
import { makeDeckWithJokers } from "../src/core/cards.ts";
import { grimDelveEngine } from "../src/games/clear-the-dungeon/engine.ts";
import { thunderfighterEngine } from "../src/games/gridcannon/engine.ts";

const allCards = makeDeckWithJokers().map(card => card.id).sort();
const zones = {
  "clear-the-dungeon": state => [
    ...state.columns.flat(), ...state.defeated,
    ...state.hand, ...state.drawPile, ...state.damages, ...state.removed,
    ...state.attacks.flatMap(attack => attack.powers.map(card => card.cardId)),
  ],
  gridcannon: state => [
    ...state.grid.flat(), ...state.figureSlots.filter(Boolean), ...state.pendingFigures,
    ...state.drawPile, ...state.specialReserve, ...state.spentSpecials,
    ...(state.searchBuffer ?? []),
    ...(state.pendingNumeric ? [state.pendingNumeric] : []),
    ...(state.armorCards ?? []).map(card => card.cardId),
  ],
};

for(const [label, engine, zone] of [
  ["Grim Delve", grimDelveEngine, zones["clear-the-dungeon"]],
  ["Thunderfighter", thunderfighterEngine, zones.gridcannon],
]){
  test(`${label}: 16 deterministic seeds preserve all 54 identities through real legal transitions`,()=>{
    for(let seed=1;seed<=16;seed++){
      let state=engine.createInitialState({seed:seed*8191});
      for(let step=0;step<75;step++){
        const ids=zone(state);
        assert.equal(ids.length,54,`${label} seed=${seed} step=${step}: physical card count`);
        assert.deepEqual([...ids].sort(),allCards,`${label} seed=${seed} step=${step}: no missing or duplicate IDs`);
        assert.deepEqual(engine.validateState(state),{valid:true},`${label} seed=${seed} step=${step}`);
        const actions=engine.getLegalActions(state);
        if(!actions.length)break;
        const action=actions[(seed*13+step*7)%actions.length];
        const before=structuredClone(state);
        const a=engine.transition(state,action);
        const b=engine.transition(state,action);
        assert.equal(a.accepted,true,`${label} seed=${seed} step=${step}, action=${JSON.stringify(action)}`);
        assert.deepEqual(state,before,`${label} mutates its prior state`);
        assert.deepEqual(a,b,`${label} deterministic transition`);
        state=a.state;
      }
    }
  });
  test(`${label}: corrupt snapshots and illegal moves cannot create wins or fabricate a card`,()=>{
    const state=engine.createInitialState({seed:67321});
    const before=structuredClone(state);
    assert.equal(engine.validateState(state).valid,true);
    const invalid=structuredClone(state);
    if(label==="Grim Delve")invalid.hand[0]=invalid.drawPile[0];
    else invalid.grid[0][0]=invalid.drawPile[0];
    assert.equal(engine.validateState(invalid).valid,false);
    assert.deepEqual(engine.getLegalActions(invalid),[]);
    const refused=engine.transition(state,{type:"invalid-cardforge-test-action"});
    assert.equal(refused.accepted,false);
    assert.strictEqual(refused.state,state);
    assert.deepEqual(state,before);
    assert.notEqual(engine.getOutcome(state),"win");
  });
}
