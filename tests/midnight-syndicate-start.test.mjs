import test from 'node:test';
import assert from 'node:assert/strict';
import { makeStandardDeck } from '../src/core/cards.ts';
import {
  midnightSyndicateEngine as engine,
  MIDNIGHT_SYNDICATE_GAME_ID,
  MIDNIGHT_SYNDICATE_RULES_VERSION,
} from '../src/games/loot-the-loop/engine.ts';

function valid(state) {
  const result=engine.validateState(state);
  assert.deepEqual(result,{valid:true},JSON.stringify(result));
}
function rejected(state){
  const result=engine.validateState(state);
  assert.equal(result.valid,false,JSON.stringify(state));
  assert.ok(result.errors.length);
}
const expected=new Set([...makeStandardDeck().map(card=>card.id),'joker-1']);

test('LTL-T01 / CAR-45: first setup uses exactly 52 ordinary cards and one joker, all hidden',()=>{
  const state=engine.createInitialState({seed:23});
  assert.equal(MIDNIGHT_SYNDICATE_GAME_ID,'loot-the-loop');
  assert.equal(state.rulesVersion,MIDNIGHT_SYNDICATE_RULES_VERSION);
  assert.equal(state.phase,'exploring');
  assert.equal(state.outcome,'in-progress');
  assert.equal(state.deck.length,53);
  assert.equal(state.notes.length,0);
  assert.equal(state.loot.length,0);
  assert.ok(state.deck.every(card=>card.faceUp===false));
  assert.deepEqual(new Set(state.deck.map(card=>card.id)),expected);
  assert.equal(state.deck.some(card=>card.id==='joker-2'),false);
  valid(state);
});
test('LTL-T02 / CAR-45: initially Look Around is the only legal action; no card is shown',()=>{
  const initial=engine.createInitialState({seed:1});
  assert.deepEqual(engine.getLegalActions(initial),[{type:'look-around'}]);
  assert.ok(initial.deck.every(card=>!card.faceUp));
  assert.equal(engine.getOutcome(initial),'in-progress');
  assert.equal(engine.getVictoryScore(initial),null);
});
test('CAR-45: same seed creates the same circular order; independent seeds vary',()=>{
  const first=engine.createInitialState({seed:12345});
  assert.deepEqual(engine.createInitialState({seed:12345}),first);
  assert.notDeepEqual(engine.createInitialState({seed:12346}).deck,first.deck);
  const copy=structuredClone(first);
  const result=engine.transition(first,{type:'look-around'});
  assert.equal(result.accepted,false,'observing itself belongs to next story');
  assert.strictEqual(result.state,first,'rejected action returns the same state');
  assert.deepEqual(first,copy,'no hidden mutation on an unimplemented transition');
  assert.deepEqual(engine.getLegalActions({...first,deck:first.deck.map((card,i)=>i?card:{...card,faceUp:true})}),[],
    'no other actions are implemented in initialization story');
});
test('LTL-T19 / CAR-45: validator detects duplicate, omitted, unknown or additional joker',()=>{
  const initial=engine.createInitialState({seed:7});
  rejected({...initial,deck:[...initial.deck.slice(0,-1),initial.deck[0]]});
  rejected({...initial,deck:initial.deck.slice(0,-1)});
  rejected({...initial,deck:[...initial.deck.slice(0,-1),{id:'joker-2',faceUp:false}]});
  rejected({...initial,deck:[...initial.deck,{id:'joker-2',faceUp:false}]});
  rejected({...initial,deck:[...initial.deck.slice(0,-1),{id:'unknown-card',faceUp:false}]});
  rejected({...initial,deck:[...initial.deck.slice(0,-1),{id:5,faceUp:false}]});
});
test('LTL-T19 / CAR-45: validator rejects malformed visibility, illegal zones and metadata',()=>{
  const s=engine.createInitialState({seed:55});
  rejected({...s,deck:s.deck.map((card,i)=>i===0?{...card,faceUp:'false'}:card)});
  rejected({...s,deck:s.deck.map((card,i)=>i===0?{...card,faceUp:null}:card)});
  rejected({...s,deck:s.deck.map((card,i)=>i===0?{...card,faceUp:true,extra:'leak'}:card)});
  rejected({...s,deck:[...s.deck.slice(1),{...s.deck[0],faceUp:true}],notes:[{...s.deck[0],faceUp:false}]});
  rejected({...s,notes:[s.deck[0]]});
  rejected({...s,loot:[s.deck[0]]});
  rejected({...s,notes:Array(4).fill({id:'hearts-2',faceUp:true})});
  rejected({...s,phase:'finished'});
  rejected({...s,outcome:'win'});
  rejected({...s,rulesVersion:'unknown'});
  rejected({...s,hiddenData:true});
  rejected(null);
  rejected([]);
});
test('CAR-45: setup rejects invalid or extra parameters',()=>{
  for(const seed of [-1,1.2,4294967296,NaN,Infinity,'123',null]){
    assert.throws(()=>engine.createInitialState({seed}));
  }
  assert.throws(()=>engine.createInitialState({seed:1,extra:1}));
  assert.throws(()=>engine.createInitialState({}));
});
