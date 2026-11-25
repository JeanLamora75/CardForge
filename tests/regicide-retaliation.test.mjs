import test from 'node:test';
import assert from 'node:assert/strict';
import {regicideEngine as engine} from '../src/games/regicide/engine.ts';
import {makeDeckWithJokers} from '../src/core/cards.ts';
const ids=makeDeckWithJokers().filter(c=>!('kind' in c)).map(c=>c.id);
const rank=id=>Number(id.split('-')[1]);
const physical=s=>[s.activeEnemy,...s.castle,...s.tavern,...s.hand,...s.discard,...s.combat,...s.pending,...s.jokers.map(j=>j.id)].filter(Boolean).sort();
function fixture(hand,{enemy='spades-11',shield=0,used=false,tavern=null}={}){
  const s=engine.createInitialState({seed:23});
  const castle=ids.filter(id=>rank(id)>=rank(enemy)&&id!==enemy).sort((a,b)=>rank(a)-rank(b));
  const occupied=new Set([enemy,...castle,...hand]);
  const rest=ids.filter(id=>!occupied.has(id));
  const t=tavern??rest;
  const a=(rank(enemy)-9)*5;
  const state={...s,turn:5,phase:'retaliation',activeEnemy:enemy,castle,hand:[...hand],tavern:[...t],discard:rest.filter(id=>!t.includes(id)),enemyHealth:2*a-1,enemyAttack:a,shield,jokers:s.jokers.map(j=>({...j,used}))};
  assert.equal(engine.validateState(state).valid,true);return state;
}
function apply(s,a){
  const before=structuredClone(s),r=engine.transition(s,a);
  assert.equal(r.accepted,true,r.reason);assert.deepEqual(s,before);
  assert.deepEqual(physical(r.state),physical(s));assert.equal(engine.validateState(r.state).valid,true);return r.state;
}
function reject(s,a){const before=structuredClone(s),r=engine.transition(s,a);assert.equal(r.accepted,false);assert.equal(r.state,s);assert.deepEqual(s,before);}
test('REG-T19: retaliation accepts overshoot and empty hand after payment',()=>{
  const s=fixture(['hearts-6','diamonds-5']);
  const n=apply(s,{type:'retaliate',cardIds:s.hand});assert.equal(n.phase,'play');assert.equal(n.outcome,'in-progress');assert.deepEqual(n.hand,[]);assert.deepEqual(n.discard,[...s.discard,...s.hand]);
  assert.deepEqual(n.tavern,s.tavern);assert.equal(n.shield,s.shield);
  for(const cardIds of [[],['hearts-6'],['hearts-6','hearts-6'],[s.tavern[0]],['joker-1']])reject(s,{type:'retaliate',cardIds});
});
test('REG-T20: insufficient defence with exhausted jokers permits defeat and terminal state',()=>{
  const s=fixture(['hearts-7','diamonds-7'],{enemy:'spades-12',used:true});
  assert.deepEqual(engine.getLegalActions(s),[{type:'accept-defeat'}]);
  const n=apply(s,{type:'accept-defeat'});assert.equal(n.outcome,'loss');assert.equal(n.phase,'finished');assert.deepEqual(engine.getLegalActions(n),[]);reject(n,{type:'accept-defeat'});
});
test('REG-T21: zero retaliation consumes no cards and excess shield stays active',()=>{
  for(const shield of [10,15]){
    const s=fixture(['hearts-2'],{shield});
    assert.deepEqual(engine.getLegalActions(s).filter(a=>a.type==='retaliate'),[{type:'retaliate',cardIds:[]}]);
    reject(s,{type:'retaliate',cardIds:s.hand});
    const n=apply(s,{type:'retaliate',cardIds:[]});assert.deepEqual(n.hand,s.hand);assert.deepEqual(n.discard,s.discard);assert.equal(n.shield,shield);
  }
});
test('REG-T23: insufficient hand opens joker window before loss',()=>{
  const s=fixture(['hearts-1'],{tavern:['diamonds-9','clubs-8']});
  assert.equal(s.outcome,'in-progress');
  assert.ok(engine.getLegalActions(s).some(a=>a.type==='use-joker'));
  const n=apply(s,{type:'use-joker',jokerId:'joker-1'});
  assert.equal(n.phase,'retaliation');assert.deepEqual(n.hand,s.tavern);assert.deepEqual(n.tavern,[]);
  assert.deepEqual(n.discard,[...s.discard,...s.hand]);assert.equal(n.jokers[0].used,true);assert.equal(n.jokers[1].used,false);
  reject(n,{type:'use-joker',jokerId:'joker-1'});reject(n,{type:'accept-defeat'});
  assert.equal(apply(n,{type:'retaliate',cardIds:n.hand}).outcome,'in-progress');
});
test('defensive face values and shield reduction do not trigger powers',()=>{
  const s=fixture(['hearts-11','diamonds-12'],{enemy:'spades-13',shield:5});
  const n=apply(s,{type:'retaliate',cardIds:['diamonds-12']});assert.deepEqual(n.hand,['hearts-11']);assert.deepEqual(n.tavern,s.tavern);assert.equal(n.recycleCount,s.recycleCount);
  reject(s,{type:'retaliate',cardIds:['hearts-11']});
});
