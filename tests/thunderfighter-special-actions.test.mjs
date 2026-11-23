import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import { thunderfighterEngine as engine } from '../src/games/gridcannon/engine.ts';

const all = makeDeckWithJokers().map(c => c.id);
const gridBase = [
  'clubs-2','hearts-6','spades-5',
  'diamonds-6','diamonds-7','spades-8',
  'clubs-5','hearts-9','clubs-9',
];
function fixture({grid=gridBase.map(id=>[id]),reserve=['hearts-1','joker-1'],
  targets={3:'clubs-11',6:'spades-11'},phase='playing',pending=null,
  buffer=[],defeated=[],drawFirst=[],spent=[]}={}) {
  const figureSlots=Array.from({length:12},(_,slot)=>targets[slot]??null);
  const used=[...grid.flat(),...reserve,...spent,...figureSlots.filter(Boolean),...buffer,
    ...(pending?[pending]:[])];
  assert.equal(new Set(used).size,used.length,'fixture duplicates physical cards');
  const pool=all.filter(id=>!used.includes(id));
  for (const id of drawFirst) assert.ok(pool.includes(id),id);
  const state={...engine.createInitialState({seed:19}),phase,grid:grid.map(p=>[...p]),
    figureSlots,defeatedFigures:[...defeated],pendingFigures:[],
    specialReserve:[...reserve],spentSpecials:[...spent],pendingNumeric:pending,
    searchBuffer:[...buffer],placingFromSearch:false,drawPile:[...drawFirst,...pool.filter(id=>!drawFirst.includes(id))],
    armorCards:[],lastShot:[],victoryScore:null,replacementSlot:null,replacementUsed:false};
  assert.deepEqual(engine.validateState(state),{valid:true});
  return state;
}
function check(s){
  const allZones=[...s.grid.flat(),...s.figureSlots.filter(Boolean),...s.pendingFigures,
    ...s.drawPile,...s.specialReserve,...s.spentSpecials,...(s.searchBuffer??[]),
    ...(s.pendingNumeric?[s.pendingNumeric]:[]),...(s.armorCards??[]).map(x=>x.cardId)];
  assert.deepEqual([...allZones].sort(),[...all].sort());
  assert.deepEqual(engine.validateState(s),{valid:true});
  return s;
}
function apply(s,action){
  const old=structuredClone(s);const r=engine.transition(s,action);
  assert.equal(r.accepted,true,JSON.stringify({action,r}));
  assert.deepEqual(s,old);return check(r.state);
}
function reject(s,action){
  const old=structuredClone(s);const r=engine.transition(s,action);
  assert.equal(r.accepted,false);assert.strictEqual(r.state,s);assert.deepEqual(s,old);
}
test('GC-05: As extracts full pile top-to-bottom under preexisting draw pile and leaves real empty cell',()=>{
  const grid=gridBase.map(id=>[id]);
  grid[0]=['clubs-2','hearts-5','spades-9'];
  const s=fixture({grid,reserve:['hearts-1'],targets:{},drawFirst:['diamonds-2']});
  const before=[...s.drawPile];
  const out=apply(s,{type:'extract',cardId:'hearts-1',cell:0});
  assert.deepEqual(out.grid[0],[]);
  assert.deepEqual(out.drawPile,[...before,'spades-9','hearts-5','clubs-2']);
  assert.deepEqual(out.specialReserve,[]);
  assert.deepEqual(out.spentSpecials,['hearts-1']);
  assert.equal(out.outcome,'in-progress');
});
test('GC-05: two extractions append separate piles in order; no As can be reused',()=>{
  const grid=gridBase.map(id=>[id]);grid[0]=['clubs-2','spades-9'];grid[4]=['diamonds-7','hearts-5'];
  let s=fixture({grid,reserve:['hearts-1','spades-1'],targets:{}});
  const before=[...s.drawPile];
  s=apply(s,{type:'extract',cardId:'hearts-1',cell:0});
  s=apply(s,{type:'extract',cardId:'spades-1',cell:4});
  assert.deepEqual(s.drawPile.slice(before.length),['spades-9','clubs-2','hearts-5','diamonds-7']);
  reject(s,{type:'extract',cardId:'hearts-1',cell:3});
  reject(s,{type:'extract',cardId:'spades-1',cell:0});
});
test('GC-05: extracting empty cell never spends the As or modifies the draw pile',()=>{
  const grid=gridBase.map(id=>[id]);grid[0]=[];
  const s=fixture({grid,reserve:['hearts-1'],targets:{}});
  reject(s,{type:'extract',cardId:'hearts-1',cell:0});
  assert.ok(engine.getLegalActions(s).some(a=>a.type==='extract'&&a.cell===1));
});
test('GC-03: after extraction, a numeric 2 can refill the empty cell without a ghost card',()=>{
  let s=fixture({reserve:['hearts-1'],targets:{},pending:'diamonds-2'});
  s=apply(s,{type:'extract',cardId:'hearts-1',cell:0});
  assert.ok(engine.getLegalActions(s).some(a=>a.type==='place-number'&&a.cell===0));
  s=apply(s,{type:'place-number',cell:0});
  assert.deepEqual(s.grid[0],['diamonds-2']);
});
test('Joker reassigns only the top card to a legal destination and triggers both shots once',()=>{
  const grid=gridBase.map(id=>[id]);grid[4]=['diamonds-7','hearts-10'];
  let s=fixture({grid,reserve:['joker-1']});
  const beforeSource=[...s.grid[4]];
  s=apply(s,{type:'reassign',cardId:'joker-1',from:4,to:0});
  assert.deepEqual(s.grid[4],beforeSource.slice(0,-1));
  assert.deepEqual(s.grid[0],['clubs-2','hearts-10']);
  assert.deepEqual(s.lastShot,['clubs-11','spades-11']);
  assert.deepEqual(s.defeatedFigures,['clubs-11','spades-11']);
  assert.deepEqual(s.spentSpecials,['joker-1']);
  reject(s,{type:'reassign',cardId:'joker-1',from:4,to:0});
});
test('Joker cannot move to same pile, empty source or stronger top, nor spend during invalid action',()=>{
  const grid=gridBase.map(id=>[id]);grid[4]=[];
  const s=fixture({grid,reserve:['joker-1'],targets:{}});
  reject(s,{type:'reassign',cardId:'joker-1',from:4,to:0});
  reject(s,{type:'reassign',cardId:'joker-1',from:1,to:1});
  reject(s,{type:'reassign',cardId:'joker-1',from:0,to:1});
  assert.deepEqual(s.spentSpecials,[]);
});
test('GC-16: special actions remain blocked until preparation ends',()=>{
  const ready=fixture({reserve:['hearts-1','joker-1'],targets:{}});
  const early={...ready,phase:'replacement-offer'};
  assert.deepEqual(engine.validateState(early),{valid:true});
  reject(early,{type:'extract',cardId:'hearts-1',cell:0});
  reject(early,{type:'reassign',cardId:'joker-1',from:1,to:0});
});
test('specials remain voluntary even while a numeric is awaiting placement',()=>{
  const s=fixture({reserve:['hearts-1','joker-1'],pending:'diamonds-2'});
  const actions=engine.getLegalActions(s);
  assert.ok(actions.some(a=>a.type==='extract'));
  assert.ok(actions.some(a=>a.type==='reassign'));
  assert.ok(actions.some(a=>a.type==='place-number'));
  reject(s,{type:'draw-card'});
});
test('GC-09/10/11: figure search holds numerics, reserves As/Joker and permits voluntary extraction',()=>{
  let s=fixture({reserve:['hearts-1'],targets:{3:'clubs-11'},pending:'hearts-10',
    drawFirst:['clubs-4','spades-1','joker-2','hearts-12']});
  s=apply(s,{type:'place-number',cell:0});
  assert.equal(s.phase,'searching');
  assert.ok(engine.getLegalActions(s).some(a=>a.type==='extract'));
  s=apply(s,{type:'draw-search'});
  assert.deepEqual(s.searchBuffer,['clubs-4']);
  s=apply(s,{type:'draw-search'});
  assert.ok(s.specialReserve.includes('spades-1'));
  s=apply(s,{type:'draw-search'});
  assert.ok(s.specialReserve.includes('joker-2'));
  assert.deepEqual(s.searchBuffer,['clubs-4']);
  const remaining=[...s.drawPile];
  s=apply(s,{type:'extract',cardId:'hearts-1',cell:4});
  assert.deepEqual(s.searchBuffer,['clubs-4']);
  assert.deepEqual(s.drawPile,[...remaining,'diamonds-7']);
  s=apply(s,{type:'draw-search'});
  assert.equal(s.phase,'placing-figure');
  assert.deepEqual(s.pendingFigures,['hearts-12']);
  assert.equal(s.placingFromSearch,true);
  s=apply(s,engine.getLegalActions(s)[0]);
  assert.equal(s.phase,'playing');
  assert.deepEqual(s.searchBuffer,[]);
  assert.equal(s.drawPile.at(-1),'clubs-4');
  reject(s,{type:'draw-search'});
});
test('GC-11: Joker can be used voluntarily during a saved figure search, without clearing held numerics',()=>{
  const grid=gridBase.map(id=>[id]);
  const s=fixture({phase:'searching',reserve:['joker-1'],targets:{3:'clubs-11'},defeated:['clubs-11'],
    buffer:['diamonds-2']});
  const restored=JSON.parse(JSON.stringify(s));
  const available=engine.getLegalActions(restored).find(a=>a.type==='reassign');
  assert.ok(available);
  const next=apply(restored,available);
  assert.equal(next.phase,'searching');
  assert.deepEqual(next.searchBuffer,['diamonds-2']);
  assert.deepEqual(next.spentSpecials,['joker-1']);
  assert.deepEqual(next.lastShot,[]);
});
test('corrupt duplicate special and spent identity is rejected; cannot spend a fake action',()=>{
  const s=fixture({reserve:['joker-1'],targets:{}});
  const invalid={...s,spentSpecials:['joker-1']};
  assert.equal(engine.validateState(invalid).valid,false);
  reject(invalid,{type:'reassign',cardId:'joker-1',from:1,to:0});
  reject(s,{type:'extract',cardId:'clubs-1',cell:0});
});
