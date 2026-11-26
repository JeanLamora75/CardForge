import test from "node:test";
import assert from "node:assert/strict";
import { grimAttackProgress } from "../src/application/grim-delve-card-view.ts";
test("Grim Delve attack gauge uses actual power and two-card readiness",()=>{
  assert.deepEqual(grimAttackProgress([],13),{power:0,resistance:13,percent:0,ready:false});
  assert.equal(grimAttackProgress([10],13).ready,false);
  assert.equal(grimAttackProgress([10],13).percent,1000/13);
  assert.equal(grimAttackProgress([10,2],13).ready,false);
  assert.deepEqual(grimAttackProgress([10,3],13),{power:13,resistance:13,percent:100,ready:true});
  assert.deepEqual(grimAttackProgress([10,10],11),{power:20,resistance:11,percent:100,ready:true});
});
