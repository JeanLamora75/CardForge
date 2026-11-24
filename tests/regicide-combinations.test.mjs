import test from 'node:test';
import assert from 'node:assert/strict';
import {regicideEngine as engine} from '../src/games/regicide/engine.ts';
import {makeDeckWithJokers} from '../src/core/cards.ts';
const ids=makeDeckWithJokers().map(c=>c.id);
const all=s=>[s.activeEnemy,...s.castle,...s.tavern,...s.hand,...s.discard,...s.combat,...s.pending,...s.jokers.map(j=>j.id)].filter(Boolean).sort();
function fixture(hand){
  const initial=engine.createInitialState({seed:17});
  const activeEnemy='spades-13';
  const castle=['hearts-13','diamonds-13','clubs-13'];
  const excluded=new Set([activeEnemy,...castle,...hand,'joker-1','joker-2']);
  const s={...initial,turn:9,activeEnemy,castle,enemyHealth:40,enemyAttack:20,hand:[...hand],tavern:ids.filter(id=>!excluded.has(id))};
  assert.equal(engine.validateState(s).valid,true);
  return s;
}
function apply(s,a){
  const before=structuredClone(s),r=engine.transition(s,a);
  assert.equal(r.accepted,true,r.reason);assert.deepEqual(s,before);
  assert.deepEqual(all(r.state),all(s));assert.equal(engine.validateState(r.state).valid,true);
  return r.state;
}
function reject(s,cardIds){
  const before=structuredClone(s),r=engine.transition(s,{type:'play',cardIds});
  assert.equal(r.accepted,false);assert.equal(r.state,s);assert.deepEqual(s,before);
}
const key=a=>[...a].sort().join(',');
test('REG-T11: ace alone, with another ace, number or recruited figure',()=>{
  const s=fixture(['hearts-1','diamonds-1','spades-7','clubs-12']);
  for(const cards of [['hearts-1'],['hearts-1','diamonds-1'],['hearts-1','spades-7'],['clubs-12','hearts-1']]){
    const n=apply(s,{type:'play',cardIds:cards});
    assert.equal(n.phase,'powers');assert.equal(key(n.pending),key(cards));
    assert.equal(n.hand.length,s.hand.length-cards.length);
  }
  reject(s,['hearts-1','diamonds-1','spades-7']);
});
test('REG-T12: all allowed numeric combinations and forbidden totals',()=>{
  const suits=['hearts','diamonds','clubs','spades'];
  for(let rank=2;rank<=10;rank++){
    const hand=suits.map(s=>s+'-'+rank),state=fixture(hand);
    const expected=[];
    for(let mask=1;mask<16;mask++){
      const cards=hand.filter((_,i)=>mask&(1<<i));
      if(cards.length===1||cards.length*rank<=10){expected.push(key(cards));apply(state,{type:'play',cardIds:cards});}
      else reject(state,cards);
    }
    assert.deepEqual(engine.getLegalActions(state).filter(a=>a.type==='play').map(a=>key(a.cardIds)).sort(),expected.sort());
  }
});
test('REG-T13: recruited figures and ace retain their original strength',()=>{
  for(const [card,value] of [['hearts-1',1],['hearts-11',10],['hearts-12',15]]){
    const s=fixture([card]);
    const n=apply(apply(apply(s,{type:'play',cardIds:[card]}),{type:'resolve-powers'}),{type:'resolve-damage'});
    assert.equal(n.enemyHealth,40-value);
  }
  // A previously defeated king is playable against a later king.
  const initial=engine.createInitialState({seed:17});
  const hand=['hearts-13'];
  const activeEnemy='spades-13',castle=['clubs-13'];
  const excluded=new Set([activeEnemy,...castle,...hand,'joker-1','joker-2']);
  const s={...initial,turn:10,activeEnemy,castle,enemyHealth:40,enemyAttack:20,hand,tavern:ids.filter(id=>!excluded.has(id))};
  const n=apply(apply(apply(s,{type:'play',cardIds:hand}),{type:'resolve-powers'}),{type:'resolve-damage'});
  assert.equal(n.enemyHealth,20);
});
test('REG-T14: invalid lots, duplicate identities, hidden cards and jokers are refused',()=>{
  const s=fixture(['hearts-4','diamonds-4','clubs-4','hearts-1','clubs-11','diamonds-11','spades-2','spades-3']);
  for(const cards of [[],['hearts-4','diamonds-4','clubs-4'],['hearts-1','hearts-4','diamonds-4'],['clubs-11','diamonds-11'],['spades-2','spades-3'],['hearts-4','hearts-4'],['joker-1'],[s.tavern[0]],['unknown'],new Array(1),null])reject(s,cards);
  const p=apply(s,{type:'play',cardIds:['diamonds-4','hearts-4']});
  assert.deepEqual(p.pending,['hearts-4','diamonds-4']);
  reject(p,['spades-2']);
  assert.equal(engine.validateState({...p,pending:[...p.pending,p.pending[0]]}).valid,false);
});
