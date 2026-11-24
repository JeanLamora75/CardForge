import test from 'node:test';
import assert from 'node:assert/strict';
import {regicideEngine as engine} from '../src/games/regicide/engine.ts';
import {makeDeckWithJokers,shuffle} from '../src/core/cards.ts';
import {createSeededRandom} from '../src/core/deterministic-deck.ts';
const ordinary=makeDeckWithJokers().filter(c=>!('kind' in c)).map(c=>c.id);
const rank=id=>Number(id.split('-')[1]);
const royals=ordinary.filter(id=>rank(id)>=11).sort((a,b)=>rank(a)-rank(b));
const physical=s=>[s.activeEnemy,...s.castle,...s.tavern,...s.hand,...s.discard,...s.combat,...s.pending,...s.jokers.map(j=>j.id)].filter(Boolean).sort();
function fixture({enemy='spades-11',castle=null,hand=[],discard=[],combat=[],shield=0,health=null}={}){
  const s=engine.createInitialState({seed:29});
  const remaining=castle??royals.filter(id=>id!==enemy);
  const used=new Set([enemy,...remaining,...hand,...discard,...combat]);
  const attack=(rank(enemy)-9)*5;
  const state={...s,turn:12,activeEnemy:enemy,castle:[...remaining],hand:[...hand],discard:[...discard],combat:[...combat],shield,enemyAttack:attack,enemyHealth:health??2*attack,tavern:ordinary.filter(id=>!used.has(id))};
  assert.equal(engine.validateState(state).valid,true);
  return state;
}
function act(s,a){
  const before=structuredClone(s),r=engine.transition(s,a);
  assert.equal(r.accepted,true,r.reason);
  assert.deepEqual(s,before);assert.deepEqual(physical(r.state),physical(s));
  assert.equal(engine.validateState(r.state).valid,true);
  return r.state;
}
const powers=(s,cardIds)=>act(act(s,{type:'play',cardIds}),{type:'resolve-powers'});
const damage=s=>act(s,{type:'resolve-damage'});
function noRiposte(s){
  const before=structuredClone(s),r=engine.transition(s,{type:'retaliate',cardIds:[]});
  assert.equal(r.accepted,false);assert.equal(r.state,s);assert.deepEqual(s,before);
}
test('REG-T15: exact twenty recruits the same physical jack on top of tavern',()=>{
  const s=fixture({hand:['clubs-10']});
  const p=powers(s,s.hand),n=damage(p);
  assert.equal(n.tavern[0],s.activeEnemy);assert.deepEqual(n.tavern.slice(1),p.tavern);
  assert.ok(!n.discard.includes(s.activeEnemy));assert.deepEqual(n.discard,['clubs-10']);
  assert.equal(n.activeEnemy,s.castle[0]);assert.equal(n.phase,'play');noRiposte(n);
});
test('REG-T16: excess damage discards enemy instead of recruiting',()=>{
  // Twenty-two from a club ten and an ace; no artificial cards or damage values.
  const s=fixture({hand:['clubs-10','spades-1']});
  const p=powers(s,s.hand),n=damage(p);
  assert.deepEqual(n.tavern,p.tavern);assert.deepEqual(n.discard,[s.activeEnemy,...s.hand]);
  assert.equal(n.activeEnemy,s.castle[0]);assert.equal(n.phase,'play');noRiposte(n);
  // Exactly twenty-one accumulated damage: prior eleven, current ten.
  const a=fixture({hand:['hearts-10'],health:9,combat:['hearts-5','diamonds-6']});
  const b=damage(powers(a,a.hand));assert.ok(b.discard.includes(a.activeEnemy));
});
test('REG-T17: heart recovery cannot recycle any card of the ongoing combat',()=>{
  const s=fixture({hand:['hearts-7'],health:7,combat:['clubs-6','diamonds-1'],discard:['hearts-2','spades-4']});
  const p=powers(s,s.hand);
  const recovered=shuffle(s.discard,createSeededRandom((s.seed+0x9e3779b9)>>>0));
  assert.deepEqual(p.tavern,[...s.tavern,...recovered]);assert.deepEqual(p.discard,[]);
  assert.deepEqual(p.combat,s.combat);assert.deepEqual(p.pending,s.hand);
  const n=damage(p);assert.deepEqual(n.tavern,[s.activeEnemy,...p.tavern]);
  assert.deepEqual(n.discard,[...s.combat,...s.hand]);assert.deepEqual(n.combat,[]);
});
test('REG-T18: damage accumulates across turns and shield resets only after defeat',()=>{
  const s=fixture({enemy:'hearts-11',hand:['spades-8','clubs-6','diamonds-2']});
  const a=damage(powers(s,['spades-8']));
  assert.equal(a.enemyHealth,12);assert.equal(a.shield,8);assert.equal(a.activeEnemy,s.activeEnemy);
  const b=act(a,{type:'retaliate',cardIds:['diamonds-2']});
  assert.equal(b.enemyHealth,12);assert.equal(b.shield,8);assert.deepEqual(b.combat,['spades-8']);
  const n=damage(powers(b,['clubs-6']));
  assert.equal(n.activeEnemy,s.castle[0]);assert.equal(n.enemyHealth,20);assert.equal(n.enemyAttack,10);
  assert.equal(n.shield,0);assert.deepEqual(n.combat,[]);assert.equal(n.tavern[0],s.activeEnemy);
  assert.deepEqual(n.discard,['diamonds-2','spades-8','clubs-6']);noRiposte(n);
});
test('rank boundaries reveal queen and king only after previous rank is exhausted',()=>{
  for(const [enemy,nextRank,health,attack] of [['spades-11',12,30,15],['spades-12',13,40,20]]){
    const s=fixture({enemy,castle:royals.filter(id=>rank(id)>=nextRank),hand:['clubs-10'],health:20,shield:9});
    const n=damage(powers(s,s.hand));assert.equal(rank(n.activeEnemy),nextRank);
    assert.equal(n.enemyHealth,health);assert.equal(n.enemyAttack,attack);assert.equal(n.shield,0);noRiposte(n);
  }
});
test('REG-T27: final king exact and excess damage both finish immediately',()=>{
  for(const health of [20,19]){
    const s=fixture({enemy:'spades-13',castle:[],hand:['clubs-10'],health,shield:12});
    const n=damage(powers(s,s.hand));
    assert.equal(n.outcome,'win');assert.equal(n.phase,'finished');assert.equal(n.activeEnemy,null);
    assert.equal(n.enemyHealth,0);assert.equal(n.enemyAttack,0);assert.equal(n.shield,0);
    assert.deepEqual(n.castle,[]);assert.deepEqual(n.combat,[]);assert.deepEqual(engine.getLegalActions(n),[]);
    assert.equal(health===20?n.tavern[0]:n.discard[0],s.activeEnemy);noRiposte(n);
  }
});
