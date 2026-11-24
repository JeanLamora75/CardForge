import test from 'node:test';
import assert from 'node:assert/strict';
import { regicideEngine, inspectRegicide } from '../src/games/regicide/engine.ts';
import { makeDeckWithJokers, shuffle } from '../src/core/cards.ts';
import { createSeededRandom } from '../src/core/deterministic-deck.ts';

const canonical=makeDeckWithJokers();
const ids=canonical.map(c=>c.id);
const all=s=>[s.activeEnemy,...s.castle,...s.tavern,...s.hand,...s.discard,...s.combat,...s.jokers.map(j=>j.id)];

test('REG-T01: opening solo partition, deterministic independent shuffles and serialization',()=>{
  for(const seed of [0,1,42,0xffffffff,...Array.from({length:128},(_,i)=>i)]){
    const s=regicideEngine.createInitialState({seed});
    const random=createSeededRandom(seed);
    const rankDeck=rank=>shuffle(canonical.filter(c=>c.rank===rank).map(c=>c.id),random);
    const kings=rankDeck(13), queens=rankDeck(12), jacks=rankDeck(11);
    const tavern=shuffle(canonical.filter(c=>c.rank>=1&&c.rank<=10).map(c=>c.id),random);
    assert.equal(s.activeEnemy,jacks[0]);
    assert.deepEqual(s.castle,[...jacks.slice(1),...queens,...kings]);
    assert.deepEqual(s.hand,tavern.slice(0,8));
    assert.deepEqual(s.tavern,tavern.slice(8));
    assert.deepEqual(s.jokers,[{id:'joker-1',used:false},{id:'joker-2',used:false}]);
    assert.deepEqual(s.discard,[]); assert.deepEqual(s.combat,[]);
    assert.equal(s.enemyHealth,20); assert.equal(s.enemyAttack,10); assert.equal(s.shield,0);
    assert.equal(s.phase,'play'); assert.equal(s.outcome,'in-progress');
    assert.deepEqual(all(s).sort(),[...ids].sort());
    assert.equal(new Set(all(s)).size,54);
    assert.equal(regicideEngine.validateState(JSON.parse(JSON.stringify(s))).valid,true);
    assert.deepEqual(s,regicideEngine.createInitialState({seed}));
  }
  assert.notDeepEqual(regicideEngine.createInitialState({seed:1}),regicideEngine.createInitialState({seed:2}));
});

test('REG-T02: castle cannot expose a higher rank before the preceding group',()=>{
  const s=regicideEngine.createInitialState({seed:3});
  assert.deepEqual(s.castle.map(id=>Number(id.split('-')[1])),[11,11,11,12,12,12,12,13,13,13,13]);
  const swapped=[...s.castle]; [swapped[0],swapped[3]]=[swapped[3],swapped[0]];
  assert.equal(regicideEngine.validateState({...s,castle:swapped}).valid,false);
  assert.equal(regicideEngine.validateState({...s,activeEnemy:s.castle[3],castle:s.castle.map((id,i)=>i===3?s.activeEnemy:id)}).valid,false);
});

test('opening validation rejects corrupt zones, metadata and card placement without mutation',()=>{
  const s=regicideEngine.createInitialState({seed:7});
  const invalid=[null,[],{...s,seed:-1},{...s,rulesVersion:'other'},
    {...s,castle:s.castle.slice(1)},{...s,tavern:[s.hand[0],...s.tavern.slice(1)]},
    {...s,hand:['unknown',...s.hand.slice(1)]},{...s,hand:new Array(8)},
    {...s,hand:[s.castle[0],...s.hand.slice(1)],castle:[s.hand[0],...s.castle.slice(1)]},
    {...s,jokers:[{id:'joker-1',used:false},{id:'joker-1',used:false}]},
    {...s,jokers:[{id:'joker-1',used:true},s.jokers[1]]},
    {...s,enemyHealth:19},{...s,enemyAttack:15},{...s,shield:1},
    {...s,phase:'finished'},{...s,discard:[s.tavern[0]],tavern:s.tavern.slice(1)},
    {...s,extra:true}];
  for(const v of invalid){
    const before=structuredClone(v);
    assert.equal(regicideEngine.validateState(v).valid,false);
    assert.deepEqual(v,before);
    assert.throws(()=>inspectRegicide(v));
  }
  for(const seed of [-1,NaN,1.5,4294967296])assert.throws(()=>regicideEngine.createInitialState({seed}));
  const before=structuredClone(s);
  const rejected=regicideEngine.transition(s,{type:'play',cardIds:[s.tavern[0]]});
  assert.equal(rejected.accepted,false); assert.equal(rejected.state,s);
  assert.deepEqual(s,before);
});

test('public opening projection contains no hidden cards, order or seed and is detached',()=>{
  const s=regicideEngine.createInitialState({seed:42});
  const view=inspectRegicide(s);
  assert.deepEqual(view.hand,s.hand);
  assert.equal(view.activeEnemy,s.activeEnemy);
  assert.deepEqual(view.counts,{castle:11,tavern:32,discard:0});
  const values=JSON.stringify(view);
  for(const id of [...s.castle,...s.tavern])assert.ok(!values.includes('"'+id+'"'),id);
  for(const field of ['seed','castle','tavern'])assert.equal(Object.hasOwn(view,field),false);
  view.hand.pop(); view.jokers[0].used=true;
  assert.equal(s.hand.length,8); assert.equal(s.jokers[0].used,false);
});
