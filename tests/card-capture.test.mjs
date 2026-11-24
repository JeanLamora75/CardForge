import test from 'node:test';
import assert from 'node:assert/strict';
import { skydeckEngine, prepareSkydeck, inspectSkydeck } from '../src/games/card-capture/engine.ts';
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
  assert.equal(skydeckEngine.getLegalActions(s).some(a=>a.type==='capture-a'&&a.targetPosition===2&&a.cardIds.includes('joker-1')&&!a.jokerCopyId),false);
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

test('CC-T10: each physical Joker copies the selected card value and suit',()=>{
  for(const joker of ['joker-1','joker-2']){
    const s=captureFixture('hearts-10',['hearts-5',joker,'clubs-2','spades-3']);
    const a={type:'capture-a',targetPosition:2,cardIds:[joker,'hearts-5'],jokerCopyId:'hearts-5'};
    const n=act(s,a);
    assert.deepEqual(n.discard,['hearts-5',joker,'hearts-10']);
    assert.deepEqual(n.hand,['clubs-2','spades-3']);
    assert.deepEqual(n.enemyCapture,[]);
    assert.equal(n.round,s.round+1);
    assert.equal(n.phase,'enemy');
    assert.equal(skydeckEngine.transition(n,a).accepted,false);
  }
});
test('CC-T10: copy choices are explicit and only sufficient references are legal',()=>{
  const s=captureFixture('hearts-13',['hearts-3','hearts-5','joker-1','clubs-2']);
  const cardIds=['hearts-3','hearts-5','joker-1'];
  const legal=skydeckEngine.getLegalActions(s).filter(a=>a.type==='capture-a'&&a.targetPosition===2&&a.cardIds.length===3);
  assert.deepEqual(legal,[{type:'capture-a',targetPosition:2,cardIds,jokerCopyId:'hearts-5'}]);
  for(const jokerCopyId of ['hearts-3','hearts-13','hearts-7','clubs-2','joker-1','joker-2',undefined,5]){
    const before=structuredClone(s);
    const r=skydeckEngine.transition(s,{type:'capture-a',targetPosition:2,cardIds,jokerCopyId});
    assert.equal(r.accepted,false);
    assert.equal(r.state,s);
    assert.deepEqual(s,before);
  }
  assert.equal(act(s,legal[0]).discard.includes('hearts-13'),true);
});
test('CC-T10: no independent Joker value, wrong suit or extraneous copy field',()=>{
  const s=captureFixture('hearts-10',['hearts-5','spades-5','joker-1','clubs-2']);
  for(const a of [
    {cardIds:['joker-1'],jokerCopyId:'hearts-5'},
    {cardIds:['spades-5','joker-1'],jokerCopyId:'spades-5'},
    {cardIds:['hearts-5','spades-5','joker-1'],jokerCopyId:'hearts-5'},
    {cardIds:['hearts-5','joker-1']},
    {cardIds:['hearts-5','joker-1'],jokerCopyId:'hearts-5',value:99},
    {cardIds:['hearts-5','hearts-5','joker-1'],jokerCopyId:'hearts-5'},
  ]){
    const r=skydeckEngine.transition(s,{type:'capture-a',targetPosition:2,...a});
    assert.equal(r.accepted,false);
    assert.equal(r.state,s);
  }
  const natural=captureFixture('hearts-9',['hearts-4','hearts-5','clubs-2','joker-1']);
  assert.equal(skydeckEngine.transition(natural,{type:'capture-a',targetPosition:2,cardIds:['hearts-4','hearts-5'],jokerCopyId:'hearts-5'}).accepted,false);
});
test('CC-T10: copied ace is worth fourteen and a captured Joker recycles with its original identity',()=>{
  const s=captureFixture('hearts-13',['hearts-1','joker-2','clubs-2','spades-3']);
  const n=act(s,{type:'capture-a',targetPosition:2,cardIds:['hearts-1','joker-2'],jokerCopyId:'hearts-1'});
  assert.deepEqual(n.discard,['hearts-1','joker-2','hearts-13']);
  const d=apply(n,'advance-enemy');
  const ready=act(d,{type:'discard',cardIds:[]});
  const empty={...ready,discard:[...ready.discard,...ready.playerDeck],playerDeck:[]};
  const drawn=act(empty,{type:'draw'});
  assert.equal([...drawn.hand,...drawn.playerDeck].filter(id=>id==='joker-2').length,1);
  assert.deepEqual(skydeckEngine.transition(JSON.parse(JSON.stringify(empty)),{type:'draw'}).state,drawn);
});
test('CC-R03: provisional guard refuses two Jokers with or without a reference',()=>{
  const s=captureFixture('hearts-12',['hearts-4','joker-1','joker-2','clubs-2']);
  for(const cardIds of [['joker-1','joker-2'],['hearts-4','joker-1','joker-2']]){
    const before=structuredClone(s);
    const r=skydeckEngine.transition(s,{type:'capture-a',targetPosition:2,cardIds,jokerCopyId:'hearts-4'});
    assert.equal(r.accepted,false);
    assert.equal(r.state,s);
    assert.deepEqual(s,before);
  }
  assert.equal(skydeckEngine.getLegalActions(s).some(a=>a.type==='capture-a'&&a.cardIds.includes('joker-1')&&a.cardIds.includes('joker-2')),false);
});

test('CC-T11: B sacrifices exactly one hand card and the enemy at position one',()=>{
  const s=captureFixture('hearts-9',['hearts-4','hearts-5','clubs-2','joker-1'],1);
  const choices=skydeckEngine.getLegalActions(s).filter(a=>a.type==='capture-b');
  assert.deepEqual(choices,s.hand.map(cardId=>({type:'capture-b',cardId})));
  for(const a of choices){
    const n=act(s,a);
    assert.deepEqual(n.enemyCapture,['hearts-9',a.cardId]);
    assert.deepEqual(n.hand,s.hand.filter(id=>id!==a.cardId));
    assert.deepEqual(n.enemyLine,[null,...s.enemyLine.slice(1)]);
    assert.deepEqual(n.playerDeck,s.playerDeck);
    assert.deepEqual(n.enemyDeck,s.enemyDeck);
    assert.deepEqual(n.discard,s.discard);
    assert.equal(n.round,s.round+1);
    assert.equal(n.phase,'enemy');
    assert.equal(n.outcome,'in-progress');
    const d=apply(n,'advance-enemy');
    const draw=act(d,{type:'discard',cardIds:[]});
    const c=apply(draw,'draw');
    assert.deepEqual(c.enemyCapture,n.enemyCapture);
    assert.equal(c.hand.includes(a.cardId),false);
    assert.equal(c.playerDeck.includes(a.cardId),false);
  }
});
test('CC-T12: every protected rank triggers immediate defeat on either side of action B',()=>{
  for(const rank of [1,11,12,13]){
    for(const [target,cardId] of [['hearts-'+rank,'clubs-2'],['hearts-9','clubs-'+rank],['hearts-'+rank,'clubs-'+rank]]){
      const s=captureFixture(target,[cardId,'spades-2','spades-3','joker-1'],1);
      const n=act(s,{type:'capture-b',cardId});
      assert.deepEqual(n.enemyCapture,[target,cardId]);
      assert.equal(n.outcome,'loss');
      assert.equal(n.phase,'finished');
      assert.equal(n.round,s.round);
      assert.deepEqual(skydeckEngine.getLegalActions(n),[]);
      assert.equal(skydeckEngine.transition(n,{type:'advance-enemy'}).accepted,false);
      for(const outcome of ['in-progress','win','abandoned']){
        const invalid={...n,outcome,phase:outcome==='in-progress'?'enemy':'finished'};
        assert.equal(skydeckEngine.validateState(invalid).valid,false);
      }
    }
  }
});
test('CC-T15: action B on final enemy wins only if neither sacrificed card is protected',()=>{
  for(const [target,cardId,outcome] of [['hearts-9','joker-2','win'],['hearts-13','clubs-2','loss'],['hearts-9','clubs-1','loss']]){
    const s=captureFixture(target,[cardId,'spades-2','spades-3','spades-4'],1,true);
    const n=act(s,{type:'capture-b',cardId});
    assert.equal(n.outcome,outcome);
    assert.equal(n.phase,'finished');
    assert.deepEqual(n.enemyLine,[null,null,null,null]);
    assert.deepEqual(n.enemyDeck,[]);
    assert.deepEqual(n.enemyCapture,[target,cardId]);
    assert.deepEqual(skydeckEngine.getLegalActions(n),[]);
  }
});
test('CC-T11 / CC-T14: B refuses invalid selections, target override and repeated captures',()=>{
  const s=captureFixture('hearts-9',['hearts-4','hearts-5','clubs-2','spades-3'],1);
  for(const action of [{type:'capture-b'},{type:'capture-b',cardId:'hearts-9'},{type:'capture-b',cardId:s.playerDeck[0]},{type:'capture-b',cardId:['clubs-2']},{type:'capture-b',cardId:'clubs-2',targetPosition:2}]){
    const before=structuredClone(s);
    const r=skydeckEngine.transition(s,action);
    assert.equal(r.accepted,false);
    assert.equal(r.state,s);
    assert.deepEqual(s,before);
  }
  const a={type:'capture-b',cardId:'clubs-2'};
  const n=act(s,a);
  assert.equal(skydeckEngine.transition(n,a).accepted,false);
  assert.equal(skydeckEngine.transition(n,{type:'capture-a',targetPosition:2,cardIds:['hearts-4','hearts-5']}).accepted,false);
  assert.equal(skydeckEngine.transition({...s,phase:'discard'},a).accepted,false);
});
test('CC-R04: no implicit substitution when position one is empty',()=>{
  const s=captureFixture('hearts-9',['hearts-4','hearts-5','clubs-2','spades-3'],1,true);
  const empty={...s,enemyLine:[null,'hearts-9',null,null]};
  assert.equal(skydeckEngine.validateState(empty).valid,false);
  assert.deepEqual(skydeckEngine.getLegalActions(empty),[]);
  const r=skydeckEngine.transition(empty,{type:'capture-b',cardId:'clubs-2'});
  assert.equal(r.accepted,false);
  assert.equal(r.state,empty);
});

test('CC-T13: every pair can push each occupied enemy to the bottom, without a personal capture',()=>{
  const s=captureFixture('hearts-13',['hearts-4','hearts-5','clubs-2','joker-1'],2);
  const choices=skydeckEngine.getLegalActions(s).filter(a=>a.type==='capture-c');
  assert.equal(choices.length,24);
  assert.equal(new Set(choices.map(a=>JSON.stringify(a))).size,24);
  for(const a of choices){
    const n=act(s,a);
    const selected=new Set(a.cardIds);
    const target=s.enemyLine[a.targetPosition-1];
    assert.deepEqual(n.enemyCapture,s.hand.filter(id=>selected.has(id)));
    assert.deepEqual(n.hand,s.hand.filter(id=>!selected.has(id)));
    assert.deepEqual(n.enemyDeck,[...s.enemyDeck,target]);
    assert.deepEqual(n.enemyLine,s.enemyLine.map((id,i)=>i===a.targetPosition-1?null:id));
    assert.deepEqual(n.discard,s.discard);
    assert.deepEqual(n.playerDeck,s.playerDeck);
    assert.equal(n.phase,'enemy');
    assert.equal(n.round,s.round+1);
    assert.equal(n.outcome,'in-progress');
    const filled=apply(n,'advance-enemy');
    assert.equal(filled.enemyDeck.at(-1),target);
    assert.equal(filled.enemyCapture.includes(target),false);
  }
});
test('CC-T12: C loses immediately for each protected rank sacrificed, but not for Jokers or a protected target',()=>{
  for(const rank of [1,11,12,13]){
    const s=captureFixture('hearts-9',['clubs-'+rank,'joker-2','spades-2','spades-3']);
    const n=act(s,{type:'capture-c',targetPosition:2,cardIds:['joker-2','clubs-'+rank]});
    assert.equal(n.outcome,'loss');
    assert.equal(n.phase,'finished');
    assert.equal(n.round,s.round);
    assert.deepEqual(n.enemyCapture,['clubs-'+rank,'joker-2']);
    assert.deepEqual(n.enemyDeck,[...s.enemyDeck,'hearts-9']);
    assert.deepEqual(skydeckEngine.getLegalActions(n),[]);
    assert.equal(skydeckEngine.transition(n,{type:'advance-enemy'}).accepted,false);
  }
  const s=captureFixture('hearts-13',['joker-1','joker-2','clubs-2','spades-3']);
  const n=act(s,{type:'capture-c',targetPosition:2,cardIds:['joker-2','joker-1']});
  assert.deepEqual(n.enemyCapture,['joker-1','joker-2']);
  assert.equal(n.outcome,'in-progress');
  assert.equal(n.enemyDeck.at(-1),'hearts-13');
});
test('CC-T13: last enemy is postponed rather than defeated, even with an empty enemy deck',()=>{
  const s=captureFixture('hearts-9',['hearts-4','hearts-5','clubs-2','spades-3'],1,true);
  const n=act(s,{type:'capture-c',targetPosition:1,cardIds:['clubs-2','spades-3']});
  assert.equal(n.outcome,'in-progress');
  assert.deepEqual(n.enemyLine,[null,null,null,null]);
  assert.deepEqual(n.enemyDeck,['hearts-9']);
  const filled=apply(n,'advance-enemy');
  assert.deepEqual(filled.enemyLine,['hearts-9',null,null,null]);
  assert.deepEqual(filled.enemyDeck,[]);
});
test('CC-T14: C rejects invalid selections and all second capture alternatives without mutation',()=>{
  const s=captureFixture('hearts-9',['hearts-4','hearts-5','clubs-2','spades-3'],1,true);
  const a={type:'capture-c',targetPosition:1,cardIds:['clubs-2','spades-3']};
  for(const invalid of [
    {...a,targetPosition:2},{...a,targetPosition:0},{...a,targetPosition:5},{...a,targetPosition:1.5},
    {...a,cardIds:['clubs-2']},{...a,cardIds:['clubs-2','clubs-2']},
    {...a,cardIds:['clubs-2','spades-3','hearts-4']},{...a,cardIds:['clubs-2',s.playerDeck[0]]},
    {...a,cardIds:new Array(2)},{...a,cardIds:null},{...a,jokerCopyId:'clubs-2'}
  ]){
    const before=structuredClone(s);
    const r=skydeckEngine.transition(s,invalid);
    assert.equal(r.accepted,false);
    assert.equal(r.state,s);
    assert.deepEqual(s,before);
  }
  const n=act(s,a);
  for(const action of [a,{type:'capture-a',targetPosition:1,cardIds:['hearts-4','hearts-5']},{type:'capture-b',cardId:'hearts-4'}]){
    const before=structuredClone(n);
    const r=skydeckEngine.transition(n,action);
    assert.equal(r.accepted,false);
    assert.equal(r.state,n);
    assert.deepEqual(n,before);
  }
  assert.equal(skydeckEngine.transition({...s,phase:'discard'},a).accepted,false);
});

test('public projection: exact allowlist, no hidden identities or seed, detached visible arrays and actions',()=>{
  const s=captureFixture('hearts-10',['hearts-5','joker-1','clubs-2','spades-3']);
  const moved=s.playerDeck.slice(0,2);
  const state={...s,playerDeck:s.playerDeck.slice(2),discard:[moved[0]],enemyCapture:[moved[1]]};
  // Choose a non-protected physical card for the enemy capture fixture.
  if(protectedCard(moved[1])){
    state.discard.push(moved[1]);
    state.enemyCapture=[];
    const index=state.playerDeck.findIndex(id=>!protectedCard(id));
    state.enemyCapture.push(...state.playerDeck.splice(index,1));
  }
  assert.equal(skydeckEngine.validateState(state).valid,true);
  const before=structuredClone(state);
  const view=inspectSkydeck(state);
  assert.deepEqual(Object.keys(view).sort(),['round','phase','outcome','hand','enemyLine','counts','actions','blockedReason'].sort());
  assert.deepEqual(view.counts,{playerDeck:state.playerDeck.length,enemyDeck:state.enemyDeck.length,discard:state.discard.length,enemyCapture:state.enemyCapture.length});
  assert.deepEqual(view.hand,state.hand);
  assert.deepEqual(view.enemyLine,state.enemyLine);
  const serialized=JSON.stringify(view);
  for(const id of [...state.playerDeck,...state.enemyDeck,...state.discard,...state.enemyCapture])
    assert.equal(serialized.includes(JSON.stringify(id)),false,id);
  assert.deepEqual(view.actions,skydeckEngine.getLegalActions(state));
  const reordered={...state,playerDeck:[...state.playerDeck].reverse(),enemyDeck:[...state.enemyDeck].reverse(),seed:123};
  assert.deepEqual(inspectSkydeck(reordered),view);
  view.hand.pop();
  view.enemyLine[0]=null;
  const selected=view.actions.find(a=>a.type==='capture-a'||a.type==='capture-c');
  selected.cardIds.pop();
  assert.deepEqual(state,before);
});
test('CC-T15: victory requires both enemy zones empty, personal hand and discard may remain',()=>{
  const s=captureFixture('hearts-9',['hearts-4','hearts-5','clubs-2','spades-3'],1,true);
  const a={type:'capture-a',targetPosition:1,cardIds:['hearts-4','hearts-5']};
  const n=act(s,a);
  assert.equal(n.outcome,'win');
  assert.equal(n.hand.length,2);
  assert.equal(n.discard.length,3);
  assert.equal(skydeckEngine.getVictoryScore,undefined);
  const stillEnemy={...s,enemyLine:['hearts-9',s.playerDeck.find(id=>initialEnemy.includes(id)),null,null]};
  stillEnemy.playerDeck=s.playerDeck.filter(id=>id!==stillEnemy.enemyLine[1]);
  assert.equal(act(stillEnemy,a).outcome,'in-progress');
  const forged={...s,phase:'finished',outcome:'win'};
  assert.equal(skydeckEngine.validateState(forged).valid,false);
  assert.equal(skydeckEngine.validateState({...n,phase:'enemy',outcome:'in-progress'}).valid,false);
});
test('CC-T12: loss takes priority and forged losses or integrity errors do not become defeats',()=>{
  const s=captureFixture('hearts-13',['clubs-2','clubs-3','spades-2','spades-3'],1,true);
  assert.equal(skydeckEngine.validateState({...s,phase:'finished',outcome:'loss'}).valid,false);
  const invalid={...s,playerDeck:s.playerDeck.slice(1)};
  assert.throws(()=>inspectSkydeck(invalid),TypeError);
  const r=skydeckEngine.transition(invalid,{type:'capture-b',cardId:'clubs-2'});
  assert.equal(r.accepted,false);
  assert.equal(r.state,invalid);
  assert.equal(r.state.outcome,'in-progress');
  const n=act(s,{type:'capture-b',cardId:'clubs-2'});
  assert.equal(n.outcome,'loss');
  assert.equal(inspectSkydeck(n).outcome,'loss');
  assert.deepEqual(inspectSkydeck(n).actions,[]);
});
test('CC-R02: absent A is not a defeat; reachable shortage is explicitly unresolved',()=>{
  const s=captureFixture('hearts-13',['clubs-2','clubs-3','spades-2','spades-3'],1,true);
  assert.equal(skydeckEngine.getLegalActions(s).some(a=>a.type==='capture-a'),false);
  assert.equal(inspectSkydeck(s).outcome,'in-progress');
  assert.equal(inspectSkydeck(s).blockedReason,null);
  assert.equal(skydeckEngine.getLegalActions(s).some(a=>a.type==='capture-c'),true);
  const initial=prepareSkydeck(initialPlayer,initialEnemy,0);
  let current=initial;
  // Repeatedly postpone an enemy using two unprotected starting cards.
  // No capture A can add cards to the personal circuit in this path.
  for(let i=0;i<6;i++){
    current=apply(current,'advance-enemy');
    current=apply(current,'discard-none');
    current=apply(current,'draw');
    current=act(current,{type:'capture-c',targetPosition:1,cardIds:current.hand.slice(0,2)});
  }
  current=apply(current,'advance-enemy');
  current=apply(current,'discard-none');
  assert.equal(current.hand.length+current.playerDeck.length+current.discard.length,2);
  const v=inspectSkydeck(current);
  assert.equal(v.blockedReason,'unconfirmed-insufficient-personal-cards');
  assert.equal(v.outcome,'in-progress');
  assert.deepEqual(v.actions,[]);
  assert.equal(skydeckEngine.transition(current,{type:'draw'}).accepted,false);
});
test('CC-T14: deterministic reachable trajectories preserve partition and protect hidden zones in every phase',()=>{
  for(let seed=0;seed<48;seed++){
    let s=skydeckEngine.createInitialState({seed});
    const random=createSeededRandom(seed);
    for(let step=0;step<80;step++){
      const v=inspectSkydeck(s);
      const serialized=JSON.stringify(v);
      for(const id of [...s.playerDeck,...s.enemyDeck,...s.discard,...s.enemyCapture])
        assert.equal(serialized.includes(JSON.stringify(id)),false,id);
      if(!v.actions.length)break;
      const a=v.actions[Math.floor(random()*v.actions.length)];
      const previous=s;
      s=act(s,a);
      if(previous.phase==='capture'){
        for(const alternative of previous===s?[]:v.actions){
          assert.equal(skydeckEngine.transition(s,alternative).accepted,false);
        }
      }
      if(s.outcome!=='in-progress'){
        assert.deepEqual(skydeckEngine.getLegalActions(s),[]);
        break;
      }
    }
  }
});
