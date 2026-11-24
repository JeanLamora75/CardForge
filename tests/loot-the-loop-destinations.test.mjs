import test from 'node:test';
import assert from 'node:assert/strict';
import { midnightSyndicateEngine as engine } from '../src/games/loot-the-loop/engine.ts';
const explore={type:'explore',distance:2};
const aces=['hearts-1','clubs-1','spades-1','diamonds-1'];
function fixture(destination,faceUp=true,lootIds=[],following='clubs-13') {
  const initial=engine.createInitialState({seed:49});
  const ids=['hearts-2','clubs-3',destination,following];
  return {...initial,deck:[...ids.map((id,i)=>({id,faceUp:i===0||i===3||(i===2&&faceUp)})),...initial.deck.filter(c=>!ids.includes(c.id)&&!lootIds.includes(c.id))],loot:lootIds.map(id=>({id,faceUp:true}))};
}
function apply(state,action=explore) {
  assert.equal(engine.validateState(state).valid,true);
  const before=structuredClone(state);
  const result=engine.transition(state,action);
  assert.equal(result.accepted,true);
  assert.deepEqual(state,before);
  assert.equal(engine.validateState(result.state).valid,true);
  assert.equal(result.state.deck.length+result.state.notes.length+result.state.loot.length,53);
  return result.state;
}
test('LTL-T09: visible J/Q/K destination ends the game',()=>{
  for(const id of ['spades-11','spades-12','spades-13']) {
    const state=fixture(id);
    const next=apply(state);
    assert.equal(next.outcome,'loss');
    assert.equal(next.phase,'finished');
    assert.deepEqual(next.deck,[...state.deck.slice(2),...state.deck.slice(0,2)]);
    assert.deepEqual(next.loot,state.loot);
    assert.equal(engine.getVictoryScore(next),null);
    assert.deepEqual(engine.getLegalActions(next),[]);
    for(const action of [explore,{type:'look-around'},{type:'mark-path'},{type:'return-to-path',noteIndex:0}]) {
      const result=engine.transition(next,action);
      assert.equal(result.accepted,false);
      assert.strictEqual(result.state,next);
    }
  }
});
test('LTL-T10/T11: visible ace or numeric is collected exactly once',()=>{
  for(const id of ['spades-1','spades-7']) {
    const state=fixture(id,true,['diamonds-9']);
    const next=apply(state);
    assert.deepEqual(next.loot,[...state.loot,{id,faceUp:true}]);
    assert.deepEqual(next.deck,[...state.deck.slice(3),...state.deck.slice(0,2)]);
    assert.equal(next.outcome,'in-progress');
    assert.equal(next.deck[0].id,'clubs-13');
  }
});
test('LTL-T12: visible Joker with fewer than four aces is not victory',()=>{
  for(let n=0;n<4;n++) {
    const next=apply(fixture('joker-1',true,aces.slice(0,n)));
    assert.equal(next.outcome,'in-progress');
    assert.equal(next.deck[0].id,'joker-1');
    assert.equal(next.loot.length,n);
    assert.equal(engine.getVictoryScore(next),null);
  }
});
test('LTL-T13: arrive on visible Joker after four aces; score counts cards',()=>{
  const state=fixture('joker-1',true,[...aces,'diamonds-10','spades-7']);
  const next=apply(state);
  assert.equal(next.outcome,'win');
  assert.equal(next.phase,'finished');
  assert.equal(engine.getVictoryScore(next),6);
  assert.deepEqual(next.loot,state.loot);
  assert.deepEqual(engine.getLegalActions(next),[]);
  const rejected=engine.transition(next,explore);
  assert.equal(rejected.accepted,false);
  assert.strictEqual(rejected.state,next);
});
test('hidden destinations do not trigger any result, even Joker with four aces',()=>{
  for(const id of ['spades-11','spades-7','joker-1']) {
    const state=fixture(id,false,aces);
    const next=apply(state);
    assert.equal(next.outcome,'in-progress');
    assert.deepEqual(next.deck[0],{id,faceUp:false});
    assert.deepEqual(next.loot,state.loot);
  }
});
test('observing Joker with four aces does not win',()=>{
  const state=apply(fixture('joker-1',false,aces));
  const next=apply(state,{type:'look-around'});
  assert.equal(next.deck[0].faceUp,true);
  assert.equal(next.outcome,'in-progress');
});
test('collecting fourth ace does not win even if next card is visible Joker',()=>{
  const next=apply(fixture('diamonds-1',true,aces.slice(0,3),'joker-1'));
  assert.equal(next.loot.length,4);
  assert.equal(next.deck[0].id,'joker-1');
  assert.equal(next.outcome,'in-progress');
});
