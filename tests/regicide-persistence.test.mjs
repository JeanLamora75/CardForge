import test from 'node:test';import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {createIndexedDbGameStorage} from '../src/adapters/indexeddb-game-storage.ts';
import {startRegicide,resumeRegicide,getRegicideNewGameChoice,confirmRegicideNewGame,REGICIDE_SAVE_OPTIONS as options} from '../src/games/regicide/persistence.ts';
import {regicideEngine as engine,getRegicideResult} from '../src/games/regicide/engine.ts';
import {stableResultId} from '../src/ports/local-storage.ts';
function stores(){const factory=new IDBFactory();return ()=>createIndexedDbGameStorage({factory,name:'car79'});}
test('REG-T28 exact restore at every phase and deterministic next action',async()=>{
 const open=stores(),store=open();let session=await startRegicide(store,'one',{seed:23});
 for(const type of ['use-joker','play','resolve-powers','resolve-damage']){
 const action=session.getLegalActions().find(a=>a.type===type);const expected=engine.transition(session.getState(),action);
 assert.equal((await session.dispatch(action)).accepted,true);session=await resumeRegicide(open());assert.deepEqual(session.getState(),expected.state);
 assert.deepEqual(session.getLegalActions(),engine.getLegalActions(expected.state));
 }
});
test('confirmed replacement and abandonment are counted once and isolated',async()=>{
 const open=stores(),store=open();const other={gameId:'gridcannon',sessionId:'other',formatVersion:1,rulesVersion:'fixture',state:{sentinel:1}};await store.commit({save:other});
 const one=await startRegicide(store,'one',{seed:23});const choice=await getRegicideNewGameChoice(store);
 assert.equal(await confirmRegicideNewGame(store,'two',{seed:24},choice,false),undefined);
 assert.equal((await store.readGame('regicide')).sessionId,'one');
 await one.dispatch(one.getLegalActions().find(a=>a.type==='play'));
 assert.equal((await one.dispatch({type:'abandon'})).accepted,true);
 assert.equal((await one.dispatch({type:'abandon'})).accepted,false);
 assert.equal((await resumeRegicide(open())).getOutcome(),'abandoned');
 await confirmRegicideNewGame(store,'two',{seed:24},choice,true);
 const next=await getRegicideNewGameChoice(store);await confirmRegicideNewGame(store,'three',{seed:25},next,true);
 await assert.rejects(()=>confirmRegicideNewGame(store,'four',{seed:26},next,true));
 assert.deepEqual(await store.readStatistics('regicide'),{gameId:'regicide',played:2,won:0,lost:0,abandoned:2});assert.deepEqual(await store.readGame('gridcannon'),other);
});
test('write failure and incompatible saves remain intact',async()=>{
 const open=stores(),store=open();await startRegicide(store,'one',{seed:23});const before=await store.readGame('regicide');
 const session=await resumeRegicide({...store,commit:async()=>{throw Error('write failed');}});
 await assert.rejects(()=>session.dispatch(session.getLegalActions().find(a=>a.type==='play')));
 assert.deepEqual(session.getState(),before.state);assert.deepEqual(await store.readGame('regicide'),before);
 const bad={...before,formatVersion:99};await store.commit({save:bad});
 await assert.rejects(()=>resumeRegicide(open()));await assert.rejects(()=>getRegicideNewGameChoice(open()));assert.deepEqual(await store.readGame('regicide'),bad);
});
test('terminal wins and losses are atomic, idempotent and medal restored from exact snapshot',async()=>{
 const open=stores(),store=open();
 for(const outcome of ['win','loss']){
 const s=engine.createInitialState({seed:23});let state,action;
 if(outcome==='win'){const enemy=s.castle.at(-1);state={...s,turn:20,activeEnemy:enemy,castle:[],enemyHealth:1,enemyAttack:20,discard:[s.activeEnemy,...s.castle.filter(id=>id!==enemy)],jokers:s.jokers.map((j,i)=>({...j,used:i===0}))};state=engine.transition(state,{type:'play',cardIds:[state.hand[0]]}).state;state=engine.transition(state,{type:'resolve-powers'}).state;action={type:'resolve-damage'};}
 else{state={...s,turn:2,phase:'retaliation',hand:[],discard:[...s.hand],jokers:s.jokers.map(j=>({...j,used:true}))};action={type:'accept-defeat'};}
 const save={...options,sessionId:outcome,state};const previous=await store.readGame('regicide');if(previous)await store.replaceGame({expectedSessionId:previous.sessionId,replacement:save});else await store.commit({save});
 const failed=await resumeRegicide({...store,commitTerminal:async()=>{throw Error('failed');}});await assert.rejects(()=>failed.dispatch(action));assert.deepEqual(await store.readGame('regicide'),save);
 const session=await resumeRegicide(open());assert.equal((await session.dispatch(action)).accepted,true);assert.equal((await session.dispatch(action)).accepted,false);
 const restored=await resumeRegicide(open());assert.equal(restored.getOutcome(),outcome);assert.equal(getRegicideResult(restored.getState()).medal,outcome==='win'?'silver':null);
 const record=await store.readResult(stableResultId('regicide',outcome));assert.equal(record.outcome,outcome);assert.equal(record.score,undefined);
 }
 assert.deepEqual(await store.readStatistics('regicide'),{gameId:'regicide',played:2,won:1,lost:1,abandoned:0});
});