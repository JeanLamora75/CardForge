import test from 'node:test';
import assert from 'node:assert/strict';
import {getShotAnalysis,getShotTargets} from '../src/games/gridcannon/engine.ts';
const board=()=>({phase:'playing',grid:[['hearts-8'],['diamonds-7'],['hearts-10'],['clubs-10'],['spades-6'],['hearts-6'],['clubs-8'],['clubs-6'],['spades-3']],figureSlots:['diamonds-12','spades-12','spades-11','clubs-12','hearts-11','hearts-13','clubs-11',null,'hearts-12','spades-13','clubs-13','diamonds-13'],defeatedFigures:[],armorCards:[]});
test('top-right placement cannot fire at adjacent north jack; trigger excluded',()=>{const s=board(),before=structuredClone(s);const a=getShotAnalysis(s,2);assert.deepEqual(a.map(x=>x.slot),[11,6]);assert.deepEqual(a.map(x=>x.power),[0,9]);assert.deepEqual(getShotTargets(s,2),[]);assert.deepEqual(s,before);});
test('bottom-right placement fires north with 10+6 regardless of trigger rank',()=>{const s=board();const a=getShotAnalysis(s,8).find(x=>x.slot===2);assert.equal(a.power,16);assert.equal(a.resistance,11);assert.deepEqual(a.contributors.map(x=>x.cell),[5,2]);assert.ok(getShotTargets(s,8).includes('spades-11'));s.grid[8]=['spades-2'];assert.equal(getShotAnalysis(s,8).find(x=>x.slot===2).power,16);});
test('armor changes resistance, defeated targets and centre excluded',()=>{const s=board();s.armorCards=[{figureId:'spades-11',cardId:'diamonds-6'}];assert.equal(getShotAnalysis(s,8).find(x=>x.slot===2).success,false);s.defeatedFigures=['spades-11'];assert.ok(!getShotAnalysis(s,8).some(x=>x.slot===2));assert.deepEqual(getShotAnalysis(s,4),[]);});
test('two simultaneous axes, same-suit king and same-color queen',()=>{const s=board();s.figureSlots[5]='hearts-11';s.figureSlots[2]='spades-11';s.grid[7]=['clubs-8'];s.grid[6]=['hearts-8'];s.figureSlots[9]='clubs-11';assert.equal(getShotTargets(s,8).length,2);assert.deepEqual(getShotTargets(s,8),getShotAnalysis(s,8).filter(x=>x.success).map(x=>x.figureId));});

test('all twelve shot directions follow the visible clockwise perimeter',()=>{
 const expected=[[3,8],[7],[11,6],[4],[],[10],[5,0],[1],[9,2]];
 const coordinates=[[1,0],[2,0],[3,0],[4,1],[4,2],[4,3],[3,4],[2,4],[1,4],[0,3],[0,2],[0,1]];
 const s=board();s.figureSlots[7]='diamonds-11';
 for(let cell=0;cell<9;cell++){
  const shots=getShotAnalysis(s,cell);
  assert.deepEqual(shots.map(x=>x.slot),expected[cell], 'cell '+cell);
  for(const shot of shots){
   const x=1+cell%3,y=1+Math.floor(cell/3),[tx,ty]=coordinates[shot.slot];
   assert.ok(x===tx||y===ty,'no diagonal');
   assert.equal(Math.abs(x-tx)+Math.abs(y-ty),3);
   assert.equal(shot.contributors.length,2);
   assert.ok(!shot.contributors.some(c=>c.cell===cell));
  }
 }
});
test('top-right trigger never targets occupied diagonal sectors when aligned sectors are empty',()=>{
 const s=board();s.figureSlots[11]=null;s.figureSlots[6]=null;
 assert.deepEqual(getShotAnalysis(s,2),[]);
});
