import test from 'node:test';
import assert from 'node:assert/strict';
import { games, canPlay } from '../src/catalog.ts';
import { parseCatalogRoute, routeHash, backRoute, HOME } from '../src/application/catalog-route.ts';
import { readCatalogGameProgress, availableGameActions, victoryRate } from '../src/application/catalog-navigation.ts';

test('all five game detail and contextual routes round-trip with unchanged IDs', () => {
  for(const game of games){
    for(const section of ['detail','rules','statistics']){
      const route={page:'game',gameId:game.id,section};
      assert.deepEqual(parseCatalogRoute(routeHash(route)),route);
      assert.deepEqual(backRoute(route),
        section==='detail'?HOME:{page:'game',gameId:game.id,section:'detail'});
    }
  }
  assert.deepEqual(parseCatalogRoute(''),HOME);
  assert.deepEqual(parseCatalogRoute('#settings'),{page:'settings'});
  assert.deepEqual(backRoute({page:'settings'}),HOME);
});
test('unrecognized or malicious hashes return to catalog without interpreting an external URL',()=>{
  for(const hash of ['#game/unknown','#game/gridcannon/launch','#game/../../settings','#play/gridcannon',
    '#game/gridcannon/rules/extra','#https://example.org','#game/regicide/statistics/other']){
    assert.deepEqual(parseCatalogRoute(hash),HOME);
  }
  assert.equal(routeHash(HOME),'');
});
test('read-only navigation never invokes any mutation method, even with an active saved game',async()=>{
  let writes=0;
  const save={gameId:'gridcannon',sessionId:'active-1',rulesVersion:'v2',formatVersion:1,
    state:{outcome:'in-progress'}};
  const storage={
    readGame:async id=>id==='gridcannon'?structuredClone(save):undefined,
    readStatistics:async id=>id==='gridcannon'
      ? {gameId:id,played:5,won:2,lost:2,abandoned:1}:undefined,
    readResult:async()=>undefined,
    commit:()=>{writes++},commitTerminal:()=>{writes++},
    replaceGame:()=>{writes++},migrateGame:()=>{writes++},
  };
  const first=await readCatalogGameProgress(storage,'gridcannon');
  assert.equal(first.indicator,'active');
  assert.equal(first.statistics.played,5);
  assert.equal(victoryRate(first.statistics),'50 %');
  const second=await readCatalogGameProgress(storage,'gridcannon');
  assert.deepEqual(second,first);
  assert.deepEqual(save.state,{outcome:'in-progress'});
  assert.equal(writes,0);
});
test('a stored completed result is not advertised as an active resumable session',async()=>{
  const save={gameId:'clear-the-dungeon',sessionId:'done-1',state:{outcome:'win'}};
  const storage={
    readGame:async()=>save, readStatistics:async()=>undefined,
    readResult:async()=>({id:'x',gameId:'clear-the-dungeon',sessionId:'done-1',outcome:'win'}),
  };
  assert.equal((await readCatalogGameProgress(storage,'clear-the-dungeon')).indicator,'finished');
});
test('storage metadata mismatch is a visible integrity error, never a destructive rewrite',async()=>{
  const storage={
    readGame:async()=>({gameId:'wrong',sessionId:'one',state:{outcome:'in-progress'}}),
    readResult:async()=>undefined,readStatistics:async()=>undefined,
  };
  await assert.rejects(()=>readCatalogGameProgress(storage,'gridcannon'),/Inconsistent/);
});
test('none of the five games can launch, resume or replace a saved game before an actual play route exists',()=>{
  for(const game of games){
    const progress={indicator:'active',statistics:null};
    assert.deepEqual(availableGameActions(game,progress),{play:false,resume:false,newGame:false});
    assert.equal(canPlay(game),false);
  }
  const verified={status:'available',playableRoute:'/play/gridcannon'};
  assert.deepEqual(availableGameActions(verified,{indicator:'active',statistics:null}),
    {play:true,resume:true,newGame:true});
  assert.deepEqual(availableGameActions(verified,{indicator:'none',statistics:null}),
    {play:true,resume:false,newGame:true});
  assert.deepEqual(availableGameActions({status:'available',playableRoute:'//evil.invalid'},
    {indicator:'active',statistics:null}),{play:false,resume:false,newGame:false});
});
test('statistics never divide by zero and exclude abandonments from the win denominator',()=>{
  assert.equal(victoryRate(null),'—');
  assert.equal(victoryRate({gameId:'gridcannon',played:3,won:0,lost:0,abandoned:3}),'—');
  assert.equal(victoryRate({gameId:'gridcannon',played:7,won:3,lost:1,abandoned:3}),'75 %');
});
