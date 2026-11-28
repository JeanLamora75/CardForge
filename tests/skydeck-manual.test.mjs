import test from 'node:test';
import assert from 'node:assert/strict';
import {skydeckManualPages} from '../src/application/skydeck-manual.ts';
import {skydeckEngine} from '../src/games/card-capture/engine.ts';
import {skydeckCardArt} from '../src/application/skydeck-art.ts';
test('manual has twenty bilingual pages and stable unique ids',()=>{
 assert.equal(skydeckManualPages.length,20);
 assert.equal(new Set(skydeckManualPages.map(p=>p.id)).size,20);
 for(const p of skydeckManualPages){assert.ok(p.fr.body&&p.en.body&&p.fr.tip&&p.en.tip);assert.ok(!/CC-R0/.test(p.fr.body+p.en.body));}
});
function fixture(own,target){
 const initial=skydeckEngine.createInitialState({seed:42});
 const all=[...initial.playerDeck,...initial.enemyDeck,...initial.enemyLine.filter(Boolean)];
 const personal=all.filter(id=>id.startsWith('joker-')||[2,3,4].includes(Number(id.split('-')[1])));
 const hand=[...own,...personal.filter(id=>!own.includes(id)&&id!==target)].slice(0,4);
 const others=all.filter(id=>!personal.includes(id)&&!hand.includes(id)&&id!==target);
 const enemyLine=[target,...others.slice(0,3)];
 return {...initial,round:2,phase:'capture',hand,enemyLine,playerDeck:personal.filter(id=>!hand.includes(id)),enemyDeck:others.slice(3),discard:[],enemyCapture:[]};
}
test('illustrated combat examples use real legal actions and destinations',()=>{
 for(const p of skydeckManualPages.filter(p=>/^diagram:(a|a-invalid|b|c|joker):/.test(p.visual))){
 const [,kind,units]=p.visual.split(':');const [left,target]=units.split('|'),own=left.split(',');
 for(const id of [...own,target])assert.ok(skydeckCardArt(id));
 const state=fixture(own,target);assert.ok(skydeckEngine.validateState(state).valid,p.id);
 const action=kind==='b'?{type:'capture-b',cardId:own[0]}:kind==='c'?{type:'capture-c',cardIds:own,targetPosition:1}:{type:'capture-a',cardIds:own,targetPosition:1,...(kind==='joker'?{jokerCopyId:own[0]}:{})};
 const result=skydeckEngine.transition(state,action);
 assert.equal(result.accepted,kind!=='a-invalid',p.id);
 if(!result.accepted){assert.deepEqual(result.state,state);continue;}
 if(kind==='a'||kind==='joker')assert.ok([...own,target].every(id=>result.state.discard.includes(id)));
 if(kind==='b')assert.ok([...own,target].every(id=>result.state.enemyCapture.includes(id)));
 if(kind==='c'){assert.ok(own.every(id=>result.state.enemyCapture.includes(id)));assert.equal(result.state.enemyDeck.at(-1),target);}
 }
 const s=fixture(['joker-1','joker-2'],'diamonds-8');
 assert.equal(skydeckEngine.transition(s,{type:'capture-a',cardIds:['joker-1','joker-2'],targetPosition:1,jokerCopyId:'joker-1'}).accepted,false);
});
