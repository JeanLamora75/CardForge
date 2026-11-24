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

function captureFixture(target,hand,position=2,last=false){
  const otherEnemies=initialEnemy.filter(id=>id!==target&&!hand.includes(id));
  const line=last?[target,null,null,null]:otherEnemies.slice(0,3);
  if(!last)line.splice(position-1,0,target);
  const enemyDeck=last?[]:otherEnemies.slice(3);
  const used=new Set([...hand,...line.filter(id=>id!==null),...enemyDeck]);
  return {...skydeckEngine.createInitialState({seed:7}),round:2,phase:'capture',
    hand,enemyLine:line,enemyDeck,playerDeck:canonical.map(c=>c.id).filter(id=>!used.has(id)),
    discard:[],enemyCapture:[]};
}
test('CC-T07: exact and excess same-suit sums capture exactly one enemy into personal discard',()=>{
  for(const hand of [['hearts-4','hearts-5','clubs-2','spades-3'],['hearts-4','hearts-6','clubs-2','spades-3']]){
    const s=captureFixture('hearts-9',hand);
    const action={type:'capture-a',targetPosition:2,cardIds:hand.slice(0,2).reverse()};
    const n=act(s,action);
    assert.deepEqual(n.hand,hand.slice(2));
    assert.deepEqual(n.discard,[...hand.slice(0,2),'hearts-9']);
    assert.deepEqual(n.enemyCapture,s.enemyCapture);
    assert.deepEqual(n.enemyDeck,s.enemyDeck);
    assert.deepEqual(n.enemyLine,s.enemyLine.map((id,i)=>i===1?null:id));
    assert.equal(n.round,s.round+1);
    assert.equal(n.phase,'enemy');
  }
});
test('CC-T08: wrong suit, insufficient strength, duplicates, missing cards and invalid positions are rejected',()=>{
  const s=captureFixture('hearts-9',['spades-4','hearts-5','hearts-4','joker-1']);
  const bad=[
    {targetPosition:2,cardIds:['spades-4','hearts-5']},
    {targetPosition:2,cardIds:['hearts-5']},
    {targetPosition:2,cardIds:['hearts-5','hearts-5']},
    {targetPosition:2,cardIds:['hearts-10']},
    {targetPosition:2,cardIds:[]},
    {targetPosition:2,cardIds:['joker-1','hearts-5']},
    {targetPosition:0,cardIds:['hearts-4','hearts-5']},
    {targetPosition:5,cardIds:['hearts-4','hearts-5']},
    {targetPosition:2.5,cardIds:['hearts-4','hearts-5']},
    {targetPosition:2,cardIds:new Array(2)},
  ];
  for(const action of bad){
    const before=structuredClone(s);
    const r=skydeckEngine.transition(s,{type:'capture-a',...action});
    assert.equal(r.accepted,false,JSON.stringify(action));
    assert.equal(r.state,s);
    assert.deepEqual(s,before);
  }
  assert.equal(skydeckEngine.getLegalActions(s).some(a=>a.type==='capture-a'&&a.targetPosition===2&&a.cardIds.includes('joker-1')),false);
});
test('CC-T09: figures and ace use values 11, 12, 13 and 14, not raw ace rank',()=>{
  for(const [target,good,bad] of [
    ['hearts-11',['hearts-5','hearts-6'],['hearts-4','hearts-6']],
    ['hearts-12',['hearts-5','hearts-7'],['hearts-4','hearts-7']],
    ['hearts-13',['hearts-6','hearts-7'],['hearts-5','hearts-7']],
    ['hearts-1',['hearts-6','hearts-8'],['hearts-5','hearts-8']],
    ['hearts-13',['hearts-1'],['hearts-2']],
  ]){
    for(const [cards,accepted] of [[good,true],[bad,false]]){
      const hand=[...cards,...['clubs-2','clubs-3','clubs-4'].slice(0,4-cards.length)];
      const s=captureFixture(target,hand);
      const a={type:'capture-a',targetPosition:2,cardIds:cards};
      if(accepted)assert.equal(act(s,a).discard.includes(target),true);
      else assert.equal(skydeckEngine.transition(s,a).accepted,false);
    }
  }
});
test('CC-T14: one successful capture ends the capture phase and next enemy phase refills',()=>{
  const s=captureFixture('hearts-9',['hearts-4','hearts-5','clubs-2','spades-3']);
  const a={type:'capture-a',targetPosition:2,cardIds:['hearts-4','hearts-5']};
  const n=act(s,a);
  assert.equal(skydeckEngine.transition(n,a).accepted,false);
  assert.equal(skydeckEngine.transition(n,{type:'capture-b'}).accepted,false);
  assert.equal(skydeckEngine.transition(n,{type:'capture-c'}).accepted,false);
  assert.deepEqual(skydeckEngine.getLegalActions(n),[{type:'advance-enemy'}]);
  const next=apply(n,'advance-enemy');
  assert.equal(next.enemyLine.every(id=>id!==null),true);
  assert.equal(next.phase,'discard');
});
test('CC-T15: last enemy captured by action A wins, remaining personal cards are retained',()=>{
  const s=captureFixture('hearts-9',['hearts-4','hearts-5','clubs-2','spades-3'],1,true);
  assert.equal(skydeckEngine.transition(s,{type:'capture-a',targetPosition:2,cardIds:['hearts-4','hearts-5']}).accepted,false);
  const n=act(s,{type:'capture-a',targetPosition:1,cardIds:['hearts-4','hearts-5']});
  assert.equal(n.outcome,'win');
  assert.equal(n.phase,'finished');
  assert.deepEqual(n.hand,['clubs-2','spades-3']);
  assert.deepEqual(n.enemyLine,[null,null,null,null]);
  assert.deepEqual(skydeckEngine.getLegalActions(n),[]);
  assert.equal(skydeckEngine.transition(n,{type:'advance-enemy'}).accepted,false);
});
