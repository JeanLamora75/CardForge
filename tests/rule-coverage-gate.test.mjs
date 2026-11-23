import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const auditor=resolve("scripts/audit-rule-coverage.mjs");
test("CAR-40: strict Mary matrix gate accepts executable references and fails closed on missing scenarios",()=>{
  const root=mkdtempSync(join(tmpdir(),"cardforge-matrix-"));
  try {
    const planning=join(root,"_bmad-output/planning-artifacts");
    mkdirSync(planning,{recursive:true});
    mkdirSync(join(root,"tests"));
    writeFileSync(join(planning,"clear-the-dungeon-rule-test-matrix.md"),"| CTD-T01 | rule |\n| T-01 | legacy |\n");
    writeFileSync(join(planning,"gridcannon-rule-test-matrix.md"),"| GC-T01 | rule |\n");
    writeFileSync(join(root,"tests","scenario.test.mjs"),"test('CTD-T01 / T-01 / GC-T01',()=>{assert.ok(true)});\n");
    const pass=spawnSync(process.execPath,[auditor,"--require-complete"],{cwd:root,encoding:"utf8"});
    assert.equal(pass.status,0,pass.stderr+pass.stdout);
    writeFileSync(join(planning,"gridcannon-rule-test-matrix.md"),"| GC-T01 | rule |\n| GC-T02 | NEW UNCOVERED |\n");
    const fail=spawnSync(process.execPath,[auditor,"--require-complete"],{cwd:root,encoding:"utf8"});
    assert.equal(fail.status,1,fail.stderr+fail.stdout);
    assert.match(fail.stdout,/GC-T02/);
    assert.match(fail.stdout,/COVERAGE GAP/);
  } finally { rmSync(root,{recursive:true,force:true}); }
});
