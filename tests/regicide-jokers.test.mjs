import test from 'node:test';
import assert from 'node:assert/strict';
import {regicideEngine as engine} from '../src/games/regicide/engine.ts';
const physical=s=>[s.activeEnemy,...s.castle,...s.tavern,...s.hand,...s.discard,...s.combat,...s.pending,...s.jokers.map(j=>j.id)].filter(Boolean).sort();
function apply(s,a){const before=structuredClone(s),r=engine.transition(s,a);assert.equal(r.accepted,true,r.reason);assert.deepEqual(s,before);assert.deepEqual(physical(r.state),physical(s));assert.equal(engine.validateState(r.state).valid,true);return r.state;}
function reject(s,a){const before=structuredClone(s),r=engine.transition(s,a);assert.equal(r.accepted,false);assert.equal(r.state,s);assert.deepEqual(s,before);}
const joker=id=>({type:'use-joker',jokerId:id});
function opening(suit){for(let seed=0;seed<100;seed++){const s=engine.createInitialState({seed});if(s.activeEnemy.startsWith(suit+'-'))return s;}throw Error('seed not found');}
test('REG-T22: two independent single-use jokers in opening play',()=>{
 const s=engine.createInitialState({seed:23});
 const n=apply(s,joker('joker-1'));assert.equal(n.phase,'play');assert.equal(n.turn,1);assert.deepEqual(n.hand,s.tavern.slice(0,8));assert.deepEqual(n.discard,s.hand);assert.deepEqual(n.tavern,s.tavern.slice(8));assert.equal(n.recycleCount,0);
 reject(n,joker('joker-1'));reject(n,joker('unknown'));
 const m=apply(n,joker('joker-2'));assert.deepEqual(m.hand,n.tavern.slice(0,8));assert.deepEqual(m.discard,[...s.hand,...n.hand]);assert.ok(m.jokers.every(j=>j.used));assert.ok(!engine.getLegalActions(m).some(a=>a.type==='use-joker'));
});
test('joker is forbidden after attack starts and during power and damage resolution',()=>{
 const s=engine.createInitialState({seed:23});reject(s,{type:'play',cardIds:['joker-1']});
 const p=apply(s,{type:'play',cardIds:[s.hand[0]]});reject(p,joker('joker-1'));
 const d=apply(p,{type:'resolve-powers'});reject(d,joker('joker-2'));
});
test('REG-T23: retaliation renewal preserves combat, health, shield and phase, even at zero cost',()=>{
 const s=engine.createInitialState({seed:23});
 for(const shield of [0,10]){
 const f={...s,turn:2,phase:'retaliation',shield,enemyHealth:19};
 const n=apply(f,joker('joker-2'));assert.equal(n.phase,'retaliation');assert.equal(n.enemyHealth,f.enemyHealth);assert.equal(n.shield,shield);assert.deepEqual(n.combat,f.combat);assert.deepEqual(n.hand,f.tavern.slice(0,8));assert.equal(n.turn,f.turn);
 }
});
test('REG-R03: short or empty tavern never recycles the discard',()=>{
 const s=engine.createInitialState({seed:23});
 for(const length of [0,1,7]){
 const f={...s,turn:2,tavern:s.tavern.slice(0,length),discard:s.tavern.slice(length)};
 const n=apply(f,joker('joker-1'));assert.deepEqual(n.hand,f.tavern);assert.deepEqual(n.tavern,[]);assert.deepEqual(n.discard,[...f.discard,...f.hand]);assert.equal(n.recycleCount,f.recycleCount);
 }
});
test('REG-T24/25: joker ignores diamond immunity but never removes any enemy immunity',()=>{
 for(const suit of ['diamonds','spades']){
 const s=opening(suit);const card=s.tavern.find(id=>id.startsWith(suit+'-'));assert.ok(card);
 const f={...s,tavern:[card,...s.tavern.filter(id=>id!==card)]};
 const n=apply(f,joker('joker-1'));assert.equal(n.activeEnemy,s.activeEnemy);assert.equal(n.hand.length,8);
 const p=apply(n,{type:'play',cardIds:[card]});const d=apply(p,{type:'resolve-powers'});
 assert.deepEqual(d.hand,p.hand);assert.deepEqual(d.tavern,p.tavern);assert.equal(d.shield,p.shield);
 }
});
