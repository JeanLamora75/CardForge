import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import { thunderfighterEngine as engine, getShotTargets } from '../src/games/gridcannon/engine.ts';

const ids = makeDeckWithJokers().map(card => card.id);
const base = [
  'clubs-2', 'hearts-6', 'spades-5',
  'diamonds-6', 'diamonds-7', 'spades-8',
  'clubs-5', 'hearts-9', 'clubs-9',
];
function fixture({ grid = base, trigger = 'hearts-10', targets = { 3: 'clubs-11', 6: 'spades-11' },
  defeated = [], armor = [], reserve = [], pending = true } = {}) {
  const piles = grid.map(id => id === null ? [] : [id]);
  const figureSlots = Array.from({length:12},(_,i) => targets[i] ?? null);
  const used = [...piles.flat(), ...figureSlots.filter(Boolean), ...armor.map(a=>a.cardId),...reserve,
    ...(pending ? [trigger] : [])];
  assert.equal(new Set(used).size,used.length,'physical cards must be unique');
  const state = {
    ...engine.createInitialState({seed:11}),
    phase:'playing', outcome:'in-progress', grid:piles, figureSlots,
    pendingFigures:[], specialReserve:reserve, spentSpecials:[],
    pendingNumeric:pending ? trigger : null,drawPile: ids.filter(id=>!used.includes(id)),
    armorCards:armor, defeatedFigures:defeated,
    lastShot:[],victoryScore:null,replacementUsed:false,replacementSlot:null,
  };
  assert.deepEqual(engine.validateState(state),{valid:true});
  return state;
}
function assertPhysical(s) {
  const all=[...s.grid.flat(),...s.drawPile,...s.figureSlots.filter(Boolean),
    ...s.specialReserve,...s.spentSpecials,...s.pendingFigures,
    ...s.armorCards.map(a=>a.cardId),...(s.pendingNumeric?[s.pendingNumeric]:[])];
  assert.deepEqual(all.sort(),[...ids].sort());
  assert.deepEqual(engine.validateState(s),{valid:true});
}
function play(s,action) {
  const snapshot=structuredClone(s);
  const result=engine.transition(s,action);
  assert.equal(result.accepted,true,JSON.stringify(result));
  assert.deepEqual(s,snapshot);
  assertPhysical(result.state);
  return result.state;
}
function reject(s,action) {
  const old=structuredClone(s),result=engine.transition(s,action);
  assert.equal(result.accepted,false);
  assert.strictEqual(result.state,s);
  assert.deepEqual(s,old);
}
test('GC-T07: numeric same value can stack, lower value cannot, wrong suit does not matter',()=>{
  const s=fixture({trigger:'spades-6',targets:{}});
  assert.ok(engine.getLegalActions(s).some(a=>a.type==='place-number'&&a.cell===1));
  reject(s,{type:'place-number',cell:5});
  const out=play(s,{type:'place-number',cell:1});
  assert.deepEqual(out.grid[1],['hearts-6','spades-6']);
});
test('GC-V2-T19/22: empty cell can receive any 2-10, without a ghost zero',()=>{
  const grid=[...base];grid[4]=null;
  const s=fixture({grid,trigger:'hearts-2',targets:{}});
  assert.ok(engine.getLegalActions(s).some(a=>a.type==='place-number'&&a.cell===4));
  reject(s,{type:'place-number',cell:8});
  const out=play(s,{type:'place-number',cell:4});
  assert.deepEqual(out.grid[4],['hearts-2']);
  assert.equal(out.grid.flat().includes('hearts-0'),false);
});
test('GC-V2-T28: a corner triggers horizontal and vertical victories simultaneously',()=>{
  const s=fixture();
  assert.deepEqual(getShotTargets(s,0),['clubs-11','spades-11']);
  const done=play(s,{type:'place-number',cell:0});
  assert.deepEqual(done.lastShot,['clubs-11','spades-11']);
  assert.deepEqual(done.defeatedFigures,['clubs-11','spades-11']);
  assert.equal(done.figureSlots[3],'clubs-11');assert.equal(done.figureSlots[6],'spades-11');
  reject(done,{type:'place-number',cell:0});
});
test('GC-V2-T29/30: only the sufficient axis defeats its figure',()=>{
  const grid=[...base];grid[6]='clubs-2';
  const s=fixture({grid});
  const out=play(s,{type:'place-number',cell:0});
  assert.deepEqual(out.lastShot,['clubs-11']);
  assert.equal(out.defeatedFigures.includes('spades-11'),false);
});
test('GC-V2-T31: insufficient shots keep both figures alive and preserve placed card',()=>{
  const grid=[...base];grid[1]='hearts-2';grid[2]='spades-3';grid[3]='diamonds-3';grid[6]='clubs-4';
  const s=fixture({grid});
  const out=play(s,{type:'place-number',cell:0});
  assert.deepEqual(out.lastShot,[]);assert.deepEqual(out.defeatedFigures,[]);
  assert.equal(out.grid[0].at(-1),'hearts-10');
});
test('GC-V2-T33: queen counts only same-color power and king only same-suit',()=>{
  const grid=[...base];grid[1]='hearts-9';grid[2]='diamonds-5';grid[3]='clubs-9';grid[6]='hearts-7';grid[7]='spades-9';
  const s=fixture({grid, targets:{3:'hearts-12',6:'clubs-13'}});
  const out=play(s,{type:'place-number',cell:0});
  assert.deepEqual(out.lastShot,['hearts-12']);
  assert.equal(out.defeatedFigures.includes('clubs-13'),false);
});
test('GC-V2-T34: empty intermediate gives no artificial attack card',()=>{
  const grid=[...base];grid[1]=null;
  const s=fixture({grid});
  const out=play(s,{type:'place-number',cell:0});
  assert.deepEqual(out.lastShot,['spades-11']);
});
test('armor raises resistance; an eleven-power shot cannot defeat a J with +3 armor',()=>{
  const s=fixture({armor:[{figureId:'clubs-11',cardId:'hearts-3'}]});
  const out=play(s,{type:'place-number',cell:0});
  assert.deepEqual(out.lastShot,['spades-11']);
  assert.equal(out.armorCards.length,1);
  assert.equal(out.figureSlots[3],'clubs-11');
});
test('GC-V2-T35: ten already defeated figures plus double kill wins once and fixes special score',()=>{
  const figures=ids.filter(id=>/-(11|12|13)$/.test(id));
  const remaining=figures.filter(id=>!['clubs-11','spades-11'].includes(id));
  const targets=Object.fromEntries([...remaining.map((id,i)=>[i<3?i:i<6?i+1:i+2,id]),[3,'clubs-11'],[6,'spades-11']]);
  // Ensure each of the twelve exterior slots is filled exactly once.
  assert.equal(Object.keys(targets).length,12);
  const s=fixture({targets,defeated:remaining,reserve:['joker-1','hearts-1']});
  const out=play(s,{type:'place-number',cell:0});
  assert.equal(out.outcome,'win');
  assert.equal(out.defeatedFigures.length,12);
  assert.equal(out.victoryScore,2);
  assert.deepEqual(engine.getLegalActions(out),[]);
  reject(out,{type:'place-number',cell:0});
});
test('draw-card handles numbers, figures and specials without duplicating any card',()=>{
  const s=fixture({pending:false,targets:{}});
  const first=s.drawPile[0];
  const next=play(s,{type:'draw-card'});
  if(/-(11|12|13)$/.test(first)) {
    assert.equal(next.phase,'placing-figure');
    assert.deepEqual(next.pendingFigures,[first]);
  } else if(first.startsWith('joker')||first.endsWith('-1')) assert.ok(next.specialReserve.includes(first));
  else assert.equal(next.pendingNumeric,first);
});
test('cannot draw twice or place while a figure is pending, and attacks never fire in preparation',()=>{
  const s=fixture();
  reject(s,{type:'draw-card'});
  const preparatory={...s,phase:'replacement-offer',pendingNumeric:null};
  assert.equal(engine.validateState(preparatory).valid,true);
  assert.deepEqual(getShotTargets(preparatory,0),[]);
  reject(preparatory,{type:'place-number',cell:0});
});
