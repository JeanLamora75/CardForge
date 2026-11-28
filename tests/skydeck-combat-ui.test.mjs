import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveSkydeckCopy,skydeckAttackSummary} from '../src/application/skydeck-combat-ui.ts';
const action=id=>({type:'capture-a',targetPosition:1,cardIds:['clubs-4','joker-1'],jokerCopyId:id});
test('single legal Joker copy is automatic',()=>{const a=action('clubs-4');assert.equal(resolveSkydeckCopy([a],null).chosen,a);assert.deepEqual(skydeckAttackSummary(a,['clubs-8']),{values:[4,4],total:8,enemy:8});});
test('multiple legal copies require explicit choice',()=>{const a=action('clubs-4'),b=action('clubs-3');assert.equal(resolveSkydeckCopy([a,b],null).chosen,undefined);assert.equal(resolveSkydeckCopy([a,b],'clubs-3').chosen,b);});
test('two Jokers copy the same legal reference',()=>{const a={...action('clubs-4'),cardIds:['clubs-4','joker-1','joker-2']};assert.deepEqual(skydeckAttackSummary(a,['clubs-11']),{values:[4,4,4],total:12,enemy:11});});
