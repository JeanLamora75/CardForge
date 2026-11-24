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
    {...s,phase:'not-a-phase'},
    {...s,round:0},
    {...s,rulesVersion:'unknown'},
    {...s,hand:[s.playerDeck[0]],playerDeck:s.playerDeck.slice(1)},
    {...s,playerDeck:[s.enemyDeck[0],...s.playerDeck.slice(1)],enemyDeck:[s.playerDeck[0],...s.enemyDeck.slice(1)]},
    {...s,playerDeck:[undefined,...s.playerDeck.slice(1)]},
    null, []
  ];
  for(const [index,invalid] of mutations.entries()) assert.equal(skydeckEngine.validateState(invalid).valid,false,'invalid fixture '+index);
  const before=structuredClone(s);
  assert.throws(()=>prepareSkydeck(initialPlayer.slice(1),initialEnemy,0));
  assert.throws(()=>prepareSkydeck(initialPlayer,[...initialEnemy.slice(1),initialEnemy[1]],0));
  for(const seed of [-1,1.5,NaN,4294967296])assert.throws(()=>skydeckEngine.createInitialState({seed}));
  assert.deepEqual(s,before);
});

function apply(s,type){
  const before=structuredClone(s);
  const r=skydeckEngine.transition(s,{type});
  assert.equal(r.accepted,true);
  assert.deepEqual(s,before);
  assert.equal(skydeckEngine.validateState(r.state).valid,true);
  assert.deepEqual(all(r.state).sort(),all(s).sort());
  return r.state;
}
test('CC-T04: compact right and refill in draw order, including protected enemies',()=>{
  const top=['hearts-1','spades-5','clubs-13','diamonds-9','hearts-11','clubs-6'];
  const s=prepareSkydeck(initialPlayer,[...top,...initialEnemy.filter(id=>!top.includes(id))],7);
  const n=apply(s,'advance-enemy');
  assert.deepEqual(n.enemyLine,['spades-5','diamonds-9','hearts-11','clubs-6']);
  assert.deepEqual(n.enemyDeck,s.enemyDeck.slice(2));
  assert.equal(n.phase,'discard');
});
test('CC-T04: exhausted enemy deck leaves empty slots without creating cards',()=>{
  const remaining=['hearts-5','clubs-6'];
  const s={...skydeckEngine.createInitialState({seed:0}),round:2,
    enemyDeck:[],enemyLine:[null,remaining[0],null,remaining[1]],
    playerDeck:initialPlayer,discard:initialEnemy.filter(id=>!remaining.includes(id))};
  const n=apply(s,'advance-enemy');
  assert.deepEqual(n.enemyLine,[...remaining,null,null]);
  assert.deepEqual(n.enemyDeck,[]);
});
test('CC-T03: first round follows enemy, empty discard, draw then capture',()=>{
  for(let seed=0;seed<64;seed++){
    const s=skydeckEngine.createInitialState({seed});
    const d=apply(s,'advance-enemy');
    assert.deepEqual(d.hand,[]);
    const p=apply(d,'discard-none');
    assert.equal(p.phase,'draw');
    const c=apply(p,'draw');
    assert.equal(c.phase,'capture');
    assert.deepEqual(c.hand,s.playerDeck.slice(0,4));
    assert.deepEqual(c.playerDeck,s.playerDeck.slice(4));
  }
});
test('phase guard rejects repeated, out of order and unimplemented actions without mutation',()=>{
  const s=skydeckEngine.createInitialState({seed:0});
  const d=apply(s,'advance-enemy');
  const p=apply(d,'discard-none');
  const c=apply(p,'draw');
  for(const [state,actions] of [[s,['draw','discard-none']],[d,['advance-enemy','draw']],[p,['discard-none','advance-enemy']],[c,['draw','advance-enemy','capture-a','capture-b','capture-c']]]){
    for(const type of actions){
      const before=structuredClone(state);
      const r=skydeckEngine.transition(state,{type});
      assert.equal(r.accepted,false);
      assert.equal(r.state,state);
      assert.deepEqual(state,before);
    }
  }
  const terminal={...c,phase:'finished',outcome:'abandoned'};
  assert.equal(skydeckEngine.validateState(terminal).valid,true);
  assert.deepEqual(skydeckEngine.getLegalActions(terminal),[]);
  assert.equal(skydeckEngine.transition(terminal,{type:'draw'}).accepted,false);
});

function laterDiscard(seed=42){
  const opening=skydeckEngine.createInitialState({seed});
  const s=apply(opening,'advance-enemy');
  return {...s,round:2,hand:s.playerDeck.slice(0,4),playerDeck:s.playerDeck.slice(4)};
}
function act(s,action){
  const before=structuredClone(s);
  const r=skydeckEngine.transition(s,action);
  assert.equal(r.accepted,true,JSON.stringify(r));
  assert.deepEqual(s,before);
  assert.deepEqual(all(r.state).sort(),all(s).sort());
  assert.equal(skydeckEngine.validateState(r.state).valid,true);
  return r.state;
}
test('CC-T06: every subset of hand may be discarded, only to personal discard',()=>{
  const s=laterDiscard();
  const legal=skydeckEngine.getLegalActions(s).filter(a=>a.type==='discard');
  assert.equal(legal.length,16);
  for(const action of legal){
    const n=act(s,action);
    const selected=new Set(action.cardIds);
    assert.deepEqual(n.hand,s.hand.filter(id=>!selected.has(id)));
    assert.deepEqual(n.discard,s.hand.filter(id=>selected.has(id)));
    assert.deepEqual(n.enemyCapture,s.enemyCapture);
    assert.equal(n.phase,'draw');
  }
  const n=act(s,{type:'discard',cardIds:[s.hand[3],s.hand[0]]});
  assert.deepEqual(n.discard,[s.hand[0],s.hand[3]]);
  for(const cardIds of [[s.hand[0],s.hand[0]],[s.playerDeck[0]],['unknown'],new Array(1),null,'x']){
    const before=structuredClone(s);
    const r=skydeckEngine.transition(s,{type:'discard',cardIds});
    assert.equal(r.accepted,false);
    assert.equal(r.state,s);
    assert.deepEqual(s,before);
  }
  assert.equal(skydeckEngine.transition(n,{type:'discard',cardIds:[]}).accepted,false);
});
test('CC-T05: draw uses existing deck first and only recycles when necessary',()=>{
  const s=laterDiscard();
  const captured=s.enemyDeck[0];
  const d={...s,phase:'draw',hand:s.hand.slice(0,1),playerDeck:s.playerDeck.slice(0,1),
    enemyDeck:s.enemyDeck.slice(1),discard:[...s.hand.slice(1),...s.playerDeck.slice(1),captured]};
  assert.equal(skydeckEngine.validateState(d).valid,true);
  const n=act(d,{type:'draw'});
  const expected=shuffle(d.discard,createSeededRandom((d.seed+Math.imul(1,0x9e3779b9))>>>0));
  assert.deepEqual(n.hand,[...d.hand,d.playerDeck[0],...expected.slice(0,2)]);
  assert.deepEqual(n.playerDeck,expected.slice(2));
  assert.deepEqual(n.discard,[]);
  assert.equal(n.recycleCount,1);
  assert.equal(n.phase,'capture');
  assert.deepEqual(skydeckEngine.transition(JSON.parse(JSON.stringify(d)),{type:'draw'}).state,n);
  assert.equal(all(n).includes(captured),true);
  const enough={...d,playerDeck:[...d.playerDeck,...d.discard.slice(0,2)],discard:d.discard.slice(2)};
  const exact=act(enough,{type:'draw'});
  assert.equal(exact.playerDeck.length,0);
  assert.deepEqual(exact.discard,enough.discard);
  assert.equal(exact.recycleCount,0);
  const second={...d,recycleCount:1};
  const secondResult=act(second,{type:'draw'});
  assert.equal(secondResult.recycleCount,2);
  const expectedSecond=shuffle(second.discard,createSeededRandom((second.seed+Math.imul(2,0x9e3779b9))>>>0));
  assert.deepEqual(secondResult.hand,[...second.hand,second.playerDeck[0],...expectedSecond.slice(0,2)]);
});
test('CC-T05: empty personal deck recycles, full hand does not recycle',()=>{
  const s=laterDiscard();
  const d={...s,phase:'draw',playerDeck:[],discard:s.playerDeck};
  const full=act(d,{type:'draw'});
  assert.deepEqual(full.hand,d.hand);
  assert.deepEqual(full.discard,d.discard);
  assert.equal(full.recycleCount,0);
  const empty={...d,hand:[],discard:[...d.discard,...d.hand]};
  const n=act(empty,{type:'draw'});
  assert.equal(n.hand.length,4);
  assert.equal(n.recycleCount,1);
  assert.deepEqual(n.discard,[]);
});
test('CC-R02: insufficient personal cards preserve state without inventing defeat',()=>{
  const s=laterDiscard();
  const d={...s,phase:'draw',hand:s.hand.slice(0,1),playerDeck:[],discard:s.hand.slice(1,2),
    enemyCapture:[...s.playerDeck,...s.hand.slice(2)]};
  assert.equal(skydeckEngine.validateState(d).valid,true);
  assert.deepEqual(skydeckEngine.getLegalActions(d),[]);
  const before=structuredClone(d);
  const r=skydeckEngine.transition(d,{type:'draw'});
  assert.equal(r.accepted,false);
  assert.equal(r.state,d);
  assert.deepEqual(d,before);
  assert.equal(skydeckEngine.getOutcome(d),'in-progress');
});
