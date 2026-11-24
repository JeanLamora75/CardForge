import test from 'node:test';
import assert from 'node:assert/strict';
import { midnightSyndicateEngine as e, inspectMidnightSyndicate as inspect, isProvenMidnightSyndicateDeadEnd as dead } from '../src/games/loot-the-loop/engine.ts';
function fixture(ids, visible, notes=[]) {
  const s=e.createInitialState({seed:55});
  const used=[...ids,...notes];
  return {...s,deck:[...ids.map((id,i)=>({id,faceUp:visible.includes(i)})),...s.deck.filter(c=>!used.includes(c.id))],notes:notes.map(id=>({id,faceUp:true}))};
}
test('LTL-T01/T02/T19: deterministic seeds, complete physical deck and first legal action',()=>{
  for(let seed=0;seed<100;seed++){
    const s=e.createInitialState({seed});
    assert.deepEqual(s,e.createInitialState({seed}));
    assert.equal(s.deck.length,53);
    assert.equal(new Set(s.deck.map(c=>c.id)).size,53);
    assert.equal(s.deck.filter(c=>c.id==='joker-1').length,1);
    assert.ok(s.deck.every(c=>!c.faceUp));
    assert.deepEqual(s.notes,[]);assert.deepEqual(s.loot,[]);
    assert.deepEqual(e.getLegalActions(s),[{type:'look-around'}]);
  }
});
test('LTL-T16: public inspection never exposes a hidden identity or mutates state',()=>{
  const s=fixture(['hearts-2','clubs-3','spades-11'],[0],['diamonds-4']);
  const before=structuredClone(s),v=inspect(s);
  assert.deepEqual(v.deck[0],{position:0,faceUp:true,id:'hearts-2'});
  for(let i=1;i<s.deck.length;i++)assert.deepEqual(v.deck[i],{position:i,faceUp:false});
  assert.deepEqual(v.notes,[{position:0,faceUp:true,id:'diamonds-4'}]);
  assert.deepEqual(v.loot,[]);
  assert.deepEqual(s,before);
  assert.deepEqual(inspect(s),v);
});
test('LTL-T17 / LTL-R01/R02: a note rescues an otherwise fatal branch',()=>{
  // No visible numeric top; second card allows only distance 2 to a visible trap.
  const s=fixture(['hearts-11','clubs-2','spades-13'],[0,1,2],['diamonds-4']);
  assert.equal(dead(s),false);
  assert.equal(e.transition(s,{type:'explore',distance:2}).state.outcome,'loss');
  const r=e.transition(s,{type:'return-to-path',noteIndex:0});
  assert.equal(r.accepted,true);assert.equal(r.state.outcome,'in-progress');
  const step=e.transition(r.state,{type:'explore',distance:4});
  assert.equal(step.accepted,true);assert.equal(step.state.outcome,'in-progress');
});
test('LTL-R01/R03: proven deadlock, observation escape and invalid tiny decks',()=>{
  const s=fixture(['hearts-11','clubs-13'],[]);
  assert.equal(dead(s),false);
  const r=e.transition(s,{type:'look-around'});
  assert.equal(r.accepted,true);assert.equal(r.state.outcome,'loss');
  assert.deepEqual(e.getLegalActions(r.state),[]);
  for(const deck of [[],s.deck.slice(0,1)]){
    const invalid={...s,deck};
    assert.equal(e.validateState(invalid).valid,false);
    assert.equal(dead(invalid),false);
    assert.equal(e.transition(invalid,{type:'look-around'}).accepted,false);
  }
});
test('LTL-T19: seeded action sequences preserve identities, orientations and rejected inputs',()=>{
  for(let seed=0;seed<64;seed++){
    let s=e.createInitialState({seed});
    const ids=s.deck.map(c=>c.id).sort();
    for(let turn=0;turn<100&&s.outcome==='in-progress';turn++){
      const before=structuredClone(s);
      const actions=e.getLegalActions(s);
      assert.ok(actions.length);
      const a=actions[(seed+turn*7)%actions.length];
      const r=e.transition(s,a);
      assert.equal(r.accepted,true);
      assert.deepEqual(s,before);
      assert.deepEqual(e.transition(s,a),r);
      const cards=[...r.state.deck,...r.state.notes,...r.state.loot];
      assert.deepEqual(cards.map(c=>c.id).sort(),ids);
      assert.equal(e.validateState(r.state).valid,true);
      for(const c of [...s.deck,...s.notes,...s.loot])if(c.faceUp)
        assert.equal(cards.find(n=>n.id===c.id).faceUp,true);
      const invalid=e.transition(s,{type:'explore',distance:0});
      assert.equal(invalid.accepted,false);assert.strictEqual(invalid.state,s);
      s=r.state;
    }
  }
});
