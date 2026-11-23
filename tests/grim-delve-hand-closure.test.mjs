import test from 'node:test';
import assert from 'node:assert/strict';
import { grimDelveEngine as engine } from '../src/games/clear-the-dungeon/engine.ts';
import { makeDeckWithJokers } from '../src/core/cards.ts';
const ids = makeDeckWithJokers().map(c=>c.id).sort();
const zones = s => [...s.columns.flat(),...s.drawPile,...s.hand,...s.damages,...s.removed,...s.defeated,...s.attacks.flatMap(a=>a.powers.map(p=>p.cardId))].sort();
function check(s) { assert.equal(engine.validateState(s).valid,true,JSON.stringify(engine.validateState(s)));assert.deepEqual(zones(s),ids);return s; }
function play(s,action) { const before=structuredClone(s);const r=engine.transition(s,action);assert.equal(r.accepted,true,JSON.stringify({action,reason:r.reason}));assert.deepEqual(s,before);return check(r.state); }
function refuse(s,action) { const before=structuredClone(s);const r=engine.transition(s,action);assert.equal(r.accepted,false);assert.strictEqual(r.state,s);assert.deepEqual(s,before); }
const initial=()=>engine.createInitialState({seed:423});
function finalHand(count) { const s=initial(),cards=[...s.hand,...s.drawPile],drawPile=count?cards.slice(-count):[];return check({...s,hand:[],drawPile,removed:count?cards.slice(0,-count):cards}); }
test('CTD-T42 bulk discards only unplayed cards; placed power remains on monster',()=>{
 let s=initial(); const target=s.visibleMonsters[0];
 const card=engine.getLegalActions(s).find(a=>a.type==='place-power'&&a.monsterId===target);
 assert.ok(card);s=play(s,card);const leftovers=[...s.hand];
 s=play(s,{type:'discard-remaining'});
 assert.deepEqual(s.hand,[]);assert.deepEqual(s.damages,leftovers);
 assert.deepEqual(s.attacks[0].powers.map(p=>p.cardId),[card.cardId]);
 assert.equal(s.phase,'attack');
});
test('CTD-T44/T129 bulk discard stops exactly on damage 7, leaving unused cards intact',()=>{
 const s=initial(),old=[...s.hand,...s.drawPile];
 const damaged=check({...s,damages:old.slice(0,6),hand:old.slice(6,9),drawPile:old.slice(9)});
 const r=play(damaged,{type:'discard-remaining'});
 assert.equal(r.outcome,'loss');assert.equal(r.damages.length,7);
 assert.deepEqual(r.hand,old.slice(7,9));assert.deepEqual(engine.getLegalActions(r),[]);
 refuse(r,{type:'discard-remaining'});
});
test('CTD-T122/123 attack, explicit discard, then another legal attack',()=>{
 let s=initial();const a=engine.getLegalActions(s).find(a=>a.type==='place-power');assert.ok(a);
 s=play(s,a);const discarded=s.hand[0];s=play(s,{type:'discard',cardId:discarded});
 assert.ok(s.attacks.some(attack=>attack.powers.some(p=>p.cardId===a.cardId)));
 assert.equal(s.damages.includes(discarded),true);
 const next=engine.getLegalActions(s).find(a=>a.type==='place-power');assert.ok(next);
 s=play(s,next);assert.equal(s.hand.length,0);assert.equal(s.damages.length,1);
});
test('CTD-T124/T125 discarded card stays irretrievable while provisional placed card can return',()=>{
 let s=initial();const a=engine.getLegalActions(s).find(a=>a.type==='place-power');s=play(s,a);
 const discarded=s.hand[0];s=play(s,{type:'discard',cardId:discarded});
 refuse(s,{type:'take-back',cardId:discarded});
 s=play(s,{type:'take-back',cardId:a.cardId});assert.ok(s.hand.includes(a.cardId));assert.ok(s.damages.includes(discarded));
});
test('CTD-T131/T132 empty hand stays open, provisional card can be recovered',()=>{
 let s=initial();const a=engine.getLegalActions(s).find(a=>a.type==='place-power');s=play(s,a);
 s=play(s,{type:'discard-remaining'});assert.equal(s.hand.length,0);assert.equal(s.outcome,'in-progress');
 assert.ok(engine.getLegalActions(s).some(x=>x.type==='end-hand'));
 s=play(s,{type:'take-back',cardId:a.cardId});
 refuse(s,{type:'end-hand'});
});
for(const count of [1,2])test(`CTD-T48/T49/T55 explicit closure deals exactly ${count} last cards`,()=>{
 const s=finalHand(count),oldPile=[...s.drawPile];
 const n=play(s,{type:'end-hand'});
 assert.deepEqual(n.hand,oldPile);assert.deepEqual(n.drawPile,[]);assert.equal(n.outcome,'in-progress');
 refuse(n,{type:'end-hand'});
});
test('CTD-T57/T136/T137 final empty draw pile loses only after explicit closure',()=>{
 const s=finalHand(0);assert.equal(s.outcome,'in-progress');
 const n=play(s,{type:'end-hand'});
 assert.equal(n.outcome,'loss');assert.equal(n.phase,'finished');refuse(n,{type:'end-hand'});
});
test('CTD-T134/T140 duplicate closure cannot create two hands',()=>{
 const s=finalHand(2),n=play(s,{type:'end-hand'});
 refuse(n,{type:'end-hand'});assert.equal(n.handNumber,s.handNumber+1);
 assert.equal(n.drawPile.length,0);
});
test('bulk discard with extra parameters is rejected without mutating any card',()=>{
 const s=initial();refuse(s,{type:'discard-remaining',cardId:s.hand[0]});
});
