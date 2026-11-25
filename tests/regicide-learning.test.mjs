import test from 'node:test';import assert from 'node:assert/strict';
import {practiceRegicide,REGICIDE_LESSONS,regicideLessonState} from '../src/games/regicide/tutorial.ts';
import {regicideEngine as engine} from '../src/games/regicide/engine.ts';
import {IDBFactory} from 'fake-indexeddb';
import {createIndexedDbGameStorage} from '../src/adapters/indexeddb-game-storage.ts';
import {startRegicide} from '../src/games/regicide/persistence.ts';
async function act(s,a){assert.equal((await s.dispatch(a)).accepted,true);}
test('CAR-80: all four deterministic lessons use real rules and are replayable',async()=>{
 for(const lesson of REGICIDE_LESSONS){const s=practiceRegicide(lesson);assert.equal(engine.validateState(s.getState()).valid,true);assert.deepEqual(s.getState(),regicideLessonState(lesson));}
 const c=practiceRegicide('combat');await act(c,{type:'play',cardIds:['clubs-8']});await act(c,{type:'resolve-powers'});await act(c,{type:'resolve-damage'});assert.equal(c.getState().enemyHealth,4);
 const r=practiceRegicide('recruitment');await act(r,{type:'play',cardIds:['clubs-10']});await act(r,{type:'resolve-powers'});await act(r,{type:'resolve-damage'});assert.equal(r.getState().tavern[0],'spades-11');
 const j=practiceRegicide('joker');await act(j,{type:'use-joker',jokerId:'joker-1'});assert.equal(j.getState().hand.length,8);
 const d=practiceRegicide('defence');await act(d,{type:'retaliate',cardIds:['hearts-6','diamonds-5']});assert.equal(d.getState().phase,'play');
 assert.deepEqual(practiceRegicide('recruitment').getState(),regicideLessonState('recruitment'));
});
test('CAR-80: practice cannot modify a normal saved game or statistics',async()=>{
 const store=createIndexedDbGameStorage({factory:new IDBFactory(),name:'car80'});await startRegicide(store,'normal',{seed:2});const before=await store.readGame('regicide');
 const p=practiceRegicide('joker');await act(p,{type:'use-joker',jokerId:'joker-1'});await act(p,{type:'abandon'});
 assert.deepEqual(await store.readGame('regicide'),before);assert.equal(await store.readStatistics('regicide'),undefined);
});
