import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import { thunderfighterEngine as engine, getThunderfighterResult } from '../src/games/gridcannon/engine.ts';
import { resumePersistentGame } from '../src/application/persistent-game-session.ts';
import { stableResultId } from '../src/ports/local-storage.ts';

const ids=makeDeckWithJokers().map(card=>card.id);
const figures=ids.filter(id=>/-(?:11|12|13)$/.test(id));
const specials=ids.filter(id=>id.startsWith('joker-')||id.endsWith('-1'));
const numerics=ids.filter(id=>!id.startsWith('joker-')&&/-(?:[2-9]|10)$/.test(id));
const grid9=['clubs-2','hearts-6','spades-5','diamonds-6','diamonds-7',
  'spades-8','clubs-5','hearts-9','clubs-9'];
function nearVictory({reserve=['hearts-1','joker-1']}={}) {
  const last=['clubs-11','spades-11'];
  const defeated=figures.filter(id=>!last.includes(id));
  const slots=[0,1,2,4,5,7,8,9,10,11];
  const figureSlots=Array(12).fill(null);
  defeated.forEach((id,i)=>{figureSlots[slots[i]]=id});
  figureSlots[3]=last[0];figureSlots[6]=last[1];
  const grid=grid9.map(id=>[id]);
  const pendingNumeric='hearts-10';
  const used=[...grid.flat(),...figureSlots,...reserve,pendingNumeric];
  assert.equal(new Set(used).size,used.length);
  const s={...engine.createInitialState({seed:5}),phase:'playing',outcome:'in-progress',
    grid,figureSlots,defeatedFigures:defeated,pendingNumeric,
    drawPile:ids.filter(id=>!used.includes(id)),pendingFigures:[],
    specialReserve:[...reserve],spentSpecials:[],searchBuffer:[],placingFromSearch:false,
    armorCards:[],lastShot:[],lossReason:null,victoryScore:null,
    replacementSlot:null,replacementUsed:false};
  assert.deepEqual(engine.validateState(s),{valid:true});
  return s;
}
function physical(s) {
  const used=[...s.grid.flat(),...s.figureSlots.filter(Boolean),...s.pendingFigures,...s.drawPile,
    ...s.specialReserve,...s.spentSpecials,...(s.searchBuffer??[]),
    ...(s.pendingNumeric?[s.pendingNumeric]:[]),...(s.armorCards??[]).map(x=>x.cardId)];
  assert.deepEqual(used.sort(),[...ids].sort());
  assert.deepEqual(engine.validateState(s),{valid:true});
}
function apply(s,action){
  const snapshot=structuredClone(s),r=engine.transition(s,action);
  assert.equal(r.accepted,true,JSON.stringify(r));
  assert.deepEqual(s,snapshot);physical(r.state);return r.state;
}
function reject(s,action){
  const before=structuredClone(s),r=engine.transition(s,action);
  assert.equal(r.accepted,false);assert.strictEqual(r.state,s);assert.deepEqual(s,before);
}
test('GC-08: victory on twelfth figure only, with official score of unspent specials',()=>{
  const s=nearVictory();
  assert.deepEqual(getThunderfighterResult(s),{
    outcome:'in-progress',reason:null,officialScore:null,defeatedCount:10,physicalCardCount:54,
  });
  const won=apply(s,{type:'place-number',cell:0});
  assert.equal(won.defeatedFigures.length,12);assert.equal(won.outcome,'win');
  assert.equal(won.victoryScore,2);assert.equal(engine.getVictoryScore(won),2);
  assert.deepEqual(getThunderfighterResult(won),{
    outcome:'win',reason:'victory',officialScore:2,defeatedCount:12,physicalCardCount:54,
  });
  assert.deepEqual(engine.getLegalActions(won),[]);
  reject(won,{type:'place-number',cell:0});
});
test('GC-08: after using an As to refill draw, only remaining Joker contributes to score',()=>{
  let s=nearVictory();
  const before=s.drawPile.length;
  s=apply(s,{type:'extract',cardId:'hearts-1',cell:4});
  assert.equal(s.drawPile.length,before+1);
  assert.deepEqual(s.spentSpecials,['hearts-1']);
  const won=apply(s,{type:'place-number',cell:0});
  assert.equal(won.outcome,'win');assert.equal(won.victoryScore,1);
  assert.deepEqual(won.specialReserve,['joker-1']);
  assert.equal(getThunderfighterResult(won).officialScore,1);
});
test('GC-08: zero unspent actions yields valid victory score 0',()=>{
  const s=nearVictory({reserve:[]});
  const won=apply(s,{type:'place-number',cell:0});
  assert.equal(won.outcome,'win');
  assert.equal(won.victoryScore,0);
  assert.equal(getThunderfighterResult(won).officialScore,0);
});
test('GC-08: invalid premature victory or twelve defeated in progress is rejected',()=>{
  const s=nearVictory();
  assert.equal(engine.validateState({...s,outcome:'win',victoryScore:2}).valid,false);
  const illegal={...s,defeatedFigures:[...figures]};
  assert.equal(engine.validateState(illegal).valid,false);
  assert.deepEqual(engine.getLegalActions(illegal),[]);
  reject(illegal,{type:'place-number',cell:0});
});
test('GC-08: a modified victory score, missing card, duplicate card or rogue armor is rejected',()=>{
  const won=apply(nearVictory(),{type:'place-number',cell:0});
  assert.equal(engine.validateState({...won,victoryScore:3}).valid,false);
  const missing=structuredClone(won);missing.drawPile.pop();
  assert.equal(engine.validateState(missing).valid,false);
  const duplicate=structuredClone(won);duplicate.drawPile[0]=duplicate.grid[0][0];
  assert.equal(engine.validateState(duplicate).valid,false);
  const corrupt=structuredClone(won);corrupt.armorCards.push({figureId:'clubs-11',cardId:won.grid[1][0]});
  assert.equal(engine.validateState(corrupt).valid,false);
  assert.throws(()=>getThunderfighterResult(corrupt),TypeError);
});
test('losses never publish a victory score, including a corrupted loss',()=>{
  const s=nearVictory();
  const impossible={...s,outcome:'loss',lossReason:'stalemate'};
  assert.equal(engine.validateState({...impossible,victoryScore:5}).valid,false);
  assert.equal(engine.getVictoryScore(impossible),null);
});
test('GC-12/54 cards: all phases preserve identities while moving cards between zones',()=>{
  let s=engine.createInitialState({seed:321});physical(s);
  for(let i=0;i<20;i++){
    const actions=engine.getLegalActions(s);
    if(!actions.length)break;
    // Prefer initial figure placements, skip replacement, then ordinary draw and placements.
    const action=actions.find(a=>a.type==='place-figure') ??
      actions.find(a=>a.type==='skip-replacement') ??
      actions.find(a=>a.type==='place-number') ??
      actions.find(a=>a.type==='draw-card') ??
      actions.find(a=>a.type==='draw-search') ??
      actions[0];
    s=apply(s,action);
    if(s.outcome!=='in-progress')break;
  }
  physical(s);
});
test('terminal result stores score exactly once and restores same score without reroll',async()=>{
  const state=nearVictory({reserve:['joker-1','hearts-1']});
  const options={gameId:'gridcannon',rulesVersion:'v2',formatVersion:1};
  let saved={...options,sessionId:'game-car28',state:structuredClone(state)};
  let writes=0;const recorded=new Map();
  const storage={
    readGame:async()=>structuredClone(saved),
    readResult:async id=>structuredClone(recorded.get(id)),
    readStatistics:async()=>undefined,
    commit:async ({save})=>{saved=structuredClone(save)},
    commitTerminal:async ({save,result})=>{
      if(recorded.has(result.id))return 'already-recorded';
      recorded.set(result.id,structuredClone(result));saved=structuredClone(save);writes++;return 'recorded';
    },
  };
  const session=await resumePersistentGame(engine,storage,options);
  assert.ok(session);
  const first=await session.dispatch({type:'place-number',cell:0});
  assert.equal(first.accepted,true);
  const id=stableResultId(options.gameId,'game-car28');
  assert.deepEqual(recorded.get(id),{
    id,gameId:options.gameId,sessionId:'game-car28',outcome:'win',score:2,
  });
  assert.equal(writes,1);
  assert.equal((await session.dispatch({type:'place-number',cell:0})).accepted,false);
  const restored=await resumePersistentGame(engine,storage,options);
  assert.equal(restored.getState().victoryScore,2);
  assert.equal(getThunderfighterResult(restored.getState()).physicalCardCount,54);
  assert.equal((await restored.dispatch({type:'place-number',cell:0})).accepted,false);
  assert.equal(writes,1);
});
