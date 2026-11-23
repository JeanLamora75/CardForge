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
test('CTD-T23 / CTD-T31 / CTD-ARB-01 two distinct partial attacks retain physical card identities',()=>{
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
test('CTD-T27/T32 / CTD-T37/T38 closing hand locks old cards and leaves new hand movable',()=>{
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
test('CTD-T139 / CTD-T131 an empty hand remains open, recoverable before confirmation',()=>{
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
test('CTD-T76 / CTD-T97 / CTD-ARB-07 a trigger requires two adequate preceding powers',()=>{
  const s=equip(first(),['clubs-8','diamonds-9','joker-1']);
  const monsterId=s.visibleMonsters[0];
  rejected(s,{type:'trigger-attack',cardId:'joker-1',monsterId});
  const next=act(s,{type:'place-power',cardId:'clubs-8',monsterId});
  rejected(next,{type:'trigger-attack',cardId:'joker-1',monsterId});
});
test('CTD-T26 / CTD-T40 / CTD-T67 / CTD-ARB-06 complete attack removes three powers and immediately reveals next monster',()=>{
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
test('CTD-T33 / CTD-T39 serialized provisional placements restore identical legal actions',()=>{
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

test('CTD-T45/T47/T130/T139: discarded damage and still-open placements survive a JSON reload without implicit closure',()=>{
  const {a,state}=twoTargets();
  let next=act(state,{type:'place-power',cardId:'clubs-8',monsterId:a});
  next=act(next,{type:'discard',cardId:'diamonds-9'});
  next=act(next,{type:'discard',cardId:'hearts-10'});
  assert.deepEqual(next.hand,[]);
  assert.equal(next.damages.length,2);
  const restored=JSON.parse(JSON.stringify(next));
  assert.deepEqual(restored,next);
  assert.deepEqual(grimDelveEngine.getLegalActions(restored),grimDelveEngine.getLegalActions(next));
  assert.ok(grimDelveEngine.getLegalActions(restored).some(action=>action.type==='take-back'&&action.cardId==='clubs-8'));
  assert.ok(grimDelveEngine.getLegalActions(restored).some(action=>action.type==='end-hand'));
  next=act(restored,{type:'end-hand'});
  assert.equal(next.damages.length,2);
  assert.deepEqual(next.attacks.map(a=>a.powers.map(p=>p.cardId)),[['clubs-8']]);
  rejected(next,{type:'take-back',cardId:'clubs-8'});
});
test('CTD-T75/T133: an empty but open hand can move provisional powers; missing power forbids trigger',()=>{
  const {a,b,state}=twoTargets();
  let next=act(state,{type:'place-power',cardId:'clubs-8',monsterId:a});
  next=act(next,{type:'place-power',cardId:'diamonds-9',monsterId:b});
  next=act(next,{type:'discard',cardId:'hearts-10'});
  assert.equal(next.hand.length,0);
  next=act(next,{type:'move-power',cardId:'clubs-8',monsterId:b});
  assert.deepEqual(next.attacks.map(a=>a.powers.map(p=>p.cardId)),[['diamonds-9','clubs-8']]);
  assert.equal(next.handNumber,state.handNumber);
  next=act(next,{type:'take-back',cardId:'clubs-8'});
  assert.deepEqual(next.hand,['clubs-8']);
  rejected(next,{type:'trigger-attack',cardId:'clubs-8',monsterId:b});
  rejected(next,{type:'end-hand'});
});
test('CTD-T100/T101: provisional Joker survives serialization, can move, then locks on closing hand',()=>{
  const {a,b,state}=twoTargets();
  const nextHand=equip(state,['joker-1','clubs-8','hearts-10']);
  let next=act(nextHand,{type:'place-power',cardId:'joker-1',monsterId:a});
  const saved=JSON.parse(JSON.stringify(next));
  assert.ok(grimDelveEngine.getLegalActions(saved).some(x=>x.type==='move-power'&&x.cardId==='joker-1'));
  next=act(saved,{type:'move-power',cardId:'joker-1',monsterId:b});
  next=act(next,{type:'discard-remaining'});
  next=act(next,{type:'end-hand'});
  assert.deepEqual(next.attacks[0].powers.map(x=>x.cardId),['joker-1']);
  assert.equal(next.attacks[0].monsterId,b);
  rejected(next,{type:'take-back',cardId:'joker-1'});
  rejected(next,{type:'move-power',cardId:'joker-1',monsterId:a});
});
test('CTD-T63: the newly exposed enemy is immediately targetable with a remaining hand card',()=>{
  const start=first(),a=start.visibleMonsters[0];
  const pool=[...start.hand,...start.drawPile],used=['joker-1','hearts-10','joker-2','clubs-4'];
  const pre={...start,hand:['joker-2','clubs-4'],
    drawPile:pool.filter(id=>!used.includes(id)),
    handNumber:2,attacks:[{monsterId:a,powers:[{cardId:'joker-1',handNumber:1},{cardId:'hearts-10',handNumber:1}]}]};
  assert.deepEqual(grimDelveEngine.validateState(pre),{valid:true});
  const after=act(pre,{type:'trigger-attack',cardId:'joker-2',monsterId:a});
  assert.equal(after.visibleMonsters[0],start.columns[0][1]);
  assert.ok(grimDelveEngine.getLegalActions(after).some(x=>x.type==='place-power'&&x.cardId==='clubs-4'&&x.monsterId===after.visibleMonsters[0]));
});
test('CTD-T65: defeating last monster of one column does not invent a replacement or premature victory',()=>{
  const start=first(),original=start.columns.flat(),a=original[0],b=original[3];
  const pool=[...start.hand,...start.drawPile],used=['joker-1','clubs-8','joker-2'];
  const pre={...start,columns:[[a],[b],[],[]],visibleMonsters:[a,b,null,null],
    defeated:original.filter(id=>id!==a&&id!==b),
    hand:['joker-2'],drawPile:pool.filter(id=>!used.includes(id)),
    attacks:[{monsterId:a,powers:[{cardId:'joker-1',handNumber:1},{cardId:'clubs-8',handNumber:1}]}]};
  assert.deepEqual(grimDelveEngine.validateState(pre),{valid:true});
  const done=act(pre,{type:'trigger-attack',cardId:'joker-2',monsterId:a});
  assert.deepEqual(done.columns[0],[]);
  assert.equal(done.visibleMonsters[0],null);
  assert.equal(done.visibleMonsters[1],b);
  assert.equal(done.defeated.length,11);
  assert.equal(done.outcome,'in-progress');
});
