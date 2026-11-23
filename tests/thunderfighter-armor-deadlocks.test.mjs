import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import { thunderfighterEngine as engine, armorCandidates } from '../src/games/gridcannon/engine.ts';

const all=makeDeckWithJokers().map(c=>c.id);
const numerics=all.filter(id=>!id.startsWith('joker-')&&/-(?:[2-9]|10)$/.test(id));
const figures=all.filter(id=>/-(?:11|12|13)$/.test(id));
const specials=all.filter(id=>id.startsWith('joker-')||id.endsWith('-1'));
const base=['clubs-4','hearts-6','spades-5','diamonds-6','diamonds-7',
  'spades-8','clubs-5','hearts-9','clubs-9'];

function fixture({grid=base.map(id=>[id]),pending='hearts-2',targets={0:'clubs-11'},
  reserve=[],spent=[],armor=[],defeated=[],drawPile=null,phase='playing',outcome='in-progress'}={}) {
  const figureSlots=Array.from({length:12},(_,slot)=>targets[slot]??null);
  const used=[...grid.flat(),...figureSlots.filter(Boolean),...reserve,...spent,
    ...armor.map(x=>x.cardId),...(pending?[pending]:[])];
  assert.equal(new Set(used).size,used.length,'duplicate physical card in fixture');
  const remaining=all.filter(id=>!used.includes(id));
  const draw=drawPile===null?remaining:drawPile;
  assert.deepEqual([...draw].sort(),[...remaining].sort(),'all 54 cards must remain');
  const s={...engine.createInitialState({seed:1}),phase,outcome,grid:grid.map(p=>[...p]),
    figureSlots,defeatedFigures:[...defeated],pendingFigures:[],
    specialReserve:[...reserve],spentSpecials:[...spent],
    pendingNumeric:pending,searchBuffer:[],placingFromSearch:false,
    drawPile:[...draw],armorCards:[...armor],lastShot:[],lossReason:null,
    victoryScore:null,replacementSlot:null,replacementUsed:false};
  assert.deepEqual(engine.validateState(s),{valid:true},JSON.stringify(engine.validateState(s)));
  return s;
}
function apply(s,action){
  const snapshot=structuredClone(s),result=engine.transition(s,action);
  assert.equal(result.accepted,true,JSON.stringify({action,result}));
  assert.deepEqual(s,snapshot);
  assert.deepEqual(engine.validateState(result.state),{valid:true},JSON.stringify(engine.validateState(result.state)));
  return result.state;
}
function reject(s,action){
  const snapshot=structuredClone(s),result=engine.transition(s,action);
  assert.equal(result.accepted,false,JSON.stringify(action));
  assert.strictEqual(result.state,s);assert.deepEqual(s,snapshot);
}
function actions(s,type){return engine.getLegalActions(s).filter(a=>a.type===type);}
function deepBlock({pending='hearts-2',jokerCount=1,targets={0:'clubs-11'}}={}){
  const grid=base.map(id=>[id]);
  const used=[...grid.flat(),pending,...Object.values(targets)];
  const bottom=numerics.filter(id=>!used.includes(id)&&Number(id.split('-')[1])>=3).slice(0,9);
  assert.equal(bottom.length,9);
  bottom.forEach((id,i)=>grid[i].unshift(id));
  const reserve=jokerCount===1?['joker-1']:['joker-1','joker-2'];
  return fixture({grid,pending,targets,reserve});
}
function endgame({reserve=[],pending='hearts-2'}={}){
  const alive='hearts-13';
  const figureSlots=Object.fromEntries(figures.map((id,index)=>[index,id]));
  const remainingNumerics=numerics.filter(id=>id!==pending);
  const grid=[remainingNumerics,[],[],[],[],[],[],[],[]];
  const spent=specials.filter(id=>!reserve.includes(id));
  const state=fixture({grid,pending,targets:figureSlots,
    defeated:figures.filter(id=>id!==alive),reserve,spent,drawPile:[]});
  return state;
}
test('GC-21: exact tie among black Jacks requires explicit one-of-two choice, never silent first',()=>{
  const s=fixture({targets:{0:'clubs-11',3:'spades-11'}});
  assert.deepEqual(armorCandidates(s),['clubs-11','spades-11']);
  assert.deepEqual(actions(s,'assign-armor').map(a=>a.figureId),['clubs-11','spades-11']);
  const next=apply(s,{type:'assign-armor',figureId:'spades-11'});
  assert.deepEqual(next.armorCards,[{figureId:'spades-11',cardId:'hearts-2'}]);
  assert.equal(next.pendingNumeric,null);
  assert.deepEqual(s.armorCards,[]);
  reject(next,{type:'assign-armor',figureId:'clubs-11'});
});
test('GC-21: same suit outranks smaller same-color or lower opposite-color figure',()=>{
  const s=fixture({targets:{0:'hearts-13',1:'diamonds-11',2:'clubs-11'}});
  assert.deepEqual(armorCandidates(s),['hearts-13']);
  reject(s,{type:'assign-armor',figureId:'diamonds-11'});
  const next=apply(s,{type:'assign-armor',figureId:'hearts-13'});
  assert.equal(next.armorCards[0].figureId,'hearts-13');
});
test('GC-21: tie candidates exclude defeated figures',()=>{
  const s=fixture({targets:{0:'clubs-11',3:'spades-11'},defeated:['clubs-11']});
  assert.deepEqual(armorCandidates(s),['spades-11']);
  assert.deepEqual(actions(s,'assign-armor'),[{type:'assign-armor',figureId:'spades-11'}]);
});
test('GC-07: an already playable number cannot become armor',()=>{
  const grid=base.map(id=>[id]);grid[4]=[];
  const s=fixture({grid});
  assert.equal(actions(s,'assign-armor').length,0);
  assert.ok(actions(s,'place-number').some(a=>a.cell===4));
  reject(s,{type:'assign-armor',figureId:'clubs-11'});
});
test('GC-07: available As extraction prevents armor and permits playing blocked numeric',()=>{
  let s=fixture({reserve:['spades-1']});
  assert.equal(actions(s,'assign-armor').length,0);
  assert.ok(actions(s,'extract').length>0);
  s=apply(s,{type:'extract',cardId:'spades-1',cell:4});
  assert.ok(actions(s,'place-number').some(a=>a.cell===4));
  s=apply(s,{type:'place-number',cell:4});
  assert.deepEqual(s.armorCards,[]);assert.deepEqual(s.spentSpecials,['spades-1']);
});
test('GC-07: a useful Joker single move prevents armor, but a sterile Joker does not',()=>{
  const useful=fixture({reserve:['joker-1']});
  assert.equal(actions(useful,'assign-armor').length,0);
  assert.ok(actions(useful,'reassign').length);
  const sterile=deepBlock();
  assert.deepEqual(actions(sterile,'assign-armor'),[{type:'assign-armor',figureId:'clubs-11'}]);
  assert.ok(sterile.specialReserve.includes('joker-1'));
  const next=apply(sterile,{type:'assign-armor',figureId:'clubs-11'});
  assert.ok(next.specialReserve.includes('joker-1'));
});
test('GC-07: two Jokers can jointly empty a two-card pile; avoid premature armor',()=>{
  const grid=base.map(id=>[id]);
  grid[0]=['spades-5','spades-8'];
  grid[2]=['clubs-6'];
  grid[5]=['diamonds-5'];
  // Ensure all physical cards unique and every top is strictly above pending hearts-2.
  const s=fixture({grid,reserve:['joker-1','joker-2']});
  assert.equal(actions(s,'assign-armor').length,0);
  assert.ok(actions(s,'reassign').length);
});
test('GC-T19 / GC-T20 / GC-T28 / GC-07: Jack/Queen resistance 20 and King resistance 19 cause immediate armor loss',()=>{
  for(const [figureId,prior] of [['hearts-11','hearts-7'],['diamonds-12','clubs-6'],['spades-13','spades-4']]){
    const s=fixture({targets:{0:figureId},pending:'hearts-2',
      armor:[{figureId,cardId:prior}]});
    const after=apply(s,{type:'assign-armor',figureId});
    const sum=Number(figureId.split('-')[1])+Number(prior.split('-')[1])+2;
    assert.ok(sum>=(figureId.endsWith('13')?19:20));
    assert.equal(after.outcome,'loss');
    assert.equal(after.lossReason,'armor');
    assert.equal(after.victoryScore,null);
    assert.deepEqual(engine.getLegalActions(after),[]);
    reject(after,{type:'assign-armor',figureId});
  }
});
test('GC-T29 / GC-20: empty draw with living figure and unspent As is not a loss',()=>{
  const s=endgame({reserve:['hearts-1'],pending:null});
  assert.equal(engine.getOutcome(s),'in-progress');
  assert.ok(actions(s,'extract').length);
  const next=apply(s,{type:'extract',cardId:'hearts-1',cell:0});
  assert.equal(next.outcome,'in-progress');
  assert.ok(next.drawPile.length);
  assert.deepEqual(actions(next,'draw-card'),[{type:'draw-card'}]);
});
test('GC-T23 / GC-20: no draw and no useful special => confirmed stalemate after legal final placement',()=>{
  const s=endgame({pending:'hearts-2'});
  const next=apply(s,{type:'place-number',cell:4});
  assert.equal(next.outcome,'loss');assert.equal(next.lossReason,'stalemate');
  assert.equal(next.victoryScore,null);
  assert.deepEqual(engine.getLegalActions(next),[]);
  reject(next,{type:'place-number',cell:4});
});
test('GC-T34 / GC-20: sterile Joker does not keep a hopeless empty-draw game alive forever',()=>{
  const s=endgame({reserve:['joker-1'],pending:'hearts-2'});
  const next=apply(s,{type:'place-number',cell:4});
  assert.equal(next.outcome,'loss');
  assert.equal(next.lossReason,'stalemate');
  assert.ok(next.specialReserve.includes('joker-1'));
});
test('GC-T24: armor choice survives JSON save and restore without assigning twice',()=>{
  const s=fixture({targets:{0:'clubs-11',3:'spades-11'}});
  const restored=JSON.parse(JSON.stringify(s));
  assert.deepEqual(actions(restored,'assign-armor'),actions(s,'assign-armor'));
  const next=apply(restored,actions(restored,'assign-armor')[1]);
  assert.equal(next.armorCards.length,1);
  reject(next,{type:'assign-armor',figureId:'spades-11'});
  assert.equal(next.armorCards.length,1);
});


test('GC-20: a legal Joker double-axis shot at empty draw can finish the twelfth figure',()=>{
  const others=figures.filter(id=>id!=='clubs-11');
  const slots=[0,1,2,4,5,6,7,8,9,10,11];
  const targets={3:'clubs-11'};
  others.forEach((id,index)=>{targets[slots[index]]=id});
  const grid=Array.from({length:9},()=>[]);
  grid[1]=['clubs-8'];grid[2]=['diamonds-6'];
  grid[4]=numerics.filter(id=>id!=='clubs-8'&&id!=='diamonds-6');
  const s=fixture({grid,targets,pending:null,reserve:['joker-1'],
    spent:specials.filter(id=>id!=='joker-1'),defeated:others,drawPile:[]});
  assert.equal(s.outcome,'in-progress');
  assert.ok(actions(s,'reassign').some(a=>a.from===4&&a.to===0));
  const done=apply(s,{type:'reassign',cardId:'joker-1',from:4,to:0});
  assert.equal(done.outcome,'win');
  assert.equal(done.victoryScore,0);
  assert.equal(done.defeatedFigures.length,12);
  assert.deepEqual(engine.getLegalActions(done),[]);
});
test('GC-20: placing the last figure with no draw and no usable resources gives a confirmed stalemate',()=>{
  const others=figures.filter(id=>id!=='clubs-11');
  const targets=Object.fromEntries(others.map((id,index)=>[index,id]));
  const grid=[numerics,[],[],[],[],[],[],[],[]];
  const base=fixture({grid,targets,pending:null,reserve:[],spent:specials,
    defeated:others,drawPile:['clubs-11']});
  const pending={...base,drawPile:[],pendingFigures:['clubs-11'],
    phase:'placing-figure',placingFromSearch:true};
  assert.deepEqual(engine.validateState(pending),{valid:true});
  const choices=actions(pending,'place-figure');
  assert.equal(choices.length,1);
  const result=apply(pending,choices[0]);
  assert.equal(result.outcome,'loss');
  assert.equal(result.lossReason,'stalemate');
  assert.equal(result.victoryScore,null);
});
