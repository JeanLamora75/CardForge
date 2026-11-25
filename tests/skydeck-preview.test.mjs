import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkydeckPreview,describeSkydeckCard} from '../src/games/card-capture/preview.ts';
test('preview controller exposes only detached public view, confirms real actions, rejects invalid input',()=>{
  const session=createSkydeckPreview(42);
  const before=session.inspect();
  assert.deepEqual(Object.keys(session).sort(),['confirm','inspect']);
  const action=before.actions[0];
  assert.deepEqual(session.inspect(),before);
  assert.equal(session.confirm({type:'draw'}),false);
  assert.deepEqual(session.inspect(),before);
  assert.equal(session.confirm(action),true);
  assert.equal(session.inspect().phase,'discard');
  assert.equal(session.confirm(action),false);
  const view=session.inspect();
  view.enemyLine[0]=null;
  assert.notDeepEqual(session.inspect(),view);
});
test('Skydeck presentation translates factions without changing physical card strength',()=>{
  for(const id of ['hearts-1','clubs-13','diamonds-5','spades-11','joker-1','joker-2']){
    const fr=describeSkydeckCard(id,'fr'),en=describeSkydeckCard(id,'en');
    assert.equal(fr.power,en.power);assert.equal(fr.symbol,en.symbol);
    assert.notEqual(fr.faction,en.faction);
  }
  assert.equal(describeSkydeckCard('hearts-1','fr').power,'14');
});
