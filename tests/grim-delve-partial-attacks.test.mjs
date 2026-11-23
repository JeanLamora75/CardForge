import test from 'node:test';
import assert from 'node:assert/strict';
import { grimDelveEngine } from '../src/games/clear-the-dungeon/engine.ts';
import { makeDeckWithJokers } from '../src/core/cards.ts';

const all = makeDeckWithJokers().map(c=>c.id).sort();
const physical = s => [...s.columns.flat(),...s.drawPile,...s.hand,...s.damages,...s.defeated,...s.removed,...s.attacks.flatMap(a=>a.powers.map(p=>p.cardId))];
const first = () => grimDelveEngine.createInitialState({seed:71});
function equip(state,cards) {
  const hand=[...cards];
  const drawPile=[...state.hand,...state.drawPile].filter(id=>!hand.includes(id));
  assert.equal(drawPile.length+hand.length,42);
  const copy={...state,hand,drawPile};
  assert.equal(grimDelveEngine.validateState(copy).valid,true);
  return copy;
}
function act(s,action) {
  const r=grimDelveEngine.transition(s,action);
  assert.equal(r.accepted,true,JSON.stringify(action)+': '+r.reason);
  assert.equal(grimDelveEngine.validateState(r.state).valid,true);
  assert.deepEqual(physical(r.state).sort(),all);
  return r.state;
}
function rejected(s,action) {
  const r=grimDelveEngine.transition(s,action);
  assert.equal(r.accepted,false);
  assert.strictEqual(r.state,s);
}
function twoTargets() {
  const base=first();
  return {a:base.visibleMonsters[0],b:base.visibleMonsters[1],
    state:equip(base,['clubs-8','diamonds-9','hearts-10'])};
}
test('CTD-ARB-01 two distinct partial attacks retain physical card identities',()=>{
  const {a,b,state}=twoTargets();
  let s=act(state,{type:'place-power',cardId:'clubs-8',monsterId:a});
  s=act(s,{type:'place-power',cardId:'diamonds-9',monsterId:b});
  assert.deepEqual(s.attacks.map(x=>x.powers.map(p=>p.cardId)),[['clubs-8'],['diamonds-9']]);
  assert.equal(s.defeated.length,0);
});
test('CTD-T35/T36 current-hand power can move between targets and return',()=>{
  const {a,b,state}=twoTargets();
  let s=act(state,{type:'place-power',cardId:'clubs-8',monsterId:a});
  s=act(s,{type:'move-power',cardId:'clubs-8',monsterId:b});
  assert.equal(s.attacks.length,1);
  assert.equal(s.attacks[0].monsterId,b);
  s=act(s,{type:'take-back',cardId:'clubs-8'});
  assert.deepEqual(s.attacks,[]);
  assert.deepEqual(s.hand,['diamonds-9','hearts-10','clubs-8']);
});
test('CTD-T37/T38 closing hand locks old cards and leaves new hand movable',()=>{
  const {a,b,state}=twoTargets();
  let s=act(state,{type:'place-power',cardId:'clubs-8',monsterId:a});
  s=act(s,{type:'place-power',cardId:'diamonds-9',monsterId:b});
  s=act(s,{type:'discard',cardId:'hearts-10'});
  assert.ok(grimDelveEngine.getLegalActions(s).some(x=>x.type==='take-back'));
  s=act(s,{type:'end-hand'});
  assert.equal(s.handNumber,2);
  for(const cardId of ['clubs-8','diamonds-9']) {
    rejected(s,{type:'take-back',cardId});
    rejected(s,{type:'move-power',cardId,monsterId:a});
  }
  const chosen=grimDelveEngine.getLegalActions(s).find(x=>x.type==='place-power');
  assert.ok(chosen);
  s=act(s,chosen);
  assert.ok(grimDelveEngine.getLegalActions(s).some(x=>x.type==='take-back'&&x.cardId===chosen.cardId));
});
test('CTD-T131 an empty hand remains open, recoverable before confirmation',()=>{
  const {a,b,state}=twoTargets();
  let s=act(state,{type:'place-power',cardId:'clubs-8',monsterId:a});
  s=act(s,{type:'place-power',cardId:'diamonds-9',monsterId:b});
  s=act(s,{type:'discard',cardId:'hearts-10'});
  assert.deepEqual(s.hand,[]);
  s=act(s,{type:'take-back',cardId:'clubs-8'});
  assert.deepEqual(s.hand,['clubs-8']);
  rejected(s,{type:'end-hand'});
});
test('CTD-ARB-08/09 insufficient first or second power cannot be placed',()=>{
  let s=equip(first(),['clubs-1','diamonds-3','hearts-5']);
  const king=s.visibleMonsters.find(id=>id.endsWith('-13'));
  assert.ok(king);
  rejected(s,{type:'place-power',cardId:'clubs-1',monsterId:king});
  s=act(s,{type:'place-power',cardId:'diamonds-3',monsterId:king});
  rejected(s,{type:'place-power',cardId:'hearts-5',monsterId:king});
});
test('CTD-ARB-07 a trigger requires two adequate preceding powers',()=>{
  const s=equip(first(),['clubs-8','diamonds-9','joker-1']);
  const monsterId=s.visibleMonsters[0];
  rejected(s,{type:'trigger-attack',cardId:'joker-1',monsterId});
  const next=act(s,{type:'place-power',cardId:'clubs-8',monsterId});
  rejected(next,{type:'trigger-attack',cardId:'joker-1',monsterId});
});
test('CTD-ARB-06 complete attack removes three powers and immediately reveals next monster',()=>{
  const base=first(),monsterId=base.visibleMonsters[0];
  const suit=monsterId.split('-')[0],trigger=suit+'-2';
  let s=equip(base,['clubs-8','diamonds-9',trigger]);
  s=act(s,{type:'place-power',cardId:'clubs-8',monsterId});
  s=act(s,{type:'place-power',cardId:'diamonds-9',monsterId});
  s=act(s,{type:'trigger-attack',cardId:trigger,monsterId});
  assert.deepEqual(s.defeated,[monsterId]);
  assert.equal(s.visibleMonsters[0],base.columns[0][1]);
  assert.deepEqual(s.removed,['clubs-8','diamonds-9',trigger]);
  assert.deepEqual(s.damages,[]);
  rejected(s,{type:'take-back',cardId:'clubs-8'});
  rejected(s,{type:'trigger-attack',cardId:trigger,monsterId});
});
test('CTD-ARB-10 joker triggers any suit while its physical identity is preserved',()=>{
  const base=first(),monsterId=base.visibleMonsters[0];
  let s=equip(base,['clubs-8','diamonds-9','joker-1']);
  s=act(s,{type:'place-power',cardId:'clubs-8',monsterId});
  s=act(s,{type:'place-power',cardId:'diamonds-9',monsterId});
  s=act(s,{type:'trigger-attack',cardId:'joker-1',monsterId});
  assert.ok(s.removed.includes('joker-1'));
  assert.ok(physical(s).includes('joker-2'));
});
test('CTD-T39 serialized provisional placements restore identical legal actions',()=>{
  const {a,b,state}=twoTargets();
  let s=act(state,{type:'place-power',cardId:'clubs-8',monsterId:a});
  s=act(s,{type:'place-power',cardId:'diamonds-9',monsterId:b});
  const saved=JSON.parse(JSON.stringify(s));
  assert.equal(grimDelveEngine.validateState(saved).valid,true);
  assert.deepEqual(grimDelveEngine.getLegalActions(saved),grimDelveEngine.getLegalActions(s));
  assert.deepEqual(act(saved,{type:'take-back',cardId:'clubs-8'}).hand,['hearts-10','clubs-8']);
});
test('duplicate card in partial attack is invalid and offers no legal actions',()=>{
  const {a,state}=twoTargets();
  const s=act(state,{type:'place-power',cardId:'clubs-8',monsterId:a});
  const duplicate=structuredClone(s);
  duplicate.hand.push('clubs-8');
  assert.equal(grimDelveEngine.validateState(duplicate).valid,false);
  assert.deepEqual(grimDelveEngine.getLegalActions(duplicate),[]);
});
