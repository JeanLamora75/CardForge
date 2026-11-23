import test from "node:test";
import assert from "node:assert/strict";
import {
  makeGrimDelveSummary, makeThunderfighterSummary, presentGameStatistics, replayFinishedGame,
} from "../src/application/game-results.ts";

test("CTD-T121: Grim Delve summary has official score only on a scored win", () => {
  const base = { outcome:"win", defeated:Array(12).fill("figure"),damages:[],handNumber:8,drawPile:[1,2],victoryScore:2 };
  const win = makeGrimDelveSummary(base);
  assert.equal(win.score,2);
  assert.match(win.title,/Victoire/);
  const loss = makeGrimDelveSummary({ ...base,outcome:"loss",endReason:"damage",victoryScore:null,damages:Array(7).fill(0) });
  assert.equal(loss.score,null);
  assert.equal(loss.scoreLabel,null);
  assert.match(loss.explanation,/Sept dégâts/);
  assert.equal(makeGrimDelveSummary({...base,outcome:"in-progress"}),null);
  assert.equal(makeGrimDelveSummary({...base,outcome:"abandoned"}),null);
});
test("Thunderfighter summary scores only a victory and describes distinct failure causes", () => {
  const base={outcome:"win",defeatedFigures:Array(12).fill("figure"),specialReserve:["heart-1","joker-1"],spentSpecials:[],drawPile:[],victoryScore:2};
  const win=makeThunderfighterSummary(base);
  assert.equal(win.score,2);
  assert.match(win.scoreLabel,/As et Jokers/);
  const armor=makeThunderfighterSummary({...base,outcome:"loss",lossReason:"armor",victoryScore:null});
  assert.equal(armor.score,null);
  assert.match(armor.explanation,/armure/);
  const stalemate=makeThunderfighterSummary({...base,outcome:"loss",lossReason:"stalemate",victoryScore:null});
  assert.match(stalemate.explanation,/continuation/);
});
test("statistics exclude abandonment from the victory rate and represent empty data as dash", () => {
  assert.deepEqual(presentGameStatistics(null),{played:0,won:0,lost:0,abandoned:0,victoryRate:"—"});
  assert.equal(presentGameStatistics({gameId:"gridcannon",played:6,won:2,lost:2,abandoned:2}).victoryRate,"50 %");
  assert.equal(presentGameStatistics({gameId:"gridcannon",played:4,won:0,lost:0,abandoned:4}).victoryRate,"—");
});
function mockStorage(outcome) {
  const games = new Map();
  games.set("gridcannon",{ gameId:"gridcannon",sessionId:"previous",rulesVersion:"v2",formatVersion:1,state:{outcome,seed:11} });
  let replaces=0;
  return {
    games,
    get replaces(){ return replaces; },
    async readGame(id){return structuredClone(games.get(id));},
    async replaceGame({expectedSessionId,replacement}) {
      assert.equal(games.get(replacement.gameId)?.sessionId,expectedSessionId);
      replaces++;
      games.set(replacement.gameId,structuredClone(replacement));
      return outcome==="in-progress"?"replaced-abandoned":"replaced-finished";
    },
  };
}
const engine={
  createInitialState: ({seed}) => ({outcome:"in-progress",seed}),
  getOutcome: state=>state.outcome,
  validateState: state=>Number.isInteger(state?.seed)?{valid:true}:{valid:false,errors:["invalid"]},
  getLegalActions:()=>[],
  transition:(state)=>({accepted:false,state,reason:"none"}),
};
const opts={gameId:"gridcannon",rulesVersion:"v2",formatVersion:1};
test("Replay replaces a finished session and leaves its statistics untouched", async()=>{
  const storage=mockStorage("win");
  const session=await replayFinishedGame(engine,storage,opts,{seed:27},"new-session");
  assert.equal(session.getState().seed,27);
  assert.equal(storage.replaces,1);
  assert.equal((await storage.readGame("gridcannon")).sessionId,"new-session");
});
test("Replay refuses live saves without implicit abandonment",async()=>{
  const storage=mockStorage("in-progress");
  await assert.rejects(()=>replayFinishedGame(engine,storage,opts,{seed:27},"new-session"),/pas terminée/);
  assert.equal(storage.replaces,0);
  assert.equal((await storage.readGame("gridcannon")).sessionId,"previous");
});
