import test from 'node:test';
import assert from 'node:assert/strict';
import { skydeckEngine, prepareSkydeck } from '../src/games/card-capture/engine.ts';
import { makeDeckWithJokers, shuffle } from '../src/core/cards.ts';
import { createSeededRandom } from '../src/core/deterministic-deck.ts';

const canonical = makeDeckWithJokers();
const initialPlayer = canonical.filter(c => 'kind' in c || [2,3,4].includes(c.rank)).map(c=>c.id);
const initialEnemy = canonical.filter(c => !initialPlayer.includes(c.id)).map(c=>c.id);
const protectedCard = id => /-(1|11|12|13)$/.test(id);
const all = s => [...s.playerDeck,...s.enemyDeck,...s.enemyLine.filter(x=>x!==null),...s.hand,...s.discard,...s.enemyCapture];

test('CC-T01: initial distribution and deterministic shuffle across seeds',()=>{
  for (let seed=0;seed<128;seed++) {
    const s=skydeckEngine.createInitialState({seed});
    assert.deepEqual(s,skydeckEngine.createInitialState({seed}));
    const random=createSeededRandom(seed);
    assert.deepEqual(s.playerDeck,shuffle(initialPlayer,random));
    const enemy=shuffle(initialEnemy,random);
    assert.equal(enemy.length,40);
    assert.equal(s.playerDeck.length,14);
    assert.deepEqual([...all(s)].sort(),canonical.map(c=>c.id).sort());
    assert.equal(skydeckEngine.validateState(s).valid,true);
  }
  assert.notDeepEqual(skydeckEngine.createInitialState({seed:0}),skydeckEngine.createInitialState({seed:1}));
});

test('CC-T02: initial protected cards return to bottom and leave holes, including four protected cards',()=>{
  const cases=[['hearts-1','spades-5','clubs-13','diamonds-9'],['hearts-1','spades-11','clubs-13','diamonds-12'],['hearts-5','spades-6','clubs-7','diamonds-8']];
  for(const top of cases){
    const enemy=[...top,...initialEnemy.filter(id=>!top.includes(id))];
    const s=prepareSkydeck(initialPlayer,enemy,7);
    assert.deepEqual(s.enemyLine,top.map(id=>protectedCard(id)?null:id));
    assert.deepEqual(s.enemyDeck,[...enemy.slice(4),...top.filter(protectedCard)]);
    assert.equal(s.enemyCapture.length,0);
    assert.equal(skydeckEngine.validateState(s).valid,true);
    assert.deepEqual(enemy.slice(0,4),top);
  }
});

test('CC-T03: main initially empty, enemy phase first, no premature discard or draw',()=>{
  const s=skydeckEngine.createInitialState({seed:42});
  assert.deepEqual(s.hand,[]);
  assert.deepEqual(s.discard,[]);
  assert.deepEqual(s.enemyCapture,[]);
  assert.equal(s.phase,'enemy');
  assert.equal(s.round,1);
  assert.equal(skydeckEngine.getOutcome(s),'in-progress');
  const before=structuredClone(s);
  const r=skydeckEngine.transition(s,{type:'discard'});
  assert.equal(r.accepted,false);
  assert.deepEqual(s,before);
  assert.equal(r.state,s);
});

test('initial validation rejects duplicate, missing, foreign, sparse, malformed and inconsistent states',()=>{
  const s=skydeckEngine.createInitialState({seed:42});
  const mutations=[
    {...s,playerDeck:[...s.playerDeck.slice(1),s.playerDeck[1]]},
    {...s,enemyDeck:s.enemyDeck.slice(1)},
    {...s,playerDeck:['unknown',...s.playerDeck.slice(1)]},
    {...s,enemyLine:[null,null,null]},
    {...s,enemyLine:new Array(4)},
    {...s,phase:'discard'},
    {...s,round:0},
    {...s,rulesVersion:'unknown'},
    {...s,hand:[s.playerDeck[0]],playerDeck:s.playerDeck.slice(1)},
    {...s,playerDeck:[s.enemyDeck[0],...s.playerDeck.slice(1)],enemyDeck:[s.playerDeck[0],...s.enemyDeck.slice(1)]},
    {...s,playerDeck:[undefined,...s.playerDeck.slice(1)]},
    null, []
  ];
  for(const invalid of mutations) assert.equal(skydeckEngine.validateState(invalid).valid,false);
  const before=structuredClone(s);
  assert.throws(()=>prepareSkydeck(initialPlayer.slice(1),initialEnemy,0));
  assert.throws(()=>prepareSkydeck(initialPlayer,[...initialEnemy.slice(1),initialEnemy[1]],0));
  for(const seed of [-1,1.5,NaN,4294967296])assert.throws(()=>skydeckEngine.createInitialState({seed}));
  assert.deepEqual(s,before);
});
