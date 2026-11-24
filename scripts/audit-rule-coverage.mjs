import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

const root=process.cwd();
const categories=[
  {label:"Card Capture",file:"_bmad-output/planning-artifacts/game-rules/card-capture.md",pattern:/\bCC-T\d{1,3}\b/g},
  {label:"Loot the Loop",file:"_bmad-output/planning-artifacts/game-rules/loot-the-loop.md",pattern:/\bLTL-T\d{1,3}\b/g},
  {label:"CTD latest",file:"_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md",pattern:/\bCTD-T\d{1,3}\b/g},
  {label:"Gridcannon latest",file:"_bmad-output/planning-artifacts/gridcannon-rule-test-matrix.md",pattern:/\bGC-T\d{1,3}\b/g},
  {label:"CTD initial historical",file:"_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md",pattern:/\bT-\d{2,3}\b/g},
];

function visit(node,fn){
  fn(node);
  ts.forEachChild(node,child=>visit(child,fn));
}
/** Only actual test(...) calls are counted; comments, quoted examples and test.skip are excluded. */
function executableTests(file){
  const source=readFileSync(resolve(root,"tests",file),"utf8");
  const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  const helpers=new Map();
  visit(ast,node=>{
    if(ts.isFunctionDeclaration(node)&&node.name&&node.body)helpers.set(node.name.text,node.body);
    if(ts.isVariableDeclaration(node)&&ts.isIdentifier(node.name)&&node.initializer&&
      (ts.isArrowFunction(node.initializer)||ts.isFunctionExpression(node.initializer)))helpers.set(node.name.text,node.initializer.body);
  });
  function hasAssertions(node,seen=new Set()){
    let found=false;
    visit(node,child=>{
      if(!ts.isCallExpression(child))return;
      const callee=child.expression;
      if(ts.isIdentifier(callee)&&callee.text==="assert")found=true;
      if(ts.isPropertyAccessExpression(callee)&&ts.isIdentifier(callee.expression)&&callee.expression.text==="assert")found=true;
      if(ts.isIdentifier(callee)&&helpers.has(callee.text)&&!seen.has(callee.text)){
        const next=new Set(seen);next.add(callee.text);
        if(hasAssertions(helpers.get(callee.text),next))found=true;
      }
    });
    return found;
  }
  const tests=[];
  visit(ast,node=>{
    if(!ts.isCallExpression(node)||!ts.isIdentifier(node.expression)||node.expression.text!=="test")return;
    const [title,body]=node.arguments;
    if(!title||!(ts.isStringLiteral(title)||ts.isNoSubstitutionTemplateLiteral(title)||ts.isTemplateExpression(title)))return;
    if(!body||!(ts.isArrowFunction(body)||ts.isFunctionExpression(body)))return;
    const label=ts.isTemplateExpression(title)
      ? title.head.text+title.templateSpans.map(span=>"<value>"+span.literal.text).join("")
      : title.text;
    tests.push({file,title:label,hasAssertions:hasAssertions(body.body)});
  });
  return tests;
}
function statedIds(title){
  const found=new Set();
  for(const m of title.matchAll(/\b(CTD-T|GC-T|LTL-T|CC-T)(\d{1,3})((?:\/(?:T)?\d{1,3})*)/g)){
    found.add(m[1]+m[2]);
    for(const extra of m[3].split("/").filter(Boolean))found.add(m[1]+((m[1]==='LTL-T'||m[1]==='CC-T')?extra.replace(/^T/,"").padStart(2,'0'):extra.replace(/^T/,"")));
  }
  for(const m of title.matchAll(/\bT-\d{2,3}\b/g))found.add(m[0]);
  return found;
}
const testFiles=readdirSync(resolve(root,"tests")).filter(file=>file.endsWith(".test.mjs"));
const tests=testFiles.flatMap(executableTests);
const labelledTests=tests.map(test=>({...test,ids:statedIds(test.title)}));
const gaps=categories.map(({label,file,pattern})=>{
  const ids=[...new Set(readFileSync(resolve(root,file),"utf8").match(pattern)??[])].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  const referenced=ids.filter(id=>labelledTests.some(test=>test.ids.has(id)&&test.hasAssertions));
  return {label,total:ids.length,referenced:referenced.length,missing:ids.filter(id=>!referenced.includes(id))};
});
for(const gap of gaps){
  console.log(`[MATRIX] ${gap.label}: ${gap.referenced}/${gap.total} IDs linked to a parsed test with assertions (or asserting helper)`);
  if(gap.missing.length)console.log(`[MATRIX] Missing evidence: ${gap.missing.join(", ")}`);
}
const without=labelledTests.filter(t=>t.ids.size>0&&!t.hasAssertions);
for(const bad of without)console.log(`[MATRIX] Test without assertions: ${bad.file} — ${bad.title}`);
const complete=gaps.every(gap=>gap.missing.length===0)&&without.length===0;
console.log(`[MATRIX] Parsed ${tests.length} real test declarations from ${testFiles.length} files. Title and asserting-code traceability is NOT a proof of scenario semantic fidelity.`);
console.log(complete?"[MATRIX] Guard satisfied; manual behavioral review is still required.":"[MATRIX] COVERAGE GAP: review missing or non-asserting tests.");
if(process.argv.includes("--require-complete")&&!complete)process.exitCode=1;
