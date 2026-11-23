import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root=process.cwd();
const categories=[
  {label:"CTD latest",file:"_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md",pattern:/\bCTD-T\d{1,3}\b/g},
  {label:"Gridcannon latest",file:"_bmad-output/planning-artifacts/gridcannon-rule-test-matrix.md",pattern:/\bGC-T\d{1,3}\b/g},
  {label:"CTD initial historical",file:"_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md",pattern:/\bT-\d{2,3}\b/g},
];
const testFiles=readdirSync(resolve(root,"tests")).filter(file=>file.endsWith(".test.mjs"));
const tests=testFiles.flatMap(file=>{
  const source=readFileSync(resolve(root,"tests",file),"utf8");
  return [...source.matchAll(/(?:^|\n)\s*test\s*\(\s*(['"`])([^\n]*?)\1\s*,/g)]
    .map(match=>({file,title:match[2]}));
});
function statedIds(title) {
  const found = new Set();
  for (const m of title.matchAll(/\b(CTD-T|GC-T)(\d{1,3})((?:\/\d{1,3})*)/g)) {
    found.add(m[1]+m[2]);
    for (const extra of m[3].split("/").filter(Boolean)) found.add(m[1]+extra);
  }
  for (const m of title.matchAll(/\bT-\d{2,3}\b/g)) found.add(m[0]);
  return found;
}
const labelledTests=tests.map(t=>({...t,ids:statedIds(t.title)}));
const results=categories.map(({label,file,pattern})=>{
  const content=readFileSync(resolve(root,file),"utf8");
  const ids=[...new Set(content.match(pattern)??[])].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  const covered=ids.filter(id=>labelledTests.some(test=>test.ids.has(id)));
  return {label,matrix:file,total:ids.length,referencedInExecutableTests:covered.length,covered,
    notDirectlyReferenced:ids.filter(id=>!covered.includes(id))};
});
const complete=results.every(result=>result.notDirectlyReferenced.length===0);
for(const result of results){
  console.log(`[MATRIX] ${result.label}: ${result.referencedInExecutableTests}/${result.total} scenario IDs explicitly present in executable test names`);
  if(result.notDirectlyReferenced.length) console.log(`[MATRIX] Not directly traceable: ${result.notDirectlyReferenced.join(", ")}`);
}
console.log(`[MATRIX] Source tests: ${testFiles.length}; this audit reports name-level traceability, NOT behavioral equivalence or execution evidence by itself.`);
console.log(complete ? "[MATRIX] Explicit IDs traceable; semantic review still required." :
  "[MATRIX] COVERAGE GAP: do not claim complete Mary-matrix coverage without individual scenario review.");
if(process.argv.includes("--require-complete")&&!complete)process.exitCode=1;
