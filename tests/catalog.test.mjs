import test from 'node:test';
import assert from 'node:assert/strict';
import { games, canPlay, getGame } from '../src/catalog.ts';

test('five unique gameIds preserve their game-engine and saved-statistics identifiers', () => {
  assert.deepEqual(games.map(g=>g.id),[
    'clear-the-dungeon','gridcannon','card-capture','loot-the-loop','regicide',
  ]);
  assert.equal(new Set(games.map(g=>g.id)).size,5);
});
test('approved public titles supersede work titles and source names',()=>{
  assert.deepEqual(games.map(g=>g.title),[
    'Grim Delve','Thunderfighter','Skydeck','Midnight Syndicate','Les Douze Tyrans',
  ]);
  assert.equal(games.some(g=>/Bastion Stellaire|Grèce antique|Égypte ancienne|Cyberpunk/.test(g.title+' '+g.setting+' '+g.description)),false);
  assert.equal(getGame('gridcannon').originalGame,'Gridcannon Version 2');
  assert.equal(getGame('regicide').originalGame,'Regicide');
  assert.equal(getGame('clear-the-dungeon').originalGame,'Clear the Dungeon');
});
test('three future titles retain approved separate universes and are not playable',()=>{
  const future=games.slice(2);
  assert.deepEqual(future.map(g=>g.status),['coming-soon','coming-soon','coming-soon']);
  assert.match(future[0].setting,/Corsaires du ciel/);
  assert.match(future[1].setting,/1930/);
  assert.match(future[1].setting,/dieselpunk/);
  assert.match(future[2].setting,/Wuxia/);
  assert.match(future[2].setting,/Chanbara/);
  assert.ok(future.every(g=>!canPlay(g)));
});
test('two MVP engines are in development; neither is claimed playable before its UI is delivered',()=>{
  assert.deepEqual(games.slice(0,2).map(g=>g.status),['in-development','in-development']);
  assert.ok(games.every(g=>g.playableRoute===null));
  assert.ok(games.every(g=>!canPlay(g)));
});
test('game entry has a meaningful original attribution, setting, introduction and mechanics',()=>{
  for(const game of games){
    for(const field of ['title','originalGame','authors','setting','description','mechanics']){
      assert.ok(game[field].length>8,`${game.id}: missing ${field}`);
    }
  }
});
test('a play button only becomes legal with both confirmed status and a local route',()=>{
  assert.equal(canPlay({status:'available',playableRoute:null}),false);
  assert.equal(canPlay({status:'in-development',playableRoute:'/play/gridcannon'}),false);
  assert.equal(canPlay({status:'coming-soon',playableRoute:'/play/regicide'}),false);
  assert.equal(canPlay({status:'available',playableRoute:'https://example.com'}),false);
  assert.equal(canPlay({status:'available',playableRoute:'//example.com'}),false);
  assert.equal(canPlay({status:'available',playableRoute:'/play/gridcannon'}),true);
});
