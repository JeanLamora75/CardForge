import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { createIndexedDbGameStorage } from '../src/adapters/indexeddb-game-storage.ts';
import { startMidnightSyndicate, resumeMidnightSyndicate, MIDNIGHT_SYNDICATE_SAVE_OPTIONS as options } from '../src/games/loot-the-loop/persistence.ts';
import { midnightSyndicateEngine as engine, inspectMidnightSyndicate } from '../src/games/loot-the-loop/engine.ts';
function stores() {
  const factory=new IDBFactory();
  return ()=>createIndexedDbGameStorage({factory,name:'car51'});
}
function arranged() {
  const s=engine.createInitialState({seed:51});
  const top=['hearts-2','clubs-3','spades-7','diamonds-5'];
  const notes=['clubs-9'],loot=['spades-1'];
  const used=[...top,...notes,...loot];
  return {...s,deck:[...top.map((id,i)=>({id,faceUp:i!==1})),...s.deck.filter(c=>!used.includes(c.id))],
    notes:notes.map(id=>({id,faceUp:true})),loot:loot.map(id=>({id,faceUp:true}))};
}
test('LTL-T18: exact restart with mixed faces, notes and loot; other games isolated',async()=>{
  const open=stores(),store=open();
  const other=['clear-the-dungeon','gridcannon'].map(gameId=>({gameId,sessionId:'other-'+gameId,rulesVersion:'fixture',formatVersion:1,state:{sentinel:gameId}}));
  for(const save of other) await store.commit({save});
  await startMidnightSyndicate(store,'ms-51',{seed:51});
  await store.commit({save:{...options,sessionId:'ms-51',state:arranged()}});
  const session=await resumeMidnightSyndicate(open());
  const result=await session.dispatch({type:'explore',distance:2});
  assert.equal(result.accepted,true);
  assert.equal(result.state.loot.length,2);
  const snapshot=session.getState();
  const restarted=await resumeMidnightSyndicate(open());
  assert.deepEqual(restarted.getState(),snapshot);
  assert.deepEqual(restarted.getLegalActions(),session.getLegalActions());
  assert.equal(restarted.getSaveStatus(),'saved');
  for(const save of other) assert.deepEqual(await open().readGame(save.gameId),save);
  const before=await store.readGame(options.gameId);
  inspectMidnightSyndicate(restarted.getState());
  assert.deepEqual(await store.readGame(options.gameId),before);
});
test('one active save, incompatible rules or format and corrupt state are preserved',async()=>{
  const open=stores(),store=open();
  await startMidnightSyndicate(store,'first',{seed:1});
  const before=await store.readGame(options.gameId);
  await assert.rejects(()=>startMidnightSyndicate(open(),'second',{seed:2}));
  assert.deepEqual(await store.readGame(options.gameId),before);
  for(const patch of [{formatVersion:2},{rulesVersion:'unknown'},{state:{bad:true}}]) {
    const save={...before,...patch};
    await store.commit({save});
    await assert.rejects(()=>resumeMidnightSyndicate(open()));
    await assert.rejects(()=>startMidnightSyndicate(open(),'replacement',{seed:2}));
    assert.deepEqual(await store.readGame(options.gameId),save);
  }
});
test('failed transaction leaves in-memory and durable snapshots unchanged',async()=>{
  const open=stores(),store=open();
  await startMidnightSyndicate(store,'ms-failure',{seed:51});
  await store.commit({save:{...options,sessionId:'ms-failure',state:arranged()}});
  const failing={...store,commit:async()=>{throw Error('simulated write failure')}};
  const session=await resumeMidnightSyndicate(failing);
  const before=session.getState(),durable=await store.readGame(options.gameId);
  await assert.rejects(()=>session.dispatch({type:'explore',distance:2}));
  assert.equal(session.getSaveStatus(),'error');
  assert.deepEqual(session.getState(),before);
  assert.deepEqual(await store.readGame(options.gameId),durable);
});
