import test from 'node:test';
import assert from 'node:assert/strict';
import {skydeckMotionPlan} from '../src/application/skydeck-motion.ts';
const state=(enemyLine,hand)=>({enemyLine,hand});
test('enemy movement distinguishes existing ships from arrivals',()=>{assert.deepEqual(skydeckMotionPlan({type:'advance-enemy'},state([null,'a',null,null],[]),state(['a','b',null,null],[])),[{id:'a',zone:'enemy',index:0,effect:'advance',from:1},{id:'b',zone:'enemy',index:1,effect:'arrive',from:-1}]);});
test('only new cards are animated on draw',()=>{assert.deepEqual(skydeckMotionPlan({type:'draw'},state([],['a']),state([],['a','b'])),[{id:'b',zone:'hand',index:1,effect:'deal'}]);});
test('each combat action distinguishes departing enemy and player cards',()=>{for(const [type,enemy,hand] of [['capture-a','capture','discard'],['capture-b','sacrifice','sacrifice'],['capture-c','repel','sacrifice']]){assert.deepEqual(skydeckMotionPlan({type},state(['a'],['b']),state([null],[])).map(x=>x.effect),[enemy,hand]);}});
