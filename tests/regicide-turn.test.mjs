import test from 'node:test';
import assert from 'node:assert/strict';
import {regicideEngine as engine} from '../src/games/regicide/engine.ts';
const all=s=>[s.activeEnemy,...s.castle,...s.tavern,...s.hand,...s.discard,...s.combat,...s.pending,...s.jokers.map(j=>j.id)].filter(Boolean).sort();
function apply(s,a){
  const before=structuredClone(s),r=engine.transition(s,a);
  assert.equal(r.accepted,true,r.reason);
  assert.deepEqual(s,before);
  assert.deepEqual(all(r.state),all(s));
  assert.equal(engine.validateState(r.state).valid,true);
  return r.state;
}
function reject(s,a){
  const before=structuredClone(s),r=engine.transition(s,a);
  assert.equal(r.accepted,false);assert.equal(r.state,s);assert.deepEqual(s,before);
}
test('four phases enforce order and preserve all physical cards',()=>{
  const s=engine.createInitialState({seed:42});
  const card=s.hand.find(id=>!id.startsWith('clubs-'));
  reject(s,{type:'resolve-powers'});reject(s,{type:'resolve-damage'});
  const p=apply(s,{type:'play',cardIds:[card]});
  assert.equal(p.phase,'powers');assert.deepEqual(p.pending,[card]);
  reject(p,{type:'play',cardIds:[p.hand[0]]});reject(p,{type:'resolve-damage'});
  const d=apply(p,{type:'resolve-powers'});
  assert.equal(d.phase,'damage');reject(d,{type:'resolve-powers'});
  const r=apply(d,{type:'resolve-damage'});
  assert.equal(r.phase,'retaliation');assert.equal(r.activeEnemy,s.activeEnemy);
  assert.equal(r.enemyHealth,20-Number(card.split('-')[1]));
  assert.deepEqual(r.pending,[]);assert.deepEqual(r.combat,[card]);
  const legal=engine.getLegalActions(r);
  if(legal.length){const next=apply(r,legal[0]);assert.equal(next.phase,'play');assert.equal(next.turn,2);}
});
test('REG-T02: exact defeat recruits enemy and skips retaliation',()=>{
  const initial=engine.createInitialState({seed:42});
  const s={...initial,turn:2,enemyHealth:1};
  const card=s.hand.find(id=>id.endsWith('-1')&&!id.startsWith('clubs-'));
  // Choose a deterministic opening containing a non-club ace.
  let f=s,id=card;
  for(let seed=0;!id&&seed<128;seed++){f={...engine.createInitialState({seed}),turn:2,enemyHealth:1};id=f.hand.find(x=>x.endsWith('-1')&&!x.startsWith('clubs-'));}
  assert.ok(id);
  const n=apply(apply(apply(f,{type:'play',cardIds:[id]}),{type:'resolve-powers'}),{type:'resolve-damage'});
  assert.equal(n.phase,'play');assert.equal(n.activeEnemy,f.castle[0]);assert.equal(n.tavern[0],f.activeEnemy);
  assert.equal(n.enemyHealth,20);assert.equal(n.shield,0);assert.ok(n.discard.includes(id));
  reject(n,{type:'retaliate',cardIds:[]});
});
test('REG-T27: final king defeated yields immediate victory',()=>{
  const initial=engine.createInitialState({seed:7});
  const active=initial.castle.at(-1);
  const s={...initial,turn:12,activeEnemy:active,castle:[],enemyHealth:1,enemyAttack:20,
    discard:[initial.activeEnemy,...initial.castle.filter(id=>id!==active)]};
  const n=apply(apply(apply(s,{type:'play',cardIds:[s.hand[0]]}),{type:'resolve-powers'}),{type:'resolve-damage'});
  assert.equal(n.outcome,'win');assert.equal(n.phase,'finished');assert.equal(n.activeEnemy,null);
  assert.deepEqual(engine.getLegalActions(n),[]);reject(n,{type:'retaliate',cardIds:[]});
});
test('REG-T32: no unconfirmed solo pass or random consumption on rejection',()=>{
  const s=engine.createInitialState({seed:7});
  for(const a of [{type:'pass'},{type:'play',cardIds:[]},{type:'play',cardIds:[s.hand[0],s.hand[0]]},{type:'play',cardIds:[s.tavern[0]]},{type:'resolve-powers',extra:1}])reject(s,a);
  assert.equal(s.recycleCount,0);
  assert.ok(engine.getLegalActions(s).every(a=>a.type==='play'));
});
