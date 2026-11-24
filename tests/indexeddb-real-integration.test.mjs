import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { createIndexedDbGameStorage } from '../src/adapters/indexeddb-game-storage.ts';
import { startPersistentGame, resumePersistentGame } from '../src/application/persistent-game-session.ts';
import { migrateAndResumeGame, SaveMigrationError } from '../src/application/save-migrations.ts';
import { stableResultId } from '../src/ports/local-storage.ts';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import { grimDelveEngine, GRIM_DELVE_RULES_VERSION } from '../src/games/clear-the-dungeon/engine.ts';
import { thunderfighterEngine, THUNDERFIGHTER_RULES_VERSION } from '../src/games/gridcannon/engine.ts';

function isolatedStorage() {
  const factory=new IDBFactory();
  const name='integration-'+crypto.randomUUID();
  return { factory, name, connect:()=>createIndexedDbGameStorage({factory,name}) };
}
const options=[
  {gameId:'clear-the-dungeon',rulesVersion:GRIM_DELVE_RULES_VERSION,formatVersion:1,sessionId:'grim-session'},
  {gameId:'gridcannon',rulesVersion:THUNDERFIGHTER_RULES_VERSION,formatVersion:1,sessionId:'thunder-session'},
];
const ids=makeDeckWithJokers().map(x=>x.id);
const powers=ids.filter(id=>!/(?:-(?:11|12|13))$/.test(id));
const figures=ids.filter(id=>/(?:-(?:11|12|13))$/.test(id));
function grimFinal(){
 const start=grimDelveEngine.createInitialState({seed:23});
 const monsterId=start.columns[0][0];
 const defeated=start.columns.flat().filter(id=>id!==monsterId);
 const remaining=powers.filter(id=>!['joker-1','clubs-3','joker-2'].includes(id));
 const removed=remaining.slice(0,33),other=remaining.slice(33);
 const hand=['joker-2',other[0]],drawPile=other.slice(1,6);
 const state={...start,columns:[[monsterId],[],[],[]],
  visibleMonsters:[monsterId,null,null,null],defeated,removed,
  damages:other.filter(id=>!hand.includes(id)&&!drawPile.includes(id)),drawPile,hand,
  attacks:[{monsterId,powers:[{cardId:'joker-1',handNumber:1},{cardId:'clubs-3',handNumber:1}]}]};
 assert.deepEqual(grimDelveEngine.validateState(state),{valid:true});
 return {state,action:{type:'trigger-attack',cardId:'joker-2',monsterId},score:5};
}
function thunderFinal(){
 const last=['clubs-11','spades-11'];
 const defeated=figures.filter(id=>!last.includes(id));
 const slots=[0,1,2,4,5,7,8,9,10,11],figureSlots=Array(12).fill(null);
 defeated.forEach((id,i)=>{figureSlots[slots[i]]=id});
 figureSlots[3]=last[0];figureSlots[6]=last[1];
 const grid9=['clubs-2','hearts-6','spades-5','diamonds-6','diamonds-7',
 'spades-8','clubs-5','hearts-9','clubs-9'];
 const grid=grid9.map(x=>[x]);
 const reserve=['hearts-1','joker-1'],pendingNumeric='hearts-10';
 const used=[...grid.flat(),...figureSlots,...reserve,pendingNumeric];
 const state={...thunderfighterEngine.createInitialState({seed:5}),
  phase:'playing',outcome:'in-progress',grid,figureSlots,defeatedFigures:defeated,pendingNumeric,
  drawPile:ids.filter(id=>!used.includes(id)),pendingFigures:[],specialReserve:reserve,
  spentSpecials:[],searchBuffer:[],placingFromSearch:false,armorCards:[],lastShot:[],
  lossReason:null,victoryScore:null,replacementSlot:null,replacementUsed:false};
 assert.deepEqual(thunderfighterEngine.validateState(state),{valid:true});
 return {state,action:{type:'place-number',cell:0},score:2};
}

test('CAR-41: both real engines save and resume independently across fresh IndexedDB adapters',async()=>{
 const db=isolatedStorage();
 const [grim,thunder]=await Promise.all([
   startPersistentGame(grimDelveEngine,db.connect(),options[0],{seed:514}),
   startPersistentGame(thunderfighterEngine,db.connect(),options[1],{seed:72}),
 ]);
 const grimAction=grim.getLegalActions()[0],thunderAction=thunder.getLegalActions()[0];
 assert.ok(grimAction&&thunderAction);
 assert.equal((await grim.dispatch(grimAction)).accepted,true);
 assert.equal((await thunder.dispatch(thunderAction)).accepted,true);
 const prevGrim=grim.getState(),prevThunder=thunder.getState();
 const reopenedGrim=await resumePersistentGame(grimDelveEngine,db.connect(),options[0]);
 const reopenedThunder=await resumePersistentGame(thunderfighterEngine,db.connect(),options[1]);
 assert.deepEqual(reopenedGrim.getState(),prevGrim);
 assert.deepEqual(reopenedThunder.getState(),prevThunder);
 assert.deepEqual((await db.connect().readGame(options[0].gameId)).state,prevGrim);
 assert.deepEqual((await db.connect().readGame(options[1].gameId)).state,prevThunder);
 assert.equal(await db.connect().readResult(stableResultId(options[0].gameId,options[0].sessionId)),undefined);
 assert.equal(await db.connect().readStatistics(options[1].gameId),undefined);
});

for(const [label,engine,opts,fixture] of [
 ['Grim Delve',grimDelveEngine,options[0],grimFinal],
 ['Thunderfighter',thunderfighterEngine,options[1],thunderFinal],
]){
 test(`CAR-41: ${label} actual terminal persists exactly one outcome and score across competing adapters`,async()=>{
  const db=isolatedStorage();
  await startPersistentGame(engine,db.connect(),opts,{seed:31});
  const {state,action,score}=fixture();
  const current=await db.connect().readGame(opts.gameId);
  await db.connect().commit({save:{...current,state}});
  const one=await resumePersistentGame(engine,db.connect(),opts);
  const two=await resumePersistentGame(engine,db.connect(),opts);
  const outcomes=await Promise.allSettled([one.dispatch(action),two.dispatch(action)]);
  assert.ok(outcomes.some(x=>x.status==='fulfilled'&&x.value.accepted));
  const persisted=await db.connect().readGame(opts.gameId);
  assert.equal(engine.getOutcome(persisted.state),'win');
  const result=await db.connect().readResult(stableResultId(opts.gameId,opts.sessionId));
  assert.equal(result.outcome,'win');
  assert.equal(result.score,score);
  assert.deepEqual(await db.connect().readStatistics(opts.gameId),
   {gameId:opts.gameId,played:1,won:1,lost:0,abandoned:0});
  assert.equal((await db.connect().commitTerminal({save:persisted,result})),'already-recorded');
  assert.equal((await db.connect().readStatistics(opts.gameId)).played,1);
 });
}
test('CAR-41: IndexedDB rejects an asynchronous unique-key conflict and rolls back whole result/stat transaction',async()=>{
 const db=isolatedStorage(),storage=db.connect(),opts=options[0];
 const initial=grimDelveEngine.createInitialState({seed:100});
 const save={gameId:opts.gameId,sessionId:opts.sessionId,formatVersion:1,rulesVersion:opts.rulesVersion,state:initial};
 const stats={gameId:opts.gameId,played:1,won:1,lost:0,abandoned:0};
 const result={id:'same-id',gameId:opts.gameId,sessionId:opts.sessionId,outcome:'win'};
 await storage.commit({save,result,statistics:stats});
 const previous=await storage.readGame(opts.gameId);
 const newer={...save,state:grimDelveEngine.createInitialState({seed:999})};
 // A request-level ConstraintError must abort the three-store transaction asynchronously.
 await assert.rejects(()=>storage.commit({save:newer,result,statistics:{...stats,played:2,won:2}}));
 assert.deepEqual(await storage.readGame(opts.gameId),previous);
 assert.deepEqual(await storage.readResult(result.id),result);
 assert.deepEqual(await storage.readStatistics(opts.gameId),stats);
});
test('CAR-41: IndexedDB migration incompatible / invalid preserved; explicit format migration succeeds and preserves both games',async()=>{
 const db=isolatedStorage(),storage=db.connect(),grim=grimDelveEngine.createInitialState({seed:3});
 await storage.commit({save:{gameId:options[0].gameId,sessionId:options[0].sessionId,
  rulesVersion:options[0].rulesVersion,formatVersion:1,state:grim}});
 await startPersistentGame(thunderfighterEngine,storage,options[1],{seed:7});
 const before=await storage.readGame(options[0].gameId);
 await assert.rejects(()=>migrateAndResumeGame(grimDelveEngine,storage,{...options[0],formatVersion:2},[]),
  error=>error instanceof SaveMigrationError && error.code==='incompatible');
 assert.deepEqual(await storage.readGame(options[0].gameId),before);
 const updated=await migrateAndResumeGame(grimDelveEngine,storage,{...options[0],formatVersion:2},[
  {fromVersion:1,toVersion:2,migrate:state=>structuredClone(state)}
 ]);
 assert.deepEqual(updated.getState(),grim);
 assert.equal((await storage.readGame(options[0].gameId)).formatVersion,2);
 assert.equal((await storage.readGame(options[1].gameId)).formatVersion,1);
});
test('CAR-41: rejected IndexedDB DataCloneError during migration keeps old readable snapshot and allows retry',async()=>{
 const db=isolatedStorage(),storage=db.connect();
 const state=grimDelveEngine.createInitialState({seed:4});
 const original={...options[0],state};
 await storage.commit({save:original});
 const before=await storage.readGame(original.gameId);
 await assert.rejects(()=>storage.migrateGame({previous:before,
  migrated:{...before,formatVersion:2,state:{...state,invalidFunction:()=>true}}}),e=>e.code==='write-failed');
 assert.deepEqual(await storage.readGame(original.gameId),before);
 await storage.migrateGame({previous:before,migrated:{...before,formatVersion:2}});
 assert.equal((await storage.readGame(original.gameId)).formatVersion,2);
});
test('CAR-41: stale session fails after a confirmed abandonment, new session remains recoverable',async()=>{
 const db=isolatedStorage(),storage=db.connect();
 const old=await startPersistentGame(grimDelveEngine,storage,options[0],{seed:1});
 const replacement={...options[0],sessionId:'replacement',state:grimDelveEngine.createInitialState({seed:2})};
 assert.equal(await db.connect().replaceGame({expectedSessionId:options[0].sessionId,replacement}),'replaced-abandoned');
 await assert.rejects(()=>old.dispatch(old.getLegalActions()[0]));
 assert.equal((await storage.readGame(options[0].gameId)).sessionId,'replacement');
 assert.deepEqual(await storage.readStatistics(options[0].gameId),{
  gameId:options[0].gameId,played:1,won:0,lost:0,abandoned:1});
 assert.equal((await storage.readResult(stableResultId(options[0].gameId,options[0].sessionId))).outcome,'abandoned');
 assert.equal((await resumePersistentGame(grimDelveEngine,db.connect(),options[0])).getState().rulesVersion,GRIM_DELVE_RULES_VERSION);
});
