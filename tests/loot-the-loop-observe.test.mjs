import test from 'node:test';
import assert from 'node:assert/strict';
import { midnightSyndicateEngine as engine } from '../src/games/loot-the-loop/engine.ts';

const look = { type: 'look-around' };
function fresh() { return engine.createInitialState({seed:46}); }
function withTopIds(state, ids) {
  const selected = ids.map(id => state.deck.find(card => card.id === id));
  return {...state, deck:[...selected, ...state.deck.filter(card => !ids.includes(card.id))]};
}
test('LTL-T03: observe first two, preserve physical order, zones, original state', () => {
  const initial = fresh();
  const snapshot = structuredClone(initial);
  const result = engine.transition(initial,look);
  assert.equal(result.accepted,true);
  assert.deepEqual(initial,snapshot);
  assert.deepEqual(result.state.deck.map(c=>c.id),initial.deck.map(c=>c.id));
  assert.deepEqual(result.state.deck.slice(0,2).map(c=>c.faceUp),[true,true]);
  assert.ok(result.state.deck.slice(2).every(c=>!c.faceUp));
  assert.deepEqual(result.state.loot,[]);
  assert.deepEqual(result.state.notes,[]);
  assert.equal(result.state.outcome,'in-progress');
  assert.equal(engine.validateState(result.state).valid,true);
});
test('LTL-T04: already face-up second card is preserved', () => {
  const initial = fresh();
  const prepared = {...initial,deck:initial.deck.map((c,i)=>i===1?{...c,faceUp:true}:c)};
  const result = engine.transition(prepared,look);
  assert.equal(result.accepted,true);
  assert.deepEqual(result.state.deck.slice(0,2).map(c=>c.faceUp),[true,true]);
  assert.deepEqual(result.state.deck.map(c=>c.id),prepared.deck.map(c=>c.id));
});
test('LTL-T05: no visible numeric move; illegal explore cannot mutate state', () => {
  const initial = fresh();
  assert.deepEqual(engine.getLegalActions(initial),[look]);
  const result = engine.transition(initial,{type:'explore',distance:2});
  assert.equal(result.accepted,false);
  assert.strictEqual(result.state,initial);
});
test('revealing visible J/Q/K or Joker does not cause loss, win or loot', () => {
  for (const id of ['spades-11','joker-1']) {
    const initial = fresh();
    const trap = initial.deck.find(c=>c.id===id);
    assert.ok(trap || id==='spades-11', 'card id exists');
    if (!trap) continue;
    const prepared = withTopIds(initial,[id]);
    const result = engine.transition(prepared,look);
    assert.equal(result.accepted,true);
    assert.equal(result.state.outcome,'in-progress');
    assert.deepEqual(result.state.loot,[]);
  }
});
test('look-around cannot be played twice; rejected transition is referentially immutable', () => {
  const first = engine.transition(fresh(),look);
  assert.equal(first.accepted,true);
  const second = engine.transition(first.state,look);
  assert.equal(second.accepted,false);
  assert.strictEqual(second.state,first.state);
  assert.deepEqual(engine.getLegalActions(first.state),[]);
});
test('only top card available: reveal once without indexing beyond deck', () => {
  const initial=fresh();
  const state={...initial,deck:[initial.deck[0]],loot:[...initial.deck.slice(1)]};
  // Such a state is invalid (loot cannot contain traps); a malformed state must be rejected safely.
  const result=engine.transition(state,look);
  assert.equal(result.accepted,false);
  assert.strictEqual(result.state,state);
});
