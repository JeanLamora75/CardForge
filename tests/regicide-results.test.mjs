import test from 'node:test';
import assert from 'node:assert/strict';
import {regicideEngine as engine,getRegicideResult,inspectRegicide} from '../src/games/regicide/engine.ts';
const initial=()=>engine.createInitialState({seed:23});
function act(s,a){const before=structuredClone(s),r=engine.transition(s,a);assert.equal(r.accepted,true,r.reason);assert.deepEqual(s,before);return r.state;}
function lastKing(used){
 const s=initial(),enemy=s.castle.at(-1);
 return {...s,turn:20,activeEnemy:enemy,castle:[],enemyHealth:1,enemyAttack:20,discard:[s.activeEnemy,...s.castle.filter(id=>id!==enemy)],jokers:s.jokers.map((j,i)=>({...j,used:i<used}))};
}
function win(s){return act(act(act(s,{type:'play',cardIds:[s.hand[0]]}),{type:'resolve-powers'}),{type:'resolve-damage'});}
test('REG-T26: official medal depends solely on consumed jokers in victory',()=>{
 for(const [used,medal] of [[0,'gold'],[1,'silver'],[2,'bronze']]){
 const s=lastKing(used);
 assert.deepEqual(getRegicideResult(s),{outcome:'in-progress',medal:null,jokersUsed:used});
 const n=win(s);assert.deepEqual(getRegicideResult(n),{outcome:'win',medal,jokersUsed:used});
 assert.deepEqual(inspectRegicide(n).result,getRegicideResult(n));
 assert.deepEqual(getRegicideResult(JSON.parse(JSON.stringify(n))),getRegicideResult(n));
 assert.equal(engine.getVictoryScore,undefined);
 }
});
test('REG-T27: only the final king grants victory; terminal commands never mutate',()=>{
 const s=initial();const f={...s,turn:2,enemyHealth:1};
 const n=win(f);assert.equal(n.outcome,'in-progress');assert.equal(getRegicideResult(n).medal,null);
 const w=win(lastKing(2));const before=structuredClone(w);
 for(const a of [{type:'play',cardIds:[w.hand[0]]},{type:'resolve-powers'},{type:'resolve-damage'},{type:'retaliate',cardIds:[]},{type:'use-joker',jokerId:'joker-1'},{type:'accept-defeat'},{type:'pass'}]){
 const r=engine.transition(w,a);assert.equal(r.accepted,false);assert.equal(r.state,w);assert.deepEqual(w,before);
 }
});
test('REG-T20: defeat has no medal even when unused jokers remain',()=>{
 for(const used of [0,1,2]){
 const s=initial();
 const f={...s,turn:2,phase:'retaliation',hand:[],discard:[...s.hand],jokers:s.jokers.map((j,i)=>({...j,used:i<used}))};
 const n=act(f,{type:'accept-defeat'});assert.deepEqual(getRegicideResult(n),{outcome:'loss',medal:null,jokersUsed:used});assert.deepEqual(engine.getLegalActions(n),[]);
 }
});
test('REG-T32: solo pass forbidden; exhausted hand and jokers permit defeat even with zero retaliation',()=>{
 const s=initial();
 const f={...s,turn:2,hand:[],discard:[...s.hand],jokers:s.jokers.map(j=>({...j,used:true}))};
 assert.equal(inspectRegicide(f).blockedReason,'no-legal-play');
 assert.equal(engine.getOutcome(f),'in-progress');assert.deepEqual(engine.getLegalActions(f),[{type:'accept-defeat'}]);
 assert.equal(engine.transition(f,{type:'pass'}).accepted,false);
 const shielded={...f,shield:10};const n=act(shielded,{type:'accept-defeat'});assert.equal(n.outcome,'loss');assert.equal(getRegicideResult(n).medal,null);
 const rescue={...f,jokers:[{id:'joker-1',used:false},{id:'joker-2',used:true}]};assert.equal(engine.transition(rescue,{type:'accept-defeat'}).accepted,false);assert.equal(act(rescue,{type:'use-joker',jokerId:'joker-1'}).hand.length,8);
});
test('corrupt state is rejected separately from a game loss',()=>{
 const s=initial();const f={...s,tavern:s.tavern.slice(1)};
 assert.equal(engine.validateState(f).valid,false);
 assert.throws(()=>getRegicideResult(f));assert.throws(()=>engine.getOutcome(f));assert.throws(()=>inspectRegicide(f));
 assert.equal(engine.transition(f,{type:'accept-defeat'}).accepted,false);
});
