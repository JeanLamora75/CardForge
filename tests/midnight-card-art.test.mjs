import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {makeStandardDeck} from '../src/core/cards.ts';
import {midnightCardArt,visibleMidnightArt} from '../src/application/midnight-card-art.ts';
test('Midnight Syndicate: all physical cards have unique thematic art, correct numeric values and both translations',()=>{
 const deck=makeStandardDeck();
 assert.equal(Object.keys(midnightCardArt).length,53);
 assert.equal(new Set(Object.values(midnightCardArt).map(a=>a.file)).size,53);
 for(const c of deck){
  const a=midnightCardArt[c.id];
  assert.ok(a&&a.fr&&a.en);
  assert.equal(a.frame,c.rank===1?'green':c.rank>=11?'burgundy':'blue');
  if(c.rank>=2&&c.rank<=10)assert.equal(a.value,c.rank);
  assert.equal(visibleMidnightArt({position:0,faceUp:false}),undefined);
  assert.equal(visibleMidnightArt({position:0,faceUp:true,id:c.id}),a);
 }
 assert.equal(midnightCardArt['joker-1'].frame,'neutral');
 const manifest=JSON.parse(readFileSync('_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json','utf8'));
 for(const a of Object.values(midnightCardArt)){
  const path='public/assets/cards/midnight-syndicate/'+a.file+'.png';
  assert.ok(existsSync(path),path);
  assert.ok(manifest.some(e=>e.path===path),path);
 }
});
