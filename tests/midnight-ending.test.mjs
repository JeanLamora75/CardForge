import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {midnightSyndicateEngine as engine} from '../src/games/loot-the-loop/engine.ts';
import {midnightEnding,confirmedMidnightThreat} from '../src/application/midnight-ending.ts';
import {midnightCardArt} from '../src/application/midnight-card-art.ts';
import {IDBFactory} from 'fake-indexeddb';
import {createIndexedDbGameStorage} from '../src/adapters/indexeddb-game-storage.ts';
import {startMidnightSyndicate,resumeMidnightSyndicate,MIDNIGHT_SYNDICATE_SAVE_OPTIONS as options} from '../src/games/loot-the-loop/persistence.ts';
const action={type:'explore',distance:2};
function fixture(id,visible=true){const s=engine.createInitialState({seed:49});const ids=['hearts-2','clubs-3',id];return {...s,deck:[...ids.map((id,i)=>({id,faceUp:i===0||i===2&&visible})),...s.deck.filter(c=>!ids.includes(c.id))]};}
test('all twelve threats have localized endings and persist the exact terminal cause',async()=>{
 const threats=Object.entries(midnightCardArt).filter(([,a])=>a.frame==='burgundy');
 assert.equal(threats.length,12);
 for(const [id,a] of threats){
  const before=fixture(id);const next=engine.transition(before,action).state;
  assert.equal(next.outcome,'loss');assert.equal(next.lossCause,id);assert.equal(confirmedMidnightThreat(before,action,next),id);
  assert.equal(engine.validateState(next).valid,true);
  for(const lang of ['fr','en']){const ending=midnightEnding('loss',next.lossCause,lang);assert.equal(ending.file,a.file);assert.equal(ending.title,a[lang]);assert.ok(ending.text);}
  const factory=new IDBFactory(),storage=createIndexedDbGameStorage({factory,name:'ms-ending'});
  await startMidnightSyndicate(storage,'session',{seed:49});
  await storage.commit({save:{...options,sessionId:'session',state:before}});
  const session=await resumeMidnightSyndicate(storage);await session.dispatch(action);
  assert.equal((await resumeMidnightSyndicate(storage)).getState().lossCause,id);
 }
});
test('hidden arrivals, deadlocks and legacy terminal saves never falsely identify a threat',()=>{
 const hidden=fixture('spades-13',false);const next=engine.transition(hidden,action).state;
 assert.equal(next.outcome,'in-progress');assert.equal(confirmedMidnightThreat(hidden,action,next),null);
 const s=engine.createInitialState({seed:55}),ids=['hearts-11','clubs-13'];
 const before={...s,deck:[...ids.map(id=>({id,faceUp:false})),...s.deck.filter(c=>!ids.includes(c.id))]};
 const dead=engine.transition(before,{type:'look-around'}).state;
 assert.equal(dead.outcome,'loss');assert.equal(dead.lossCause,null);
 const {lossCause,...legacy}=dead;assert.equal(engine.validateState(legacy).valid,true);
 assert.equal(midnightEnding('loss',legacy.lossCause??null,'fr').file,null);
 assert.equal(engine.validateState({...dead,lossCause:'spades-13'}).valid,false);
 assert.equal(engine.validateState({...s,lossCause:null}).valid,false);
 assert.equal(midnightEnding('win',null,'en').file,'joker-exfiltration');
});

test('all 14 terminal scenes have both independent master images in the central manifest',()=>{
 const manifest=JSON.parse(readFileSync('_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json','utf8'));
 const scenes=['victory','dead-end',...Object.values(midnightCardArt).filter(a=>a.frame==='burgundy').map(a=>a.file)];
 assert.equal(new Set(scenes).size,14);
 for(const scene of scenes)for(const orientation of ['portrait','landscape']){
  const path='public/assets/boards/midnight-syndicate/'+scene+'-'+orientation+'.png';
  const entry=manifest.find(e=>e.path===path);assert.ok(entry,path);
  assert.equal(entry.mode,'RGB');assert.equal(entry.width*(orientation==='portrait'?16:9),entry.height*(orientation==='portrait'?9:16));
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),entry.sha256);
 }
});
