import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { createIndexedDbGameStorage } from '../src/adapters/indexeddb-game-storage.ts';
import { stableResultId } from '../src/ports/local-storage.ts';
import { midnightSyndicateEngine as engine } from '../src/games/loot-the-loop/engine.ts';
import { startMidnightSyndicate, resumeMidnightSyndicate, getMidnightSyndicateNewGameChoice, confirmMidnightSyndicateNewGame, practiceMidnightSyndicate, MIDNIGHT_SYNDICATE_SAVE_OPTIONS as options } from '../src/games/loot-the-loop/persistence.ts';
import { translateUiText } from '../src/i18n/surface.ts';
const id=options.gameId, explore={type:'explore',distance:2};
function fixture(win=true){
  const s=engine.createInitialState({seed:55});
  const top=['hearts-2','clubs-3',win?'joker-1':'spades-13','clubs-4'];
  const loot=win?['hearts-1','clubs-1','spades-1','diamonds-1','diamonds-9']:[];
  return {...s,deck:[...top.map(c=>({id:c,faceUp:true})),...s.deck.filter(c=>!top.includes(c.id)&&!loot.includes(c.id))],loot:loot.map(id=>({id,faceUp:true}))};
}
function stores(){const factory=new IDBFactory();return ()=>createIndexedDbGameStorage({factory,name:'car55'});}
async function prepare(open,win=true){
  const storage=open();
  await startMidnightSyndicate(storage,'run',{seed:55});
  await storage.commit({save:{...options,sessionId:'run',state:fixture(win)}});
  return storage;
}
test('CAR-55: concurrent terminal actions and stale writes cannot duplicate statistics',async()=>{
  const open=stores(),store=await prepare(open);
  const before=await store.readGame(id);
  const [a,b]=await Promise.all([resumeMidnightSyndicate(open()),resumeMidnightSyndicate(open())]);
  const results=await Promise.all([a.dispatch(explore),a.dispatch(explore),b.dispatch(explore)]);
  assert.equal(results[0].accepted,true);assert.equal(results[1].accepted,false);
  assert.equal(results[2].state.outcome,'win');
  const saved=await store.readGame(id);
  assert.equal(saved.state.outcome,'win');
  assert.deepEqual(await store.readResult(stableResultId(id,'run')),{id:stableResultId(id,'run'),gameId:id,sessionId:'run',outcome:'win',score:5});
  assert.deepEqual(await store.readStatistics(id),{gameId:id,played:1,won:1,lost:0,abandoned:0});
  await assert.rejects(()=>store.commit({save:before}));
  assert.deepEqual(await store.readGame(id),saved);
  assert.equal((await resumeMidnightSyndicate(open())).getOutcome(),'win');
});
test('CAR-55: defeat and confirmed abandonment are distinct; cancellation and practice do not count',async()=>{
  const open=stores(),store=await prepare(open,false);
  const a=await resumeMidnightSyndicate(store);
  await a.dispatch(explore);
  assert.equal((await store.readResult(stableResultId(id,'run'))).outcome,'loss');
  assert.equal((await store.readResult(stableResultId(id,'run'))).score,undefined);
  let choice=await getMidnightSyndicateNewGameChoice(store);
  await confirmMidnightSyndicateNewGame(store,'next',{seed:55},choice,true);
  choice=await getMidnightSyndicateNewGameChoice(store);
  const before=await store.readGame(id);
  await confirmMidnightSyndicateNewGame(store,'third',{seed:56},choice,false);
  const practice=practiceMidnightSyndicate({seed:55});
  await practice.dispatch({type:'look-around'});
  assert.deepEqual(await store.readGame(id),before);
  assert.deepEqual(await store.readStatistics(id),{gameId:id,played:1,won:0,lost:1,abandoned:0});
  await confirmMidnightSyndicateNewGame(store,'third',{seed:56},choice,true);
  assert.equal((await store.readResult(stableResultId(id,'next'))).outcome,'abandoned');
  assert.deepEqual(await store.readStatistics(id),{gameId:id,played:2,won:0,lost:1,abandoned:1});
});
test('CAR-55: failed terminal commit does not advance session and retry counts once',async()=>{
  const open=stores(),store=await prepare(open);
  const before=await store.readGame(id);
  let fail=true;
  const session=await resumeMidnightSyndicate({...store,commitTerminal:async x=>{if(fail)throw Error('write failed');return store.commitTerminal(x);}});
  await assert.rejects(()=>session.dispatch(explore));
  assert.deepEqual(session.getState(),before.state);
  assert.deepEqual(await store.readGame(id),before);
  assert.equal(await store.readStatistics(id),undefined);
  fail=false;await session.dispatch(explore);
  assert.equal((await store.readStatistics(id)).played,1);
});
test('CAR-55: FR/EN translation is presentation-only',()=>{
  const s=fixture(),before=structuredClone(s);
  for(const [fr,en] of [['Observer','Look around'],['Carte cachée','Hidden card'],['Règles de Midnight Syndicate','Midnight Syndicate rules']]){
    assert.equal(translateUiText(fr,'fr'),fr);assert.equal(translateUiText(fr,'en'),en);
  }
  assert.deepEqual(s,before);
});
