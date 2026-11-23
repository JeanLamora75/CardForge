import test from 'node:test';
import assert from 'node:assert/strict';
import { grimDelveEngine as engine, GRIM_DELVE_RULES_VERSION } from '../src/games/clear-the-dungeon/engine.ts';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import { resumePersistentGame } from '../src/application/persistent-game-session.ts';
import { stableResultId } from '../src/ports/local-storage.ts';

const all = makeDeckWithJokers();
const power = all.filter(c => 'kind' in c || c.rank <= 10).map(c => c.id);
function nearVictory(score=5) {
  const start=engine.createInitialState({seed:23});
  const monsterId=start.columns[0][0];
  const defeated= start.columns.flat().filter(id=>id!==monsterId);
  const columns=[[monsterId],[],[],[]];
  const cards=['joker-1', 'clubs-3', 'joker-2'];
  const remaining=power.filter(id=>!cards.includes(id));
  const removed=remaining.slice(0,33);
  const others=remaining.slice(33);
  const hand= score===0 ? ['joker-2', ...others.slice(0,2)] : ['joker-2', ...others.slice(0,1)];
  const drawPile=score===0 ? [] : others.slice(1,1+score);
  const damages=others.filter(id=>!hand.includes(id)&&!drawPile.includes(id));
  const s={...start,columns,visibleMonsters:[monsterId,null,null,null],defeated,
    removed,damages,drawPile,hand,
    attacks:[{monsterId,powers:[{cardId:'joker-1',handNumber:1},{cardId:'clubs-3',handNumber:1}]}]};
  assert.equal(engine.validateState(s).valid,true,JSON.stringify(engine.validateState(s)));
  return {s,monsterId};
}
function run(s,action) {const prev=structuredClone(s);const r=engine.transition(s,action);assert.equal(r.accepted,true,JSON.stringify(r));assert.deepEqual(s,prev);assert.equal(engine.validateState(r.state).valid,true,JSON.stringify(engine.validateState(r.state)));return r.state;}
function refuse(s,action) {const prev=structuredClone(s);const r=engine.transition(s,action);assert.equal(r.accepted,false);assert.strictEqual(r.state,s);assert.deepEqual(s,prev);}

test('CTD-T114: twelfth monster wins immediately and scores only five remaining draw cards',()=>{
 const {s,monsterId}=nearVictory(5);
 const final=run(s,{type:'trigger-attack',cardId:'joker-2',monsterId});
 assert.equal(final.defeated.length,12);
 assert.equal(final.outcome,'win');assert.equal(final.endReason,'victory');assert.equal(final.victoryScore,5);
 assert.equal(final.hand.length,1);assert.equal(final.drawPile.length,5);
 assert.equal(final.phase,'finished');assert.deepEqual(engine.getLegalActions(final),[]);
 refuse(final,{type:'end-hand'});refuse(final,{type:'trigger-attack',cardId:'joker-2',monsterId});
});
test('CTD-T115/T56: victory with exhausted deck scores zero, not an exhaustion loss',()=>{
 const {s,monsterId}=nearVictory(0);
 const final=run(s,{type:'trigger-attack',cardId:'joker-2',monsterId});
 assert.equal(final.outcome,'win');assert.equal(final.endReason,'victory');assert.equal(final.victoryScore,0);
 assert.equal(final.drawPile.length,0);assert.ok(final.hand.length>0);
 refuse(final,{type:'end-hand'});
});
test('CTD-T62/64: defeat of an exposed monster reveals next while other attacks are intact',()=>{
 const s=engine.createInitialState({seed:80});const monsterId=s.visibleMonsters[0],other=s.visibleMonsters[1];
 const ids=['joker-1','clubs-8','joker-2'];const pool=[...s.hand,...s.drawPile];
 const prepared={...s,hand:ids,drawPile:pool.filter(x=>!ids.includes(x)),
    attacks:[{monsterId:other,powers:[{cardId:'diamonds-9',handNumber:1}]}]};
 prepared.drawPile=prepared.drawPile.filter(x=>x!=='diamonds-9');
 assert.equal(engine.validateState(prepared).valid,true);
 let next=run(prepared,{type:'place-power',cardId:'joker-1',monsterId});
 next=run(next,{type:'place-power',cardId:'clubs-8',monsterId});
 next=run(next,{type:'trigger-attack',cardId:'joker-2',monsterId});
 assert.equal(next.visibleMonsters[0],s.columns[0][1]);
 assert.deepEqual(next.attacks,[{monsterId:other,powers:[{cardId:'diamonds-9',handNumber:1}]}]);
 assert.equal(next.endReason,null);assert.equal(next.victoryScore,null);
});
test('CTD-T118: seventh damage records damage cause and has no official score',()=>{
 const s=engine.createInitialState({seed:15});const cards=[...s.hand,...s.drawPile];
 const pre={...s,hand:cards.slice(6,9),drawPile:cards.slice(9),damages:cards.slice(0,6)};
 const final=run(pre,{type:'discard',cardId:pre.hand[0]});
 assert.equal(final.outcome,'loss');assert.equal(final.endReason,'damage');assert.equal(final.victoryScore,null);
 refuse(final,{type:'discard-remaining'});
});
test('CTD-T119: exhausted deck loses only upon closure, distinct from damage loss',()=>{
 const s=engine.createInitialState({seed:15});const allPower=[...s.hand,...s.drawPile];
 const pre={...s,hand:[],drawPile:[],removed:allPower};
 assert.equal(engine.validateState(pre).valid,true);
 const final=run(pre,{type:'end-hand'});
 assert.equal(final.outcome,'loss');assert.equal(final.endReason,'exhaustion');assert.equal(final.victoryScore,null);
 refuse(final,{type:'end-hand'});
});
test('terminal metadata validation rejects score after a loss and mismatched victory score',()=>{
 const {s,monsterId}=nearVictory(5);
 const won=run(s,{type:'trigger-attack',cardId:'joker-2',monsterId});
 assert.equal(engine.validateState({...won,victoryScore:6}).valid,false);
 assert.equal(engine.validateState({...won,endReason:'damage'}).valid,false);
 const lost=engine.createInitialState({seed:15});
 assert.equal(engine.validateState({...lost,victoryScore:10}).valid,false);
});
test('CTD-T120: persisted terminal result and official score are not recomputed on retry/reload',async()=>{
 const {s,monsterId}=nearVictory(5);
 const options={gameId:'clear-the-dungeon',rulesVersion:GRIM_DELVE_RULES_VERSION,formatVersion:1};
 let saved={...options,sessionId:'game-1',state:structuredClone(s)};
 const results=new Map();let commits=0;
 const storage={
  readGame:async()=>structuredClone(saved),readResult:async id=>results.get(id),readStatistics:async()=>undefined,
  commit:async()=>{throw Error('regular commit not expected');},
  async commitTerminal({save,result}) {
   const existing=results.get(result.id);
   if(existing)return 'already-recorded';
   commits++;saved=structuredClone(save);results.set(result.id,structuredClone(result));return 'recorded';
  }
 };
 const session=await resumePersistentGame(engine,storage,options);
 const done=await session.dispatch({type:'trigger-attack',cardId:'joker-2',monsterId});
 assert.equal(done.accepted,true);assert.equal(session.getSaveStatus(),'saved');
 assert.equal(session.getState().victoryScore,5);
 const resultId=stableResultId(options.gameId,'game-1');
 assert.equal(results.get(resultId).outcome,'win');assert.equal(commits,1);
 assert.equal((await session.dispatch({type:'trigger-attack',cardId:'joker-2',monsterId})).accepted,false);
 const restored=await resumePersistentGame(engine,storage,options);
 assert.equal(restored.getState().victoryScore,5);
 assert.equal(restored.getState().endReason,'victory');
 assert.equal((await restored.dispatch({type:'end-hand'})).accepted,false);
 assert.equal(commits,1);
});
