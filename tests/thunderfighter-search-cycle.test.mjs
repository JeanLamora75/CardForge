import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import { thunderfighterEngine as engine,
  getSearchPresentation, diagnoseSearchIntegrity } from '../src/games/gridcannon/engine.ts';

const deck=makeDeckWithJokers().map(c=>c.id);
const figures=deck.filter(id=>/-(?:11|12|13)$/.test(id));
const isFigure=id=>/-(?:11|12|13)$/.test(id);
function fixture({drawFirst=['clubs-4','spades-1','diamonds-8','joker-2','spades-5','hearts-12'],
    reserved=[],phase='searching'}={}) {
  const placed=figures.filter(id=>id!=='hearts-12');
  const figureSlots=Array.from({length:12},(_,i)=>placed[i]??null);
  const gridCards=deck.filter(id=>/-(?:[2-9]|10)$/.test(id)&&!id.startsWith('joker-')&&!drawFirst.includes(id)).slice(0,9);
  const grid=gridCards.map(id=>[id]);
  const used=[...placed,...gridCards,...reserved];
  assert.equal(new Set([...used,...drawFirst]).size,used.length+drawFirst.length);
  const remaining=deck.filter(id=>!used.includes(id));
  for(const id of drawFirst)assert.ok(remaining.includes(id),id);
  const drawPile=[...drawFirst,...remaining.filter(id=>!drawFirst.includes(id))];
  const state={...engine.createInitialState({seed:99}),phase,grid,figureSlots,
    defeatedFigures:[...placed],pendingFigures:[],specialReserve:[...reserved],
    spentSpecials:[],pendingNumeric:null,searchBuffer:[],placingFromSearch:false,
    drawPile,armorCards:[],lastShot:[],lossReason:null,victoryScore:null,
    replacementUsed:false,replacementSlot:null};
  assert.deepEqual(engine.validateState(state),{valid:true});
  return state;
}
function assertInventory(s){
  const physical=[...s.grid.flat(),...s.figureSlots.filter(Boolean),...s.pendingFigures,
    ...s.drawPile,...s.specialReserve,...s.spentSpecials,...(s.searchBuffer??[]),
    ...(s.pendingNumeric?[s.pendingNumeric]:[]),...(s.armorCards??[]).map(a=>a.cardId)];
  assert.deepEqual(physical.sort(),[...deck].sort());
  assert.deepEqual(engine.validateState(s),{valid:true});
}
function step(s,action){
  const old=structuredClone(s);
  const r=engine.transition(s,action);
  assert.equal(r.accepted,true,JSON.stringify({action,r}));
  assert.deepEqual(s,old);
  assertInventory(r.state);
  return r.state;
}
function refuse(s,action){
  const old=structuredClone(s);
  const r=engine.transition(s,action);
  assert.equal(r.accepted,false);
  assert.strictEqual(r.state,s);
  assert.deepEqual(s,old);
}

test('GC-18: Carte suivante reveals exactly one physical card per explicit action',()=>{
  let s=fixture();
  assert.equal(s.phase,'searching');
  assert.deepEqual(getSearchPresentation(s).revealedNumerics,[]);
  assert.equal(getSearchPresentation(s).nextCardAvailable,true);
  const next=s.drawPile[0];
  s=step(s,{type:'draw-search'});
  assert.deepEqual(s.searchBuffer,[next]);
  assert.equal(s.drawPile.length,deck.length-11-9-1);
  assert.ok(engine.getLegalActions(s).some(a=>a.type==='draw-search'));
  refuse(s,{type:'draw-card'});
  refuse(s,{type:'place-number',cell:0});
});
test('GC-09/19: revealed numerics are ordered and As/Joker go immediately into reserve',()=>{
  let s=fixture();
  const ordered=['clubs-4','diamonds-8','spades-5'];
  for(let i=0;i<5;i++){
    s=step(s,{type:'draw-search'});
    const display=getSearchPresentation(s);
    if(i===0)assert.deepEqual(display.revealedNumerics,['clubs-4']);
    if(i===1)assert.ok(s.specialReserve.includes('spades-1'));
    if(i===2)assert.deepEqual(display.revealedNumerics,['clubs-4','diamonds-8']);
    if(i===3)assert.ok(s.specialReserve.includes('joker-2'));
    if(i===4)assert.deepEqual(display.revealedNumerics,ordered);
  }
  assert.deepEqual(s.searchBuffer,ordered);
  assert.deepEqual(s.spentSpecials,[]);
  assert.equal(getSearchPresentation(s).visible,true);
});
test('GC-T21 / GC-T30 / GC-18/19: found figure must be placed before buffered numerics return to bottom',()=>{
  let s=fixture();
  for(let i=0;i<5;i++)s=step(s,{type:'draw-search'});
  const before=[...s.drawPile];
  s=step(s,{type:'draw-search'});
  assert.equal(s.phase,'placing-figure');
  assert.equal(s.placingFromSearch,true);
  assert.deepEqual(s.pendingFigures,['hearts-12']);
  const display=getSearchPresentation(s);
  assert.equal(display.visible,true);
  assert.equal(display.nextCardAvailable,false);
  assert.deepEqual(display.revealedNumerics,['clubs-4','diamonds-8','spades-5']);
  assert.deepEqual(s.drawPile,before.slice(1));
  refuse(s,{type:'draw-search'});
  const candidate=engine.getLegalActions(s).find(a=>a.type==='place-figure');
  assert.ok(candidate);
  s=step(s,candidate);
  assert.equal(s.phase,'playing');
  assert.equal(s.searchBuffer.length,0);
  assert.deepEqual(s.drawPile.slice(-3),['clubs-4','diamonds-8','spades-5']);
  assert.deepEqual(getSearchPresentation(s).revealedNumerics,[]);
  assert.equal(getSearchPresentation(s).visible,false);
});
test('GC-18: a snapshot before next click resumes without automatic second draw',()=>{
  let s=fixture();
  s=step(s,{type:'draw-search'});
  const snapshot=JSON.parse(JSON.stringify(s));
  assert.deepEqual(getSearchPresentation(snapshot),getSearchPresentation(s));
  assert.deepEqual(engine.getLegalActions(snapshot),engine.getLegalActions(s));
  assert.deepEqual(step(snapshot,{type:'draw-search'}),step(s,{type:'draw-search'}));
});
test('GC-11: voluntary Extraction during search leaves revealed numerics intact and never auto draws',()=>{
  let s=fixture({reserved:['hearts-1']});
  s=step(s,{type:'draw-search'});
  const prev=[...s.drawPile],buffer=[...s.searchBuffer];
  s=step(s,{type:'extract',cardId:'hearts-1',cell:0});
  assert.deepEqual(s.searchBuffer,buffer);
  assert.deepEqual(s.drawPile,[...prev,...fixture({reserved:['hearts-1']}).grid[0].slice().reverse()]);
  assert.equal(s.phase,'searching');
  assert.equal(getSearchPresentation(s).nextCardAvailable,true);
  assert.equal(s.spentSpecials.includes('hearts-1'),true);
  refuse(s,{type:'extract',cardId:'hearts-1',cell:0});
});
test('GC-19: an attempted manipulation of buffered numeric is not a legal action',()=>{
  let s=step(fixture(),{type:'draw-search'});
  refuse(s,{type:'play-search-card',cardId:'clubs-4',cell:0});
  refuse(s,{type:'draw-search',count:3});
  refuse(s,{type:'return-buffer'});
  assert.deepEqual(s.searchBuffer,['clubs-4']);
});
test('GC-12: missing physical figure gives nonterminal factual integrity diagnostic',()=>{
  const s=fixture();
  const bad=structuredClone(s);
  bad.drawPile=bad.drawPile.filter(id=>id!=='hearts-12');
  const snap=JSON.stringify(bad);
  const diagnostic=diagnoseSearchIntegrity(bad);
  assert.equal(diagnostic.status,'invalid');
  assert.ok(diagnostic.missingFigures.includes('hearts-12'));
  assert.ok(diagnostic.issues.length);
  assert.equal(engine.validateState(bad).valid,false);
  assert.deepEqual(engine.getLegalActions(bad),[]);
  refuse(bad,{type:'draw-search'});
  assert.equal(JSON.stringify(bad),snap);
  assert.equal(bad.outcome,'in-progress');
});
test('GC-12: duplicated figure is reported without a manufactured loss',()=>{
  const bad=structuredClone(fixture());
  bad.drawPile.push('hearts-12');
  const diagnostic=diagnoseSearchIntegrity(bad);
  assert.equal(diagnostic.status,'invalid');
  assert.deepEqual(diagnostic.duplicatedFigures,['hearts-12']);
  assert.deepEqual(engine.getLegalActions(bad),[]);
  assert.equal(bad.outcome,'in-progress');
});
test('GC-12: pending placement is a valid in-flight operation, not missing figure',()=>{
  let s=fixture();
  for(let i=0;i<6;i++)s=step(s,{type:'draw-search'});
  assert.equal(diagnoseSearchIntegrity(s).status,'pending-placement');
  assert.deepEqual(diagnoseSearchIntegrity(s).missingFigures,[]);
  assert.equal(s.outcome,'in-progress');
});
test('GC-12: search after all twelve defeated is rejected safely without inventing an outcome',()=>{
  const s=fixture();
  const bad=structuredClone(s);
  const figure=bad.drawPile.find(isFigure);
  bad.drawPile=bad.drawPile.filter(id=>id!==figure);
  bad.figureSlots[11]=figure;
  bad.defeatedFigures.push(figure);
  const diagnosed=diagnoseSearchIntegrity(bad);
  assert.equal(diagnosed.status,'invalid');
  assert.ok(diagnosed.issues.includes('search after all figures defeated'));
  assert.deepEqual(engine.getLegalActions(bad),[]);
  assert.equal(bad.outcome,'in-progress');
});
