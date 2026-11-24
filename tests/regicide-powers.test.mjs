import test from 'node:test';
import assert from 'node:assert/strict';
import {regicideEngine as engine} from '../src/games/regicide/engine.ts';
import {makeDeckWithJokers,shuffle} from '../src/core/cards.ts';
import {createSeededRandom} from '../src/core/deterministic-deck.ts';
const ids=makeDeckWithJokers().filter(c=>!('kind' in c)).map(c=>c.id);
const physical=s=>[s.activeEnemy,...s.castle,...s.tavern,...s.hand,...s.discard,...s.combat,...s.pending,...s.jokers.map(j=>j.id)].filter(Boolean).sort();
function fixture(enemy,hand,{discard=[],tavern=null,combat=[],shield=0,enemyHealth=20}={}){
  const s=engine.createInitialState({seed:17});
  const castle=ids.filter(id=>Number(id.split('-')[1])>=11&&id!==enemy).sort((a,b)=>Number(a.split('-')[1])-Number(b.split('-')[1]));
  const used=new Set([enemy,...castle,...hand,...discard,...combat]);
  const remaining=ids.filter(id=>!used.has(id));
  const t=tavern??remaining;
  const d=[...discard,...remaining.filter(id=>!t.includes(id))];
  const state={...s,turn:2,activeEnemy:enemy,castle,hand:[...hand],discard:d,tavern:[...t],combat:[...combat],shield,enemyHealth};
  assert.equal(engine.validateState(state).valid,true);
  return state;
}
function apply(s,a){
  const before=structuredClone(s),r=engine.transition(s,a);
  assert.equal(r.accepted,true,r.reason);assert.deepEqual(s,before);
  assert.deepEqual(physical(r.state),physical(s));assert.equal(engine.validateState(r.state).valid,true);
  return r.state;
}
const powers=(s,cardIds)=>apply(apply(s,{type:'play',cardIds}),{type:'resolve-powers'});
const damage=s=>apply(s,{type:'resolve-damage'});
test('REG-T03: hearts recycle only existing discard below tavern in reproducible order',()=>{
  const s=fixture('clubs-11',['hearts-7'],{discard:['hearts-1','hearts-2','hearts-3','hearts-4','hearts-5','hearts-6','hearts-8','hearts-9'],combat:['spades-1']});
  const shuffled=shuffle(s.discard,createSeededRandom((s.seed+0x9e3779b9)>>>0));
  const n=powers(s,['hearts-7']);
  assert.deepEqual(n.tavern,[...s.tavern,...shuffled.slice(0,7)]);
  assert.deepEqual(n.discard,shuffled.slice(7));
  assert.deepEqual(n.combat,s.combat);assert.equal(n.recycleCount,1);
  assert.deepEqual(n,powers(JSON.parse(JSON.stringify(s)),['hearts-7']));
  assert.equal(damage(n).enemyHealth,13);
  const short=fixture('clubs-11',['hearts-7'],{discard:['hearts-1']});
  const a=powers(short,['hearts-7']);assert.deepEqual(a.tavern,[...short.tavern,'hearts-1']);assert.deepEqual(a.discard,[]);
});
test('REG-T04/29: diamonds draw only existing cards up to eight, including short or empty deck',()=>{
  const hand=['diamonds-8','hearts-1','hearts-2','hearts-3','hearts-4','hearts-5'];
  const s=fixture('clubs-11',hand),n=powers(s,['diamonds-8']);
  assert.deepEqual(n.hand,[...hand.slice(1),...s.tavern.slice(0,3)]);
  assert.deepEqual(n.tavern,s.tavern.slice(3));
  const full=fixture('clubs-11',[...hand,'hearts-6','hearts-7']);
  const f=powers(full,['diamonds-8']);assert.equal(f.hand.length,8);assert.deepEqual(f.tavern,full.tavern.slice(1));
  for(const tavern of [[],['spades-1']]){
    const a=fixture('clubs-11',hand,{tavern}),b=powers(a,['diamonds-8']);
    assert.deepEqual(b.hand,[...hand.slice(1),...tavern]);assert.deepEqual(b.tavern,[]);assert.deepEqual(b.discard,a.discard);
  }
});
test('REG-T05/07: clubs double only current damage, immunity preserves base damage',()=>{
  for(const [enemy,expected] of [['hearts-11',4],['clubs-11',12]]){
    const s=fixture(enemy,['clubs-8']);
    const p=powers(s,['clubs-8']);assert.equal(p.enemyHealth,20);
    assert.equal(damage(p).enemyHealth,expected);
  }
});
test('REG-T06: shields accumulate across turns and do not alter enemy base attack',()=>{
  const s=fixture('hearts-11',['spades-8','spades-3','diamonds-2']);
  const first=damage(powers(s,['spades-8']));assert.equal(first.shield,8);assert.equal(first.enemyAttack,10);
  const next=apply(first,{type:'retaliate',cardIds:['diamonds-2']});
  const second=damage(powers(next,['spades-3']));assert.equal(second.shield,11);assert.equal(second.enemyHealth,9);
  assert.deepEqual(engine.getLegalActions(second),[{type:'retaliate',cardIds:[]}]);
});
test('REG-T08: diamond immunity prevents draw but not damage',()=>{
  const s=fixture('diamonds-11',['diamonds-8']),p=powers(s,['diamonds-8']);
  assert.deepEqual(p.hand,[]);assert.deepEqual(p.tavern,s.tavern);assert.equal(damage(p).enemyHealth,12);
});
test('REG-T09: mixed ace and number apply both powers to total nine',()=>{
  const s=fixture('hearts-11',['diamonds-8','clubs-1']);
  const p=powers(s,s.hand);assert.deepEqual(p.hand,s.tavern.slice(0,8));assert.equal(damage(p).enemyHealth,2);
});
test('REG-T10: hearts before diamonds even with empty tavern',()=>{
  const s=fixture('spades-11',['hearts-1','diamonds-1'],{tavern:[]});
  const expected=shuffle(s.discard,createSeededRandom((s.seed+0x9e3779b9)>>>0)).slice(0,2);
  const p=powers(s,s.hand);assert.deepEqual(p.hand,expected);assert.deepEqual(p.tavern,[]);assert.equal(damage(p).enemyHealth,18);
});
test('REG-T30: empty discard cannot produce cards or consume randomness',()=>{
  const s=fixture('clubs-11',['hearts-7']),p=powers(s,s.hand);
  assert.deepEqual(p.tavern,s.tavern);assert.deepEqual(p.discard,[]);assert.equal(p.recycleCount,0);assert.equal(damage(p).enemyHealth,13);
});
test('REG-T31: immunity selectively removes exactly one suit from mixed attack',()=>{
  const hand=['clubs-3','spades-3','diamonds-3'];
  for(const enemy of ['clubs-11','spades-11','diamonds-11','hearts-11']){
    const s=fixture(enemy,hand),p=powers(s,hand);
    assert.equal(p.shield,enemy.startsWith('spades')?0:9);
    assert.equal(p.hand.length,enemy.startsWith('diamonds')?0:8);
    assert.equal(damage(p).enemyHealth,enemy.startsWith('clubs')?11:2);
  }
});
test('same suit power is counted once and resolution cannot repeat',()=>{
  // A physical deck cannot contain two equal-suit equal-rank cards; ace companion can share a suit.
  const s=fixture('hearts-11',['spades-1','spades-8']);
  const p=powers(s,s.hand);assert.equal(p.shield,9);
  const before=structuredClone(p),r=engine.transition(p,{type:'resolve-powers'});
  assert.equal(r.accepted,false);assert.equal(r.state,p);assert.deepEqual(p,before);
});
