import test from 'node:test';
import assert from 'node:assert/strict';
import { midnightSyndicateEngine as engine } from '../src/games/loot-the-loop/engine.ts';
const explore = distance => ({type:'explore',distance});
function fixture(ids, faces, seed=47) {
  const state=engine.createInitialState({seed});
  const deck=[...ids.map(id=>state.deck.find(c=>c.id===id)),...state.deck.filter(c=>!ids.includes(c.id))];
  return {...state,deck:deck.map((c,i)=>({...c,faceUp:faces.includes(i)}))};
}
test('LTL-T05: hidden numerics and visible figures cannot provide distances',()=>{
  const state=fixture(['hearts-4','clubs-13'],[1]);
  assert.deepEqual(engine.getLegalActions(state),[{type:'look-around'}]);
  for(const distance of [4,13,0,-1,2.5,NaN,Infinity,'4']) {
    const result=engine.transition(state,explore(distance));
    assert.equal(result.accepted,false);
    assert.strictEqual(result.state,state);
  }
});
test('LTL-T06: distinct visible numeric distances, deduplication and hidden top',()=>{
  assert.deepEqual(engine.getLegalActions(fixture(['hearts-4','clubs-6'],[0,1])),[explore(4),explore(6),{type:'mark-path'}]);
  assert.deepEqual(engine.getLegalActions(fixture(['hearts-4','clubs-4'],[0,1])),[explore(4),{type:'mark-path'}]);
  assert.deepEqual(engine.getLegalActions(fixture(['hearts-4','clubs-6'],[1])),[{type:'look-around'},explore(6)]);
});
test('LTL-T07/T08: rotate exactly N preserving faces, hidden arrival unchanged',()=>{
  for(let seed=0;seed<20;seed++) {
    for(let distance=2;distance<=10;distance++) {
      const state=fixture(['hearts-'+distance,'clubs-13'],[0,1],seed);
      const before=structuredClone(state);
      const result=engine.transition(state,explore(distance));
      assert.equal(result.accepted,true);
      assert.deepEqual(result.state.deck,[...before.deck.slice(distance),...before.deck.slice(0,distance)]);
      assert.equal(result.state.deck[0].faceUp,false);
      assert.equal(result.state.outcome,'in-progress');
      assert.deepEqual(result.state.notes,before.notes);
      assert.deepEqual(result.state.loot,before.loot);
      assert.deepEqual(state,before);
      assert.equal(engine.validateState(result.state).valid,true);
    }
  }
});
test('hidden trap arrival causes no defeat',()=>{
  const state=fixture(['hearts-2','clubs-6','spades-13'],[0]);
  const result=engine.transition(state,explore(2));
  assert.equal(result.accepted,true);
  assert.deepEqual(result.state.deck[0],{id:'spades-13',faceUp:false});
  assert.equal(result.state.outcome,'in-progress');
});
test('finished state and extra action fields are rejected',()=>{
  const state=fixture(['hearts-4','clubs-6'],[0,1]);
  const finished={...state,outcome:'loss',phase:'finished'};
  assert.deepEqual(engine.getLegalActions(finished),[]);
  assert.equal(engine.transition(finished,explore(4)).accepted,false);
  assert.equal(engine.transition(state,{...explore(4),extra:true}).accepted,false);
});
