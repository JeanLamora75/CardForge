import test from 'node:test';
import assert from 'node:assert/strict';
import {automaticSkydeckAction,skydeckAttackFeedback,skydeckCompatibleTargets} from '../src/application/skydeck-flow.ts';
import {skydeckEngine,inspectSkydeck} from '../src/games/card-capture/engine.ts';
test('opening automatic phases exactly equal manual transitions across 64 seeds',()=>{
 for(let seed=0;seed<64;seed++){let a=skydeckEngine.createInitialState({seed}),b=structuredClone(a);
 for(const type of ['advance-enemy','discard-none','draw']){const next=automaticSkydeckAction(inspectSkydeck(a));assert.equal(next.type,type);const x=skydeckEngine.transition(a,next),y=skydeckEngine.transition(b,{type});assert.ok(x.accepted&&y.accepted);a=x.state;b=y.state;assert.deepEqual(a,b);}
 assert.equal(automaticSkydeckAction(inspectSkydeck(a)),undefined);}
});
test('never skips real discard choice, tutorial, blocked or terminal state',()=>{
 const v={phase:'discard',outcome:'in-progress',actions:[{type:'discard-none'},{type:'discard',cardIds:['clubs-2']}]};
 assert.equal(automaticSkydeckAction(v),undefined);assert.equal(automaticSkydeckAction({...v,actions:[{type:'discard-none'}]},true),undefined);
 assert.equal(automaticSkydeckAction({...v,phase:'draw',actions:[],blockedReason:'unconfirmed-insufficient-personal-cards'}),undefined);
 assert.equal(automaticSkydeckAction({...v,outcome:'loss'}),undefined);
});
test('feedback distinguishes faction and missing power and compatibility is derived from legal actions',()=>{
 const v={enemyLine:['clubs-9','hearts-9','clubs-8'],actions:[{type:'capture-a',targetPosition:3,cardIds:['clubs-4','joker-1'],jokerCopyId:'clubs-4'}]};
 assert.equal(skydeckAttackFeedback(v,['clubs-4','joker-1'],1,null).total,8);
 assert.equal(skydeckAttackFeedback(v,['clubs-4','joker-1'],2,null).reason,'faction');
 assert.deepEqual(skydeckCompatibleTargets(v,'capture-a',['clubs-4','joker-1']),[3]);
});
