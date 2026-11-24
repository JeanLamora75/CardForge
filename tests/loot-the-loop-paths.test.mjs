import test from 'node:test';
import assert from 'node:assert/strict';
import { midnightSyndicateEngine as engine } from '../src/games/loot-the-loop/engine.ts';
const mark={type:'mark-path'};
const restore=noteIndex=>({type:'return-to-path',noteIndex});
function fixture(ids=['hearts-2','hearts-3','hearts-4','hearts-5'],visible=true) {
  const state=engine.createInitialState({seed:48});
  return {...state,deck:[...ids.map(id=>({id,faceUp:visible})),...state.deck.filter(c=>!ids.includes(c.id))]};
}
function apply(state,action) {
  const before=structuredClone(state);
  const result=engine.transition(state,action);
  assert.equal(result.accepted,true);
  assert.deepEqual(state,before);
  assert.equal(engine.validateState(result.state).valid,true);
  assert.equal(result.state.deck.length+result.state.notes.length+result.state.loot.length,53);
  assert.deepEqual(result.state.loot,state.loot);
  return result.state;
}
function reject(state,action) {
  const before=structuredClone(state);
  const result=engine.transition(state,action);
  assert.equal(result.accepted,false);
  assert.strictEqual(result.state,state);
  assert.deepEqual(state,before);
}
test('LTL-T14: fourth note is forbidden until a note is returned',()=>{
  let state=fixture();
  for(let i=0;i<3;i++) state=apply(state,mark);
  assert.equal(state.notes.length,3);
  assert.ok(!engine.getLegalActions(state).some(a=>a.type==='mark-path'));
  reject(state,mark);
  state=apply(state,restore(1));
  assert.equal(state.notes.length,2);
  assert.ok(engine.getLegalActions(state).some(a=>a.type==='mark-path'));
});
test('LTL-T15: mark and restore are separate turns, preserve order and visibility',()=>{
  const initial=fixture();
  const first=apply(initial,mark);
  assert.deepEqual(first.deck,initial.deck.slice(1));
  assert.deepEqual(first.notes,[initial.deck[0]]);
  const second=apply(first,restore(0));
  assert.deepEqual(second,initial);
});
test('return any chosen note to the top without moving other cards',()=>{
  for(let index=0;index<3;index++) {
    let state=fixture();
    for(let i=0;i<3;i++) state=apply(state,mark);
    const result=apply(state,restore(index));
    assert.deepEqual(result.deck,[state.notes[index],...state.deck]);
    assert.deepEqual(result.notes,state.notes.filter((_,i)=>i!==index));
  }
});
test('mark requires visible numeric top; second card is insufficient',()=>{
  for(const id of ['hearts-1','hearts-11','hearts-12','hearts-13','joker-1']) {
    const state=fixture([id,'clubs-2']);
    reject(state,mark);
  }
  reject(fixture(['hearts-2'],false),mark);
});
test('invalid indexes, combined actions and terminal states are rejected',()=>{
  const initial=fixture();
  reject(initial,restore(0));
  const state=apply(initial,mark);
  for(const index of [-1,1,0.5,NaN,Infinity,'0']) reject(state,restore(index));
  reject(state,{...mark,noteIndex:0});
  reject(state,{...restore(0),extra:true});
  const finished={...state,phase:'finished',outcome:'loss'};
  reject(finished,restore(0));
  reject(finished,mark);
  assert.deepEqual(engine.getLegalActions(finished),[]);
});
