import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {skydeckCardArt,skydeckFactions} from '../src/application/skydeck-art.ts';
test('all 54 Skydeck cards resolve to distinct source art and five frames',()=>{
 const ids=[...Object.keys(skydeckFactions).flatMap(s=>Array.from({length:13},(_,i)=>s+'-'+(i+1))), 'joker-1','joker-2'];
 const manifest=JSON.parse(readFileSync('_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json','utf8'));
 const paths=new Set(manifest.map(x=>x.path));
 const art=ids.map(id=>skydeckCardArt(id));
 assert.equal(new Set(art.map(x=>x.image)).size,54);
 assert.equal(new Set(art.map(x=>x.frame)).size,5);
 for(const item of art)for(const p of [item.image,item.frame]){const source='public/'+p.replace(/^art\//,'assets/').replace(/\.webp$/,'.png');assert.ok(paths.has(source),source);assert.ok(existsSync(source),source);}
 assert.equal(skydeckCardArt('hearts-14'),undefined);
});

test('framing covers all cards and preserves artwork identity',()=>{
 for(const suit of Object.keys(skydeckFactions))for(let rank=1;rank<=13;rank++){
  const {framing}=skydeckCardArt(suit+'-'+rank);
  assert.ok(framing.inset>=0&&framing.inset<=5);
  assert.ok(framing.focusX>=0&&framing.focusX<=100&&framing.focusY>=0&&framing.focusY<=100);
  assert.ok(rank>=11?framing.offsetY>0:framing.offsetY===0);
 }
 for(const id of ['diamonds-13','spades-11','joker-1','joker-2'])assert.ok(skydeckCardArt(id).framing.offsetY>=8);
 for(const id of ['hearts-5','hearts-6','hearts-8'])assert.equal(skydeckCardArt(id).framing.inset,5);
});
