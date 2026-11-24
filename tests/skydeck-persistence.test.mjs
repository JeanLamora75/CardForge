import test from 'node:test';
import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {createIndexedDbGameStorage} from '../src/adapters/indexeddb-game-storage.ts';
import {startSkydeck,resumeSkydeck,practiceSkydeck,getSkydeckNewGameChoice,confirmSkydeckNewGame,SKYDECK_SAVE_OPTIONS as options,skydeckSessionView} from '../src/games/card-capture/persistence.ts';
import {skydeckEngine as engine} from '../src/games/card-capture/engine.ts';
import {stableResultId} from '../src/ports/local-storage.ts';
import {readCatalogGameProgress,victoryRate} from '../src/application/catalog-navigation.ts';
function stores(){const factory=new IDBFactory();return ()=>createIndexedDbGameStorage({factory,name:'car67'});}
test('CC-T16: exact versioned restore across phases, deterministic replay, isolated tutorial and other games',async()=>{
 const open=stores(),store=open();
 const other={gameId:'gridcannon',sessionId:'other',rulesVersion:'test',formatVersion:1,state:{sentinel:1}};
 await store.commit({save:other});
 let session=await startSkydeck(store,'sky-1',{seed:54});
 for(const type of ['advance-enemy','discard-none','draw']){
  assert.equal((await session.dispatch({type})).accepted,true);
  const before=session.getState();
  session=await resumeSkydeck(open());
  assert.deepEqual(session.getState(),before);
  assert.deepEqual(session.getLegalActions(),engine.getLegalActions(before));
 }
 const before=await store.readGame(options.gameId);
 const training=practiceSkydeck({seed:54});
 assert.equal((await training.dispatch({type:'advance-enemy'})).accepted,true);
 assert.deepEqual(await store.readGame(options.gameId),before);
 assert.equal(await store.readStatistics(options.gameId),undefined);
 const action=session.getLegalActions().find(a=>a.type==='capture-b');
 const expected=engine.transition(session.getState(),action);
 assert.equal((await session.dispatch(action)).accepted,true);
 assert.deepEqual((await resumeSkydeck(open())).getState(),expected.state);
 assert.deepEqual(await store.readGame('gridcannon'),other);
});
test('confirmed replacement and explicit abandonment record exactly one result each',async()=>{
 const open=stores(),store=open();
 const session=await startSkydeck(store,'one',{seed:1});
 const choice=await getSkydeckNewGameChoice(store);
 assert.equal(await confirmSkydeckNewGame(store,'two',{seed:2},choice,false),undefined);
 assert.equal((await store.readGame(options.gameId)).sessionId,'one');
 assert.equal((await session.dispatch({type:'abandon'})).accepted,true);
 assert.equal((await session.dispatch({type:'abandon'})).accepted,false);
 assert.equal((await store.readResult(stableResultId(options.gameId,'one'))).outcome,'abandoned');
 assert.equal((await readCatalogGameProgress(store,options.gameId)).indicator,'finished');
 const second=await confirmSkydeckNewGame(store,'two',{seed:2},choice,true);
 assert.equal(second.getOutcome(),'in-progress');
 const nextChoice=await getSkydeckNewGameChoice(store);
 await confirmSkydeckNewGame(store,'three',{seed:3},nextChoice,true);
 await assert.rejects(()=>confirmSkydeckNewGame(store,'four',{seed:4},nextChoice,true));
 assert.deepEqual(await store.readStatistics(options.gameId),{gameId:options.gameId,played:2,won:0,lost:0,abandoned:2});
 assert.equal(victoryRate(await store.readStatistics(options.gameId)),'—');
});
test('incompatible save and failed storage transaction are preserved',async()=>{
 const open=stores(),store=open();
 await startSkydeck(store,'one',{seed:1});
 const before=await store.readGame(options.gameId);
 const failing={...store,commit:async()=>{throw Error('write failed');}};
 const session=await resumeSkydeck(failing);
 await assert.rejects(()=>skydeckSessionView(session).confirm({type:'advance-enemy'}));
 assert.deepEqual(session.getState(),before.state);
 assert.deepEqual(await store.readGame(options.gameId),before);
 const incompatible={...before,formatVersion:99};
 await store.commit({save:incompatible});
 await assert.rejects(()=>resumeSkydeck(open()));
 await assert.rejects(()=>getSkydeckNewGameChoice(open()));
 await assert.rejects(()=>startSkydeck(open(),'two',{seed:2}));
 assert.deepEqual(await store.readGame(options.gameId),incompatible);
});
